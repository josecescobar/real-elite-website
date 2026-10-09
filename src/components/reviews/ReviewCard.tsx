import Image from 'next/image';
import Link from 'next/link';
import { Star, Quote, ArrowUpRight } from 'lucide-react';
import type { Review } from '@/lib/reviews';
import { getProjectBySlug } from '@/lib/projects';

function formatReviewDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function ReviewSourceBadge({ review }: { review: Pick<Review, 'source' | 'sourceUrl'> }) {
  if (review.source !== 'thumbtack' || !review.sourceUrl) return null;
  return (
    <a
      href={review.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex text-sm font-semibold text-navy-800 underline decoration-brand-red/40 underline-offset-4 hover:text-brand-red"
    >
      via Thumbtack
    </a>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-5 h-5 text-gold-500 fill-gold-500" strokeWidth={0} />
      ))}
    </div>
  );
}

/**
 * One review, rendered from the unified Review contract. When the review links
 * to a published Project, it shows a thumbnail that deep-links to that project
 * — a review you can see the work behind (the Review Center differentiator).
 * Server component: reads the project registry directly for the thumbnail.
 */
export default function ReviewCard({ review }: { review: Review }) {
  const project = review.projectSlug ? getProjectBySlug(review.projectSlug) : null;

  return (
    <figure className="relative bg-white rounded-lg p-8 md:p-10 shadow-sm border-t-4 border-brand-red flex flex-col">
      <Quote className="absolute top-6 right-6 w-10 h-10 text-navy-100" aria-hidden="true" />
      <div className="mb-5">
        <Stars count={review.rating} />
      </div>
      <blockquote className="text-navy-800 text-lg md:text-xl leading-relaxed font-medium mb-6 flex-1">
        &ldquo;{review.quote}&rdquo;
      </blockquote>

      <figcaption className="border-t border-charcoal-200 pt-5">
        <p className="font-heading text-navy-800 font-bold">{review.author}</p>
        {review.location ? (
          <p className="text-charcoal-500 text-sm">{review.location}</p>
        ) : null}
        {review.date ? (
          <p className="text-charcoal-500 text-sm">{formatReviewDate(review.date)}</p>
        ) : null}
        <ReviewSourceBadge review={review} />
      </figcaption>

      {project && (
        <Link
          href={`/projects/${project.slug}`}
          className="group mt-5 flex items-center gap-3 rounded-md border border-charcoal-100 bg-steel-50 p-3 transition-colors hover:border-brand-red/40 focus-ring"
        >
          <span className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded">
            <Image
              src={project.hero.image.src}
              alt={project.hero.image.alt}
              fill
              sizes="80px"
              className="object-cover"
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[0.65rem] font-bold uppercase tracking-[0.15em] text-charcoal-500">
              See the project
            </span>
            <span className="block truncate text-sm font-semibold text-navy-800 group-hover:text-brand-red">
              {project.title}
            </span>
          </span>
          <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-charcoal-400 group-hover:text-brand-red" aria-hidden="true" />
        </Link>
      )}
    </figure>
  );
}
