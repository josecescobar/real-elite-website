'use client';

import { ShieldCheck, ExternalLink } from 'lucide-react';
import { liveBadges } from '@/lib/social-proof';
import { trackEvent } from '@/lib/analytics';

/**
 * Third-party trust badge row (Google / BBB / Angi). Renders ONLY the badges
 * whose profile URL is configured in `SOCIAL_PROOF.badges` — so nothing shows
 * until a real, live profile exists. No fake trust badges, ever.
 */
export default function TrustBadges({ className = '' }: { className?: string }) {
  const badges = liveBadges();
  if (badges.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      {badges.map((badge) => (
        <a
          key={badge.name}
          href={badge.href as string}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('trust_badge_click', { badge: badge.name })}
          className="group inline-flex items-center gap-2 bg-steel-50 border border-charcoal-100 rounded-md px-4 py-2 text-sm font-semibold text-navy-800 hover:border-brand-red hover:text-brand-red transition-colors focus-ring"
        >
          <ShieldCheck className="w-4 h-4 text-brand-red" aria-hidden="true" />
          {badge.label}
          <ExternalLink
            className="w-3.5 h-3.5 text-charcoal-400 group-hover:text-brand-red transition-colors"
            aria-hidden="true"
          />
        </a>
      ))}
    </div>
  );
}
