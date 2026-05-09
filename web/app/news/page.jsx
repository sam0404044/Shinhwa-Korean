import Link from 'next/link';
import { articles, newsCategories } from '../../data/articles';

export const metadata = { title: '最新消息 - 神話韓語' };

export default function NewsPage() {
  return (
    <main className="page-main">
      <section className="section">
        <div className="container">
          <h1 className="page-title section-title--green">最新消息</h1>
          <div className="news-filter-row" aria-label="最新消息分類">
            {newsCategories.map((category) => (
              <Link key={category} href="/news" className="news-filter-chip">{category}</Link>
            ))}
          </div>
          <div className="article-grid">
            {articles.map((a) => (
              <article key={a.id} className="article-card">
                <Link href={`/article/${a.id}`}>
                  <img src={a.image} alt={a.title} className="article-card__img" />
                  <h3>{a.title}</h3>
                  <p className="article-excerpt">{a.excerpt}</p>
                  <p className="article-meta">{a.category} · {a.date}</p>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
