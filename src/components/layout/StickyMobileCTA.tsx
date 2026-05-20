'use client';

import { usePathname } from 'next/navigation';
import { BUSINESS } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

/**
 * Mobile-only sticky CTA bar.
 *
 * "Free Estimate" routes to the in-page #estimate anchor when the user
 * is already on the homepage or /contact (where the form lives), and
 * to "/#estimate" otherwise so a click navigates to the homepage and
 * scrolls to the form.
 */
export default function StickyMobileCTA() {
  const pathname = usePathname();
  const onFormPage = pathname === '/' || pathname === '/contact';
  const estimateHref = onFormPage ? '#estimate' : '/#estimate';

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
          href={estimateHref}
          onClick={() =>
            trackEvent('estimate_cta_click', { location: 'sticky_mobile' })
          }
          className="flex items-center justify-center bg-brand-red text-white font-semibold py-3 rounded-md text-sm hover:bg-brand-red-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
        >
          Free Estimate
        </a>
      </div>
    </div>
  );
}
