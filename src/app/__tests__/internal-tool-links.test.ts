import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Audit M1 / PR-B review: /sales and /review-request must always start a
 * fresh document so already-running analytics can't follow a soft
 * navigation. Nothing may link to them through next/link-style hrefs,
 * router pushes or redirects. (A plain external bookmark is fine.)
 */

const ROOT = join(__dirname, '..', '..', '..');
const SCAN_DIRS = ['src', 'content'];
const EXTS = /\.(tsx?|mdx?|json)$/;

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[] = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXTS.test(name) && !/\.test\.tsx?$/.test(name)) out.push(full);
  }
  return out;
}

const TOOL = String.raw`\/(?:sales|review-request)(?=["'\`/?#\s)])`;
const PATTERNS = [
  new RegExp(String.raw`href\s*[:=]\s*\{?\s*["'\`]` + TOOL),
  new RegExp(String.raw`\b(?:router|navigation)\.(?:push|replace|prefetch)\(\s*["'\`]` + TOOL),
  new RegExp(String.raw`\b(?:redirect|permanentRedirect)\(\s*["'\`]` + TOOL),
  new RegExp(String.raw`\]\(\s*` + TOOL),
];

describe('internal tools are never soft-navigated to', () => {
  it('no in-app link, router push or redirect targets /sales or /review-request', () => {
    const offenders: string[] = [];
    for (const dir of SCAN_DIRS) {
      for (const file of walk(join(ROOT, dir))) {
        const lines = readFileSync(file, 'utf8').split('\n');
        lines.forEach((line, i) => {
          if (PATTERNS.some((re) => re.test(line))) offenders.push(`${relative(ROOT, file)}:${i + 1}: ${line.trim()}`);
        });
      }
    }
    expect(offenders).toEqual([]);
  });

  it('the scanner catches a soft link', () => {
    expect(PATTERNS.some((re) => re.test(`<Link href="/sales">`))).toBe(true);
    expect(PATTERNS.some((re) => re.test(`{ href: '/review-request', label: 'x' }`))).toBe(true);
    expect(PATTERNS.some((re) => re.test(`router.push('/sales?bucket=hot')`))).toBe(true);
    expect(PATTERNS.some((re) => re.test(`<Link href="/sales-tax">`))).toBe(false);
  });
});
