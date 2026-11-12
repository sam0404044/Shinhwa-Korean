import NewsCategoryBrowser from '../../components/NewsCategoryBrowser';
import { getPublishedArticles } from '../../lib/public-content';

export const dynamic = 'force-dynamic';
export const metadata = { title: '最新消息 - 神話韓語' };

export default async function NewsPage() {
  const articles = await getPublishedArticles();
  const categories = ['全部', ...Array.from(new Set(articles.map((article) => article.category).filter(Boolean)))];
  return <main className="page-main"><section className="section"><div className="container"><h1 className="page-title section-title--green">最新消息</h1><NewsCategoryBrowser articles={articles} categories={categories} /></div></section></main>;
}
