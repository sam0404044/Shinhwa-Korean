import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getAdmin } from '../../../../lib/admin-session';

const categories = new Set(['pronunciation', 'beginner', 'intermediate', 'advanced', 'topics']);
const json = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

function integer(value, minimum = 0) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= minimum ? number : null;
}

function validateCourse(input) {
  if (!input || typeof input !== 'object') throw new Error('課程資料格式錯誤。');
  const title = String(input.title || '').trim();
  const price = integer(input.price);
  const priceOriginal = input.priceOriginal === '' || input.priceOriginal == null ? null : integer(input.priceOriginal);
  const sortOrder = integer(input.sortOrder);
  if (!title || title.length > 191) throw new Error('請填寫課程標題（最多 191 字）。');
  if (price === null || (input.priceOriginal !== '' && input.priceOriginal != null && priceOriginal === null)) throw new Error('請輸入有效價格。');
  if (!categories.has(input.category)) throw new Error('請選擇有效分類。');
  if (sortOrder === null) throw new Error('請輸入有效排序。');
  if (!Array.isArray(input.chapters) || input.chapters.length > 100) throw new Error('章節數量不正確。');

  const seenChapterIds = new Set();
  const chapters = input.chapters.map((chapter, chapterIndex) => {
    const chapterId = chapter.id == null ? null : integer(chapter.id, 1);
    if (chapter.id != null && chapterId === null) throw new Error('章節 ID 無效。');
    if (chapterId && seenChapterIds.has(chapterId)) throw new Error('章節重複。');
    if (chapterId) seenChapterIds.add(chapterId);
    const chapterTitle = String(chapter.title || '').trim();
    const durationMinutes = chapter.durationMinutes === '' || chapter.durationMinutes == null ? null : integer(chapter.durationMinutes);
    if (!chapterTitle || chapterTitle.length > 191) throw new Error(`請填寫第 ${chapterIndex + 1} 堂課的名稱。`);
    if (chapter.durationMinutes !== '' && chapter.durationMinutes != null && durationMinutes === null) throw new Error('課程時間須為非負整數。');
    if (!Array.isArray(chapter.questions)) throw new Error(`「${chapterTitle}」題庫格式不正確。`);

    const seenQuestionIds = new Set();
    const questions = chapter.questions.map((question, questionIndex) => {
      const questionId = question.id == null ? null : integer(question.id, 1);
      if (question.id != null && questionId === null) throw new Error('題目 ID 無效。');
      if (questionId && seenQuestionIds.has(questionId)) throw new Error('題目重複。');
      if (questionId) seenQuestionIds.add(questionId);
      const prompt = String(question.prompt || '').trim();
      const options = Array.isArray(question.options) ? question.options.map((option) => String(option || '').trim()) : [];
      const correctIndex = integer(question.correctIndex);
      if (!prompt || options.length !== 4 || options.some((option) => !option)) throw new Error(`「${chapterTitle}」第 ${questionIndex + 1} 題需要題幹和四個選項。`);
      if (correctIndex === null || correctIndex > 3) throw new Error('請選擇正確答案。');
      return { id: questionId, prompt, options, correctIndex, explanation: String(question.explanation || '').trim() || null, sortOrder: questionIndex + 1 };
    });

    return {
      id: chapterId,
      title: chapterTitle,
      description: String(chapter.description || '').trim() || null,
      durationMinutes,
      muxPlaybackId: String(chapter.muxPlaybackId || '').trim() || null,
      sortOrder: chapterIndex + 1,
      questions,
    };
  });

  return {
    course: {
      title,
      description: String(input.description || '').trim() || null,
      price,
      priceOriginal,
      category: input.category,
      sortOrder,
      published: input.published === true,
      hasTrial: input.hasTrial === true,
    },
    chapters,
  };
}

async function saveCourse(id, input) {
  const { course: courseData, chapters } = validateCourse(input);
  return prisma.$transaction(async (tx) => {
    const existing = id ? await tx.course.findUnique({
      where: { id },
      include: { chapters: { include: { questions: true } } },
    }) : null;
    if (id && !existing) throw new Error('找不到課程。');
    const course = existing
      ? await tx.course.update({ where: { id }, data: courseData })
      : await tx.course.create({ data: courseData });

    const existingChapters = new Map(existing?.chapters.map((chapter) => [chapter.id, chapter]) || []);
    const retainedChapterIds = [];
    for (const chapter of chapters) {
      if (chapter.id && !existingChapters.has(chapter.id)) throw new Error('章節不屬於此課程。');
      const { id: chapterId, questions, ...chapterData } = chapter;
      const savedChapter = chapterId
        ? await tx.courseChapter.update({ where: { id: chapterId }, data: chapterData })
        : await tx.courseChapter.create({ data: { ...chapterData, courseId: course.id } });
      retainedChapterIds.push(savedChapter.id);

      const existingQuestions = new Set(existingChapters.get(chapterId)?.questions.map((question) => question.id) || []);
      const retainedQuestionIds = [];
      for (const question of questions) {
        if (question.id && !existingQuestions.has(question.id)) throw new Error('題目不屬於此章節。');
        const { id: questionId, ...questionData } = question;
        const savedQuestion = questionId
          ? await tx.quizQuestion.update({ where: { id: questionId }, data: questionData })
          : await tx.quizQuestion.create({ data: { ...questionData, chapterId: savedChapter.id } });
        retainedQuestionIds.push(savedQuestion.id);
      }
      await tx.quizQuestion.deleteMany({
        where: { chapterId: savedChapter.id, id: { notIn: retainedQuestionIds } },
      });
    }
    await tx.courseChapter.deleteMany({
      where: { courseId: course.id, id: { notIn: retainedChapterIds } },
    });
    return course;
  });
}

export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: '來源不符。' }, 403);
  const admin = await getAdmin(request);
  if (!admin) return json({ error: '請先登入後台。' }, 401);

  try {
    const body = await request.json();
    if (body.action === 'list') {
      const courses = await prisma.course.findMany({
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        include: { chapters: { select: { _count: { select: { questions: true } } } } },
      });
      return json({ courses: courses.map(({ chapters, ...course }) => ({
        ...course,
        chapterCount: chapters.length,
        questionCount: chapters.reduce((total, chapter) => total + chapter._count.questions, 0),
      })) });
    }

    const id = integer(body.id, 1);
    if (body.action === 'get') {
      if (!id) return json({ error: '課程 ID 無效。' }, 400);
      const course = await prisma.course.findUnique({
        where: { id },
        include: { chapters: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }], include: { questions: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] } } } },
      });
      return course ? json({ course }) : json({ error: '找不到課程。' }, 404);
    }
    if (body.action === 'save') {
      if (body.id != null && !id) return json({ error: '課程 ID 無效。' }, 400);
      const course = await saveCourse(id, body.course);
      return json({ ok: true, id: course.id });
    }
    if (body.action === 'delete') {
      if (!id) return json({ error: '課程 ID 無效。' }, 400);
      await prisma.course.delete({ where: { id } });
      return json({ ok: true });
    }
    return json({ error: '不支援的操作。' }, 400);
  } catch (error) {
    if (error.code === 'P2025') return json({ error: '找不到課程。' }, 404);
    if (error.message && !error.code && !error.clientVersion) return json({ error: error.message }, 400);
    console.error(error);
    return json({ error: '資料庫操作失敗。' }, 500);
  }
}
