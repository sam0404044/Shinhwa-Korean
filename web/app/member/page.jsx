'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { courses, getCourseById } from '../../data/courses';
import { clearPurchases, readPurchases } from '../../lib/purchases';

const PANELS = [
  { id: 'my-courses', label: '我的課程' },
  { id: 'watch-history', label: '觀看紀錄' },
  { id: 'account', label: '帳號設定' },
  { id: 'orders', label: '購買紀錄' },
  { id: 'coins', label: '神話幣' },
  { id: 'scores', label: '測驗成績' },
];
const testCourse = getCourseById(1);

function courseByTitle(title) {
  return courses.find((course) => course.title === title) || null;
}

export default function MemberPage() {
  const [panel, setPanel] = useState('my-courses');
  const [orders, setOrders] = useState([]);
  const [localCourses, setLocalCourses] = useState([]);

  useEffect(() => {
    const hashPanel = window.location.hash.slice(1);
    if (PANELS.some(({ id }) => id === hashPanel)) {
      setPanel(hashPanel);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPurchases() {
      const localIds = readPurchases();
      const response = await fetch('/api/member/orders', { method: 'POST' });
      if (cancelled) return;

      if (response.ok && localIds.length) {
        const saved = await fetch('/api/member/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseIds: localIds }),
        });
        if (saved.ok) clearPurchases();
        const again = await fetch('/api/member/orders', { method: 'POST' });
        const data = again.ok ? await again.json() : { orders: [] };
        if (!cancelled) {
          setOrders(data.orders || []);
          setLocalCourses([]);
        }
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (!cancelled) {
          setOrders(data.orders || []);
          setLocalCourses([]);
        }
        return;
      }

      if (!cancelled) {
        setOrders([]);
        setLocalCourses(localIds.map((id) => getCourseById(id)).filter(Boolean));
      }
    }

    loadPurchases().catch(() => {
      if (!cancelled) setLocalCourses(readPurchases().map((id) => getCourseById(id)).filter(Boolean));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const ownedTitles = new Set([
    ...orders.map((order) => order.courseTitle),
    ...localCourses.map((course) => course.title),
  ]);
  const courseRows = [
    ...orders.map((order) => {
      const course = courseByTitle(order.courseTitle);
      return {
        key: `order-${order.id}`,
        label: '已購買',
        title: order.courseTitle,
        meta: `NT$ ${order.amount.toLocaleString()}`,
        href: course ? `/course/${course.id}` : '',
      };
    }),
    ...localCourses.map((course) => ({
      key: `local-${course.id}`,
      label: '已購買',
      title: course.title,
      meta: `NT$ ${course.price.toLocaleString()}`,
      href: `/course/${course.id}`,
    })),
  ];
  if (!ownedTitles.has(testCourse.title)) {
    courseRows.push({
      key: 'trial',
      label: '測試課程',
      title: testCourse.title,
      meta: `${testCourse.chapters.length} 堂課 · Unit 1 題庫已開放試作`,
      href: `/course/${testCourse.id}`,
    });
  }

  const show = (id) => {
    setPanel(id);
    if (typeof window !== 'undefined') window.history.replaceState(null, '', '#' + id);
  };

  return (
    <main className="page-main page-main--member">
      <section className="section section--member">
        <div className="member-layout">
          <nav className="member-sidebar" aria-label="會員中心導覽">
            <h2 className="member-sidebar__title">會員中心</h2>
            <ul className="member-sidebar__list">
              {PANELS.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} className={`member-sidebar__link ${panel === id ? 'is-active' : ''}`} data-panel={id} onClick={(e) => { e.preventDefault(); show(id); }}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="member-content">
            <div id="my-courses" className={`member-block ${panel === 'my-courses' ? 'is-visible' : ''}`}>
              <header className="member-page-heading">
                <p className="member-page-heading__eyebrow">學習空間</p>
                <h2>我的課程</h2>
                <p>從這裡繼續課程、查看章節與進入單元小考。</p>
              </header>
              {courseRows.length ? (
                <ul className="member-course-list">
                  {courseRows.map((course, index) => (
                    <li key={course.key} className={`member-course-row ${index % 2 === 0 ? 'is-even' : 'is-odd'}`}>
                      <div className="member-course-row__text">
                        <p className="member-course-row__label">{course.label}</p>
                        <h3>{course.title}</h3>
                        <p>{course.meta}</p>
                      </div>
                      <div className="member-course-row__actions">
                        {course.href ? <Link href={course.href} className="btn btn-primary btn--small">查看課程與章節</Link> : null}
                        <Link href="/member/quiz/" className="btn btn-outline btn--small">進入單元小考</Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="member-empty-state">
                  <strong>還沒有已購買的課程</strong>
                  <p>完成購買後，課程會顯示在這裡。</p>
                  <Link href="/courses/" className="btn btn-outline btn--small">瀏覽課程</Link>
                </div>
              )}
            </div>
            <div id="watch-history" className={`member-block ${panel === 'watch-history' ? 'is-visible' : ''}`}>
              <header className="member-page-heading">
                <p className="member-page-heading__eyebrow">學習足跡</p>
                <h2>觀看紀錄</h2>
                <p>回到最近觀看的位置，接續你的學習節奏。</p>
              </header>
              <div className="member-empty-state">
                <strong>尚無觀看紀錄</strong>
                <p>開始觀看課程後，最近學習的內容會顯示在這裡。</p>
                <button type="button" className="btn btn-outline btn--small" onClick={() => show('my-courses')}>前往我的課程</button>
              </div>
            </div>
            <div id="account" className={`member-block ${panel === 'account' ? 'is-visible' : ''}`}>
              <header className="member-page-heading">
                <p className="member-page-heading__eyebrow">個人資料</p>
                <h2>帳號設定</h2>
                <p>更新你的基本資料與登入帳號。</p>
              </header>
              <form className="auth-form member-account-form">
                <div className="form-group"><label>姓名</label><input type="text" name="name" /></div>
                <div className="form-group"><label>電子郵件</label><input type="email" name="email" /></div>
                <div className="button-actions member-account__actions">
                  <button type="submit" className="btn btn-primary">儲存</button>
                  <button type="button" className="btn btn-outline" onClick={async () => {
                    const response = await fetch('/api/auth/session', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ action: 'logout' }),
                    });
                    if (response.ok) window.location.assign('/');
                  }}>登出</button>
                </div>
              </form>
            </div>
            <div id="orders" className={`member-block ${panel === 'orders' ? 'is-visible' : ''}`}>
              <header className="member-page-heading">
                <p className="member-page-heading__eyebrow">交易明細</p>
                <h2>購買紀錄</h2>
                <p>查看已完成付款的課程與訂單狀態。</p>
              </header>
              {orders.length || localCourses.length ? (
                <ul className="member-order-list">
                  {orders.map((order) => (
                    <li key={order.id}>
                      <div><strong>{order.courseTitle}</strong><span>課程訂單</span></div>
                      <span className="member-order-list__amount">NT$ {order.amount.toLocaleString()} <em>已付款</em></span>
                    </li>
                  ))}
                  {localCourses.map((course) => (
                    <li key={course.id}>
                      <div><strong>{course.title}</strong><span>課程訂單</span></div>
                      <span className="member-order-list__amount">NT$ {course.price.toLocaleString()} <em>已付款</em></span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="member-empty-state">
                  <strong>尚無購買紀錄</strong>
                  <p>完成課程購買後，訂單資訊會顯示在這裡。</p>
                </div>
              )}
            </div>
            <div id="coins" className={`member-block ${panel === 'coins' ? 'is-visible' : ''}`}>
              <header className="member-page-heading">
                <p className="member-page-heading__eyebrow">會員回饋</p>
                <h2>神話幣</h2>
                <p>掌握目前可用的神話幣餘額。</p>
              </header>
              <div className="member-coins-card">
                <span>目前餘額</span>
                <strong>0</strong>
                <small>神話幣</small>
              </div>
            </div>
            <div id="scores" className={`member-block ${panel === 'scores' ? 'is-visible' : ''}`}>
              <header className="member-page-heading">
                <p className="member-page-heading__eyebrow">學習成果</p>
                <h2>測驗成績</h2>
                <p>查看各單元小考的答題紀錄與成績。</p>
              </header>
              <div className="member-score-card">
                <div><strong>單元小考</strong><span>每次隨機抽出 10 題，完成後即可查看結果。</span></div>
                <Link href="/member/quiz/" className="btn btn-primary btn--small">查看小考與成績</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
