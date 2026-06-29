import { notFound } from 'next/navigation';
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { getAllProjects, getProjectBySlug } from '@/lib/projects';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Real Elite Contracting project';

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

type Params = Promise<{ slug: string }>;

export default async function OG({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return renderOgCard({
    eyebrow: project.hero.eyebrow ?? 'Project',
    title: project.title,
    subtitle: project.summary,
  });
}
