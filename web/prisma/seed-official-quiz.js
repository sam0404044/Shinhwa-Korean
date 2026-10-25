const { PrismaClient } = require('@prisma/client');
const courseData = require('../data/test-course.json');
const quiz = require('../data/official-quiz-unit-1.json');

const prisma = new PrismaClient();

async function main() {
  if (quiz.courseName !== courseData.course.title || quiz.unitName !== courseData.chapters[0].title) {
    throw new Error('正式題庫與課程資料名稱不一致');
  }

  const result = await prisma.$transaction(async (tx) => {
    const existingCourse = await tx.course.findFirst({ where: { title: quiz.courseName } });
    const course = existingCourse
      ? await tx.course.update({ where: { id: existingCourse.id }, data: { description: courseData.course.description } })
      : await tx.course.create({ data: { ...courseData.course, published: true, sortOrder: 1 } });

    const firstChapter = await tx.courseChapter.findFirst({ where: { courseId: course.id, sortOrder: 1 } });
    const chapter = firstChapter
      ? await tx.courseChapter.update({ where: { id: firstChapter.id }, data: { ...courseData.chapters[0], sortOrder: 1 } })
      : await tx.courseChapter.create({ data: { ...courseData.chapters[0], courseId: course.id, sortOrder: 1 } });

    await tx.quizQuestion.deleteMany({
      where: { chapterId: chapter.id, sourceId: null, prompt: '哪個字母是韓文的基本母音 ㅏ？' },
    });

    for (const [index, question] of quiz.questions.entries()) {
      const { sourceId, ...content } = question;
      await tx.quizQuestion.upsert({
        where: { sourceId },
        update: { ...content, chapterId: chapter.id, sortOrder: index + 1 },
        create: { ...content, sourceId, chapterId: chapter.id, sortOrder: index + 1 },
      });
    }

    await tx.courseChapter.deleteMany({
      where: {
        courseId: course.id,
        title: { in: [
          '第 2 課｜基本子音與拼讀',
          '第 3 課｜收音與常見發音規則',
          '第 4 課｜打招呼與自我介紹',
          '第 5 課｜生活中的簡單問答',
        ] },
      },
    });
    return { courseId: course.id, chapterId: chapter.id };
  });

  console.log(`正式題庫已匯入：課程 ${result.courseId}，單元 ${result.chapterId}，${quiz.questions.length} 題`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
