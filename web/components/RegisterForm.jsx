'use client';

import { useState } from 'react';
import Link from 'next/link';
import BirthdayInput from './BirthdayInput';
import MotivationField from './MotivationField';

function RequiredStar() {
  return <span className="required-star" aria-label="必填">*</span>;
}

function valueFrom(formData, name) {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

export default function RegisterForm() {
  const [birthday, setBirthday] = useState({ year: '', month: '', day: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: valueFrom(formData, 'name'),
      gender: valueFrom(formData, 'gender'),
      birthday: valueFrom(formData, 'birthday'),
      email: valueFrom(formData, 'email'),
      phone: valueFrom(formData, 'phone'),
      addressRegion: valueFrom(formData, 'addressRegion'),
      taiwanAddress: valueFrom(formData, 'taiwanAddress'),
      overseasAddress: valueFrom(formData, 'overseasAddress'),
      password: valueFrom(formData, 'password'),
      motivation: valueFrom(formData, 'motivation'),
      motivationOther: valueFrom(formData, 'motivationOther'),
    };

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setStatus({ type: 'error', message: data.error || '註冊失敗，請稍後再試。' });
        return;
      }

      form.reset();
      setBirthday({ year: '', month: '', day: '' });
      setStatus({ type: 'success', message: '註冊成功，歡迎加入神話韓語。' });
    } catch (error) {
      setStatus({ type: 'error', message: '註冊服務暫時無法使用，請稍後再試。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="reg-name">姓名 <RequiredStar /> <span className="label-hint">請填寫真實姓名</span></label>
        <input id="reg-name" type="text" name="name" required placeholder="例：韓小龍" />
      </div>
      <fieldset className="form-fieldset">
        <legend>性別</legend>
        <label><input type="radio" name="gender" value="male" /> 男性</label>
        <label><input type="radio" name="gender" value="female" /> 女性</label>
      </fieldset>
      <div className="form-group">
        <label htmlFor="reg-birthday-year">生日</label>
        <BirthdayInput value={birthday} onChange={setBirthday} />
      </div>
      <div className="form-group">
        <label htmlFor="reg-email">電子信箱（email） <RequiredStar /></label>
        <input id="reg-email" type="email" name="email" required placeholder="例：oppa@gmail.com" autoComplete="email" />
      </div>
      <div className="form-group">
        <label htmlFor="reg-phone">電話 <RequiredStar /></label>
        <input id="reg-phone" type="tel" name="phone" required placeholder="例：0989123456" autoComplete="tel" />
      </div>
      <fieldset className="form-fieldset">
        <legend>地址</legend>
        <label><input type="radio" name="addressRegion" value="taiwan" /> 臺灣</label>
        <input type="text" name="taiwanAddress" placeholder="例：臺北市中正區神話路一段1號1樓" />
        <label><input type="radio" name="addressRegion" value="overseas" /> 海外</label>
        <input type="text" name="overseasAddress" placeholder="請填寫海外地址" />
      </fieldset>
      <div className="form-group">
        <label htmlFor="reg-password">密碼 <RequiredStar /></label>
        <input
          id="reg-password"
          type="password"
          name="password"
          required
          minLength={8}
          placeholder="建議8碼以上，包含大小寫和數字"
          autoComplete="new-password"
        />
      </div>
      <MotivationField />
      {status.message ? (
        <p className={`auth-form__status auth-form__status--${status.type}`} role="status">
          {status.message}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary btn--block" disabled={isSubmitting}>
        {isSubmitting ? '送出中...' : '註冊'}
      </button>
      <p className="auth-form__note">已經有帳號？<Link href="/login">前往登入</Link></p>
    </form>
  );
}
