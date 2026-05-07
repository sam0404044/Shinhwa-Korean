'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const SWIPE_THRESHOLD = 50;

export default function HeroCarousel({ slides, title, subtitle }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const pointerStartX = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setActiveIndex(index);
    setDragOffset(0);
  };

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
    setDragOffset(0);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
    setDragOffset(0);
  };

  const handlePointerDown = (event) => {
    pointerStartX.current = event.clientX;
    isDragging.current = true;
  };

  const handlePointerMove = (event) => {
    if (!isDragging.current || pointerStartX.current === null) {
      return;
    }

    setDragOffset(event.clientX - pointerStartX.current);
  };

  const handlePointerEnd = () => {
    if (!isDragging.current) {
      return;
    }

    if (dragOffset <= -SWIPE_THRESHOLD) {
      goToNext();
    } else if (dragOffset >= SWIPE_THRESHOLD) {
      goToPrevious();
    } else {
      setDragOffset(0);
    }

    pointerStartX.current = null;
    isDragging.current = false;
  };

  return (
    <>
      <div
        className="hero-carousel__viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
      >
        <div
          className="hero-carousel__track"
          style={{
            transform: `translateX(calc(${-100 * activeIndex}% + ${dragOffset}px))`,
          }}
        >
          {slides.map((image, index) => (
            <div
              key={image}
              className="hero-carousel__slide"
              style={{ backgroundImage: `url('${image}')` }}
              aria-hidden={index !== activeIndex}
            />
          ))}
        </div>
      </div>

      <div className="hero-overlay hero-overlay--light">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <div className="hero-cta">
          <Link href="/free-trial" className="btn btn-hero">點我試聽</Link>
          <Link href="/contact" className="btn btn-hero btn-hero--outline">點我洽詢</Link>
        </div>
      </div>

      <div className="hero-carousel__controls" aria-label="首頁輪播控制">
        <button type="button" className="hero-carousel__arrow" onClick={goToPrevious} aria-label="上一張">
          ‹
        </button>
        <div className="hero-carousel__dots" aria-label="首頁輪播分頁">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`hero-carousel__dot${index === activeIndex ? ' is-active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`前往第 ${index + 1} 張`}
              aria-pressed={index === activeIndex}
            />
          ))}
        </div>
        <button type="button" className="hero-carousel__arrow" onClick={goToNext} aria-label="下一張">
          ›
        </button>
      </div>
    </>
  );
}
