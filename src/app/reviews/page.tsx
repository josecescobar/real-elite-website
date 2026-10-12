import ReviewsIndex, { reviewsMetadata } from '@/components/reviews/ReviewsIndex';

export const metadata = reviewsMetadata;

// No searchParams: this index prerenders. Filtered queries are rewritten to
// /reviews/filtered before this static page can match.
export default function ReviewsPage() {
  return <ReviewsIndex service={null} />;
}
