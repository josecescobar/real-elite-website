import { describe, it, expect } from 'vitest';
import { SERVICE_DATA } from '@/lib/services-data';
import { SERVICES } from '@/lib/constants';
import { getAllPosts } from '@/lib/blog';

const ENTRIES = Object.entries(SERVICE_DATA);
const BLOG_SLUGS = new Set(getAllPosts().map((p) => p.slug));

describe('SERVICE_DATA', () => {
  it('keys each entry by its own slug', () => {
    for (const [key, data] of ENTRIES) {
      expect(data.slug).toBe(key);
    }
  });

  it('has a data entry for every service in the catalog', () => {
    for (const service of SERVICES) {
      expect(SERVICE_DATA[service.slug], `no SERVICE_DATA for "${service.slug}"`).toBeDefined();
    }
  });

  it('gives every service the SEO and template fields the page needs', () => {
    for (const [slug, data] of ENTRIES) {
      expect(data.title.trim().length, slug).toBeGreaterThan(0);
      expect(data.serviceType.trim().length, slug).toBeGreaterThan(0);
      expect(data.metaTitle.trim().length, slug).toBeGreaterThan(0);
      expect(data.metaDescription.trim().length, slug).toBeGreaterThan(0);
      expect(data.keywords.length, slug).toBeGreaterThan(0);
      expect(data.hero.heading.trim().length, slug).toBeGreaterThan(0);
      expect(data.hero.sub.trim().length, slug).toBeGreaterThan(0);
      expect(data.overview.paragraphs.length, slug).toBeGreaterThan(0);
      expect(data.scope.items.length, slug).toBeGreaterThan(0);
      expect(data.whyChooseUs.length, slug).toBeGreaterThan(0);
      expect(data.faqs.length, slug).toBeGreaterThan(0);
    }
  });

  it('gives every FAQ a non-empty question and answer', () => {
    for (const [slug, data] of ENTRIES) {
      for (const faq of data.faqs) {
        expect(faq.question.trim().length, slug).toBeGreaterThan(0);
        expect(faq.answer.trim().length, slug).toBeGreaterThan(0);
      }
    }
  });

  it('gives every investment block a starting price and complete tiers', () => {
    for (const [slug, data] of ENTRIES) {
      if (!data.investment) continue;
      expect(data.investment.startingAt.trim().length, slug).toBeGreaterThan(0);
      expect(data.investment.tiers.length, slug).toBeGreaterThan(0);
      for (const tier of data.investment.tiers) {
        expect(tier.tier.trim().length, slug).toBeGreaterThan(0);
        expect(tier.range.trim().length, slug).toBeGreaterThan(0);
      }
    }
  });

  it('only links related guides that point at real blog posts', () => {
    for (const [slug, data] of ENTRIES) {
      for (const guideSlug of data.relatedGuideSlugs ?? []) {
        expect(BLOG_SLUGS.has(guideSlug), `${slug} → unknown guide "${guideSlug}"`).toBe(true);
      }
    }
  });

  it('gives every service a bespoke, non-empty answer block (not just a metaDescription fallback)', () => {
    for (const [slug, data] of ENTRIES) {
      expect(data.answer, `${slug} has no answer field`).toBeDefined();
      expect(data.answer!.trim().length, slug).toBeGreaterThan(0);
      expect(data.answer, `${slug} answer duplicates metaDescription`).not.toBe(data.metaDescription);
    }
  });
});

describe('outdoor-living and stairs pillar copy', () => {
  const ALLOWED_IMAGES = new Set([
    '/images/work/deck-composite-stairs-front.webp',
    '/images/work/deck-composite-night-stairs.webp',
    '/images/work/deck-night-full-house.jpg',
    '/images/work/deck-night-rail-moon.jpg',
    '/images/work/deck-composite-surface.webp',
    '/images/deck-night-lights.jpg',
    '/images/deck-finished-railings.jpg',
  ]);
  const pages = [SERVICE_DATA['outdoor-living'], SERVICE_DATA.stairs];

  function copyOf(d: (typeof pages)[number]): string[] {
    return [
      d.title, d.metaTitle, d.metaDescription, d.answer ?? '',
      d.hero.heading, d.hero.sub ?? '', ...d.overview.paragraphs,
      ...d.scope.items, ...d.whyChooseUs,
      ...(d.gallery ?? []).map((g) => g.alt),
      ...(d.faqs ?? []).flatMap((f) => [f.question, f.answer]),
    ];
  }

  it('uses only Real Elite photos', () => {
    for (const d of pages) {
      const srcs = [d.hero.image?.src, d.overview.image?.src, ...(d.gallery ?? []).map((g) => g.src)];
      for (const src of srcs) expect(ALLOWED_IMAGES.has(src as string), `${d.slug}: ${src}`).toBe(true);
    }
  });

  it('has no site-mechanics notes, inspiration labels, or electrical claims', () => {
    const leak = /this page|tagged to|in the gallery|no photo|stays separate on the estimate|we do not publish|inspiration|lighting and electrical|we wire|brambleton/i;
    for (const d of pages) {
      for (const text of copyOf(d)) expect(text, d.slug).not.toMatch(leak);
    }
  });
});
