import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Hammer, MessageSquareText, MapPin, Award, ArrowRight } from 'lucide-react';
import { BUSINESS, OWNER } from '@/lib/constants';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import OwnerCard from '@/components/shared/OwnerCard';
import PrecisionProcess from '@/components/home/PrecisionProcess';
import AssurancesBand from '@/components/home/AssurancesBand';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: `About | Veteran-Owned Premium Contractor | ${BUSINESS.name}`,
  description:
    'Real Elite Contracting is a veteran-owned premium remodeling and exterior contractor serving the WV–MD–VA region. Built with military precision.',
  keywords: [
    'about Real Elite Contracting',
    'veteran-owned contractor',
    'WV contractor',
    'Eastern Panhandle contractor',
    'Frederick MD contractor',
    'Winchester VA contractor',
    'premium remodeling contractor',
  ],
  alternates: { canonical: `${BUSINESS.url}/about` },
  openGraph: {
    title: `About | Veteran-Owned Premium Contractor | ${BUSINESS.name}`,
    description:
      'Veteran-owned remodeling and exterior contractor — built on military precision, communication, and high-end execution.',
    url: `${BUSINESS.url}/about`,
    type: 'website',
  },
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Integrity',
    body: 'We tell you the same thing we tell our own families. No high-pressure sales, no upsells, no fine print.',
  },
  {
    icon: Hammer,
    title: 'Craftsmanship',
    body: 'Premium materials, real techniques, no shortcuts behind the drywall. Workmanship in writing.',
  },
  {
    icon: MessageSquareText,
    title: 'Communication',
    body: 'Named project lead. Daily updates. 24-hour response standard. You always know what is happening on your project.',
  },
  {
    icon: MapPin,
    title: 'Local Accountability',
    body: 'We live and work in this region. Our reputation here is the business — we behave accordingly.',
  },
];

const NUMBERS = [
  { value: '40+', label: 'Years of Experience' },
  { value: 'Written', label: 'Workmanship Warranty' },
  { value: 'Top-Rated', label: 'on Google' },
];

