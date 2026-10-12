import ProjectsIndex, { projectsMetadata } from '@/components/projects/ProjectsIndex';

export const metadata = projectsMetadata;

// No searchParams: this index prerenders. Filtered queries are rewritten to
// /projects/filtered before this static page can match.
export default function ProjectsPage() {
  return <ProjectsIndex service={null} city={null} />;
}
