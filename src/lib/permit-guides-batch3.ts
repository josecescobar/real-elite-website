import type { CitedText, CountyPermitGuide, PermitSource, PermitJob } from './permit-guides';

const PUBLISHED = '2026-10-12';
const cite = (...parts: CitedText[]): readonly CitedText[] => parts;
const VA = 'va-usbc-108';

/** Alexandria through Westminster were opened 2026-10-12. Manassas and Manassas Park were opened 2026-10-15. */
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
  { id: 'mmp-man-building', label: 'City of Manassas: Building, trade, and occupancy permits', url: 'https://www.manassasva.gov/community_development/development_services/building_and_trade_permits.php' },
  { id: 'mmp-man-exempt', label: 'City of Manassas: Items that do not require a permit', url: 'https://www.manassasva.gov/community_development/development_services/items_that_do_not_require_a_permit.php' },
  { id: 'mmp-man-zoning', label: 'City of Manassas: Zoning permits and other resources', url: 'https://www.manassasva.gov/community_development/development_services/zoning_permits.php' },
  { id: 'mmp-man-decks', label: 'City of Manassas: Guide to decks (PDF)', url: 'https://www.manassasva.gov/Community%20Development/development%20services/zoning%20permits/Decks%20ENG.pdf' },
  { id: 'mmp-man-accessory', label: 'City of Manassas: Guide to sheds, carports, and garages (PDF)', url: 'https://www.manassasva.gov/Community%20Development/development%20services/zoning%20permits/Accessory%20Structures%20ENG.pdf' },
  { id: 'mmp-man-fence', label: 'City of Manassas: Fence application process (PDF)', url: 'https://www.manassasva.gov/Community%20Development/development%20services/zoning%20permits/Fences.pdf' },
  { id: 'mmp-man-review', label: 'City of Manassas: Building plan review', url: 'https://www.manassasva.gov/community_development/development_services/building_plan_review.php' },
  { id: 'mmp-man-historic', label: 'City of Manassas: Historic overlay district', url: 'https://www.manassasva.gov/community_development/historic_overlay_district.php' },
  { id: 'mmp-man-site', label: 'City of Manassas: Site and utility permits', url: 'https://www.manassasva.gov/community_development/development_services/site_and_utility_permits.php' },
  { id: 'mmp-man-utility', label: 'City of Manassas: Utility service connections', url: 'https://www.manassasva.gov/electric_water___sewer/utility_services.php' },
  { id: 'mmp-man-index', label: 'City of Manassas: Apply for permits', url: 'https://www.manassasva.gov/how_do_i_/apply_for/permits/index.php' },
  { id: 'mmp-man-gis', label: 'City of Manassas: GIS and mapping', url: 'https://www.manassasva.gov/how_do_i_/gis___mapping_website/index.php' },
  { id: 'mmp-park-building', label: 'City of Manassas Park: Building permits and inspections', url: 'https://www.manassasparkva.gov/departments/development_zoning_and_code_enforcement_services/building_permits_and_inspections/index.php' },
  { id: 'mmp-park-need', label: 'City of Manassas Park: Do I need a permit?', url: 'https://www.manassasparkva.gov/departments/development_zoning_and_code_enforcement_services/building_permits_and_inspections/do_i_need_a_permit.php' },
  { id: 'mmp-park-plans', label: 'City of Manassas Park: Plan submittal for additions, decks, and finished basements', url: 'https://www.manassasparkva.gov/departments/development_zoning_and_code_enforcement_services/building_permits_and_inspections/plan_submittal_requirements_for_additions_decks_fences_finishing_basements.php' },
  { id: 'mmp-park-inspections', label: 'City of Manassas Park: Scheduling inspections', url: 'https://www.manassasparkva.gov/departments/development_zoning_and_code_enforcement_services/building_permits_and_inspections/building_inspections.php' },
  { id: 'mmp-park-applications', label: 'City of Manassas Park: Building and trade permit applications', url: 'https://www.manassasparkva.gov/departments/development_zoning_and_code_enforcement_services/permit_applications/index.php' },
  { id: 'mmp-park-fence', label: 'City of Manassas Park: Shed, fence, wall, patio, or driveway approval', url: 'https://www.manassasparkva.gov/departments/development_zoning_and_code_enforcement_services/building_permits_and_inspections/fencing_installation.php' },
  { id: 'mmp-park-water', label: 'City of Manassas Park: Water and sewer services', url: 'https://www.manassasparkva.gov/departments/public_works/water_and_sewer_services_division/index.php' },
  { id: 'mmp-va-city', label: 'Code of Virginia § 15.2-102 (definition of a city)', url: 'https://law.lis.virginia.gov/vacode/title15.2/chapter1/section15.2-102/' },
  { id: 'mmp-dhcd', label: 'Virginia DHCD: Codes', url: 'https://www.dhcd.virginia.gov/codes' },
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
  sourceIds: [VA], areaSlugs: ['winchester-va'], relatedPosts: [],
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
  sourceIds: [VA], areaSlugs: ['berryville-va'], relatedPosts: [],
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
  sourceIds: [VA, 'alex-requirements', 'alex-review', 'alex-inspections'], areaSlugs: ['alexandria-va'], relatedPosts: [],
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
  sourceIds: [VA, 'falls-required'], areaSlugs: ['falls-church-va', 'fairfax-va'], relatedPosts: [],
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

