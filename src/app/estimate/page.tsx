import Link from 'next/link';
import { Zap, ClipboardCheck, Compass, Phone, ArrowRight } from 'lucide-react';
import Container from '@/components/shared/Container';
import AssurancesBand from '@/components/home/AssurancesBand';
import { buildMetadata } from '@/lib/seo';
import { BUSINESS } from '@/lib/constants';

export const metadata = buildMetadata({
  path: '/estimate',
  title: `Get an Estimate | ${BUSINESS.name}`,
  description:
    'Three ways to start: a 60-second instant roof quote, a free written estimate for any project, or a private design consultation for high-end renovations. Veteran-owned, licensed across WV, MD, and VA.',
  keywords: ['free estimate', 'roofing quote', 'remodeling estimate', 'design consultation', 'Eastern Panhandle contractor'],
});

const PATHS = [
  {
    href: '/instant-roof-quote',
    icon: Zap,
    eyebrow: 'Fastest',
    title: 'Instant Roof Quote',
    forWho: 'Replacing or repairing a roof',
    body: 'Enter your address and get a ballpark price in about 60 seconds, measured from satellite imagery — no ladder, no appointment.',
    cta: 'Start my roof quote',
    featured: false,
  },
  {
    href: '/contact#estimate',
    icon: ClipboardCheck,
    eyebrow: 'Most popular',
    title: 'Free Written Estimate',
    forWho: 'Any project — remodels, decks, siding, additions',
    body: 'Tell us about your project in about 60 seconds. A real project lead reviews it and reaches out within one business day to schedule a free on-site estimate.',
    cta: 'Get my free estimate',
    featured: true,
  },
  {
    href: '/design-consultation',
    icon: Compass,
    eyebrow: 'High-end renovations',
    title: 'Design Consultation',
    forWho: 'Kitchens, primary suites & whole-home in NoVA ($50k+)',
    body: 'A private phone consultation for premium, design-led renovations across Loudoun, Fairfax, and Alexandria. Pick a window and we call you.',
    cta: 'Request a consultation',
    featured: false,
  },
];

export default function EstimateHubPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-14 md:pt-24 md:pb-20">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-4">
              Get an Estimate
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Start the right way for your project.
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              Three ways in, each built for a different kind of project. Pick the one that fits —
              a real person responds within one business day, never a call center.
            </p>
          </div>
        </Container>
      </section>

      {/* Paths */}
      <section className="bg-steel-50 py-14 md:py-20">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {PATHS.map((path) => {
              const Icon = path.icon;
              return (
                <Link
                  key={path.href}
                  href={path.href}
                  className={`group flex flex-col rounded-lg p-7 md:p-8 transition-all focus-ring ${
                    path.featured
                      ? 'bg-navy-900 text-white shadow-xl ring-2 ring-brand-red lg:-translate-y-2'
                      : 'bg-white text-navy-800 shadow-sm hover:shadow-md border border-charcoal-100'
                  }`}
                >
                  <span
                    className={`inline-flex w-12 h-12 items-center justify-center rounded-md mb-5 ${
                      path.featured ? 'bg-brand-red text-white' : 'bg-navy-800 text-white'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </span>
                  <p
                    className={`text-[0.65rem] font-bold uppercase tracking-[0.18em] mb-2 ${
                      path.featured ? 'text-brand-red-light' : 'text-brand-red'
                    }`}
                  >
                    {path.eyebrow}
                  </p>
                  <h2 className="font-heading text-2xl font-extrabold mb-1">{path.title}</h2>
                  <p
                    className={`text-sm font-semibold mb-4 ${
                      path.featured ? 'text-charcoal-200' : 'text-charcoal-500'
                    }`}
                  >
                    {path.forWho}
                  </p>
                  <p
                    className={`text-[0.95rem] leading-relaxed flex-1 ${
                      path.featured ? 'text-charcoal-200' : 'text-charcoal-600'
                    }`}
                  >
                    {path.body}
                  </p>
                  <span
                    className={`mt-6 inline-flex items-center gap-2 font-bold text-sm ${
                      path.featured ? 'text-white' : 'text-brand-red'
                    }`}
                  >
                    {path.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Phone fallback */}
          <div className="mt-10 text-center">
            <p className="text-charcoal-600">
              Prefer to talk it through?{' '}
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="inline-flex items-center gap-1.5 font-bold text-navy-800 hover:text-brand-red transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call {BUSINESS.phone}
              </a>
            </p>
          </div>
        </Container>
      </section>

      <AssurancesBand />
    </>
  );
}
