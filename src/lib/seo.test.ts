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

  /**
   * The metadata export itself: `export const metadata = …` or
   * `export …  generateMetadata(…)`. Exits are looked for inside this subtree
   * rather than anywhere in the file, so an unrelated `{ canonical: 'legacy' }`
   * or an options object carrying `index: false` cannot satisfy them.
   */
  function metadataExports(source: ts.SourceFile): ts.Node[] {
    const exported = (node: ts.Node) =>
      ts.canHaveModifiers(node) &&
      ts
        .getModifiers(node)
        ?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) === true;

    return source.statements.flatMap<ts.Node>((statement) => {
      if (!exported(statement)) return [];
      if (ts.isFunctionDeclaration(statement)) {
        return statement.name?.text === 'generateMetadata' ? [statement] : [];
      }
      if (ts.isVariableStatement(statement)) {
        return statement.declarationList.declarations.filter(
          (d) =>
            ts.isIdentifier(d.name) &&
            (d.name.text === 'metadata' || d.name.text === 'generateMetadata')
        );
      }
      return [];
    });
  }

  /** `buildMetadata` only counts when it is the real import, not a local shadow. */
  function importsBuildMetadata(source: ts.SourceFile): boolean {
    return source.statements.some(
      (statement) =>
        ts.isImportDeclaration(statement) &&
        ts.isStringLiteral(statement.moduleSpecifier) &&
        /(^|\/)(@\/lib\/seo|seo)$/.test(statement.moduleSpecifier.text) &&
        statement.importClause?.namedBindings !== undefined &&
        ts.isNamedImports(statement.importClause.namedBindings) &&
        statement.importClause.namedBindings.elements.some(
          (el) => el.name.text === 'buildMetadata'
        )
    );
  }

  /**
   * The default export's body. A route that only redirects has the call as a
   * statement and returns nothing; anything that returns a value renders, whether
   * that value is JSX, a fragment, a string, null or createElement(...). Checking
   * for a returned value rather than for JSX is what makes this hold.
   */
  function defaultExportBody(source: ts.SourceFile): ts.Node | undefined {
    for (const statement of source.statements) {
      const isDefault =
        ts.canHaveModifiers(statement) &&
        ts
          .getModifiers(statement)
          ?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword) === true;
      if (isDefault && ts.isFunctionDeclaration(statement)) return statement.body;
      if (ts.isExportAssignment(statement)) return statement.expression;
    }
    return undefined;
  }

  const returnsAValue = (node: ts.Node) =>
    ts.isReturnStatement(node) && node.expression !== undefined;

  /**
   * `export const generateMetadata = () => …` hands `metadataExports` the variable
   * declaration, so the function to analyse is its initializer.
   */
  function metadataFunction(node: ts.Node): ts.Node {
    if (
      ts.isVariableDeclaration(node) &&
      node.initializer &&
      ts.isFunctionLike(node.initializer)
    ) {
      return node.initializer;
    }
    return node;
  }

  /**
   * A conditional return is still two branches:
   * `return record ? { title } : { robots: { index: false } }` must not be read
   * as one value that happens to contain a noindex.
   */
  function branches(expression: ts.Expression): ts.Expression[] {
    if (ts.isParenthesizedExpression(expression)) return branches(expression.expression);
    if (ts.isConditionalExpression(expression)) {
      return [...branches(expression.whenTrue), ...branches(expression.whenFalse)];
    }
    return [expression];
  }

  /**
   * Every value `generateMetadata` can return. A fallback branch must not be able
   * to exempt the whole route: `if (!record) return { robots: { index: false } };
   * return { title: record.title };` noindexes the miss and leaves every real
   * record inheriting the homepage canonical.
   */
  function returnedValues(node: ts.Node): ts.Expression[] {
    const root = metadataFunction(node);
    const values: ts.Expression[] = [];

    // An arrow with a concise body returns it without a return statement.
    if (
      ts.isArrowFunction(root) &&
      !ts.isBlock(root.body)
    ) {
      return branches(root.body);
    }

    const visit = (n: ts.Node) => {
      if (ts.isReturnStatement(n) && n.expression) values.push(...branches(n.expression));
      // Do not descend into nested functions; their returns are not this one's.
      if (n !== root && ts.isFunctionLike(n)) return;
      ts.forEachChild(n, visit);
    };
    visit(root);
    return values;
  }

  const pages = pageFiles(APP_DIR);

  it('finds routes to check', () => {
    // Guards the traversal. It cannot detect the predicates below being wrong.
    expect(pages.length).toBeGreaterThan(30);
  });

  it.each(pages.map((p) => [relative(APP_DIR, p), p]))('%s', (route, file) => {
    const source = parse(file);
    const metaNodes = metadataExports(source);
    const hasImport = importsBuildMetadata(source);

    const carriesCanonical = (node: ts.Node) =>
      some(node, isCanonicalProperty) ||
      (hasImport && some(node, calls('buildMetadata')));

    const exits: string[] = [];

    for (const node of metaNodes) {
      const returns = returnedValues(node);

      if (returns.length > 1) {
        // A branching generateMetadata. One noindexed miss must not cover the
        // hit: `if (!record) return { robots: { index: false } }` followed by an
        // uncanonicalised `return { title: record.title }` is the accident this
        // catches. Either every branch is noindexed, or a canonical is produced
        // somewhere in the function.
        //
        // "Somewhere" rather than "on every branch" is deliberate. blog/[slug]
        // calls buildMetadata() into a local and returns `{ ...base, openGraph }`,
        // so the canonical reaches the return through a spread that no subtree
        // check on the returned expression can see. Following it would need
        // dataflow. The cost is that a route which produces a canonical and then
        // drops it on one branch still passes; the accident above does not.
        if (returns.every((value) => some(value, isNoIndex))) {
          exits.push('robots index: false on every branch');
        } else if (returns.some(carriesCanonical) || carriesCanonical(node)) {
          exits.push('a canonical produced in the metadata function');
        }
        continue;
      }

      if (carriesCanonical(node)) exits.push('an explicit canonical');
      else if (some(node, isNoIndex)) exits.push('robots index: false');
    }

    // A redirect only exempts the route when nothing else renders: a guard
    // branch leaves the normal path serving an inherited homepage canonical.
    const body = defaultExportBody(source);
    if (body && some(body, calls('redirect')) && !some(body, returnsAValue)) {
      exits.push('an unconditional redirect()');
    }

    expect(
      exits.length,
      `${route} takes none of the safe exits, so it inherits the root layout's ` +
        `homepage canonical and declares itself a duplicate of the homepage. ` +
        `Export metadata built with buildMetadata({ path, title, description }) ` +
        `from src/lib/seo.ts, or carrying alternates.canonical or ` +
        `robots.index: false. A branching generateMetadata needs a canonical on ` +
        `some branch, or noindex on every one. A redirect() only counts when the ` +
        `route returns nothing at all.`
    ).toBeGreaterThan(0);
  });
});
