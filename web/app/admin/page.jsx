'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/dashboard', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || '無法讀取儀表板資料。');
        setDashboard(data);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  const maxRevenue = useMemo(() => Math.max(...(dashboard?.trend || []).map((item) => item.revenue), 1), [dashboard]);
  const metrics = dashboard?.metrics;

  return <div className="admin-dashboard">
    <div className="admin-page-header">
      <div>
        <p className="admin-dashboard__eyebrow">營運總覽</p>
        <h1 className="admin-page-title">儀表板</h1>
        <p className="admin-page-desc">以已付款訂單與會員資料即時計算，掌握目前的銷售與會員成長。</p>
      </div>
      <p className="admin-dashboard__source">資料更新：重新載入頁面</p>
    </div>

    {error ? <p className="admin-error">{error}</p> : null}
    {!dashboard && !error ? <p className="admin-dashboard__loading">正在整理營運資料…</p> : null}

    {dashboard ? <>
      <section className="admin-kpi-grid" aria-label="核心營運指標">
        <MetricCard label="本月課程銷售" value={`${metrics.monthSales} 筆`} detail={`本月營收 NT$ ${formatNumber(metrics.monthRevenue)}`} tone="violet" ratio={ratio(metrics.monthSales, metrics.totalSales)} />
        <MetricCard label="歷史課程銷售" value={`${metrics.totalSales} 筆`} detail={`累計營收 NT$ ${formatNumber(metrics.totalRevenue)}`} tone="blue" ratio={1} />
        <MetricCard label="本月新增會員" value={`${metrics.newMemberCount} 人`} detail={`目前會員共 ${formatNumber(metrics.memberCount)} 人`} tone="pink" ratio={ratio(metrics.newMemberCount, metrics.memberCount)} />
        <MetricCard label="可銷售課程" value={`${metrics.publishedCourseCount} 堂`} detail={`其中 ${metrics.trialCourseCount} 堂提供試聽`} tone="teal" ratio={ratio(metrics.trialCourseCount, metrics.publishedCourseCount)} />
      </section>

      <section className="admin-dashboard-grid">
        <section className="admin-card admin-dashboard__chart-card">
          <div className="admin-card__header">
            <div><h2 className="admin-section-title">近六個月營收趨勢</h2><p className="admin-section-desc">僅統計付款完成的課程訂單。</p></div>
            <span className="admin-dashboard__legend"><i /> 營收</span>
          </div>
          <div className="admin-bar-chart" role="img" aria-label="近六個月營收柱狀圖">
            {dashboard.trend.map((item) => <div className="admin-bar-chart__item" key={item.label}>
              <span className="admin-bar-chart__amount">{item.revenue ? `NT$ ${formatCompact(item.revenue)}` : '—'}</span>
              <div className="admin-bar-chart__track"><div className="admin-bar-chart__bar" style={{ height: `${Math.max(item.revenue ? 10 : 0, (item.revenue / maxRevenue) * 100)}%` }} /></div>
              <strong>{item.label}</strong><small>{item.sales} 筆銷售</small>
            </div>)}
          </div>
        </section>

        <section className="admin-card admin-dashboard__orders-card">
          <div className="admin-card__header">
            <div><h2 className="admin-section-title">最近成交</h2><p className="admin-section-desc">最近五筆已付款訂單。</p></div>
            <Link href="/admin/orders" className="admin-btn admin-btn--secondary admin-btn--small">查看訂單</Link>
          </div>
          {dashboard.recentOrders.length ? <ul className="admin-recent-orders">
            {dashboard.recentOrders.map((order) => <li key={order.id}><div><strong>{order.courseTitle}</strong><span>{order.memberName} · {formatDate(order.paidAt)}</span></div><b>NT$ {formatNumber(order.amount)}</b></li>)}
          </ul> : <p className="admin-dashboard__empty">目前尚無已付款訂單，完成金流串接後會顯示成交資料。</p>}
        </section>
      </section>

      <section className="admin-card admin-dashboard__action-card">
        <div><h2 className="admin-section-title">下一步可追蹤的行銷成效</h2><p className="admin-section-desc">銷售、會員成長與試聽課程已能在此追蹤。要進一步判讀流量、轉換率與廣告成效，下一階段可串接 Google Analytics 4 或 Meta Pixel。</p></div>
        <div className="admin-dashboard__links"><Link href="/admin/courses" className="admin-btn admin-btn--secondary">管理課程</Link><Link href="/admin/members" className="admin-btn admin-btn--secondary">檢視會員</Link><Link href="/admin/orders" className="admin-btn admin-btn--primary">檢視成交</Link></div>
      </section>
    </> : null}
  </div>;
}

function MetricCard({ label, value, detail, tone, ratio: progress }) {
  return <section className={`admin-kpi-card admin-kpi-card--${tone}`}><p>{label}</p><strong>{value}</strong><span>{detail}</span><div className="admin-kpi-card__meter"><i style={{ width: `${Math.max(8, progress * 100)}%` }} /></div></section>;
}

function ratio(value, total) { return !total || !value ? 0 : Math.min(value / total, 1); }
function formatNumber(value) { return new Intl.NumberFormat('zh-TW').format(value || 0); }
function formatCompact(value) { return value >= 10000 ? `${Math.round(value / 1000)}k` : formatNumber(value); }
function formatDate(value) { return value ? new Intl.DateTimeFormat('zh-TW', { month: 'numeric', day: 'numeric' }).format(new Date(value)) : '—'; }
