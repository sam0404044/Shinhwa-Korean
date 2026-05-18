import Link from 'next/link';
import { articles } from '../data/articles';
import HeroCarousel from '../components/HeroCarousel';
import HomeCourseShowcase from '../components/HomeCourseShowcase';
import ReasonsScrollSpy from '../components/ReasonsScrollSpy';
import { courseCategories, courses } from '../data/courses';
import { assetPath } from '../lib/paths';

const heroSlides = [
  {
    image: assetPath('/assets/images/hero/hero-kdog-landing-desktop-01.webp'),
    mobileImage: assetPath('/assets/images/hero/hero-kdog-landing-mobile.webp'),
  },
  {
    image: assetPath('/assets/images/hero/hero-kdog-landing-desktop-02.webp'),
    mobileImage: assetPath('/assets/images/hero/hero-kdog-landing-mobile.webp'),
  },
  {
    image: assetPath('/assets/images/hero/hero-kdog-landing-desktop-03.webp'),
    mobileImage: assetPath('/assets/images/hero/hero-kdog-landing-mobile.webp'),
  },
  {
    image: assetPath('/assets/images/hero/hero-kdog-landing-desktop-04.webp'),
    mobileImage: assetPath('/assets/images/hero/hero-kdog-landing-mobile.webp'),
  },
  {
    image: assetPath('/assets/images/hero/hero-kdog-landing-desktop-05.webp'),
    mobileImage: assetPath('/assets/images/hero/hero-kdog-landing-mobile.webp'),
  },
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
  {
    image: assetPath('/assets/images/testimonials/avatar-01.webp'),
    role: '上班族',
    quote: '從發音開始學，現在可以聽懂簡單對話，追劇更有成就感！',
    date: '2025.01.21',
  },
  {
    image: assetPath('/assets/images/testimonials/avatar-02.webp'),
    role: '工程師',
    quote: '課程結構清楚，有講義也有測驗，TOPIK 初級考過了！',
    date: '2025.07.16',
  },
  {
    image: assetPath('/assets/images/testimonials/avatar-03.webp'),
    role: 'UI/UX 設計師',
    quote: '上了會話課之後，敢在見面會上說簡單的韓文了。',
    date: '2025.01.09',
  },
];

const reasons = [
  {
    title: '最迷人！閃閃發光的專業師資',
    text: '神話韓語師資萬中選一，老師從韓國首爾大學、東國大學等名校畢業，背景專業、熱情十足。臺籍、韓籍老師和您一起學習，一起體驗韓國，每堂課都是跨越疆界的真心相遇。',
    images: [
      assetPath('/assets/images/instructors/lena.webp'),
      assetPath('/assets/images/instructors/kim-sumin.webp'),
      assetPath('/assets/images/instructors/eo-yungyu.webp'),
    ],
  },
  {
    title: '最完整！步步精通的全面課程',
    text: '神話韓語從發音、初級、中級到高級，課程完整，加開旅遊會話、檢定考試、速成密集等主題課程。跟著神話韓語，之後能看韓劇、與韓國人真實對話，甚至長居韓國。',
    images: [assetPath('/assets/images/reasons/reason-curriculum.png')],
  },
  {
    title: '最持久！滿滿成就的學習體驗',
    text: '神話韓語的學員能克服學語言兩大障礙：沒有太多時間、缺乏成就無法持久。我們的課程根據大腦與心理研究分堂分節，設計高效練習，讓學員始終保持活力，逐步精通韓語。',
    images: [assetPath('/assets/images/reasons/reason-achievement.png')],
  },
  {
    title: '最入心！念念不忘的高效系統',
    text: '神話韓語獨家教材，精巧介面讓您快速了解韓語。每個例句乃至每個練習，都讓您更熟練韓語、了解韓國。線上學習自由安排時間，就算只有一點點時間，也能逐漸精通韓語。',
    images: [assetPath('/assets/images/reasons/reason-system.png')],
  },
  {
    title: '最感動！時時有您的親切陪伴',
    text: '神話韓語開設學員專屬群組，可以提出學習問題，也可以交流韓國體驗。人生要轟轟烈烈追求夢想，現在給自己勇氣學韓語，您心動，我們陪您一起心動，一起創造感動。',
    images: [assetPath('/assets/images/reasons/reason-community.png')],
  },
];

function CourseCard({ course }) {
  return (
    <article className="course-card">
      <Link href={`/course/${course.id}`} className="course-card__link">
        <div
          className="course-card__img"
          style={{ backgroundImage: `url(${course.image})` }}
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
    <main className="home-page">
      <section className="hero hero-kolanee hero-carousel">
        <HeroCarousel
          slides={heroSlides}
          title="神話韓語"
          subtitle="學韓語，我們相遇，更有了後續"
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
          </Link>
          <div className="article-grid">
            {articles.map((article) => (
              <article key={article.id} className="article-card">
                <Link href={`/article/${article.id}`}>
                  <img src={article.image} alt={article.title} className="article-card__img" />
                  <h3>{article.title}</h3>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <p className="article-meta">{article.date}</p>
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
                <div key={`${testimonial.role}-${index}`} className="testimonial-card">
                  <div
                    className="testimonial-card__avatar"
                    style={{ backgroundImage: `url(${testimonial.image})` }}
                  />
                  <h3>{testimonial.role}</h3>
                  <p className="testimonial-card__quote">「{testimonial.quote}」</p>
                  <p className="testimonial-card__date">{testimonial.date}</p>
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
          <h2
            className="section-title section-title--green section-title--decor"
            data-en="신화를 선택하는 이유"
          >
            選擇神話的理由
          </h2>
          <ReasonsScrollSpy reasons={reasons} />
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
      </section>
    </main>
  );
}
