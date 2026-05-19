import { BUSINESS } from '@/lib/constants';

const CALENDLY_URL = 'https://calendly.com/realelitecontracting-info/free-estimate-call';

export const CTASection = () => {
  return (
    <section className="w-full bg-navy-800 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-white mb-6">
          Ready to Start Your Project?
        </h2>

        <p className="text-lg text-charcoal-300 mb-10 max-w-2xl mx-auto">
          Get a free, no-obligation estimate from our team. No hidden fees — just honest
          pricing, premium craftsmanship, and a project lead who actually answers the phone.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-brand-red/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red"
          >
            Book Free Estimate →
          </a>
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="w-full sm:w-auto bg-white/10 text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/40"
          >
            Call {BUSINESS.phone}
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
