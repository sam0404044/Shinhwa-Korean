const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { randomBytes } = require('node:crypto');

const prisma = new PrismaClient();

async function main() {
  const hash = (pw) => bcrypt.hashSync(pw, 10);

  const adminPassword = process.env.ADMIN_SEED_PASSWORD || randomBytes(18).toString('base64url');
  const existingAdmin = await prisma.admin.findUnique({ where: { email: 'admin@shenhua.com' } });
  await prisma.admin.upsert({
    where: { email: 'admin@shenhua.com' },
    update: {},
    create: {
      email: 'admin@shenhua.com',
      passwordHash: hash(adminPassword),
      role: 'admin',
    },
  });
  if (!existingAdmin) console.log(`後台管理員首次登入密碼：${adminPassword}`);

  // 會員
  await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      passwordHash: hash('password1'),
      name: '王小明',
      status: 'active',
    },
  });
  await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      passwordHash: hash('password2'),
      name: '李小花',
      status: 'active',
    },
  });

  // 課程
  await prisma.course.createMany({
    data: [
      { title: '課程範例 1', price: 1500, priceOriginal: 2000, description: '入門發音與基礎會話', category: 'beginner', published: true, sortOrder: 1, hasTrial: true },
      { title: '課程範例 2', price: 1800, description: '文法與閱讀', category: 'grammar', published: true, sortOrder: 2, hasTrial: false },
    ],
    skipDuplicates: false,
  });
  const courses = await prisma.course.findMany();

  // 章節（可之後綁 Mux）
  await prisma.courseChapter.createMany({
    data: courses.map((c) => ({ courseId: c.id, title: '第 1 章', sortOrder: 1 })),
    skipDuplicates: false,
  });

  // 師資
  await prisma.instructor.createMany({
    data: [
      { name: '金老師', title: '資深韓語講師', bio: '韓國留學多年，專長發音與會話', published: true, sortOrder: 1 },
      { name: '朴老師', title: 'TOPIK 專任', bio: '檢定與文法教學', published: true, sortOrder: 2 },
    ],
    skipDuplicates: false,
  });
  const instructors = await prisma.instructor.findMany();
  await prisma.instructorCourse.createMany({
    data: [
      { instructorId: instructors[0].id, courseId: courses[0].id },
      { instructorId: instructors[0].id, courseId: courses[1].id },
      { instructorId: instructors[1].id, courseId: courses[1].id },
    ],
    skipDuplicates: true,
  });

  // 文章
  await prisma.article.createMany({
    data: [
      { title: '韓文發音入門：母音與子音一次搞懂', excerpt: '從零開始認識韓文基本母音與子音，打好發音基礎。', category: '學習筆記', date: new Date('2025-01-15'), published: true, content: '<p>韓文是表音文字...</p>' },
      { title: '追星必學：韓劇、KPOP 常用句型', excerpt: '看韓劇、聽歌時常出現的句子。', category: '生活韓語', date: new Date('2025-01-10'), published: true, content: '<p>常見句型...</p>' },
      { title: 'TOPIK 初級準備：題型與讀書計畫', excerpt: '想考韓檢 TOPIK I？', category: '檢定攻略', date: new Date('2025-01-05'), published: true, content: '<p>TOPIK I 為初級...</p>' },
    ],
    skipDuplicates: false,
  });

  // 學員見證
  await prisma.testimonial.createMany({
    data: [
      { name: '陳雅婷', role: '上班族', industry: '科技業', quote: '以前只看韓劇，完全聽不懂。在神話韓語從發音開始學，現在可以聽懂簡單對話！', quoteShort: '從發音開始學，現在可以聽懂簡單對話，追劇更有成就感！', avatarUrl: '/assets/images/testimonials/avatar-01.png', courseRecommend: '入門發音', courseId: courses[0]?.id, showOnHome: true, sortOrder: 1 },
      { name: '王大明', role: '大學生', industry: '外文系', quote: '為了去韓國交換開始學韓文。神話的課程結構清楚，TOPIK 初級考過了！', quoteShort: '課程結構清楚，有講義也有測驗，TOPIK 初級考過了！', avatarUrl: '/assets/images/testimonials/avatar-02.png', courseRecommend: '檢定準備', courseId: courses[1]?.id, showOnHome: true, sortOrder: 2 },
      { name: '李曉芳', role: '自由工作者', industry: '設計', quote: '上了會話課之後，敢在見面會上說簡單的韓文了。', quoteShort: '上了會話課之後，敢在見面會上說簡單的韓文了。', avatarUrl: '/assets/images/testimonials/avatar-03.png', courseRecommend: '會話入門', showOnHome: true, sortOrder: 3 },
    ],
    skipDuplicates: false,
  });

  console.log('Seed 完成');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
