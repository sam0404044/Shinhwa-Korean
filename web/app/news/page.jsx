import NewsCategoryBrowser from '../../components/NewsCategoryBrowser';
import { prisma } from '../../lib/prisma';

export const dynamic = 'force-dynamic';
export const metadata = { title: '最新消息 - 神話韓語' };

export default async function NewsPage() {
  const records = await prisma.article.findMany({ where: { published: true }, orderBy: [{ date: 'desc' }, { id: 'desc' }] });
  const articles = records.map((article) => ({ ...article, date: article.date.toISOString().slice(0, 10), image: article.imageUrl }));
  const categories = ['全部', ...Array.from(new Set(records.map((article) => article.category).filter(Boolean)))];
  return <main className="page-main"><section className="section"><div className="container"><h1 className="page-title section-title--green">最新消息</h1><NewsCategoryBrowser articles={articles} categories={categories} /></div></section></main>;
}
