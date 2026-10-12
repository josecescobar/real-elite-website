import type { CitedText, CountyPermitGuide, PermitSource } from './permit-guides';

const PUBLISHED = '2026-10-11';
const cite = (...parts: CitedText[]): readonly CitedText[] => parts;

/** Sources opened on 2026-10-11. Each URL is an official local or state government page. */
export const BATCH2_PERMIT_SOURCES: readonly PermitSource[] = [
  { id: 'berk-process', label: 'Berkeley County: Building permit process', url: 'https://www.berkeleywv.org/580/Building-Permit-Process' },
  { id: 'berk-office', label: 'Berkeley County: Building Permits and Inspections', url: 'https://www.berkeleywv.org/162/Building-Permits-and-Inspections' },
  { id: 'jeff-office', label: 'Jefferson County: Office of Building Permits and Inspections', url: 'https://www.jeffersoncountywv.org/county-government/departments/engineering-department/building-permits-new' },
  { id: 'jeff-boundaries', label: 'Jefferson County: Building permit instructions and jurisdiction (PDF)', url: 'https://www.jeffersoncountywv.org/home/showpublisheddocument/25566/638505829202930000' },
  { id: 'charles-town-guide', label: 'City of Charles Town: Building permit guide (PDF)', url: 'https://www.charlestownwv.us/Documents/Government/Charles-Town-Guide-to-Building-Permit-Process-3.pdf' },
  { id: 'ranson-building', label: 'City of Ranson: Building, Site and Infrastructure Division', url: 'https://ransonwv.gov/building-site-infrastructure-division/' },
  { id: 'shepherdstown-building', label: 'Shepherdstown: Building, Planning, Zoning and Historic Landmarks', url: 'https://www.shepherdstown.gov/Building' },
  { id: 'harpers-forms', label: 'Harpers Ferry: Official forms and applications', url: 'https://www.harpersferrywv.us/forms.html' },
  { id: 'wash-booklet', label: 'Washington County: Homeowner permit procedures (PDF)', url: 'https://www.washco-md.net/wp-content/uploads/HomeownerPermitProceduresBooklet.pdf' },
  { id: 'wash-office', label: 'Washington County: Permits and Inspections', url: 'https://www.washco-md.net/permits-and-inspections/' },
  { id: 'wash-inspections', label: 'Washington County: Inspections', url: 'https://www.washco-md.net/permits-and-inspections/inspections/' },
  { id: 'hagerstown-permits', label: 'City of Hagerstown: Building permits', url: 'https://hagerstownmd.org/221/Building-Permits' },
  { id: 'hagerstown-exempt', label: 'City of Hagerstown: Work exempt from building permits', url: 'https://www.hagerstownmd.org/618/Work-exempt-from-Building-Permits' },
  { id: 'pa-election', label: 'Pennsylvania Labor and Industry: Municipal UCC election', url: 'https://www.pa.gov/agencies/dli/programs-services/labor-management-relations/bureau-of-occupational-and-industrial-safety/uniform-construction-code-home/municipal-election-information-and-forms' },
  { id: 'pa-agencies', label: 'Pennsylvania Labor and Industry: Certified third-party building agencies', url: 'https://www.pa.gov/agencies/dli/programs-services/labor-management-relations/bureau-of-occupational-and-industrial-safety/tpa-buildings' },
  { id: 'chambersburg-permits', label: 'Borough of Chambersburg: Applications and permits', url: 'https://chambersburgpa.gov/resident/permits.html' },
  { id: 'chambersburg-landuse', label: 'Borough of Chambersburg: Land Use and Community Development', url: 'https://chambersburgpa.gov/government/landuse.html' },
  { id: 'warrenton-permits', label: 'Town of Warrenton: Building and zoning permits', url: 'https://www.warrentonva.gov/631/BuildingZoning-Permits' },
  { id: 'warrenton-development', label: 'Town of Warrenton: Community Development', url: 'https://warrentonva.gov/164/Community-Development' },
  { id: 'pwc-areas', label: 'Prince William County: Areas We Serve', url: 'https://www.pwcva.gov/department/development-services/areas-we-serve/' },
  { id: 'pwc-need', label: 'Prince William County: Do I Need a Permit?', url: 'https://www.pwcva.gov/department/building-development-division/do-i-need-permit' },
  { id: 'pwc-decks', label: 'Prince William County: Residential decks', url: 'https://www.pwcva.gov/department/building-development-division/residential-deck/' },
  { id: 'pwc-basement', label: 'Prince William County: Finishing a residential basement', url: 'https://www.pwcva.gov/department/building-development-division/basement/' },
  { id: 'haymarket-permits', label: 'Town of Haymarket: Building and zoning permits', url: 'https://www.townofhaymarket.org/1475/BuildingZoning-Permit' },
];

