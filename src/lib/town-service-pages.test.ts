import { describe, expect, it } from 'vitest';
import { getPostBySlug } from '@/lib/blog';
import { claimsFoundIn } from '@/lib/claims';
import { CITY_DATA } from '@/lib/constants';
import { CONTENT } from '@/lib/service-city-content';
import { fitTitle, TITLE_MAX } from '@/lib/seo';
import {
  TOWN_SERVICE_PAGES,
  collectTownServiceText,
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
