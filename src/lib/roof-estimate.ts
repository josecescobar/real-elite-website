/**
 * Instant Roof Quote — pricing + estimate math.
 *
 * ===========================================================================
 *  EDIT YOUR PRICES HERE.
 *
 *  `pricePerSquare` is the ALL-IN installed price for one roofing square
 *  (1 square = 100 sq ft of roof) — material + labor + tear-off + disposal
 *  + permit + overhead + your margin, baked into one number.
 *
 *  It is NOT the Home Depot price of a bundle of shingles. Material is only
 *  ~30-40% of a roof job; labor and everything else is the rest. Revisit
 *  these numbers every few months as your costs move.
 *
 *  The numbers below are placeholder regional figures for 2026 — adjust to
 *  your real rates.
 * ===========================================================================
 */

export type MaterialSlug = 'architectural' | 'designer' | 'metal' | 'other';

export type RoofMaterial = {
  slug: MaterialSlug;
  label: string;
  tagline: string;
  blurb: string;
  /** All-in installed $ per roofing square. `null` = priced manually (no auto quote). */
  pricePerSquare: number | null;
  recommended?: boolean;
};

export const ROOF_MATERIALS: RoofMaterial[] = [
  {
    slug: 'architectural',
    label: 'Architectural Shingles',
    tagline: 'Most popular',
    blurb:
      'Dimensional asphalt shingles — 25-30 year life, rated for 110-130 mph wind. The choice on roughly 8 of every 10 homes.',
    pricePerSquare: 650,
    recommended: true,
  },
  {
    slug: 'designer',
    label: 'Designer / Luxury Shingles',
    tagline: 'Premium look',
    blurb:
      'Slate- and cedar-shake-look luxury shingles with the longest manufacturer warranties — 30-50 year life.',
    pricePerSquare: 950,
  },
  {
    slug: 'metal',
    label: 'Standing-Seam Metal',
    tagline: 'Longest lasting',
    blurb:
      'Concealed-fastener metal roofing — 40-70 year life, premium curb appeal, excellent in snow and high wind.',
    pricePerSquare: 1200,
  },
  {
    slug: 'other',
    label: 'Other / Not sure yet',
    tagline: "We'll help you choose",
    blurb:
      "Cedar shake, tile, flat/TPO roofing, or still deciding? Tell us what you're thinking and we'll price it with you personally.",
    pricePerSquare: null,
  },
];

export function getMaterial(slug: string): RoofMaterial | undefined {
  return ROOF_MATERIALS.find((m) => m.slug === slug);
}

/* --------------------------- estimate tuning ---------------------------- */

/** Smallest roof job worth quoting — keeps a tiny roof from showing a silly low number. */
const MIN_JOB_USD = 6000;
/** +/- spread applied to the midpoint to produce the shown range. */
const RANGE_SPREAD = 0.15;
/** Waste / starter / ridge-cap allowance added on top of measured roof area. */
const WASTE_FACTOR = 1.1;

export type EstimateRange = { low: number; high: number };

/** Turn a roof size (in squares) + chosen material into the shown $ range. */
export function estimateRange(squares: number, material: RoofMaterial): EstimateRange | null {
  if (material.pricePerSquare == null) return null;
  const midpoint = Math.max(squares * material.pricePerSquare, MIN_JOB_USD);
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

/* ----------------- auto-measured roof area (Solar API) ------------------ */

const SQ_METERS_TO_SQ_FEET = 10.7639;

/** Convert a roof surface area (m^2, from the Google Solar API) into roofing squares. */
export function squaresFromAreaMeters2(areaMeters2: number): number {
  const sqFeet = areaMeters2 * SQ_METERS_TO_SQ_FEET;
  return (sqFeet * WASTE_FACTOR) / 100;
}

/* ------------------- fallback: a few quick questions -------------------- */
/*  Used when an address has no Solar API coverage (some rural homes).      */

export const HOME_SIZE_OPTIONS = [
  { value: 'small', label: 'Under 1,500 sq ft', livingSqFt: 1250 },
  { value: 'medium', label: '1,500 - 2,500 sq ft', livingSqFt: 2000 },
  { value: 'large', label: '2,500 - 3,500 sq ft', livingSqFt: 3000 },
  { value: 'xlarge', label: 'Over 3,500 sq ft', livingSqFt: 4000 },
] as const;

export const STORIES_OPTIONS = [
  { value: '1', label: '1 story', divisor: 1 },
  { value: '1.5', label: '1.5 stories', divisor: 1.5 },
  { value: '2', label: '2 stories', divisor: 2 },
  { value: '3', label: '3+ stories', divisor: 3 },
] as const;

export const COMPLEXITY_OPTIONS = [
  { value: 'simple', label: 'Simple', hint: 'Mostly one gable, few angles', factor: 1.25 },
  { value: 'moderate', label: 'Moderate', hint: 'Some hips, valleys or dormers', factor: 1.4 },
  { value: 'complex', label: 'Complex', hint: 'Many angles, steep, lots of dormers', factor: 1.6 },
] as const;

export type FallbackAnswers = {
  homeSize: (typeof HOME_SIZE_OPTIONS)[number]['value'] | '';
  stories: (typeof STORIES_OPTIONS)[number]['value'] | '';
  complexity: (typeof COMPLEXITY_OPTIONS)[number]['value'] | '';
};

/** Estimate roofing squares from the quick-question answers. */
export function squaresFromAnswers(a: FallbackAnswers): number | null {
  const size = HOME_SIZE_OPTIONS.find((o) => o.value === a.homeSize);
  const stories = STORIES_OPTIONS.find((o) => o.value === a.stories);
  const complexity = COMPLEXITY_OPTIONS.find((o) => o.value === a.complexity);
  if (!size || !stories || !complexity) return null;
  const footprint = size.livingSqFt / stories.divisor;
  const roofSurface = footprint * complexity.factor;
  return roofSurface / 100;
}
