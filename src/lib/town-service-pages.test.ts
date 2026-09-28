import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { getPostBySlug } from '@/lib/blog';
import { claimsFoundIn } from '@/lib/claims';
import { CITY_DATA } from '@/lib/constants';
import { CONTENT } from '@/lib/service-city-content';
import { fitTitle, TITLE_MAX } from '@/lib/seo';
import {
  TOWN_SERVICE_PAGES,
  canonicalServicePath,
  collectTownServiceText,
  includedInSitemap,
  townServiceComboKey,
  townServicePath,
} from '@/lib/town-service-pages';

const EXPECTED_PATHS = [
  '/service-areas/ashburn-va/basements',
  '/service-areas/ashburn-va/kitchens',
  '/service-areas/leesburg-va/basements',
  '/service-areas/leesburg-va/kitchens',
];

describe('town-by-service pages', () => {
  it('publishes the four Loudoun URLs and no others', () => {
    expect(TOWN_SERVICE_PAGES.map(townServicePath)).toEqual(EXPECTED_PATHS);
  });

  it('keeps one canonical per intent, the existing service URL, and leaves the town URL out of the sitemap', () => {
    const canonicals = [
      '/services/basements/ashburn-va',
      '/services/kitchens/ashburn-va',
      '/services/basements/leesburg-va',
      '/services/kitchens/leesburg-va',
    ];
    expect(TOWN_SERVICE_PAGES.map(canonicalServicePath)).toEqual(canonicals);
    expect(new Set(canonicals).size).toBe(TOWN_SERVICE_PAGES.length);
    for (const page of TOWN_SERVICE_PAGES) {
      expect(canonicalServicePath(page)).not.toBe(townServicePath(page));
      expect(includedInSitemap(page)).toBe(false);
    }

    const sitemapConfig = fs.readFileSync(path.join(process.cwd(), 'next-sitemap.config.js'), 'utf8');
    for (const townPath of EXPECTED_PATHS) {
      expect(sitemapConfig, townPath).toContain(`'${townPath}'`);
    }
  });

  it('is linked from the town pages, the service pages, and the matching cost guides', () => {
    const root = process.cwd();
    const townTemplate = fs.readFileSync(
      path.join(root, 'src/components/services/CityPageTemplate.tsx'),
      'utf8'
    );
    const serviceTemplate = fs.readFileSync(
      path.join(root, 'src/components/services/ServicePageTemplate.tsx'),
      'utf8'
    );
    expect(townTemplate).toContain('<TownServiceLinksForTown townSlug={city.slug} />');
    expect(serviceTemplate).toContain('<TownServiceLinksForService serviceSlug={data.slug} />');

    const basementGuide = fs.readFileSync(
      path.join(root, 'content/blog/basement-remodeling-cost-ashburn-leesburg-2026.md'),
      'utf8'
    );
    const kitchenGuide = fs.readFileSync(
      path.join(root, 'content/blog/kitchen-remodel-cost-loudoun-county-2026.md'),
      'utf8'
    );
    expect(basementGuide).toContain('](/service-areas/ashburn-va/basements)');
    expect(basementGuide).toContain('](/service-areas/leesburg-va/basements)');
    expect(kitchenGuide).toContain('](/service-areas/ashburn-va/kitchens)');
    expect(kitchenGuide).toContain('](/service-areas/leesburg-va/kitchens)');
  });

  it('keeps titles and descriptions inside the SERP budgets and unique', () => {
    const titles = TOWN_SERVICE_PAGES.map((page) => page.title);
    const descriptions = TOWN_SERVICE_PAGES.map((page) => page.description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    expect(new Set(TOWN_SERVICE_PAGES.map((page) => page.h1)).size).toBe(TOWN_SERVICE_PAGES.length);

    for (const page of TOWN_SERVICE_PAGES) {
      expect(page.title.length, page.title).toBeLessThanOrEqual(TITLE_MAX);
      expect(fitTitle(page.title), page.title).toBe(page.title);
      expect(page.description.length, page.description).toBeGreaterThanOrEqual(70);
      expect(page.description.length, page.description).toBeLessThanOrEqual(160);
      expect(page.h1.length).toBeGreaterThan(0);
    }
  });

  it('resolves every source the template renders', () => {
    for (const page of TOWN_SERVICE_PAGES) {
      expect(CITY_DATA[page.townSlug]?.description, page.townSlug).toBeTruthy();
      expect(CONTENT[townServiceComboKey(page)]?.paragraphs.length, townServiceComboKey(page)).toBeGreaterThan(0);
      expect(getPostBySlug(page.costGuideSlug), page.costGuideSlug).not.toBeNull();
      const text = collectTownServiceText(page);
      expect(text.split(/\s+/).length).toBeGreaterThan(300);
    }
  });

  it('introduces no registered unconfirmed claim', () => {
    for (const page of TOWN_SERVICE_PAGES) {
      const found = claimsFoundIn(collectTownServiceText(page)).filter((claim) => claim.status === 'unconfirmed');
      expect(found.map((claim) => claim.id), townServicePath(page)).toEqual([]);
    }
  });
});
