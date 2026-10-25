'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('請輸入帳號與密碼');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || '登入失敗。');
      router.replace('/admin/courses');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-card">
      <h1>後台登入</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <label>帳號（Email）</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@shenhua.com"
          />
        </div>
        <div className="form-row">
          <label>密碼</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="請輸入後台密碼"
          />
        </div>
        {error && <p style={{ color: '#dc3545', fontSize: '0.9rem', marginBottom: '12px' }}>{error}</p>}
        <button type="submit" className="admin-btn admin-btn--primary" style={{ width: '100%' }} disabled={submitting}>
          {submitting ? '登入中…' : '登入'}
        </button>
      </form>
    </div>
  );
}
