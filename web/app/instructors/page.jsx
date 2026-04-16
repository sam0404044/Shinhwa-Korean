import Link from 'next/link';
import { instructors } from '../../data/instructors';

export const metadata = { title: '師資介紹 - 神話韓語' };

export default function InstructorsPage() {
  return (
    <main className="page-main">
      <section className="section">
        <div className="container">
          <h1 className="page-title section-title--green">師資介紹</h1>
          <p className="section-desc">真心對待，從老師到學員，都如家人親近。</p>
          <div className="instructor-grid">
            {instructors.map((instructor) => (
              <article key={instructor.id} className="instructor-card">
                <Link href={`/instructor/${instructor.id}`}>
                  <div
                    className="instructor-card__avatar"
                    style={{ backgroundImage: `url('${instructor.image}')` }}
                  />
                  <h3>{instructor.name}（{instructor.nationality}）</h3>
                  <p>{instructor.tagline}</p>
                  <p>{instructor.title}</p>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
