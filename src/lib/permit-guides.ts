import { SERVICES, servicePillarHref } from '@/lib/constants';
import { BATCH2_PERMIT_GUIDES, BATCH2_PERMIT_SOURCES } from '@/lib/permit-guides-batch2';

/**
 * County permit guides: "Do I need a permit for a deck / basement / bathroom
 * remodel in <county>?" One page per county at /permit-guides/<slug>.
 *
 * Editorial rules (enforced in permit-guides.test.ts):
 * - Every fact is a paraphrase of an official government page listed in
 *   PERMIT_SOURCES, and every job, issuer, and step cites at least one.
 * - No prices and no review timelines. Fees and turnaround change; the
 *   source links carry them.
 * - When an official page doesn't settle a question, the copy says to check
 *   with the permit office instead of guessing.
 * - The town pages own "<service> in <town>" intent. These pages own the
 *   permit question, and link out to the area and service pages.
 */

export type PermitVerdict = 'required' | 'depends' | 'often-exempt' | 'check';

export const VERDICT_LABELS: Record<PermitVerdict, string> = {
  required: 'Permit required',
  depends: 'Depends on scope',
  'often-exempt': 'Often no building permit',
  check: 'Check with the county',
};

export type PermitSource = { id: string; label: string; url: string };

export type PermitJob = {
  job: string;
  verdict: PermitVerdict;
  summary: string;
  sources: readonly string[];
  /** Service slug for the "see our <service> work" link. */
  service?: string;
};

export type CitedText = { text: string; sources: readonly string[] };
export type InlineCitedText = string | readonly CitedText[];

export function plainPermitText(value: InlineCitedText): string {
  return typeof value === 'string' ? value : value.map((part) => part.text).join(' ');
}

export type CountyPermitGuide = {
  slug: string;
  county: string;
  state: 'VA' | 'MD' | 'WV' | 'PA';
  stateName: 'Virginia' | 'Maryland' | 'West Virginia' | 'Pennsylvania';
  h1: string;
  seoTitle: string;
  description: string;
  cardBlurb: string;
  keywords: string[];
  published: string;
  updated: string;
  answer: InlineCitedText;
  jurisdictionIntro: InlineCitedText;
  issuers: readonly { name: string; covers: string; sources: readonly string[] }[];
  jobs: readonly PermitJob[];
  steps: readonly CitedText[];
  hoa: CitedText;
  historic: CitedText;
  faqs: readonly { question: string; answer: InlineCitedText }[];
  /** Ids into PERMIT_SOURCES, listed in the page's "Official sources" block. */
  sourceIds: readonly string[];
  /** Service-area slugs linked at the foot of the page. */
  areaSlugs: readonly string[];
  /** Existing /blog slugs worth reading next. */
  relatedPosts: readonly string[];
};

const PUBLISHED = '2026-10-11';

const MC_DPS = 'https://www.montgomerycountymd.gov/department-permitting-services';
const MC_RES = `${MC_DPS}/all-permits/residential-permits`;

/* -------------------------------------------------------------------------- */
/*  Official sources                                                          */
/* -------------------------------------------------------------------------- */

