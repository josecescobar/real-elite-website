'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import FAQSchema from '@/components/seo/FAQSchema';
import AssurancesBand from '@/components/home/AssurancesBand';

const FAQ_SECTIONS = [
  {
    heading: 'General',
    items: [
      {
        question: 'Are you licensed and insured?',
        answer:
          "Yes — Real Elite Contracting is fully licensed and insured across West Virginia, Maryland, and Virginia. We carry general liability and workers' compensation, and we'll send copies of every certificate before work begins.",
      },
      {
        question: 'Are you really veteran-owned?',
        answer:
          'Yes. Real Elite Contracting is a proud veteran-owned and operated business. The discipline, communication, and accountability that shape how we run projects come straight from that background.',
      },
      {
        question: 'What areas do you serve?',
        answer:
          'Eastern Panhandle WV (Martinsburg, Inwood, Charles Town, Ranson, Hedgesville, Spring Mills, Falling Waters, Berkeley Springs, Shepherdstown), plus Frederick MD, Hagerstown MD, Winchester VA, Leesburg VA, Ashburn VA, and the wider Loudoun County. If you are nearby and not listed, ask — we will tell you upfront if we are the right fit.',
      },
      {
        question: 'How do I get a free estimate?',
        answer:
          'Three ways: call us at (681) 534-5515, use the multi-step estimate form on the homepage, or book a 15-minute call on Calendly. A real project lead reaches out within 24 business hours.',
      },
    ],
  },
  {
    heading: 'Pricing & Timeline',
    items: [
      {
        question: 'How much does a bathroom remodel cost?',
        answer:
          'Most bathroom remodels start around $15k for a clean refresh, $25k–$45k for a full layout-changing remodel with premium tile, and $45k+ for primary suite remodels with curbless showers and high-end finishes. Every estimate is line-itemed in writing.',
      },
      {
        question: 'How much does a kitchen remodel cost?',
        answer:
          'A like-for-like update typically starts around $28k. A full remodel with layout changes runs $50k–$90k. Open-concept work involving wall removal and structural changes can push past $150k. We line-item the estimate so you can see exactly what each piece contributes.',
      },
      {
        question: 'How much does a new roof cost?',
        answer:
          'Most residential roof replacements range from $8,000 to $20,000 depending on size, slope complexity, and materials. Repairs are typically $500–$3,500. Premium or larger / more complex roofs can run higher.',
      },
      {
        question: 'How much does a new deck cost?',
        answer:
          'A pressure-treated deck typically runs $8k–$18k, composite $15k–$35k, and full outdoor living buildouts with pergolas and lighting $35k–$80k+. Free written estimate after a site walk.',
      },
      {
        question: 'How long do projects take?',
        answer:
          'Roof replacements: 1–3 days. Decks: 1–3 weeks. Bathroom remodels: 3–5 weeks. Kitchens: 6–10 weeks. Basements: 6–12 weeks. Additions: 3 to 8 months depending on scope. We give you a written timeline before we break ground.',
      },
      {
        question: 'Do you offer financing?',
        answer:
          "Yes. We work with several home-improvement financing partners that offer monthly payment plans on qualified projects. We'll walk you through the options on the free estimate before you commit.",
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'Checks, credit cards, and bank transfers. For larger projects we structure payment in milestones — a deposit to start, progress payments at key checkpoints, and a final payment upon completion and your satisfaction.',
      },
    ],
  },
  {
    heading: 'During Your Project',
    items: [
      {
        question: 'Can I live in my home during a remodel?',
        answer:
          'Most homeowners do. We set up dust containment, protect walked surfaces, and clean up daily. For kitchen and primary-bath work we plan around your routine and discuss any short utility shutoffs in advance.',
      },
      {
        question: 'How will you communicate during the project?',
        answer:
          'Named project lead from day one. Daily updates with progress photos. 24-hour response standard on calls, texts, and emails during business days. If anything shifts on the schedule, you hear it from us first.',
      },
      {
        question: 'Do you handle permits and inspections?',
        answer:
          "Yes. We pull every permit required by your county or municipality and coordinate every inspection from rough-in to final. You shouldn't have to chase paperwork on your own remodel.",
      },
      {
        question: 'Do you clean up daily?',
        answer:
          'Yes. Site swept end-of-day. Nail sweep on every roofing project. Walked surfaces covered. Your home stays livable while we work.',
      },
    ],
  },
  {
    heading: 'Warranty & After',
    items: [
      {
        question: 'What does your warranty cover?',
        answer:
          'Every project gets our written workmanship warranty. Manufacturer material warranties (architectural shingles, composite decking, fiber cement siding, fixtures) stack on top of that, and we register them on your behalf.',
      },
      {
        question: 'What if there is a problem after the job is done?',
        answer:
          "We stand behind our work. If you notice any workmanship issue, call us and we'll make it right. We also keep your manufacturer warranty info on file for the products we installed.",
      },
      {
        question: 'Do you work with insurance companies?',
        answer:
          "Yes. If your home has storm damage, we work directly with your insurance company to document the damage, provide detailed estimates, and ensure the claim is handled properly.",
      },
    ],
  },
];

const ALL_FAQS = FAQ_SECTIONS.flatMap((s) => s.items);

export default function FAQPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <>
      <FAQSchema items={ALL_FAQS} />

      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-4">
              FAQ
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              The questions homeowners
              <br />
              <span className="text-brand-red">actually ask.</span>
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              Pricing, timelines, permits, communication, warranties, and what to expect during
              your project. The short answers, straight.
            </p>
          </div>
        </Container>
      </section>

      {/* Sections */}
      {FAQ_SECTIONS.map((section) => (
        <section key={section.heading} className="bg-white py-16 md:py-24 border-b border-charcoal-100 last:border-b-0">
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

      {/* Assurances */}
      <AssurancesBand />

      {/* Final CTA */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <Container size="default" className="text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-5">
            Still have questions?
          </h2>
          <p className="text-charcoal-300 mb-8 max-w-2xl mx-auto">
            Easiest way to get a real answer: tell us what you&apos;re thinking about. A project
            lead reaches out within 24 business hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#estimate"
              className="inline-flex items-center justify-center gap-2 bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
            >
              Get My Free Estimate
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-white/20 transition-colors"
            >
              Call {BUSINESS.phone}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
