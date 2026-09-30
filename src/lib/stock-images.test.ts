import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
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
import { INVESTMENT_GUIDE } from './investment-guide';

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

  it('allows stock on service galleries and keeps it off the photo wall', () => {
    const gallerySrcs = Object.values(SERVICE_DATA).flatMap((data) => data.gallery ?? []).map((img) => img.src);
    expect(gallerySrcs.some((src) => isStockImage(src))).toBe(true);
    for (const img of GALLERY_IMAGES) {
      expect(isStockImage(img.src), img.src).toBe(false);
      expect(isVerifiedWorkImage(img.src), img.src).toBe(true);
    }
  });

  it('keeps the original stock photos on signature cards', () => {
    const srcs = INVESTMENT_GUIDE.map((cat) => cat.image.src);
    expect(srcs).toContain('/images/inspiration/basement-media-lounge.jpg');
    expect(srcs).toContain('/images/projects/kitchens/hero.jpg');
    expect(srcs).toContain('/images/inspiration/suite-spa-bath.jpg');
    expect(srcs).toContain('/images/deck-screened-porch.jpg');
    expect(srcs).not.toContain('/images/work/kitchen-bethesda-waterfall-island.jpg');
    expect(srcs).not.toContain('/images/work/bath-bethesda-chevron-shower.jpg');
  });
});

const FORBIDDEN_LABELS = [
  'design inspiration',
  'kitchen & bath inspiration',
  'outdoor living inspiration',
  'inspiration photography',
  'inspiration imagery',
  '· inspiration',
  'inspiration:',
];

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === 'docs') continue;
      sourceFiles(full, out);
      continue;
    }
    if (/\.(tsx?|mdx?)$/.test(entry) && !/\.test\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

describe('no inspiration labels', () => {
  it('does not render an inspiration caption, badge, heading, or disclaimer', () => {
    const hits: string[] = [];
    for (const root of ['src', 'content'].map((dir) => join(process.cwd(), dir))) {
      for (const file of sourceFiles(root)) {
        const text = readFileSync(file, 'utf8').toLowerCase();
        for (const label of FORBIDDEN_LABELS) {
          if (text.includes(label)) hits.push(`${file} → ${label}`);
        }
      }
    }
    expect(hits).toEqual([]);
  });

  it('uses one license line above the projects photo wall and no stock gallery', () => {
    const page = readFileSync(join(process.cwd(), 'src/app/projects/page.tsx'), 'utf8');
    expect(page).toContain('Licensed in WV · VA · PA — serving the WV–MD–VA–PA region');
    expect(page).not.toContain('Recent Work');
    expect(page).not.toContain('The photo wall');
    expect(page).not.toContain('filter by category');
    expect(page).not.toContain('LuxuryGallery');
  });
});
