import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ChevronRight, Clock } from 'lucide-react';

import Container from '@/components/shared/Container';
import TableOfContents from './TableOfContents';
import ReadingProgressBar from './ReadingProgressBar';
import AuthorBox from './AuthorBox';
import StickyInArticleCTA from './StickyInArticleCTA';
import EstimateCTACard from './EstimateCTACard';
import InlineTestimonial from './InlineTestimonial';
import RelatedProjectsInline from './RelatedProjectsInline';
import RelatedGuides from './RelatedGuides';
import ArticleSchema from '@/components/seo/ArticleSchema';
import {
  formatDate,
  extractHeadings,
  getRelatedPosts,
  GUIDE_CATEGORIES,
  type BlogPost,
} from '@/lib/blog';
import { BUSINESS } from '@/lib/constants';

/* ----------- MDX heading anchor injection so TOC links resolve ----------- */

function slugifyHeading(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

function extractText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    const props = (node as { props?: { children?: ReactNode } }).props;
    return extractText(props?.children);
  }
  return '';
}

type HeadingProps = {
  children?: ReactNode;
  id?: string;
} & React.HTMLAttributes<HTMLHeadingElement>;

const mdxComponents = {
  h2: ({ children, ...props }: HeadingProps) => (
    <h2 id={slugifyHeading(extractText(children))} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: HeadingProps) => (
    <h3 id={slugifyHeading(extractText(children))} {...props}>
      {children}
    </h3>
  ),
  // Render inline markdown images through next/image (optimized, lazy-loaded,
  // no layout shift). In-article images are authored at a 3:2 ratio; declaring
  // the high-res intrinsic size (2560x1707) lets next/image serve crisp retina
  // variants from high-quality sources while `sizes` keeps the delivered bytes
  // small. Lower-res 3:2 sources are simply capped at their own resolution.
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <Image
      src={typeof src === 'string' ? src : ''}
      alt={alt ?? ''}
      width={2560}
      height={1707}
      quality={82}
      sizes="(max-width: 768px) 100vw, 768px"
      className="rounded-lg w-full h-auto my-8"
    />
  ),
  InlineTestimonial,
  EstimateCTACard,
};

/* -------------------------------- template ------------------------------- */

type Props = {
  post: BlogPost;
};

export default function GuideTemplate({ post }: Props) {
  const url = `${BUSINESS.url}/blog/${post.slug}`;
  const headings = extractHeadings(post.content);
  const related = getRelatedPosts(post.slug, 3);
  const category = GUIDE_CATEGORIES.find((c) => c.slug === post.categorySlug);
  const categoryHref = category ? `/guides/${category.slug}` : '/guides';
  const categoryLabel = category?.name ?? post.category;

  // Heuristic: feed the inline-projects module a hint based on category
  const projectsHint =
    post.categorySlug === 'roofing'
      ? 'roofing'
      : post.categorySlug === 'decks'
        ? 'deck'
        : post.categorySlug === 'remodeling'
          ? 'remodeling'
          : '';

  return (
    <>
      <ArticleSchema
        headline={post.title}
        description={post.excerpt}
        image={post.featuredImage}
        datePublished={post.date}
        url={url}
        author={post.author}
      />
      <ReadingProgressBar />

      {/* Hero */}
      <section className="bg-navy-900 text-white pt-14 pb-12 sm:pt-20 sm:pb-16">
        <Container size="default">
          <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-charcoal-300 mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/guides" className="hover:text-white transition-colors">
              Guides
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-charcoal-500" aria-hidden="true" />
            <Link href={categoryHref} className="hover:text-white transition-colors">
              {categoryLabel}
            </Link>
          </nav>

          <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-4">
            {categoryLabel}
          </p>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight max-w-4xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-sm text-charcoal-300">
            <span className="font-semibold text-white">{post.author}</span>
            <span className="text-charcoal-500" aria-hidden="true">·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="text-charcoal-500" aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {post.readingTimeMinutes} min read
            </span>
          </div>
        </Container>
      </section>

      {/* Featured image — bleeds out of the hero */}
      <div className="bg-navy-900">
        <Container size="default" className="pb-2">
          <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden shadow-card-elevated -mb-16 sm:-mb-24">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              priority
              quality={82}
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover"
            />
          </div>
        </Container>
        <div className="h-16 sm:h-24 bg-white" aria-hidden="true" />
      </div>

      {/* Article body + sticky TOC */}
      <article className="bg-white pb-16 sm:pb-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* TOC (desktop sidebar) */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-28">
                <TableOfContents headings={headings} />
              </div>
            </aside>

            {/* Body */}
            <div className="lg:col-span-9 xl:col-span-8">
              {/* TOC collapsed (mobile) */}
              {headings.length >= 3 && (
                <details className="lg:hidden mb-8 bg-steel-50 rounded-lg p-5 border border-charcoal-100">
                  <summary className="cursor-pointer font-heading font-bold text-navy-800 text-sm uppercase tracking-[0.12em]">
                    On this page
                  </summary>
                  <div className="mt-4">
                    <TableOfContents headings={headings} />
                  </div>
                </details>
              )}

              <div
                className="prose prose-editorial prose-lg max-w-none
                  prose-headings:font-heading prose-headings:text-navy-800
                  prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:font-extrabold prose-h2:mt-12 prose-h2:mb-4 prose-h2:scroll-mt-24
                  prose-h3:text-xl prose-h3:font-bold prose-h3:mt-10 prose-h3:mb-3 prose-h3:scroll-mt-24
                  prose-p:text-charcoal-700 prose-p:leading-relaxed
                  prose-a:text-brand-red prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-navy-800
                  prose-ul:text-charcoal-700 prose-ol:text-charcoal-700
                  prose-li:my-1
                  prose-blockquote:border-l-4 prose-blockquote:border-brand-red prose-blockquote:bg-steel-50 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:not-italic prose-blockquote:text-navy-800
                  prose-table:text-sm
                  prose-th:bg-navy-800 prose-th:text-white prose-th:px-4 prose-th:py-2
                  prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-charcoal-200
                  prose-img:rounded-lg
                  prose-hr:border-charcoal-200 prose-hr:my-10"
              >
                <MDXRemote source={post.content} components={mdxComponents} />
              </div>

              {/* Inline projects teaser */}
              <RelatedProjectsInline categoryHint={projectsHint} />

              {/* End-of-article estimate CTA */}
              <EstimateCTACard />

              {/* Author box */}
              <AuthorBox authorName={post.author} />

              {/* Related guides */}
              <div className="mt-16">
                <RelatedGuides posts={related} />
              </div>

              {/* Back to guides */}
              <div className="mt-12 text-center">
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-navy-800 hover:text-brand-red transition-colors"
                >
                  ← All Guides
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </article>

      <StickyInArticleCTA />
    </>
  );
}
