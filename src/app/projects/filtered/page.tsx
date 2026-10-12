import ProjectsIndex, { projectsMetadata } from '@/components/projects/ProjectsIndex';

export const metadata = projectsMetadata;

// Reached only by the beforeFiles rewrite of /projects?service= or ?city=.
// The browser URL stays on /projects. This route is excluded from the sitemap.
export default async function ProjectsFilteredPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; city?: string }>;
}) {
  const { service, city } = await searchParams;
  return <ProjectsIndex service={service ?? null} city={city ?? null} />;
}
