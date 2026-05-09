'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const SWIPE_THRESHOLD = 50;

export default function HeroCarousel({ slides, title, subtitle }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const pointerStartX = useRef(null);
  const isDragging = useRef(false);
  const isSingleSlide = slides.length <= 1;

  useEffect(() => {
    if (isSingleSlide) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isSingleSlide, slides.length]);

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
        onPointerDown={isSingleSlide ? undefined : handlePointerDown}
        onPointerMove={isSingleSlide ? undefined : handlePointerMove}
        onPointerUp={isSingleSlide ? undefined : handlePointerEnd}
        onPointerCancel={isSingleSlide ? undefined : handlePointerEnd}
        onPointerLeave={isSingleSlide ? undefined : handlePointerEnd}
      >
        <div
          className="hero-carousel__track"
          style={{
            transform: `translateX(calc(${-100 * activeIndex}% + ${dragOffset}px))`,
          }}
        >
          {slides.map((slide, index) => {
            const desktopImage = typeof slide === 'string' ? slide : slide.image;
            const mobileImage = typeof slide === 'string' ? slide : slide.mobileImage || slide.image;

            return (
              <div
                key={desktopImage}
                className="hero-carousel__slide"
                style={{
                  '--hero-desktop-image': `url(${desktopImage})`,
                  '--hero-mobile-image': `url(${mobileImage})`,
                }}
                aria-hidden={index !== activeIndex}
              />
            );
          })}
        </div>
      </div>

      <div className="hero-overlay hero-overlay--light">
        {title ? <h1>{title}</h1> : null}
        {subtitle ? <p>{subtitle}</p> : null}
        <div className="hero-cta">
          <Link href="/news" className="btn btn-hero">
            最新消息
          </Link>
          <Link href="/courses" className="btn btn-hero btn-hero--outline">
            課程列表
          </Link>
        </div>
      </div>

      {!isSingleSlide ? (
        <div className="hero-carousel__controls" aria-label="首頁圖片輪播">
          <button
            type="button"
            className="hero-carousel__arrow"
            onClick={goToPrevious}
            aria-label="上一張"
          >
            &lt;
          </button>
          <div className="hero-carousel__dots" aria-label="選擇輪播圖片">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`hero-carousel__dot${index === activeIndex ? ' is-active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`第 ${index + 1} 張`}
                aria-pressed={index === activeIndex}
              />
            ))}
          </div>
          <button
            type="button"
            className="hero-carousel__arrow"
            onClick={goToNext}
            aria-label="下一張"
          >
            &gt;
          </button>
        </div>
      ) : null}
    </>
  );
}
