import { getArticleThumbnail } from './article-thumbnail';
import { prisma } from './prisma';

const courseImages = ['/assets/images/courses/01.webp', '/assets/images/courses/02.webp', '/assets/images/courses/03.webp', '/assets/images/courses/04.webp'];

export { courseCategories } from './course-categories';

export function presentCourse(course, index = 0) {
  return { ...course, image: course.imageUrl || courseImages[index % courseImages.length] };
}

export async function getPublishedCourses(includeChapters = false) {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    include: includeChapters ? { chapters: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] } } : undefined,
  });
  return courses.map(presentCourse);
}

export async function getPublishedArticles(limit) {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: [{ date: 'desc' }, { id: 'desc' }],
    ...(limit ? { take: limit } : {}),
  });
  return articles.map((article) => ({
    ...article,
    image: getArticleThumbnail(article),
    date: article.date.toISOString().slice(0, 10),
  }));
}

export async function getHomeTestimonials(limit = 3) {
  return prisma.testimonial.findMany({
    where: { showOnHome: true },
    orderBy: [{ sortOrder: 'asc' }, { id: 'desc' }],
    take: limit,
  });
}
