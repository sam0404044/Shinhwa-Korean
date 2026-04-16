import Link from 'next/link';
import { testimonials } from '../../data/testimonials';

export const metadata = { title: '수강생들의 리얼 후기 - 神話韓語' };

export default function TestimonialsPage() {
  return (
    <main className="page-main">
      <section className="section section--pastel">
        <div className="container">
          <h1 className="page-title section-title--green">수강생들의 리얼 후기</h1>
          <div className="testimonial-grid">
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-card">
                <Link href={`/testimonial/${t.id}`} className="testimonial-card__link">
                  <div
                    className="testimonial-card__avatar"
                    style={{
                      backgroundImage: t.avatar ? `url('${t.avatar}')` : undefined,
                      backgroundColor: t.avatar ? undefined : 'var(--purple)',
                    }}
                  >
                    {!t.avatar && <span className="testimonial-card__initials">{t.name.charAt(0)}</span>}
                  </div>
                  <p className="testimonial-card__name">{t.name}</p>
                  <p className="testimonial-card__role">{t.role} · {t.industry}</p>
                  <p className="testimonial-card__quote">{t.quoteShort}</p>
                  <span className="testimonial-card__more">閱讀全文 →</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
