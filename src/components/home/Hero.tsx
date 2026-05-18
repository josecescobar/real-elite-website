import Image from 'next/image';
import { BUSINESS } from '@/lib/constants';
import TrackedLink from '@/components/shared/TrackedLink';

const CALENDLY_URL = 'https://calendly.com/realelitecontracting-info/free-estimate-call';

export const Hero = () => {
  return (
    <section className="px-6 pt-16 pb-20 md:pt-24 md:pb-28 bg-white">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#1a2744]/5 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#c0392b] text-xs" aria-hidden="true">★</span>
            <span className="text-[#1a2744] text-xs font-semibold tracking-wide">
              VETERAN-OWNED &amp; OPERATED
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-[#1a2744] leading-[0.95] tracking-tight">
            Eastern Panhandle&apos;s Best Builder.
          </h1>

          <p className="text-gray-600 text-lg mt-8 max-w-md leading-relaxed">
            Roofing. Siding. Decks. Remodeling. Additions. Licensed, insured, and trusted by
            homeowners across the Eastern Panhandle.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <TrackedLink
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              event="calendly_click"
              eventParams={{ location: 'hero' }}
              className="bg-[#c0392b] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-[#a93226] transition-colors shadow-lg shadow-[#c0392b]/20"
            >
              Book Free Estimate →
            </TrackedLink>
            <TrackedLink
              href={`tel:${BUSINESS.phoneRaw}`}
              event="phone_click"
              eventParams={{ location: 'hero' }}
              className="bg-[#1a2744] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-[#0f1b2d] transition-colors"
            >
              Call {BUSINESS.phone}
            </TrackedLink>
          </div>
        </div>

        <div className="relative w-full h-72 sm:h-96 lg:h-[28rem] rounded-2xl overflow-hidden shadow-xl">
          <Image
            src="/images/hero-bg.jpg"
            alt="Finished home with new roofing and siding by Real Elite Contracting"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
