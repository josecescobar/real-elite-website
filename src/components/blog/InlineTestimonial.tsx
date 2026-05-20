import { Star, Quote } from 'lucide-react';

/**
 * Service-matched mid-article testimonial card.
 * Drop into MDX content with <InlineTestimonial /> if MDX components
 * are configured, or render inline from the GuideTemplate.
 */
type Props = {
  text: string;
  client: string;
  city?: string;
  projectType?: string;
};

export default function InlineTestimonial({ text, client, city, projectType }: Props) {
  return (
    <figure className="not-prose my-10 bg-steel-50 border-l-4 border-brand-red rounded-r-lg p-6 sm:p-8 relative">
      <Quote
        className="absolute top-5 right-5 w-10 h-10 text-navy-100"
        aria-hidden="true"
      />
      <div className="flex gap-1 mb-3" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-gold-500 fill-gold-500" strokeWidth={0} />
        ))}
      </div>
      <blockquote className="font-heading text-navy-800 text-lg sm:text-xl leading-snug font-bold">
        &ldquo;{text}&rdquo;
      </blockquote>
      <figcaption className="mt-4 text-sm">
        <span className="font-semibold text-navy-800">{client}</span>
        {city && <span className="text-charcoal-500"> · {city}</span>}
        {projectType && (
          <span className="block text-[0.65rem] uppercase tracking-[0.18em] font-semibold text-brand-red mt-1">
            {projectType}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
