import Link from 'next/link';
import { getCourseById } from '../../data/courses';

export const metadata = { title: '課程播放 - 神話韓語' };

export default function CoursePlayPage() {
  const course = getCourseById(1);

  return (
    <main className="page-main">
      <section className="section course-play">
        <div className="container">
          <p><Link href="/member#my-courses">← 返回我的課程</Link></p>
          <h1 className="page-title">{course.title}</h1>
          <div className="course-play__player">
            <div className="course-play__video-wrap">
              <p className="course-play__placeholder">影片播放器（Mux）需串接</p>
            </div>
            <aside className="course-play__chapters">
              <h3>章節清單</h3>
              <ol>
                {course.chapters.map((chapter) => (
                  <li key={chapter.title}>{chapter.title}</li>
                ))}
              </ol>
            </aside>
          </div>
          <p><Link href="/member/quiz/" className="btn btn-primary">進入單元小考</Link></p>
        </div>
      </section>
    </main>
  );
}
