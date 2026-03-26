import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts, getPostBySlug, formatDate } from '@/lib/blog';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Real Elite Contracting`,
    description: post.excerpt,
    alternates: {
      canonical: `https://www.realelitecontracting.com/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.featuredImage }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1a2744] py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">
              Blog
            </Link>
            <span className="text-gray-600 text-sm">/</span>
            <span className="text-gray-400 text-sm truncate">{post.category}</span>
          </div>
          <span className="inline-block bg-[#c0392b] text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{post.author}</span>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <div className="max-w-3xl mx-auto px-6 -mt-6">
        <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden shadow-lg">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      </div>

      {/* Article Body */}
      <article className="py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg max-w-none
            prose-headings:font-black prose-headings:text-[#1a2744]
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-[#c0392b] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[#1a2744]
            prose-ul:text-gray-700 prose-ol:text-gray-700
            prose-li:my-1
            prose-table:text-sm prose-th:bg-[#1a2744] prose-th:text-white prose-th:px-4 prose-th:py-2
            prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-gray-200
            prose-hr:border-gray-200 prose-hr:my-10">
            <MDXRemote source={post.content} />
          </div>

          {/* Author / CTA footer */}
          <div className="mt-14 pt-8 border-t border-gray-200">
            <div className="bg-[#1a2744] rounded-2xl p-8 text-center">
              <h3 className="text-xl font-black text-white mb-2">
                Ready to Get Started?
              </h3>
              <p className="text-gray-300 mb-6 text-sm">
                Contact Real Elite Contracting for a free estimate. Serving Martinsburg, Charles Town, and the Eastern Panhandle.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contact"
                  className="inline-block bg-[#c0392b] text-white font-semibold px-7 py-3 rounded-full hover:bg-[#a93226] transition-colors text-sm"
                >
                  Get a Free Estimate
                </Link>
                <a
                  href="tel:+16815345515"
                  className="inline-block bg-white/10 text-white font-semibold px-7 py-3 rounded-full hover:bg-white/20 transition-colors text-sm"
                >
                  Call (681) 534-5515
                </a>
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-8">
            <Link
              href="/blog"
              className="text-[#c0392b] text-sm font-semibold hover:underline"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