const BERKELEY: CountyPermitGuide = {
  slug: 'berkeley-county-wv', county: 'Berkeley County', state: 'WV', stateName: 'West Virginia',
  h1: 'Do I Need a Remodel Permit in Berkeley County, WV?',
  seoTitle: 'Berkeley County WV Remodel Permits: City or County?',
  description: 'Berkeley County, WV permit guide for decks, basements, baths, additions, and exterior work.',
  cardBlurb: 'Read the Berkeley County remodel permit guide.',
  keywords: ['Berkeley County WV building permit', 'Martinsburg remodel permit', 'Berkeley County deck permit'],
  published: PUBLISHED, updated: PUBLISHED,
  answer: cite(
    { text: 'Berkeley County lists construction, enlargements, alterations, repairs, decks, and regulated trade work in its building permit process.', sources: ['berk-process'] },
    { text: 'For a Martinsburg address, confirm the correct permit office before filing.', sources: ['berk-office'] },
  ),
  jurisdictionIntro: cite(
    { text: 'Ask the county permit office which application process applies to the project address.', sources: ['berk-office'] },
  ),
  issuers: [
    { name: 'Berkeley County Building Permits and Inspections', covers: 'Reviews and inspects county building work, including residential construction and alterations.', sources: ['berk-office', 'berk-process'] },
  ],
  jobs: [
    { job: 'Deck', verdict: 'required', summary: 'The county expressly includes decks in its building permit process. For a Martinsburg address, confirm the correct office before work.', sources: ['berk-process', 'berk-office'], service: 'decks' },
    { job: 'Finished basement', verdict: 'depends', summary: 'Finishing a basement can involve building and trade alterations. Check the exact scope with the county or Martinsburg office.', sources: ['berk-process'], service: 'basements' },
    { job: 'Bathroom or kitchen remodel', verdict: 'depends', summary: 'Changes to regulated plumbing, electrical, gas, or mechanical systems fall within the county permit process. Check cosmetic-only work with the relevant office.', sources: ['berk-process'], service: 'bathrooms' },
    { job: 'Addition or porch', verdict: 'required', summary: 'The county requires permits for enlargements. For a Martinsburg address, confirm the correct office before work.', sources: ['berk-process', 'berk-office'], service: 'additions' },
    { job: 'Shed or accessory structure', verdict: 'depends', summary: 'The county includes prefabricated structures. For a Martinsburg address, confirm the correct office before work.', sources: ['berk-process', 'berk-office'] },
    { job: 'Roof, siding, or window work', verdict: 'check', summary: 'Check with the county or city about the exact repair or replacement scope before starting.', sources: ['berk-process'], service: 'roofing' },
  ],
  steps: [
    { text: 'Confirm the permit office for the project address before filing.', sources: ['berk-office'] },
    { text: 'For county work, submit an application and residential plans to Building Permits and Inspections; ask whether trade permits or utility approvals also apply.', sources: ['berk-process'] },
    { text: 'Arrange the inspections required by the office that issues your permit.', sources: ['berk-office'] },
  ],
  hoa: { text: 'A building permit does not replace any approval your HOA requires. Check your community documents separately.', sources: ['berk-process'] },
  historic: { text: 'Contact the permit office for the project address about any local historic review before exterior work.', sources: ['berk-office'] },
  faqs: [
    { question: 'Where should I ask about permits for a Martinsburg address?', answer: cite({ text: 'Ask Berkeley County Building Permits and Inspections which application process applies to the project address.', sources: ['berk-office'] }) },
    { question: 'Does Berkeley County require a deck permit?', answer: cite({ text: 'Yes. The county names decks in its building permit process.', sources: ['berk-process'] }) },
    { question: 'Who checks trade work?', answer: cite({ text: 'Check with the county or city office for the electrical, plumbing, gas, or mechanical work in your scope.', sources: ['berk-process'] }) },
  ],
  sourceIds: ['berk-process', 'berk-office'],
  areaSlugs: ['martinsburg-wv'], relatedPosts: [],
};

