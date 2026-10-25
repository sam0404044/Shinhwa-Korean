const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const baseUrl = process.env.QUIZ_TEST_BASE_URL || 'http://localhost:3000';
const email = `quiz-test-${randomUUID()}@example.invalid`;
const password = `Test-${randomUUID()}`;

async function post(path, body, cookie) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    body: JSON.stringify(body),
  });
  return { response, data: await response.json() };
}

async function main() {
  try {
    const unauthorized = await post('/api/member/quiz', { action: 'list' });
    assert.equal(unauthorized.response.status, 401);

    const registered = await post('/api/auth/register', {
      email, password, name: 'Quiz Flow Test', phone: '0900000000',
    });
    assert.equal(registered.response.status, 200);

    const login = await post('/api/auth/login', { email, password });
    assert.equal(login.response.status, 200);
    const cookie = login.response.headers.get('set-cookie')?.split(';')[0];
    assert.ok(cookie?.startsWith('shenhua_member_session='));

    const catalog = await post('/api/member/quiz', { action: 'list' }, cookie);
    const chapter = catalog.data.courses.flatMap((course) => course.chapters)
      .find((item) => item.questionCount >= 10);
    assert.ok(chapter, 'a chapter with at least ten questions is required');

    const first = await post('/api/member/quiz', { action: 'start', chapterId: chapter.id }, cookie);
    assert.equal(first.response.status, 200);
    assert.equal(first.data.questions.length, 10);
    assert.equal(new Set(first.data.questions.map((question) => question.id)).size, 10);
    assert.ok(first.data.questions.every((question) => !('correctIndex' in question) && !('explanation' in question)));

    const second = await post('/api/member/quiz', { action: 'start', chapterId: chapter.id }, cookie);
    assert.equal(second.response.status, 200);
    assert.notEqual(second.data.attemptId, first.data.attemptId);
    assert.equal(second.data.questions.length, 10);

    const answers = Array(10).fill(0);
    const submitted = await post('/api/member/quiz', {
      action: 'submit', attemptId: first.data.attemptId, answers,
    }, cookie);
    assert.equal(submitted.response.status, 200);
    assert.equal(submitted.data.total, 10);
    assert.equal(submitted.data.score, submitted.data.results.filter((item) => item.correctIndex === 0).length);

    const repeated = await post('/api/member/quiz', {
      action: 'submit', attemptId: first.data.attemptId, answers,
    }, cookie);
    assert.equal(repeated.response.status, 409);

    const history = await post('/api/member/quiz', { action: 'history' }, cookie);
    assert.equal(history.data.attempts.length, 1);
    assert.equal(history.data.attempts[0].score, submitted.data.score);
    console.log('Quiz flow passed: 10 unique questions, hidden answers, scoring, history, duplicate-submit guard.');
  } finally {
    await prisma.user.deleteMany({ where: { email } });
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
