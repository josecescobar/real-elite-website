import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Container from '@/components/shared/Container';
import JsonLd from '@/components/seo/JsonLd';
import EstimateCTACard from '@/components/blog/EstimateCTACard';
import { BUSINESS } from '@/lib/constants';
import { buildBreadcrumbSchema, buildMetadata } from '@/lib/seo';
import { PERMIT_GUIDES, permitGuidePath } from '@/lib/permit-guides';

export const metadata = buildMetadata({
  path: '/permit-guides',
  title: `Remodel Permit Guides by County | ${BUSINESS.name}`,
  description:
    'County-by-county permit guides for decks, basements, bathrooms, kitchens, roofs, and additions in Virginia, Maryland, West Virginia, and Pennsylvania.',
  keywords: [
    'do I need a permit for a deck',
    'basement finishing permit',
    'bathroom remodel permit',
    'Fairfax County building permit',
    'Montgomery County building permit',
    'Loudoun County building permit',
  ],
});

export default function PermitGuidesIndexPage() {
  const va = PERMIT_GUIDES.filter((g) => g.state === 'VA');
  const md = PERMIT_GUIDES.filter((g) => g.state === 'MD');
  const wv = PERMIT_GUIDES.filter((g) => g.state === 'WV');
  const pa = PERMIT_GUIDES.filter((g) => g.state === 'PA');

  return (
    <>
      <JsonLd
        schema={buildBreadcrumbSchema([
          { name: 'Home', item: BUSINESS.url },
          { name: 'Resources', item: `${BUSINESS.url}/resources` },
          { name: 'Permit Guides', item: `${BUSINESS.url}/permit-guides` },
        ])}
      />
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Homeowner remodel permit guides by county',
          itemListElement: PERMIT_GUIDES.map((g, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${BUSINESS.url}${permitGuidePath(g.slug)}`,
            name: g.h1,
          })),
        }}
      />

      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-charcoal-300 mb-6">
            <Link href="/resources" className="hover:text-white transition-colors">
              Resources
            </Link>
            <span className="mx-2 text-charcoal-500">/</span>
            <span className="text-white">Permit Guides</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-4">
              Homeowner permit guides
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Do I need a permit for that?
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              Decks, basements, bathrooms, kitchens, roofs, and additions, answered county by
              county. Each guide links to the official county pages.
            </p>
          </div>
        </Container>
      </section>

      {[
        { label: 'Virginia', guides: va },
        { label: 'Maryland', guides: md },
        { label: 'West Virginia', guides: wv },
        { label: 'Pennsylvania', guides: pa },
      ].map((group) => (
        <section key={group.label} className="bg-white py-14 md:py-20 even:bg-steel-50">
          <Container size="wide">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-navy-800 mb-8">
              {group.label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {group.guides.map((g) => (
                <Link
                  key={g.slug}
                  href={permitGuidePath(g.slug)}
                  className="group bg-white border border-charcoal-100 rounded-lg p-6 hover:border-brand-red hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-heading text-lg font-extrabold text-navy-800 group-hover:text-brand-red transition-colors">
                      {g.county}, {g.state}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-charcoal-300 group-hover:text-brand-red transition-colors shrink-0" />
                  </div>
                  <p className="text-charcoal-600 text-sm leading-relaxed">{g.cardBlurb}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ))}

      <section className="bg-white pb-16 md:pb-24">
        <Container size="narrow">
          <p className="text-charcoal-600 text-sm leading-relaxed mt-4">
            These guides summarize official county and city pages; they are not legal advice, and
            the permit office for your parcel has the final word. When we build your project, we
            pull the permits and schedule the inspections.
          </p>
          <EstimateCTACard
            eyebrow="Free site visit"
            heading="Not sure what your project needs?"
            body="Tell us about the project. A real project lead reviews your request and schedules a free on-site walk-through, then puts the scope and permit path in a written estimate."
            href="/contact#estimate"
            label="Book a Free Site Visit"
          />
        </Container>
      </section>
    </>
  );
}
