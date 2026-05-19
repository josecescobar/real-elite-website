import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { BlogPostMeta } from '@/lib/blog';
import { formatDate } from '@/lib/blog';

type Props = {
  posts: BlogPostMeta[];
  heading?: string;
};

/**
 * Related guides module — used inside articles and at the bottom of
 * category landing pages. Distinct from services/RelatedGuides which
 * runs on service pages.
 */
export default function RelatedGuides({ posts, heading = 'Keep reading' }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="not-prose">
      <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-6">
        {heading}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.slice(0, 3).map((post) => (
          <li
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
                <h3 className="font-heading text-base md:text-lg font-bold text-navy-800 leading-tight group-hover:text-brand-red transition-colors mb-3">
                  {post.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-navy-800 group-hover:text-brand-red transition-colors">
                  Read <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
