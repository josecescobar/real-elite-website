import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/constants';

/**
 * SEO helpers — one place to build the metadata + structured-data shapes the
 * pages were hand-rolling. Keeping these here keeps canonical/OG/breadcrumb
 * output consistent as the site grows toward hundreds of pages.
 */

/** Absolute URL for a site-relative path, e.g. absoluteUrl('/services/roofing'). */
export const absoluteUrl = (path: string): string => `${BUSINESS.url}${path}`;

/**
 * Google renders roughly 580px of title — about 60 characters — before it
 * truncates with an ellipsis. `scripts/audit-site.mjs` enforces this budget
 * across every route.
 */
export const TITLE_MAX = 60;

/** Shorter brand form used when the full one won't fit the title budget. */
const BRAND_SUFFIX = ` | ${BUSINESS.name}`;
const BRAND_SUFFIX_SHORT = ' | Real Elite';

/**
 * Keep a composed page title inside the SERP display budget.
 *
 * Pages author titles as `"<page copy> | Real Elite Contracting"`. The page
 * copy is nearly always fine on its own — it's the 24-character brand suffix
 * that pushes the string past the limit, and a truncated title loses the tail
 * of the copy (the part carrying the keyword) rather than the brand.
 *
 * So when a title overflows, degrade the *brand* rather than the message:
 * full suffix → short suffix → no suffix. The domain still appears beside the
 * title in results, so dropping it costs little.
 *
 * A title that is still too long without any suffix is a copywriting problem,
 * not a mechanical one — it's returned untouched so the audit keeps flagging
 * it for a human to rewrite, instead of being silently chopped mid-word.
 */
export function fitTitle(title: string): string {
  if (title.length <= TITLE_MAX) return title;
  if (!title.endsWith(BRAND_SUFFIX)) return title;

  const base = title.slice(0, -BRAND_SUFFIX.length);
  const short = base + BRAND_SUFFIX_SHORT;
  if (short.length <= TITLE_MAX) return short;
  return base;
}

/** The shared 1200×630 social card used when a route has no custom OG image. */
const DEFAULT_OG_IMAGE = {
  url: `${BUSINESS.url}/images/og-image.jpg`,
  width: 1200,
  height: 630,
} as const;

type BuildMetadataInput = {
  /** Site-relative path used for the canonical + og:url, e.g. '/services/roofing'. */
  path: string;
  title: string;
  description: string;
  keywords?: Metadata['keywords'];
  ogType?: 'website' | 'article';
};

/**
 * Build the standard per-page Metadata: title + description, a canonical built
 * from `path`, and a matching OpenGraph block using the default social card.
 * Routes with bespoke needs (custom OG image, Twitter overrides, robots tuning)
 * can still spread the result and extend it.
 */
export function buildMetadata({
  path,
  title,
  description,
  keywords,
  ogType = 'website',
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  // The <title> is length-budgeted; og:title and twitter:title keep the full
  // string, since social cards render far more characters than a SERP row.
  const fittedTitle = fitTitle(title);
  return {
    title: fittedTitle,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: ogType,
      images: [DEFAULT_OG_IMAGE],
    },
    // Without a per-page twitter block, Next.js inherits the root layout's
    // (homepage) twitter card wholesale, so every subpage would advertise the
    // homepage title/description. Emit a matching card per page.
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

export type Breadcrumb = { name: string; item: string };

/**
 * Build a schema.org BreadcrumbList. Positions are assigned from array order,
 * so callers just pass crumbs top-to-bottom (Home first). Mirrors the shape
 * the templates previously inlined by hand.
 */
export function buildBreadcrumbSchema(items: Breadcrumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}
