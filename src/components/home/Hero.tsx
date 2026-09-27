import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import TrackedLink from '@/components/analytics/TrackedLink';

/**
 * Homepage hero — design-build for Loudoun homes.
 *
 * One image, one sentence, two doors. The roof quote, the free-estimate
 * anchor and the motto are gone from this surface on purpose: this is the
 * page a Leesburg homeowner reads before a six-figure decision, and it has to
 * read like the firm they are hoping to find. The Eastern Panhandle lane is
 * still one click away in the navigation and the closing section.
 */
export const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 text-white">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/home-hero.jpg"
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={75}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div aria-hidden="true" className="absolute inset-0 gradient-navy-overlay" />
        <div aria-hidden="true" className="absolute inset-0 bg-navy-950/25" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-24 md:pt-36 md:pb-32 lg:pt-44 lg:pb-40">
        <div className="max-w-3xl">
          <p className="text-brand-red-light text-[0.7rem] font-semibold tracking-[0.24em] uppercase mb-7">
            Loudoun County, Virginia · Veteran-Owned Design-Build
          </p>

          <h1 className="font-heading text-[2.75rem] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[5.25rem] text-white">
            Design-build remodeling
            <br />
            for <em>Loudoun</em> homes.
          </h1>

          <p className="text-charcoal-200 text-lg md:text-xl mt-8 max-w-xl leading-relaxed">
            Kitchens, primary suites, lower levels, additions and outdoor living for Leesburg,
            Ashburn, Middleburg and Hunt Country. One design, one contract, one project lead
            from the first call to the final walkthrough.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-10">
            <TrackedLink
              href="/design-consultation"
              eventName="consultation_cta_click"
              eventParams={{ location: 'hero' }}
              className="inline-flex items-center gap-2 bg-white text-navy-900 px-7 py-4 rounded-md font-semibold text-sm hover:bg-brand-red-light transition-colors focus-ring-on-navy"
            >
              Schedule a design consultation
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </TrackedLink>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 border border-white/35 text-white px-7 py-4 rounded-md font-semibold text-sm hover:bg-white/10 transition-colors focus-ring-on-navy"
            >
              View the portfolio
            </Link>
          </div>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-12 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-charcoal-200">
            <li>Virginia Class A</li>
            <li aria-hidden="true" className="text-white/30">·</li>
            <li>Licensed WV · VA</li>
            <li aria-hidden="true" className="text-white/30">·</li>
            <li>
              <Link href="/veterans" className="hover:text-brand-red-light transition-colors">
                Veteran-Owned
              </Link>
            </li>
            <li aria-hidden="true" className="text-white/30">·</li>
            <li lang="es">English · Español</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Hero;
