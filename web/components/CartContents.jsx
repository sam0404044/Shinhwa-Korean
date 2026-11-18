'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCartItems, removeCartItems, useCartCount } from '../lib/cart';

export default function CartContents() {
  const count = useCartCount();
  const [courses, setCourses] = useState([]);
  const [unavailableIds, setUnavailableIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const ids = [...new Set(getCartItems().map((item) => String(item.id)))];
    setLoading(true);
    setError('');
    fetch('/api/public/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
      signal: controller.signal,
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '無法讀取購物車。');
      const purchasedIds = data.courses.filter((course) => course.purchased).map((course) => course.id);
      if (purchasedIds.length) removeCartItems(purchasedIds);
      setCourses(data.courses.filter((course) => !course.purchased));
      const available = new Set(data.courses.map((course) => String(course.id)));
      setUnavailableIds(ids.filter((id) => !available.has(id)));
    }).catch((requestError) => {
      if (!controller.signal.aborted) setError(requestError.message);
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [count, revision]);

  function remove(ids) {
    removeCartItems(ids);
    setRevision((current) => current + 1);
  }

  if (loading) return <p role="status">正在讀取購物車…</p>;
  if (error) return <div><p role="alert">{error}</p><button type="button" className="btn btn-outline" onClick={() => setRevision((current) => current + 1)}>重新載入</button></div>;

  const total = courses.reduce((sum, course) => sum + course.price, 0);
  return <>
    {unavailableIds.length > 0 && <p className="cart-hint">
      有 {unavailableIds.length} 堂課程已下架或無法購買。
      <button type="button" className="btn btn--small" onClick={() => remove(unavailableIds)}>移除無法購買的課程</button>
    </p>}
    {courses.length ? <>
      <div className="cart-list">
        {courses.map((course) => <div className="cart-item" key={course.id}>
          <img className="cart-item__img" src={course.imageUrl || '/assets/images/courses/01.webp'} alt="" style={{ objectFit: 'cover' }} />
          <div className="cart-item__info">
            <h3><Link href={`/course/${course.id}`}>{course.title}</Link></h3>
            <p className="cart-item__price">NT$ {course.price.toLocaleString('zh-TW')}</p>
            <button type="button" className="btn btn--small" onClick={() => remove([course.id])}>移除</button>
          </div>
        </div>)}
      </div>
      <div className="cart-footer">
        <p className="cart-total">合計：NT$ {total.toLocaleString('zh-TW')}</p>
        <Link href="/checkout" className="btn btn-primary">選擇付款方式並結帳</Link>
      </div>
    </> : <p>購物車目前沒有可購買的課程。<Link href="/courses">瀏覽課程</Link></p>}
  </>;
}
