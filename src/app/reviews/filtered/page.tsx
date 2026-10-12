import ReviewsIndex, { reviewsMetadata } from '@/components/reviews/ReviewsIndex';

export const metadata = reviewsMetadata;

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
