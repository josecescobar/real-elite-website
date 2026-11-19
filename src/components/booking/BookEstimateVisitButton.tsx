'use client';

import { useState } from 'react';
import { getCalApi } from '@real-elite/cal-embed';
import { bookingUrlFromEnv, parseBookingUrl, type BookingTarget } from '@/lib/booking';

export const BOOKING_BUTTON_LABEL = 'Book a free estimate visit';
export const BOOKING_NAMESPACE = 'free-estimate-visit';
/** How long a click waits for /embed/embed.js before showing the fallback. */
export const BOOKING_EMBED_READY_TIMEOUT_MS = 8_000;

type BookingCal = {
  loaded?: boolean;
};

function bookingCal(): BookingCal | undefined {
  return (window as Window & { Cal?: BookingCal }).Cal;
}

function findEmbedScript(embedJsUrl: string): HTMLScriptElement | null {
  for (const script of document.getElementsByTagName('script')) {
    if (script.src === embedJsUrl || script.getAttribute('src') === embedJsUrl) return script;
  }
  return null;
}

/** Vendored getCalApi only injects a script while Cal.loaded is falsy. */
function abandonEmbedScript(script: HTMLScriptElement): void {
  script.remove();
  const cal = bookingCal();
  if (cal) cal.loaded = false;
}

/**
 * getCalApi resolves once the namespace queue exists, before embed.js loads.
 * Wait for the script's load event, and fail on error or timeout so the button
 * can show its fallback and a later click can inject the script again.
 */
function watchEmbedScript(script: HTMLScriptElement, timeoutMs: number): Promise<void> {
  if (script.dataset.bookingEmbed === 'ready') return Promise.resolve();

  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = window.setTimeout(onTimeout, timeoutMs);

    function finish(settle: () => void) {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
      settle();
    }
    function onLoad() {
      finish(() => {
        script.dataset.bookingEmbed = 'ready';
        resolve();
      });
    }
    function onError() {
      finish(() => {
        abandonEmbedScript(script);
        reject(new Error('booking embed failed to load'));
      });
    }
    function onTimeout() {
      finish(() => {
        abandonEmbedScript(script);
        reject(new Error('booking embed timed out'));
      });
    }

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);
  });
}

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
  const script = findEmbedScript(target.embedJsUrl);
  if (script) await watchEmbedScript(script, BOOKING_EMBED_READY_TIMEOUT_MS);
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
