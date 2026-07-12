import type { Metadata } from 'next';
import { Satellite, SlidersHorizontal, FileCheck, Phone } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import Container from '@/components/shared/Container';
import RoofQuoteTool from '@/components/roof-quote/RoofQuoteTool';

export const metadata: Metadata = {
  title: `Instant Roof Quote — Ballpark Price From Your Address | ${BUSINESS.name}`,
  description:
    'Get a ballpark roof replacement price in about a minute. Enter your address, pick a shingle, and see an estimated range — from a veteran-owned WV–MD–VA roofing contractor.',
  keywords: [
    'instant roof quote',
    'roof estimate by address',
    'roof replacement cost calculator',
    'free roof estimate WV MD VA',
  ],
  alternates: { canonical: `${BUSINESS.url}/instant-roof-quote` },
  openGraph: {
    title: `Instant Roof Quote | ${BUSINESS.name}`,
    description:
      'Enter your address, pick a material, and see a ballpark roof price in about a minute.',
    url: `${BUSINESS.url}/instant-roof-quote`,
    type: 'website',
  },
};

const STEPS = [
  {
    icon: Satellite,
    title: 'We measure your roof',
    body: 'Enter your address and we pull the roof size from satellite imagery — no ladder, no appointment.',
  },
  {
    icon: SlidersHorizontal,
    title: 'You pick a material',
    body: 'Choose architectural, designer, or metal — the estimated range updates to match.',
  },
  {
    icon: FileCheck,
    title: 'We confirm it in writing',
    body: 'A project lead follows up within 24 business hours with a free, exact written estimate.',
  },
];

export default function InstantRoofQuotePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-4">
              Instant Roof Quote
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Your roof price —
              <br />
              <span className="text-brand-red-light">before we ever climb a ladder.</span>
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              Enter your address, pick a material, and see a ballpark range in about a minute. No
              pressure, no obligation — just a real starting number from a veteran-owned
              contractor.
            </p>
            <div className="mt-8">
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-md font-bold text-sm hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 focus-visible:ring-white/40"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                Prefer to talk? Call {BUSINESS.phone}
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* The tool */}
      <section className="bg-charcoal-50 py-14 md:py-20">
        <Container size="default">
          <div className="max-w-2xl mx-auto">
            <RoofQuoteTool />
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
            Call us and a project lead will walk your roof options with you — financing included.
          </p>
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="inline-flex items-center justify-center gap-2 bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
          >
            <Phone className="w-4 h-4" />
            Call {BUSINESS.phone}
          </a>
        </Container>
      </section>
    </>
  );
}
