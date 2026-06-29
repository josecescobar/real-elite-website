import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectPageTemplate from '@/components/projects/ProjectPageTemplate';
import { buildMetadata } from '@/lib/seo';
import { getAllProjects, getProjectBySlug } from '@/lib/projects';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({
    path: `/projects/${project.slug}`,
    title: project.metaTitle,
    description: project.metaDescription,
    keywords: project.keywords,
    ogType: 'article',
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectPageTemplate project={project} />;
}
