import Link from 'next/link';
import { Star, Quote } from 'lucide-react';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import { getFeaturedReviews } from '@/lib/reviews';

const renderStars = () => (
  <div className="flex gap-1" aria-label="5 out of 5 stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="w-5 h-5 text-gold-500 fill-gold-500" strokeWidth={0} />
    ))}
  </div>
);

export default function Testimonials() {
  // Lead with the two strongest reviews editorially, from the single review
  // source (src/lib/reviews). Same voices, now one source of truth.
  const [a, b] = getFeaturedReviews(2);

  return (
    <section className="bg-white py-20 md:py-28">
      <Container size="wide">
        <SectionHeader
          eyebrow="What Clients Say"
          title="The receipts from homeowners we&rsquo;ve actually worked for."
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {[a, b].map((t) => (
            <figure
              key={t.id}
              className="relative bg-steel-50 rounded-lg p-8 md:p-10 shadow-sm flex flex-col"
            >
              <Quote
                className="absolute top-6 right-6 w-10 h-10 text-navy-100"
                aria-hidden="true"
              />
              <div className="mb-5">{renderStars()}</div>
              <blockquote className="text-navy-800 text-lg md:text-xl leading-relaxed font-medium mb-6 flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="border-t border-charcoal-200 pt-5">
                <p className="font-heading text-navy-800 font-bold">{t.author}</p>
                <p className="text-charcoal-500 text-sm">{t.location}</p>
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
