import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { PROJECT_MODULES } from './registry.generated';
import {
  PROJECTS,
  getAllProjects,
  getProjectBySlug,
  getProjectsByService,
  getProjectsByCity,
  getFeaturedProjects,
  getRelatedProjects,
  resolveCity,
} from './index';
import { SERVICES, ALL_SERVICE_AREAS } from '@/lib/constants';
import { getAllPosts } from '@/lib/blog';

const SERVICE_SLUGS = new Set<string>(SERVICES.map((s) => s.slug));
const CITY_SLUGS = new Set<string>(ALL_SERVICE_AREAS.map((a) => a.slug));
const BLOG_SLUGS = new Set<string>(getAllPosts().map((p) => p.slug));

describe('Generated registry is in sync with the data directory', () => {
  // Guards the codegen (scripts/generate-projects-registry.mjs): if a project
  // file is added/removed without running `npm run generate:projects`, this
  // fails so the drift is caught in CI rather than silently dropping a project.
  const dataFiles = readdirSync(join(process.cwd(), 'src/lib/projects/data'))
    .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
    .map((f) => f.replace(/\.ts$/, ''));

  it('registers exactly the projects present in ./data', () => {
    expect(PROJECT_MODULES.length).toBe(dataFiles.length);
  });

  it('registers a project whose slug matches each data filename', () => {
    const registeredSlugs = new Set(PROJECT_MODULES.map((p) => p.slug));
    for (const fileSlug of dataFiles) {
      expect(registeredSlugs.has(fileSlug), `no registered project for data/${fileSlug}.ts`).toBe(true);
    }
  });
});

describe('Project media integrity', () => {
  it('references local image files that exist in public/', () => {
    const publicDir = join(process.cwd(), 'public');
    for (const p of PROJECTS) {
      const srcs = [
        p.hero.image.src,
        ...p.gallery.map((g) => g.src),
        ...(p.beforeAfter ?? []).flatMap((ba) => [ba.before.src, ba.after.src]),
      ].filter((s) => s.startsWith('/'));
      for (const src of srcs) {
        expect(existsSync(join(publicDir, src)), `${p.slug} → missing image ${src}`).toBe(true);
      }
    }
  });
});

describe('Project registry integrity', () => {
  it('has unique project slugs', () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('gives every project the required identity, SEO and story fields', () => {
    for (const p of PROJECTS) {
      expect(p.slug, p.slug).toMatch(/^[a-z0-9-]+$/);
      expect(p.title.trim().length, p.slug).toBeGreaterThan(0);
      expect(['published', 'draft'], p.slug).toContain(p.status);
      expect(p.metaTitle.trim().length, p.slug).toBeGreaterThan(0);
      expect(p.metaDescription.trim().length, p.slug).toBeGreaterThan(0);
      expect(p.keywords.length, p.slug).toBeGreaterThan(0);
      expect(p.summary.trim().length, p.slug).toBeGreaterThan(0);
      expect(p.hero.heading.trim().length, p.slug).toBeGreaterThan(0);
      expect(p.hero.sub.trim().length, p.slug).toBeGreaterThan(0);
      expect(p.hero.image.src.trim().length, p.slug).toBeGreaterThan(0);
      expect(p.hero.image.alt.trim().length, p.slug).toBeGreaterThan(0);
      expect(p.brief.length, p.slug).toBeGreaterThan(0);
      expect(p.solution.length, p.slug).toBeGreaterThan(0);
      expect(p.gallery.length, p.slug).toBeGreaterThan(0);
      expect(p.completedOn, p.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('references only real service slugs', () => {
    for (const p of PROJECTS) {
      expect(SERVICE_SLUGS.has(p.service), `${p.slug} → unknown service "${p.service}"`).toBe(true);
      for (const s of p.secondaryServices ?? []) {
        expect(SERVICE_SLUGS.has(s), `${p.slug} → unknown secondary service "${s}"`).toBe(true);
      }
    }
  });

  it('references only real city slugs', () => {
    for (const p of PROJECTS) {
      expect(CITY_SLUGS.has(p.citySlug), `${p.slug} → unknown city "${p.citySlug}"`).toBe(true);
    }
  });

  it('cross-links only real blog/guide slugs', () => {
    for (const p of PROJECTS) {
      for (const g of p.relatedGuideSlugs ?? []) {
        expect(BLOG_SLUGS.has(g), `${p.slug} → unknown guide "${g}"`).toBe(true);
      }
    }
  });

  it('has well-formed before/after pairs and reviews', () => {
    for (const p of PROJECTS) {
      for (const ba of p.beforeAfter ?? []) {
        expect(ba.before.src.trim().length, p.slug).toBeGreaterThan(0);
        expect(ba.after.src.trim().length, p.slug).toBeGreaterThan(0);
        expect(ba.before.alt.trim().length, p.slug).toBeGreaterThan(0);
        expect(ba.after.alt.trim().length, p.slug).toBeGreaterThan(0);
      }
      if (p.review) {
        expect(p.review.rating, p.slug).toBeGreaterThanOrEqual(1);
        expect(p.review.rating, p.slug).toBeLessThanOrEqual(5);
        expect(p.review.quote.trim().length, p.slug).toBeGreaterThan(0);
      }
      for (const f of p.faqs ?? []) {
        expect(f.question.trim().length, p.slug).toBeGreaterThan(0);
        expect(f.answer.trim().length, p.slug).toBeGreaterThan(0);
      }
    }
  });
});

describe('Project query helpers', () => {
  it('getAllProjects returns published only, newest-first', () => {
    const all = getAllProjects();
    expect(all.every((p) => p.status === 'published')).toBe(true);
    for (let i = 1; i < all.length; i++) {
      expect(all[i - 1].completedOn >= all[i].completedOn).toBe(true);
    }
  });

  it('getProjectBySlug resolves a known project and returns null for unknown', () => {
    const known = getAllProjects()[0];
    expect(known).toBeDefined();
    expect(getProjectBySlug(known.slug)?.slug).toBe(known.slug);
    expect(getProjectBySlug('does-not-exist')).toBeNull();
  });

  it('getProjectsByService and getProjectsByCity match the sample', () => {
    const sample = getProjectBySlug('victorian-roof-replacement-martinsburg-wv');
    expect(sample).not.toBeNull();
    expect(getProjectsByService('roofing').some((p) => p.slug === sample!.slug)).toBe(true);
    expect(getProjectsByCity('martinsburg-wv').some((p) => p.slug === sample!.slug)).toBe(true);
    expect(getProjectsByService('roofing', 1).length).toBeLessThanOrEqual(1);
  });

  it('getFeaturedProjects returns only featured projects', () => {
    expect(getFeaturedProjects().every((p) => p.featured)).toBe(true);
  });

  it('getRelatedProjects excludes the project itself and respects the limit', () => {
    const all = getAllProjects();
    const related = getRelatedProjects(all[0].slug, 3);
    expect(related.some((p) => p.slug === all[0].slug)).toBe(false);
    expect(related.length).toBeLessThanOrEqual(3);
    expect(getRelatedProjects('does-not-exist')).toEqual([]);
  });

  it('resolveCity resolves known city slugs from the canonical catalog', () => {
    expect(resolveCity('martinsburg-wv')?.city).toBe('Martinsburg');
    expect(resolveCity('not-a-city')).toBeNull();
  });
});
