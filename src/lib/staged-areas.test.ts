import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  ALL_SERVICE_AREAS,
  EXPANSION_SERVICE_AREAS,
  LUXURY_CITY_SLUGS,
  PRIMARY_SERVICE_AREAS,
  SECONDARY_SERVICE_AREAS,
  STAGED_SERVICE_AREAS,
  childAreasOf,
} from '@/lib/constants';
import { CONTENT } from '@/lib/service-city-content';
import CityServicePage, { generateStaticParams as areaStaticParams } from '@/app/service-areas/[slug]/page';
import { generateStaticParams as comboStaticParams } from '@/app/services/[service]/[city]/page';
import { generateStaticParams as townServiceStaticParams } from '@/app/service-areas/[slug]/[service]/page';

/**
 * A staged row is in the catalog and nowhere else. These assertions are
 * written against whatever the catalog marks `staged`, so adding the
 * Maryland and Pennsylvania rows makes the same tests prove those URLs 404
 * and stay out of the sitemap. An empty staged list still checks the filter
 * in constants.test.ts; it does not publish anything.
 */
function isNotFound(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const digest = 'digest' in error ? String((error as { digest?: unknown }).digest) : '';
  const message = error instanceof Error ? error.message : '';
  return digest.includes('404') || message.includes('404');
}

describe('staged service areas stay unpublished', () => {
  const stagedSlugs = STAGED_SERVICE_AREAS.map((area) => area.slug);

  it('excludes staged rows from active lists, luxury CTAs, and child links', () => {
    const active = new Set(ALL_SERVICE_AREAS.map((area) => area.slug));
    const linked = new Set(
      [...PRIMARY_SERVICE_AREAS, ...SECONDARY_SERVICE_AREAS, ...EXPANSION_SERVICE_AREAS].map(
        (area) => area.slug,
      ),
    );
    for (const slug of stagedSlugs) {
      expect(active.has(slug), slug).toBe(false);
      expect(linked.has(slug), slug).toBe(false);
      expect(LUXURY_CITY_SLUGS.has(slug), slug).toBe(false);
      for (const parent of ALL_SERVICE_AREAS) {
        expect(
          childAreasOf(parent.slug).some((child) => child.slug === slug),
          `${parent.slug} links ${slug}`,
        ).toBe(false);
      }
    }
  });

  it('omits staged slugs from static params and service+city content', () => {
    const areaSlugs = new Set(areaStaticParams().map((params) => params.slug));
    const comboCities = new Set(comboStaticParams().map((params) => params.city));
    const townSlugs = new Set(townServiceStaticParams().map((params) => params.slug));
    const contentCities = new Set(
      Object.keys(CONTENT).map((key) => key.slice(key.indexOf('-') + 1)),
    );

    for (const slug of stagedSlugs) {
      expect(areaSlugs.has(slug), `${slug} is a service-area static param`).toBe(false);
      expect(comboCities.has(slug), `${slug} is a service+city static param`).toBe(false);
      expect(townSlugs.has(slug), `${slug} is a town-service static param`).toBe(false);
      expect(contentCities.has(slug), `${slug} has service-city content`).toBe(false);
    }
  });

  it('404s /service-areas/[slug] for each staged row', async () => {
    for (const slug of stagedSlugs) {
      try {
        await CityServicePage({ params: Promise.resolve({ slug }) });
        expect.fail(`${slug} rendered instead of 404`);
      } catch (error) {
        expect(isNotFound(error), `${slug} threw ${String(error)}`).toBe(true);
      }
    }
  });

  it('keeps staged URLs out of the built sitemap', () => {
    const sitemap = join(process.cwd(), 'public', 'sitemap-0.xml');
    if (!existsSync(sitemap) || stagedSlugs.length === 0) return;

    const xml = readFileSync(sitemap, 'utf8');
    for (const slug of stagedSlugs) {
      expect(xml.includes(`/service-areas/${slug}`), `/service-areas/${slug}`).toBe(false);
      expect(xml.includes(`/${slug}<`), slug).toBe(false);
      expect(xml.includes(`/${slug}/`), slug).toBe(false);
    }
  });
});
