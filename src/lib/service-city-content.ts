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
export { RETIRED_COMBOS, splitComboKey } from '@/lib/retired-combos';

export const FEATURED_SERVICE_SLUGS = [
  'roofing',
  'decks',
  'outdoor-living',
  'stairs',
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

  // Middleburg publishes decks, additions, and kitchens. Bathrooms and
  // basements stay retired (see RETIRED_COMBOS).
  'middleburg-va',

  // Established Loudoun places. Purcellville is an incorporated town on the
  // western corridor. Lansdowne is an established community east of Leesburg.
  // Kitchens, bathrooms, and basements only. Brambleton stays decks-only.
  'purcellville-va',
  'lansdowne-va',

  // Close-in established towns, 2026-10-09. Kitchens, bathrooms, and
  // basements only. Brambleton stays decks-only. No new-build pages.
  'waterford-va',
  'hamilton-va',
  'berryville-va',
  'shepherdstown-wv',
  'the-plains-va',
  'upperville-va',
  'marshall-va',
  'warrenton-va',

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
  /**
   * Show only gallery photos tagged to this town. When none exist, the page
   * renders no photo rather than a job from another place.
   */
  townTaggedPhotosOnly?: boolean;
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
        body: 'Berkeley County generally requires a building permit for an attached deck, a deck more than 30 inches above grade, or a deck on permanent footings. Inside Martinsburg city limits the city may run its own review. A Martinsburg mailing address is not the same as city limits. Permit fees vary by project, so we confirm yours when we check the parcel. Check the county portal, and the deck permit guide linked below, for the current process.',
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
      "Outside city limits, that mailing address is Jefferson County. The Office of Building Permits and Inspections is at 116 East Washington Street, Suite 100 (304-725-2998, permits@jeffersoncountywv.org). County applications go through MGO Connect. The published deck-permit guide treats an attached deck, a walking surface more than 30 inches above grade, or permanent footings as a permit in both Berkeley and Jefferson counties. We check the parcel before we file. City fees vary, so we confirm the fee for your address before filing.",
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
      "Outside the city, Berkeley County Building Permits and Inspections at 400 West Stephen Street, Suite 202, requires a permit to alter a building or to replace plumbing, electrical, gas, or mechanical systems. The county office publishes 304-264-1966. We check the parcel before we file. We price every Martinsburg bathroom on a free written estimate for your home, so no fixed price is listed here.",
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
      "A Charles Town mailing address outside the city is Jefferson County. The Office of Building Permits and Inspections, 116 East Washington Street, Suite 100, requires permits for remodeling and for plumbing, mechanical, and electrical work (304-725-2998, permits@jeffersoncountywv.org). County filings go through MGO Connect, which the county launched on August 25, 2025. We check the parcel before we file. We price every Charles Town bathroom on a free written estimate for your home, so no fixed price is listed here.",
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
      'Bathroom remodel Ashburn VA in Brambleton, Broadlands, One Loudoun, Ashburn Farm, and Belmont Greene. Free written estimate for your home.',
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
          'We price every Ashburn bathroom on a free written estimate for your home, so no fixed price is listed here. Waterproofing, the shower assembly, tile, and any plumbing move are separate lines on the written estimate. A nearby-market cost guide is linked below. It is not an Ashburn quote.',
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
      'Every Ashburn bathroom is priced on a free written estimate for your home. A nearby-market range is only a planning guide. Waterproofing and slope-to-drain are in the written scope. The estimate is line-itemed. The schedule depends on scope, selections, permits, and how much of the existing tile has to come out.',
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
      "Outside city limits, Berkeley County Building Permits and Inspections at 400 West Stephen Street, Suite 202, requires a permit to alter a building or to replace electrical, gas, mechanical, or plumbing systems. That office publishes 304-264-1966 and takes applications from 8 AM to 5 PM, Monday through Friday. We check the parcel before we file. We price every Martinsburg kitchen on a free written estimate for your home, so no fixed price is listed here.",
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
      "Outside the city, a Charles Town address is Jefferson County. The Office of Building Permits and Inspections at 116 East Washington Street, Suite 100, requires permits for remodeling and for plumbing, mechanical, and electrical work. The published contact is 304-725-2998 and permits@jeffersoncountywv.org. County applications go through MGO Connect. We check the parcel before we file. We price every Charles Town kitchen on a free written estimate for your home, so no fixed price is listed here.",
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
      "Historic-district review can apply in Old Town before materials are locked. An association review, when the lot has one, is a separate track from the City or county building permit. We price each Winchester kitchen on a free written estimate for your home. For planning, the kitchen service lists regional tiers, and the regional cost guide covers the Eastern Panhandle, Frederick, Maryland, and Loudoun County. Those ranges are not a Winchester survey and not a quote for this house.",
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
      "We install to the Virginia Uniform Statewide Building Code and the approved Typical Detail or stamped plans, and document each inspection. Every Leesburg basement is priced on a free written estimate for your home. For planning, the Ashburn and Leesburg basement cost guide shows Mayflower Virginia ranges. Those ranges are one contractor's planning figures, not a Real Elite price.",
    ],
    sections: [
      {
        id: 'cost',
        title: 'Cost',
        paragraphs: [
          "These planning ranges come from our Ashburn and Leesburg basement cost guide; your written estimate prices your home. Mayflower Virginia publishes Northern Virginia basement tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. These are one contractor's planning ranges, not Real Elite prices or a Loudoun County average.",
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
      "We install to the Virginia Uniform Statewide Building Code and the approved Typical Detail or stamped plans, and document each inspection. Planning a wine cellar or home theater? Our luxury basement guide walks through those rooms in detail.",
    ],
    sections: [
      {
        id: 'cost',
        title: 'Cost',
        paragraphs: [
          "For planning a Loudoun County basement, our Ashburn and Leesburg cost guide shows typical ranges. Mayflower Virginia's Northern Virginia tiers are $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. These are one contractor's planning ranges, not Real Elite prices or a Loudoun County average.",
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
          {
            href: '/services/basements/purcellville-va',
            label: 'Basement finishing Purcellville VA',
          },
          {
            href: '/services/basements/lansdowne-va',
            label: 'Basement finishing Lansdowne VA',
          },
        ],
      },
      {
        id: 'timeline',
        title: 'Timeline',
        paragraphs: [
          "How long does a Loudoun County basement take? It depends on the scope, permits and approvals, your selections, and crew availability. We give you a written schedule before work starts. Incorporated towns add a step the unincorporated county does not. Leesburg, Purcellville, and Middleburg issue town zoning before the county building permit. Unincorporated parcels go through LandMARC only. That path goes in the written timeline before demo.",
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
      "A lower-level bedroom needs a compliant egress window. The Eastern Panhandle egress-window guide publishes that opening at $3,500 to $6,500 installed, and that is the range we use for planning. A family room and a bath do not automatically need that cut. We say which one the plan is before the estimate is a commitment.",
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

  // ── PURCELLVILLE, VA ─────────────────────────────────────────────────────
  'kitchens-purcellville-va': {
    h1: 'Kitchen Remodeling in Purcellville, VA',
    metaDescription:
      'Kitchen remodeling in Purcellville, VA for the historic village on Route 7. Town zoning comes before the county building permit.',
    faqs: [
      {
        question: 'Who permits a kitchen remodel in Purcellville?',
        answer:
          'Inside town limits, the Town of Purcellville approves zoning before Loudoun County issues the building permit. A load-bearing opening needs stamped drawings on that county permit. Plumbing relocation needs a trade permit. Electrical relocation is a separately licensed trade.',
      },
      {
        question: 'Is a Purcellville address always inside town limits?',
        answer:
          'No. Wright Farm and Mayfair sit in the county Joint Land Management Area beside the town. We check the parcel before we file. Unincorporated parcels use LandMARC for building and zoning.',
      },
      {
        question: 'What does kitchen remodeling in Purcellville, VA cost?',
        answer:
          'We price every Purcellville project on a free written estimate for your home, so no fixed price is listed here. The Loudoun kitchen cost guide cites HomeAdvisor national figures: a typical range of $14,589 to $41,559, an average of $26,945, and a total makeover of $65,000 to $130,000 or more. The written estimate prices this house.',
      },
    ],
    paragraphs: [
      'Kitchen remodeling in Purcellville, VA starts with an older house, not a new-build package. The town is the historic village on Business Route 7 in western Loudoun: late-19th and early-20th century houses along Main Street, plus later lots. A small original kitchen can still have plaster, a single window, and a stack shared with the bath. We confirm the stack and the walls on site.',
      'A Purcellville mailing address is not always town limits. Wright Farm and Mayfair sit in the Joint Land Management Area. Inside town limits, town zoning is approved before Loudoun County issues the building permit. Outside town, building and zoning run through LandMARC. Opening a load-bearing wall needs stamped structural drawings. Moving a sink is a plumbing permit. Electrical relocation is a separately licensed trade, and Real Elite does not take electrical work. That scope stays on the estimate as its own line.',
      'The Loudoun kitchen cost guide is the published figure source. It cites HomeAdvisor national figures: a typical range of $14,589 to $41,559, an average of $26,945, and a total makeover of $65,000 to $130,000 or more. Those are national figures, not a Purcellville quote. Cabinets, counters, and any wall or plumbing move are separate lines. Cabinet lead time goes in the written timeline before demo.',
      'Lots outside the town sewer are often on well and septic. A kitchen that stays in the existing footprint is a different filing from a bedroom addition, which needs Loudoun Health Department approval before the building permit. We name which filing the parcel is before the estimate is a commitment.',
    ],
  },

  'bathrooms-purcellville-va': {
    h1: 'Bathroom Remodeling in Purcellville, VA',
    metaDescription:
      'Bathroom remodeling in Purcellville, VA for older village baths and later houses on Route 7. Town zoning when a county permit is required.',
    faqs: [
      {
        question: 'Who permits a bathroom remodel in Purcellville?',
        answer:
          'Plumbing or electrical relocation needs a Loudoun County trade permit. Inside town limits, town zoning is approved before the county releases a building permit. A bath that does not change a window or an exterior wall usually stays off association review. Unincorporated parcels, including the Joint Land Management Area, use LandMARC.',
      },
      {
        question: 'What does bathroom remodeling in Purcellville, VA cost?',
        answer:
          'We price every Purcellville bathroom on a free written estimate for your home, so no fixed price is listed here. Waterproofing, the shower pan, tile, and any plumbing move are separate lines on the written estimate. The Loudoun primary-bathroom cost guide is a nearby-market reference, not a quote for this house.',
      },
      {
        question: 'Do older Purcellville baths need a different scope?',
        answer:
          'Often, yes. A village bath can be a small room with plaster and a stack that also serves the kitchen. We open the wall and confirm the substrate before the finish schedule is locked. A later house on Route 7 is a different layout, and we price that house, not the village next door.',
      },
    ],
    paragraphs: [
      'Bathroom remodeling in Purcellville, VA is a wet-area job in an older town. The village along Main Street still has small original baths: plaster, a tight footprint, and plumbing that was never laid out for a curbless shower. Later houses on Route 7 are a separate plan. We read the room we are standing in.',
      'Inside town limits, town zoning comes before the Loudoun County building permit when the work needs one. Wright Farm and Mayfair are not automatically in town. They sit in the Joint Land Management Area, and those parcels use LandMARC. A vanity move is a plumbing relocation. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work.',
      'Every Purcellville bathroom is priced on a free written estimate for your home. A nearby-market range is only a planning guide. Waterproofing and slope-to-drain are in the written scope. The estimate is line-itemed. County inspections, when a permit is required, run rough plumbing, then final.',
      'A new window or skylight is exterior work and a different review from an interior tile job. Lots off the town sewer are often on well and septic. That matters for a bedroom addition, not for a bath that keeps the existing stack. We say which one the project is.',
    ],
  },

  'basements-purcellville-va': {
    h1: 'Basement Finishing in Purcellville, VA',
    metaDescription:
      'Basement finishing in Purcellville, VA. Town zoning first. Typical county path is 1% plus a $65 minimum.',
    faqs: [
      {
        question: 'Who permits basement finishing in Purcellville, VA?',
        answer:
          'Inside town limits, the Town approves zoning before Loudoun County releases the building permit. Unincorporated parcels, including Wright Farm and Mayfair in the Joint Land Management Area, use LandMARC. Typical Finished Basement Details cannot be used if the job alters a load-bearing wall, an exterior wall, a beam, or a column.',
      },
      {
        question: 'What does a finished basement in Purcellville cost?',
        answer:
          'The Ashburn and Leesburg cost guide cites Mayflower Virginia tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. Those are one contractor’s planning ranges, not a Purcellville average and not a Real Elite price. Published Typical fees are 1% of construction cost excluding electrical, mechanical, plumbing, and gas, with a $65 minimum.',
      },
      {
        question: 'Can a Purcellville lower level include a bedroom?',
        answer:
          'Only with an emergency egress window that meets the code dimensions on the plans. That opening is exterior work. On a well-and-septic lot, adding a bedroom also needs Loudoun Health Department approval before the building permit. An existing window does not, by itself, make the room a legal bedroom.',
      },
    ],
    paragraphs: [
      'Basement finishing in Purcellville, VA follows the western Loudoun corridor, not an Ashburn subdivision. The town is a historic village on Route 7. Some older houses have low cellars and stone or block foundations. Later lots have a conventional unfinished lower level. A Purcellville mailing address can still sit outside town limits, in the Joint Land Management Area at Wright Farm or Mayfair. We check the parcel before we file.',
      'Inside town limits the order is fixed: town zoning, then the Loudoun County building permit. The county will not release that permit until town zoning is approved. Outside town, building and zoning run through LandMARC. We install to the Virginia Uniform Statewide Building Code and the approved Typical Detail or stamped plans.',
      'Planning ranges come from the Ashburn and Leesburg basement cost guide. Mayflower Virginia lists $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. Those are that contractor’s ranges, not a Real Elite price and not a Purcellville average. Loudoun’s Typical basement fee is 1% of construction cost excluding electrical, mechanical, plumbing, and gas, with a $65 minimum.',
    ],
    sections: [
      {
        id: 'cost',
        title: 'Cost',
        paragraphs: [
          'The price source for basement finishing in Purcellville is the Ashburn and Leesburg basement cost guide. Mayflower Virginia publishes Northern Virginia tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. These are one contractor’s planning ranges, not Real Elite prices and not a western Loudoun average.',
          'A village cellar with limited headroom is not the same scope as a full-height walkout. Do not apply the Ashburn tier table to a Main Street house and call it a quote. The written estimate is the number for the foundation in front of us.',
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
          'The schedule starts with the parcel. Town limits add a zoning step that a Joint Land Management Area lot does not. Finish selections stay off the written timeline until that path is named. After approvals, the calendar depends on scope, selections, and crew availability. We put that schedule in writing before demo.',
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
          'A bedroom needs an emergency egress window. Sill height, opening size, and the window well go on the plans. On an older Purcellville foundation that cut can be the hard part of the job, and it is exterior work. The cost guide says to check the escape arrangement before calling the room a bedroom. Moisture comes first: a perimeter check, a sump if one exists, and vapor control under the finish floor.',
        ],
        links: [
          {
            href: '/blog/basement-remodeling-cost-ashburn-leesburg-2026',
            label: 'Cost guide: bedroom escape',
          },
        ],
      },
      {
        id: 'permit',
        title: 'Permits',
        paragraphs: [
          'County work has two paths: Typical Finished Basement Details, or a complete plan set. Typical cannot be used if the job alters a load-bearing wall, an exterior wall, a beam, or a column. Published Typical fees are 1% of construction cost excluding electrical, mechanical, plumbing, and gas, with a $65 minimum. Full plans add a published $130 plan review fee. A kitchen in the basement adds a published $165 county zoning fee. Trade permits are separate. Inside town, those county fees still wait on town zoning.',
        ],
        links: [
          {
            href: '/blog/loudoun-county-permits-hoa-guide-2026',
            label: 'Loudoun County permits and HOA guide',
          },
          {
            href: '/service-areas/purcellville-va',
            label: 'Purcellville service area',
          },
        ],
      },
    ],
  },

  // ── LANSDOWNE, VA ────────────────────────────────────────────────────────
  'kitchens-lansdowne-va': {
    h1: 'Kitchen Remodeling in Lansdowne, VA',
    metaDescription:
      'Kitchen remodeling in Lansdowne, VA for established houses near Leesburg and the Potomac. A Leesburg address is not Town zoning.',
    faqs: [
      {
        question: 'Who permits a kitchen remodel in Lansdowne?',
        answer:
          'Lansdowne is unincorporated Loudoun County. Building and zoning run through LandMARC, not the Town of Leesburg. A load-bearing opening needs stamped drawings and a county building permit. Plumbing relocation needs a trade permit. Association review usually applies only if a window or other exterior element changes.',
      },
      {
        question: 'Does a Leesburg mailing address put the house in the Town of Leesburg?',
        answer:
          'No. Many Lansdowne houses use a Leesburg address and sit east of town along Route 7, near the Potomac. We check the parcel. Town of Leesburg zoning does not apply to an unincorporated Lansdowne lot.',
      },
      {
        question: 'What does kitchen remodeling in Lansdowne, VA cost?',
        answer:
          'We price every Lansdowne project on a free written estimate for your home, so no fixed price is listed here. The Loudoun kitchen cost guide cites HomeAdvisor national figures: a typical range of $14,589 to $41,559, an average of $26,945, and a total makeover of $65,000 to $130,000 or more. Cabinets, counters, and any wall or plumbing move are lines on the written estimate.',
      },
    ],
    paragraphs: [
      'Kitchen remodeling in Lansdowne, VA is work in an established community, not a price-shopped new subdivision. The houses are mostly 1990s and 2000s production and custom homes on public water and sewer, east of Leesburg along Route 7 and the Potomac. Many still have the builder kitchen: a peninsula, stock cabinets, and a dining wall that may or may not be the one you can open.',
      'A Leesburg mailing address does not make the parcel Town of Leesburg. Lansdowne is unincorporated Loudoun County. Building and zoning run through LandMARC. Opening a load-bearing wall needs stamped structural drawings and a county building permit. Moving a sink or a gas range is a trade permit. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work; a licensed electrician handles that part.',
      'We price every kitchen on a free written estimate for your home, so we don\'t list a fixed Lansdowne price. For planning, the Loudoun kitchen cost guide cites HomeAdvisor’s national typical range of $14,589 to $41,559, an average of $26,945, and a total makeover of $65,000 to $130,000 or more. Those figures are national, not a quote for this house. Cabinet lead time is named before demo.',
      'A county permit is not association approval. Lansdowne has more than one association. We identify the one that governs the address and use its current packet when a window or other exterior element changes. An interior kitchen that leaves the outside alone is a different track. The community is on public water and sewer, so this is not a well-and-septic filing.',
    ],
  },

  'bathrooms-lansdowne-va': {
    h1: 'Bathroom Remodeling in Lansdowne, VA',
    metaDescription:
      'Bathroom remodeling in Lansdowne, VA for established houses near the Potomac. County permits through LandMARC, not the Town of Leesburg.',
    faqs: [
      {
        question: 'Who permits a bathroom remodel in Lansdowne?',
        answer:
          'Loudoun County, through LandMARC, when the work needs a building permit. Lansdowne is unincorporated. A Leesburg mailing address does not move the parcel into the Town of Leesburg. Plumbing relocation needs a trade permit. Association review usually applies only if a window, skylight, or other exterior element changes.',
      },
      {
        question: 'What does bathroom remodeling in Lansdowne, VA cost?',
        answer:
          'We price every Lansdowne bathroom on a free written estimate for your home, so no fixed price is listed here. Waterproofing, the shower assembly, tile, and any plumbing move are separate lines on the written estimate. The Loudoun primary-bathroom cost guide is a nearby-market reference, not a quote for this house.',
      },
      {
        question: 'Are Lansdowne primary baths still the builder layout?',
        answer:
          'Many 1990s and 2000s houses still have the original primary bath: a tub-shower, a builder vanity, and a fan that does not clear the room. Replacing that is a different job from moving the stack. We open the wall and confirm the substrate before the finish schedule is locked.',
      },
    ],
    paragraphs: [
      'Bathroom remodeling in Lansdowne, VA is a wet-area rebuild in an established house near Leesburg and the Potomac. The community is unincorporated Loudoun County. The housing is mostly 1990s and 2000s, on public water and sewer, and a lot of primary baths are still the builder tub, the builder vanity, and a fan that was never sized for a steam shower.',
      'A Leesburg mailing address is not Town of Leesburg zoning. Building and zoning run through LandMARC. A shower conversion needs a sloped pan, a waterproofing layer, and a drain that is already in the right place or is moved on a permit. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work.',
      'We price every Lansdowne bathroom on a free written estimate for your home, so no fixed price is listed here. Waterproofing and slope-to-drain are in the written scope. The estimate is line-itemed. The schedule depends on scope, selections, permits, and how much of the existing tile has to come out.',
      'Association review usually applies only when the bath changes a window, skylight, or other exterior element. There is more than one association in Lansdowne. We confirm which one governs the address and use its current standards. A county permit is not that approval.',
    ],
  },

  'basements-lansdowne-va': {
    h1: 'Basement Finishing in Lansdowne, VA',
    metaDescription:
      'Basement finishing in Lansdowne, VA. Unincorporated Loudoun, through LandMARC. Typical path is 1% plus a $65 minimum.',
    faqs: [
      {
        question: 'Who permits basement finishing in Lansdowne, VA?',
        answer:
          'Loudoun County, through LandMARC. Lansdowne is unincorporated. A Leesburg mailing address does not send the permit to the Town of Leesburg. Typical Finished Basement Details cannot be used if the job alters a load-bearing wall, an exterior wall, a beam, or a column.',
      },
      {
        question: 'Does the association review an indoor basement?',
        answer:
          'Usually only when the work cuts a new window, door, or window well. That opening is exterior. Lansdowne has more than one association, so we identify the one for the address and use its current packet. A county permit is not association approval.',
      },
      {
        question: 'What does a finished basement in Lansdowne cost?',
        answer:
          'The Ashburn and Leesburg cost guide cites Mayflower Virginia tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. Those are one contractor’s planning ranges, not a Lansdowne average and not a Real Elite price. Published Typical fees are 1% of construction cost excluding electrical, mechanical, plumbing, and gas, with a $65 minimum.',
      },
    ],
    paragraphs: [
      'Basement finishing in Lansdowne, VA is the unfinished lower level that came with a 1990s or 2000s house east of Leesburg, along Route 7 and the Potomac. The community is established and on public water and sewer. It is not a new-build subdivision and it is not a well-and-septic village. Many of these houses still have an open basement with builder mechanicals and a rough-in that may or may not be where the bath should go.',
      'Lansdowne is unincorporated Loudoun County. A Leesburg mailing address does not make it Town of Leesburg. Building and zoning run through LandMARC. There is no town zoning step. We install to the Virginia Uniform Statewide Building Code and the approved Typical Detail or stamped plans, and we document each inspection.',
      'Planning ranges come from the Ashburn and Leesburg basement cost guide. Mayflower Virginia lists $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. Those are that contractor’s ranges, not a Real Elite price and not a Lansdowne average. Loudoun’s Typical basement fee is 1% of construction cost excluding electrical, mechanical, plumbing, and gas, with a $65 minimum. An egress cut is exterior work, so the association packet runs in parallel when a bedroom is in the plan.',
    ],
    sections: [
      {
        id: 'cost',
        title: 'Cost',
        paragraphs: [
          'For planning a Lansdowne lower level, our Ashburn and Leesburg basement cost guide shows typical regional ranges. Mayflower Virginia’s Northern Virginia tiers are $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. These are one contractor’s planning ranges, not Real Elite prices.',
          'Price the house: ceiling height under the first-floor framing, whether a bath rough-in exists, and whether a bedroom needs a new window well on the Potomac side of the lot. Do not average those conditions into the Ashburn tier and call it this project.',
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
          'There is no Town of Leesburg zoning wait on an unincorporated Lansdowne lot. The calendar still depends on county review, association review when an egress opening is cut, finish selections, and crew availability. We write that sequence down before demo. The luxury basement guide is the room-planning source, not a Lansdowne schedule.',
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
          'A bedroom needs an emergency egress window anywhere in the county. In Lansdowne that cut is often the first exterior change the association sees. Sill height, opening size, and the window well go on the plans. An existing window’s presence does not establish compliance. Moisture comes first: perimeter check, sump if one exists, vapor control under the finish floor.',
        ],
        links: [
          {
            href: '/blog/luxury-basement-finishing-loudoun-northern-virginia-2026',
            label: 'Luxury guide: egress',
          },
          {
            href: '/blog/hoa-approval-remodels-brambleton-lansdowne-ashburn-farm-2026',
            label: 'Lansdowne association review',
          },
        ],
      },
      {
        id: 'permit',
        title: 'Permits',
        paragraphs: [
          'Every finished basement needs a Loudoun County building and zoning application through LandMARC, plus trade permits for electrical, plumbing, mechanical, and gas when those systems are in the job. Published Typical fees are 1% of construction cost excluding those trades, with a $65 minimum. Full plans add a published $130 plan review fee. A kitchen in the basement adds a published $165 zoning fee. Typical details cannot replace plans when the job alters a load-bearing wall, an exterior wall, a beam, or a column. The association application is a separate track when the egress opening changes the outside.',
        ],
        links: [
          {
            href: '/blog/loudoun-county-permits-hoa-guide-2026',
            label: 'Loudoun County permits and HOA guide',
          },
          {
            href: '/service-areas/lansdowne-va',
            label: 'Lansdowne service area',
          },
        ],
      },
    ],
  },

  // ── ROUND 4: CLOSE-IN ESTABLISHED TOWNS ─────────────────────────────────
  'kitchens-waterford-va': {
    h1: 'Kitchen Remodeling in Waterford, VA',
    metaDescription:
      'Kitchen remodeling in Waterford, VA for the historic village. Exterior changes in the county district need a certificate.',
    faqs: [
      {
        question: 'Who permits a kitchen remodel in Waterford?',
        answer:
          'Waterford is unincorporated Loudoun County. Building and zoning run through LandMARC. A load-bearing opening needs stamped drawings. Plumbing relocation needs a trade permit. Electrical relocation is a separately licensed trade, and Real Elite does not take electrical work.',
      },
      {
        question: 'Does the historic district review an interior kitchen?',
        answer:
          'Loudoun County\'s Waterford Historic and Cultural Conservation District covers the central village. Most exterior changes there need a Certificate of Appropriateness from the Historic District Review Committee. An interior kitchen that leaves the outside alone is not that exterior review. A new window or an addition is.',
      },
      {
        question: 'What does kitchen remodeling in Waterford, VA cost?',
        answer:
          'We price every Waterford kitchen on a free written estimate for that house. The Loudoun kitchen cost guide cites HomeAdvisor national figures: a typical range of $14,589 to $41,559, an average of $26,945, and a total makeover of $65,000 to $130,000 or more. Those are national figures, not a Waterford quote.',
      },
    ],
    paragraphs: [
      'Kitchen remodeling in Waterford, VA starts in an unincorporated village northwest of Leesburg, not in a town zoning office. The county historic district covers the central village. A kitchen that stays inside the existing walls is a different filing from a new window or a bump-out on Main Street or Second Street.',
      'Building and zoning run through LandMARC. Opening a bearing wall needs stamped structural drawings. Moving a sink is a plumbing permit. Electrical relocation stays a separately licensed trade. Real Elite does not take electrical work; a licensed electrician handles that part.',
      'Many village and edge lots are on well and septic. A kitchen that keeps the existing footprint is not the bedroom-addition filing that needs Loudoun Health Department approval first. We name which filing the parcel is before the estimate is a commitment. The Loudoun kitchen cost guide cites HomeAdvisor national figures of $14,589 to $41,559 typical, an average of $26,945, and a total makeover of $65,000 to $130,000 or more. Those are national figures, not a Waterford quote.',
    ],
  },

  'bathrooms-waterford-va': {
    h1: 'Bathroom Remodeling in Waterford, VA',
    metaDescription:
      'Bathroom remodeling in Waterford, VA for older village baths. Exterior changes in the central historic district need a certificate.',
    faqs: [
      {
        question: 'Who permits a bathroom remodel in Waterford?',
        answer:
          'Loudoun County, through LandMARC, when the work needs a building or trade permit. Waterford is unincorporated. A vanity move is a plumbing relocation. Electrical relocation is a separately licensed trade.',
      },
      {
        question: 'Does a Waterford bath need historic review?',
        answer:
          'Only when the work changes the outside of a house in the county\'s Waterford Historic and Cultural Conservation District. That district covers the central village. An interior tile job that leaves the windows and walls as they are stays off that certificate.',
      },
      {
        question: 'What does bathroom remodeling in Waterford, VA cost?',
        answer:
          'We price every Waterford bathroom on a free written estimate for that house. Waterproofing, the shower pan, tile, and any plumbing move are separate lines. The Loudoun primary-bathroom cost guide is a nearby-market reference, not a quote for this house.',
      },
    ],
    paragraphs: [
      'Bathroom remodeling in Waterford, VA is a wet-area job in a small historic village. Original baths along the central streets are tight rooms with plaster and a stack that may also serve the kitchen. Houses on the village edge are a separate plan. We read the room we are standing in.',
      'The county historic district covers the central village, and most exterior changes there need a Certificate of Appropriateness before work starts. A shower conversion that stays inside, with a sloped pan and a waterproofing layer, is not that exterior filing. A new window is. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work.',
      'Every Waterford bathroom is priced on a free written estimate. Waterproofing and slope-to-drain are in the written scope. Lots on well and septic matter when a bedroom is added, not when the bath keeps the existing stack. We say which one the project is.',
    ],
  },

  'basements-waterford-va': {
    h1: 'Basement Finishing in Waterford, VA',
    metaDescription:
      'Basement finishing in Waterford, VA. Loudoun County permit. Typical fee is 1% plus a $65 minimum.',
    faqs: [
      {
        question: 'Who permits basement finishing in Waterford, VA?',
        answer:
          'Loudoun County, through LandMARC. Waterford is unincorporated, so there is no town zoning step. Typical Finished Basement Details cannot be used if the job alters a load-bearing wall, an exterior wall, a beam, or a column.',
      },
      {
        question: 'Does the historic district review a lower level?',
        answer:
          'An interior finish that leaves the outside alone does not need the Certificate of Appropriateness. An egress window or areaway in the central village is exterior work in the Waterford Historic and Cultural Conservation District, and that certificate comes first.',
      },
      {
        question: 'What does a finished basement in Waterford cost?',
        answer:
          'The Ashburn and Leesburg cost guide cites Mayflower Virginia tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. Those are one contractor\'s planning ranges, not a Waterford average and not a Real Elite price. Published Typical fees are 1% of construction cost excluding electrical, mechanical, plumbing, and gas, with a $65 minimum.',
      },
    ],
    paragraphs: [
      'Basement finishing in Waterford, VA is often a low cellar or a stone foundation, not an Ashburn walkout. The village is unincorporated Loudoun County. Some houses at the edge have a conventional unfinished lower level. We check the foundation before we talk about a bedroom.',
      'There is no town zoning step. Building and zoning run through LandMARC. We install to the Virginia Uniform Statewide Building Code and the approved Typical Detail or stamped plans. An egress cut in the central historic district is exterior work and needs a Certificate of Appropriateness.',
      'Planning ranges come from the Ashburn and Leesburg basement cost guide. Mayflower Virginia lists $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. Those are that contractor\'s ranges, not a Real Elite price and not a Waterford average. Loudoun\'s Typical basement fee is 1% of construction cost excluding electrical, mechanical, plumbing, and gas, with a $65 minimum.',
    ],
    sections: [
      {
        id: 'cost',
        title: 'Cost',
        paragraphs: [
          'Mayflower Virginia publishes Northern Virginia tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. These are one contractor\'s planning ranges, not Real Elite prices and not a Waterford average. A village cellar with limited headroom is not the same scope as a full-height walkout.',
        ],
        links: [
          { href: '/blog/basement-remodeling-cost-ashburn-leesburg-2026', label: 'Ashburn and Leesburg basement cost guide' },
          { href: '/service-areas/waterford-va', label: 'Waterford service area' },
        ],
      },
      {
        id: 'timeline',
        title: 'Timeline',
        paragraphs: [
          'Historic-district review applies when the lower level changes the outside of a house in the central village. An interior finish does not add that step. After the county path is named, the calendar depends on scope, selections, and crew availability. We put that schedule in writing before demo.',
        ],
      },
      {
        id: 'egress',
        title: 'Egress',
        paragraphs: [
          'A bedroom needs an emergency egress window. On an older Waterford foundation that cut can be the hard part of the job, and in the central district it is historic-review work. An existing window does not, by itself, make the room a legal bedroom. On a well-and-septic lot, adding a bedroom also needs Loudoun Health Department approval before the building permit.',
        ],
      },
      {
        id: 'permit',
        title: 'Permits',
        paragraphs: [
          'County work has two paths: Typical Finished Basement Details, or a complete plan set. Published Typical fees are 1% of construction cost excluding electrical, mechanical, plumbing, and gas, with a $65 minimum. Full plans add a published $130 plan review fee. A kitchen in the basement adds a published $165 county zoning fee.',
        ],
        links: [
          { href: '/blog/loudoun-county-permits-hoa-guide-2026', label: 'Loudoun County permits guide' },
        ],
      },
    ],
  },

  'kitchens-hamilton-va': {
    h1: 'Kitchen Remodeling in Hamilton, VA',
    metaDescription:
      'Kitchen remodeling in Hamilton, VA for the village on Route 7. Town zoning comes before the county building permit.',
    faqs: [
      {
        question: 'Who permits a kitchen remodel in Hamilton?',
        answer:
          'Inside town limits, the Town of Hamilton approves zoning before Loudoun County issues the building permit. A load-bearing opening needs stamped drawings. Plumbing relocation needs a trade permit. Electrical relocation is a separately licensed trade.',
      },
      {
        question: 'Is Hamilton in a county historic district?',
        answer:
          'No. Hamilton is not one of Loudoun County\'s six historic overlay districts. A Hamilton mailing address can still sit outside town limits. We check the parcel. Unincorporated lots use LandMARC.',
      },
      {
        question: 'What does kitchen remodeling in Hamilton, VA cost?',
        answer:
          'We price every Hamilton kitchen on a free written estimate for that house. The Loudoun kitchen cost guide cites HomeAdvisor national figures: a typical range of $14,589 to $41,559, an average of $26,945, and a total makeover of $65,000 to $130,000 or more. Those are national figures, not a Hamilton quote.',
      },
    ],
    paragraphs: [
      'Kitchen remodeling in Hamilton, VA is work in a small incorporated town on Route 7, between Purcellville and Leesburg. The core is a 19th-century village. Later houses toward the edges are a different plan, and many of those lots are on well and septic rather than town utilities.',
      'Inside town limits, town zoning is approved before Loudoun County issues the building permit. A Hamilton address is not automatically town limits. Outside town, building and zoning run through LandMARC. Opening a bearing wall needs stamped drawings. Real Elite does not take electrical work.',
      'A kitchen that stays in the existing footprint is a different filing from a bedroom addition, which needs Loudoun Health Department approval on a well-and-septic lot before the building permit. The Loudoun kitchen cost guide cites HomeAdvisor national figures of $14,589 to $41,559 typical, an average of $26,945, and a total makeover of $65,000 to $130,000 or more. Cabinet lead time goes in the written timeline before demo.',
    ],
  },

  'bathrooms-hamilton-va': {
    h1: 'Bathroom Remodeling in Hamilton, VA',
    metaDescription:
      'Bathroom remodeling in Hamilton, VA for village baths and later houses on Route 7. Town zoning when a county permit is required.',
    faqs: [
      {
        question: 'Who permits a bathroom remodel in Hamilton?',
        answer:
          'Plumbing relocation needs a Loudoun County trade permit. Inside town limits, town zoning is approved before the county releases a building permit. Hamilton is not in a county historic overlay. Unincorporated parcels use LandMARC.',
      },
      {
        question: 'What does bathroom remodeling in Hamilton, VA cost?',
        answer:
          'We price every Hamilton bathroom on a free written estimate for that house. Waterproofing, the shower pan, tile, and any plumbing move are separate lines. The Loudoun primary-bathroom cost guide is a nearby-market reference, not a quote for this house.',
      },
      {
        question: 'Do older Hamilton baths need a different scope?',
        answer:
          'Often. A village bath can be a small room with plaster and a shared stack. A later house on the edge of town is a different layout. We open the wall and confirm the substrate before the finish schedule is locked.',
      },
    ],
    paragraphs: [
      'Bathroom remodeling in Hamilton, VA is a wet-area rebuild in an older Loudoun town. The village core still has small original baths. Houses toward Purcellville and Leesburg on Route 7 are a later layout. We price the room in front of us, not the next street over.',
      'Inside town limits, town zoning comes before the Loudoun County building permit when the work needs one. Hamilton is not one of the county\'s six historic overlay districts, so there is no county Certificate of Appropriateness for an ordinary interior bath. A new window is still exterior work and a different review.',
      'Every Hamilton bathroom is priced on a free written estimate. Waterproofing and slope-to-drain are in the written scope. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work. Lots off the town sewer are often on well and septic, which matters for a bedroom addition and not for a bath that keeps the existing stack.',
    ],
  },

  'basements-hamilton-va': {
    h1: 'Basement Finishing in Hamilton, VA',
    metaDescription:
      'Basement finishing in Hamilton, VA. Town zoning, then the county permit. Typical fee is 1% plus a $65 minimum.',
    faqs: [
      {
        question: 'Who permits basement finishing in Hamilton, VA?',
        answer:
          'Inside town limits, the Town approves zoning before Loudoun County releases the building permit. Unincorporated parcels use LandMARC. Typical Finished Basement Details cannot be used if the job alters a load-bearing wall, an exterior wall, a beam, or a column.',
      },
      {
        question: 'Can a Hamilton lower level include a bedroom?',
        answer:
          'Only with an emergency egress window that meets the code dimensions on the plans. That opening is exterior work. On a well-and-septic lot, adding a bedroom also needs Loudoun Health Department approval before the building permit.',
      },
      {
        question: 'What does a finished basement in Hamilton cost?',
        answer:
          'The Ashburn and Leesburg cost guide cites Mayflower Virginia tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. Those are one contractor\'s planning ranges, not a Hamilton average and not a Real Elite price. Published Typical fees are 1% of construction cost excluding electrical, mechanical, plumbing, and gas, with a $65 minimum.',
      },
    ],
    paragraphs: [
      'Basement finishing in Hamilton, VA follows the western Loudoun corridor on Route 7. The town is a small 19th-century village between Purcellville and Leesburg. Some older houses have low cellars. Later lots have a conventional unfinished lower level. A Hamilton mailing address can still sit outside town limits.',
      'Inside town limits the order is fixed: town zoning, then the Loudoun County building permit. Hamilton is not a county historic overlay, so an interior finish does not pick up a Certificate of Appropriateness. An egress window is still exterior work. Outside town, building and zoning run through LandMARC.',
      'Planning ranges come from the Ashburn and Leesburg basement cost guide. Mayflower Virginia lists $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. Those are that contractor\'s ranges, not a Real Elite price and not a Hamilton average. Loudoun\'s Typical basement fee is 1% of construction cost excluding electrical, mechanical, plumbing, and gas, with a $65 minimum.',
    ],
    sections: [
      {
        id: 'cost',
        title: 'Cost',
        paragraphs: [
          'Mayflower Virginia publishes Northern Virginia tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. These are one contractor\'s planning ranges, not Real Elite prices. A village cellar is not the Ashburn tier table.',
        ],
        links: [
          { href: '/blog/basement-remodeling-cost-ashburn-leesburg-2026', label: 'Ashburn and Leesburg basement cost guide' },
          { href: '/service-areas/hamilton-va', label: 'Hamilton service area' },
        ],
      },
      {
        id: 'timeline',
        title: 'Timeline',
        paragraphs: [
          'Town limits add a zoning step that an unincorporated Hamilton-address lot does not. Finish selections stay off the written timeline until that path is named. After approvals, the calendar depends on scope, selections, and crew availability.',
        ],
      },
      {
        id: 'egress',
        title: 'Egress',
        paragraphs: [
          'A bedroom needs an emergency egress window anywhere in the county. On an older Hamilton foundation that opening is exterior work. An existing window does not establish compliance. Moisture comes first: a perimeter check, a sump if one exists, and vapor control under the finish floor.',
        ],
      },
      {
        id: 'permit',
        title: 'Permits',
        paragraphs: [
          'Published Typical fees are 1% of construction cost excluding electrical, mechanical, plumbing, and gas, with a $65 minimum. Full plans add a published $130 plan review fee. A kitchen in the basement adds a published $165 county zoning fee. Inside town, those county fees still wait on town zoning.',
        ],
        links: [
          { href: '/blog/loudoun-county-permits-hoa-guide-2026', label: 'Loudoun County permits guide' },
        ],
      },
    ],
  },

  'kitchens-berryville-va': {
    h1: 'Kitchen Remodeling in Berryville, VA',
    metaDescription:
      'Kitchen remodeling in Berryville, VA. Clarke County issues the building permit, including inside the town.',
    faqs: [
      {
        question: 'Who permits a kitchen remodel in Berryville?',
        answer:
          'Clarke County Building Department, at 101 Chalmers Court in Berryville, phone (540) 955-5112. The county reviews permits throughout Clarke County, including the towns of Berryville and Boyce. A zoning permit is a prerequisite, and the two reviews can run together. Inside the town, owners may also need the Town Planner.',
      },
      {
        question: 'Does the historic district review an interior kitchen?',
        answer:
          'Exterior work inside the Berryville Historic District needs a Certificate of Appropriateness from the town Architectural Review Board before the town zoning permit. The county still issues the building permit. The district is not the whole 22611 ZIP. An interior kitchen that leaves the outside alone is not that certificate.',
      },
      {
        question: 'What does kitchen remodeling in Berryville, VA cost?',
        answer:
          'We price every Berryville kitchen on a free written estimate for that house. The Loudoun kitchen cost guide cites HomeAdvisor national figures: a typical range of $14,589 to $41,559, an average of $26,945, and a total makeover of $65,000 to $130,000 or more. Those are national figures, not a Clarke County quote.',
      },
    ],
    paragraphs: [
      'Kitchen remodeling in Berryville, VA is work in Clarke County\'s county seat, where the housing in ZIP 22611 has a Census median year built of 1981. That is established houses, not a new subdivision. A small older kitchen and a later house on the edge of town are different jobs.',
      'Clarke County Building Department issues the building permit for the county and for the towns of Berryville and Boyce. The counter is the first floor of 101 Chalmers Court. Planning staff on the second floor issue the zoning permit, which is required before the building permit, and the reviews can run at the same time. The county asks for 20 to 30 business days for plan review. Inside the town, call the Town Planner at (540) 955-4081 when the parcel is in town limits.',
      'A load-bearing opening needs stamped drawings. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work. The Loudoun kitchen cost guide cites HomeAdvisor national figures of $14,589 to $41,559 typical, an average of $26,945, and a total makeover of $65,000 to $130,000 or more. Those are national figures, not a Berryville quote. The written estimate prices this house.',
    ],
  },

  'bathrooms-berryville-va': {
    h1: 'Bathroom Remodeling in Berryville, VA',
    metaDescription:
      'Bathroom remodeling in Berryville, VA. Clarke County permits the work. Historic review applies inside the town district.',
    faqs: [
      {
        question: 'Who permits a bathroom remodel in Berryville?',
        answer:
          'Clarke County Building Department when the work needs a building or trade permit, including inside the Town of Berryville. Phone (540) 955-5112. Plumbing relocation is a trade permit. Inside the Berryville Historic District, exterior changes need the town Architectural Review Board first.',
      },
      {
        question: 'What does bathroom remodeling in Berryville, VA cost?',
        answer:
          'We price every Berryville bathroom on a free written estimate for that house. Waterproofing, the shower assembly, tile, and any plumbing move are separate lines. A nearby-market bathroom guide is a planning reference, not a quote for this house.',
      },
      {
        question: 'Is every Berryville bath in the historic district?',
        answer:
          'No. The Architectural Review Board reviews certificates inside the Berryville Historic District. ZIP 22611 is larger than that district and larger than the town. We check the parcel.',
      },
    ],
    paragraphs: [
      'Bathroom remodeling in Berryville, VA is a wet-area job in Clarke County\'s older housing stock. ZIP 22611\'s median year built is 1981. Village baths near the historic district and later baths outside town are not the same room.',
      'The county Building Department at 101 Chalmers Court issues the building permit, including for houses inside the town. A shower that stays inside needs a sloped pan and a waterproofing layer. A new window inside the Berryville Historic District is exterior work: the Architectural Review Board certificate, then the town zoning permit, then the county building permit.',
      'Every Berryville bathroom is priced on a free written estimate. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work. The schedule depends on scope, selections, the 20-to-30-business-day county review window, and whether the historic district is in the path.',
    ],
  },

  'basements-berryville-va': {
    h1: 'Basement Finishing in Berryville, VA',
    metaDescription:
      'Basement finishing in Berryville, VA. Clarke County issues the permit. A published tier starts at $55,000.',
    faqs: [
      {
        question: 'Who permits basement finishing in Berryville, VA?',
        answer:
          'Clarke County Building Department, 101 Chalmers Court, phone (540) 955-5112. That office covers the county and the towns of Berryville and Boyce. A zoning permit from county Planning is required and can be reviewed with the building permit. Inside the town, the Town Planner may also need to see the project.',
      },
      {
        question: 'Does an egress window need historic review?',
        answer:
          'When the opening is on a house inside the Berryville Historic District, yes. The town Architectural Review Board certificate comes before the town zoning permit. The county still issues the building permit. Houses outside that district do not use the town board.',
      },
      {
        question: 'What does a finished basement in Berryville cost?',
        answer:
          'The Ashburn and Leesburg cost guide cites Mayflower Virginia tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. Those are one contractor\'s Northern Virginia planning ranges, not a Berryville average and not a Real Elite price. The written estimate prices this foundation.',
      },
    ],
    paragraphs: [
      'Basement finishing in Berryville, VA is a lower level in Clarke County, about 40 minutes from Martinsburg. The Census median year built for ZIP 22611 is 1981. Some houses have a full unfinished basement. Older village houses may have a low cellar. We look at the foundation before we name a bedroom.',
      'Clarke County issues the building permit at 101 Chalmers Court, including inside the Town of Berryville. Plan review is published at 20 to 30 business days. An interior finish on county land is county zoning plus the building permit. An egress opening inside the Berryville Historic District adds the town Architectural Review Board.',
      'Planning ranges cited on our Ashburn and Leesburg basement cost guide are Mayflower Virginia tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. Those are that contractor\'s ranges, not a Real Elite price and not a Clarke County average. Headroom, moisture, and whether a bedroom needs a new well decide the Berryville number.',
    ],
    sections: [
      {
        id: 'cost',
        title: 'Cost',
        paragraphs: [
          'Mayflower Virginia publishes Northern Virginia tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. These are one contractor\'s planning ranges, not Real Elite prices and not a Berryville quote. Price the ceiling height and the moisture history in this house.',
        ],
        links: [
          { href: '/blog/basement-remodeling-cost-ashburn-leesburg-2026', label: 'Ashburn and Leesburg basement cost guide' },
          { href: '/service-areas/berryville-va', label: 'Berryville service area' },
        ],
      },
      {
        id: 'timeline',
        title: 'Timeline',
        paragraphs: [
          'Clarke County asks for 20 to 30 business days for plan review after the application is in. A historic-district certificate, when the egress opening sits in the town district, comes before that county permit. We write the sequence down before demo.',
        ],
      },
      {
        id: 'egress',
        title: 'Egress',
        paragraphs: [
          'A bedroom needs an emergency escape opening that meets the code dimensions on the plans. In the Berryville Historic District that cut is exterior review. An existing window does not establish compliance. Moisture control comes before finishes.',
        ],
      },
      {
        id: 'permit',
        title: 'Permits',
        paragraphs: [
          'File with Clarke County Building Department at 101 Chalmers Court, phone (540) 955-5112, email permits@clarkecounty.gov. Zoning and building can be reviewed together. Inside the Town of Berryville, the Town Planner is at Suite A, (540) 955-4081. Boyce uses the same county building office and is a different town.',
        ],
      },
    ],
  },

  'kitchens-shepherdstown-wv': {
    h1: 'Kitchen Remodeling in Shepherdstown, WV',
    metaDescription:
      'Kitchen remodeling in Shepherdstown, WV for older houses on German Street and outside the corporation.',
    faqs: [
      {
        question: 'Who permits a kitchen remodel in Shepherdstown?',
        answer:
          'Inside town limits, the Town of Shepherdstown issues project permits for construction and additions at Town Hall, 104 North King Street, and we confirm with the Town whether your kitchen needs one. Exterior work in the historic district needs a Certificate of Appropriateness from the Historic Landmarks Commission before the building permit. Outside the corporation, Jefferson County Office of Building Permits and Inspections at 116 East Washington Street, Suite 100, in Charles Town.',
      },
      {
        question: 'Does a Shepherdstown address always mean the town?',
        answer:
          'No. A Shepherdstown mailing address can sit in Jefferson County outside the corporation. We check the parcel before we file. County permits go to (304) 725-2998. The town office is a different counter.',
      },
      {
        question: 'What does kitchen remodeling in Shepherdstown, WV cost?',
        answer:
          'We price every Shepherdstown kitchen on a free written estimate for that house. Cabinets, counters, and any wall or plumbing move are separate lines. WV Contractor License WV062432.',
      },
    ],
    paragraphs: [
      'Kitchen remodeling in Shepherdstown, WV is work in the oldest town in the state, founded in 1762, with Shepherd University beside the German Street corridor. Older houses here still have small original kitchens, plaster, and stacks that were never laid out for an island.',
      'Inside town limits, the Town of Shepherdstown handles project permits for construction and additions at 104 North King Street; we check with the Town what your remodel needs before work starts. Much of the town is in a historic district. Exterior changes there need a Certificate of Appropriateness from the Historic Landmarks Commission before the building permit. A kitchen that leaves the outside alone is not that certificate. A new window or a bump-out is.',
      'Outside the corporation, Jefferson County takes remodeling permits at 116 East Washington Street, Suite 100, in Charles Town, phone (304) 725-2998. Applications are not taken in after 4:30 p.m. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work. WV Contractor License WV062432. The written estimate is the number for this house.',
    ],
  },

  'bathrooms-shepherdstown-wv': {
    h1: 'Bathroom Remodeling in Shepherdstown, WV',
    metaDescription:
      'Bathroom remodeling in Shepherdstown, WV. Town permit inside the corporation. County permit outside it.',
    faqs: [
      {
        question: 'Who permits a bathroom remodel in Shepherdstown?',
        answer:
          'Inside town, we confirm with the Town at 104 North King Street whether your bathroom needs a project permit; construction and additions do. Exterior work in the historic district needs the Historic Landmarks Commission certificate first. Outside town, Jefferson County at 116 East Washington Street, Suite 100, Charles Town, phone (304) 725-2998.',
      },
      {
        question: 'What does bathroom remodeling in Shepherdstown, WV cost?',
        answer:
          'We price every Shepherdstown bathroom on a free written estimate for that house. Waterproofing, tile, and any plumbing move are separate lines. WV Contractor License WV062432.',
      },
      {
        question: 'Do German Street baths need historic review?',
        answer:
          'When the work changes the exterior of a house in the town historic district, yes. The certificate comes before the town building permit. An interior bath that leaves the windows and walls as they are is not that filing. Confirm the parcel is inside the corporation first.',
      },
    ],
    paragraphs: [
      'Bathroom remodeling in Shepherdstown, WV means a wet-area rebuild in an older house, often a tight bath off a German Street or King Street plan, or a later house toward Shepherd Grade. The university town and the county land around it are not the same permit counter.',
      'Inside town limits, construction and additions need a Town project permit, and we confirm with the Town what an interior remodel needs. The Historic Landmarks Commission issues the Certificate of Appropriateness for exterior work in the historic district, and that certificate comes before the building permit. A combined application covers a project that is both inside the corporation and inside the district.',
      'A shower conversion needs a sloped pan and a waterproofing layer. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work. WV Contractor License WV062432. County land uses the Jefferson County office in Charles Town, not Town Hall.',
    ],
  },

  'basements-shepherdstown-wv': {
    h1: 'Basement Finishing in Shepherdstown, WV',
    metaDescription:
      'Basement finishing in Shepherdstown, WV. Town permit in the corporation. Published egress range is $3,500 to $6,500.',
    faqs: [
      {
        question: 'Who permits basement finishing in Shepherdstown, WV?',
        answer:
          'Inside town limits, we confirm with the Town at 104 North King Street which permits your basement needs; construction and additions need a Town project permit. An areaway or egress opening in the historic district needs the Historic Landmarks Commission certificate before the building permit. Outside the corporation, Jefferson County lists finished basements among the work that needs a permit, at 116 East Washington Street, Suite 100, Charles Town.',
      },
      {
        question: 'What does an egress window cost here?',
        answer:
          'The Eastern Panhandle egress guide publishes an installed range of $3,500 to $6,500. That is the window and well, not the whole basement, and it is not a Real Elite price for the finish. The written estimate prices this foundation.',
      },
      {
        question: 'Can a Shepherdstown cellar be a bedroom?',
        answer:
          'Only with an emergency escape opening that meets the code dimensions on the plans. An existing window does not establish that. In the town historic district the new opening is exterior review. On county land it is a Jefferson County permit.',
      },
    ],
    paragraphs: [
      'Basement finishing in Shepherdstown, WV is often a low older cellar near German Street, or a conventional lower level on a later lot outside the original town. A Shepherdstown mailing address does not decide which one, and it does not decide the permit counter.',
      'Inside town limits, the Town issues project permits for construction and additions, and we confirm with the Town what your basement needs. Jefferson County, for land outside town, lists finished basements, remodeling, and additions at the Office of Building Permits and Inspections, 116 East Washington Street, Suite 100, Charles Town, phone (304) 725-2998. No applications after 4:30 p.m.',
      'Our Eastern Panhandle egress guide publishes $3,500 to $6,500 installed for the window and well. That figure is not the basement finish and not a Real Elite price. WV Contractor License WV062432. Moisture comes before drywall. The written estimate is the number for this house.',
    ],
    sections: [
      {
        id: 'cost',
        title: 'Cost',
        paragraphs: [
          'The egress window, when a bedroom is in the plan, is published in the Eastern Panhandle guide at $3,500 to $6,500 installed. That is one line. The finish itself is priced on the written estimate for this foundation, not copied from a Loudoun tier table.',
        ],
        links: [
          { href: '/blog/basement-egress-window-cost-eastern-panhandle-2026', label: 'Eastern Panhandle egress window guide' },
          { href: '/service-areas/shepherdstown-wv', label: 'Shepherdstown service area' },
        ],
      },
      {
        id: 'timeline',
        title: 'Timeline',
        paragraphs: [
          'Town historic review, when the opening changes the outside, comes before the town building permit. County land skips the Historic Landmarks Commission and uses the Charles Town counter. We write that sequence down before demo.',
        ],
      },
      {
        id: 'egress',
        title: 'Egress',
        paragraphs: [
          'A legal bedroom needs an emergency escape opening. The Eastern Panhandle guide puts the installed window and well at $3,500 to $6,500, depending on how deep the cut is. An existing window does not establish compliance.',
        ],
      },
      {
        id: 'permit',
        title: 'Permits',
        paragraphs: [
          'Town Hall is 104 North King Street. The combined application covers projects inside both the corporation and the historic district. Jefferson County\'s office is 116 East Washington Street, Suite 100, Charles Town, (304) 725-2998, permits@jeffersoncountywv.org. WV Contractor License WV062432.',
        ],
      },
    ],
  },

  'kitchens-the-plains-va': {
    h1: 'Kitchen Remodeling in The Plains, VA',
    metaDescription:
      'Kitchen remodeling in The Plains, VA. Town zoning is $50, then Fauquier County inspects the building permit.',
    faqs: [
      {
        question: 'Who permits a kitchen remodel in The Plains?',
        answer:
          'Inside town, an approved Town zoning permit comes first. The published zoning and sign permit fee is $50. Fauquier County then provides the building inspections. Outside town, the county office at 16 Courthouse Square in Warrenton takes the building and zoning application. Phone (540) 422-8230.',
      },
      {
        question: 'Does every Plains kitchen need the Architectural Review Board?',
        answer:
          'The town says the Historic District includes all properties within the town, and improvements there need ARB approval. There is no ARB fee. An interior kitchen that does not change the exterior may still need the town zoning permit. Land outside the town is not the town historic district.',
      },
      {
        question: 'What does kitchen remodeling in The Plains, VA cost?',
        answer:
          'We price every Plains kitchen on a free written estimate for that house. The Loudoun kitchen cost guide cites HomeAdvisor national figures: a typical range of $14,589 to $41,559, an average of $26,945, and a total makeover of $65,000 to $130,000 or more. Those are national figures, not a Fauquier quote.',
      },
    ],
    paragraphs: [
      'Kitchen remodeling in The Plains, VA is work in a small incorporated Fauquier town, charter dated 1972, where ZIP 20198 is larger than the town. Census figures for the ZIP, not the town line, show a median year built of 1982, with the largest single group built in 1939 or earlier. That mix is older houses and later houses, not one kitchen.',
      'Inside town, the zoning and sign permit is required before the building permit and the published fee is $50. Fauquier County provides the building inspections from 16 Courthouse Square in Warrenton. The Historic District includes every property in the town. Exterior improvements need the Architectural Review Board, and that application has no fee. Town Hall is 6451 Main Street, phone (540) 364-4945.',
      'A Plains mailing address can sit outside the town. Those parcels skip the town ARB and use the county combined building and zoning application. The county zoning fee is $110, including the technology fee. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work. HomeAdvisor national figures cited in the Loudoun kitchen guide run $14,589 to $41,559 typical. Those are not a Plains quote.',
    ],
  },

  'bathrooms-the-plains-va': {
    h1: 'Bathroom Remodeling in The Plains, VA',
    metaDescription:
      'Bathroom remodeling in The Plains, VA. Town historic review covers every property inside the town limits.',
    faqs: [
      {
        question: 'Who permits a bathroom remodel in The Plains?',
        answer:
          'Fauquier County issues the building permit. Inside town, an approved zoning permit is required first, published fee $50. Exterior improvements need the Architectural Review Board. Outside town, file at 16 Courthouse Square, Warrenton, (540) 422-8230.',
      },
      {
        question: 'What does bathroom remodeling in The Plains, VA cost?',
        answer:
          'We price every Plains bathroom on a free written estimate for that house. Waterproofing, tile, and any plumbing move are separate lines. A nearby-market bathroom guide is a planning reference, not a quote for this house.',
      },
      {
        question: 'Does the historic district cover the whole ZIP?',
        answer:
          'No. The town says the Historic District includes all properties within the town. ZIP 20198 extends into the county. County land does not use the town Architectural Review Board.',
      },
    ],
    paragraphs: [
      'Bathroom remodeling in The Plains, VA is a wet-area job in a town whose historic district covers every property inside the limits. Older baths in the village and later baths on county land in ZIP 20198 are different rooms and different filings.',
      'The town zoning permit, published at $50, comes before Fauquier County will inspect the building permit. Exterior changes need Architectural Review Board approval, and the ARB charges no fee. An interior shower that leaves the windows and siding alone is still checked against whether the parcel is inside the town.',
      'Every Plains bathroom is priced on a free written estimate. Waterproofing and slope-to-drain are in the written scope. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work. Warrenton\'s town building counter is not this path.',
    ],
  },

  'basements-the-plains-va': {
    h1: 'Basement Finishing in The Plains, VA',
    metaDescription:
      'Basement finishing in The Plains, VA. Town zoning is $50, then the Fauquier County building permit.',
    faqs: [
      {
        question: 'Who permits basement finishing in The Plains, VA?',
        answer:
          'Fauquier County provides the building inspections. Inside town, an approved zoning permit is required first. The published town fee is $50. The county online portal accepts finished-basement permits. An egress opening inside town is an exterior improvement and needs the Architectural Review Board.',
      },
      {
        question: 'What does a finished basement in The Plains cost?',
        answer:
          'The Ashburn and Leesburg cost guide cites Mayflower Virginia tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. Those are one contractor\'s planning ranges, not a Plains average and not a Real Elite price. The town zoning fee is $50. The county zoning fee outside town is $110, including the technology fee.',
      },
      {
        question: 'Can a lower level in The Plains include a bedroom?',
        answer:
          'Only with an emergency egress opening on the plans. Inside the town that opening is historic-district review because the district includes all properties in town. An existing window does not establish compliance.',
      },
    ],
    paragraphs: [
      'Basement finishing in The Plains, VA starts with which side of the town line the house is on. Inside town, every property is in the historic district. Outside town, ZIP 20198 is ordinary Fauquier County. Cellars in the older village houses and full-height lower levels on later lots are not the same scope.',
      'The town zoning and sign permit is $50 and is required before the county building permit. Fauquier County Department of Community Development is at 16 Courthouse Square, Warrenton, phone (540) 422-8230. In-person applications stop at 4:00 p.m. The county adopted the 2021 Virginia Uniform Statewide Building Code effective January 18, 2024.',
      'Mayflower Virginia tiers cited in the Ashburn and Leesburg guide are $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. Those are that contractor\'s ranges, not a Real Elite price and not a Plains average. The written estimate prices this foundation.',
    ],
    sections: [
      {
        id: 'cost',
        title: 'Cost',
        paragraphs: [
          'Mayflower Virginia publishes Northern Virginia tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. These are one contractor\'s planning ranges, not Real Elite prices. The town zoning fee of $50 and the county zoning fee of $110 are permit fees, not the construction price.',
        ],
        links: [
          { href: '/blog/basement-remodeling-cost-ashburn-leesburg-2026', label: 'Ashburn and Leesburg basement cost guide' },
          { href: '/service-areas/the-plains-va', label: 'The Plains service area' },
        ],
      },
      {
        id: 'timeline',
        title: 'Timeline',
        paragraphs: [
          'Architectural Review Board meetings are monthly. Exterior work inside town has to make that agenda before the county building permit. An interior finish that does not change the outside still needs the town zoning permit. We write the order down before demo.',
        ],
      },
      {
        id: 'egress',
        title: 'Egress',
        paragraphs: [
          'A bedroom needs an emergency escape opening. Inside The Plains that cut is an exterior improvement in a historic district that covers the whole town. County land outside town uses the county permit and does not use the town ARB.',
        ],
      },
      {
        id: 'permit',
        title: 'Permits',
        paragraphs: [
          'Town Hall is 6451 Main Street, phone (540) 364-4945. County building permits are filed at 16 Courthouse Square, Warrenton, (540) 422-8230. The county portal accepts finished-basement permits. Delinquent real-estate taxes have to be paid before the county issues the permit.',
        ],
      },
    ],
  },

  'kitchens-upperville-va': {
    h1: 'Kitchen Remodeling in Upperville, VA',
    metaDescription:
      'Kitchen remodeling in Upperville, VA. Unincorporated Fauquier. County permits at 16 Courthouse Square.',
    faqs: [
      {
        question: 'Who permits a kitchen remodel in Upperville?',
        answer:
          'Fauquier County Department of Community Development, 16 Courthouse Square, Warrenton, phone (540) 422-8230. Upperville is unincorporated. There is no town zoning step. A load-bearing opening needs stamped drawings. The county zoning fee is $110, including the technology fee.',
      },
      {
        question: 'Does the National Register district restrict a kitchen?',
        answer:
          'No. Fauquier County says National Register listing does not restrict private property, and the Board of Supervisors has not adopted a local historic overlay in the county. Warrenton and The Plains are the towns with their own overlay districts. Upperville is not those towns.',
      },
      {
        question: 'What does kitchen remodeling in Upperville, VA cost?',
        answer:
          'We price every Upperville kitchen on a free written estimate for that house. The Loudoun kitchen cost guide cites HomeAdvisor national figures: a typical range of $14,589 to $41,559, an average of $26,945, and a total makeover of $65,000 to $130,000 or more. Those are national figures, not an Upperville quote.',
      },
    ],
    paragraphs: [
      'Kitchen remodeling in Upperville, VA is work in an unincorporated village on Route 50 at the Loudoun line. The Virginia Department of Historic Resources lists the Upperville Historic District on the National Register. That listing is not a local permit overlay. The kitchen in a village house and the kitchen in a later house on acreage are different plans.',
      'Building permits go to Fauquier County at 16 Courthouse Square in Warrenton, not to Loudoun LandMARC and not to a town hall. Office hours are 8:00 a.m. to 4:30 p.m., and in-person applications stop at 4:00 p.m. The county uses a combined building and zoning application. Zoning is required for most work, including some interior renovations. The zoning fee is $110, including the technology fee.',
      'Opening a bearing wall needs stamped drawings. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work. HomeAdvisor national figures cited in the Loudoun kitchen guide are $14,589 to $41,559 typical, an average of $26,945, and a total makeover of $65,000 to $130,000 or more. Those are not an Upperville quote.',
    ],
  },

  'bathrooms-upperville-va': {
    h1: 'Bathroom Remodeling in Upperville, VA',
    metaDescription:
      'Bathroom remodeling in Upperville, VA. Fauquier County permits. National Register listing does not add a local board.',
    faqs: [
      {
        question: 'Who permits a bathroom remodel in Upperville?',
        answer:
          'Fauquier County, at 16 Courthouse Square in Warrenton, phone (540) 422-8230. Plumbing relocation is a residential trade permit, and the county portal accepts those. There is no Upperville town counter.',
      },
      {
        question: 'What does bathroom remodeling in Upperville, VA cost?',
        answer:
          'We price every Upperville bathroom on a free written estimate for that house. Waterproofing, tile, and any plumbing move are separate lines. A nearby-market bathroom guide is a planning reference, not a quote for this house.',
      },
      {
        question: 'Is Upperville in Loudoun County for permits?',
        answer:
          'No. The village is in Fauquier County on the Loudoun line. Confirm the parcel. Loudoun LandMARC is the wrong office for a Fauquier parcel.',
      },
    ],
    paragraphs: [
      'Bathroom remodeling in Upperville, VA is a wet-area rebuild in a Route 50 village that sits in Fauquier, not in a Loudoun town. Older baths in the National Register village and later baths on the surrounding lots are different layouts. The register listing does not create a design-review board.',
      'Fauquier County says National Register status places no obligations on private owners, and the Board has not adopted a county historic overlay. The permit is the county combined building and zoning application. A new window is still a building-permit question. It is not a Warrenton or Plains certificate.',
      'Every Upperville bathroom is priced on a free written estimate. Waterproofing and slope-to-drain are in the written scope. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work. The county zoning fee is $110, including the technology fee.',
    ],
  },

  'basements-upperville-va': {
    h1: 'Basement Finishing in Upperville, VA',
    metaDescription:
      'Basement finishing in Upperville, VA. Fauquier County permit. The county zoning fee is $110.',
    faqs: [
      {
        question: 'Who permits basement finishing in Upperville, VA?',
        answer:
          'Fauquier County Department of Community Development, 16 Courthouse Square, Warrenton, phone (540) 422-8230. The county online portal accepts finished-basement permits. Upperville has no town zoning step. A building permit is required for renovations and alterations to an existing house.',
      },
      {
        question: 'Does the historic district review an egress window?',
        answer:
          'Not through a county overlay. The county says it has not adopted a local historic overlay, and National Register listing does not restrict private property. An egress opening is still a building-permit item. It is not the Warrenton Certificate of Appropriateness.',
      },
      {
        question: 'What does a finished basement in Upperville cost?',
        answer:
          'The Ashburn and Leesburg cost guide cites Mayflower Virginia tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. Those are one contractor\'s planning ranges, not an Upperville average and not a Real Elite price. The county zoning fee is $110, including the technology fee.',
      },
    ],
    paragraphs: [
      'Basement finishing in Upperville, VA is a lower level in an unincorporated Fauquier village on Route 50. Some village houses have older cellars. Later houses on acreage may have a full unfinished basement. We look at the foundation before we talk about rooms.',
      'The permit counter is Fauquier County in Warrenton, phone (540) 422-8230. There is no municipal step. The 2021 Virginia Uniform Statewide Building Code took effect in the county on January 18, 2024. Delinquent real-estate taxes have to be paid before the county issues the permit.',
      'Mayflower Virginia tiers cited in the Ashburn and Leesburg guide are $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. Those are that contractor\'s ranges, not a Real Elite price and not an Upperville average. The county zoning fee of $110 is a permit fee, not the construction price.',
    ],
    sections: [
      {
        id: 'cost',
        title: 'Cost',
        paragraphs: [
          'Mayflower Virginia publishes Northern Virginia tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. These are one contractor\'s planning ranges, not Real Elite prices. Ceiling height under the first floor decides more than the ZIP.',
        ],
        links: [
          { href: '/blog/basement-remodeling-cost-ashburn-leesburg-2026', label: 'Ashburn and Leesburg basement cost guide' },
          { href: '/service-areas/upperville-va', label: 'Upperville service area' },
        ],
      },
      {
        id: 'timeline',
        title: 'Timeline',
        paragraphs: [
          'There is no town board waiting on an Upperville lot. The calendar is county review, selections, and crew availability. In-person applications are not accepted after 4:00 p.m. We put the schedule in writing before demo.',
        ],
      },
      {
        id: 'egress',
        title: 'Egress',
        paragraphs: [
          'A bedroom needs an emergency escape opening sized on the plans. National Register status does not replace that code item and does not add a local architectural board. An existing window does not establish compliance.',
        ],
      },
      {
        id: 'permit',
        title: 'Permits',
        paragraphs: [
          'File at 16 Courthouse Square, Warrenton, VA 20186, phone (540) 422-8230. The county portal accepts finished-basement permits and residential trade permits. The zoning fee is $110, including the technology fee. Confirm the parcel is Fauquier, not Loudoun, before filing.',
        ],
      },
    ],
  },

  'kitchens-marshall-va': {
    h1: 'Kitchen Remodeling in Marshall, VA',
    metaDescription:
      'Kitchen remodeling in Marshall, VA. Unincorporated Fauquier. County permits at 16 Courthouse Square.',
    faqs: [
      {
        question: 'Who permits a kitchen remodel in Marshall?',
        answer:
          'Fauquier County Department of Community Development, 16 Courthouse Square, Warrenton, phone (540) 422-8230. Marshall is unincorporated. There is no town permit office. The county zoning fee is $110, including the technology fee.',
      },
      {
        question: 'Does Warrenton historic review apply in Marshall?',
        answer:
          'No. The Certificate of Appropriateness is for the Warrenton Historic District. Marshall is a different place in the same county. Do not use the town\'s 30-inch deck rule here either.',
      },
      {
        question: 'What does kitchen remodeling in Marshall, VA cost?',
        answer:
          'We price every Marshall kitchen on a free written estimate for that house. The Loudoun kitchen cost guide cites HomeAdvisor national figures: a typical range of $14,589 to $41,559, an average of $26,945, and a total makeover of $65,000 to $130,000 or more. Those are national figures, not a Marshall quote.',
      },
    ],
    paragraphs: [
      'Kitchen remodeling in Marshall, VA is work in unincorporated Fauquier County, ZIP 20115. Census figures for the ZIP show a median year built of 1983 and mostly one-unit detached houses. That is established housing from the 1970s through the 2000s, not a new-build subdivision and not one architectural style.',
      'There is no Marshall town hall for permits. Building and zoning go to Fauquier County at 16 Courthouse Square in Warrenton. A building permit is required for additions and for renovations or alterations. A zoning permit is required for most work, including some interior renovations. The fee is $110, including the technology fee. In-person applications stop at 4:00 p.m.',
      'Opening a bearing wall needs stamped drawings. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work. HomeAdvisor national figures cited in the Loudoun kitchen guide are $14,589 to $41,559 typical. Those are not a Marshall quote. The written estimate prices this house.',
    ],
  },

  'bathrooms-marshall-va': {
    h1: 'Bathroom Remodeling in Marshall, VA',
    metaDescription:
      'Bathroom remodeling in Marshall, VA for established Fauquier houses. County permits, no town historic board.',
    faqs: [
      {
        question: 'Who permits a bathroom remodel in Marshall?',
        answer:
          'Fauquier County, phone (540) 422-8230. Plumbing relocation can go through the county portal as a residential trade permit. There is no municipal zoning step.',
      },
      {
        question: 'What does bathroom remodeling in Marshall, VA cost?',
        answer:
          'We price every Marshall bathroom on a free written estimate for that house. Waterproofing, tile, and any plumbing move are separate lines. A nearby-market bathroom guide is a planning reference, not a quote for this house.',
      },
      {
        question: 'Are Marshall baths in a historic district?',
        answer:
          'County permit pages for this ZIP do not name a historic district or an association. The permit path is the county combined application.',
      },
    ],
    paragraphs: [
      'Bathroom remodeling in Marshall, VA is a wet-area rebuild in established detached houses. The ZIP\'s median year built is 1983. A 1970s bath and a 1990s primary bath are different layouts, and we open the wall before the finish schedule is locked.',
      'Fauquier County is the only permit counter. The office is 16 Courthouse Square, Warrenton. The zoning fee is $110, including the technology fee. A shower conversion needs a sloped pan and a waterproofing layer. A new window is a building-permit item, not a Warrenton historic certificate.',
      'Every Marshall bathroom is priced on a free written estimate. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work. The county permit pages do not name an association for this ZIP. We file an association packet only when the deed or the owner names one.',
    ],
  },

  'basements-marshall-va': {
    h1: 'Basement Finishing in Marshall, VA',
    metaDescription:
      'Basement finishing in Marshall, VA. Unincorporated Fauquier. The county zoning fee is $110.',
    faqs: [
      {
        question: 'Who permits basement finishing in Marshall, VA?',
        answer:
          'Fauquier County Department of Community Development, 16 Courthouse Square, Warrenton, phone (540) 422-8230. The county portal accepts finished-basement permits. Marshall has no town zoning step.',
      },
      {
        question: 'What does a finished basement in Marshall cost?',
        answer:
          'The Ashburn and Leesburg cost guide cites Mayflower Virginia tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. Those are one contractor\'s planning ranges, not a Marshall average and not a Real Elite price. The county zoning fee is $110, including the technology fee.',
      },
      {
        question: 'Can a Marshall lower level include a bedroom?',
        answer:
          'Only with an emergency egress opening that meets the code dimensions on the plans. That opening is exterior work and a county permit item. An existing window does not establish compliance.',
      },
    ],
    paragraphs: [
      'Basement finishing in Marshall, VA is the unfinished lower level in established Fauquier houses, ZIP 20115, median year built 1983. These are not new-construction basements and they are not Warrenton town basements. We check ceiling height and moisture before we draw rooms.',
      'The county requires a building permit for renovations and alterations, and a zoning permit for most work, including some interior renovations. File at 16 Courthouse Square. Hours are Monday through Friday, 8:00 a.m. to 4:30 p.m. In-person applications are not accepted after 4:00 p.m. The 2021 Virginia Uniform Statewide Building Code took effect January 18, 2024.',
      'Mayflower Virginia tiers cited in the Ashburn and Leesburg guide are $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. Those are that contractor\'s ranges, not a Real Elite price and not a Marshall average. The $110 county zoning fee is not the construction price.',
    ],
    sections: [
      {
        id: 'cost',
        title: 'Cost',
        paragraphs: [
          'Mayflower Virginia publishes Northern Virginia tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. These are one contractor\'s planning ranges, not Real Elite prices. A 1980s ranch cellar and a two-story house are not the same number.',
        ],
        links: [
          { href: '/blog/basement-remodeling-cost-ashburn-leesburg-2026', label: 'Ashburn and Leesburg basement cost guide' },
          { href: '/service-areas/marshall-va', label: 'Marshall service area' },
        ],
      },
      {
        id: 'timeline',
        title: 'Timeline',
        paragraphs: [
          'There is no town zoning wait in Marshall. County review, selections, and crew availability set the calendar. Delinquent real-estate taxes have to be paid before the county issues the permit. We put the schedule in writing before demo.',
        ],
      },
      {
        id: 'egress',
        title: 'Egress',
        paragraphs: [
          'A bedroom needs an emergency escape opening on the plans. That cut is a county building-permit item. It is not the Town of Warrenton historic certificate. Moisture control comes before finishes.',
        ],
      },
      {
        id: 'permit',
        title: 'Permits',
        paragraphs: [
          'Fauquier County, 16 Courthouse Square, Warrenton, VA 20186, (540) 422-8230. The portal accepts finished-basement permits and residential trade permits. The zoning fee is $110, including the technology fee. Warrenton town rules stop at the town line.',
        ],
      },
    ],
  },

  'kitchens-warrenton-va': {
    h1: 'Kitchen Remodeling in Warrenton, VA',
    metaDescription:
      'Kitchen remodeling in Warrenton, VA. Town permits inside the limits. County permits on the rest of the ZIP.',
    faqs: [
      {
        question: 'Who permits a kitchen remodel in Warrenton?',
        answer:
          'Inside the town, the Department of Community Development, phone (540) 347-1101. Outside the town, Fauquier County at 16 Courthouse Square, phone (540) 422-8230. ZIP 20186 and ZIP 20187 centroids both sit in the county, so a Warrenton mailing address is not town limits.',
      },
      {
        question: 'Does the historic district review an interior kitchen?',
        answer:
          'A Certificate of Appropriateness is required before exterior alterations inside the Warrenton Historic District. An interior kitchen that leaves the outside alone is not that certificate. Which streets are inside the district has to be read off the map for the parcel.',
      },
      {
        question: 'What does kitchen remodeling in Warrenton, VA cost?',
        answer:
          'We price every Warrenton kitchen on a free written estimate for that house. The Loudoun kitchen cost guide cites HomeAdvisor national figures: a typical range of $14,589 to $41,559, an average of $26,945, and a total makeover of $65,000 to $130,000 or more. Those are national figures, not a Warrenton quote. ZIP 20186 and ZIP 20187 are different housing mixes.',
      },
    ],
    paragraphs: [
      'Kitchen remodeling in Warrenton, VA has to start with the town line. The town charter dates to 1816. ZIP 20187 is mostly detached houses with a median year built of 1991. ZIP 20186 is a different mix, median year built 1987, and should not be averaged into one kitchen.',
      'Inside town, applications go to the Department of Community Development, phone (540) 347-1101. The town building page lists alterations to plumbing, electrical, or HVAC among work that needs a permit. Exterior alterations in the Warrenton Historic District need a Certificate of Appropriateness first. Outside town, Fauquier County takes the combined building and zoning application at 16 Courthouse Square. The county zoning fee is $110, including the technology fee.',
      'A load-bearing opening needs stamped drawings. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work. HomeAdvisor national figures cited in the Loudoun kitchen guide are $14,589 to $41,559 typical. Those are not a Warrenton quote. The written estimate prices this house.',
    ],
  },

  'bathrooms-warrenton-va': {
    h1: 'Bathroom Remodeling in Warrenton, VA',
    metaDescription:
      'Bathroom remodeling in Warrenton, VA. Town counter inside the limits. County counter on county land.',
    faqs: [
      {
        question: 'Who permits a bathroom remodel in Warrenton?',
        answer:
          'Inside the town, phone (540) 347-1101. The town lists alterations to plumbing among work that needs a permit. Outside the town, Fauquier County at 16 Courthouse Square, (540) 422-8230. A mailing address does not choose the counter.',
      },
      {
        question: 'What does bathroom remodeling in Warrenton, VA cost?',
        answer:
          'We price every Warrenton bathroom on a free written estimate for that house. Waterproofing, tile, and any plumbing move are separate lines. A nearby-market bathroom guide is a planning reference, not a quote for this house.',
      },
      {
        question: 'Does historic review apply to every Warrenton bath?',
        answer:
          'No. The certificate is for exterior alterations inside the Warrenton Historic District. An interior bath that leaves the outside alone is not that filing. County land outside town does not use the town certificate.',
      },
    ],
    paragraphs: [
      'Bathroom remodeling in Warrenton, VA is a wet-area job that changes with the ZIP. Town houses, ZIP 20187\'s detached stock, and ZIP 20186\'s different mix are not one bath. We open the wall and confirm the substrate before the finish schedule is locked.',
      'Inside town, the Department of Community Development handles the permit, phone (540) 347-1101. A new window in the historic district needs a Certificate of Appropriateness before the exterior alteration. Outside town, the county office at 16 Courthouse Square takes plumbing trade permits on its portal. In-person county applications stop at 4:00 p.m.',
      'Every Warrenton bathroom is priced on a free written estimate. Waterproofing and slope-to-drain are in the written scope. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work. The town\'s 30-inch deck rule is a deck rule, and it applies inside the town only.',
    ],
  },

  'basements-warrenton-va': {
    h1: 'Basement Finishing in Warrenton, VA',
    metaDescription:
      'Basement finishing in Warrenton, VA. Outside town, the Fauquier County zoning fee is $110.',
    faqs: [
      {
        question: 'Who permits basement finishing in Warrenton, VA?',
        answer:
          'Inside the town, the Department of Community Development, phone (540) 347-1101. The town building page lists finishing a basement, and an areaway or egress window needs additional zoning review. Outside the town, Fauquier County at 16 Courthouse Square, phone (540) 422-8230. The county portal accepts finished-basement permits.',
      },
      {
        question: 'What does a finished basement in Warrenton cost?',
        answer:
          'The Ashburn and Leesburg cost guide cites Mayflower Virginia tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. Those are one contractor\'s planning ranges, not a Warrenton average and not a Real Elite price. Outside town, the county zoning fee is $110, including the technology fee.',
      },
      {
        question: 'Does every Warrenton basement use the town rules?',
        answer:
          'No. Both ZIP centroids that were checked landed in Fauquier County, outside an incorporated place. Town rules, including the historic-district certificate, apply inside the town. County land uses the county office.',
      },
    ],
    paragraphs: [
      'Basement finishing in Warrenton, VA splits at the town line. Inside town, the building page requires a permit to finish a basement, and an areaway or egress window needs additional zoning review. Outside town, ZIP 20186 and ZIP 20187 are Fauquier County. The two ZIPs are different housing mixes, median years built 1987 and 1991, and they should not be averaged into one lower level.',
      'The town counter is the Department of Community Development, phone (540) 347-1101. The county counter is 16 Courthouse Square, phone (540) 422-8230, hours 8:00 a.m. to 4:30 p.m. A Certificate of Appropriateness applies before exterior alterations in the Warrenton Historic District, not before an interior finish on county land.',
      'Mayflower Virginia tiers cited in the Ashburn and Leesburg guide are $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. Those are that contractor\'s ranges, not a Real Elite price and not a Warrenton average. The county zoning fee of $110 is a permit fee. The written estimate prices this foundation.',
    ],
    sections: [
      {
        id: 'cost',
        title: 'Cost',
        paragraphs: [
          'Mayflower Virginia publishes Northern Virginia tiers of $55,000–$65,000 essential, $85,000–$110,000 premium, and $150,000–$300,000 or more luxury. These are one contractor\'s planning ranges, not Real Elite prices. ZIP 20186 and ZIP 20187 are not one house type.',
        ],
        links: [
          { href: '/blog/basement-remodeling-cost-ashburn-leesburg-2026', label: 'Ashburn and Leesburg basement cost guide' },
          { href: '/service-areas/warrenton-va', label: 'Warrenton service area' },
        ],
      },
      {
        id: 'timeline',
        title: 'Timeline',
        paragraphs: [
          'Town zoning review for an areaway adds a step the county parcel does not have. Historic-district review applies only when the exterior change is inside the district. We name the parcel\'s counter before the schedule is a commitment.',
        ],
      },
      {
        id: 'egress',
        title: 'Egress',
        paragraphs: [
          'Inside town, an areaway or egress window needs additional zoning review on top of the basement permit. A bedroom still needs an opening that meets the code dimensions. An existing window does not establish compliance. In the historic district that opening is also a certificate question.',
        ],
      },
      {
        id: 'permit',
        title: 'Permits',
        paragraphs: [
          'Town phone (540) 347-1101. County office 16 Courthouse Square, Warrenton, (540) 422-8230. The county zoning fee outside town is $110, including the technology fee. In-person county applications are not accepted after 4:00 p.m. The town links a Typical Basement Details packet for work inside town.',
        ],
      },
    ],
  },

  // ── KITCHENS · MIDDLEBURG, VA ────────────────────────────────────────────
  // Restored from 29675c4. Bathrooms and basements stay retired.
  'kitchens-middleburg-va': {
    h1: 'Kitchen Remodel Middleburg VA',
    metaTitle: 'Kitchen Remodel Middleburg VA | Real Elite',
    metaDescription:
      'Kitchen remodel Middleburg VA. Zoning Location Permit before the county building permit. Historic District exteriors need a Certificate of Appropriateness.',
    includeLocalBusiness: true,
    townTaggedPhotosOnly: true,
    relatedGuideSlugs: [
      'loudoun-county-permits-hoa-guide-2026',
      'luxury-kitchen-renovation-loudoun-northern-virginia-2026',
    ],
    faqs: [
      {
        question: 'Does a Middleburg mailing address decide the kitchen permit path?',
        answer:
          'No. Parcels along Atoka, Foxcroft, and Goose Creek are often unincorporated Loudoun, and those use county building and zoning. Inside Town, a Zoning Location Permit comes before the Loudoun County building permit.',
      },
      {
        question: 'Does the Middleburg Historic District review an interior kitchen?',
        answer:
          'A purely interior kitchen does not change the exterior. In the Historic District, exterior changes visible from a public street need a Certificate of Appropriateness from the Historic District Review Committee. Routine maintenance and exact in-kind repair or replacement are exempt, but any change in form, material, or color is not. Complete applications are due 14 days before the meeting. A county permit is not that certificate.',
      },
      {
        question: 'What does a kitchen remodel in Middleburg, VA cost?',
        answer:
          'We price every Middleburg kitchen on a free written estimate for your home, so no fixed price is listed here. Many edge lots are on well and septic. That changes a bedroom addition, not a kitchen that stays inside the existing footprint.',
      },
    ],
    paragraphs: [
      'A kitchen remodel in Middleburg, VA is a Route 50 town job with two different houses behind the same ZIP. Inside the Historic District the kitchen often sits in an older house on a tight lot along Main Street. Along Atoka, Foxcroft, and Goose Creek the mailing address is still Middleburg and the parcel is often unincorporated county, on a larger lot, frequently on well and septic. We check the parcel before we describe the permit path.',
      'Inside Town limits, work that needs a Loudoun County building permit starts with a Town Zoning Location Permit. The county issues building permits county-wide and still expects that town step first. Outside Town, county building and zoning apply. A kitchen that opens a load-bearing wall needs stamped drawings on the county set. A fixture swap that does not move piping is a different scope from a sink relocation, and the written estimate says which one the house is. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work; a licensed electrician handles that part.',
      'In the Historic District, exterior changes visible from a public street also need a Certificate of Appropriateness from the Historic District Review Committee. Exact in-kind repair or replacement is exempt; any change in form, material, or color is not. Complete applications are due 14 days before the meeting. An interior cabinet and counter job does not become that review unless a street-visible window or other exterior element changes. A county permit is not the certificate. Conservation easements show up on some western Loudoun lots. We read the parcel before the footprint of any opening is locked.',
      'We price every Middleburg kitchen on a free written estimate for your home. Cabinets, counters, and any wall or plumbing move are separate lines. Well and septic on the unincorporated edge lots changes a bedroom addition, not a kitchen that stays inside the existing house.',
    ],
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
    h1: 'Basement Finishing in McLean, VA',
    metaDescription:
      'Basement finishing in McLean, VA. Most entertainment lower levels run $150,000 to $220,000, itemized before work starts.',
    faqs: [
      {
        question: 'Who permits a basement in McLean?',
        answer:
          'Fairfax County Land Development Services. McLean is unincorporated. There is no town zoning step. Framing, electrical, plumbing, mechanical, and final inspections apply when those trades are in the job.',
      },
      {
        question: 'Does every McLean street have an HOA review?',
        answer:
          'No. ZIP 22102 near Tysons and Route 123 is more likely to have an association. Many estate streets in ZIP 22101, along Georgetown Pike, Old Dominion Drive, and Chain Bridge Road, do not. A county permit is not association approval when an association does apply.',
      },
      {
        question: 'What does basement finishing in McLean, VA cost?',
        answer:
          'A typical McLean lower level runs $90,000–$250,000+. A finished entertainment level with a media room, wet bar, full bath, guest suite, and gym usually lands at $150,000–$220,000. The written estimate itemizes framing, trades, and finishes for the house.',
      },
    ],
    paragraphs: [
      "Basement finishing in McLean, VA splits by ZIP. ZIP 22101 is the estate streets along Georgetown Pike, Old Dominion Drive, and Chain Bridge Road: large lots and one-off houses, often with a full-height walkout. ZIP 22102 sits closer to Tysons and Route 123, with more attached housing around the commercial core and a different lower-level footprint. We price the house, not a McLean average.",
      "McLean is unincorporated Fairfax County. Building permits go through Land Development Services. There is no town office in front of the county. Some neighborhoods require association review, and many estate streets do not. A county permit is not HOA approval.",
      "Typical scope runs $90,000–$250,000+, and a finished entertainment level with a media room, wet bar, full bath, guest suite, and gym usually lands at $150,000–$220,000. Slab moisture is checked before finishes are ordered. A bedroom needs a code egress opening, drawn on the plans. The estimate breaks out framing, electrical, plumbing, HVAC, insulation, drywall, flooring, millwork, stone, and finishes.",
      "Fairfax County inspections cover framing, electrical, plumbing, mechanical, and final when those systems are in the job. The schedule depends on scope, approvals, selections, and availability. Review the proposed scope and warranty terms before signing.",
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
    h1: 'Kitchen Remodeling in Vienna, VA',
    metaDescription:
      'Kitchen remodeling in Vienna, VA. Town zoning, county building permit. Published scope runs $130,000 to $300,000+.',
    faqs: [
      {
        question: 'Who permits a kitchen remodel in Vienna?',
        answer:
          'Inside town limits, the Town of Vienna reviews zoning and site plans. Fairfax County Land Development Services issues the building permit. A Vienna mailing address is not always inside town limits. Oakton and Dunn Loring are separate pages.',
      },
      {
        question: 'What does kitchen remodeling in Vienna, VA cost?',
        answer:
          'A Vienna kitchen usually runs $130,000–$300,000+, depending on cabinetry, appliances, and whether a wall opens. The written estimate itemizes this house.',
      },
      {
        question: 'Do Maple Avenue infill kitchens follow the same path as a mid-century ranch?',
        answer:
          'The permit offices are the same inside town. The houses are not. A mid-century kitchen on a tree-lined street is often a closed room with a bearing wall to the dining room. Newer infill along Maple Avenue and Hunter Mill Road may already be open. We confirm the structure before we price a removal.',
      },
    ],
    paragraphs: [
      "Kitchen remodeling in Vienna, VA is a town project. Vienna is incorporated. ZIPs 22180, 22181, and 22182 cover mid-century houses on tree-lined streets, later colonials, and newer infill along Maple Avenue and Hunter Mill Road. A Vienna mailing address can still be Oakton or Dunn Loring. We check the parcel before we file.",
      "Inside town, the town reviews zoning and site plans. Fairfax County Land Development Services is the building official. Opening a load-bearing wall needs stamped structural drawings and the county building permit. Plumbing relocation needs the matching trade permit. Electrical relocation is a separately licensed trade. Real Elite does not take electrical work, and that scope stays on the estimate as its own line.",
      "A Vienna kitchen usually runs $130,000–$300,000+. Cabinetry, stone, appliances, and whether the dining wall comes out move the number. A closed mid-century kitchen and an already-open Maple Avenue plan are different jobs. Cabinet lead time goes in the written timeline before demo.",
      "Bring the drawings if a designer is already on the job. We coordinate Fairfax County permitting and the town zoning submission. Review the proposed scope and warranty terms before signing. The schedule depends on scope, approvals, selections, and availability.",
    ],
  },

  // ── BASEMENTS · VIENNA, VA ───────────────────────────────────────────────
  'basements-vienna-va': {
    h1: 'Basement Finishing in Vienna, VA',
    metaDescription:
      'Basement finishing in Vienna, VA. Town zoning, county building permit. Most projects run $130,000 to $180,000.',
    faqs: [
      {
        question: 'Who permits a basement in Vienna?',
        answer:
          'Inside town limits, the Town of Vienna reviews zoning and site plans, including grading. Fairfax County Land Development Services is the building official. A Vienna mailing address is not always inside town limits. Oakton and Dunn Loring have their own pages.',
      },
      {
        question: 'What does basement finishing in Vienna, VA cost?',
        answer:
          'A typical Vienna lower level runs $80,000–$200,000+. A finished entertainment level with a media room, wet bar, full bath, and guest suite usually lands at $130,000–$180,000. The written estimate is line-itemed for the house.',
      },
      {
        question: 'Are Vienna lower levels the same as McLean estates?',
        answer:
          'No. Vienna is an incorporated town. ZIPs 22180, 22181, and 22182 cover mid-century houses on tree-lined streets, later colonials, and newer infill along Maple Avenue and Hunter Mill Road. Ceiling height and walkout access vary house to house. A mid-century ranch is a different room from an estate lower level.',
      },
    ],
    paragraphs: [
      "Basement finishing in Vienna, VA starts with whether the house is inside the town. Vienna is an incorporated town in Fairfax County. A Vienna mailing address can still be Oakton or Dunn Loring, and those places have their own pages. ZIPs 22180, 22181, and 22182 cover the town and its edges: mid-century houses, later colonials, and newer infill along Maple Avenue and Hunter Mill Road.",
      "Inside town, Fairfax County Land Development Services is the building official. The town reviews zoning and site plans, including grading, against the town code. That is a different front door from unincorporated McLean, which has no town zoning step. We check the parcel before we file.",
      "Typical scope runs $80,000–$200,000+, and a finished entertainment level with a media room, wet bar, full bath, and guest suite usually lands at $130,000–$180,000. A mid-century lower level is often tighter on ceiling height than a later colonial. Slab moisture is checked before cabinetry is ordered. A bedroom needs an egress opening drawn to the code dimensions.",
      "County inspections cover framing, electrical, plumbing, mechanical, and final when those systems are in the job. The schedule depends on scope, town zoning, county review, selections, and availability. Review the proposed scope and warranty terms before signing.",
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
    h1: 'Basement Finishing in Great Falls, VA',
    metaDescription:
      'Basement finishing in Great Falls, VA. Estate lower levels usually run $250,000 to $350,000, and can reach $400,000+.',
    faqs: [
      {
        question: 'Who permits a basement in Great Falls?',
        answer:
          'Fairfax County Land Development Services. Great Falls is unincorporated, ZIP 22066. It is not one master-planned community, and there is no town zoning step. Where a lot is on a private well or septic system, a new bedroom also needs Fairfax County Health Department approval before the building permit.',
      },
      {
        question: 'What does basement finishing in Great Falls, VA cost?',
        answer:
          'A typical Great Falls lower level runs $150,000–$400,000+. A fully finished entertainment level with a media room, wet bar, wine room, fitness room, guest suite, and gym usually lands at $250,000–$350,000. The written estimate itemizes the house.',
      },
      {
        question: 'Is a Great Falls lower level a townhouse basement?',
        answer:
          'No. The housing is large-lot custom houses along Georgetown Pike, Riverbend Road, and Seneca Road. Walkout access, ceiling height, and the distance to a septic field are lot-specific. We measure those before we draw a bedroom.',
      },
    ],
    paragraphs: [
      "Basement finishing in Great Falls, VA is work on large lots. Great Falls is unincorporated Fairfax County, ZIP 22066. The houses are custom builds along Georgetown Pike, Riverbend Road, and Seneca Road. It is not one association and not one floor plan. A lower level here is often a second entertaining floor: media room, wet bar, wine storage, fitness, and a guest suite, when the slab and the septic field allow it.",
      "Building permits go through Fairfax County Land Development Services. There is no town zoning office. Where the lot is on a private well or septic system, a new bedroom needs Fairfax County Health Department approval before the building permit. That step does not apply to a sewered McLean or Vienna lot, and we do not skip it here.",
      "Typical scope runs $150,000–$400,000+, and a fully finished entertainment level with a media room, wet bar, wine room, fitness room, guest suite, and gym usually lands at $250,000–$350,000. Slab moisture and the existing HVAC capacity are checked before millwork is ordered. A bedroom needs an egress opening on the plans.",
      "County inspections cover framing, electrical, plumbing, mechanical, and final when those systems are in the job. The schedule depends on scope, health-department review when a bedroom is added on well or septic, selections, and availability. Review the proposed scope and warranty terms before signing.",
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
      "Outside the city, Berkeley County requires a permit to enlarge a structure. The application at 400 West Stephen Street, Suite 202, asks for construction plans and a plot plan showing existing structures. If the work is inside a mapped 100-year floodplain, the county requires a Floodplain Certificate. The county office publishes 304-264-1966. We check the parcel before we lock a footprint. We price every Martinsburg addition on a free written estimate for your home, so no fixed price is listed here.",
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
      "Outside the city, Jefferson County's Office of Building Permits and Inspections at 116 East Washington Street, Suite 100, lists building additions among the work that needs a permit, and it requires compliance with the International Residential Code version adopted by the State of West Virginia. The published contact is 304-725-2998 and permits@jeffersoncountywv.org. Filings go through MGO Connect. We check the parcel before we file. We price every Charles Town addition on a free written estimate for your home, so no fixed price is listed here.",
      "The written estimate itemizes the foundation, the framing, and the trades. WV Contractor License WV062432.",
    ],
  },

  // ── OUTDOOR LIVING · round 5 (REA-2371) ──────────────────────────────────
  'outdoor-living-loudoun-county-va': {
    h1: 'Outdoor Living Loudoun County VA',
    metaTitle: 'Outdoor Living Loudoun County VA | Real Elite',
    metaDescription:
      'Outdoor Living Loudoun County VA. A roof or screen needs full plans, not the Typical Deck Detail. Free written estimate after a site walk.',
    includeLocalBusiness: true,
    townTaggedPhotosOnly: true,
    relatedGuideSlugs: [
      'covered-patio-outdoor-living-cost-loudoun-county-2026',
      'loudoun-county-permits-hoa-guide-2026',
      'luxury-outdoor-living-decks-loudoun-northern-virginia-2026',
    ],
    faqs: [
      {
        question: 'Does a screened porch in Loudoun County use the Typical Deck Detail?',
        answer:
          'No. Loudoun requires full plans, not the Typical Deck Detail, for a deck with a roof or screen. The county publishes a screened porch as a residential addition, not a Typical Deck.',
      },
      {
        question: 'Who permits outdoor living in an incorporated Loudoun town?',
        answer:
          'Leesburg, Purcellville, and Middleburg issue town zoning before the county building permit. Unincorporated Loudoun, including Ashburn, uses LandMARC for building and zoning. We check the parcel before we file.',
      },
      {
        question: 'What does outdoor living in Loudoun County cost?',
        answer:
          'Full outdoor living builds with multiple levels, a pergola, and built-ins typically run $35k–$80k+. A smaller screened porch or patio roof is a free written estimate after a site walk.',
      },
    ],
    paragraphs: [
      'Outdoor living in Loudoun County, VA is the screened porch, covered patio, or pergola that turns the back of the house into a room you use from spring through fall. Real Elite Contracting builds those spaces on the western corridor first: Purcellville, Round Hill, Lovettsville, western Leesburg, and selected Middleburg. That is the practical truck path from Martinsburg.',
      'A roof or a screen takes the job off the Typical Deck Detail. Loudoun requires full plans for a deck with a roof or screen, and the county publishes a screened porch as a residential addition, not a Typical Deck. Leesburg, Purcellville, and Middleburg issue town zoning before the county releases the building permit. Unincorporated parcels file building and zoning through LandMARC. Published minimum footing depth on a Loudoun deck is 24 inches on solid soil, and a porch roof sits on footings the same way.',
      'Gas and electrical for an outdoor kitchen or a fire feature are licensed trades. Real Elite does not take electrical work. Lighting on these builds is solar post-cap and step lights. A county permit is not HOA approval. When the lot has an association, that packet goes in parallel with the county set.',
      'Full outdoor living builds with multiple levels, a pergola, and built-ins typically run $35k–$80k+. A smaller porch or patio roof is a free written estimate after a site walk. The estimate names the permit path for the parcel and the design.',
    ],
  },

  'outdoor-living-leesburg-va': {
    h1: 'Outdoor Living Leesburg VA',
    metaTitle: 'Outdoor Living Leesburg VA | Real Elite',
    metaDescription:
      'Outdoor Living Leesburg VA. Town zoning before the county permit. H-1 exteriors need a Certificate of Appropriateness. Free written estimate after a site walk.',
    includeLocalBusiness: true,
    townTaggedPhotosOnly: true,
    relatedGuideSlugs: [
      'covered-patio-outdoor-living-cost-loudoun-county-2026',
      'loudoun-county-permits-hoa-guide-2026',
    ],
    faqs: [
      {
        question: 'Is a Leesburg address always inside Town limits?',
        answer:
          'No. Lansdowne and River Creek often carry a Leesburg address and sit in unincorporated Loudoun. Those parcels use LandMARC. Inside Town limits, zoning comes before the county building permit.',
      },
      {
        question: 'Does a screened porch in Leesburg need full plans?',
        answer:
          'Yes. Loudoun requires full plans, not the Typical Deck Detail, for a deck with a roof or screen. Inside Town limits that county set waits on Town zoning. The Town zoning permit covers decks, balconies, and exterior stairs.',
      },
      {
        question: 'Does the Leesburg H-1 district review a porch?',
        answer:
          'In the H-1 Old and Historic District, every exterior construction project needs a Certificate of Appropriateness. Some certificates are staff-approved. Others go to the Board of Architectural Review. A National Register listing is not the same as the Town H-1 overlay.',
      },
    ],
    paragraphs: [
      'Outdoor living in Leesburg, VA starts with the parcel, not the mailing address. Lansdowne and River Creek often use a Leesburg address and sit in unincorporated Loudoun. Inside Town limits the house is a different filing. We check the parcel before we describe a screened porch, a patio roof, or a pergola.',
      'Inside Town limits the order is fixed. The Town of Leesburg issues the zoning permit first. Decks, balconies, and exterior stairs need that Town zoning, and the county will not release the building permit until it is approved. A roof or a screen needs full plans, not the Typical Deck Detail. Outside Town, building and zoning run through LandMARC.',
      'If the parcel is in the H-1 Old and Historic District, every exterior construction project needs a Certificate of Appropriateness. Some are staff-approved. Others go to the Board of Architectural Review. A National Register listing is honorary and is not the Town H-1 overlay. Any HOA review is a separate track from Town zoning and the county building permit.',
      'Gas and electrical for an outdoor kitchen or a fire feature are licensed trades. Real Elite does not take electrical work. Lighting is solar post-cap and step lights. Every Leesburg outdoor living project is a free written estimate after a site walk.',
    ],
  },

  'outdoor-living-ashburn-va': {
    h1: 'Outdoor Living Ashburn VA',
    metaTitle: 'Outdoor Living Ashburn VA | Real Elite',
    metaDescription:
      'Outdoor Living Ashburn VA. LandMARC for Broadlands, Ashburn Farm, and One Loudoun. A roof or screen needs full plans. Free written estimate after a site walk.',
    includeLocalBusiness: true,
    townTaggedPhotosOnly: true,
    relatedGuideSlugs: [
      'covered-patio-outdoor-living-cost-loudoun-county-2026',
      'loudoun-county-permits-hoa-guide-2026',
      'hoa-approval-remodels-brambleton-lansdowne-ashburn-farm-2026',
    ],
    faqs: [
      {
        question: 'Who permits a screened porch in Ashburn?',
        answer:
          'Ashburn is unincorporated Loudoun County. There is no town zoning office. Building and zoning run through LandMARC. A covered patio, screened porch, or three-season room needs full plans, not the Typical Deck Detail.',
      },
      {
        question: 'Is a county permit the same as HOA approval in Ashburn?',
        answer:
          'No. The county does not enforce covenants. Brambleton reviews essentially all exterior changes. Broadlands requires prior written consent for an exterior addition. We submit the association packet in parallel with the LandMARC set.',
      },
      {
        question: 'What does outdoor living in Ashburn cost?',
        answer:
          'Every Ashburn screened porch, patio roof, or pergola is a free written estimate after a site walk. Gas and electrical for an outdoor kitchen or a fire feature are licensed trades. Lighting is solar post-cap and step lights.',
      },
    ],
    paragraphs: [
      'Outdoor living in Ashburn, VA is a county job, not a town job. Ashburn is unincorporated Loudoun. There is no separate municipal zoning office. Building and zoning run through LandMARC. We work Broadlands, Ashburn Farm, and One Loudoun when the parcel sits in those associations, and Brambleton when the lot is in that community.',
      'A covered patio, screened porch, or three-season room drops out of the Typical Deck Detail. Loudoun requires full plans for a deck with a roof or screen. The county publishes a screened porch as a residential addition. County inspections still follow the deck sequence when the structure is a deck with a roof: footing before concrete, framing before decking, then final.',
      'A county permit is not HOA approval. Brambleton reviews essentially all exterior changes. Broadlands requires prior written consent for an exterior addition. One Loudoun and Ashburn Farm use the current association packet for that address.',
      'Gas and electrical for an outdoor kitchen or a fire feature are licensed trades. Real Elite does not take electrical work. Lighting is solar post-cap and step lights. The price for this lot is a free written estimate after a site walk.',
    ],
  },

  'outdoor-living-purcellville-va': {
    h1: 'Outdoor Living Purcellville VA',
    metaTitle: 'Outdoor Living Purcellville VA | Real Elite',
    metaDescription:
      'Outdoor Living Purcellville VA. Town zoning before the county permit. Wright Farm and Mayfair use LandMARC. Free written estimate after a site walk.',
    includeLocalBusiness: true,
    townTaggedPhotosOnly: true,
    relatedGuideSlugs: [
      'covered-patio-outdoor-living-cost-loudoun-county-2026',
      'loudoun-county-permits-hoa-guide-2026',
    ],
    faqs: [
      {
        question: 'Who permits a screened porch in Purcellville?',
        answer:
          'Inside town limits, the Town of Purcellville approves zoning before Loudoun County issues the building permit. A roof or screen needs full plans, not the Typical Deck Detail. Wright Farm and Mayfair sit in the Joint Land Management Area and use LandMARC.',
      },
      {
        question: 'Is a Purcellville address always inside town limits?',
        answer:
          'No. Wright Farm and Mayfair sit in the county Joint Land Management Area beside the town. We check the parcel before we file. Unincorporated parcels use LandMARC for building and zoning.',
      },
      {
        question: 'What does outdoor living in Purcellville cost?',
        answer:
          'Every Purcellville porch, patio roof, or pergola is a free written estimate after a site walk. Lots outside the town sewer are often on well and septic. A porch that does not add a bedroom is a different filing from a bedroom addition, which needs Loudoun Health Department approval first.',
      },
    ],
    paragraphs: [
      'Outdoor living in Purcellville, VA is a western Loudoun village job on Business Route 7, not an Ashburn subdivision. Late-19th and early-20th century houses along Main Street sit on tighter lots. Later houses toward the edge are a different yard. A screened porch or patio roof has to respect the house that is already there.',
      'A Purcellville mailing address is not always town limits. Wright Farm and Mayfair sit in the Joint Land Management Area. Inside town limits, town zoning is approved before Loudoun County issues the building permit. Outside town, building and zoning run through LandMARC. A roof or a screen needs full plans, not the Typical Deck Detail. The county publishes a screened porch as a residential addition.',
      'Lots outside the town sewer are often on well and septic. A porch that does not add a bedroom is a different filing from a bedroom addition, which needs Loudoun Health Department approval before the county application. We name which filing the parcel is before the estimate is a commitment.',
      'Gas and electrical for an outdoor kitchen or a fire feature are licensed trades. Real Elite does not take electrical work. Lighting is solar post-cap and step lights. The number for this house is a free written estimate after a site walk.',
    ],
  },

  'outdoor-living-middleburg-va': {
    h1: 'Screened Porch & Outdoor Living Middleburg VA',
    metaTitle: 'Screened Porch & Outdoor Living Middleburg VA | Real Elite',
    metaDescription:
      'Screened Porch & Outdoor Living Middleburg VA. Zoning Location Permit first. Street-visible Historic District changes need a certificate.',
    includeLocalBusiness: true,
    townTaggedPhotosOnly: true,
    relatedGuideSlugs: [
      'covered-patio-outdoor-living-cost-loudoun-county-2026',
      'loudoun-county-permits-hoa-guide-2026',
    ],
    faqs: [
      {
        question: 'Does a Middleburg mailing address decide the porch permit?',
        answer:
          'No. Parcels along Atoka, Foxcroft, and Goose Creek are often unincorporated Loudoun, and those use county building and zoning. Inside Town, a Zoning Location Permit comes before the Loudoun County building permit.',
      },
      {
        question: 'Does the Middleburg Historic District review a screened porch?',
        answer:
          'Yes, when the porch is an exterior change visible from a public street. That needs a Certificate of Appropriateness from the Historic District Review Committee. Exact in-kind repair or replacement is exempt. Any change in form, material, or color is not. Complete applications are due 14 days before the meeting. A county permit is not that certificate.',
      },
      {
        question: 'What does a screened porch in Middleburg cost?',
        answer:
          'Every Middleburg screened porch, patio roof, or pergola is a free written estimate after a site walk. A roof or screen needs full plans, not the Typical Deck Detail. Many edge lots are on well and septic.',
      },
    ],
    paragraphs: [
      'A screened porch in Middleburg, VA is a Route 50 town job with two different lots behind the same ZIP. Inside the Historic District the yard is often tight along the street. Along Atoka, Foxcroft, and Goose Creek the mailing address is still Middleburg and the parcel is often unincorporated county, frequently on well and septic. We check the parcel before we describe the permit path.',
      'Inside Town limits, a deck or porch that needs a Loudoun County building permit starts with a Town Zoning Location Permit. The county issues building permits county-wide and still expects that town step first. Outside Town, county building and zoning apply through LandMARC. A roof or a screen needs full plans, not the Typical Deck Detail. The county publishes a screened porch as a residential addition.',
      'In the Historic District, exterior changes visible from a public street need a Certificate of Appropriateness from the Historic District Review Committee. Exact in-kind repair or replacement is exempt. Any change in form, material, or color is not. A new screened porch is a change in form, not an in-kind repair. Complete applications are due 14 days before the meeting. A county permit is not the certificate. Conservation easements show up on some western Loudoun lots. We read the parcel before the footprint is locked.',
      'Gas and electrical for an outdoor kitchen or a fire feature are licensed trades. Real Elite does not take electrical work. Lighting is solar post-cap and step lights. The price is a free written estimate after a site walk.',
    ],
  },

  'outdoor-living-waterford-va': {
    h1: 'Outdoor Living Waterford VA',
    metaTitle: 'Outdoor Living Waterford VA | Real Elite',
    metaDescription:
      'Outdoor Living Waterford VA. LandMARC permits. Exterior changes in the county historic district need a certificate. Free written estimate after a site walk.',
    includeLocalBusiness: true,
    townTaggedPhotosOnly: true,
    relatedGuideSlugs: [
      'covered-patio-outdoor-living-cost-loudoun-county-2026',
      'loudoun-county-permits-hoa-guide-2026',
    ],
    faqs: [
      {
        question: 'Who permits a screened porch in Waterford?',
        answer:
          'Waterford is unincorporated Loudoun County. There is no town zoning step. Building and zoning run through LandMARC. A roof or screen needs full plans, not the Typical Deck Detail.',
      },
      {
        question: 'Does the Waterford historic district review a porch?',
        answer:
          'Loudoun County Historic and Cultural Conservation District covers the central village. Most exterior changes there need a Certificate of Appropriateness from the Historic District Review Committee. A screened porch or porch roof in that district is exterior work. An interior job that leaves the outside alone is not.',
      },
      {
        question: 'What does outdoor living in Waterford cost?',
        answer:
          'Every Waterford porch, patio roof, or pergola is a free written estimate after a site walk. Many village and edge lots are on well and septic. A porch that does not add a bedroom is not the bedroom-addition filing.',
      },
    ],
    paragraphs: [
      'Outdoor living in Waterford, VA starts in an unincorporated village northwest of Leesburg, not in a town zoning office. The county historic district covers the central village. A screened porch on Main Street or Second Street is a different review from a patio roof on a house at the village edge. We read the lot we are standing on.',
      'There is no town zoning step. Building and zoning run through LandMARC. A roof or a screen needs full plans, not the Typical Deck Detail. The county publishes a screened porch as a residential addition, not a Typical Deck. We file the LandMARC set for the design the parcel will actually take.',
      'Most exterior changes in the county Waterford Historic and Cultural Conservation District need a Certificate of Appropriateness from the Historic District Review Committee before work starts. A new porch roof or screened porch in the central village is that exterior work. Gas and electrical for an outdoor kitchen or a fire feature are licensed trades. Real Elite does not take electrical work. Lighting is solar post-cap and step lights.',
      'Many village and edge lots are on well and septic. A porch that keeps the existing house and does not add a bedroom is not the filing that needs Loudoun Health Department approval first. The price is a free written estimate after a site walk.',
    ],
  },

  'outdoor-living-martinsburg-wv': {
    h1: 'Outdoor Living Martinsburg WV',
    metaTitle: 'Outdoor Living Martinsburg WV | Real Elite',
    metaDescription:
      'Outdoor Living Martinsburg WV. A Martinsburg address is not always city limits. Free written estimate after a site walk.',
    includeLocalBusiness: true,
    townTaggedPhotosOnly: true,
    relatedGuideSlugs: [
      'deck-permits-berkeley-jefferson-county-wv-2026',
      'deck-cost-per-square-foot-eastern-panhandle-2026',
    ],
    faqs: [
      {
        question: 'Who permits a screened porch in Martinsburg?',
        answer:
          'A Martinsburg mailing address is not city limits. Berkeley County generally requires a building permit for an attached deck, a deck more than 30 inches above grade, or a deck on permanent footings. Inside city limits the city may run its own review. A porch that enlarges the house is on the city list of work that needs a permit.',
      },
      {
        question: 'Where do Martinsburg porch permits get filed?',
        answer:
          'Inside city limits, the Planning Department at City Hall, 232 N. Queen Street, lists enlarging or adding to an existing structure as work that needs a building permit. Apply through MGO Connect. The published Planning number is (304) 264-2131. Outside the city, Berkeley County reviews the parcel. County applications are on the Berkeley County OneStop portal.',
      },
      {
        question: 'What does outdoor living in Martinsburg cost?',
        answer:
          'Every Martinsburg screened porch, patio roof, or pergola is a free written estimate after a site walk. Gas and electrical for an outdoor kitchen or a fire feature are licensed trades. Lighting is solar post-cap and step lights.',
      },
    ],
    paragraphs: [
      'Outdoor living in Martinsburg, WV follows the house, not a subdivision package. Older homes near downtown and Queen Street need a careful look at grade and the existing wall before a porch roof ties in. Newer lots toward Spring Mills, Hedgesville, and the Route 11 corridor are often a clearer replacement or a new cover over a patio. We measure the yard before we lock a footprint.',
      'A Martinsburg mailing address is not city limits. Berkeley County generally requires a building permit for an attached deck, a deck more than 30 inches above grade, or a deck on permanent footings. A screened porch or patio roof is attached and sits on permanent footings, so that is the county note we start from. Inside city limits the city may run its own review.',
      'Inside the city, the Planning Department at City Hall, 232 N. Queen Street, lists enlarging or adding to an existing structure as work that needs a building permit. The city FAQ says new buildings or additions must also include a survey or site plan. Apply through MGO Connect. The published Planning number is (304) 264-2131. Outside the city, Berkeley County Building Permits and Inspections is at 400 West Stephen Street, Suite 202, and publishes 304-264-1966. County filings go through the Berkeley County OneStop portal. We check the parcel before we file.',
      'Gas and electrical for an outdoor kitchen or a fire feature are licensed trades. Real Elite does not take electrical work. Lighting is solar post-cap and step lights. The price is a free written estimate after a site walk.',
    ],
  },

  'outdoor-living-charles-town-wv': {
    h1: 'Outdoor Living Charles Town WV',
    metaTitle: 'Outdoor Living Charles Town WV | Real Elite',
    metaDescription:
      'Outdoor Living Charles Town WV. City permits for porches inside limits. Jefferson County reviews parcels outside. Free written estimate after a site walk.',
    includeLocalBusiness: true,
    townTaggedPhotosOnly: true,
    relatedGuideSlugs: [
      'deck-permits-berkeley-jefferson-county-wv-2026',
      'deck-cost-per-square-foot-eastern-panhandle-2026',
    ],
    faqs: [
      {
        question: 'Who permits a porch in Charles Town?',
        answer:
          'Inside city limits, the Building Inspection office at City Hall, 101 E. Washington Street, lists decks and porches as work that needs a building permit. Apply in person or through MGO. The Department of Community Development is at 304-724-3248. Outside the city, Jefferson County reviews the parcel.',
      },
      {
        question: 'Is a Charles Town address always inside the city?',
        answer:
          'No. Outside city limits the mailing address is Jefferson County. The Office of Building Permits and Inspections is at 116 East Washington Street, Suite 100. The published contact is 304-725-2998 and permits@jeffersoncountywv.org. County applications go through MGO Connect.',
      },
      {
        question: 'When does a Charles Town porch need a permit?',
        answer:
          'The published deck-permit guide treats an attached deck, a walking surface more than 30 inches above grade, or permanent footings as a permit in both Berkeley and Jefferson counties. A screened porch or patio roof on permanent footings is that kind of structure. We check the parcel before we file. The price is a free written estimate after a site walk.',
      },
    ],
    paragraphs: [
      'Outdoor living in Charles Town, WV is decided at the house. An older lot can be tight, shaded, and graded toward a stone or block foundation, and a porch roof has to meet that wall. A later house may still have an open builder deck that the owner wants covered or screened. We look at the framing, the ledger, and the yard before we design.',
      'A Charles Town mailing address is not city limits. Inside the city, the Building Inspection office at City Hall, 101 E. Washington Street, lists decks and porches as work that needs a building permit. Apply in person or through MGO. The Department of Community Development answers at 304-724-3248.',
      'Outside city limits, that mailing address is Jefferson County. The Office of Building Permits and Inspections is at 116 East Washington Street, Suite 100. The published contact is 304-725-2998 and permits@jeffersoncountywv.org. County applications go through MGO Connect. The published deck-permit guide treats an attached deck, a walking surface more than 30 inches above grade, or permanent footings as a permit in both Berkeley and Jefferson counties. We check the parcel before we file.',
      'Gas and electrical for an outdoor kitchen or a fire feature are licensed trades. Real Elite does not take electrical work. Lighting is solar post-cap and step lights. Footings go below the frost line. The price is a free written estimate after a site walk.',
    ],
  },

  // ── STAIRS · round 5 (REA-2371) ──────────────────────────────────────────
  'stairs-loudoun-county-va': {
    h1: 'Stair Remodeling Loudoun County VA',
    metaTitle: 'Stair Remodeling Loudoun County VA | Real Elite',
    metaDescription:
      'Stair Remodeling Loudoun County VA. Treads on a sound stair usually need no permit. New exterior stairs do. We confirm with the county before work starts.',
    includeLocalBusiness: true,
    townTaggedPhotosOnly: true,
    relatedGuideSlugs: ['loudoun-county-permits-hoa-guide-2026'],
    faqs: [
      {
        question: 'Do I need a permit to redo stairs in Loudoun County?',
        answer:
          'Replacing treads, risers, or balusters on a sound stair usually needs no permit. Structural or layout changes, and new exterior stairs, do. We confirm with the county before work starts.',
      },
      {
        question: 'Do exterior stairs in Leesburg use town zoning?',
        answer:
          'Inside the Town of Leesburg, exterior stairs need Town zoning before Loudoun County releases the building permit. Purcellville and Middleburg also issue town zoning first when the work needs a county permit. Unincorporated Loudoun uses LandMARC.',
      },
      {
        question: 'What does stair remodeling in Loudoun County cost?',
        answer:
          'Every Loudoun staircase is a free written estimate after a site walk. The number depends on the step count, the tread material, and whether the balusters and handrail are part of the job.',
      },
    ],
    paragraphs: [
      'Stair remodeling in Loudoun County, VA covers two different jobs. Inside, it is carpet to hardwood treads, painted or stained risers, and wood or iron balusters on a stair that already stands. Outside, it is deck and porch stairs with a consistent rise and run, solid stringers, and a graspable handrail. We look at the stair that is there before we say which job it is.',
      'Replacing treads, risers, or balusters on a sound stair usually needs no permit. Structural or layout changes, and new exterior stairs, do. We confirm with the county before work starts. Leesburg, Purcellville, and Middleburg issue town zoning before the county building permit when the work needs one. Inside Leesburg, exterior stairs are on the Town zoning list. Unincorporated Loudoun, including Ashburn, uses LandMARC.',
      'A county permit is not HOA approval when the stair changes the exterior. We submit the association packet in parallel on those lots. Interior tread and baluster work that leaves the outside alone is a different track. Real Elite does not take electrical work. The price is a free written estimate after a site walk.',
    ],
  },

  'stairs-martinsburg-wv': {
    h1: 'Stair Remodeling Martinsburg WV',
    metaTitle: 'Stair Remodeling Martinsburg WV | Real Elite',
    metaDescription:
      'Stair Remodeling Martinsburg WV. Treads on a sound stair usually need no permit. New exterior stairs do. We confirm with the county before work starts.',
    includeLocalBusiness: true,
    townTaggedPhotosOnly: true,
    relatedGuideSlugs: ['deck-permits-berkeley-jefferson-county-wv-2026'],
    faqs: [
      {
        question: 'Do I need a permit to redo stairs in Martinsburg?',
        answer:
          'Replacing treads, risers, or balusters on a sound stair usually needs no permit. Structural or layout changes, and new exterior stairs, do. We confirm with the county before work starts. A Martinsburg mailing address is not always city limits, so the confirming office depends on the parcel.',
      },
      {
        question: 'Who reviews new exterior stairs in Martinsburg?',
        answer:
          'Inside city limits the city may run its own review. The Planning Department is at City Hall, 232 N. Queen Street. Outside the city, Berkeley County generally requires a building permit for an attached deck, a deck more than 30 inches above grade, or a deck on permanent footings. New exterior stairs on that kind of structure follow the parcel we measure.',
      },
      {
        question: 'What does stair remodeling in Martinsburg cost?',
        answer:
          'Every Martinsburg staircase is a free written estimate after a site walk. Interior tread and baluster work is a different scope from new deck or porch stairs, and the estimate says which one the house is.',
      },
    ],
    paragraphs: [
      'Stair remodeling in Martinsburg, WV is usually one of two stairs. In an older house near Queen Street the interior stair may still wear carpet, with loose treads and a rail that moves when you lean on it. On a later house toward Spring Mills, Hedgesville, or the Route 11 corridor the worn piece is often the deck or porch stair, which takes more weather than the rest of the deck.',
      'Replacing treads, risers, or balusters on a sound stair usually needs no permit. Structural or layout changes, and new exterior stairs, do. We confirm with the county before work starts. A Martinsburg mailing address is not city limits. Inside the city, the Planning Department at City Hall, 232 N. Queen Street, may run its own review. The published Planning number is (304) 264-2131.',
      'Outside the city, Berkeley County generally requires a building permit for an attached deck, a deck more than 30 inches above grade, or a deck on permanent footings. New exterior stairs on that structure are part of the same parcel check. The county office is at 400 West Stephen Street, Suite 202, and publishes 304-264-1966. Filings outside the city go through the Berkeley County OneStop portal. The price is a free written estimate after a site walk.',
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
