'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch('/api/admin/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list' }) })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setTestimonials(data.testimonials); })
      .catch((requestError) => setError(requestError.message));
  }, []);
  async function deleteRecord(record) {
    if (deletingId !== null) return;
    if (!window.confirm(`確定永久刪除學員見證「${record.name}」？刪除後會從首頁與學員見證頁移除，且無法復原。`)) return;
    setDeletingId(record.id);
    setError('');
    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: record.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '刪除失敗。');
      setTestimonials((current) => current.filter((recordItem) => recordItem.id !== record.id));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId(null);
    }
  }

  return <><h1 className="admin-page-title">學員見證管理</h1><p style={{ marginBottom: 20, color: '#666' }}>新增、編輯頭像與首頁摘要，資料會同步寫入資料庫。</p><div className="admin-card"><div className="admin-actions" style={{ marginTop: 0, marginBottom: 16 }}><Link href="/admin/testimonials/new/edit" className="admin-btn admin-btn--primary">新增見證</Link></div>{error ? <p className="admin-error">{error}</p> : null}<table className="admin-table"><thead><tr><th>首頁</th><th>姓名</th><th>身份</th><th>摘要</th><th>操作</th></tr></thead><tbody>{testimonials.map((item) => <tr key={item.id}><td><span className={`admin-badge admin-badge--${item.showOnHome ? 'on' : 'off'}`}>{item.showOnHome ? '顯示' : '不顯示'}</span></td><td>{item.name}</td><td>{[item.role, item.industry].filter(Boolean).join(' · ') || '—'}</td><td>{item.quoteShort?.slice(0, 50) || item.quote?.slice(0, 50) || '—'}</td><td><Link href={`/admin/testimonials/${item.id}/edit`} className="admin-btn admin-btn--small admin-btn--secondary">編輯</Link><button type="button" className="admin-btn admin-btn--small admin-btn--danger" disabled={deletingId !== null} onClick={() => deleteRecord(item)}>{deletingId === item.id ? '刪除中…' : '刪除'}</button></td></tr>)}</tbody></table>{!testimonials.length && !error ? <p>尚無學員見證。</p> : null}</div></>;
}
