import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import { getRecentPosts, formatDate } from '@/lib/blog';

export default function FeaturedGuides() {
  const posts = getRecentPosts(3);
  if (posts.length === 0) return null;
  const [hero, ...rest] = posts;

  return (
    <section className="bg-white py-20 md:py-28">
      <Container size="wide">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <SectionHeader
            eyebrow="Homeowner Guides"
            title="Educational content from people who actually build it."
            subtitle="Written by our crew — pricing breakdowns, material comparisons, permit walk-throughs, and the questions every homeowner should ask before signing a contract."
          />
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-navy-800 hover:text-brand-red transition-colors group"
          >
            All Guides
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Hero article */}
          <article className="lg:col-span-7 group">
            <Link
              href={`/blog/${hero.slug}`}
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400 rounded-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg shadow-card-elevated mb-6">
                <Image
                  src={hero.featuredImage}
                  alt={hero.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3 text-xs uppercase tracking-[0.15em] font-semibold">
                  <span className="text-brand-red">{hero.category}</span>
                  <span className="text-charcoal-300">·</span>
                  <time className="text-charcoal-500" dateTime={hero.date}>
                    {formatDate(hero.date)}
                  </time>
                </div>
                <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-extrabold text-navy-800 leading-tight group-hover:text-brand-red transition-colors mb-3">
                  {hero.title}
                </h3>
                <p className="text-charcoal-600 leading-relaxed max-w-2xl">
                  {hero.excerpt}
                </p>
              </div>
            </Link>
          </article>

          {/* Stacked supporting articles */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8 lg:border-l lg:border-charcoal-100 lg:pl-8">
            {rest.map((post) => (
              <article key={post.slug} className="group">
                <Link
                  href={`/blog/${post.slug}`}
                  className="grid grid-cols-3 gap-4 items-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400 rounded-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md col-span-1">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 1024px) 33vw, 18vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-2 text-[0.65rem] uppercase tracking-[0.15em] font-semibold">
                      <span className="text-brand-red">{post.category}</span>
                      <span className="text-charcoal-300">·</span>
                      <time className="text-charcoal-500" dateTime={post.date}>
                        {formatDate(post.date)}
                      </time>
                    </div>
                    <h3 className="font-heading text-lg md:text-xl font-bold text-navy-800 leading-tight group-hover:text-brand-red transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

        <div className="md:hidden mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-navy-800 hover:text-brand-red transition-colors"
          >
            All Guides
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
