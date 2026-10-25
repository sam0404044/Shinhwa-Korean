import { randomInt } from 'node:crypto';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getMember } from '../../../../lib/member-session';

const QUESTION_COUNT = 10;
const json = (body, status = 200) => NextResponse.json(body, {
  status,
  headers: { 'Cache-Control': 'no-store' },
});

function positiveId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function sampleTen(questions) {
  const selected = [];
  for (const [index, question] of questions.entries()) {
    if (index < QUESTION_COUNT) selected.push(question);
    else {
      const replacement = randomInt(index + 1);
      if (replacement < QUESTION_COUNT) selected[replacement] = question;
    }
  }
  for (let index = selected.length - 1; index > 0; index--) {
    const other = randomInt(index + 1);
    [selected[index], selected[other]] = [selected[other], selected[index]];
  }
  return selected;
}

async function canStudy(course, memberId) {
  if (course.hasTrial && course.published) return true;
  const purchase = await prisma.order.findFirst({
    where: { userId: memberId, courseId: course.id, status: 'paid' },
    select: { id: true },
  });
  return Boolean(purchase);
}

export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: '來源不符。' }, 403);
  const member = await getMember(request);
  if (!member) return json({ error: '請先登入會員。' }, 401);

  try {
    const body = await request.json();
    if (body.action === 'list') {
      const courses = await prisma.course.findMany({
        where: {
          OR: [
            { hasTrial: true, published: true },
            { orders: { some: { userId: member.id, status: 'paid' } } },
          ],
        },
        select: {
          id: true,
          title: true,
          chapters: {
            orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
            select: { id: true, title: true, _count: { select: { questions: true } } },
          },
        },
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      });
      return json({ courses: courses.map((course) => ({
        id: course.id,
        title: course.title,
        chapters: course.chapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          questionCount: chapter._count.questions,
        })),
      })) });
    }

    if (body.action === 'start') {
      const chapterId = positiveId(body.chapterId);
      if (!chapterId) return json({ error: '章節 ID 無效。' }, 400);
      const chapter = await prisma.courseChapter.findUnique({
        where: { id: chapterId },
        include: { course: { select: { id: true, title: true, hasTrial: true, published: true } } },
      });
      if (!chapter) return json({ error: '找不到章節。' }, 404);
      if (!(await canStudy(chapter.course, member.id))) return json({ error: '請先購買課程。' }, 403);

      const bank = await prisma.quizQuestion.findMany({
        where: { chapterId },
        select: { id: true, prompt: true, options: true, correctIndex: true, explanation: true },
        orderBy: { id: 'asc' },
      });
      if (bank.length < QUESTION_COUNT) return json({ error: '本章節題庫未滿 10 題，暫時無法開始小考。' }, 409);
      const chosen = sampleTen(bank);
      const attempt = await prisma.quizAttempt.create({
        data: { userId: member.id, chapterId, questions: chosen },
      });
      return json({
        attemptId: attempt.id,
        chapterId,
        courseTitle: chapter.course.title,
        chapterTitle: chapter.title,
        questions: chosen.map(({ id, prompt, options }) => ({ id, prompt, options })),
      });
    }

    if (body.action === 'submit') {
      const attemptId = positiveId(body.attemptId);
      const answers = body.answers;
      if (!attemptId || !Array.isArray(answers) || answers.length !== QUESTION_COUNT ||
        answers.some((answer) => !Number.isInteger(answer) || answer < 0 || answer > 3)) {
        return json({ error: '請完成全部 10 題後送出。' }, 400);
      }
      const attempt = await prisma.quizAttempt.findUnique({ where: { id: attemptId } });
      if (!attempt || attempt.userId !== member.id) return json({ error: '找不到作答紀錄。' }, 404);
      if (attempt.submittedAt) return json({ error: '這次小考已經交卷。' }, 409);
      const questions = attempt.questions;
      if (!Array.isArray(questions) || questions.length !== QUESTION_COUNT) {
        return json({ error: '小考資料不完整。' }, 500);
      }
      const score = questions.reduce((total, question, index) => total + Number(question.correctIndex === answers[index]), 0);
      const submitted = await prisma.quizAttempt.updateMany({
        where: { id: attemptId, userId: member.id, submittedAt: null },
        data: { answers, score, submittedAt: new Date() },
      });
      if (!submitted.count) return json({ error: '這次小考已經交卷。' }, 409);
      return json({
        score,
        total: QUESTION_COUNT,
        results: questions.map((question, index) => ({
          prompt: question.prompt,
          options: question.options,
          answer: answers[index],
          correctIndex: question.correctIndex,
          explanation: question.explanation,
        })),
      });
    }

    if (body.action === 'history') {
      const attempts = await prisma.quizAttempt.findMany({
        where: { userId: member.id, submittedAt: { not: null } },
        select: {
          id: true,
          score: true,
          submittedAt: true,
          chapter: { select: { title: true, course: { select: { title: true } } } },
        },
        orderBy: { submittedAt: 'desc' },
        take: 10,
      });
      return json({ attempts: attempts.map((attempt) => ({
        id: attempt.id,
        score: attempt.score,
        submittedAt: attempt.submittedAt,
        courseTitle: attempt.chapter.course.title,
        chapterTitle: attempt.chapter.title,
      })) });
    }
    return json({ error: '不支援的操作。' }, 400);
  } catch (error) {
    console.error(error);
    return json({ error: '小考服務暫時無法使用。' }, 500);
  }
}
