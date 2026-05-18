'use client';

import { useState } from 'react';
import { addCartItem } from '../lib/cart';

export default function AddToCartButton({ course, className }) {
  const [added, setAdded] = useState(false);

  function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    addCartItem(course);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {added ? '已加入購物車' : '加入購物車'}
    </button>
  );
}
