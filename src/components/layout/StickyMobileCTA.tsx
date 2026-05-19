'use client';

import { BUSINESS } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

const CALENDLY_URL = 'https://calendly.com/realelitecontracting-info/free-estimate-call';

export default function StickyMobileCTA() {
  return (
    <div
      role="region"
      aria-label="Quick actions"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-charcoal-100 shadow-[0_-6px_18px_rgba(13,20,35,0.12)]"
    >
      <div
        className="grid grid-cols-2 gap-2 px-3 pt-3"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <a
          href={`tel:${BUSINESS.phoneRaw}`}
          onClick={() => trackEvent('phone_click', { location: 'sticky_mobile' })}
          className="flex items-center justify-center bg-navy-800 text-white font-semibold py-3 rounded-md text-sm hover:bg-navy-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400"
        >
          Call {BUSINESS.phone}
        </a>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('calendly_click', { location: 'sticky_mobile' })}
          className="flex items-center justify-center bg-brand-red text-white font-semibold py-3 rounded-md text-sm hover:bg-brand-red-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
        >
          Free Estimate
        </a>
      </div>
    </div>
  );
}
