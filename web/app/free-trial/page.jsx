import Link from 'next/link';
import { courses } from '../../data/courses';

export const metadata = { title: '點我試聽 - 神話韓語' };

export default function FreeTrialPage() {
  const trialCourses = courses.filter((course) => course.hasTrial);

  return (
    <main className="page-main">
      <section className="section section--pastel">
        <div className="container">
          <h1 className="page-title section-title--green">點我試聽</h1>
          <div className="course-grid">
            {trialCourses.map((course) => (
              <article key={course.id} className="course-card">
                <Link href={`/course/${course.id}`} className="course-card__link">
                  <div
                    className="course-card__img"
                    style={{ backgroundImage: `url('${course.image}')` }}
                  />
                  <div className="course-card__body">
                    <h3 className="course-card__title">{course.title}</h3>
                    <span className="course-card__badge">試聽</span>
                    <button type="button" className="btn btn-outline btn--small">試聽</button>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
