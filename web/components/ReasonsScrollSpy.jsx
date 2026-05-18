'use client';

import { useEffect, useRef, useState } from 'react';

function splitReasonTitle(title) {
  const breakAt = title.indexOf('！');
  if (breakAt === -1) {
    return { headline: title, subtitle: '' };
  }
  return {
    headline: title.slice(0, breakAt + 1),
    subtitle: title.slice(breakAt + 1),
  };
}

export default function ReasonsScrollSpy({ reasons }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef([]);

  useEffect(() => {
    const items = reasons
      .map((_, index) => document.getElementById(`reason-${index + 1}`))
      .filter(Boolean);

    if (!items.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) return;

        const nextIndex = Number(visibleEntry.target.dataset.reasonIndex);
        if (!Number.isNaN(nextIndex)) {
          setActiveIndex(nextIndex);
        }
      },
      {
        root: null,
        rootMargin: '-42% 0px -42% 0px',
        threshold: [0, 0.15, 0.3, 0.45, 0.6],
      },
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [reasons]);

  useEffect(() => {
    tabRefs.current[activeIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeIndex]);

  return (
    <>
      <nav className="reasons-tabs" aria-label="選擇神話的理由">
        {reasons.map((reason, index) => {
          const { headline, subtitle } = splitReasonTitle(reason.title);
          const isActive = index === activeIndex;

          return (
            <a
              key={reason.title}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              href={`#reason-${index + 1}`}
              className={`reasons-tab${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => setActiveIndex(index)}
            >
              <span className="reasons-tab__num">{index + 1}</span>
              <span className="reasons-tab__label">
                <span className="reasons-tab__headline">{headline}</span>
                {subtitle ? <span className="reasons-tab__subtitle">{subtitle}</span> : null}
              </span>
            </a>
          );
        })}
      </nav>

      <div className="reasons-list reasons-list--detailed">
        {reasons.map((reason, index) => (
          <article
            key={reason.title}
            id={`reason-${index + 1}`}
            data-reason-index={index}
            className="reason-item reason-item--detailed"
          >
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
    </>
  );
}
