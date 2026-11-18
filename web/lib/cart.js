'use client';

import { useEffect, useSyncExternalStore } from 'react';

const empty = { items: [], purchasedIds: [], loading: true, error: '' };
let snapshot = empty;
let pending = null;
let version = 0;
let requestQueue = Promise.resolve();
const subscribers = new Set();

function publish(value) {
  snapshot = value;
  subscribers.forEach((notify) => notify());
}

function subscribe(notify) {
  subscribers.add(notify);
  return () => subscribers.delete(notify);
}

export function resetCart() {
  version += 1;
  pending = null;
  publish({ items: [], purchasedIds: [], loading: false, error: '' });
}

function cartRequest(body) {
  const requestVersion = version;
  const task = requestQueue.then(async () => {
    if (requestVersion !== version) return { items: [], purchasedIds: [] };
    const response = await fetch('/api/member/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      cache: 'no-store',
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.error || '無法讀取購物車。');
      error.status = response.status;
      throw error;
    }
    if (requestVersion === version) publish({ ...data, loading: false, error: '' });
    return data;
  });
  requestQueue = task.catch(() => {});
  return task;
}

// Move the previous browser cart into the authenticated member's database cart once.
async function importLegacyCart(data, requestVersion) {
  let ids;
  try {
    const legacy = JSON.parse(window.localStorage.getItem('myth-korean-cart') || '[]');
    ids = Array.isArray(legacy) ? [...new Set(legacy.map((item) => Number(item?.id))
      .filter((id) => Number.isSafeInteger(id) && id > 0))] : [];
  } catch {
    return data;
  }
  let current = data;
  for (let offset = 0; offset < ids.length; offset += 100) {
    if (requestVersion !== version) return current;
    current = await cartRequest({ action: 'import', ids: ids.slice(offset, offset + 100) });
  }
  if (requestVersion === version) {
    try {
      window.localStorage.removeItem('myth-korean-cart');
      window.localStorage.removeItem('myth-korean-purchases');
    } catch {
      // Storage may be disabled. Repeating the import is safe.
    }
  }
  return current;
}

export function refreshCart() {
  if (pending) return pending;
  const requestVersion = version;
  const task = cartRequest({ action: 'list' }).then((data) => importLegacyCart(data, requestVersion)).catch((error) => {
    if (requestVersion !== version) return { items: [], purchasedIds: [] };
    if (error.status === 401) {
      resetCart();
      return { items: [], purchasedIds: [] };
    }
    publish({ ...snapshot, loading: false, error: error.message });
    throw error;
  }).finally(() => {
    if (pending === task) pending = null;
  });
  pending = task;
  return task;
}

export function addCartItem(course) {
  return cartRequest({ action: 'add', courseId: Number(course.id) });
}

export function removeCartItems(ids) {
  return cartRequest({ action: 'remove', ids: ids.map(Number) });
}

export async function getCartItems() {
  return (await refreshCart()).items;
}

export function useCart() {
  const state = useSyncExternalStore(subscribe, () => snapshot, () => empty);
  useEffect(() => {
    const refresh = () => { refreshCart().catch(() => {}); };
    refresh();
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);
  return state;
}

export function useCartCount() {
  return useCart().items.length;
}
