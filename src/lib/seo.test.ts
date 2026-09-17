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

  /**
   * The walk accepts `page.ts` as well as `page.tsx`, so the script kind has to
   * follow the extension. Parsing a `.ts` file as TSX reads the angle-bracket
   * assertion in `<Metadata>{ … }` as a JSX tag, and the metadata disappears.
   */
  function parse(file: string) {
    return ts.createSourceFile(
      file,
      readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      /* setParentNodes */ true,
      file.endsWith('.tsx') || file.endsWith('.jsx')
        ? ts.ScriptKind.TSX
        : ts.ScriptKind.TS
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

  /**
   * A call to `name`, where `name` still means the import it was bound to.
   * A local `const buildMetadata = () => ({ title })` inside the metadata
   * function shadows the helper, and matching on the bare text would credit the
   * route with a canonical the shadow never sets. `declarationInScope` already
   * answers this: if the callee resolves to a local declaration, it is not the
   * import.
   */
  const calls = (name: string) => (node: ts.Node) =>
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === name &&
    declarationInScope(node.expression) === undefined;

  /** A property named `name`, longhand or shorthand (`{ canonical }`). */
  const named = (node: ts.Node, name: string) =>
    (ts.isPropertyAssignment(node) || ts.isShorthandPropertyAssignment(node)) &&
    (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) &&
    node.name.text === name;

  /**
   * Strip the wrappers TypeScript erases. `{ … } satisfies Metadata` is the same
   * object Next receives, so a guard that only accepts a bare object literal
   * rejects one of the most ordinary ways to write a typed metadata export.
   */
  function unwrap(expression: ts.Expression): ts.Expression {
    if (
      ts.isSatisfiesExpression(expression) ||
      ts.isAsExpression(expression) ||
      // `<Metadata>{ … }`, which only parses as an assertion in a .ts file.
      ts.isTypeAssertionExpression(expression) ||
      ts.isParenthesizedExpression(expression) ||
      ts.isNonNullExpression(expression)
    ) {
      return unwrap(expression.expression);
    }
    return expression;
  }

  /**
   * The object literal an expression denotes, following one hop through a local
   * `const`. `const alternates = { canonical: '/about' }` assigned in by shorthand
   * is the same metadata as writing the object inline.
   *
   * The identifier is resolved from where it is written, innermost scope first,
   * the way the language resolves it. An earlier file-wide search by name was
   * wrong in the direction that matters: a helper's `const result = { alternates:
   * { canonical } }` could answer for a `generateMetadata` that returns its own
   * uncanonicalised `const result`, and the route passed on a canonical it never
   * emits. Erring toward accepting is not the safe side for a guard — an
   * accepted broken route is a guard that does nothing while being trusted.
   */
  function declarationInScope(
    reference: ts.Identifier
  ): ts.VariableDeclaration | undefined {
    const declaredHere = (statements: ts.NodeArray<ts.Statement>) => {
      for (const statement of statements) {
        if (!ts.isVariableStatement(statement)) continue;
        for (const d of statement.declarationList.declarations) {
          if (ts.isIdentifier(d.name) && d.name.text === reference.text) return d;
        }
      }
      return undefined;
    };

    for (let scope: ts.Node | undefined = reference; scope; scope = scope.parent) {
      if (ts.isBlock(scope) || ts.isSourceFile(scope)) {
        const found = declaredHere(scope.statements);
        if (found) return found;
      }
    }
    return undefined;
  }

  function objectOf(expression: ts.Expression): ts.ObjectLiteralExpression | undefined {
    const value = unwrap(expression);
    if (ts.isObjectLiteralExpression(value)) return value;
    if (!ts.isIdentifier(value)) return undefined;

    const declaration = declarationInScope(value);
    if (!declaration?.initializer) return undefined;
    const initializer = unwrap(declaration.initializer);
    return ts.isObjectLiteralExpression(initializer) ? initializer : undefined;
  }

  /**
   * The object a property's value is: its initializer longhand, or the binding it
   * names when written shorthand (`{ alternates }`).
   */
  const valueObject = (property: ts.Node): ts.ObjectLiteralExpression | undefined => {
    if (ts.isPropertyAssignment(property)) return objectOf(property.initializer);
    if (ts.isShorthandPropertyAssignment(property)) return objectOf(property.name);
    return undefined;
  };

  /** A direct member of `object` named `name`. */
  const memberOf = (object: ts.ObjectLiteralExpression, name: string) =>
    object.properties.find((property) => named(property, name));

  /**
   * Does this metadata *value* carry `alternates.canonical`? Anchored to the
   * value itself rather than searched for in its subtree: Next reads
   * `alternates` only at the top level, so `{ openGraph: { alternates: {
   * canonical } } }` emits no link, and neither does
   * `alternates: { languages: { canonical } }`.
   */
  const hasCanonical = (value: ts.Expression): boolean => {
    const object = objectOf(value);
    if (!object) return false;
    const alternates = memberOf(object, 'alternates');
    if (!alternates) return false;
    const section = valueObject(alternates);
    return !!section && memberOf(section, 'canonical') !== undefined;
  };

  /**
   * The page is not indexed, so its canonical is moot. Next accepts two spellings:
   * `robots: { index: false }` and the string form `robots: 'noindex'`.
   *
   * Unlike `canonical`, shorthand does not count here — `{ robots: { index } }`
   * says nothing about whether the page is indexed. Presence is the test for a
   * canonical; for `index` it is the value.
   */
  const hasNoIndex = (value: ts.Expression): boolean => {
    const object = objectOf(value);
    if (!object) return false;
    const robots = memberOf(object, 'robots');
    if (!robots) return false;

    if (ts.isPropertyAssignment(robots)) {
      const directive = unwrap(robots.initializer);
      if (ts.isStringLiteral(directive) && /\bnoindex\b/.test(directive.text)) return true;
    }

    const section = valueObject(robots);
    const index = section && memberOf(section, 'index');
    return (
      !!index &&
      ts.isPropertyAssignment(index) &&
      unwrap(index.initializer).kind === ts.SyntaxKind.FalseKeyword
    );
  };

  /**
   * The metadata export itself: `export const metadata = …` or
   * `export …  generateMetadata(…)`. Exits are looked for inside this subtree
   * rather than anywhere in the file, so an unrelated `{ canonical: 'legacy' }`
   * or an options object carrying `index: false` cannot satisfy them.
   */
  /** Top-level declarations of `name` in this file: `function name` or `const name`. */
  function localDeclarations(source: ts.SourceFile, name: string): ts.Node[] {
    const found: ts.Node[] = [];
    for (const statement of source.statements) {
      if (ts.isFunctionDeclaration(statement) && statement.name?.text === name) {
        found.push(statement);
      }
      if (ts.isVariableStatement(statement)) {
        for (const d of statement.declarationList.declarations) {
          if (ts.isIdentifier(d.name) && d.name.text === name) found.push(d);
        }
      }
    }
    return found;
  }

  function metadataExports(source: ts.SourceFile): ts.Node[] {
    const exported = (node: ts.Node) =>
      ts.canHaveModifiers(node) &&
      ts
        .getModifiers(node)
        ?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) === true;

    const declared = source.statements.flatMap<ts.Node>((statement) => {
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

    // `const metadata = {…}; export { metadata };` — a valid module form where
    // neither statement carries an export modifier. Resolve the specifier.
    for (const statement of source.statements) {
      if (!ts.isExportDeclaration(statement) || statement.moduleSpecifier) continue;
      const clause = statement.exportClause;
      if (!clause || !ts.isNamedExports(clause)) continue;
      for (const element of clause.elements) {
        const exportedAs = element.name.text;
        if (exportedAs !== 'metadata' && exportedAs !== 'generateMetadata') continue;
        declared.push(...localDeclarations(source, element.propertyName?.text ?? exportedAs));
      }
    }

    return declared;
  }

  /**
   * The local name `buildMetadata` is bound to, when it really is the helper from
   * `@/lib/seo`. Returns undefined for a local shadow or a same-named export of
   * some other module.
   *
   * Every file scanned here lives under `src/app`, so a bare `./seo` resolves
   * beside the page and is never `src/lib/seo` — it is not accepted.
   * `import { buildMetadata as makeMetadata }` is, under its local name.
   */
  function buildMetadataBinding(source: ts.SourceFile): string | undefined {
    for (const statement of source.statements) {
      if (
        !ts.isImportDeclaration(statement) ||
        !ts.isStringLiteral(statement.moduleSpecifier) ||
        !/^(@\/lib\/seo|(\.\.\/)+lib\/seo)$/.test(statement.moduleSpecifier.text)
      ) {
        continue;
      }
      const bindings = statement.importClause?.namedBindings;
      if (!bindings || !ts.isNamedImports(bindings)) continue;
      for (const element of bindings.elements) {
        const imported = element.propertyName?.text ?? element.name.text;
        if (imported === 'buildMetadata') return element.name.text;
      }
    }
    return undefined;
  }

  /**
   * The default export's body. A route that only redirects has the call as a
   * statement and returns nothing; anything that returns a value renders, whether
   * that value is JSX, a fragment, a string, null or createElement(...). Checking
   * for a returned value rather than for JSX is what makes this hold.
   */
  function defaultExport(source: ts.SourceFile): ts.Node | undefined {
    for (const statement of source.statements) {
      const isDefault =
        ts.canHaveModifiers(statement) &&
        ts
          .getModifiers(statement)
          ?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword) === true;
      if (isDefault && ts.isFunctionDeclaration(statement)) return statement;
      if (ts.isExportAssignment(statement)) return statement;

      // `function Page() {…} export { Page as default };` — a local specifier,
      // resolved the same way a metadata one is. A re-export with a module
      // specifier is not followed; the declaration is not in this file.
      if (ts.isExportDeclaration(statement) && !statement.moduleSpecifier) {
        const clause = statement.exportClause;
        if (!clause || !ts.isNamedExports(clause)) continue;
        for (const element of clause.elements) {
          if (element.name.text !== 'default' || !element.propertyName) continue;
          const [declaration] = localDeclarations(source, element.propertyName.text);
          if (declaration) return declaration;
        }
      }
    }
    return undefined;
  }

  /** Is this node under a conditional or loop, up to (not past) `root`? */

  /** Next ships two redirect helpers: `redirect` (307/302), `permanentRedirect` (308/301). */
  const REDIRECTS = ['redirect', 'permanentRedirect'];

  /**
   * The local names Next's redirect helpers are bound to in this file. Matching
   * the call-site identifier against the two literal names would reject
   * `import { redirect as go } from 'next/navigation'`, and would equally accept
   * a local helper that merely happens to be called `redirect`. Same reasoning,
   * and the same shape, as `buildMetadataBinding`.
   *
   * A namespace import (`import * as nav`) binds no name here, so `nav.redirect()`
   * is not recognised. `calls()` requires a plain identifier callee anyway.
   */
  function redirectBindings(source: ts.SourceFile): string[] {
    const names: string[] = [];
    for (const statement of source.statements) {
      if (
        !ts.isImportDeclaration(statement) ||
        !ts.isStringLiteral(statement.moduleSpecifier) ||
        statement.moduleSpecifier.text !== 'next/navigation'
      ) {
        continue;
      }
      const bindings = statement.importClause?.namedBindings;
      if (!bindings || !ts.isNamedImports(bindings)) continue;
      for (const element of bindings.elements) {
        const imported = element.propertyName?.text ?? element.name.text;
        if (REDIRECTS.includes(imported)) names.push(element.name.text);
      }
    }
    return names;
  }

  const callsARedirect = (redirects: string[], node: ts.Node) =>
    redirects.some((name) => calls(name)(node));

  /**
   * Neither helper returns, so `return redirect('/resources')` is exactly as
   * unconditional as calling it bare — the value is not rendered content.
   */
  const isRedirectCall = (redirects: string[], value: ts.Expression): boolean => {
    const inner = unwrap(value);
    return callsARedirect(redirects, ts.isAwaitExpression(inner) ? inner.expression : inner);
  };

  /**
   * A path out of this statement that is not a redirect: a bare `return`, or a
   * `return` of anything else. Nested functions are skipped — their returns
   * belong to their own control flow, not to this one.
   */
  function escapes(redirects: string[], statement: ts.Statement): boolean {
    let found = false;
    const visit = (node: ts.Node) => {
      if (found) return;
      if (ts.isFunctionLike(node)) return;
      if (ts.isReturnStatement(node)) {
        if (!node.expression || !everyBranchRedirects(redirects, node.expression)) {
          found = true;
        }
        return;
      }
      ts.forEachChild(node, visit);
    };
    visit(statement);
    return found;
  }

  /** Every branch of this expression is a redirect: `cond ? go('/a') : go('/b')`. */
  const everyBranchRedirects = (redirects: string[], value: ts.Expression): boolean => {
    const values = branches(value);
    return values.length > 0 && values.every((v) => isRedirectCall(redirects, v));
  };

  /**
   * Does control definitely leave this body through a redirect?
   *
   * The earlier version asked a proxy question — "is there a redirect call that
   * is not nested inside any conditional?" — which rejects a page that picks its
   * destination exhaustively:
   *
   *   if (legacy) redirect('/old');
   *   else redirect('/new');
   *
   * Both calls sit under the same `if`, so neither looked unconditional, yet no
   * path through the function renders anything. This asks the real question
   * instead, over the shapes a redirect-only page is written in.
   *
   * Deliberately not exhaustive: a `switch` whose every case redirects, or a
   * `try`/`finally`, is not recognised. Those are past where this guard is
   * drawn, and the cost of missing one is a page that must state its canonical
   * explicitly — not a wrong canonical.
   */
  function alwaysRedirects(redirects: string[], body: ts.Node | undefined): boolean {
    if (!body) return false;

    function statementRedirects(statement: ts.Statement): boolean {
      if (ts.isBlock(statement)) return listRedirects(statement.statements);
      if (ts.isExpressionStatement(statement)) {
        return everyBranchRedirects(redirects, statement.expression);
      }
      if (ts.isReturnStatement(statement)) {
        return (
          statement.expression !== undefined &&
          everyBranchRedirects(redirects, statement.expression)
        );
      }
      // An `if` without an `else` can fall through, so it is never definite.
      if (ts.isIfStatement(statement)) {
        return (
          statement.elseStatement !== undefined &&
          statementRedirects(statement.thenStatement) &&
          statementRedirects(statement.elseStatement)
        );
      }
      return false;
    }

    /**
     * A statement that definitely redirects makes everything after it
     * unreachable — but only if control actually reaches it. `if (preview)
     * return;` ahead of a redirect is a path that leaves without one, so the
     * sequence stops being definite at the first statement that can escape.
     */
    function listRedirects(statements: ts.NodeArray<ts.Statement>): boolean {
      for (const statement of statements) {
        if (statementRedirects(statement)) return true;
        if (escapes(redirects, statement)) return false;
      }
      return false;
    }

    if (ts.isBlock(body)) return listRedirects(body.statements);
    // A concise arrow body: `export default () => redirect('/resources')`.
    return ts.isExpression(body) && everyBranchRedirects(redirects, body);
  }

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
    if (ts.isExportAssignment(node)) {
      if (ts.isFunctionLike(node.expression)) return node.expression;
      // `function Page() {…} export default Page;` — resolve the identifier to
      // its declaration in this file, or the route is never inspected at all.
      if (ts.isIdentifier(node.expression)) {
        const name = node.expression.text;
        const source = node.getSourceFile();
        for (const statement of source.statements) {
          if (ts.isFunctionDeclaration(statement) && statement.name?.text === name) {
            return statement;
          }
          if (ts.isVariableStatement(statement)) {
            for (const declaration of statement.declarationList.declarations) {
              if (
                ts.isIdentifier(declaration.name) &&
                declaration.name.text === name &&
                declaration.initializer &&
                ts.isFunctionLike(declaration.initializer)
              ) {
                return declaration.initializer;
              }
            }
          }
        }
      }
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

  /** A function's body, when the node is a function at all. */
  function functionBody(node: ts.Node): ts.Node | undefined {
    return ts.isFunctionLike(node) && 'body' in node
      ? (node.body as ts.Node | undefined)
      : undefined;
  }

  /**
   * Does every path through this metadata function return a value?
   *
   * `returnedValues` collects the returns it finds, which says nothing about the
   * paths that return nothing at all:
   *
   *   if (!record) return { robots: { index: false } };
   *   // …and nothing after it
   *
   * One noindexed value is collected, the route looks noindexed, and the `record`
   * path quietly hands Next no metadata — so it inherits the homepage canonical.
   * That forgetting is exactly what this guard exists to catch, so a function
   * that can fall out of its own body earns no exit.
   *
   * Same shape and same stated limits as `alwaysRedirects`: `switch` and `try`
   * are not recognised, and a route using them states its canonical explicitly.
   */
  function alwaysReturnsValue(body: ts.Node | undefined): boolean {
    if (!body) return false;
    // A concise arrow body is the value: `() => buildMetadata({ … })`.
    if (!ts.isBlock(body)) return true;

    function returnsValue(statement: ts.Statement): boolean {
      if (ts.isBlock(statement)) return sequenceReturns(statement.statements);
      if (ts.isReturnStatement(statement)) return statement.expression !== undefined;
      // Throwing leaves the function without falling through to the end.
      if (ts.isThrowStatement(statement)) return true;
      if (ts.isIfStatement(statement)) {
        return (
          statement.elseStatement !== undefined &&
          returnsValue(statement.thenStatement) &&
          returnsValue(statement.elseStatement)
        );
      }
      return false;
    }

    function bareReturn(statement: ts.Statement): boolean {
      let found = false;
      const visit = (node: ts.Node) => {
        if (found) return;
        if (ts.isFunctionLike(node)) return;
        if (ts.isReturnStatement(node) && !node.expression) {
          found = true;
          return;
        }
        ts.forEachChild(node, visit);
      };
      visit(statement);
      return found;
    }

    function sequenceReturns(statements: ts.NodeArray<ts.Statement>): boolean {
      for (const statement of statements) {
        if (returnsValue(statement)) return true;
        if (bareReturn(statement)) return false;
      }
      // Reaching the end of the body is a path that returns nothing.
      return false;
    }

    return sequenceReturns(body.statements);
  }

  const pages = pageFiles(APP_DIR);

  it('finds routes to check', () => {
    // Guards the traversal. It cannot detect the predicates below being wrong.
    expect(pages.length).toBeGreaterThan(30);
  });

  it.each(pages.map((p) => [relative(APP_DIR, p), p]))('%s', (route, file) => {
    const source = parse(file);
    const metaNodes = metadataExports(source);
    const helper = buildMetadataBinding(source);
    const redirects = redirectBindings(source);

    /** The value(s) a metadata declaration resolves to, for direct inspection. */
    const valuesOf = (node: ts.Node): ts.Expression[] => {
      const returns = returnedValues(node);
      if (returns.length > 0) return returns;
      if (ts.isVariableDeclaration(node) && node.initializer) return [node.initializer];
      return [];
    };

    /** A direct `buildMetadata({ … })`, which sets the canonical from `path`. */
    const isHelperCall = (value: ts.Expression) =>
      helper !== undefined && calls(helper)(unwrap(value));

    /**
     * Does this one returned value carry a canonical? Three ways, because the
     * repo already writes all three:
     *
     *   return buildMetadata({ path, … });          // the helper's own canonical
     *   return { alternates: { canonical } };       // written out
     *   const base = buildMetadata({ … });          // blog/[slug]
     *   return { ...base, openGraph: { … } };       // through the spread
     *
     * The third is why the branching rule below used to settle for "a canonical
     * somewhere in the function": a spread hides the canonical from any check on
     * the returned object. Resolving the spread to its declaration is one hop of
     * the same lookup `objectOf` already does, so the excuse no longer holds.
     */
    const yieldsCanonical = (value: ts.Expression): boolean => {
      if (isHelperCall(value)) return true;
      if (hasCanonical(value)) return true;

      const object = objectOf(value);
      if (!object) return false;
      return object.properties.some((property) => {
        if (!ts.isSpreadAssignment(property)) return false;
        const spread = unwrap(property.expression);
        if (isHelperCall(spread)) return true;
        if (!ts.isIdentifier(spread)) return false;
        const declaration = declarationInScope(spread);
        if (!declaration?.initializer) return false;
        const initializer = unwrap(declaration.initializer);
        return isHelperCall(initializer) || hasCanonical(initializer);
      });
    };

    const carriesCanonical = (node: ts.Node) =>
      valuesOf(node).some(yieldsCanonical) ||
      (helper !== undefined && some(node, calls(helper)));

    const exits: string[] = [];

    for (const node of metaNodes) {
      const returns = returnedValues(node);

      // A generateMetadata that can finish without returning anything hands Next
      // no metadata on that path, which inherits. No exit from this export.
      const metadataBody = functionBody(metadataFunction(node));
      if (metadataBody && !alwaysReturnsValue(metadataBody)) continue;

      if (returns.length > 1) {
        // A branching generateMetadata. Either every branch is noindexed, or the
        // *last* return carries the canonical.
        //
        // The last return rather than any return, because the shape both real
        // routes here are written in is a guard clause and then the answer:
        //
        //   if (!post) return {};                    // blog/[slug]
        //   if (!serviceData) return { title: … };    // services/[service]/[city]
        //   return buildMetadata({ path, … });        // the page that is served
        //
        // Early returns are the misses — those pages call notFound(), so nothing
        // they say is indexed. The final return is the metadata the route
        // actually serves, and it is the one that must be canonical. Accepting a
        // canonical on *any* branch, which is what this did before, approves the
        // inverse — `if (legacy) return { alternates: { canonical } }` followed
        // by a bare `return { title }` — where the page that is served inherits.
        //
        // The limit, stated plainly: a route whose served metadata is an early
        // return and whose last return is the miss reads backwards to this and
        // has to declare its canonical another way. Distinguishing those needs
        // the metadata branch to be correlated with the component's notFound(),
        // which is dataflow across two functions.
        if (returns.every(hasNoIndex)) {
          exits.push('robots index: false on every branch');
        } else {
          const served = returns[returns.length - 1];
          if (yieldsCanonical(served) || hasNoIndex(served)) {
            exits.push('a canonical on the served branch');
          }
        }
        continue;
      }

      if (carriesCanonical(node)) exits.push('an explicit canonical');
      else if (valuesOf(node).some(hasNoIndex)) exits.push('robots index: false');
    }

    // A redirect only exempts the route when *every* path takes it. Two things
    // have to hold, and each caught a different miss:
    //   - nothing else renders (ternaries and concise arrow bodies included,
    //     which is why this reuses the branch machinery), and
    //   - the call is not nested in a conditional. `if (loggedIn)
    //     redirect('/account');` with no return after it has no rendered value
    //     either, yet the fallthrough is not a redirect.
    const fn = defaultExport(source);
    if (fn) {
      const root = metadataFunction(fn);
      const body =
        ts.isFunctionLike(root) && 'body' in root
          ? (root.body as ts.Node | undefined)
          : undefined;
      // `rendered` is redundant while `alwaysRedirects` is correct — if every
      // path redirects, nothing else is returned. It stays as a second opinion
      // on hand-rolled reachability, and costs only unreachable code after a
      // redirect, which `never` makes a type error anyway.
      const rendered = returnedValues(fn).filter(
        (value) => !isRedirectCall(redirects, value)
      );
      if (alwaysRedirects(redirects, body) && rendered.length === 0) {
        exits.push('an unconditional redirect()');
      }
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
