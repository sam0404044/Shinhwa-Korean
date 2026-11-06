'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch('/api/admin/articles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list' }) })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setArticles(data.articles); })
      .catch((requestError) => setError(requestError.message));
  }, []);
  return <><h1 className="admin-page-title">文章管理</h1><p style={{ marginBottom: 20, color: '#666' }}>新增、編輯、上下架、分類與封面，內容會同步寫入資料庫。</p><div className="admin-card"><div className="admin-actions" style={{ marginTop: 0, marginBottom: 16 }}><Link href="/admin/articles/new/edit" className="admin-btn admin-btn--primary">新增文章</Link></div>{error ? <p className="admin-error">{error}</p> : null}<table className="admin-table"><thead><tr><th>狀態</th><th>標題</th><th>分類</th><th>日期</th><th>操作</th></tr></thead><tbody>{articles.map((article) => <tr key={article.id}><td><span className={`admin-badge admin-badge--${article.published ? 'on' : 'off'}`}>{article.published ? '上架' : '下架'}</span></td><td>{article.title}</td><td>{article.category || '—'}</td><td>{formatDate(article.date)}</td><td><Link href={`/admin/articles/${article.id}/edit`} className="admin-btn admin-btn--small admin-btn--secondary">編輯</Link></td></tr>)}</tbody></table>{!articles.length && !error ? <p>尚無文章。</p> : null}</div></>;
}

function formatDate(date) { return date ? new Date(date).toLocaleDateString('zh-TW') : '—'; }
