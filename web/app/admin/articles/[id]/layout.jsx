import { articles } from '../../../../data/articles';

export function generateStaticParams() {
  return articles.map((article) => ({ id: String(article.id) }));
}

export default function AdminArticleIdLayout({ children }) {
  return children;
}