const JEFFERSON: CountyPermitGuide = {
  slug: 'jefferson-county-wv', county: 'Jefferson County', state: 'WV', stateName: 'West Virginia',
  h1: 'Do I Need a Remodel Permit in Jefferson County, WV?',
  seoTitle: 'Jefferson County WV Remodel Permits by Jurisdiction',
  description: 'Jefferson County, WV permit guide for decks, finished basements, baths, and additions, including Charles Town, Ranson, Shepherdstown, and Harpers Ferry.',
  cardBlurb: 'Read the Jefferson County remodel permit guide.',
  keywords: ['Jefferson County WV building permit', 'Charles Town remodel permit', 'Shepherdstown deck permit'],
  published: PUBLISHED, updated: PUBLISHED,
  answer: cite(
    { text: 'Jefferson County names remodeling, finished basements, additions, decks, and trade work in its permit program for unincorporated property.', sources: ['jeff-office'] },
    { text: 'Its published instructions exclude Charles Town, Ranson, Harpers Ferry, Bolivar, and Shepherdstown. Confirm the parcel boundary first.', sources: ['jeff-boundaries'] },
  ),
  jurisdictionIntro: cite(
    { text: 'The county permit office serves unincorporated Jefferson County. Its instructions exclude incorporated places; check with the relevant city or town about the remodel scope for a parcel inside its limits.', sources: ['jeff-boundaries'] },
  ),
  issuers: [
    { name: 'Jefferson County Office of Building Permits and Inspections', covers: 'Handles building permits in unincorporated Jefferson County.', sources: ['jeff-office', 'jeff-boundaries'] },
    { name: 'Charles Town and Ranson', covers: 'Each city has its own building permit process.', sources: ['charles-town-guide', 'ranson-building', 'jeff-boundaries'] },
    { name: 'Shepherdstown and Harpers Ferry', covers: 'Shepherdstown describes town building permits and historic review. Harpers Ferry lists zoning compliance forms; check with the town about remodel scope.', sources: ['shepherdstown-building', 'harpers-forms', 'jeff-boundaries'] },
  ],
  jobs: [
    { job: 'Deck', verdict: 'required', summary: 'The county includes decks among permitted work for unincorporated property. Check with the appropriate city or town inside its limits.', sources: ['jeff-office', 'jeff-boundaries'], service: 'decks' },
    { job: 'Finished basement', verdict: 'required', summary: 'The county names finished basements in its permit program. Charles Town also lists basement finishing in its city guide.', sources: ['jeff-office', 'charles-town-guide'], service: 'basements' },
    { job: 'Bathroom or kitchen remodel', verdict: 'depends', summary: 'The county names renovation and plumbing, mechanical, and electrical work. Check the exact changes with the office for your address.', sources: ['jeff-office', 'jeff-boundaries'], service: 'bathrooms' },
    { job: 'Addition or porch', verdict: 'required', summary: 'The county lists additions. Shepherdstown requires a town permit for building extensions within its limits.', sources: ['jeff-office', 'shepherdstown-building'], service: 'additions' },
    { job: 'Shed or fence', verdict: 'depends', summary: 'The county lists sheds and some fences. Town rules differ; Shepherdstown requires town permits for sheds and fences.', sources: ['jeff-office', 'shepherdstown-building'] },
    { job: 'Roof, siding, or window work', verdict: 'check', summary: 'Check with the county, city, or town for the precise scope and any historic review before exterior work.', sources: ['jeff-office', 'shepherdstown-building'], service: 'roofing' },
  ],
  steps: [
    { text: 'Confirm whether the parcel is in unincorporated county land or an incorporated city or town.', sources: ['jeff-boundaries'] },
    { text: 'Ask the correct office for its application and plan requirements before submitting.', sources: ['jeff-office', 'charles-town-guide', 'ranson-building', 'shepherdstown-building', 'harpers-forms'] },
    { text: 'Arrange inspections with the office that issues the building permit.', sources: ['jeff-office', 'ranson-building'] },
  ],
  hoa: { text: 'If an HOA governs your property, check its separate approval rules before construction.', sources: ['jeff-office'] },
  historic: { text: 'Shepherdstown says work in its historic district can need a Certificate of Appropriateness before a building permit. Check with Harpers Ferry about any local review for its historic properties.', sources: ['shepherdstown-building', 'harpers-forms'] },
  faqs: [
    { question: 'Does Jefferson County issue permits in Charles Town?', answer: cite({ text: 'No. The county instructions exclude incorporated Charles Town; use the city permit process.', sources: ['jeff-boundaries', 'charles-town-guide'] }) },
    { question: 'Is a finished basement covered?', answer: cite({ text: 'Yes, the county names finished basements for unincorporated parcels.', sources: ['jeff-office'] }) },
    { question: 'What if my home is in Shepherdstown?', answer: cite({ text: 'Contact Shepherdstown for its town permit and any historic review.', sources: ['shepherdstown-building'] }) },
  ],
  sourceIds: ['jeff-office', 'jeff-boundaries', 'charles-town-guide', 'ranson-building', 'shepherdstown-building', 'harpers-forms'],
  areaSlugs: ['charles-town-wv', 'ranson-wv', 'shepherdstown-wv', 'harpers-ferry-wv'], relatedPosts: [],
};

