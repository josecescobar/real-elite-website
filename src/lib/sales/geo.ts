/**
 * Service-area scoring for inbound leads. ZIP prefixes are the public
 * USPS ranges for markets the site already lists — not a licensed-area
 * legal opinion. Out-of-prefix work escalates to Jose.
 */

export type GeoTier = 'core' | 'primary' | 'adjacent' | 'out_of_area';

export type GeoVerdict = {
  tier: GeoTier;
  city?: string;
  state?: string;
  travelPenalty: boolean;
};

const CORE_ZIPS: Record<string, { city: string; state: string }> = {
  // Eastern Panhandle WV
  '25401': { city: 'Martinsburg', state: 'WV' },
  '25402': { city: 'Martinsburg', state: 'WV' },
  '25403': { city: 'Martinsburg', state: 'WV' },
  '25404': { city: 'Martinsburg', state: 'WV' },
  '25405': { city: 'Martinsburg', state: 'WV' },
  '25413': { city: 'Inwood', state: 'WV' },
  '25414': { city: 'Charles Town', state: 'WV' },
  '25427': { city: 'Hedgesville', state: 'WV' },
  '25430': { city: 'Kearneysville', state: 'WV' },
  '25438': { city: 'Ranson', state: 'WV' },
  '25443': { city: 'Shepherdstown', state: 'WV' },
  '25411': { city: 'Berkeley Springs', state: 'WV' },
  '25419': { city: 'Falling Waters', state: 'WV' },
  '25420': { city: 'Gerrardstown', state: 'WV' },
};

const PRIMARY_PREFIXES: Record<string, { state: string; label: string }> = {
  '254': { state: 'WV', label: 'Eastern Panhandle WV' },
  '226': { state: 'VA', label: 'Winchester VA' },
  '201': { state: 'VA', label: 'Loudoun / Northern VA' },
  '221': { state: 'VA', label: 'Northern VA' },
  '220': { state: 'VA', label: 'Northern VA' },
  '223': { state: 'VA', label: 'Alexandria VA' },
  '217': { state: 'MD', label: 'Frederick / Hagerstown MD' },
};

const ADJACENT_PREFIXES = new Set(['206', '208', '209', '210', '215', '260', '267', '268']);

const CITY_HINTS: Array<{ match: RegExp; city: string; state: string; tier: GeoTier }> = [
  { match: /martinsburg/i, city: 'Martinsburg', state: 'WV', tier: 'core' },
  { match: /inwood/i, city: 'Inwood', state: 'WV', tier: 'core' },
  { match: /charles town/i, city: 'Charles Town', state: 'WV', tier: 'core' },
  { match: /ranson/i, city: 'Ranson', state: 'WV', tier: 'core' },
  { match: /hedgesville/i, city: 'Hedgesville', state: 'WV', tier: 'core' },
  { match: /shepherdstown/i, city: 'Shepherdstown', state: 'WV', tier: 'core' },
  { match: /leesburg/i, city: 'Leesburg', state: 'VA', tier: 'primary' },
  { match: /ashburn/i, city: 'Ashburn', state: 'VA', tier: 'primary' },
  { match: /loudoun/i, city: 'Loudoun County', state: 'VA', tier: 'primary' },
  { match: /mclean|mc lean/i, city: 'McLean', state: 'VA', tier: 'primary' },
  { match: /great falls/i, city: 'Great Falls', state: 'VA', tier: 'primary' },
  { match: /reston/i, city: 'Reston', state: 'VA', tier: 'primary' },
  { match: /vienna/i, city: 'Vienna', state: 'VA', tier: 'primary' },
  { match: /alexandria/i, city: 'Alexandria', state: 'VA', tier: 'primary' },
  { match: /winchester/i, city: 'Winchester', state: 'VA', tier: 'primary' },
  { match: /frederick/i, city: 'Frederick', state: 'MD', tier: 'primary' },
  { match: /hagerstown/i, city: 'Hagerstown', state: 'MD', tier: 'primary' },
];

export function normalizeZip(zip: string | null | undefined): string | null {
  if (!zip) return null;
  const digits = zip.replace(/\D/g, '');
  if (digits.length < 5) return null;
  return digits.slice(0, 5);
}

export function classifyGeo(input: {
  zip?: string | null;
  city?: string | null;
  state?: string | null;
}): GeoVerdict {
  const zip = normalizeZip(input.zip);
  if (zip && CORE_ZIPS[zip]) {
    return { tier: 'core', ...CORE_ZIPS[zip], travelPenalty: false };
  }
  if (zip) {
    const prefix = zip.slice(0, 3);
    const primary = PRIMARY_PREFIXES[prefix];
    if (primary) {
      return { tier: 'primary', state: primary.state, travelPenalty: false };
    }
    if (ADJACENT_PREFIXES.has(prefix)) {
      return { tier: 'adjacent', travelPenalty: true };
    }
  }

  const haystack = `${input.city ?? ''} ${input.state ?? ''}`;
  for (const hint of CITY_HINTS) {
    if (hint.match.test(haystack)) {
      return {
        tier: hint.tier,
        city: hint.city,
        state: hint.state,
        travelPenalty: hint.tier === 'adjacent',
      };
    }
  }

  const state = (input.state ?? '').toUpperCase();
  if (state === 'WV' || state === 'VA' || state === 'MD') {
    return { tier: 'adjacent', state, travelPenalty: true };
  }

  return { tier: 'out_of_area', travelPenalty: true };
}
