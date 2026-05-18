'use client';

import { useEffect, useState } from 'react';

const CART_KEY = 'myth-korean-cart';
const CART_EVENT = 'myth-korean-cart-updated';

function readCart() {
  if (typeof window === 'undefined') return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function getCartCount() {
  return readCart().reduce((total, item) => total + (Number(item.quantity) || 0), 0);
}

export function addCartItem(course) {
  if (typeof window === 'undefined') return 0;

  const items = readCart();
  const id = String(course.id);
  const existing = items.find((item) => String(item.id) === id);

  if (existing) {
    existing.quantity = (Number(existing.quantity) || 0) + 1;
  } else {
    items.push({
      id,
      title: course.title,
      price: course.price,
      image: course.image,
      quantity: 1,
    });
  }

  writeCart(items);
  return getCartCount();
}

export function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => setCount(getCartCount());

    updateCount();
    window.addEventListener(CART_EVENT, updateCount);
    window.addEventListener('storage', updateCount);

    return () => {
      window.removeEventListener(CART_EVENT, updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  return count;
}
