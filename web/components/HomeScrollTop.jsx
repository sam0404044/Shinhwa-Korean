'use client';

import { useEffect } from 'react';

export default function HomeScrollTop() {
  useEffect(() => {
    if (window.location.pathname !== '/' || window.location.hash) return;

    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };
    resetScroll();
    requestAnimationFrame(resetScroll);
    const timer = window.setTimeout(resetScroll, 100);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
