import { describe, it, expect } from 'vitest';
import {
  PAVING_SERVICES,
  PAVING_LOCATIONS,
  PAVING_ICONS,
  PAVING_SERVICE_SLUGS,
  PAVING_LOCATION_SLUGS,
  getPavingService,
  getPavingLocation,
} from '@/lib/paving-data';

const LOCATION_SLUGS = new Set(PAVING_LOCATION_SLUGS);

describe('PAVING_SERVICES', () => {
  it('has unique slugs', () => {
    expect(new Set(PAVING_SERVICE_SLUGS).size).toBe(PAVING_SERVICE_SLUGS.length);
  });

  it('references an icon key that exists in PAVING_ICONS', () => {
    for (const s of PAVING_SERVICES) {
      expect(PAVING_ICONS[s.iconKey], `${s.slug} → unknown icon "${s.iconKey}"`).toBeDefined();
    }
  });

  it('gives every service the SEO + template fields the generated page needs', () => {
    for (const s of PAVING_SERVICES) {
      expect(s.name.trim().length, s.slug).toBeGreaterThan(0);
      expect(s.navLabel.trim().length, s.slug).toBeGreaterThan(0);
      expect(s.metaTitle.trim().length, s.slug).toBeGreaterThan(0);
      expect(s.metaDescription.trim().length, s.slug).toBeGreaterThan(0);
      expect(s.keywords.length, s.slug).toBeGreaterThan(0);
      expect(s.hero.line1.trim().length, s.slug).toBeGreaterThan(0);
      expect(s.intro.length, s.slug).toBeGreaterThan(0);
      expect(s.whatsIncluded.length, s.slug).toBeGreaterThan(0);
      expect(s.process.length, s.slug).toBeGreaterThan(0);
      expect(s.signals.length, s.slug).toBeGreaterThan(0);
      expect(s.investment.range.trim().length, s.slug).toBeGreaterThan(0);
      expect(s.faqs.length, s.slug).toBeGreaterThan(0);
    }
  });

  it('gives every FAQ a non-empty question and answer', () => {
    for (const s of PAVING_SERVICES) {
      for (const faq of s.faqs) {
        expect(faq.question.trim().length, s.slug).toBeGreaterThan(0);
        expect(faq.answer.trim().length, s.slug).toBeGreaterThan(0);
      }
    }
  });
});

describe('PAVING_LOCATIONS', () => {
  it('has unique slugs', () => {
    expect(new Set(PAVING_LOCATION_SLUGS).size).toBe(PAVING_LOCATION_SLUGS.length);
  });

  it('uses only supported states', () => {
    for (const l of PAVING_LOCATIONS) {
      expect(['WV', 'MD', 'VA'], `${l.slug} has state ${l.state}`).toContain(l.state);
    }
  });

  it('lists at least one ZIP and complete SEO fields per location', () => {
    for (const l of PAVING_LOCATIONS) {
      expect(l.city.trim().length, l.slug).toBeGreaterThan(0);
      expect(l.county.trim().length, l.slug).toBeGreaterThan(0);
      expect(l.zips.length, l.slug).toBeGreaterThan(0);
      expect(l.metaTitle.trim().length, l.slug).toBeGreaterThan(0);
      expect(l.metaDescription.trim().length, l.slug).toBeGreaterThan(0);
      expect(l.intro.length, l.slug).toBeGreaterThan(0);
    }
  });

  it('only links "nearby" locations that are real location slugs', () => {
    for (const l of PAVING_LOCATIONS) {
      for (const near of l.nearby) {
        expect(LOCATION_SLUGS.has(near), `${l.slug} → unknown nearby "${near}"`).toBe(true);
      }
    }
  });

  it('never lists itself as a nearby location', () => {
    for (const l of PAVING_LOCATIONS) {
      expect(l.nearby, l.slug).not.toContain(l.slug);
    }
  });
});

describe('lookup helpers', () => {
  it('getPavingService resolves a known slug and returns undefined otherwise', () => {
    expect(getPavingService(PAVING_SERVICES[0].slug)?.slug).toBe(PAVING_SERVICES[0].slug);
    expect(getPavingService('no-such-service')).toBeUndefined();
  });

  it('getPavingLocation resolves a known slug and returns undefined otherwise', () => {
    expect(getPavingLocation(PAVING_LOCATIONS[0].slug)?.slug).toBe(PAVING_LOCATIONS[0].slug);
    expect(getPavingLocation('no-such-location')).toBeUndefined();
  });
});
