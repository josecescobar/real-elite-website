import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import { PRECISION_PROCESS } from '@/lib/constants';

export default function PrecisionProcess() {
  return (
    <section className="bg-navy-900 text-white py-20 md:py-28 relative isolate overflow-hidden">
      {/* Subtle pattern accent */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.04] bg-[radial-gradient(circle_at_top_right,white,transparent_50%)]"
      />

      <Container size="wide">
        <SectionHeader
          eyebrow="The Military Precision Process"
          title="Four steps. No surprises."
          subtitle="The same disciplined operating system every project follows — from the first phone call through the final walkthrough."
          tone="light"
          align="center"
          className="mx-auto"
        />

        <ol className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {PRECISION_PROCESS.map((step, idx) => (
            <li key={step.step} className="relative">
              {/* Connector line on desktop */}
              {idx < PRECISION_PROCESS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden lg:block absolute top-7 left-[calc(50%+2.5rem)] right-[calc(-50%+2.5rem)] h-px bg-gradient-to-r from-navy-700 to-transparent"
                />
              )}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center justify-center w-14 h-14 rounded-md bg-brand-red text-white font-heading font-extrabold text-xl shadow-md flex-shrink-0">
                  {step.step}
                </div>
                <h3 className="font-heading text-2xl font-extrabold leading-tight">
                  {step.title}
                </h3>
              </div>
              <p className="text-charcoal-300 text-sm leading-relaxed">
                {step.summary}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
