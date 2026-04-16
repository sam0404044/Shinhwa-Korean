import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getInstructorById, instructors } from '../../../data/instructors';

export function generateStaticParams() {
  return instructors.map((instructor) => ({ id: String(instructor.id) }));
}

export async function generateMetadata({ params }) {
  const instructor = getInstructorById(params.id);
  if (!instructor) return { title: '教師介紹 - 神話韓語' };
  return { title: `${instructor.name} - 神話韓語` };
}

export default function InstructorPage({ params }) {
  const instructor = getInstructorById(params.id);
  if (!instructor) notFound();

  return (
    <main className="page-main">
      <section className="section">
        <div className="container container--narrow">
          <p><Link href="/instructors">← 師資列表</Link></p>
          <div className="instructor-detail">
            <div
              className="instructor-detail__avatar"
              style={{ backgroundImage: `url('${instructor.image}')` }}
            />
            <h1 className="page-title">{instructor.name}（{instructor.nationality}）</h1>
            <p className="section-desc">{instructor.tagline}</p>
            <h2>教師背景</h2>
            <ul>
              {instructor.education.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <h2>介紹</h2>
            <p>{instructor.bio}</p>
            <h2>授課課程推薦</h2>
            <p><Link href="/courses">課程列表</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
