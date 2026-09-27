/**
 * The Investment Guide — typical Loudoun County remodel ranges.
 *
 * Every figure here is a TYPICAL MARKET RANGE for Northern Virginia
 * design-build work in 2025–26, compiled from published remodeler cost guides,
 * national Cost vs. Value reporting and Loudoun County's own fee schedules.
 * None of it is a quote, a minimum, or a promise about what a specific house
 * will cost, and the copy says so wherever a number appears. The guide exists
 * to pre-qualify: a homeowner who reads it knows which lane they are in before
 * they book a consultation.
 *
 * Deliberately NOT here: hard minimums ("we don't take jobs under $X"). The
 * consultation is positioned for projects of roughly $50,000 and up; smaller
 * work is routed to the standard estimate, not turned away.
 *
 * Renders on /investment and, in summary form, on the homepage. Keep it in one
 * place so the two never disagree.
 */

import type { ConsultationProjectType } from '@/lib/cta-intent';

export type InvestmentTier = {
  name: string;
  /** Display string, e.g. "$75K – $150K". Open-ended tiers say so in words. */
  range: string;
  includes: string;
};

export type InvestmentCategory = {
  slug: string;
  title: string;
  eyebrow: string;
  /** The "typically from" figure for summary rows. Null when scoped per home. */
  from: string | null;
  /** One-line span for summary rows. */
  typical: string;
  summary: string;
  tiers: InvestmentTier[];
  /** What tends to move the number, in plain words. */
  drivers: string[];
  /** The service page that describes the work. Must be a live route. */
  href: string;
  /** Pre-selects the consultation form. */
  consultationType: ConsultationProjectType;
  image: { src: string; alt: string };
};

/** Where the consultation path starts. Stated as "roughly", never as a floor. */
export const CONSULTATION_THRESHOLD_LABEL = 'roughly $50,000 and up';

export const INVESTMENT_DISCLAIMER =
  'Ranges are typical 2025–26 market figures for Loudoun County and Northern Virginia, compiled from published cost guides and county fee schedules. They are not quotes. Every project is priced from its own drawings, selections and site conditions.';

