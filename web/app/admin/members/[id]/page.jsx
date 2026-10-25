import Link from 'next/link';
import { getMemberById } from '../../../../data/members';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const m = getMemberById(params.id);
  return { title: m ? `${m.name} - 會員檢視 - 神話韓語後台` : '會員 - 神話韓語後台' };
}

export default function AdminMemberViewPage({ params }) {
  const member = getMemberById(params.id);
  if (!member) notFound();

  return (
    <>
      <h1 className="admin-page-title">會員檢視</h1>
      <div className="admin-card">
        <table className="admin-table">
          <tbody>
            <tr><th style={{ width: '120px' }}>ID</th><td>{member.id}</td></tr>
            <tr><th>姓名</th><td>{member.name}</td></tr>
            <tr><th>Email</th><td>{member.email}</td></tr>
            <tr><th>狀態</th><td><span className={`admin-badge admin-badge--${member.status === 'active' ? 'on' : 'off'}`}>{member.status === 'active' ? '啟用' : '停權'}</span></td></tr>
            <tr><th>註冊日</th><td>{member.createdAt}</td></tr>
          </tbody>
        </table>
        <div className="admin-actions">
          <Link href="/admin/members" className="admin-btn admin-btn--secondary">返回列表</Link>
        </div>
      </div>
    </>
  );
}
