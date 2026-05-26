import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { BUSINESS, SERVICES, EXPANSION_SERVICE_AREAS } from '@/lib/constants';
import { SERVICE_DATA } from '@/lib/services-data';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import StickyEstimateRail from '@/components/services/StickyEstimateRail';
import InvestmentRanges from '@/components/services/InvestmentRanges';
import PrecisionProcess from '@/components/home/PrecisionProcess';
import AssurancesBand from '@/components/home/AssurancesBand';
import JsonLd from '@/components/seo/JsonLd';

// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURED_SERVICE_SLUGS = [
  'roofing',
  'decks',
  'remodeling',
  'siding',
  'bathrooms',
  'kitchens',
  'basements',
] as const;
type FeaturedServiceSlug = (typeof FEATURED_SERVICE_SLUGS)[number];

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
const COMBO_CITY_SLUGS = [
  'winchester-va',
  'frederick-md',
  'leesburg-va',
  'ashburn-va',
  'hagerstown-md',
  'loudoun-county-va',
] as const;
type ExpansionCitySlug = (typeof COMBO_CITY_SLUGS)[number];

// Unique body content for each service × city combination.
// Partial — only combos with hand-written content are listed.
const CONTENT: Partial<Record<`${FeaturedServiceSlug}-${ExpansionCitySlug}`, { paragraphs: string[] }>> = {
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
};

// ─── Static Params ────────────────────────────────────────────────────────────

/**
 * Refuse to render service+city combos outside generateStaticParams.
 * Hagerstown MD + Loudoun County VA would otherwise be rendered
 * on-demand and hit notFound() at runtime — visible as soft 404s in
 * Search Console. With dynamicParams=false, Next returns a hard 404
 * for any combo not in the list.
 */
export const dynamicParams = false;

/**
 * Build params straight off the CONTENT keys so partial coverage is
 * safe — bathrooms/kitchens/basements only render in the markets where
 * a CONTENT entry exists. Adding a key to CONTENT auto-publishes the
 * route on next build.
 */
export function generateStaticParams() {
  return (Object.keys(CONTENT) as `${FeaturedServiceSlug}-${ExpansionCitySlug}`[]).map(
    (key) => {
      const dashIdx = key.indexOf('-');
      return {
        service: key.slice(0, dashIdx),
        city: key.slice(dashIdx + 1),
      };
    }
  );
}

// Cross-link helpers — derived from what's actually published in CONTENT.
function citiesForService(serviceSlug: string): readonly string[] {
  return (Object.keys(CONTENT) as `${FeaturedServiceSlug}-${ExpansionCitySlug}`[])
    .filter((k) => k.startsWith(`${serviceSlug}-`))
    .map((k) => k.slice(serviceSlug.length + 1));
}

