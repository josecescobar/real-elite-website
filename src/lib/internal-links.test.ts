import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { CONTENT, RETIRED_COMBOS } from '@/lib/service-city-content';
import { SERVICES } from '@/lib/constants';

/**
 * The site must not link to its own retired or unbuilt service+area pages.
 *
 * Tier C retired ten combos and left five links in four live blog articles
 * pointing at three of the removed URLs — every click and crawl from those
 * articles took a 308 to a page the same change had just declared retired.
 * Codex caught it on #148; the redirects were right and the internal links
 * were not.
 *
 * A link to an UNPUBLISHED combo is worse still: /services/[service]/[city]
 * sets `dynamicParams = false`, so anything without a CONTENT key and without
 * a redirect is a hard 404 the site advertises itself.
 *
 * This is the same class as the area-page deep links `serviceHrefForArea` was
 * extracted to fix — rendered links checked against what is actually
 * published — reached from prose rather than from a template.
 *
 * ## Why prose needs its own check
 *
 * Template links are derived from CONTENT and so cannot go stale.
 * Hand-written markdown cannot be derived, so it has to be scanned.
 */

/** Files that are ALLOWED to name a retired path, because they declare it. */
const DECLARATION_FILES = new Set([
  'src/lib/retired-combos.ts',
  'next.config.ts',
  // Tests that assert on retirement necessarily quote the paths.
  'src/lib/service-city-content.test.ts',
  'src/lib/internal-links.test.ts',
]);

const SERVICE_SLUGS = new Set<string>(SERVICES.map((s) => s.slug));
const PUBLISHED = new Set(Object.keys(CONTENT));
const RETIRED = new Set(Object.keys(RETIRED_COMBOS));

/** Every file under these roots that could carry a hand-written link. */
function sourceFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
        walk(full);
      } else if (/\.(md|mdx|ts|tsx)$/.test(entry.name)) {
        out.push(full);
      }
    }
  };
  for (const root of ['content', 'src']) if (fs.existsSync(root)) walk(root);
  out.push('next.config.ts');
  return out;
}

/**
 * Combo LINKS in a source file, keyed `service-area`.
 *
 * Scoped to link syntax on purpose. A bare `/services/x/y` scan matched module
 * import specifiers (`@/app/services/roofing/page`) and docblock prose about
 * pages that do not exist yet, producing twelve false positives on the first
 * run of this file. Two shapes are matched:
 *
 *   - markdown  `](/services/kitchens/vienna-va)`
 *   - literal   `href="/services/kitchens/vienna-va"`
 *
 * Interpolated hrefs are deliberately not matched: they are derived from
 * CONTENT, and CityPageTemplate.links.test.tsx already asserts the rendered
 * anchors against what is published. This file exists for the links that
 * CANNOT be derived.
 */
function comboLinksIn(source: string): string[] {
  const found: string[] = [];
  const patterns = [
    /\]\(\/services\/([a-z0-9-]+)\/([a-z0-9-]+)\)/g,
    /href=["'`]\/services\/([a-z0-9-]+)\/([a-z0-9-]+)["'`]/g,
  ];
  for (const re of patterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(source)) !== null) {
      if (SERVICE_SLUGS.has(m[1])) found.push(`${m[1]}-${m[2]}`);
    }
  }
  return found;
}

describe('internal links to service+area pages', () => {
  const files = sourceFiles();

  /**
   * Both assertions below pass trivially if the walker finds no files or the
   * extractor finds no links. That is the exact failure mode that shipped
   * twice in this feature — a test that cannot fail reads as coverage — so the
   * scan is asserted to be non-empty before anything is concluded from it.
   */
  it('actually scans files and finds combo links', () => {
    expect(files.length).toBeGreaterThan(50);
    expect(files.some((f) => f.startsWith('content/blog/'))).toBe(true);

    const linked = new Set(
      files.flatMap((f) => comboLinksIn(fs.readFileSync(f, 'utf8')))
    );
    // The Loudoun luxury articles alone carry a dozen of these.
    expect(linked.size).toBeGreaterThan(10);
    // And every link found must be a real combo key shape.
    for (const key of linked) expect(key).toMatch(/^[a-z0-9-]+-[a-z0-9-]+$/);
  });

  it('never links to a retired combo', () => {
    const offenders: string[] = [];
    for (const file of files) {
      if (DECLARATION_FILES.has(file)) continue;
      const source = fs.readFileSync(file, 'utf8');
      for (const key of new Set(comboLinksIn(source))) {
        if (RETIRED.has(key)) {
          offenders.push(
            `${file} links /services/${key.replace('-', '/')} — retired, so this click takes a 308. Point it at ${RETIRED_COMBOS[key]} or at whatever the anchor text actually names`
          );
        }
      }
    }
    expect(offenders, offenders.join('; ')).toEqual([]);
  });

  it('never links to a combo that was never published', () => {
    const offenders: string[] = [];
    for (const file of files) {
      if (DECLARATION_FILES.has(file)) continue;
      const source = fs.readFileSync(file, 'utf8');
      for (const key of new Set(comboLinksIn(source))) {
        if (!PUBLISHED.has(key) && !RETIRED.has(key)) {
          offenders.push(
            `${file} links /services/${key.replace('-', '/')}, which is neither published in CONTENT nor retired with a redirect — dynamicParams is false, so that is a hard 404`
          );
        }
      }
    }
    expect(offenders, offenders.join('; ')).toEqual([]);
  });
});
