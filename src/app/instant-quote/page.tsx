import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, Fence, ArrowRight, Phone } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import Container from '@/components/shared/Container';

export const metadata: Metadata = {
  title: `Get an Instant Quote — Roof or Deck | ${BUSINESS.name}`,
  description:
    'Get a ballpark price in about a minute. Choose an instant roof quote or an instant deck quote from a veteran-owned WV–MD–VA contractor.',
  keywords: ['instant quote', 'instant roof quote', 'instant deck quote', 'free estimate'],
  alternates: { canonical: `${BUSINESS.url}/instant-quote` },
  openGraph: {
    title: `Get an Instant Quote | ${BUSINESS.name}`,
    description: 'Choose an instant roof quote or an instant deck quote — a ballpark price in about a minute.',
    url: `${BUSINESS.url}/instant-quote`,
    type: 'website',
  },
};

const TOOLS = [
  {
    icon: Home,
    eyebrow: 'Roofing',
    title: 'Instant Roof Quote',
    body: 'Enter your address — we measure the roof from satellite imagery — pick a shingle, and see a ballpark range.',
    href: '/instant-roof-quote',
  },
  {
    icon: Fence,
    eyebrow: 'Decks',
    title: 'Instant Deck Quote',
    body: 'Enter the deck size you have in mind, pick a material, and see a ballpark range in about a minute.',
    href: '/instant-deck-quote',
  },
];

export default function InstantQuotePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-4">
              Instant Quote
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              A ballpark price —
              <br />
              <span className="text-brand-red">in about a minute.</span>
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              No appointment, no pressure. Pick what you&apos;re thinking about and we&apos;ll give
              you a real starting number — then confirm it exactly, in writing, for free.
            </p>
          </div>
        </Container>
      </section>

      {/* Tool picker */}
      <section className="bg-charcoal-50 py-16 md:py-24">
        <Container size="wide">
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {TOOLS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group bg-white rounded-lg shadow-card-elevated p-8 flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 transition-transform hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-navy-50 text-navy-800 mb-5">
                  <t.icon className="w-7 h-7" />
                </div>
                <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-bold mb-1">
                  {t.eyebrow}
                </p>
                <h2 className="font-heading text-2xl font-extrabold text-navy-800 mb-2">
                  {t.title}
                </h2>
                <p className="text-charcoal-600 text-sm leading-relaxed flex-1">{t.body}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-brand-red font-bold text-sm group-hover:gap-3 transition-all">
                  Start
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
          <p className="text-charcoal-500 text-sm text-center mt-10 max-w-2xl mx-auto leading-relaxed">
            Working on a kitchen, bathroom, or something else? Those are best scoped in person —
            request a free estimate and a project lead will reach out within 24 business hours.
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
            Call us and a project lead will walk your options with you — financing included.
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
