import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { CITY_DATA } from '@/lib/constants';
import { REVIEWS } from '@/lib/reviews';
import {
  FAIRFAX_BASEMENT_DETAILS_URL,
  FAIRFAX_BASEMENT_SHEET_NOTES,
  LUXURY_TOWN_SLUGS,
  TOWN_DECK_HOA,
  remodelReviewsForTown,
} from '@/lib/luxury-town-round16';

const FORBIDDEN = /trex|timbertech|azek|warranty|certified|guarantee|license number/i;

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 40);
}

describe('luxury town round 16', () => {
  it('names the Wolf Trap side of Vienna ZIP 22182 in the area copy', () => {
    const vienna = CITY_DATA['vienna-va'];
    expect(vienna?.description).toMatch(/22182/);
    expect(vienna?.description).toMatch(/Wolf Trap/);
    expect(vienna?.neighborhoods).toContain('Wolf Trap');
  });

  it('gives each of the five towns a distinct deck step, HOA step, and permit-guide link', () => {
    expect(TOWN_DECK_HOA.map((block) => block.citySlug).sort()).toEqual([...LUXURY_TOWN_SLUGS].sort());
    const permit = TOWN_DECK_HOA.map((block) => block.permitStep);
    const hoa = TOWN_DECK_HOA.map((block) => block.hoaStep);
    expect(new Set(permit).size).toBe(5);
    expect(new Set(hoa).size).toBe(5);
    for (const block of TOWN_DECK_HOA) {
      expect(block.permitStep, block.citySlug).not.toMatch(FORBIDDEN);
      expect(block.hoaStep, block.citySlug).toMatch(/alongside the county permit/i);
      expect(block.hoaStep, block.citySlug).toMatch(/submit both/i);
      expect(block.guideHref.startsWith('/permit-guides/')).toBe(true);
    }
    expect(TOWN_DECK_HOA.find((block) => block.citySlug === 'potomac-md')?.guideHref).toBe(
      '/permit-guides/montgomery-county-md',
    );
    expect(TOWN_DECK_HOA.find((block) => block.citySlug === 'vienna-va')?.permitStep).toMatch(
      /town zoning/i,
    );
    expect(TOWN_DECK_HOA.find((block) => block.citySlug === 'vienna-va')?.permitStep).toMatch(
      /building official/i,
    );
    expect(TOWN_DECK_HOA.find((block) => block.citySlug === 'fairfax-station-va')?.permitStep).toMatch(
      /Clifton/,
    );
  });

  it('links the county basement sheet on Fairfax Station and each Fairfax County basement page', () => {
    const serviceTowns = [
      'mclean-va',
      'vienna-va',
      'great-falls-va',
      'reston-va',
      'dunn-loring-va',
      'fairfax-station-va',
      'oakton-va',
      'clifton-va',
      'fort-hunt-va',
      'annandale-va',
      'springfield-va',
      'falls-church-va',
    ];
    expect(FAIRFAX_BASEMENT_DETAILS_URL).toBe(
      'https://www.fairfaxcounty.gov/landdevelopment/sites/landdevelopment/files/Assets/Documents/PDF/publications/basement-details.pdf',
    );
    const stationTown = FAIRFAX_BASEMENT_SHEET_NOTES.find(
      (note) => note.citySlug === 'fairfax-station-va' && note.surface === 'town',
    );
    expect(stationTown?.href).toBe(FAIRFAX_BASEMENT_DETAILS_URL);
    expect(stationTown?.body).toMatch(/kitchen, wet bar, or bedroom/i);
    expect(stationTown?.body).toMatch(/on the job site/i);
    expect(stationTown?.body).toMatch(/Real Elite submits the plan/);
    expect(stationTown?.body).toMatch(/Real Elite reads the sheet/);
    for (const city of serviceTowns) {
      const note = FAIRFAX_BASEMENT_SHEET_NOTES.find(
        (row) => row.citySlug === city && row.surface === 'service',
      );
      expect(note?.href, city).toBe(FAIRFAX_BASEMENT_DETAILS_URL);
      expect(note?.body, city).toMatch(/kitchen, wet bar, or bedroom/i);
      expect(note?.body, city).toMatch(/on the job site/i);
      expect(note?.body, city).toMatch(/Real Elite submits the plan/);
      expect(note?.body, city).toMatch(/Real Elite reads the sheet/);
      expect(note?.body, city).toMatch(/county staff approval/i);
    }
    const fallsChurch = FAIRFAX_BASEMENT_SHEET_NOTES.find(
      (note) => note.citySlug === 'falls-church-va' && note.surface === 'service',
    );
    expect(fallsChurch?.body).toMatch(/parcel is in Fairfax County/);
    expect(fallsChurch?.body).toMatch(/City of Falls Church stays on the city permit path/);
    expect(fallsChurch?.body).toMatch(/not this county sheet/);
    const bodies = FAIRFAX_BASEMENT_SHEET_NOTES.map((note) => note.body);
    expect(new Set(bodies).size).toBe(bodies.length);
  });

  it('shows remodel quotes only, and none when the corpus has no remodel review', () => {
    for (const slug of LUXURY_TOWN_SLUGS) {
      const selected = remodelReviewsForTown(slug, REVIEWS);
      expect(selected.every((review) => review.serviceSlug !== 'roofing')).toBe(true);
      expect(selected.some((review) => /\broof\b/i.test(review.quote))).toBe(false);
      expect(selected.map((review) => review.id)).toEqual([]);
    }
    const elsewhere = remodelReviewsForTown('martinsburg-wv', REVIEWS);
    expect(elsewhere.map((review) => review.id)).toEqual(REVIEWS.map((review) => review.id));
  });

  it('does not repeat a new sentence already in src', () => {
    const root = path.resolve(__dirname, '../..');
    const own = readFileSync(path.join(root, 'src/lib/luxury-town-round16.ts'), 'utf8');
    const vienna = CITY_DATA['vienna-va']?.description ?? '';
    const fresh = [...sentences(own), ...sentences(vienna)];
    const haystack = ['src/lib/constants.ts', 'src/lib/service-city-content.ts', 'src/lib/permit-guides.ts', 'src/lib/services-data.ts']
      .map((file) => readFileSync(path.join(root, file), 'utf8'))
      .join('\n');
    const viennaOnly = sentences(vienna).filter((sentence) => sentence.includes('Wolf Trap'));
    for (const sentence of [...sentences(own), ...viennaOnly]) {
      const hits = haystack.split(sentence).length - 1;
      expect(hits, sentence).toBeLessThanOrEqual(sentence.includes('Wolf Trap') ? 1 : 0);
    }
    expect(new Set(fresh).size).toBe(fresh.length);
  });
});
