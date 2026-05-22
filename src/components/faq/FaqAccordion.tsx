'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';

type FaqItem = { question: string; answer: string };
type FaqSection = { heading: string; items: FaqItem[] };

export default function FaqAccordion({ sections }: { sections: FaqSection[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <>
      {sections.map((section) => (
        <section
          key={section.heading}
          className="bg-white py-16 md:py-24 border-b border-charcoal-100 last:border-b-0"
        >
          <Container size="default">
            <SectionHeader eyebrow={section.heading} title={section.heading + '.'} />
            <div className="mt-10 divide-y divide-charcoal-200 border-t border-b border-charcoal-200">
              {section.items.map((item, idx) => {
                const key = `${section.heading}-${idx}`;
                const isOpen = openKey === key;
                return (
                  <div key={key}>
                    <button
                      type="button"
                      onClick={() => setOpenKey(isOpen ? null : key)}
                      aria-expanded={isOpen}
                      aria-controls={`panel-${key}`}
                      className="w-full py-5 flex items-start justify-between gap-6 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm"
                    >
                      <span className="font-heading text-base md:text-lg font-bold text-navy-800 group-hover:text-brand-red transition-colors">
                        {item.question}
                      </span>
                      <span className="flex-shrink-0 mt-1 text-navy-800">
                        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div
                        id={`panel-${key}`}
                        className="pb-5 pr-12 text-charcoal-600 leading-relaxed text-sm md:text-base"
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      ))}
    </>
  );
}
