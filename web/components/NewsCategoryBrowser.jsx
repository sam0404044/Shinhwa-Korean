'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

function getCategoryHref(category) {
  if (category === '全部分類') return '/news';
  return `/news?category=${encodeURIComponent(category)}`;
}

function getCategoryFromUrl(categories) {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category') || '全部分類';
  return categories.includes(category) ? category : '全部分類';
}

export default function NewsCategoryBrowser({ articles, categories }) {
  const [selectedCategory, setSelectedCategory] = useState('全部分類');

  useEffect(() => {
    function syncCategoryFromUrl() {
      setSelectedCategory(getCategoryFromUrl(categories));
    }

    syncCategoryFromUrl();
    window.addEventListener('popstate', syncCategoryFromUrl);

    return () => {
      window.removeEventListener('popstate', syncCategoryFromUrl);
    };
  }, [categories]);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === '全部分類') return articles;
    return articles.filter((article) => article.category === selectedCategory);
  }, [articles, selectedCategory]);

  function handleCategoryClick(event, category) {
    event.preventDefault();
    setSelectedCategory(category);
    window.history.pushState(null, '', getCategoryHref(category));
  }

  return (
    <>
      <div className="news-filter-row" aria-label="最新消息分類">
        {categories.map((category) => {
          const isActive = category === selectedCategory;

          return (
            <Link
              key={category}
              href={getCategoryHref(category)}
              className={`news-filter-chip${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={(event) => handleCategoryClick(event, category)}
            >
              {category}
            </Link>
          );
        })}
      </div>
      <div className="article-grid">
        {filteredArticles.map((article) => (
          <article key={article.id} className="article-card">
            <Link href={`/article/${article.id}`}>
              <img src={article.image} alt={article.title} className="article-card__img" />
              <span className="article-card__tag">{article.category}</span>
              <h3>{article.title}</h3>
              <p className="article-excerpt">{article.excerpt}</p>
              <p className="article-meta">{article.category} · {article.date}</p>
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
