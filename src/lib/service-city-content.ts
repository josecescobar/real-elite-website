/**
 * Localized service×city body copy + the slug catalogs its keys are typed
 * against. Extracted from src/app/services/[service]/[city]/page.tsx so the
 * route keeps only logic. Data-only module — no behavior lives here.
 *
 * Coverage is PARTIAL: only combos with a CONTENT entry render (the route's
 * generateStaticParams derives the published list from CONTENT keys).
 */

import { claimsFoundIn } from '@/lib/claims';
import { SERVICES, servicePillarHref } from '@/lib/constants';

// Re-exported so callers have one import site for combo facts. The declaration
// lives in its own dependency-free module because next.config.ts loads it
// outside the app's module graph, where `@/` does not resolve — see that file.
export { RETIRED_COMBOS } from '@/lib/retired-combos';

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
 * Areas that have service+area deep-link pages. Each pairing has
 * hand-written localized content in the CONTENT map below.
 *
 * Mostly towns and cities, but not exclusively: `loudoun-county-va` is a
 * county and `northern-virginia` is a region, because the altitude a trade's
 * demand sits at is a property of the trade and the market, not of the route.
 * Anything in here must be a slug in ALL_SERVICE_AREAS — the route resolves
 * against that list and calls notFound() on a miss.
 *
 * NOTE: this list is INTENTIONALLY decoupled from the service-area lists
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
  // Home turf (Eastern Panhandle WV). The closest, highest-intent markets, and
  // where the site's best commercial positions sit: Search Console shows
  // "basement remodeling ranson wv" at 3.2 and "basement remodeling inwood wv"
  // at 5.7, both currently answered by a generic /service-areas/ page. Copy
  // here quotes real published figures rather than deferring to a form.
  'martinsburg-wv',
  'charles-town-wv',
  'ranson-wv',
  'inwood-wv',

  // Loudoun outdoor living. Brambleton is a community inside Ashburn's orbit
  // rather than a town, but it carries seven distinct deck queries of its own
  // at positions 9-23, all currently answered by the Ashburn page. See the
  // decks-brambleton-va entry for how the two are kept from competing.
  'brambleton-va',

  'winchester-va',
  'frederick-md',
  'leesburg-va',
  'ashburn-va',
  'loudoun-county-va',

  // Northern Virginia at region altitude. The only combo city that is not a
  // town, city or county: keyword data pulled 2026-09-18 puts "basement
  // remodeling northern virginia" at 110/mo and "basement finishing northern
  // virginia" at 90, while every town-level basement term in the same market
  // except Alexandria (70) and McLean (30) sits below the reporting floor.
  //
  // Deliberately basements ONLY. "kitchen remodeling mclean va" is 260/mo and
  // Vienna 140, so kitchens and baths stay at town altitude here — one market,
  // two altitudes, decided per trade. See §1.5 of
  // docs/site-altitude-architecture-2026-09-18.md.
  'northern-virginia',

  'mclean-va',
  'alexandria-va',
  'vienna-va',
  'great-falls-va',
  'reston-va',
  'burke-va',

  // Middleburg is back for decks and additions only. Tier C still retires
  // kitchens, bathrooms, and basements there (see RETIRED_COMBOS). Those
  // three 301s stay; they are a different trade than the two pages that
  // publish here.
  'middleburg-va',

  // Fairfax Station and Clifton stay gone. Tier C retired every combo they
  // had, so keeping their slugs here would leave entries this map can never
  // key. Burke stays: it keeps its kitchen and bathroom combos and lost only
  // its basement page.
] as const;
export type ComboCitySlug = (typeof COMBO_CITY_SLUGS)[number];

// Unique body content for each service × city combination.
// Partial — only combos with hand-written content are listed.
type ComboContent = {
  paragraphs: string[];
  /**
   * Optional search-snippet overrides. Omit both and the route falls back to
   * its generic `{Service} in {City}, {State}` template, which is what every
   * VA/MD combo still uses. Set them where the query has a specific shape the
   * template cannot answer — the WV roofing pages target "roof replacement
   * cost <town> wv", so their snippet leads with the price range instead of
   * "Expert roofing services".
   */
  metaTitle?: string;
  metaDescription?: string;
  /**
   * Blog slugs to surface in the Related Guides module at the foot of the page.
   *
   * AUTHORED, NEVER DERIVED. The module exists to answer a different intent
   * than the page it sits on — someone reading a service+place page is closer
   * to hiring than someone reading a guide — so the pairing is a judgement
   * about which article a buyer on THIS page would still want, not a category
   * match. Deriving it would surface the nearest article by tag and quietly
   * cannibalise the page it is meant to support.
   *
   * Every slug here must resolve to a published post; `service-city-content.test.ts`
   * fails the build otherwise. That guard is not decoration: `RelatedGuides`
   * falls back to the three most recent posts when a slug does not resolve, so
   * a typo would silently publish three unrelated articles rather than error.
   */
  relatedGuideSlugs?: readonly string[];
  /** Exact on-page H1 when the service title plus city is not the query. */
  h1?: string;
  faqs?: readonly { question: string; answer: string }[];
  /**
   * Emit LocalBusiness JSON-LD that reuses the sitewide business @id.
   * Off by default so other combo pages do not each invent a second business.
   */
  includeLocalBusiness?: boolean;
  notes?: readonly {
    heading: string;
    body: string;
    href: string;
    linkLabel: string;
  }[];
  /**
   * Optional H2 blocks under the intro. Plain paragraphs stay the intro;
   * these are the named sections a query asks for (cost, timeline, egress,
   * permits). Links are real hrefs — combo paragraphs are not markdown.
   */
  sections?: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
    links?: readonly { href: string; label: string }[];
  }[];
};

/**
 * The generic metadata every combo gets when it defines no override.
 * Exported so the route and the tests share one definition: an override
 * that merely reproduces the fallback is dead weight, and the only way to
 * detect that is to compare against the real template rather than a copy.
 *
 * `place` is a formatted place name and callers pass `formatAreaPlace(area)`,
 * not `${city}, ${state}`. The interpolated form produced "Basements in
 * Northern Virginia, VA | Real Elite" once a region became a combo city; the
 * helper returns "Vienna, VA" for a locality and "Northern Virginia" for a
 * region, so every pre-existing combo title and description is unchanged.
 */
export function defaultComboTitle(serviceTitle: string, place: string) {
  return `${serviceTitle} in ${place} | Real Elite`;
}

export function defaultComboDescription(serviceTitle: string, place: string) {
  return `Expert ${serviceTitle.toLowerCase()} services in ${place}. Real Elite Contracting — family-run, quality guaranteed. Get a free estimate today.`;
}

