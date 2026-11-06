import Link from 'next/link';
import { prisma } from '../../lib/prisma';

export const dynamic = 'force-dynamic';
export const metadata = { title: '學員見證 - 神話韓語' };

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'desc' }] });
  return <main className="page-main"><section className="section section--pastel"><div className="container"><h1 className="page-title section-title--green">學員見證</h1><div className="testimonial-grid testimonial-grid--page">{testimonials.map((item) => <div key={item.id} className="testimonial-card"><Link href={`/testimonial/${item.id}`} className="testimonial-card__link"><div className="testimonial-card__avatar" style={{ backgroundImage: item.avatarUrl ? `url('${item.avatarUrl}')` : undefined, backgroundColor: item.avatarUrl ? undefined : 'var(--purple)' }}>{!item.avatarUrl && <span className="testimonial-card__initials">{item.name.charAt(0)}</span>}</div><p className="testimonial-card__name">{item.name}</p><p className="testimonial-card__role">{[item.role, item.industry].filter(Boolean).join(' · ')}</p><p className="testimonial-card__quote">{item.quoteShort || item.quote}</p><span className="testimonial-card__more">閱讀全文 →</span></Link></div>)}</div></div></section></main>;
}
