const { PrismaClient } = require('@prisma/client');
const testCourse = require('../data/test-course.json');

const prisma = new PrismaClient();

async function main() {
  const existingCourse = await prisma.course.findFirst({
    where: { title: testCourse.course.title },
  });

  const course = existingCourse
    ? await prisma.course.update({
        where: { id: existingCourse.id },
        data: { ...testCourse.course, published: true, sortOrder: 1 },
      })
    : await prisma.course.create({
        data: { ...testCourse.course, published: true, sortOrder: 1 },
      });

  for (const [index, chapter] of testCourse.chapters.entries()) {
    const sortOrder = index + 1;
    const existingChapter = await prisma.courseChapter.findFirst({
      where: { courseId: course.id, sortOrder },
    });
    const data = { ...chapter, sortOrder };

    if (existingChapter) {
      await prisma.courseChapter.update({ where: { id: existingChapter.id }, data });
    } else {
      await prisma.courseChapter.create({ data: { ...data, courseId: course.id } });
    }
  }

  console.log(`測試課程已建立：${course.title}（ID ${course.id}，${testCourse.chapters.length} 堂課）`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