export const INVESTMENT_GUIDE: readonly InvestmentCategory[] = [
  {
    slug: 'lower-levels',
    title: 'Lower Levels & Basements',
    eyebrow: 'Signature project',
    from: '$75K',
    typical: '$75K – $350K+',
    summary:
      'Most eastern-Loudoun homes built after 2000 came with a full, unfinished lower level. Finishing it is the largest block of new living space a house can gain without changing its footprint.',
    tiers: [
      {
        name: 'Open lower level',
        range: '$75K – $150K',
        includes:
          'One open room, a full bath, egress where a bedroom is planned, layered lighting, LVP or engineered flooring, trim and doors.',
      },
      {
        name: 'Entertaining level',
        range: '$150K – $250K',
        includes:
          'Wet bar with stone and cabinetry, media area, full bath, a guest room with egress, dedicated HVAC zone, built-ins.',
      },
      {
        name: 'Suite and theater level',
        range: '$250K – $350K+',
        includes:
          'Dedicated theater or golf simulator, guest suite, gym, wine storage, custom millwork. A purpose-built theater alone typically adds $25K – $60K.',
      },
    ],
    drivers: [
      'Ceiling height and whether ductwork or beams have to move.',
      'Bathroom placement relative to the existing plumbing stack.',
      'Egress: a new window well and cut in a bedroom location.',
      'Level of millwork, stone and lighting in the bar and media zones.',
    ],
    href: '/services/basements',
    consultationType: 'basement',
    image: {
      src: '/images/inspiration/basement-media-lounge.jpg',
      alt: 'Finished lower level with wood-panelled walls, a projection screen and a fireplace',
    },
  },
  {
    slug: 'kitchens',
    title: 'Kitchens',
    eyebrow: 'Signature project',
    from: '$60K',
    typical: '$60K – $200K+',
    summary:
      'The room that sets the tone for the whole house. In Loudoun, a design-build kitchen usually means custom or semi-custom cabinetry, natural or engineered stone, a real appliance package and lighting designed in layers.',
    tiers: [
      {
        name: 'Refined refresh',
        range: '$60K – $100K',
        includes:
          'Same footprint. Semi-custom cabinetry, quartz or granite, tile backsplash, new lighting plan, appliance install, paint and trim.',
      },
      {
        name: 'Full design-build kitchen',
        range: '$100K – $200K',
        includes:
          'New layout, custom cabinetry, stone with waterfall or mitred edges, panel-ready appliances, plumbing and electrical relocation, permits.',
      },
      {
        name: 'Open-plan kitchen',
        range: '$200K+',
        includes:
          'Bearing-wall removal with engineered structure, enlarged openings, large island, pantry or scullery, whole-floor finish coordination.',
      },
    ],
    drivers: [
      'Cabinetry line and construction, the largest single line in almost every kitchen.',
      'Whether walls move and whether any of them are bearing.',
      'Appliance package and the electrical and gas work it needs.',
      'Stone selection: slab count, edge profile, and book-matching.',
    ],
    href: '/services/kitchens',
    consultationType: 'kitchen',
    image: {
      src: '/images/projects/kitchens/hero.jpg',
      alt: 'White kitchen with a long island, lantern pendants and dark hardwood floors',
    },
  },
  {
    slug: 'primary-suites',
    title: 'Primary Suites & Baths',
    eyebrow: 'Signature project',
    from: '$40K',
    typical: '$40K – $250K',
    summary:
      'The primary bath is where builder-grade shows first. A design-build suite brings the shower, tub, vanity wall and closet into one composed room, with the mechanicals and waterproofing done to match.',
    tiers: [
      {
        name: 'Primary bath, same footprint',
        range: '$40K – $75K',
        includes:
          'Curbless or low-curb shower with proper waterproofing, freestanding or built-in tub, double vanity, large-format tile, heated floor, new lighting and ventilation.',
      },
      {
        name: 'Primary bath with a new layout',
        range: '$75K – $125K',
        includes:
          'Walls and plumbing relocated, a larger shower room, water closet, custom vanity, stone or porcelain slab surfaces.',
      },
      {
        name: 'Full primary suite',
        range: '$125K – $250K',
        includes:
          'Bath plus bedroom and dressing room: walk-in closet millwork, lighting plan, doors and trim, sometimes a bump-out or a reclaimed adjacent room.',
      },
    ],
    drivers: [
      'Moving the shower or toilet, which changes the plumbing below the floor.',
      'Slab surfaces versus tile, and the size and type of tile.',
      'Custom versus semi-custom vanity and closet millwork.',
      'Heated floors, steam and other systems that need dedicated circuits.',
    ],
    href: '/services/bathrooms',
    consultationType: 'bathroom',
    image: {
      src: '/images/inspiration/suite-spa-bath.jpg',
      alt: 'Primary bath with book-matched stone walls, a built-in tub and floating vanity',
    },
  },
  {
    slug: 'outdoor-living',
    title: 'Outdoor Living',
    eyebrow: 'Signature project',
    from: '$30K',
    typical: '$30K – $150K+',
    summary:
      'In HOA communities the yard is the one place a family can genuinely make its own. Capped composite, black aluminum rail, a screened or covered room, and lighting that makes it a room after dark.',
    tiers: [
      {
        name: 'Composite deck',
        range: '$30K – $60K',
        includes:
          'Capped composite decking, aluminum or cable rail, integrated lighting, stairs and landing, HOA architectural application and county permit.',
      },
      {
        name: 'Deck with a screened or covered room',
        range: '$60K and up',
        includes:
          'A roofed section framed as an addition, tongue-and-groove ceiling, fans and lighting, screens or a three-season enclosure. Scoped per design.',
      },
      {
        name: 'Full outdoor room',
        range: 'Scoped per property',
        includes:
          'Outdoor kitchen, fire feature, hardscape and steps, landscape lighting, and the utilities that reach them.',
      },
    ],
    drivers: [
      'Deck height, footings and whether a roof is part of the design (a roofed porch is reviewed as an addition).',
      'Decking and rail lines, from capped composite to hardwood.',
      'HOA architectural review, which runs alongside the county permit.',
      'Gas, water and electrical runs for kitchens and fire features.',
    ],
    href: '/services/decks',
    consultationType: 'outdoor-living',
    image: {
      src: '/images/deck-screened-porch.jpg',
      alt: 'Screened porch with a dark stained ceiling, black railings and a wooded view',
    },
  },
  {
    slug: 'additions',
    title: 'Additions',
    eyebrow: 'Signature project',
    from: '$80K',
    typical: '$80K – $500K',
    summary:
      'When the house is right but the space is not. Additions are engineered, permitted and built to read as though they were always part of the home, inside and out.',
    tiers: [
      {
        name: 'Bump-out',
        range: '$80K – $150K',
        includes:
          'A small footprint expansion for a kitchen, bath or primary suite, on a new foundation with matched exterior finishes.',
      },
      {
        name: 'Family room or kitchen extension',
        range: '$150K – $300K',
        includes:
          'A full room on a new foundation, roof tied into the existing structure, new openings into the house, HVAC extension.',
      },
      {
        name: 'Bedroom suite addition',
        range: '$180K – $350K',
        includes:
          'Bedroom, bath and closet as a private wing, with the plumbing, electrical and structure to support it.',
      },
      {
        name: 'Second story',
        range: '$250K – $500K',
        includes:
          'A full or partial second floor: structural review of the existing frame, new stair, roof and exterior, and the interiors above.',
      },
    ],
    drivers: [
      'Foundation type and site work, including grading and drainage.',
      'Septic capacity in western Loudoun, which the county checks before permitting a bedroom.',
      'Matching existing siding, roofing and windows so the addition disappears.',
      'Plat, setbacks and, inside towns, a town zoning approval before the county permit.',
    ],
    href: '/services/additions',
    consultationType: 'addition',
    image: {
      src: '/images/inspiration/addition-sunroom.jpg',
      alt: 'Sunroom addition with an arched window wall and painted wainscoting',
    },
  },
  {
    slug: 'whole-home',
    title: 'Whole-Home Renovation',
    eyebrow: 'By design phase',
    from: null,
    typical: 'Scoped after design',
    summary:
      'A whole-home program combines several of the ranges above under one design, one contract and one team. It is priced after a design phase, from a real drawing set, rather than from a guess on the first visit.',
    tiers: [
      {
        name: 'Main-level program',
        range: 'Kitchen + living spaces',
        includes:
          'Kitchen, openings, flooring, lighting, trim and paint across the main floor as one coordinated scope.',
      },
      {
        name: 'Whole-house program',
        range: 'Two or more signature projects',
        includes:
          'Kitchen, primary suite and lower level or addition, sequenced so the family can stay in the house where possible.',
      },
    ],
    drivers: [
      'How many of the signature projects are combined, and whether they are built in phases.',
      'Structural changes and the engineering they need.',
      'Age of the house: 1990s and 2000s production homes routinely hide surprises behind the drywall, so a contingency line belongs in the number.',
    ],
    href: '/services/remodeling',
    consultationType: 'whole-home',
    image: {
      src: '/images/inspiration/wholehome-living.jpg',
      alt: 'Open-plan living space with wide-plank floors and a glass-rail staircase',
    },
  },
];

