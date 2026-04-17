'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

function RequiredStar() {
  return <span className="required-star" aria-label="必填">*</span>;
}

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const account = (form.querySelector('[name="email"]') || form.querySelector('[name="account"]'))?.value?.trim?.() ?? '';
    const password = (form.querySelector('[name="password"]')?.value ?? '').trim();

    if (account === 'AAA' && password === '123') {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('admin_token', '1');
      }
      router.push('/admin');
      return;
    }

    form.submit();
  };

  return (
    <form className="auth-form" action="#" method="post" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="login-email">Email <RequiredStar /></label>
        <input id="login-email" type="text" name="email" required placeholder="請輸入 Email" autoComplete="username" />
      </div>
      <div className="form-group">
        <label htmlFor="login-password">密碼 <RequiredStar /></label>
        <input id="login-password" type="password" name="password" required placeholder="請輸入密碼" />
      </div>
      <button type="submit" className="btn btn-primary btn--block">登入</button>
      <p className="auth-form__note">
        <Link href="/forgot-password">忘記密碼？</Link>
      </p>
      <hr className="auth-form__divider" />
      <p className="auth-form__note">
        <button type="button" className="btn btn-outline btn--block" disabled>Google 登入暫未開放</button>
      </p>
      <p className="auth-form__note">
        還沒有帳號？<Link href="/register">前往註冊</Link>
      </p>
      <p className="auth-form__note" style={{ fontSize: '0.85rem', color: '#888' }}>
        測試用後台帳號：AAA / 密碼：123
      </p>
    </form>
  );
}
