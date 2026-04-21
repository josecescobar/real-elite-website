import Image from 'next/image';
import { BUSINESS } from '@/lib/constants';

const CALENDLY_URL = 'https://calendly.com/realelitecontracting-info/free-estimate-call';

export const Hero = () => {
  return (
    <section className="px-6 pt-20 pb-24 md:pt-28 md:pb-32 bg-white">
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

          <div className="inline-flex items-center gap-2 bg-[#1a2744]/5 rounded-full px-4 py-1.5 mb-8">
            <span className="text-[#c0392b] text-xs">★</span>
            <span className="text-[#1a2744] text-xs font-semibold tracking-wide">
              VETERAN-OWNED &amp; OPERATED
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-[#1a2744] leading-[0.95] tracking-tight">
            Eastern Panhandle&apos;s Best Builder.
          </h1>

          <p className="text-gray-500 text-lg mt-8 max-w-md leading-relaxed">
            Roofing. Siding. Decks. Remodeling. Additions. Licensed, insured, and backed by
            200+ completed projects.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#c0392b] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-[#a93226] transition-colors shadow-lg shadow-[#c0392b]/20"
            >
              Book Free Estimate →
            </a>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="bg-[#1a2744] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-[#0f1b2d] transition-colors"
            >
              Call {BUSINESS.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
