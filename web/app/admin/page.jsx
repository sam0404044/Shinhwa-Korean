import Link from 'next/link';
import { articles } from '../../data/articles';
import { testimonials } from '../../data/testimonials';
import {
  AdminCard,
  AdminPageShell,
  AdminPrimaryLink,
} from '../../components/admin/AdminScaffold';

export const metadata = { title: '儀表板 - 神話韓語後台' };

export default function AdminDashboardPage() {
  const featuredCourses = [
    { id: 1, title: '零基礎韓語入門' },
    { id: 2, title: '初級韓語（上）' },
  ];
  const showTestimonials = testimonials.slice(0, 3);
  const showArticles = articles.slice(0, 3);

  return (
    <AdminPageShell
      title="儀表板"
      description="這裡集中整理首頁顯示內容與常用後台入口，之後新增任何後台頁面都沿用同一套版型。"
    >
      <AdminCard
        title="精選課程設定"
        description="快速查看目前首頁顯示的精選課程，並前往課程管理調整。"
        actions={<AdminPrimaryLink href="/admin/courses">前往課程管理</AdminPrimaryLink>}
      >
        <table className="admin-table">
          <thead>
            <tr>
              <th>排序</th>
              <th>課程名稱</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {featuredCourses.map((course, index) => (
              <tr key={course.id}>
                <td>{index + 1}</td>
                <td>{course.title}</td>
                <td>
                  <Link href="/admin/courses" className="admin-btn admin-btn--small admin-btn--secondary">
                    編輯設定
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>

      <AdminCard
        title="學員見證摘要"
        description="快速查看首頁目前顯示的見證內容。"
        actions={<AdminPrimaryLink href="/admin/testimonials">前往學員見證管理</AdminPrimaryLink>}
      >
        <table className="admin-table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>摘要</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {showTestimonials.map((testimonial) => (
              <tr key={testimonial.id}>
                <td>{testimonial.name}</td>
                <td>{testimonial.quoteShort?.slice(0, 40)}...</td>
                <td>
                  <Link
                    href={`/admin/testimonials/${testimonial.id}/edit`}
                    className="admin-btn admin-btn--small admin-btn--secondary"
                  >
                    編輯
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>

      <AdminCard
        title="最新文章摘要"
        description="快速查看首頁目前引用的文章內容。"
        actions={<AdminPrimaryLink href="/admin/articles">前往文章管理</AdminPrimaryLink>}
      >
        <table className="admin-table">
          <thead>
            <tr>
              <th>標題</th>
              <th>日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {showArticles.map((article) => (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td>{article.date}</td>
                <td>
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="admin-btn admin-btn--small admin-btn--secondary"
                  >
                    編輯
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </AdminPageShell>
  );
}
