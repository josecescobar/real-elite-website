'use client';

import { useState } from 'react';
import { getCalApi } from '@real-elite/cal-embed';
import { bookingUrlFromEnv, parseBookingUrl, type BookingTarget } from '@/lib/booking';

export const BOOKING_BUTTON_LABEL = 'Book a free estimate visit';
export const BOOKING_NAMESPACE = 'free-estimate-visit';

const BRAND_COLOR = '#8a6236';

const SURFACE_CLASS = {
  light:
    'bg-brand-red text-white hover:bg-brand-red-dark shadow-lg shadow-brand-red/20 focus-visible:ring-brand-red',
  navy:
    'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 focus-visible:ring-white',
} as const;

export async function openBookingModal(target: BookingTarget): Promise<void> {
  const cal = await getCalApi({
    embedJsUrl: target.embedJsUrl,
    namespace: BOOKING_NAMESPACE,
  });
  cal('ui', {
    hideEventTypeDetails: false,
    layout: 'month_view',
    styles: { branding: { brandColor: BRAND_COLOR } },
  });
  cal('modal', {
    calLink: target.calLink,
    calOrigin: target.origin,
    config: {
      layout: 'month_view',
      useSlotsViewOnSmallScreen: 'true',
    },
  });
}

type Props = {
  surface?: keyof typeof SURFACE_CLASS;
  caption?: string;
  className?: string;
};

export default function BookEstimateVisitButton({
  surface = 'light',
  caption,
  className = '',
}: Props) {
  const target = parseBookingUrl(bookingUrlFromEnv());
  const [error, setError] = useState<string | null>(null);

  if (!target) return null;

  const button = (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => {
        setError(null);
        void openBookingModal(target).catch(() => {
          setError('The booking calendar did not open. Call or use the estimate form.');
        });
      }}
      className={`inline-flex w-full sm:w-auto items-center justify-center px-7 py-3.5 rounded-md font-bold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${SURFACE_CLASS[surface]} ${className}`}
    >
      {BOOKING_BUTTON_LABEL}
    </button>
  );

  const captionClass =
    surface === 'navy' ? 'text-sm text-charcoal-200' : 'text-sm text-charcoal-700';

  return (
    <div className="w-full sm:w-auto">
      {caption ? <p className={`${captionClass} mb-2`}>{caption}</p> : null}
      {button}
      {error ? (
        <p role="alert" className={`${captionClass} mt-2`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
