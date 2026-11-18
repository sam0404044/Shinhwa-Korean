const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { unlink } = require('node:fs/promises');
const path = require('node:path');
require('@next/env').loadEnvConfig(process.cwd());
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
const base = process.env.ADMIN_TEST_BASE_URL || 'http://localhost:3108';
const marker = 'admin-check-' + randomUUID();
const ids = {};
let adminCookie;
let memberCookie;
let uploadUrl;

async function post(resource, body, cookie = adminCookie, expected = 200) {
  const response = await fetch(base + resource, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  assert.equal(response.status, expected, resource + ': ' + JSON.stringify(data));
  return { data, response };
}
async function page(resource, text, expected = 200, cookie) {
  const response = await fetch(base + resource, { redirect: 'manual', headers: cookie ? { Cookie: cookie } : {} });
  assert.equal(response.status, expected, resource);
  const html = await response.text();
  if (text) assert.ok(html.includes(text), resource + ' missing ' + text);
  return html;
}
async function main() {
  try {
    const password = randomUUID();
    const passwordHash = bcrypt.hashSync(password, 4);
    ids.admin = (await prisma.admin.create({ data: { email: marker + '@example.invalid', passwordHash } })).id;
    ids.user = (await prisma.user.create({ data: { email: marker + '@example.invalid', name: marker + '-member', passwordHash } })).id;
    adminCookie = (await post('/api/admin/login', { email: marker + '@example.invalid', password }, null)).response.headers.get('set-cookie').split(';')[0];
    memberCookie = (await post('/api/auth/login', { email: marker + '@example.invalid', password }, null)).response.headers.get('set-cookie').split(';')[0];
    for (const resource of ['courses', 'articles', 'instructors', 'testimonials', 'members']) {
      await post('/api/admin/' + resource, { action: 'list' }, null, 401);
      await post('/api/admin/' + resource, { action: 'list' });
    }
    const anonymousOrders = await fetch(base + '/admin/orders', { redirect: 'manual' });
    const anonymousHtml = await anonymousOrders.text();
    assert.ok(anonymousOrders.status === 307 || anonymousHtml.includes('NEXT_REDIRECT'));
    assert.ok(!anonymousHtml.includes('admin-table'));
    console.log('PASS admin login, session protection, all lists');

    const image = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a7ioAAAAASUVORK5CYII=', 'base64');
    const form = new FormData();
    form.append('file', new Blob([image], { type: 'image/png' }), 'test.png');
    const uploaded = await fetch(base + '/api/admin/uploads', { method: 'POST', headers: { Cookie: adminCookie }, body: form });
    assert.equal(uploaded.status, 200);
    uploadUrl = (await uploaded.json()).url;
    assert.deepEqual(Buffer.from(await (await fetch(base + uploadUrl)).arrayBuffer()), image);
    console.log('PASS image upload and public image response');

    let course = { title: marker + '-course', price: 123, priceOriginal: 456, description: marker + '-description',
      category: 'beginner', sortOrder: 0, published: true, hasTrial: true, imageUrl: uploadUrl,
      chapters: [{ title: marker + '-chapter', durationMinutes: 12, muxPlaybackId: 'verification-only', questions: Array.from({ length: 10 }, (_, i) => ({ prompt: marker + '-question-' + i, options: ['a', 'b', 'c', 'd'], correctIndex: 0, explanation: 'Test explanation' })) }] };
    ids.course = (await post('/api/admin/courses', { action: 'save', course })).data.id;
    course = (await post('/api/admin/courses', { action: 'get', id: ids.course })).data.course;
    ids.chapter = course.chapters[0].id;
    await page('/course/' + ids.course, course.title);
    await page('/courses', course.title);
    await page('/', course.title);
    await page('/course-play?courseId=' + ids.course, course.chapters[0].title, 200, memberCookie);
    const cartCourses = (await post('/api/public/courses', { ids: [ids.course] }, null)).data.courses;
    assert.equal(cartCourses[0].price, course.price);
    assert.equal(cartCourses[0].title, course.title);
    course.price = 321;
    course.title += '-edited';
    await post('/api/admin/courses', { action: 'save', id: ids.course, course });
    await page('/course/' + ids.course, course.title);
    const updatedCart = (await post('/api/public/courses', { ids: [ids.course] }, null)).data.courses;
    assert.equal(updatedCart[0].price, 321);
    assert.equal(updatedCart[0].title, course.title);
    const quiz = (await post('/api/member/quiz', { action: 'start', chapterId: ids.chapter }, memberCookie)).data;
    assert.equal(quiz.questions.length, 10);
    const submitted = (await post('/api/member/quiz', { action: 'submit', attemptId: quiz.attemptId, answers: Array(10).fill(0) }, memberCookie)).data;
    assert.equal(submitted.score, 10);
    console.log('PASS course create/edit, homepage/catalog/detail/player, quiz authoring and grading');

    let instructor = { name: marker + '-instructor', title: 'Teacher', bio: marker + '-bio', avatarUrl: uploadUrl, published: true, sortOrder: 0, courseIds: [ids.course] };
    ids.instructor = (await post('/api/admin/instructors', { action: 'save', instructor })).data.id;
    await page('/instructors', instructor.name);
    await page('/instructor/' + ids.instructor, course.title);
    course.published = false;
    await post('/api/admin/courses', { action: 'save', id: ids.course, course });
    await page('/course/' + ids.course, null, 404);
    assert.equal((await post('/api/public/courses', { ids: [ids.course] }, null)).data.courses.length, 0);
    assert.ok(!(await page('/courses')).includes(course.title));
    assert.ok(!(await page('/instructor/' + ids.instructor)).includes(course.title));
    course.published = true;
    await post('/api/admin/courses', { action: 'save', id: ids.course, course });
    instructor.published = false;
    await post('/api/admin/instructors', { action: 'save', id: ids.instructor, instructor });
    await page('/instructor/' + ids.instructor, null, 404);
    console.log('PASS instructor upload/linking and course/instructor unpublishing');

    await prisma.article.createMany({
      data: Array.from({ length: 11 }, (_, index) => ({
        title: marker + '-pagination-' + index, content: marker + '-searchable-body',
        date: new Date('2026-11-18'), published: false,
      })),
    });
    const firstPage = (await post('/api/admin/articles', { action: 'list', query: marker + '-searchable-body', page: 1 })).data;
    const secondPage = (await post('/api/admin/articles', { action: 'list', query: marker + '-searchable-body', page: 2 })).data;
    assert.equal(firstPage.total, 11);
    assert.equal(firstPage.articles.length, 10);
    assert.equal(secondPage.articles.length, 1);
    assert.equal(new Set([...firstPage.articles, ...secondPage.articles].map((item) => item.id)).size, 11);
    await post('/api/admin/articles', { action: 'delete', id: secondPage.articles[0].id });
    const clamped = (await post('/api/admin/articles', { action: 'list', query: marker + '-searchable-body', page: 2 })).data;
    assert.equal(clamped.page, 1);
    assert.equal(clamped.pageCount, 1);
    console.log('PASS article content search, ten-per-page pagination and last-page deletion');
    let article = { title: marker + '-article', date: '2026-11-18', category: 'Test', excerpt: marker + '-excerpt', content: '<p>' + marker + '-body</p><img src="' + uploadUrl + '"><script>alert(1)</script>', imageUrl: '', published: true };
    ids.article = (await post('/api/admin/articles', { action: 'save', article })).data.id;
    const savedArticle = (await post('/api/admin/articles', { action: 'get', id: ids.article })).data.article;
    assert.ok(!savedArticle.content.includes('<script'));
    const html = await page('/article/' + ids.article, marker + '-body');
    assert.ok(html.includes('property="og:image" content="' + base + uploadUrl));
    await page('/news', article.title);
    await page('/', article.title);
    article.imageUrl = '/assets/images/content/01.webp';
    await post('/api/admin/articles', { action: 'save', id: ids.article, article });
    const custom = await page('/article/' + ids.article);
    assert.ok(custom.includes('property="og:image" content="' + base + article.imageUrl));
    article.published = false;
    await post('/api/admin/articles', { action: 'save', id: ids.article, article });
    await page('/article/' + ids.article, null, 404);
    assert.ok(!(await page('/news')).includes(article.title));
    console.log('PASS article save, HTML sanitization, first-image/custom thumbnail, Open Graph, unpublishing');

    let testimonial = { name: marker + '-testimonial', role: marker + '-role', quote: marker + '-quote', quoteShort: marker + '-short', avatarUrl: uploadUrl, sortOrder: 0, showOnHome: true, courseId: ids.course };
    ids.testimonial = (await post('/api/admin/testimonials', { action: 'save', testimonial })).data.id;
    await page('/testimonials', testimonial.name);
    const recommendationPage = await page('/testimonial/' + ids.testimonial, testimonial.quote);
    assert.ok(recommendationPage.includes('href="/course/' + ids.course + '"'));
    assert.equal((await post('/api/admin/testimonials', { action: 'get', id: ids.testimonial })).data.testimonial.courseId, ids.course);
    await post('/api/admin/testimonials', { action: 'save', id: ids.testimonial, testimonial: { ...testimonial, courseId: 2147483647 } }, adminCookie, 400);
    await page('/', testimonial.quoteShort);
    testimonial.showOnHome = false;
    await post('/api/admin/testimonials', { action: 'save', id: ids.testimonial, testimonial });
    assert.ok(!(await page('/')).includes(testimonial.quoteShort));
    console.log('PASS testimonial create/edit, detail and homepage display switch');

    const anonymousCart = await fetch(base + '/cart', { redirect: 'manual' });
    const cartHtml = await anonymousCart.text();
    assert.ok(anonymousCart.status === 307 || cartHtml.includes('NEXT_REDIRECT'));
    assert.ok((anonymousCart.headers.get('location') || cartHtml).includes('login'));
    await page('/cart', '購物車', 200, memberCookie);
    course.hasTrial = false;
    await post('/api/admin/courses', { action: 'save', id: ids.course, course });
    await page('/course-play?courseId=' + ids.course, '無法觀看此課程', 200, memberCookie);
    const results = await Promise.all([
      post('/api/member/checkout', { courseIds: [ids.course], amount: 1 }, memberCookie),
      post('/api/member/checkout', { courseIds: [ids.course], amount: 1 }, memberCookie),
    ]);
    ids.order = results[0].data.orderIds[0];
    assert.equal(results[1].data.orderIds[0], ids.order);
    assert.equal(await prisma.order.count({ where: { userId: ids.user, courseId: ids.course } }), 1);
    assert.equal((await prisma.order.findUnique({ where: { id: ids.order } })).amount, 321);
    await page('/course-play?courseId=' + ids.course, course.title, 200, memberCookie);
    await page('/course/' + ids.course, '此課程已購買', 200, memberCookie);
    const memberCatalog = (await post('/api/member/courses', {}, memberCookie)).data.courses;
    assert.ok(memberCatalog.some((item) => item.id === ids.course && item.purchased));
    course.published = false;
    await post('/api/admin/courses', { action: 'save', id: ids.course, course });
    const hiddenCatalog = (await post('/api/member/courses', {}, memberCookie)).data.courses;
    assert.ok(hiddenCatalog.some((item) => item.id === ids.course && item.purchased && !item.published));
    course.published = true;
    await post('/api/admin/courses', { action: 'save', id: ids.course, course });
    const owned = (await post('/api/public/courses', { ids: [ids.course] }, memberCookie)).data.courses;
    assert.equal(owned[0].purchased, true);
    const anonymous = (await post('/api/public/courses', { ids: [ids.course] }, null)).data.courses;
    assert.equal(anonymous[0].purchased, false);
    await page('/payment-result?orders=' + ids.order, '測試結帳成功', 200, memberCookie);
    const absentResult = await page('/payment-result', '找不到這次已完成的訂單', 200, memberCookie);
    assert.ok(!absentResult.includes('測試結帳成功'));
    console.log('PASS database-backed cart prices, anonymous redirect, concurrent checkout, server price validation and verified result');
    await page('/admin/orders', marker + '-member', 200, adminCookie);
    const member = (await post('/api/admin/members', { action: 'get', id: ids.user })).data.member;
    assert.ok(member.orders.some(order => order.id === ids.order));
    const dashboardResponse = await fetch(base + '/api/admin/dashboard', { headers: { Cookie: adminCookie } });
    assert.equal(dashboardResponse.status, 200);
    const before = (await dashboardResponse.json()).metrics.watchedMinutes;
    const watch = { chapterId: ids.chapter, sessionId: randomUUID().replaceAll('-', ''), watchedMs: 60000, startedAt: Date.now() - 65000 };
    await post('/api/member/watch-time', watch, memberCookie, 204);
    await post('/api/member/watch-time', watch, memberCookie, 204);
    const after = await fetch(base + '/api/admin/dashboard', { headers: { Cookie: adminCookie } }).then(r => r.json());
    assert.equal(after.metrics.watchedMinutes, before + 1);
    await post('/api/admin/members', { action: 'set-status', id: ids.user, status: 'suspended' });
    await post('/api/member/watch-time', watch, memberCookie, 401);
    await post('/api/auth/login', { email: marker + '@example.invalid', password }, null, 403);
    await post('/api/admin/members', { action: 'set-status', id: ids.user, status: 'active' });
    await post('/api/auth/login', { email: marker + '@example.invalid', password }, null);
    console.log('PASS live orders, member purchases/status, watch record retry deduplication and dashboard totals');

    for (const [resource, id] of [['articles', ids.article], ['testimonials', ids.testimonial]]) {
      await post('/api/admin/' + resource, { action: 'delete', id });
      await post('/api/admin/' + resource, { action: 'get', id }, adminCookie, 404);
    }
    await post('/api/admin/members', { action: 'delete', id: ids.user }, null, 401);
    await post('/api/admin/members', { action: 'delete', id: ids.user });
    await post('/api/admin/members', { action: 'get', id: ids.user }, adminCookie, 404);
    assert.equal(await prisma.order.count({ where: { userId: ids.user } }), 0);
    assert.equal(await prisma.videoWatchSession.count({ where: { userId: ids.user } }), 0);
    await post('/api/auth/login', { email: marker + '@example.invalid', password }, null, 401);
    delete ids.user;
    delete ids.order;
    console.log('PASS purchased course catalog including unpublished purchases, member deletion and dependent records cleanup');
    await post('/api/admin/instructors', { action: 'delete', id: ids.instructor }, null, 401);
    await post('/api/admin/instructors', { action: 'delete', id: ids.instructor });
    assert.equal(await prisma.instructorCourse.count({ where: { instructorId: ids.instructor } }), 0);
    assert.ok(await prisma.course.findUnique({ where: { id: ids.course } }));
    await page('/instructor/' + ids.instructor, null, 404);
    await post('/api/admin/courses', { action: 'delete', id: ids.course });
    await page('/course/' + ids.course, null, 404);
    const mux = await post('/api/admin/mux', { action: 'create-upload', chapterId: 0 }, adminCookie, process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET ? 400 : 503);
    console.log('PASS supported deletion operations; Mux configuration response ' + mux.response.status);
  } finally {
    if (ids.user) await prisma.user.delete({ where: { id: ids.user } });
    if (ids.instructor) await prisma.instructor.deleteMany({ where: { id: ids.instructor } });
    if (ids.article) await prisma.article.deleteMany({ where: { id: ids.article } });
    if (ids.testimonial) await prisma.testimonial.deleteMany({ where: { id: ids.testimonial } });
    if (ids.course) await prisma.course.deleteMany({ where: { id: ids.course } });
    if (ids.admin) await prisma.admin.delete({ where: { id: ids.admin } });
    if (uploadUrl && process.env.UPLOAD_DIR) await unlink(path.join(process.env.UPLOAD_DIR, path.basename(uploadUrl)));
    await prisma.article.deleteMany({ where: { title: { startsWith: marker } } });
    await prisma.$disconnect();
    console.log('Temporary verification records cleaned up');
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
