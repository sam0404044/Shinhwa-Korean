'use client';

import Link from 'next/link';
import ArticleEditor from '../../../../../components/admin/ArticleEditor';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const emptyArticle = { title: '', excerpt: '', date: '', category: '', content: '', imageUrl: '', published: true };

export default function AdminArticleEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === 'new';
  const [article, setArticle] = useState(emptyArticle);
  const [loading, setLoading] = useState(!isNew);
  const [showSource, setShowSource] = useState(false);
  const [bodyUploading, setBodyUploading] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const uploading = bodyUploading || thumbnailUploading;
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
  async function uploadThumbnail(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setThumbnailUploading(true);
    setError('');
    setNotice('縮圖上傳中…');
    try {
      update('imageUrl', await upload(file));
      setNotice('縮圖已上傳，儲存後會套用。');
    } catch (uploadError) {
      setNotice('');
      setError(uploadError.message || '縮圖上傳失敗。');
    } finally {
      setThumbnailUploading(false);
    }
  }

  async function save(event) {
    event.preventDefault();
    if (uploading) return;
    setError(''); setNotice('');
    const response = await fetch('/api/admin/articles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'save', id: isNew ? null : Number(id), article }) });
    const data = await response.json(); if (!response.ok) { setError(data.error || '儲存失敗。'); return; }
    setNotice('文章已儲存。'); if (isNew) router.replace(`/admin/articles/${data.id}/edit`);
  }
  if (loading) return <p>載入中…</p>;
  return <><h1 className="admin-page-title">{isNew ? '新增文章' : '編輯文章'}</h1><div className="admin-card"><form className="admin-form" onSubmit={save}><div className="form-row"><label>標題</label><input value={article.title} onChange={(event) => update('title', event.target.value)} required /></div><div className="form-row"><label>摘要</label><textarea rows={2} value={article.excerpt || ''} onChange={(event) => update('excerpt', event.target.value)} /></div><div className="form-row"><label>日期</label><input type="date" value={article.date || ''} onChange={(event) => update('date', event.target.value)} required /></div><div className="form-row"><label>分類</label><input value={article.category || ''} onChange={(event) => update('category', event.target.value)} placeholder="學習筆記、公告..." /></div><div className="form-row"><label htmlFor="article-thumbnail">文章與連結共用縮圖</label>
      <input id="article-thumbnail" type="file" accept="image/jpeg,image/png,image/webp" disabled={thumbnailUploading} aria-describedby="article-thumbnail-help" onChange={uploadThumbnail} />
      <small id="article-thumbnail-help">未指定縮圖時，會使用正文的第一張圖片。</small>
      {article.imageUrl ? <>
        <img src={article.imageUrl} alt="自訂縮圖預覽" style={{ display: 'block', width: 180, height: 100, marginTop: 8, objectFit: 'cover' }} />
        <button type="button" className="admin-btn admin-btn--secondary" disabled={thumbnailUploading} onClick={() => update('imageUrl', '')}>改用正文首圖</button>
      </> : null}</div><div className="form-row"><label id="article-body-label">文章正文</label><button type="button" className="admin-btn admin-btn--secondary" disabled={bodyUploading} onClick={() => setShowSource((current) => !current)}>{showSource ? '切回視覺編輯' : '編輯 HTML'}</button>{showSource ? <textarea aria-labelledby="article-body-label" rows={12} value={article.content || ''} onChange={(event) => update('content', event.target.value)} /> : <ArticleEditor key={id} content={article.content || ''} onChange={(content) => update('content', content)} upload={upload} onError={setError} onUploading={setBodyUploading} />}</div><div className="form-row"><label><input type="checkbox" checked={article.published} onChange={(event) => update('published', event.target.checked)} /> 前台上架</label></div>{error ? <p className="admin-error">{error}</p> : null}{notice ? <p className="admin-notice">{notice}</p> : null}<div className="admin-actions"><button className="admin-btn admin-btn--primary" disabled={uploading}>儲存</button><Link href="/admin/articles" className="admin-btn admin-btn--secondary">返回列表</Link></div></form></div></>;
}
