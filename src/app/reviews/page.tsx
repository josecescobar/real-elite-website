import type { Metadata } from 'next';
import ReviewsIndex from '@/components/reviews/ReviewsIndex';
import { BUSINESS } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';

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

// No searchParams: this index prerenders. Filtered queries are rewritten to
// /reviews/filtered before this static page can match.
export default function ReviewsPage() {
  return <ReviewsIndex service={null} />;
}
