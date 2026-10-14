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
    body: 'On a Fairfax Station lower level, a kitchen, wet bar, or bedroom needs a plan the county approves, and Real Elite submits the plan. The county requires its details sheet on the job site for each inspection, so Real Elite keeps that copy with the set. A departure from the sheet needs county staff approval before construction, and Real Elite reads the sheet against the plan before that filing.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'mclean-va',
    surface: 'service',
    heading: 'McLean and the county sheet',
    body: 'A McLean lower level that adds a kitchen, wet bar, or bedroom is not covered by the sheet alone, so Real Elite submits the plan for county approval. Real Elite keeps the county details sheet on the job site where the inspector can use it at each required inspection. Before construction, Real Elite reads the sheet against the McLean plan, because a departure needs county staff approval first.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'vienna-va',
    surface: 'service',
    heading: 'Vienna and the county sheet',
    body: 'Vienna lower-level work that includes a kitchen, wet bar, or bedroom goes in as a county filing, and Real Elite submits the plan for approval. During inspections, Real Elite keeps the details sheet on the job site for the inspector. Real Elite reads the sheet against the Vienna plan so a departure needs county staff approval before construction.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'great-falls-va',
    surface: 'service',
    heading: 'Great Falls and the county sheet',
    body: 'On a Great Falls lower level, a kitchen, wet bar, or bedroom needs county plan approval, and Real Elite submits the plan after the rooms are measured. Real Elite leaves the details sheet on the job site for every required inspection. Real Elite reads the sheet against the Great Falls plan first, since a departure needs county staff approval before construction.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'reston-va',
    surface: 'service',
    heading: 'Reston and the county sheet',
    body: 'Reston plans that include a kitchen, wet bar, or bedroom need county approval, and Real Elite submits the plan rather than treating the sheet as the whole filing. The details sheet stays on the job site, and Real Elite keeps it there for the inspector at each required inspection. Real Elite reads the sheet against the Reston plan so any departure needs county staff approval before construction.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'dunn-loring-va',
    surface: 'service',
    heading: 'Dunn Loring and the county sheet',
    body: 'A Dunn Loring lower level with a kitchen, wet bar, or bedroom needs a submitted plan the county approves, and Real Elite submits the plan. Real Elite keeps a printed details sheet on the job site for each inspection the county requires. Real Elite reads the sheet against the measured Dunn Loring plan, because a departure needs county staff approval before construction.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'fairfax-station-va',
    surface: 'service',
    heading: 'Fairfax Station basement page',
    body: 'This Fairfax Station basement page follows the same county sheet: a kitchen, wet bar, or bedroom still needs plan approval, and Real Elite submits the plan, including when Clifton is the town question. Real Elite keeps the sheet on the job site for the inspector at each required inspection. Real Elite reads the sheet against the Fairfax Station plan so a departure gets county staff approval before construction.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'oakton-va',
    surface: 'service',
    heading: 'Oakton and the county sheet',
    body: 'Oakton lower levels that add a kitchen, wet bar, or bedroom need the county to approve a plan, and Real Elite submits the plan before finishes are chosen. Real Elite keeps the details sheet on the job site through each required inspection. Real Elite reads the sheet against the Oakton plan, and a departure waits on county staff approval before construction.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'clifton-va',
    surface: 'service',
    heading: 'Clifton and the county sheet',
    body: 'A Clifton-area lower level with a kitchen, wet bar, or bedroom needs county plan approval on both sides of the town line, and Real Elite submits the plan. Real Elite keeps the details sheet on the job site for each Clifton inspection. Real Elite reads the sheet against the Clifton plan so a departure needs county staff approval before construction.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'fort-hunt-va',
    surface: 'service',
    heading: 'Fort Hunt and the county sheet',
    body: 'When a Fort Hunt parcel is in Fairfax County, a kitchen, wet bar, or bedroom needs plan approval, and Real Elite submits the plan. Real Elite keeps the county details sheet on the job site for each required Fort Hunt inspection, and Real Elite reads the sheet against the plan before construction because a departure needs county staff approval. A City of Alexandria parcel is a different office and is not this sheet.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'annandale-va',
    surface: 'service',
    heading: 'Annandale and the county sheet',
    body: 'Annandale lower levels in Fairfax County that include a kitchen, wet bar, or bedroom need a plan the county approves, and Real Elite submits the plan. Real Elite keeps the details sheet on the job site for the inspector at each required Annandale inspection. Real Elite reads the sheet against the Annandale plan so a departure needs county staff approval before construction.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'springfield-va',
    surface: 'service',
    heading: 'Springfield and the county sheet',
    body: 'Springfield lower levels in Fairfax County that include a kitchen, wet bar, or bedroom need county plan approval, and Real Elite submits the plan before the finish plan is drawn. Real Elite keeps the details sheet on the job site for each required Springfield inspection. Real Elite reads the sheet against the Springfield plan, and a departure needs county staff approval before construction.',
    href: FAIRFAX_BASEMENT_DETAILS_URL,
    linkLabel: SHEET_LABEL,
  },
  {
    citySlug: 'falls-church-va',
    surface: 'service',
    heading: 'Falls Church and the county sheet',
    body: 'When a Falls Church parcel is in Fairfax County, a kitchen, wet bar, or bedroom needs county plan approval, and Real Elite submits the plan. Real Elite keeps the county details sheet on the job site for each required inspection on that county parcel, and Real Elite reads the sheet against the plan because a departure needs county staff approval before construction. A parcel inside the City of Falls Church stays on the city permit path and is not this county sheet.',
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
