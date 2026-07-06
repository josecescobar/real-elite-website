import Link from 'next/link';
import { getRecentPosts, getAllPosts, type BlogPostMeta } from '@/lib/blog';
import GuideCard from '@/components/shared/GuideCard';

type Props = {
  /** Optional explicit blog slugs to surface */
  slugs?: readonly string[];
  /** Fallback: pull N most recent posts if no slugs given */
  fallbackCount?: number;
};

export default function RelatedGuides({ slugs, fallbackCount = 3 }: Props) {
  let posts: BlogPostMeta[] = [];
  if (slugs && slugs.length > 0) {
    const all = getAllPosts();
    posts = slugs
      .map((s) => all.find((p) => p.slug === s))
      .filter((p): p is BlogPostMeta => Boolean(p));
  }
  if (posts.length === 0) {
    posts = getRecentPosts(fallbackCount);
  }
  if (posts.length === 0) return null;

  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800">
          Related guides
        </h2>
        <Link
          href="/resources"
          className="text-sm font-semibold uppercase tracking-[0.12em] text-navy-800 hover:text-brand-red transition-colors"
        >
          All Guides →
        </Link>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.slice(0, 3).map((post) => (
          <GuideCard key={post.slug} post={post} />
        ))}
      </ul>
    </section>
  );
}
