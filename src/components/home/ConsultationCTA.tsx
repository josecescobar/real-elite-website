import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/shared/Container';
import { BUSINESS } from '@/lib/constants';
import TrackedLink from '@/components/analytics/TrackedLink';
import PhoneLink from '@/components/analytics/PhoneLink';

/**
 * The closing door. One primary action (design consultation) and a quiet
 * second lane for repair and exterior work, so the Eastern Panhandle client
 * still finds the standard estimate without it competing on this page.
 */
export default function ConsultationCTA() {
  return (
    <section className="bg-navy-900 text-white py-20 md:py-28">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            <p className="text-brand-red-light text-xs uppercase tracking-[0.22em] font-semibold mb-5">
              Start with a conversation
            </p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.02]">
              Tell us about the house.
              <br />
              We&rsquo;ll tell you whether it fits.
            </h2>
            <p className="text-charcoal-300 text-lg mt-6 leading-relaxed max-w-2xl">
              A short call about the rooms, the range and the timing. If the project is a
              design-build fit, we come out to measure and photograph. If it is not, we say so
              on the call and point you to the right path.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-10">
              <TrackedLink
                href="/design-consultation"
                eventName="consultation_cta_click"
                eventParams={{ location: 'cta_section' }}
                className="inline-flex items-center gap-2 bg-white text-navy-900 px-7 py-4 rounded-md font-semibold text-sm hover:bg-brand-red-light transition-colors focus-ring-on-navy"
              >
                Schedule a design consultation
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </TrackedLink>
              <PhoneLink
                location="cta_section"
                className="inline-flex items-center gap-2 border border-white/35 text-white px-7 py-4 rounded-md font-semibold text-sm hover:bg-white/10 transition-colors focus-ring-on-navy"
              >
                Call {BUSINESS.phone}
              </PhoneLink>
            </div>
          </div>

          <div className="lg:col-span-4 border-l border-white/15 pl-6">
            <p className="text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-charcoal-400 mb-3">
              Repairs, roofing and smaller projects
            </p>
            <p className="text-charcoal-300 text-sm leading-relaxed">
              Eastern Panhandle roofing, siding, decks and repairs run through our standard
              written estimate, which is the faster path for that work.
            </p>
            <Link
              href="/estimate"
              className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-white link-editorial"
            >
              Request a standard estimate
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
