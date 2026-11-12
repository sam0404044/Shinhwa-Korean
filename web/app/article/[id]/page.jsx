import { headers } from 'next/headers';
import { getArticleThumbnail } from '../../../lib/article-thumbnail';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) {
  const article = await prisma.article.findFirst({ where: { id: Number(params.id), published: true } });
  if (!article) return { title: '文章 - 神話韓語' };

  const requestHeaders = headers();
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host');
  const protocol = requestHeaders.get('x-forwarded-proto') === 'http' ? 'http' : 'https';
  const thumbnail = getArticleThumbnail(article);
  const image = host ? new URL(thumbnail, `${protocol}://${host}`).href : thumbnail;
  const title = `${article.title} - 神話韓語`;
  const description = article.excerpt || undefined;
  return {
    title,
    description,
    openGraph: { type: 'article', title, description, images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function ArticlePage({ params }) {
  const article = await prisma.article.findFirst({ where: { id: Number(params.id), published: true } });
  if (!article) notFound();
  return <main className="page-main"><section className="section"><div className="container container--narrow"><article className="article-detail">{article.imageUrl ? <img src={article.imageUrl} alt="" style={{ width: '100%', maxHeight: 380, objectFit: 'cover', borderRadius: 8 }} /> : null}<p className="article-detail__category">{article.category}</p><h1 className="page-title">{article.title}</h1><p className="article-detail__meta">{article.date.toISOString().slice(0, 10)}</p><div className="article-detail__body" dangerouslySetInnerHTML={{ __html: article.content || article.excerpt || '' }} /><p><Link href="/news">← 返回最新消息</Link></p></article></div></section></main>;
}
