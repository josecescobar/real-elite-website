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

  /**
   * Comments are stripped before matching, and the canonical exit looks for the
   * object key `canonical:` rather than the bare word. Both matter:
   * `src/app/blog/page.tsx` has "remain canonical and unchanged" in its header
   * comment, so a prose match would let that route pass on the wrong exit and
   * stay green if it were ever converted from a redirect into a real page.
   */
  function stripComments(source: string): string {
    return source
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
  }

  /**
   * A `redirect()` only makes the route safe when it is unconditional. A guard
   * branch — `if (!post) redirect('/resources')` — leaves the normal render path
   * serving a page that inherits the homepage canonical, so the bare presence of
   * the call is not enough. Proxy for "renders nothing": the module contains no
   * JSX element at all. A generic like `useState<string>()` trips this too,
   * which only ever costs a route an explicit canonical it should arguably have.
   */
  const RENDERS_JSX = /<\/?[A-Za-z]/;

  /** Each exit is safe for a different reason — see the assertion message. */
  const EXITS = [
    { name: 'buildMetadata()', test: (src: string) => /\bbuildMetadata\s*\(/.test(src) },
    { name: 'an explicit canonical', test: (src: string) => /\bcanonical\s*:/.test(src) },
    { name: 'robots noindex', test: (src: string) => /\bindex\s*:\s*false\b/.test(src) },
    {
      name: 'an unconditional redirect()',
      test: (src: string) => /\bredirect\s*\(/.test(src) && !RENDERS_JSX.test(src),
    },
  ];

  /**
   * next.config does not restrict `pageExtensions`, so all four of Next.js'
   * defaults define real routes. Checking only `page.tsx` would skip a
   * `page.ts` added later while the count assertion below stayed satisfied.
   */
  const PAGE_FILE = /^page\.(tsx|ts|jsx|js)$/;

  function pageFiles(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return pageFiles(full);
      return PAGE_FILE.test(entry.name) ? [full] : [];
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
      const source = stripComments(readFileSync(file, 'utf8'));
      const taken = EXITS.filter((exit) => exit.test(source)).map((e) => e.name);

      expect(
        taken.length,
        `${route} takes none of the safe exits, so it inherits the root layout's ` +
          `homepage canonical and declares itself a duplicate of the homepage. ` +
          `Use buildMetadata({ path, title, description }) from src/lib/seo.ts, ` +
          `or set alternates.canonical or robots.index: false. A redirect() only ` +
          `counts when the route renders nothing at all.`
      ).toBeGreaterThan(0);
    }
  );
});
