import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  STOCK_IMAGE_MATCHES,
  UNVERIFIED_IMAGE_MATCHES,
  isStockImage,
  isUnverifiedImage,
  isVerifiedWorkImage,
} from './stock-images';
import {
  BEFORE_AFTER_PAIRS,
  GALLERY_IMAGES,
  HOMEPAGE_FEATURED_SERVICES,
  HOMEPAGE_PROJECT_SPOTLIGHT,
} from './constants';
import { SERVICE_DATA } from './services-data';

describe('stock image registry', () => {
  it('lists only files that exist in public/', () => {
    for (const src of STOCK_IMAGE_MATCHES) {
      expect(existsSync(join(process.cwd(), 'public', src)), src).toBe(true);
    }
  });

  it('treats the inspiration folder as stock, except partner paving photos', () => {
    expect(isStockImage('/images/inspiration/suite-spa-bath.jpg')).toBe(true);
    expect(isStockImage('/images/inspiration/paving-aplus-driveway.jpg')).toBe(false);
    expect(isStockImage('/images/work/bath-primary-frameless-shower.webp')).toBe(false);
  });

  it('lists unverified files that exist, and does not call them stock', () => {
    expect(UNVERIFIED_IMAGE_MATCHES).toContain('/images/roofing-complete.jpg');
    expect(UNVERIFIED_IMAGE_MATCHES).toContain('/images/inspiration/paving-fresh-asphalt.jpg');
    const stock = new Set(STOCK_IMAGE_MATCHES);
    for (const src of UNVERIFIED_IMAGE_MATCHES) {
      expect(existsSync(join(process.cwd(), 'public', src)), src).toBe(true);
      expect(stock.has(src), src).toBe(false);
      expect(isUnverifiedImage(src), src).toBe(true);
      expect(isStockImage(src), src).toBe(false);
      expect(isVerifiedWorkImage(src), src).toBe(false);
    }
  });

  it('refuses stock, inspiration, and unverified assets as verified work', () => {
    expect(isVerifiedWorkImage('/images/roofing-complete.jpg')).toBe(false);
    expect(isVerifiedWorkImage('/images/inspiration/paving-fresh-asphalt.jpg')).toBe(false);
    expect(isVerifiedWorkImage('/images/projects/kitchens/hero.jpg')).toBe(false);
    expect(isVerifiedWorkImage('/images/inspiration/suite-spa-bath.jpg')).toBe(false);
    expect(isVerifiedWorkImage('/images/work/bath-primary-frameless-shower.webp')).toBe(true);
    expect(isVerifiedWorkImage('/images/inspiration/paving-aplus-driveway.jpg')).toBe(true);
  });
});

describe('stock never presented as Real Elite work', () => {
  it('keeps the /projects photo wall free of stock', () => {
    for (const img of GALLERY_IMAGES) {
      expect(isVerifiedWorkImage(img.src), img.src).toBe(true);
    }
  });

  it('keeps before/after pairs and homepage work modules free of stock', () => {
    for (const pair of BEFORE_AFTER_PAIRS) {
      expect(isVerifiedWorkImage(pair.before.src), pair.before.src).toBe(true);
      expect(isVerifiedWorkImage(pair.after.src), pair.after.src).toBe(true);
    }
    for (const svc of HOMEPAGE_FEATURED_SERVICES) {
      expect(isVerifiedWorkImage(svc.image), svc.image).toBe(true);
    }
    expect(isVerifiedWorkImage(HOMEPAGE_PROJECT_SPOTLIGHT.image)).toBe(true);
  });

  it('never uses stock as a service-page hero or overview image', () => {
    // Galleries may hold stock: RelatedProjects moves it under a labelled
    // "Design inspiration" heading. Heroes and overview images carry no label.
    for (const [slug, data] of Object.entries(SERVICE_DATA)) {
      for (const img of [data.hero.image, data.overview.image]) {
        if (img) expect(isVerifiedWorkImage(img.src), `${slug} → ${img.src}`).toBe(true);
      }
    }
  });
});

const INSPIRATION_WORD = /\binspiration\b/i;

/** Drop asset paths and code identifiers. A bare "inspiration" label stays. */
function visibleProse(text: string): string {
  return text
    .replace(/\/images\/inspiration\b[^\s)'"`]*/gi, ' ')
    .replace(/\binspiration(?:[-_][A-Za-z0-9_$.-]+)\b/gi, ' ')
    .replace(/\b(?!inspiration\b)[A-Za-z0-9_$.-]*inspiration[A-Za-z0-9_$.-]*\b/gi, ' ');
}

function frontmatterProse(source: string): string {
  const fm = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return '';
  return fm[1]
    .split('\n')
    .map((line) => {
      const match = line.match(/^[\w]+\s*:\s*(.*)$/);
      if (!match) return '';
      const value = match[1].trim().replace(/^['"]|['"]$/g, '');
      if (/\/images\//.test(value) || /^https?:\/\//.test(value)) return '';
      return value;
    })
    .join('\n');
}

function markdownRendered(source: string): string {
  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
  const visible = body
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`[^`]*`/g, ' ');
  return visibleProse(`${frontmatterProse(source)}\n${visible}`);
}

function codeRendered(source: string): string {
  const text = source.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:\\])\/\/.*$/gm, '$1');
  const parts: string[] = [];
  for (const match of text.matchAll(/(?<![=-])>([^<>{}]+)</g)) {
    const chunk = match[1].trim();
    if (chunk) parts.push(chunk);
  }
  for (const match of text.matchAll(/(['"`])((?:\\.|(?!\1)[\s\S])*?)\1/g)) {
    if (match[2].trim()) parts.push(match[2]);
  }
  return visibleProse(parts.join('\n'));
}

describe('no inspiration labels', () => {
  it('flags a rendered inspiration heading and ignores asset paths and identifiers', () => {
    const heading = ['---', 'featuredImage: "/images/inspiration/example.jpg"', '---', '## Inspiration', ''].join(
      '\n',
    );
    expect(markdownRendered(heading)).toMatch(INSPIRATION_WORD);
    const photos = [
      '---',
      'featuredImage: "/images/inspiration/example.jpg"',
      '---',
      '![A tile shower](/images/inspiration/example.jpg)',
      '',
    ].join('\n');
    expect(markdownRendered(photos)).not.toMatch(INSPIRATION_WORD);
    expect(
      codeRendered('const id = "outdoor-living-inspiration";\nconst src = "/images/inspiration/a.jpg";'),
    ).not.toMatch(INSPIRATION_WORD);
    expect(codeRendered('<h2>Inspiration</h2>')).toMatch(INSPIRATION_WORD);
    expect(codeRendered('<h2>{"Inspiration"}</h2>')).toMatch(INSPIRATION_WORD);
    expect(codeRendered('title="Inspiration"')).toMatch(INSPIRATION_WORD);
    expect(codeRendered('<img title="Inspiration" alt="Tile shower" />')).toMatch(INSPIRATION_WORD);
  });
});
