import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  SERVICES,
  PRIMARY_SERVICE_AREAS,
  SECONDARY_SERVICE_AREAS,
  EXPANSION_SERVICE_AREAS,
  ALL_SERVICE_AREAS,
  EXPANSION_CITY_DATA,
  GALLERY_IMAGES,
  NAV_LINKS,
} from './constants';

const ROOT = process.cwd();

function exists(rel: string) {
  return fs.existsSync(path.join(ROOT, rel));
}

describe('routes referenced from constants exist on disk', () => {
  it('every SERVICES[].slug has a /services/<slug>/page.tsx', () => {
    for (const service of SERVICES) {
      const file = `src/app/services/${service.slug}/page.tsx`;
      expect(exists(file), `missing ${file}`).toBe(true);
    }
  });

  it('every NAV_LINKS top-level href resolves to a real route', () => {
    for (const link of NAV_LINKS) {
      if (link.href === '/') {
        expect(exists('src/app/page.tsx')).toBe(true);
        continue;
      }
      // Strip leading slash and check for a page.tsx at that path.
      const route = link.href.replace(/^\//, '');
      const file = `src/app/${route}/page.tsx`;
      expect(exists(file), `missing ${file} for nav link "${link.label}"`).toBe(true);
    }
  });

  it('every NAV_LINKS child href resolves to a real route', () => {
    for (const link of NAV_LINKS) {
      if (!('children' in link) || !link.children) continue;
      for (const child of link.children) {
        const route = child.href.replace(/^\//, '');
        const file = `src/app/${route}/page.tsx`;
        // services/<slug>/page.tsx OR services/[service]/page.tsx is acceptable.
        const fallback = `src/app/${route.split('/').slice(0, -1).join('/')}/[service]/page.tsx`;
        expect(exists(file) || exists(fallback), `missing route for ${child.href}`).toBe(true);
      }
    }
  });
});

describe('service-area data', () => {
  it('ALL_SERVICE_AREAS is the union of primary, secondary, and expansion', () => {
    const expected = [
      ...PRIMARY_SERVICE_AREAS,
      ...SECONDARY_SERVICE_AREAS,
      ...EXPANSION_SERVICE_AREAS,
    ].map((a) => a.slug);
    expect(ALL_SERVICE_AREAS.map((a) => a.slug)).toEqual(expected);
  });

  it('service-area slugs are unique', () => {
    const slugs = ALL_SERVICE_AREAS.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every EXPANSION_SERVICE_AREAS slug has EXPANSION_CITY_DATA', () => {
    for (const area of EXPANSION_SERVICE_AREAS) {
      expect(
        EXPANSION_CITY_DATA[area.slug],
        `EXPANSION_CITY_DATA missing for ${area.slug}`,
      ).toBeDefined();
    }
  });

  it('every service-area slug has a kebab-case format', () => {
    for (const area of ALL_SERVICE_AREAS) {
      expect(area.slug, `bad slug shape: ${area.slug}`).toMatch(/^[a-z0-9-]+$/);
    }
  });
});

describe('service × city page coverage', () => {
  // Mirrors the literal in src/app/services/[service]/[city]/page.tsx
  const FEATURED_SERVICES = ['roofing', 'decks', 'remodeling', 'siding'] as const;
  const EXPANSION_CITIES = EXPANSION_SERVICE_AREAS.map((a) => a.slug);

  it('FEATURED_SERVICES are all valid service slugs', () => {
    const validSlugs = new Set(SERVICES.map((s) => s.slug));
    for (const slug of FEATURED_SERVICES) {
      expect(validSlugs.has(slug), `unknown featured service: ${slug}`).toBe(true);
    }
  });

  it('every (featured service × expansion city) combo has CONTENT', async () => {
    const source = fs.readFileSync(
      path.join(ROOT, 'src/app/services/[service]/[city]/page.tsx'),
      'utf8',
    );
    for (const service of FEATURED_SERVICES) {
      for (const city of EXPANSION_CITIES) {
        const key = `'${service}-${city}'`;
        expect(source.includes(key), `CONTENT missing key ${key}`).toBe(true);
      }
    }
  });
});

describe('gallery images', () => {
  it('every GALLERY_IMAGES[].src exists in public/', () => {
    for (const image of GALLERY_IMAGES) {
      const file = `public${image.src}`;
      expect(exists(file), `missing image: ${file}`).toBe(true);
    }
  });

  it('every GALLERY_IMAGES[] has a non-empty alt text', () => {
    for (const image of GALLERY_IMAGES) {
      expect(image.alt.trim(), `empty alt for ${image.src}`).not.toBe('');
    }
  });
});

describe('blog featured images', () => {
  it('every blog post featuredImage exists in public/', () => {
    const blogDir = path.join(ROOT, 'content/blog');
    const files = fs.readdirSync(blogDir).filter((f) => /\.mdx?$/.test(f));
    for (const filename of files) {
      const raw = fs.readFileSync(path.join(blogDir, filename), 'utf8');
      const match = raw.match(/^featuredImage:\s*"?(\S+?)"?\s*$/m);
      expect(match, `no featuredImage in ${filename}`).not.toBeNull();
      const src = match![1];
      expect(exists(`public${src}`), `missing image ${src} for ${filename}`).toBe(true);
    }
  });
});
