import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/shared/Container';
import { DESIGN_BUILD_PROCESS } from '@/lib/design-build-process';

/** "How we work" — the five design-build steps, previewed. Full read on /process. */
export default function ProcessPreview() {
  return (
    <section className="bg-navy-900 text-white py-20 md:py-28">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-brand-red-light text-xs uppercase tracking-[0.22em] font-semibold mb-4">
              How we work
            </p>
            <h2 className="font-heading text-4xl md:text-5xl leading-[1.05]">
              Design first. Then a price you can hold us to.
            </h2>
            <p className="text-charcoal-300 mt-5 leading-relaxed">
              Design-build means the drawings, the selections and the approvals come before the
              construction price, so the number is built from what will actually be built. Five
              steps, in order.
            </p>
            <Link
              href="/process"
              className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-white link-editorial"
            >
              Read the full process
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <ol className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
            {DESIGN_BUILD_PROCESS.map((step) => (
              <li key={step.step} className="reveal border-t border-white/15 pt-5">
                <div className="flex items-baseline gap-4">
                  <span className="font-heading text-brand-red-light text-xl tabular-nums">{step.step}</span>
                  <h3 className="font-heading text-2xl text-white">{step.title}</h3>
                </div>
                <p className="text-charcoal-300 text-sm leading-relaxed mt-3">{step.summary}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
