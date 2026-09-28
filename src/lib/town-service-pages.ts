/**
 * Town-first service URLs: /service-areas/{town}/{service}.
 *
 * Copy is assembled from pages that already exist. This file holds only the
 * fields that are not already a single source elsewhere:
 * - titles and descriptions (unique SERP fields for these URLs)
 * - cost-guide excerpts (the matching blog post)
 * - which service-page FAQs to repeat
 *
 * The route template reads the town blurb from CITY_DATA, the permit prose
 * from CONTENT, and the scope list from SERVICE_DATA. Do not add prices,
 * timelines, headcount, awards, or years in business here.
 */

import { CITY_DATA, ALL_SERVICE_AREAS, type ServiceArea } from '@/lib/constants';
import { CONTENT, type FeaturedServiceSlug, type ComboCitySlug } from '@/lib/service-city-content';
import { SERVICE_DATA, type ServiceFAQ } from '@/lib/services-data';
import type { ConsultationProjectType } from '@/lib/cta-intent';

export type TownServiceSlug = 'basements' | 'kitchens';
export type TownSlug = 'ashburn-va' | 'leesburg-va';

export type GuideFaq = { question: string; answer: string };

export type TownServicePage = {
  townSlug: TownSlug;
  serviceSlug: TownServiceSlug;
  /** Visible H1. One per page. */
  h1: string;
  /** <title>, kept inside the 60-character SERP budget. */
  title: string;
  /** Meta description, kept at or under 160 characters. */
  description: string;
  /** Questions copied from SERVICE_DATA[service].faqs, in render order. */
  serviceFaqQuestions: readonly string[];
  /**
   * Sentences taken from the matching cost guide. Not Real Elite price lists.
   * Third-party ranges stay attributed the way the guide attributes them.
   */
  costParagraphs: readonly string[];
  /** Q&A copied from the matching cost guide. */
  guideFaqs: readonly GuideFaq[];
  costGuideSlug: string;
  costGuideLabel: string;
};

const BASEMENT_GUIDE = 'basement-remodeling-cost-ashburn-leesburg-2026';
const KITCHEN_GUIDE = 'kitchen-remodel-cost-loudoun-county-2026';

const BASEMENT_SERVICE_FAQS = [
  'Is my basement a candidate for finishing?',
  'Do I need egress windows?',
  'Can I add a bathroom or wet bar?',
  'Will the basement be warm enough?',
  'Do I need a permit to finish a basement in Loudoun County?',
] as const;

const KITCHEN_SERVICE_FAQS = [
  'How long does a kitchen remodel take?',
  'Can I live in my house during the kitchen remodel?',
  'Do you handle the appliance install?',
  'What cabinetry brands do you work with?',
] as const;

const BASEMENT_RANGES =
  "Mayflower Virginia publishes Northern Virginia basement tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. These are one contractor's planning ranges, not Real Elite prices or a Loudoun County average. Denny + Gardner describes an overall labor-and-materials range of about $50,000 to upward of $100,000 for an upscale renovation, with waste disposal, equipment, design, and permits as other budget considerations. The sources use different scopes and exclusions. A low figure from one and a high figure from another do not form a new, verified local range.";

const BASEMENT_ELECTRICAL =
  "Real Elite does not take electrical work. Include the separately licensed electrical provider's scope in the overall plan so a remodeling estimate does not leave that part unaccounted for.";

const KITCHEN_RANGES =
  "HomeAdvisor reports a national kitchen remodel average of $26,945 and a typical range of $14,589–$41,559, while its total-makeover category runs $65,000–$130,000 or more. These are national reference figures, not measured Loudoun averages or Real Elite quotes. A 2025 DMV report from Four Seasons Home Improvement lists $28,500 for a minor midrange kitchen and $72,000 for a major upscale kitchen. Those are that publisher's regional benchmarks, not a ceiling for a custom kitchen. Do not average these sources together or apply an arbitrary Loudoun markup.";

const KITCHEN_ELECTRICAL =
  'Real Elite does not take electrical work. Identify the separately licensed electrical provider and its scope before agreeing to the project.';