const MANASSAS_CITIES: CountyPermitGuide = {
  slug: 'manassas-manassas-park-va',
  county: 'Manassas and Manassas Park',
  state: 'VA',
  stateName: 'Virginia',
  h1: 'Do I Need a Remodel Permit in Manassas or Manassas Park, VA?',
  seoTitle: 'Manassas and Manassas Park VA Permit Guide',
  description:
    'Parcel-first permit rules for decks, sheds, fences, basements, additions, and trade work in the City of Manassas and the City of Manassas Park, Virginia.',
  cardBlurb: 'Compare City of Manassas and Manassas Park permit rules by parcel.',
  cardSourceIds: ['mmp-man-building', 'mmp-park-building'],
  keywords: ['Manassas VA building permit', 'Manassas Park VA building permit', 'Manassas deck permit'],
  published: '2026-10-15',
  updated: '2026-10-15',
  answer: cite(
    {
      text: 'For a parcel inside the City of Manassas, Development Services at that city issues the building permit, the trade permit, and the zoning permit.',
      sources: ['mmp-man-building', 'mmp-man-zoning'],
    },
    {
      text: 'For a parcel inside the City of Manassas Park, Development, Zoning, and Code Enforcement at that city issues the building permit and the zoning approval.',
      sources: ['mmp-park-building'],
    },
    {
      text: 'Prince William County Development Services is the permit office only when the parcel is in the county. The county areas page says its site-development permits and its building and trade permits stop at these two cities.',
      sources: ['pwc-areas'],
    },
  ),
  jurisdictionIntro: cite(
    {
      text: 'Confirm the parcel is inside the City of Manassas, inside the City of Manassas Park, or in the county before you name an office. A mailing address does not make that choice.',
      sources: [],
    },
    {
      text: 'Virginia defines a city as an independent incorporated community, which is why these two are not towns inside Prince William County. That statute does not say whether one parcel sits inside either city.',
      sources: ['mmp-va-city'],
    },
    {
      text: 'Use manassasva.gov for the City of Manassas. The county areas page still points readers at an older city web address.',
      sources: ['pwc-areas'],
    },
    {
      text: 'The City of Manassas publishes a zoning and parcel map and a GeoHub. Check with the City of Manassas Park for its map of that parcel.',
      sources: ['mmp-man-historic', 'mmp-man-gis'],
    },
    {
      text: 'Manassas plan review prints the applicable code as the 2018/2021 Virginia Uniform Statewide Building Code.',
      sources: ['mmp-man-review'],
    },
    {
      text: 'Virginia DHCD says the 2021 Uniform Statewide Building Code took effect on January 18, 2024, and that the state adopted the 2021 I-codes for the construction code plus the 2020 National Electrical Code.',
      sources: ['mmp-dhcd'],
    },
    {
      text: 'Confirm both code statements with the offices. Do not collapse the city 2018/2021 pair and the DHCD 2021 effective date into one edition.',
      sources: [],
    },
  ),
  issuers: [
    {
      name: 'City of Manassas Development Services',
      covers:
        'Issues building, trade, and occupancy permits, plan review, and zoning certificates for a parcel inside the City of Manassas. The city uses construction permits to apply the Virginia Uniform Statewide Building Code. A certificate of occupancy is the city statement that a structure may be occupied, and a certificate of use can cover a new business moving into an existing structure when that move does not involve major construction. Some inspections can be done virtually, and third-party building inspections are accepted from a city-approved list. Weekday counter hours on the building-permit page run from 8:30 AM to 5 PM, with a transaction cutoff at 4:30 PM. The city says its local design-load criteria match Fairfax County and Prince William County. The city GIS page points at EnerGov self-service for building permits.',
      sources: ['mmp-man-building', 'mmp-man-review', 'mmp-man-gis'],
    },
    {
      name: 'City of Manassas Architectural Review Board',
      covers:
        'Issues a certificate of appropriateness for construction, reconstruction, substantial exterior alteration, demolition, or relocation inside a city historic overlay.',
      sources: ['mmp-man-historic'],
    },
    {
      name: 'City of Manassas fire-protection permit',
      covers:
        'The exemption page and the permits index name a separate fire-protection permit. Fire-alarm and similar fire-protection work may skip a building permit and still need that permit. Ask the city for the steps on that fire-protection permit.',
      sources: ['mmp-man-exempt', 'mmp-man-index'],
    },
    {
      name: 'City of Manassas site and utility permits',
      covers:
        'Land disturbance, utility installation, and work in the city right-of-way are city permits separate from the building and trade permits. Disturbing more than 2,500 square feet brings an erosion permit and a responsible land disturber. A site-development permit, after a final site plan, covers the roads, the parking, and the water, sewer, and storm construction, and that permit does not include the building and trade permits. When more than 2,500 square feet will be disturbed and no site plan or subdivision plan is already in review, file a land-disturbance permit. Stored materials, or a closed street or sidewalk, go on a no-excavation right-of-way permit. Underground gas, water, cable, telephone, and sewer, plus a new entrance onto a public road, go on an excavation permit.',
      sources: ['mmp-man-site'],
    },
    {
      name: 'City of Manassas utility customer service',
      covers:
        'Starting an account for electric, water, sewer, stormwater, or refuse is a customer-service application, and that application is not the construction permit. Electric service in the City of Manassas is sold by that city.',
      sources: ['mmp-man-utility'],
    },
    {
      name: 'City of Manassas Park Development Services',
      covers:
        'Issues building permits, inspections, and zoning approval for a parcel inside the City of Manassas Park. The building-permits page sends applications and inspection requests to SmartGov, and a new contractor calls the city before creating a portal contact, with the state license number ready. A home-occupation or new-business zoning compliance needs the Commissioner of the Revenue stamp before it is submitted on SmartGov. The applications page still describes a master permit number with a scope-of-work worksheet for each trade, and it still says an online customer portal is being prepared, while also linking SmartGov for sign-up and inspection requests. Both pages are published. Use the page that matches the application you are filing. The building-permits page places Development Services at 9701 Manassas Drive and prints office hours of Monday through Friday, 8:30 AM to 4:30 PM. The site footer on that host places city hall at 100 Park Central Plaza. The Prince William areas page places Manassas Park at One Park Center Court. Confirm which door takes the application.',
      sources: ['mmp-park-building', 'mmp-park-applications', 'pwc-areas'],
    },
    {
      name: 'City of Manassas Park water and sewer division',
      covers:
        'Covers the city water and sewer system and points billing questions to the treasurer water-billing office. The city says its water is purchased under agreements with Prince William County and the City of Manassas. The page does not say who issues a tap permit, so this guide does not name a tap fee or a tap counter.',
      sources: ['mmp-park-water'],
    },
    {
      name: 'Trade contractor in the city that contains the parcel',
      covers:
        'Files the electrical, plumbing, or mechanical permit. In the City of Manassas the trade contractor applies after the building plans are approved. In the City of Manassas Park, one applicant can file several trades on one application and each trade still receives its own permit number. On those Manassas Park forms, residential means an R-5 occupancy, and every other occupancy, including a multifamily R-2 apartment or condominium, is filed as commercial. The inspections page links separate applications for electrical, mechanical, and plumbing and gas.',
      sources: ['mmp-man-review', 'mmp-park-applications', 'mmp-park-inspections'],
    },
  ],
  jobs: [
    {
      job: 'Deck in the City of Manassas',
      verdict: 'depends',
      summary:
        'A City of Manassas building permit covers a new deck, stairs that are added, a larger deck or larger stairs, and replacement of structural members, including guards and stairs. Replacing or resurfacing only the deck boards, and staining the deck, are the cases the city deck guide puts outside the permit. That guide treats a deck as an unroofed structure attached to the house. Single-family setbacks in the districts it names are 35 feet to the front lot line, 15 feet to the rear lot line when the deck is 4 feet or less off the ground and 20 feet when it is higher, 15 feet on each side in R-1, and in R-2 and R-2S a minimum of 10 feet on each side with the two side yards totaling at least 25 feet. A townhouse deck in R-3 or R-5 stays 8 feet off the rear lot line. On a corner, the yard line that runs perpendicular to the street uses the rear setback, and the line that runs parallel to the street is 20 feet. Stairs and platforms with no roof may sit closer to a lot line, so ask the department about that particular lot. A historic-overlay deck has to meet the city historic design guidelines and may need Architectural Review Board approval before construction. The application is the building-permit form, a surveyor house-location survey with the deck and the steps drawn to scale, and a deck detail covering footings, posts, beams, the connection to the house, the decking, and the guard. The city inspects the deck while it is being built.',
      sources: ['mmp-man-decks'],
      service: 'decks',
    },
    {
      job: 'Deck in the City of Manassas Park',
      verdict: 'depends',
      summary:
        'The City of Manassas Park plan-submittal page treats a deck as a building-plan item and says zoning approval comes before building plans for most structures. No deck-height cutoff is stated on that page. A Prince William County deck measurement is not the Manassas Park rule, and the City of Manassas rear-yard split at 4 feet off the ground is not the Manassas Park rule either.',
      sources: ['mmp-park-plans'],
      service: 'decks',
    },
    {
      job: 'Finished basement in the City of Manassas',
      verdict: 'check',
      summary:
        'No City of Manassas page used here states a rule for finishing a basement. Check with that city before you finish a basement on a city parcel.',
      sources: ['mmp-man-building'],
      service: 'basements',
    },
    {
      job: 'Finished basement in the City of Manassas Park',
      verdict: 'required',
      summary:
        'Finishing a basement is on the City of Manassas Park required list, and the plan-submittal page offers a finished-basement detail for that work.',
      sources: ['mmp-park-need', 'mmp-park-plans'],
      service: 'basements',
    },
    {
      job: 'Bathroom or kitchen in the City of Manassas',
      verdict: 'depends',
      summary:
        'No City of Manassas page used here names a kitchen remodel or a bathroom remodel as its own category. For the residential groups the exemption page names, plumbing-fixture and well-pump replacement that leaves the supply, the drain, and the vent alone is ordinary repair, and so are cabinet or trim replacement, floor finishes, and paint. Anything past those lines is not on that exemption list. Check with the city about the scope you actually have.',
      sources: ['mmp-man-exempt'],
      service: 'bathrooms',
    },
    {
      job: 'Bathroom or kitchen in the City of Manassas Park',
      verdict: 'depends',
      summary:
        'In the City of Manassas Park, moving a fixture, changing plumbing, electrical, or mechanical systems, adding or removing walls, and replacing a gas appliance are on the required lists. Cabinet replacement, floor coverings, same-place fixture replacement without a supply or drain change, and a same-place appliance of similar capacity are on the exemption list. A similar-capacity swap does not excuse a gas-appliance replacement. That building-permits page still groups a gas-appliance replacement with work that needs a permit.',
      sources: ['mmp-park-need', 'mmp-park-building'],
      service: 'bathrooms',
    },
    {
      job: 'Addition in the City of Manassas',
      verdict: 'required',
      summary:
        'A City of Manassas addition needs a building permit. Addition plans go through the residential addition queue, and the plan-review page lists the documents an addition has to include. The plan-review page does not state a size that would exempt an addition.',
      sources: ['mmp-man-review'],
      service: 'additions',
    },
    {
      job: 'Addition in the City of Manassas Park',
      verdict: 'required',
      summary:
        'An addition is on the City of Manassas Park required list. Zoning approval comes before the building plans for most structures, including that addition.',
      sources: ['mmp-park-need', 'mmp-park-plans'],
      service: 'additions',
    },
    {
      job: 'Shed or accessory structure in the City of Manassas',
      verdict: 'depends',
      summary:
        'In the City of Manassas, an accessory structure is a separate structure on the house lot. The city examples include a shed, a detached garage, a carport, a pergola, a gazebo, a greenhouse, and an above-ground pool. The city wants a permit for a new accessory structure and for a change to its size or to where it sits on the lot. At 256 square feet or less the city calls for a zoning permit, and at 257 square feet or more it calls for a building permit. Repair and maintenance of an existing structure sit outside the permit, and so does tearing down a structure of 256 square feet or less and putting the same size back in the same place. On single-family lots in R-1, R-2, and R-2S there is no accessory structure in the front yard, the rear and rear-side lines are 5 feet, the side yards follow the deck-guide pattern for those districts, height stops at 22 feet at the ridge or 16 feet for a flat roof, and all accessory structures together may cover up to 40 percent of the house lot coverage. A corner lot still bars a front-yard structure, and the street-parallel line is 20 feet. A townhouse in R-3 or R-5 is limited to one structure, rear yard only, 80 square feet, and 8.5 feet, and that guide prints no setback. Keep 4 feet off a transformer and a fire hydrant, and keep the structure out of an easement unless the city reviews that case. From 257 through 600 square feet the city wants a permanent foundation 12 inches below ground, and a garage or carport also needs an approved floor drain and slope. Above 600 square feet, the city wants continuous frost footings set 24 inches below finished grade. The building-permit drawings are two copies: a dimensioned floor plan, front and side elevations, framing sizes and spacing, and the anchorage to the ground. An accessory structure inside a historic overlay has to follow the historic design guidelines and may need Architectural Review Board approval before it is built. An above-ground pool needs a building permit when it is over 150 square feet, over 24 inches high, or over 5,000 gallons, and any one of those is enough.',
      sources: ['mmp-man-accessory'],
    },
    {
      job: 'Shed or accessory structure in the City of Manassas Park',
      verdict: 'depends',
      summary:
        'The City of Manassas Park shed pages do not agree with each other. The building-permits page uses 256 square feet as the line between zoning-only approval and a building permit. The do-I-need page says a residential shed greater than 150 square feet needs a permit, and it puts storage sheds of 150 square feet or less on the exemption list except in the use groups that page names. The fence-and-shed page allows a shed no taller than 15 feet and no larger than 256 square feet to sit at least 2 feet off the rear line and the side line, and it does not allow that shed in the front yard. Ask the city which line the shed falls under. A pool note on the do-I-need page names 150 square feet, 5,000 gallons, and 24 inches and joins them with or. Do not rewrite that note into a test that needs all three.',
      sources: ['mmp-park-building', 'mmp-park-need', 'mmp-park-fence'],
    },
    {
      job: 'Fence in the City of Manassas',
      verdict: 'depends',
      summary:
        'In the City of Manassas, a zoning permit covers a new fence that is 4 feet or taller, and a change in the height or the location of a fence that is already there. A new fence up to 4 feet, repair, and a same-height replacement in the same place stay outside that zoning permit. A fence in a City of Manassas front yard may not exceed 4 feet. A City of Manassas side or rear fence may not exceed 7 feet. The city does not print a fence setback and allows the fence on a lot line, and the owner locates that line. Keep the fence 4 feet off a fire hydrant and a transformer, and check the lot easements. A corner lot may keep a fence of up to 4 feet in the front yard, out to the property edge. Where streets meet, the fence has to leave vehicles a clear view for 200 feet. A fence over 4 feet in the side yard has to meet the side setback, which the city guide says is usually 20 feet. Outside the historic overlay the guide allows any fence material. Every fence inside the overlay, whatever its height, has to meet the historic design guidelines and may need the Architectural Review Board before installation. A barrier around a pool takes a building permit, and a zoning certificate alone does not cover it. Apply with the zoning certificate and a house-location survey that draws the fence, the height, and the material.',
      sources: ['mmp-man-fence'],
    },
    {
      job: 'Fence in the City of Manassas Park',
      verdict: 'often-exempt',
      summary:
        'A City of Manassas Park fence on a residential lot usually does not take a building permit, and zoning approval still applies. A City of Manassas Park front-yard fence may not exceed 4 feet. A City of Manassas Park side or rear fence may not exceed 6 feet. A wall uses those fence height limits. A wall no taller than 6 feet is zoning approval only, and a taller wall needs a building permit. A corner lot has an extra sight-line rule in zoning ordinance section 31-31. The owner may also need the homeowners association architectural review for the fence type, the location, and the installation.',
      sources: ['mmp-park-fence', 'mmp-park-building'],
    },
    {
      job: 'Roof, siding, or windows in the City of Manassas',
      verdict: 'depends',
      summary:
        'On the residential groups the City of Manassas exemption page names, roof covering or siding may be replaced without a building permit when the design wind speed is not over 100 mph. A separate line allows 100 square feet or less of roof covering in any group and any wind zone. For those same residential groups, roof decking at or under 100 square feet is exempt unless the old decking was fire-retardant or closed a fire-rated wall. Similar-operation window and door replacement that does not change the framed opening, and is not required to be fire-rated, is on the ordinary-repair list for the groups the page names. Inside a historic overlay, replacement siding, roofing, and windows can still need a permit.',
      sources: ['mmp-man-exempt'],
      service: 'roofing',
    },
    {
      job: 'Roof, siding, or windows in the City of Manassas Park',
      verdict: 'depends',
      summary:
        'In the City of Manassas Park, replacing roof shingles does not need a permit, and replacing roof sheathing or roof decking does. Window or door work in the City of Manassas Park needs a permit when it includes a structural alteration. Do not bring a City of Manassas square-foot limit or wind-speed limit onto a Manassas Park roof.',
      sources: ['mmp-park-need'],
      service: 'roofing',
    },
    {
      job: 'Patio or driveway in the City of Manassas',
      verdict: 'check',
      summary:
        'The City of Manassas zoning page names a driveway among the residential certifications to ask about before an exterior yard change. No driveway width is printed on the zoning page cited here. Check with the city before using a width from another office.',
      sources: ['mmp-man-zoning'],
    },
    {
      job: 'Patio or driveway in the City of Manassas Park',
      verdict: 'depends',
      summary:
        'A City of Manassas Park patio needs zoning approval, and the fence page states no patio size and no patio setback. In the front yard, the driveway may be 20 feet wide or 20 percent of the lot width, and the owner may use the larger of those two. An apron or curb cut is a separate application, with an inspection before the concrete is poured and another after it is in place.',
      sources: ['mmp-park-fence'],
      service: 'outdoor-living',
    },
  ],
  steps: [
    {
      text: 'Confirm whether the parcel is inside the City of Manassas, inside the City of Manassas Park, or in Prince William County, and then use that office. The county areas page is the county statement that its building and trade permits stop at the two cities. Each city map is the parcel check, and a mailing address is not.',
      sources: ['pwc-areas', 'mmp-man-gis', 'mmp-va-city'],
    },
    {
      text: 'In the City of Manassas, file the building permit with the plan set the plan-review page describes, and file a zoning certificate when the zoning page or the deck, shed, or fence guide requires one. Plans go in with the application. Staff review them for the Virginia construction code, and another city department can still have to approve the project before the permit is issued. Turn in at least two full plan sets, with enough architectural, structural, mechanical, plumbing, and electrical detail for the review. A Virginia-licensed designer signs and seals the plans, or, when a seal is not required, the plans carry the designer name, address, and occupation. Once the plans are approved, the applicant gets at least one stamped set to keep on the job. The trade contractor files the trade permit from those approved plans. Changing the work after that approval means submitting revised plans. New buildings and additions also bring two copies of a site-utility plan or a house-location survey, a special-inspections form, a soils report, and the structural designer calculations. A zoning certificate uses the city zoning-certificate application and a house-location survey that shows what is there and what is proposed.',
      sources: ['mmp-man-review', 'mmp-man-zoning', 'mmp-man-decks', 'mmp-man-fence'],
    },
    {
      text: 'In the City of Manassas Park, get zoning approval before the building plans for most structures. Follow SmartGov when you are using the path the building-permits page describes, and follow the scope worksheet when you are using the path the applications page still describes. Both of those city pages are still published. Drawings have to be to scale on paper no smaller than 11 by 17 inches. Most jobs need three copies, and the fire marshal or an outside agency can ask for more. For common jobs the city already publishes a standard detail, including a typical deck and a finished basement, and those jobs can use a simple layout sketch plus notes that are specific to the job. Put the inspection request in no later than the day before the visit. Same-day inspections are not available in the City of Manassas Park. The permit holder makes the request and has to have the permit number. Inspection visits run Monday through Friday, 9 AM to 4 PM, and the city usually books them for the following business day. Naming a clock time does not mean the inspector will arrive then.',
      sources: ['mmp-park-building', 'mmp-park-plans', 'mmp-park-applications', 'mmp-park-inspections'],
    },
    {
      text: 'In either city, a historic-overlay signature or a homeowners-association signature is separate from the permit. Neither signature replaces the city permit.',
      sources: ['mmp-man-historic', 'mmp-man-fence', 'mmp-park-fence'],
    },
  ],
  hoa: {
    text: 'The City of Manassas fence guide tells the owner to check the association neighborhood rules. The City of Manassas Park fence page says the association architectural review may have to approve the fence type, the place, and the installation. Approval from the association does not take the place of the city permit.',
    sources: ['mmp-man-fence', 'mmp-park-fence'],
  },
  historic: {
    text: 'The City of Manassas has three historic overlay districts: a local district of a bit more than 300 structures and about 2.5 square miles covering downtown and nearby neighborhoods, the Liberia Mansion district on an 18-acre site, and the Mayfield Fort district on 11.5 acres. The Architectural Review Board issues a certificate of appropriateness for the exterior actions the overlay page names, and the guidelines the board uses are built from the Secretary of the Interior standards. An owner in a district should talk to Planning and Development before an improvement, and should use the city map rather than assuming the whole city is covered. Check with the City of Manassas Park about historic review before exterior work in that city.',
    sources: ['mmp-man-historic'],
  },
  faqs: [
    {
      question: 'How does an owner tell these two cities from Prince William County?',
      answer: cite(
        {
          text: 'Start with the parcel. On its areas page, Prince William County lists both cities as places where county building and trade permits are not issued.',
          sources: ['pwc-areas'],
        },
        {
          text: 'The City of Manassas publishes a map for that check. Check with the City of Manassas Park for its map. A mailing address does not decide the office.',
          sources: ['mmp-man-gis'],
        },
      ),
    },
    {
      question: 'What deck work needs a City of Manassas building permit?',
      answer: cite({
        text: 'A new deck, added stairs, an enlargement, or replacement of structural members, guards, or stairs needs that city building permit. Board replacement, resurfacing, and stain are the exceptions in the city deck guide. The Prince William County deck measurement is not the City of Manassas rule.',
        sources: ['mmp-man-decks'],
      }),
    },
    {
      question: 'Why do Manassas Park\'s shed pages disagree?',
      answer: cite({
        text: 'One City of Manassas Park page uses 256 square feet and another uses 150 square feet. This guide shows both and tells the owner to ask the city which line that shed falls under.',
        sources: ['mmp-park-building', 'mmp-park-need'],
      }),
    },
    {
      question: 'Does finishing a basement need a permit in Manassas or Manassas Park?',
      answer: cite(
        {
          text: 'In the City of Manassas Park, yes. The city required list includes finishing a basement.',
          sources: ['mmp-park-need'],
        },
        {
          text: 'Check with the City of Manassas for a basement on a Manassas parcel. The pages opened for this guide do not state that city basement rule.',
          sources: [],
        },
      ),
    },
    {
      question: 'Who files the electrical, plumbing, or mechanical permit?',
      answer: cite(
        {
          text: 'The trade contractor files that city trade permit. In Manassas Park each trade still receives its own permit number even when several trades are filed together.',
          sources: ['mmp-man-review', 'mmp-park-applications'],
        },
        {
          text: 'Real Elite arranges electrical, plumbing, and HVAC, and the firm does not perform those trades. Confirm the trade contractor is the person who files the trade permit.',
          sources: [],
        },
      ),
    },
  ],
  sourceIds: [
    'pwc-areas',
    'mmp-va-city',
    'mmp-dhcd',
    'mmp-man-building',
    'mmp-man-exempt',
    'mmp-man-zoning',
    'mmp-man-decks',
    'mmp-man-accessory',
    'mmp-man-fence',
    'mmp-man-review',
    'mmp-man-historic',
    'mmp-man-site',
    'mmp-man-utility',
    'mmp-man-index',
    'mmp-man-gis',
    'mmp-park-building',
    'mmp-park-need',
    'mmp-park-plans',
    'mmp-park-inspections',
    'mmp-park-applications',
    'mmp-park-fence',
    'mmp-park-water',
  ],
  areaSlugs: ['manassas-va'],
  relatedPosts: [],
};

export const BATCH3_PERMIT_GUIDES: readonly CountyPermitGuide[] = [
  FREDERICK_VA, CLARKE, ALEXANDRIA, FALLS_FAIRFAX, ANNE_ARUNDEL, CARROLL, MANASSAS_CITIES,
];
