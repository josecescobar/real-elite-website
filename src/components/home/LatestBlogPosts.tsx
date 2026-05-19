import Image from 'next/image';
import Link from 'next/link';
import { getRecentPosts, formatDate } from '@/lib/blog';

export default function LatestBlogPosts() {
  const posts = getRecentPosts(3);

  if (posts.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-brand-red font-semibold text-xs uppercase tracking-[0.15em] mb-2">
            Homeowner Guides
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 mb-3">
            Latest from the Blog
          </h2>
          <p className="text-charcoal-500 max-w-xl mx-auto text-sm">
            Tips, guides, and project breakdowns for homeowners across the WV–MD–VA region.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border border-charcoal-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="block relative h-44 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400"
              >
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </Link>

              <div className="p-5 flex flex-col flex-1">
                <span className="inline-block bg-navy-800/10 text-navy-800 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3 self-start">
                  {post.category}
                </span>

                <h3 className="text-base font-bold text-navy-800 leading-snug mb-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-brand-red transition-colors"
                  >
                    {post.title}
                  </Link>
                </h3>

                <p className="text-charcoal-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-charcoal-100">
                  <time className="text-xs text-charcoal-400" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-brand-red text-xs font-semibold hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-block border-2 border-navy-800 text-navy-800 font-semibold px-8 py-3 rounded-md hover:bg-navy-800 hover:text-white transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
}