/** What moves a Loudoun number specifically. Facts, not promises. */
export const LOUDOUN_COST_FACTORS: readonly { title: string; body: string }[] = [
  {
    title: 'HOA architectural review',
    body: 'Most eastern-Loudoun communities (Brambleton, Broadlands, Lansdowne, Ashburn Village, South Riding and others) require architectural approval for exterior work. It runs alongside the county permit, not instead of it, and typically takes two to eight weeks. A county permit is not HOA approval.',
  },
  {
    title: 'County permits and plan review',
    body: 'Loudoun files through its LandMARC portal. For a finished basement the published building fee is 1% of construction value ($65 minimum) plus a $130 plan review, and a basement kitchen adds a $165 zoning permit. Inside Leesburg, Purcellville and Middleburg, the town zoning approval comes before the county building permit.',
  },
  {
    title: 'Septic and well, west of Route 15',
    body: 'On septic, the Health Department confirms system capacity before the county will permit a bedroom addition. Where an upgrade is needed, the industry range is roughly $15K – $40K, and it belongs in the budget from the first conversation.',
  },
  {
    title: 'Historic overlays',
    body: 'Exterior work in Waterford, Aldie, Taylorstown and the other county historic districts goes to the Historic District Review Committee. Leesburg’s Old and Historic District has its own Board of Architectural Review, and Middleburg its own Historic District Review Committee. The reviews add calendar time, not necessarily cost, if they are planned for.',
  },
  {
    title: 'Structure and engineering',
    body: 'Any bearing-wall removal or roof tie-in needs engineered drawings, which the county will ask for. Design-build means those drawings exist before the price is set, so the number is built from the structure that will actually be built.',
  },
  {
    title: 'Contingency on older houses',
    body: 'Homes from the 1990s and 2000s routinely hide previous work, moisture or framing shortcuts behind the drywall. A 10 – 15% contingency line on any project that opens walls is normal in this market and is shown as a line, not absorbed as a surprise.',
  },
];

