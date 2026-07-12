import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/shared/Container';

/**
 * A quiet, refined band for the high-end Northern Virginia audience — the one
 * segment the standard estimate flow doesn't serve well. Discreet by design:
 * it points design-led buyers toward the private consultation without shouting
 * over the rest of the page. Zero humor, elevated tone.
 */
export default function LuxuryBand() {
  return (
    <section className="bg-navy-950 text-white py-16 md:py-24">
      <Container size="wide">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-brand-red-light text-xs uppercase tracking-[0.22em] font-semibold mb-4">
              For Loudoun, Fairfax &amp; Alexandria
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
              Planning a high-end renovation?
            </h2>
            <p className="text-charcoal-200 text-lg mt-4 leading-relaxed">
              For premium kitchens, primary suites, lower-level finishing, and whole-home
              renovations, we work by private consultation — a designer-collaborative process
              calibrated to the caliber of your home. Pick a window and a project lead calls you.
            </p>
          </div>
          <Link
            href="/premium-remodeling"
            className="inline-flex flex-shrink-0 items-center gap-2 self-start rounded-md border border-white/25 bg-white/10 px-8 py-4 font-bold text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 focus-visible:ring-white/40"
          >
            Explore Premium Project Paths
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
