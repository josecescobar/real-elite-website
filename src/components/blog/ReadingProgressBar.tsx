'use client';

import { useEffect, useState } from 'react';

/**
 * Top-of-page scroll-progress bar for guide articles.
 * Renders as a thin brand-red track that fills as the user scrolls.
 */
export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-brand-red transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
