/**
 * SEO round 16 copy for five luxury town pages.
 *
 * Deck steps paraphrase the permit guides already in permit-guides.ts.
 * They are not copied sentences. Reviews are filtered from the published
 * corpus only. A town with no kitchen, bath, basement, or deck review
 * shows no quote.
 */
import type { Review } from '@/lib/reviews/types';
import { permitGuidePath } from '@/lib/permit-guides';

export const LUXURY_TOWN_SLUGS = [
  'potomac-md',
  'mclean-va',
  'great-falls-va',
  'vienna-va',
  'fairfax-station-va',
] as const;

export type LuxuryTownSlug = (typeof LUXURY_TOWN_SLUGS)[number];

const REMODEL_SERVICES = new Set(['kitchens', 'bathrooms', 'basements', 'decks']);

export function isLuxuryTown(citySlug: string): citySlug is LuxuryTownSlug {
  return (LUXURY_TOWN_SLUGS as readonly string[]).includes(citySlug);
}

/**
 * Town-page quotes for the five luxury pages. Other towns keep the
 * caller’s list. These five keep a published kitchen, bath, basement,
 * or deck review and drop everything else, including a roof quote.
 */
export function remodelReviewsForTown(citySlug: string, reviews: readonly Review[]): Review[] {
  if (!isLuxuryTown(citySlug)) return [...reviews];
  return reviews.filter(
    (review) =>
      Boolean(review.serviceSlug) &&
      REMODEL_SERVICES.has(review.serviceSlug as string) &&
      !/\broofs?\b/i.test(review.quote),
  );
}

export type TownDeckHoa = {
  citySlug: LuxuryTownSlug;
  permitStep: string;
  hoaStep: string;
  guideHref: string;
  guideLabel: string;
};

const FAIRFAX_GUIDE = permitGuidePath('fairfax-county-va');
const MONTGOMERY_GUIDE = permitGuidePath('montgomery-county-md');

export const TOWN_DECK_HOA: readonly TownDeckHoa[] = [
  {
    citySlug: 'mclean-va',
    permitStep:
      'A McLean deck, including a change to a deck already standing, is a Fairfax County Land Development Services building permit. McLean has no town zoning counter ahead of that filing.',
    hoaStep:
      'On a McLean street that has an association, HOA architectural review runs alongside the county permit. Submit both.',
    guideHref: FAIRFAX_GUIDE,
    guideLabel: 'Fairfax County permit guide for McLean',
  },
  {
    citySlug: 'great-falls-va',
    permitStep:
      'Great Falls decks are filed with Fairfax County Land Development Services. The community is unincorporated, so that county office is the building official.',
    hoaStep:
      'Where a Great Falls lot has an association, HOA architectural review runs alongside the county permit. Submit both filings together.',
    guideHref: FAIRFAX_GUIDE,
    guideLabel: 'Fairfax County permit guide for Great Falls',
  },
  {
    citySlug: 'vienna-va',
    permitStep:
      'Inside the Town of Vienna, a deck goes through town zoning review while Fairfax County Land Development Services remains the building official. A Vienna mailing address on the county side of the line does not take the town zoning step.',
    hoaStep:
      'For a Vienna deck, HOA architectural review runs alongside the county permit. Submit both, including when the town zoning step also applies.',
    guideHref: FAIRFAX_GUIDE,
    guideLabel: 'Fairfax County permit guide for Vienna',
  },
  {
    citySlug: 'fairfax-station-va',
    permitStep:
      'A Fairfax Station deck follows the parcel. Outside the Town of Clifton, Fairfax County Land Development Services takes the building permit. Inside Clifton, the town use permit and Architectural Review Board certificate come before the county issues that permit.',
    hoaStep:
      'When a Fairfax Station subdivision has an association, HOA architectural review runs alongside the county permit, so submit both in the same pass. The Clifton town step is not a substitute for that association review.',
    guideHref: FAIRFAX_GUIDE,
    guideLabel: 'Fairfax County permit guide for Fairfax Station',
  },
  {
    citySlug: 'potomac-md',
    permitStep:
      'A Potomac deck is a Montgomery County Department of Permitting Services building permit. Potomac is not a municipality that issues its own building permit.',
    hoaStep:
      'In Potomac, HOA architectural review runs alongside the county permit. Submit both the association request and the county application.',
    guideHref: MONTGOMERY_GUIDE,
    guideLabel: 'Montgomery County permit guide for Potomac',
  },
];

