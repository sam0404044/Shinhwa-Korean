'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list' }),
        cache: 'no-store',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || '無法載入課程。');
      setCourses(result.courses);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCourses(); }, [loadCourses]);

  async function deleteCourse(course) {
    setDeleting(true);
    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: course.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || '刪除失敗。');
      setPendingDelete(null);
      await loadCourses();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">課程管理</h1>
        <Link href="/admin/courses/manage" className="admin-btn admin-btn--primary">新增課程</Link>
      </div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      {pendingDelete && (
        <div className="admin-delete-confirm" role="alertdialog" aria-labelledby="admin-delete-title" aria-describedby="admin-delete-description">
          <h2 id="admin-delete-title">刪除課程？</h2>
          <p id="admin-delete-description">「{pendingDelete.title}」及其所有章節與題目都會刪除，無法復原。</p>
          <div className="admin-delete-confirm__actions">
            <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setPendingDelete(null)} disabled={deleting}>取消</button>
            <button type="button" className="admin-btn admin-btn--danger" onClick={() => deleteCourse(pendingDelete)} disabled={deleting}>{deleting ? '刪除中…' : '確認刪除'}</button>
          </div>
        </div>
      )}
      <div className="admin-card admin-table-wrap">
        {loading ? <p>載入中…</p> : courses.length ? (
          <table className="admin-table">
            <thead>
              <tr><th>排序</th><th>課程名稱</th><th>價格</th><th>分類</th><th>章節／題目</th><th>狀態</th><th>操作</th></tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.sortOrder}</td>
                  <td>{course.title}</td>
                  <td>NT$ {course.price.toLocaleString()}</td>
                  <td>{course.category}</td>
                  <td>{course.chapterCount}／{course.questionCount}</td>
                  <td><span className={`admin-badge admin-badge--${course.published ? 'on' : 'off'}`}>{course.published ? '上架' : '下架'}</span></td>
                  <td className="admin-row-actions">
                    <Link href={`/admin/courses/manage?id=${course.id}`} className="admin-btn admin-btn--small admin-btn--secondary">編輯</Link>
                    <button type="button" className="admin-btn admin-btn--small admin-btn--danger" onClick={() => setPendingDelete(course)}>刪除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>尚無課程。</p>}
      </div>
    </>
  );
}
