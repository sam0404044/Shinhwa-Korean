'use client';

import Link from 'next/link';
import { useState } from 'react';
import { removeCartItems, refreshCart, useCart } from '../lib/cart';

export default function CartContents() {
  const { items, loading, error: cartError } = useCart();
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState(false);
  const courses = items.filter((item) => item.published);
  const unavailableIds = items.filter((item) => !item.published).map((item) => item.id);

  async function remove(ids) {
    setRemoving(true);
    setError('');
    try {
      await removeCartItems(ids);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setRemoving(false);
    }
  }

  if (loading) return <p role="status">正在讀取購物車…</p>;
  if (cartError) return <div><p role="alert">{cartError}</p><button type="button" className="btn btn-outline" onClick={() => refreshCart().catch(() => {})}>重新載入</button></div>;

  const total = courses.reduce((sum, course) => sum + course.price, 0);
  return <>
    {error ? <p role="alert">{error}</p> : null}
    {unavailableIds.length > 0 && <p className="cart-hint">
      有 {unavailableIds.length} 堂課程已下架或無法購買。
      <button type="button" className="btn btn--small" disabled={removing} onClick={() => remove(unavailableIds)}>移除無法購買的課程</button>
    </p>}
    {courses.length ? <>
      <div className="cart-list">
        {courses.map((course) => <div className="cart-item" key={course.id}>
          <img className="cart-item__img" src={course.imageUrl || '/assets/images/courses/01.webp'} alt="" style={{ objectFit: 'cover' }} />
          <div className="cart-item__info">
            <h3><Link href={`/course/${course.id}`}>{course.title}</Link></h3>
            <p className="cart-item__price">NT$ {course.price.toLocaleString('zh-TW')}</p>
            <button type="button" className="btn btn--small" disabled={removing} onClick={() => remove([course.id])}>移除</button>
          </div>
        </div>)}
      </div>
      <div className="cart-footer">
        <p className="cart-total">合計：NT$ {total.toLocaleString('zh-TW')}</p>
        <Link href="/checkout" className="btn btn-primary">選擇付款方式並結帳</Link>
      </div>
    </> : <section className="cart-empty" aria-labelledby="cart-empty-title">
      <div className="cart-empty__bag" aria-hidden="true" />
      <h2 id="cart-empty-title">購物車還空著</h2>
      <p>挑選想學習的課程，開始你的韓語學習。</p>
      <Link href="/courses" className="btn btn-primary cart-empty__browse">瀏覽課程<span aria-hidden="true">→</span></Link>
    </section>}
  </>;
}
