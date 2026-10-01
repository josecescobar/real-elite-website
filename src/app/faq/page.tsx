import type { Metadata } from 'next';
import { buildMetadata, fitTitle } from '@/lib/seo';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BUSINESS, FAQ_FINANCING_ANSWER } from '@/lib/constants';
import Container from '@/components/shared/Container';
import FAQSchema from '@/components/seo/FAQSchema';
import FaqAccordion from '@/components/faq/FaqAccordion';
import AssurancesBand from '@/components/home/AssurancesBand';
import PhoneLink from '@/components/analytics/PhoneLink';

export const metadata: Metadata = {
  ...buildMetadata({
    path: '/faq',
    title: `FAQ | ${BUSINESS.name}`,
    description:
      'Pricing, timelines, permits, communication, and warranties — straight answers from a family-run WV–MD–VA contractor.',
    keywords: [
      'contractor FAQ',
      'how much does a bathroom remodel cost',
      'how much does a kitchen remodel cost',
      'how much does a new roof cost',
      'home remodel timeline',
      'home improvement permits WV',
    ],
  }),
  title: fitTitle(`FAQ — Remodel Costs, Timelines & Permits | ${BUSINESS.name}`),
  description:
    'Straight answers on remodel costs, roofing and deck pricing, timelines, permits and warranties — from a family-run WV-MD-VA contractor.',
};

const FAQ_SECTIONS = [
  {
    heading: 'General',
    items: [
      {
        question: 'Are you licensed and insured?',
        answer:
          "Yes — Real Elite Contracting is fully licensed and insured across West Virginia and Virginia. General liability coverage is on file. Request current insurance documentation for your project.",
      },
      {
        question: 'Who runs Real Elite Contracting?',
        answer:
          'Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and Purple Heart recipient. The discipline, communication, and accountability that shape how we run projects come from that.',
      },
      {
        question: 'What areas do you serve?',
        answer:
          'Eastern Panhandle WV (Martinsburg, Inwood, Charles Town, Ranson, Hedgesville, Spring Mills, Falling Waters, Berkeley Springs, Shepherdstown), plus Frederick MD, Winchester VA, Leesburg VA, Ashburn VA, and the wider Loudoun County. If you are nearby and not listed, ask — we will tell you upfront if we are the right fit.',
      },
      {
        question: 'How do I get a free estimate?',
        answer:
          `Three ways: call ${BUSINESS.phone}, text the same number, or use the multi-step estimate form on the homepage. A real project lead reaches out after reviewing your request. If you call and miss us, leave a voicemail — include your contact details and project location.`,
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
        answer: FAQ_FINANCING_ANSWER,
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
          "Discuss site supervision, communication, and cleanup arrangements during the estimate. If anything shifts on the schedule, you hear it from us first.",
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
          "Review the proposed scope and warranty terms before signing. Manufacturer coverage depends on the selected product and installation requirements.",
      },
      {
        question: 'What if there is a problem after the job is done?',
        answer:
          "We stand behind our work. If you notice any workmanship issue, call us and we'll make it right. We also keep your manufacturer warranty info on file for the products we installed.",
      },
      {
        question: 'Do you work with insurance companies?',
        answer:
          'Yes. If your home has storm damage, we work directly with your insurance company to document the damage, provide detailed estimates, and ensure the claim is handled properly.',
      },
    ],
  },
];

const ALL_FAQS = FAQ_SECTIONS.flatMap((s) => s.items);

export default function FAQPage() {
  return (
    <>
      <FAQSchema items={ALL_FAQS} />

      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-4">
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
      <FaqAccordion sections={FAQ_SECTIONS} />

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
            lead reaches out after reviewing your request.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact#estimate"
              className="inline-flex items-center justify-center gap-2 bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
            >
              Get My Free Estimate
              <ArrowRight className="w-4 h-4" />
            </Link>
            <PhoneLink
              location="faq_cta"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-white/20 transition-colors"
            >
              Call {BUSINESS.phone}
            </PhoneLink>
          </div>
        </Container>
      </section>
    </>
  );
}
