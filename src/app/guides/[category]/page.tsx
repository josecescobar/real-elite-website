import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import { BUSINESS } from '@/lib/constants';
import {
  GUIDE_CATEGORIES,
  getPostsByCategorySlug,
  getRecentPosts,
  formatDate,
  type GuideCategorySlug,
} from '@/lib/blog';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return GUIDE_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = GUIDE_CATEGORIES.find((c) => c.slug === category);
  if (!cat) return {};
  return {
    title: `${cat.name} Guides | ${BUSINESS.name}`,
    description: cat.description,
    alternates: { canonical: `${BUSINESS.url}/guides/${cat.slug}` },
    openGraph: {
      title: `${cat.name} Guides | ${BUSINESS.name}`,
      description: cat.description,
      url: `${BUSINESS.url}/guides/${cat.slug}`,
      type: 'website',
    },
  };
}

export default async function GuideCategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = GUIDE_CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  const posts = getPostsByCategorySlug(cat.slug as GuideCategorySlug);
  const fallbackRecent = posts.length === 0 ? getRecentPosts(3) : [];

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-charcoal-300 mb-6">
            <Link href="/guides" className="hover:text-white transition-colors">
              Guides
            </Link>
            <span className="mx-2 text-charcoal-500">/</span>
            <span className="text-white">{cat.name}</span>
          </nav>

          <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-4">
            Homeowner Guides
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight max-w-3xl">
            {cat.name}.
          </h1>
          <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
            {cat.description}
          </p>
        </Container>
      </section>

      {/* Posts grid */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          {posts.length > 0 ? (
            <>
              <SectionHeader title={`All ${cat.name.toLowerCase()} guides`} />
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
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
                          <time className="text-charcoal-500" dateTime={post.date}>
                            {formatDate(post.date)}
                          </time>
                          <span className="text-charcoal-300">·</span>
                          <span className="text-charcoal-500">{post.readingTimeMinutes} min read</span>
                        </div>
                        <h3 className="font-heading text-lg md:text-xl font-bold text-navy-800 leading-tight group-hover:text-brand-red transition-colors mb-2">
                          {post.title}
                        </h3>
                        <p className="text-charcoal-600 text-sm leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-charcoal-600 mb-8">
                New guides on <strong className="text-navy-800">{cat.name.toLowerCase()}</strong> are
                in the pipeline. In the meantime, here&apos;s what&apos;s most recent.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
                {fallbackRecent.map((post) => (
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
                      <div className="p-4">
                        <h3 className="font-heading text-base font-bold text-navy-800 leading-tight group-hover:text-brand-red transition-colors">
                          {post.title}
                        </h3>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* Other categories */}
      <section className="bg-steel-50 py-16 md:py-24 border-t border-charcoal-100">
        <Container size="wide">
          <SectionHeader title="Browse other categories" />
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {GUIDE_CATEGORIES.filter((c) => c.slug !== cat.slug).map((other) => (
              <Link
                key={other.slug}
                href={`/guides/${other.slug}`}
                className="bg-white rounded-md px-4 py-3 text-sm font-semibold text-navy-800 hover:text-brand-red hover:shadow-sm transition-all border border-charcoal-100"
              >
                {other.name} →
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