const WASHINGTON: CountyPermitGuide = {
  slug: 'washington-county-md', county: 'Washington County', state: 'MD', stateName: 'Maryland',
  h1: 'Do I Need a Remodel Permit in Washington County, MD?',
  seoTitle: 'Washington County MD Remodel Permits and Town Rules',
  description: 'Washington County, MD permit guide for decks, basements, baths, and additions. Find the right path for Hagerstown, Boonsboro, Williamsport, or county land.',
  cardBlurb: 'Read the Washington County remodel permit guide.',
  keywords: ['Washington County MD building permit', 'Hagerstown deck permit', 'Boonsboro building permit'],
  published: PUBLISHED, updated: PUBLISHED,
  answer: cite(
    { text: "Washington County's homeowner procedure describes its building review path outside Hagerstown.", sources: ['wash-booklet'] },
    { text: 'Hagerstown uses its city permit office.', sources: ['hagerstown-permits'] },
    { text: 'Boonsboro and Williamsport residents first obtain town zoning review, then use the county building review path described in the county booklet.', sources: ['wash-booklet'] },
  ),
  jurisdictionIntro: cite(
    { text: 'Check the actual town boundary. The county homeowner booklet distinguishes county parcels, Hagerstown, and towns whose zoning approval precedes county building review.', sources: ['wash-booklet'] },
  ),
  issuers: [
    { name: 'Washington County Division of Permits and Inspections', covers: 'Handles building review for county parcels and, after town zoning review, the Boonsboro and Williamsport process.', sources: ['wash-booklet', 'wash-office'] },
    { name: 'City of Hagerstown', covers: 'Takes building permit applications for property within city limits.', sources: ['hagerstown-permits', 'wash-booklet'] },
    { name: 'Boonsboro and Williamsport zoning offices', covers: 'Review town zoning before the county building review route described in the county booklet.', sources: ['wash-booklet'] },
  ],
  jobs: [
    { job: 'Deck', verdict: 'depends', summary: 'Check the county or town permit path for your parcel. Hagerstown has its own residential deck application materials.', sources: ['wash-booklet', 'hagerstown-permits'], service: 'decks' },
    { job: 'Finished basement', verdict: 'depends', summary: 'Check with the correct permit office about the proposed building and trade work.', sources: ['wash-office', 'hagerstown-permits'], service: 'basements' },
    { job: 'Bathroom or kitchen remodel', verdict: 'depends', summary: 'Ask whether building or separate trade approvals apply to your plumbing, electrical, or mechanical changes.', sources: ['wash-inspections', 'hagerstown-permits'], service: 'bathrooms' },
    { job: 'Addition or porch', verdict: 'required', summary: 'The county homeowner procedure provides a building permit path for new construction and additions; town zoning can apply first.', sources: ['wash-booklet'], service: 'additions' },
    { job: 'Shed', verdict: 'depends', summary: 'Hagerstown lists a limited exemption for small detached storage buildings. Check county or town rules for your parcel.', sources: ['hagerstown-exempt', 'wash-booklet'] },
    { job: 'Roof, siding, or window work', verdict: 'check', summary: 'Check with the office serving your parcel; Hagerstown publishes specific roof and ordinary finish exceptions.', sources: ['hagerstown-permits', 'hagerstown-exempt'], service: 'roofing' },
  ],
  steps: [
    { text: 'Check whether the property is in Hagerstown, another incorporated town, or county jurisdiction.', sources: ['wash-booklet'] },
    { text: 'For Boonsboro or Williamsport, seek town zoning approval before county building review.', sources: ['wash-booklet'] },
    { text: 'Apply to the correct permit office and request the required inspections after approval.', sources: ['wash-booklet', 'wash-inspections', 'hagerstown-permits'] },
  ],
  hoa: { text: 'Check your HOA documents for separate approval of exterior or structural changes.', sources: ['wash-booklet'] },
  historic: { text: 'Check with the city or town before exterior work on a historic property; the permit office can identify any additional local review.', sources: ['hagerstown-permits', 'wash-booklet'] },
  faqs: [
    { question: 'Does Hagerstown use Washington County building permits?', answer: cite({ text: 'Hagerstown accepts its own building permit applications for city property.', sources: ['hagerstown-permits'] }) },
    { question: 'Where do Boonsboro residents begin?', answer: cite({ text: 'The county procedure directs Boonsboro residents to town zoning review before county building review.', sources: ['wash-booklet'] }) },
    { question: 'Do I need a permit for a bathroom remodel?', answer: cite({ text: 'Check with the office serving your parcel; the answer depends on the building and trade changes.', sources: ['wash-inspections'] }) },
  ],
  sourceIds: ['wash-booklet', 'wash-office', 'wash-inspections', 'hagerstown-permits', 'hagerstown-exempt'],
  areaSlugs: ['hagerstown-md', 'boonsboro-md', 'williamsport-md', 'sharpsburg-md'], relatedPosts: [],
};