/** What a design-build price usually contains, so ranges can be compared like for like. */
export const DESIGN_BUILD_PRICE_INCLUDES: readonly string[] = [
  'Design, drawings and selections, so the price is built from a documented scope',
  'Permit applications, town zoning where it applies, and the HOA architectural package',
  'Protection of the rest of the house, demolition and disposal',
  'Structural, electrical, plumbing and HVAC work to current code, with inspections',
  'Cabinetry, stone, tile, fixtures and finishes as named allowances or specified products',
  'Project management, scheduling and coordination of trades',
  'A contingency line where the scope opens existing walls or floors',
];

export const INVESTMENT_SOURCES: readonly { label: string; href?: string }[] = [
  {
    label: 'Loudoun County Building and Development: Finished Basements (fees and Typical Details)',
    href: 'https://www.loudoun.gov/1172/Finished-Basements',
  },
  {
    label: 'Loudoun County Building and Development: Decks',
    href: 'https://www.loudoun.gov/1166/Decks',
  },
  {
    label: 'Loudoun County Building and Development: Residential Additions and Alterations',
    href: 'https://www.loudoun.gov/5387/Residential-Additions-and-Alterations',
  },
  {
    label: 'Published Northern Virginia remodeler cost guides for basements, kitchens, baths and additions (2025–26)',
  },
  {
    label: 'National Cost vs. Value reporting for upscale kitchen and bath remodels (2025)',
  },
];

export const INVESTMENT_FAQ: readonly { question: string; answer: string }[] = [
  {
    question: 'Are these prices or estimates?',
    answer:
      'Neither. They are typical market ranges for Loudoun County and Northern Virginia so you can see which lane a project sits in before a conversation. A real number comes from drawings, selections and a site visit, and it is written down before anything is demolished.',
  },
  {
    question: 'What size of project is the design consultation for?',
    answer:
      'The consultation is calibrated for projects of roughly $50,000 and up: kitchens, primary suites, lower levels, additions and outdoor living. Smaller projects and repairs are welcome through the standard estimate, which is faster for that kind of work.',
  },
  {
    question: 'Why do Loudoun ranges run higher than the Eastern Panhandle?',
    answer:
      'Labor rates, HOA and county review, the level of finish the houses call for, and the structure involved. A Loudoun kitchen with custom cabinetry, stone and a bearing wall removed is a different scope from a like-for-like update, and the range reflects that scope rather than the ZIP code alone.',
  },
  {
    question: 'Do the ranges include permits and HOA approvals?',
    answer:
      'Yes, as line items. County fees are published and small relative to the work; the HOA package is mostly time. Both are sequenced before demolition so the schedule is real.',
  },
];