function servicesForCity(citySlug: string): readonly string[] {
  return (Object.keys(CONTENT) as `${FeaturedServiceSlug}-${ExpansionCitySlug}`[])
    .filter((k) => k.endsWith(`-${citySlug}`))
    .map((k) => k.slice(0, k.length - citySlug.length - 1));
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; city: string }>;
}): Promise<Metadata> {
  const { service, city } = await params;
  const serviceData = SERVICES.find((s) => s.slug === service);
  const cityData = EXPANSION_SERVICE_AREAS.find((a) => a.slug === city);

  if (!serviceData || !cityData) return { title: 'Not Found' };

  const title = `${serviceData.title} in ${cityData.city}, ${cityData.state} | ${BUSINESS.name}`;
  const description = `Expert ${serviceData.title.toLowerCase()} services in ${cityData.city}, ${cityData.state}. Real Elite Contracting — veteran-owned, quality guaranteed. Get a free estimate today.`;

  return {
    title,
    description,
    keywords: [
      `${serviceData.title.toLowerCase()} ${cityData.city}`,
      `${cityData.city} ${serviceData.title.toLowerCase()}`,
      `${serviceData.title.toLowerCase()} contractor ${cityData.city} ${cityData.state}`,
      `${cityData.city} home improvement`,
      `${cityData.state} contractor`,
    ],
    alternates: {
      canonical: `${BUSINESS.url}/services/${service}/${city}`,
    },
    openGraph: {
      title,
      description,
      url: `${BUSINESS.url}/services/${service}/${city}`,
      type: 'website',
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ServiceCityPage({
  params,
}: {
  params: Promise<{ service: string; city: string }>;
}) {
  const { service, city } = await params;
  const serviceData = SERVICES.find((s) => s.slug === service);
  const cityData = EXPANSION_SERVICE_AREAS.find((a) => a.slug === city);
  const contentKey = `${service}-${city}` as keyof typeof CONTENT;
  const content = CONTENT[contentKey];

  if (!serviceData || !cityData || !content) {
    notFound();
  }

  // SEO: Service schema scoped to this specific city, plus a
  // BreadcrumbList. No per-market LocalBusiness duplication (the global
  // GeneralContractor in layout.tsx already covers areaServed).
  const richServiceData = SERVICE_DATA[serviceData.slug];
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${serviceData.title} in ${cityData.city}, ${cityData.state}`,
    serviceType: richServiceData?.serviceType ?? serviceData.title,
    description:
      richServiceData?.metaDescription ??
      `${serviceData.title} services for ${cityData.city}, ${cityData.state} homeowners by Real Elite Contracting.`,
    provider: {
      '@type': 'GeneralContractor',
      name: BUSINESS.name,
      url: `${BUSINESS.url}/`,
      telephone: '+1-681-534-5515',
    },
    areaServed: {
      '@type': 'City',
      name: cityData.city,
      containedInPlace: { '@type': 'State', name: cityData.state },
    },
    url: `${BUSINESS.url}/services/${service}/${city}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BUSINESS.url },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${BUSINESS.url}/services` },
      { '@type': 'ListItem', position: 3, name: serviceData.title, item: `${BUSINESS.url}/services/${service}` },
      { '@type': 'ListItem', position: 4, name: `${cityData.city}, ${cityData.state}`, item: `${BUSINESS.url}/services/${service}/${city}` },
    ],
  };

  // Cross-link rails — derived from what's actually published in CONTENT.
  const publishedOtherCities = new Set(citiesForService(serviceData.slug));
  const otherCitiesForThisService = EXPANSION_SERVICE_AREAS.filter(
    (a) => a.slug !== cityData.slug && publishedOtherCities.has(a.slug)
  ).slice(0, 5);

  const publishedOtherServices = new Set(servicesForCity(cityData.slug));
  const otherServicesForThisCity = SERVICES.filter(
    (s) => s.slug !== serviceData.slug && publishedOtherServices.has(s.slug)
  );

  return (
    <>
      <JsonLd schema={serviceSchema} />
      <JsonLd schema={breadcrumbSchema} />

      {/* Hero — editorial navy with brand-red eyebrow + breadcrumb */}
      <section className="relative isolate bg-navy-900 text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 gradient-navy-hero" />
        <Container size="wide" className="py-20 md:py-28 lg:py-32">
          <nav
            aria-label="Breadcrumb"
            className="text-xs sm:text-sm text-charcoal-300 mb-6 flex items-center gap-2 flex-wrap"
          >
            <Link href="/services" className="hover:text-white transition-colors">
              Services
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-charcoal-500" aria-hidden="true" />
            <Link
              href={`/services/${serviceData.slug}`}
              className="hover:text-white transition-colors"
            >
              {serviceData.title}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-charcoal-500" aria-hidden="true" />
            <Link
              href={`/service-areas/${cityData.slug}`}
              className="hover:text-white transition-colors"
            >
              {cityData.city}, {cityData.state}
            </Link>
          </nav>

          <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-4 inline-flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> {cityData.city}, {cityData.state}
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight max-w-4xl">
            {serviceData.title}
            <br />
            <span className="text-brand-red">in {cityData.city}.</span>
          </h1>
          <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
            {richServiceData?.hero?.sub ?? serviceData.description}
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href="#estimate"
              className="bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
            >
              Get My Free Estimate →
            </a>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-white/20 transition-colors"
            >
              Call {BUSINESS.phone}
            </a>
          </div>
        </Container>
      </section>

      {/* Body + sticky form rail */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7 xl:col-span-8 space-y-16">
              {/* Localized prose */}
              <div>
                <SectionHeader
                  eyebrow={`${serviceData.title} · ${cityData.city}`}
                  title={`Why ${cityData.city} homeowners hire us.`}
                />
                <div className="mt-7 space-y-5">
                  {content.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-charcoal-700 text-base md:text-lg leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Investment ranges (when SERVICE_DATA has them) */}
              {richServiceData?.investment && (
                <InvestmentRanges
                  startingAt={richServiceData.investment.startingAt}
                  tiers={richServiceData.investment.tiers}
                  note={richServiceData.investment.note}
                />
              )}

              {/* Why this city trusts us */}
              <div className="bg-steel-50 rounded-lg border-t-4 border-brand-red p-7 md:p-9">
                <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-3">
                  Why {cityData.city} homeowners choose Real Elite
                </p>
                <ul className="space-y-3 text-charcoal-700">
                  <li className="flex items-start gap-3">
                    <span className="text-brand-red font-bold flex-shrink-0">·</span>
                    <span>
                      One named project lead on every {cityData.city}{' '}
                      {serviceData.title.toLowerCase()} job — from estimate through final walkthrough.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-red font-bold flex-shrink-0">·</span>
                    <span>
                      Daily updates, clean job site, 24-hour response standard.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-red font-bold flex-shrink-0">·</span>
                    <span>
                      Written workmanship warranty + manufacturer warranties registered on your behalf.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-red font-bold flex-shrink-0">·</span>
                    <span>
                      Licensed and insured in {cityData.state} — local permitting + inspections handled.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Cross-links */}
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-6">
                  Keep exploring
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    href={`/services/${serviceData.slug}`}
                    className="group bg-steel-50 hover:bg-navy-800 rounded-md p-5 transition-colors"
                  >
                    <p className="text-[0.65rem] uppercase tracking-[0.15em] font-semibold text-brand-red mb-1">
                      Service overview
                    </p>
                    <p className="font-heading text-base font-bold text-navy-800 group-hover:text-white transition-colors inline-flex items-center gap-1.5">
                      All {serviceData.title}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </p>
                  </Link>
                  <Link
                    href={`/service-areas/${cityData.slug}`}
                    className="group bg-steel-50 hover:bg-navy-800 rounded-md p-5 transition-colors"
                  >
                    <p className="text-[0.65rem] uppercase tracking-[0.15em] font-semibold text-brand-red mb-1">
                      Service area
                    </p>
                    <p className="font-heading text-base font-bold text-navy-800 group-hover:text-white transition-colors inline-flex items-center gap-1.5">
                      All services in {cityData.city}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </p>
                  </Link>
                </div>

                {otherServicesForThisCity.length > 0 && (
                  <div className="mt-8">
                    <p className="text-[0.65rem] uppercase tracking-[0.15em] font-semibold text-charcoal-500 mb-3">
                      Other services in {cityData.city}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {otherServicesForThisCity.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}/${cityData.slug}`}
                          className="inline-flex items-center gap-1.5 bg-white border border-charcoal-200 hover:border-brand-red text-navy-800 hover:text-brand-red rounded-md px-3 py-2 text-sm font-medium transition-colors"
                        >
                          {s.title} <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {otherCitiesForThisService.length > 0 && (
                  <div className="mt-8">
                    <p className="text-[0.65rem] uppercase tracking-[0.15em] font-semibold text-charcoal-500 mb-3">
                      {serviceData.title} in other markets
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {otherCitiesForThisService.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/services/${serviceData.slug}/${c.slug}`}
                          className="inline-flex items-center gap-1.5 bg-white border border-charcoal-200 hover:border-brand-red text-navy-800 hover:text-brand-red rounded-md px-3 py-2 text-sm font-medium transition-colors"
                        >
                          {c.city}, {c.state} <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky right rail — multi-step estimate form */}
            <div className="lg:col-span-5 xl:col-span-4">
              <StickyEstimateRail initialService={serviceData.slug} />
            </div>
          </div>
        </Container>
      </section>

      {/* Process module */}
      <PrecisionProcess />

      {/* Assurances */}
      <AssurancesBand />

      {/* Final CTA */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <Container size="default" className="text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-5">
            Ready to start your {cityData.city} project?
          </h2>
          <p className="text-charcoal-300 mb-8 max-w-2xl mx-auto">
            Three short steps, about 60 seconds — a real project lead reaches out within 24
            business hours to schedule your free on-site walkthrough.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#estimate"
              className="inline-flex items-center justify-center gap-2 bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
            >
              Get My Free Estimate
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-white/20 transition-colors"
            >
              Call {BUSINESS.phone}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
