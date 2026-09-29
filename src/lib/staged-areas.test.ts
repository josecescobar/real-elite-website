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
import CityServicePage, {
  dynamicParams,
  generateMetadata,
  generateStaticParams as areaStaticParams,
} from '@/app/service-areas/[slug]/page';
import { generateStaticParams as comboStaticParams } from '@/app/services/[service]/[city]/page';
import { generateStaticParams as townServiceStaticParams } from '@/app/service-areas/[slug]/[service]/page';

/**
 * A staged row is in the catalog and nowhere else. These assertions are
 * written against whatever the catalog marks `staged`, so the Maryland rows
 * and the Virginia permit gaps prove those URLs 404 and stay out of the
 * sitemap. Pennsylvania stays active.
 *
 * The digest is the string Next's `notFound()` throws
 * (`NEXT_HTTP_ERROR_FALLBACK;404`). Matching the message is not enough:
 * `expect.fail("… 404")` contains that substring and used to pass this test
 * when the page rendered successfully.
 */
const NOT_FOUND_DIGEST = 'NEXT_HTTP_ERROR_FALLBACK;404';

/**
 * Virginia towns whose research notes do not contain a verified permit
 * process for the jurisdiction the page would describe. Reversible: the
 * CITY_DATA copy stays, and `status: 'active'` publishes them again.
 */
const STAGED_VA_PERMIT_GAPS = [
  'herndon-va',
  'fairfax-va',
  'stephens-city-va',
  'middletown-va',
] as const;

/**
 * Gap towns from the 2026-09-29 expansion spec. Optional far markets are
 * intentionally absent. Frederick, MD is already active and must not appear
 * here.
 */
const STAGED_MD_SLUGS = [
  'monrovia-md',
  'ijamsville-md',
  'new-market-md',
  'urbana-md',
  'mount-airy-md',
  'middletown-md',
  'adamstown-md',
  'point-of-rocks-md',
  'brunswick-md',
  'boonsboro-md',
  'sharpsburg-md',
  'williamsport-md',
] as const;

const ACTIVE_PA_SLUGS = [
  'greencastle-pa',
  'chambersburg-pa',
  'fort-loudon-pa',
  'mercersburg-pa',
  'waynesboro-pa',
  'fayetteville-pa',
] as const;

describe('staged service areas stay unpublished', () => {
  const stagedSlugs = STAGED_SERVICE_AREAS.map((area) => area.slug);

  it('stages the Virginia permit gaps and the Maryland towns, and keeps Pennsylvania active', () => {
    expect(stagedSlugs).toEqual([...STAGED_VA_PERMIT_GAPS, ...STAGED_MD_SLUGS]);
    expect(dynamicParams).toBe(false);
    for (const area of STAGED_SERVICE_AREAS.filter((row) => row.state === 'MD')) {
      expect(area.market, area.slug).toBe('home');
      expect(area.legacyTiers, area.slug).toEqual([]);
      expect(area.parent, area.slug).toBeUndefined();
    }
    expect(stagedSlugs).not.toContain('frederick-md');
    expect(stagedSlugs).not.toContain('hagerstown-md');
    for (const slug of ACTIVE_PA_SLUGS) {
      expect(stagedSlugs, slug).not.toContain(slug);
      expect(ALL_SERVICE_AREAS.some((area) => area.slug === slug), slug).toBe(true);
    }
  });

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
    const townSlugs = new Set<string>(townServiceStaticParams().map((params) => params.slug));
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

  it('rejects each staged overview with the Next not-found digest', async () => {
    expect(stagedSlugs.length).toBeGreaterThan(0);
    for (const slug of stagedSlugs) {
      await expect(
        CityServicePage({ params: Promise.resolve({ slug }) }),
        slug,
      ).rejects.toMatchObject({ digest: NOT_FOUND_DIGEST });
      await expect(
        generateMetadata({ params: Promise.resolve({ slug }) }),
        slug,
      ).rejects.toMatchObject({ digest: NOT_FOUND_DIGEST });
    }
  });

  it('keeps staged URLs out of the built sitemap', () => {
    // next-sitemap writes this in postbuild, and CI runs tests before the
    // build, so the file is often absent. The static-params test above is
    // what keeps a staged slug out of that build. When the file is present
    // (after `npm run build`), this locks the generated XML too.
    const sitemap = join(process.cwd(), 'public', 'sitemap-0.xml');
    if (!existsSync(sitemap)) return;

    const xml = readFileSync(sitemap, 'utf8');
    for (const slug of stagedSlugs) {
      expect(xml.includes(`/service-areas/${slug}`), `/service-areas/${slug}`).toBe(false);
      expect(xml.includes(`/${slug}<`), slug).toBe(false);
      expect(xml.includes(`/${slug}/`), slug).toBe(false);
    }
  });
});