export default function AboutPage() {
  /**
   * AboutPage schema linking the page to the organization, plus an
   * embedded Person founder reference so Google understands the
   * veteran-owned positioning as structured data rather than just
   * marketing copy. Portrait is added conditionally — once
   * OWNER.portrait is set in constants.ts the image field appears in
   * the schema automatically.
   */
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${BUSINESS.name}`,
    url: `${BUSINESS.url}/about`,
    mainEntity: {
      '@type': 'Organization',
      '@id': `${BUSINESS.url}/#business`,
      name: BUSINESS.name,
      url: `${BUSINESS.url}/`,
      foundingLocation: {
        '@type': 'Place',
        name: `${BUSINESS.address.city}, ${BUSINESS.address.state}`,
      },
      founder: {
        '@type': 'Person',
        name: OWNER.name,
        jobTitle: OWNER.title,
        worksFor: { '@id': `${BUSINESS.url}/#business` },
        ...(OWNER.portrait ? { image: `${BUSINESS.url}${OWNER.portrait}` } : {}),
      },
      knowsAbout: [
        'Bathroom Remodeling',
        'Kitchen Remodeling',
        'Basement Finishing',
        'Roofing',
        'Decks and Outdoor Living',
        'Siding and Stone Exteriors',
        'Home Additions',
      ],
    },
  };

  return (
    <>
      <JsonLd schema={aboutSchema} />

      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-4">
              About Real Elite Contracting
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Veteran-owned.
              <br />
              <span className="text-brand-red">Built with precision.</span>
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              Premium remodeling and high-end exterior craftsmanship across the WV–MD–VA region —
              run with the same discipline, communication, and accountability you would expect from
              a unit, not a crew.
            </p>
          </div>
        </Container>
      </section>

      {/* Numbers strip */}
      <section className="bg-white border-b border-charcoal-100">
        <Container size="wide" className="py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-8 sm:divide-x divide-charcoal-100">
            {NUMBERS.map((n, idx) => (
              <div
                key={n.label}
                className={`text-center ${idx === 0 ? 'pl-0' : 'pl-6'}`}
              >
                <div className="font-heading text-3xl sm:text-4xl font-extrabold text-navy-800 tracking-tight leading-none">
                  {n.value}
                </div>
                <div className="text-charcoal-500 text-[0.65rem] sm:text-xs mt-2 tracking-[0.15em] uppercase font-semibold">
                  {n.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* The story */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-7 space-y-6">
              <SectionHeader
                eyebrow="The Story"
                title="Service first. Standards always."
              />
              <p className="text-charcoal-700 text-base md:text-lg leading-relaxed">
                Real Elite Contracting was founded by a U.S. military veteran who
                carried the same standard from service into civilian work: when you say you&apos;ll
                do something, you do it — to the spec, on the timeline, and you communicate every
                step. Construction in this region had drifted from that. We built Real Elite to
                bring it back.
              </p>
              <p className="text-charcoal-700 text-base md:text-lg leading-relaxed">
                That foundation shapes every decision: how we estimate (written and line-itemed),
                how we schedule (no double-booking your project lead), how we communicate (daily
                updates, named lead, 24-hour response standard), and how we close (final walkthrough
                with a written workmanship warranty before you sign off).
              </p>
              <p className="text-charcoal-700 text-base md:text-lg leading-relaxed">
                Today we build premium bathrooms, kitchens, basements, decks, roofs, and full home
                additions across the Eastern Panhandle WV, Frederick MD, Winchester VA, Loudoun
                County, and the surrounding region. The customers who hire us tend to send their
                neighbors next.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-card-elevated">
                <Image
                  src="/images/crew-dusk.jpg"
                  alt="Real Elite Contracting crew working on a roof at dusk"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="What We Stand For"
            title="Four standards. Every project."
            subtitle="The values aren&apos;t decoration. They&apos;re how we decide whether a project, a hire, or a sub-contractor meets the bar."
            align="center"
            className="mx-auto"
          />
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white rounded-lg p-7 shadow-sm border-t-4 border-brand-red"
                >
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-navy-800 text-white mb-5">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-heading text-lg font-extrabold text-navy-800 mb-2">
                    {v.title}
                  </h3>
                  <p className="text-charcoal-600 text-sm leading-relaxed">{v.body}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* The crew (placeholder) */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative aspect-[3/2] rounded-lg overflow-hidden shadow-card-elevated">
                <Image
                  src="/images/team.jpg"
                  alt="The Real Elite Contracting crew on the job site"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2">
              <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-3">
                The Crew
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 mb-5 leading-tight">
                The crew that starts your job is the crew that finishes it.
              </h2>
              <p className="text-charcoal-700 text-base md:text-lg leading-relaxed">
                We don&apos;t hand off projects between teams or rotate strangers through your
                house. Your project lead introduces themselves on day one and stays through the
                final walkthrough. The trades on your job are people we&apos;ve worked with for
                years — vetted, accountable, and held to the same standard the rest of the company
                runs on.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 bg-steel-50 border border-charcoal-100 rounded-md px-4 py-2 text-sm font-medium text-navy-800">
                  <Award className="w-4 h-4 text-brand-red" aria-hidden="true" />
                  Veteran-Owned &amp; Operated
                </div>
                <div className="inline-flex items-center gap-2 bg-steel-50 border border-charcoal-100 rounded-md px-4 py-2 text-sm font-medium text-navy-800">
                  <ShieldCheck className="w-4 h-4 text-brand-red" aria-hidden="true" />
                  Licensed &amp; Insured · WV · MD · VA
                </div>
              </div>
              <OwnerCard className="mt-7" />
            </div>
          </div>
        </Container>
      </section>

      {/* Process module */}
      <PrecisionProcess />

      {/* Assurances */}
      <AssurancesBand />

      {/* Final CTA */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <Container size="default" className="text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-5">
            Ready to work with us?
          </h2>
          <p className="text-charcoal-300 mb-8 max-w-2xl mx-auto">
            Tell us what you&apos;re picturing — three short steps, about 60 seconds, free written
            estimate within 24 business hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact#estimate"
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
