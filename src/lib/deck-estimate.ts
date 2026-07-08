/**
 * Instant Deck Quote — pricing + estimate math.
 *
 * ===========================================================================
 *  EDIT YOUR PRICES HERE.
 *
 *  `pricePerSqFt` is the ALL-IN installed price for one square foot of deck —
 *  concrete footings, framing, decking boards, railing, fasteners, basic
 *  stairs, labor, overhead, and your margin, baked into one number.
 *
 *  The numbers below are placeholder regional figures for 2026 — adjust to
 *  your real rates.
 * ===========================================================================
 */

export type DeckMaterialSlug = 'pressure-treated' | 'composite' | 'premium' | 'other';

export type DeckMaterial = {
  slug: DeckMaterialSlug;
  label: string;
  tagline: string;
  blurb: string;
  /** All-in installed $ per square foot of deck. `null` = priced manually. */
  pricePerSqFt: number | null;
  recommended?: boolean;
};

export const DECK_MATERIALS: DeckMaterial[] = [
  {
    slug: 'pressure-treated',
    label: 'Pressure-Treated Wood',
    tagline: 'Budget-friendly',
    blurb:
      'The classic, cost-effective deck — solid pressure-treated lumber. Plan to seal or stain it every couple of years.',
    pricePerSqFt: 30,
  },
  {
    slug: 'composite',
    label: 'Composite',
    tagline: 'Most popular',
    blurb:
      'Capped composite boards (Trex-style) — no staining, no splinters, 25-year-plus life. The choice on most new decks today.',
    pricePerSqFt: 55,
    recommended: true,
  },
  {
    slug: 'premium',
    label: 'Premium PVC / Capped Composite',
    tagline: 'Top tier',
    blurb:
      'High-end PVC and premium composite lines — the richest look, the best fade and stain warranties, the longest life.',
    pricePerSqFt: 78,
  },
  {
    slug: 'other',
    label: 'Other / Not sure yet',
    tagline: "We'll help you choose",
    blurb:
      'Cedar, hardwood, or a full outdoor-living build with a pergola and lighting? Tell us what you have in mind and we will price it with you.',
    pricePerSqFt: null,
  },
];

export function getDeckMaterial(slug: string): DeckMaterial | undefined {
  return DECK_MATERIALS.find((m) => m.slug === slug);
}

/* ----------------------------- deck height ------------------------------ */

export const ELEVATION_OPTIONS = [
  { value: 'ground', label: 'Ground level', hint: 'Under 2 ft off the ground', factor: 1.0 },
  { value: 'raised', label: 'Raised', hint: '2-8 ft up — includes a staircase', factor: 1.25 },
  { value: 'elevated', label: 'Elevated', hint: '8 ft+ or off a second story', factor: 1.5 },
] as const;

export type ElevationValue = (typeof ELEVATION_OPTIONS)[number]['value'];

/* --------------------------- common deck sizes -------------------------- */

export const PRESET_SIZES: { w: number; l: number }[] = [
  { w: 10, l: 10 },
  { w: 10, l: 12 },
  { w: 12, l: 16 },
  { w: 16, l: 16 },
  { w: 16, l: 20 },
  { w: 20, l: 20 },
];

/** Reasonable bounds for a residential deck dimension, in feet. */
export const DECK_MIN_DIM = 4;
export const DECK_MAX_DIM = 80;

/* --------------------------- estimate tuning ---------------------------- */

/** Smallest deck job worth quoting. */
const MIN_JOB_USD = 4500;
/** +/- spread applied to the midpoint to produce the shown range. */
const RANGE_SPREAD = 0.15;

export type EstimateRange = { low: number; high: number };

/** Turn deck area (sq ft) + elevation + material into the shown $ range. */
export function estimateDeckRange(
  areaSqFt: number,
  elevationFactor: number,
  material: DeckMaterial
): EstimateRange | null {
  if (material.pricePerSqFt == null) return null;
  const midpoint = Math.max(
    areaSqFt * material.pricePerSqFt * elevationFactor,
    MIN_JOB_USD
  );
  return {
    low: roundTo(midpoint * (1 - RANGE_SPREAD), 500),
    high: roundTo(midpoint * (1 + RANGE_SPREAD), 500),
  };
}

function roundTo(n: number, step: number) {
  return Math.round(n / step) * step;
}

export function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}
