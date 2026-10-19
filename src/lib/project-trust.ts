/**
 * Trust copy for the kitchen, bath, and basement hubs, plus the financing page.
 *
 * Dollar figures are read from the investment guide. Do not type a new price
 * here. The free-visit sentence is the design-consultation FAQ line.
 */
import { INVESTMENT_GUIDE, type InvestmentCategory } from '@/lib/investment-guide';

export const PROJECT_TRUST_SLUGS = ['kitchens', 'bathrooms', 'basements'] as const;
export type ProjectTrustSlug = (typeof PROJECT_TRUST_SLUGS)[number];

const CATEGORY_SLUG: Record<ProjectTrustSlug, string> = {
  kitchens: 'kitchens',
  bathrooms: 'primary-suites',
  basements: 'lower-levels',
};

export function isProjectTrustPage(slug: string): slug is ProjectTrustSlug {
  return (PROJECT_TRUST_SLUGS as readonly string[]).includes(slug);
}

export function investmentCategoryFor(slug: ProjectTrustSlug): InvestmentCategory {
  const category = INVESTMENT_GUIDE.find((item) => item.slug === CATEGORY_SLUG[slug]);
  if (!category) {
    throw new Error(`Missing investment category for ${slug}`);
  }
  return category;
}

/** Design-consultation FAQ, used verbatim. */
export const FREE_FIRST_VISIT_SENTENCE =
  'The call and the first site visit are at no charge. They exist to decide, on both sides, whether the project is a fit before anyone commits to a design phase.';

/** Investment-guide permit answer, plus the design-build inclusions line. */
export const PERMITS_ANSWER =
  'Yes. Permit applications, town zoning where it applies, and the HOA architectural package are part of the work, included as line items. County fees are published and small relative to the work; the HOA package is mostly time. A county permit is not HOA approval. Both are sequenced before demolition so the schedule is real.';

/** HOA timing is the published Loudoun factor. Construction length is not guessed. */
export const TIMELINE_ANSWER =
  'HOA architectural review typically takes two to eight weeks and runs alongside the county permit, not instead of it. Both are sequenced before demolition so the schedule is real. The construction schedule itself is set from the drawings, the selections, and the site visit, and it is written down before anything is demolished.';

export const FINANCING_DISCLAIMER =
  'Financing is provided through third-party lenders. Approval, rates, and terms depend on the lender and your creditworthiness. There is no obligation, and the call and the first site visit stay at no charge either way.';

export type TrustPhoto = { src: string; alt: string };

/**
 * Three photos per hub. Verified job photos stay separate from stock.
 * Nothing here is captioned as inspiration.
 */
export const PROJECT_TRUST_PHOTOS: Record<ProjectTrustSlug, readonly TrustPhoto[]> = {
  kitchens: [
    {
      src: '/images/work/kitchen-bethesda-waterfall-island.jpg',
      alt: 'White shaker kitchen with a black waterfall-edge quartz island, black pendants, and double wall ovens',
    },
    {
      src: '/images/projects/kitchens/island-lantern-pendants.jpg',
      alt: 'White kitchen with a marble-topped island, lantern pendants, and dark hardwood floors',
    },
    {
      src: '/images/projects/kitchens/gray-marble-waterfall.jpg',
      alt: 'Gray kitchen with a marble waterfall island and a chrome chandelier',
    },
  ],
  bathrooms: [
    {
      src: '/images/work/bath-primary-frameless-shower.webp',
      alt: 'Walk-in shower with frameless glass, blue subway tile, a marble-look hex floor, and matte black fixtures',
    },
    {
      src: '/images/work/bath-primary-shower-and-vanity.webp',
      alt: 'Primary bath with a walk-in tile shower beside a quartz-topped navy vanity',
    },
    {
      src: '/images/work/bath-primary-navy-vanity.webp',
      alt: 'Navy shaker vanity with matte black pulls and a quartz top',
    },
  ],
  basements: [
    {
      src: '/images/inspiration/basement-media-lounge.jpg',
      alt: 'Finished lower level with wood-panelled walls, a projection screen, and a fireplace',
    },
    {
      src: '/images/inspiration/basement-wet-bar.jpg',
      alt: 'Wood bar with a stone-tile front, a pass-through mirror, and windows onto a deck',
    },
    {
      src: '/images/inspiration/basement-home-theater.jpg',
      alt: 'Theater room with leather recliners, a ceiling-mounted projector, and a projection screen',
    },
  ],
};

export function costAnswerForService(slug: ProjectTrustSlug): string {
  const category = investmentCategoryFor(slug);
  const tiers = category.tiers.slice(0, 3);
  const listed = tiers.map((tier) => `${tier.name} (${tier.range})`).join('; ');
  return `Typical market range for Loudoun County and Northern Virginia: ${category.typical}. The three ranges are ${listed}. These are typical market ranges, not quotes. A real number comes from drawings, selections and a site visit, and it is written down before anything is demolished.`;
}

export function financingCostAnswer(): string {
  const slugs: ProjectTrustSlug[] = ['basements', 'kitchens', 'bathrooms'];
  const listed = slugs
    .map((slug) => {
      const category = investmentCategoryFor(slug);
      return `${category.title} ${category.typical}`;
    })
    .join('; ');
  return `Published ranges, not quotes: ${listed}. Financing does not change those ranges. Approval, rates, and terms depend on the lender and your credit. The full table is on the investment guide.`;
}

export const PROJECT_TRUST_FAQ = {
  visit: {
    question: 'Is the first visit free?',
    answer: FREE_FIRST_VISIT_SENTENCE,
  },
  permits: {
    question: 'Do you pull the county and HOA permits?',
    answer: PERMITS_ANSWER,
  },
  timeline: {
    question: 'How long does a typical job take?',
    answer: TIMELINE_ANSWER,
  },
} as const;

export function financingTrustFaqs(): { question: string; answer: string }[] {
  return [
    { question: 'What does a project usually cost?', answer: financingCostAnswer() },
    PROJECT_TRUST_FAQ.visit,
    PROJECT_TRUST_FAQ.permits,
    PROJECT_TRUST_FAQ.timeline,
  ];
}

export function faqPageSchema(items: readonly { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
