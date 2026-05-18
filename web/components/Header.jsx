'use client';

import Link from 'next/link';
import { useState } from 'react';
import { assetPath } from '../lib/paths';

export default function Header() {
  const [memberOpen, setMemberOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo" aria-label="神話韓語">
          <img
            src={assetPath('/assets/images/LOGO/NAVBAR_LOGO.png')}
            alt="神話韓語"
            className="logo__wordmark"
          />
        </Link>

        <div className="search-wrap search-wrap-mobile">
          <input
            type="search"
            className="search-input"
            placeholder="搜尋課程或文章"
            aria-label="搜尋"
          />
          <button type="button" className="search-btn" aria-label="搜尋">
            搜尋
          </button>
        </div>

        <nav className={`nav-menu ${mobileOpen ? 'is-open-mobile' : ''}`}>
          <ul className="nav-list nav-before-login">
            <li><Link href="/about">關於我們</Link></li>
            <li><Link href="/courses">課程列表</Link></li>
            <li><Link href="/news">最新消息</Link></li>
            <li><Link href="/testimonials">學員見證</Link></li>
            <li><Link href="/contact">點我洽詢</Link></li>
          </ul>

          <ul className="nav-list nav-after-login is-hidden">
            <li className="nav-member">
              <button
                type="button"
                className="member-name-btn"
                aria-expanded={memberOpen}
                aria-haspopup="true"
                onClick={() => setMemberOpen(!memberOpen)}
              >
                <span className="member-name-text">會員名稱</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              <div className={`member-dropdown ${memberOpen ? 'is-open' : ''}`}>
                <div className="dropdown-section">
                  <h4>會員中心</h4>
                  <Link href="/member">會員資料</Link>
                  <Link href="/member#my-courses">我的課程</Link>
                  <Link href="/member#account">帳號設定</Link>
                  <Link href="/member#orders">購買紀錄</Link>
                  <Link href="/member#coins">神話幣</Link>
                  <Link href="/member#scores">測驗成績</Link>
                </div>
                <Link href="/free-trial" className="dropdown-item">點我試聽</Link>
                <Link href="/contact" className="dropdown-item">點我洽詢</Link>
                <a href="#" className="dropdown-item logout">會員登出</a>
              </div>
            </li>
          </ul>

          <div className="nav-actions">
            <div className="search-wrap">
              <input
                type="search"
                className="search-input"
                placeholder="搜尋課程或文章"
                aria-label="搜尋"
              />
              <button type="button" className="search-btn" aria-label="搜尋">
                搜尋
              </button>
            </div>
            <Link href="/cart" className="cart-link" aria-label="購物車">
              <svg
                className="cart-link__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M5.2 5.4h2l1.4 9.1a2 2 0 0 0 2 1.7h6.7a2 2 0 0 0 1.9-1.4l1.1-4.4H9.2" />
                <path d="M7.2 5.4H4" />
                <circle cx="10.7" cy="20" r="1.35" />
                <circle cx="18" cy="20" r="1.35" />
              </svg>
              <span className="cart-link__badge">0</span>
            </Link>
            <Link href="/login" className="header-login-btn">
              會員登入
            </Link>
          </div>
        </nav>

        <button
          type="button"
          className="mobile-menu-btn"
          aria-label="開啟選單"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}
