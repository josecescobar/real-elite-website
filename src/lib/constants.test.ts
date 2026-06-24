import { describe, it, expect } from 'vitest';
import {
  SERVICES,
  PRIMARY_SERVICE_AREAS,
  SECONDARY_SERVICE_AREAS,
  ALL_SERVICE_AREAS,
  CITY_DATA,
  GALLERY_IMAGES,
  selectGalleryFor,
  BUSINESS,
} from '@/lib/constants';

const SERVICE_SLUGS = new Set<string>(SERVICES.map((s) => s.slug));

describe('SERVICES catalog', () => {
  it('has unique, kebab-case slugs', () => {
    const slugs = SERVICES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('gives every service a non-empty title and description', () => {
    for (const s of SERVICES) {
      expect(s.title.trim().length).toBeGreaterThan(0);
      expect(s.description.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('service areas', () => {
  it('has globally unique slugs across primary and secondary tiers', () => {
    const slugs = [...PRIMARY_SERVICE_AREAS, ...SECONDARY_SERVICE_AREAS].map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('exposes a deduplicated ALL_SERVICE_AREAS list', () => {
    const slugs = ALL_SERVICE_AREAS.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('has a CITY_DATA entry for every primary and secondary service area', () => {
    for (const area of [...PRIMARY_SERVICE_AREAS, ...SECONDARY_SERVICE_AREAS]) {
      expect(CITY_DATA[area.slug], `missing CITY_DATA for ${area.slug}`).toBeDefined();
    }
  });
});

describe('CITY_DATA', () => {
  it('gives every city a description, neighborhoods, and market emphasis', () => {
    for (const [slug, city] of Object.entries(CITY_DATA)) {
      expect(city.description.trim().length, slug).toBeGreaterThan(0);
      expect(city.neighborhoods.length, slug).toBeGreaterThan(0);
      expect(city.marketEmphasis.length, slug).toBeGreaterThan(0);
    }
  });

  it('only references real service slugs in marketEmphasis', () => {
    for (const [slug, city] of Object.entries(CITY_DATA)) {
      for (const svc of city.marketEmphasis) {
        expect(SERVICE_SLUGS.has(svc), `${slug} → unknown service "${svc}"`).toBe(true);
      }
    }
  });
});

describe('GALLERY_IMAGES', () => {
  it('gives every image a src, alt text, and category', () => {
    for (const img of GALLERY_IMAGES) {
      expect(img.src).toMatch(/^\//);
      expect(img.alt.trim().length).toBeGreaterThan(0);
      expect(img.category.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('selectGalleryFor', () => {
  it('returns images tagged with the requested state when available', () => {
    const result = selectGalleryFor('martinsburg-wv', 'WV');
    expect(result.length).toBeGreaterThan(0);
    for (const img of result) expect(img.state).toBe('WV');
  });

  it('falls back to the full gallery when no local matches exist', () => {
    const result = selectGalleryFor('frederick-md', 'MD');
    expect(result).toEqual(GALLERY_IMAGES.slice(0, 6));
  });

  it('never returns more images than the limit', () => {
    expect(selectGalleryFor('martinsburg-wv', 'WV', 3)).toHaveLength(3);
    expect(selectGalleryFor('martinsburg-wv', 'WV').length).toBeLessThanOrEqual(6);
  });
});

describe('BUSINESS', () => {
  it('has a name, a valid email, and a digit-only raw phone number', () => {
    expect(BUSINESS.name.length).toBeGreaterThan(0);
    expect(BUSINESS.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(BUSINESS.phoneRaw).toMatch(/^\+?\d+$/);
  });
});
