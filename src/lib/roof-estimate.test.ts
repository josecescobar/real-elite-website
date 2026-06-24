import { describe, it, expect } from 'vitest';
import {
  ROOF_MATERIALS,
  getMaterial,
  estimateRange,
  formatUsd,
  squaresFromAreaMeters2,
  squaresFromAnswers,
  HOME_SIZE_OPTIONS,
  STORIES_OPTIONS,
  COMPLEXITY_OPTIONS,
} from '@/lib/roof-estimate';

describe('ROOF_MATERIALS catalog', () => {
  it('has unique slugs', () => {
    const slugs = ROOF_MATERIALS.map((m) => m.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('exposes exactly one recommended material', () => {
    expect(ROOF_MATERIALS.filter((m) => m.recommended)).toHaveLength(1);
  });

  it('prices every material except the "other" catch-all', () => {
    for (const m of ROOF_MATERIALS) {
      if (m.slug === 'other') {
        expect(m.pricePerSquare).toBeNull();
      } else {
        expect(typeof m.pricePerSquare).toBe('number');
        expect(m.pricePerSquare!).toBeGreaterThan(0);
      }
    }
  });
});

describe('getMaterial', () => {
  it('returns the matching material', () => {
    expect(getMaterial('metal')?.label).toBe('Standing-Seam Metal');
  });

  it('returns undefined for an unknown slug', () => {
    expect(getMaterial('slate')).toBeUndefined();
  });
});

describe('estimateRange', () => {
  const architectural = getMaterial('architectural')!; // $650/sq

  it('returns null when the material is priced manually', () => {
    expect(estimateRange(20, getMaterial('other')!)).toBeNull();
  });

  it('builds a ±15% range rounded to the nearest $500', () => {
    // 20 sq × $650 = $13,000 midpoint
    expect(estimateRange(20, architectural)).toEqual({ low: 11000, high: 15000 });
  });

  it('clamps tiny roofs to the $6,000 minimum job', () => {
    // 5 sq × $650 = $3,250 → below the floor, so midpoint = $6,000
    expect(estimateRange(5, architectural)).toEqual({ low: 5000, high: 7000 });
  });

  it('low is always below high and both are positive', () => {
    const r = estimateRange(30, getMaterial('designer')!)!;
    expect(r.low).toBeLessThan(r.high);
    expect(r.low).toBeGreaterThan(0);
  });
});

describe('formatUsd', () => {
  it('formats whole dollars with no cents', () => {
    expect(formatUsd(13000)).toBe('$13,000');
  });
});

describe('squaresFromAreaMeters2', () => {
  it('converts m² to roofing squares including the waste factor', () => {
    // 100 m² → 1076.39 sq ft × 1.1 waste / 100 ≈ 11.84 squares
    expect(squaresFromAreaMeters2(100)).toBeCloseTo(11.84, 2);
  });

  it('scales linearly with area', () => {
    expect(squaresFromAreaMeters2(200)).toBeCloseTo(squaresFromAreaMeters2(100) * 2, 5);
  });
});

describe('squaresFromAnswers', () => {
  it('estimates squares from a full set of answers', () => {
    // medium (2000 sq ft) ÷ 2 stories × 1.4 moderate / 100 = 14 squares
    expect(squaresFromAnswers({ homeSize: 'medium', stories: '2', complexity: 'moderate' })).toBe(
      14
    );
  });

  it('returns null when any answer is missing', () => {
    expect(squaresFromAnswers({ homeSize: 'medium', stories: '', complexity: 'moderate' })).toBeNull();
    expect(squaresFromAnswers({ homeSize: '', stories: '2', complexity: 'moderate' })).toBeNull();
    expect(squaresFromAnswers({ homeSize: 'medium', stories: '2', complexity: '' })).toBeNull();
  });

  it('returns null for an unrecognized option value', () => {
    expect(
      squaresFromAnswers({
        homeSize: 'mansion' as never,
        stories: '2',
        complexity: 'moderate',
      })
    ).toBeNull();
  });

  it('more complex roofs estimate more squares than simpler ones', () => {
    const simple = squaresFromAnswers({ homeSize: 'large', stories: '2', complexity: 'simple' })!;
    const complex = squaresFromAnswers({ homeSize: 'large', stories: '2', complexity: 'complex' })!;
    expect(complex).toBeGreaterThan(simple);
  });
});

describe('fallback option tables', () => {
  it('have unique values within each table', () => {
    for (const table of [HOME_SIZE_OPTIONS, STORIES_OPTIONS, COMPLEXITY_OPTIONS]) {
      const values = table.map((o) => o.value);
      expect(new Set(values).size).toBe(values.length);
    }
  });
});
