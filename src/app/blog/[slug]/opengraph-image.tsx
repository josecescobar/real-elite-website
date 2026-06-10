import { notFound } from 'next/navigation';
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { getPostBySlug, getAllPosts } from '@/lib/blog';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Real Elite Contracting homeowner guide';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function OG({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return renderOgCard({
    eyebrow: post.category,
    title: post.title,
    subtitle: post.excerpt,
  });
}
