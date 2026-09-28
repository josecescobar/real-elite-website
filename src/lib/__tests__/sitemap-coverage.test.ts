import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';

const require = createRequire(import.meta.url);

const APP_DIR = join(process.cwd(), 'src', 'app');
const SITEMAP_FILE = join(process.cwd(), 'public', 'sitemap-0.xml');
const PAGE_FILE = /^page\.(tsx|ts|jsx|js)$/;

type SitemapField = { loc?: string };
type SitemapConfig = {
  siteUrl: string;
  exclude?: string[];
  additionalPaths?: (config: {
    transform: (config: unknown, path: string) => Promise<SitemapField>;
  }) => Promise<SitemapField[]>;
};

const sitemapConfig = require(join(process.cwd(), 'next-sitemap.config.js')) as SitemapConfig;

/**
 * next-sitemap (4.2.3) builds its URL set from build-manifest pages, AMP pages,
 * prerender-manifest routes, and static-export HTML. It never reads the App
 * Router dynamic route table. A page Next marks `ƒ` (server-rendered on demand)
 * is therefore absent unless `additionalPaths` adds it back. `exclude` is
 * applied only to the manifest set, before `additionalPaths`.
 *
 * This mirrors next-sitemap's matcher: `*` is `[\s\S]*`, the match is
 * case-insensitive, and the pattern is anchored.
 */
function matchesExcludePattern(route: string, pattern: string): boolean {
  const negated = pattern.startsWith('!');
  const body = negated ? pattern.slice(1) : pattern;
  const escaped = body
    .replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
    .replace(/-/g, '\\x2d')
    .replace(/\\\*/g, '[\\s\\S]*');
  const matched = new RegExp(`^${escaped}$`, 'i').test(route);
  return negated ? !matched : matched;
}

function isExcluded(route: string, patterns: string[]): boolean {
  return patterns.some((pattern) => matchesExcludePattern(route, pattern));
}

function pageFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return pageFiles(full);
    return PAGE_FILE.test(entry.name) ? [full] : [];
  });
}

/** `src/app/projects/page.tsx` → `/projects`. Route groups are not URL segments. */
function routeFromPage(file: string): string {
  const rel = relative(APP_DIR, file).replace(/\\/g, '/');
  const withoutPage = rel.replace(/\/?page\.(tsx|ts|jsx|js)$/, '');
  const segments = withoutPage
    .split('/')
    .filter(Boolean)
    .filter((segment) => !(segment.startsWith('(') && segment.endsWith(')')));
  return `/${segments.join('/')}`;
}

function isInTypeNode(node: ts.Node): boolean {
  let current: ts.Node | undefined = node;
  while (current) {
    if (ts.isTypeNode(current)) return true;
    current = current.parent;
  }
  return false;
}

function bindingNamesSearchParams(name: ts.BindingName): boolean {
  if (ts.isIdentifier(name)) return name.text === 'searchParams';
  return name.elements.some((element) => {
    if (!ts.isBindingElement(element)) return false;
    if (
      element.propertyName &&
      ts.isIdentifier(element.propertyName) &&
      element.propertyName.text === 'searchParams'
    ) {
      return true;
    }
    if (!element.propertyName && ts.isIdentifier(element.name) && element.name.text === 'searchParams') {
      return true;
    }
    return bindingNamesSearchParams(element.name);
  });
}

function exportedString(source: ts.SourceFile, name: string): string | undefined {
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const exported = statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
    if (!exported) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== name) continue;
      let initializer = declaration.initializer;
      while (
        initializer &&
        (ts.isAsExpression(initializer) ||
          ts.isSatisfiesExpression(initializer) ||
          ts.isParenthesizedExpression(initializer))
      ) {
        initializer = initializer.expression;
      }
      if (initializer && ts.isStringLiteral(initializer)) return initializer.text;
    }
  }
  return undefined;
}

function exportsFunction(source: ts.SourceFile, name: string): boolean {
  for (const statement of source.statements) {
    if (
      ts.isFunctionDeclaration(statement) &&
      statement.name?.text === name &&
      statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      return true;
    }
    if (!ts.isVariableStatement(statement)) continue;
    const exported = statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
    if (!exported) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name) return true;
    }
  }
  return false;
}

/**
 * True when Next will not put this page in prerender-manifest.routes.
 * `searchParams` (and the request APIs) opt the page into dynamic rendering.
 * `force-static` puts it back in the manifest, which changes query-string
 * behavior, so the sitemap fix must not rely on that.
 */
