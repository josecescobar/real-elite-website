import type { Metadata } from 'next';
import Link from 'next/link';
import { BUSINESS } from '@/lib/constants';
import {
  COST_GUIDE_PATH,
  COST_GUIDE_TITLE,
  INVESTMENT_DISCLAIMER,
  costArticles,
  designBuildCategories,
  serviceRangeSections,
} from '@/lib/cost-guide';
import { FREE_FIRST_VISIT_SENTENCE } from '@/lib/project-trust';
import Container from '@/components/shared/Container';
import JsonLd from '@/components/seo/JsonLd';
import PhoneLink from '@/components/analytics/PhoneLink';
import SaveAsPdfButton from '@/components/cost-guide/SaveAsPdfButton';
import { buildBreadcrumbSchema, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  path: COST_GUIDE_PATH,
  title: `Free Home Project Cost Guide (PDF) | ${BUSINESS.name}`,
  description:
    'Free printable cost guide: typical ranges for kitchens, baths, basements, additions, decks, roofing and siding, and what moves the number. No email needed.',
  keywords: [
    'remodel cost guide',
    'kitchen remodel cost',
    'basement finishing cost',
    'home addition cost',
    'free cost guide PDF',
    'Real Elite Contracting',
  ],
});

export default function CostGuidePage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', item: BUSINESS.url },
    { name: 'Cost Guide', item: `${BUSINESS.url}${COST_GUIDE_PATH}` },
  ]);
  const categories = designBuildCategories();
  const services = serviceRangeSections();
  const articles = costArticles();

  return (
    <div data-cost-guide className="bg-white print:text-black">
      <JsonLd schema={breadcrumb} />

      {/* Cover */}
      <section className="bg-navy-900 text-white pt-20 pb-16 md:pt-28 md:pb-20 print:bg-white print:text-black print:pt-0 print:pb-6">
        <Container size="default">
          <p className="text-brand-red-light text-xs uppercase tracking-[0.22em] font-semibold mb-5 print:text-black">
            Free cost guide · {BUSINESS.name}
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl leading-[1.04] max-w-3xl">
            {COST_GUIDE_TITLE}
          </h1>
          <p className="text-charcoal-300 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl print:text-black print:text-base">
            The typical ranges we publish across the site, in one document you can keep: what each
            kind of project tends to cost, and what moves the number. For homeowners across West
            Virginia, Virginia, Maryland and Pennsylvania.
          </p>
          <p className="text-white font-semibold mt-6 max-w-2xl print:text-black">
            {FREE_FIRST_VISIT_SENTENCE}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-8 print:hidden">
            <SaveAsPdfButton location="cost_guide_hero" />
            <p className="text-charcoal-300 text-sm max-w-xs">
              No email needed. Choose &ldquo;Save as PDF&rdquo; in the print dialog.
            </p>
          </div>
          <p className="hidden print:block text-sm mt-4">
            {BUSINESS.url}
            {COST_GUIDE_PATH} · {BUSINESS.phone}
          </p>
        </Container>
      </section>

      {/* Design-build ranges */}
      <section className="py-14 md:py-20 print:py-6">
        <Container size="default">
          <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-3">
            Part one
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-navy-900 leading-tight">
            Design-build projects
          </h2>
          <p className="text-charcoal-600 mt-3 leading-relaxed max-w-3xl">{INVESTMENT_DISCLAIMER}</p>

          <div className="mt-10 space-y-12 print:space-y-8">
            {categories.map((c) => (
              <article key={c.slug} className="break-inside-avoid border-t border-steel-200 pt-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-heading text-2xl md:text-3xl text-navy-900">{c.title}</h3>
                  <p className="font-heading text-xl text-brand-red tabular-nums">{c.typical}</p>
                </div>
                <p className="text-charcoal-600 mt-3 leading-relaxed">{c.summary}</p>
                <table className="w-full mt-5 text-sm border-collapse">
                  <caption className="sr-only">{c.title} typical ranges</caption>
                  <thead>
                    <tr className="text-left text-charcoal-500 uppercase tracking-[0.12em] text-[0.65rem]">
                      <th scope="col" className="py-2 pr-4 font-semibold">Project</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">Typical range</th>
                      <th scope="col" className="py-2 font-semibold hidden sm:table-cell print:table-cell">
                        What it usually includes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.tiers.map((t) => (
                      <tr key={t.name} className="border-t border-steel-200 align-top">
                        <th scope="row" className="py-3 pr-4 text-left font-semibold text-navy-900">
                          {t.name}
                        </th>
                        <td className="py-3 pr-4 tabular-nums text-navy-900 whitespace-nowrap">{t.range}</td>
                        <td className="py-3 text-charcoal-600 hidden sm:table-cell print:table-cell">{t.includes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <h4 className="font-heading text-base text-navy-900 mt-5">What moves the number</h4>
                <ul className="mt-2 space-y-1.5 text-sm text-charcoal-700">
                  {c.drivers.map((d) => (
                    <li key={d} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2 w-1.5 h-px bg-brand-red flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
                <p className="text-sm mt-4 print:hidden">
                  <Link href={c.href} className="link-editorial font-medium text-navy-900">
                    More on {c.title.toLowerCase()} →
                  </Link>
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Service ranges */}
      <section className="bg-steel-50 py-14 md:py-20 border-y border-steel-200 print:bg-white print:py-6 print:break-before-page">
        <Container size="default">
          <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-3">
            Part two
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-navy-900 leading-tight">
            Exterior, deck and remodeling ranges
          </h2>
          <p className="text-charcoal-600 mt-3 leading-relaxed max-w-3xl">
            The ranges from our service pages. Every project is priced from its own site visit and
            scope.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
            {services.map((s) => (
              <article key={s.slug} className="break-inside-avoid bg-white border border-steel-200 rounded-lg p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-heading text-xl text-navy-900">{s.title}</h3>
                  <p className="text-sm text-charcoal-600">
                    Starting at <span className="font-semibold text-brand-red">{s.startingAt}</span>
                  </p>
                </div>
                <ul className="mt-4 divide-y divide-steel-200 text-sm">
                  {s.tiers.map((t) => (
                    <li key={t.tier} className="py-2.5">
                      <div className="flex justify-between gap-3">
                        <span className="font-semibold text-navy-900">{t.tier}</span>
                        <span className="tabular-nums text-navy-900 whitespace-nowrap">{t.range}</span>
                      </div>
                      {t.notes && <p className="text-charcoal-600 mt-0.5">{t.notes}</p>}
                    </li>
                  ))}
                </ul>
                {s.note && <p className="text-xs text-charcoal-500 mt-3 leading-relaxed">{s.note}</p>}
                <p className="text-sm mt-3 print:hidden">
                  <Link href={s.href} className="link-editorial font-medium text-navy-900">
                    {s.title} →
                  </Link>
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Further reading */}
      {articles.length > 0 && (
        <section className="py-14 md:py-20 print:py-6">
          <Container size="default">
            <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-3">
              Part three
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-navy-900 leading-tight">
              Our cost articles
            </h2>
            <p className="text-charcoal-600 mt-3 leading-relaxed max-w-3xl">
              Longer write-ups on specific projects and places, on the Resources page.
            </p>
            <ul className="mt-8 divide-y divide-steel-200 border-y border-steel-200">
              {articles.map((a) => (
                <li key={a.slug} className="py-3">
                  <Link href={`/blog/${a.slug}`} className="text-navy-900 font-medium hover:text-brand-red transition-colors">
                    {a.title}
                  </Link>
                  <span className="hidden print:inline text-xs text-charcoal-500">
                    {' '}
                    ({BUSINESS.url}/blog/{a.slug})
                  </span>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Free site visit */}
      <section className="bg-navy-900 text-white py-14 md:py-20 print:bg-white print:text-black print:py-6 break-inside-avoid">
        <Container size="default">
          <p className="text-brand-red-light text-xs uppercase tracking-[0.22em] font-semibold mb-4 print:text-black">
            Free site visit
          </p>
          <h2 className="font-heading text-3xl md:text-4xl leading-tight max-w-2xl">
            A range is a starting point. The site visit is where the number gets real.
          </h2>
          <p className="text-charcoal-300 mt-4 leading-relaxed max-w-2xl print:text-black">
            {FREE_FIRST_VISIT_SENTENCE} Call{' '}
            <PhoneLink location="cost_guide_cta" className="text-white font-medium link-editorial print:text-black">
              {BUSINESS.phone}
            </PhoneLink>{' '}
            or request a visit online.
          </p>
          <div className="flex flex-wrap gap-4 mt-8 print:hidden">
            <Link
              href="/design-consultation"
              className="inline-flex items-center gap-2 bg-white text-navy-900 px-7 py-4 rounded-md font-semibold text-sm hover:bg-brand-red-light transition-colors focus-ring-on-navy"
            >
              Book a free site visit
            </Link>
            <Link
              href="/estimate"
              className="inline-flex items-center gap-2 border border-white/35 text-white px-7 py-4 rounded-md font-semibold text-sm hover:bg-white/10 transition-colors focus-ring-on-navy"
            >
              Smaller project? Free estimate
            </Link>
            <SaveAsPdfButton location="cost_guide_footer" />
          </div>
        </Container>
      </section>
    </div>
  );
}
