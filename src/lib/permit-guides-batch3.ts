import type { CitedText, CountyPermitGuide, PermitSource, PermitJob } from './permit-guides';

const PUBLISHED = '2026-10-12';
const cite = (...parts: CitedText[]): readonly CitedText[] => parts;
const VA = 'va-usbc-108';

/** Each source below returned HTTP 200 on a direct GET on 2026-10-12. */
export const BATCH3_PERMIT_SOURCES: readonly PermitSource[] = [
  { id: 'alex-requirements', label: 'City of Alexandria: Permit requirements', url: 'https://alexandriava.gov/permits/permit-requirements' },
  { id: 'alex-review', label: 'City of Alexandria: Plan review services', url: 'https://www.alexandriava.gov/code-administration/plan-review-services-division' },
  { id: 'alex-inspections', label: 'City of Alexandria: Inspection schedule', url: 'https://www.alexandriava.gov/permits/inspection-schedule' },
  { id: 'falls-required', label: 'City of Falls Church: When a building permit is required', url: 'https://www.fallschurchva.gov/1914/When-a-Building-Permit-is-Required' },
  { id: 'aa-need', label: 'Anne Arundel County: Do I need a permit?', url: 'https://www.aacounty.org/inspections-and-permits/permits/do-i-need-permit' },
  { id: 'aa-residential', label: 'Anne Arundel County: Residential permits', url: 'https://www.aacounty.org/inspections-and-permits/permits/residential-permits' },
  { id: 'annapolis-permits', label: 'City of Annapolis: Licenses and permits', url: 'https://annapolis.gov/923/Licenses-Permits' },
  { id: 'carroll-checklist', label: 'Carroll County: Residential permit application checklist', url: 'https://www.carrollcountymd.gov/media/3nupyxzs/residential-permit-application-checklist-revised-6-13-23.pdf' },
  { id: 'carroll-office', label: 'Carroll County: Permits and Inspections', url: 'https://www.carrollcountymd.gov/government/directory/public-works/permits-inspections/' },
  { id: 'westminster-faq', label: 'City of Westminster: Building permit application FAQ', url: 'https://www.westminstermd.gov/m/faq?cat=16' },
];

const virginiaJobs = (office: string, source: string = VA): readonly PermitJob[] => [
  { job: 'Deck', verdict: 'depends', summary: `Virginia requires a permit for construction of a structure. Check with ${office} about your deck plans.`, sources: [source], service: 'decks' },
  { job: 'Finished basement', verdict: 'depends', summary: `Changes to walls, wiring, plumbing, or mechanical systems can require permits under Virginia's building code. Check with ${office} about the exact scope.`, sources: [VA], service: 'basements' },
  { job: 'Bathroom or kitchen remodel', verdict: 'depends', summary: `Virginia requires permits for alterations to regulated wiring, plumbing, and mechanical systems. Check with ${office} about cosmetic work.`, sources: [VA], service: 'bathrooms' },
  { job: 'Addition or porch', verdict: 'required', summary: `Virginia requires a permit for construction of a building or structure. Ask ${office} about plans and other local approvals.`, sources: [VA], service: 'additions' },
  { job: 'Shed or accessory structure', verdict: 'depends', summary: `Virginia's building code exempts some detached storage structures from a building permit. Check with ${office} about your structure and any local land-use rules.`, sources: [VA] },
  { job: 'Roof, siding, or window work', verdict: 'depends', summary: `Virginia's ordinary-repair exemptions cover some replacement work, with exceptions for historic districts and other conditions. Check with ${office} before exterior work.`, sources: [VA], service: 'roofing' },
];

const commonHoa: CitedText = { text: 'A building permit and any HOA approval are separate. Check your community documents before work.', sources: [] };

