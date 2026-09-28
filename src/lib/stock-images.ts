/**
 * Images that are NOT photographs of Real Elite's own work.
 *
 * Source of truth for the honesty rule: stock (or otherwise third-party)
 * photography may appear only where the page labels it as design inspiration,
 * never where a visitor would read it as a Real Elite project.
 *
 * `STOCK_IMAGE_MATCHES` lists every file in `public/images` that a perceptual
 * hash matched to a stock original in the git-ignored source library
 * (`images/new-images`, `images/inspiration`). See
 * docs/STOCK-IMAGE-AUDIT-2026-09-27.md for the method and the source each file
 * matched. Everything under `/images/inspiration/` is inspiration by
 * convention, except the A+ Paving partner photos.
 *
 * Consumers:
 * - `RelatedProjects` moves stock gallery images under a "Design inspiration"
 *   heading instead of "Recent … projects".
 * - `GuideTemplate` captions stock article images "Design inspiration".
 * - Tests fail if a case study or the /projects photo wall references one.
 */
export const STOCK_IMAGE_MATCHES: readonly string[] = [
  '/images/deck-garden-path-view.jpg',
  '/images/deck-ipe-modern.jpg',
  '/images/deck-multilevel-step-lights.jpg',
  '/images/deck-pebble-detail.jpg',
  '/images/deck-screened-porch.jpg',
  '/images/exterior-brick-victorian.jpg',
  '/images/projects/basements/hero-framing.jpg',
  '/images/projects/bathrooms/hero.jpg',
  '/images/projects/bathrooms/shower-black-frame.jpg',
  '/images/projects/bathrooms/shower-stone-accent.jpg',
  '/images/projects/bathrooms/tub-shower-tile.jpg',
  '/images/projects/kitchens/gray-marble-waterfall.jpg',
  '/images/projects/kitchens/hero.jpg',
  '/images/projects/kitchens/island-lantern-pendants.jpg',
  '/images/projects/kitchens/two-tone-black-hood.jpg',
  '/images/projects/kitchens/white-herringbone.jpg',
  '/images/projects/kitchens/white-island-chairs.jpg',
  '/images/roofing-shingle-install.jpg',
  '/images/roofing-tearoff.jpg',
  '/images/roofing-victorian-reroof.jpg',
  '/images/inspiration/kitchenette-refresh.webp',
  '/images/inspiration/loudoun-screened-porch.webp',
  '/images/inspiration/loudoun-timber-porch.webp',
  '/images/inspiration/wholehome-kitchen-refresh.webp',
];

const STOCK_SET = new Set(STOCK_IMAGE_MATCHES);

/** Partner (A+ Paving & Landscaping) job photos, disclosed on /paving. Not stock. */
const PARTNER_PREFIX = '/images/inspiration/paving-aplus-';

/** True when `src` is stock or inspiration photography, not Real Elite work. */
export function isStockImage(src: string): boolean {
  if (STOCK_SET.has(src)) return true;
  return src.startsWith('/images/inspiration/') && !src.startsWith(PARTNER_PREFIX);
}
