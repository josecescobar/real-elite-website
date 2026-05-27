import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import MultiStepEstimateForm from '@/components/shared/MultiStepEstimateForm';
import { BUSINESS } from '@/lib/constants';

const SMS_URL = `sms:${BUSINESS.phoneRaw}?&body=${encodeURIComponent(
  "Hi, I'd like a free estimate from Real Elite Contracting."
)}`;

export default function HomeEstimate() {
  return (
    <section
      id="estimate"
      className="bg-navy-900 text-white py-20 md:py-28 scroll-mt-24"
    >
      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left column: pitch + reassurance */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <SectionHeader
              eyebrow="Free Estimate"
              title="Tell us what you're picturing."
              subtitle="Three short steps. About 60 seconds. A real project lead — not a call center — reaches out within 24 business hours to schedule your free on-site walk-through."
              tone="light"
            />

            <ul className="mt-8 space-y-4 text-sm">
              {[
                'No high-pressure sales calls. Ever.',
                'Transparent line-item pricing on every estimate.',
                'Financing options on qualified projects.',
                "We'll tell you upfront if your project isn't a fit.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-charcoal-200">
                  <span
                    aria-hidden="true"
                    className="flex-shrink-0 mt-1.5 w-2 h-2 bg-brand-red rounded-full"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 pt-8 border-t border-navy-700">
              <p className="text-xs uppercase tracking-[0.15em] font-semibold text-charcoal-400 mb-3">
                Prefer to talk?
              </p>
              <p className="text-sm text-charcoal-200 leading-relaxed">
                Call{' '}
                <a
                  href={`tel:${BUSINESS.phoneRaw}`}
                  className="text-white hover:text-brand-red font-semibold underline transition-colors"
                >
                  {BUSINESS.phone}
                </a>{' '}
                or{' '}
                <a
                  href={SMS_URL}
                  className="text-white hover:text-brand-red font-semibold underline transition-colors"
                >
                  text the same number
                </a>
                . A real person picks up — leave a voicemail if we miss you and we&apos;ll call back the same day.
              </p>
            </div>
          </div>

          {/* Right column: the form */}
          <div className="lg:col-span-7">
            <MultiStepEstimateForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
