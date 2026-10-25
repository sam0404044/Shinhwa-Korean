'use client';

import Link from 'next/link';
import { members } from '../../../data/members';

export default function AdminMembersPage() {
  return <AdminMembersContent members={members} />;
}

function AdminMembersContent({ members }) {

  return (
    <>
      <h1 className="admin-page-title">會員管理</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>會員列表、搜尋、基本資料檢視、停權／啟用。</p>
      <div className="admin-card">
        <div className="admin-form">
          <div className="form-row" style={{ marginBottom: '16px' }}>
            <label>搜尋（示範）</label>
            <input type="text" placeholder="Email、姓名..." readOnly />
          </div>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>姓名</th>
              <th>Email</th>
              <th>狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td><span className={`admin-badge admin-badge--${m.status === 'active' ? 'on' : 'off'}`}>{m.status === 'active' ? '啟用' : '停權'}</span></td>
                <td>
                  <Link href={`/admin/members/${m.id}`} className="admin-btn admin-btn--small admin-btn--secondary">檢視</Link>
                  <button type="button" className="admin-btn admin-btn--small admin-btn--secondary" style={{ marginLeft: '4px' }} onClick={() => alert('停權/啟用需串接 API')}>停權/啟用</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