export const PERMIT_SOURCES: readonly PermitSource[] = [
  ...BATCH2_PERMIT_SOURCES,
  // Virginia statewide
  {
    id: 'va-usbc-108',
    label: 'Virginia USBC, 13VAC5-63-80 Section 108.2 (work exempt from permits)',
    url: 'https://law.lis.virginia.gov/admincode/title13/agency5/chapter63/section80/',
  },
  // Fairfax County, VA
  {
    id: 'ffx-when',
    label: 'Fairfax County LDS: When is a permit required?',
    url: 'https://www.fairfaxcounty.gov/landdevelopment/when-permit-required',
  },
  {
    id: 'ffx-residential',
    label: 'Fairfax County LDS: Residential permit library',
    url: 'https://www.fairfaxcounty.gov/landdevelopment/permit-library/residential',
  },
  {
    id: 'ffx-addition',
    label: 'Fairfax County LDS: Residential addition and alteration permits',
    url: 'https://www.fairfaxcounty.gov/landdevelopment/permit-library/addition-alteration-residential',
  },
  {
    id: 'ffx-misc',
    label: 'Fairfax County LDS: Residential miscellaneous permits',
    url: 'https://www.fairfaxcounty.gov/landdevelopment/permit-library/misc-residential',
  },
  {
    id: 'ffx-zoning-faq',
    label: 'Fairfax County Zoning: Frequently asked questions',
    url: 'https://www.fairfaxcounty.gov/planning-development/zoning/faqs',
  },
  {
    id: 'ffx-hod',
    label: 'Fairfax County: Historic Overlay Districts FAQ',
    url: 'https://www.fairfaxcounty.gov/planning-development/historic-overlay-districts/faqs',
  },
  {
    id: 'vienna-residential',
    label: 'Town of Vienna: Residential projects',
    url: 'https://www.viennava.gov/Town-Departments/Planning-Zoning/Permits-Applications/Residential-Projects',
  },
  {
    id: 'clifton-faq',
    label: 'Town of Clifton: FAQs',
    url: 'https://cliftonva.gov/town_administration/faqs.php',
  },
  // Arlington County, VA
  {
    id: 'arl-residential',
    label: 'Arlington County: Residential building permits',
    url: 'https://www.arlingtonva.us/Government/Programs/Building/Permits/Residential',
  },
  {
    id: 'arl-review',
    label: 'Arlington County: Residential permit review process',
    url: 'https://www.arlingtonva.us/Government/Programs/Building/Review-Processes/Residential',
  },
  {
    id: 'arl-coa',
    label: 'Arlington County: Certificate of Appropriateness',
    url: 'https://www.arlingtonva.us/Government/Programs/Building/Permits/Certificate-of-Appropriateness',
  },
  {
    id: 'arl-affidavit',
    label: 'Arlington County: Permit Authorization Affidavit',
    url: 'https://www.arlingtonva.us/Government/Programs/Building/Permits/Authorization-Affidavit',
  },
  // Loudoun County, VA
  {
    id: 'ldn-permitting',
    label: 'Loudoun County: Permitting',
    url: 'https://www.loudoun.gov/4264/Permitting',
  },
  {
    id: 'ldn-construction',
    label: 'Loudoun County: Residential and commercial construction',
    url: 'https://www.loudoun.gov/4265/Residential-and-Commercial-Construction-',
  },
  { id: 'ldn-decks', label: 'Loudoun County: Decks', url: 'https://www.loudoun.gov/1166/Decks' },
  {
    id: 'ldn-basements',
    label: 'Loudoun County: Finished basements',
    url: 'https://www.loudoun.gov/1172/Finished-Basements',
  },
  {
    id: 'ldn-additions',
    label: 'Loudoun County: Residential additions and alterations',
    url: 'https://www.loudoun.gov/5387/Residential-Additions-and-Alterations',
  },
  {
    id: 'ldn-sheds',
    label: 'Loudoun County: Sheds and agricultural structures',
    url: 'https://www.loudoun.gov/5383/Sheds-and-Agricultural-Structures',
  },
  {
    id: 'ldn-towns',
    label: 'Loudoun County: Incorporated towns',
    url: 'https://www.loudoun.gov/193/Incorporated-Towns',
  },
  {
    id: 'ldn-zoning',
    label: 'Loudoun County: Zoning requirements',
    url: 'https://www.loudoun.gov/1203/Zoning-Requirements',
  },
  { id: 'ldn-landmarc', label: 'Loudoun County: LandMARC', url: 'https://www.loudoun.gov/landmarc' },
  // Montgomery County, MD
  { id: 'mc-dps', label: 'Montgomery County Department of Permitting Services', url: MC_DPS },
  {
    id: 'mc-home',
    label: 'Montgomery County DPS: Home improvements (what likely needs a permit)',
    url: `${MC_DPS}/homeowners/home-improvements`,
  },
  {
    id: 'mc-decks',
    label: 'Montgomery County DPS: Residential deck permit process',
    url: `${MC_RES}/residential-decks-permit-process`,
  },
  {
    id: 'mc-alterations',
    label: 'Montgomery County DPS: Residential alterations permit process',
    url: `${MC_RES}/residential-alterations-permit-process`,
  },
  {
    id: 'mc-fasttrack',
    label: 'Montgomery County DPS: Residential Fast Track permit process',
    url: `${MC_RES}/residential-fast-track-permit-process`,
  },
  {
    id: 'mc-not-cities',
    label: 'Montgomery County DPS: Addition building permit process (Rockville and Gaithersburg note)',
    url: `${MC_DPS}/all-permits/commercial-permits/commercial-addition-building-permit-process`,
  },
  {
    id: 'mc-fence',
    label: 'Montgomery County DPS: Residential fence permit process',
    url: `${MC_RES}/residential-fence-permit-process`,
  },
  {
    id: 'mc-accessory',
    label: 'Montgomery County DPS: Residential accessory structure permit process',
    url: `${MC_RES}/residential-accessory-structure-permit-process`,
  },
  {
    id: 'mc-hawp',
    label: 'Montgomery County DPS: Historic Area Work Permit process',
    url: `${MC_RES}/historic-area-permit-process`,
  },
  {
    id: 'mc-electrical',
    label: 'Montgomery County DPS: Electrical permit (with a building permit)',
    url: `${MC_DPS}/all-permits/electrical-mechanical-permits/electrical-permit-parent-building-permit-process`,
  },
  {
    id: 'wssc-homeowners',
    label: 'WSSC Water: Permit information for homeowners',
    url: 'https://www.wsscwater.com/work-with-us/permit-services/information-homeowners',
  },
  {
    id: 'rockville-permits',
    label: 'City of Rockville: Apply for a building or trade permit',
    url: 'https://www.rockvillemd.gov/services/apply-for-a-building-or-trade-permit/',
  },
  {
    id: 'takoma-letters',
    label: 'City of Takoma Park: Municipality letters for construction',
    url: 'https://takomaparkmd.gov/398/Municipality-Letters-for-Construction-Re',
  },
  {
    id: 'toc-permits',
    label: 'Town of Chevy Chase: Building permitting',
    url: 'https://www.townofchevychase.org/234/Building-Permitting',
  },
  // Howard County, MD
  {
    id: 'hc-dilp',
    label: 'Howard County Department of Inspections, Licenses and Permits',
    url: 'https://www.howardcountymd.gov/inspections-licenses-permits',
  },
  {
    id: 'hc-getstarted',
    label: 'Howard County DILP: Let’s get started (resources and forms)',
    url: 'https://www.howardcountymd.gov/inspections-licenses-permits/lets-get-started-resources-fees',
  },
  {
    id: 'hc-handout',
    label: 'Howard County DILP: Residential online building permit handout (PDF)',
    url: 'https://www.howardcountymd.gov/sites/default/files/2026-03/HoCoResidentialOnlineBuildingPermitHandout11.05.2025.pdf',
  },
  {
    id: 'hc-memo',
    label: 'Howard County DILP: Residential accessory structure memo (PDF)',
    url: 'https://www.howardcountymd.gov/sites/default/files/2022-10/HoCoResidentialAccessoryStructureMemo10.24.2022.pdf',
  },
  {
    id: 'hc-inspections',
    label: 'Howard County DILP: Inspection requirements',
    url: 'https://www.howardcountymd.gov/inspections-licenses-permits/inspection-requirements',
  },
  {
    id: 'hc-homeowner-plumbing',
    label: 'Howard County DILP: Homeowner plumbing application (PDF)',
    url: 'https://www.howardcountymd.gov/sites/default/files/2026-03/Homeowners%20Plumbing%20Application%20%2003.2026_0.pdf',
  },
  {
    id: 'hc-hpc',
    label: 'Howard County Historic Preservation Commission: Certificate of Approval',
    url: 'https://www.howardcountymd.gov/historic-preservation-commission/resource/view-certificate-approval-and-tax-credit-pre-approval',
  },
  {
    id: 'md-manual-howard',
    label: 'Maryland Manual: Howard County municipalities',
    url: 'https://msa.maryland.gov/msa/mdmanual/36loc/how/html/howmu.html',
  },
  // Frederick County, MD
  {
    id: 'fred-permits',
    label: 'Frederick County: Building permits and zoning certificates',
    url: 'https://frederickcountymd.gov/8000/Building-Permits-Zoning-Certificates',
  },
  {
    id: 'fred-faq',
    label: 'Frederick County: Permits and inspections FAQ',
    url: 'https://www.frederickcountymd.gov/m/faq?cat=79',
  },
  {
    id: 'fred-application',
    label: 'Frederick County: Residential building permit application (addition, alteration, accessory)',
    url: 'https://frederickcountymd.gov/DocumentCenter/View/285482/Residential-Building-Permit-Application-Addition-Alteration-and-Accessory',
  },
  {
    id: 'fred-expedited',
    label: 'Frederick County: Expedited permits',
    url: 'https://www.frederickcountymd.gov/8001/Expedited-Permits',
  },
  {
    id: 'fred-plumbing',
    label: 'Frederick County: Plumbing permits',
    url: 'https://www.frederickcountymd.gov/8003/Plumbing-Permits',
  },
  {
    id: 'city-frederick-residential',
    label: 'City of Frederick: Residential applications',
    url: 'https://www.cityoffrederickmd.gov/215/Residential-Applications',
  },
  {
    id: 'city-frederick-historic',
    label: 'City of Frederick: Historic district guide for contractors (PDF)',
    url: 'https://cityoffrederickmd.gov/DocumentCenter/View/25365/Historic-District-Guides-Contractors--Final',
  },
];

/* -------------------------------------------------------------------------- */
/*  Virginia                                                                  */
/* -------------------------------------------------------------------------- */

