'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const formatDate = (value) => value ? new Date(value).toLocaleDateString('zh-TW') : '未填寫';
const statusLabel = (status) => ({ paid: '已付款', pending: '待付款', failed: '付款失敗', refunded: '已退款' }[status] || status);

export default function AdminMemberViewPage({ params }) {
  const [member, setMember] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ action: 'get', id: Number(params.id) }),
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '會員資料讀取失敗。');
      setMember(data.member);
    }).catch((requestError) => setError(requestError.message));
  }, [params.id]);

  return (
    <>
      <h1 className="admin-page-title">會員檢視</h1>
      <div className="admin-card">
        {error ? <p className="admin-error" role="alert">{error}</p> : null}
        {!member && !error ? <p>讀取中...</p> : null}
        {member ? (
          <>
            <table className="admin-table"><tbody>
              <tr><th style={{ width: '120px' }}>ID</th><td>{member.id}</td></tr>
              <tr><th>姓名</th><td>{member.name || '未填寫'}</td></tr>
              <tr><th>Email</th><td>{member.email}</td></tr>
              <tr><th>電話</th><td>{member.phone || '未填寫'}</td></tr>
              <tr><th>生日</th><td>{formatDate(member.birthday)}</td></tr>
              <tr><th>狀態</th><td><span className={`admin-badge admin-badge--${member.status === 'active' ? 'on' : 'off'}`}>{member.status === 'active' ? '啟用' : '停權'}</span></td></tr>
              <tr><th>註冊日</th><td>{formatDate(member.createdAt)}</td></tr>
            </tbody></table>
            <h2 className="admin-section-title">已購買課程</h2>
            {member.orders.length ? (
              <table className="admin-table"><thead><tr><th>課程</th><th>金額</th><th>訂單狀態</th><th>付款日</th></tr></thead><tbody>
                {member.orders.map((order) => <tr key={order.id}><td>{order.title}</td><td>NT$ {order.amount.toLocaleString()}</td><td>{statusLabel(order.status)}</td><td>{formatDate(order.paidAt)}</td></tr>)}
              </tbody></table>
            ) : <p>此會員尚無課程訂單。</p>}
          </>
        ) : null}
        <div className="admin-actions"><Link href="/admin/members" className="admin-btn admin-btn--secondary">返回列表</Link></div>
      </div>
    </>
  );
}
