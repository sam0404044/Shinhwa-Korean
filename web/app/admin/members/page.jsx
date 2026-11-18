'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

async function membersRequest(body) {
  const response = await fetch('/api/admin/members', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || '會員資料讀取失敗。');
  return data;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const loadMembers = useCallback(async (search = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await membersRequest({ action: 'list', query: search });
      setMembers(data.members || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMembers(); }, [loadMembers]);

  async function toggleStatus(member) {
    const status = member.status === 'active' ? 'suspended' : 'active';
    if (busyId !== null) return;
    if (status === 'suspended' && !window.confirm(`確定停權會員「${member.name || member.email}」？停權後將無法登入或觀看課程。`)) return;
    setBusyId(member.id);
    setError('');
    try {
      const data = await membersRequest({ action: 'set-status', id: member.id, status });
      setMembers((items) => items.map((item) => item.id === member.id ? data.member : item));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyId(null);
    }
  }

  async function deleteMember(member) {
    if (busyId !== null) return;
    if (!window.confirm(`確定永久刪除會員「${member.name || member.email}」？此操作會一併刪除該會員的訂單、測驗成績與觀看紀錄，且無法復原。`)) return;
    setBusyId(member.id);
    setError('');
    try {
      await membersRequest({ action: 'delete', id: member.id });
      setMembers((items) => items.filter((item) => item.id !== member.id));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <h1 className="admin-page-title">會員管理</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>註冊會員、搜尋、基本資料檢視、停權／啟用與刪除。</p>
      <div className="admin-card">
        <form className="admin-form" onSubmit={(event) => { event.preventDefault(); loadMembers(query); }}>
          <div className="form-row" style={{ marginBottom: '16px' }}>
            <label htmlFor="member-search">搜尋</label>
            <input id="member-search" type="text" placeholder="Email、姓名..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
        </form>
        {error ? <p className="admin-error" role="alert">{error}</p> : null}
        <table className="admin-table">
          <thead><tr><th>ID</th><th>姓名</th><th>Email</th><th>狀態</th><th>操作</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="5">讀取中...</td></tr> : null}
            {!loading && members.length === 0 ? <tr><td colSpan="5">尚無符合條件的會員。</td></tr> : null}
            {!loading && members.map((member) => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>{member.name || '未填寫'}</td>
                <td>{member.email}</td>
                <td><span className={`admin-badge admin-badge--${member.status === 'active' ? 'on' : 'off'}`}>{member.status === 'active' ? '啟用' : '停權'}</span></td>
                <td className="admin-row-actions">
                  <Link href={`/admin/members/${member.id}`} className="admin-btn admin-btn--small admin-btn--secondary">檢視</Link>
                  <button type="button" className="admin-btn admin-btn--small admin-btn--secondary" disabled={busyId !== null} onClick={() => toggleStatus(member)}>{member.status === 'active' ? '停權' : '啟用'}</button>
                  <button type="button" className="admin-btn admin-btn--small admin-btn--danger" disabled={busyId !== null} onClick={() => deleteMember(member)}>{busyId === member.id ? '處理中…' : '刪除'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
