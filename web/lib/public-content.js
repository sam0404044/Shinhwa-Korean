import { prisma } from './prisma';

const courseImages = ['/assets/images/courses/01.webp', '/assets/images/courses/02.webp', '/assets/images/courses/03.webp', '/assets/images/courses/04.webp'];

export const courseCategories = [
  { value: 'pronunciation', label: '發音＋基本對話', shortLabel: '發音＋基本對話' },
  { value: 'beginner', label: '初級', shortLabel: '初級' },
  { value: 'intermediate', label: '中級', shortLabel: '中級' },
  { value: 'advanced', label: '高級', shortLabel: '高級' },
  { value: 'topics', label: '主題課程', shortLabel: '主題課程' },
];

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
    image: article.imageUrl || '/assets/images/content/01.webp',
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
