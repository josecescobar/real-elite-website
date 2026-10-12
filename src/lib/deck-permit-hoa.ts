/**
 * Deck permit + HOA copy for a county that already has a permit guide.
 *
 * Every sentence beyond the HOA check is copied from that guide, and plat or
 * footing lines are included only when the guide states them with a citation.
 * A town with no guide gets nothing.
 */
import { getServiceArea } from '@/lib/constants';
import {
  PERMIT_GUIDES,
  permitGuidePath,
  type CountyPermitGuide,
} from '@/lib/permit-guides';

const PLAT_RE = /\bplat\b|plot plan/i;
const FOOTING_RE = /\bfootings?\b/i;

const HOA_CHECK = 'Check HOA or architectural approval alongside the county permit.';

export type DeckPermitHoaBlock = {
  guideSlug: string;
  county: string;
  guideHref: string;
  hoaText: string;
  platText: string | null;
  footingText: string | null;
};

const guideByArea = new Map<string, CountyPermitGuide>();
for (const guide of PERMIT_GUIDES) {
  if (!guideByArea.has(guide.slug)) guideByArea.set(guide.slug, guide);
  for (const areaSlug of guide.areaSlugs) {
    if (!guideByArea.has(areaSlug)) guideByArea.set(areaSlug, guide);
  }
}

/** Town, county hub, or parent chain → the permit guide that lists it. */
export function permitGuideForArea(areaSlug: string): CountyPermitGuide | null {
  const seen = new Set<string>();
  let current: string | undefined = areaSlug;
  while (current && !seen.has(current)) {
    seen.add(current);
    const guide = guideByArea.get(current);
    if (guide) return guide;
    current = getServiceArea(current)?.parent;
  }
  return null;
}

function citedSiteLines(guide: CountyPermitGuide): string[] {
  const lines: string[] = [];
  const deck = guide.jobs.find((job) => job.service === 'decks');
  if (deck && deck.sources.length > 0) lines.push(deck.summary);
  for (const step of guide.steps) {
    if (step.sources.length === 0) continue;
    if (PLAT_RE.test(step.text) || FOOTING_RE.test(step.text)) lines.push(step.text);
  }
  return lines;
}

export function deckPermitHoaForGuide(guide: CountyPermitGuide): DeckPermitHoaBlock {
  const lines = citedSiteLines(guide);
  const platText = lines.find((line) => PLAT_RE.test(line)) ?? null;
  const footingText = lines.find((line) => FOOTING_RE.test(line) && line !== platText) ?? null;
  const hoaText = guide.hoa.sources.length > 0 ? guide.hoa.text : HOA_CHECK;
  return {
    guideSlug: guide.slug,
    county: guide.county,
    guideHref: permitGuidePath(guide.slug),
    hoaText,
    platText,
    footingText,
  };
}

export function deckPermitHoaForCity(citySlug: string): DeckPermitHoaBlock | null {
  const guide = permitGuideForArea(citySlug);
  return guide ? deckPermitHoaForGuide(guide) : null;
}

export function deckPermitHoaBlocks(): DeckPermitHoaBlock[] {
  return PERMIT_GUIDES.map(deckPermitHoaForGuide);
}

export function deckPermitHoaPlainText(block: DeckPermitHoaBlock): string {
  return [block.hoaText, block.county, block.platText, block.footingText].filter(Boolean).join(' ');
}
