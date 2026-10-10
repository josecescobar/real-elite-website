import { describe, it, expect } from 'vitest';
import { CITY_DATA, SERVICE_AREA_CATALOG } from '@/lib/constants';
import { CONTENT } from '@/lib/service-city-content';

/**
 * Customer-facing copy must never carry research-note voice: references to
 * "this page", sourcing language ("the county page lists"), data-source jargon
 * (CDP, centroid, ACS) or notes about what was or was not retrieved.
 */
const LEAK_PATTERN =
  /this page|own pages?|county page|permits page|census-designated|\bCDP\b|centroid|\bACS\b|HTTP \d{3}|retrieved|unverified|listed here|research/i;

function collectStrings(value: unknown, path: string, out: Array<[string, string]>): void {
  if (typeof value === 'string') {
    out.push([path, value]);
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => collectStrings(v, `${path}[${i}]`, out));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) collectStrings(v, `${path}.${k}`, out);
  }
}

function leaksIn(label: string, data: unknown): string[] {
  const strings: Array<[string, string]> = [];
  collectStrings(data, label, strings);
  const hits: string[] = [];
  for (const [path, text] of strings) {
    const m = text.match(LEAK_PATTERN);
    if (m) {
      const at = m.index ?? 0;
      hits.push(`${path}: "...${text.slice(Math.max(0, at - 40), at + 60)}..." (matched "${m[0]}")`);
    }
  }
  return hits;
}

describe('customer-facing copy has no research-note leaks', () => {
  it('CITY_DATA town content (descriptions, neighborhoods, FAQs, SEO fields)', () => {
    const hits = leaksIn('CITY_DATA', CITY_DATA);
    expect(hits, `Leaked research language:\n${hits.join('\n')}`).toEqual([]);
  });

  it('SERVICE_AREA_CATALOG strings', () => {
    const hits = leaksIn('SERVICE_AREA_CATALOG', SERVICE_AREA_CATALOG);
    expect(hits, `Leaked research language:\n${hits.join('\n')}`).toEqual([]);
  });

  it('service-city-content CONTENT entries', () => {
    const hits = leaksIn('CONTENT', CONTENT);
    expect(hits, `Leaked research language:\n${hits.join('\n')}`).toEqual([]);
  });
});
