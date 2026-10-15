import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Every prerendered page's meta description must fit the snippet budget.
 *
 * Google cuts a description around 160 characters. A longer string is still
 * in the HTML, but the extra words never show, and several service pages had
 * pasted a whole permit paragraph into `metaDescription`. This reads the
 * built `<meta name="description">`, not the source field, so a template,
 * a fallback, or a hardcoded `metadata` export is covered the same way.
 *
 * It is part of `npm run test:built` (see vitest.built.config.ts) because it
 * needs `.next/`. It fails if that output is missing rather than passing on
 * an empty directory.
 */

const APP = '.next/server/app';
const MAX = 160;

/** Trailing slashes are not meaningful here; `/a/` and `/a` are one route. */
const norm = (p: string): string => p.replace(/\/+$/, '') || '/';

function builtPages(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) out.push(full);
    }
  };
  walk(APP);
  return out;
}

/** Next writes the homepage as `index.html`; `/index` is not a route. */
const pageRoute = (file: string): string => {
  const route = norm(file.slice(APP.length).replace(/\.html$/, ''));
  return route === '/index' ? '/' : route;
};

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

/** The document meta description, decoded. Null when the page has none. */
function metaDescription(html: string): string | null {
  const tag = html.match(/<meta\b[^>]*\bname="description"[^>]*>/i);
  if (!tag) return null;
  const content = tag[0].match(/\bcontent="([^"]*)"/);
  return content ? decodeEntities(content[1]) : null;
}

describe('built meta descriptions', () => {
  const hasBuild = fs.existsSync(APP);

  it('has build output to read', () => {
    expect(
      hasBuild,
      `${APP} is missing — run \`npm run build\` first. This suite asserts nothing without it, so it fails rather than passing empty.`
    ).toBe(true);
  });

  if (!hasBuild) return;

  const pages = builtPages().map((file) => {
    const html = fs.readFileSync(file, 'utf8');
    return { route: pageRoute(file), description: metaDescription(html) };
  });

  it('reads a full prerender, not a handful of HTML files', () => {
    const withDescription = pages.filter((page) => page.description);
    expect(withDescription.length).toBeGreaterThanOrEqual(500);
  });

  it('keeps every meta description at or under 160 characters', () => {
    const over = pages
      .filter((page) => page.description && page.description.length > MAX)
      .map((page) => `${page.route} (${page.description!.length}): ${page.description}`)
      .sort();
    expect(over).toEqual([]);
  });

  it('does not let two built pages share a meta description', () => {
    // Routes dropped from the uniqueness check. Add one only when a shared
    // description is genuinely unavoidable (a noindex shell that cannot carry
    // its own sentence, for example) and say why next to the route.
    //
    // Empty on purpose. The only former duplicate was the root-layout sentence
    // on `/`, `/blog`, `/review-request`, and `/_not-found`. Home keeps that
    // sentence. `/blog`, `/review-request`, and `/_not-found` have their own.
    // `/_global-error` has no description, so it is not a duplicate and is
    // not listed here.
    const DUPLICATE_DESCRIPTION_ALLOWLIST = new Set<string>([]);

    const groups = new Map<string, string[]>();
    for (const page of pages) {
      if (!page.description) continue;
      if (DUPLICATE_DESCRIPTION_ALLOWLIST.has(page.route)) continue;
      const routes = groups.get(page.description) ?? [];
      routes.push(page.route);
      groups.set(page.description, routes);
    }

    const shared = [...groups.entries()]
      .filter(([, routes]) => routes.length > 1)
      .map(([description, routes]) => `${[...routes].sort().join(', ')}: ${description}`)
      .sort();

    expect(shared).toEqual([]);
  });

  it('supports the /blog description with that page’s own visible body', () => {
    const file = path.join(APP, 'blog.html');
    const html = fs.readFileSync(file, 'utf8');
    // redirect() replaces this document with an empty shell. The description
    // has to be in the layout footer this file actually renders.
    expect(html).not.toContain('id="__next_error__"');
    const description = metaDescription(html);
    expect(description, '/blog is missing a meta description').toBeTruthy();

    const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? '';
    const visible = decodeEntities(
      body
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
    );
    expect(visible).toContain(description);
  });
});