const FAIRFAX: CountyPermitGuide = {
  slug: 'fairfax-county-va',
  county: 'Fairfax County',
  state: 'VA',
  stateName: 'Virginia',
  h1: 'Do I Need a Permit to Remodel in Fairfax County, VA?',
  seoTitle: 'Fairfax County Remodel Permits: Deck, Basement, Bath',
  description:
    'Which Fairfax County remodels need a permit: decks, finished basements, baths, kitchens, roofs, and additions. Who issues it, the steps, and the HOA note.',
  cardBlurb:
    'Decks, finished basements, and bath and kitchen remodels need a permit. Same-opening windows, re-siding, and new shingles usually don’t. Vienna and Clifton add a town step.',
  keywords: [
    'Fairfax County deck permit',
    'Fairfax County basement permit',
    'Fairfax County bathroom remodel permit',
    'do I need a permit Fairfax County',
  ],
  published: PUBLISHED,
  updated: PUBLISHED,
  answer:
    'In Fairfax County, a deck, a finished basement, a bathroom or kitchen remodel, and any addition need a building permit from Land Development Services. Swapping cabinets or countertops, replacing windows and doors in the same openings, re-siding with a similar material, and replacing roof shingles are listed as not needing one. New, moved, or repaired electrical, plumbing, and mechanical fixtures need trade permits. In the Towns of Vienna and Clifton, the town reviews the project too.',
  jurisdictionIntro:
    'Fairfax County Land Development Services (LDS) issues building permits for the unincorporated county and for the Towns of Vienna and Clifton, but those towns add their own zoning or approval step. The Town of Herndon, the City of Fairfax, and the City of Falls Church run their own permit offices, so if your address is in one of them, start there.',
  issuers: [
    {
      name: 'Fairfax County Land Development Services',
      covers:
        'Residential building and trade permits, applied for online in PLUS. Permit types include addition/alteration, miscellaneous, and electrical, mechanical, and plumbing.',
      sources: ['ffx-residential'],
    },
    {
      name: 'Town of Vienna',
      covers:
        'Fairfax County issues the building permit and the Town reviews zoning. Decks, patios, additions, and larger accessory structures need Town review, and fences need Town approval even though no county building permit is required.',
      sources: ['vienna-residential', 'ffx-addition'],
    },
    {
      name: 'Town of Clifton',
      covers:
        'The Town lists a town use permit, an Architectural Review Board certificate, and a signature from the mayor or a designated representative before the county will issue the building permit. Confirm with the town what your project needs.',
      sources: ['clifton-faq', 'ffx-addition'],
    },
  ],
  jobs: [
    {
      job: 'Deck',
      verdict: 'required',
      summary:
        'Required, including changes to an existing deck. A wood or paver patio built directly on the ground is not a deck and is exempt.',
      sources: ['ffx-when', 'ffx-addition'],
      service: 'decks',
    },
    {
      job: 'Finished basement',
      verdict: 'required',
      summary:
        'Required. Finishing a basement is listed as an interior alteration that needs a building permit, plus trade permits for new electrical, plumbing, or mechanical work.',
      sources: ['ffx-when'],
      service: 'basements',
    },
    {
      job: 'Bathroom remodel',
      verdict: 'required',
      summary:
        'Required for a remodel. Replacing a vanity or countertop by itself is not on the permit-required list, and a like-for-like fixture swap in the same location is exempt from trade permits.',
      sources: ['ffx-when'],
      service: 'bathrooms',
    },
    {
      job: 'Kitchen remodel',
      verdict: 'required',
      summary:
        'Required for a renovation. New cabinets or countertops alone are listed as not needing a permit. Moving or adding plumbing, electrical, or gas fixtures needs trade permits.',
      sources: ['ffx-when'],
      service: 'kitchens',
    },
    {
      job: 'Roof replacement',
      verdict: 'depends',
      summary:
        'Replacing shingles is listed as not needing a permit, and so is replacing a small amount of roof sheathing unless it has to be fire rated, as on many townhomes. Roof repairs and re-roofing beyond that appear on the county’s permit lists, so check with LDS for your scope.',
      sources: ['ffx-when', 'ffx-misc'],
      service: 'roofing',
    },
    {
      job: 'Siding',
      verdict: 'often-exempt',
      summary: 'Re-siding with a similar material is listed as not needing a permit.',
      sources: ['ffx-when'],
      service: 'siding',
    },
    {
      job: 'Windows and doors',
      verdict: 'depends',
      summary:
        'Replacing a window or door in the existing opening is exempt. Cutting a new opening needs a permit.',
      sources: ['ffx-when'],
    },
    {
      job: 'Addition, screened porch, or sunroom',
      verdict: 'required',
      summary:
        'Required. The county lists garages, carports, porches, and second-story additions as additions that need a permit.',
      sources: ['ffx-when', 'ffx-addition'],
      service: 'additions',
    },
    {
      job: 'Patio on grade',
      verdict: 'often-exempt',
      summary:
        'An on-grade paver or concrete patio does not need a building permit. Zoning setbacks and other site rules can still apply.',
      sources: ['ffx-when'],
      service: 'outdoor-living',
    },
    {
      job: 'Shed or fence',
      verdict: 'depends',
      summary:
        'A detached one-story shed up to the county’s size limit is exempt, and so are most fences, except a fence that serves as a pool barrier. Zoning height and setback rules still apply, so confirm before you build.',
      sources: ['ffx-when', 'ffx-zoning-faq'],
    },
  ],
  steps: [
    {
      text: 'Check zoning, setbacks, and whether the job disturbs enough land to need a grading plan.',
      sources: ['ffx-when', 'ffx-addition'],
    },
    {
      text: 'Apply online in PLUS with the drawings and a plat or site plan, plus any Town of Vienna or Clifton approval.',
      sources: ['ffx-addition'],
    },
    {
      text: 'Answer plan reviewer comments, then download the issued permit and approved plans.',
      sources: ['ffx-addition', 'ffx-misc'],
    },
    {
      text: 'Add the electrical, plumbing, and mechanical permits, which are issued after the building permit.',
      sources: ['ffx-misc'],
    },
    { text: 'Schedule inspections at each stage through final.', sources: ['ffx-addition'] },
  ],
  hoa: {
    text: 'Fairfax County does not enforce private covenants or deed restrictions, so a county permit is not HOA approval. If you have an HOA, get its architectural approval as its own step.',
    sources: ['ffx-zoning-faq'],
  },
  historic: {
    text: 'In a county Historic Overlay District, the Architectural Review Board reviews exterior work that needs a building permit.',
    sources: ['ffx-hod'],
  },
  faqs: [
    {
      question: 'Do I need a permit to build a deck in Fairfax County?',
      answer:
        'Yes. Fairfax County requires a building permit for a new deck and for changes to an existing one. An on-grade patio is exempt.',
    },
    {
      question: 'Do I need a permit to finish a basement in Fairfax County?',
      answer:
        'Yes. A finished basement is an interior alteration that needs a building permit, plus trade permits for new electrical, plumbing, or mechanical work.',
    },
    {
      question: 'Can I replace my windows in Fairfax County without a permit?',
      answer:
        'A direct replacement in the existing opening is listed as exempt. A new opening needs a permit.',
    },
    {
      question: 'Does Fairfax County check my HOA approval?',
      answer:
        'No. The county does not enforce private covenants, so HOA approval is a separate step you handle with your association.',
    },
  ],
  sourceIds: [
    'ffx-when',
    'ffx-residential',
    'ffx-addition',
    'ffx-misc',
    'ffx-zoning-faq',
    'ffx-hod',
    'vienna-residential',
    'clifton-faq',
  ],
  areaSlugs: [
    'fairfax-county-va',
    'mclean-va',
    'great-falls-va',
    'vienna-va',
    'oakton-va',
    'reston-va',
    'clifton-va',
    'fairfax-station-va',
  ],
  relatedPosts: [],
};