const FREDERICK_VA: CountyPermitGuide = {
  slug: 'frederick-county-va', county: 'Frederick County and Winchester', state: 'VA', stateName: 'Virginia',
  h1: 'Do I Need a Remodel Permit in Frederick County or Winchester, VA?',
  seoTitle: 'Frederick County and Winchester VA Remodel Permits',
  description: 'A permit starting point for decks, basements, bathrooms, additions, and exterior work in Frederick County and the independent City of Winchester, Virginia.',
  cardBlurb: 'Compare Frederick County and Winchester permit questions, then confirm the office for your address.',
  cardSourceIds: [VA],
  keywords: ['Frederick County VA building permit', 'Winchester VA remodel permit'], published: PUBLISHED, updated: PUBLISHED,
  answer: cite(
    { text: 'Virginia requires permit applications for construction and for many structural and trade alterations.', sources: [VA] },
    { text: 'Check with Frederick County for a county address. Check with the City of Winchester for a city address.', sources: [] },
  ),
  jurisdictionIntro: cite(
    { text: 'Virginia applications go to the building official for the project location.', sources: [VA] },
    { text: 'Confirm whether the address is in Frederick County or the independent City of Winchester before filing. Check with the relevant office about Stephens City, Middletown, or Strasburg.', sources: [] },
  ),
  issuers: [
    { name: 'Frederick County building official', covers: 'For a county address, check with the county about its permit application and inspections.', sources: [VA] },
    { name: 'City of Winchester building official', covers: 'For a city address, check with the city about its permit application and inspections.', sources: [VA] },
  ],
  jobs: virginiaJobs('the county or city building official'),
  steps: [
    { text: 'Confirm the governing jurisdiction for the project address and ask its building official which applications apply.', sources: [VA] },
    { text: 'Describe structural and trade work in the application; Virginia requires a general description and location of the proposed work.', sources: [VA] },
    { text: 'Ask the issuing office which inspections apply before work begins.', sources: [VA] },
  ],
  hoa: commonHoa,
  historic: { text: 'Virginia allows local permit requirements for some otherwise exempt exterior work in a designated historic district. Ask the relevant office whether your address is affected.', sources: [VA] },
  faqs: [
    { question: 'Is Winchester covered by the county permit office?', answer: cite({ text: 'Check with the City of Winchester for a city address and Frederick County for a county address.', sources: [] }) },
    { question: 'Does a deck need a permit?', answer: cite({ text: 'Virginia requires permits for construction of structures. Check with the building official for the project address about the deck design.', sources: [VA] }) },
    { question: 'What about Stephens City, Middletown, or Strasburg?', answer: cite({ text: 'Check with the town and county for the project address before filing.', sources: [] }) },
  ],
  sourceIds: [VA], areaSlugs: [], relatedPosts: [],
};

const CLARKE: CountyPermitGuide = {
  slug: 'clarke-county-va', county: 'Clarke County', state: 'VA', stateName: 'Virginia',
  h1: 'Do I Need a Remodel Permit in Clarke County, VA?',
  seoTitle: 'Clarke County VA Remodel and Building Permit Guide',
  description: 'A permit starting point for decks, basements, bathrooms, additions, and exterior work in Clarke County, Berryville, and Boyce, Virginia.',
  cardBlurb: 'Review Clarke County permit questions and ask about Berryville or Boyce requirements.',
  cardSourceIds: [VA],
  keywords: ['Clarke County VA building permit', 'Berryville remodel permit', 'Boyce VA permit'], published: PUBLISHED, updated: PUBLISHED,
  answer: cite(
    { text: 'Virginia requires permits for construction and for many structural and trade alterations.', sources: [VA] },
    { text: 'Check with Clarke County about its building permit process and ask Berryville or Boyce about town requirements for an address inside either town.', sources: [] },
  ),
  jurisdictionIntro: cite(
    { text: 'Virginia requires permit applications to describe the work and its location.', sources: [VA] },
    { text: 'Check with the county and the relevant town before filing for a Berryville or Boyce address.', sources: [] },
  ),
  issuers: [
    { name: 'Building official for the project address', covers: 'Check with Clarke County about building applications and with Berryville or Boyce about any town review.', sources: [VA] },
  ],
  jobs: virginiaJobs('the county and, if applicable, the town'),
  steps: [
    { text: 'Confirm the project address with the building official and ask whether town review applies.', sources: [VA] },
    { text: 'Describe construction, structural changes, and trade work in the permit application.', sources: [VA] },
    { text: 'Ask the issuing office which inspections apply.', sources: [VA] },
  ],
  hoa: commonHoa,
  historic: { text: 'Ask the county and relevant town whether exterior work at the address needs historic review.', sources: [] },
  faqs: [
    { question: 'What if the house is in Berryville?', answer: cite({ text: 'Check with the county and the Town of Berryville before filing.', sources: [] }) },
    { question: 'What if the house is in Boyce?', answer: cite({ text: 'Check with the county and the Town of Boyce before filing.', sources: [] }) },
    { question: 'Does a kitchen remodel need a permit?', answer: cite({ text: 'Virginia requires permits for alterations to regulated plumbing, wiring, and mechanical systems. Check with the building official about the project scope.', sources: [VA] }) },
  ],
  sourceIds: [VA], areaSlugs: [], relatedPosts: [],
};

