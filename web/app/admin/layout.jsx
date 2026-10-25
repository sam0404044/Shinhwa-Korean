'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminRouteLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname?.replace(/\/$/, '') === '/admin/login';
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (isLoginPage) return;
    let active = true;
    fetch('/api/admin/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'check' }),
      cache: 'no-store',
    }).then((response) => {
      if (!active) return;
      if (response.ok) setAuthorized(true);
      else router.replace('/admin/login');
    }).catch(() => {
      if (active) router.replace('/admin/login');
    });
    return () => { active = false; };
  }, [isLoginPage, router]);

  return isLoginPage || authorized ? <>{children}</> : null;
}
