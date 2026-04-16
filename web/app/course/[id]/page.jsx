import Link from 'next/link';
import { notFound } from 'next/navigation';
import { courses, getCourseById } from '../../../data/courses';

export function generateStaticParams() {
  return courses.map((course) => ({ id: String(course.id) }));
}

export async function generateMetadata({ params }) {
  const course = getCourseById(params.id);
  if (!course) return { title: '課程詳情 - 神話韓語' };
  return { title: `${course.title} - 神話韓語` };
}

export default function CourseDetailPage({ params }) {
  const course = getCourseById(params.id);
  if (!course) notFound();

  return (
    <main className="page-main">
      <section className="section course-detail">
        <div className="container">
          <div className="course-detail__wrap">
            <div className="course-detail__main">
              <div
                className="course-detail__cover"
                style={{ backgroundImage: `url('${course.image}')` }}
              />
              <h1 className="page-title">{course.title}</h1>
              <p className="course-detail__price">
                {course.priceOriginal ? (
                  <span className="course-detail__price--old">NT$ {course.priceOriginal.toLocaleString()}</span>
                ) : null}
                {' '}NT$ {course.price.toLocaleString()}
              </p>
              <p className="course-detail__desc">{course.description}</p>
            </div>
            <aside className="course-detail__aside">
              <div className="course-detail__card">
                <p className="course-detail__price">NT$ {course.price.toLocaleString()}</p>
                <Link href="/plans" className="btn btn-primary btn--block">馬上購買</Link>
                <button type="button" className="btn btn-outline btn--block">加入購物車</button>
                {course.hasTrial && <Link href="/free-trial" className="btn btn-hero--outline btn--block">試看課程</Link>}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