const ALEXANDRIA: CountyPermitGuide = {
  slug: 'alexandria-va', county: 'City of Alexandria', state: 'VA', stateName: 'Virginia',
  h1: 'Do I Need a Remodel Permit in Alexandria, VA?',
  seoTitle: 'Alexandria VA Residential Remodel Permit Guide',
  description: 'City of Alexandria permit guidance for decks, basement finishing, kitchen and bath alterations, additions, and exterior repairs at city addresses.',
  cardBlurb: 'See Alexandria permit guidance for common remodel work and city plan review.',
  cardSourceIds: ['alex-requirements', 'alex-review'],
  keywords: ['Alexandria VA building permit', 'Alexandria deck permit', 'Alexandria basement permit'], published: PUBLISHED, updated: PUBLISHED,
  answer: cite({ text: 'Alexandria says permits are required for most construction, including alterations and additions. Its residential permit guidance includes decks, basement finishing, and kitchen renovations.', sources: ['alex-requirements'] }),
  jurisdictionIntro: cite({ text: 'The City of Alexandria handles the permit and plan-review process for projects within the city.', sources: ['alex-requirements', 'alex-review'] }),
  issuers: [{ name: 'City of Alexandria Code Administration', covers: 'Reviews building plans for new and altered residential buildings within Alexandria.', sources: ['alex-review'] }],
  jobs: [
    { job: 'Deck', verdict: 'required', summary: 'Alexandria lists deck construction and renovation in its residential plan-review examples.', sources: ['alex-review'], service: 'decks' },
    { job: 'Finished basement', verdict: 'required', summary: 'The city lists finishing a basement among residential plan-review examples.', sources: ['alex-review'], service: 'basements' },
    { job: 'Bathroom or kitchen remodel', verdict: 'depends', summary: 'Alexandria lists residential kitchen and bathroom alterations among plan-review examples. Check the exact scope with Code Administration.', sources: ['alex-review'], service: 'bathrooms' },
    { job: 'Addition or porch', verdict: 'required', summary: 'The city lists additions and porches in its construction and plan-review guidance.', sources: ['alex-requirements', 'alex-review'], service: 'additions' },
    { job: 'Shed or accessory structure', verdict: 'depends', summary: 'Virginia has exemptions for some detached storage structures. Check the city rules for the address.', sources: [VA] },
    { job: 'Roof, siding, or window work', verdict: 'depends', summary: 'Alexandria lists roof and siding repair or replacement as plan-review examples. Check the exact scope with the city.', sources: ['alex-review'], service: 'roofing' },
  ],
  steps: [
    { text: 'Check the city permit requirements and identify the residential application for the project.', sources: ['alex-requirements'] },
    { text: 'Submit plans through the city permit process and ask which trade permits apply.', sources: ['alex-requirements', 'alex-review'] },
    { text: 'Ask the city which inspections apply to your permit and schedule them through APEX.', sources: ['alex-inspections'] },
  ],
  hoa: commonHoa,
  historic: { text: 'Ask the city whether the address has historic review requirements before exterior changes.', sources: ['alex-requirements'] },
  faqs: [
    { question: 'Does Alexandria review deck plans?', answer: cite({ text: 'Yes. The city lists deck construction and renovation in its residential plan-review examples.', sources: ['alex-review'] }) },
    { question: 'Does finishing a basement need city review?', answer: cite({ text: 'The city lists basement finishing among its residential plan-review examples.', sources: ['alex-review'] }) },
    { question: 'Where do I start an application?', answer: cite({ text: 'Alexandria directs applicants to its permit system for applications and supporting documents.', sources: ['alex-requirements'] }) },
  ],
  sourceIds: [VA, 'alex-requirements', 'alex-review', 'alex-inspections'], areaSlugs: [], relatedPosts: [],
};