export function townDeckHoa(citySlug: string): TownDeckHoa | null {
  return TOWN_DECK_HOA.find((block) => block.citySlug === citySlug) ?? null;
}

/** Canonical href from the county plan-ahead page, Typical Finished Basement Details 2021. */
export const FAIRFAX_BASEMENT_DETAILS_URL =
  'https://www.fairfaxcounty.gov/landdevelopment/sites/landdevelopment/files/Assets/Documents/PDF/publications/basement-details.pdf';

export type BasementSheetNote = {
  citySlug: string;
  surface: 'town' | 'service';
  heading: string;
  body: string;
  href: string;
  linkLabel: string;
};

const SHEET_LABEL = "Fairfax County's own basement details sheet (PDF)";

export const FAIRFAX_BASEMENT_SHEET_NOTES: readonly BasementSheetNote[] = [
  {
    citySlug: 'fairfax-station-va',
    surface: 'town',
    heading: 'Lower level in Fairfax Station',
    body: 'When Real Elite scopes a lower level on a Fairfax Station house, the starting document is Fairfax County’s own Typical Finished Basement Details sheet. The details that apply to that house are then confirmed with the county reviewer.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'mclean-va',
    surface: 'service',
    heading: 'McLean and the county sheet',
    body: 'A McLean lower level is scoped from Fairfax County’s own Typical Finished Basement Details sheet. Real Elite then confirms the details for that house with the county reviewer.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'vienna-va',
    surface: 'service',
    heading: 'Vienna and the county sheet',
    body: 'Vienna lower-level scoping uses Fairfax County’s own Typical Finished Basement Details sheet. Real Elite confirms the details with the county reviewer after the room is measured.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'great-falls-va',
    surface: 'service',
    heading: 'Great Falls and the county sheet',
    body: 'Great Falls lower levels are scoped from Fairfax County’s own Typical Finished Basement Details sheet, including a lot on a well or septic system. Real Elite confirms those details with the county reviewer.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'reston-va',
    surface: 'service',
    heading: 'Reston and the county sheet',
    body: 'Reston lower-level plans start from Fairfax County’s own Typical Finished Basement Details sheet. Real Elite confirms the details with the county reviewer before finishes are selected.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'dunn-loring-va',
    surface: 'service',
    heading: 'Dunn Loring and the county sheet',
    body: 'Dunn Loring lower levels are scoped against Fairfax County’s own Typical Finished Basement Details sheet. Real Elite confirms the applicable details with the county reviewer.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'fairfax-station-va',
    surface: 'service',
    heading: 'Fairfax Station basement page',
    body: 'This Fairfax Station basement page uses Fairfax County’s own Typical Finished Basement Details sheet while the lower level is scoped. Real Elite confirms the details with the county reviewer, including when Clifton is the town question.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'oakton-va',
    surface: 'service',
    heading: 'Oakton and the county sheet',
    body: 'Oakton lower levels are scoped from Fairfax County’s own Typical Finished Basement Details sheet. Real Elite confirms the details with the county reviewer before the county submission.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'clifton-va',
    surface: 'service',
    heading: 'Clifton and the county sheet',
    body: 'A Clifton-area lower level is scoped from Fairfax County’s own Typical Finished Basement Details sheet. Real Elite confirms the details with the county reviewer on both sides of the town line.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'fort-hunt-va',
    surface: 'service',
    heading: 'Fort Hunt and the county sheet',
    body: 'When a Fort Hunt parcel is in Fairfax County, the lower level is scoped from the county’s own Typical Finished Basement Details sheet, and Real Elite confirms the details with the county reviewer. A City of Alexandria parcel is a different office and is not this sheet.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'annandale-va',
    surface: 'service',
    heading: 'Annandale and the county sheet',
    body: 'Annandale lower levels in Fairfax County are scoped from the county’s own Typical Finished Basement Details sheet. Real Elite confirms the details with the county reviewer.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'springfield-va',
    surface: 'service',
    heading: 'Springfield and the county sheet',
    body: 'Springfield lower levels in Fairfax County are scoped from the county’s own Typical Finished Basement Details sheet. Real Elite confirms those details with the county reviewer before the finish plan is drawn.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
];

export function fairfaxBasementSheetNote(
  citySlug: string,
  surface: 'town' | 'service',
): BasementSheetNote | null {
  return (
    FAIRFAX_BASEMENT_SHEET_NOTES.find((note) => note.citySlug === citySlug && note.surface === surface) ??
    null
  );
}