const KITCHEN_PERMIT_FEE =
  "Loudoun's Residential Additions and Alterations page lists an alteration building fee of 1% of construction cost plus $130 for plan review, and it requires structural details and applicable trade permits. This is not a flat fee for every kitchen remodel.";

const KITCHEN_PERMITS_ASHBURN = `${KITCHEN_PERMIT_FEE} Ashburn is unincorporated Loudoun County, so building and zoning run through LandMARC. ${KITCHEN_ELECTRICAL}`;

const KITCHEN_PERMITS_LEESBURG = `${KITCHEN_PERMIT_FEE} For a home inside an incorporated town, that county page requires an approved town zoning permit with the application. A Leesburg mailing address alone does not determine the parcel's jurisdiction. ${KITCHEN_ELECTRICAL}`;

export const TOWN_SERVICE_PAGES: readonly TownServicePage[] = [
  {
    townSlug: 'ashburn-va',
    serviceSlug: 'basements',
    h1: 'Basement Remodeling in Ashburn, VA',
    title: 'Basement Remodeling in Ashburn, VA | Real Elite',
    description:
      'Basement remodeling in Ashburn, VA. LandMARC permits, HOA review when an egress opening is cut, and a finished lower level when the plan allows.',
    serviceFaqQuestions: BASEMENT_SERVICE_FAQS,
    costParagraphs: [BASEMENT_RANGES, BASEMENT_ELECTRICAL],
    guideFaqs: [
      {
        question: 'Does the HOA matter for an indoor basement project in Ashburn?',
        answer:
          "Confirm the association's rules. A new window well, exterior opening, or walkout should be reviewed as an exterior change. A county permit is not HOA approval.",
      },
    ],
    costGuideSlug: BASEMENT_GUIDE,
    costGuideLabel: 'Basement remodeling cost in Ashburn and Leesburg',
  },
  {
    townSlug: 'ashburn-va',
    serviceSlug: 'kitchens',
    h1: 'Kitchen Remodel in Ashburn, VA',
    title: 'Kitchen Remodel in Ashburn, VA | Real Elite',
    description:
      'Kitchen remodel in Ashburn, VA. Layout, cabinetry, and counters, with LandMARC permits when the work needs them and HOA review for exterior changes.',
    serviceFaqQuestions: KITCHEN_SERVICE_FAQS,
    costParagraphs: [KITCHEN_RANGES, KITCHEN_PERMITS_ASHBURN],
    guideFaqs: [
      {
        question: 'Can I use the national average as my Ashburn kitchen budget?',
        answer:
          'Use it as context. A quote is useful only when it describes the layout, selections, existing conditions, allowances, and exclusions. These national figures are not measured Loudoun averages or Real Elite quotes.',
      },
    ],
    costGuideSlug: KITCHEN_GUIDE,
    costGuideLabel: 'Kitchen remodel cost in Loudoun County',
  },
  {
    townSlug: 'leesburg-va',
    serviceSlug: 'basements',
    h1: 'Basement Remodeling in Leesburg, VA',
    title: 'Basement Remodeling in Leesburg, VA | Real Elite',
    description:
      'Basement remodeling in Leesburg, VA. Inside town limits, town zoning is approved before Loudoun County issues the building permit.',
    serviceFaqQuestions: BASEMENT_SERVICE_FAQS,
    costParagraphs: [BASEMENT_RANGES, BASEMENT_ELECTRICAL],
    guideFaqs: [
      {
        question: 'Does a Leesburg address always mean town zoning?',
        answer:
          "Confirm the parcel's jurisdiction. The county's town-zoning instruction applies to property within an incorporated town, not simply to the postal city on an address. Lansdowne and River Creek often carry a Leesburg address and sit in unincorporated Loudoun.",
      },
      {
        question: 'Can a basement bedroom use the existing window?',
        answer:
          "Have the proposed escape arrangement checked against the applicable requirements before calling the room a bedroom. An existing window's presence alone does not establish compliance.",
      },
    ],
    costGuideSlug: BASEMENT_GUIDE,
    costGuideLabel: 'Basement remodeling cost in Ashburn and Leesburg',
  },
  {
    townSlug: 'leesburg-va',
    serviceSlug: 'kitchens',
    h1: 'Kitchen Renovation in Leesburg, VA',
    title: 'Kitchen Renovation in Leesburg, VA | Real Elite',
    description:
      'Kitchen renovation in Leesburg, VA. Layout, cabinetry, and counters. Inside town limits, town zoning comes before the county building permit.',
    serviceFaqQuestions: KITCHEN_SERVICE_FAQS,
    costParagraphs: [KITCHEN_RANGES, KITCHEN_PERMITS_LEESBURG],
    guideFaqs: [
      {
        question: 'Does a Leesburg mailing address decide the kitchen permit path?',
        answer:
          "No. A Leesburg mailing address alone does not determine the parcel's jurisdiction. Inside town limits, town zoning is approved before Loudoun County issues the building permit.",
      },
      {
        question: 'Can I use the national average as my Leesburg kitchen budget?',
        answer:
          'Use it as context. A quote is useful only when it describes the layout, selections, existing conditions, allowances, and exclusions. These national figures are not measured Loudoun averages or Real Elite quotes.',
      },
    ],
    costGuideSlug: KITCHEN_GUIDE,
    costGuideLabel: 'Kitchen remodel cost in Loudoun County',
  },
];

