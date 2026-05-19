'use client';

import Image from 'next/image';
import { BUSINESS } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

const CALENDLY_URL = 'https://calendly.com/realelitecontracting-info/free-estimate-call';

export const Hero = () => {
  return (
    <section className="relative px-6 pt-20 pb-24 md:pt-28 md:pb-32 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <Image
            src="/images/logo.png"
            alt="Real Elite Contracting Logo"
            width={140}
            height={140}
            className="w-32 h-32 md:w-36 md:h-36 mb-8"
            priority
          />

          <div className="inline-flex items-center gap-2 bg-navy-800/5 rounded-full px-4 py-1.5 mb-8">
            <span className="text-brand-red text-xs">★</span>
            <span className="text-navy-800 text-xs font-semibold tracking-[0.15em] uppercase">
              Veteran-Owned &amp; Operated
            </span>
          </div>

          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-extrabold text-navy-800 leading-[0.95] tracking-tight">
            Built With Military Precision.
          </h1>

          <p className="text-charcoal-500 text-lg md:text-xl mt-8 max-w-xl leading-relaxed">
            Premium remodeling and exterior craftsmanship across the WV–MD–VA region.
            Veteran-owned. Communication-first. Quality you don&apos;t have to second-guess.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('calendly_click', { location: 'hero' })}
              className="bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-brand-red/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red"
            >
              Get My Free Estimate →
            </a>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              onClick={() => trackEvent('phone_click', { location: 'hero' })}
              className="bg-navy-800 text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-navy-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400"
            >
              Call {BUSINESS.phone}
            </a>
          </div>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-xs font-semibold uppercase tracking-[0.15em] text-charcoal-500">
            <li>Licensed</li>
            <li aria-hidden="true" className="text-charcoal-300">·</li>
            <li>Insured</li>
            <li aria-hidden="true" className="text-charcoal-300">·</li>
            <li>Veteran-Owned</li>
            <li aria-hidden="true" className="text-charcoal-300">·</li>
            <li className="text-brand-red">5.0 ★ Google</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Hero;
