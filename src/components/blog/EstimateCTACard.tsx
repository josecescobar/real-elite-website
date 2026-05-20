import { ArrowRight } from 'lucide-react';

/**
 * End-of-article (or mid-article) estimate CTA card.
 * Larger, more deliberate than the sticky bar — links to the
 * homepage embedded estimate form.
 */
type Props = {
  heading?: string;
  body?: string;
};

export default function EstimateCTACard({
  heading = 'Request an estimate for a project like this',
  body = 'Tell us what you’re picturing. Three short steps, about 60 seconds — a real project lead reaches out within 24 business hours to schedule your free on-site walk-through.',
}: Props) {
  return (
    <aside className="not-prose my-12 bg-navy-800 text-white rounded-lg shadow-card-elevated p-7 sm:p-9">
      <p className="text-[0.65rem] uppercase tracking-[0.18em] font-semibold text-brand-red mb-2">
        Free, written estimate
      </p>
      <h3 className="font-heading text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
        {heading}
      </h3>
      <p className="text-charcoal-200 leading-relaxed mb-5 max-w-prose">{body}</p>
      <a
        href="/#estimate"
        className="inline-flex items-center gap-2 bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-800 focus-visible:ring-brand-red"
      >
        Get My Free Estimate
        <ArrowRight className="w-4 h-4" />
      </a>
    </aside>
  );
}
