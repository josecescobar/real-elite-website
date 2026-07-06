import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import { BUSINESS } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';
import { GUIDE_CATEGORIES, getAllPosts, getPostsByCategorySlug, formatDate } from '@/lib/blog';

export const metadata = buildMetadata({
  path: '/resources',
  title: `Resource Center | ${BUSINESS.name}`,
  description:
    'Cost guides, permit walk-throughs, material comparisons, and the questions every homeowner should ask before signing a contract — the Real Elite knowledge hub.',
  keywords: [
    'homeowner resource center',
    'remodel pricing',
    'bathroom remodel cost',
    'deck material comparison',
    'roofing replacement guide',
    'permit guide',
    'home renovation tips',
    'Eastern Panhandle',
  ],
});

export default function ResourcesIndexPage() {
  const all = getAllPosts();
  const [featured, ...rest] = all;

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-4">
              Built With Military Precision
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Resource Center.
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              Pricing breakdowns, material comparisons, permit walk-throughs, and the
              questions every homeowner should ask before signing a contract — written by
              the same crew that runs the projects.
            </p>
          </div>
        </Container>
      </section>

      {/* Featured article */}
      {featured && (
        <section className="bg-white py-16 md:py-24">
          <Container size="wide">
            <Link href={`/blog/${featured.slug}`} className="block group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="relative lg:col-span-7 aspect-[16/10] overflow-hidden rounded-lg shadow-card-elevated">
                  <Image
                    src={featured.featuredImage}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="lg:col-span-5">
                  <p className="text-brand-red font-semibold text-xs uppercase tracking-[0.18em] mb-3">
                    Latest Guide
                  </p>
                  <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy-800 leading-tight group-hover:text-brand-red transition-colors mb-4">
                    {featured.title}
                  </h2>
                  <p className="text-charcoal-600 leading-relaxed mb-5 max-w-prose">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.15em] font-semibold text-charcoal-500">
                    <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                    <span className="text-charcoal-300">·</span>
                    <span>{featured.readingTimeMinutes} min read</span>
                  </div>
                </div>
              </div>
            </Link>
          </Container>
        </section>
      )}

      {/* Categories */}
      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="Browse by topic"
            title="Pick a category."
            subtitle="The guides organized by the project type homeowners actually search for."
          />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GUIDE_CATEGORIES.map((cat) => {
              const count = getPostsByCategorySlug(cat.slug).length;
              return (
                <Link
                  key={cat.slug}
                  href={`/resources/${cat.slug}`}
                  className="group bg-white border border-charcoal-100 rounded-lg p-5 hover:border-brand-red hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-heading text-lg font-extrabold text-navy-800 group-hover:text-brand-red transition-colors">
                      {cat.name}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-charcoal-300 group-hover:text-brand-red transition-colors" />
                  </div>
                  <p className="text-charcoal-600 text-xs leading-relaxed mb-2">
                    {cat.description}
                  </p>
                  <p className="text-[0.65rem] uppercase tracking-[0.15em] font-semibold text-charcoal-400">
                    {count} {count === 1 ? 'guide' : 'guides'}
                  </p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* All recent posts list */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="All guides"
            title="Latest first."
          />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <article
                key={post.slug}
                className="border border-charcoal-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link href={`/blog/${post.slug}`} className="block group">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2 text-[0.65rem] uppercase tracking-[0.15em] font-semibold">
                      <span className="text-brand-red">{post.category}</span>
                      <span className="text-charcoal-300">·</span>
                      <time className="text-charcoal-500" dateTime={post.date}>
                        {formatDate(post.date)}
                      </time>
                    </div>
                    <h3 className="font-heading text-base md:text-lg font-bold text-navy-800 leading-tight group-hover:text-brand-red transition-colors mb-2">
                      {post.title}
                    </h3>
                    <p className="text-charcoal-600 text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
