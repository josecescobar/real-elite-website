/**
 * Localized service×city body copy + the slug catalogs its keys are typed
 * against. Extracted from src/app/services/[service]/[city]/page.tsx so the
 * route keeps only logic. Data-only module — no behavior lives here.
 *
 * Coverage is PARTIAL: only combos with a CONTENT entry render (the route's
 * generateStaticParams derives the published list from CONTENT keys).
 */

export const FEATURED_SERVICE_SLUGS = [
  'roofing',
  'decks',
  'remodeling',
  'siding',
  'bathrooms',
  'kitchens',
  'basements',
  'additions',
] as const;
export type FeaturedServiceSlug = (typeof FEATURED_SERVICE_SLUGS)[number];

/**
 * Service+city deep-link combos exist for these 6 cities. Each pairing
 * has hand-written localized content in the CONTENT map below.
 *
 * NOTE: this list is INTENTIONALLY decoupled from EXPANSION_SERVICE_AREAS
 * in constants.ts. Adding a city-overview page (in constants) should NOT
 * automatically create per-service deep-link pages here without the
 * localized content also being written.
 *
 * Coverage is PARTIAL across the matrix: roofing / decks / remodeling /
 * siding ship combos for all six cities; bathrooms / kitchens / basements /
 * additions only render where the matching CONTENT entry exists. generateStaticParams
 * derives the actual list from CONTENT keys so half-built combos never
 * ship as 404s.
 */
export const COMBO_CITY_SLUGS = [
  'winchester-va',
  'frederick-md',
  'leesburg-va',
  'ashburn-va',
  'hagerstown-md',
  'loudoun-county-va',
  'mclean-va',
  'alexandria-va',
  'vienna-va',
  'great-falls-va',
  'reston-va',
  'burke-va',
  'fairfax-station-va',
  'clifton-va',
  'middleburg-va',
] as const;
export type ExpansionCitySlug = (typeof COMBO_CITY_SLUGS)[number];

