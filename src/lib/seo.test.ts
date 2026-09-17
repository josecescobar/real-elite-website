import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';
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
 * Nothing in `src/app` gets this wrong today. This guard is what keeps that true.
 *
 * It parses each route with the TypeScript compiler rather than matching source
 * text. Four separate holes turned up in a regex version of this check: the word
 * `canonical` inside a JSDoc comment, a trailing `// canonical` on a code line,
 * a JSX fragment (`<>…</>`) that no tag pattern matches, and a conditional
 * `redirect()` counting as an unconditional one. Comments are not AST nodes,
 * fragments are their own node kind, and conditionality is structural — so
 * parsing removes the whole class rather than the instances.
 */
describe('every app route declares its own canonical', () => {
  const APP_DIR = join(process.cwd(), 'src', 'app');

  /**
   * next.config does not restrict `pageExtensions`, so all four of Next.js'
   * defaults define real routes.
   */
  const PAGE_FILE = /^page\.(tsx|ts|jsx|js)$/;

  function pageFiles(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return pageFiles(full);
      return PAGE_FILE.test(entry.name) ? [full] : [];
    });
  }

  function parse(file: string) {
    return ts.createSourceFile(
      file,
      readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      /* setParentNodes */ true,
      ts.ScriptKind.TSX
    );
  }

  function some(root: ts.Node, match: (node: ts.Node) => boolean): boolean {
    let found = false;
    const visit = (node: ts.Node) => {
      if (found) return;
      if (match(node)) {
        found = true;
        return;
      }
      ts.forEachChild(node, visit);
    };
    visit(root);
    return found;
  }

  const calls = (name: string) => (node: ts.Node) =>
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === name;

  /** Any property named `canonical`, wherever it sits in the metadata object. */
  const isCanonicalProperty = (node: ts.Node) =>
    ts.isPropertyAssignment(node) &&
    (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) &&
    node.name.text === 'canonical';

  /** `robots: { index: false }` — the page is not indexed, so the canonical is moot. */
  const isNoIndex = (node: ts.Node) =>
    ts.isPropertyAssignment(node) &&
    (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) &&
    node.name.text === 'index' &&
    node.initializer.kind === ts.SyntaxKind.FalseKeyword;

  /** Elements, self-closing tags and fragments all render. */
  const isJsx = (node: ts.Node) =>
    ts.isJsxElement(node) ||
    ts.isJsxSelfClosingElement(node) ||
    ts.isJsxFragment(node);

  const pages = pageFiles(APP_DIR);

  it('finds routes to check', () => {
    // Guards the traversal. It cannot detect the predicates below being wrong.
    expect(pages.length).toBeGreaterThan(30);
  });

  it.each(pages.map((p) => [relative(APP_DIR, p), p]))('%s', (route, file) => {
    const source = parse(file);

    const exits: string[] = [];
    if (some(source, calls('buildMetadata'))) exits.push('buildMetadata()');
    if (some(source, isCanonicalProperty)) exits.push('an explicit canonical');
    if (some(source, isNoIndex)) exits.push('robots index: false');
    // A redirect only exempts the route when nothing else renders: a guard
    // branch leaves the normal path serving an inherited homepage canonical.
    if (some(source, calls('redirect')) && !some(source, isJsx)) {
      exits.push('an unconditional redirect()');
    }

    expect(
      exits.length,
      `${route} takes none of the safe exits, so it inherits the root layout's ` +
        `homepage canonical and declares itself a duplicate of the homepage. ` +
        `Use buildMetadata({ path, title, description }) from src/lib/seo.ts, ` +
        `or set alternates.canonical or robots.index: false. A redirect() only ` +
        `counts when the route renders nothing at all.`
    ).toBeGreaterThan(0);
  });
});
