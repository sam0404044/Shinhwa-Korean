'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getArticleById } from '../data/articles';
import { getCourseById } from '../data/courses';
import { getInstructorById } from '../data/instructors';
import { getTestimonialById } from '../data/testimonials';

const staticLabels = {
  about: '關於我們',
  cart: '購物車',
  checkout: '結帳',
  contact: '點我洽詢',
  courses: '課程列表',
  'course-play': '課程播放',
  'forgot-password': '忘記密碼',
  'free-trial': '點我試聽',
  instructors: '師資介紹',
  login: '會員登入',
  member: '會員中心',
  news: '最新消息',
  'payment-result': '付款結果',
  register: '建立新帳號',
  'reset-password': '重設密碼',
  testimonials: '學員見證',
};

const sectionParents = {
  article: { label: '最新消息', href: '/news' },
  course: { label: '課程列表', href: '/courses' },
  instructor: { label: '師資介紹', href: '/instructors' },
  testimonial: { label: '學員見證', href: '/testimonials' },
};

function getDetailLabel(section, id) {
  if (section === 'article') {
    return getArticleById(id)?.title;
  }
  if (section === 'course') {
    return getCourseById(id)?.title;
  }
  if (section === 'instructor') {
    return getInstructorById(id)?.name;
  }
  if (section === 'testimonial') {
    return getTestimonialById(id)?.name;
  }
  return null;
}

function buildBreadcrumbItems(pathname) {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return [{ label: '首頁', href: '/' }];
  }

  const [first, second] = segments;
  const parent = sectionParents[first];

  if (parent && second) {
    return [
      { label: '首頁', href: '/' },
      parent,
      { label: getDetailLabel(first, second) || staticLabels[first] || first, href: null },
    ];
  }

  return [
    { label: '首頁', href: '/' },
    { label: staticLabels[first] || first, href: null },
  ];
}

export default function Breadcrumb() {
  const pathname = usePathname() || '/';
  const items = buildBreadcrumbItems(pathname);

  if (items.length === 1 && items[0].href === '/') {
    return null;
  }

  return (
    <nav className="site-breadcrumb" aria-label="目前位置">
      <ol className="site-breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="site-breadcrumb__item">
              {item.href && !isLast ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