const FALLS_FAIRFAX: CountyPermitGuide = {
  slug: 'falls-church-city-of-fairfax-va', county: 'Falls Church and City of Fairfax', state: 'VA', stateName: 'Virginia',
  h1: 'Do I Need a Remodel Permit in Falls Church or Fairfax City, VA?',
  seoTitle: 'Falls Church and Fairfax City VA Remodel Permits',
  description: 'Compare residential permit questions for the independent cities of Falls Church and Fairfax, Virginia, including decks, basements, baths, and additions.',
  cardBlurb: 'Find the right city permit office for Falls Church or Fairfax City work.',
  cardSourceIds: ['falls-required'],
  keywords: ['Falls Church VA building permit', 'City of Fairfax building permit'], published: PUBLISHED, updated: PUBLISHED,
  answer: cite(
    { text: 'Falls Church gives separate guidance for work that needs a city building permit, including structural changes.', sources: ['falls-required'] },
    { text: 'For a City of Fairfax address, check with its city building official about the permit path.', sources: [] },
  ),
  jurisdictionIntro: cite(
    { text: 'Falls Church publishes its own residential building permit guidance.', sources: ['falls-required'] },
    { text: 'The City of Fairfax is a separate jurisdiction; check with that city for its process. Confirm the city boundary before using either office.', sources: [] },
  ),
  issuers: [
    { name: 'City of Falls Church permit office', covers: 'Explains which home projects need a city building permit.', sources: ['falls-required'] },
    { name: 'City of Fairfax building official', covers: 'Check with the city about applications and inspections for a Fairfax City address.', sources: [VA] },
  ],
  jobs: virginiaJobs('the appropriate city office'),
  steps: [
    { text: 'Confirm whether the address is in Falls Church or Fairfax City and contact that city office.', sources: [VA] },
    { text: 'Describe structural and trade alterations in the permit application.', sources: [VA] },
    { text: 'Ask the issuing city which inspections apply to the approved scope.', sources: [VA] },
  ],
  hoa: commonHoa,
  historic: { text: 'Virginia permits local review of certain otherwise exempt work in historic districts. Ask the relevant city about the address.', sources: [VA] },
  faqs: [
    { question: 'Does Fairfax County handle a Fairfax City address?', answer: cite({ text: 'Check with the City of Fairfax building official for a city address.', sources: [] }) },
    { question: 'Can I replace cabinets in Falls Church without a building permit?', answer: cite({ text: 'Falls Church lists cabinet replacement among routine work that generally does not require a building permit in a single-family house.', sources: ['falls-required'] }) },
    { question: 'What about a structural wall change?', answer: cite({ text: 'Falls Church says framing or other structural wall work requires a permit.', sources: ['falls-required'] }) },
  ],
  sourceIds: [VA, 'falls-required'], areaSlugs: [], relatedPosts: [],
};

