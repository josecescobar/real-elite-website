import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Check,
  ClipboardCheck,
  Compass,
  Home,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import CampaignLink from '@/components/campaign/CampaignLink';
import CampaignViewTracker from '@/components/campaign/CampaignViewTracker';
import AssurancesBand from '@/components/home/AssurancesBand';
import JsonLd from '@/components/seo/JsonLd';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import { BUSINESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Premium Remodeling in Loudoun & the Eastern Panhandle',
  description:
    'Plan a premium kitchen, suite, basement, addition, or outdoor-living project with a veteran-owned contractor serving Loudoun and the Eastern Panhandle.',
  alternates: { canonical: `${BUSINESS.url}/premium-remodeling` },
  openGraph: {
    title: 'Premium Remodeling, Planned Before It Is Priced',
    description:
      'Clear planning bands, one accountable project lead, and a fit-first consultation for substantial home renovations.',
    url: `${BUSINESS.url}/premium-remodeling`,
    type: 'website',
    images: [
      {
        url: `${BUSINESS.url}/images/projects/kitchens/hero.jpg`,
        width: 1200,
        height: 630,
        alt: 'Completed premium kitchen renovation by Real Elite Contracting',
      },
    ],
  },
};

const OFFERS = [
  {
    title: 'Kitchen & Primary Suite',
    eyebrow: 'Interior Transformation',
    range: '$50k–$200k+',
    type: 'kitchen',
    image: '/images/projects/kitchens/hero.jpg',
    alt: 'Completed kitchen with custom cabinetry and a large center island',
    summary:
      'Layout changes, cabinetry, surfaces, lighting, tile, and coordinated primary-suite work under one project lead.',
    includes: ['Written scope before proposal', 'Trade and finish coordination', 'Occupied-home planning'],
  },
  {
    title: 'Basement, Addition & Flex Space',
    eyebrow: 'More Livable Space',
    range: '$75k–$500k+',
    type: 'basement',
    image: '/images/projects/basements/hero-framing.jpg',
    alt: 'Basement renovation framing underway in a Real Elite project',
    summary:
      'Finished lower levels, offices, guest suites, in-law space, and additions planned around how the home needs to work next.',
    includes: ['Feasibility and sequence review', 'Permit-aware scoping', 'Single accountable lead'],
  },
  {
    title: 'Covered Outdoor Living',
    eyebrow: 'Four-Season Backyard',
    range: '$40k–$150k+',
    type: 'outdoor-living',
    image: '/images/deck-night-lights.jpg',
    alt: 'Completed outdoor deck with integrated lighting at night',
    summary:
      'Composite decks, covered structures, lighting, railings, and connected entertaining spaces designed as one coherent project.',
    includes: ['Structure and drainage review', 'Material-system planning', 'Lighting and finish coordination'],
  },
] as const;

const MARKETS = [
  {
    title: 'Loudoun County, Virginia',
    places: 'Leesburg · Ashburn · Brambleton · Lansdowne · Middleburg',
    body: 'A consultation path for substantial, design-led renovations where finish coordination, communication, and protection of the occupied home matter as much as the build itself.',
  },
  {
    title: 'Jefferson & Berkeley Counties, West Virginia',
    places: 'Charles Town · Shepherdstown · Martinsburg · Spring Mills',
    body: 'Local execution for growing families adding finished space, upgrading builder-grade interiors, or creating a long-term outdoor living plan.',
  },
] as const;

const FAQS = [
  {
    question: 'Are these fixed prices?',
    answer:
      'No. They are broad planning bands for substantial projects, not bids or guarantees. Existing conditions, structural work, selections, access, engineering, and permit requirements determine the written proposal after the scope is developed.',
  },
  {
    question: 'Can you work with our designer or architect?',
    answer:
      'Yes. We can execute alongside an established designer or architect, or discuss the right design path during the first call if you have not selected one.',
  },
  {
    question: 'What happens after we submit the brief?',
    answer:
      'A project lead reviews the location, scope, planning range, and timing before calling. If the fit is right on both sides, the next step is an in-home walkthrough and a written scope—not a pressure-driven sales appointment.',
  },
];

