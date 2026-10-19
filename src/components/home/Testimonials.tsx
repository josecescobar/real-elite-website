import Link from 'next/link';
import { Quote } from 'lucide-react';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import { BUSINESS } from '@/lib/constants';
import { reviewsForPage } from '@/lib/reviews';
import { ReviewSourceBadge } from '@/components/reviews/ReviewCard';

export default function Testimonials() {
  // The homepage is not a roofing page, so it does not lead with a roof quote.
  // Keep the published Thumbtack quote. Do not print a star rating.
  const reviews = reviewsForPage({}).slice(0, 2);
  if (!reviews.length) return null;

  return (
    <section className="bg-white py-20 md:py-28">
      <Container size="wide">
        <SectionHeader
          eyebrow="What Clients Say"
          title="The receipts from homeowners we&rsquo;ve actually worked for."
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {reviews.map((t) => (
            <figure
              key={t.id}
              className="relative bg-steel-50 rounded-lg p-8 md:p-10 shadow-sm flex flex-col"
            >
              <Quote
                className="absolute top-6 right-6 w-10 h-10 text-navy-100"
                aria-hidden="true"
              />
              <blockquote className="text-navy-800 text-lg md:text-xl leading-relaxed font-medium mb-6 flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="border-t border-charcoal-200 pt-5">
                <p className="font-heading text-navy-800 font-bold">{t.author}</p>
                {t.location ? (
                  <p className="text-charcoal-500 text-sm">{t.location}</p>
                ) : null}
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <ReviewSourceBadge review={t} />
                  <a
                    href={BUSINESS.social.google}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex text-sm font-semibold text-navy-800 underline decoration-brand-red/40 underline-offset-4 hover:text-brand-red"
                  >
                    Google reviews
                  </a>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-navy-800 hover:text-brand-red transition-colors"
          >
            Read All Reviews →
          </Link>
        </div>
      </Container>
    </section>
  );
}
