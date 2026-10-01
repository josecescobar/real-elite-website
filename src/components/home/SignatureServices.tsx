import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Container from '@/components/shared/Container';
import { INVESTMENT_GUIDE } from '@/lib/investment-guide';

/**
 * The five signature project types, in an editorial 12-column grid, with the
 * whole-home program as a quiet closing line. Images, taglines and "from"
 * figures come from the investment guide so the homepage and /investment can
 * never disagree about a number.
 *
 * Card photos stay as published. They carry no caption.
 */
const ORDER = ['lower-levels', 'kitchens', 'primary-suites', 'outdoor-living', 'additions'] as const;
const SPANS: Record<(typeof ORDER)[number], string> = {
  'lower-levels': 'md:col-span-7 md:row-span-2 min-h-[360px] md:min-h-[560px]',
  kitchens: 'md:col-span-5 min-h-[280px]',
  'primary-suites': 'md:col-span-5 min-h-[280px]',
  'outdoor-living': 'md:col-span-6 min-h-[280px]',
  additions: 'md:col-span-6 min-h-[280px]',
};

export default function SignatureServices() {
  const byslug = new Map(INVESTMENT_GUIDE.map((c) => [c.slug, c]));
  const cards = ORDER.map((slug) => byslug.get(slug)!).filter(Boolean);
  const wholeHome = byslug.get('whole-home');

  return (
    <section className="bg-white py-20 md:py-28">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end mb-12 md:mb-16">
          <div className="md:col-span-7">
            <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-4">
              Signature projects
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-navy-900 leading-[1.05]">
              The rooms that change how a house lives.
            </h2>
          </div>
          <p className="md:col-span-5 text-charcoal-600 leading-relaxed md:pb-1">
            Five project types we design and build as one scope: the drawings, the selections,
            the approvals and the work itself. Typical investment ranges are published on
            every page, so the first conversation starts with real numbers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {cards.map((cat, i) => {
            const large = i === 0;
            return (
              <Link
                key={cat.slug}
                href={cat.href}
                className={`group relative overflow-hidden rounded-lg bg-navy-900 text-white photo-editorial reveal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400 ${SPANS[cat.slug as (typeof ORDER)[number]]}`}
              >
                <Image
                  src={cat.image.src}
                  alt={cat.image.alt}
                  fill
                  sizes={large ? '(max-width: 768px) 100vw, 58vw' : '(max-width: 768px) 100vw, 42vw'}
                  className="object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 gradient-navy-overlay" />
                <div className={`absolute inset-x-0 bottom-0 ${large ? 'p-7 md:p-10' : 'p-6 md:p-7'}`}>
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-brand-red-light mb-2">
                    {cat.from ? `Typically from ${cat.from}` : cat.eyebrow}
                  </p>
                  <h3 className={`font-heading text-white leading-tight ${large ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-[1.75rem]'}`}>
                    {cat.title}
                  </h3>
                  <p className={`text-charcoal-200 leading-relaxed mt-2 ${large ? 'text-base max-w-md' : 'text-sm max-w-sm'}`}>
                    {cat.tagline}
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/85 group-hover:text-brand-red-light transition-colors">
                    Explore
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-steel-200 pt-6">
          {wholeHome && (
            <p className="text-charcoal-600">
              <span className="font-heading text-navy-900 text-lg">Whole-home renovation.</span>{' '}
              {wholeHome.tagline}{' '}
              <Link href={wholeHome.href} className="link-editorial font-medium text-navy-900">
                About whole-home work
              </Link>
            </p>
          )}
          <p className="text-charcoal-500 text-[0.65rem] uppercase tracking-[0.16em] flex-shrink-0">
            <Link href="/projects" className="hover:text-navy-900 transition-colors">See completed work</Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
