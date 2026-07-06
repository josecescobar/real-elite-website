'use client';

import Link from 'next/link';
import { BookOpen, Phone, ArrowRight } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

/**
 * The "second act" shown after a form succeeds: instead of a dead-end
 * confirmation, give the visitor two useful next moves while they wait — a
 * relevant guide to keep reading, and a one-tap call if they'd rather talk now.
 * Both are tracked as `post_lead_click` so the value of the second act is
 * measurable. No email-list gimmicks.
 */
export default function SuccessNextSteps({
  guideHref,
  guideLabel,
}: {
  guideHref?: string;
  guideLabel?: string;
}) {
  return (
    <div className="mt-8 pt-6 border-t border-charcoal-100 text-left max-w-md mx-auto">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-charcoal-500 mb-3">
        While you wait
      </p>
      <div className="flex flex-col gap-2.5">
        {guideHref && guideLabel && (
          <Link
            href={guideHref}
            onClick={() => trackEvent('post_lead_click', { action: 'guide' })}
            className="group inline-flex items-center gap-3 rounded-md border border-charcoal-100 bg-steel-50 px-4 py-3 text-sm font-semibold text-navy-800 transition-colors hover:border-brand-red/40 focus-ring"
          >
            <BookOpen className="w-4 h-4 flex-shrink-0 text-brand-red" aria-hidden="true" />
            <span className="flex-1">{guideLabel}</span>
            <ArrowRight className="w-4 h-4 flex-shrink-0 text-charcoal-400 group-hover:text-brand-red" aria-hidden="true" />
          </Link>
        )}
        <a
          href={`tel:${BUSINESS.phoneRaw}`}
          onClick={() => trackEvent('post_lead_click', { action: 'call' })}
          className="group inline-flex items-center gap-3 rounded-md border border-charcoal-100 bg-steel-50 px-4 py-3 text-sm font-semibold text-navy-800 transition-colors hover:border-brand-red/40 focus-ring"
        >
          <Phone className="w-4 h-4 flex-shrink-0 text-brand-red" aria-hidden="true" />
          <span className="flex-1">Prefer to talk now? Call {BUSINESS.phone}</span>
          <ArrowRight className="w-4 h-4 flex-shrink-0 text-charcoal-400 group-hover:text-brand-red" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
