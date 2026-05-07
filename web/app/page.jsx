import Link from 'next/link';
import { articles, newsCategories } from '../data/articles';
import HeroCarousel from '../components/HeroCarousel';
import HomeCourseShowcase from '../components/HomeCourseShowcase';
import { courseCategories, courses } from '../data/courses';
import { assetPath } from '../lib/paths';

const heroSlides = [
  assetPath('/assets/images/hero/hero-kdog-landing-desktop.webp'),
  assetPath('/assets/images/content/01.webp'),
  assetPath('/assets/images/content/02.webp'),
  assetPath('/assets/images/content/03.webp'),
  assetPath('/assets/images/content/04.webp'),
];

const categoryImages = [
  assetPath('/assets/images/courses/01.webp'),
  assetPath('/assets/images/courses/02.webp'),
  assetPath('/assets/images/courses/03.webp'),
  assetPath('/assets/images/courses/04.webp'),
  assetPath('/assets/images/courses/01.webp'),
];

const categoryTones = ['coral', 'purple', 'peach', 'mint', 'coral'];

const testimonials = [
  { image: assetPath('/assets/images/testimonials/avatar-01.webp'), text: '學員見證 1' },
  { image: assetPath('/assets/images/testimonials/avatar-02.webp'), text: '學員見證 2' },
  { image: assetPath('/assets/images/testimonials/avatar-03.webp'), text: '學員見證 3' },
  { image: assetPath('/assets/images/testimonials/avatar-01.webp'), text: '學員見證 4' },
  { image: assetPath('/assets/images/testimonials/avatar-02.webp'), text: '學員見證 5' },
];

const reasons = [
  {
    title: '最迷人，閃閃發光的專業師資',
    text: '神話韓語師資萬中選一，老師從韓國首爾大學、東國大學等名校畢業，背景專業、熱情十足。和韓籍老師與你一起學習，一起體驗韓國，每堂課都是跨越疆界的真心相遇。',
    images: [
      assetPath('/assets/images/testimonials/avatar-01.webp'),
      assetPath('/assets/images/testimonials/avatar-02.webp'),
      assetPath('/assets/images/testimonials/avatar-03.webp'),
    ],
  },
  {
    title: '最完整，步步精通的學習地圖',
    text: '從發音、文法、會話到主題應用，課程節奏清楚、階段分明。你可以循序漸進，也能依照自己的目標挑選合適內容，穩穩把韓語實力一段一段堆起來。',
    images: [assetPath('/assets/images/courses/01.webp')],
  },
  {
    title: '最多元，貼近生活的主題內容',
    text: '旅行、追星、留學、職場、TOPIK 考試準備，神話把你真正會用到的情境都放進課堂。學到的不只是單字和句型，而是可以立刻說出口、用得上的韓語。',
    images: [assetPath('/assets/images/courses/02.webp')],
  },
  {
    title: '最彈性，跟上你的學習節奏',
    text: '不論你想固定排課、自由安排，或是在忙碌生活中穿插學習，我們都保留足夠彈性。讓學韓語不再是壓力，而是能長久維持的日常習慣。',
    images: [assetPath('/assets/images/courses/03.webp')],
  },
  {
    title: '最貼心，陪你把目標走到最後',
    text: '從試聽、選課到正式上課，我們都希望讓你感覺被接住。遇到問題能找到人、想調整方向也有人陪你討論，讓每一次開始都更有底氣。',
    images: [assetPath('/assets/images/courses/04.webp')],
  },
];

function CourseCard({ course }) {
  return (
    <article className="course-card">
      <Link href={`/course/${course.id}`} className="course-card__link">
        <div
          className="course-card__img"
          style={{ backgroundImage: `url('${course.image}')` }}
        />
        <div className="course-card__body">
          <h3 className="course-card__title">{course.title}</h3>
          <p className="course-card__price">
            {course.priceOriginal ? (
              <span className="course-card__price--old">NT$ {course.priceOriginal.toLocaleString()}</span>
            ) : null}
            {' '}NT$ {course.price.toLocaleString()}
          </p>
        </div>
      </Link>
    </article>
  );
}

function SectionWaveDivider({ tone = 'white', id = tone, className = '' }) {
  const gradientId = `section-wave-gradient-${id}`;

  return (
    <svg
      className={`wave-divider wave-divider--${tone} ${className}`.trim()}
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {tone === 'gradient' ? (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c68b6" />
            <stop offset="35%" stopColor="#9e63d2" />
            <stop offset="70%" stopColor="#ff8ac6" />
            <stop offset="100%" stopColor="#ffd1f2" />
          </linearGradient>
        </defs>
      ) : null}
      <path
        fill={tone === 'gradient' ? `url(#${gradientId})` : 'currentColor'}
        d="M0 68C120 28 240 18 360 46C480 74 600 120 720 86C840 52 960 10 1080 36C1200 62 1320 112 1440 76V120H0V68Z"
      />
    </svg>
  );
}

