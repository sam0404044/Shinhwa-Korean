import Link from 'next/link';
import { prisma } from '../../lib/prisma';

export const dynamic = 'force-dynamic';
export const metadata = { title: '師資介紹 - 神話韓語' };

export default async function InstructorsPage() {
  const instructors = await prisma.instructor.findMany({ where: { published: true }, orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  return <main className="page-main"><section className="section"><div className="container"><h1 className="page-title section-title--green">師資介紹</h1><p className="section-desc">真心對待，從老師到學員，都如家人親近。</p><div className="instructor-grid">{instructors.map((instructor) => <article key={instructor.id} className="instructor-card"><Link href={`/instructor/${instructor.id}`}><div className="instructor-card__avatar" style={{ backgroundImage: instructor.avatarUrl ? `url(${instructor.avatarUrl})` : undefined }} /><h3>{instructor.name}</h3><p>{instructor.title}</p></Link></article>)}</div></div></section></main>;
}
