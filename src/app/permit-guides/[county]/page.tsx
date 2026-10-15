import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ChevronRight, ExternalLink } from 'lucide-react';
import Container from '@/components/shared/Container';
import ArticleSchema from '@/components/seo/ArticleSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import JsonLd from '@/components/seo/JsonLd';
import EstimateCTACard from '@/components/blog/EstimateCTACard';
import { BUSINESS } from '@/lib/constants';
import { townPagesForGuide } from '@/lib/permit-guide-links';
import { buildBreadcrumbSchema, buildMetadata } from '@/lib/seo';
import { formatDate, getPostBySlug } from '@/lib/blog';
import {
  PERMIT_GUIDES,
  VERDICT_LABELS,
  getPermitGuide,
  permitGuidePath,
  plainPermitText,
  serviceLinkFor,
  sourceById,
  type CountyPermitGuide,
  type InlineCitedText,
} from '@/lib/permit-guides';

interface Props {
  params: Promise<{ county: string }>;
}

export function generateStaticParams() {
  return PERMIT_GUIDES.map((g) => ({ county: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { county } = await params;
  const guide = getPermitGuide(county);
  if (!guide) return { robots: { index: false } };
  return buildMetadata({
    path: permitGuidePath(guide.slug),
    title: guide.seoTitle,
    description: guide.metaDescription ?? guide.description,
    ogType: 'article',
    keywords: guide.keywords,
  });
}

const VERDICT_STYLES: Record<CountyPermitGuide['jobs'][number]['verdict'], string> = {
  required: 'bg-accent-50 text-brand-red-dark border-brand-red-light',
  depends: 'bg-gold-50 text-gold-800 border-gold-200',
  'often-exempt': 'bg-steel-50 text-navy-800 border-charcoal-200',
  check: 'bg-steel-50 text-charcoal-700 border-charcoal-200',
};

function SourceLinks({ ids }: { ids: readonly string[] }) {
  if (ids.length === 0) return null;
  return (
    <span className="text-xs text-charcoal-500">
      {' '}
      Source:{' '}
      {ids.map((id, i) => {
        const src = sourceById(id);
        if (!src) return null;
        return (
          <span key={id}>
            {i > 0 && ', '}
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-charcoal-300 hover:text-brand-red"
            >
              {src.label}
            </a>
          </span>
        );
      })}
      .
    </span>
  );
}

function InlineCitations({ value }: { value: InlineCitedText }) {
  if (typeof value === 'string') return value;
  return value.map((part, index) => (
    <span key={index}>
      {index > 0 && ' '}
      {part.text}
      <SourceLinks ids={part.sources} />
    </span>
  ));
}

export default async function PermitGuidePage({ params }: Props) {
  const { county } = await params;
  const guide = getPermitGuide(county);
  if (!guide) notFound();

  const path = permitGuidePath(guide.slug);
  const url = `${BUSINESS.url}${path}`;
  const areas = townPagesForGuide(guide.slug);
  const posts = guide.relatedPosts
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const otherGuides = PERMIT_GUIDES.filter((g) => g.slug !== guide.slug);
  const guideSources = guide.sourceIds
    .map((id) => sourceById(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      <ArticleSchema
        headline={guide.h1}
        description={guide.description}
        image="/opengraph-image"
        datePublished={guide.published}
        dateModified={guide.updated}
        url={url}
      />
      <FAQSchema items={guide.faqs.map((f) => ({ question: f.question, answer: plainPermitText(f.answer) }))} />
      <JsonLd
        schema={buildBreadcrumbSchema([
          { name: 'Home', item: BUSINESS.url },
          { name: 'Resources', item: `${BUSINESS.url}/resources` },
          { name: 'Permit Guides', item: `${BUSINESS.url}/permit-guides` },
          { name: guide.county, item: url },
        ])}
      />

      {/* Hero */}
      <section className="bg-navy-900 text-white pt-14 pb-14 sm:pt-20 sm:pb-20">
        <Container size="default">
          <nav
            aria-label="Breadcrumb"
            className="text-xs sm:text-sm text-charcoal-300 mb-6 flex items-center gap-2 flex-wrap"
          >
            <Link href="/resources" className="hover:text-white transition-colors">
              Resources
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-charcoal-500" aria-hidden="true" />
            <Link href="/permit-guides" className="hover:text-white transition-colors">
              Permit Guides
            </Link>
          </nav>
          <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-4">
            {guide.county}, {guide.stateName} · Homeowner permit guide
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.08] tracking-tight max-w-4xl">
            {guide.h1}
          </h1>
          <p className="text-charcoal-300 text-sm mt-6">
            Checked against official {guide.slug === 'fauquier-county-va' ? 'Town of Warrenton' : guide.county} sources · Updated{' '}
            <time dateTime={guide.updated}>{formatDate(guide.updated)}</time>
          </p>
        </Container>
      </section>

      <article className="bg-white py-14 sm:py-20">
        <Container size="narrow">
          {/* Answer block */}
          <p className="text-charcoal-800 text-lg md:text-xl leading-relaxed border-l-4 border-brand-red pl-5 mb-12">
            <InlineCitations value={guide.answer} />
          </p>

          {/* Who issues */}
          <section aria-labelledby="who-issues" className="mb-14">
            <h2 id="who-issues" className="font-heading text-2xl sm:text-3xl font-extrabold text-navy-800 mb-3">
              Who issues the permit depends on your address
            </h2>
            <p className="text-charcoal-700 leading-relaxed mb-6"><InlineCitations value={guide.jurisdictionIntro} /></p>
            <ul className="space-y-4">
              {guide.issuers.map((issuer) => (
                <li key={issuer.name} className="border border-charcoal-100 rounded-lg p-5">
                  <p className="font-heading font-bold text-navy-800">{issuer.name}</p>
                  <p className="text-charcoal-700 text-sm leading-relaxed mt-1">
                    {issuer.covers}
                    <SourceLinks ids={issuer.sources} />
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Job by job */}
          <section aria-labelledby="job-by-job" className="mb-14">
            <h2 id="job-by-job" className="font-heading text-2xl sm:text-3xl font-extrabold text-navy-800 mb-3">
              Do I need a permit? Job by job
            </h2>
            <p className="text-charcoal-700 leading-relaxed mb-6">
              Short answers for the remodel jobs homeowners ask us about most. Your exact scope decides
              the answer, so confirm with the permit office for your parcel.
            </p>
            <div className="space-y-4">
              {guide.jobs.map((job) => {
                const service = serviceLinkFor(job.service);
                return (
                  <div key={job.job} className="border border-charcoal-100 rounded-lg p-5">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-heading text-lg font-bold text-navy-800">{job.job}</h3>
                      <span
                        className={`text-[0.65rem] uppercase tracking-[0.14em] font-semibold border rounded px-2 py-0.5 ${VERDICT_STYLES[job.verdict]}`}
                      >
                        {VERDICT_LABELS[job.verdict]}
                      </span>
                    </div>
                    <p className="text-charcoal-700 text-sm leading-relaxed">
                      {job.summary}
                      <SourceLinks ids={job.sources} />
                    </p>
                    {service && (
                      <Link
                        href={service.href}
                        className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-brand-red hover:text-brand-red-dark"
                      >
                        {service.label}
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Steps */}
          <section aria-labelledby="steps" className="mb-14">
            <h2 id="steps" className="font-heading text-2xl sm:text-3xl font-extrabold text-navy-800 mb-5">
              {guide.slug === 'fauquier-county-va' ? 'The Town of Warrenton permit path' : `The typical permit steps in ${guide.county}`}
            </h2>
            <ol className="space-y-4 list-decimal pl-6 marker:font-bold marker:text-brand-red">
              {guide.steps.map((step) => (
                <li key={step.text} className="text-charcoal-700 leading-relaxed pl-1">
                  {step.text}
                  <SourceLinks ids={step.sources} />
                </li>
              ))}
            </ol>
          </section>

          {/* HOA + historic */}
          <section aria-labelledby="hoa" className="mb-14">
            <h2 id="hoa" className="font-heading text-2xl sm:text-3xl font-extrabold text-navy-800 mb-4">
              HOA approval and historic districts are separate
            </h2>
            <p className="text-charcoal-700 leading-relaxed mb-4">
              {guide.hoa.text}
              <SourceLinks ids={guide.hoa.sources} />
            </p>
            <p className="text-charcoal-700 leading-relaxed">
              {guide.historic.text}
              <SourceLinks ids={guide.historic.sources} />
            </p>
          </section>

          {/* How we handle it */}
          <section aria-labelledby="how-we-handle" className="mb-6">
            <h2 id="how-we-handle" className="font-heading text-2xl sm:text-3xl font-extrabold text-navy-800 mb-4">
              How Real Elite handles permits
            </h2>
            <p className="text-charcoal-700 leading-relaxed">
              On a job we build, we confirm which office has jurisdiction over your parcel, pull the
              permits the scope needs, and schedule the inspections. Start with a free site visit:
              we walk the project with you, tell you what we expect the permit path to be, and put
              it in a written estimate. If something on this page doesn&rsquo;t match what the
              county tells you, the county is right.
            </p>
          </section>

          <EstimateCTACard
            eyebrow="Free site visit"
            heading={`Planning a remodel in ${guide.county}?`}
            body="Tell us about the project. A real project lead reviews your request and schedules a free on-site walk-through. The visit is free and so is the written estimate."
            href="/contact#estimate"
            label="Book a Free Site Visit"
          />

          {/* FAQ */}
          <section aria-labelledby="faq" className="mb-14">
            <h2 id="faq" className="font-heading text-2xl sm:text-3xl font-extrabold text-navy-800 mb-5">
              Quick questions
            </h2>
            <dl className="space-y-6">
              {guide.faqs.map((f) => (
                <div key={f.question}>
                  <dt className="font-heading font-bold text-navy-800">{f.question}</dt>
                  <dd className="text-charcoal-700 leading-relaxed mt-1"><InlineCitations value={f.answer} /></dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Sources */}
          <section aria-labelledby="sources" className="mb-14">
            <h2 id="sources" className="font-heading text-xl font-extrabold text-navy-800 mb-3">
              Official sources
            </h2>
            <p className="text-charcoal-600 text-sm leading-relaxed mb-4">
              Last checked {formatDate(guide.updated)}. Rules change, so confirm with the county before
              you file.
            </p>
            <ul className="space-y-2 text-sm">
              {guideSources.map((src) => (
                <li key={src.id}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1.5 text-navy-800 underline decoration-charcoal-300 hover:text-brand-red"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                    {src.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Internal links */}
          {areas.length > 0 && (
            <section aria-labelledby="areas" className="mb-10">
              <h2 id="areas" className="font-heading text-xl font-extrabold text-navy-800 mb-3">
                Where we work in {guide.county}
              </h2>
              <ul className="flex flex-wrap gap-2">
                {areas.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={a.href}
                      className="inline-block border border-charcoal-200 rounded-full px-4 py-1.5 text-sm text-navy-800 hover:border-brand-red hover:text-brand-red"
                    >
                      {a.city}, {a.state}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {posts.length > 0 && (
            <section aria-labelledby="related-guides" className="mb-10">
              <h2 id="related-guides" className="font-heading text-xl font-extrabold text-navy-800 mb-3">
                Related guides
              </h2>
              <ul className="space-y-2">
                {posts.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="text-navy-800 underline decoration-charcoal-300 hover:text-brand-red">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="other-counties">
            <h2 id="other-counties" className="font-heading text-xl font-extrabold text-navy-800 mb-3">
              Permit guides for other counties
            </h2>
            <ul className="space-y-2">
              {otherGuides.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={permitGuidePath(g.slug)}
                    className="text-navy-800 underline decoration-charcoal-300 hover:text-brand-red"
                  >
                    {g.county}, {g.state} permit guide
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Container>
      </article>
    </>
  );
}