const ARLINGTON: CountyPermitGuide = {
  slug: 'arlington-county-va',
  county: 'Arlington County',
  state: 'VA',
  stateName: 'Virginia',
  h1: 'Do I Need a Permit to Remodel in Arlington County, VA?',
  seoTitle: 'Arlington County Remodel Permits: Deck, Basement, Bath',
  description:
    'Which Arlington County remodels need a permit: decks, basements, kitchens, baths, roofs, and additions. How Permit Arlington works, the steps, and historic review.',
  cardBlurb:
    'Additions, decks, and most alterations need a permit through Permit Arlington. Same-spot fixture swaps and most roof covering replacements don’t.',
  keywords: [
    'Arlington County deck permit',
    'Arlington VA building permit',
    'Permit Arlington',
    'do I need a permit Arlington VA',
  ],
  published: PUBLISHED,
  updated: PUBLISHED,
  answer:
    'In Arlington County, additions and alterations to a house need a building permit, applied for online through Permit Arlington. Decks need one, and exterior changes are treated as additions. Replacing cabinets, fixtures, or appliances that don’t burn gas or oil, in the same spot and without moving pipes or drywall, does not. Replacing roof covering usually does not either, unless you replace more than a limited amount of roof decking or the roof originally required fire-retardant-treated lumber.',
  jurisdictionIntro:
    'Arlington County runs residential permitting through the Permit Arlington online portal, and residential applications have to be submitted online.',
  issuers: [
    {
      name: 'Arlington County building permits (Permit Arlington)',
      covers:
        'Residential building permits, plus the mechanical, electrical, and plumbing permits most projects also need, all applied for in Permit Arlington.',
      sources: ['arl-residential', 'arl-review'],
    },
  ],
  jobs: [
    {
      job: 'Deck',
      verdict: 'required',
      summary:
        'Required. The county wants a scaled plat with setbacks, a framing plan, and footing details; higher decks also need elevations and lot coverage information. Changing an existing deck counts as an addition.',
      sources: ['arl-residential'],
      service: 'decks',
    },
    {
      job: 'Finished basement',
      verdict: 'required',
      summary:
        'Finishing a basement is an alteration to the house, and Arlington requires a permit for alterations. A new egress window well counts as an addition.',
      sources: ['arl-residential'],
      service: 'basements',
    },
    {
      job: 'Bathroom remodel',
      verdict: 'depends',
      summary:
        'Replacing fixtures or cabinets in the same location, without moving pipes or drywall, needs no permit. Moving plumbing, opening walls, or changing the layout is an alteration that does.',
      sources: ['arl-residential'],
      service: 'bathrooms',
    },
    {
      job: 'Kitchen remodel',
      verdict: 'depends',
      summary:
        'Same rule as bathrooms: same-spot cabinet, fixture, and appliance swaps are exempt, as long as the appliance isn’t gas- or oil-fueled. Gas or oil appliances, relocated pipes, or new drywall take it out of the exemption.',
      sources: ['arl-residential'],
      service: 'kitchens',
    },
    {
      job: 'Roof replacement',
      verdict: 'depends',
      summary:
        'New roof covering with no decking work, or with only a limited amount of decking replaced, needs no permit. Replacing more decking than that needs one, and a roof that originally required fire-retardant-treated lumber, as on townhouses, always does.',
      sources: ['arl-residential'],
      service: 'roofing',
    },
    {
      job: 'Siding, windows, and doors',
      verdict: 'often-exempt',
      summary:
        'Arlington points to the Virginia USBC exemption list. Under it, siding replacement on a house is exempt where the design wind speed is 100 mph or less, and window and door replacements are exempt when they have similar operation and opening size, need no change to the framed opening, and don’t have to be fire rated. Arlington’s pages don’t spell these jobs out, so confirm with the county.',
      sources: ['arl-residential', 'va-usbc-108'],
      service: 'siding',
    },
    {
      job: 'Addition, screened porch, or sunroom',
      verdict: 'required',
      summary:
        'Required, with a full plan submission. Arlington treats exterior alterations as additions for permit purposes.',
      sources: ['arl-residential'],
      service: 'additions',
    },
    {
      job: 'Fence or retaining wall',
      verdict: 'depends',
      summary:
        'The state exemption list covers fences of any height except pool barriers and safety fences. A standalone retaining wall goes through Arlington’s separate fence or retaining wall permit. Zoning sets fence heights, so check before you build.',
      sources: ['arl-residential', 'va-usbc-108'],
    },
  ],
  steps: [
    { text: 'Apply online in Permit Arlington with plans and a plat.', sources: ['arl-residential'] },
    {
      text: 'Staff check the application for completeness, then the relevant reviewers review the plans.',
      sources: ['arl-review'],
    },
    {
      text: 'Contractor information is verified, fees are paid, and the permit and placard are posted at the site.',
      sources: ['arl-review'],
    },
    {
      text: 'Add the mechanical, electrical, and plumbing permits the job needs, then schedule each inspection.',
      sources: ['arl-review'],
    },
  ],
  hoa: {
    text: 'Arlington’s residential permit page doesn’t address HOA or condo association approval. If your home is in an association, treat its approval as a separate step and check your governing documents before you apply.',
    sources: ['arl-residential'],
  },
  historic: {
    text: 'In a local historic district, exterior alterations need a Certificate of Appropriateness from the Historical Affairs and Landmark Review Board, and the approved plans go in with the building permit. Routine maintenance, like-for-like repairs, and interior work are exempt.',
    sources: ['arl-coa', 'arl-residential'],
  },
  faqs: [
    {
      question: 'Do I need a permit to build a deck in Arlington, VA?',
      answer:
        'Yes. Arlington requires a permit for a new deck, and changing an existing deck counts as an addition. Home-center deck plans are generally not accepted.',
    },
    {
      question: 'Do I need a permit to replace my kitchen cabinets in Arlington?',
      answer:
        'No, if the cabinets, fixtures, and appliances (not gas- or oil-fueled) go back in the same spot and no pipes or drywall move. Beyond that, it is an alteration that needs a permit.',
    },
    {
      question: 'Who should hold the permit, me or my contractor?',
      answer:
        'An owner can apply for their own permit. When the applicant isn’t the owner and the permit holder isn’t a Virginia-licensed contractor for the work, Arlington requires a Permit Authorization Affidavit.',
    },
  ],
  sourceIds: ['arl-residential', 'arl-review', 'arl-coa', 'arl-affidavit', 'va-usbc-108'],
  areaSlugs: ['arlington-va'],
  relatedPosts: [],
};

