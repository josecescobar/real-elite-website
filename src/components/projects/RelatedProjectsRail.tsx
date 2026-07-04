import Link from 'next/link';
import ProjectCard from './ProjectCard';
import type { Project } from '@/lib/projects';

/**
 * A rail of real project case-studies, used on service and city pages to
 * surface completed work from the Project System. Renders nothing when there
 * are no matching projects, so callers can drop it in unconditionally and it
 * only appears where real proof exists.
 */
export default function RelatedProjectsRail({
  projects,
  heading = 'Recent projects',
  viewAllHref = '/projects',
}: {
  projects: Project[];
  heading?: string;
  viewAllHref?: string;
}) {
  if (projects.length === 0) return null;

  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800">{heading}</h2>
        <Link
          href={viewAllHref}
          className="text-sm font-semibold uppercase tracking-[0.12em] text-navy-800 hover:text-brand-red transition-colors"
        >
          All projects →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