export function townServicePath(page: Pick<TownServicePage, 'townSlug' | 'serviceSlug'>): string {
  return `/service-areas/${page.townSlug}/${page.serviceSlug}`;
}

/**
 * The indexed URL for this intent. The town-first page is an alternate of the
 * service-by-town page that already exists, so it does not get its own
 * canonical or its own sitemap entry.
 */
export function canonicalServicePath(
  page: Pick<TownServicePage, 'townSlug' | 'serviceSlug'>
): string {
  return `/services/${page.serviceSlug}/${page.townSlug}`;
}

/** Town-first URLs stay reachable and are omitted from the sitemap. */
export function includedInSitemap(
  _page: Pick<TownServicePage, 'townSlug' | 'serviceSlug'>
): boolean {
  return false;
}

export function townServiceComboKey(
  page: Pick<TownServicePage, 'townSlug' | 'serviceSlug'>
): `${FeaturedServiceSlug}-${ComboCitySlug}` {
  return `${page.serviceSlug}-${page.townSlug}`;
}

export function getTownServicePage(
  townSlug: string,
  serviceSlug: string
): TownServicePage | undefined {
  return TOWN_SERVICE_PAGES.find(
    (page) => page.townSlug === townSlug && page.serviceSlug === serviceSlug
  );
}

export function townServiceArea(page: TownServicePage): ServiceArea {
  const area = ALL_SERVICE_AREAS.find((entry) => entry.slug === page.townSlug);
  if (!area) {
    throw new Error(`Town service page names an unknown area: ${page.townSlug}`);
  }
  return area;
}

export function consultationTypeFor(serviceSlug: TownServiceSlug): ConsultationProjectType {
  return serviceSlug === 'basements' ? 'basement' : 'kitchen';
}

export function serviceFaqsFor(page: TownServicePage): ServiceFAQ[] {
  const data = SERVICE_DATA[page.serviceSlug];
  if (!data) {
    throw new Error(`No service data for ${page.serviceSlug}`);
  }
  return page.serviceFaqQuestions.map((question) => {
    const found = data.faqs.find((faq) => faq.question === question);
    if (!found) {
      throw new Error(`${page.serviceSlug} has no FAQ titled "${question}"`);
    }
    return found;
  });
}

/** Every sentence this URL adds or repeats, for the claims guard. */
export function collectTownServiceText(page: TownServicePage): string {
  const combo = CONTENT[townServiceComboKey(page)];
  const town = CITY_DATA[page.townSlug];
  const service = SERVICE_DATA[page.serviceSlug];
  const faqs = [...serviceFaqsFor(page), ...page.guideFaqs];
  return [
    page.h1,
    page.title,
    page.description,
    town?.description ?? '',
    ...(town?.neighborhoods ?? []),
    ...(combo?.paragraphs ?? []),
    service?.scope.title ?? '',
    ...(service?.scope.items ?? []),
    ...page.costParagraphs,
    ...faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join('\n');
}
