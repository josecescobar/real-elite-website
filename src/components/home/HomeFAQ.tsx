import Link from 'next/link';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import { HOME_FAQ } from '@/lib/constants';

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden="true">
      <path d="M5 12h14" />
    </svg>
  );
}

export default function HomeFAQ() {
  return (
    <section className="bg-steel-50 py-20 md:py-28">
      <Container size="default">
        <SectionHeader
          eyebrow="FAQ"
          title="The questions every homeowner asks."
          subtitle="The short version, upfront. Full answers — plus everything we don't have room for here — on the FAQ page."
        />

        <div className="mt-12 divide-y divide-charcoal-200 border-t border-b border-charcoal-200">
          {HOME_FAQ.map((item, idx) => (
            <details key={item.question} className="group" open={idx === 0}>
              <summary className="w-full py-6 flex items-start justify-between gap-6 text-left cursor-pointer list-none [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm">
                <span className="font-heading text-lg md:text-xl font-bold text-navy-800 group-hover:text-brand-red transition-colors">
                  {item.question}
                </span>
                <span className="flex-shrink-0 mt-1 text-navy-800">
                  <span className="group-open:hidden">
                    <PlusIcon />
                  </span>
                  <span className="hidden group-open:inline">
                    <MinusIcon />
                  </span>
                </span>
              </summary>
              <div className="pb-6 pr-12 text-charcoal-600 leading-relaxed text-sm md:text-base">
                {item.answer}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-navy-800 hover:text-brand-red transition-colors"
          >
            All FAQs →
          </Link>
        </div>
      </Container>
    </section>
  );
}
