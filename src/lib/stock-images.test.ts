import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { STOCK_IMAGE_MATCHES, isStockImage } from './stock-images';
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
});

describe('stock never presented as Real Elite work', () => {
  it('keeps the /projects photo wall free of stock', () => {
    for (const img of GALLERY_IMAGES) {
      expect(isStockImage(img.src), img.src).toBe(false);
    }
  });

  it('keeps before/after pairs and homepage work modules free of stock', () => {
    for (const pair of BEFORE_AFTER_PAIRS) {
      expect(isStockImage(pair.before.src), pair.before.src).toBe(false);
      expect(isStockImage(pair.after.src), pair.after.src).toBe(false);
    }
    for (const svc of HOMEPAGE_FEATURED_SERVICES) {
      expect(isStockImage(svc.image), svc.image).toBe(false);
    }
    expect(isStockImage(HOMEPAGE_PROJECT_SPOTLIGHT.image)).toBe(false);
  });

  it('never uses stock as a service-page hero or overview image', () => {
    // Galleries may hold stock: RelatedProjects moves it under a labelled
    // "Design inspiration" heading. Heroes and overview images carry no label.
    for (const [slug, data] of Object.entries(SERVICE_DATA)) {
      for (const img of [data.hero.image, data.overview.image]) {
        if (img) expect(isStockImage(img.src), `${slug} → ${img.src}`).toBe(false);
      }
    }
  });
});
