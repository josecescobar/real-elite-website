import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { type BlogPostMeta, formatDate, getResourceType } from '@/lib/blog';

/**
 * Blog post card used by both RelatedGuides modules (services pages and
 * in-article "keep reading"). Renders as an <li> — wrap in a <ul> grid.
 */
export default function GuideCard({ post }: { post: BlogPostMeta }) {
  const resourceType = getResourceType(post.typeSlug);
  return (
    <li className="border border-charcoal-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
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
            {resourceType && (
              <>
                <span className="text-charcoal-300">·</span>
                <span className="text-charcoal-500">{resourceType.name}</span>
              </>
            )}
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
  );
}
