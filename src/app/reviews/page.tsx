import type { Metadata } from 'next';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { BUSINESS, SOCIAL_PROOF, SERVICES } from '@/lib/constants';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import TrustBadges from '@/components/shared/TrustBadges';
import AssurancesBand from '@/components/home/AssurancesBand';
import ReviewCard from '@/components/reviews/ReviewCard';
import { hasVerifiedReviews } from '@/lib/social-proof';
import {
  getAllReviews,
  getReviewsByService,
  getReviewedServiceSlugs,
} from '@/lib/reviews';

export const metadata: Metadata = {
  title: `Review Center | ${BUSINESS.name}`,
  description:
    'Reviews from homeowners across the WV–MD–VA region — many linked to the actual project behind them. Veteran-owned, licensed, and insured.',
  keywords: [
    'customer reviews',
    'testimonials',
    'contractor reviews',
    'Real Elite Contracting reviews',
    'Eastern Panhandle reviews',
  ],
  alternates: { canonical: `${BUSINESS.url}/reviews` },
  openGraph: {
    title: `Review Center | ${BUSINESS.name}`,
    description:
      'Reviews from homeowners we have actually worked for — linked to the work behind them.',
    url: `${BUSINESS.url}/reviews`,
    type: 'website',
  },
};

const SERVICE_LABEL = new Map<string, string>(SERVICES.map((s) => [s.slug, s.title]));

function renderStars(count: number) {
  return (
    <div className="flex justify-center gap-1" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-5 h-5 text-gold-500 fill-gold-500" strokeWidth={0} />
      ))}
    </div>
  );
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;

  const reviewedServices = getReviewedServiceSlugs();
  const activeService =
    service && reviewedServices.includes(service) ? service : null;

  const allReviews = getAllReviews();
  const reviews = activeService ? getReviewsByService(activeService) : allReviews;

  // Rating block reflects the full corpus, never the filtered view. Until the
  // real Google rating is verified in SOCIAL_PROOF we present these honestly as
  // featured client stories, not an implied verified aggregate.
  const featuredAverage =
    allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  const verified = hasVerifiedReviews();
  const displayRating = verified ? SOCIAL_PROOF.googleRating! : featuredAverage;
  const ratingCaption = verified
    ? `From ${SOCIAL_PROOF.googleReviewCount} Google reviews`
    : 'Average across our featured client stories';

  // Only offer filters when there's more than one facet to choose between.
  const showFilters = reviewedServices.length > 1;

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-4">
              Review Center
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              The receipts.
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              Reviews from homeowners we have actually worked for, across the
              Eastern Panhandle, Frederick MD, Winchester VA, and Loudoun County —
              many linked to the actual project behind them.
            </p>
          </div>
        </Container>
      </section>

      {/* Rating block */}
      <section className="bg-white border-b border-charcoal-100">
        <Container size="default" className="py-12 sm:py-16 text-center">
          <div className="font-heading text-6xl sm:text-7xl font-extrabold text-navy-800 leading-none tracking-tight">
            {displayRating.toFixed(1)}
          </div>
          <div className="mt-4">{renderStars(5)}</div>
          <p className="text-charcoal-500 text-sm mt-3 uppercase tracking-[0.15em] font-semibold">
            {ratingCaption}
          </p>
          <a
            href={BUSINESS.social.google}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 text-navy-800 font-semibold text-sm underline hover:text-brand-red transition-colors"
          >
            See full Google review history →
          </a>
          <TrustBadges className="mt-8" />
        </Container>
      </section>

      {/* Reviews */}
      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow={verified ? 'Verified Reviews' : 'Client Stories'}
            title="What clients say."
          />

          {showFilters && (
            <div
              className="mt-8 flex flex-wrap justify-center gap-2"
              role="group"
              aria-label="Filter reviews by service"
            >
              <FilterChip href="/reviews" label="All" active={!activeService} />
              {reviewedServices.map((slug) => (
                <FilterChip
                  key={slug}
                  href={`/reviews?service=${slug}`}
                  label={SERVICE_LABEL.get(slug) ?? slug}
                  active={activeService === slug}
                />
              ))}
            </div>
          )}

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </Container>
      </section>

      {/* Leave a review */}
      <section className="bg-white py-16 md:py-24 border-t border-charcoal-100">
        <Container size="default" className="text-center">
          <div className="inline-flex items-center justify-center gap-2 bg-brand-red/10 text-brand-red font-semibold text-xs uppercase tracking-[0.15em] px-4 py-2 rounded-full mb-5">
            <Star className="w-4 h-4 fill-brand-red" />
            Share Your Experience
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 mb-4 leading-tight">
            Worked with us? Leave a review.
          </h2>
          <p className="text-charcoal-600 mb-8 max-w-xl mx-auto">
            Your review helps the next homeowner pick a contractor they can actually trust.
          </p>
          <a
            href={BUSINESS.social.google}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-md focus-ring"
          >
            Leave Us a Google Review
            <ArrowRight className="w-4 h-4" />
          </a>
        </Container>
      </section>

      {/* Assurances */}
      <AssurancesBand />

      {/* CTA */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <Container size="default" className="text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-5">
            Join the list of homeowners we&apos;ve actually worked for.
          </h2>
          <p className="text-charcoal-300 mb-8 max-w-2xl mx-auto">
            Three steps, about 60 seconds — a real project lead reaches out within 24 business hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact#estimate"
              className="inline-flex items-center justify-center gap-2 bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
            >
              Get My Free Estimate
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-white/20 transition-colors"
            >
              Call {BUSINESS.phone}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'true' : undefined}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-ring ${
        active
          ? 'bg-navy-800 text-white'
          : 'bg-white text-navy-800 border border-charcoal-200 hover:border-navy-400'
      }`}
    >
      {label}
    </Link>
  );
}
