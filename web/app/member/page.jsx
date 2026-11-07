'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const PANELS = [
  { id: 'my-courses', label: '我的課程' },
  { id: 'watch-history', label: '觀看紀錄' },
  { id: 'account', label: '帳號設定' },
  { id: 'orders', label: '購買紀錄' },
  { id: 'coins', label: '神話幣' },
  { id: 'scores', label: '測驗成績' },
];
export default function MemberPage() {
  const [panel, setPanel] = useState('my-courses');
  const [orders, setOrders] = useState([]);
  const [memberCourses, setMemberCourses] = useState([]);
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    const hashPanel = window.location.hash.slice(1);
    if (PANELS.some(({ id }) => id === hashPanel)) {
      setPanel(hashPanel);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadMemberData() {
      const [ordersResponse, coursesResponse, profileResponse] = await Promise.all([
        fetch('/api/member/orders', { method: 'POST' }),
        fetch('/api/member/courses', { method: 'POST' }),
        fetch('/api/member/profile', { cache: 'no-store' }),
      ]);
      if (cancelled) return;
      const ordersData = ordersResponse.ok ? await ordersResponse.json() : { orders: [] };
      const coursesData = coursesResponse.ok ? await coursesResponse.json() : { courses: [] };
      const profileData = profileResponse.ok ? await profileResponse.json() : { profile: { name: '', email: '' } };
      setOrders(ordersData.orders || []);
      setMemberCourses(coursesData.courses || []);
      setProfile(profileData.profile || { name: '', email: '' });
    }

    loadMemberData().catch(() => { if (!cancelled) { setOrders([]); setMemberCourses([]); } });

    return () => {
      cancelled = true;
    };
  }, []);

  const courseRows = memberCourses.map((course) => ({
    key: `course-${course.id}`,
    label: course.purchased ? '已購買' : '試聽課程',
    title: course.title,
    meta: course.purchased ? `NT$ ${Number(course.amount || 0).toLocaleString()}` : `${course.chapterCount} 堂課 · 可試作單元小考`,
    href: `/course-play?courseId=${course.id}`,
  }));

  const show = (id) => {
    setPanel(id);
    if (typeof window !== 'undefined') window.history.replaceState(null, '', '#' + id);
  };

  async function saveProfile(event) {
    event.preventDefault();
    setProfileMessage('');
    setProfileError('');
    setProfileSaving(true);
    try {
      const response = await fetch('/api/member/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '無法儲存帳號設定。');
      setProfile(data.profile);
      setProfileMessage('帳號設定已儲存。');
    } catch (error) {
      setProfileError(error.message);
    } finally {
      setProfileSaving(false);
    }
  }

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
              <form className="auth-form member-account-form" onSubmit={saveProfile}>
                <div className="form-group"><label htmlFor="member-name">姓名</label><input id="member-name" type="text" name="name" value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} /></div>
                <div className="form-group"><label htmlFor="member-email">電子郵件</label><input id="member-email" type="email" name="email" value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} required /></div>
                {profileError ? <p className="auth-form__status auth-form__status--error" role="alert">{profileError}</p> : null}
                {profileMessage ? <p className="auth-form__status auth-form__status--success" role="status">{profileMessage}</p> : null}
                <div className="button-actions member-account__actions">
                  <button type="submit" className="btn btn-primary" disabled={profileSaving}>{profileSaving ? '儲存中…' : '儲存'}</button>
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
              {orders.length ? (
                <ul className="member-order-list">
                  {orders.map((order) => (
                    <li key={order.id}>
                      <div><strong>{order.courseTitle}</strong><span>課程訂單</span></div>
                      <span className="member-order-list__amount">NT$ {order.amount.toLocaleString()} <em>已付款</em></span>
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
