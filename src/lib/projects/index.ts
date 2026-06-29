/**
 * The Project System registry + query helpers.
 *
 * Projects are authored one-file-per-record under ./data and registered here.
 * This module is the single read surface every consumer uses — project pages,
 * the gallery, related rails, and (later) service/location/blog proof modules.
 * Helpers are pure and synchronous (data is in-module, not on disk), mirroring
 * the style of src/lib/blog.ts.
 *
 * To add a project: create ./data/<slug>.ts exporting a default Project, then
 * add it to PROJECT_MODULES below. (A future markdown/CMS loader could populate
 * the same Project type without changing any consumer.)
 */
import { ALL_SERVICE_AREAS } from '@/lib/constants';
import type { Project } from './types';
import victorianRoofMartinsburg from './data/victorian-roof-replacement-martinsburg-wv';

export type { Project } from './types';

/** Every authored project, published or draft. Order here does not matter. */
const PROJECT_MODULES: Project[] = [victorianRoofMartinsburg];

/** All projects sorted newest-first (drafts included) — internal base list. */
const ALL: Project[] = [...PROJECT_MODULES].sort((a, b) =>
  b.completedOn.localeCompare(a.completedOn)
);

/** Full registry (published + draft), newest-first. */
export const PROJECTS: readonly Project[] = ALL;

const isPublished = (p: Project) => p.status === 'published';

/** Published projects only, newest-first. The default public surface. */
export function getAllProjects(): Project[] {
  return ALL.filter(isPublished);
}

/** Published project by slug, or null. (Drafts resolve to null publicly.) */
export function getProjectBySlug(slug: string): Project | null {
  const project = ALL.find((p) => p.slug === slug);
  return project && isPublished(project) ? project : null;
}

/** Published projects whose primary OR secondary service matches the slug. */
export function getProjectsByService(serviceSlug: string, limit?: number): Project[] {
  const matches = getAllProjects().filter(
    (p) => p.service === serviceSlug || (p.secondaryServices ?? []).includes(serviceSlug)
  );
  return typeof limit === 'number' ? matches.slice(0, limit) : matches;
}

/** Published projects in a given city slug. */
export function getProjectsByCity(citySlug: string, limit?: number): Project[] {
  const matches = getAllProjects().filter((p) => p.citySlug === citySlug);
  return typeof limit === 'number' ? matches.slice(0, limit) : matches;
}

/** Featured published projects (for the homepage Proof Wall), newest-first. */
export function getFeaturedProjects(count = 3): Project[] {
  return getAllProjects()
    .filter((p) => p.featured)
    .slice(0, count);
}

/**
 * Related published projects for a given project: same service first, then
 * same city, de-duplicated and excluding the project itself.
 */
export function getRelatedProjects(slug: string, count = 3): Project[] {
  const current = getProjectBySlug(slug);
  if (!current) return [];

  const others = getAllProjects().filter((p) => p.slug !== slug);
  const sameService = others.filter((p) => p.service === current.service);
  const sameCity = others.filter((p) => p.citySlug === current.citySlug);

  const ordered: Project[] = [];
  for (const p of [...sameService, ...sameCity]) {
    if (!ordered.some((o) => o.slug === p.slug)) ordered.push(p);
  }
  return ordered.slice(0, count);
}

/** Resolve a city slug to its display record (city/state) from the canonical catalog. */
export function resolveCity(citySlug: string): { city: string; state: string; slug: string } | null {
  return ALL_SERVICE_AREAS.find((a) => a.slug === citySlug) ?? null;
}
