import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ALL_SERVICE_AREAS, SERVICES } from './constants';
import nextConfig from '../../next.config';

const SITE = 'https://www.realelitecontracting.com';

/** License numbers must not appear in the AI-facing text files. */
const LICENSE_NUMBER = /\b(?:WV\d{5,}|PA\d{5,}|2705198604)\b/;

/** Stock "Inspiration" labels, any casing. */
const INSPIRATION_LABEL = /\binspiration\b/i;

/**
 * Maryland is in the service area. These phrases are the caveat wording
 * this refresh exists to keep out.
 */
const MARYLAND_CAVEAT =
  /not a Maryland licen|no Maryland (?:contractor )?licen|Maryland licensing claim|service-area mention|not licensed in Maryland|licensed in Maryland|without a Maryland licen/i;

const TWIN_FILES = [
  'public/index.md',
  'public/services.md',
  'public/about.md',
  'public/service-areas.md',
  'public/contact.md',
  'public/services/kitchens.md',
  'public/services/bathrooms.md',
  'public/services/basements.md',
  'public/services/additions.md',
  'public/services/decks.md',
  'public/services/outdoor-living.md',
  'public/service-areas/loudoun-county-va.md',
  'public/service-areas/fairfax-county-va.md',
  'public/service-areas/frederick-md.md',
] as const;

function read(rel: string): string {
  return fs.readFileSync(rel, 'utf8');
}

function aiSurfaces(): [string, string][] {
  return [['public/llms.txt', read('public/llms.txt')], ...TWIN_FILES.map((file) => [file, read(file)] as [string, string])];
}

function routeExists(pathname: string): boolean {
  const clean = pathname.split('?')[0].replace(/\/$/, '') || '/';
  if (clean.endsWith('.md') || clean.endsWith('.txt')) {
    return fs.existsSync(path.join('public', clean.replace(/^\//, '')));
  }
  if (clean === '/') return fs.existsSync('src/app/page.tsx');
  const parts = clean.split('/').filter(Boolean);
  if (fs.existsSync(path.join('src/app', ...parts, 'page.tsx'))) return true;
  if (parts[0] === 'service-areas' && parts.length === 2) {
    return (
      fs.existsSync('src/app/service-areas/[slug]/page.tsx') &&
      ALL_SERVICE_AREAS.some((area) => area.slug === parts[1])
    );
  }
  if (parts[0] === 'services' && parts.length === 2) {
    return SERVICES.some((service) => service.slug === parts[1]) && fs.existsSync(`src/app/services/${parts[1]}/page.tsx`);
  }
  if (parts[0] === 'blog' && parts.length === 2) {
    return fs.existsSync(path.join('content/blog', `${parts[1]}.md`));
  }
  return false;
}

describe('llms.txt and markdown twins', () => {
  it('keeps license numbers, Inspiration labels, Maryland caveats, and Morgan County out of AI text', () => {
    for (const [file, text] of aiSurfaces()) {
      expect(text.length, file).toBeGreaterThan(80);
      expect(text, file).not.toMatch(LICENSE_NUMBER);
      expect(text, file).not.toMatch(INSPIRATION_LABEL);
      expect(text, file).not.toMatch(MARYLAND_CAVEAT);
      expect(text, file).not.toMatch(/Morgan County/i);
    }
  });

  it('positions the company as a design-build remodeler across WV, VA, MD, and PA', () => {
    const text = read('public/llms.txt').replace(/\s+/g, ' ');
    expect(text).toContain(
      'Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and Purple Heart recipient.',
    );
    expect(text).toMatch(/West Virginia/);
    expect(text).toMatch(/Virginia/);
    expect(text).toMatch(/Maryland/);
    expect(text).toMatch(/Pennsylvania/);
    for (const town of ['Frederick', 'Potomac', 'Bethesda', 'Clarksville', 'Ellicott City']) {
      expect(text, town).toContain(town);
    }
    expect(text).toContain('(681) 534-5515');
    expect(text).toContain('info@realelitecontracting.com');
    expect(text).toContain(`${SITE}/contact`);
    expect(text).not.toMatch(/handyman/i);
    expect(text).not.toMatch(/general repairs/i);
    expect(text).not.toMatch(/exterior repairs/i);
    expect(text).not.toMatch(/veteran-owned/i);
  });

  it('links only to routes and markdown files that exist', () => {
    const text = read('public/llms.txt');
    const links = [...text.matchAll(new RegExp(`${SITE}(/[^\\s)]+)`, 'g'))].map((match) => match[1]);
    expect(links.length).toBeGreaterThan(10);
    for (const link of links) {
      expect(routeExists(link), link).toBe(true);
    }
    for (const file of TWIN_FILES) {
      const urlPath = `/${file.replace(/^public\//, '')}`;
      expect(text, urlPath).toContain(`${SITE}${urlPath}`);
    }
  });

  it('serves markdown twins as text/markdown', async () => {
    const headers = await nextConfig.headers!();
    const markdown = headers.filter((entry) => entry.source.includes('.md'));
    expect(markdown.length).toBeGreaterThan(0);
    for (const entry of markdown) {
      expect(entry.headers).toEqual(
        expect.arrayContaining([{ key: 'Content-Type', value: 'text/markdown; charset=utf-8' }]),
      );
    }
  });
});
