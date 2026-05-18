import { articles, newsCategories } from '../../data/articles';
import NewsCategoryBrowser from '../../components/NewsCategoryBrowser';

export const metadata = { title: '最新消息 - 神話韓語' };

export default function NewsPage() {
  return (
    <main className="page-main">
      <section className="section">
        <div className="container">
          <h1 className="page-title section-title--green">最新消息</h1>
          <NewsCategoryBrowser articles={articles} categories={newsCategories} />
        </div>
      </section>
    </main>
  );
}
