import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) { const instructor = await prisma.instructor.findUnique({ where: { id: Number(params.id) }, select: { name: true } }); return { title: instructor ? `${instructor.name} - 神話韓語` : '師資介紹 - 神話韓語' }; }

export default async function InstructorPage({ params }) {
  const instructor = await prisma.instructor.findFirst({ where: { id: Number(params.id), published: true }, include: { courses: { include: { course: true } } } });
  if (!instructor) notFound();
  return <main className="page-main"><section className="section"><div className="container container--narrow"><p><Link href="/instructors">返回師資列表</Link></p><div className="instructor-detail"><div className="instructor-detail__avatar" style={{ backgroundImage: instructor.avatarUrl ? `url(${instructor.avatarUrl})` : undefined }} /><h1 className="page-title">{instructor.name}</h1><p className="section-desc">{instructor.title}</p><h2>介紹</h2><p>{instructor.bio}</p><h2>相關課程</h2>{instructor.courses.length ? <ul>{instructor.courses.map((item) => <li key={item.courseId}><Link href={`/course/${item.courseId}`}>{item.course.title}</Link></li>)}</ul> : <p>目前尚未設定授課課程。</p>}</div></div></section></main>;
}
