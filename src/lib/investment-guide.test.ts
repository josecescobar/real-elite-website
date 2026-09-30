import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import {
  INVESTMENT_GUIDE,
  INVESTMENT_DISCLAIMER,
  LOUDOUN_COST_FACTORS,
  INVESTMENT_FAQ,
} from './investment-guide';
import { CONSULTATION_PROJECT_TYPES } from './cta-intent';
import { SERVICES, servicePillarHref } from './constants';
import { claimsFoundIn } from './claims';

describe('investment guide', () => {
  it('links every category to a live service pillar and a real consultation type', () => {
    const pillars = new Set(SERVICES.map((s) => servicePillarHref(s.slug)));
    const types = new Set(CONSULTATION_PROJECT_TYPES.map((t) => t.value));
    for (const cat of INVESTMENT_GUIDE) {
      expect(pillars.has(cat.href), `${cat.slug} → ${cat.href}`).toBe(true);
      expect(types.has(cat.consultationType), `${cat.slug} consultation type`).toBe(true);
      if (cat.image) {
        expect(fs.existsSync(`public${cat.image.src}`), `${cat.slug} image ${cat.image.src}`).toBe(true);
      }
    }
  });

  it('labels the numbers as typical ranges, never as quotes or minimums', () => {
    expect(INVESTMENT_DISCLAIMER).toMatch(/not quotes/i);
    const allCopy = JSON.stringify(INVESTMENT_GUIDE);
    expect(allCopy).not.toMatch(/minimum project/i);
    expect(allCopy).not.toMatch(/we (don't|do not) take/i);
  });

  it('uses unique slugs with a from-figure or an explicit scoped-after-design label', () => {
    const slugs = INVESTMENT_GUIDE.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const cat of INVESTMENT_GUIDE) {
      if (cat.from === null) expect(cat.typical).toMatch(/scoped/i);
      else expect(cat.from).toMatch(/^\$\d+K$/);
      expect(cat.tiers.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('publishes no unconfirmed operational claim', () => {
    // The guide is a new surface; the claims register must not spread to it.
    const text = [
      JSON.stringify(INVESTMENT_GUIDE),
      JSON.stringify(LOUDOUN_COST_FACTORS),
      JSON.stringify(INVESTMENT_FAQ),
      INVESTMENT_DISCLAIMER,
    ].join('\n');
    const found = claimsFoundIn(text).filter((c) => c.status === 'unconfirmed');
    expect(found.map((c) => c.id)).toEqual([]);
  });
});
