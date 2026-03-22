import { BUSINESS } from '@/lib/constants';

const CALENDLY_URL = 'https://calendly.com/realelitecontracting-info/free-estimate-call';

export const CTASection = () => {
  return (
    <section className="w-full bg-[#1a2744] py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
          Ready to Start Your Project?
        </h2>

        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
          Get a free, no-obligation estimate from our expert team. No hidden fees —
          just honest pricing and expert work.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#c0392b] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-[#a93226] transition-colors shadow-lg shadow-[#c0392b]/20"
          >
            Book Free Estimate →
          </a>
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="w-full sm:w-auto bg-white/10 text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-white/20 transition-colors"
          >
            Call {BUSINESS.phone}
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
