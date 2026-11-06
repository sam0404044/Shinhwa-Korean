'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const emptyArticle = { title: '', excerpt: '', date: '', category: '', content: '', imageUrl: '', published: true };

export default function AdminArticleEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === 'new';
  const [article, setArticle] = useState(emptyArticle);
  const [loading, setLoading] = useState(!isNew);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const update = (key, value) => setArticle((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    if (isNew) { update('date', new Date().toISOString().slice(0, 10)); setLoading(false); return; }
    fetch('/api/admin/articles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get', id }) })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setArticle({ ...data.article, date: data.article.date?.slice(0, 10) || '' }); })
      .catch((requestError) => setError(requestError.message)).finally(() => setLoading(false));
  }, [id, isNew]);

  async function upload(file) {
    const form = new FormData(); form.append('file', file);
    const response = await fetch('/api/admin/uploads', { method: 'POST', body: form });
    const data = await response.json(); if (!response.ok) throw new Error(data.error); return data.url;
  }
  async function save(event) {
    event.preventDefault(); setError(''); setNotice('');
    const response = await fetch('/api/admin/articles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'save', id: isNew ? null : Number(id), article }) });
    const data = await response.json(); if (!response.ok) { setError(data.error || '儲存失敗。'); return; }
    setNotice('文章已儲存。'); if (isNew) router.replace(`/admin/articles/${data.id}/edit`);
  }
  if (loading) return <p>載入中…</p>;
  return <><h1 className="admin-page-title">{isNew ? '新增文章' : '編輯文章'}</h1><div className="admin-card"><form className="admin-form" onSubmit={save}><div className="form-row"><label>標題</label><input value={article.title} onChange={(event) => update('title', event.target.value)} required /></div><div className="form-row"><label>摘要</label><textarea rows={2} value={article.excerpt || ''} onChange={(event) => update('excerpt', event.target.value)} /></div><div className="form-row"><label>日期</label><input type="date" value={article.date || ''} onChange={(event) => update('date', event.target.value)} required /></div><div className="form-row"><label>分類</label><input value={article.category || ''} onChange={(event) => update('category', event.target.value)} placeholder="學習筆記、公告..." /></div><div className="form-row"><label>封面圖片</label><input type="file" accept="image/jpeg,image/png,image/webp" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; try { setNotice('圖片上傳中…'); update('imageUrl', await upload(file)); setNotice('圖片已上傳，儲存文章後會套用。'); } catch (uploadError) { setError(uploadError.message); } }} />{article.imageUrl ? <img src={article.imageUrl} alt="文章封面預覽" style={{ display: 'block', width: 180, height: 100, marginTop: 8, objectFit: 'cover' }} /> : null}</div><div className="form-row"><label>內容（HTML）</label><textarea rows={12} value={article.content || ''} onChange={(event) => update('content', event.target.value)} style={{ fontFamily: 'monospace' }} /></div><div className="form-row"><label><input type="checkbox" checked={article.published} onChange={(event) => update('published', event.target.checked)} /> 前台上架</label></div>{error ? <p className="admin-error">{error}</p> : null}{notice ? <p className="admin-notice">{notice}</p> : null}<div className="admin-actions"><button className="admin-btn admin-btn--primary">儲存</button><Link href="/admin/articles" className="admin-btn admin-btn--secondary">返回列表</Link></div></form></div></>;
}