const FRANKLIN: CountyPermitGuide = {
  slug: 'franklin-county-pa', county: 'Franklin County', state: 'PA', stateName: 'Pennsylvania',
  h1: 'Do I Need a Remodel Permit in Franklin County, PA?',
  seoTitle: 'Franklin County PA Remodel Permits: Borough or Township',
  description: 'Franklin County, PA remodel permit guide for Chambersburg and local townships. Learn how municipal UCC review and certified third-party inspectors fit together.',
  cardBlurb: 'Read the Franklin County remodel permit guide.',
  keywords: ['Franklin County PA building permit', 'Chambersburg remodel permit', 'Pennsylvania UCC residential permit'],
  published: PUBLISHED, updated: PUBLISHED,
  answer: cite(
    { text: 'In Franklin County, start with the borough or township where the property sits.', sources: ['pa-election'] },
    { text: 'Pennsylvania allows municipalities to administer the Uniform Construction Code themselves or through a certified third-party agency; residential owners in an opt-out municipality arrange certified third-party code services.', sources: ['pa-election', 'pa-agencies'] },
    { text: 'Chambersburg directs remodeling and additions through borough land-use review and its building-code agency.', sources: ['chambersburg-permits'] },
  ),
  jurisdictionIntro: cite(
    { text: 'Identify the borough or township, obtain its land-use directions, and confirm its UCC agency before construction.', sources: ['pa-election'] },
  ),
  issuers: [
    { name: 'Your borough or township', covers: 'Controls local land-use review and identifies the UCC permit process for its municipality.', sources: ['pa-election', 'chambersburg-permits'] },
    { name: 'Borough of Chambersburg and its building-code agency', covers: 'The borough handles land-use review; its published permit information directs applicants to PA Municipal Code Alliance for building-code permits.', sources: ['chambersburg-permits', 'chambersburg-landuse'] },
    { name: 'Certified third-party agency where applicable', covers: 'Pennsylvania lists agencies eligible to provide residential UCC code services in opt-out municipalities or under municipal contract.', sources: ['pa-election', 'pa-agencies'] },
  ],
  jobs: [
    { job: 'Deck', verdict: 'check', summary: 'Check with your borough or township and its UCC agency for the deck design and location.', sources: ['pa-election', 'pa-agencies'], service: 'decks' },
    { job: 'Finished basement', verdict: 'check', summary: 'Check with the municipality and its UCC agency about the proposed finish and trade work.', sources: ['pa-election', 'pa-agencies'], service: 'basements' },
    { job: 'Bathroom or kitchen remodel', verdict: 'depends', summary: 'Chambersburg lists remodeling under its land-use process. Elsewhere, check with the borough or township about the proposed changes.', sources: ['chambersburg-permits', 'pa-election'], service: 'bathrooms' },
    { job: 'Addition or porch', verdict: 'depends', summary: 'Chambersburg lists additions under borough land-use review. Check with your municipality and its UCC agency for building approval.', sources: ['chambersburg-permits', 'pa-election'], service: 'additions' },
    { job: 'Shed or accessory structure', verdict: 'check', summary: 'Check with the borough or township for zoning and code requirements at your site.', sources: ['pa-election', 'pa-agencies'] },
    { job: 'Roof, siding, or window work', verdict: 'check', summary: 'Check with the municipality and its code agency about your repair or replacement scope.', sources: ['pa-election', 'pa-agencies'], service: 'roofing' },
  ],
  steps: [
    { text: 'Identify the property’s borough or township and ask for its zoning and UCC permit instructions.', sources: ['pa-election', 'chambersburg-permits'] },
    { text: 'For Chambersburg, start with borough land-use review, then follow its direction to the building-code agency.', sources: ['chambersburg-permits'] },
    { text: 'If a municipality uses a third-party agency, confirm that agency’s current residential scope using the state list and local office.', sources: ['pa-election', 'pa-agencies'] },
  ],
  hoa: { text: 'Your HOA may require a separate review. Check association rules before starting an exterior project.', sources: ['pa-election'] },
  historic: { text: 'Check with the borough or township for any local historic or design review before exterior changes.', sources: ['chambersburg-landuse', 'pa-election'] },
  faqs: [
    { question: 'Does Franklin County issue one permit for every township?', answer: cite({ text: 'No. Start with the borough or township for the property.', sources: ['pa-election'] }) },
    { question: 'Who handles a Chambersburg remodel?', answer: cite({ text: 'The borough lists remodeling under its land-use process and directs applicants to its building-code agency.', sources: ['chambersburg-permits'] }) },
    { question: 'When is a third-party inspector involved?', answer: cite({ text: 'A certified agency may provide UCC services under municipal contract or for residential work in an opt-out municipality.', sources: ['pa-election', 'pa-agencies'] }) },
  ],
  sourceIds: ['pa-election', 'pa-agencies', 'chambersburg-permits', 'chambersburg-landuse'],
  areaSlugs: ['chambersburg-pa', 'greencastle-pa', 'fort-loudon-pa', 'mercersburg-pa', 'waynesboro-pa', 'fayetteville-pa'], relatedPosts: [],
};

