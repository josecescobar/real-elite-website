import Link from 'next/link';
import { Camera } from 'lucide-react';
import TrackedLink from '@/components/analytics/TrackedLink';
import { BUSINESS } from '@/lib/constants';
import { ESTIMATE_SMS_HREF } from '@/lib/estimate-sms';

type SendPhotosBlockProps = {
  /** GA4 slot for the sms_click event, e.g. `service_kitchens_photos`. */
  location: string;
  /** Where the form link points. Defaults to the consultation form. */
  formHref?: string;
  formLabel?: string;
  className?: string;
};

/**
 * "Text us a photo" lead path.
 *
 * The site already advertises texting the main business number (header,
 * sticky mobile bar, contact page, homepage CTA), so this block uses the same
 * ESTIMATE_SMS_HREF and fires the same `sms_click` event, with its own
 * location. It deliberately makes NO reply-time promise: a response window is
 * an operational claim and is not registered in src/lib/claims.ts.
 */
export default function SendPhotosBlock({
  location,
  formHref = '/design-consultation',
  formLabel = 'the consultation form',
  className = '',
}: SendPhotosBlockProps) {
  return (
    <aside
      aria-labelledby={`send-photos-${location}`}
      className={`rounded-lg border border-steel-200 bg-steel-50 p-6 md:p-7 flex flex-col sm:flex-row gap-5 ${className}`}
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-navy-800 text-white flex-shrink-0">
        <Camera className="w-6 h-6" aria-hidden="true" />
      </div>
      <div>
        <h2
          id={`send-photos-${location}`}
          className="font-heading text-2xl font-extrabold text-navy-800"
        >
          Text us a photo of the project
        </h2>
        <p className="text-charcoal-600 mt-2 leading-relaxed">
          A few phone photos of the room, the roof or the yard help us understand the project before
          the site visit. Text them to{' '}
          <TrackedLink
            href={ESTIMATE_SMS_HREF}
            eventName="sms_click"
            eventParams={{ location }}
            className="font-semibold text-navy-900 underline underline-offset-2 hover:text-brand-red transition-colors"
          >
            {BUSINESS.phone}
          </TrackedLink>
          , or send the details through{' '}
          <Link
            href={formHref}
            className="font-semibold text-navy-900 underline underline-offset-2 hover:text-brand-red transition-colors"
          >
            {formLabel}
          </Link>
          . The first site visit is free.
        </p>
      </div>
    </aside>
  );
}
