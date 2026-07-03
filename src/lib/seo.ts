import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/constants';

/**
 * SEO helpers — one place to build the metadata + structured-data shapes the
 * pages were hand-rolling. Keeping these here keeps canonical/OG/breadcrumb
 * output consistent as the site grows toward hundreds of pages.
 */

/** Absolute URL for a site-relative path, e.g. absoluteUrl('/services/roofing'). */
export const absoluteUrl = (path: string): string => `${BUSINESS.url}${path}`;

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
  return {
    title,
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
