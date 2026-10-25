'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function RequiredStar() {
  return <span className="required-star" aria-label="必填">*</span>;
}

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
      });
      const result = await response.json();
      if (response.status === 401) throw new Error('帳號或密碼錯誤');
      if (!response.ok) throw new Error(result.error || '登入失敗。');
      router.replace('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="login-email">Email <RequiredStar /></label>
        <input id="login-email" type="text" name="email" required placeholder="請輸入 Email" autoComplete="username" />
      </div>
      <div className="form-group">
        <label htmlFor="login-password">密碼 <RequiredStar /></label>
        <input id="login-password" type="password" name="password" required placeholder="請輸入密碼" />
      </div>
      {error && <p className="auth-form__status auth-form__status--error" role="alert">{error}</p>}
      <button type="submit" className="btn btn-primary btn--block" disabled={submitting}>{submitting ? '登入中…' : '登入'}</button>
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
    </form>
  );
}
