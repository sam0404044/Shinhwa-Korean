'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

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

export default function HomeCourseShowcase({
  categories,
  courses,
  categoryImages,
  categoryTones,
}) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.value ?? '');

  const visibleCourses = useMemo(() => {
    return courses.filter((course) => course.category === activeCategory).slice(0, 3);
  }, [activeCategory, courses]);

  return (
    <>
      <div className="course-category-grid">
        {categories.map((category, index) => {
          const isActive = category.value === activeCategory;

          return (
            <button
              key={category.value}
              type="button"
              className={`course-category-card course-category-card--${categoryTones[index]}${isActive ? ' is-active' : ''}`}
              onClick={() => setActiveCategory(category.value)}
              aria-pressed={isActive}
            >
              <div
                className="course-category-card__img"
                style={{ backgroundImage: `url('${categoryImages[index]}')` }}
              />
              <span className="course-category-card__label">{category.shortLabel}</span>
            </button>
          );
        })}
      </div>

      <div className="course-grid">
        {visibleCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <div className="course-showcase__action">
        <Link href={`/courses#course-category-${activeCategory}`} className="btn btn-outline btn--small">
          查看這個分類
        </Link>
      </div>
    </>
  );
}
