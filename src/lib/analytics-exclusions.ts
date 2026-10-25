/**
 * Internal tools that must never load third-party analytics (GA4, GTM,
 * Microsoft Clarity). They show lead PII (names, phones, emails) and take
 * an access key, so session replays and page_location hits there are a
 * data leak (security audit 2026-10-24, finding M1). Both pages are also
 * noindex and excluded from the sitemap.
 */
export const ANALYTICS_EXCLUDED_PATHS = ['/sales', '/review-request'] as const;

/** True for `/sales`, `/sales/…`, `/review-request`, `/review-request/…`. */
export function isAnalyticsExcludedPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const path = pathname.split(/[?#]/, 1)[0].replace(/\/+$/, '') || '/';
  return ANALYTICS_EXCLUDED_PATHS.some((base) => path === base || path.startsWith(`${base}/`));
}
