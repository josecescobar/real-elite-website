import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/shared/Container';
import InvestmentSummary from '@/components/investment/InvestmentSummary';
import { CONSULTATION_THRESHOLD_LABEL } from '@/lib/investment-guide';

/** Published investment ranges, labelled as typical market ranges, never quotes. */
export default function InvestmentPreview() {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-4">
              Investment
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-navy-900 leading-[1.05]">
              Real numbers, before the first call.
            </h2>
            <p className="text-charcoal-600 mt-5 leading-relaxed">
              Typical Loudoun County ranges for each project type, so you know which lane you
              are in. The design consultation is calibrated for projects of{' '}
              {CONSULTATION_THRESHOLD_LABEL}; smaller work moves faster through the standard
              estimate.
            </p>
            <Link
              href="/investment"
              className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-navy-900 link-editorial"
            >
              Read the investment guide
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="lg:col-span-8">
            <InvestmentSummary />
          </div>
        </div>
      </Container>
    </section>
  );
}
