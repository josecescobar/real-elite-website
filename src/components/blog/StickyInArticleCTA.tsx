'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import type { PrimaryCta } from '@/lib/cta-intent';

/**
 * Mid-scroll mobile sticky CTA shown inside guide articles.
 * Appears after the reader scrolls ~30% into the page; dismissible.
 * Sits above the global StickyMobileCTA bar via z-index ordering.
 *
 * GuideTemplate resolves the CTA from the article's own path, so a roofing
 * guide offers the instant roof quote rather than the generic estimate form.
 * The defaults keep the previous behaviour for any caller that passes nothing.
 */
type Props = {
  cta?: PrimaryCta;
  prompt?: string;
  subtext?: string;
};

export default function StickyInArticleCTA({
  cta,
  prompt = 'Thinking about a project like this?',
  subtext = 'Free written estimate, no pressure.',
}: Props = {}) {
  const href = cta?.href ?? '/contact#estimate';
  const label = cta?.intent === 'roof-quote' ? 'Get Roof Quote' : 'Get Estimate';
  const eventName = cta?.eventName ?? 'estimate_cta_click';
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      setVisible(pct > 30);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  if (dismissed || !visible) return null;

  return (
    <div
      role="region"
      aria-label="Estimate prompt"
      className="lg:hidden fixed bottom-[80px] inset-x-0 z-30 px-3"
    >
      <div className="bg-navy-800 text-white rounded-lg shadow-card-elevated p-4 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight">
            {prompt}
          </p>
          <p className="text-charcoal-300 text-xs mt-0.5">{subtext}</p>
        </div>
        <a
          href={href}
          onClick={() => trackEvent(eventName, { location: 'guide_sticky' })}
          className="bg-brand-red text-white px-4 py-2.5 rounded-md font-semibold text-xs hover:bg-brand-red-dark transition-colors inline-flex items-center gap-1 flex-shrink-0"
        >
          {label}
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss estimate prompt"
          className="text-charcoal-400 hover:text-white transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