const FAUQUIER: CountyPermitGuide = {
  slug: 'fauquier-county-va', county: 'Fauquier County', state: 'VA', stateName: 'Virginia',
  h1: 'Do I Need a Remodel Permit in Fauquier County, VA?',
  seoTitle: 'Fauquier County VA Remodel Permits and Warrenton',
  description: 'Fauquier County, VA permit guide for decks, basements, baths, and additions, with the separate Town of Warrenton building and zoning path.',
  cardBlurb: 'Read the Fauquier County remodel permit guide.',
  keywords: ['Fauquier County building permit', 'Warrenton remodel permit', 'Fauquier deck permit'],
  published: PUBLISHED, updated: PUBLISHED,
  answer: cite(
    { text: 'For a county parcel, check with the county about permit requirements for your project.', sources: [] },
    { text: "For a parcel inside Warrenton, use the town's building and zoning permit process.", sources: ['warrenton-permits'] },
  ),
  jurisdictionIntro: cite(
    { text: 'Check with the county if your parcel is outside the Town of Warrenton.', sources: [] },
    { text: 'Warrenton publishes its own building and zoning permit process for town parcels.', sources: ['warrenton-permits', 'warrenton-development'] },
  ),
  issuers: [
    { name: 'Town of Warrenton Community Development', covers: 'Processes building and zoning permits and inspections inside town limits.', sources: ['warrenton-permits', 'warrenton-development'] },
  ],
  jobs: [
    { job: 'Deck', verdict: 'check', summary: 'For a Town of Warrenton parcel, consult the town building and zoning permit guidance.', sources: ['warrenton-permits'], service: 'decks' },
    { job: 'Finished basement', verdict: 'check', summary: 'For a Town of Warrenton parcel, consult the town building and zoning permit guidance.', sources: ['warrenton-permits'], service: 'basements' },
    { job: 'Bathroom or kitchen remodel', verdict: 'check', summary: 'For a Town of Warrenton parcel, consult the town building and zoning permit guidance.', sources: ['warrenton-permits'], service: 'bathrooms' },
    { job: 'Addition or porch', verdict: 'check', summary: 'For a Town of Warrenton parcel, consult the town building and zoning permit guidance.', sources: ['warrenton-permits'], service: 'additions' },
    { job: 'Shed or accessory structure', verdict: 'check', summary: 'For a Town of Warrenton parcel, consult the town building and zoning permit guidance.', sources: ['warrenton-permits'] },
    { job: 'Roof, siding, or window work', verdict: 'check', summary: 'For a Town of Warrenton parcel, consult the town building and zoning permit guidance.', sources: ['warrenton-permits'], service: 'roofing' },
  ],
  steps: [
    { text: 'For a Town of Warrenton parcel, start with Community Development for the town permit path.', sources: ['warrenton-development', 'warrenton-permits'] },
    { text: 'For a Town of Warrenton project, follow the town building and zoning permit process.', sources: ['warrenton-permits'] },
    { text: 'For a Town of Warrenton project, ask Community Development about inspections.', sources: ['warrenton-development'] },
  ],
  hoa: { text: 'Check HOA approval separately from the building and zoning permit path.', sources: [] },
  historic: { text: 'Warrenton Community Development administers the town historic district. Ask the town about exterior work on a covered property.', sources: ['warrenton-development'] },
  faqs: [
    { question: 'Does Fauquier County require a deck permit?', answer: cite({ text: 'Check with the county for a county parcel.', sources: [] }, { text: 'For a Town of Warrenton parcel, consult the town permit guidance.', sources: ['warrenton-permits'] }) },
    { question: 'Who handles permits in Warrenton?', answer: cite({ text: 'Warrenton has its own building and zoning permit process inside town limits.', sources: ['warrenton-permits'] }) },
    { question: 'Does a bathroom remodel need a permit?', answer: cite({ text: 'Check with the county for a county parcel.', sources: [] }, { text: 'For a Town of Warrenton parcel, consult the town permit guidance.', sources: ['warrenton-permits'] }) },
  ],
  sourceIds: ['warrenton-permits', 'warrenton-development'],
  areaSlugs: ['warrenton-va', 'the-plains-va', 'upperville-va', 'marshall-va', 'delaplane-va'], relatedPosts: [],
};

