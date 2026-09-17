import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { BUSINESS } from '@/lib/constants';
import { TITLE_MAX, absoluteUrl, buildMetadata, fitTitle } from '@/lib/seo';

const BRAND = ` | ${BUSINESS.name}`;

describe('fitTitle', () => {
  it('leaves a title that already fits untouched', () => {
    const t = 'Roofing Contractor | Real Elite Contracting';
    expect(t.length).toBeLessThanOrEqual(TITLE_MAX);
    expect(fitTitle(t)).toBe(t);
  });

  it('falls back to the short brand when the full suffix overflows', () => {
    // 44 chars of copy + 24 of brand = 68; with the short brand it is 57.
    const base = 'Paving Martinsburg WV — Driveways & Sealcoat';
    const fitted = fitTitle(base + BRAND);
    expect(fitted).toBe(`${base} | Real Elite`);
    expect(fitted.length).toBeLessThanOrEqual(TITLE_MAX);
  });

  it('drops the brand entirely when even the short suffix will not fit', () => {
    const base = 'Storm Damage Roof Inspection (Free) — WV / MD / VA';
    expect(fitTitle(base + BRAND)).toBe(base);
  });

  it('never truncates the page copy itself', () => {
    // Copy alone already exceeds the budget: a human must rewrite it, so the
    // helper returns it intact rather than chopping it mid-word.
    const base =
      'An Extremely Long Page Title That Blows The Budget All On Its Own Without Any Brand';
    expect(base.length).toBeGreaterThan(TITLE_MAX);
    expect(fitTitle(base + BRAND)).toBe(base);
    expect(fitTitle(base)).toBe(base);
  });

  it('leaves an overlong title that does not carry the brand suffix alone', () => {
    const t = 'x'.repeat(TITLE_MAX + 10);
    expect(fitTitle(t)).toBe(t);
  });
});

describe('buildMetadata', () => {
  it('length-budgets the document title but keeps social titles full', () => {
    const full = 'Storm Damage Roof Inspection (Free) — WV / MD / VA' + BRAND;
    const meta = buildMetadata({ path: '/storm-damage', title: full, description: 'd' });

    expect((meta.title as string).length).toBeLessThanOrEqual(TITLE_MAX);
    expect(meta.title).toBe(fitTitle(full));
    // Social cards render far more characters, so they keep the branded form.
    expect(meta.openGraph?.title).toBe(full);
    expect(meta.twitter?.title).toBe(full);
  });

  it('still sets the canonical from the path', () => {
    const meta = buildMetadata({ path: '/about', title: 'About', description: 'd' });
    expect(meta.alternates?.canonical).toBe(absoluteUrl('/about'));
  });
});

/**
 * The root layout sets `alternates.canonical` to the homepage URL, and Next.js
 * metadata inherits. A page that neither calls `buildMetadata` nor sets its own
 * canonical therefore ships `<link rel="canonical" href="https://…/">` and tells
 * Google it is a duplicate of the homepage — silently, with no build error and
 * nothing visible on the page itself.
 *
 * Nothing in `src/app` gets this wrong today. This guard is what keeps that true:
 * every route must take one of four exits, all of which are safe.
 */
describe('every app route declares its own canonical', () => {
  const APP_DIR = join(process.cwd(), 'src', 'app');

  /** Each exit is safe for a different reason — see the assertion message. */
  const EXITS = [
    { name: 'buildMetadata()', re: /\bbuildMetadata\s*\(/ },
    { name: 'an explicit canonical', re: /\bcanonical\b/ },
    { name: 'robots noindex', re: /index:\s*false/ },
    { name: 'a redirect()', re: /\bredirect\s*\(/ },
  ];

  function pageFiles(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return pageFiles(full);
      return entry.name === 'page.tsx' ? [full] : [];
    });
  }

  const pages = pageFiles(APP_DIR);

  it('finds routes to check', () => {
    // Guards the guard: a broken walk would make every assertion below vacuous.
    expect(pages.length).toBeGreaterThan(30);
  });

  it.each(pages.map((p) => [relative(APP_DIR, p), p]))(
    '%s',
    (route, file) => {
      const source = readFileSync(file, 'utf8');
      const taken = EXITS.filter((exit) => exit.re.test(source)).map((e) => e.name);

      expect(
        taken.length,
        `${route} takes none of the safe exits, so it inherits the root layout's ` +
          `homepage canonical and declares itself a duplicate of the homepage. ` +
          `Use buildMetadata({ path, title, description }) from src/lib/seo.ts, ` +
          `or set alternates.canonical, robots.index: false, or redirect().`
      ).toBeGreaterThan(0);
    }
  );
});
