import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import GuideTemplate from '@/components/blog/GuideTemplate';
import { BUSINESS } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';

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
  // Article URLs stay canonical at /blog/[slug]. Spread buildMetadata for the
  // consistent canonical + twitter card, then swap the default social card
  // for the post's featured image.
  const base = buildMetadata({
    path: `/blog/${slug}`,
    title: `${post.title} | ${BUSINESS.name}`,
    description: post.excerpt,
    ogType: 'article',
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      title: post.title,
      images: [{ url: post.featuredImage }],
    },
    twitter: {
      ...base.twitter,
      images: [post.featuredImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return <GuideTemplate post={post} />;
}
