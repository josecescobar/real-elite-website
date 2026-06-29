import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import AssurancesBand from '@/components/home/AssurancesBand';
import ProjectCard from '@/components/projects/ProjectCard';
import { buildMetadata } from '@/lib/seo';
import { BUSINESS } from '@/lib/constants';
import { getAllProjects } from '@/lib/projects';

export const metadata = buildMetadata({
  path: '/projects',
  title: `Our Projects | ${BUSINESS.name}`,
  description:
    'Completed remodeling and exterior projects across WV, MD, and VA — real homes, real before-and-afters, and the craftsmanship behind every Real Elite job.',
  keywords: ['contractor projects', 'before and after', 'remodeling portfolio', 'Eastern Panhandle'],
});

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <>
      <section className="bg-navy-900 text-white py-20 md:py-28">
        <Container size="wide">
          <SectionHeader
            eyebrow="Our Work"
            title="Projects"
            subtitle="Real homes across the Eastern Panhandle and beyond — the work itself, start to finish."
            tone="light"
          />
        </Container>
      </section>

      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-charcoal-600 text-lg">New projects are being added soon.</p>
          )}
        </Container>
      </section>

      <AssurancesBand />
    </>
  );
}