export const CONTENT: Partial<Record<`${FeaturedServiceSlug}-${ComboCitySlug}`, ComboContent>> = {
  // ── ROOFING ──────────────────────────────────────────────────────────────

  'roofing-martinsburg-wv': {
    metaTitle: 'Roof Replacement Cost in Martinsburg, WV | Real Elite',
    metaDescription:
      'What a roof replacement really costs in Martinsburg, WV — the $9,000 to $22,000 range, what moves the number, and a free written estimate for your project.',
    paragraphs: [
      "Martinsburg sits in the Eastern Panhandle along the I-81 corridor, where roofs take a beating from both directions: humid summers with fast-moving thunderstorms and hail, then a winter of freeze-thaw cycles that work water under shingles and into flashing. Most roofs here reach the end of their service life somewhere between year eighteen and year twenty-five, and the first sign is rarely a leak — it is granule loss in the gutters, curling at the edges, or a stain on an upstairs ceiling after a hard rain.",
      "A roof replacement in the Eastern Panhandle typically runs about $9,000 to $22,000. Where your roof lands in that range comes down to four things: square footage and pitch, how many old layers have to come off, whether you choose architectural shingles or standing seam metal, and whether rotted decking turns up once the old roof is stripped. We put all four in writing before the job starts, and we will tell you what the decking allowance is rather than discovering it on invoice day.",
      "We work across Berkeley County — the older homes around downtown and Queen Street, where steeper pitches and original framing need a careful hand, and the newer subdivisions out toward Spring Mills, Hedgesville and the Route 11 corridor, where full replacements move quickly. Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and Purple Heart recipient. Real Elite Contracting is licensed in West Virginia and Virginia. Discuss site supervision, communication, and cleanup arrangements during the estimate.",
      "If a storm came through, do not wait on the insurance company to tell you what happened. We will inspect the roof, document the damage properly, and deal with the adjuster directly. If the roof can be repaired rather than replaced, we will say so — an honest repair keeps you as a customer longer than a replacement you did not need.",
    ],
  },

  'roofing-charles-town-wv': {
    metaTitle: 'Roof Replacement Cost in Charles Town, WV | Real Elite',
    metaDescription:
      'Roof replacement in Charles Town, WV — the real $9,000 to $22,000 range, storm and insurance claims, and a free written estimate for your project.',
    paragraphs: [
      "Charles Town and the surrounding Jefferson County communities sit at the eastern edge of the Panhandle, close enough to the Blue Ridge to catch the weather that rolls over it. Summer storms arrive fast and hard, winter brings ice and the freeze-thaw cycle that opens seams around chimneys and valleys, and the shade from mature trees keeps north-facing slopes damp long enough to grow moss and algae. All of it shortens the life of a roof that looked fine three years ago.",
      "Expect a roof replacement here to fall in the $9,000 to $22,000 range. Size and pitch set the baseline; tear-off of multiple old layers, the material tier you pick, and any decking that has to be replaced move it from there. You get that broken out as line items on a written estimate, not a single number over the phone. Any contractor who will not itemize is hiding where the money goes.",
      "The historic streets around Washington and George have homes with steep pitches, dormers, slate, and detailing that does not forgive a rushed install, and Jefferson County's historic review adds a step that is easy to get wrong. Out toward Ranson, Route 9 and the Route 340 corridor, the newer subdivisions are straightforward architectural shingle replacements we can turn around fast. We handle permitting for both, and we know which one you are.",
      "Storm damage is where most Charles Town homeowners meet us. We will get out to look, photograph what we find for the claim, and give you a straight read on whether you are looking at a repair or a replacement. Review the proposed scope and warranty terms before signing. Discuss site supervision, communication, and cleanup arrangements during the estimate.",
    ],
  },

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
      "Review the proposed scope and warranty terms before signing.",
    ],
  },

  'roofing-leesburg-va': {
    paragraphs: [
      "Real Elite Contracting replaces and repairs roofs for Leesburg homeowners. A Leesburg mailing address is not Town limits — Lansdowne and River Creek often sit in unincorporated Loudoun. We check the parcel before we file. We install architectural shingles and standing-seam metal when the job calls for them.",
      "Inside Town, exterior work that also needs a Loudoun County building permit starts with Town zoning through eTRAKiT. The county issues the building permit after that. If the parcel is in the H-1 Old and Historic District, a roof replacement or material change needs a Certificate of Appropriateness. Outside Town, county building and zoning run through LandMARC. We put the current Town and county fees in the written estimate instead of guessing them here.",
      "A county permit is not HOA approval. We submit both tracks in parallel when the lot has an association. We do not publish One Loudoun or Lansdowne approved-color lists from contractor blogs — we use the current packet.",
      "What you get is the paperwork product: Town or county path, whether a COA is in play, and an honest read on repair versus replacement from on-roof photos. Manufacturer warranties are registered when the product qualifies.",
    ],
  },

  'roofing-ashburn-va': {
    paragraphs: [
      "Real Elite Contracting replaces and repairs roofs for Ashburn homeowners. Ashburn is unincorporated Loudoun County — building and zoning run through LandMARC, not a town office. We work Brambleton, Broadlands, Ashburn Farm, and One Loudoun when the parcel sits in those associations.",
      "A county permit is not HOA approval. In Brambleton, official design review covers essentially all exterior changes, including color and material, and removals. In South Riding, staff can rubber-stamp a short list that includes roof replacement; a county permit still does not substitute for Architectural Standards approval. For One Loudoun and Ashburn Farm we submit the current packet — we do not publish approved-color lists from blogs.",
      "We photograph the roof, tell you whether repair or replacement is the honest call, and put published county fees and the association's current review window in the written estimate. We do not promise a one-day replacement as a rule — weather, material lead time, and HOA approval set the calendar.",
      "Debris comes off the site and we magnet-sweep the yard. Manufacturer warranties are registered when the product qualifies.",
    ],
  },

  'roofing-loudoun-county-va': {
    paragraphs: [
      "Real Elite Contracting replaces and repairs roofs across Loudoun County. We work the western corridor first — Purcellville, Round Hill, Lovettsville, western Leesburg, selected Middleburg — then the master-planned communities when the parcel is there. We install architectural shingles and standing-seam metal when the job calls for them. Project scope is discussed at the estimate.",
      "Leesburg, Purcellville, and Middleburg issue town zoning first; the county still issues the building permit. Everywhere else, building and zoning run through LandMARC. Historic-district exteriors in Old Town Leesburg or Middleburg need a Certificate of Appropriateness on top of that.",
      "A county permit is not HOA approval. Brambleton reviews essentially all exterior changes, including color. South Riding can rubber-stamp roof replacement on a short staff list — a new deck is not on that list, and a county permit still is not HOA approval. We do not publish One Loudoun color lists from contractor blogs.",
      "Review the proposed scope and warranty terms before signing.",
    ],
  },

  // ── DECKS ──────────────────────────────────────────────────────────────

  /**
   * Home-turf decks. "composite decking martinsburg" (29 impressions, position
   * 26.4) and "decking martinsburg" (12, position 33) currently land on the
   * generic /services/decks hub, which names no town. The per-square-foot
   * figures here are the ones the deck-cost guide already publishes for the
   * Eastern Panhandle, so the site does not contradict itself.
   */
  'decks-martinsburg-wv': {
    metaTitle: 'Deck Builders Martinsburg WV | Real Elite Contracting',
    h1: 'Deck Builders Martinsburg WV',
    metaDescription:
      'Deck builders Martinsburg WV. Composite about $30 to $55 per square foot; pressure-treated about $15 to $25. Berkeley County permit note below.',
    relatedGuideSlugs: [
      'deck-cost-per-square-foot-eastern-panhandle-2026',
      'deck-permits-berkeley-jefferson-county-wv-2026',
    ],
    notes: [
      {
        heading: 'Berkeley County permits',
        body: 'Berkeley County generally requires a building permit for an attached deck, a deck more than 30 inches above grade, or a deck on permanent footings. Inside Martinsburg city limits the city may run its own review. A Martinsburg mailing address is not the same as city limits. This page does not quote a permit fee. Check the county portal, and the deck permit guide linked below, for the current process.',
        href: 'https://onestop.berkeleywv.org',
        linkLabel: 'Berkeley County OneStop permitting',
      },
    ],
    paragraphs: [
      'People searching for deck builders Martinsburg WV are usually replacing a deck that has already lived through several winters. Martinsburg decks take the full Eastern Panhandle year: humid summers with fast thunderstorms, then a winter of freeze and thaw that works water into fasteners and board ends. Pressure-treated pine here often needs sanding and staining by about year three. Many Berkeley County homeowners replacing a fifteen-year-old deck do not replace it in kind.',
      'Installed cost in this market is the Eastern Panhandle range the deck-cost guide already publishes: about $15 to $25 per square foot for pressure-treated pine and $30 to $55 per square foot for composite such as Trex or TimberTech. On a typical 400 square foot deck that is a real spread. Composite costs more up front and skips the annual maintenance weekend. It holds color on the west-facing exposures common out toward Spring Mills, and it does not splinter where children are barefoot.',
      'We build across Berkeley County. Older homes near downtown and Queen Street need a careful look at grade and existing framing before anything is designed. Newer subdivisions toward Spring Mills, Hedgesville, and the Route 11 corridor are often a straightforward replacement. Footings go below the frost line. In this part of West Virginia that is not a detail to eyeball.',
      'You get a written, itemized estimate before anything is torn out. Framing, decking, railing, footings, and any structural work are separate lines. Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and Purple Heart recipient. WV Contractor License WV062432. Licensed in West Virginia and Virginia.',
    ],
  },

  /**
   * Charles Town decks. Same published Eastern Panhandle per-square-foot
   * figures as Martinsburg (deck-cost guide). The permit path is not the
   * same: city limits file with Charles Town, a Charles Town mailing address
   * outside the city files with Jefferson County.
   */
  'decks-charles-town-wv': {
    metaTitle: 'Composite Decks in Charles Town, WV | Real Elite',
    metaDescription:
      'Composite decks in Charles Town run about $30 to $55 a square foot. City permits inside limits; Jefferson County outside.',
    relatedGuideSlugs: [
      'deck-permits-berkeley-jefferson-county-wv-2026',
      'deck-cost-per-square-foot-eastern-panhandle-2026',
    ],
    paragraphs: [
      "A Charles Town deck is decided at the house. An older lot can be tight, shaded, and graded toward a stone or block foundation, and that is something we measure before we design. A later house may still have the original pressure-treated builder deck. We look at the framing, the ledger, and the boards and say whether a replacement is the job.",
      "Installed cost is the Eastern Panhandle range the deck-cost guide already publishes: about $15 to $25 per square foot for pressure-treated pine and $30 to $55 per square foot for composite such as Trex or TimberTech. A Charles Town mailing address is not city limits. Inside the city, the Building Inspection office at City Hall, 101 E. Washington Street, lists decks and porches as work that needs a building permit. Apply in person or through MGO. The Department of Community Development answers at 304-724-3248.",
      "Outside city limits, that mailing address is Jefferson County. The Office of Building Permits and Inspections is at 116 East Washington Street, Suite 100 (304-725-2998, permits@jeffersoncountywv.org). County applications go through MGO Connect. The published deck-permit guide treats an attached deck, a walking surface more than 30 inches above grade, or permanent footings as a permit in both Berkeley and Jefferson counties. We check the parcel before we file. This page does not guess a city fee.",
      "Footings go below the frost line. The written estimate itemizes framing, decking, railing, and footings. WV Contractor License WV062432.",
    ],
  },

  'decks-winchester-va': {
    paragraphs: [
      "Real Elite Contracting builds decks and outdoor living for Winchester homeowners — composite builds, railing and lighting, and the next step when you want a roof or screen. A Winchester mailing address is not automatically City limits: parcels along Route 7, Senseny Road, and the county line often sit in Frederick County, Virginia. We check the parcel before we file. We install Trex, TimberTech, and AZEK when the job calls for them; we do not advertise a manufacturer Pro or Platinum badge we do not hold.",
      "Inside the City, building permits run through City of Winchester Zoning and Inspections on the City permit portal. The 2021 Virginia Uniform Statewide Building Code is what the City reviews against. Outside City limits, Frederick County, Virginia issues the building permit. We do not publish a made-up Winchester deck-permit fee — the City points applicants to the municipal fee schedule, and we put the current amount in the written estimate.",
      "What you file with the application is the paperwork product: a site plan with setbacks, framing and footing details, and ledger, railing, and stair notes. If the parcel is in Old Town, we check whether historic-district design review applies before we lock materials. HOA review, when the lot has one, is a separate track from the City or county building permit.",
      "We install to the approved plans and the Virginia Residential Code, and document each inspection.",
    ],
  },

  'decks-frederick-md': {
    paragraphs: [
      "Real Elite Contracting builds decks and outdoor living for Frederick County homeowners — composite builds, railing and lighting, and the next step when you want a roof or screen. The City of Frederick and the Town of Mt. Airy issue their own building permits. Everywhere else in the county, building permits and zoning certificates run through Frederick County Permits and Inspections on the County application portal. We check the parcel before we file. We install Trex, TimberTech, and AZEK when the job calls for them; we do not advertise a manufacturer Pro or Platinum badge we do not hold.",
      "The County's published deck-and-porch process treats three designs as different jobs: an open deck has no covering; a covered porch adds a roof; a screened porch adds a roof and screened walls. A site plan or plot plan with setbacks is required on every application. A permit is required when a deck or porch is replaced, even in the same location, and when railings or structural members are replaced. After staff marks the application complete, review agencies have a published one-week due date from assignment.",
      "We put the current County fee-schedule line items in the written estimate instead of guessing them here — the County publishes separate building, zoning-review, filing, and automation fees, and incorporated towns drop the zoning-review fee. Historic-district or municipal design review, when it applies, is a separate track from the building permit.",
      "What you get is the paperwork product: we tell you whether you are in the City, Mt. Airy, or the County, which path the design is on (open deck vs covered vs screened), and we file the portal set. We install to the approved plans and document each inspection.",
    ],
  },

  'decks-leesburg-va': {
    metaTitle: 'Composite Deck Builder in Leesburg, VA | Real Elite',
    metaDescription:
      'Composite decks and outdoor living in Leesburg — Lansdowne, Cascades and Countryside. TimberTech, Azek and Trex, with HOA approvals handled.',
    paragraphs: [
      "Real Elite Contracting builds decks and outdoor living for Leesburg homeowners — composite builds, railing and lighting, and the next step when you want a roof or screen. We work the Town and western Leesburg first because that is the practical truck path from Martinsburg. A Leesburg mailing address is not the same as Town of Leesburg limits: Lansdowne and River Creek often carry a Leesburg address and sit in unincorporated Loudoun. We check the parcel before we file. We install Trex, TimberTech, and AZEK when the job calls for them; we do not advertise a manufacturer Pro or Platinum badge we do not hold.",
      "Inside Town limits the order is fixed. The Town of Leesburg issues the zoning permit first through eTRAKiT — decks, balconies, and exterior stairs need Town zoning (typically without engineering review). Loudoun County issues the building permit after that; the county will not release a building permit until the Town zoning permit is approved. Typical Deck Detail still applies to the county building set when the design qualifies: single-level, attached, residential, joist overhangs of 2 feet or less, and no roof, screen, hot tub, gazebo, or detached structure. Published county fees inside an incorporated town are $100 for Typical under 1,000 sq ft (building permit only) and $230 for full plans under 1,000 sq ft (building plus plan review). Outside Town limits those same county paths are $265 and $395 because they include county zoning. Town zoning has its own fee — we put the current Town amount in the written estimate instead of guessing it here. County inspections still apply: footing before concrete, framing before decking, final. Framing and final may combine when framing is at least 42 inches above grade.",
      "If the parcel is in the H-1 Old and Historic District, every exterior construction project — including a new deck — needs a Certificate of Appropriateness. Some COAs are staff-approved; others go to the Board of Architectural Review. A National Register listing is honorary and is not the same as the Town H-1 overlay. Gateway District rules are lighter on single-family detached houses. Any HOA review is a separate track from Town zoning and the county building permit. We submit what applies in parallel so the layers do not stack.",
      "What you get is the paperwork product: we tell you whether you are in Town or unincorporated county, which county path the design is on (Typical vs full plans), and whether a COA is in play. We prepare the Town eTRAKiT zoning set (plat to engineer's scale, owner consent) and the county LandMARC building set. We install to the Virginia Uniform Statewide Building Code and the approved Typical Detail or stamped plans, and document each inspection.",
    ],
  },

  /**
   * Brambleton gets its own page rather than more Ashburn copy because it
   * carries its own named demand: "composite deck builder in brambleton va"
   * (pos 11.1), "pvc decking brambleton va" (9.2), "deck installation
   * brambleton va" (10.6) and four more, ~172 impressions, every one of them
   * currently served by /services/decks/ashburn-va.
   *
   * To keep the two from competing, this page is about Brambleton's HOA design
   * review and its small, closely-spaced lots, while the Ashburn page's snippet
   * (below) is retargeted at Ashburn's own communities. The bodies overlap only
   * where a homeowner would genuinely expect them to.
   */
  'decks-brambleton-va': {
    metaTitle: 'Composite Deck Builder in Brambleton, VA | Real Elite',
    metaDescription:
      'Custom composite and PVC decks in Brambleton — Trex, TimberTech and Azek, built to Loudoun County code. We carry the HOA design review from drawing to approval.',
    paragraphs: [
      "Brambleton was built dense and built quickly, and that shapes every deck we put in here. Lots are close together, sight lines to neighbours are short, and the grade behind a townhome or single-family often drops away faster than owners expect. A deck in Brambleton has to earn its space: the right height to sit level with the kitchen door, the right railing to keep the yard feeling open rather than fenced in, and a footprint that leaves usable ground underneath instead of a dead shaded strip.",
      "Nearly every project in Brambleton passes through the community's architectural review before a single post goes in. We prepare the submission the way the committee expects to receive it — dimensioned plan, elevation, material and colour selections, and the finished-height detail that causes most of the rejections we see on plans homeowners drew themselves. The Loudoun County permit runs in parallel. You are not chasing either one; that is our job, and it is the part that usually decides whether you are entertaining on the deck in June or in September.",
      "Composite and PVC are the right call on these lots and it is not close. Trex, TimberTech and Azek hold their colour through the full-sun western exposures common in Brambleton, they do not splinter where children are barefoot, and they skip the annual sanding and staining that pressure-treated boards demand by year three. We will walk you through the boards in daylight rather than off a chip, because the greys and the warm browns read very differently against Brambleton's brick and siding palettes than they do in a showroom.",
      "Most Brambleton decks we build are doing more than one job: a dining zone that clears the door swing, a lounge corner that catches evening light, lighting worked into the posts and risers so the space survives past dusk, and often a pergola or roof over part of it for the July afternoons. Discuss site supervision, communication, and cleanup arrangements during the estimate.",
    ],
  },

  'decks-ashburn-va': {
    // Snippet retargeted to Ashburn's own communities now that Brambleton has
    // a dedicated page. The body still mentions Brambleton in passing, which is
    // natural for a neighbouring community and not worth rewriting.
    metaTitle: 'Custom Deck Builder in Ashburn, VA | Real Elite',
    metaDescription:
      'Composite decks in Ashburn — One Loudoun, Broadlands and Ashburn Farm. Trex, TimberTech and Azek, with HOA and Loudoun permits handled.',
    paragraphs: [
      "Real Elite Contracting builds decks and outdoor living for Ashburn homeowners — composite builds, railing and lighting, and the next step when you want a roof or screen. Ashburn is unincorporated Loudoun County, not a town: there is no separate municipal zoning office. County building and zoning run through LandMARC. We work Brambleton, Broadlands, Ashburn Farm, and One Loudoun when the parcel sits in those associations. We install Trex, TimberTech, and AZEK when the job calls for them; we do not advertise a manufacturer Pro or Platinum badge we do not hold.",
      "Every Ashburn deck needs a Loudoun County building permit and a county zoning permit. Typical Deck Detail is the fast path: single-level, attached, residential, joist overhangs of 2 feet or less, and no roof, screen, hot tub, gazebo, or detached structure. Published county fee on that path is $265 (building plus zoning) under 1,000 sq ft. A roofed patio, screened porch, or three-season room drops out of Typical and needs full structural plans: $395 under 1,000 sq ft. Those numbers are from Loudoun Building and Development — not a contractor guess. County inspections: footing before concrete, framing before decking, final. Framing and final may combine when framing is at least 42 inches above grade. Published minimum footing depth is 24 inches on solid soil.",
      "A county permit is not HOA approval. The county does not enforce covenants. We submit both tracks in parallel so they do not stack. In Brambleton, official design review covers essentially all exterior changes, permanent or temporary; the Covenants Committee typically meets the second Monday, applications are due 9:00 AM Friday ten days prior (holiday weeks shift — we use the published calendar), and decision letters usually follow 5–7 business days after the meeting. In Broadlands, Declaration 7.5 requires prior written consent for any exterior addition; decks are a listed Modifications Subcommittee project. Applications are due at noon Wednesday, one week before the meeting; March–October the subcommittee meets the first and third Wednesdays at 7:00 PM, November–February the third Wednesday; result letters are normally emailed within a week of the meeting. For One Loudoun and Ashburn Farm we submit the current association packet — we do not publish approved-color lists or worksheet rules from contractor blogs or third-party form sites.",
      "What you get is the paperwork product: we tell you which county path the design is on (Typical vs full plans), which association reviews the lot, and we prepare the LandMARC set plus the ARC packet. We install to the Virginia Uniform Statewide Building Code and the approved Typical Detail or stamped plans, and document each inspection.",
    ],
  },

  'decks-loudoun-county-va': {
    // The body already publishes the $25k-$75k+ range this market works in, so
    // the snippet leads with it. A homeowner pricing an outdoor-living buildout
    // self-qualifies before the click, which is the point on a consultation CTA.
    metaTitle: 'Outdoor Living & Deck Builder — Loudoun County, VA',
    metaDescription:
      'Composite decks, outdoor kitchens and pergolas in Loudoun County. Most projects run $25,000 to $75,000+, built to county code.',
    paragraphs: [
      "Real Elite Contracting builds decks and outdoor living for Loudoun County homeowners — composite builds, railing and lighting, and the next step up when you want a roof or screen. We work the western corridor first (Purcellville, Round Hill, Lovettsville, western Leesburg, selected Middleburg) because that is the practical truck path from Martinsburg. We install Trex, TimberTech, and AZEK when the job calls for them; we do not advertise a manufacturer Pro or Platinum badge we do not hold.",
      "Every Loudoun County deck needs a building permit and a zoning permit. The county's Typical Deck Detail is the fast path: it applies only to a single-level, residential, attached deck with no roof, no screen, no hot tub, no gazebo, and no detached structure. On that path the published county fee is $265, building review is 2 days, and zoning review is 2 days (intake completeness is 2–5 business days). A roofed patio, screened porch, or three-season room drops out of Typical and needs full structural plans: $395, 15-day building review, and 10-day zoning review. Those numbers are from Loudoun Building and Development — not a contractor guess. Leesburg, Purcellville, and Middleburg permit separately from the county. Published minimum footing depth is 24 inches on solid soil.",
      "A county permit is not HOA approval. The county does not enforce covenants. We submit both tracks in parallel so they do not stack. For Brambleton, official design review covers essentially all exterior changes; the Covenants Committee typically meets the second Monday of the month, with applications due 9:00 AM Friday ten days prior. For South Riding, written Architectural Standards approval is required before exterior work; a county permit does not substitute, and staff can rubber-stamp only a short list (roof and window replacement are on that list — a new deck is not). We do not publish One Loudoun approved colors or material lists until we have that association's current packet in hand.",
      "What you get from us is the paperwork product, not a slogan: we tell you which path your design is on (Typical vs full plans), prepare the county set and the ARC packet, and put the real review days into the written estimate. Pier inspections happen before concrete; framing inspections happen before decking. Review the proposed scope and warranty terms before signing.",
    ],
  },

  'decks-middleburg-va': {
    paragraphs: [
      "Real Elite Contracting builds decks and outdoor living for selected Middleburg homeowners — composite builds, railing and lighting, and the next step when you want a roof or screen. A Middleburg mailing address is not automatically Town limits: parcels along Atoka, Foxcroft, and Goose Creek are often unincorporated Loudoun. We check the parcel before we file. We install Trex, TimberTech, and AZEK when the job calls for them; we do not advertise a manufacturer Pro or Platinum badge we do not hold.",
      "Inside Town limits the order is fixed. The Town of Middleburg issues a Zoning Location Permit first — required for a deck, shed, fence, detached garage, or any work that also needs a Loudoun County building permit. The county issues the building permit after that. Typical Deck Detail still applies to the county building set when the design qualifies; published county fees inside an incorporated town are $100 for Typical under 1,000 sq ft (building permit only) and $230 for full plans under 1,000 sq ft. Outside Town those same county paths are $265 and $395 because they include county zoning. Town zoning has its own fee — we put the current Town amount in the written estimate.",
      "If the parcel is in the Middleburg Historic District, exterior work — including a new deck — needs a Certificate of Appropriateness from the Historic District Review Committee. Complete applications are due 14 days before the meeting. A county permit is not a COA, and a COA is not a building permit. We submit what applies in parallel so the layers do not stack.",
      "What you get is the paperwork product: Town or unincorporated county, Typical vs full plans, and whether HDRC review is in play. We prepare the Town zoning set and the county LandMARC building set. We install to the Virginia Uniform Statewide Building Code and the approved Typical Detail or stamped plans, and document each inspection.",
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
      "Real Elite Contracting remodels Leesburg homes — kitchens, baths, additions, and whole-home work. A Leesburg mailing address is not Town limits. We check the parcel before we file.",
      "Pure interior cosmetic work (paint, cabinet fronts in place, tile-on-tile in an unchanged footprint) usually skips both Town zoning and HOA review. Anything that relocates plumbing or electrical, opens a wall, or changes the exterior needs Loudoun County permits. Inside Town, that county building permit waits on Town zoning. H-1 Old and Historic District exteriors also need a Certificate of Appropriateness.",
      "A county permit is not HOA approval. We submit what applies in parallel so the layers do not stack. We do not publish invented kitchen or bath price bands, and we do not claim completed Loudoun project counts we cannot show.",
      "Written scope, line-item estimate, inspections documented.",
    ],
  },

  'remodeling-ashburn-va': {
    paragraphs: [
      "Real Elite Contracting remodels Ashburn homes — kitchens, baths, finished lower levels, and whole-home work. Ashburn is unincorporated Loudoun County. Building and zoning run through LandMARC.",
      "Interior work that relocates plumbing or electrical, or that opens a load-bearing wall, needs county permits and, when the wall is structural, stamped drawings. Purely cosmetic interior work usually skips HOA review. Exterior changes (windows, siding, additions, decks) need the association packet in parallel with the county set. Brambleton reviews essentially all exterior changes. We do not publish One Loudoun color lists from blogs.",
      "We do not claim a pipeline of completed Ashburn projects we cannot show, and we do not publish invented remodel price bands. The written estimate is the number.",
      "Inspections documented. The written estimate is the number.",
    ],
  },

  'remodeling-loudoun-county-va': {
    paragraphs: [
      "Real Elite Contracting remodels Loudoun County homes — kitchens, baths, additions, and whole-home work — and we lead the western corridor first. Leesburg, Purcellville, and Middleburg issue town zoning before the county building permit. Everywhere else, LandMARC handles building and zoning.",
      "A county permit is not HOA approval. Exterior scopes run both tracks in parallel. Historic-district exteriors in Old Town Leesburg or Middleburg add a Certificate of Appropriateness. Load-bearing changes need stamped structural drawings before the county will issue.",
      "We do not publish invented kitchen or bath price bands, named fixture packages as if they were standard, or completed-project counts we cannot show. Line items go in the written estimate.",
      "Discuss communication and the inspection sequence.",
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
      "We do not publish HOA color lists from blogs, and we do not invent ROI rankings or siding price bands. House wrap, window and door flashing, and a moisture check of the sheathing are part of the scope we write down.",
      "Current Town and county fees go in the written estimate. Manufacturer warranties are registered when the product qualifies.",
    ],
  },

  'siding-ashburn-va': {
    paragraphs: [
      "Real Elite Contracting installs and replaces siding for Ashburn homeowners. Ashburn is unincorporated Loudoun County. Building and zoning run through LandMARC. We do not advertise a James Hardie or manufacturer Pro badge we do not hold.",
      "Siding is an exterior change. A county permit is not HOA approval. Brambleton reviews essentially all exterior changes, including color and material. Broadlands requires Modifications Subcommittee written consent before visible exterior work. For One Loudoun and Ashburn Farm we use the current packet — no blog color lists.",
      "We inspect sheathing before we cover it, install house wrap and flashing, and put published county fees plus the association's current review window in the written estimate.",
      "Manufacturer warranties are registered when the product qualifies.",
    ],
  },

  'siding-loudoun-county-va': {
    paragraphs: [
      "Real Elite Contracting installs and replaces siding across Loudoun County — vinyl, fiber cement, and stone veneer when the job calls for them. We work the western corridor first. We do not advertise a James Hardie certification or manufacturer Pro badge we do not hold, and we do not publish invented siding price bands.",
      "Leesburg, Purcellville, and Middleburg issue town zoning first. Historic-district exteriors need a Certificate of Appropriateness. Unincorporated parcels use LandMARC for building and zoning. A county permit is not HOA approval. Brambleton reviews essentially all exterior changes. South Riding requires written Architectural Standards approval before exterior work.",
      "Substrate, weather barrier, weep screed, and flashing are in the written scope when the wall needs them. Color and profile come from the current association packet, not a blog list.",
      "Fees and review days go in the estimate. Manufacturer warranties are registered when the product qualifies. Review the proposed scope and warranty terms before signing.",
    ],
  },

  // ── BATHROOMS ────────────────────────────────────────────────────────────

  'bathrooms-martinsburg-wv': {
    metaTitle: 'Martinsburg Bathroom Remodels | Real Elite',
    metaDescription:
      'Bathroom remodels in Martinsburg. The city lists bath remodels as permit work. Berkeley County reviews parcels outside city limits.',
    paragraphs: [
      "A Martinsburg bathroom is something we assess on the walkthrough. An older primary bath may be a small plaster room with one wet wall and a tub that was never built as a walk-in shower. A later builder bath may have a fiberglass surround, a vanity that does not hold what the room needs, and a fan that does not clear the space. Those are conditions to check at the individual home.",
      "A Martinsburg mailing address is not city limits. Inside the city, the Planning Department at City Hall, 232 N. Queen Street, issues the building permit. The city's published examples of permit work include remodeling bathrooms, plus plumbing and electrical systems. Applications go through MGO Connect. The Planning Department's published number is (304) 264-2131.",
      "Outside the city, Berkeley County Building Permits and Inspections at 400 West Stephen Street, Suite 202, requires a permit to alter a building or to replace plumbing, electrical, gas, or mechanical systems. The county office publishes 304-264-1966. We check the parcel before we file. This page does not publish a Martinsburg bathroom price.",
      "The written estimate itemizes the wet-area work, the fixture moves, and the trades the permit covers. WV Contractor License WV062432.",
    ],
  },

  'bathrooms-charles-town-wv': {
    metaTitle: 'Charles Town Bathroom Remodels | Real Elite',
    metaDescription:
      'Bathroom remodels in Charles Town. City permits cover remodels and plumbing. Jefferson County reviews parcels outside the city limits.',
    paragraphs: [
      "A Charles Town bathroom is checked at the house, not assigned by neighborhood. An older bath can be a tight plaster room that shares a plumbing stack with the kitchen. A later builder bath can be a tub-shower combo and a single vanity. We confirm the layout, the stack, and the ventilation on site.",
      "Inside Charles Town city limits, the Building Inspection office at City Hall, 101 E. Washington Street, requires a building permit for remodels, and its published list also names plumbing and electrical. Apply in person or through MGO. The Department of Community Development is at 304-724-3248. The city publishes the codes it enforces, including the International Residential Code 2018, on that Building Inspection page.",
      "A Charles Town mailing address outside the city is Jefferson County. The Office of Building Permits and Inspections, 116 East Washington Street, Suite 100, requires permits for remodeling and for plumbing, mechanical, and electrical work (304-725-2998, permits@jeffersoncountywv.org). County filings go through MGO Connect, which the county launched on August 25, 2025. We check the parcel before we file. This page does not publish a Charles Town bathroom price.",
      "The written estimate itemizes waterproofing, the fixture layout, and whichever trades the permit names. WV Contractor License WV062432.",
    ],
  },

  'bathrooms-frederick-md': {
    paragraphs: [
      "Frederick, Maryland is the strongest bathroom-remodel market in our service area. The mix of historic downtown homes near Market Street and Carroll Creek, established mid-century neighborhoods, and the explosive growth in Ballenger Creek, Urbana, Jefferson, and New Market means we see the full spectrum of bathroom work — from gut renovations of original 1920s tile bathrooms to primary-suite upgrades in 1990s colonials hitting the 25-year mark.",
      "Real Elite Contracting builds Frederick bathrooms with Schluter-Kerdi waterproofing systems behind every shower, real tile setting (no shortcuts on substrate or backer board), and curbless walk-in shower designs that are increasingly the standard request. We handle plumbing relocation, electrical and lighting upgrades to current Maryland code, custom vanity builds, and the dozens of finish decisions that separate a remodel that looks great in year five from one that doesn't.",
      "Typical Frederick bathroom investment in 2026 lands in the $20,000–$45,000 range for a full primary suite — depending on tile selection, fixture tier (Moen / Delta vs. Brizo / Hansgrohe / Kohler Artifacts), shower complexity, and whether the layout changes. Powder rooms run $8,000–$15,000. Guest baths fall in between. We bring a detailed line-item estimate to your free walkthrough so you can see exactly where the budget is going before signing anything.",
      "Frederick County permits are required for any work involving plumbing, electrical, or structural changes, and the county is fairly strict about inspections. We handle the entire permitting and inspection process — rough-in, electrical, final — so you're not chasing paperwork on your own remodel. Discuss site supervision, communication, and cleanup arrangements during the estimate.",
    ],
  },

  'bathrooms-leesburg-va': {
    paragraphs: [
      "Real Elite Contracting remodels Leesburg bathrooms — showers, tile, vanities, and full primary-suite rebuilds. A Leesburg mailing address is not Town limits. We check the parcel before we file.",
      "Plumbing or electrical relocation needs a Loudoun County building permit (and the matching trade permits). Inside Town, that county permit waits on Town zoning. A purely interior bath with no window or exterior change usually skips HOA review; a new window, skylight, or exterior wall opening does not. H-1 exteriors need a Certificate of Appropriateness.",
      "We do not publish invented bathroom price bands or named fixture packages as if they were standard. Waterproofing, slope-to-drain, and the inspection sequence (rough plumbing, rough electrical, final) are in the written scope. Line items go in the estimate.",
      "Discuss site supervision and communication.",
    ],
  },

  'bathrooms-ashburn-va': {
    metaTitle: 'Bathroom Remodel Ashburn VA | Real Elite Contracting',
    h1: 'Bathroom Remodel Ashburn VA',
    metaDescription:
      'Bathroom remodel Ashburn VA in Brambleton, Broadlands, One Loudoun, Ashburn Farm, and Belmont Greene. No Ashburn price on this page. Free written estimate.',
    includeLocalBusiness: true,
    faqs: [
      {
        question: 'Do you remodel bathrooms in Brambleton and Broadlands?',
        answer:
          'Yes. A bathroom remodel in Ashburn, VA also covers One Loudoun, Ashburn Farm, and Belmont Greene when the parcel is in those communities. Ashburn is unincorporated Loudoun County, so the building permit path is LandMARC.',
      },
      {
        question: 'What does a bathroom remodel in Ashburn, VA cost?',
        answer:
          'This page does not publish an Ashburn bathroom price. Waterproofing, the shower assembly, tile, and any plumbing move are separate lines on the written estimate. A nearby-market cost guide is linked below. It is not an Ashburn quote.',
      },
      {
        question: 'Who permits a bathroom remodel in Ashburn?',
        answer:
          'Loudoun County, through LandMARC, when the work needs a building permit. Plumbing or electrical relocation needs trade permits. Association review usually applies only if a window, skylight, or other exterior element changes.',
      },
    ],
    paragraphs: [
      'A bathroom remodel in Ashburn, VA is a wet-area job, not a fixture swap with a new city name on it. We work Brambleton, Broadlands, One Loudoun, Ashburn Farm, and Belmont Greene. Ashburn is unincorporated Loudoun County. Building and zoning run through LandMARC.',
      'Most of the risk is behind the tile. A shower conversion needs a sloped pan, a waterproofing layer, and a drain that is already in the right place or is moved on a permit. A vanity move is a plumbing relocation, not a cabinet decision. We open the wall, confirm the substrate, and put that finding in the scope before the finish schedule is locked.',
      'This page does not publish an Ashburn bathroom price, and it does not treat a nearby-market range as if it were yours. Waterproofing and slope-to-drain are in the written scope. The estimate is line-itemed. The schedule depends on scope, selections, permits, and how much of the existing tile has to come out.',
      'County inspections run in published order: rough plumbing, rough electrical, then final. Association review usually applies only if the bath changes a window, skylight, or other exterior element. A county permit is not association approval when both apply.',
    ],
  },

  'bathrooms-loudoun-county-va': {
    paragraphs: [
      "Real Elite Contracting remodels Loudoun County bathrooms and we lead the western corridor first. Leesburg, Purcellville, and Middleburg issue town zoning before the county building permit when the work needs one. Unincorporated parcels use LandMARC.",
      "Plumbing or electrical relocation needs county trade permits and inspections. Exterior openings need the association packet in parallel. Historic-district exteriors need a Certificate of Appropriateness. Load-bearing changes need stamped drawings.",
      "We do not publish invented bathroom price bands or named fixture catalogs as if they were the standard package. Waterproofing, slope-to-drain, and the inspection order are in the written scope.",
      "Discuss site supervision.",
    ],
  },

  'bathrooms-winchester-va': {
    paragraphs: [
      "Winchester, Virginia bathroom remodels are a strong segment of the local home-improvement market. The mix of historic Old Town homes near Loudoun Street, the Shawnee District, and the rapidly growing Senseny Road / Route 7 corridor means we see everything from gut renovations of century-old bathrooms to primary-suite refreshes in 2000s subdivisions. Real Elite Contracting brings the same quality standard to both.",
      "Most Winchester bathroom projects we build feature walk-in shower conversions (curbless options where the substrate allows), real tile work — floor, walls, and niches — vanity and fixture replacement, plumbing relocation as needed, and the lighting and ventilation upgrades that turn a bathroom from functional into actually enjoyable. Schluter-Kerdi waterproofing systems are standard on every shower, not an upsell — that detail is what separates a 25-year bathroom from one that has moisture problems by year 8.",
      "Typical Winchester primary bathroom investment in 2026 runs $18,000–$40,000 depending on layout, tile selection, and fixture tier. Hall baths and guest baths fall in the $12,000–$25,000 range. Powder rooms run $6,000–$13,000. We bring detailed line-item estimates so there's no ambiguity about what's included — and no surprise change orders after the demo crew arrives.",
      "Frederick County permits cover most Winchester bathroom work involving plumbing or electrical changes. For homes in the historic district along Loudoun Street and around the Old Town Walking Mall, additional historic-district review may apply — we coordinate that submission as part of the workflow. Discuss site supervision, communication, and cleanup arrangements during the estimate.",
    ],
  },

  // ── KITCHENS ─────────────────────────────────────────────────────────────

  'kitchens-martinsburg-wv': {
    metaTitle: 'Martinsburg Kitchen Remodels | Real Elite',
    metaDescription:
      'Kitchen remodels in Martinsburg. City of Martinsburg permits inside city limits; Berkeley County permits the parcels outside them.',
    paragraphs: [
      "A Martinsburg kitchen is read at the house. An older kitchen may still be a small original room, with plaster walls and plumbing that was never laid out for an island. A later plan may have builder cabinets, a peninsula, and a wall that may or may not be the one you can open into the dining room. We confirm the layout and the structure before we price the work.",
      "A Martinsburg mailing address is not city limits. Inside the city, the Planning Department at City Hall, 232 N. Queen Street, lists remodeling kitchens among the projects that need a building permit before work starts. The same permit covers plumbing and electrical when those systems change. Apply through MGO Connect. The Planning Department publishes (304) 264-2131.",
      "Outside city limits, Berkeley County Building Permits and Inspections at 400 West Stephen Street, Suite 202, requires a permit to alter a building or to replace electrical, gas, mechanical, or plumbing systems. That office publishes 304-264-1966 and takes applications from 8 AM to 5 PM, Monday through Friday. We check the parcel before we file. This page does not publish a Martinsburg kitchen price.",
      "The written estimate itemizes cabinets, counters, and any wall, plumbing, or electrical move the permit has to cover. WV Contractor License WV062432.",
    ],
  },

  'kitchens-charles-town-wv': {
    metaTitle: 'Charles Town Kitchen Remodels | Real Elite',
    metaDescription:
      'Kitchen remodels in Charles Town. City building permits at 101 E. Washington Street; Jefferson County reviews parcels outside city limits.',
    paragraphs: [
      "A Charles Town kitchen is a house-by-house question. An older kitchen can be a small room with plaster, a single window, and a stack shared with the bath. A later builder layout can be stock cabinets, a peninsula, and a dining wall that becomes a structural question if you want it open. We confirm the stack, the cabinets, and the wall on site.",
      "Inside city limits, the Building Inspection office at City Hall, 101 E. Washington Street, requires a building permit for remodels. Plumbing and electrical are on the same published list. Apply in person or through MGO. The Department of Community Development is at 304-724-3248.",
      "Outside the city, a Charles Town address is Jefferson County. The Office of Building Permits and Inspections at 116 East Washington Street, Suite 100, requires permits for remodeling and for plumbing, mechanical, and electrical work. The published contact is 304-725-2998 and permits@jeffersoncountywv.org. County applications go through MGO Connect. We check the parcel before we file. This page does not publish a Charles Town kitchen price.",
      "The written estimate itemizes the cabinet run, the counters, and any plumbing or electrical relocation. WV Contractor License WV062432.",
    ],
  },

  'kitchens-frederick-md': {
    paragraphs: [
      "Frederick, Maryland kitchen remodels are one of the most-requested project types in our pipeline. Frederick's mix of historic downtown homes, established mid-century neighborhoods, and rapidly growing Ballenger Creek / Urbana / Jefferson construction creates demand across the full price range — gut renovations of 1920s rowhouse kitchens near Market Street, open-concept conversions in 1990s colonials, and primary-kitchen builds in newer suburban construction.",
      "Real Elite Contracting builds Frederick kitchens in the $40,000–$120,000 range, with most landing between $55,000 and $85,000. That includes custom or semi-custom cabinetry, quartz or natural stone counters, layout changes where needed, full appliance replacement, lighting design that actually works, real tile or wood floor refinishing, and the trim and finish work that separates a kitchen that looks great in year five from one that doesn't.",
      "Layout changes — opening kitchens to dining rooms, relocating islands, removing load-bearing walls — are a recurring request in Frederick's older homes. We engage a structural engineer when load-bearing walls are involved, pull the necessary Frederick County permits, and coordinate the inspections. We tell you upfront which walls can come down and which can't, and what each option actually costs.",
      "Kitchen remodels are long projects in any market and Frederick is no exception. The project schedule depends on scope, approvals, selections, and availability. Discuss site supervision, communication, and cleanup arrangements during the estimate. Most Frederick kitchen projects also involve some flooring extension into adjacent rooms — we coordinate that scope as part of the project.",
    ],
  },

  'kitchens-leesburg-va': {
    paragraphs: [
      "Real Elite Contracting remodels Leesburg kitchens — layout, cabinetry, counters, and the trades behind the walls. A Leesburg mailing address is not Town limits.",
      "Opening a load-bearing wall needs stamped structural drawings and a Loudoun County building permit. Plumbing or electrical relocation needs the matching trade permits. Inside Town, the county building permit waits on Town zoning. HOA review usually applies only if the kitchen changes windows or another exterior element. H-1 exteriors need a Certificate of Appropriateness.",
      "We do not publish invented kitchen price bands or named appliance packages as if they were standard. Cabinet lead time is what it is — we put the real weeks in the written timeline before demo.",
      "Discuss site supervision, communication, and cleanup arrangements during the estimate.",
    ],
  },

  'kitchens-ashburn-va': {
    metaTitle: 'Kitchen Remodel Ashburn VA | Real Elite Contracting',
    h1: 'Kitchen Remodel Ashburn VA',
    metaDescription:
      'Kitchen remodel Ashburn VA for Brambleton, Broadlands, One Loudoun, Ashburn Farm, and Belmont Greene. National HomeAdvisor ranges, not an Ashburn quote.',
    includeLocalBusiness: true,
    faqs: [
      {
        question: 'Do you remodel kitchens in Brambleton and Broadlands?',
        answer:
          'Yes. A kitchen remodel in Ashburn, VA also covers One Loudoun, Ashburn Farm, and Belmont Greene when the parcel is in those communities. Ashburn is unincorporated Loudoun County, so the building permit path is LandMARC.',
      },
      {
        question: 'What does a kitchen remodel in Ashburn, VA cost?',
        answer:
          'The kitchen cost guide on this site cites HomeAdvisor national figures: a typical range of $14,589 to $41,559, an average of $26,945, and a total makeover of $65,000 to $130,000 or more. Those are national figures, not an Ashburn quote. Your written estimate is line-itemed.',
      },
      {
        question: 'Who permits a kitchen remodel in Ashburn?',
        answer:
          'Loudoun County, through LandMARC. A load-bearing opening needs stamped drawings and a county building permit. Plumbing or electrical relocation needs trade permits. Association review usually applies only if a window or other exterior element changes.',
      },
    ],
    paragraphs: [
      'A kitchen remodel in Ashburn, VA starts with the house in front of us, not a package. We work Brambleton, Broadlands, One Loudoun, Ashburn Farm, and Belmont Greene. Ashburn is unincorporated Loudoun County. Building and zoning run through LandMARC.',
      'Opening a load-bearing wall needs stamped structural drawings and a county building permit. Moving a sink or a range circuit is a trade permit, not a finish selection. Association review usually applies only if a window or other exterior element changes. A county permit is not association approval when both apply.',
      'The kitchen cost guide on this site cites HomeAdvisor national figures: a typical range of $14,589 to $41,559, an average of $26,945, and a total makeover of $65,000 to $130,000 or more. Those are national figures, not an Ashburn quote. Cabinets, counters, appliances, and any wall or trade move are separate lines on the written estimate.',
      'We do not claim an Ashburn kitchen starts on a set cadence. Cabinet lead time is named in the estimate before demo. The written estimate is the number for the house.',
    ],
  },

  'kitchens-loudoun-county-va': {
    paragraphs: [
      "Real Elite Contracting remodels Loudoun County kitchens and we lead the western corridor first. Towns (Leesburg, Purcellville, Middleburg) issue zoning before the county building permit when the work needs one. Unincorporated parcels use LandMARC.",
      "Load-bearing changes need stamped drawings. Plumbing and electrical relocation need trade permits. Exterior openings need the association packet in parallel. Historic-district exteriors need a Certificate of Appropriateness.",
      "We do not publish invented kitchen price bands or named appliance catalogs as if they were the standard package. Cabinet and stone lead times go in the written timeline before demo. Adjacent rooms stay on one contract when they are part of the same job.",
      "Discuss site supervision and communication.",
    ],
  },

  'kitchens-winchester-va': {
    h1: 'Kitchen Remodel Winchester VA',
    metaTitle: 'Kitchen Remodel Winchester VA | Real Elite',
    metaDescription:
      'Kitchen remodel Winchester VA for Old Town and the Route 7 corridor. City permits inside limits; Frederick County, Virginia permits outside.',
    relatedGuideSlugs: ['kitchen-remodel-cost-wv-md-va-2026'],
    paragraphs: [
      "A kitchen remodel in Winchester, VA starts with which jurisdiction the house is actually in. Old Town along Loudoun Street and the Walking Mall is the City. A Winchester mailing address along Route 7, Senseny Road, or the Shawnee edge can sit in Frederick County, Virginia. We check the parcel before we file.",
      "Inside the City, building permits run through City of Winchester Zoning and Inspections on the City permit portal. The 2021 Virginia Uniform Statewide Building Code is what the City reviews against. Outside City limits, Frederick County, Virginia issues the building permit. Opening a load-bearing wall needs stamped structural drawings on whichever set applies. Plumbing relocation needs the matching trade permit. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work, and that scope stays on the estimate as its own line.",
      "Historic-district review can apply in Old Town before materials are locked. An association review, when the lot has one, is a separate track from the City or county building permit. This page does not publish a Winchester-only kitchen price. The ranges further down are the regional kitchen tiers already published on the kitchen service, not a Winchester survey. The regional cost guide covers the Eastern Panhandle, Frederick, Maryland, and Loudoun County; it is linked here as that published tier source, not as a Winchester study.",
      "The written estimate itemizes cabinets, counters, and any wall or plumbing move the permit has to cover. Cabinet lead time goes in the written timeline before demo. Discuss site supervision, communication, and cleanup arrangements during the estimate.",
    ],
  },

  'basements-leesburg-va': {
    h1: 'Basement Finishing Leesburg VA',
    metaTitle: 'Basement Finishing Leesburg VA | Real Elite',
    metaDescription:
      'Basement finishing Leesburg VA. Typical county path is 1% plus a $65 minimum; a kitchen adds $165. Town zoning first inside Town limits.',
    relatedGuideSlugs: [
      'basement-remodeling-cost-ashburn-leesburg-2026',
      'luxury-basement-finishing-loudoun-northern-virginia-2026',
      'loudoun-county-permits-hoa-guide-2026',
    ],
    paragraphs: [
      "Real Elite Contracting finishes Leesburg lower levels — family rooms, a bath, or an in-law suite when the floor plan and egress allow it. We work the Town and western Leesburg first. A Leesburg mailing address is not Town of Leesburg limits: Lansdowne and River Creek often carry a Leesburg address and sit in unincorporated Loudoun. We check the parcel before we file.",
      "What you get is the paperwork product: Town or unincorporated county, Typical versus full plans, and whether a Certificate of Appropriateness is in play. We prepare the Town eTRAKiT zoning set and the county LandMARC building set. County inspections run in published order — trade rough-ins before building framing, insulation before cover, then finals.",
      "We install to the Virginia Uniform Statewide Building Code and the approved Typical Detail or stamped plans, and document each inspection. This page does not publish a Real Elite price band for basement finishing Leesburg VA. The cost section uses the ranges the Ashburn and Leesburg cost guide already publishes, with that guide's caveat.",
    ],
    sections: [
      {
        id: 'cost',
        title: 'Cost',
        paragraphs: [
          "The price source for basement finishing Leesburg VA is the Ashburn and Leesburg basement cost guide, not a new estimate written for this page. Mayflower Virginia publishes Northern Virginia basement tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. These are one contractor's planning ranges, not Real Elite prices or a Loudoun County average.",
          "The same guide gives a separate example of a 1,000-square-foot basement with one bathroom starting around $115,000–$165,000. That example does not describe every project in the tier table. Do not multiply a generic starting rate by floor area and assume the result includes a bathroom.",
        ],
        links: [
          {
            href: '/blog/basement-remodeling-cost-ashburn-leesburg-2026',
            label: 'Ashburn and Leesburg basement cost guide',
          },
          {
            href: '/services/basements/loudoun-county-va',
            label: 'Basement finishing Loudoun County',
          },
        ],
      },
      {
        id: 'timeline',
        title: 'Timeline',
        paragraphs: [
          "The luxury basement guide is the schedule source for Leesburg. The project schedule depends on scope, approvals, selections, and availability. In Town, that sequence starts with the parcel check: Town limits versus a Leesburg mailing address in Lansdowne or River Creek. Town zoning, when the house is inside Town, has to be approved before Loudoun County releases the building permit. Finish selections do not go on the written timeline until that order is clear.",
        ],
        links: [
          {
            href: '/blog/luxury-basement-finishing-loudoun-northern-virginia-2026',
            label: 'Luxury basement finishing guide',
          },
        ],
      },
      {
        id: 'egress',
        title: 'Egress',
        paragraphs: [
          "A bedroom in a Leesburg lower level needs an emergency egress window. Sill height, opening size, and window-well dimensions go on the plans, and that opening is exterior work. In the H-1 Old and Historic District it also needs a Certificate of Appropriateness. The cost guide says to check the escape arrangement before calling the room a bedroom. An existing window's presence alone does not establish compliance. HOA review usually applies only when that new window or door is cut.",
        ],
        links: [
          {
            href: '/blog/basement-remodeling-cost-ashburn-leesburg-2026',
            label: 'Cost guide: bedroom escape',
          },
          {
            href: '/blog/luxury-basement-finishing-loudoun-northern-virginia-2026',
            label: 'Luxury guide: egress behind the walls',
          },
        ],
      },
      {
        id: 'permit',
        title: 'Permits',
        paragraphs: [
          "Inside Town limits the order is fixed. The Town's published home-improvement table treats interior or basement finish-out as Town zoning, typically without engineering review, plus a Loudoun County building permit. The county will not release the building permit until Town zoning is approved. Outside Town limits, county building and zoning run through LandMARC.",
          "County work has two paths: Typical Finished Basement Details in lieu of custom drawings, or a complete plan set. Typical cannot be used if the job alters a load-bearing wall, an exterior wall, a beam, or a column. Published Typical fees are 1% of construction cost excluding electrical, mechanical, plumbing, and gas, with a $65 minimum. Full plans add a published $130 plan review fee. A kitchen in the basement adds a published $165 county zoning fee. Trade permits are separate. Moisture comes first: perimeter check, sump if one exists, vapor control under the finish floor.",
        ],
        links: [
          {
            href: '/blog/basement-remodeling-cost-ashburn-leesburg-2026',
            label: 'Published Loudoun basement fees',
          },
          {
            href: '/blog/loudoun-county-permits-hoa-guide-2026',
            label: 'Loudoun County permits and HOA guide',
          },
        ],
      },
    ],
  },

  'basements-ashburn-va': {
    metaDescription:
      'Finished basements in Ashburn. Typical Loudoun path is 1% plus $65 minimum; a kitchen adds $165. LandMARC plus HOA when egress is cut.',
    paragraphs: [
      "Real Elite Contracting finishes Ashburn lower levels — family rooms, a bath, or an in-law suite when the floor plan and egress allow it. Ashburn is unincorporated Loudoun County, not a town. Building and zoning run through LandMARC. We work Brambleton, Broadlands, Ashburn Farm, and One Loudoun when the parcel sits in those associations.",
      "Every finished basement needs a Loudoun County building and zoning application, plus trade permits for electrical, plumbing, mechanical, and gas when those systems are in the job. Typical Finished Basement Details can stand in for custom drawings unless the job alters a load-bearing wall, an exterior wall, a beam, or a column. Published Typical fees are 1% of construction cost excluding those trades, with a $65 minimum. Full plans add a published $130 plan review fee. A kitchen in the basement adds a published $165 zoning fee. A bedroom needs an emergency egress window; that opening is exterior work.",
      "A county permit is not HOA approval. We file the association packet in parallel when we cut a new window or door. Brambleton reviews essentially all exterior changes; the Covenants Committee typically meets the second Monday, applications due 9:00 AM Friday ten days prior, decision letters usually 5–7 business days after. Broadlands needs Modifications Subcommittee written consent before visible exterior work; applications due noon Wednesday one week prior. For One Loudoun and Ashburn Farm we use the current packet — we do not invent approved-color lists. Moisture comes first. We do not publish invented basement price bands or claim a pipeline of finished Ashburn lower levels we cannot show.",
      "What you get is the paperwork product: Typical vs full plans, which association reviews the lot, and the LandMARC set plus the ARC packet when egress is in play. County inspections: trade rough-ins before building framing, insulation before cover, then finals. We install to the Virginia Uniform Statewide Building Code and the approved Typical Detail or stamped plans, and document each inspection.",
    ],
  },

  'basements-loudoun-county-va': {
    h1: 'Basement Finishing Loudoun County',
    metaTitle: 'Basement Finishing Loudoun County | Real Elite',
    metaDescription:
      'Basement finishing Loudoun County. Typical path is 1% plus a $65 minimum; full plans add $130. Western corridor first.',
    relatedGuideSlugs: [
      'basement-remodeling-cost-ashburn-leesburg-2026',
      'luxury-basement-finishing-loudoun-northern-virginia-2026',
      'loudoun-county-permits-hoa-guide-2026',
    ],
    paragraphs: [
      "Real Elite Contracting finishes Loudoun County lower levels and leads with the western corridor — Purcellville, Round Hill, Lovettsville, western Leesburg, and selected Middleburg — because that is the practical truck path from Martinsburg.",
      "Town and county are different filings. Leesburg, Purcellville, and Middleburg issue town zoning before the county will release a building permit. Unincorporated parcels use LandMARC for building and zoning. We name which one the parcel is before the estimate is a commitment.",
      "We install to the Virginia Uniform Statewide Building Code and the approved Typical Detail or stamped plans, and document each inspection. Wine cellars and media rooms are not the typical brief on this page. The luxury basement guide covers that room program. This page is the hiring page for basement finishing Loudoun County.",
    ],
    sections: [
      {
        id: 'cost',
        title: 'Cost',
        paragraphs: [
          "Published planning ranges for basement finishing Loudoun County live in the Ashburn and Leesburg cost guide. Mayflower Virginia's Northern Virginia tiers are $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. These are one contractor's planning ranges, not Real Elite prices or a Loudoun County average.",
          "Denny + Gardner describes an overall labor-and-materials range of about $50,000 to upward of $100,000 for an upscale renovation, with waste disposal, equipment, design, and permits as other budget considerations. The two sources use different scopes. Do not average them into a county number. A house in Purcellville or Round Hill is quoted from that house, not from the Ashburn tier table.",
        ],
        links: [
          {
            href: '/blog/basement-remodeling-cost-ashburn-leesburg-2026',
            label: 'Ashburn and Leesburg basement cost guide',
          },
          {
            href: '/services/basements/leesburg-va',
            label: 'Basement finishing Leesburg VA',
          },
        ],
      },
      {
        id: 'timeline',
        title: 'Timeline',
        paragraphs: [
          "How long basement finishing takes in Loudoun County is the sentence in the luxury basement guide: the project schedule depends on scope, approvals, selections, and availability. Incorporated towns add a step the unincorporated county does not. Leesburg, Purcellville, and Middleburg issue town zoning before the county building permit. Unincorporated parcels go through LandMARC only. That path goes in the written timeline before demo.",
        ],
        links: [
          {
            href: '/blog/luxury-basement-finishing-loudoun-northern-virginia-2026',
            label: 'Luxury basement finishing guide',
          },
        ],
      },
      {
        id: 'egress',
        title: 'Egress',
        paragraphs: [
          "A bedroom needs an emergency egress window anywhere in the county. On a western-corridor lot the cut is often the first exterior change an association or a historic district sees. The luxury guide treats code-compliant egress as work behind the walls, not a finish upgrade. The cost guide asks for the escape arrangement to be documented before finishes are priced. A county permit is not HOA approval, and an egress cut in Old Town Leesburg or the Middleburg Historic District also needs a Certificate of Appropriateness. Moisture comes first: perimeter check, sump if one exists, vapor control under the finish floor.",
        ],
        links: [
          {
            href: '/blog/luxury-basement-finishing-loudoun-northern-virginia-2026',
            label: 'Luxury guide: code-compliant egress',
          },
          {
            href: '/blog/basement-remodeling-cost-ashburn-leesburg-2026',
            label: 'Cost guide: document the escape first',
          },
        ],
      },
      {
        id: 'permit',
        title: 'Permits',
        paragraphs: [
          "Every finished basement needs a Loudoun County building and zoning application, plus trade permits when electrical, plumbing, mechanical, or gas is in the job. Typical Finished Basement Details can stand in for custom drawings unless the job alters a load-bearing wall, an exterior wall, a beam, or a column. Published Typical fees are 1% of construction cost excluding those trades, with a $65 minimum. Full plans add a published $130 plan review fee. A kitchen in the basement adds a published $165 zoning fee.",
          "Leesburg, Purcellville, and Middleburg issue town zoning first. The county will not release the building permit without it. County inspections run in published order: trade rough-ins before building framing, insulation before cover, then finals.",
        ],
        links: [
          {
            href: '/blog/basement-remodeling-cost-ashburn-leesburg-2026',
            label: 'Published Loudoun basement fees',
          },
          {
            href: '/blog/loudoun-county-permits-hoa-guide-2026',
            label: 'Loudoun County permits and HOA guide',
          },
          {
            href: '/services/basements/leesburg-va',
            label: 'Leesburg town-zoning path',
          },
        ],
      },
    ],
  },

  // ── BASEMENTS ────────────────────────────────────────────────────────────

  /**
   * Eastern Panhandle basements. These carry the best commercial positions on
   * the site — "basement remodeling ranson wv" at 3.2, "basement remodel ranson
   * wv" at 5.1, "basement remodeling inwood wv" at 5.7 — all currently answered
   * by a generic /service-areas/ page with a template snippet.
   *
   * No whole-project WV basement range is published anywhere on the site, so
   * these deliberately do NOT quote one. The egress window figure is published
   * (see the basement-egress-window-cost guide) and is used instead: it is true,
   * specific, and it is the line item that actually catches WV homeowners out.
   */
  'basements-ranson-wv': {
    metaTitle: 'Basement Finishing & Remodeling in Ranson, WV | Real Elite',
    metaDescription:
      'Finished basements in Ranson — family room, guest suite, full bath, and the egress window Jefferson County code requires, $3,500 to $6,500 installed.',
    paragraphs: [
      "Ranson has more unfinished basement square footage than almost anywhere else in Jefferson County, and it is nearly all recent. The Flowing Springs and Powhatan Place developments put hundreds of homes up with full-height lower levels roughed for nothing but a furnace, and the families who bought them are now out of room upstairs. That is the typical Ranson brief: a family room, a guest bedroom with its own bath, and somewhere to put the things that have taken over the garage.",
      "The part that catches people out is egress. West Virginia code will not let you call a lower-level room a bedroom without a compliant egress window, and on the newer Ranson builds that usually means cutting the foundation wall and setting a window well. That is a real line item, $3,500 to $6,500 installed, and we put it on the estimate at the start rather than after the framing is up. If your plan does not include a bedroom, you do not need one, and we will tell you that too.",
      "Everything before the finishes decides how the basement ages. We check the perimeter and the slab for moisture before a single stud goes up, verify the sump and its backup, and use an insulated subfloor system where the slab reads cold or damp. Then framing to code, a properly sized HVAC run or a dedicated mini-split rather than a prayer that the existing system reaches, full electrical, and insulation that makes the lower level comfortable in February instead of merely finished.",
      "We pull the Jefferson County permits and meet the inspector ourselves. You get a written, itemized estimate before demolition, covering framing, electrical, plumbing, HVAC, insulation, drywall, flooring and finishes as separate lines, so you can see exactly where the money goes and hold the final invoice against it. Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and Purple Heart recipient. Real Elite Contracting is licensed in West Virginia and Virginia.",
    ],
  },

  'basements-inwood-wv': {
    metaTitle: 'Basement Finishing & Remodeling in Inwood, WV | Real Elite',
    metaDescription:
      'Finished basements in Inwood and the Route 51 corridor — family room, guest suite, full bath, plus the egress window WV code requires from $3,500.',
    paragraphs: [
      "Inwood grew fast and it grew new. The subdivisions along the Route 51 corridor and out toward Gerrardstown Road went up on what was farmland a generation ago, and almost all of them came with a full basement left unfinished. Families here tend to finish them for the same reasons: a second living space that is not the front room, a bedroom for a relative or a returning adult child, and a place for the treadmill that is currently a coat rack.",
      "Berkeley County enforces egress the way the code is written. A lower-level bedroom needs a compliant egress window, which on most Inwood builds means cutting the foundation and setting a well — $3,500 to $6,500 installed, quoted up front, not discovered later. Plenty of Inwood basements do not need one, because the plan is a family room and a bath rather than a bedroom. We will tell you which one you are looking at before you are committed to anything.",
      "Because these houses are newer, the slabs are usually sound and the moisture work is quick, but we still check rather than assume: perimeter inspection, sump and battery backup verified, insulated subfloor where the slab needs it. From there it is code framing, an HVAC run sized for the space or a dedicated mini-split, full electrical, insulation, and the finishes. Skipping the moisture step is the shortcut that shows up three years later in the baseboards.",
      "We handle the Berkeley County permit and the inspections. The estimate is written and itemized before any work starts, with each trade broken out so the number is something you can check rather than something you have to trust. Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and Purple Heart recipient. Real Elite Contracting is licensed in West Virginia and Virginia.",
    ],
  },

  'basements-charles-town-wv': {
    metaTitle: 'Basement Finishing & Remodeling in Charles Town, WV',
    metaDescription:
      'Finished basements in Charles Town, from historic-district stone cellars to newer full-height builds. Egress windows to Jefferson County code from $3,500.',
    paragraphs: [
      "Charles Town basements come in two very different shapes and the difference decides the whole project. The historic streets around Washington and George sit on older stone or block foundations with lower headroom, uneven floors and, often, a moisture history worth taking seriously. The newer subdivisions out toward Route 9 and the Ranson line have full-height poured walls roughed in for a future finish. We quote them differently because they genuinely are different jobs.",
      "On the older homes, the honest conversation happens before design. Some of those cellars want a dehumidification and drainage plan and a modest finish rather than a full build-out, and we would rather say so than sell you drywall that will not last. Where the headroom and the foundation do support a full finish, the result is worth having: a guest suite, a library or den, a workshop that is not the garage.",
      "Newer Charles Town builds are straightforward, and the main code point is egress. Jefferson County requires a compliant egress window for any lower-level bedroom — $3,500 to $6,500 installed on a typical foundation, on the estimate from the start. Moisture control still comes first regardless of the home's age: perimeter check, sump and backup, insulated subfloor where the slab calls for it.",
      "We pull the Jefferson County permits, coordinate the inspections, and where the property sits in the historic district we handle that review too. Every job starts with a written, itemized estimate. Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and Purple Heart recipient. Real Elite Contracting is licensed in West Virginia and Virginia.",
    ],
  },

  'basements-martinsburg-wv': {
    metaTitle: 'Martinsburg Basement Finishing | Real Elite',
    metaDescription:
      'Finished basements in Martinsburg. Egress windows run $3,500 to $6,500. City permits inside limits; Berkeley County outside.',
    relatedGuideSlugs: ['basement-egress-window-cost-eastern-panhandle-2026'],
    paragraphs: [
      "A Martinsburg basement is one of two jobs, and which one you have is decided on site. An older cellar can sit on stone or block, with lower headroom and a moisture history that has to be read before anyone talks about drywall. A later house can have a full-height lower level that was left as mechanical space. We do not treat a street or a subdivision as one basement type.",
      "A lower-level bedroom needs a compliant egress window. The Eastern Panhandle egress-window guide publishes that opening at $3,500 to $6,500 installed, and that is the figure this page uses. A family room and a bath do not automatically need that cut. We say which one the plan is before the estimate is a commitment.",
      "A Martinsburg mailing address is not city limits. Inside the city, the Planning Department at 232 N. Queen Street implements the West Virginia State Building Code the city has adopted, and it lists a change to the interior of a structure as permit work. Apply through MGO Connect. Outside the city, Berkeley County Building Permits and Inspections at 400 West Stephen Street, Suite 202, requires a permit to alter a building or to replace electrical, mechanical, or plumbing systems (304-264-1966).",
      "Moisture is checked before framing: perimeter, sump if one is there, and the slab. The written estimate itemizes framing, the trades, and the egress opening when the plan includes a bedroom. WV Contractor License WV062432.",
    ],
  },

  'basements-frederick-md': {
    metaDescription:
      'Basement finishing in Frederick, MD — family room, guest suite, full bath, proper moisture control. Most projects run $55,000 to $70,000, itemized up front.',
    paragraphs: [
      "Frederick, Maryland is the strongest basement-finishing market in our service area. The combination of Frederick County's housing stock — most newer homes in Ballenger Creek, Urbana, Jefferson, and New Market have full unfinished basements as standard construction — and the local demand for additional living space at a fraction of an addition's cost makes basement finishing one of the highest-ROI projects a Frederick homeowner can build.",
      "Real Elite Contracting builds Frederick basements that pass inspection on the first walkthrough, every time. Moisture control comes first — sump pump verification, perimeter waterproofing assessment, vapor barrier installation under any framing — because the cheap shortcut on moisture is what creates mold problems in year three. Then code-compliant framing with proper egress windows where required, full electrical and plumbing rough-in to Frederick County code, HVAC extension or dedicated mini-split installation, and the insulation and drywall that turn raw space into living space.",
      "Typical Frederick basement-finishing scope in 2026 runs $35,000–$85,000 depending on square footage and feature mix. Standard finished family room with full bath, wet bar, and laundry rough-in lands around $55,000–$70,000. In-law suites with full kitchens, bedrooms, and accessible bathrooms run higher. We provide detailed line-item estimates with everything broken out — framing, electrical, plumbing, HVAC, insulation, drywall, flooring, finishes — so you see exactly where the budget goes.",
      "Frederick County permits and inspections are required for any basement finishing work — framing, electrical, plumbing, mechanical, final. The inspector sequence matters; we coordinate it so trades don't lose days waiting on each other. Discuss site supervision, communication, and cleanup arrangements during the estimate. Egress windows, fire-blocking, and the other code requirements that separate properly finished basements from problem basements are non-negotiable in our work.",
    ],
  },

  // ── BASEMENTS · NORTHERN VIRGINIA (region) ───────────────────────────────
  //
  // The one combo at region altitude, and the reason the altitude doc exists.
  // "basement remodeling northern virginia" 110/mo KD 0 $31 CPC, "basement
  // finishing northern virginia" 90/mo $99 CPC, "basement remodeling fairfax
  // va" 70/mo $132 CPC — against every town-level basement term in the same
  // market sitting below the reporting floor bar Alexandria and McLean.
  //
  // FAIRFAX COUNTY IS COVERED IN PROSE, NOT AS AN H2. §3.2 of the altitude doc
  // specified a Fairfax County H2 here; ComboContent has no headings, and
  // adding a `sections` shape for a single consumer buys an abstraction the
  // rest of the map would not use. Fairfax County is named substantively in
  // three of the four paragraphs instead. Whether the "fairfax va" query
  // follows this page is a Phase 5 read, and the doc already gates a dedicated
  // /services/basements/fairfax-va page on that answer.
  //
  // Every figure below is an endpoint this site already publishes: $55,000 is
  // the low end of the Burke range, $400,000+ the high end of Great Falls.
  // No new price is introduced here — CLAUDE.md forbids it, and a regional
  // page inventing a regional number would be the easiest way to break it.
  'basements-northern-virginia': {
    // The title takes "basement remodeling" (110/mo) and the description takes
    // "basement finishing" (90/mo), so the page targets both head terms
    // without either field reading as a keyword list. The generic fallback
    // would say "Basements in Northern Virginia", which is neither term.
    metaTitle: 'Basement Remodeling in Northern Virginia | Real Elite',
    metaDescription:
      'Basement finishing across Fairfax, Loudoun and Alexandria. Published scope runs $55,000 in Burke to $400,000+ in Great Falls, itemized before work starts.',
    paragraphs: [
      "Northern Virginia's basement demand is regional before it is local, and the housing stock is why. Fairfax County, Loudoun County and the city of Alexandria were built out largely between the 1960s and the 2000s on full-height unfinished lower levels with walkout or areaway access — square footage the house already has, already heats, and is not using. A homeowner in Vienna, Burke, Ashburn or Belle Haven is usually not shopping for a Vienna contractor or a Burke contractor; they are shopping for someone who finishes lower levels in Northern Virginia, and they narrow down afterwards.",
      "The technical order of work is the same across the region, and the sequence matters more than the finish schedule. Moisture and vapor control come first: perimeter inspection, sump pump and battery backup verification, and dimple-mat or insulated subfloor systems where the slab condition calls for them. The shortcut taken there is the one that resurfaces three years later as a mold problem behind finished cabinetry. From there it is code-compliant framing, egress where bedrooms are planned, full electrical with structured wiring and zoned lighting, HVAC extension or a dedicated mini-split where the existing system will not carry the added load, surround pre-wire, and the millwork and finishes that make the space read as a room rather than a finished basement.",
      "Budget varies more by house than by town, which is the honest version of a regional price. Across the Northern Virginia pages this site publishes, finished lower-level scope runs from $55,000 at the smaller Burke and Reston end to $400,000+ for an estate-scale Great Falls build with a media room, wine room and second entertaining kitchen. Most Fairfax and Loudoun County projects land between those poles, and the variables that move a number are square footage, the feature mix, and how much millwork and stone the build carries. Estimates are issued line by line — framing, electrical, plumbing, HVAC, insulation, drywall, flooring, millwork, stone and finishes broken out separately — so the figure can be read rather than taken on trust.",
      "Permitting is the one part of a Northern Virginia basement that is genuinely not regional. Fairfax County, Loudoun County and the City of Alexandria each run their own permit and inspection process, and a lower level with bedrooms, a bath or a bar needs framing, electrical, plumbing, mechanical and final inspections in whichever jurisdiction the house sits in. Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and Purple Heart recipient. Real Elite Contracting is headquartered in Martinsburg, West Virginia, and licensed and insured in West Virginia and Virginia.",
    ],
    // §2.3 of the architecture doc. The Loudoun luxury-basement guide covers
    // the room programme and finish tiers — theatre, wet bar, wine room, guest
    // suite — which this page deliberately does not, because it is a hiring
    // page and that is a research question. Different intent, so linking it
    // adds a reason to stay rather than a competing landing page.
    relatedGuideSlugs: ['luxury-basement-finishing-loudoun-northern-virginia-2026'],
  },

  // ── BATHROOMS · MCLEAN, VA ───────────────────────────────────────────────
  'bathrooms-mclean-va': {
    paragraphs: [
      "McLean, Virginia is one of the most discerning bathroom-renovation markets in the country. Buyers in Langley Forest, Salona Village, Chesterbrook, and Franklin Park expect primary baths that read as private spas — large-format porcelain, curbless walk-in showers with linear drains, freestanding soaking tubs, double-vanity layouts with stone tops, heated floors, towel warmers, and lighting designed scene by scene. The Northern Virginia market also has a deep bench of architects and designers, and many McLean projects come to us with a designer already engaged. We execute to that design with the precision the relationship requires.",
      "Real Elite Contracting renovates primary baths and powder rooms across McLean with the level of craft this address expects. Typical McLean primary-bath scope in 2026 runs $60,000–$130,000+ depending on size, layout changes, and material grade. Featured projects often include curbless showers with body sprays and rain heads, custom inset cabinetry, slab quartzite or marble counters, premium fixture lines (Brizo, Hansgrohe, Kohler Artifacts), and floors heated underfoot. Powder rooms in McLean homes routinely land in the $15,000–$30,000 range when finishes match the rest of the house.",
      "We respect the architecture of the home. Many McLean primaries sit in the original footprint of a larger home where layout changes — opening to the adjoining closet for a true primary suite, repositioning plumbing for a cleaner shower geometry — make a meaningful difference. We model the changes, value-engineer the parts of the budget that don't change the visible result, and protect the spend for the surfaces and fixtures the eye actually lands on.",
      "Discuss site supervision, communication, and cleanup arrangements during the estimate. Review the proposed scope and warranty terms before signing. Fairfax County permits and inspections are handled by us; communication with the homeowner, the designer, and any HOA architectural review is consolidated through one point of contact.",
    ],
  },

  // ── BATHROOMS · ALEXANDRIA, VA ───────────────────────────────────────────
  'bathrooms-alexandria-va': {
    paragraphs: [
      "Alexandria bathroom renovations require a contractor who can work as comfortably inside a 1790s Old Town townhouse as inside a 1950s Belle Haven center-hall colonial. The city's historic architecture, restrictive layouts, and Old Town Historic District standards make Alexandria primary baths some of the most technically demanding renovations we take on — and some of the most beautiful when they are done with respect for the envelope they live inside.",
      "Real Elite Contracting renovates primary baths and powder rooms across Old Town, Belle Haven, Rosemont, North Ridge, and Beverley Hills with attention to period accuracy where it matters and contemporary spa specification where the design calls for it. Typical Alexandria primary-bath scope in 2026 runs $50,000–$120,000+ depending on the level of structural and plumbing work the floor plan requires. Old Town townhouses often need creative plumbing routing and floor framing reinforcement to support modern fixtures; we engineer those changes properly and document them for the historic-district record where applicable.",
      "Finish work is where Alexandria bathrooms earn their character. We specify period-respectful tile patterns (hex mosaic, marble basketweave, subway with pencil liners), traditional vanity profiles in inset cabinetry, polished nickel or unlacquered brass fittings where the architecture asks for it, and clawfoot or freestanding tubs that are at home in a historic envelope. For more contemporary Belle Haven and Rosemont homes, we shift to large-format slabs, curbless walk-in showers, and clean-lined contemporary fixture lines without losing the workmanship standard.",
      "Old Town Historic District permitting and the city's Board of Architectural Review add a layer to the front of any project that affects building exteriors; for interior bathroom work, standard City of Alexandria permits and Fairfax County (for unincorporated addresses) handle the trade inspections. We carry the paperwork, coordinate the inspection sequence, and keep your name off the bureaucracy. Review the proposed scope and warranty terms before signing.",
    ],
  },

  // ── KITCHENS · MCLEAN, VA ────────────────────────────────────────────────
  'kitchens-mclean-va': {
    paragraphs: [
      "McLean kitchens are some of the most carefully specified residential projects in the country. The combination of the address, the size of the homes, and the architectural and design talent available locally means a McLean primary kitchen is often a $150,000–$400,000+ undertaking — and worth every dollar when the result lands. From estate homes off Old Dominion Drive to refined mid-century properties in Langley Forest and the newer custom builds along Chesterbrook Road, the McLean kitchen brief is consistent: serve the entertaining the family actually does, in a space that reads as bespoke from cabinet to ceiling.",
      "For a kitchen project in McLean, bring any designer or architect drawings to the consultation. Typical scope in 2026 includes custom inset cabinetry from a tier-one shop (often paint-grade or rift-cut white oak), full-slab quartzite or natural-stone countertops with mitered apron edges, integrated panel-front appliance suites (Sub-Zero, Wolf, Miele, La Cornue), professional ventilation that disappears into millwork, scullery or butler's pantry build-outs, and lighting designed as a layered system rather than a single ceiling fixture.",
      "Where there's room to reshape the plan, the highest-impact McLean kitchen work is structural — removing the bearing wall between the original kitchen and dining room, expanding into a former breakfast area, or relocating mechanical to clean up sight lines and ceiling height. We bring a structural engineer in early when those moves are on the table, value-engineer the parts of the budget the eye won't see, and protect the spend for the cabinetry, stone, and fixtures that define the room.",
      "Discuss site supervision, communication, and cleanup arrangements during the estimate. Review the proposed scope and warranty terms before signing. Fairfax County permitting, mechanical and electrical inspections, and coordination with the designer or architect are handled by us — you stay focused on the decisions that actually require you, which are mostly the fun ones.",
    ],
  },

  // ── KITCHENS · ALEXANDRIA, VA ────────────────────────────────────────────
  'kitchens-alexandria-va': {
    paragraphs: [
      "Alexandria kitchens range from museum-quality historic restorations in Old Town townhouses to architecturally substantial colonials and contemporary updates in Belle Haven, Rosemont, North Ridge, and Beverley Hills. Each calls for a different sensibility, and the contractor who delivers consistently in this city is one who can read which sensibility the home is asking for and execute to it without compromise.",
      "Real Elite Contracting builds Alexandria kitchens with the same craft standard we bring to McLean, calibrated to the architectural pedigree of the address. Typical Alexandria primary-kitchen scope in 2026 runs $80,000–$300,000+ depending on the home, the cabinetry brief (inset paint-grade vs. flat-panel walnut vs. period-respectful furniture-style), the stone (honed soapstone, marble, quartzite), and the appliance specification. Old Town historic kitchens are often the most technically demanding — supplemental floor framing, careful electrical re-routing inside plaster walls, mechanical that has to navigate a 19th-century chase — and we handle all of it in-stride.",
      "Old Town Historic District review applies to any change that affects building exteriors; the interior kitchen work itself is permitted through the City of Alexandria for interior renovations, electrical, plumbing, and mechanical. We hold the paperwork and coordinate the trade inspection sequence. For the design itself, we work closely with the kitchen and interior designers Alexandria homeowners typically bring to a project of this size, and we execute the spec the design calls for — not a contractor's interpretation of it.",
      "Discuss site supervision, communication, and cleanup arrangements during the estimate. Review the proposed scope and warranty terms before signing. We work clean, we communicate proactively, and we treat the rest of your home like the historic asset it is.",
    ],
  },

  // ── BASEMENTS · MCLEAN, VA ───────────────────────────────────────────────
  'basements-mclean-va': {
    metaDescription:
      'Lower-level finishing in McLean — media room, wet bar, wine room, guest suite. Most builds run $150,000 to $220,000, with every line itemized up front.',
    paragraphs: [
      "McLean homes generally have generous unfinished lower levels with full ceiling height and walkout access, which makes finished-basement entertainment suites one of the highest-impact projects an estate-class home can build. The McLean basement brief tends to be ambitious: a true media room with tiered seating, a separate wet bar with refrigerated drawers and dishwasher, a guest suite with full bath, a fitness or yoga room, sometimes a wine room. Done right, the lower level adds a full additional tier of livable space to an already substantial home.",
      "Real Elite Contracting builds McLean lower levels to the same standard as the upper floors. Moisture and vapor control come first — perimeter inspection, sump pump and battery backup verification, dimple-mat or insulated subfloor systems where the slab condition requires it — because the cheap shortcut on moisture is the one that surfaces three years later as a mold problem in the cabinetry. From there: code-compliant framing, egress where bedrooms are planned, full electrical with structured wiring and zoned lighting, HVAC extension or dedicated mini-split systems, surround pre-wire, and the millwork and finishes that turn the space into a true room.",
      "Typical McLean basement-finishing scope in 2026 runs $90,000–$250,000+ depending on square footage, feature mix, and the level of millwork and stone in the build. A finished entertainment lower level with media room, wet bar, full bath, guest suite, and gym usually lands in the $150,000–$220,000 range. We provide detailed line-item estimates with framing, electrical, plumbing, HVAC, insulation, drywall, flooring, millwork, stone, and finishes all broken out so the budget is transparent.",
      "Fairfax County permits and inspections are required for framing, electrical, plumbing, mechanical, and final. We coordinate the inspector sequence so trades don't lose days waiting on each other. Review the proposed scope and warranty terms before signing. The project schedule depends on scope, approvals, selections, and availability.",
    ],
  },

  // ── BASEMENTS · ALEXANDRIA, VA ───────────────────────────────────────────
  'basements-alexandria-va': {
    metaDescription:
      'Finished lower levels in Alexandria, from row-house basements to full entertainment levels. Typical scope runs $80,000 to $200,000+, itemized up front.',
    paragraphs: [
      "Alexandria basement work splits cleanly into two categories: historic Old Town townhouse cellars, which need a very specific technical approach (often around moisture, ceiling height, and structure), and the larger walkout or full lower levels in the colonial and contemporary homes of Belle Haven, Rosemont, North Ridge, and Beverley Hills. Real Elite Contracting handles both, and the right answer for each is rarely the same.",
      "For Belle Haven and the post-war neighborhoods, lower-level finishes follow the same playbook as a luxury Fairfax County build: moisture control first, code-compliant framing with proper egress, full electrical and plumbing rough-in, HVAC, surround pre-wire, and millwork that elevates the space. Typical scope runs $80,000–$200,000+ depending on square footage and feature mix — finished family room, full bath, wet bar, guest suite, and dedicated gym or office.",
      "Old Town historic cellars are a different conversation. Ceiling heights, original masonry walls, exposed beam structures, and existing mechanical chases all influence what's possible and what's wise. We often recommend a more restrained finish in these spaces — wine storage, a quiet workshop, a guest room with its own bath — that respects the period character of the home above. Where moisture control or structural reinforcement is required, we do it correctly and document it for the historic record.",
      "Permitting runs through the City of Alexandria for interior work; framing, electrical, plumbing, mechanical, and final inspections are all required. We carry the paperwork and coordinate the sequence. Review the proposed scope and warranty terms before signing.",
    ],
  },

  // ── BATHROOMS · VIENNA, VA ───────────────────────────────────────────────
  'bathrooms-vienna-va': {
    paragraphs: [
      "Vienna is one of the most thoughtful primary-bath markets in Fairfax County — a homeowner population that has done its research, often comes in with a designer already engaged, and expects an installer-grade contractor with the discipline to execute the design as drawn. The homes range from mid-century properties in Wolftrap and Country Club Manor to substantial newer builds along the Maple Avenue corridor and out toward Hunter Mill, and the primary-bath brief tends to be spa-grade and structurally ambitious.",
      "Real Elite Contracting renovates Vienna primary baths and powder rooms with the level of craft Fairfax County's design community expects. Typical Vienna primary-bath scope in 2026 runs $55,000–$110,000+ depending on size, layout changes, and material grade. Featured projects routinely include curbless walk-in showers with linear drains, freestanding soaking tubs, double-vanity layouts with stone tops, slab-edge mitered details, premium fixture lines (Brizo, Hansgrohe, Kohler Artifacts), heated floors, and lighting designed scene by scene rather than a single ceiling fixture.",
      "Where there's room to rework the plan, we engage early — opening a primary into an adjoining closet for a true suite, repositioning plumbing for a cleaner shower geometry, repositioning the toilet to a private compartment for a more refined room. We model the proposed changes, value-engineer the parts of the budget that won't change the visible result, and protect the spend for the surfaces and fixtures the eye actually lands on.",
      "Fairfax County permits, plumbing, electrical, and final inspections are handled by us. Review the proposed scope and warranty terms before signing.",
    ],
  },

  // ── KITCHENS · VIENNA, VA ────────────────────────────────────────────────
  'kitchens-vienna-va': {
    paragraphs: [
      "Vienna primary kitchens are some of the most carefully specified residential projects in Northern Virginia. The combination of the design-aware homeowner population, the architectural variety of the housing stock, and the proximity to Tysons-area showrooms means a typical Vienna kitchen is a $130,000–$300,000+ undertaking executed in close collaboration with the designer, the cabinet shop, and the appliance specialist.",
      "Real Elite Contracting builds Vienna kitchens with that collaboration in mind. Typical scope includes custom inset cabinetry (often paint-grade or rift-cut white oak), full-slab quartzite or natural-stone countertops with mitered apron edges, integrated panel-front appliance suites (Sub-Zero, Wolf, Miele), professional ventilation that disappears into millwork, scullery or butler's pantry build-outs where the plan supports them, and layered lighting from the cans to the in-cabinet to the decorative.",
      "Where there's an opportunity to reshape the plan — removing the bearing wall to the dining room, expanding into a former breakfast area, relocating mechanical to clean up ceiling height — those structural moves often deliver the highest-impact result in a Vienna kitchen. We bring a structural engineer in early when needed, model the changes for the homeowner and designer, value-engineer the parts that won't be visible, and protect the spend for the cabinetry, stone, and fixtures that define the room.",
      "Discuss site supervision, communication, and cleanup arrangements during the estimate. Review the proposed scope and warranty terms before signing. Fairfax County permitting, mechanical and electrical inspections, and coordination with the designer or architect are handled by us — you stay focused on the decisions that actually require you.",
    ],
  },

  // ── BASEMENTS · VIENNA, VA ───────────────────────────────────────────────
  'basements-vienna-va': {
    metaDescription:
      'Finished lower levels in Vienna — media room, wet bar, guest suite, full bath. Most projects run $130,000 to $180,000, itemized before work starts.',
    paragraphs: [
      "Vienna homes typically have generous unfinished lower levels with full ceiling height and walkout access, which makes a finished entertainment lower level one of the highest-impact projects the home can build. The typical Vienna basement brief includes a true media room with tiered seating, a wet bar with refrigerated drawers and dishwasher, a guest suite with full bath, a fitness or yoga room, sometimes a wine room. Done right, the lower level adds a full additional tier of livable space.",
      "Real Elite Contracting builds Vienna lower levels to the same standard as the upper floors. Moisture and vapor control come first — perimeter inspection, sump pump and battery backup verification, dimple-mat or insulated subfloor systems where the slab condition requires it — because the shortcut on moisture is the one that surfaces three years later as a mold problem in the cabinetry. From there: code-compliant framing, egress where bedrooms are planned, full electrical with structured wiring and zoned lighting, HVAC extension or dedicated mini-split systems, surround pre-wire, and the millwork and finishes that turn the space into a true room.",
      "Typical Vienna basement-finishing scope in 2026 runs $80,000–$200,000+ depending on square footage, feature mix, and the level of millwork and stone. A finished entertainment lower level with media room, wet bar, full bath, guest suite, and gym usually lands in the $130,000–$180,000 range. We provide detailed line-item estimates with everything broken out so the budget is transparent.",
      "Fairfax County permits and inspections are required for framing, electrical, plumbing, mechanical, and final. We coordinate the inspector sequence so trades don't lose days waiting on each other. Review the proposed scope and warranty terms before signing. The project schedule depends on scope, approvals, selections, and availability.",
    ],
  },

  // ── BATHROOMS · GREAT FALLS, VA ──────────────────────────────────────────
  'bathrooms-great-falls-va': {
    paragraphs: [
      "Great Falls primary baths are some of the most ambitious residential bathroom projects in the country. The combination of the estate-class housing stock, the architectural and design talent the address attracts, and the homeowner expectation of a primary suite that reads as a private wing means a typical Great Falls primary bath is a $100,000–$200,000+ undertaking executed in close collaboration with the designer and a tier-one cabinet shop.",
      "Real Elite Contracting renovates Great Falls primary baths with the craft this market expects. Featured projects routinely include a separate wet room with curbless walk-in shower and freestanding soaking tub under one envelope, his-and-her vanity towers, a private water closet, heated floors zoned by area, full integrated lighting design, and stone selected slab-by-slab. We work with custom cabinet shops, stone fabricators, and fixture specialists across the metro area, and we execute to whatever specification the design calls for.",
      "On larger Great Falls projects, the primary-bath renovation is often part of a primary-suite expansion that opens into the closet, the adjoining bedroom, or a former secondary room. We bring a structural engineer in early when those changes are on the table, model the geometry for the homeowner and designer, and value-engineer the parts of the budget that won't change the visible result.",
      "Fairfax County permits, plumbing, electrical, and final inspections are handled by us. Review the proposed scope and warranty terms before signing. We work discreetly and respect the rest of the home as the asset it is.",
    ],
  },

  // ── KITCHENS · GREAT FALLS, VA ───────────────────────────────────────────
  'kitchens-great-falls-va': {
    paragraphs: [
      "Great Falls kitchens are designed around catering and entertaining at a scale most residential kitchens aren't built for. The typical brief includes a separate scullery or butler's pantry, professional-spec ventilation, full-height integrated refrigeration and freezer columns, a 60-inch range or a French range from a top-tier maker (La Cornue, Lacanche), a second prep sink, custom inset cabinetry from a tier-one shop, and stone selected slab-by-slab. Project scope routinely lands $200,000–$500,000+ depending on the cabinetry brief, the appliance specification, and the structural changes the plan requires.",
      "For a kitchen project in Great Falls, bring any designer or architect drawings to the consultation. Changes to bearing walls and ceiling heights require a review of the proposed design, professional responsibilities, and contractor qualifications before a scope is agreed.",
      "Discuss site supervision, communication, and cleanup arrangements during the estimate. Review the proposed scope and warranty terms before signing. Fairfax County permitting, mechanical and electrical inspections, and design-team coordination are handled by us.",
      "The project schedule depends on scope, approvals, selections, and availability. We protect the home and the family during the build, schedule deliveries to minimize disruption, and treat the project as a long-term partnership rather than a transaction.",
    ],
  },

  // ── BASEMENTS · GREAT FALLS, VA ──────────────────────────────────────────
  'basements-great-falls-va': {
    metaDescription:
      'Estate-scale lower levels in Great Falls — media room, wet bar, wine room, fitness, guest suite. Most builds run $250,000 to $350,000, fully itemized.',
    paragraphs: [
      "Great Falls lower levels are some of the most ambitious finished-basement projects in our service area. The typical brief includes a media room with tiered seating and acoustic treatment, a true wet bar that functions as a second entertaining kitchen, a wine room with dedicated cooling, a fitness room with rubber flooring and mirrored wall, a guest suite with full bath, and sometimes a separate game room or family lounge. Lower levels at this scale function as an entire additional tier of the home.",
      "Real Elite Contracting builds Great Falls lower levels to the same standard as the upper floors. Moisture and vapor control first — perimeter inspection, sump pump and battery backup verification, dimple-mat or insulated subfloor systems where required — because the shortcut on moisture is the one that surfaces years later. From there: code-compliant framing, egress where bedrooms are planned, full electrical with structured wiring and zoned lighting, dedicated HVAC systems where the existing capacity doesn't carry the load, surround pre-wire, acoustic treatment, and the millwork and stone that turn the space into a true room.",
      "Typical Great Falls basement-finishing scope in 2026 runs $150,000–$400,000+ depending on square footage, feature mix, and the level of millwork and stone in the build. A fully-finished entertainment lower level with media room, wet bar, wine room, fitness, guest suite, and gym usually lands in the $250,000–$350,000 range. We provide detailed line-item estimates with everything broken out.",
      "Fairfax County permits and inspections are required for framing, electrical, plumbing, mechanical, and final. We coordinate the inspector sequence so trades don't lose days waiting on each other. Review the proposed scope and warranty terms before signing. The project schedule depends on scope, approvals, selections, and availability.",
    ],
  },

  // ── BATHROOMS · RESTON, VA ───────────────────────────────────────────────
  'bathrooms-reston-va': {
    paragraphs: [
      "Reston primary baths are some of the most design-aware renovations in Fairfax County. The original villages — Lake Anne, Hunters Woods, North Point, South Lakes — drew design-conscious owners from the start, and the renovation pipeline still reflects that. A typical Reston primary bath is a $50,000–$100,000+ project executed in close collaboration with a designer, with finish quality and execution discipline weighted as heavily as the line items themselves.",
      "Real Elite Contracting renovates Reston primary baths and powder rooms with the level of craft this market expects. Featured projects routinely include curbless walk-in showers with linear drains, freestanding soaking tubs, double-vanity layouts with stone tops, slab-edge mitered details, premium fixture lines, heated floors, and lighting designed scene by scene. For the lakefront homes around Lake Anne and Lake Audubon, we design with the view in mind and the privacy constraints the architecture requires.",
      "Where there's room to reshape the plan, we engage early. Many Reston primaries sit in original footprints that have aged into awkward layouts; opening into a closet, repositioning plumbing for a cleaner shower geometry, or relocating the toilet to a private compartment can transform a functional bathroom into a refined room.",
      "Fairfax County permits, plumbing, electrical, and final inspections are handled by us. Review the proposed scope and warranty terms before signing.",
    ],
  },

  // ── KITCHENS · RESTON, VA ────────────────────────────────────────────────
  'kitchens-reston-va': {
    paragraphs: [
      "Reston kitchens are a strong primary-renovation market — a community of design-conscious owners whose homes were architecturally distinctive on day one and now deserve current-spec interiors. Typical Reston primary-kitchen scope in 2026 runs $100,000–$250,000+ depending on the cabinetry brief, the appliance specification, and the structural changes the plan requires.",
      "For a kitchen project in Reston, bring any designer or architect drawings to the consultation. Featured scope includes custom inset or full-overlay cabinetry from a tier-one shop, full-slab quartzite or natural-stone countertops, integrated panel-front appliance suites (Sub-Zero, Wolf, Miele), professional ventilation, scullery or butler's pantry build-outs where the plan supports them, and layered lighting designed as a system rather than a single ceiling fixture.",
      "Many Reston kitchens benefit from removing the original wall between the kitchen and dining or family room. Where structural changes are on the table, we bring a structural engineer in early, model the geometry for the homeowner and designer, value-engineer the parts that won't be visible, and protect the spend for the cabinetry, stone, and fixtures that define the room.",
      "Discuss site supervision, communication, and cleanup arrangements during the estimate. Review the proposed scope and warranty terms before signing. Fairfax County permitting, mechanical and electrical inspections, and design-team coordination are handled by us.",
    ],
  },

  // ── BASEMENTS · RESTON, VA ───────────────────────────────────────────────
  'basements-reston-va': {
    metaDescription:
      'Finished lower levels in Reston — media room, wet bar, full bath, guest suite. Most projects run $110,000 to $160,000, itemized line by line up front.',
    paragraphs: [
      "Reston homes typically have generous lower levels — often walkouts with full ceiling height — and a finished lower level is one of the highest-impact projects the home can build. The typical Reston basement brief includes a media room, wet bar, full bath, guest suite, and sometimes a dedicated gym or yoga room. The build adds a full additional tier of livable space.",
      "Real Elite Contracting builds Reston lower levels to the same standard as the upper floors. Moisture and vapor control come first — perimeter inspection, sump pump verification, dimple-mat or insulated subfloor systems where required. From there: code-compliant framing, egress where bedrooms are planned, full electrical with structured wiring and zoned lighting, HVAC extension or dedicated mini-split, surround pre-wire, and the millwork and finishes that turn the space into a true room.",
      "Typical Reston basement-finishing scope in 2026 runs $70,000–$180,000+ depending on square footage and feature mix. A finished entertainment lower level with media room, wet bar, full bath, and guest suite usually lands in the $110,000–$160,000 range. We provide detailed line-item estimates with framing, electrical, plumbing, HVAC, insulation, drywall, flooring, millwork, and finishes all broken out.",
      "Fairfax County permits and inspections are required for framing, electrical, plumbing, mechanical, and final. We coordinate the inspector sequence so trades don't lose days waiting on each other. Review the proposed scope and warranty terms before signing. The project schedule depends on scope, approvals, selections, and availability.",
    ],
  },

  // ── BATHROOMS · BURKE, VA ────────────────────────────────────────────────
  'bathrooms-burke-va': {
    paragraphs: [
      "Burke is one of the strongest mid-to-upper-tier bathroom-renovation markets in Fairfax County. The substantial homes of Burke Centre, Lake Braddock, Longwood Knolls, and Kings Park West are typically owner-occupied long-term, which means primary baths get renovated to last — not to flip. Typical Burke primary-bath scope in 2026 runs $40,000–$80,000+ depending on size, layout changes, and material grade.",
      "Real Elite Contracting renovates Burke primary baths and powder rooms with the level of craft this market expects. Featured projects routinely include walk-in showers with glass enclosures, soaking tubs, double-vanity layouts with stone tops, slab-edge details, quality fixture lines, and the layout changes that transform a 1990s primary bath into a refined room.",
      "Where there's room to reshape the plan — opening into a closet, repositioning plumbing for a cleaner shower geometry, relocating the toilet to a private compartment — those changes often deliver the highest-impact result on a Burke primary bath. We model the changes, value-engineer the parts that won't change the visible result, and protect the spend for the surfaces and fixtures the eye actually lands on.",
      "Fairfax County permits, plumbing, electrical, and final inspections are handled by us. Review the proposed scope and warranty terms before signing.",
    ],
  },

  // ── KITCHENS · BURKE, VA ─────────────────────────────────────────────────
  'kitchens-burke-va': {
    paragraphs: [
      "Burke kitchens are a strong bread-and-butter premium-remodel market — substantial homes whose original kitchens have aged into layouts and finishes that don't match how the family actually lives and entertains. Typical Burke primary-kitchen scope in 2026 runs $70,000–$160,000+ depending on the cabinetry brief, the appliance specification, and the structural changes the plan requires.",
      "Real Elite Contracting builds Burke kitchens with the same craft we bring to the McLean / Great Falls market, calibrated to the Burke project brief. Featured scope includes custom or semi-custom cabinetry from a quality shop, quartz or natural-stone countertops, integrated or premium freestanding appliance suites (Sub-Zero, Wolf, Bosch, Thermador), proper ventilation, and layered lighting.",
      "Many Burke kitchens benefit from removing the original wall between the kitchen and family room. Where structural changes are on the table, we bring a structural engineer in early, model the geometry, value-engineer the parts that won't be visible, and protect the spend for the cabinetry, stone, and fixtures that define the room.",
      "Discuss site supervision, communication, and cleanup arrangements during the estimate. Review the proposed scope and warranty terms before signing. Fairfax County permitting, mechanical and electrical inspections, and design coordination are handled by us.",
    ],
  },

  // ── ADDITIONS · LOUDOUN ───────────────────────────────────────────────────

  'additions-leesburg-va': {
    paragraphs: [
      "Real Elite Contracting builds Leesburg additions — a bump-out, a single room, a second story when the structure allows it, or a screened porch. Loudoun publishes a screened porch as a residential addition, not a Typical Deck. We work the Town and western Leesburg first. A Leesburg mailing address is not Town of Leesburg limits: Lansdowne and River Creek often carry a Leesburg address and sit in unincorporated Loudoun. We check the parcel before we file.",
      "Inside Town limits the order is fixed. The Town's published home-improvement table treats home additions and expansions as Town zoning plus engineering review, then a Loudoun County building permit. The county will not release the building permit until Town zoning is approved. The county set needs a plat (house, addition location, distances to the sides and rear) and a comprehensive structural plan. Published county fees: $395 at or under 1,000 square feet (building, plan review, and county zoning bundled); over 1,000 square feet, 1% of construction cost plus a $335 plan review fee plus county zoning. Trade permits are separate. If the addition adds a bedroom on well and septic, Health Department approval comes before the county application.",
      "If the parcel is in the H-1 Old and Historic District, the addition needs a Certificate of Appropriateness. Outside Town limits, county building and zoning run through LandMARC. A county permit is not HOA approval — we file the association packet in parallel. Environmentally sensitive lots and conservation easements can add review; we check those before we lock the design. We do not publish invented addition price bands or a completed Leesburg project count we cannot show.",
      "What you get is the paperwork product: Town or unincorporated county, the published fee path, and whether a COA is in play. We prepare the Town eTRAKiT zoning set and the county LandMARC addition set. County inspections for additions: footing, foundation, framing, insulation, and final, plus trade rough-ins and finals. Approved plans stay on the job. We install to the Virginia Uniform Statewide Building Code and the stamped plans, and document each inspection.",
    ],
  },

  'additions-ashburn-va': {
    paragraphs: [
      "Real Elite Contracting builds Ashburn additions — a bump-out, a single room, a second story when the structure allows it, or a screened porch. Loudoun publishes a screened porch as a residential addition, not a Typical Deck. Ashburn is unincorporated Loudoun County, not a town. Building and zoning run through LandMARC. We work Brambleton, Broadlands, Ashburn Farm, and One Loudoun when the parcel sits in those associations.",
      "Every addition needs a Loudoun County building and zoning application, a plat showing the house, the addition, and setbacks, and a comprehensive structural plan. Published county fees: $395 at or under 1,000 square feet (building, plan review, and county zoning bundled); over 1,000 square feet, 1% of construction cost plus a $335 plan review fee plus county zoning. Trade permits (electrical, plumbing, mechanical, gas) are separate. Gas permits for residential additions have required plan review since October 1, 2025.",
      "A county permit is not HOA approval. We file the association packet in parallel. Brambleton reviews essentially all exterior changes; the Covenants Committee typically meets the second Monday, applications due 9:00 AM Friday ten days prior, decision letters usually 5–7 business days after. Broadlands Declaration 7.5 requires Modifications Subcommittee written consent before an exterior addition; applications due noon Wednesday one week prior. For One Loudoun and Ashburn Farm we use the current packet — we do not invent approved-color lists. We do not publish invented addition price bands or claim a pipeline of finished Ashburn additions we cannot show.",
      "What you get is the paperwork product: the published fee path, which association reviews the lot, and the LandMARC set plus the ARC packet. County inspections: footing, foundation, framing, insulation, and final, plus trade rough-ins and finals. Approved plans stay on the job. We install to the Virginia Uniform Statewide Building Code and the stamped plans, and document each inspection.",
    ],
  },

  'additions-loudoun-county-va': {
    paragraphs: [
      "Real Elite Contracting builds Loudoun County additions — a bump-out, a single room, a second story when the structure allows it, or a screened porch. The county publishes a screened porch as a residential addition, not a Typical Deck. We work the western corridor first (Purcellville, Round Hill, Lovettsville, western Leesburg, selected Middleburg) because that is the practical truck path from Martinsburg.",
      "Every addition needs a Loudoun County building and zoning application, a plat with setbacks, and a comprehensive structural plan. Published county fees: $395 at or under 1,000 square feet (building, plan review, and county zoning bundled); over 1,000 square feet, 1% of construction cost plus a $335 plan review fee plus county zoning. Leesburg, Purcellville, and Middleburg issue town zoning first — the county will not release the building permit without it. If the addition adds a bedroom on well and septic, Health Department approval comes before the county application. Conservation easements are more common in western Loudoun; we check the parcel before we lock the design.",
      "A county permit is not HOA approval. An addition is exterior work: HOA review in master-planned communities, and a Certificate of Appropriateness in Old Town Leesburg or the Middleburg Historic District. We do not publish invented addition price bands or treat wine cellars and media wings as the typical Loudoun brief.",
      "What you get is the paperwork product: the published fee path, town vs unincorporated county, and whether HOA or COA review is in play. County inspections: footing, foundation, framing, insulation, and final, plus trade rough-ins and finals. We install to the Virginia Uniform Statewide Building Code and the stamped plans, and document each inspection.",
    ],
  },

  'additions-middleburg-va': {
    paragraphs: [
      "Real Elite Contracting builds selected Middleburg additions — a bump-out, a single room, or a screened porch when the lot and the architecture allow it. Loudoun publishes a screened porch as a residential addition, not a Typical Deck. A Middleburg mailing address is not Town limits: parcels along Atoka, Foxcroft, and Goose Creek are often unincorporated Loudoun. We check the parcel before we file.",
      "Inside Town limits the order is fixed. An addition needs a Town Zoning Location Permit first, then the Loudoun County building permit. The county set needs a plat (house, addition, setbacks) and a comprehensive structural plan. Published county fees: $395 at or under 1,000 square feet (building, plan review, and county zoning bundled); over 1,000 square feet, 1% of construction cost plus a $335 plan review fee plus county zoning. Town zoning has its own fee — we put the current Town amount in the written estimate. If the addition adds a bedroom on well and septic, Health Department approval comes first. Conservation easements can limit what the lot will take.",
      "If the parcel is in the Historic District, the addition needs a Certificate of Appropriateness from the Historic District Review Committee. Complete applications are due 14 days before the meeting. A county permit is not a COA. We do not publish invented addition price bands or treat tasting rooms, wine cellars, and gun rooms as the typical Middleburg brief.",
      "What you get is the paperwork product: Town or unincorporated county, the published fee path, and whether HDRC review is in play. We prepare the Town zoning set and the county LandMARC addition set. County inspections: footing, foundation, framing, insulation, and final, plus trade rough-ins and finals. We install to the Virginia Uniform Statewide Building Code and the stamped plans, and document each inspection.",
    ],
  },

  'additions-martinsburg-wv': {
    metaTitle: 'Martinsburg Home Additions | Real Elite',
    metaDescription:
      'Home additions in Martinsburg. The city requires a permit to enlarge a house. Berkeley County reviews parcels outside city limits.',
    paragraphs: [
      "A Martinsburg addition follows the lot we measure. On an older house the side yard can be small, the foundation older, and a bump-out has to respect the house that is already there. On a later lot, a single room or a second story is a different structural question. We confirm the yard, the foundation, and the structure before we lock a footprint.",
      "Inside city limits, the Planning Department at City Hall, 232 N. Queen Street, lists enlarging or adding to an existing structure as work that needs a building permit. The city's own FAQ says new buildings or additions must also include a survey or site plan. Apply through MGO Connect. The published Planning number is (304) 264-2131.",
      "Outside the city, Berkeley County requires a permit to enlarge a structure. The application at 400 West Stephen Street, Suite 202, asks for construction plans and a plot plan showing existing structures. If the work is inside a mapped 100-year floodplain, the county requires a Floodplain Certificate. The county office publishes 304-264-1966. We check the parcel before we lock a footprint. This page does not publish a Martinsburg addition price.",
      "The written estimate itemizes foundation, framing, and the trades the permit names. WV Contractor License WV062432.",
    ],
  },

  'additions-charles-town-wv': {
    metaTitle: 'Charles Town Home Additions | Real Elite',
    metaDescription:
      'Home additions in Charles Town. The city lists additions as permit work. Jefferson County reviews parcels outside the city limits.',
    paragraphs: [
      "A Charles Town addition starts with the foundation in front of us. On an older house the work can be a room tied into stone or block, and the yard may be tight. On a newer house the question may be a bedroom, a larger kitchen, or a screened porch. We check the foundation and the lot rather than assuming a subdivision type.",
      "Inside city limits, the Building Inspection office at City Hall, 101 E. Washington Street, lists additions on the work that needs a building permit, along with plumbing, electrical, and HVAC when those systems are in the job. Apply in person or through MGO. The Department of Community Development is at 304-724-3248.",
      "Outside the city, Jefferson County's Office of Building Permits and Inspections at 116 East Washington Street, Suite 100, lists building additions among the work that needs a permit, and it requires compliance with the International Residential Code version adopted by the State of West Virginia. The published contact is 304-725-2998 and permits@jeffersoncountywv.org. Filings go through MGO Connect. We check the parcel before we file. This page does not publish a Charles Town addition price.",
      "The written estimate itemizes the foundation, the framing, and the trades. WV Contractor License WV062432.",
    ],
  },
};

