'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addCartItem, useCart } from '../lib/cart';

export default function AddToCartButton({ course, className }) {
  const router = useRouter();
  const cart = useCart();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const purchased = cart.purchasedIds.includes(Number(course.id));
  const added = cart.items.some((item) => item.id === Number(course.id));

  async function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    setChecking(true);
    setError('');
    try {
      await addCartItem(course);
    } catch (requestError) {
      if (requestError.status === 401) router.push(`/login?next=${encodeURIComponent('/course/' + course.id)}`);
      else setError(requestError.message);
    } finally {
      setChecking(false);
    }
  }

  return <>
    <button type="button" className={className} onClick={handleClick} disabled={cart.loading || checking || purchased || added}>
      {cart.loading ? '載入中…' : purchased ? '此課程已購買' : checking ? '加入中…' : added ? '已加入購物車' : '加入購物車'}
    </button>
    {error || cart.error ? <span role="alert">{error || cart.error}</span> : null}
  </>;
}