function omittedFromPrerender(source: ts.SourceFile): boolean {
  const dynamic = exportedString(source, 'dynamic');
  if (dynamic === 'force-static') return false;
  if (dynamic === 'force-dynamic') return true;

  let readsSearchParams = false;
  let readsRequestApi = false;
  const requestApis = new Set(['cookies', 'headers', 'draftMode', 'connection', 'unstable_noStore']);

  const visit = (node: ts.Node) => {
    if (
      ts.isFunctionDeclaration(node) &&
      node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword)
    ) {
      for (const param of node.parameters) {
        if (bindingNamesSearchParams(param.name)) readsSearchParams = true;
      }
    }
    if (
      !isInTypeNode(node) &&
      ts.isPropertyAccessExpression(node) &&
      node.name.text === 'searchParams'
    ) {
      readsSearchParams = true;
    }
    if (
      !isInTypeNode(node) &&
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      requestApis.has(node.expression.text)
    ) {
      readsRequestApi = true;
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return readsSearchParams || readsRequestApi;
}

function parse(file: string): ts.SourceFile {
  return ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('.tsx') || file.endsWith('.jsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
}

async function additionalLocs(): Promise<string[]> {
  if (!sitemapConfig.additionalPaths) return [];
  const fields = await sitemapConfig.additionalPaths({
    transform: async (_config, path) => ({ loc: path }),
  });
  return fields.map((field) => field.loc).filter((loc): loc is string => Boolean(loc));
}

function absoluteLoc(siteUrl: string, route: string): string {
  const origin = siteUrl.replace(/\/$/, '');
  return route === '/' ? origin : `${origin}${route}`;
}

type PageRoute = {
  file: string;
  route: string;
  dynamicSegment: boolean;
  omitted: boolean;
  hasStaticParams: boolean;
};

function collectPages(): PageRoute[] {
  return pageFiles(APP_DIR).map((file) => {
    const source = parse(file);
    const route = routeFromPage(file);
    return {
      file: relative(process.cwd(), file),
      route,
      dynamicSegment: route.includes('['),
      omitted: omittedFromPrerender(source),
      hasStaticParams: exportsFunction(source, 'generateStaticParams'),
    };
  });
}

describe('sitemap covers every public page route', () => {
  const exclude = sitemapConfig.exclude ?? [];
  const pages = collectPages();

  it('keeps the internal routes out of the sitemap config', () => {
    for (const route of ['/review-request', '/sales', '/blog']) {
      expect(isExcluded(route, exclude), route).toBe(true);
    }
    expect(isExcluded('/blog/some-post', exclude)).toBe(false);
    expect(isExcluded('/projects', exclude)).toBe(false);
    expect(isExcluded('/reviews', exclude)).toBe(false);
  });

  it('lists every on-demand page that next-sitemap would otherwise drop', async () => {
    const added = new Set(await additionalLocs());
    const dropped = pages.filter(
      (page) => !page.dynamicSegment && page.omitted && !isExcluded(page.route, exclude),
    );

    expect(dropped.map((page) => page.route).sort()).toEqual([...added].sort());
    for (const route of added) {
      expect(isExcluded(route, exclude), `${route} is excluded and must not be re-added`).toBe(false);
      expect(
        pages.some((page) => page.route === route),
        `${route} is not a page.tsx route`,
      ).toBe(true);
    }
  });

  it('requires generateStaticParams on dynamic segments so the prerender manifest has URLs', () => {
    const missing = pages
      .filter((page) => page.dynamicSegment && !page.hasStaticParams && !isExcluded(page.route, exclude))
      .map((page) => page.file);
    expect(missing).toEqual([]);
  });

  it('matches the generated sitemap when public/sitemap-0.xml is present', () => {
    if (!existsSync(SITEMAP_FILE)) return;

    const xml = readFileSync(SITEMAP_FILE, 'utf8');
    const locs = new Set([...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((match) => match[1]));
    const literal = pages.filter((page) => !page.dynamicSegment);

    const missing = literal
      .filter((page) => !isExcluded(page.route, exclude))
      .map((page) => absoluteLoc(sitemapConfig.siteUrl, page.route))
      .filter((loc) => !locs.has(loc));
    const leaked = literal
      .filter((page) => isExcluded(page.route, exclude))
      .map((page) => absoluteLoc(sitemapConfig.siteUrl, page.route))
      .filter((loc) => locs.has(loc));

    expect(missing, 'public routes missing from sitemap-0.xml').toEqual([]);
    expect(leaked, 'excluded routes present in sitemap-0.xml').toEqual([]);
  });
});
