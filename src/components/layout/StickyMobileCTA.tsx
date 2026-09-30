'use client';

import { usePathname } from 'next/navigation';
import { BUSINESS } from '@/lib/constants';
import { ESTIMATE_SMS_HREF } from '@/lib/estimate-sms';
import { trackEvent } from '@/lib/analytics';
import { primaryCtaForPath } from '@/lib/cta-intent';
import PhoneLink from '@/components/analytics/PhoneLink';
import TrackedLink from '@/components/analytics/TrackedLink';

/**
 * Mobile-only sticky CTA bar.
 *
 * Call and Text sit on the first row so a thumb can reach the number
 * without leaving the page. The primary action follows the page:
 * design-build surfaces get the consultation, roofing pages get the
 * instant quote, service templates stay on their in-page #estimate form,
 * and everything else goes to /contact#estimate. See src/lib/cta-intent.ts.
 */
export default function StickyMobileCTA() {
  const pathname = usePathname();
  const primaryCta = primaryCtaForPath(pathname);

  return (
    <div
      role="region"
      aria-label="Quick actions"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-charcoal-100 shadow-[0_-6px_18px_rgba(13,20,35,0.12)]"
    >
      <div
        className="flex flex-col gap-2 px-3 pt-3"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="grid grid-cols-2 gap-2">
          <PhoneLink
            location="sticky_mobile"
            className="flex items-center justify-center bg-navy-800 text-white font-semibold py-3 rounded-md text-sm hover:bg-navy-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400"
          >
            Call {BUSINESS.phone}
          </PhoneLink>
          <TrackedLink
            href={ESTIMATE_SMS_HREF}
            eventName="sms_click"
            eventParams={{ location: 'sticky_mobile' }}
            className="flex items-center justify-center border border-navy-800 text-navy-800 font-semibold py-3 rounded-md text-sm hover:bg-steel-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400"
          >
            Text {BUSINESS.phone}
          </TrackedLink>
        </div>
        <a
          href={primaryCta.href}
          onClick={() => trackEvent(primaryCta.eventName, { location: 'sticky_mobile' })}
          className="flex items-center justify-center bg-brand-red text-white font-semibold py-3 rounded-md text-sm hover:bg-brand-red-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
        >
          {primaryCta.label}
        </a>
      </div>
    </div>
  );
}
