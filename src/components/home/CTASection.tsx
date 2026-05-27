'use client';

import { BUSINESS } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

const SMS_URL = `sms:${BUSINESS.phoneRaw}?&body=${encodeURIComponent(
  "Hi, I'd like a free estimate from Real Elite Contracting."
)}`;

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
            href="#estimate"
            onClick={() => trackEvent('estimate_cta_click', { location: 'cta_section' })}
            className="w-full sm:w-auto bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-brand-red/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-800 focus-visible:ring-brand-red"
          >
            Get My Free Estimate →
          </a>
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            onClick={() => trackEvent('phone_click', { location: 'cta_section' })}
            className="w-full sm:w-auto bg-white/10 text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-800 focus-visible:ring-white/40"
          >
            Call {BUSINESS.phone}
          </a>
        </div>

        <p className="text-xs text-charcoal-400 mt-6">
          Or{' '}
          <a
            href={SMS_URL}
            onClick={() => trackEvent('sms_click', { location: 'cta_section' })}
            className="text-white hover:text-brand-red underline transition-colors font-semibold"
          >
            text {BUSINESS.phone} →
          </a>
        </p>
      </div>
    </section>
  );
};

export default CTASection;
