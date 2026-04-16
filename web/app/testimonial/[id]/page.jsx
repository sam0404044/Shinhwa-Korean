import Link from 'next/link';
import { getTestimonialById, testimonials } from '../../../data/testimonials';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return testimonials.map((testimonial) => ({ id: String(testimonial.id) }));
}

export async function generateMetadata({ params }) {
  const t = getTestimonialById(params.id);
  if (!t) return { title: '學員見證 - 神話韓語' };
  return { title: `${t.name} 學員見證 - 神話韓語` };
}

export default function TestimonialPage({ params }) {
  const t = getTestimonialById(params.id);
  if (!t) notFound();

  return (
    <main className="page-main">
      <section className="section section--pastel">
        <div className="container container--narrow">
          <article className="testimonial-detail">
            <div
              className="testimonial-detail__avatar"
              style={{
                backgroundImage: t.avatar ? `url('${t.avatar}')` : undefined,
                backgroundColor: t.avatar ? undefined : 'var(--purple)',
              }}
            >
              {!t.avatar && <span className="testimonial-detail__initials">{t.name.charAt(0)}</span>}
            </div>
            <h1 className="testimonial-detail__name">{t.name}</h1>
            <p className="testimonial-detail__role">{t.role} · {t.industry}</p>
            <div className="testimonial-detail__quote">
              <p>{t.quote}</p>
            </div>
            {t.courseRecommend && (
              <p className="testimonial-detail__course">
                推薦課程：
                <Link href="/courses" className="btn btn-outline btn--small">
                  {t.courseRecommend}
                </Link>
              </p>
            )}
            <p><Link href="/testimonials">← 返回學員見證</Link></p>
          </article>
        </div>
      </section>
    </main>
  );
}