export default function HomePage() {
  const bestCourses = courses.filter((course) => course.best).slice(0, 3);

  return (
    <main>
      <section className="hero hero-kolanee hero-carousel">
        <HeroCarousel
          slides={heroSlides}
          title="學韓語，我們相遇，更有了後續"
          subtitle="신화 한국어 · Shinhwa Korean"
        />
        <SectionWaveDivider tone="gradient" id="hero-courses" className="wave-divider--overlap-top" />
      </section>

      <section className="section section-courses section--pastel" id="courses">
        <div className="container">
          <h2
            className="section-title section-title--green section-title--decor section-title--on-gradient"
            data-en="인기 콘텐츠"
          >
            熱門課程
          </h2>
          <HomeCourseShowcase
            categories={courseCategories}
            courses={courses}
            categoryImages={categoryImages}
            categoryTones={categoryTones}
          />
        </div>
        <SectionWaveDivider tone="white" id="courses-news" className="wave-divider--section-bottom" />
      </section>

      <section className="section section-news dots-decor" id="news">
        <div className="container">
          <Link href="/news" className="news-card">
            <div className="news-card__text">
              <h2
                className="section-title section-title--green section-title--left section-title--decor"
                data-en="최신 소식 / 공지사항"
              >
                最新消息 / 公告事項
              </h2>
              <p className="news-card__sub">掌握最新開課、活動、優惠與網站更新，重要通知都整理在這裡。</p>
              <span className="btn btn-outline btn--small">閱讀更多</span>
            </div>
            <div
              className="news-card__illus"
              style={{ backgroundImage: `url('${assetPath('/assets/images/content/news.webp')}')` }}
            />
          </Link>
          <div className="news-filter-row" aria-label="最新消息分類">
            {newsCategories.map((category) => (
              <Link key={category} href="/news" className="news-filter-chip">{category}</Link>
            ))}
          </div>
          <div className="article-grid">
            {articles.map((article) => (
              <article key={article.id} className="article-card">
                <Link href={`/article/${article.id}`}>
                  <img src={article.image} alt={article.title} className="article-card__img" />
                  <h3>{article.title}</h3>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <p className="article-meta">{article.category} · {article.date}</p>
                </Link>
              </article>
            ))}
          </div>
        </div>
        <SectionWaveDivider tone="gradient" id="news-testimonials" className="wave-divider--section-bottom" />
      </section>

      <section className="section section-testimonials" id="testimonials">
        <div className="section-wave-panel section-wave-panel--dark">
          <div className="section-wave-panel__inner container">
            <h2
              className="section-title section-title--green section-title--decor section-title--on-gradient"
              data-en="수강생들의 리얼 후기"
            >
              學員見證
            </h2>
            <div className="testimonial-grid">
              {testimonials.map((testimonial, index) => (
                <div key={`${testimonial.text}-${index}`} className="testimonial-card">
                  <div
                    className="testimonial-card__avatar"
                    style={{ backgroundImage: `url('${testimonial.image}')` }}
                  />
                  <p>{testimonial.text}</p>
                </div>
              ))}
            </div>
            <Link href="/testimonials" className="btn btn-outline btn--green">更多見證</Link>
          </div>
          <SectionWaveDivider tone="white" id="testimonials-reasons" className="wave-divider--section-bottom" />
        </div>
      </section>

      <section className="section section-reasons dots-decor">
        <div className="container">
          <h2 className="section-title section-title--decor" data-en="신화를 선택하는 이유">
            選擇神話的理由
          </h2>
          <div className="reasons-list reasons-list--detailed">
            {reasons.map((reason, index) => (
              <article key={reason.title} className="reason-item reason-item--detailed">
                <div className="reason-item__copy">
                  <span className="reason-num">{index + 1}</span>
                  <h3>{reason.title}</h3>
                  <p>{reason.text}</p>
                </div>
                <div className="reason-gallery">
                  {reason.images.map((image) => (
                    <img key={image} src={image} alt="" />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
        <SectionWaveDivider tone="gradient" id="reasons-featured" className="wave-divider--section-bottom" />
      </section>

      <section className="section section-featured-carousel">
        <div className="container">
          <h2
            className="section-title section-title--decor section-title--on-gradient"
            data-en="베스트 강의"
          >
            精選課程
          </h2>
          <div className="featured-carousel">
            <div className="featured-track">
              {bestCourses.map((course) => (
                <div key={course.id} className="featured-slide">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          </div>
          <Link href="/courses" className="btn btn-primary">所有課程</Link>
        </div>
        <SectionWaveDivider tone="gradient" id="featured-footer" className="wave-divider--section-bottom" />
      </section>
    </main>
  );
}
