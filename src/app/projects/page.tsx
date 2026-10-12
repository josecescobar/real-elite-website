import ProjectsIndex from '@/components/projects/ProjectsIndex';
import { BUSINESS } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  path: '/projects',
  title: `Our Projects | ${BUSINESS.name}`,
  description:
    'Explore remodeling and exterior photography. Detailed case studies are published after project facts and permissions are confirmed.',
  keywords: ['contractor projects', 'before and after', 'remodeling portfolio', 'Eastern Panhandle'],
});

// No searchParams: this index prerenders. Filtered queries are rewritten to
// /projects/filtered before this static page can match.
export default function ProjectsPage() {
  return <ProjectsIndex service={null} city={null} />;
}