/**
 * The most specific published URL for a service in a given area: the
 * service+area page when one exists, the service pillar otherwise.
 *
 * Derived from CONTENT because CONTENT is exactly what the combo route's
 * generateStaticParams publishes, so this can never return a path that 404s.
 *
 * It replaced a hardcoded allowlist in CityPageTemplate — four service slugs
 * crossed with four city slugs — which had gone badly stale: twenty areas have
 * published service+area pages, so most area pages were sending visitors and
 * internal links to the generic pillar while their own local page went
 * unlinked. The Northern Virginia hub pointed at /services/basements rather
 * than /services/basements/northern-virginia, the regional page the altitude
 * plan is built around.
 *
 * Lives here rather than in the template because "which URL represents this
 * service in this area" is a fact about what is published, not about layout —
 * and a pure function is testable without rendering a page.
 */
/**
 * Does this combo's own copy quote a dollar figure?
 *
 * Used to decide whether the generic `SERVICE_DATA.investment` tiers should
 * render alongside it. Those tiers describe the Eastern Panhandle home market
 * and understate the premium markets badly: basements top out at
 * "$90k – $140k+" while the Great Falls page publishes $250,000–$350,000 as a
 * TYPICAL build, and bathrooms top out at "$45k – $75k+" against Great Falls'
 * published $100,000–$200,000+. A page showing both tells a $250,000 buyer two
 * incompatible things about the same job.
 *
 * Codex found this on the regional basement page, where it is sharpest because
 * that page's snippet asserts a regional band — but it already shipped on
 * thirty-seven premium combos.
 *
 * Deliberately NOT a blanket premium check. Loudoun pages that publish only
 * official permit fees (Typical Deck $265, Typical Basement $65, additions
 * $395) must keep the generic tiers — those fees are not a job range.
 * Suppressing the block there would remove information rather than a
 * contradiction.
 *
 * The real fix is market-specific investment data in SERVICE_DATA, which is a
 * schema change and its own PR. This stops the contradiction reaching a reader
 * without inventing a number, which CLAUDE.md forbids.
 */
