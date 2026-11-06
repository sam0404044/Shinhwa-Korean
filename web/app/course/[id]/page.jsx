import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from '../../../components/AddToCartButton';
import { prisma } from '../../../lib/prisma';
import { presentCourse } from '../../../lib/public-content';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const course = await prisma.course.findUnique({ where: { id: Number(params.id) }, select: { title: true } });
  return { title: course ? `${course.title} - 神話韓語` : '課程詳情 - 神話韓語' };
}

export default async function CourseDetailPage({ params }) {
  const rawCourse = await prisma.course.findFirst({ where: { id: Number(params.id), published: true }, include: { chapters: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] } } });
  if (!rawCourse) notFound();
  const course = presentCourse(rawCourse);
  return <main className="page-main"><section className="section course-detail"><div className="container"><div className="course-detail__wrap"><div className="course-detail__main">
    <div className="course-detail__cover" style={{ backgroundImage: `url('${course.image}')` }} />
    <h1 className="page-title">{course.title}</h1><p className="course-detail__price">{course.priceOriginal ? <span className="course-detail__price--old">NT$ {course.priceOriginal.toLocaleString()}</span> : null} NT$ {course.price.toLocaleString()}</p><p className="course-detail__desc">{course.description}</p>
    {course.chapters.length ? <div className="course-detail__block"><h2>課程章節</h2><ol className="course-detail__chapters">{course.chapters.map((chapter, index) => <li key={chapter.id} className="course-detail__chapter"><span className="course-detail__chapter-number">{String(index + 1).padStart(2, '0')}</span><div><h3>{chapter.title}</h3><p>{chapter.description}</p></div><span className="course-detail__chapter-duration">{chapter.durationMinutes || 0} 分鐘</span></li>)}</ol></div> : null}
  </div><aside className="course-detail__aside"><div className="course-detail__card"><p className="course-detail__price">NT$ {course.price.toLocaleString()}</p><Link href={`/checkout?course=${course.id}`} className="btn btn-primary btn--block">馬上購買</Link><AddToCartButton course={course} className="btn btn-outline btn--block" />{course.hasTrial ? <Link href="/free-trial" className="btn btn-hero--outline btn--block">試看課程</Link> : null}</div></aside></div></div></section></main>;
}
