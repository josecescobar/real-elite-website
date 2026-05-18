import Image from 'next/image';
import Link from 'next/link';
import { getRecentPosts, formatDate } from '@/lib/blog';

export default function LatestBlogPosts() {
  const posts = getRecentPosts(3);

  if (posts.length === 0) return null;

  return (
    <section className="py-20 md:py-24 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-[#c0392b] font-semibold text-sm uppercase tracking-widest mb-3">
            Resources
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-[#1a2744] mb-3">
            Latest from the Blog
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Tips, guides, and project insights for Eastern Panhandle homeowners.
          </p>
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Image */}
              <Link href={`/blog/${post.slug}`} className="block relative h-44 overflow-hidden">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </Link>

              <div className="p-5 flex flex-col flex-1">
                {/* Category */}
                <span className="inline-block bg-[#1a2744]/10 text-[#1a2744] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3 self-start">
                  {post.category}
                </span>

                {/* Title */}
                <h3 className="text-base font-black text-[#1a2744] leading-snug mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-[#c0392b] transition-colors">
                    {post.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <time className="text-xs text-gray-400" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-[#c0392b] text-xs font-semibold hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-block border-2 border-[#1a2744] text-[#1a2744] font-semibold px-8 py-3 rounded-full hover:bg-[#1a2744] hover:text-white transition-colors text-sm"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
}
