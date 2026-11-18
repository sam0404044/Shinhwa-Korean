'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCartItems, removeCartItems } from '../lib/cart';

function toCheckoutItem(course) {
  return {
    id: String(course.id),
    title: course.title,
    price: Number(course.price) || 0,
  };
}

export default function CheckoutForm({ testMode = false }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course');
  const [items, setItems] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const ids = courseId ? [courseId] : getCartItems().map((item) => item.id);
    const uniqueIds = Array.from(new Set(ids.map((id) => String(id))));
    if (!uniqueIds.length) {
      setItems([]);
      return;
    }
    fetch('/api/public/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: uniqueIds }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || '無法讀取課程。');
        const courses = data.courses || [];
        const purchased = courses.filter((course) => course.purchased);
        setPurchasedCourses(purchased);
        if (purchased.length) removeCartItems(purchased.map((course) => course.id));
        setItems(courses.filter((course) => !course.purchased).map(toCheckoutItem));
      })
      .catch((error) => {
        setItems([]);
        setError(error.message);
      });
  }, [courseId]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!items.length) {
      setError('請先選擇課程。');
      return;
    }

    const courseIds = items.map((item) => item.id);
    setError('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/member/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseIds }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || '購買失敗。');
      removeCartItems(courseIds);
      router.push(`/payment-result?orders=${encodeURIComponent(result.orderIds.join(','))}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      {purchasedCourses.map((course) => <p key={course.id} role="status">{course.title}：此課程已購買。<a href={`/course-play?courseId=${course.id}`}>開始上課</a></p>)}
      {items.length ? (
        <ul className="checkout-items">
          {items.map((item) => (
            <li key={item.id}>
              <span>{item.title}</span>
              <span>NT$ {item.price.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="checkout-hint">請先選擇課程。</p>
      )}
      {!testMode && <div className="form-group">
        <label htmlFor="payment">付款方式</label>
        <select id="payment" name="payment" defaultValue="credit">
          <option value="credit">信用卡</option>
          <option value="atm">ATM 轉帳</option>
        </select>
      </div>}
      <p className="checkout-total">應付金額：NT$ {total.toLocaleString()}</p>
      {error ? <p className="auth-form__status auth-form__status--error" role="alert">{error}</p> : null}
      <button type="submit" className="btn btn-primary btn--block" disabled={submitting || !items.length}>
        {submitting ? '處理中…' : (testMode ? '確認測試結帳' : '前往付款')}
      </button>
    </form>
  );
}
