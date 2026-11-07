import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMember } from '../../lib/member-session';
import { prisma } from '../../lib/prisma';

export const metadata = { title: '課程播放 - 神話韓語' };

function positiveId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export default async function CoursePlayPage({ searchParams }) {
  const courseId = positiveId(searchParams?.courseId);
  if (!courseId) redirect('/member');

  const member = await getMember({ cookies: cookies() });
  if (!member) redirect(`/login?next=${encodeURIComponent(`/course-play?courseId=${courseId}`)}`);

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      published: true,
      OR: [{ hasTrial: true }, { orders: { some: { userId: member.id, status: 'paid' } } }],
    },
    include: { chapters: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] } },
  });

  if (!course) {
    return (
      <main className="page-main"><section className="section course-play"><div className="container">
        <h1 className="page-title">無法觀看此課程</h1>
        <p>請先購買課程，或由會員中心進入已開放的試聽內容。</p>
        <Link href="/member" className="btn btn-primary">返回會員中心</Link>
      </div></section></main>
    );
  }

  const chapterId = positiveId(searchParams?.chapterId);
  const selectedChapter = course.chapters.find((chapter) => chapter.id === chapterId) || course.chapters[0];

  return (
    <main className="page-main"><section className="section course-play"><div className="container">
      <p><Link href="/member#my-courses">← 返回我的課程</Link></p>
      <h1 className="page-title">{course.title}</h1>
      <div className="course-play__player">
        <div className="course-play__video-wrap">
          {selectedChapter?.muxPlaybackId ? (
            <iframe
              title={`${course.title}：${selectedChapter.title}`}
              src={`https://player.mux.com/${encodeURIComponent(selectedChapter.muxPlaybackId)}`}
              allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : <p className="course-play__placeholder">本章節影片尚未上架。</p>}
        </div>
        <aside className="course-play__chapters"><h3>章節清單</h3><ol>
          {course.chapters.map((chapter) => (
            <li key={chapter.id} className={chapter.id === selectedChapter?.id ? 'is-active' : ''}>
              <Link href={`/course-play?courseId=${course.id}&chapterId=${chapter.id}`}>{chapter.title}</Link>
            </li>
          ))}
        </ol></aside>
      </div>
      <p><Link href="/member/quiz/" className="btn btn-primary">進入單元小考</Link></p>
    </div></section></main>
  );
}
