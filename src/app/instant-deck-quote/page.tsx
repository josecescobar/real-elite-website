import type { Metadata } from 'next';
import Link from 'next/link';
import { Ruler, SlidersHorizontal, FileCheck, Phone } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import Container from '@/components/shared/Container';
import DeckQuoteTool from '@/components/deck-quote/DeckQuoteTool';

export const metadata: Metadata = {
  title: `Instant Deck Quote — Ballpark Deck Price | ${BUSINESS.name}`,
  description:
    'Get a ballpark deck price in about a minute. Enter your deck size, pick a material, and see an estimated range — from a veteran-owned WV–MD–VA deck builder.',
  keywords: [
    'instant deck quote',
    'deck cost calculator',
    'deck price estimate',
    'composite deck cost WV MD VA',
  ],
  alternates: { canonical: `${BUSINESS.url}/instant-deck-quote` },
  openGraph: {
    title: `Instant Deck Quote | ${BUSINESS.name}`,
    description:
      'Enter your deck size, pick a material, and see a ballpark price in about a minute.',
    url: `${BUSINESS.url}/instant-deck-quote`,
    type: 'website',
  },
};

const STEPS = [
  {
    icon: Ruler,
    title: 'Tell us the size',
    body: 'Enter the deck dimensions you have in mind — or tap a common size — and how high it sits.',
  },
  {
    icon: SlidersHorizontal,
    title: 'You pick a material',
    body: 'Choose pressure-treated, composite, or premium PVC — the estimated range updates to match.',
  },
  {
    icon: FileCheck,
    title: 'We confirm it in writing',
    body: 'A project lead follows up within 24 business hours with a free, exact written estimate.',
  },
];

export default function InstantDeckQuotePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-4">
              Instant Deck Quote
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Your deck price —
              <br />
              <span className="text-brand-red">in about a minute.</span>
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              Enter the size, pick a material, and see a ballpark range. No pressure, no
              obligation — just a real starting number from a veteran-owned deck builder.
            </p>
          </div>
        </Container>
      </section>

      {/* The tool */}
      <section className="bg-charcoal-50 py-14 md:py-20">
        <Container size="default">
          <div className="max-w-2xl mx-auto">
            <DeckQuoteTool />
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 md:py-24 border-t border-charcoal-100">
        <Container size="wide">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 text-center">
            How it works
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-navy-50 text-navy-800 mb-4">
                  <s.icon className="w-7 h-7" />
                </div>
                <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-bold mb-1">
                  Step {i + 1}
                </p>
                <h3 className="font-heading text-lg font-bold text-navy-800 mb-2">{s.title}</h3>
                <p className="text-charcoal-600 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="text-charcoal-500 text-sm text-center mt-12 max-w-2xl mx-auto leading-relaxed">
            The instant number is a ballpark range, not a contract price. Your written estimate is
            always free, exact, and confirmed on-site — and it&apos;s the only number we ever ask
            you to sign.
          </p>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <Container size="default" className="text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-5">
            Rather just talk it through?
          </h2>
          <p className="text-charcoal-300 mb-8 max-w-2xl mx-auto">
            Call us and a project lead will walk your deck and outdoor-living options with you —
            financing included.
          </p>
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="inline-flex items-center justify-center gap-2 bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
          >
            <Phone className="w-4 h-4" />
            Call {BUSINESS.phone}
          </a>
          <p className="text-charcoal-400 text-sm mt-8">
            Need a roof price instead?{' '}
            <Link href="/instant-roof-quote" className="text-white underline hover:text-brand-red transition-colors">
              Get an instant roof quote →
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