const LOUDOUN: CountyPermitGuide = {
  slug: 'loudoun-county-va',
  county: 'Loudoun County',
  state: 'VA',
  stateName: 'Virginia',
  h1: 'Do I Need a Permit to Remodel in Loudoun County, VA?',
  seoTitle: 'Loudoun County Remodel Permits: Deck, Basement, Bath',
  description:
    'Which Loudoun County remodels need a permit: decks, basements, additions, kitchens, baths, roofs. County vs. town zoning, the LandMARC steps, and the HOA note.',
  cardBlurb:
    'Every deck needs building and zoning permits. Basements and additions do too. Inside the seven towns, town zoning comes first.',
  keywords: [
    'Loudoun County deck permit',
    'Loudoun County basement permit',
    'Loudoun County building permit',
    'do I need a permit Loudoun County',
  ],
  published: PUBLISHED,
  updated: PUBLISHED,
  answer:
    'In Loudoun County, every deck needs a building permit and a zoning permit. Finished basements, additions (including screened porches), and alterations need a building permit plus trade permits. The Department of Building and Development issues building permits countywide through LandMARC. If you live in one of the seven incorporated towns, get the town’s zoning approval first and submit it with the county application.',
  jurisdictionIntro:
    'Loudoun’s Department of Building and Development issues building permits for the whole county, including the towns, but it issues zoning permits only outside the towns. The seven incorporated towns are Hamilton, Hillsboro, Leesburg, Lovettsville, Middleburg, Purcellville, and Round Hill. Anywhere else in the county, Loudoun handles zoning as well as the building permit.',
  issuers: [
    {
      name: 'Loudoun County Department of Building and Development',
      covers:
        'Building, grading, and trade permits countywide, and zoning permits outside the incorporated towns. Applications, plan uploads, payments, and inspection requests run through LandMARC.',
      sources: ['ldn-permitting', 'ldn-landmarc', 'ldn-construction'],
    },
    {
      name: 'Town zoning offices (Leesburg, Purcellville, Middleburg, and the other towns)',
      covers:
        'Inside a town, county zoning rules don’t apply. Contact the town zoning office first; the county application then needs the approved town zoning permit attached.',
      sources: ['ldn-towns', 'ldn-zoning', 'ldn-decks'],
    },
  ],
  jobs: [
    {
      job: 'Deck',
      verdict: 'required',
      summary:
        'Every deck needs a building permit and a zoning permit. Simple single-level attached decks can use the county’s Typical Deck Detail; detached decks and decks with a roof, screen, hot tub, or gazebo need their own plans. Expect footing, framing, and final inspections.',
      sources: ['ldn-decks'],
      service: 'decks',
    },
    {
      job: 'Finished basement',
      verdict: 'required',
      summary:
        'Needs a building permit and a zoning permit, plus trade permits. The county’s Typical Finished Basement details can stand in for custom drawings unless the work changes a load-bearing wall, an exterior wall, a beam, or a column. A kitchen in the basement needs zoning approval.',
      sources: ['ldn-basements'],
      service: 'basements',
    },
    {
      job: 'Bathroom or kitchen remodel',
      verdict: 'depends',
      summary:
        'Loudoun treats changes to an existing home as alterations that need a building permit and trade permits. Under the state exemption list, swapping plumbing fixtures without altering supply, drain, or vent lines, and replacing cabinets, flooring, or trim, don’t need a permit.',
      sources: ['ldn-additions', 'va-usbc-108'],
      service: 'bathrooms',
    },
    {
      job: 'Addition, screened porch, or sunroom',
      verdict: 'required',
      summary:
        'Required, with a plat and structural plans. Loudoun counts a screened porch as an addition. A new bedroom on a well and septic system needs Health Department approval too.',
      sources: ['ldn-additions'],
      service: 'additions',
    },
    {
      job: 'Roof, siding, windows, and doors',
      verdict: 'check',
      summary:
        'Loudoun’s pages don’t list these jobs. The Virginia USBC exempts roof covering and siding replacement on a house where the design wind speed is 100 mph or less, and window and door replacement with similar operation and opening size, no change to the framed opening, and no fire rating required, but a building official can still require a permit in a historic district. Call the county to confirm for your address.',
      sources: ['va-usbc-108', 'ldn-construction'],
      service: 'roofing',
    },
    {
      job: 'Shed',
      verdict: 'depends',
      summary:
        'A shed up to the county’s size limit needs a zoning-only permit. A larger shed needs a building permit and zoning.',
      sources: ['ldn-sheds'],
    },
  ],
  steps: [
    {
      text: 'If you’re inside an incorporated town, get the town zoning permit first.',
      sources: ['ldn-zoning', 'ldn-decks'],
    },
    {
      text: 'Apply in LandMARC (or on paper) with the owner-signed application, plat, and plans or the county’s Typical details.',
      sources: ['ldn-basements', 'ldn-additions', 'ldn-landmarc'],
    },
    {
      text: 'The county reviews the application and tells you when the permit is ready; fees are paid then. Don’t start work until it’s issued.',
      sources: ['ldn-basements'],
    },
    {
      text: 'Apply for the plumbing, electrical, gas, and mechanical trade permits separately in LandMARC.',
      sources: ['ldn-construction'],
    },
    {
      text: 'Request inspections in LandMARC ahead of time, and keep the approved plans on site for the inspector.',
      sources: ['ldn-decks', 'ldn-basements'],
    },
  ],
  hoa: {
    text: 'Loudoun’s permitting page puts it on the applicant to contact the HOA or POA for any extra requirements or approval. A county permit doesn’t replace that approval, so run your HOA review alongside the permit.',
    sources: ['ldn-permitting'],
  },
  historic: {
    text: 'In a county historic district, you need a Certificate of Appropriateness before permits are issued. Town historic districts, such as Leesburg’s, have their own review.',
    sources: ['ldn-zoning'],
  },
  faqs: [
    {
      question: 'Do I need a permit for a deck in Loudoun County?',
      answer:
        'Yes. Every deck in Loudoun County needs both a building permit and a zoning permit. Inside a town, the zoning approval comes from the town.',
    },
    {
      question: 'Do I need a permit to finish my basement in Ashburn?',
      answer:
        'Yes. Ashburn is not one of the incorporated towns, so you apply to Loudoun County for both building and zoning permits, plus trade permits for electrical, plumbing, and mechanical work.',
    },
    {
      question: 'Is a screened porch a deck or an addition in Loudoun?',
      answer:
        'An addition. Loudoun’s Typical Deck Detail excludes roofed and screened decks, and the county lists screened porches under additions.',
    },
  ],
  sourceIds: [
    'ldn-permitting',
    'ldn-construction',
    'ldn-landmarc',
    'ldn-decks',
    'ldn-basements',
    'ldn-additions',
    'ldn-sheds',
    'ldn-towns',
    'ldn-zoning',
    'va-usbc-108',
  ],
  areaSlugs: [
    'loudoun-county-va',
    'leesburg-va',
    'ashburn-va',
    'middleburg-va',
    'purcellville-va',
    'south-riding-va',
    'lansdowne-va',
  ],
  relatedPosts: [
    'loudoun-county-permits-hoa-guide-2026',
    'basement-in-law-suite-vs-home-addition-loudoun-county-2026',
  ],
};

/* -------------------------------------------------------------------------- */
/*  Maryland                                                                  */
/* -------------------------------------------------------------------------- */

