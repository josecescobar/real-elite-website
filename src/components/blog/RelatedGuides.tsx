import type { BlogPostMeta } from '@/lib/blog';
import GuideCard from '@/components/shared/GuideCard';

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
          <GuideCard key={post.slug} post={post} />
        ))}
      </ul>
    </section>
  );
}
