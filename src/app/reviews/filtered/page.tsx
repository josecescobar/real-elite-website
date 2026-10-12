import type { Metadata } from 'next';
import ReviewsIndex from '@/components/reviews/ReviewsIndex';
import { BUSINESS } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';

// Canonical stays on the public index. This route is only the rewrite target
// for /reviews?service=, so it is not a standalone URL.
export const metadata: Metadata = {
  ...buildMetadata({
    path: '/reviews',
    title: `Review Center | ${BUSINESS.name}`,
    description:
      'Reviews from homeowners we have actually worked for — linked to the work behind them.',
    keywords: [
      'customer reviews',
      'testimonials',
      'contractor reviews',
      'Real Elite Contracting reviews',
      'Eastern Panhandle reviews',
    ],
  }),
  description:
    'Reviews from homeowners across the WV–MD–VA region — many linked to the actual project behind them. Family-run, licensed, and insured.',
};

// Reached only by the beforeFiles rewrite of /reviews?service=. The browser
// URL stays on /reviews. This route is excluded from the sitemap.
export default async function ReviewsFilteredPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  return <ReviewsIndex service={service ?? null} />;
}