const MONTGOMERY: CountyPermitGuide = {
  slug: 'montgomery-county-md',
  county: 'Montgomery County',
  state: 'MD',
  stateName: 'Maryland',
  h1: 'Do I Need a Permit to Remodel in Montgomery County, MD?',
  seoTitle: 'Montgomery County Remodel Permits: Deck, Basement, Bath',
  description:
    'Which Montgomery County, MD remodels need a permit: decks, basements, baths, kitchens, fences, sheds. DPS vs. Rockville and Gaithersburg, WSSC, HOA, and HAWP.',
  cardBlurb:
    'Decks, fences, sheds, and basement alterations need a DPS permit. Roof covering, siding, and window swaps that keep the same opening usually don’t. Plumbing goes through WSSC Water.',
  keywords: [
    'Montgomery County deck permit',
    'Montgomery County MD basement permit',
    'Montgomery County DPS permit',
    'do I need a permit Montgomery County MD',
  ],
  published: PUBLISHED,
  updated: PUBLISHED,
  answer:
    'In Montgomery County, Maryland, the Department of Permitting Services (DPS) issues building permits for decks, fences, sheds and other accessory structures, additions, and renovations beyond repairs such as a basement finish. Replacing roof covering, siding, cabinets, and windows or doors with the same opening size and net clear opening is listed as most likely not needing a permit, and neither do patios. Plumbing and gas permits come from WSSC Water. The Cities of Rockville and Gaithersburg issue their own building permits.',
  jurisdictionIntro:
    'DPS covers most of the county, but not the Cities of Rockville or Gaithersburg, which run their own permit offices. Some municipalities that use DPS, such as Takoma Park and the Town of Chevy Chase, add their own letter or permit on top of the county permit. If you aren’t sure whether your address is inside a municipality, check before you apply.',
  issuers: [
    {
      name: 'Montgomery County Department of Permitting Services (DPS)',
      covers:
        'Building, electrical, and mechanical permits, applied for online through DPS eServices with plans uploaded through ePlans.',
      sources: ['mc-dps', 'mc-decks', 'mc-electrical'],
    },
    {
      name: 'WSSC Water',
      covers:
        'Plumbing and gas-fitting permits in Montgomery County. Most plumbing and gas work has to be done by a WSSC-licensed plumber or gasfitter.',
      sources: ['wssc-homeowners', 'mc-home'],
    },
    {
      name: 'City of Rockville and City of Gaithersburg',
      covers:
        'These cities issue their own building and trade permits. DPS does not issue building permits there.',
      sources: ['rockville-permits', 'mc-not-cities'],
    },
    {
      name: 'Takoma Park, Town of Chevy Chase, and other municipalities',
      covers:
        'DPS issues the building permit, but some municipalities add their own step. Takoma Park requires a municipality letter for projects that need a DPS permit, and the Town of Chevy Chase requires its own building permit after the county’s.',
      sources: ['takoma-letters', 'toc-permits', 'mc-alterations'],
    },
  ],
  jobs: [
    {
      job: 'Deck',
      verdict: 'required',
      summary:
        'Required. A single-level, single-span deck with no roof, screened porch, hot tub, or other added loads can use the county’s Deck Details instead of custom plans. An electrical permit may be needed for lighting or a hot tub.',
      sources: ['mc-decks'],
      service: 'decks',
    },
    {
      job: 'Finished basement',
      verdict: 'required',
      summary:
        'A basement finish is a renovation that needs a building permit, plus electrical and mechanical permits from DPS and plumbing from WSSC as needed. Basement alterations without a kitchen can qualify for the county’s Fast Track process.',
      sources: ['mc-alterations', 'mc-fasttrack'],
      service: 'basements',
    },
    {
      job: 'Bathroom or kitchen remodel',
      verdict: 'depends',
      summary:
        'Painting, flooring, tile, countertops, cabinets, and replacing a faucet don’t need a permit when nothing structural changes. A renovation beyond repair needs a building permit, and trade permits are often required. Work on load-bearing walls goes through regular review, not Fast Track.',
      sources: ['mc-home', 'mc-alterations', 'mc-fasttrack'],
      service: 'kitchens',
    },
    {
      job: 'Roof and siding',
      verdict: 'often-exempt',
      summary: 'Replacing roof covering only, and replacing siding, are listed as most likely not needing a permit.',
      sources: ['mc-home'],
      service: 'roofing',
    },
    {
      job: 'Windows and doors',
      verdict: 'depends',
      summary:
        'Replacement is listed as most likely not needing a permit when the opening size and net clear opening stay the same. Changing the opening is a different job, so check with DPS.',
      sources: ['mc-home'],
    },
    {
      job: 'Addition, screened porch, or sunroom',
      verdict: 'required',
      summary:
        'Additions are on the county’s list of work that likely needs a permit. Screened porches are excluded from Fast Track, so they go through regular review.',
      sources: ['mc-home', 'mc-fasttrack'],
      service: 'additions',
    },
    {
      job: 'Fence',
      verdict: 'required',
      summary:
        'New or altered fences need a permit. Swapping in the same kind of fence, in the same spot and at the same height, is exempt only if the original fence had a permit.',
      sources: ['mc-fence', 'mc-home'],
    },
    {
      job: 'Patio or shed',
      verdict: 'depends',
      summary:
        'Patios are listed as most likely not needing a permit. Sheds and other accessory structures do need one, and small sheds can qualify for Fast Track.',
      sources: ['mc-home', 'mc-accessory', 'mc-fasttrack'],
      service: 'outdoor-living',
    },
  ],
  steps: [
    {
      text: 'Confirm whether your address is in Rockville, Gaithersburg, or a municipality with its own step.',
      sources: ['mc-alterations', 'takoma-letters'],
    },
    {
      text: 'Apply online through DPS eServices and upload plans in ePlans.',
      sources: ['mc-decks', 'mc-dps'],
    },
    {
      text: 'Plan review and zoning review; upload corrections if reviewers ask, then pay and receive the permit.',
      sources: ['mc-decks', 'mc-alterations'],
    },
    {
      text: 'Add electrical and mechanical permits from DPS and plumbing or gas permits from WSSC Water.',
      sources: ['mc-electrical', 'wssc-homeowners'],
    },
    {
      text: 'Build to the approved drawings and request inspections ahead of time through final.',
      sources: ['mc-decks'],
    },
  ],
  hoa: {
    text: 'Montgomery County does not enforce covenants or deed restrictions, so a DPS permit is not HOA approval. Check with your association before you build.',
    sources: ['mc-decks', 'mc-alterations'],
  },
  historic: {
    text: 'For a designated historic site or a home in a historic district, substantive exterior changes such as additions, or replacing windows, doors, or porches, need a Historic Area Work Permit (HAWP). A HAWP does not replace the building permit; the approved plans go in with the DPS application. Interior work and ordinary maintenance don’t need one.',
    sources: ['mc-hawp'],
  },
  faqs: [
    {
      question: 'Do I need a permit to build a deck in Montgomery County, MD?',
      answer:
        'Yes. DPS requires a building permit for a deck. A single-level, single-span deck with no roof, screen, hot tub, or other added loads can use the county’s Deck Details instead of custom plans.',
    },
    {
      question: 'Do I need a permit to replace my roof in Montgomery County?',
      answer:
        'Replacing the roof covering only is listed as most likely not needing a permit. Structural roof work is a different question for DPS.',
    },
    {
      question: 'Who issues plumbing permits in Montgomery County?',
      answer: 'WSSC Water, not DPS. Most plumbing and gas work has to be done by a WSSC-licensed plumber or gasfitter.',
    },
    {
      question: 'I live in Rockville. Does DPS issue my permit?',
      answer: 'No. The City of Rockville issues its own building and trade permits, and so does Gaithersburg.',
    },
  ],
  sourceIds: [
    'mc-dps',
    'mc-home',
    'mc-decks',
    'mc-alterations',
    'mc-fasttrack',
    'mc-fence',
    'mc-accessory',
    'mc-hawp',
    'mc-electrical',
    'mc-not-cities',
    'wssc-homeowners',
    'rockville-permits',
    'takoma-letters',
    'toc-permits',
  ],
  areaSlugs: [
    'bethesda-md',
    'potomac-md',
    'north-potomac-md',
    'chevy-chase-md',
    'rockville-md',
    'olney-md',
    'silver-spring-md',
    'takoma-park-md',
  ],
  relatedPosts: [],
};