const PLANNING_GUIDES = [
  {
    title: 'Planning a Luxury Kitchen',
    body: 'Layout, cabinetry, lighting, selections, and the sequence that keeps major decisions from becoming expensive changes.',
    href: '/blog/luxury-kitchen-renovation-loudoun-northern-virginia-2026',
  },
  {
    title: 'What Defines a Premium Primary Bath',
    body: 'The visible finishes—and the waterproofing, ventilation, and coordination behind them.',
    href: '/blog/luxury-bathroom-renovation-loudoun-northern-virginia-2026',
  },
  {
    title: 'Building a Better Lower Level',
    body: 'Moisture, egress, HVAC, room planning, and what separates added living space from a finished box.',
    href: '/blog/luxury-basement-finishing-loudoun-northern-virginia-2026',
  },
  {
    title: 'Designing Outdoor Living as One Project',
    body: 'Decks, covered structures, lighting, railings, and circulation planned as a connected space.',
    href: '/blog/luxury-outdoor-living-decks-loudoun-northern-virginia-2026',
  },
] as const;

export default function PremiumRemodelingPage() {
  return (
    <>
      <CampaignViewTracker />
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Premium Residential Remodeling',
          provider: {
            '@type': 'GeneralContractor',
            name: BUSINESS.name,
            url: BUSINESS.url,
            telephone: BUSINESS.phone,
          },
          areaServed: ['Loudoun County, Virginia', 'Berkeley County, West Virginia', 'Jefferson County, West Virginia'],
          serviceType: ['Kitchen remodeling', 'Bathroom remodeling', 'Basement finishing', 'Home additions', 'Outdoor living'],
          url: `${BUSINESS.url}/premium-remodeling`,
        }}
      />

      <section className="relative isolate overflow-hidden bg-navy-950 text-white">
        <Image
          src="/images/projects/kitchens/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/45" />
        <Container size="wide" className="relative py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-brand-red-light">
              Loudoun · Jefferson · Berkeley
            </p>
            <h1 className="font-heading text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              A major renovation should be planned before it is priced.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal-100 md:text-xl">
              Premium kitchens, suites, finished lower levels, additions, and outdoor living—with
              a clear brief, realistic planning band, and one accountable project lead from first
              conversation through final walkthrough.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <CampaignLink
                href="/design-consultation?utm_source=website&utm_medium=campaign_landing&utm_campaign=premium_market_90_day"
                location="hero"
              >
                Request a Project Call
              </CampaignLink>
              <CampaignLink href="#packages" location="hero" variant="secondary">
                Explore Planning Bands
              </CampaignLink>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-charcoal-100">
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-red-light" /> Veteran-owned</li>
              <li className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-brand-red-light" /> Licensed VA · WV · MD</li>
              <li className="flex items-center gap-2"><Home className="h-4 w-4 text-brand-red-light" /> Occupied-home planning</li>
            </ul>
          </div>
        </Container>
      </section>

      <section id="packages" className="scroll-mt-24 bg-white py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="Three Focused Offers"
            title="Start with the outcome—not a catalog of trades."
            subtitle="These planning bands help establish fit before design and discovery. Every written proposal is developed from the actual home, scope, selections, and permit requirements."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid gap-7 lg:grid-cols-3">
            {OFFERS.map((offer) => (
              <article key={offer.title} className="overflow-hidden rounded-xl border border-charcoal-100 bg-white shadow-card">
                <div className="relative aspect-[4/3] overflow-hidden bg-navy-900">
                  <Image src={offer.image} alt={offer.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                </div>
                <div className="p-6 md:p-7">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-red">{offer.eyebrow}</p>
                  <h2 className="mt-2 font-heading text-2xl font-extrabold text-navy-800">{offer.title}</h2>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-charcoal-500">Typical planning band</p>
                  <p className="mt-1 font-heading text-3xl font-extrabold text-navy-800">{offer.range}</p>
                  <p className="mt-4 leading-relaxed text-charcoal-600">{offer.summary}</p>
                  <ul className="mt-5 space-y-2">
                    {offer.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-charcoal-700">
                        <Check className="mt-0.5 h-4 w-4 flex-none text-brand-red" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <CampaignLink
                    href={`/design-consultation?type=${offer.type}&utm_source=website&utm_medium=offer_card&utm_campaign=premium_market_90_day`}
                    location="offer_card"
                    offer={offer.type}
                    className="mt-7 w-full"
                  >
                    Discuss This Project
                  </CampaignLink>
                </div>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-7 max-w-4xl text-center text-xs leading-relaxed text-charcoal-500">
            Planning bands are educational starting points only. They are not estimates, bids, or
            guarantees. Smaller-scope projects are welcome through the{' '}
            <Link href="/estimate" className="font-semibold text-navy-800 underline underline-offset-2 hover:text-brand-red">
              standard estimate path
            </Link>.
          </p>
        </Container>
      </section>

      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">Where We Are Focusing</p>
              <h2 className="mt-3 font-heading text-3xl font-extrabold leading-tight text-navy-800 md:text-4xl">
                Regional reach. Local accountability.
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-charcoal-600">
                This program concentrates premium project capacity in two connected markets: the
                Loudoun communities where design and finish expectations are highest, and the
                Eastern Panhandle communities where growing households need more capable space.
              </p>
            </div>
            <div className="grid gap-5 lg:col-span-7">
              {MARKETS.map((market) => (
                <article key={market.title} className="rounded-xl border border-charcoal-100 bg-white p-6 md:p-7">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-full bg-navy-800 text-white">
                      <MapPin className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-heading text-xl font-extrabold text-navy-800">{market.title}</h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-brand-red">{market.places}</p>
                      <p className="mt-3 leading-relaxed text-charcoal-600">{market.body}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-navy-900 py-16 text-white md:py-24">
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red-light">Fit-First Process</p>
              <h2 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">One short call before anyone comes to your home.</h2>
              <p className="mt-5 max-w-xl leading-relaxed text-charcoal-200">
                Share the scope, location, planning band, and timing. A project lead reviews the
                brief and calls in your requested window. An in-home walkthrough happens only when
                the project appears to fit both sides.
              </p>
              <CampaignLink
                href="/design-consultation?utm_source=website&utm_medium=campaign_process&utm_campaign=premium_market_90_day"
                location="process"
                className="mt-8"
              >
                Start the Project Brief
              </CampaignLink>
            </div>
            <ol className="space-y-4">
              {[
                ['01', 'Share the brief', 'Project type, ZIP code, planning band, desired timing, and call window.'],
                ['02', 'Confirm fit by phone', 'A real project conversation—scope, expectations, constraints, and next steps.'],
                ['03', 'Develop the written scope', 'When it fits, we walk the home, document conditions, and define the work before pricing.'],
              ].map(([step, title, body]) => (
                <li key={step} className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-5">
                  <span className="font-heading text-xl font-extrabold text-brand-red-light">{step}</span>
                  <div>
                    <h3 className="font-heading text-lg font-extrabold">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-charcoal-200">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 md:py-24">
        <Container size="default">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <Compass className="mx-auto h-9 w-9 text-brand-red" aria-hidden="true" />
              <h2 className="mt-4 font-heading text-3xl font-extrabold text-navy-800">Before you request a call</h2>
            </div>
            <div className="mt-9 space-y-3">
              {FAQS.map((item) => (
                <details key={item.question} className="group rounded-lg border border-charcoal-100 bg-steel-50 p-5">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-heading text-lg font-bold text-navy-800">
                    {item.question}
                    <span className="text-2xl text-brand-red transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-charcoal-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="Plan Before the Call"
            title="Four guides for making the brief sharper."
            subtitle="Use these decision-stage resources to identify priorities, constraints, and questions before the first project conversation."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {PLANNING_GUIDES.map((guide) => (
              <article key={guide.href} className="rounded-xl border border-charcoal-100 bg-white p-6 md:p-7">
                <h2 className="font-heading text-xl font-extrabold text-navy-800 md:text-2xl">
                  {guide.title}
                </h2>
                <p className="mt-3 leading-relaxed text-charcoal-600">{guide.body}</p>
                <Link
                  href={`${guide.href}?utm_source=website&utm_medium=campaign_resource&utm_campaign=premium_market_90_day`}
                  className="mt-5 inline-flex min-h-11 items-center font-bold text-navy-800 underline decoration-brand-red decoration-2 underline-offset-4 transition-colors hover:text-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400"
                >
                  Read the planning guide
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <AssurancesBand />
    </>
  );
}
