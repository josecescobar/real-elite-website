'use client';

import { useEffect, useState } from 'react';
import type { GuideHeading } from '@/lib/blog';

type Props = {
  headings: GuideHeading[];
};

/**
 * Auto-generated table of contents.
 * Sticky on lg+. Highlights the section currently in view via
 * IntersectionObserver. Mobile: collapsible details/summary.
 */
export default function TableOfContents({ headings }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;
    const ids = headings.map((h) => h.id);
    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer the topmost intersecting heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-100px 0px -65% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="text-sm"
    >
      <p className="text-[0.65rem] uppercase tracking-[0.18em] font-semibold text-brand-red mb-3">
        On this page
      </p>
      <ul className="space-y-2 border-l border-charcoal-200">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
              <a
                href={`#${h.id}`}
                className={`block py-1 -ml-px border-l-2 pl-3 transition-colors ${
                  isActive
                    ? 'border-brand-red text-navy-800 font-semibold'
                    : 'border-transparent text-charcoal-600 hover:text-navy-800'
                } ${h.level === 3 ? 'text-xs' : ''}`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