const HOWARD: CountyPermitGuide = {
  slug: 'howard-county-md',
  county: 'Howard County',
  state: 'MD',
  stateName: 'Maryland',
  h1: 'Do I Need a Permit to Remodel in Howard County, MD?',
  seoTitle: 'Howard County Remodel Permits: Deck, Basement, Bath',
  description:
    'Which Howard County, MD remodels need a permit: decks, basements, additions, sheds, fences, plumbing. How DILP permits work, the steps, HOA letters, historic review.',
  cardBlurb:
    'Nearly every deck needs a permit, and so do basement finishes and additions. Small sheds and deck-board swaps don’t. One county office covers Ellicott City and Columbia.',
  keywords: [
    'Howard County deck permit',
    'Howard County MD building permit',
    'Ellicott City permit',
    'do I need a permit Howard County MD',
  ],
  published: PUBLISHED,
  updated: PUBLISHED,
  answer:
    'In Howard County, Maryland, the Department of Inspections, Licenses and Permits (DILP) issues building, electrical, plumbing, and HVAC permits. Every deck except a very small one needs a permit, and so do finished basements, additions, screened porches, and sheds over the county’s size limit. Replacing deck boards is ordinary repair, but replacing railings needs a permit. Plumbing work needs a plumbing permit. Howard County has no incorporated towns, so the county handles Ellicott City, Columbia, and Clarksville addresses.',
  jurisdictionIntro:
    'Howard County has no incorporated municipalities; county government provides local services everywhere, including Ellicott City, Columbia, and Clarksville. Building permits come from DILP, and zoning questions go to the Department of Planning and Zoning.',
  issuers: [
    {
      name: 'Howard County Department of Inspections, Licenses and Permits (DILP)',
      covers:
        'Building, electrical, plumbing, and HVAC permits for the whole county. Residential building permits are submitted electronically through the county’s online permitting system.',
      sources: ['hc-dilp', 'hc-getstarted', 'md-manual-howard'],
    },
  ],
  jobs: [
    {
      job: 'Deck',
      verdict: 'required',
      summary:
        'Required for every deck except a very small one. Replacing only the deck boards counts as ordinary repair, but replacing handrails or guardrails needs a permit even with the same product.',
      sources: ['hc-dilp', 'hc-memo'],
      service: 'decks',
    },
    {
      job: 'Finished basement',
      verdict: 'required',
      summary:
        'Needs a building permit as an interior alteration, with existing and proposed floor plans. A new basement needs an emergency escape window or door.',
      sources: ['hc-handout', 'hc-inspections'],
      service: 'basements',
    },
    {
      job: 'Kitchen or bathroom remodel',
      verdict: 'depends',
      summary:
        'Removing a load-bearing wall makes it an interior alteration that needs a permit and engineer calculations. Plumbing work needs a plumbing permit, generally pulled by a master plumber; the county also has a homeowner plumbing application for qualifying owners. The county’s pages don’t settle cosmetic-only remodels, so check with DILP.',
      sources: ['hc-handout', 'hc-dilp', 'hc-homeowner-plumbing'],
      service: 'kitchens',
    },
    {
      job: 'Addition, screened porch, or sunroom',
      verdict: 'required',
      summary: 'Required, with plans. Screened porches need plans at any size.',
      sources: ['hc-handout', 'hc-memo'],
      service: 'additions',
    },
    {
      job: 'Shed',
      verdict: 'depends',
      summary:
        'Sheds over the county’s size limit need a building permit, and larger ones need frost footings. Setbacks come from Planning and Zoning.',
      sources: ['hc-dilp'],
    },
    {
      job: 'Fence',
      verdict: 'depends',
      summary:
        'The county’s permit handout lists fence permits for tall fences and fences around a pool. Zoning rules for height and setbacks are separate.',
      sources: ['hc-handout'],
    },
    {
      job: 'Roof, siding, windows, and doors',
      verdict: 'check',
      summary:
        'We couldn’t find an official Howard County page that settles these jobs either way. Ask DILP before you start.',
      sources: ['hc-dilp'],
      service: 'roofing',
    },
  ],
  steps: [
    {
      text: 'Apply online through the county’s permitting system with a plot plan and construction plans.',
      sources: ['hc-getstarted', 'hc-handout'],
    },
    {
      text: 'Upload a condo or HOA approval letter when it applies.',
      sources: ['hc-handout'],
    },
    {
      text: 'Plan review, then the permit is issued.',
      sources: ['hc-handout'],
    },
    {
      text: 'Inspections at each stage, such as footing, framing, and final.',
      sources: ['hc-inspections', 'hc-handout'],
    },
  ],
  hoa: {
    text: 'Howard County’s permit handout asks for a condo or HOA approval letter with the application when one applies, so get your association’s approval before you apply.',
    sources: ['hc-handout'],
  },
  historic: {
    text: 'In the Ellicott City and Lawyers Hill historic districts, exterior work needs a Certificate of Approval from the Historic Preservation Commission.',
    sources: ['hc-hpc'],
  },
  faqs: [
    {
      question: 'Do I need a permit to build a deck in Howard County?',
      answer:
        'Yes, for all but very small decks. Replacing only the deck boards is ordinary repair, but new railings need a permit.',
    },
    {
      question: 'Do I need a permit to finish my basement in Ellicott City?',
      answer:
        'Yes. Ellicott City is part of unincorporated Howard County, so you apply to DILP for a building permit and the trade permits the work needs.',
    },
    {
      question: 'Do I need my HOA’s approval before applying?',
      answer:
        'If it applies to your home, yes. The county asks for a condo or HOA approval letter with the permit application.',
    },
  ],
  sourceIds: [
    'hc-dilp',
    'hc-getstarted',
    'hc-handout',
    'hc-memo',
    'hc-inspections',
    'hc-hpc',
    'hc-homeowner-plumbing',
    'md-manual-howard',
  ],
  areaSlugs: ['ellicott-city-md', 'clarksville-md', 'columbia-md'],
  relatedPosts: [],
};