const ANNE_ARUNDEL: CountyPermitGuide = {
  slug: 'anne-arundel-county-md', county: 'Anne Arundel County and Annapolis', state: 'MD', stateName: 'Maryland',
  h1: 'Do I Need a Remodel Permit in Anne Arundel County or Annapolis?',
  seoTitle: 'Anne Arundel County and Annapolis Remodel Permits',
  description: 'Anne Arundel County and Annapolis permit guidance for decks, finished basements, bathrooms, additions, and exterior home work.',
  cardBlurb: 'Compare Anne Arundel County and Annapolis permit guidance by address.',
  cardSourceIds: ['aa-residential', 'annapolis-permits'],
  keywords: ['Anne Arundel County building permit', 'Annapolis remodel permit'], published: PUBLISHED, updated: PUBLISHED,
  answer: cite(
    { text: 'Anne Arundel County lists attached decks and finished basements among residential projects that require permits.', sources: ['aa-need'] },
    { text: 'Annapolis has its own building permit guidance for addresses within the city.', sources: ['annapolis-permits'] },
  ),
  jurisdictionIntro: cite(
    { text: 'For an Anne Arundel County address outside Annapolis, use the county residential permit guidance.', sources: ['aa-residential'] },
    { text: 'For an Annapolis city address, check the city permit office and its separate requirements.', sources: ['annapolis-permits'] },
  ),
  issuers: [
    { name: 'Anne Arundel County Department of Inspections and Permits', covers: 'Provides residential permit types and project guidance for county work.', sources: ['aa-residential', 'aa-need'] },
    { name: 'City of Annapolis permit office', covers: 'Provides building permit guidance for work inside Annapolis.', sources: ['annapolis-permits'] },
  ],
  jobs: [
    { job: 'Deck', verdict: 'required', summary: 'The county lists attached decks and replacement of structural deck components as permit work.', sources: ['aa-need'], service: 'decks' },
    { job: 'Finished basement', verdict: 'required', summary: 'The county lists finished basements as requiring a permit.', sources: ['aa-need'], service: 'basements' },
    { job: 'Bathroom or kitchen remodel', verdict: 'depends', summary: 'The county bases its permit answer on project scope and directs residents to check project details.', sources: ['aa-need'], service: 'bathrooms' },
    { job: 'Addition or porch', verdict: 'depends', summary: 'The county residential permit program includes additions. Check the project details with the county.', sources: ['aa-residential'], service: 'additions' },
    { job: 'Shed or accessory structure', verdict: 'depends', summary: 'The county has a residential accessory-structure permit category. Check the specific structure and address.', sources: ['aa-residential'] },
    { job: 'Roof, siding, or window work', verdict: 'depends', summary: 'Annapolis identifies some nonstructural replacements outside its Historic District as work without a building permit. Check with the city about the exact address and scope.', sources: ['annapolis-permits'], service: 'roofing' },
  ],
  steps: [
    { text: 'Confirm whether the address is governed by the county or City of Annapolis permit office.', sources: ['aa-residential', 'annapolis-permits'] },
    { text: 'For county work, use the county project lookup to identify the permit record type and related approvals.', sources: ['aa-need'] },
    { text: 'For Annapolis work, ask the city about the building application and any historic review.', sources: ['annapolis-permits'] },
  ],
  hoa: commonHoa,
  historic: { text: 'Annapolis distinguishes exterior work in its Historic District from work outside it. Check with the city before exterior changes.', sources: ['annapolis-permits'] },
  faqs: [
    { question: 'Who handles an Annapolis city address?', answer: cite({ text: 'The City of Annapolis publishes its own building permit guidance; check with the city permit office.', sources: ['annapolis-permits'] }) },
    { question: 'Does a county deck need a permit?', answer: cite({ text: 'The county lists attached decks and structural deck replacement as permit work.', sources: ['aa-need'] }) },
    { question: 'Does a county finished basement need a permit?', answer: cite({ text: 'Yes. The county lists finished basements as permit work.', sources: ['aa-need'] }) },
  ],
  sourceIds: ['aa-need', 'aa-residential', 'annapolis-permits'], areaSlugs: [], relatedPosts: [],
};

