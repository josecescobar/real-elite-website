'use client';

import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import Container from '@/components/shared/Container';
import { trackEvent } from '@/lib/analytics';

export default function InstantQuoteBand() {
  return (
    <section className="bg-navy-900 text-white border-b border-navy-800">
      <Container size="wide" className="py-14 md:py-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-brand-red/15 border border-brand-red/30 rounded-full px-3 py-1 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-brand-red" />
              <span className="text-brand-red text-[0.65rem] font-bold tracking-[0.18em] uppercase">
                Tri-State First
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.05] tracking-tight">
              A roof quote in 60 seconds —{' '}
              <span className="text-brand-red">no salesperson, no callback.</span>
            </h2>
            <p className="text-charcoal-200 mt-5 text-base md:text-lg leading-relaxed">
              Real Elite is the only contractor in WV, MD, and VA offering instant,
              address-based roof estimates. Powered by aerial imagery and our pricing
              engine — get a real range in the time it takes to find your address.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            <Link
              href="/instant-roof-quote"
              onClick={() => trackEvent('roof_quote_cta_click', { location: 'instant_quote_band' })}
              className="inline-flex items-center gap-2 bg-brand-red text-white px-7 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 focus-visible:ring-brand-red"
            >
              Try the Instant Quote
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <p className="text-[0.7rem] uppercase tracking-[0.15em] font-semibold text-charcoal-400">
              No phone number required
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
