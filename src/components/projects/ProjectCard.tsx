import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { resolveCity, type Project } from '@/lib/projects';
import { SERVICES } from '@/lib/constants';

/**
 * Project grid card — used on the /projects index and the related-projects
 * rail. Renders the public lens: hero image, service + city, title, summary.
 */
export default function ProjectCard({ project }: { project: Project }) {
  const city = resolveCity(project.citySlug);
  const serviceTitle = SERVICES.find((s) => s.slug === project.service)?.title ?? project.service;
  const location = city ? `${city.city}, ${city.state}` : undefined;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-lg bg-white shadow-card-elevated focus-ring"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={project.hero.image.src}
          alt={project.hero.image.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div aria-hidden="true" className="absolute inset-0 gradient-navy-overlay opacity-60" />
      </div>
      <div className="p-6">
        <p className="text-brand-red text-xs uppercase tracking-[0.16em] font-semibold mb-2">
          {serviceTitle}
          {location ? ` · ${location}` : ''}
        </p>
        <h3 className="font-heading text-xl font-extrabold text-navy-800 leading-tight group-hover:text-brand-red transition-colors">
          {project.title}
        </h3>
        <p className="text-charcoal-600 text-sm mt-3 leading-relaxed line-clamp-3">
          {project.summary}
        </p>
        <span className="inline-flex items-center gap-1 text-navy-700 text-sm font-semibold mt-4">
          View project
          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
