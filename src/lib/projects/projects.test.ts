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
  isPublished,
} from './index';
import { SERVICES, ALL_SERVICE_AREAS } from '@/lib/constants';
import { getAllPosts } from '@/lib/blog';
import { isVerifiedWorkImage } from '@/lib/stock-images';

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

describe('Project photo honesty', () => {
  const imagesOf = (p: (typeof PROJECTS)[number]) =>
    [
      p.hero.image.src,
      ...p.gallery.map((g) => g.src),
      ...(p.beforeAfter ?? []).flatMap((ba) => [ba.before.src, ba.after.src]),
    ].filter((s) => s.length > 0);

  it('never uses stock, inspiration, or an unverified image in a case study, draft or not', () => {
    for (const p of PROJECTS) {
      for (const src of imagesOf(p)) {
        expect(isVerifiedWorkImage(src), `${p.slug} → not verified work ${src}`).toBe(true);
      }
    }
  });

  it('keeps every photo-held project a draft with notes on what is missing', () => {
    for (const p of PROJECTS.filter((x) => x.needsRealPhotos)) {
      expect(p.status, p.slug).toBe('draft');
      expect(p.photoNotes?.length ?? 0, p.slug).toBeGreaterThan(0);
    }
  });

  it('holds the six pre-import case studies until real photos are confirmed', () => {
    const held = [
      'composite-deck-build-martinsburg',
      'new-construction-framing-to-finish',
      'signature-kitchen-remodel-eastern-panhandle',
      'stone-facade-exterior-upgrade',
      'victorian-roof-replacement-martinsburg-wv',
      'walk-in-shower-bathroom-remodel',
    ];
    for (const slug of held) {
      expect(PROJECTS.find((p) => p.slug === slug)?.needsRealPhotos, slug).toBe(true);
    }
  });

  it('withholds a photo-held project even if its status is flipped to published', () => {
    const held = PROJECTS.find((p) => p.needsRealPhotos);
    expect(held).toBeDefined();
    expect(isPublished({ ...held!, status: 'published' })).toBe(false);
    expect(isPublished({ ...held!, status: 'published', needsRealPhotos: false })).toBe(true);
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
      // A photo-held draft may have no images at all; everything else needs
      // a hero and a gallery.
      if (!p.needsRealPhotos) {
        expect(p.hero.image.src.trim().length, p.slug).toBeGreaterThan(0);
        expect(p.hero.image.alt.trim().length, p.slug).toBeGreaterThan(0);
        expect(p.gallery.length, p.slug).toBeGreaterThan(0);
      }
      expect(p.brief.length, p.slug).toBeGreaterThan(0);
      expect(p.solution.length, p.slug).toBeGreaterThan(0);
      if (p.status === 'published' || p.completedOn) {
        expect(p.completedOn, p.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
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

  it('withholds unconfirmed case-study drafts from every public query', () => {
    expect(PROJECT_MODULES.length).toBeGreaterThanOrEqual(6);
    expect(getAllProjects()).toEqual([]);
    for (const draft of PROJECT_MODULES) {
      expect(draft.status).toBe('draft');
      expect(getProjectBySlug(draft.slug)).toBeNull();
    }
    expect(getProjectsByService('roofing')).toEqual([]);
    expect(getProjectsByCity('martinsburg-wv')).toEqual([]);
  });

  it('getFeaturedProjects returns only featured projects', () => {
    expect(getFeaturedProjects().every((p) => p.featured)).toBe(true);
  });

  it('getRelatedProjects excludes the project itself and respects the limit', () => {
    const related = getRelatedProjects('victorian-roof-replacement-martinsburg-wv', 3);
    expect(related).toEqual([]);
    expect(related.length).toBeLessThanOrEqual(3);
    expect(getRelatedProjects('does-not-exist')).toEqual([]);
  });

  it('resolveCity resolves known city slugs from the canonical catalog', () => {
    expect(resolveCity('martinsburg-wv')?.city).toBe('Martinsburg');
    expect(resolveCity('not-a-city')).toBeNull();
  });
});