const FREDERICK: CountyPermitGuide = {
  slug: 'frederick-county-md',
  county: 'Frederick County',
  state: 'MD',
  stateName: 'Maryland',
  h1: 'Do I Need a Permit to Remodel in Frederick County, MD?',
  seoTitle: 'Frederick County Remodel Permits: Deck, Basement, Bath',
  description:
    'Which Frederick County, MD remodels need a permit: decks, basements, additions, sheds, plumbing. County vs. City of Frederick, the portal steps, historic review.',
  cardBlurb:
    'Decks need a permit even for a same-size replacement. Cosmetic work doesn’t. The City of Frederick and Mount Airy run their own permits.',
  keywords: [
    'Frederick County deck permit',
    'Frederick County MD building permit',
    'Frederick MD basement permit',
    'do I need a permit Frederick County MD',
  ],
  published: PUBLISHED,
  updated: PUBLISHED,
  answer:
    'In Frederick County, Maryland, new construction, alterations, and accessory structures like decks need approval from the county’s Department of Permits and Inspections. A deck needs a permit even if you replace it at the same size. Painting, flooring, cabinets, and countertops don’t. New plumbing needs a plumbing permit. The City of Frederick and the Town of Mount Airy issue their own building permits, and the other towns require town zoning paperwork before the county permit.',
  jurisdictionIntro:
    'Frederick County’s Department of Permits and Inspections, in the Division of Planning and Permitting, issues building, electrical, and plumbing permits and zoning certificates. Inside the City of Frederick or the Town of Mount Airy, the city or town issues the building permit. In the county’s other incorporated towns, you get the town’s zoning paperwork first.',
  issuers: [
    {
      name: 'Frederick County Department of Permits and Inspections',
      covers:
        'Building, electrical, and plumbing permits and zoning certificates outside the City of Frederick and Mount Airy, through the Planning and Permitting online portal.',
      sources: ['fred-permits', 'fred-application', 'fred-plumbing'],
    },
    {
      name: 'City of Frederick and Town of Mount Airy',
      covers: 'Issue their own building permits for addresses inside their limits.',
      sources: ['fred-permits', 'city-frederick-residential'],
    },
    {
      name: 'Other incorporated towns',
      covers: 'A town zoning certificate or town paperwork is required before you apply to the county.',
      sources: ['fred-permits', 'fred-application'],
    },
  ],
  jobs: [
    {
      job: 'Deck',
      verdict: 'required',
      summary:
        'Required, even to replace a deck at the same size. Smaller one-level decks can qualify for the county’s expedited review.',
      sources: ['fred-faq', 'fred-expedited'],
      service: 'decks',
    },
    {
      job: 'Finished basement',
      verdict: 'required',
      summary:
        'Needs a building permit, with separate electrical and plumbing permits for that work. A basement finish without a kitchen can qualify for expedited review.',
      sources: ['fred-expedited', 'fred-application'],
      service: 'basements',
    },
    {
      job: 'Bathroom or kitchen remodel',
      verdict: 'depends',
      summary:
        'Painting, wallpaper, flooring, cabinets, and countertops don’t need a permit. New plumbing does, and so does replacing fixtures with something different or moving pipes. Alterations to the house need a building permit.',
      sources: ['fred-faq', 'fred-permits'],
      service: 'bathrooms',
    },
    {
      job: 'Addition, screened porch, or sunroom',
      verdict: 'required',
      summary:
        'Required. Some smaller one-story additions and covered or screened porches with a truss roof can qualify for expedited review.',
      sources: ['fred-permits', 'fred-expedited'],
      service: 'additions',
    },
    {
      job: 'Shed',
      verdict: 'depends',
      summary:
        'A small accessory structure under the county’s size limit doesn’t need a building permit, but may still need a zoning certificate. Larger ones need a building permit.',
      sources: ['fred-faq', 'fred-application'],
    },
    {
      job: 'Fence',
      verdict: 'often-exempt',
      summary:
        'Outside the towns and the City of Frederick, county zoning doesn’t require a zoning certificate for a fence. Setback and height rules still apply, and towns can differ.',
      sources: ['fred-faq'],
    },
    {
      job: 'Roof, siding, windows, and doors',
      verdict: 'check',
      summary:
        'We couldn’t find an official Frederick County page that settles these jobs either way. Check with the Department of Permits and Inspections before you start.',
      sources: ['fred-permits'],
      service: 'roofing',
    },
  ],
  steps: [
    {
      text: 'If you’re in an incorporated town, get the town’s zoning paperwork first.',
      sources: ['fred-permits'],
    },
    {
      text: 'Apply through the county’s Planning and Permitting portal with a plot plan and construction plans.',
      sources: ['fred-application'],
    },
    {
      text: 'Zoning and building plan reviewers, and other agencies as needed, review the application.',
      sources: ['fred-application'],
    },
    {
      text: 'Electrical and plumbing permits are separate applications by licensed trades or a qualifying resident owner.',
      sources: ['fred-plumbing', 'fred-application'],
    },
    {
      text: 'Request inspections in the portal; the permit closes with a Certificate of Completion.',
      sources: ['fred-application'],
    },
  ],
  hoa: {
    text: 'Frederick County’s permit pages don’t address HOAs. If your home is in an association, get its approval as a separate step and check your covenants before you apply.',
    sources: ['fred-permits'],
  },
  historic: {
    text: 'The City of Frederick runs its own historic district review for exterior work inside the city. Elsewhere, ask the county permit office whether your property is on the county historic register before you plan exterior changes.',
    sources: ['city-frederick-historic', 'fred-permits'],
  },
  faqs: [
    {
      question: 'Do I need a permit to replace my deck in Frederick County?',
      answer: 'Yes. Frederick County requires a permit even to replace a deck at the same size.',
    },
    {
      question: 'Do I need a permit for new kitchen cabinets in Frederick County?',
      answer:
        'No. Cabinets, countertops, flooring, and painting don’t need a permit. New or moved plumbing does.',
    },
    {
      question: 'I live in the City of Frederick. Does the county issue my permit?',
      answer:
        'No. The City of Frederick issues its own building permits. The county handles addresses outside the city and Mount Airy.',
    },
  ],
  sourceIds: [
    'fred-permits',
    'fred-faq',
    'fred-application',
    'fred-expedited',
    'fred-plumbing',
    'city-frederick-residential',
    'city-frederick-historic',
  ],
  areaSlugs: [
    'frederick-md',
    'urbana-md',
    'middletown-md',
    'new-market-md',
    'ijamsville-md',
    'myersville-md',
    'brunswick-md',
  ],
  relatedPosts: [
    'frederick-md-home-improvement-permits-costs-2026',
    'basement-finishing-frederick-md-guide',
  ],
};

export const PERMIT_GUIDES: readonly CountyPermitGuide[] = [
  FAIRFAX,
  LOUDOUN,
  ARLINGTON,
  MONTGOMERY,
  HOWARD,
  FREDERICK,
  ...BATCH2_PERMIT_GUIDES,
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

export const permitGuidePath = (slug: string): string => `/permit-guides/${slug}`;

export function getPermitGuide(slug: string): CountyPermitGuide | null {
  return PERMIT_GUIDES.find((g) => g.slug === slug) ?? null;
}

export function sourceById(id: string): PermitSource | null {
  return PERMIT_SOURCES.find((s) => s.id === id) ?? null;
}

/** "Our deck work" link for a job, via the canonical pillar href. */
export function serviceLinkFor(slug: string | undefined): { href: string; label: string } | null {
  if (!slug) return null;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return null;
  return { href: servicePillarHref(slug), label: `Our ${service.title.toLowerCase()} work` };
}