const CARROLL: CountyPermitGuide = {
  slug: 'carroll-county-md', county: 'Carroll County', state: 'MD', stateName: 'Maryland',
  h1: 'Do I Need a Remodel Permit in Carroll County, MD?',
  seoTitle: 'Carroll County MD Residential Remodel Permit Guide',
  description: 'Carroll County permit guidance for decks, additions, basements, bathrooms, and exterior work, with address checks for Westminster and other municipalities.',
  cardBlurb: 'Review Carroll County residential permit steps and municipal address checks.',
  cardSourceIds: ['carroll-checklist', 'westminster-faq'],
  keywords: ['Carroll County MD building permit', 'Westminster MD building permit', 'Taneytown remodel permit'], published: PUBLISHED, updated: PUBLISHED,
  answer: cite(
    { text: 'Carroll County says building permits are required for construction, alterations, repairs, additions, and removal of structures, including decks and sheds.', sources: ['carroll-checklist'] },
    { text: 'Westminster directs building permit applicants to the Carroll County office.', sources: ['westminster-faq'] },
    { text: 'Check with Taneytown or any other municipality about local review for an in-town address.', sources: [] },
  ),
  jurisdictionIntro: cite(
    { text: 'Carroll County publishes a residential permit checklist and operates the permit office.', sources: ['carroll-checklist', 'carroll-office'] },
    { text: 'Westminster sends building permit applicants to that county office.', sources: ['westminster-faq'] },
    { text: 'For Taneytown or another town, check with the municipality about its requirements as well.', sources: [] },
  ),
  issuers: [
    { name: 'Carroll County Permits and Inspections', covers: 'Accepts residential building permit applications and publishes the required application checklist.', sources: ['carroll-checklist', 'carroll-office'] },
    { name: 'Municipal office for the project address', covers: 'Check with Taneytown or the relevant town about any additional municipal review.', sources: [] },
  ],
  jobs: [
    { job: 'Deck', verdict: 'required', summary: 'The county checklist expressly includes decks among structures needing a building permit.', sources: ['carroll-checklist'], service: 'decks' },
    { job: 'Finished basement', verdict: 'depends', summary: 'The county checklist covers alterations to structures. Ask the county how a basement finish is classified.', sources: ['carroll-checklist'], service: 'basements' },
    { job: 'Bathroom or kitchen remodel', verdict: 'depends', summary: 'The county checklist includes alterations and repairs. Ask the county which building or trade permits match the scope.', sources: ['carroll-checklist', 'carroll-office'], service: 'bathrooms' },
    { job: 'Addition or porch', verdict: 'required', summary: 'The county checklist names additions as building-permit work.', sources: ['carroll-checklist'], service: 'additions' },
    { job: 'Shed or accessory structure', verdict: 'required', summary: 'The county checklist names sheds among structures needing a building permit.', sources: ['carroll-checklist'] },
    { job: 'Roof, siding, or window work', verdict: 'depends', summary: 'The county checklist includes repairs. Check with the county about the exact replacement scope.', sources: ['carroll-checklist'], service: 'roofing' },
  ],
  steps: [
    { text: 'Use the county residential checklist to identify the application and plans for the work.', sources: ['carroll-checklist'] },
    { text: 'Submit the building application to Carroll County Permits and Inspections.', sources: ['carroll-checklist', 'carroll-office'] },
    { text: 'For a Westminster address, the city directs building permit applicants to the county office.', sources: ['westminster-faq'] },
  ],
  hoa: commonHoa,
  historic: { text: 'Check with the county and the relevant municipality about any historic review before exterior work.', sources: [] },
  faqs: [
    { question: 'Where do Westminster residents apply for a building permit?', answer: cite({ text: 'The city directs applicants to the Carroll County Office of Permits and Inspections.', sources: ['westminster-faq'] }) },
    { question: 'Does a deck need a county building permit?', answer: cite({ text: 'The county residential checklist expressly includes decks.', sources: ['carroll-checklist'] }) },
    { question: 'What about a Taneytown address?', answer: cite({ text: 'Check with Carroll County about the building permit and with Taneytown about any town review.', sources: [] }) },
  ],
  sourceIds: ['carroll-checklist', 'carroll-office', 'westminster-faq'], areaSlugs: [], relatedPosts: [],
};

export const BATCH3_PERMIT_GUIDES: readonly CountyPermitGuide[] = [
  FREDERICK_VA, CLARKE, ALEXANDRIA, FALLS_FAIRFAX, ANNE_ARUNDEL, CARROLL,
];
