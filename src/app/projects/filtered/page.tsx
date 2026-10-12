import ProjectsIndex from '@/components/projects/ProjectsIndex';
import { BUSINESS } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';

// Canonical stays on the public index. This route is only the rewrite target
// for /projects?service= and /projects?city=, so it is not a standalone URL.
export const metadata = buildMetadata({
  path: '/projects',
  title: `Our Projects | ${BUSINESS.name}`,
  description:
    'Explore remodeling and exterior photography. Detailed case studies are published after project facts and permissions are confirmed.',
  keywords: ['contractor projects', 'before and after', 'remodeling portfolio', 'Eastern Panhandle'],
});

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
