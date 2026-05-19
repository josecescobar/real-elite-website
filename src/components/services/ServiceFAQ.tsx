'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import type { ServiceFAQ as FAQ } from '@/lib/services-data';

export default function ServiceFAQ({ items }: { items: readonly FAQ[] | FAQ[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section>
      <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-6">
        Frequently asked
      </h2>
      <div className="divide-y divide-charcoal-200 border-t border-b border-charcoal-200">
        {items.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={item.question}>
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                aria-expanded={isOpen}
                aria-controls={`service-faq-${idx}`}
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
                  id={`service-faq-${idx}`}
                  className="pb-5 pr-12 text-charcoal-600 leading-relaxed text-sm md:text-base"
                >
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
