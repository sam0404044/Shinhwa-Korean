import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) { const item = await prisma.testimonial.findUnique({ where: { id: Number(params.id) } }); return { title: item ? `${item.name} 學員見證 - 神話韓語` : '學員見證 - 神話韓語' }; }
export default async function TestimonialPage({ params }) {
  const item = await prisma.testimonial.findUnique({ where: { id: Number(params.id) } });
  if (!item) notFound();
  return <main className="page-main"><section className="section section--pastel"><div className="container container--narrow"><article className="testimonial-detail"><div className="testimonial-detail__avatar" style={{ backgroundImage: item.avatarUrl ? `url('${item.avatarUrl}')` : undefined, backgroundColor: item.avatarUrl ? undefined : 'var(--purple)' }}>{!item.avatarUrl && <span className="testimonial-detail__initials">{item.name.charAt(0)}</span>}</div><h1 className="testimonial-detail__name">{item.name}</h1><p className="testimonial-detail__role">{[item.role, item.industry].filter(Boolean).join(' · ')}</p><div className="testimonial-detail__quote"><p>{item.quote}</p></div>{item.courseRecommend ? <p className="testimonial-detail__course">推薦課程：<Link href="/courses" className="btn btn-outline btn--small">{item.courseRecommend}</Link></p> : null}<p><Link href="/testimonials">← 返回學員見證</Link></p></article></div></section></main>;
}
