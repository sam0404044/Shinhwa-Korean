'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

async function articleRequest(body, signal) {
  const response = await fetch('/api/admin/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || '文章操作失敗。');
  return data;
}

export default function AdminArticlesPage() {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ articles: [], total: 0, page: 1, pageCount: 1 });
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    articleRequest({ action: 'list', query: search, page }, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult(data);
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [search, page, revision]);

  async function deleteArticle(article) {
    if (deletingId !== null) return;
    if (!window.confirm(`確定永久刪除文章「${article.title}」？刪除後會從前台移除，且無法復原。`)) return;
    setDeletingId(article.id);
    setError('');
    try {
      await articleRequest({ action: 'delete', id: article.id });
      setRevision((current) => current + 1);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId(null);
    }
  }

  return <>
    <h1 className="admin-page-title">文章管理</h1>
    <div className="admin-card">
      <div className="admin-actions" style={{ marginTop: 0, marginBottom: 16 }}>
        <Link href="/admin/articles/new/edit" className="admin-btn admin-btn--primary">新增文章</Link>
      </div>
      <form className="admin-form" onSubmit={(event) => {
        event.preventDefault();
        setSearch(query.trim());
        setPage(1);
        setRevision((current) => current + 1);
      }}>
        <div className="form-row">
          <label htmlFor="article-search">搜尋文章</label>
          <input id="article-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="標題、分類、摘要或正文" />
        </div>
        <div className="admin-actions">
          <button type="submit" className="admin-btn admin-btn--secondary" disabled={deletingId !== null}>搜尋</button>
          <button type="button" className="admin-btn admin-btn--secondary" disabled={deletingId !== null} onClick={() => { setQuery(''); setSearch(''); setPage(1); setRevision((current) => current + 1); }}>清除搜尋</button>
        </div>
      </form>
      {error ? <p className="admin-error" role="alert">{error}</p> : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>狀態</th><th>標題</th><th>分類</th><th>日期</th><th>操作</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5}>載入中…</td></tr> : result.articles.map((article) => <tr key={article.id}>
              <td><span className={`admin-badge admin-badge--${article.published ? 'on' : 'off'}`}>{article.published ? '上架' : '下架'}</span></td>
              <td>{article.title}</td><td>{article.category || '—'}</td>
              <td>{article.date ? new Date(article.date).toLocaleDateString('zh-TW') : '—'}</td>
              <td className="admin-row-actions">
                <Link href={`/admin/articles/${article.id}/edit`} className="admin-btn admin-btn--small admin-btn--secondary">編輯</Link>
                <button type="button" className="admin-btn admin-btn--small admin-btn--danger" disabled={deletingId !== null} onClick={() => deleteArticle(article)}>{deletingId === article.id ? '刪除中…' : '刪除'}</button>
              </td>
            </tr>)}
            {!loading && !error && result.articles.length === 0 ? <tr><td colSpan={5}>沒有符合條件的文章。</td></tr> : null}
          </tbody>
        </table>
      </div>
      {!loading && !error ? <nav aria-label="文章分頁" className="admin-actions">
        <span aria-live="polite">共 {result.total} 筆，每頁 10 筆，第 {result.page} / {result.pageCount} 頁</span>
        <button type="button" className="admin-btn admin-btn--small admin-btn--secondary" disabled={result.page <= 1 || deletingId !== null} onClick={() => setPage(result.page - 1)}>上一頁</button>
        <button type="button" className="admin-btn admin-btn--small admin-btn--secondary" disabled={result.page >= result.pageCount || deletingId !== null} onClick={() => setPage(result.page + 1)}>下一頁</button>
      </nav> : null}
    </div>
  </>;
}
