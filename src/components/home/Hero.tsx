'use client';

import Image from 'next/image';
import { BUSINESS } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

export const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 text-white">
      {/* Full-bleed hero photography */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Editorial navy overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 gradient-navy-overlay"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-navy-900/40"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-20 pb-28 md:pt-28 md:pb-36 lg:pt-32 lg:pb-44">
        <div className="max-w-3xl">
          {/* Eyebrows — stacked trust badges */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5">
              <span className="text-brand-red text-xs">★</span>
              <span className="text-white text-[0.7rem] font-semibold tracking-[0.18em] uppercase">
                Veteran-Owned &amp; Operated
              </span>
            </div>
            <div className="inline-flex items-center gap-2 bg-brand-red/15 backdrop-blur-sm border border-brand-red/40 rounded-full px-4 py-1.5">
              <span className="text-brand-red text-xs">●</span>
              <span className="text-white text-[0.7rem] font-semibold tracking-[0.18em] uppercase">
                First AI Roof Quote in the Tri-State
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[0.95] tracking-tight text-white">
            Built With
            <br />
            <span className="text-brand-red">Military Precision.</span>
          </h1>

          {/* Sub */}
          <p className="text-charcoal-200 text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">
            Premium remodeling and exterior craftsmanship across the WV–MD–VA region.
            Veteran-owned. AI-instant roof quotes. Communication-first. Quality you don&apos;t
            have to second-guess.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href="#estimate"
              onClick={() => trackEvent('estimate_cta_click', { location: 'hero' })}
              className="bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 focus-visible:ring-brand-red"
            >
              Get My Free Estimate →
            </a>
            <a
              href="/instant-roof-quote"
              onClick={() => trackEvent('roof_quote_cta_click', { location: 'hero' })}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 focus-visible:ring-white/40"
            >
              Instant Roof Quote →
            </a>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              onClick={() => trackEvent('phone_click', { location: 'hero' })}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 focus-visible:ring-white/40"
            >
              Call {BUSINESS.phone}
            </a>
          </div>

          {/* Trust strip */}
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal-200">
            <li>Licensed WV · MD · VA</li>
            <li aria-hidden="true" className="text-white/30">·</li>
            <li>Insured</li>
            <li aria-hidden="true" className="text-white/30">·</li>
            <li>
              <a href="/veterans" className="hover:text-brand-red transition-colors">
                Veteran-Owned
              </a>
            </li>
            <li aria-hidden="true" className="text-white/30">·</li>
            <li className="text-brand-red">5.0 ★ Google</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Hero;
