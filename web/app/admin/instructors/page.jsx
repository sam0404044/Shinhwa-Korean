'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { fetch('/api/admin/instructors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ action: 'list' }) }).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setInstructors(data.instructors); }).catch((requestError) => setError(requestError.message)); }, []);
  async function deleteRecord(record) {
    if (deletingId !== null) return;
    if (!window.confirm(`確定永久刪除師資「${record.name}」？刪除後會移除師資介紹與授課關聯，且無法復原。`)) return;
    setDeletingId(record.id);
    setError('');
    try {
      const response = await fetch('/api/admin/instructors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: record.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '刪除失敗。');
      setInstructors((current) => current.filter((recordItem) => recordItem.id !== record.id));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId(null);
    }
  }

  return <><h1 className="admin-page-title">師資管理</h1><p style={{ marginBottom: '20px', color: '#666' }}>新增／編輯／上下架、頭像、簡介、授課課程綁定、排序。</p><div className="admin-card"><div className="admin-actions" style={{ marginTop: 0, marginBottom: '16px' }}><Link href="/admin/instructors/new/edit" className="admin-btn admin-btn--primary">新增師資</Link></div>{error ? <p className="admin-error">{error}</p> : null}<table className="admin-table"><thead><tr><th>照片</th><th>排序</th><th>姓名</th><th>職稱</th><th>狀態</th><th>操作</th></tr></thead><tbody>{instructors.map((instructor) => <tr key={instructor.id}><td>{instructor.avatarUrl ? <img src={instructor.avatarUrl} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} /> : '—'}</td><td>{instructor.sortOrder}</td><td>{instructor.name}</td><td>{instructor.title}</td><td><span className={`admin-badge admin-badge--${instructor.published ? 'on' : 'off'}`}>{instructor.published ? '上架' : '下架'}</span></td><td><Link href={`/admin/instructors/${instructor.id}/edit`} className="admin-btn admin-btn--small admin-btn--secondary">編輯</Link><button type="button" className="admin-btn admin-btn--small admin-btn--danger" disabled={deletingId !== null} onClick={() => deleteRecord(instructor)}>{deletingId === instructor.id ? '刪除中…' : '刪除'}</button></td></tr>)}</tbody></table></div></>;
}