/**
 * The ids of the unconfirmed operational claims this combo's OWN localized
 * copy already publishes.
 *
 * Used per-bullet: the combo template may render a trust bullet only when the
 * page's copy already makes every claim that bullet would introduce.
 *
 * ## Why this exists, and the argument it replaces
 *
 * I gated the template's bullets on `market === 'premium'` and justified it by
 * specificity: a promise scoped to the exact service and town is worse in a
 * dispute than the same promise in a sitewide banner. Codex refuted that on
 * the pages the gate actually affects, and it was right. THIRTY-SIX of the
 * forty-seven premium combos already make those promises in their own
 * paragraphs — copy scoped to the exact service and town. On those pages the
 * bullets add nothing in kind, so withholding them reduces nothing and only
 * churns live copy.
 *
 * So the gate now acts where it reduces exposure and nowhere else:
 *
 *   - home market                    → bullets render, unchanged.
 *   - premium, own copy makes claims → bullets render. Unchanged from what
 *     ships today, and `claims.ts` stays the accurate retraction worklist
 *     rather than being partially pre-applied by template logic.
 *   - premium, own copy makes none   → bullets withheld. Here the template IS
 *     the only source of the town-and-service-scoped promise, which is the
 *     case the specificity argument was always about. Eleven existing pages,
 *     and every new premium page — including
 *     /services/basements/northern-virginia, whose copy was written clean.
 *
 * That last line is the one that matters: the original finding on #146 was a
 * NEW url publishing unconfirmed claims, and this keeps them off one.
 *
 * ## Why this returns ids rather than a boolean
 *
 * It was a boolean — "does the copy make ANY unconfirmed claim" — and I called
 * the resulting coarseness an acceptable stopping point. Codex showed it was
 * not, with the case I had underweighted: a NEW premium combo whose copy
 * carries only an unrelated claim such as `active-work-timeline` would satisfy
 * that predicate and be handed all four bullets, none of which its copy made.
 * That defeats the new-page boundary, which is the gate's whole remaining
 * justification. `bathrooms-ashburn-va` is the existing page that shows the
 * classification.
 *
 * So the question is asked per bullet, against the claims that bullet would
 * introduce. A bullet carrying two claims needs BOTH already present — half
 * the bullet's copy being pre-existing does not license the other half.
 *
 * This is still a workaround for a decision that has not been made. The real
 * fix is the owner ruling on the seven claims in claims.ts: confirm them and
 * every gate comes out, retract them and that file is the worklist.
 */
