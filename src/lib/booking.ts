/**
 * `NEXT_PUBLIC_BOOKING_URL` is the full Cal.diy event page, for example
 * http://127.0.0.1:3340/real-elite/free-estimate-visit.
 * Unset, blank, or not an event link means the booking button stays off.
 */
export type BookingTarget = {
  origin: string;
  calLink: string;
  embedJsUrl: string;
};

export function parseBookingUrl(raw: string | null | undefined): BookingTarget | null {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;

  const segments = url.pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    });

  // Cal links are at least username/event. A bare host or a username with
  // no event is not something the embed can open.
  if (segments.length < 2) return null;

  return {
    origin: url.origin,
    calLink: segments.join('/'),
    embedJsUrl: `${url.origin}/embed/embed.js`,
  };
}

/** Literal env read so Next can inline it in client bundles. */
export function bookingUrlFromEnv(): string | undefined {
  return process.env.NEXT_PUBLIC_BOOKING_URL;
}
