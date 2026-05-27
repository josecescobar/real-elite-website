import type { Metadata } from 'next';
import Link from 'next/link';
import { Star, Quote, ArrowRight } from 'lucide-react';
import { BUSINESS, TESTIMONIALS } from '@/lib/constants';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import AssurancesBand from '@/components/home/AssurancesBand';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: `Reviews | 5.0 ★ Google Rating | ${BUSINESS.name}`,
  description:
    "Read verified Real Elite Contracting reviews from homeowners across the WV–MD–VA region. Veteran-owned. 5.0 ★ on Google.",
  keywords: [
    'customer reviews',
    'testimonials',
    'contractor reviews',
    'Google reviews',
    'Real Elite Contracting reviews',
    'Eastern Panhandle reviews',
  ],
  alternates: { canonical: `${BUSINESS.url}/reviews` },
  openGraph: {
    title: `Reviews | ${BUSINESS.name}`,
    description: '5.0-star reviews from real homeowners we have actually worked for.',
    url: `${BUSINESS.url}/reviews`,
    type: 'website',
  },
};

const renderStars = (count: number) => (
  <div className="flex gap-1" aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="w-5 h-5 text-gold-500 fill-gold-500" strokeWidth={0} />
    ))}
  </div>
);

export default function ReviewsPage() {
  const averageRating =
    TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length;

  /**
   * AggregateRating + Review JSON-LD so Google can surface the star
   * rating as a rich snippet in search results. Attached to a
   * LocalBusiness node so the rating is scoped to Real Elite as a
   * service provider rather than to a single product.
   */
  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': `${BUSINESS.url}/#business`,
    name: BUSINESS.name,
    url: `${BUSINESS.url}/`,
    telephone: BUSINESS.phoneRaw,
    address: {
      '@type': 'PostalAddress',
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.state,
      postalCode: BUSINESS.address.zip,
      addressCountry: 'US',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating.toFixed(1),
      reviewCount: TESTIMONIALS.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: TESTIMONIALS.map((t) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: t.name },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: t.text,
      itemReviewed: { '@type': 'GeneralContractor', name: BUSINESS.name },
    })),
  };

  return (
    <>
      <JsonLd schema={reviewSchema} />
      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-4">
              Receipts
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              The receipts.
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              Verified reviews from homeowners we have actually worked for, across the
              Eastern Panhandle, Frederick MD, Winchester VA, and Loudoun County.
            </p>
          </div>
        </Container>
      </section>

      {/* Rating block */}
      <section className="bg-white border-b border-charcoal-100">
        <Container size="default" className="py-12 sm:py-16 text-center">
          <div className="font-heading text-6xl sm:text-7xl font-extrabold text-navy-800 leading-none tracking-tight">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center gap-1 mt-4">
            {renderStars(5)}
          </div>
          <p className="text-charcoal-500 text-sm mt-3 uppercase tracking-[0.15em] font-semibold">
            Verified by Google
          </p>
          <a
            href={BUSINESS.social.google}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 text-navy-800 font-semibold text-sm underline hover:text-brand-red transition-colors"
          >
            See full Google review history →
          </a>
        </Container>
      </section>

      {/* Testimonials grid */}
      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="wide">
          <SectionHeader eyebrow="Verified Reviews" title="What clients say." />
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="relative bg-white rounded-lg p-8 md:p-10 shadow-sm border-t-4 border-brand-red"
              >
                <Quote
                  className="absolute top-6 right-6 w-10 h-10 text-navy-100"
                  aria-hidden="true"
                />
                <div className="mb-5">{renderStars(t.rating)}</div>
                <blockquote className="text-navy-800 text-lg md:text-xl leading-relaxed font-medium mb-6">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <figcaption className="border-t border-charcoal-200 pt-5">
                  <p className="font-heading text-navy-800 font-bold">{t.name}</p>
                  <p className="text-charcoal-500 text-sm">{t.location}</p>
                </figcaption>
              </figure>
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
            className="inline-flex items-center gap-2 bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red"
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