// Unique body content for each service × city combination.
// Partial — only combos with hand-written content are listed.
export const CONTENT: Partial<Record<`${FeaturedServiceSlug}-${ExpansionCitySlug}`, { paragraphs: string[] }>> = {
  // ── ROOFING ──────────────────────────────────────────────────────────────

  'roofing-winchester-va': {
    paragraphs: [
      "Winchester's location at the northern gateway to Virginia's Shenandoah Valley means your roof faces some of the most demanding weather in the region. Hot, humid summers bring afternoon thunderstorms, while winters deliver freezing rain, ice dams, and heavy snowfall that stress aging roofing systems. For homeowners in Winchester, VA, a quality roof isn't just curb appeal — it's essential protection for one of your biggest investments.",
      "Real Elite Contracting provides professional roofing services across Winchester and the surrounding Frederick County communities. Whether you're dealing with wind damage from a Shenandoah Valley storm, worn shingles in the Shawnee District, or you need a proactive replacement along Senseny Road, our experienced crews deliver clean, durable results every time. We work with premium architectural shingles from GAF and Owens Corning, backed by manufacturer warranties that protect your home for decades.",
      "Winchester's mix of historic and newer homes creates unique roofing challenges. The Victorian and Federal-style homes in Old Town Winchester often feature steep pitches, dormers, and intricate valleys that demand precision craftsmanship. We're experienced working on complex historic rooflines while maintaining the character that defines these neighborhoods. For newer suburban developments along Route 7, Route 522, and the Millwood corridor, we offer efficient full replacements with fast turnaround times.",
      "We handle the entire process — from initial inspection and detailed estimate to final cleanup and permit coordination. When storm damage is involved, we work directly with your insurance company to simplify the claims process. Our goal is a stress-free experience that leaves you with a beautiful, long-lasting roof.",
    ],
  },

  'roofing-frederick-md': {
    paragraphs: [
      "Frederick, Maryland sits along the I-70 corridor in a region known for unpredictable Mid-Atlantic weather — nor'easters, summer thunderstorms, and ice storms that push roofing systems to their limits. As Frederick County's largest city and one of the fastest-growing markets in Maryland, homeowners here need a roofing contractor who understands both historic preservation and modern construction standards.",
      "Real Elite Contracting serves Frederick homeowners from the historic downtown district along Market Street all the way out to the newer developments in Urbana and Jefferson. Our roofing teams are skilled at replacing and repairing roofs on the 19th and early 20th century homes that line Carroll Creek's revitalized corridor, where preserving architectural character matters as much as performance.",
      "For Frederick's rapidly growing suburban neighborhoods — including Ballenger Creek, New Market, and communities along Buckeystown Pike — we specialize in high-efficiency full replacements using premium architectural shingles. We're familiar with Frederick County permitting and work to keep your project on schedule. Storm damage repairs, emergency tarping, and complete insurance-supported replacements are all within our scope.",
      "Frederick's growth means more competition among contractors, but Real Elite stands out by combining veteran-owned reliability with transparent pricing and workmanship guarantees. Every roof we install is backed by both manufacturer warranties and our own labor guarantee.",
    ],
  },

  'roofing-leesburg-va': {
    paragraphs: [
      "Real Elite Contracting replaces and repairs roofs for Leesburg homeowners. A Leesburg mailing address is not Town limits — Lansdowne and River Creek often sit in unincorporated Loudoun. We check the parcel before we file. We install architectural shingles and standing-seam metal when the job calls for them; we do not advertise a manufacturer Pro, Platinum, or Master Elite badge we do not hold.",
      "Inside Town, exterior work that also needs a Loudoun County building permit starts with Town zoning through eTRAKiT. The county issues the building permit after that. If the parcel is in the H-1 Old and Historic District, a roof replacement or material change needs a Certificate of Appropriateness. Outside Town, county building and zoning run through LandMARC. We put the current Town and county fees in the written estimate instead of guessing them here.",
      "A county permit is not HOA approval. We submit both tracks in parallel when the lot has an association. We do not publish One Loudoun or Lansdowne approved-color lists from contractor blogs — we use the current packet.",
      "What you get is the paperwork product: Town or county path, whether a COA is in play, and an honest read on repair versus replacement from on-roof photos. Manufacturer warranties are registered when the product qualifies. We back labor with a written workmanship warranty.",
    ],
  },

  'roofing-ashburn-va': {
    paragraphs: [
      "Real Elite Contracting replaces and repairs roofs for Ashburn homeowners. Ashburn is unincorporated Loudoun County — building and zoning run through LandMARC, not a town office. We work Brambleton, Broadlands, Ashburn Farm, and One Loudoun when the parcel sits in those associations. We do not advertise a manufacturer Pro, Platinum, or Master Elite badge we do not hold.",
      "A county permit is not HOA approval. In Brambleton, official design review covers essentially all exterior changes, including color and material, and removals. In South Riding, staff can rubber-stamp a short list that includes roof replacement; a county permit still does not substitute for Architectural Standards approval. For One Loudoun and Ashburn Farm we submit the current packet — we do not publish approved-color lists from blogs.",
      "We photograph the roof, tell you whether repair or replacement is the honest call, and put published county fees and the association's current review window in the written estimate. We do not promise a one-day replacement as a rule — weather, material lead time, and HOA approval set the calendar.",
      "Debris comes off the site and we magnet-sweep the yard. Manufacturer warranties are registered when the product qualifies. Labor is backed with a written workmanship warranty.",
    ],
  },

  'roofing-hagerstown-md': {
    paragraphs: [
      "Hagerstown's location at the I-70 / I-81 crossroads in the Cumberland Valley means your roof faces the full Mid-Atlantic weather mix — nor'easters from the east, snow squalls funneling down from the Allegheny ridges, and summer thunderstorms that have travelled across the valley. As Washington County's county seat and largest city, Hagerstown homeowners need a roofing contractor familiar with both the historic brick row homes near Public Square and the newer suburban construction along the Halfway and Robinwood corridors.",
      "Real Elite Contracting provides professional roofing services across Hagerstown and the surrounding Cumberland Valley. Our crews handle architectural shingle replacements on the Federal and Victorian-era homes that line the historic North End and Fountain Head, where rooflines often feature steep pitches, multiple dormers, and intricate valleys that demand precision. For newer subdivisions in the South End and along the I-81 commercial corridor, we offer efficient full replacements with predictable timelines and clean job sites.",
      "Hagerstown's roofs deal with a freeze-thaw cycle that's particularly hard on flashing, valleys, and chimney saddles — the bridge climate where the Eastern Panhandle's milder winters meet Pennsylvania's colder ones. We install only premium architectural shingles from GAF and Owens Corning, backed by manufacturer warranties and our own workmanship guarantee in writing. Ridge venting, proper underlayment, and ice-and-water shield in the right places are standard, not upsells.",
      "Insurance claims after the regular wind events that hit the Cumberland Valley are handled directly with your carrier — we document damage with on-roof photos, provide the detailed scope insurers expect, and coordinate inspections so the claim moves through quickly. For Hagerstown homeowners replacing a roof at the end of its service life rather than after storm damage, our free inspections include an honest read on whether the roof has years left or whether replacement is the right call now.",
    ],
  },

  'roofing-loudoun-county-va': {
    paragraphs: [
      "Real Elite Contracting replaces and repairs roofs across Loudoun County. We work the western corridor first — Purcellville, Round Hill, Lovettsville, western Leesburg, selected Middleburg — then the master-planned communities when the parcel is there. We install architectural shingles and standing-seam metal when the job calls for them; we do not advertise a manufacturer Pro, Platinum, or Master Elite badge we do not hold, and we do not publish invented replacement price bands.",
      "Leesburg, Purcellville, and Middleburg issue town zoning first; the county still issues the building permit. Everywhere else, building and zoning run through LandMARC. Historic-district exteriors in Old Town Leesburg or Middleburg need a Certificate of Appropriateness on top of that.",
      "A county permit is not HOA approval. Brambleton reviews essentially all exterior changes, including color. South Riding can rubber-stamp roof replacement on a short staff list — a new deck is not on that list, and a county permit still is not HOA approval. We do not publish One Loudoun color lists from contractor blogs.",
      "On-roof photos, an honest repair-versus-replace call, the current fee and review window in the written estimate, manufacturer registration when the product qualifies, and a written workmanship warranty on labor.",
    ],
  },

  // ── DECKS ──────────────────────────────────────────────────────────────

  'decks-winchester-va': {
    paragraphs: [
      "Real Elite Contracting builds decks and outdoor living for Winchester homeowners — composite builds, railing and lighting, and the next step when you want a roof or screen. A Winchester mailing address is not automatically City limits: parcels along Route 7, Senseny Road, and the county line often sit in Frederick County, Virginia. We check the parcel before we file. We install Trex, TimberTech, and AZEK when the job calls for them; we do not advertise a manufacturer Pro or Platinum badge we do not hold.",
      "Inside the City, building permits run through City of Winchester Zoning and Inspections on the City permit portal. The 2021 Virginia Uniform Statewide Building Code is what the City reviews against. Outside City limits, Frederick County, Virginia issues the building permit. We do not publish a made-up Winchester deck-permit fee — the City points applicants to the municipal fee schedule, and we put the current amount in the written estimate.",
      "What you file with the application is the paperwork product: a site plan with setbacks, framing and footing details, and ledger, railing, and stair notes. If the parcel is in Old Town, we check whether historic-district design review applies before we lock materials. HOA review, when the lot has one, is a separate track from the City or county building permit.",
      "We install to the approved plans and the Virginia Residential Code, document each inspection, and back the work with a written workmanship warranty. Named project lead from estimate through final walkthrough.",
    ],
  },

  'decks-frederick-md': {
    paragraphs: [
      "Real Elite Contracting builds decks and outdoor living for Frederick County homeowners — composite builds, railing and lighting, and the next step when you want a roof or screen. The City of Frederick and the Town of Mt. Airy issue their own building permits. Everywhere else in the county, building permits and zoning certificates run through Frederick County Permits and Inspections on the County application portal. We check the parcel before we file. We install Trex, TimberTech, and AZEK when the job calls for them; we do not advertise a manufacturer Pro or Platinum badge we do not hold.",
      "The County's published deck-and-porch process treats three designs as different jobs: an open deck has no covering; a covered porch adds a roof; a screened porch adds a roof and screened walls. A site plan or plot plan with setbacks is required on every application. A permit is required when a deck or porch is replaced, even in the same location, and when railings or structural members are replaced. After staff marks the application complete, review agencies have a published one-week due date from assignment.",
      "We put the current County fee-schedule line items in the written estimate instead of guessing them here — the County publishes separate building, zoning-review, filing, and automation fees, and incorporated towns drop the zoning-review fee. Historic-district or municipal design review, when it applies, is a separate track from the building permit.",
      "What you get is the paperwork product: we tell you whether you are in the City, Mt. Airy, or the County, which path the design is on (open deck vs covered vs screened), and we file the portal set. We install to the approved plans, document each inspection, and back the work with a written workmanship warranty.",
    ],
  },

  'decks-leesburg-va': {
    paragraphs: [
      "Real Elite Contracting builds decks and outdoor living for Leesburg homeowners — composite builds, railing and lighting, and the next step when you want a roof or screen. We work the Town and western Leesburg first because that is the practical truck path from Martinsburg. A Leesburg mailing address is not the same as Town of Leesburg limits: Lansdowne and River Creek often carry a Leesburg address and sit in unincorporated Loudoun. We check the parcel before we file. We install Trex, TimberTech, and AZEK when the job calls for them; we do not advertise a manufacturer Pro or Platinum badge we do not hold.",
      "Inside Town limits the order is fixed. The Town of Leesburg issues the zoning permit first through eTRAKiT — decks, balconies, and exterior stairs need Town zoning (typically without engineering review). Loudoun County issues the building permit after that; the county will not release a building permit until the Town zoning permit is approved. Typical Deck Detail still applies to the county building set when the design qualifies: single-level, attached, residential, joist overhangs of 2 feet or less, and no roof, screen, hot tub, gazebo, or detached structure. Published county fees inside an incorporated town are $100 for Typical under 1,000 sq ft (building permit only) and $230 for full plans under 1,000 sq ft (building plus plan review). Outside Town limits those same county paths are $265 and $395 because they include county zoning. Town zoning has its own fee — we put the current Town amount in the written estimate instead of guessing it here. County inspections still apply: footing before concrete, framing before decking, final. Framing and final may combine when framing is at least 42 inches above grade.",
      "If the parcel is in the H-1 Old and Historic District, every exterior construction project — including a new deck — needs a Certificate of Appropriateness. Some COAs are staff-approved; others go to the Board of Architectural Review. A National Register listing is honorary and is not the same as the Town H-1 overlay. Gateway District rules are lighter on single-family detached houses. Any HOA review is a separate track from Town zoning and the county building permit. We submit what applies in parallel so the layers do not stack.",
      "What you get is the paperwork product: we tell you whether you are in Town or unincorporated county, which county path the design is on (Typical vs full plans), and whether a COA is in play. We prepare the Town eTRAKiT zoning set (plat to engineer's scale, owner consent) and the county LandMARC building set. We install to the Virginia Uniform Statewide Building Code and the approved Typical Detail or stamped plans, document each inspection, and back the work with a written workmanship warranty.",
    ],
  },

  'decks-ashburn-va': {
    paragraphs: [
      "Real Elite Contracting builds decks and outdoor living for Ashburn homeowners — composite builds, railing and lighting, and the next step when you want a roof or screen. Ashburn is unincorporated Loudoun County, not a town: there is no separate municipal zoning office. County building and zoning run through LandMARC. We work Brambleton, Broadlands, Ashburn Farm, and One Loudoun when the parcel sits in those associations. We install Trex, TimberTech, and AZEK when the job calls for them; we do not advertise a manufacturer Pro or Platinum badge we do not hold.",
      "Every Ashburn deck needs a Loudoun County building permit and a county zoning permit. Typical Deck Detail is the fast path: single-level, attached, residential, joist overhangs of 2 feet or less, and no roof, screen, hot tub, gazebo, or detached structure. Published county fee on that path is $265 (building plus zoning) under 1,000 sq ft. A roofed patio, screened porch, or three-season room drops out of Typical and needs full structural plans: $395 under 1,000 sq ft. Those numbers are from Loudoun Building and Development — not a contractor guess. County inspections: footing before concrete, framing before decking, final. Framing and final may combine when framing is at least 42 inches above grade. Published minimum footing depth is 24 inches on solid soil.",
      "A county permit is not HOA approval. The county does not enforce covenants. We submit both tracks in parallel so they do not stack. In Brambleton, official design review covers essentially all exterior changes, permanent or temporary; the Covenants Committee typically meets the second Monday, applications are due 9:00 AM Friday ten days prior (holiday weeks shift — we use the published calendar), and decision letters usually follow 5–7 business days after the meeting. In Broadlands, Declaration 7.5 requires prior written consent for any exterior addition; decks are a listed Modifications Subcommittee project. Applications are due at noon Wednesday, one week before the meeting; March–October the subcommittee meets the first and third Wednesdays at 7:00 PM, November–February the third Wednesday; result letters are normally emailed within a week of the meeting. For One Loudoun and Ashburn Farm we submit the current association packet — we do not publish approved-color lists or worksheet rules from contractor blogs or third-party form sites.",
      "What you get is the paperwork product: we tell you which county path the design is on (Typical vs full plans), which association reviews the lot, and we prepare the LandMARC set plus the ARC packet. We install to the Virginia Uniform Statewide Building Code and the approved Typical Detail or stamped plans, document each inspection, and back the work with a written workmanship warranty.",
    ],
  },

  'decks-hagerstown-md': {
    paragraphs: [
      "Real Elite Contracting builds decks and outdoor living for Hagerstown homeowners — composite builds, railing and lighting, and the next step when you want a roof or screen. A Hagerstown mailing address is not automatically City limits: Halfway, Robinwood, and Fountain Head often sit in Washington County. We check the parcel before we file. We install Trex, TimberTech, and AZEK when the job calls for them; we do not advertise a manufacturer Pro or Platinum badge we do not hold.",
      "Inside the City, a building permit is required for decks. Applications go to the Department of Engineering and Permits at One E. Franklin Street, 3rd floor, or through the City's online building-permit form. The City's published packet asks for a completed application, a scaled plot plan with existing structures and distances to property lines, owner permission if you are not the owner, plan sets (two paper and one digital on the current guidelines), and the contractor's City license number when a contractor is hired. Inspections for building and trade permits are requested through the City inspection-request page. We do not publish a made-up Hagerstown fee or a fake 2–3 week timeline — we put the current City amount and review window in the written estimate.",
      "Historic-district design review and zoning setbacks, when they apply, are a separate track from the building permit. Outside City limits, Washington County issues the building permit. We tell you which office files the job before we lock the schedule.",
      "What you get is the paperwork product: City or county path, plot plan, and inspection sequence (footing before concrete; framing before decking). We install to the approved plans, document each inspection, and back the work with a written workmanship warranty.",
    ],
  },

  'decks-loudoun-county-va': {
    paragraphs: [
      "Real Elite Contracting builds decks and outdoor living for Loudoun County homeowners — composite builds, railing and lighting, and the next step up when you want a roof or screen. We work the western corridor first (Purcellville, Round Hill, Lovettsville, western Leesburg, selected Middleburg) because that is the practical truck path from Martinsburg. We install Trex, TimberTech, and AZEK when the job calls for them; we do not advertise a manufacturer Pro or Platinum badge we do not hold.",
      "Every Loudoun County deck needs a building permit and a zoning permit. The county's Typical Deck Detail is the fast path: it applies only to a single-level, residential, attached deck with no roof, no screen, no hot tub, no gazebo, and no detached structure. On that path the published county fee is $265, building review is 2 days, and zoning review is 2 days (intake completeness is 2–5 business days). A roofed patio, screened porch, or three-season room drops out of Typical and needs full structural plans: $395, 15-day building review, and 10-day zoning review. Those numbers are from Loudoun Building and Development — not a contractor guess. Leesburg, Purcellville, and Middleburg permit separately from the county. Published minimum footing depth is 24 inches on solid soil.",
      "A county permit is not HOA approval. The county does not enforce covenants. We submit both tracks in parallel so they do not stack. For Brambleton, official design review covers essentially all exterior changes; the Covenants Committee typically meets the second Monday of the month, with applications due 9:00 AM Friday ten days prior. For South Riding, written Architectural Standards approval is required before exterior work; a county permit does not substitute, and staff can rubber-stamp only a short list (roof and window replacement are on that list — a new deck is not). We do not publish One Loudoun approved colors or material lists until we have that association's current packet in hand.",
      "What you get from us is the paperwork product, not a slogan: we tell you which path your design is on (Typical vs full plans), prepare the county set and the ARC packet, and put the real review days into the written estimate. Pier inspections happen before concrete; framing inspections happen before decking. We install to the Virginia Uniform Statewide Building Code and Loudoun's published footing rules, document each inspection, and back the work with a written workmanship warranty.",
    ],
  },

  'decks-middleburg-va': {
    paragraphs: [
      "Real Elite Contracting builds decks and outdoor living for selected Middleburg homeowners — composite builds, railing and lighting, and the next step when you want a roof or screen. A Middleburg mailing address is not automatically Town limits: parcels along Atoka, Foxcroft, and Goose Creek are often unincorporated Loudoun. We check the parcel before we file. We install Trex, TimberTech, and AZEK when the job calls for them; we do not advertise a manufacturer Pro or Platinum badge we do not hold.",
      "Inside Town limits the order is fixed. The Town of Middleburg issues a Zoning Location Permit first — required for a deck, shed, fence, detached garage, or any work that also needs a Loudoun County building permit. The county issues the building permit after that. Typical Deck Detail still applies to the county building set when the design qualifies; published county fees inside an incorporated town are $100 for Typical under 1,000 sq ft (building permit only) and $230 for full plans under 1,000 sq ft. Outside Town those same county paths are $265 and $395 because they include county zoning. Town zoning has its own fee — we put the current Town amount in the written estimate.",
      "If the parcel is in the Middleburg Historic District, exterior work — including a new deck — needs a Certificate of Appropriateness from the Historic District Review Committee. Complete applications are due 14 days before the meeting. A county permit is not a COA, and a COA is not a building permit. We submit what applies in parallel so the layers do not stack.",
      "What you get is the paperwork product: Town or unincorporated county, Typical vs full plans, and whether HDRC review is in play. We prepare the Town zoning set and the county LandMARC building set. We install to the Virginia Uniform Statewide Building Code and the approved Typical Detail or stamped plans, document each inspection, and back the work with a written workmanship warranty.",
    ],
  },

  // ── REMODELING ────────────────────────────────────────────────────────────

  'remodeling-winchester-va': {
    paragraphs: [
      "Winchester, Virginia's real estate market has been growing steadily, driven by its historic charm, Shenandoah Valley setting, and proximity to Northern Virginia. Whether you own a 19th-century Victorian in Old Town or a 1980s colonial on the outskirts, home remodeling is one of the smartest investments you can make. Real Elite Contracting delivers full-service interior and exterior remodeling across Winchester and Frederick County.",
      "From kitchen and bathroom renovations to full home makeovers, Real Elite handles every phase of your Winchester remodeling project with care and expertise. Our crews are experienced with the unique construction methods found in older Winchester homes — plaster walls, older electrical systems, and load-bearing configurations that require careful planning. We update homes to modern standards while preserving the historic character that makes Winchester properties so desirable.",
      "Winchester's growing real estate market means thoughtful remodeling pays dividends. Kitchen remodels, primary bathroom upgrades, and main floor conversions are consistently among the highest-ROI projects in the Winchester metro area. Real Elite helps homeowners prioritize updates that improve daily living and maximize resale value — with design guidance, material selection help, and transparent pricing from the first conversation.",
      "We serve all of Winchester's neighborhoods — from the historic Shawnee District and Old Town to the growing communities along Route 7 and Senseny Road. Whether you're preparing your home for sale, updating after a purchase, or simply improving your quality of life, Real Elite is Winchester's trusted remodeling contractor.",
    ],
  },

  'remodeling-frederick-md': {
    paragraphs: [
      "Frederick, Maryland's blend of historic character and rapid suburban growth makes it one of the most exciting remodeling markets in the Mid-Atlantic. Downtown Frederick's revitalization along Market Street and Carroll Creek has inspired homeowners throughout the county to invest in their properties — from gut-renovating century-old rowhouses near the historic district to modernizing 1990s colonials in Ballenger Creek and Urbana.",
      "Real Elite Contracting brings full-service remodeling to Frederick homeowners, handling everything from kitchen and bathroom renovations to basement finishing, main-floor open concepts, and exterior facelifts. Our team is experienced with the construction challenges unique to Frederick County — older home foundations, plaster walls, and older plumbing systems — and we have the expertise to modernize your home while respecting its structure.",
      "Frederick's growing community of young professionals and families has driven demand for modern open-concept layouts, chef's kitchens, and spa-style bathrooms. Real Elite designs and builds spaces that match today's lifestyle expectations while staying within realistic budgets. We offer transparent pricing with detailed scopes of work so you always know exactly what you're getting.",
      "From the historic district out to the newest subdivisions along I-70, Real Elite serves Frederick County homeowners with the same commitment to quality and communication. We handle all Frederick County permits and inspections, keep your project on schedule, and leave your home cleaner than we found it.",
    ],
  },

  'remodeling-leesburg-va': {
    paragraphs: [
      "Real Elite Contracting remodels Leesburg homes — kitchens, baths, additions, and whole-home work under one named project lead. A Leesburg mailing address is not Town limits. We check the parcel before we file.",
      "Pure interior cosmetic work (paint, cabinet fronts in place, tile-on-tile in an unchanged footprint) usually skips both Town zoning and HOA review. Anything that relocates plumbing or electrical, opens a wall, or changes the exterior needs Loudoun County permits. Inside Town, that county building permit waits on Town zoning. H-1 Old and Historic District exteriors also need a Certificate of Appropriateness.",
      "A county permit is not HOA approval. We submit what applies in parallel so the layers do not stack. We do not publish invented kitchen or bath price bands, and we do not claim completed Loudoun project counts we cannot show.",
      "Written scope, line-item estimate, daily updates, clean job site, inspections documented, written workmanship warranty.",
    ],
  },

  'remodeling-ashburn-va': {
    paragraphs: [
      "Real Elite Contracting remodels Ashburn homes — kitchens, baths, finished lower levels, and whole-home work under one named project lead. Ashburn is unincorporated Loudoun County. Building and zoning run through LandMARC.",
      "Interior work that relocates plumbing or electrical, or that opens a load-bearing wall, needs county permits and, when the wall is structural, stamped drawings. Purely cosmetic interior work usually skips HOA review. Exterior changes (windows, siding, additions, decks) need the association packet in parallel with the county set. Brambleton reviews essentially all exterior changes. We do not publish One Loudoun color lists from blogs.",
      "We do not claim a pipeline of completed Ashburn projects we cannot show, and we do not publish invented remodel price bands. The written estimate is the number.",
      "Named project lead, daily updates, clean job site, inspections documented, written workmanship warranty.",
    ],
  },

  'remodeling-hagerstown-md': {
    paragraphs: [
      "Hagerstown's housing stock is one of its strongest assets — solid brick row homes in the historic district, mid-century single-family homes along the established corridors, and newer construction in the rapidly growing Halfway, Robinwood, and Fountain Head neighborhoods. Each comes with its own remodeling considerations, and Real Elite Contracting brings the right approach to whatever the project is.",
      "For Washington County homeowners updating older properties — bathroom remodels in 1950s-era brick homes, kitchen remodels in mid-century ranches, basement finishing in established neighborhoods — the work always starts with understanding what's behind the walls. Older Hagerstown homes often have plumbing and electrical that needs attention before any cosmetic update is worth doing, and we'll tell you upfront if those underlying systems need investment first. The cost is real but ignoring it always costs more.",
      "For newer suburban remodels — open-concept kitchen updates, primary suite bathroom upgrades, mudroom and laundry buildouts — we deliver premium finishes with the same project management discipline. Named project lead, daily updates, clean job site every day, and a written workmanship warranty when the work is done.",
      "Typical timelines: bathroom remodels run 3–5 weeks of active work in the Hagerstown market, kitchens 6–10 weeks, basements 6–12 weeks. We give you a written timeline before we break ground and update you daily if anything shifts. Permitting through Washington County and the City of Hagerstown is included as part of every project.",
    ],
  },

  'remodeling-loudoun-county-va': {
    paragraphs: [
      "Real Elite Contracting remodels Loudoun County homes — kitchens, baths, additions, and whole-home work — and we lead the western corridor first. Leesburg, Purcellville, and Middleburg issue town zoning before the county building permit. Everywhere else, LandMARC handles building and zoning.",
      "A county permit is not HOA approval. Exterior scopes run both tracks in parallel. Historic-district exteriors in Old Town Leesburg or Middleburg add a Certificate of Appropriateness. Load-bearing changes need stamped structural drawings before the county will issue.",
      "We do not publish invented $40,000–$200,000 kitchen and bath bands, named fixture packages as if they were standard, or completed-project counts we cannot show. Line items go in the written estimate.",
      "One named lead, daily updates, inspections in order, written workmanship warranty.",
    ],
  },

  // ── SIDING ────────────────────────────────────────────────────────────────

  'siding-winchester-va': {
    paragraphs: [
      "Winchester, Virginia's homes face a demanding exterior environment — hot, humid summers, winter ice storms, and the occasional Shenandoah Valley windstorm that tests every material on your home's exterior. Quality siding isn't just cosmetic; it's the primary moisture and weather barrier protecting your home's structure. Real Elite Contracting provides expert siding installation and replacement for Winchester homeowners who want protection and curb appeal that lasts.",
      "We install vinyl siding, fiber cement siding (James Hardie), and engineered wood products across Winchester and Frederick County. Vinyl siding is the most popular choice for Winchester's suburban and rural homes — it's low-maintenance, highly durable, and available in dozens of profiles and colors. Fiber cement is the premium option for homes near historic districts and upscale neighborhoods, offering the authentic texture of wood without the rot and maintenance headaches.",
      "Old Town Winchester's older homes often feature wood lap siding, cedar shingles, or stucco that has reached the end of its service life. We help homeowners in the Shawnee District, the historic corridor along Amherst and Cork Streets, and the Route 7 growth areas transition to modern siding systems that dramatically improve energy efficiency, moisture protection, and curb appeal.",
      "Beyond aesthetics, new siding significantly improves your home's insulation performance. We install foam-backed siding and house wrap systems that reduce heating and cooling costs — a meaningful benefit given the Shenandoah Valley's temperature extremes. New siding transforms your home's look and performance in a single project.",
    ],
  },

  'siding-frederick-md': {
    paragraphs: [
      "Frederick, Maryland's blend of historic rowhouses, established suburban neighborhoods, and new construction creates a wide range of siding needs across the county. From fiber cement replacements on 100-year-old downtown homes to vinyl upgrades on 1990s colonials in Ballenger Creek, Real Elite Contracting serves the full spectrum of Frederick's siding market with professional installation and honest assessments.",
      "Maryland's humid continental climate — with wet springs, hot summers, and cold winters — puts serious demands on your home's exterior siding. Moisture infiltration behind failing siding is one of the leading causes of structural damage in older Frederick homes. Real Elite performs thorough moisture assessments before installation, replacing any damaged sheathing and installing proper house wrap to ensure your new siding performs as intended.",
      "For Frederick's historic district homes near Carroll Creek and Market Street, we offer James Hardie fiber cement siding in profiles that honor the architectural history of the neighborhood while providing modern performance and longevity. For the newer suburban developments along I-70 in Jefferson, Urbana, and New Market, we offer a full range of vinyl siding systems with insulation backing that improve your home's comfort and energy efficiency.",
      "Real Elite handles all Frederick County permits, and our installation crews are experienced working in occupied homes with minimal disruption to your daily routine. We offer multi-day scheduling for larger jobs and keep the work area clean throughout the project.",
    ],
  },

  'siding-leesburg-va': {
    paragraphs: [
      "Real Elite Contracting installs and replaces siding for Leesburg homeowners — vinyl, fiber cement, and engineered wood when the job calls for them. A Leesburg mailing address is not Town limits. We check the parcel before we file. We do not advertise a James Hardie or manufacturer Pro badge we do not hold.",
      "Siding is exterior work. Inside Town, Town zoning comes first and the county building permit follows. H-1 Old and Historic District parcels need a Certificate of Appropriateness before material or color changes. Outside Town, LandMARC handles building and zoning. HOA review is a separate track.",
      "We do not publish HOA color lists from blogs, and we do not invent ROI rankings or $40,000+ siding bands. House wrap, window and door flashing, and a moisture check of the sheathing are part of the scope we write down.",
      "Current Town and county fees go in the written estimate. Manufacturer warranties are registered when the product qualifies. Labor is backed with a written workmanship warranty.",
    ],
  },

  'siding-ashburn-va': {
    paragraphs: [
      "Real Elite Contracting installs and replaces siding for Ashburn homeowners. Ashburn is unincorporated Loudoun County. Building and zoning run through LandMARC. We do not advertise a James Hardie or manufacturer Pro badge we do not hold.",
      "Siding is an exterior change. A county permit is not HOA approval. Brambleton reviews essentially all exterior changes, including color and material. Broadlands requires Modifications Subcommittee written consent before visible exterior work. For One Loudoun and Ashburn Farm we use the current packet — no blog color lists.",
      "We inspect sheathing before we cover it, install house wrap and flashing, and put published county fees plus the association's current review window in the written estimate.",
      "Manufacturer warranties are registered when the product qualifies. Labor is backed with a written workmanship warranty.",
    ],
  },

  'siding-hagerstown-md': {
    paragraphs: [
      "Hagerstown's varied housing stock — historic brick, mid-century clapboard, modern fiber cement, newer vinyl construction — means siding work in this market requires real range. Real Elite Contracting handles vinyl replacement, fiber cement (James Hardie and comparable) installation, and stone veneer accent work across Washington County, from the historic Public Square area through the growing Halfway and Robinwood corridors.",
      "For homeowners in newer Hagerstown developments — the rapidly growing South End, communities along the I-81 corridor, and newer subdivisions in the surrounding county — fiber cement siding is increasingly the standard. James Hardie holds up to the Cumberland Valley climate beautifully, requires minimal maintenance, and dramatically improves resale value. We're certified on the install process and can show you completed projects in the area.",
      "For older Hagerstown properties — the brick row homes near downtown, mid-century clapboard houses in the established neighborhoods — siding work often involves restoration alongside replacement. We can match historic profiles, repair sound original siding rather than ripping it all out, and integrate new materials with existing in ways that respect the property's character. For homeowners in historic preservation districts, we coordinate with the Hagerstown HARB (Historic District Commission) on any required reviews.",
      "Hagerstown's weather — humid summers, snowy winters, the freeze-thaw cycle, occasional wind events — is what siding has to survive. Cheap vinyl over poor underlayment fails inside a decade; properly installed fiber cement or premium vinyl with house wrap, flashing, and proper trim details lasts 30+ years. We install for the long term, not the lowest bid.",
    ],
  },

  'siding-loudoun-county-va': {
    paragraphs: [
      "Real Elite Contracting installs and replaces siding across Loudoun County — vinyl, fiber cement, and stone veneer when the job calls for them. We work the western corridor first. We do not advertise a James Hardie certification or manufacturer Pro badge we do not hold, and we do not publish invented $40,000+ siding bands.",
      "Leesburg, Purcellville, and Middleburg issue town zoning first. Historic-district exteriors need a Certificate of Appropriateness. Unincorporated parcels use LandMARC for building and zoning. A county permit is not HOA approval. Brambleton reviews essentially all exterior changes. South Riding requires written Architectural Standards approval before exterior work.",
      "Substrate, weather barrier, weep screed, and flashing are in the written scope when the wall needs them. Color and profile come from the current association packet, not a blog list.",
      "Fees and review days go in the estimate. Manufacturer warranties are registered when the product qualifies. Written workmanship warranty on labor.",
    ],
  },

  // ── BATHROOMS ────────────────────────────────────────────────────────────

  'bathrooms-frederick-md': {
    paragraphs: [
      "Frederick, Maryland is the strongest bathroom-remodel market in our service area. The mix of historic downtown homes near Market Street and Carroll Creek, established mid-century neighborhoods, and the explosive growth in Ballenger Creek, Urbana, Jefferson, and New Market means we see the full spectrum of bathroom work — from gut renovations of original 1920s tile bathrooms to primary-suite upgrades in 1990s colonials hitting the 25-year mark.",
      "Real Elite Contracting builds Frederick bathrooms with Schluter-Kerdi waterproofing systems behind every shower, real tile setting (no shortcuts on substrate or backer board), and curbless walk-in shower designs that are increasingly the standard request. We handle plumbing relocation, electrical and lighting upgrades to current Maryland code, custom vanity builds, and the dozens of finish decisions that separate a remodel that looks great in year five from one that doesn't.",
      "Typical Frederick bathroom investment in 2026 lands in the $20,000–$45,000 range for a full primary suite — depending on tile selection, fixture tier (Moen / Delta vs. Brizo / Hansgrohe / Kohler Artifacts), shower complexity, and whether the layout changes. Powder rooms run $8,000–$15,000. Guest baths fall in between. We bring a detailed line-item estimate to your free walkthrough so you can see exactly where the budget is going before signing anything.",
      "Frederick County permits are required for any work involving plumbing, electrical, or structural changes, and the county is fairly strict about inspections. We handle the entire permitting and inspection process — rough-in, electrical, final — so you're not chasing paperwork on your own remodel. Most full Frederick bathroom projects run 3–5 weeks from demo to final walkthrough, with daily updates from your project lead.",
    ],
  },

  'bathrooms-leesburg-va': {
    paragraphs: [
      "Real Elite Contracting remodels Leesburg bathrooms — showers, tile, vanities, and full primary-suite rebuilds. A Leesburg mailing address is not Town limits. We check the parcel before we file.",
      "Plumbing or electrical relocation needs a Loudoun County building permit (and the matching trade permits). Inside Town, that county permit waits on Town zoning. A purely interior bath with no window or exterior change usually skips HOA review; a new window, skylight, or exterior wall opening does not. H-1 exteriors need a Certificate of Appropriateness.",
      "We do not publish invented $40,000–$100,000 bands or named fixture packages as if they were standard. Waterproofing, slope-to-drain, and the inspection sequence (rough plumbing, rough electrical, final) are in the written scope. Line items go in the estimate.",
      "Named project lead, daily updates, clean job site, written workmanship warranty.",
    ],
  },

  'bathrooms-ashburn-va': {
    paragraphs: [
      "Real Elite Contracting remodels Ashburn bathrooms — showers, tile, vanities, and full primary-suite rebuilds. Ashburn is unincorporated Loudoun County. Building and zoning run through LandMARC.",
      "Plumbing or electrical relocation needs county permits and inspections (rough-in, then final). HOA review usually applies only if the bath changes a window, skylight, or other exterior element. A county permit is not HOA approval when both apply — we file them in parallel.",
      "We do not claim we remodel Ashburn primary suites every week, and we do not publish invented $30,000–$60,000 bands. Waterproofing and slope-to-drain are in the written scope. The estimate is line-itemed.",
      "Named project lead, daily updates, clean job site, written workmanship warranty.",
    ],
  },

  'bathrooms-loudoun-county-va': {
    paragraphs: [
      "Real Elite Contracting remodels Loudoun County bathrooms and we lead the western corridor first. Leesburg, Purcellville, and Middleburg issue town zoning before the county building permit when the work needs one. Unincorporated parcels use LandMARC.",
      "Plumbing or electrical relocation needs county trade permits and inspections. Exterior openings need the association packet in parallel. Historic-district exteriors need a Certificate of Appropriateness. Load-bearing changes need stamped drawings.",
      "We do not publish invented $50,000–$120,000 bands or named fixture catalogs as if they were the standard package. Waterproofing, slope-to-drain, and the inspection order are in the written scope.",
      "Named project lead, daily updates, written workmanship warranty.",
    ],
  },

  'bathrooms-hagerstown-md': {
    paragraphs: [
      "Hagerstown bathroom remodels span the full range. Historic brick row homes in the North End and around Public Square have original 1920s and 1930s bathrooms — small, dated, often with structural surprises behind the plaster. Mid-century ranches along the established corridors typically have one full bath plus a half bath, both badly in need of refresh. Newer construction in Halfway, Robinwood, and the South End mostly needs primary-suite upgrades or basement-bath buildouts.",
      "Real Elite Contracting handles Washington County bathroom projects across that whole range. For older homes, we always start by checking what's behind the walls — galvanized supply lines, cast iron drain stacks, and old electrical that needs attention before any cosmetic finish work is worth doing. We tell you upfront if the underlying systems need investment first. The cost is real but ignoring it always costs more.",
      "For newer Hagerstown homes — primary baths in 1990s and 2000s construction — the typical project is a curbless walk-in shower conversion replacing the original cultured marble surround, double-vanity rebuild, new tile floor, frameless glass, and modernized lighting. Schluter-Kerdi waterproofing is standard on every shower we build, not an upsell. Typical investment runs $20,000–$40,000 for a full primary bath in this market.",
      "Permits and inspections through Washington County and the City of Hagerstown are part of every project that involves plumbing or electrical changes. We pull the permits, coordinate the inspections (rough-in and final), and document everything on your behalf. Most full bathroom remodels in Hagerstown run 3–5 weeks of active work; powder rooms and partial refreshes run 1–2 weeks.",
    ],
  },

  'bathrooms-winchester-va': {
    paragraphs: [
      "Winchester, Virginia bathroom remodels are a strong segment of the local home-improvement market. The mix of historic Old Town homes near Loudoun Street, the Shawnee District, and the rapidly growing Senseny Road / Route 7 corridor means we see everything from gut renovations of century-old bathrooms to primary-suite refreshes in 2000s subdivisions. Real Elite Contracting brings the same quality standard to both.",
      "Most Winchester bathroom projects we build feature walk-in shower conversions (curbless options where the substrate allows), real tile work — floor, walls, and niches — vanity and fixture replacement, plumbing relocation as needed, and the lighting and ventilation upgrades that turn a bathroom from functional into actually enjoyable. Schluter-Kerdi waterproofing systems are standard on every shower, not an upsell — that detail is what separates a 25-year bathroom from one that has moisture problems by year 8.",
      "Typical Winchester primary bathroom investment in 2026 runs $18,000–$40,000 depending on layout, tile selection, and fixture tier. Hall baths and guest baths fall in the $12,000–$25,000 range. Powder rooms run $6,000–$13,000. We bring detailed line-item estimates so there's no ambiguity about what's included — and no surprise change orders after the demo crew arrives.",
      "Frederick County permits cover most Winchester bathroom work involving plumbing or electrical changes. For homes in the historic district along Loudoun Street and around the Old Town Walking Mall, additional historic-district review may apply — we coordinate that submission as part of the workflow. Most full bathroom remodels in Winchester run 3–5 weeks of active work with daily updates from your project lead.",
    ],
  },

  // ── KITCHENS ─────────────────────────────────────────────────────────────

  'kitchens-frederick-md': {
    paragraphs: [
      "Frederick, Maryland kitchen remodels are one of the most-requested project types in our pipeline. Frederick's mix of historic downtown homes, established mid-century neighborhoods, and rapidly growing Ballenger Creek / Urbana / Jefferson construction creates demand across the full price range — gut renovations of 1920s rowhouse kitchens near Market Street, open-concept conversions in 1990s colonials, and primary-kitchen builds in newer suburban construction.",
      "Real Elite Contracting builds Frederick kitchens in the $40,000–$120,000 range, with most landing between $55,000 and $85,000. That includes custom or semi-custom cabinetry, quartz or natural stone counters, layout changes where needed, full appliance replacement, lighting design that actually works, real tile or wood floor refinishing, and the trim and finish work that separates a kitchen that looks great in year five from one that doesn't.",
      "Layout changes — opening kitchens to dining rooms, relocating islands, removing load-bearing walls — are a recurring request in Frederick's older homes. We engage a structural engineer when load-bearing walls are involved, pull the necessary Frederick County permits, and coordinate the inspections. We tell you upfront which walls can come down and which can't, and what each option actually costs.",
      "Kitchen remodels are long projects in any market and Frederick is no exception. Plan on 6–10 weeks of active work for a full kitchen build, longer for layout changes that involve structural work or extended cabinet lead times. We give you a written timeline before demo, a named project lead, and daily updates throughout. Most Frederick kitchen projects also involve some flooring extension into adjacent rooms — we coordinate that scope as part of the project.",
    ],
  },

  'kitchens-leesburg-va': {
    paragraphs: [
      "Real Elite Contracting remodels Leesburg kitchens — layout, cabinetry, counters, and the trades behind the walls. A Leesburg mailing address is not Town limits.",
      "Opening a load-bearing wall needs stamped structural drawings and a Loudoun County building permit. Plumbing or electrical relocation needs the matching trade permits. Inside Town, the county building permit waits on Town zoning. HOA review usually applies only if the kitchen changes windows or another exterior element. H-1 exteriors need a Certificate of Appropriateness.",
      "We do not publish invented $80,000–$200,000 bands or named appliance packages as if they were standard. Cabinet lead time is what it is — we put the real weeks in the written timeline before demo.",
      "Named project lead, daily updates, inspections in order, written workmanship warranty.",
    ],
  },

  'kitchens-ashburn-va': {
    paragraphs: [
      "Real Elite Contracting remodels Ashburn kitchens — layout, cabinetry, counters, and the trades behind the walls. Ashburn is unincorporated Loudoun County. Building and zoning run through LandMARC.",
      "A load-bearing opening needs stamped drawings and a county building permit. Plumbing or electrical relocation needs trade permits. HOA review usually applies only if windows or another exterior element changes. We do not claim these remodels happen every week.",
      "We do not publish invented $50,000–$110,000 bands or brand packages as if they were standard. Cabinets, counters, appliances, electrical, plumbing, and finishes are separate line items on the estimate.",
      "Named project lead, daily updates, written timeline before demo, written workmanship warranty.",
    ],
  },

  'kitchens-loudoun-county-va': {
    paragraphs: [
      "Real Elite Contracting remodels Loudoun County kitchens and we lead the western corridor first. Towns (Leesburg, Purcellville, Middleburg) issue zoning before the county building permit when the work needs one. Unincorporated parcels use LandMARC.",
      "Load-bearing changes need stamped drawings. Plumbing and electrical relocation need trade permits. Exterior openings need the association packet in parallel. Historic-district exteriors need a Certificate of Appropriateness.",
      "We do not publish invented $100,000–$250,000 bands or named appliance catalogs as if they were the standard package. Cabinet and stone lead times go in the written timeline before demo. Adjacent rooms stay on one contract when they are part of the same job.",
      "Named project lead, daily updates, written workmanship warranty.",
    ],
  },

  'basements-leesburg-va': {
    paragraphs: [
      "Real Elite Contracting finishes Leesburg lower levels — family rooms, a bath, or an in-law suite when the floor plan and egress allow it. We work the Town and western Leesburg first. A Leesburg mailing address is not Town of Leesburg limits: Lansdowne and River Creek often carry a Leesburg address and sit in unincorporated Loudoun. We check the parcel before we file.",
      "Inside Town limits the order is fixed. The Town's published home-improvement table treats interior or basement finish-out as Town zoning (typically without engineering review) plus a Loudoun County building permit. The county will not release the building permit until Town zoning is approved. County work has two paths: Typical Finished Basement Details in lieu of custom drawings, or a complete plan set. Typical cannot be used if the job alters a load-bearing wall, an exterior wall, a beam, or a column. A bedroom needs an emergency egress window — sill height, opening size, and window-well dimensions go on the plans — and that opening is exterior work. In the H-1 Old and Historic District it also needs a Certificate of Appropriateness.",
      "Outside Town limits, county building and zoning run through LandMARC. HOA review usually applies only if we cut a new window or door. Published Typical fees are 1% of construction cost excluding electrical, mechanical, plumbing, and gas, with a $65 minimum; full plans add a published $130 plan review fee. A kitchen in the basement adds a published $165 county zoning fee. Trade permits are separate. Moisture comes first: perimeter check, sump if one exists, vapor control under the finish floor. We do not publish invented basement price bands.",
      "What you get is the paperwork product: Town or unincorporated county, Typical vs full plans, and whether a COA is in play. We prepare the Town eTRAKiT zoning set and the county LandMARC building set. County inspections run in published order — trade rough-ins before building framing, insulation before cover, then finals. We install to the Virginia Uniform Statewide Building Code and the approved Typical Detail or stamped plans, document each inspection, and back the work with a written workmanship warranty.",
    ],
  },

  'basements-ashburn-va': {
    paragraphs: [
      "Real Elite Contracting finishes Ashburn lower levels — family rooms, a bath, or an in-law suite when the floor plan and egress allow it. Ashburn is unincorporated Loudoun County, not a town. Building and zoning run through LandMARC. We work Brambleton, Broadlands, Ashburn Farm, and One Loudoun when the parcel sits in those associations.",
      "Every finished basement needs a Loudoun County building and zoning application, plus trade permits for electrical, plumbing, mechanical, and gas when those systems are in the job. Typical Finished Basement Details can stand in for custom drawings unless the job alters a load-bearing wall, an exterior wall, a beam, or a column. Published Typical fees are 1% of construction cost excluding those trades, with a $65 minimum. Full plans add a published $130 plan review fee. A kitchen in the basement adds a published $165 zoning fee. A bedroom needs an emergency egress window; that opening is exterior work.",
      "A county permit is not HOA approval. We file the association packet in parallel when we cut a new window or door. Brambleton reviews essentially all exterior changes; the Covenants Committee typically meets the second Monday, applications due 9:00 AM Friday ten days prior, decision letters usually 5–7 business days after. Broadlands needs Modifications Subcommittee written consent before visible exterior work; applications due noon Wednesday one week prior. For One Loudoun and Ashburn Farm we use the current packet — we do not invent approved-color lists. Moisture comes first. We do not publish invented basement price bands or claim a pipeline of finished Ashburn lower levels we cannot show.",
      "What you get is the paperwork product: Typical vs full plans, which association reviews the lot, and the LandMARC set plus the ARC packet when egress is in play. County inspections: trade rough-ins before building framing, insulation before cover, then finals. We install to the Virginia Uniform Statewide Building Code and the approved Typical Detail or stamped plans, document each inspection, and back the work with a written workmanship warranty.",
    ],
  },

  'basements-loudoun-county-va': {
    paragraphs: [
      "Real Elite Contracting finishes Loudoun County lower levels — family rooms, a bath, or an in-law suite when the floor plan and egress allow it. We work the western corridor first (Purcellville, Round Hill, Lovettsville, western Leesburg, selected Middleburg) because that is the practical truck path from Martinsburg.",
      "Every finished basement needs a Loudoun County building and zoning application, plus trade permits when electrical, plumbing, mechanical, or gas is in the job. Typical Finished Basement Details can stand in for custom drawings unless the job alters a load-bearing wall, an exterior wall, a beam, or a column. Published Typical fees are 1% of construction cost excluding those trades, with a $65 minimum. Full plans add a published $130 plan review fee. A kitchen in the basement adds a published $165 zoning fee. Leesburg, Purcellville, and Middleburg issue town zoning first — the county will not release the building permit without it. A bedroom needs an emergency egress window.",
      "A county permit is not HOA approval. An egress cut is exterior work: HOA review in master-planned communities, and a Certificate of Appropriateness in Old Town Leesburg or the Middleburg Historic District. Moisture comes first. We do not publish invented basement price bands or treat wine cellars and media rooms as the typical Loudoun brief.",
      "What you get is the paperwork product: Typical vs full plans, town vs unincorporated county, and whether HOA or COA review is in play. County inspections: trade rough-ins before building framing, insulation before cover, then finals. We install to the Virginia Uniform Statewide Building Code and the approved Typical Detail or stamped plans, document each inspection, and back the work with a written workmanship warranty.",
    ],
  },

  // ── BASEMENTS ────────────────────────────────────────────────────────────

  'basements-frederick-md': {
    paragraphs: [
      "Frederick, Maryland is the strongest basement-finishing market in our service area. The combination of Frederick County's housing stock — most newer homes in Ballenger Creek, Urbana, Jefferson, and New Market have full unfinished basements as standard construction — and the local demand for additional living space at a fraction of an addition's cost makes basement finishing one of the highest-ROI projects a Frederick homeowner can build.",
      "Real Elite Contracting builds Frederick basements that pass inspection on the first walkthrough, every time. Moisture control comes first — sump pump verification, perimeter waterproofing assessment, vapor barrier installation under any framing — because the cheap shortcut on moisture is what creates mold problems in year three. Then code-compliant framing with proper egress windows where required, full electrical and plumbing rough-in to Frederick County code, HVAC extension or dedicated mini-split installation, and the insulation and drywall that turn raw space into living space.",
      "Typical Frederick basement-finishing scope in 2026 runs $35,000–$85,000 depending on square footage and feature mix. Standard finished family room with full bath, wet bar, and laundry rough-in lands around $55,000–$70,000. In-law suites with full kitchens, bedrooms, and accessible bathrooms run higher. We provide detailed line-item estimates with everything broken out — framing, electrical, plumbing, HVAC, insulation, drywall, flooring, finishes — so you see exactly where the budget goes.",
      "Frederick County permits and inspections are required for any basement finishing work — framing, electrical, plumbing, mechanical, final. The inspector sequence matters; we coordinate it so trades don't lose days waiting on each other. Most full Frederick basement projects run 6–12 weeks of active work depending on scope, with a named project lead, daily updates, and a clean job site every day. Egress windows, fire-blocking, and the other code requirements that separate properly finished basements from problem basements are non-negotiable in our work.",
    ],
  },

  // ── BATHROOMS · MCLEAN, VA ───────────────────────────────────────────────
  'bathrooms-mclean-va': {
    paragraphs: [
      "McLean, Virginia is one of the most discerning bathroom-renovation markets in the country. Buyers in Langley Forest, Salona Village, Chesterbrook, and Franklin Park expect primary baths that read as private spas — large-format porcelain, curbless walk-in showers with linear drains, freestanding soaking tubs, double-vanity layouts with stone tops, heated floors, towel warmers, and lighting designed scene by scene. The Northern Virginia market also has a deep bench of architects and designers, and many McLean projects come to us with a designer already engaged. We execute to that design with the precision the relationship requires.",
      "Real Elite Contracting renovates primary baths and powder rooms across McLean with the level of craft this address expects. Typical McLean primary-bath scope in 2026 runs $60,000–$130,000+ depending on size, layout changes, and material grade. Featured projects often include curbless showers with body sprays and rain heads, custom inset cabinetry, slab quartzite or marble counters, premium fixture lines (Brizo, Hansgrohe, Kohler Artifacts), and floors heated underfoot. Powder rooms in McLean homes routinely land in the $15,000–$30,000 range when finishes match the rest of the house.",
      "We respect the architecture of the home. Many McLean primaries sit in the original footprint of a larger home where layout changes — opening to the adjoining closet for a true primary suite, repositioning plumbing for a cleaner shower geometry — make a meaningful difference. We model the changes, value-engineer the parts of the budget that don't change the visible result, and protect the spend for the surfaces and fixtures the eye actually lands on.",
      "Project management is a named project lead from estimate through final walkthrough — no handoffs, no chasing site supervisors. Daily progress photos, a clean site every evening, a same-day response standard, and a written workmanship warranty on the finished work. Fairfax County permits and inspections are handled by us; communication with the homeowner, the designer, and any HOA architectural review is consolidated through one point of contact.",
    ],
  },

  // ── BATHROOMS · ALEXANDRIA, VA ───────────────────────────────────────────
  'bathrooms-alexandria-va': {
    paragraphs: [
      "Alexandria bathroom renovations require a contractor who can work as comfortably inside a 1790s Old Town townhouse as inside a 1950s Belle Haven center-hall colonial. The city's historic architecture, restrictive layouts, and Old Town Historic District standards make Alexandria primary baths some of the most technically demanding renovations we take on — and some of the most beautiful when they are done with respect for the envelope they live inside.",
      "Real Elite Contracting renovates primary baths and powder rooms across Old Town, Belle Haven, Rosemont, North Ridge, and Beverley Hills with attention to period accuracy where it matters and contemporary spa specification where the design calls for it. Typical Alexandria primary-bath scope in 2026 runs $50,000–$120,000+ depending on the level of structural and plumbing work the floor plan requires. Old Town townhouses often need creative plumbing routing and floor framing reinforcement to support modern fixtures; we engineer those changes properly and document them for the historic-district record where applicable.",
      "Finish work is where Alexandria bathrooms earn their character. We specify period-respectful tile patterns (hex mosaic, marble basketweave, subway with pencil liners), traditional vanity profiles in inset cabinetry, polished nickel or unlacquered brass fittings where the architecture asks for it, and clawfoot or freestanding tubs that are at home in a historic envelope. For more contemporary Belle Haven and Rosemont homes, we shift to large-format slabs, curbless walk-in showers, and clean-lined contemporary fixture lines without losing the workmanship standard.",
      "Old Town Historic District permitting and the city's Board of Architectural Review add a layer to the front of any project that affects building exteriors; for interior bathroom work, standard City of Alexandria permits and Fairfax County (for unincorporated addresses) handle the trade inspections. We carry the paperwork, coordinate the inspection sequence, and keep your name off the bureaucracy. One named project lead from start to final walkthrough, a clean site every day, and the workmanship warranty in writing.",
    ],
  },

  // ── KITCHENS · MCLEAN, VA ────────────────────────────────────────────────
  'kitchens-mclean-va': {
    paragraphs: [
      "McLean kitchens are some of the most carefully specified residential projects in the country. The combination of the address, the size of the homes, and the architectural and design talent available locally means a McLean primary kitchen is often a $150,000–$400,000+ undertaking — and worth every dollar when the result lands. From estate homes off Old Dominion Drive to refined mid-century properties in Langley Forest and the newer custom builds along Chesterbrook Road, the McLean kitchen brief is consistent: serve the entertaining the family actually does, in a space that reads as bespoke from cabinet to ceiling.",
      "Real Elite Contracting builds McLean kitchens in close collaboration with the designers and architects this market relies on. Typical scope in 2026 includes custom inset cabinetry from a tier-one shop (often paint-grade or rift-cut white oak), full-slab quartzite or natural-stone countertops with mitered apron edges, integrated panel-front appliance suites (Sub-Zero, Wolf, Miele, La Cornue), professional ventilation that disappears into millwork, scullery or butler's pantry build-outs, and lighting designed as a layered system rather than a single ceiling fixture.",
      "Where there's room to reshape the plan, the highest-impact McLean kitchen work is structural — removing the bearing wall between the original kitchen and dining room, expanding into a former breakfast area, or relocating mechanical to clean up sight lines and ceiling height. We bring a structural engineer in early when those moves are on the table, value-engineer the parts of the budget the eye won't see, and protect the spend for the cabinetry, stone, and fixtures that define the room.",
      "Project communication is concentrated through one named project lead from estimate through final punch list. Daily progress photos, clean job site every evening, same-day response, and a written workmanship warranty. Fairfax County permitting, mechanical and electrical inspections, and coordination with the designer or architect are handled by us — you stay focused on the decisions that actually require you, which are mostly the fun ones.",
    ],
  },

  // ── KITCHENS · ALEXANDRIA, VA ────────────────────────────────────────────
  'kitchens-alexandria-va': {
    paragraphs: [
      "Alexandria kitchens range from museum-quality historic restorations in Old Town townhouses to architecturally substantial colonials and contemporary updates in Belle Haven, Rosemont, North Ridge, and Beverley Hills. Each calls for a different sensibility, and the contractor who delivers consistently in this city is one who can read which sensibility the home is asking for and execute to it without compromise.",
      "Real Elite Contracting builds Alexandria kitchens with the same craft standard we bring to McLean, calibrated to the architectural pedigree of the address. Typical Alexandria primary-kitchen scope in 2026 runs $80,000–$300,000+ depending on the home, the cabinetry brief (inset paint-grade vs. flat-panel walnut vs. period-respectful furniture-style), the stone (honed soapstone, marble, quartzite), and the appliance specification. Old Town historic kitchens are often the most technically demanding — supplemental floor framing, careful electrical re-routing inside plaster walls, mechanical that has to navigate a 19th-century chase — and we handle all of it in-stride.",
      "Old Town Historic District review applies to any change that affects building exteriors; the interior kitchen work itself is permitted through the City of Alexandria for interior renovations, electrical, plumbing, and mechanical. We hold the paperwork and coordinate the trade inspection sequence. For the design itself, we work closely with the kitchen and interior designers Alexandria homeowners typically bring to a project of this size, and we execute the spec the design calls for — not a contractor's interpretation of it.",
      "Communication runs through one named project lead from estimate through final walkthrough. Daily progress photos, a clean job site every evening, same-day response standard, and a written workmanship warranty. We work clean, we communicate proactively, and we treat the rest of your home like the historic asset it is.",
    ],
  },

  // ── BASEMENTS · MCLEAN, VA ───────────────────────────────────────────────
  'basements-mclean-va': {
    paragraphs: [
      "McLean homes generally have generous unfinished lower levels with full ceiling height and walkout access, which makes finished-basement entertainment suites one of the highest-impact projects an estate-class home can build. The McLean basement brief tends to be ambitious: a true media room with tiered seating, a separate wet bar with refrigerated drawers and dishwasher, a guest suite with full bath, a fitness or yoga room, sometimes a wine room. Done right, the lower level adds a full additional tier of livable space to an already substantial home.",
      "Real Elite Contracting builds McLean lower levels to the same standard as the upper floors. Moisture and vapor control come first — perimeter inspection, sump pump and battery backup verification, dimple-mat or insulated subfloor systems where the slab condition requires it — because the cheap shortcut on moisture is the one that surfaces three years later as a mold problem in the cabinetry. From there: code-compliant framing, egress where bedrooms are planned, full electrical with structured wiring and zoned lighting, HVAC extension or dedicated mini-split systems, surround pre-wire, and the millwork and finishes that turn the space into a true room.",
      "Typical McLean basement-finishing scope in 2026 runs $90,000–$250,000+ depending on square footage, feature mix, and the level of millwork and stone in the build. A finished entertainment lower level with media room, wet bar, full bath, guest suite, and gym usually lands in the $150,000–$220,000 range. We provide detailed line-item estimates with framing, electrical, plumbing, HVAC, insulation, drywall, flooring, millwork, stone, and finishes all broken out so the budget is transparent.",
      "Fairfax County permits and inspections are required for framing, electrical, plumbing, mechanical, and final. We coordinate the inspector sequence so trades don't lose days waiting on each other. One named project lead, daily updates, clean job site, written workmanship warranty. Most full McLean basement projects run 10–18 weeks of active work depending on scope.",
    ],
  },

  // ── BASEMENTS · ALEXANDRIA, VA ───────────────────────────────────────────
  'basements-alexandria-va': {
    paragraphs: [
      "Alexandria basement work splits cleanly into two categories: historic Old Town townhouse cellars, which need a very specific technical approach (often around moisture, ceiling height, and structure), and the larger walkout or full lower levels in the colonial and contemporary homes of Belle Haven, Rosemont, North Ridge, and Beverley Hills. Real Elite Contracting handles both, and the right answer for each is rarely the same.",
      "For Belle Haven and the post-war neighborhoods, lower-level finishes follow the same playbook as a luxury Fairfax County build: moisture control first, code-compliant framing with proper egress, full electrical and plumbing rough-in, HVAC, surround pre-wire, and millwork that elevates the space. Typical scope runs $80,000–$200,000+ depending on square footage and feature mix — finished family room, full bath, wet bar, guest suite, and dedicated gym or office.",
      "Old Town historic cellars are a different conversation. Ceiling heights, original masonry walls, exposed beam structures, and existing mechanical chases all influence what's possible and what's wise. We often recommend a more restrained finish in these spaces — wine storage, a quiet workshop, a guest room with its own bath — that respects the period character of the home above. Where moisture control or structural reinforcement is required, we do it correctly and document it for the historic record.",
      "Permitting runs through the City of Alexandria for interior work; framing, electrical, plumbing, mechanical, and final inspections are all required. We carry the paperwork and coordinate the sequence. One named project lead from estimate through final walkthrough, daily progress photos, clean job site every day, and a written workmanship warranty on the finished result.",
    ],
  },

  // ── BATHROOMS · VIENNA, VA ───────────────────────────────────────────────
  'bathrooms-vienna-va': {
    paragraphs: [
      "Vienna is one of the most thoughtful primary-bath markets in Fairfax County — a homeowner population that has done its research, often comes in with a designer already engaged, and expects an installer-grade contractor with the discipline to execute the design as drawn. The homes range from mid-century properties in Wolftrap and Country Club Manor to substantial newer builds along the Maple Avenue corridor and out toward Hunter Mill, and the primary-bath brief tends to be spa-grade and structurally ambitious.",
      "Real Elite Contracting renovates Vienna primary baths and powder rooms with the level of craft Fairfax County's design community expects. Typical Vienna primary-bath scope in 2026 runs $55,000–$110,000+ depending on size, layout changes, and material grade. Featured projects routinely include curbless walk-in showers with linear drains, freestanding soaking tubs, double-vanity layouts with stone tops, slab-edge mitered details, premium fixture lines (Brizo, Hansgrohe, Kohler Artifacts), heated floors, and lighting designed scene by scene rather than a single ceiling fixture.",
      "Where there's room to rework the plan, we engage early — opening a primary into an adjoining closet for a true suite, repositioning plumbing for a cleaner shower geometry, repositioning the toilet to a private compartment for a more refined room. We model the proposed changes, value-engineer the parts of the budget that won't change the visible result, and protect the spend for the surfaces and fixtures the eye actually lands on.",
      "Fairfax County permits, plumbing, electrical, and final inspections are handled by us. One named project lead from estimate through final walkthrough, daily progress photos, clean job site every evening, same-day response standard, and a written workmanship warranty on the finished work.",
    ],
  },

  // ── KITCHENS · VIENNA, VA ────────────────────────────────────────────────
  'kitchens-vienna-va': {
    paragraphs: [
      "Vienna primary kitchens are some of the most carefully specified residential projects in Northern Virginia. The combination of the design-aware homeowner population, the architectural variety of the housing stock, and the proximity to Tysons-area showrooms means a typical Vienna kitchen is a $130,000–$300,000+ undertaking executed in close collaboration with the designer, the cabinet shop, and the appliance specialist.",
      "Real Elite Contracting builds Vienna kitchens with that collaboration in mind. Typical scope includes custom inset cabinetry (often paint-grade or rift-cut white oak), full-slab quartzite or natural-stone countertops with mitered apron edges, integrated panel-front appliance suites (Sub-Zero, Wolf, Miele), professional ventilation that disappears into millwork, scullery or butler's pantry build-outs where the plan supports them, and layered lighting from the cans to the in-cabinet to the decorative.",
      "Where there's an opportunity to reshape the plan — removing the bearing wall to the dining room, expanding into a former breakfast area, relocating mechanical to clean up ceiling height — those structural moves often deliver the highest-impact result in a Vienna kitchen. We bring a structural engineer in early when needed, model the changes for the homeowner and designer, value-engineer the parts that won't be visible, and protect the spend for the cabinetry, stone, and fixtures that define the room.",
      "Project communication runs through one named project lead from estimate through final punch list. Daily progress photos, clean job site every evening, same-day response standard, and a written workmanship warranty. Fairfax County permitting, mechanical and electrical inspections, and coordination with the designer or architect are handled by us — you stay focused on the decisions that actually require you.",
    ],
  },

  // ── BASEMENTS · VIENNA, VA ───────────────────────────────────────────────
  'basements-vienna-va': {
    paragraphs: [
      "Vienna homes typically have generous unfinished lower levels with full ceiling height and walkout access, which makes a finished entertainment lower level one of the highest-impact projects the home can build. The typical Vienna basement brief includes a true media room with tiered seating, a wet bar with refrigerated drawers and dishwasher, a guest suite with full bath, a fitness or yoga room, sometimes a wine room. Done right, the lower level adds a full additional tier of livable space.",
      "Real Elite Contracting builds Vienna lower levels to the same standard as the upper floors. Moisture and vapor control come first — perimeter inspection, sump pump and battery backup verification, dimple-mat or insulated subfloor systems where the slab condition requires it — because the shortcut on moisture is the one that surfaces three years later as a mold problem in the cabinetry. From there: code-compliant framing, egress where bedrooms are planned, full electrical with structured wiring and zoned lighting, HVAC extension or dedicated mini-split systems, surround pre-wire, and the millwork and finishes that turn the space into a true room.",
      "Typical Vienna basement-finishing scope in 2026 runs $80,000–$200,000+ depending on square footage, feature mix, and the level of millwork and stone. A finished entertainment lower level with media room, wet bar, full bath, guest suite, and gym usually lands in the $130,000–$180,000 range. We provide detailed line-item estimates with everything broken out so the budget is transparent.",
      "Fairfax County permits and inspections are required for framing, electrical, plumbing, mechanical, and final. We coordinate the inspector sequence so trades don't lose days waiting on each other. One named project lead, daily updates, clean job site, written workmanship warranty. Most full Vienna basement projects run 8–14 weeks of active work depending on scope.",
    ],
  },

  // ── BATHROOMS · GREAT FALLS, VA ──────────────────────────────────────────
  'bathrooms-great-falls-va': {
    paragraphs: [
      "Great Falls primary baths are some of the most ambitious residential bathroom projects in the country. The combination of the estate-class housing stock, the architectural and design talent the address attracts, and the homeowner expectation of a primary suite that reads as a private wing means a typical Great Falls primary bath is a $100,000–$200,000+ undertaking executed in close collaboration with the designer and a tier-one cabinet shop.",
      "Real Elite Contracting renovates Great Falls primary baths with the craft this market expects. Featured projects routinely include a separate wet room with curbless walk-in shower and freestanding soaking tub under one envelope, his-and-her vanity towers, a private water closet, heated floors zoned by area, full integrated lighting design, and stone selected slab-by-slab. We work with custom cabinet shops, stone fabricators, and fixture specialists across the metro area, and we execute to whatever specification the design calls for.",
      "On larger Great Falls projects, the primary-bath renovation is often part of a primary-suite expansion that opens into the closet, the adjoining bedroom, or a former secondary room. We bring a structural engineer in early when those changes are on the table, model the geometry for the homeowner and designer, and value-engineer the parts of the budget that won't change the visible result.",
      "Fairfax County permits, plumbing, electrical, and final inspections are handled by us. One named project lead from estimate through final walkthrough, daily progress photos, clean job site every evening, and a written workmanship warranty. We work discreetly and respect the rest of the home as the asset it is.",
    ],
  },

  // ── KITCHENS · GREAT FALLS, VA ───────────────────────────────────────────
  'kitchens-great-falls-va': {
    paragraphs: [
      "Great Falls kitchens are designed around catering and entertaining at a scale most residential kitchens aren't built for. The typical brief includes a separate scullery or butler's pantry, professional-spec ventilation, full-height integrated refrigeration and freezer columns, a 60-inch range or a French range from a top-tier maker (La Cornue, Lacanche), a second prep sink, custom inset cabinetry from a tier-one shop, and stone selected slab-by-slab. Project scope routinely lands $200,000–$500,000+ depending on the cabinetry brief, the appliance specification, and the structural changes the plan requires.",
      "Real Elite Contracting builds Great Falls kitchens in close collaboration with the designers and architects this market relies on. We bring the structural engineering capability for the bearing-wall removals and ceiling-height changes the brief often requires, the millwork relationships for the scullery and butler's pantry build-outs, and the project discipline to coordinate the cabinet shop, the stone fabricator, the appliance specialist, and the design team without dropping a beat.",
      "Communication is concentrated through one named project lead from estimate through final punch list. Daily progress photos, clean job site every evening, same-day response standard, and a written workmanship warranty. Fairfax County permitting, mechanical and electrical inspections, and design-team coordination are handled by us.",
      "Project timelines vary with scope, but most full Great Falls kitchen builds run 14–22 weeks of active work after the design is locked. We protect the home and the family during the build, schedule deliveries to minimize disruption, and treat the project as a long-term partnership rather than a transaction.",
    ],
  },

  // ── BASEMENTS · GREAT FALLS, VA ──────────────────────────────────────────
  'basements-great-falls-va': {
    paragraphs: [
      "Great Falls lower levels are some of the most ambitious finished-basement projects in our service area. The typical brief includes a media room with tiered seating and acoustic treatment, a true wet bar that functions as a second entertaining kitchen, a wine room with dedicated cooling, a fitness room with rubber flooring and mirrored wall, a guest suite with full bath, and sometimes a separate game room or family lounge. Lower levels at this scale function as an entire additional tier of the home.",
      "Real Elite Contracting builds Great Falls lower levels to the same standard as the upper floors. Moisture and vapor control first — perimeter inspection, sump pump and battery backup verification, dimple-mat or insulated subfloor systems where required — because the shortcut on moisture is the one that surfaces years later. From there: code-compliant framing, egress where bedrooms are planned, full electrical with structured wiring and zoned lighting, dedicated HVAC systems where the existing capacity doesn't carry the load, surround pre-wire, acoustic treatment, and the millwork and stone that turn the space into a true room.",
      "Typical Great Falls basement-finishing scope in 2026 runs $150,000–$400,000+ depending on square footage, feature mix, and the level of millwork and stone in the build. A fully-finished entertainment lower level with media room, wet bar, wine room, fitness, guest suite, and gym usually lands in the $250,000–$350,000 range. We provide detailed line-item estimates with everything broken out.",
      "Fairfax County permits and inspections are required for framing, electrical, plumbing, mechanical, and final. We coordinate the inspector sequence so trades don't lose days waiting on each other. One named project lead, daily updates, clean job site, written workmanship warranty. Most full Great Falls basement builds run 14–22 weeks of active work depending on scope.",
    ],
  },

  // ── BATHROOMS · RESTON, VA ───────────────────────────────────────────────
  'bathrooms-reston-va': {
    paragraphs: [
      "Reston primary baths are some of the most design-aware renovations in Fairfax County. The original villages — Lake Anne, Hunters Woods, North Point, South Lakes — drew design-conscious owners from the start, and the renovation pipeline still reflects that. A typical Reston primary bath is a $50,000–$100,000+ project executed in close collaboration with a designer, with finish quality and execution discipline weighted as heavily as the line items themselves.",
      "Real Elite Contracting renovates Reston primary baths and powder rooms with the level of craft this market expects. Featured projects routinely include curbless walk-in showers with linear drains, freestanding soaking tubs, double-vanity layouts with stone tops, slab-edge mitered details, premium fixture lines, heated floors, and lighting designed scene by scene. For the lakefront homes around Lake Anne and Lake Audubon, we design with the view in mind and the privacy constraints the architecture requires.",
      "Where there's room to reshape the plan, we engage early. Many Reston primaries sit in original footprints that have aged into awkward layouts; opening into a closet, repositioning plumbing for a cleaner shower geometry, or relocating the toilet to a private compartment can transform a functional bathroom into a refined room.",
      "Fairfax County permits, plumbing, electrical, and final inspections are handled by us. One named project lead from estimate through final walkthrough, daily progress photos, clean job site every evening, and a written workmanship warranty.",
    ],
  },

  // ── KITCHENS · RESTON, VA ────────────────────────────────────────────────
  'kitchens-reston-va': {
    paragraphs: [
      "Reston kitchens are a strong primary-renovation market — a community of design-conscious owners whose homes were architecturally distinctive on day one and now deserve current-spec interiors. Typical Reston primary-kitchen scope in 2026 runs $100,000–$250,000+ depending on the cabinetry brief, the appliance specification, and the structural changes the plan requires.",
      "Real Elite Contracting builds Reston kitchens in close collaboration with the designers this market relies on. Featured scope includes custom inset or full-overlay cabinetry from a tier-one shop, full-slab quartzite or natural-stone countertops, integrated panel-front appliance suites (Sub-Zero, Wolf, Miele), professional ventilation, scullery or butler's pantry build-outs where the plan supports them, and layered lighting designed as a system rather than a single ceiling fixture.",
      "Many Reston kitchens benefit from removing the original wall between the kitchen and dining or family room. Where structural changes are on the table, we bring a structural engineer in early, model the geometry for the homeowner and designer, value-engineer the parts that won't be visible, and protect the spend for the cabinetry, stone, and fixtures that define the room.",
      "Communication is concentrated through one named project lead from estimate through final punch list. Daily progress photos, clean job site every evening, same-day response standard, and a written workmanship warranty. Fairfax County permitting, mechanical and electrical inspections, and design-team coordination are handled by us.",
    ],
  },

  // ── BASEMENTS · RESTON, VA ───────────────────────────────────────────────
  'basements-reston-va': {
    paragraphs: [
      "Reston homes typically have generous lower levels — often walkouts with full ceiling height — and a finished lower level is one of the highest-impact projects the home can build. The typical Reston basement brief includes a media room, wet bar, full bath, guest suite, and sometimes a dedicated gym or yoga room. The build adds a full additional tier of livable space.",
      "Real Elite Contracting builds Reston lower levels to the same standard as the upper floors. Moisture and vapor control come first — perimeter inspection, sump pump verification, dimple-mat or insulated subfloor systems where required. From there: code-compliant framing, egress where bedrooms are planned, full electrical with structured wiring and zoned lighting, HVAC extension or dedicated mini-split, surround pre-wire, and the millwork and finishes that turn the space into a true room.",
      "Typical Reston basement-finishing scope in 2026 runs $70,000–$180,000+ depending on square footage and feature mix. A finished entertainment lower level with media room, wet bar, full bath, and guest suite usually lands in the $110,000–$160,000 range. We provide detailed line-item estimates with framing, electrical, plumbing, HVAC, insulation, drywall, flooring, millwork, and finishes all broken out.",
      "Fairfax County permits and inspections are required for framing, electrical, plumbing, mechanical, and final. We coordinate the inspector sequence so trades don't lose days waiting on each other. One named project lead, daily updates, clean job site, written workmanship warranty. Most full Reston basement projects run 8–14 weeks of active work depending on scope.",
    ],
  },

  // ── BATHROOMS · BURKE, VA ────────────────────────────────────────────────
  'bathrooms-burke-va': {
    paragraphs: [
      "Burke is one of the strongest mid-to-upper-tier bathroom-renovation markets in Fairfax County. The substantial homes of Burke Centre, Lake Braddock, Longwood Knolls, and Kings Park West are typically owner-occupied long-term, which means primary baths get renovated to last — not to flip. Typical Burke primary-bath scope in 2026 runs $40,000–$80,000+ depending on size, layout changes, and material grade.",
      "Real Elite Contracting renovates Burke primary baths and powder rooms with the level of craft this market expects. Featured projects routinely include walk-in showers with glass enclosures, soaking tubs, double-vanity layouts with stone tops, slab-edge details, quality fixture lines, and the layout changes that transform a 1990s primary bath into a refined room.",
      "Where there's room to reshape the plan — opening into a closet, repositioning plumbing for a cleaner shower geometry, relocating the toilet to a private compartment — those changes often deliver the highest-impact result on a Burke primary bath. We model the changes, value-engineer the parts that won't change the visible result, and protect the spend for the surfaces and fixtures the eye actually lands on.",
      "Fairfax County permits, plumbing, electrical, and final inspections are handled by us. One named project lead from estimate through final walkthrough, daily progress photos, clean job site every evening, and a written workmanship warranty.",
    ],
  },

  // ── KITCHENS · BURKE, VA ─────────────────────────────────────────────────
  'kitchens-burke-va': {
    paragraphs: [
      "Burke kitchens are a strong bread-and-butter premium-remodel market — substantial homes whose original kitchens have aged into layouts and finishes that don't match how the family actually lives and entertains. Typical Burke primary-kitchen scope in 2026 runs $70,000–$160,000+ depending on the cabinetry brief, the appliance specification, and the structural changes the plan requires.",
      "Real Elite Contracting builds Burke kitchens with the same craft we bring to the McLean / Great Falls market, calibrated to the Burke project brief. Featured scope includes custom or semi-custom cabinetry from a quality shop, quartz or natural-stone countertops, integrated or premium freestanding appliance suites (Sub-Zero, Wolf, Bosch, Thermador), proper ventilation, and layered lighting.",
      "Many Burke kitchens benefit from removing the original wall between the kitchen and family room. Where structural changes are on the table, we bring a structural engineer in early, model the geometry, value-engineer the parts that won't be visible, and protect the spend for the cabinetry, stone, and fixtures that define the room.",
      "Communication is concentrated through one named project lead from estimate through final punch list. Daily progress photos, clean job site every evening, same-day response standard, and a written workmanship warranty. Fairfax County permitting, mechanical and electrical inspections, and design coordination are handled by us.",
    ],
  },

  // ── BASEMENTS · BURKE, VA ────────────────────────────────────────────────
  'basements-burke-va': {
    paragraphs: [
      "Burke homes typically have generous unfinished lower levels, and a finished lower level is one of the highest-impact projects a Burke homeowner can build. The typical Burke basement brief includes a finished family room, full bath, wet bar or kitchenette, guest suite or office, and sometimes a dedicated gym or media room.",
      "Real Elite Contracting builds Burke lower levels with proper moisture control as the foundation: perimeter inspection, sump pump verification, vapor barrier installation under any framing, dimple-mat or insulated subfloor where the slab condition requires it. From there: code-compliant framing, egress where bedrooms are planned, full electrical, HVAC extension, and the insulation, drywall, and finishes that turn raw space into living space.",
      "Typical Burke basement-finishing scope in 2026 runs $55,000–$140,000+ depending on square footage and feature mix. A finished family room with full bath, wet bar, guest suite, and laundry rough-in usually lands in the $80,000–$120,000 range. We provide detailed line-item estimates with everything broken out.",
      "Fairfax County permits and inspections are required for framing, electrical, plumbing, mechanical, and final. We coordinate the inspector sequence so trades don't lose days waiting on each other. One named project lead, daily updates, clean job site, written workmanship warranty.",
    ],
  },

  // ── BATHROOMS · FAIRFAX STATION, VA ──────────────────────────────────────
  'bathrooms-fairfax-station-va': {
    paragraphs: [
      "Fairfax Station primary baths trend larger and more architecturally ambitious than the typical Fairfax County remodel — a reflection of the larger lots, the longer-term ownership pattern, and the homeowner expectation that a primary bath should function as a private retreat. Typical Fairfax Station primary-bath scope in 2026 runs $60,000–$130,000+ depending on size, layout changes, and material grade.",
      "Real Elite Contracting renovates Fairfax Station primary baths with the craft this market expects. Featured projects routinely include curbless walk-in showers with linear drains, freestanding soaking tubs, double-vanity layouts with stone tops, slab-edge mitered details, premium fixture lines, heated floors, and lighting designed scene by scene.",
      "Many Fairfax Station primary-bath renovations are part of a primary-suite expansion that opens into the closet or an adjoining bedroom. We bring a structural engineer in early when those changes are on the table, model the geometry for the homeowner and designer, and value-engineer the parts of the budget that won't change the visible result.",
      "Fairfax County permits, plumbing, electrical, and final inspections are handled by us. One named project lead from estimate through final walkthrough, daily progress photos, clean job site every evening, and a written workmanship warranty.",
    ],
  },

  // ── KITCHENS · FAIRFAX STATION, VA ───────────────────────────────────────
  'kitchens-fairfax-station-va': {
    paragraphs: [
      "Fairfax Station kitchens skew larger and more architecturally substantial than typical Fairfax County kitchens. The homes are bigger, the entertaining is more serious, and the brief often includes a separate scullery or butler's pantry, professional-spec ventilation, integrated panel-front appliance suites, and a full-height refrigerator and freezer column. Typical scope in 2026 runs $130,000–$300,000+.",
      "Real Elite Contracting builds Fairfax Station kitchens in close collaboration with the designers this market relies on. Featured scope includes custom inset cabinetry from a tier-one shop, full-slab quartzite or natural-stone countertops with mitered apron edges, integrated panel-front appliance suites (Sub-Zero, Wolf, Miele), professional ventilation that disappears into millwork, scullery build-outs, and layered lighting.",
      "Where there's an opportunity to reshape the plan — removing the bearing wall to the family room, expanding into a former breakfast area, relocating mechanical to clean up ceiling height — those structural moves often deliver the highest-impact result. We bring a structural engineer in early, model the changes, value-engineer the parts that won't be visible, and protect the spend for the cabinetry, stone, and fixtures.",
      "Communication runs through one named project lead from estimate through final punch list. Daily progress photos, clean job site every evening, same-day response standard, and a written workmanship warranty. Fairfax County permitting, mechanical and electrical inspections, and design coordination are handled by us.",
    ],
  },

  // ── BASEMENTS · FAIRFAX STATION, VA ──────────────────────────────────────
  'basements-fairfax-station-va': {
    paragraphs: [
      "Fairfax Station lower levels are some of the most substantial finished-basement projects in southern Fairfax County. The typical brief includes a media room with tiered seating, a wet bar that functions as a second entertaining kitchen, a guest suite with full bath, a fitness or yoga room, and sometimes a wine room or family lounge.",
      "Real Elite Contracting builds Fairfax Station lower levels to the same standard as the upper floors. Moisture and vapor control first — perimeter inspection, sump pump and battery backup verification, dimple-mat or insulated subfloor where required. From there: code-compliant framing, egress where bedrooms are planned, full electrical with structured wiring and zoned lighting, HVAC extension or dedicated mini-split, surround pre-wire, and the millwork and finishes that turn the space into a true room.",
      "Typical Fairfax Station basement-finishing scope in 2026 runs $100,000–$250,000+ depending on square footage, feature mix, and the level of millwork and stone. A finished entertainment lower level with media room, wet bar, full bath, guest suite, and gym usually lands in the $150,000–$200,000 range. We provide detailed line-item estimates with everything broken out.",
      "Fairfax County permits and inspections are required for framing, electrical, plumbing, mechanical, and final. We coordinate the inspector sequence so trades don't lose days waiting on each other. One named project lead, daily updates, clean job site, written workmanship warranty.",
    ],
  },

  // ── BATHROOMS · CLIFTON, VA ──────────────────────────────────────────────
  'bathrooms-clifton-va': {
    paragraphs: [
      "Clifton primary baths divide naturally into two project briefs: historic homes in the Clifton Village proper, where period accuracy and restrained luxury are the priority, and the larger country estates along Compton Road, Ridge Road, and Yates Ford Road, where the brief is closer to a Great Falls primary-suite expansion. Real Elite Contracting handles both, calibrated to the architectural character of the address.",
      "For historic Clifton Village homes, we specify period-respectful tile patterns (hex mosaic, marble basketweave, subway with pencil liners), traditional vanity profiles in inset cabinetry, polished nickel or unlacquered brass fittings, and clawfoot or freestanding tubs that belong in a historic envelope. Typical scope runs $50,000–$110,000+ depending on the level of structural and plumbing work the floor plan requires.",
      "For the country estates, the brief tends to be larger and more contemporary — curbless walk-in showers with linear drains, freestanding soaking tubs, double-vanity layouts with stone tops, slab-edge mitered details, premium fixture lines, heated floors, and lighting designed scene by scene. Typical scope runs $70,000–$150,000+.",
      "Fairfax County permits, plumbing, electrical, and final inspections are handled by us. For homes inside Clifton Town's historic district, any change affecting building exteriors requires Town review; we carry the paperwork. One named project lead from estimate through final walkthrough, daily progress photos, clean job site every evening, and a written workmanship warranty.",
    ],
  },

  // ── KITCHENS · CLIFTON, VA ───────────────────────────────────────────────
  'kitchens-clifton-va': {
    paragraphs: [
      "Clifton kitchens range from period-respectful historic-village renovations to substantial estate kitchens on the surrounding country lots. Each calls for a different sensibility, and the right contractor in this market is one who can read which sensibility the home is asking for and execute to it without compromise.",
      "Real Elite Contracting builds Clifton kitchens with the same craft we bring to the McLean / Great Falls market, calibrated to the architectural pedigree of the address. Typical scope in 2026 runs $90,000–$280,000+ depending on the home, the cabinetry brief (inset paint-grade vs. period furniture-style), the stone, and the appliance specification. Historic Clifton kitchens often need creative plumbing and electrical routing inside plaster walls; we handle that as part of the scope.",
      "For estate-class country properties, the brief is closer to Great Falls or Fairfax Station: full inset cabinetry from a tier-one shop, professional-spec ventilation, integrated panel-front appliances, scullery or butler's pantry, and structural changes (bearing wall removal, ceiling height changes) where the plan supports them. We bring a structural engineer in early when needed.",
      "Communication runs through one named project lead from estimate through final punch list. Daily progress photos, clean job site every evening, same-day response standard, and a written workmanship warranty. Fairfax County permitting, mechanical and electrical inspections, and design coordination are handled by us.",
    ],
  },

  // ── BASEMENTS · CLIFTON, VA ──────────────────────────────────────────────
  'basements-clifton-va': {
    paragraphs: [
      "Clifton lower levels mirror the same two-track pattern as the upstairs: restrained, period-respectful finishes in the historic village homes, and large entertainment-tier builds in the country estates. Real Elite Contracting handles both, with the right answer determined by the home.",
      "For historic Clifton Village homes, we often recommend a restrained finish in the lower level — wine storage, a quiet workshop, a guest room with its own bath, a family lounge — that respects the period character above. Where moisture control or structural reinforcement is required, we do it correctly and document it. Typical scope runs $60,000–$160,000+.",
      "For the country estates, the brief is closer to a Great Falls or Fairfax Station build: media room with tiered seating, wet bar that functions as a second entertaining kitchen, guest suite with full bath, fitness room, sometimes a wine room. Typical scope runs $130,000–$300,000+ depending on square footage and feature mix.",
      "Fairfax County permits and inspections are required for framing, electrical, plumbing, mechanical, and final. We coordinate the inspector sequence so trades don't lose days waiting on each other. One named project lead, daily updates, clean job site, written workmanship warranty.",
    ],
  },

  // ── BATHROOMS · MIDDLEBURG, VA ───────────────────────────────────────────
  'bathrooms-middleburg-va': {
    paragraphs: [
      "Real Elite Contracting remodels selected Middleburg bathrooms. A Middleburg mailing address is not Town limits — Atoka, Foxcroft, and Goose Creek parcels are often unincorporated Loudoun. We check the parcel before we file.",
      "Plumbing or electrical relocation needs a Loudoun County building permit. Inside Town, work that needs a county building permit also needs a Town Zoning Location Permit first. Historic District exteriors — including a new window on a bath — need a Certificate of Appropriateness from the Historic District Review Committee, with complete applications due 14 days before the meeting.",
      "We do not publish invented $80,000–$180,000 bands, featured-project photo claims, or hunt-country spa lists. Waterproofing and the inspection sequence are in the written scope.",
      "Named project lead, daily updates, written workmanship warranty.",
    ],
  },

  // ── KITCHENS · MIDDLEBURG, VA ────────────────────────────────────────────
  'kitchens-middleburg-va': {
    paragraphs: [
      "Real Elite Contracting remodels selected Middleburg kitchens. A Middleburg mailing address is not Town limits. We check the parcel before we file.",
      "A load-bearing opening needs stamped drawings and a Loudoun County building permit. Inside Town, that county permit waits on a Zoning Location Permit. Historic District exteriors need a Certificate of Appropriateness; complete COA applications are due 14 days before the HDRC meeting.",
      "We do not publish invented $150,000–$450,000 bands or named range brands as if they were the standard package. Cabinet lead time goes in the written timeline before demo.",
      "Named project lead, daily updates, written workmanship warranty.",
    ],
  },

  // ── BASEMENTS · MIDDLEBURG, VA ───────────────────────────────────────────
  'basements-middleburg-va': {
    paragraphs: [
      "Real Elite Contracting finishes selected Middleburg lower levels — family rooms, a bath, or an in-law suite when the floor plan and egress allow it. A Middleburg mailing address is not Town limits: parcels along Atoka, Foxcroft, and Goose Creek are often unincorporated Loudoun. We check the parcel before we file.",
      "Inside Town limits the order is fixed. Work that needs a Loudoun County building permit also needs a Town Zoning Location Permit first. County work has two paths: Typical Finished Basement Details in lieu of custom drawings, or a complete plan set. Typical cannot be used if the job alters a load-bearing wall, an exterior wall, a beam, or a column. Published Typical fees are 1% of construction cost excluding electrical, mechanical, plumbing, and gas, with a $65 minimum; full plans add a published $130 plan review fee. A kitchen in the basement adds a published $165 county zoning fee. A bedroom needs an emergency egress window — that opening is exterior work.",
      "If the parcel is in the Historic District, an egress opening needs a Certificate of Appropriateness from the Historic District Review Committee. Complete applications are due 14 days before the meeting. A county permit is not a COA. Moisture comes first: perimeter check, sump if one exists, vapor control under the finish floor. We do not publish invented basement price bands or treat wine cellars, tasting rooms, and gun rooms as the typical Middleburg brief.",
      "What you get is the paperwork product: Town or unincorporated county, Typical vs full plans, and whether HDRC review is in play. We prepare the Town zoning set and the county LandMARC building set. County inspections: trade rough-ins before building framing, insulation before cover, then finals. We install to the Virginia Uniform Statewide Building Code and the approved Typical Detail or stamped plans, document each inspection, and back the work with a written workmanship warranty.",
    ],
  },

  // ── ADDITIONS · LOUDOUN ───────────────────────────────────────────────────

  'additions-leesburg-va': {
    paragraphs: [
      "Real Elite Contracting builds Leesburg additions — a bump-out, a single room, a second story when the structure allows it, or a screened porch. Loudoun publishes a screened porch as a residential addition, not a Typical Deck. We work the Town and western Leesburg first. A Leesburg mailing address is not Town of Leesburg limits: Lansdowne and River Creek often carry a Leesburg address and sit in unincorporated Loudoun. We check the parcel before we file.",
      "Inside Town limits the order is fixed. The Town's published home-improvement table treats home additions and expansions as Town zoning plus engineering review, then a Loudoun County building permit. The county will not release the building permit until Town zoning is approved. The county set needs a plat (house, addition location, distances to the sides and rear) and a comprehensive structural plan. Published county fees: $395 at or under 1,000 square feet (building, plan review, and county zoning bundled); over 1,000 square feet, 1% of construction cost plus a $335 plan review fee plus county zoning. Trade permits are separate. If the addition adds a bedroom on well and septic, Health Department approval comes before the county application.",
      "If the parcel is in the H-1 Old and Historic District, the addition needs a Certificate of Appropriateness. Outside Town limits, county building and zoning run through LandMARC. A county permit is not HOA approval — we file the association packet in parallel. Environmentally sensitive lots and conservation easements can add review; we check those before we lock the design. We do not publish invented addition price bands or a completed Leesburg project count we cannot show.",
      "What you get is the paperwork product: Town or unincorporated county, the published fee path, and whether a COA is in play. We prepare the Town eTRAKiT zoning set and the county LandMARC addition set. County inspections for additions: footing, foundation, framing, insulation, and final, plus trade rough-ins and finals. Approved plans stay on the job. We install to the Virginia Uniform Statewide Building Code and the stamped plans, document each inspection, and back the work with a written workmanship warranty.",
    ],
  },

  'additions-ashburn-va': {
    paragraphs: [
      "Real Elite Contracting builds Ashburn additions — a bump-out, a single room, a second story when the structure allows it, or a screened porch. Loudoun publishes a screened porch as a residential addition, not a Typical Deck. Ashburn is unincorporated Loudoun County, not a town. Building and zoning run through LandMARC. We work Brambleton, Broadlands, Ashburn Farm, and One Loudoun when the parcel sits in those associations.",
      "Every addition needs a Loudoun County building and zoning application, a plat showing the house, the addition, and setbacks, and a comprehensive structural plan. Published county fees: $395 at or under 1,000 square feet (building, plan review, and county zoning bundled); over 1,000 square feet, 1% of construction cost plus a $335 plan review fee plus county zoning. Trade permits (electrical, plumbing, mechanical, gas) are separate. Gas permits for residential additions have required plan review since October 1, 2025.",
      "A county permit is not HOA approval. We file the association packet in parallel. Brambleton reviews essentially all exterior changes; the Covenants Committee typically meets the second Monday, applications due 9:00 AM Friday ten days prior, decision letters usually 5–7 business days after. Broadlands Declaration 7.5 requires Modifications Subcommittee written consent before an exterior addition; applications due noon Wednesday one week prior. For One Loudoun and Ashburn Farm we use the current packet — we do not invent approved-color lists. We do not publish invented addition price bands or claim a pipeline of finished Ashburn additions we cannot show.",
      "What you get is the paperwork product: the published fee path, which association reviews the lot, and the LandMARC set plus the ARC packet. County inspections: footing, foundation, framing, insulation, and final, plus trade rough-ins and finals. Approved plans stay on the job. We install to the Virginia Uniform Statewide Building Code and the stamped plans, document each inspection, and back the work with a written workmanship warranty.",
    ],
  },

  'additions-loudoun-county-va': {
    paragraphs: [
      "Real Elite Contracting builds Loudoun County additions — a bump-out, a single room, a second story when the structure allows it, or a screened porch. The county publishes a screened porch as a residential addition, not a Typical Deck. We work the western corridor first (Purcellville, Round Hill, Lovettsville, western Leesburg, selected Middleburg) because that is the practical truck path from Martinsburg.",
      "Every addition needs a Loudoun County building and zoning application, a plat with setbacks, and a comprehensive structural plan. Published county fees: $395 at or under 1,000 square feet (building, plan review, and county zoning bundled); over 1,000 square feet, 1% of construction cost plus a $335 plan review fee plus county zoning. Leesburg, Purcellville, and Middleburg issue town zoning first — the county will not release the building permit without it. If the addition adds a bedroom on well and septic, Health Department approval comes before the county application. Conservation easements are more common in western Loudoun; we check the parcel before we lock the design.",
      "A county permit is not HOA approval. An addition is exterior work: HOA review in master-planned communities, and a Certificate of Appropriateness in Old Town Leesburg or the Middleburg Historic District. We do not publish invented addition price bands or treat wine cellars and media wings as the typical Loudoun brief.",
      "What you get is the paperwork product: the published fee path, town vs unincorporated county, and whether HOA or COA review is in play. County inspections: footing, foundation, framing, insulation, and final, plus trade rough-ins and finals. We install to the Virginia Uniform Statewide Building Code and the stamped plans, document each inspection, and back the work with a written workmanship warranty.",
    ],
  },

  'additions-middleburg-va': {
    paragraphs: [
      "Real Elite Contracting builds selected Middleburg additions — a bump-out, a single room, or a screened porch when the lot and the architecture allow it. Loudoun publishes a screened porch as a residential addition, not a Typical Deck. A Middleburg mailing address is not Town limits: parcels along Atoka, Foxcroft, and Goose Creek are often unincorporated Loudoun. We check the parcel before we file.",
      "Inside Town limits the order is fixed. An addition needs a Town Zoning Location Permit first, then the Loudoun County building permit. The county set needs a plat (house, addition, setbacks) and a comprehensive structural plan. Published county fees: $395 at or under 1,000 square feet (building, plan review, and county zoning bundled); over 1,000 square feet, 1% of construction cost plus a $335 plan review fee plus county zoning. Town zoning has its own fee — we put the current Town amount in the written estimate. If the addition adds a bedroom on well and septic, Health Department approval comes first. Conservation easements can limit what the lot will take.",
      "If the parcel is in the Historic District, the addition needs a Certificate of Appropriateness from the Historic District Review Committee. Complete applications are due 14 days before the meeting. A county permit is not a COA. We do not publish invented addition price bands or treat tasting rooms, wine cellars, and gun rooms as the typical Middleburg brief.",
      "What you get is the paperwork product: Town or unincorporated county, the published fee path, and whether HDRC review is in play. We prepare the Town zoning set and the county LandMARC addition set. County inspections: footing, foundation, framing, insulation, and final, plus trade rough-ins and finals. We install to the Virginia Uniform Statewide Building Code and the stamped plans, document each inspection, and back the work with a written workmanship warranty.",
    ],
  },
};

