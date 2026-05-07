'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const nav = [
  { href: '/admin', label: '儀表板' },
  { href: '/admin/courses', label: '課程管理' },
  { href: '/admin/plans', label: '方案管理' },
  { href: '/admin/orders', label: '訂單／交易' },
  { href: '/admin/members', label: '會員管理' },
  { href: '/admin/articles', label: '文章管理' },
  { href: '/admin/instructors', label: '師資管理' },
  { href: '/admin/testimonials', label: '學員見證' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  if (isLogin) {
    return (
      <div className="admin-login-wrap">
        {children}
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__title">神話韓語 後台</div>
        <ul className="admin-sidebar__nav">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                data-active={pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div style={{ padding: '12px 20px 0', borderTop: '1px solid #333', marginTop: '12px' }}>
          <Link href="/" style={{ color: '#b0b3b8', fontSize: '0.85rem' }}>返回前台</Link>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.localStorage.removeItem('admin_token');
                window.location.href = '/';
              }
            }}
            style={{ display: 'block', marginTop: '8px', background: 'none', border: 'none', color: '#b0b3b8', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}
          >
            登出（回到首頁）
          </button>
        </div>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
