import Link from 'next/link';
import { courseCategories, courses } from '../../data/courses';
import { assetPath } from '../../lib/paths';

export const metadata = {
  title: '課程列表 - 神話韓語',
};

const categoryImages = [
  assetPath('/assets/images/courses/01.png'),
  assetPath('/assets/images/courses/02.png'),
  assetPath('/assets/images/courses/03.png'),
  assetPath('/assets/images/courses/04.png'),
  assetPath('/assets/images/courses/01.png'),
];

const tones = ['coral', 'purple', 'peach', 'mint', 'coral'];

export default function CoursesPage() {
  const groupedCourses = courseCategories.map((category) => ({
    ...category,
    courses: courses.filter((course) => course.category === category.value),
  }));

  return (
    <main className="page-main">
      <section className="section section--pastel">
        <div className="container">
          <h1 className="page-title section-title--green">課程列表</h1>
          <p className="section-desc">
            依照學習目標選擇適合的課程，從基礎發音、單字文法到會話與主題課程，循序建立韓語能力。
          </p>

          <div className="course-category-grid">
            {courseCategories.map((category, index) => (
              <Link
                key={category.value}
                href={`#course-category-${category.value}`}
                className={`course-category-card course-category-card--${tones[index]}`}
              >
                <div
                  className="course-category-card__img"
                  style={{ backgroundImage: `url('${categoryImages[index]}')` }}
                />
                <span className="course-category-card__label">{category.label}</span>
              </Link>
            ))}
          </div>

          {groupedCourses.map((category) => (
            <section
              key={category.value}
              id={`course-category-${category.value}`}
              className="course-category-section"
            >
              <h2 className="course-category-section__title">{category.label}</h2>
              <div className="course-grid">
                {category.courses.map((course) => (
                  <article key={course.id} className="course-card">
                    <Link href={`/course/${course.id}`} className="course-card__link">
                      <div
                        className="course-card__img"
                        style={{ backgroundImage: `url('${course.image}')` }}
                      />
                      <div className="course-card__body">
                        <h3 className="course-card__title">{course.title}</h3>
                        <p>{course.description}</p>
                        <p className="course-card__price">
                          {course.priceOriginal ? (
                            <span className="course-card__price--old">
                              NT$ {course.priceOriginal.toLocaleString()}
                            </span>
                          ) : null}
                          {' '}NT$ {course.price.toLocaleString()}
                        </p>
                        <button type="button" className="btn btn-primary btn--small">加入購物車</button>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