const PRINCE_WILLIAM: CountyPermitGuide = {
  slug: 'prince-william-county-va', county: 'Prince William County', state: 'VA', stateName: 'Virginia',
  h1: 'Do I Need a Remodel Permit in Prince William County, VA?',
  seoTitle: 'Prince William County VA Remodel Permit Guide',
  description: 'Prince William County, VA permit guide for decks, basements, baths, and additions. Distinguish county, Haymarket, Manassas, and Manassas Park.',
  cardBlurb: 'Read the Prince William County remodel permit guide.',
  keywords: ['Prince William County building permit', 'Haymarket deck permit', 'Manassas remodel permit'],
  published: PUBLISHED, updated: PUBLISHED,
  answer: cite(
    { text: 'Prince William County describes permit requirements for decks, additions, finished basements, and structural or trade system changes.', sources: ['pwc-need', 'pwc-decks', 'pwc-basement'] },
    { text: 'Its Development Services department does not serve the independent cities of Manassas and Manassas Park.', sources: ['pwc-areas'] },
    { text: 'In Haymarket, obtain town zoning approval before applying for a county building permit.', sources: ['haymarket-permits'] },
  ),
  jurisdictionIntro: cite(
    { text: 'Check the parcel jurisdiction. County Development Services excludes Manassas and Manassas Park; Haymarket has town zoning before county building review.', sources: ['pwc-areas', 'haymarket-permits'] },
  ),
  issuers: [
    { name: 'Prince William County Development Services', covers: 'Issues county building and trade permits, including for Haymarket after town zoning approval.', sources: ['pwc-areas', 'haymarket-permits'] },
    { name: 'Town of Haymarket', covers: 'Provides zoning approval before a county building permit application.', sources: ['haymarket-permits'] },
    { name: 'Cities of Manassas and Manassas Park', covers: 'Separate independent cities outside the county Development Services permit jurisdiction; contact the relevant city.', sources: ['pwc-areas'] },
  ],
  jobs: [
    { job: 'Deck', verdict: 'depends', summary: 'The county requires a building permit for new decks and structural deck changes, with a narrow low-deck exception described in its guide. Zoning approval can still apply.', sources: ['pwc-decks', 'pwc-need'], service: 'decks' },
    { job: 'Finished basement', verdict: 'required', summary: 'The county provides a finished-basement permit process and requires floor plans through its ePortal.', sources: ['pwc-basement'], service: 'basements' },
    { job: 'Bathroom or kitchen remodel', verdict: 'depends', summary: 'Structural changes or changes to plumbing, electrical, or mechanical systems require permits. Check the exact scope with county staff.', sources: ['pwc-need'], service: 'bathrooms' },
    { job: 'Addition or porch', verdict: 'required', summary: 'The county lists additions among work requiring a building permit. Haymarket zoning approval comes first for town property.', sources: ['pwc-need', 'haymarket-permits'], service: 'additions' },
    { job: 'Shed or accessory structure', verdict: 'depends', summary: 'The county lists a size threshold for shed building permits, while zoning approval may still apply.', sources: ['pwc-need'] },
    { job: 'Roof, siding, or window work', verdict: 'check', summary: 'Check the exact repair scope with the county; window and door work involving structural changes can need a permit.', sources: ['pwc-need'], service: 'roofing' },
  ],
  steps: [
    { text: 'Use the county jurisdiction check to distinguish county land, Haymarket, Manassas, and Manassas Park.', sources: ['pwc-areas'] },
    { text: 'For Haymarket, obtain town zoning approval before applying to the county for building permits.', sources: ['haymarket-permits'] },
    { text: 'Submit the required plans and permits to the correct office, then request inspections under its process.', sources: ['pwc-decks', 'pwc-basement'] },
  ],
  hoa: { text: 'Check HOA approval separately, including for exterior work that may be exempt from a building permit.', sources: ['pwc-need'] },
  historic: { text: 'Ask the relevant county, town, or city office whether historic or local design review applies to exterior work on your parcel.', sources: ['pwc-areas', 'haymarket-permits'] },
  faqs: [
    { question: 'Does Prince William County issue permits in Manassas?', answer: cite({ text: 'No. Manassas and Manassas Park are independent cities outside county Development Services jurisdiction.', sources: ['pwc-areas'] }) },
    { question: 'Who issues building permits in Haymarket?', answer: cite({ text: 'The town gives zoning approval first; Prince William County issues the building permit.', sources: ['haymarket-permits'] }) },
    { question: 'Do I need a permit to finish a basement?', answer: cite({ text: 'Yes. The county has a finished-basement building permit process.', sources: ['pwc-basement'] }) },
  ],
  sourceIds: ['pwc-areas', 'pwc-need', 'pwc-decks', 'pwc-basement', 'haymarket-permits'],
  areaSlugs: ['prince-william-county-va', 'haymarket-va', 'manassas-va', 'gainesville-va', 'bristow-va', 'nokesville-va', 'lake-ridge-va', 'woodbridge-va', 'catharpin-va'], relatedPosts: [],
};

export const BATCH2_PERMIT_GUIDES: readonly CountyPermitGuide[] = [
  BERKELEY, JEFFERSON, WASHINGTON, FRANKLIN, FAUQUIER, PRINCE_WILLIAM,
];
