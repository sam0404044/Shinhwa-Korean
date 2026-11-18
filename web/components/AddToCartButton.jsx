'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addCartItem, removeCartItems } from '../lib/cart';

export default function AddToCartButton({ course, className }) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  async function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    setChecking(true);
    setError('');
    try {
      const response = await fetch('/api/member/orders', { method: 'POST', cache: 'no-store' });
      if (response.status === 401) {
        router.push(`/login?next=${encodeURIComponent('/course/' + course.id)}`);
        return;
      }
      if (!response.ok) throw new Error('無法確認購買狀態，請稍後再試。');
      const { orders } = await response.json();
      if (orders.some((order) => String(order.courseId) === String(course.id))) {
        removeCartItems([course.id]);
        setPurchased(true);
        return;
      }
      addCartItem(course);
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1200);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setChecking(false);
    }
  }

  return (
    <><button type="button" className={className} onClick={handleClick} disabled={checking || purchased}>
      {purchased ? '此課程已購買' : checking ? '確認中…' : added ? '已加入購物車' : '加入購物車'}
    </button>{error ? <span role="alert">{error}</span> : null}</>
  );
}
