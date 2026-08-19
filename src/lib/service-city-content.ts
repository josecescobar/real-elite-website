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
 * siding ship combos for all six cities; bathrooms / kitchens / basements
 * only render where the matching CONTENT entry exists (premium remodels
 * are positioned only in the markets where they're the lead service per
 * CITY_DATA.marketEmphasis in constants.ts). generateStaticParams below
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
  'sterling-va',
  'purcellville-va',
  'brambleton-va',
  'south-riding-va',
  'lansdowne-va',
  'aldie-va',
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
      "Leesburg is one of Northern Virginia's most sought-after communities, where historic charm meets upscale modern living. Homes here range from Colonial-era properties in the historic district to newly built estate homes in Lansdowne and Cascades. Loudoun County's climate — with humid summers, nor'easter season, and periodic ice storms — makes professional roofing a recurring priority for every homeowner.",
      "Real Elite Contracting brings premium roofing services to Leesburg and across Loudoun County. Our crews are experienced with the complex rooflines common in Leesburg's upscale neighborhoods — from standing seam metal roofing on historic properties along King Street to architectural shingle replacements in Lansdowne on the Potomac and Countryside. We use only top-tier materials and maintain strict quality standards that match the elevated expectations of Leesburg homeowners.",
      "Proximity to the Potomac watershed creates added moisture challenges for homes in Leesburg's lower-lying areas. We assess drainage patterns, ventilation, and flashing conditions as part of every roof inspection, ensuring your new roof performs for 25–50 years. For homes in HOA-governed communities, we're familiar with design standards and approval processes, taking the compliance burden off your plate.",
      "When it comes to storm damage, ice dam formation, or simply an aging roof that has reached the end of its service life, Real Elite provides fast response and honest assessments. We don't upsell unnecessary work — if a repair will solve the problem, we'll tell you.",
    ],
  },

  'roofing-ashburn-va': {
    paragraphs: [
      "Ashburn, Virginia has grown into one of the most dynamic residential markets in the country, driven by the tech corridor along Loudoun County Parkway and the Silver Line Metro expansion. With thousands of newer homes in communities like Broadlands, Brambleton, and One Loudoun, many Ashburn homeowners are now reaching the 15–20 year mark on their original roofing systems — the typical replacement window for architectural shingles.",
      "Real Elite Contracting specializes in roof replacements and repairs throughout Ashburn and surrounding Loudoun County communities. We understand the construction standards used in Ashburn's major developments and can quickly assess whether your roof is ready for replacement or still has years of service life remaining. Our free inspections are detailed and honest — we bring photos from the roof and walk you through our findings before any commitment is required.",
      "Many Ashburn neighborhoods are governed by HOAs with specific requirements for roofing materials, colors, and installation standards. Real Elite is well-versed in navigating HOA approval processes and working within community guidelines. We'll help you select shingle colors and styles that satisfy your HOA while giving your home a fresh, updated appearance.",
      "Ashburn's young families and working professionals value speed and reliability. We schedule roofing projects efficiently, minimize disruption to your household, and complete most full replacements in a single day. All debris is removed and we do a thorough magnetic sweep of your yard to ensure no leftover nails remain.",
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
      "Loudoun County is one of the most demanding residential markets in the country — estate homes in horse country west of Route 15, master-planned communities like Brambleton and One Loudoun, premium properties along the Silver Line Metro corridor, and historic homes from Leesburg to Purcellville. Loudoun roofs see the full Mid-Atlantic weather mix: nor'easters, summer thunderstorms, ice storms, and the periodic windstorms that come down off the Blue Ridge.",
      "Real Elite Contracting brings premium roofing services to homeowners across Loudoun County. We're experienced with the complex rooflines that define Loudoun's upscale neighborhoods — standing seam metal on historic country properties, architectural shingles on Lansdowne estates and One Loudoun homes, copper accents on premium custom builds. The expectation in this market is precision, and we deliver it.",
      "Loudoun's master-planned communities — Brambleton, Lansdowne, Cascades, Belmont Greene, River Creek — operate under HOA architectural standards that specify approved shingle colors, materials, and installation details. We handle HOA submission and approval as part of every roofing project, ensuring your replacement meets community design standards without the homeowner managing the back-and-forth. For historic-district properties in Leesburg or Waterford, we work with HARB-equivalent oversight as needed.",
      "Premium roofing in Loudoun County typically runs $15,000 to $40,000+ for a full replacement, depending on size, complexity, and material tier. Architectural shingles from GAF Timberline and Owens Corning Duration are standard; premium tiers (designer shingles, architectural metal accents, copper detailing) add cost but deliver the curb appeal and longevity Loudoun homeowners expect. Free inspections, written estimates, and workmanship warranties in writing.",
    ],
  },

  // ── DECKS ──────────────────────────────────────────────────────────────

  'decks-winchester-va': {
    paragraphs: [
      "Winchester, Virginia's rolling hills and Shenandoah Valley views make outdoor living spaces one of the best investments you can make in your home. From spring evenings watching apple orchard blossoms to summer cookouts with views of the Blue Ridge, a well-built deck transforms your backyard into an extension of your living space. Real Elite Contracting builds custom decks for Winchester homeowners who expect quality craftsmanship that lasts for decades.",
      "Our deck-building expertise spans all of Winchester's diverse neighborhoods — from homes with wooded lots in the Shawnee District and Senseny Road area to newer constructions along Route 7 and the Millwood Avenue corridor. We build decks in pressure-treated lumber, composite materials (Trex, TimberTech, Azek), and hardwoods, matching your vision, budget, and the demands of the Shenandoah Valley climate.",
      "Winchester's four distinct seasons mean your deck materials need to handle everything from summer UV exposure and humidity to winter freeze-thaw cycles. We recommend composite decking for most Winchester homeowners — it resists warping, fading, and moisture damage that traditional wood struggles with over time. Composite decks look better longer and require significantly less maintenance, giving you more time to actually enjoy your outdoor space.",
      "Every deck we build starts with a design consultation to understand how you want to use the space. We handle all Frederick County and City of Winchester permits, ensuring your deck meets local building codes. From simple platforms to multi-level structures with built-in benches, stairs, and pergolas, Real Elite delivers decks that become the centerpiece of your outdoor living.",
    ],
  },

  'decks-frederick-md': {
    paragraphs: [
      "Frederick, Maryland's revitalized neighborhoods and growing suburban communities have created explosive demand for outdoor living spaces. With long summers, beautiful spring weather, and the Carroll Creek corridor driving outdoor culture, more Frederick homeowners are investing in custom decks that extend their entertaining season from April through October. Real Elite Contracting brings premium deck-building expertise to Frederick County.",
      "We build decks for homes across Frederick — from older craftsman and colonial homes near the historic district to newer construction in Ballenger Creek, Urbana, and communities along the I-70 growth corridor. Our team handles all Frederick County permitting, material sourcing, and construction with the precision that Frederick's discerning homeowners expect. Whether you want a simple pressure-treated platform or a multi-level composite deck with lighting and built-in seating, we deliver.",
      "Frederick's moderate-to-humid Mid-Atlantic climate is ideal for composite decking. Materials from Trex, TimberTech, and Azek hold up beautifully against Maryland's summer humidity and spring rainfall, requiring minimal annual maintenance compared to traditional pressure-treated wood. We'll help you choose decking colors and railing styles that complement your home's architecture and add lasting curb appeal.",
      "Real Elite's deck projects include built-in planters, pergolas, benches, privacy screens, and outdoor lighting packages that make your deck usable morning to evening. We're also experienced with ADA-accessible deck designs and ramps for Frederick homeowners with specific accessibility needs.",
    ],
  },

  'decks-leesburg-va': {
    paragraphs: [
      "Leesburg's upscale neighborhoods and estate homes create the perfect backdrop for premium outdoor living spaces. Whether you're overlooking the Potomac watershed from Lansdowne, entertaining in Cascades, or enhancing a historic property on King Street, a custom deck from Real Elite Contracting becomes the cornerstone of your outdoor lifestyle. We build decks that match the quality and character Leesburg homeowners expect.",
      "Leesburg's affluent residential market demands materials and craftsmanship at a higher standard. We specialize in premium composite decking systems — TimberTech PRO, Azek Harvest Collection, and Trex Transcend — that deliver the beauty of hardwood with none of the maintenance headaches. For homes in communities like Lansdowne on the Potomac and Countryside, we design decks that complement existing landscaping and architecture, creating seamless transitions between indoor and outdoor living.",
      "Many Leesburg decks are designed for entertaining — built to accommodate outdoor kitchens, fire pit areas, and multi-zone seating layouts. We plan traffic flow, structural load capacity, and lighting placement from day one so your finished deck functions as beautifully as it looks. Our crews are experienced with Loudoun County building codes and HOA design review processes, handling all approvals and inspections so you don't have to.",
      "For historic homes in the King Street area and surrounding Old Town Leesburg neighborhoods, we work with care to ensure deck additions don't compromise the historic character of the property. Real Elite is the contractor Leesburg homeowners trust for premium deck builds that hold up for 25+ years.",
    ],
  },

  'decks-ashburn-va': {
    paragraphs: [
      "Ashburn, Virginia's young, active families are reshaping what outdoor living means. From summer cookouts in Brambleton to evening gatherings in Broadlands and One Loudoun, the demand for custom decks in Ashburn has never been higher. Real Elite Contracting builds decks that become the social hub of your property — functional, beautiful, and built to Loudoun County code from the ground up.",
      "Ashburn's planned communities offer beautiful settings for outdoor living, but HOA guidelines can make deck additions complicated. Real Elite is experienced with the specific requirements of Ashburn's major communities — Broadlands, Brambleton, Ashburn Farm, Belmont Country Club, and more. We handle all HOA submissions, material approvals, and Loudoun County permits, making the process seamless for you.",
      "We specialize in composite decking systems that look sharp and stay looking sharp in Ashburn's suburban environment. Trex, TimberTech, and Azek products resist the fading, staining, and warping that pressure-treated wood develops within a few years. With kids and pets in the picture, low-maintenance composite is the obvious choice — no annual staining, no splinters, no worries.",
      "Ashburn decks often include multiple functional zones: a dining area near the sliding door, a fire pit corner, a built-in grill station, and a lounge section for unwinding. Real Elite designs each deck with your lifestyle in mind. We take measurements, create a layout, walk you through material options, and provide a fixed-price estimate before work begins.",
    ],
  },

  'decks-hagerstown-md': {
    paragraphs: [
      "Hagerstown's outdoor culture — long summers, mild springs and falls, the Antietam Creek and C&O Canal trails just minutes away — makes deck and outdoor-living spaces one of the smartest investments a Cumberland Valley homeowner can make. From a backyard composite deck overlooking the rolling hills west of the city to a multi-level entertainment space in a Halfway or Robinwood subdivision, we build outdoor spaces that get used through three seasons.",
      "Our deck-building expertise spans every part of the Hagerstown market. For the historic North End and Public Square area, we work with care on properties where the deck addition needs to respect the architectural character of the original home. For newer construction along Robinwood, Fountain Head, and the South End, we deliver modern composite builds in Trex, TimberTech, and Azek that hold up beautifully against the Cumberland Valley climate.",
      "Composite is what we recommend for most Hagerstown homeowners — the humid summers and freeze-thaw winters punish pressure-treated lumber, and the maintenance cycle (sealing, restaining, board replacement) adds up. A composite deck installed correctly looks the same in year 15 as it did in year 1, with annual maintenance measured in hours rather than weekends. We bring real samples on the estimate so you can compare materials before committing.",
      "Washington County deck permits run 2–3 weeks from application to issue, and most decks above 30 inches at any point require a permit. We handle the entire permitting and inspection process, so you don't deal with the paperwork. Pier inspections happen before concrete, framing inspections before decking goes down — all coordinated with the county on your behalf.",
    ],
  },

  'decks-loudoun-county-va': {
    paragraphs: [
      "Loudoun County is where outdoor living has fundamentally changed in the past decade. Premium homes in Lansdowne, Brambleton, One Loudoun, Ashburn Farm, and Belmont Greene — plus the estate properties in the western county — increasingly feature multi-level composite decks with built-in outdoor kitchens, pergolas, integrated lighting, and seamless transitions to landscaped backyards. The \"simple deck\" has been replaced by the outdoor living buildout.",
      "Real Elite Contracting builds premium decks and outdoor living spaces across Loudoun County. We work with all three major composite manufacturers — Trex Transcend, TimberTech AZEK, and TimberTech PRO — and most of our Loudoun projects are in the $25,000 to $75,000+ range, reflecting the level of finish this market expects. We bring real material samples to your estimate, show completed Loudoun projects, and walk you through the design choices that affect long-term value.",
      "HOA approval is part of nearly every Loudoun County deck project. We handle the architectural review submission for Brambleton, Lansdowne, One Loudoun, Cascades, Belmont Greene, and the other master-planned communities — providing the elevations, material specifications, and color samples each HOA requires. Expect 2–4 weeks for HOA review on top of the standard 2–3 week county permit timeline; we coordinate both in parallel.",
      "Loudoun County's pier depth requirement (30 inches minimum), Virginia building code, and the HOA design standards all combine to make Loudoun deck builds more complex than the regional average. Cheap contractors cut corners on footings and the failures show up in 7–10 years as frost heave. We install to spec, document every inspection, and back the work with a written workmanship warranty.",
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
      "Leesburg, Virginia's high-value real estate market rewards thoughtful home improvements. With average home prices well above state and national medians, Leesburg homeowners who invest in quality remodeling see outstanding returns. From historic renovation projects near King Street to luxury kitchen and bathroom upgrades in Lansdowne and Cascades, Real Elite Contracting delivers premium remodeling results that Leesburg's market demands.",
      "Real Elite specializes in high-end remodeling for Leesburg's discerning homeowners. Our kitchen renovations incorporate custom cabinetry, quartz and granite countertops, high-end appliances, and thoughtful layouts that make cooking and entertaining genuinely enjoyable. Primary bathroom transformations — with spa showers, freestanding soaking tubs, and custom tile work — create the retreat-like atmosphere that Leesburg buyers and owners expect.",
      "For Leesburg's historic homes, we approach remodeling with particular care. Many properties in the Old Town Leesburg area are subject to historic preservation guidelines, and our team is experienced navigating Loudoun County's review process. We update homes for modern comfort — insulation, HVAC support, electrical, plumbing — while preserving the architectural details that give these homes their irreplaceable character.",
      "From smaller projects like powder room refreshes and mudroom builds to full home renovations, Real Elite brings the same level of professionalism to every Leesburg remodeling project. We offer detailed written scopes, fixed-price contracts where possible, and dedicated project management throughout construction.",
    ],
  },

  'remodeling-ashburn-va': {
    paragraphs: [
      "Ashburn, Virginia is home to a growing population of tech professionals, federal workers, and young families who want modern, functional homes that match their active lifestyles. As Ashburn's neighborhoods mature and original construction ages, homeowners are increasingly investing in remodeling projects that bring their homes up to contemporary standards. Real Elite Contracting is the contractor Ashburn homeowners trust for smart, well-executed renovations.",
      "The most popular remodeling projects in Ashburn's communities — Broadlands, Brambleton, Ashburn Farm, and One Loudoun — reflect the lifestyle of the community: open-concept main floors, updated kitchens with islands and quartz countertops, spa bathrooms with frameless glass showers, and finished basements for home offices, gyms, and family entertainment. Real Elite has built a strong reputation delivering exactly these types of projects across Ashburn.",
      "Many of Ashburn's homes from the late 1990s and early 2000s feature dated layouts, popcorn ceilings, and finishes that no longer match current expectations. Our team can assess your home's potential and help you prioritize upgrades that deliver the most impact for your investment. From permit application to final punch list, Real Elite manages your project professionally from start to finish.",
      "Ashburn homeowners value efficiency and communication — two things Real Elite prioritizes above all else. We provide detailed project timelines, keep you updated throughout construction, and respect the boundaries of your home and daily schedule. Whether you're planning a quick bathroom refresh before listing or a comprehensive whole-home renovation, get started with a free estimate today.",
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
      "Loudoun County remodeling is its own market segment. The average finished-square-foot expectation, the material quality, the design integration — everything operates a tier above what's typical for the broader region. Brambleton kitchens, Lansdowne primary suite remodels, One Loudoun whole-home renovations, Leesburg historic property restorations — Real Elite Contracting delivers the standard this market demands.",
      "Bathroom remodels in Loudoun County typically run $40,000 to $80,000+ for primary suites with curbless showers, custom tile, frameless glass, double vanities, and the premium fixture selections (Brizo, Hansgrohe, Kohler Artifacts) Loudoun homeowners specify. Kitchens commonly land in the $75,000 to $200,000 range depending on cabinetry tier, layout changes, and appliance package. We bring the right project management discipline to projects at that scale — one named lead, daily updates, transparent line-item pricing.",
      "For Loudoun's historic properties — homes in Old Town Leesburg, restored farmhouses in the western county, properties with historic preservation considerations — we work with care. We match period-appropriate materials and finishes where they matter, integrate modern systems without compromising character, and coordinate with HARB and county historic-district oversight where required.",
      "Loudoun County permit and inspection processes are predictable but slow — typically 3–4 weeks for permits on a substantial remodel, plus structural-engineering review where applicable. We handle every step. HOA submissions for design review in master-planned communities are managed in parallel, so the permit and HOA approval timelines don't stack.",
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
      "Leesburg's upscale residential character demands exterior siding that makes a statement. From stately colonials in Cascades to craftsman-style homes in Lansdowne on the Potomac, the right siding choice elevates your home's curb appeal and market value in one of Northern Virginia's most competitive real estate markets. Real Elite Contracting installs premium siding systems for Leesburg homeowners who refuse to settle for average.",
      "Fiber cement siding — James Hardie and equivalent products — is the material of choice for most Leesburg homeowners who want the look of painted wood without the maintenance. Hardie's ColorPlus Technology provides a factory-applied finish that holds color for 15+ years and comes with a 30-year limited warranty. For homes in HOA communities like Lansdowne and Countryside, we help you navigate design review requirements and select approved colors and profiles.",
      "Leesburg's proximity to the Potomac watershed creates elevated moisture conditions that make quality house wrap and flashing critical to siding performance. Our installations include premium moisture barriers and properly detailed window and door flashing to prevent water infiltration that can lead to mold, rot, and structural damage. We don't cut corners on the details that protect your home's long-term value.",
      "Real Elite also handles partial siding replacements, accent installations, and gable end updates that refresh your home's appearance without a full exterior overhaul. If you're preparing to sell, new siding consistently ranks among the highest-ROI improvements in the Leesburg market.",
    ],
  },

  'siding-ashburn-va': {
    paragraphs: [
      "Ashburn, Virginia's master-planned communities have established high standards for home exteriors — and with good reason. In a market where neighbors, HOAs, and potential buyers have high expectations, quality siding that looks sharp and holds up year after year is non-negotiable. Real Elite Contracting helps Ashburn homeowners refresh, repair, or completely replace their home's siding with materials and craftsmanship that meet Loudoun County's exacting community standards.",
      "Many Ashburn homes from the late 1990s and early 2000s feature original vinyl siding that is fading, chalking, or showing impact damage after 20+ years of service. A fresh siding replacement transforms the look of your home immediately — and modern vinyl siding products perform significantly better than what was installed a generation ago, with better UV resistance, insulated backing options, and warranties that cover the life of the home.",
      "We work within all major Ashburn HOA communities — Broadlands, Brambleton, Ashburn Farm, Belmont Country Club, and others — navigating the approval process and ensuring your siding selection meets community guidelines. Our team helps you choose replacement colors that comply with HOA standards while giving your home a fresh, updated appearance that stands out on the street.",
      "Ashburn homeowners can also choose James Hardie fiber cement for a premium upgrade that adds significant curb appeal and resale value. Hardie siding is particularly popular for accent areas — gable ends, dormers, and entryways — where a texture upgrade makes a dramatic visual impact.",
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
      "Loudoun County siding work mostly happens in two segments: fiber cement upgrades on premium properties — particularly James Hardie — and stone veneer accent work on facades, foundations, and chimney bases. Vinyl is still installed in the lower-tier subdivisions and as repair work, but the premium end of the Loudoun market has clearly moved to fiber cement and natural stone aesthetics over the past decade.",
      "Real Elite Contracting is certified on James Hardie installation and handles fiber cement projects across Loudoun County — from full home replacements in Cascades, Brambleton, and Lansdowne to facade upgrades on estate properties in the western county. Hardie's 30-year ColorPlus warranty plus our workmanship warranty delivers a siding solution that meaningfully outlasts vinyl and substantially improves resale value.",
      "Stone veneer accent work is the other premium siding category in Loudoun. Whether it's a full facade upgrade on a Lansdowne home, a porch base in a Brambleton custom build, or chimney surround work on an Old Town Leesburg property, we install natural stone and high-quality manufactured veneer with the attention to detail this market requires. Proper substrate prep, weep screed, flashing, and weather barrier work — the parts behind the stone that determine whether it lasts 50 years or fails in 10 — are non-negotiable.",
      "HOA approval for siding changes is required in most Loudoun master-planned communities. Color selection, material grade, and installation details all need pre-approval. We handle that submission and coordinate with the HOA architectural review committee on your behalf. For homeowners considering a full siding replacement, we provide written estimates that reflect the real labor cost in the Loudoun market — there's no shortcut to a $40,000+ premium siding job, and we don't pretend otherwise.",
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
      "Leesburg, Virginia bathroom remodels operate at the premium end of the Northern Virginia market. Lansdowne on the Potomac, Cascades, River Creek, and the historic homes in Old Town along King Street all demand the kind of finish quality and design integration that only comes from a contractor used to working in this price range. Real Elite Contracting delivers that standard — curbless walk-in showers, frameless glass, custom tile, premium fixture packages, and the project management to keep a multi-month build on track.",
      "Most Leesburg primary-suite bathroom remodels land in the $40,000–$75,000 range, with high-end builds pushing past $100,000 for layout changes, freestanding soaking tubs, double vanities with custom cabinetry, heated floors, and the fixture selections this market specifies — Brizo, Hansgrohe, Kohler Artifacts, Waterworks. We bring real material samples to the estimate so you see exactly what you're committing to before the demo crew arrives.",
      "Waterproofing is what separates a Leesburg bathroom that holds up for 25 years from one that develops hidden moisture problems by year 8. We install Schluter-Kerdi systems behind every shower and around every tub deck, with proper substrate prep and slope-to-drain. For homes near the Potomac watershed where moisture is already elevated, that detail work isn't optional.",
      "HOA design review is part of nearly every Leesburg bathroom project in the master-planned communities. We submit the scope, material specifications, and any required elevation drawings to the architectural review committee at the same time we pull the Loudoun County permit, so the two timelines run in parallel rather than stacking. Expect 6–10 weeks of active work for a full primary suite, with a named project lead and daily updates throughout.",
    ],
  },

  'bathrooms-ashburn-va': {
    paragraphs: [
      "Ashburn, Virginia's housing stock — Broadlands, Brambleton, Ashburn Farm, One Loudoun, Belmont Greene, Loudoun Valley Estates — is hitting the 20-to-25-year mark on original builds. That's exactly the window when primary bathrooms start looking dated, when fixtures begin failing, and when homeowners look at their bathroom and realize the layout designed for the late-90s no longer matches how they live. Real Elite Contracting handles those primary-suite remodels every week.",
      "Most Ashburn bathroom remodels we build now feature curbless walk-in showers (replacing the original cultured marble surrounds), frameless glass, real tile from floor to ceiling, double vanities with quartz tops, and modernized lighting that actually works for a bathroom. We bring Schluter-Kerdi waterproofing on every shower build — the cheap shortcut on substrate that some contractors take is exactly why mid-2000s Ashburn bathrooms develop moisture problems by year 10.",
      "Typical Ashburn primary suite investment in 2026 runs $30,000–$60,000 depending on layout changes and finish tier. Guest baths and hall baths run $15,000–$30,000. Powder rooms run $7,000–$14,000. We provide detailed written estimates with line items so you can see what's driving the number — there's no shortcut to a properly built bathroom, but there's also no need to over-spec.",
      "HOA architectural review applies to most Ashburn communities and typically only matters for exterior changes — but if your bathroom remodel involves window or skylight changes you'll need the HOA submission. We handle that part of the workflow plus the standard Loudoun County permits and inspections (rough-in plumbing and electrical, final). Most Ashburn primary baths run 4–6 weeks of active work from demo through final walkthrough.",
    ],
  },

  'bathrooms-loudoun-county-va': {
    paragraphs: [
      "Loudoun County bathroom remodels are the highest-AOV bathroom work we do. Estate homes in the western county, premium custom builds in Brambleton and One Loudoun, restored historic properties in Old Town Leesburg, and the master-planned community primary suites that cumulatively define this market — Lansdowne, Cascades, Belmont Greene, River Creek — all set an expectation that doesn't exist most other places in our service area.",
      "Real Elite Contracting builds Loudoun County primary bathrooms in the $50,000–$120,000+ range. Curbless walk-in showers with multiple body sprays, ceiling-mount rain heads, frameless glass enclosures, floor-to-ceiling natural stone or large-format porcelain tile, freestanding soaking tubs from MTI or Victoria + Albert, heated floors with smart thermostats, double vanities with custom cabinetry, premium fixture packages (Brizo Litze, Hansgrohe AXOR, Kohler Artifacts, Waterworks), and lighting designed by a specialist when the project warrants it.",
      "Behind the visible finishes, the work that determines whether a Loudoun bathroom lasts 30 years or fails at 10 is the waterproofing detail. Schluter-Kerdi systems on every shower wall, full mortar bed under the pan, proper slope-to-drain, and substrate that's been correctly prepared. The cheap shortcuts that show up in lower-end builds — green board behind tile, painted-on waterproofing membrane, no curb dam — are not options on our crews.",
      "Typical timeline is 8–12 weeks of active work for a full primary suite remodel at this scale, longer for layout changes that involve relocating plumbing or electrical service. We coordinate Loudoun County permits, HOA architectural review where required (Brambleton, Lansdowne, Cascades, Belmont Greene, River Creek, One Loudoun all have active ARCs), and structural-engineering sign-off where load-bearing walls are involved. One named project lead from estimate through final walkthrough.",
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
      "Leesburg, Virginia kitchen remodels operate at the premium tier of the Northern Virginia market. Lansdowne on the Potomac, Cascades, River Creek, Countryside, and the upscale historic homes in Old Town all set an expectation that the kitchen is the centerpiece of the home — not just functional but a design statement. Real Elite Contracting builds Leesburg kitchens at the level this market demands.",
      "Typical Leesburg kitchen investment in 2026 runs $80,000–$200,000+, with most full primary kitchens landing $95,000–$140,000. That includes custom cabinetry from regional shops (not big-box semi-custom), quartz or natural stone counters with waterfall edges where the design calls for it, premium appliance packages (Wolf, Sub-Zero, Miele, Thermador), layout changes including island additions or relocation, hardwood floor refinishing or replacement to match the new kitchen scope, and lighting design typically involving a specialist.",
      "Layout work — opening kitchens to family rooms, removing load-bearing walls, repositioning the island, expanding into a former dining room — is the norm rather than the exception in Leesburg builds. We engage structural engineers from project start, coordinate Loudoun County permits and inspections, and handle HOA architectural review submissions in parallel so the two approval timelines run together rather than stacking.",
      "Plan on 10–16 weeks of active work for a full Leesburg kitchen at this tier, with custom cabinetry lead times often driving the schedule. We give you a written timeline before demo, a named project lead, and daily updates throughout. Most Leesburg kitchen remodels also involve adjacent dining room and family room scope — refinished floors, paint, trim — which we coordinate as part of one project rather than chaining contractors.",
    ],
  },

  'kitchens-ashburn-va': {
    paragraphs: [
      "Ashburn, Virginia kitchens are the most popular interior remodel in this market. Broadlands, Brambleton, Ashburn Farm, One Loudoun, Belmont Country Club, Loudoun Valley Estates — the original 1990s and 2000s builds are now hitting the 20-to-25-year window when their kitchens look dated, the appliances start failing, and the closed-off layout no longer matches how Ashburn families actually live. Real Elite Contracting handles these remodels every week.",
      "Most Ashburn kitchen remodels we build feature opening the kitchen to the family room (removing a load-bearing wall in most cases), adding or relocating the island, replacing all cabinetry with semi-custom or custom (white painted shaker is still the dominant request, with darker islands as the second wave), quartz counters, full appliance replacement including induction cooktops on many builds, refinished or replaced hardwood floors, and modernized lighting design.",
      "Typical Ashburn kitchen investment runs $50,000–$110,000 depending on cabinet tier, layout scope, and appliance package. Full Wolf / Sub-Zero packages push the number higher; standard premium brands (KitchenAid, Bosch, Café) land in the more typical range. We bring detailed line-item estimates so the budget allocation is visible from day one — cabinets, counters, appliances, flooring, electrical, plumbing, finishes — and there's no ambiguity about where the dollars go.",
      "HOA architectural review usually doesn't apply to interior kitchen work in Ashburn unless you're changing windows or exterior elements. Loudoun County permits and inspections (electrical, plumbing, sometimes structural) are part of every kitchen project. Plan on 8–12 weeks of active work for a full Ashburn kitchen, with a named project lead and daily updates throughout.",
    ],
  },

  'kitchens-loudoun-county-va': {
    paragraphs: [
      "Loudoun County kitchen remodels are the highest-tier kitchen work in our service area. Estate properties in the western county, custom builds in Brambleton and One Loudoun, restored historic homes in Old Town Leesburg, the master-planned community primary kitchens in Lansdowne / Cascades / Belmont Greene / River Creek — all operate at a finish level and project complexity that demands a contractor used to building at this scale.",
      "Real Elite Contracting builds Loudoun County kitchens in the $100,000–$250,000+ range. That's custom cabinetry from regional shops with painted or stained finishes specified down to the door style and inset detail, natural stone or premium quartz counters with waterfall edges, premium appliance packages (Wolf dual-fuel ranges or 60-inch induction, Sub-Zero refrigeration columns and integrated drawer units, Miele dishwashers, full plumbing fixture packages from Brizo or Waterworks), layout changes typically involving structural work and load-bearing wall removal, and lighting design by a specialist.",
      "The project management discipline that's table-stakes at this scale isn't optional. One named project lead from the first walkthrough through the final punch list. Daily updates. Coordination of structural engineer, electrical, plumbing, HVAC, custom cabinetry shop, stone fabricator, appliance delivery, and the half-dozen other trades that touch a project this complex. Written timeline before demo, transparent line-item pricing throughout, and the warranty work in writing.",
      "Plan on 14–20 weeks of active work for a Loudoun County kitchen at this tier. Custom cabinet lead times (often 10–14 weeks alone) and stone fabrication scheduling typically drive the overall schedule. HOA architectural review applies in the master-planned communities and Loudoun County permits cover the rest. Most projects also involve adjacent dining, family, and butler's pantry scope, which we coordinate as one project rather than handing off to a second contractor.",
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
      "Middleburg primary baths are some of the most architecturally significant residential bathroom projects in the Mid-Atlantic. The combination of historic stone-and-timber homes in the village proper, the equestrian estates along the surrounding hunt country roads, and the homeowner expectation of a primary suite that fits inside a genuine historic envelope means every Middleburg primary-bath project is a careful conversation between period sensitivity and modern spa specification.",
      "Real Elite Contracting renovates Middleburg primary baths with the discretion and craft this market expects. Featured projects include period-respectful tile patterns (marble basketweave, hex mosaic, honed limestone), traditional vanity profiles in inset cabinetry painted to match historic palettes, polished nickel or unlacquered brass fittings, clawfoot or freestanding tubs, and lighting that disappears into the architecture rather than competing with it. Typical scope runs $80,000–$180,000+ depending on the level of structural and plumbing work the historic floor plan requires.",
      "For larger equestrian estates outside the village, the brief widens to a primary suite that often includes a sitting area, a fireplace, dual closets, and a primary bath that functions as a private spa. We work with the designers and architects this market relies on and execute to whatever specification the design calls for.",
      "Loudoun County permits, plumbing, electrical, and final inspections are handled by us. For homes inside the Middleburg historic district, any change affecting building exteriors requires Town review; we carry the paperwork. One named project lead from estimate through final walkthrough, daily progress photos, clean job site every evening, and a written workmanship warranty.",
    ],
  },

  // ── KITCHENS · MIDDLEBURG, VA ────────────────────────────────────────────
  'kitchens-middleburg-va': {
    paragraphs: [
      "Middleburg kitchens are some of the most architecturally distinctive residential kitchens in the country. The brief here is restraint, period sensitivity, and serious craft. A typical Middleburg primary kitchen is a $150,000–$450,000+ undertaking executed in close collaboration with a designer who specializes in hunt-country and historic-home work, a tier-one cabinet shop that can build to period profiles, and a stone fabricator who can work in honed soapstone, leathered granite, or marble that fits inside a stone-and-timber envelope.",
      "Real Elite Contracting builds Middleburg kitchens with that collaboration in mind. Featured scope includes furniture-style inset cabinetry, hand-cast metal hardware, full-slab natural-stone countertops, professional-spec ranges that fit the architecture (La Cornue, Lacanche), period-appropriate plumbing fittings, and a scullery or butler's pantry that handles the catering side of the entertaining the home is built for.",
      "For homes inside the Middleburg historic district, any change affecting building exteriors requires Town review; we carry the paperwork. For the surrounding equestrian estates, the design brief is sometimes more contemporary but the craft standard is the same. We bring a structural engineer in early when bearing-wall or ceiling-height changes are on the table.",
      "Communication runs through one named project lead from estimate through final punch list. Daily progress photos, clean job site every evening, and a written workmanship warranty. We work discreetly and respect the rest of the home as the historic asset it is.",
    ],
  },

  // ── BASEMENTS · MIDDLEBURG, VA ───────────────────────────────────────────
  'basements-middleburg-va': {
    paragraphs: [
      "Middleburg lower levels are some of the most distinctive finished-basement projects in our service area. The brief routinely includes a wine cellar with dedicated cooling and traditional racking, a tasting room, a gun room or trophy room for hunt-country homes, a guest suite with full bath, and sometimes a media room or family lounge. Done with restraint, the lower level reads as a genuine extension of the historic home above.",
      "Real Elite Contracting builds Middleburg lower levels with proper moisture and vapor control as the technical foundation — perimeter inspection, sump pump verification, dimple-mat or insulated subfloor where required. From there: code-compliant framing, egress where bedrooms are planned, full electrical, HVAC extension, surround pre-wire, and the millwork and stone that turn the space into a true room. For wine cellars, dedicated cooling and proper insulation are non-negotiable.",
      "Typical Middleburg basement-finishing scope in 2026 runs $120,000–$350,000+ depending on square footage, feature mix, and the level of millwork and stone in the build. Wine cellars with traditional racking and dedicated cooling add meaningfully to the budget but are typically the centerpiece of the lower level.",
      "Loudoun County permits and inspections are required for framing, electrical, plumbing, mechanical, and final. We coordinate the inspector sequence so trades don't lose days waiting on each other. One named project lead, daily updates, clean job site, written workmanship warranty.",
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════════
     WHOLE-HOME REMODELING · LUXURY NORTHERN VIRGINIA

     These nine markets already declare `remodeling` in their CITY_DATA
     marketEmphasis, and their city-overview copy promises whole-home
     renovation — but no remodeling combo page existed for any of them, so the
     highest-ticket service in the wealthiest markets had nothing to rank.
     The differentiator in each entry is the local review authority, because
     that is the part a homeowner cannot look up in a national cost guide and
     the part that actually decides a schedule.
     ═════════════════════════════════════════════════════════════════════════ */

  // ── REMODELING · MCLEAN, VA ──────────────────────────────────────────────
  'remodeling-mclean-va': {
    paragraphs: [
      "McLean's housing stock is the reason whole-home remodeling works so well here. Streets like Langley Forest, Salona Village, Chesterbrook and Kent Gardens are full of substantial mid-century and later-20th-century homes on generous, mature lots — properties with excellent bones, excellent locations, and interiors specified for how families lived forty years ago. The land value in McLean is high enough that the real question is rarely whether to invest; it is whether to renovate comprehensively or tear down. For a well-built home on a lot you love, a whole-home renovation is very often the better answer.",
      "Real Elite Contracting runs McLean whole-home programs as a single coordinated project rather than a series of disconnected trades. That typically means opening up the main level for the way people actually entertain, a kitchen designed around real hosting rather than weeknight dinners, a primary suite rebuilt as a private wing with its own bath and closet program, updated systems throughout — electrical capacity, HVAC zoning, plumbing — and a finished lower level that carries the media, guest and fitness functions. Where a home is being taken back to studs in part, we treat insulation and air sealing as part of the scope, not an upsell.",
      "Whole-home renovation in McLean generally runs $300,000 to $1,500,000 and up, depending on square footage, how much of the envelope opens up, and the finish and millwork level. A phased program — main level and kitchen first, primary suite and lower level in a second stage — is a legitimate way to run a large scope without living in a construction site for a year, and we will scope it that way when it suits the household.",
      "McLean is unincorporated Fairfax County, so permitting and inspections run through Fairfax County for building, electrical, plumbing and mechanical, with final inspection at the end. We sequence the inspector calendar so trades are not idling between stages. One named project lead, daily updates, a clean and discreet job site, and a written workmanship warranty.",
    ],
  },

  // ── REMODELING · ALEXANDRIA, VA ──────────────────────────────────────────
  'remodeling-alexandria-va': {
    paragraphs: [
      "Alexandria whole-home renovation is a genuinely different discipline from suburban remodeling, and the difference is the building stock. Old Town holds one of the densest collections of 18th- and 19th-century homes in the country; Rosemont, North Ridge, Beverley Hills and Del Ray add premium early- and mid-20th-century houses. These homes were built before central air, before modern electrical loads, and often before insulation was a consideration at all. A whole-home program here is as much about what is behind the plaster as what replaces it.",
      "Real Elite Contracting approaches Alexandria renovations by getting the invisible work right first — knob-and-tube and undersized panels replaced, supply and waste lines brought current, HVAC designed for a house that was never ducted for it, insulation and air sealing added where the assembly allows without trapping moisture in old masonry. Then the visible work: kitchens that read period-appropriate but function to current spec, primary baths worked into floor plans that never contemplated them, and finished lower levels handled carefully in a river city where water table and drainage genuinely matter.",
      "Whole-home renovation in Alexandria typically runs $250,000 to $900,000 and up. Historic properties carry real cost variance, because what is found once a wall opens — framing that has settled, previous unpermitted work, masonry needing repointing — is not fully knowable at the estimate. We say so up front and build contingency into the conversation rather than into a change order six weeks in.",
      "Alexandria is an independent city, so permits run through the City of Alexandria rather than Fairfax County — a distinction that catches out contractors who work mainly in the county. Exterior work in the Old and Historic Alexandria District, and in the Parker-Gray district, also requires Board of Architectural Review approval before a permit issues, and that review runs on its own calendar. We build the BAR timeline into the schedule from the start instead of discovering it.",
    ],
  },

  // ── REMODELING · VIENNA, VA ──────────────────────────────────────────────
  'remodeling-vienna-va': {
    paragraphs: [
      "Vienna is one of the strongest whole-home renovation markets in Fairfax County, and the reason is the shape of the housing stock. Vienna Woods, Country Club Manor and the streets off Maple Avenue are full of well-built mid-century ramblers, split-levels and colonials on flat, generous lots — homes that are structurally sound and beautifully located but chopped into small rooms with low ceilings and closed-off kitchens. That is close to the ideal candidate for comprehensive renovation, because the money goes into layout and systems rather than into fixing a bad property.",
      "Real Elite Contracting runs Vienna whole-home projects around opening the main level, replacing the kitchen with something designed for how the household actually cooks and gathers, rebuilding the primary suite with a proper bath and closet, and bringing electrical, HVAC and plumbing to current spec across the house. On split-levels and ramblers, a second-story addition or a rear expansion is often the move that unlocks the whole plan — and because we do that structural work ourselves, the addition and the renovation are one project rather than two contractors blaming each other.",
      "Whole-home renovation in Vienna generally runs $250,000 to $800,000 and up, depending on square footage, whether the footprint changes, and finish level. Adding square footage moves the number more than any finish decision, so we price the structural question first and let the household decide with real numbers rather than after the design is already committed.",
      "One thing worth knowing: the Town of Vienna runs its own permitting and inspections, separate from Fairfax County, for properties inside town limits. Addresses with a Vienna mailing address that sit outside the town line go through Fairfax County instead. Getting that wrong costs weeks. We confirm which authority governs your parcel before the first drawing is submitted, then sequence inspections so trades are not waiting on each other.",
    ],
  },

  // ── REMODELING · GREAT FALLS, VA ─────────────────────────────────────────
  'remodeling-great-falls-va': {
    paragraphs: [
      "Great Falls whole-home projects are the most ambitious residential renovations in our service area. Properties along Georgetown Pike, Riverbend, Hickory Hill and the Falls Estates area sit on multi-acre parcels with real privacy, and the homes on them are large, architecturally distinct, and worth renovating comprehensively rather than incrementally. The typical Great Falls brief is not a kitchen — it is a primary wing, an entertaining-scale kitchen and butler's pantry, a lower level carrying media, wine, fitness and guest functions, and systems capable of running all of it.",
      "Real Elite Contracting scopes Great Falls programs around the whole envelope: structural changes where the plan demands them, electrical service sized for current loads rather than 1980s ones, multi-zone HVAC that actually conditions a house of that footprint evenly, and insulation and air sealing brought current while walls are open. Finish work is where these homes are judged — millwork, stone, tile and cabinetry are specified and installed to a standard that reads correctly in this market, and we would rather extend a schedule than hand over trim that does not.",
      "Whole-home renovation in Great Falls typically runs $400,000 to $2,000,000 and up. The spread is wide because the scope genuinely is: a comprehensive interior renovation and a program that adds a wing are different projects with the same name.",
      "Two Great Falls specifics shape schedules more than homeowners expect. Much of Great Falls is on well and septic rather than public water and sewer, and septic drainfield capacity can govern how many bedrooms a renovation is permitted to create — which means a primary-suite plan has to be checked against the health department, not just the building code. And Georgetown Pike is a designated Virginia Byway, so site access, staging and any frontage work carry extra constraints. Fairfax County permits and inspections apply throughout; we plan around all of it before demolition, not during.",
    ],
  },

  // ── REMODELING · RESTON, VA ──────────────────────────────────────────────
  'remodeling-reston-va': {
    paragraphs: [
      "Reston is one of the largest premium renovation pipelines in Fairfax County, and its housing stock is unlike anywhere else in the region. The original Simon-era villages around Lake Anne and Lake Audubon, plus Hunters Woods, North Point and South Lakes, produced homes that were architecturally deliberate on day one — open plans, dramatic glazing, strong relationships to the wooded sites around them. Fifty years on, those houses deserve interiors and systems that live up to the original ambition, and they reward renovation that respects the architecture instead of flattening it.",
      "Real Elite Contracting renovates Reston homes with the original design intent intact: keeping and improving the light and the sightlines rather than closing them in, replacing kitchens and primary baths to current spec, and upgrading the systems these houses most often need — electrical capacity, HVAC that copes with large glazed areas, insulation and air sealing at the envelope. Where a floor plan genuinely does not work anymore, we make structural changes deliberately and in keeping with the building rather than in spite of it.",
      "Whole-home renovation in Reston generally runs $200,000 to $650,000 and up, depending on square footage, how much of the envelope and glazing is addressed, and finish level. Homes with extensive original glazing and cladding can carry more envelope work than a comparable conventional house, which is worth knowing before the budget is set.",
      "The Reston specific that catches contractors out: most Reston property is subject to Reston Association covenants, and exterior alterations require Design Review Board approval in addition to a Fairfax County permit. The DRB meets on its own schedule and the approval is not a formality. We build that review into the program from the first conversation, so the county permit and the DRB approval land in the right order rather than one waiting months on the other.",
    ],
  },

  // ── REMODELING · BURKE, VA ───────────────────────────────────────────────
  'remodeling-burke-va': {
    paragraphs: [
      "Burke is one of the most consistent whole-home renovation markets in Fairfax County. Burke Centre, Lake Braddock, Longwood Knolls and Kings Park West are established neighborhoods of substantial colonials and split-levels on generous lots, bought by families who tend to stay — and that long ownership horizon is exactly what makes comprehensive renovation make sense here. The work is not being done to flip; it is being done because the household intends to live in the result for another fifteen years.",
      "Real Elite Contracting runs Burke whole-home projects around the changes that actually alter daily life: opening the kitchen to the family room, rebuilding the primary suite with a bath and closet that work, finishing the lower level for the functions that have outgrown the main floor, and bringing electrical, HVAC and plumbing current across the house while the walls are open. On the split-levels common in Burke, resolving the level changes and circulation is often what unlocks the whole plan.",
      "Whole-home renovation in Burke typically runs $150,000 to $450,000 and up, depending on square footage, whether the footprint changes, and finish level. Burke rewards well-specified, beautifully executed work rather than the most expensive possible specification, and we scope it that way.",
      "Much of Burke sits inside the Burke Centre Conservancy or a comparable association, and exterior changes generally require architectural review in addition to Fairfax County permits and inspections. We confirm which association governs your property and get that approval moving in parallel with the county submission, so the two do not run end to end. One named project lead, daily updates, clean job site, written workmanship warranty.",
    ],
  },

  // ── REMODELING · FAIRFAX STATION, VA ─────────────────────────────────────
  'remodeling-fairfax-station-va': {
    paragraphs: [
      "Fairfax Station projects skew larger and more architecturally ambitious than typical Fairfax County work, and the lots are why. One-acre and multi-acre parcels along the Burke Lake Road corridor, South Run, Hampton Forest and the Pohick and Hooes Road areas carry substantial custom homes — many built in the 1980s and 1990s to a good standard, now due for interiors and systems that match the quality of the shell and the setting.",
      "Real Elite Contracting scopes Fairfax Station whole-home programs around full primary-suite expansions, kitchens designed for catering and entertaining rather than weeknight cooking, lower levels built out with guest suites, gyms and media rooms, and the systems work that a house of that size genuinely needs — electrical capacity, properly zoned HVAC, and insulation and air sealing addressed while assemblies are open. Where the plan calls for added square footage, we do the structural work ourselves so the addition and the renovation are one coordinated project.",
      "Whole-home renovation in Fairfax Station generally runs $250,000 to $800,000 and up, depending on square footage, whether the footprint changes, and the finish and millwork level.",
      "Two local factors shape scope here. Parts of Fairfax Station are on well and septic rather than public utilities, and septic capacity can constrain how many bedrooms a renovation may add — a question worth answering before a primary-suite plan is drawn. Portions of the area also drain toward the Occoquan Reservoir, which brings additional stormwater and septic requirements. Fairfax County permits and inspections apply throughout, and we sequence them so trades are not idle between stages.",
    ],
  },

  // ── REMODELING · CLIFTON, VA ─────────────────────────────────────────────
  'remodeling-clifton-va': {
    paragraphs: [
      "Clifton is two distinct renovation markets sharing a name. Inside Historic Clifton Village are small, genuinely old homes on tight lots in a designated historic area; outside it, along Compton Road, Yates Ford Road and through Bull Run Estates and Clifton Forest, are large custom houses on multi-acre parcels. A whole-home program means something different in each, and the first useful thing a contractor can tell you is which one your property is.",
      "Real Elite Contracting handles both. In the village, the work is period-sensitive: correcting decades of accumulated alterations, updating systems inside old framing without erasing what makes the house worth owning, and working within the historic district's expectations for anything visible from the street. On the estate properties, the brief is closer to Great Falls — entertaining-scale kitchens, primary wings, lower levels with real program, and mechanical systems sized for the footprint. Both get the same structural and systems discipline.",
      "Whole-home renovation in Clifton generally runs $250,000 to $900,000 and up, with historic village properties carrying wider variance because what is found behind old finishes is not fully knowable at estimate.",
      "The constraint that governs Clifton more than any other is water. Much of the area drains into the Occoquan Reservoir, a drinking-water source, which brings stricter septic, drainfield and stormwater requirements than most of Fairfax County — and those requirements can directly limit how many bedrooms a renovation is allowed to add. Properties in the historic village carry design review on top. We establish which rules apply to your parcel before design, because finding out afterwards is what turns a schedule into a rework.",
    ],
  },

  // ── REMODELING · MIDDLEBURG, VA ──────────────────────────────────────────
  'remodeling-middleburg-va': {
    paragraphs: [
      "Middleburg whole-home renovation is the most architecturally significant work in our service area. The village's stone and stucco Main Street properties and the surrounding hunt-country estates along Foxcroft Road, Atoka Road and the Goose Creek area are genuinely historic buildings, often with dependencies — guest houses, barns, spring houses, staff quarters — that form part of the property rather than sitting beside it. The brief here is restraint. The goal is a house that lives to current standards and does not announce that it was renovated.",
      "Real Elite Contracting approaches Middleburg programs by treating the original fabric as the thing being protected: stone and masonry repointed with appropriate mortar rather than modern mixes that trap moisture and spall the stone, systems threaded through historic framing with minimal intervention, and insulation strategies chosen for what an old assembly can tolerate. Then the current-spec work — kitchens designed around catering and entertaining, primary suites built into envelopes that never had them, lower levels carrying wine, tasting and guest functions. Millwork and stone are specified to read as though they were always there.",
      "Whole-home renovation in Middleburg typically runs $350,000 to $1,500,000 and up. Estate properties with multiple structures are effectively several projects under one program, and we scope and schedule them that way rather than pretending otherwise.",
      "Middleburg permits through Loudoun County, and properties in the town's historic district carry design review for exterior work on top of the county process. Estate properties frequently sit on well and septic, so drainfield capacity is a live question for any plan that adds bedrooms. We confirm all three — county, historic review, health department — before design is committed. One named project lead, daily updates, a discreet and clean job site, and a written workmanship warranty.",
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════════
     LOUDOUN COUNTY DEPTH — Sterling, Purcellville, Brambleton, South Riding,
     Lansdowne, Aldie.

     Loudoun is the most contested remodeling market we serve, and every
     competitor bidding it lists the same towns. The differentiator written
     into these pages is the one thing their pages leave out: most of these
     addresses sit under a mandatory HOA architectural review IN ADDITION to
     the Loudoun County permit, and that review — not the county — usually
     sets the start date. A homeowner cannot get that from a national cost
     guide, and it is the single most useful thing to tell them first.
     ═════════════════════════════════════════════════════════════════════════ */

  // ── REMODELING · STERLING, VA ────────────────────────────────────────────
  'remodeling-sterling-va': {
    paragraphs: [
      "Sterling is the most competitive remodeling market in Loudoun County, and its housing stock is the reason whole-home renovation works so well here. Sugarland Run, Countryside, Sterling Park and the Cascades neighborhoods are full of solid colonials, split-levels and townhomes built between the 1970s and the 1990s — structurally sound, well sited on established lots, and laid out for a generation that wanted separate rooms for everything. Opening those plans up is usually the single change that transforms how the house lives.",
      "Real Elite Contracting runs Sterling whole-home projects as one coordinated program rather than a string of disconnected trades. That typically means taking down the wall between kitchen and family room, rebuilding the kitchen for how the household actually cooks and gathers, reworking the primary suite so the bath and closet finally function, finishing the lower level, and bringing electrical capacity, HVAC and plumbing to current spec while the walls are open. On homes of this vintage we treat insulation and air sealing as part of the scope, not an upsell.",
      "Whole-home renovation in Sterling generally runs $150,000 to $500,000 and up, depending on square footage, whether the footprint changes, and finish level. Adding square footage moves the number more than any finish decision, so we price the structural question first and let you decide with real numbers rather than after the design is committed.",
      "Sterling permits through Loudoun County for building, electrical, plumbing and mechanical, with a final inspection at the end. Many Sterling neighborhoods — Countryside and Cascades among them — also carry an HOA architectural review for anything that changes the exterior, and that approval runs on its own calendar. We confirm which association governs your property and get that moving in parallel with the county submission, so the two do not run end to end.",
    ],
  },

  // ── KITCHENS · STERLING, VA ──────────────────────────────────────────────
  'kitchens-sterling-va': {
    paragraphs: [
      "The typical Sterling kitchen was built as a closed room with a doorway to the family room, a soffit over the wall cabinets, and a window over the sink — a perfectly good 1985 kitchen. Almost every Sterling kitchen project we scope starts with the same question: does the wall between the kitchen and the family room come down. In most of these floor plans it can, and when it does the whole main level starts working differently.",
      "Real Elite Contracting handles Sterling kitchens end to end — structural assessment and beam work where a wall is load-bearing, soffit removal, full-height cabinetry, quartz or granite surfaces, tile, updated electrical for current appliance loads, and the plumbing and venting changes an island or a relocated range actually requires. We do the framing and structural work ourselves, so the wall coming out and the kitchen going in are one project rather than two contractors pointing at each other.",
      "A full Sterling kitchen renovation generally runs $45,000 to $110,000 and up, depending on cabinetry level, surfaces, appliance package, and whether walls or plumbing move. Removing a load-bearing wall adds engineering and beam cost that a cosmetic refresh does not carry — worth knowing before the budget is set.",
      "Loudoun County permits and inspections cover the electrical, plumbing and mechanical work, plus framing when a wall comes out. Interior kitchen work does not usually trigger HOA architectural review, but we confirm your association's rules before demolition rather than assuming — several Sterling communities review anything that touches windows or exterior venting.",
    ],
  },

  // ── BATHROOMS · STERLING, VA ─────────────────────────────────────────────
  'bathrooms-sterling-va': {
    paragraphs: [
      "Sterling primary bathrooms are usually the last original room in the house. The pattern across Sugarland Run, Countryside and Sterling Park is consistent: a builder-grade primary bath with a garden tub nobody has filled in fifteen years, a separate cramped shower, a low double vanity, and a toilet in the same open space. Reclaiming the tub footprint for a real walk-in shower is the change that most often makes the room feel like it belongs to a different house.",
      "Real Elite Contracting rebuilds Sterling baths from the waterproofing out. That means a properly detailed shower assembly — correct slope to drain, bonded waterproofing membrane, and curbless entry where the joist structure allows it — before any tile is set. From there: relocated plumbing where the layout demands it, updated electrical and dedicated ventilation sized for the room, heated floors where wanted, and tile and glass installed to a standard that still looks right in ten years.",
      "A full Sterling primary bath renovation generally runs $28,000 to $65,000 and up, depending on size, whether fixtures move, and the tile and glass specification. Secondary and hall baths typically run less. Moving drains is what separates the ends of that range, so we establish early whether your joist direction and stack location make a relocation straightforward or expensive.",
      "Loudoun County permits and inspections apply to the plumbing, electrical and mechanical work, with rough-in and final inspections. We sequence the inspector calendar so trades are not idling between stages — a bathroom is a small room with a lot of sequence in it, and that is where schedules usually slip.",
    ],
  },

  // ── REMODELING · PURCELLVILLE, VA ────────────────────────────────────────
  'remodeling-purcellville-va': {
    paragraphs: [
      "Purcellville renovation covers two quite different kinds of house, and knowing which one you have is the first useful thing a contractor can tell you. In and around the historic downtown are genuinely old properties — plaster, settled framing, systems added in layers over decades. Out toward Hamilton, Round Hill and the Blue Ridge are newer custom homes on acreage, well built and now due for interiors that match the quality of the shell and the setting.",
      "Real Elite Contracting handles both. In older Purcellville homes the invisible work comes first: undersized panels and legacy wiring replaced, supply and waste lines brought current, HVAC designed for a house that was never ducted for it, and insulation and air sealing added where the assembly can tolerate it without trapping moisture. In the newer homes on acreage the brief is closer to a luxury program — entertaining-scale kitchens, primary wings, lower levels with real function, and mechanical systems sized for the footprint.",
      "Whole-home renovation in Purcellville generally runs $200,000 to $700,000 and up. Older properties carry wider variance, because what is found once a wall opens — settled framing, previous unpermitted work, masonry needing repointing — is not fully knowable at the estimate. We say so up front and build contingency into the conversation rather than into a change order six weeks in.",
      "Purcellville permits through the Town of Purcellville for properties inside town limits and through Loudoun County for those outside — a distinction that catches out contractors who only work the eastern end of the county, and one that costs weeks when it is got wrong. Work in the historic district carries design review on top. Properties on acreage are frequently on well and septic, where drainfield capacity can cap how many bedrooms a renovation may add. We confirm all of it before design is committed.",
    ],
  },

  // ── KITCHENS · PURCELLVILLE, VA ──────────────────────────────────────────
  'kitchens-purcellville-va': {
    paragraphs: [
      "A Purcellville kitchen has to do two things at once: work to current standards and look like it belongs in western Loudoun. The county's most successful kitchens here are not the ones that import a Tysons showroom aesthetic wholesale — they are the ones that use honest materials, real wood, stone that reads as stone, and cabinetry proportioned to the room rather than to a catalog.",
      "Real Elite Contracting builds Purcellville kitchens with the structural and mechanical work handled properly underneath the finishes: beam work where a wall opens, electrical sized for current appliance loads, plumbing and venting reworked for an island or relocated range, and — in older houses — floor framing assessed before heavy stone goes down on a span that was never designed for it. Then the visible work: full-height cabinetry, stone surfaces, tile, and the millwork details that make a kitchen read as built rather than installed.",
      "A full Purcellville kitchen renovation generally runs $50,000 to $130,000 and up, depending on cabinetry level, surfaces, appliance package, and how much structure moves. Kitchens in older downtown properties trend toward the upper end for the same reason their whole-home renovations do — what is behind the plaster is not fully knowable until it is open.",
      "Permits run through the Town of Purcellville inside town limits and Loudoun County outside them, covering electrical, plumbing, mechanical and any framing changes. We confirm which authority governs your parcel before the first drawing is submitted.",
    ],
  },

  // ── BATHROOMS · PURCELLVILLE, VA ─────────────────────────────────────────
  'bathrooms-purcellville-va': {
    paragraphs: [
      "Bathrooms are the hardest room to add to an old Purcellville house and the most rewarding to get right. Historic properties in and around downtown were not built with primary suites, so a primary bath usually has to be worked into a floor plan that never contemplated one — borrowing from a bedroom, a hall, or an attic space, with the framing and stack routing that implies. Newer homes out toward Round Hill and Hamilton have the space but the builder-grade fixtures.",
      "Real Elite Contracting builds Purcellville baths waterproofing-first: correct slope to drain, bonded membrane, and curbless entry where the joist structure allows. In older homes we handle the parts that make or break the job — routing new waste lines through framing that was never planned for them, and assessing whether a floor can carry a stone-set shower or a freestanding tub before it is specified. Ventilation is sized for the room and ducted to the outside, which is exactly the corner most often cut in an old house.",
      "A full Purcellville primary bath renovation generally runs $30,000 to $75,000 and up, with older properties trending higher because of the routing and structural work behind the finishes. Secondary baths typically run less.",
      "Permits go through the Town of Purcellville inside town limits or Loudoun County outside, covering plumbing, electrical and mechanical, with rough-in and final inspections. Historic-district properties carry design review for anything that changes the exterior — including a new vent or window. We establish that before demolition.",
    ],
  },

  // ── REMODELING · BRAMBLETON, VA ──────────────────────────────────────────
  'remodeling-brambleton-va': {
    paragraphs: [
      "Brambleton is hitting the age where whole-home renovation starts to make sense. The community's earlier phases are now around twenty years old, which is exactly when original builder-grade kitchens, primary baths and unfinished lower levels stop being adequate for households that have grown into the house. The homes themselves are well built and well located — the renovation money goes into layout, finish and function rather than into fixing a bad property.",
      "Real Elite Contracting runs Brambleton whole-home programs around the changes that actually alter daily life: opening and rebuilding the kitchen, converting the lower level into real living space with a full bath and guest suite, rebuilding the primary suite to a current standard, and refreshing the secondary baths in the same pass so the household is not living through a second project a year later. Electrical, HVAC and plumbing are brought current while the walls are open.",
      "Whole-home renovation in Brambleton generally runs $180,000 to $550,000 and up, depending on square footage, how much of the lower level is built out, and finish level.",
      "Brambleton permits through Loudoun County for building, electrical, plumbing and mechanical. Just as importantly, the Brambleton Community Association carries architectural review for exterior alterations — decks, additions, windows, siding and roofing color among them — and that approval runs on its own calendar, not the county's. We build the association review into the program from the first conversation so the two approvals land in the right order.",
    ],
  },

  // ── KITCHENS · BRAMBLETON, VA ────────────────────────────────────────────
  'kitchens-brambleton-va': {
    paragraphs: [
      "Brambleton kitchens are a specific renovation problem: the layout is usually fine. These are 2000s-and-newer homes with open plans and islands already in place — what has aged is the specification. Builder-grade cabinetry with visible wear at the hinges, laminate or entry-level granite, an appliance package chosen to hit a price point, and a lighting plan that was never really a plan. The work is less about moving walls and more about replacing everything the builder value-engineered.",
      "Real Elite Contracting rebuilds Brambleton kitchens to the standard the community expects: full-height cabinetry with real drawer hardware, quartz or natural stone, a proper tile installation, lighting designed in layers rather than four recessed cans, and electrical brought up to handle the appliances people actually buy now. Where the island is undersized or badly placed — a common builder compromise — we will move it, which means plumbing and electrical routing rather than a swap in place.",
      "A full Brambleton kitchen renovation generally runs $50,000 to $120,000 and up, depending on cabinetry level, surfaces and appliance package. Because the layout usually stays, the spread here is driven more by specification than by structure.",
      "Loudoun County permits cover the electrical, plumbing and mechanical work. Interior kitchen work does not normally trigger Brambleton Community Association review, but anything that changes an exterior wall — a new vent, a window, a door — does. We check before demolition rather than after.",
    ],
  },

  // ── BATHROOMS · BRAMBLETON, VA ───────────────────────────────────────────
  'bathrooms-brambleton-va': {
    paragraphs: [
      "The Brambleton primary bath follows the builder pattern almost exactly: a large garden tub under a window, a small separate shower with a builder door, a long low vanity, and a lot of square footage that is not doing much. Twenty years in, the tub has become storage. Converting that footprint into a genuine walk-in shower — with a bench, proper niches, and a linear drain — is the single change that most often makes the room worth the money.",
      "Real Elite Contracting rebuilds Brambleton baths from the waterproofing out: correct slope to drain, bonded waterproofing membrane, and curbless entry where the joist structure allows. Then relocated plumbing where the new layout requires it, updated electrical, dedicated ventilation sized for the room, heated floors where wanted, and a tile and glass installation detailed to hold up.",
      "A full Brambleton primary bath renovation generally runs $30,000 to $70,000 and up, depending on size, whether fixtures move, and tile and glass specification. Secondary and hall baths typically run less.",
      "Loudoun County permits and inspections cover the plumbing, electrical and mechanical work, with rough-in and final. Interior bath work generally sits outside Brambleton Community Association review, but a new exterior vent penetration does not — we confirm before the trades start.",
    ],
  },

  // ── REMODELING · SOUTH RIDING, VA ────────────────────────────────────────
  'remodeling-south-riding-va': {
    paragraphs: [
      "South Riding is one of the largest master-planned communities in Loudoun County, and the ownership pattern is what makes comprehensive renovation sensible here. Families bought for the schools and stayed — often twenty years or more in the same house. Renovation in South Riding is rarely about resale; it is about a household that intends to live in the result for another decade or more and would rather fix the house properly than move.",
      "Real Elite Contracting runs South Riding whole-home programs around the things that actually change how the house works: opening and rebuilding the kitchen, converting the lower level into real living space with a full bath and guest suite, rebuilding the primary suite, and updating secondary baths in the same pass. Electrical capacity, HVAC zoning and plumbing come current while walls are open, which is the only economical time to do it.",
      "Whole-home renovation in South Riding generally runs $160,000 to $500,000 and up, depending on square footage, how much of the lower level is finished, and finish level.",
      "South Riding permits through Loudoun County for building, electrical, plumbing and mechanical. The South Riding Proprietary also carries architectural review for exterior alterations — decks, additions, siding, roofing, windows — on its own review calendar. We get that approval moving in parallel with the county submission rather than in sequence after it, which is where most of the avoidable delay in this community comes from.",
    ],
  },

  // ── KITCHENS · SOUTH RIDING, VA ──────────────────────────────────────────
  'kitchens-south-riding-va': {
    paragraphs: [
      "South Riding kitchens divide by build phase. The mid-1990s and early-2000s homes typically have a closed or half-open kitchen with a soffit and a peninsula — those benefit from real structural change. The later phases already have the open plan and the island, and what they need is everything the builder specified to a price point replaced. Establishing which you have is the first thing we do, because it determines whether this is a structural project or a specification one.",
      "Real Elite Contracting handles both. Where a wall or peninsula comes out we do the beam and framing work ourselves, so the structure and the kitchen are one project. Where the layout stays we focus on what shows and what lasts: full-height cabinetry with real hardware, quartz or natural stone, a properly set tile installation, layered lighting, and electrical brought up to current appliance loads. Island relocations get the plumbing and electrical routing they actually require rather than the shortest path.",
      "A full South Riding kitchen renovation generally runs $45,000 to $115,000 and up, depending on cabinetry level, surfaces, appliance package, and whether structure moves. Taking out a load-bearing wall adds engineering and beam cost a cosmetic refresh does not carry.",
      "Loudoun County permits cover the electrical, plumbing, mechanical and any framing work. Interior kitchen work does not normally trigger South Riding Proprietary review; anything altering an exterior wall does. We confirm before demolition.",
    ],
  },

  // ── BATHROOMS · SOUTH RIDING, VA ─────────────────────────────────────────
  'bathrooms-south-riding-va': {
    paragraphs: [
      "The South Riding primary bath is the room most households have simply put up with. The builder layout — oversized garden tub, undersized shower, low double vanity, builder mirror and lighting — was adequate on move-in day and has not aged well. Converting the tub footprint into a proper walk-in shower is the change that most often transforms the room, and in most South Riding floor plans the plumbing makes it straightforward.",
      "Real Elite Contracting rebuilds South Riding baths waterproofing-first: correct slope to drain, bonded membrane, curbless entry where the joists allow. Then relocated plumbing where the layout requires, updated electrical, dedicated ventilation ducted properly to the outside, heated floors where wanted, and a tile and glass installation detailed to still look right in a decade.",
      "A full South Riding primary bath renovation generally runs $28,000 to $68,000 and up, depending on size, whether fixtures move, and tile and glass specification. Secondary and hall baths typically run less.",
      "Loudoun County permits and inspections cover plumbing, electrical and mechanical, with rough-in and final. We sequence the inspector calendar so trades are not idling between stages.",
    ],
  },

  // ── REMODELING · LANSDOWNE, VA ───────────────────────────────────────────
  'remodeling-lansdowne-va': {
    paragraphs: [
      "Lansdowne sits on the Potomac between Leesburg and Ashburn, and the renovation brief here reflects the address. Homes in Lansdowne on the Potomac, Potomac Station and the river corridor are upper-tier properties whose owners expect finish quality that reads correctly against what the house is worth — and lower levels that carry genuine program rather than a carpeted rec room.",
      "Real Elite Contracting scopes Lansdowne whole-home projects around entertaining-scale kitchens, primary suites rebuilt as private wings with their own bath and closet program, lower levels built out with media, fitness, wine and guest functions, and the systems work a house of that size genuinely needs — electrical capacity, properly zoned HVAC, and insulation and air sealing addressed while assemblies are open. Finish work is where these homes are judged, and we would rather extend a schedule than hand over millwork that does not hold up.",
      "Whole-home renovation in Lansdowne generally runs $250,000 to $800,000 and up, depending on square footage, how much of the lower level is built out, and the finish and millwork level.",
      "Lansdowne permits through Loudoun County for building, electrical, plumbing and mechanical. The community's covenants and design review also govern exterior alterations, and river-corridor properties can carry additional site constraints. We confirm the review path and any site restrictions before design is committed rather than after drawings are paid for.",
    ],
  },

  // ── KITCHENS · LANSDOWNE, VA ─────────────────────────────────────────────
  'kitchens-lansdowne-va': {
    paragraphs: [
      "A Lansdowne kitchen is judged against the rest of the house and against the address, which sets a different bar from a straightforward suburban refresh. These are large kitchens in large homes, usually already open to a family room, where the original build was good but is now twenty years of specification behind. The work is about bringing the room up to what the property implies rather than rearranging it.",
      "Real Elite Contracting builds Lansdowne kitchens to that standard: full-height cabinetry with genuine hardware and interior fittings, natural stone or premium quartz, a butler's pantry or beverage station where the plan allows, layered lighting designed rather than defaulted, appliance-grade electrical, and the venting a real range actually requires — ducted to the outside, sized correctly, and not the recirculating compromise builders default to. Island relocations and structural changes are handled in-house.",
      "A full Lansdowne kitchen renovation generally runs $65,000 to $160,000 and up, depending on cabinetry level, stone selection, appliance package and whether structure moves.",
      "Loudoun County permits cover electrical, plumbing, mechanical and framing changes. Interior work generally sits outside the community's design review, but new exterior venting or window changes do not — we confirm before demolition.",
    ],
  },

  // ── BATHROOMS · LANSDOWNE, VA ────────────────────────────────────────────
  'bathrooms-lansdowne-va': {
    paragraphs: [
      "Lansdowne primary baths have the square footage and lack the specification. The typical layout — a large garden tub as the focal point, a modest separate shower, a long low double vanity — spends its space on a fixture that goes unused and starves the one that gets used every day. Rebuilding around a large walk-in shower, with a freestanding tub only where it genuinely earns its place, is what makes these rooms work.",
      "Real Elite Contracting rebuilds Lansdowne baths from the waterproofing out: correct slope to drain, bonded waterproofing membrane, curbless entry where the joist structure allows, and a tile and glass installation detailed properly at the transitions where these jobs usually fail. Then relocated plumbing where the new layout requires, updated electrical, heated floors, dedicated ventilation sized for the room, and the stone and millwork the address expects.",
      "A full Lansdowne primary bath renovation generally runs $35,000 to $90,000 and up, depending on size, whether fixtures move, and the stone, tile and glass specification. Secondary baths typically run less.",
      "Loudoun County permits and inspections cover plumbing, electrical and mechanical, with rough-in and final. We sequence the inspector calendar so trades are not waiting on each other.",
    ],
  },

  // ── REMODELING · ALDIE, VA ───────────────────────────────────────────────
  'remodeling-aldie-va': {
    paragraphs: [
      "Aldie is where Loudoun stops being suburban. The historic village on Route 50 holds genuinely old buildings; Willowsford and the surrounding properties are large, deliberately designed homes on conservancy-adjacent land; and further west the parcels open up toward Middleburg and hunt country. A whole-home program means something different in each, and the first useful thing a contractor can tell you is which one your property is.",
      "Real Elite Contracting handles the full range. In the village the work is period-sensitive: correcting decades of accumulated alteration, updating systems inside old framing without erasing what makes the building worth owning. In Willowsford and on the larger parcels the brief is a luxury program — entertaining-scale kitchens, primary wings, lower levels with real function, and mechanical systems sized for the footprint. Both get the same structural and systems discipline underneath the finishes.",
      "Whole-home renovation in Aldie generally runs $250,000 to $900,000 and up. Historic village properties carry wider variance, because what is found behind old finishes is not fully knowable at estimate.",
      "Aldie permits through Loudoun County. Willowsford carries its own architectural review through the community association, and historic village properties carry design review for exterior work. Many properties out here are on well and septic, where drainfield capacity can cap how many bedrooms a renovation may add — a question worth answering before a primary-suite plan is drawn, not after. We confirm all three paths before design is committed.",
    ],
  },

  // ── KITCHENS · ALDIE, VA ─────────────────────────────────────────────────
  'kitchens-aldie-va': {
    paragraphs: [
      "Aldie kitchens run from genuinely historic to deliberately rural-modern, and the successful ones share a quality: they look like they belong to the land they sit on. Willowsford in particular was designed around a working farm, and the kitchens that work best there are built for real cooking and real entertaining — larger islands, serious ventilation, pantry and prep space — rather than for a showroom photograph.",
      "Real Elite Contracting builds Aldie kitchens with the structure and mechanicals handled properly underneath: beam work where a wall opens, floor framing assessed before heavy stone is specified, electrical sized for current appliance loads, and ventilation ducted correctly to the outside for the ranges these kitchens actually get. Then the visible work — full-height cabinetry, natural stone, honest tile, and millwork detailed so the room reads as built rather than installed.",
      "A full Aldie kitchen renovation generally runs $60,000 to $160,000 and up, depending on cabinetry level, stone, appliance package and how much structure moves. Historic village kitchens trend higher for the same reason their whole-home projects do.",
      "Loudoun County permits cover electrical, plumbing, mechanical and framing. Willowsford properties carry community architectural review for exterior changes, and historic village properties carry design review. We confirm which applies before demolition.",
    ],
  },

  // ── BATHROOMS · ALDIE, VA ────────────────────────────────────────────────
  'bathrooms-aldie-va': {
    paragraphs: [
      "Bathrooms in Aldie split the same way the rest of the market does. In Willowsford and the newer properties, the rooms are large and the fixtures are builder-standard — the work is specification and layout. In the historic village, a primary bath often has to be created rather than renovated, worked into a floor plan that never had one, with the framing and waste routing that implies.",
      "Real Elite Contracting builds Aldie baths waterproofing-first: correct slope to drain, bonded membrane, curbless entry where the joists allow, and transitions detailed properly. In older buildings we handle the parts that decide whether the job succeeds — routing new waste lines through framing never planned for them, and confirming a floor can carry a stone-set shower or freestanding tub before it is specified. Ventilation is sized and ducted outside, which is the corner most often cut in an old house.",
      "A full Aldie primary bath renovation generally runs $32,000 to $85,000 and up, with historic properties trending higher because of the routing and structural work behind the finishes. Secondary baths typically run less.",
      "Loudoun County permits and inspections cover plumbing, electrical and mechanical. Willowsford architectural review and historic-district design review apply to anything that changes the exterior — including a new vent penetration. We establish that before the trades start.",
    ],
  },
};
