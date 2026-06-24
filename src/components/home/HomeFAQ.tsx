'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Minus } from 'lucide-react';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import { HOME_FAQ } from '@/lib/constants';

export default function HomeFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="bg-steel-50 py-20 md:py-28">
      <Container size="default">
        <SectionHeader
          eyebrow="FAQ"
          title="The questions every homeowner asks."
          subtitle="The short version, upfront. Full answers — plus everything we don't have room for here — on the FAQ page."
        />

        <div className="mt-12 divide-y divide-charcoal-200 border-t border-b border-charcoal-200">
          {HOME_FAQ.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full py-6 flex items-start justify-between gap-6 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${idx}`}
                >
                  <span className="font-heading text-lg md:text-xl font-bold text-navy-800 group-hover:text-brand-red transition-colors">
                    {item.question}
                  </span>
                  <span className="flex-shrink-0 mt-1 text-navy-800">
                    {isOpen ? (
                      <Minus className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Plus className="w-5 h-5" aria-hidden="true" />
                    )}
                  </span>
                </button>
                <div
                  id={`faq-panel-${idx}`}
                  hidden={!isOpen}
                  className="pb-6 pr-12 text-charcoal-600 leading-relaxed text-sm md:text-base"
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
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
