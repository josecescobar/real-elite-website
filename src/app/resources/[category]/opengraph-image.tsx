import { notFound } from 'next/navigation';
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { GUIDE_CATEGORIES } from '@/lib/blog';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Real Elite Contracting resource center';

type Params = Promise<{ category: string }>;

export function generateStaticParams() {
  return GUIDE_CATEGORIES.map((c) => ({ category: c.slug }));
}

export default async function OG({ params }: { params: Params }) {
  const { category } = await params;
  const cat = GUIDE_CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  return renderOgCard({
    eyebrow: 'Resource Center',
    title: cat.name,
    subtitle: cat.description,
  });
}
