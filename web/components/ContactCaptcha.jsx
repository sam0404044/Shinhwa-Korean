'use client';

import { useEffect, useRef, useState } from 'react';
import { createCaptchaCode } from '../lib/captcha';

function RequiredStar() {
  return <span className="required-star" aria-label="必填">*</span>;
}

export default function ContactCaptcha() {
  const [code, setCode] = useState('');
  const fieldRef = useRef(null);
  const inputRef = useRef(null);

  const refreshCode = () => {
    setCode(createCaptchaCode());
    inputRef.current?.setCustomValidity('');
  };

  useEffect(() => {
    refreshCode();
  }, []);

  useEffect(() => {
    const form = fieldRef.current?.closest('form');
    const input = inputRef.current;

    if (!form || !input) {
      return undefined;
    }

    const handleInput = () => {
      input.setCustomValidity('');
    };

    const handleSubmit = (event) => {
      if (input.value.trim() === code) {
        input.setCustomValidity('');
        return;
      }

      event.preventDefault();
      input.setCustomValidity('驗證碼不正確，請重新輸入。');
      input.reportValidity();
    };

    input.addEventListener('input', handleInput);
    form.addEventListener('submit', handleSubmit);

    return () => {
      input.removeEventListener('input', handleInput);
      form.removeEventListener('submit', handleSubmit);
    };
  }, [code]);

  return (
    <div className="form-group" ref={fieldRef}>
      <label htmlFor="contact-captcha">驗證碼 <RequiredStar /></label>
      <div className="captcha-row">
        <strong className="captcha-code" aria-live="polite">{code || '-----'}</strong>
        <input
          id="contact-captcha"
          ref={inputRef}
          name="captcha"
          type="text"
          required
          inputMode="numeric"
          autoComplete="off"
          pattern="[0-9]{5}"
          placeholder="請輸入驗證碼"
        />
      </div>
      <button type="button" className="text-button" onClick={refreshCode}>
        換一個驗證碼
      </button>
    </div>
  );
}
