import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import ReviewCard from './ReviewCard';
import type { Review } from '@/lib/reviews';

/**
 * A proof module for service and city pages: renders the reviews that match
 * this page, pulled from the single review source. Returns `null` when there
 * are none — so pages without a matching review stay clean rather than showing
 * an empty rail. As the corpus grows (Phase 1 projects + Google reviews), more
 * pages light up automatically.
 */
export default function ReviewsSection({
  reviews,
  eyebrow = 'What Clients Say',
  title,
}: {
  reviews: Review[];
  eyebrow?: string;
  title: string;
}) {
  if (reviews.length === 0) return null;

  return (
    <section className="bg-steel-50 py-16 md:py-24">
      <Container size="wide">
        <SectionHeader eyebrow={eyebrow} title={title} />
        <div
          className={`mt-10 grid grid-cols-1 gap-6 ${
            reviews.length > 1 ? 'lg:grid-cols-2' : 'max-w-2xl'
          }`}
        >
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-navy-800 hover:text-brand-red transition-colors focus-ring"
          >
            Read the Review Center
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