export function unconfirmedClaimIdsInCombo(serviceSlug: string, areaSlug: string): string[] {
  const entry = CONTENT[`${serviceSlug}-${areaSlug}` as keyof typeof CONTENT];
  if (!entry) return [];
  return claimsFoundIn(JSON.stringify(entry))
    .filter((c) => c.status === 'unconfirmed')
    .map((c) => c.id);
}

/**
 * County permit fees ($65, $265, $395) are not job pricing. Treating any
 * `$` figure as a published range hid the generic investment block on
 * Loudoun pages whose only dollars are official Typical / full-plans fees.
 * A figure at or under this floor is incidental; above it is a project range.
 */
const JOB_PRICING_FLOOR = 25_000;

export function comboPublishesPricing(serviceSlug: string, areaSlug: string): boolean {
  const entry = CONTENT[`${serviceSlug}-${areaSlug}` as keyof typeof CONTENT];
  if (!entry) return false;
  const figures = (JSON.stringify(entry).match(/\$[\d,]+/g) ?? []).map((f) =>
    Number(f.replace(/[$,]/g, ''))
  );
  return figures.some((n) => n > JOB_PRICING_FLOOR);
}

export function serviceHrefForArea(serviceSlug: string, areaSlug: string): string {
  return `${serviceSlug}-${areaSlug}` in CONTENT
    ? `/services/${serviceSlug}/${areaSlug}`
    : // Not `/services/${serviceSlug}` — paving's pillar is `/paving`, and
      // interpolating the slug here put a 308 on all 26 area pages.
      servicePillarHref(serviceSlug);
}
