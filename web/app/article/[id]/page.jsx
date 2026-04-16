import Link from 'next/link';
import { articles, getArticleById } from '../../../data/articles';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return articles.map((article) => ({ id: String(article.id) }));
}

export async function generateMetadata({ params }) {
  const article = getArticleById(params.id);
  if (!article) return { title: '文章 - 神話韓語' };
  return { title: `${article.title} - 神話韓語` };
}

export default function ArticlePage({ params }) {
  const article = getArticleById(params.id);
  if (!article) notFound();

  return (
    <main className="page-main">
      <section className="section">
        <div className="container container--narrow">
          <article className="article-detail">
            <p className="article-detail__category">{article.category}</p>
            <h1 className="page-title">{article.title}</h1>
            <p className="article-detail__meta">{article.date}</p>
            <div
              className="article-detail__body"
              dangerouslySetInnerHTML={{ __html: article.content.trim() }}
            />
            <p><Link href="/news">← 返回最新消息</Link></p>
          </article>
        </div>
      </section>
    </main>
  );
}
