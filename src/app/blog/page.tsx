import Image from 'next/image';
import Link from 'next/link';
import { getAllPosts, formatDate } from '@/lib/blog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Real Elite Contracting',
  description:
    "Tips, guides, and project insights from Eastern Panhandle's most trusted contractor. Roofing, decks, siding, and home improvement advice for WV homeowners.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1a2744] py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#c0392b] font-semibold text-sm uppercase tracking-widest mb-3">
            Resources
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Blog
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Tips, guides, and project insights from Eastern Panhandle&apos;s most trusted contractor.
          </p>
        </div>
      </section>

      {/* Post Grid */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Featured Image */}
                  <Link href={`/blog/${post.slug}`} className="block relative h-52 w-full overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </Link>

                  <div className="p-6 flex flex-col flex-1">
                    {/* Category tag */}
                    <span className="inline-block bg-[#1a2744]/10 text-[#1a2744] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3 self-start">
                      {post.category}
                    </span>

                    {/* Title */}
                    <h2 className="text-xl font-black text-[#1a2744] mb-2 leading-snug">
                      <Link href={`/blog/${post.slug}`} className="hover:text-[#c0392b] transition-colors">
                        {post.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <time className="text-xs text-gray-400" dateTime={post.date}>
                        {formatDate(post.date)}
                      </time>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-[#c0392b] text-sm font-semibold hover:underline"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black text-[#1a2744] mb-3">
            Ready to Start Your Project?
          </h2>
          <p className="text-gray-600 mb-6">
            Contact Eastern Panhandle&apos;s most trusted contractor for a free estimate.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#c0392b] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#a93226] transition-colors"
          >
            Get a Free Estimate
          </Link>
        </div>
      </section>
    </>
  );
}
