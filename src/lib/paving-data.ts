import type { LucideIcon } from 'lucide-react';
import { Construction, Car, Building2, Droplets, Wrench, Layers } from 'lucide-react';

/* ==========================================================================
 * Paving SEO architecture — data layer
 *
 * Two content axes:
 *   PAVING_SERVICES  — 6 service templates (asphalt, driveway, parking lot,
 *                      sealcoating, asphalt repair, commercial)
 *   PAVING_LOCATIONS — 10 locally-written town pages
 *
 * The route layer (/paving, /paving/[service], /paving/locations/[location])
 * reads from here. The data is intentionally hand-written and unique per
 * page to avoid thin/doorway content — adding a service×location combo later
 * means adding hand-written copy here, never auto-spinning it.
 *
 * Paving is delivered in partnership with A+ Paving & Landscaping; the
 * /full-property-perimeter bundle is cross-linked throughout.
 * ======================================================================== */

export type PavingFaq = { question: string; answer: string };

export type PavingService = {
  slug: string;
  name: string;
  navLabel: string;
  iconKey: keyof typeof PAVING_ICONS;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  hero: { eyebrow: string; line1: string; accent: string; sub: string };
  intro: string[];
  whatsIncluded: { title: string; body: string }[];
  process: { title: string; body: string }[];
  signals: string[];
  investment: { range: string; note: string };
  faqs: PavingFaq[];
};

export type PavingLocation = {
  slug: string;
  city: string;
  state: 'WV' | 'MD' | 'VA';
  county: string;
  zips: string[];
  nearby: string[]; // location slugs
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroSub: string;
  intro: string[];
  localFactors: { title: string; body: string }[];
  faqs: PavingFaq[];
};

export const PAVING_ICONS: Record<string, LucideIcon> = {
  asphalt: Construction,
  driveway: Car,
  parking: Building2,
  sealcoat: Droplets,
  repair: Wrench,
  commercial: Layers,
};

/* -------------------------------------------------------------------------- */
/*  SERVICES                                                                   */
/* -------------------------------------------------------------------------- */

export const PAVING_SERVICES: PavingService[] = [
  {
    slug: 'asphalt-paving',
    name: 'Asphalt Paving',
    navLabel: 'Asphalt Paving',
    iconKey: 'asphalt',
    metaTitle: 'Asphalt Paving Contractor — WV, MD & VA',
    metaDescription:
      'Professional asphalt paving across the Eastern Panhandle, Cumberland Valley, and Northern Shenandoah Valley. Proper base prep, grading, and compaction for driveways, lots, and roads. Free estimate.',
    keywords: [
      'asphalt paving',
      'asphalt paving contractor WV',
      'asphalt contractor near me',
      'new asphalt installation',
      'asphalt paving Martinsburg',
      'paving company Eastern Panhandle',
    ],
    hero: {
      eyebrow: 'Asphalt Paving',
      line1: 'Asphalt that lasts,',
      accent: 'because the base is done right.',
      sub: 'New asphalt for driveways, lots, and private roads across WV, MD, and VA. The smooth top layer everyone sees only lasts as long as the base underneath it — and the base is where we do our most disciplined work.',
    },
    intro: [
      "Most asphalt failures in the Mid-Atlantic don't start at the surface — they start underneath. A driveway or lot installed over a poorly compacted, poorly drained base will crack, rut, and pothole years before its time, no matter how clean the top coat looked on day one. Real Elite Contracting and our paving partner approach every asphalt project from the ground up: excavate to the right depth, install and compact a proper stone base, grade for positive drainage, then lay and compact hot-mix asphalt to the correct thickness.",
      "We handle full-depth new installations and resurfacing overlays for residential driveways, commercial parking lots, churches, HOA roads, and private lanes throughout the Eastern Panhandle of West Virginia, the Cumberland Valley in Maryland, and the Northern Shenandoah Valley in Virginia. Every job gets the same thing our roofing and remodeling customers already know us for — a named point of contact, a clean site, and work that's built to a standard, not a deadline.",
    ],
    whatsIncluded: [
      { title: 'Site excavation & grading', body: 'We remove failed material, establish sub-grade, and grade for positive drainage so water sheds off the surface instead of pooling and undermining it.' },
      { title: 'Stone base installation', body: 'A compacted aggregate base sized to the load — heavier for commercial traffic, appropriate for residential. The base carries the weight; the asphalt rides on top.' },
      { title: 'Hot-mix asphalt placement', body: 'Asphalt laid at proper temperature and thickness, then compacted with the right equipment for a dense, durable surface that resists cracking.' },
      { title: 'Edges, transitions & aprons', body: 'Clean transitions where new asphalt meets garages, sidewalks, and roadways — including the apron where your driveway meets the street.' },
    ],
    process: [
      { title: 'Recon', body: 'We assess the site, soil, drainage, and intended use, then put a clear written scope and price in front of you — no vague allowances.' },
      { title: 'Prep', body: 'Excavation, sub-grade compaction, and stone base. This is the unglamorous work that determines whether the asphalt lasts 8 years or 20.' },
      { title: 'Pave', body: 'Hot-mix asphalt placed and compacted to spec, with attention to grade and edges. We pave in the right weather window — Mid-Atlantic season runs roughly April to October.' },
      { title: 'Inspect', body: 'We walk the finished surface with you, confirm drainage, and tell you exactly when it can take traffic and when it should be sealcoated.' },
    ],
    signals: [
      'Veteran-owned, with a named project lead from estimate to final walk-through',
      'Proper base prep and drainage — not just a thin top coat',
      'Licensed and insured across West Virginia, Maryland, and Virginia',
      'Written workmanship standards on every project',
    ],
    investment: {
      range: 'Most residential driveways: $4–$7 / sq ft installed',
      note: 'Final pricing depends on size, base condition, drainage work, and access. A typical Eastern Panhandle driveway runs $4,000–$10,000. You get an exact written number after a free on-site measure.',
    },
    faqs: [
      { question: 'How long does new asphalt take to cure before I can drive on it?', answer: 'You can usually drive on new asphalt within 24–72 hours, but it continues to cure for 6–12 months. We give you specific guidance for your job — including when to avoid sharp turns, parking in the same spot, and heavy point loads while it fully hardens.' },
      { question: 'What time of year is best for asphalt paving in WV, MD, and VA?', answer: 'The Mid-Atlantic paving season runs roughly April through October, when ground and air temperatures let hot-mix asphalt compact properly. We schedule around the weather to make sure your surface is laid and compacted correctly.' },
      { question: 'Should I repair, resurface, or fully replace my asphalt?', answer: 'It depends on the base. If the underlying stone base is sound and the damage is surface-level, a resurfacing overlay can add years for less money. If the base has failed — widespread alligator cracking, sinking, drainage problems — full replacement is the honest answer. We tell you which one your surface actually needs.' },
      { question: 'How thick should my asphalt be?', answer: 'Residential driveways are typically installed with a compacted stone base plus 2–3 inches of asphalt; commercial and heavier-traffic surfaces need more. We spec thickness to your actual use rather than a one-size number.' },
    ],
  },
  {
    slug: 'driveway-paving',
    name: 'Driveway Paving',
    navLabel: 'Driveway Paving',
    iconKey: 'driveway',
    metaTitle: 'Driveway Paving — Asphalt Driveways in WV, MD & VA',
    metaDescription:
      'New asphalt driveways and replacements across the Eastern Panhandle and Mid-Atlantic. Curb appeal, proper drainage, clean aprons, and a surface built to last. Veteran-owned. Free estimate.',
    keywords: [
      'driveway paving',
      'asphalt driveway',
      'driveway paving near me',
      'new driveway cost WV',
      'driveway replacement Martinsburg',
      'residential paving Eastern Panhandle',
    ],
    hero: {
      eyebrow: 'Driveway Paving',
      line1: 'A driveway that lifts',
      accent: 'the whole property.',
      sub: 'Your driveway is the first thing visitors see and the last thing you walk across every night. We install smooth, well-drained asphalt driveways that add curb appeal and value — and hold up to Mid-Atlantic winters.',
    },
    intro: [
      "A new asphalt driveway is one of the highest-impact, best-value exterior upgrades a homeowner can make. It's the frame around your house — a cracked, patched, weed-split driveway drags down even a beautifully kept home, while clean black asphalt instantly sharpens the whole property. For homeowners getting ready to sell, it's one of the most visible improvements you can point to.",
      "Real Elite Contracting and our paving partner install and replace residential asphalt driveways across the Eastern Panhandle of WV, Frederick and Washington counties in MD, and the Winchester area of VA. We handle single and double driveways, long rural lanes, gravel-to-asphalt conversions, and full tear-out-and-replace jobs. Because so many homes in our area sit on half-acre to multi-acre lots with long approaches, we're as comfortable with a 600-foot country driveway as we are with a tidy suburban apron.",
      "And if the driveway is part of a bigger exterior refresh, ask about our Full Property Perimeter bundle — roof, siding, deck, driveway, and landscaping coordinated under one schedule with one point of contact.",
    ],
    whatsIncluded: [
      { title: 'Drainage-first grading', body: 'We grade your driveway to move water away from your home and garage — the single biggest factor in how long the surface lasts and whether your foundation stays dry.' },
      { title: 'Proper base for your soil', body: 'Eastern Panhandle clay and rural sub-grades vary lot to lot. We build the stone base to match what we actually find when we excavate.' },
      { title: 'Clean apron & street transition', body: 'A crisp, properly tied-in apron where your driveway meets the road — the detail that makes a driveway look professionally done.' },
      { title: 'Gravel-to-asphalt conversion', body: 'Tired of grading and re-graveling a muddy lane every spring? We convert gravel driveways to asphalt with the base work to support it.' },
    ],
    process: [
      { title: 'Free on-site measure', body: 'We measure the driveway, check the slope and drainage, and ask how you actually use it — RVs, trailers, multiple vehicles all change the spec.' },
      { title: 'Written, itemized quote', body: 'You get a clear scope and price, including any base repair or drainage work — no surprise change orders mid-job.' },
      { title: 'Install', body: 'Excavation, base, paving, and compaction, typically completed in a day or two for a standard residential driveway, weather permitting.' },
      { title: 'Walk-through & care guide', body: 'We show you the finished work, confirm drainage, and tell you exactly when to seal it and how to protect it through the first winter.' },
    ],
    signals: [
      'Curb-appeal and resale-focused finish work',
      'Drainage graded to protect your foundation, not just the surface',
      'Long rural driveways and gravel conversions welcome',
      'Pairs with our Full Property Perimeter exterior bundle',
    ],
    investment: {
      range: 'Typical Eastern Panhandle driveway: $4,000–$10,000',
      note: 'A standard two-car driveway often lands in the $4k–$7k range; long rural lanes and gravel conversions run higher. Regional asphalt runs about $4–$7 per square foot installed. You get an exact number after a free measure.',
    },
    faqs: [
      { question: 'How much does a new asphalt driveway cost?', answer: 'Most residential asphalt driveways in our area run between $4,000 and $10,000, or roughly $4–$7 per square foot installed. The big variables are size, how much base and drainage work the site needs, and access for equipment. We give you an exact written price after a free on-site measure.' },
      { question: 'How long will my new driveway last?', answer: 'A properly installed asphalt driveway with a sound base typically lasts 15–20 years. Sealcoating every 3–5 years and addressing small cracks early can push it toward the top of that range. The base and drainage we install on day one are what determine the lifespan.' },
      { question: 'Can you pave over my existing gravel or old asphalt driveway?', answer: 'Sometimes. If your gravel base is well-compacted and drains well, we can pave over it after prep. Over old asphalt, an overlay works only if the existing base is still sound. If the base has failed, paving over it just buries the problem — we will tell you honestly which approach your driveway needs.' },
      { question: 'When can I park on my new driveway?', answer: 'Usually within 1–3 days, but new asphalt stays soft as it cures over the first several months. We give you specific guidance — avoid parking in the exact same spot, sharp turning while stationary, and heavy point loads (like trailer jacks or kickstands) through that first hot summer.' },
    ],
  },
  {
    slug: 'parking-lot-paving',
    name: 'Parking Lot Paving',
    navLabel: 'Parking Lot Paving',
    iconKey: 'parking',
    metaTitle: 'Parking Lot Paving — Commercial Asphalt WV, MD & VA',
    metaDescription:
      'Parking lot paving and resurfacing for businesses, churches, HOAs, and retail across the Eastern Panhandle and Mid-Atlantic. Drainage, ADA-compliant striping, durable surfaces, minimal downtime.',
    keywords: [
      'parking lot paving',
      'commercial parking lot paving',
      'parking lot resurfacing',
      'church parking lot paving WV',
      'HOA paving Eastern Panhandle',
      'parking lot striping',
    ],
    hero: {
      eyebrow: 'Parking Lot Paving',
      line1: 'A lot that handles',
      accent: 'the traffic and the rain.',
      sub: 'Parking lots for businesses, churches, retail, and HOAs across WV, MD, and VA. Built for real traffic loads and graded so storm water drains where it should — with striping that keeps you compliant and organized.',
    },
    intro: [
      "A parking lot is the first impression of your business and a real safety and liability surface. Standing water, faded striping, potholes, and crumbling edges don't just look bad — they create trip hazards, ADA compliance gaps, and drainage problems that accelerate failure. A well-built lot does the opposite: it directs traffic cleanly, sheds water, and signals that the business behind it is run with care.",
      "Real Elite Contracting and our paving partner pave and resurface commercial and institutional parking lots throughout the Eastern Panhandle, Hagerstown and Frederick in Maryland, and the Winchester area of Virginia. We work with retail centers, offices, churches, medical and dental practices, restaurants, and homeowner associations. We understand that your lot has to stay usable — so we phase the work, schedule around your hours, and keep access open wherever possible.",
    ],
    whatsIncluded: [
      { title: 'Engineered drainage & grading', body: 'We grade lots to move storm water to the right outlets and eliminate the standing-water spots that crack and pothole first.' },
      { title: 'Base built for traffic load', body: 'Commercial traffic — delivery trucks, constant turning, heavy parking — needs a heavier base and asphalt section than a driveway. We spec it to the actual load.' },
      { title: 'ADA-compliant layout & striping', body: 'Accessible spaces, access aisles, and signage placed to meet requirements, plus clean striping for stalls, fire lanes, and traffic flow.' },
      { title: 'Phased scheduling, minimal downtime', body: 'We sequence work so half the lot stays open while the other half is paved — coordinating around your busiest hours.' },
    ],
    process: [
      { title: 'Site & traffic assessment', body: 'We evaluate the existing surface, drainage, traffic patterns, and ADA layout, then build a scope that fits how your lot is actually used.' },
      { title: 'Phasing plan', body: 'You get a written plan that keeps your business accessible — including which sections close when, and for how long.' },
      { title: 'Pave & compact', body: 'Base repair or full reconstruction as needed, then asphalt placement and compaction to commercial spec.' },
      { title: 'Stripe & hand over', body: 'Fresh layout striping and markings once the surface has cured, plus a maintenance recommendation to protect the investment.' },
    ],
    signals: [
      'Phased work that keeps your business open',
      'ADA-compliant layout and striping',
      'Base and asphalt spec built for commercial traffic',
      'One accountable point of contact start to finish',
    ],
    investment: {
      range: 'Quoted per lot — driven by size, base condition & phasing',
      note: 'Commercial lots vary widely based on square footage, traffic load, drainage, and how the work has to be phased around your operating hours. We provide a detailed written proposal after a site assessment.',
    },
    faqs: [
      { question: 'Can you pave our parking lot without shutting down our business?', answer: 'In most cases, yes. We phase the work so part of the lot stays open and accessible while we pave the rest, and we schedule around your busiest hours. For churches and weekend-heavy businesses, we often work mid-week; for weekday businesses, we can work weekends. We build the phasing plan around your schedule.' },
      { question: 'Do you handle ADA-compliant striping and accessible spaces?', answer: 'Yes. We lay out accessible spaces, access aisles, signage, and markings to meet accessibility requirements, along with stall striping, fire lanes, directional arrows, and crosswalks. A compliant, clearly marked lot reduces both liability and confusion.' },
      { question: 'Should we resurface or fully reconstruct our lot?', answer: 'If the base is sound and the problems are surface-level — minor cracking, faded striping, thinning asphalt — resurfacing with an overlay is cost-effective and fast. If you have widespread alligator cracking, sinking areas, or drainage failure, those are base problems that an overlay will not fix. We assess the lot and recommend the option that actually solves the problem.' },
      { question: 'How long will a commercial lot be out of service?', answer: 'It depends on size and whether we are resurfacing or reconstructing, but phasing usually means no section is closed for more than a few days, and the lot stays partially open throughout. Fresh striping needs the surface to cure first, which we factor into the schedule.' },
    ],
  },
  {
    slug: 'sealcoating',
    name: 'Sealcoating',
    navLabel: 'Sealcoating',
    iconKey: 'sealcoat',
    metaTitle: 'Sealcoating — Driveway & Parking Lot Sealing WV, MD & VA',
    metaDescription:
      'Asphalt sealcoating and crack filling across the Eastern Panhandle and Mid-Atlantic. Protect your driveway or lot from water, UV, and freeze-thaw — and double its life. Free estimate.',
    keywords: [
      'sealcoating',
      'driveway sealcoating',
      'asphalt sealing near me',
      'parking lot sealcoating WV',
      'crack filling',
      'asphalt maintenance Eastern Panhandle',
    ],
    hero: {
      eyebrow: 'Sealcoating',
      line1: 'The cheapest way',
      accent: 'to double your asphalt’s life.',
      sub: 'Sealcoating protects your driveway or lot from water, UV, oil, and freeze-thaw damage. Done on the right cycle, it’s the single best-value way to protect the thousands you already invested in asphalt.',
    },
    intro: [
      "Asphalt is held together by a binder that the Mid-Atlantic climate is constantly trying to break down. UV bakes it brittle in summer; water seeps into hairline cracks and then freezes and expands all winter, prying them wider. Sealcoating is the protective layer that fights both — a fresh seal coat shields the surface from water and sun, resists oil and gas spills, and restores that deep black, well-kept look.",
      "More importantly, it's the highest-return maintenance you can do. Sealcoating a driveway costs a small fraction of replacing it, and on the right cycle it can roughly double the life of the asphalt underneath. We sealcoat residential driveways and commercial lots across the Eastern Panhandle, Cumberland Valley, and Winchester area — and we always fill cracks first, because sealing over an open crack just hides a problem that keeps growing.",
    ],
    whatsIncluded: [
      { title: 'Crack filling first', body: 'We rout and fill cracks with hot or cold crack filler before sealing. Sealing over open cracks traps the problem; filling them first stops water from getting into the base.' },
      { title: 'Thorough surface cleaning', body: 'Blowing, sweeping, and spot-treating oil stains so the seal coat actually bonds to clean asphalt instead of dust and debris.' },
      { title: 'Even, proper-cure application', body: 'Seal coat applied at the right rate and in the right weather window so it cures hard — not too thin to protect, not so thick it peels.' },
      { title: 'Right-cycle scheduling', body: 'We tell you honestly when to seal again — typically every 3–5 years for a driveway — instead of pushing you onto a too-frequent, money-wasting schedule.' },
    ],
    process: [
      { title: 'Inspect & advise', body: 'We check the surface and cracks and tell you whether it actually needs sealing yet — fresh asphalt should cure 6–12 months before its first seal.' },
      { title: 'Prep & crack fill', body: 'Clean the surface, treat oil spots, and fill cracks so the seal has clean, sound asphalt to bond to.' },
      { title: 'Seal', body: 'Even application in dry, warm conditions (above ~50°F and rising), which is why sealcoating season runs roughly May through October here.' },
      { title: 'Cure guidance', body: 'We tell you exactly how long to keep traffic off — usually 24–48 hours — so the coat cures hard and lasts.' },
    ],
    signals: [
      'Cracks filled before sealing — always',
      'Honest cycle advice, not an over-frequent upsell',
      'Driveways and full commercial lots',
      'Best-value way to protect an asphalt investment',
    ],
    investment: {
      range: 'Driveways often $300–$600; lots quoted by size',
      note: 'A typical residential driveway sealcoat (with crack filling) commonly lands around $300–$600 depending on size and condition; commercial lots are quoted per square foot. Bundling sealcoat with a paving job is the most economical time to do it.',
    },
    faqs: [
      { question: 'How often should I sealcoat my driveway?', answer: 'For most residential asphalt driveways, every 3–5 years is the sweet spot. Sealing more often than that mostly wastes money; waiting much longer lets UV and water start breaking down the binder. We look at your actual surface and give you an honest interval rather than a default upsell.' },
      { question: 'When can I sealcoat brand-new asphalt?', answer: 'Wait 6–12 months. New asphalt needs to cure and release its oils before it will accept a seal coat properly. Sealing too early can trap those oils and cause problems. After that first cure, get on a regular cycle.' },
      { question: 'Does sealcoating fix cracks and potholes?', answer: 'No — and any company that says it does is cutting corners. Sealcoating is a protective surface coating, not a repair. We fill cracks before we seal, and potholes or failed areas need proper patching or repair first. Sealcoating then protects the sound surface around them.' },
      { question: 'How long does sealcoat take to dry?', answer: 'Plan on keeping traffic off for 24–48 hours, longer in cool or humid conditions. We apply in warm, dry weather (the season runs roughly May–October here) so it cures hard. We give you exact timing for your job and weather.' },
    ],
  },
  {
    slug: 'asphalt-repair',
    name: 'Asphalt Repair',
    navLabel: 'Asphalt Repair',
    iconKey: 'repair',
    metaTitle: 'Asphalt Repair — Pothole, Crack & Patch WV, MD & VA',
    metaDescription:
      'Asphalt repair, pothole patching, crack filling, and resurfacing across the Eastern Panhandle and Mid-Atlantic. Fix problems before they spread — extend the life of your driveway or lot. Free estimate.',
    keywords: [
      'asphalt repair',
      'pothole repair',
      'asphalt crack filling',
      'driveway repair near me',
      'asphalt patching WV',
      'parking lot repair Eastern Panhandle',
    ],
    hero: {
      eyebrow: 'Asphalt Repair',
      line1: 'Fix it now,',
      accent: 'before it spreads.',
      sub: 'Potholes, cracks, sunken spots, and crumbling edges only get bigger — and more expensive. We repair, patch, and resurface asphalt across WV, MD, and VA so a small problem never becomes a full replacement.',
    },
    intro: [
      "Asphalt almost never fails all at once. It starts with a hairline crack, a soft spot, a crumbling edge — and the Mid-Atlantic freeze-thaw cycle does the rest, working water into the damage and prying it apart every winter. The homeowners and businesses who stay ahead of those small problems get years of extra life out of their asphalt. The ones who wait end up replacing the whole surface.",
      "Real Elite Contracting and our paving partner handle the full range of asphalt repair across the Eastern Panhandle, Hagerstown, Frederick, and Winchester areas: pothole patching, crack filling, sunken-area repair, edge repair, and resurfacing overlays when a surface is worn but the base is still sound. We'll always tell you honestly whether a repair buys you real time or whether you'd be throwing good money after bad on a surface that needs replacement.",
    ],
    whatsIncluded: [
      { title: 'Pothole patching', body: 'Proper cut-out, clean, and compacted hot-mix patching that bonds and lasts — not a shovel of cold mix that pops out by spring.' },
      { title: 'Crack filling', body: 'Routing and sealing cracks before water gets into the base. The cheapest repair there is, and the one that prevents the most expensive damage.' },
      { title: 'Sunken & soft-spot repair', body: 'Where the base has failed in spots, we dig out and rebuild the base before repaving — fixing the cause, not just the symptom.' },
      { title: 'Resurfacing overlays', body: 'When the surface is worn but the base is sound, a new asphalt overlay restores a smooth, sealed surface for far less than replacement.' },
    ],
    process: [
      { title: 'Honest diagnosis', body: 'We find out whether the problem is surface-level or a base failure — because that determines whether a repair is worth doing or just delaying the inevitable.' },
      { title: 'Scope & price', body: 'A written scope that tells you what we are fixing, how, and what kind of life it should buy you.' },
      { title: 'Repair', body: 'Cut, clean, rebuild base where needed, patch or overlay with hot-mix, and compact properly so the repair holds.' },
      { title: 'Seal recommendation', body: 'We tell you whether crack-filling or a follow-up sealcoat will protect the repair and extend the surface around it.' },
    ],
    signals: [
      'Honest repair-vs-replace advice',
      'Hot-mix patching that actually bonds and lasts',
      'Catch small problems before freeze-thaw spreads them',
      'Residential and commercial surfaces',
    ],
    investment: {
      range: 'Repairs quoted by scope — far less than replacement',
      note: 'Crack filling and small patches are inexpensive; larger patching, base rebuilds, and overlays cost more but a fraction of full replacement. We quote the specific repair and tell you the realistic life it buys.',
    },
    faqs: [
      { question: 'Is it worth repairing my asphalt or should I just replace it?', answer: 'It comes down to the base. If the base is sound and the damage is surface-level — cracks, isolated potholes, surface wear — repairs and resurfacing are absolutely worth it and far cheaper than replacement. If the base has failed widely (sinking, widespread alligator cracking, drainage failure), repairs are a temporary patch on a surface that needs replacing. We give you the honest call.' },
      { question: 'Why do cold-patch pothole repairs keep failing?', answer: 'Because cold mix shoveled into a dirty, un-cut hole has nothing to bond to — it compresses, loosens, and pops out, especially through freeze-thaw. We cut the area clean, prep it, and use compacted hot-mix so the patch actually integrates with the surrounding asphalt and lasts.' },
      { question: 'How fast do small asphalt cracks become big problems?', answer: 'Fast, once water gets in. A hairline crack lets water reach the base; the Mid-Atlantic freeze-thaw cycle then expands it every winter, widening the crack and undermining the surface. Crack filling is cheap; the base repair it prevents is not. Addressing cracks early is the highest-return maintenance you can do.' },
      { question: 'What is a resurfacing overlay?', answer: 'An overlay is a new layer of asphalt placed over an existing surface whose base is still sound. It restores a smooth, sealed driving surface and adds years of life for significantly less than a full tear-out and replacement — but only when the base underneath is still good.' },
    ],
  },
  {
    slug: 'commercial-paving',
    name: 'Commercial Paving',
    navLabel: 'Commercial Paving',
    iconKey: 'commercial',
    metaTitle: 'Commercial Paving Contractor — WV, MD & VA',
    metaDescription:
      'Commercial asphalt paving for businesses, municipalities, churches, and HOAs across the Eastern Panhandle and Mid-Atlantic. Durable surfaces, phased scheduling, minimal downtime. Free proposal.',
    keywords: [
      'commercial paving',
      'commercial asphalt contractor',
      'commercial paving WV',
      'municipal paving Eastern Panhandle',
      'business parking paving',
      'HOA road paving',
    ],
    hero: {
      eyebrow: 'Commercial Paving',
      line1: 'Surfaces built for',
      accent: 'business, not just looks.',
      sub: 'Asphalt for businesses, churches, HOAs, and municipal sites across WV, MD, and VA. Heavier specs for real traffic loads, phased scheduling that keeps you operating, and one accountable contractor from proposal to final stripe.',
    },
    intro: [
      "Commercial asphalt is a different discipline from a residential driveway. The traffic loads are heavier, the drainage spans are larger, the downtime costs real money, and the liability is higher. A business or municipal surface has to carry delivery trucks and constant turning, drain a much larger footprint, meet accessibility requirements, and do it all while staying usable. That takes a heavier base, a thicker asphalt section, and a contractor who plans the work around your operation.",
      "Real Elite Contracting and our paving partner take on commercial and institutional paving across the Eastern Panhandle, Hagerstown and Frederick in Maryland, and the Winchester corridor in Virginia — retail and office sites, churches, medical practices, restaurants, HOAs, and private roads. We bring the same accountability our name is built on: one point of contact, a written phasing plan, clean execution, and a finished surface specced for the traffic it actually has to carry.",
    ],
    whatsIncluded: [
      { title: 'Heavy-duty base & section', body: 'Base depth and asphalt thickness engineered for commercial traffic loads — trucks, constant turning movements, and sustained parking.' },
      { title: 'Large-footprint drainage', body: 'Grading and drainage designed for a full commercial site so storm water moves to the right outlets instead of pooling and destroying the surface.' },
      { title: 'Phased project management', body: 'A written sequence that keeps your site operating — closing and reopening sections so you never go fully dark.' },
      { title: 'Layout, striping & markings', body: 'ADA-compliant accessible spaces, stalls, fire lanes, directional markings, and signage to keep the site organized and compliant.' },
    ],
    process: [
      { title: 'Assessment & proposal', body: 'We evaluate the site, traffic, drainage, and accessibility needs and deliver a detailed written proposal with a clear scope and phasing approach.' },
      { title: 'Coordination', body: 'We coordinate timing, access, and phasing with your operations team so the work fits your hours and obligations.' },
      { title: 'Build', body: 'Base reconstruction or repair, asphalt placement, and compaction to commercial spec — sequenced to keep you open.' },
      { title: 'Stripe & document', body: 'Final layout striping and markings, plus a maintenance plan to protect the surface and your investment over time.' },
    ],
    signals: [
      'Specs engineered for real commercial traffic loads',
      'Phased scheduling that keeps your site operating',
      'ADA-compliant layout and striping',
      'Licensed, insured, and accountable across WV, MD, VA',
    ],
    investment: {
      range: 'Detailed written proposal after a site assessment',
      note: 'Commercial projects are priced on square footage, traffic load, drainage, base condition, and phasing requirements. We provide a thorough written proposal so you can budget and compare with confidence.',
    },
    faqs: [
      { question: 'Do you work with churches, HOAs, and municipalities?', answer: 'Yes. We regularly pave for churches, homeowner associations, and institutional and municipal sites in addition to private businesses. We understand the budgeting, board-approval, and scheduling realities those organizations work within and plan the project around them.' },
      { question: 'How do you minimize downtime for a working business?', answer: 'We build a written phasing plan before we start — sequencing the work so part of your lot or site stays open and accessible while we pave the rest, and scheduling around your busiest hours. The goal is that you never have to fully close.' },
      { question: 'Can you handle base reconstruction, not just surface paving?', answer: 'Yes. Many commercial surface problems are actually base failures. We can excavate and rebuild failed base sections, correct drainage, and then repave — fixing the underlying cause so the new surface lasts, rather than paving over a problem.' },
      { question: 'Do you provide documentation for budgeting and approvals?', answer: 'Yes. We provide a detailed written proposal with a clear scope, phasing plan, and pricing — the kind of documentation a business owner, facilities manager, or HOA board needs to budget the project and get it approved.' },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  LOCATIONS                                                                  */
/* -------------------------------------------------------------------------- */

export const PAVING_LOCATIONS: PavingLocation[] = [
  {
    slug: 'martinsburg-wv',
    city: 'Martinsburg',
    state: 'WV',
    county: 'Berkeley County',
    zips: ['25401', '25403', '25404', '25405'],
    nearby: ['inwood-wv', 'spring-mills-wv', 'hedgesville-wv', 'falling-waters-wv'],
    metaTitle: 'Paving Martinsburg WV — Asphalt, Driveways & Sealcoating',
    metaDescription:
      'Asphalt paving, driveways, parking lots, sealcoating, and repair in Martinsburg, WV. Veteran-owned, locally based in Berkeley County. Free estimate from a contractor who knows the area.',
    keywords: [
      'paving Martinsburg WV',
      'asphalt paving Martinsburg',
      'driveway paving Martinsburg WV',
      'sealcoating Martinsburg',
      'Berkeley County paving',
    ],
    heroSub:
      'Asphalt paving, driveways, parking lots, sealcoating, and repair for Martinsburg homeowners and businesses. We are headquartered right here in Berkeley County — this is our home market.',
    intro: [
      "Martinsburg is our home base, and we know its driveways and lots as well as anyone. As the county seat of Berkeley County and the hub of the fastest-growing county in West Virginia, Martinsburg runs the full range — historic homes around the Burke Street district with tight, original driveways; sprawling newer subdivisions south of town and out toward Spring Mills; and busy commercial corridors along Foxcroft Avenue and the I-81 interchanges that put real traffic on their parking lots.",
      "That mix is exactly why local knowledge matters. A driveway in the historic district has different access and drainage constraints than a half-acre lot in Pikeside, and a retail lot off Edwin Miller Boulevard takes punishment a residential apron never will. Because we are based here, we are quick to get out for an estimate, quick to respond, and accountable to neighbors we will see again around town.",
    ],
    localFactors: [
      { title: 'Roads & neighborhoods', body: 'From the historic Burke Street and North End districts to Pikeside, Foxcroft, and the growing subdivisions along the I-81 corridor — plus commercial lots on Foxcroft Avenue and Edwin Miller Boulevard.' },
      { title: 'Eastern Panhandle climate', body: "Martinsburg's freeze-thaw winters and hot, humid summers are hard on asphalt. Proper base, drainage, and a sensible sealcoating cycle are what separate a driveway that lasts from one that cracks early." },
      { title: 'Driveway profiles', body: 'Tight historic-district approaches, standard suburban two-car driveways, and longer driveways on the larger lots ringing the city — we handle all three, plus gravel-to-asphalt conversions.' },
    ],
    faqs: [
      { question: 'Are you actually local to Martinsburg?', answer: 'Yes — Real Elite Contracting is headquartered in Martinsburg, and the Eastern Panhandle is our home market. That means fast estimates, fast response, and a contractor you can hold accountable because we are your neighbors, not a crew passing through from out of state.' },
      { question: 'Do you pave both driveways and commercial lots in Martinsburg?', answer: 'Both. We pave residential driveways across Martinsburg and Berkeley County, and we pave and resurface commercial parking lots for businesses, churches, and HOAs along the Foxcroft, Edwin Miller, and I-81 corridors — with phasing that keeps businesses open.' },
      { question: 'How soon can you give me a paving estimate in Martinsburg?', answer: 'Because we are based right here, we can usually get out for a free on-site measure within the same week, and often sooner. You get a clear written price with no vague allowances.' },
    ],
  },
  {
    slug: 'inwood-wv',
    city: 'Inwood',
    state: 'WV',
    county: 'Berkeley County',
    zips: ['25428'],
    nearby: ['martinsburg-wv', 'spring-mills-wv', 'hedgesville-wv', 'winchester-va'],
    metaTitle: 'Paving Inwood WV — Asphalt Driveways & Sealcoating',
    metaDescription:
      'Asphalt paving, driveways, sealcoating, and repair in Inwood, WV. Local, veteran-owned paving for the Route 51 corridor and Inwood’s growing subdivisions. Free estimate.',
    keywords: [
      'paving Inwood WV',
      'asphalt driveway Inwood',
      'driveway paving Inwood WV',
      'sealcoating Inwood',
      'Route 51 paving',
    ],
    heroSub:
      'Asphalt driveways, paving, sealcoating, and repair for Inwood and the Route 51 corridor — from a contractor based just up the road in Martinsburg.',
    intro: [
      "Inwood has gone from a quiet Berkeley County crossroads to one of the busiest residential growth areas in the Eastern Panhandle, and a lot of that growth is brand-new homes on brand-new lots. New construction means a lot of fresh driveways — some still gravel, some poured cheaply by the builder and already showing problems, many ready for a proper asphalt surface that matches the home.",
      "We pave and repair driveways throughout Inwood, from the established neighborhoods near Route 51 and Gerrardstown Road to the newer subdivisions filling in around the area. Because Inwood sits just minutes south of our Martinsburg base, we are quick to respond and easy to reach — and because so many lots here are newer, we spend a lot of time getting the base and drainage right on first-time asphalt installations.",
    ],
    localFactors: [
      { title: 'Roads & neighborhoods', body: 'The Route 51 and Gerrardstown Road corridors, the Ridge Road area, and the wave of newer subdivisions that have reshaped Inwood from farmland into a fast-growing suburb.' },
      { title: 'New-construction driveways', body: 'A lot of Inwood lots are new builds — first-time asphalt installs and gravel-to-asphalt conversions where getting the base and drainage right from the start is everything.' },
      { title: 'Climate & rural lots', body: 'Eastern Panhandle freeze-thaw plus a mix of suburban and rural-acreage lots means longer driveways and drainage that has to be planned, not guessed.' },
    ],
    faqs: [
      { question: 'Do you pave new-construction driveways in Inwood?', answer: 'Yes — it is a lot of what we do here. Inwood has heavy new-home growth, and we install first-time asphalt driveways and convert gravel approaches to asphalt, with the base and drainage work to make sure that fresh driveway actually lasts.' },
      { question: 'How far is your crew from Inwood?', answer: 'Just minutes. We are headquartered in Martinsburg, immediately north of Inwood, so estimates and response are fast and we are genuinely local to the Route 51 corridor.' },
      { question: 'Can you convert my gravel driveway in Inwood to asphalt?', answer: 'Often, yes. If the existing gravel base is well-compacted and drains, we can prep and pave over it; if not, we build the base properly first. A lot of Inwood’s rural lots are perfect candidates for a gravel-to-asphalt conversion.' },
    ],
  },
  {
    slug: 'spring-mills-wv',
    city: 'Spring Mills',
    state: 'WV',
    county: 'Berkeley County',
    zips: ['25404'],
    nearby: ['martinsburg-wv', 'falling-waters-wv', 'hedgesville-wv', 'inwood-wv'],
    metaTitle: 'Paving Spring Mills WV — Asphalt Driveways & Sealcoating',
    metaDescription:
      'Asphalt paving, driveways, sealcoating, and repair in Spring Mills, WV. Local, veteran-owned paving for the Route 11 corridor and Spring Mills’ new subdivisions. Free estimate.',
    keywords: [
      'paving Spring Mills WV',
      'asphalt driveway Spring Mills',
      'driveway paving Spring Mills WV',
      'sealcoating Spring Mills',
      'Route 11 paving',
    ],
    heroSub:
      'Asphalt driveways, paving, sealcoating, and repair for Spring Mills and the Route 11 corridor — local, veteran-owned, and quick to respond.',
    intro: [
      "Spring Mills is one of the fastest-growing communities in West Virginia, and it shows in the driveways. What was a quiet stretch of Route 11 north of Martinsburg is now a wave of modern subdivisions — Sunridge, Spring Ridge, and the neighborhoods anchored around Spring Mills High School — full of newer homes that deserve a driveway to match.",
      "We pave and seal driveways throughout Spring Mills, and because the housing stock here is relatively new, much of our work is fresh asphalt installs and protecting newer driveways before the Eastern Panhandle climate gets a chance to break them down. A new driveway sealcoated on the right cycle from the start will outlast one that gets ignored until the cracks show. Spring Mills is minutes from our Martinsburg base, so we are fast to estimate and easy to reach.",
    ],
    localFactors: [
      { title: 'Roads & neighborhoods', body: 'The Route 11 corridor north of Martinsburg, the Sunridge and Spring Ridge developments, and the growing neighborhoods around Spring Mills High School and Eagle School Road.' },
      { title: 'Newer housing stock', body: 'Spring Mills skews new-construction, so much of our work is first-time asphalt and early-cycle sealcoating to protect driveways before winter damage starts.' },
      { title: 'Climate protection', body: 'Sealcoating newer driveways on a sensible 3–5 year cycle here is the highest-return way to protect them from freeze-thaw and UV in our climate.' },
    ],
    faqs: [
      { question: 'My Spring Mills home is new — when should I first sealcoat the driveway?', answer: 'Wait 6–12 months after the asphalt is installed so it fully cures, then sealcoat and get on a 3–5 year cycle. Spring Mills has a lot of newer homes, and protecting a fresh driveway early is the cheapest way to get the most years out of it.' },
      { question: 'Do you serve the Sunridge and Spring Ridge neighborhoods?', answer: 'Yes — we pave, seal, and repair driveways throughout Spring Mills, including Sunridge, Spring Ridge, and the developments along Route 11 and Eagle School Road. We are based just south in Martinsburg.' },
      { question: 'Can you pave a brand-new lot driveway in Spring Mills?', answer: 'Absolutely. With Spring Mills’ ongoing growth, first-time driveway installs are a big part of our work here — including the base and drainage prep that determines how long that new driveway lasts.' },
    ],
  },
  {
    slug: 'hedgesville-wv',
    city: 'Hedgesville',
    state: 'WV',
    county: 'Berkeley County',
    zips: ['25427'],
    nearby: ['martinsburg-wv', 'spring-mills-wv', 'falling-waters-wv', 'inwood-wv'],
    metaTitle: 'Paving Hedgesville WV — Rural Asphalt Driveways & Lanes',
    metaDescription:
      'Asphalt paving, long rural driveways, gravel-to-asphalt conversions, sealcoating, and repair in Hedgesville, WV. Veteran-owned, built for larger lots and country lanes. Free estimate.',
    keywords: [
      'paving Hedgesville WV',
      'rural driveway paving Hedgesville',
      'long driveway asphalt WV',
      'gravel to asphalt Hedgesville',
      'sealcoating Hedgesville',
    ],
    heroSub:
      'Asphalt driveways, long rural lanes, gravel conversions, sealcoating, and repair for Hedgesville and the Back Creek Valley — built for country lots.',
    intro: [
      "Hedgesville is country, and country driveways are their own challenge. Homes here sit on larger lots — often an acre or more — with longer approaches, more grade and drainage to manage, and exposure to more wind, runoff, and tree debris than a tidy suburban lot. A lot of Hedgesville driveways are long gravel lanes that turn to washboard and mud every spring, or aging asphalt that has fought the elements for years.",
      "That's exactly the kind of work we like. We pave and convert long rural driveways throughout the Hedgesville area, from the Route 9 corridor to the Back Creek Valley and Shanghai Road communities, with the base depth and drainage grading that a country lane actually needs. We are based nearby in Martinsburg, so even out in the more rural stretches we are quick to get out for a measure.",
    ],
    localFactors: [
      { title: 'Roads & neighborhoods', body: 'The Hedgesville Pike and Route 9 corridors, the Mill Creek and Back Creek Valley areas, and the Shanghai Road community — larger, more rural parcels throughout.' },
      { title: 'Long rural driveways', body: 'Acre-plus lots mean long approaches with real grade and drainage to manage. We spec base and drainage for the length and slope, not a generic short-driveway number.' },
      { title: 'Gravel-to-asphalt conversions', body: 'Tired of re-grading a muddy gravel lane every spring? Converting to asphalt is one of the most common — and most appreciated — jobs we do in the Hedgesville area.' },
    ],
    faqs: [
      { question: 'Do you pave long rural driveways in Hedgesville?', answer: 'Yes — it is a specialty. Hedgesville’s acre-plus lots often have long approaches with real grade and drainage challenges, and we spec the base depth and drainage grading to match the length and slope so the lane holds up over its full run.' },
      { question: 'Can you convert my gravel lane to asphalt?', answer: 'Very often, yes. Many Hedgesville driveways are long gravel lanes that wash out and rut every spring. We assess the existing base, build it up where needed, grade for drainage, and convert it to a smooth asphalt surface that ends the annual re-graveling.' },
      { question: 'Is your crew willing to come out to the more rural parts of Hedgesville?', answer: 'Yes. We are based in Martinsburg, close enough that even the Back Creek Valley and Shanghai Road areas are an easy trip for a free on-site measure and for the work itself.' },
    ],
  },
  {
    slug: 'falling-waters-wv',
    city: 'Falling Waters',
    state: 'WV',
    county: 'Berkeley County',
    zips: ['25419'],
    nearby: ['martinsburg-wv', 'spring-mills-wv', 'hedgesville-wv', 'hagerstown-md'],
    metaTitle: 'Paving Falling Waters WV — Asphalt Driveways & Repair',
    metaDescription:
      'Asphalt paving, driveways, sealcoating, and repair in Falling Waters, WV. Drainage-smart paving for riverside and rural lots near the Potomac. Veteran-owned. Free estimate.',
    keywords: [
      'paving Falling Waters WV',
      'asphalt driveway Falling Waters',
      'driveway paving Falling Waters WV',
      'sealcoating Falling Waters',
      'Potomac riverside paving',
    ],
    heroSub:
      'Asphalt driveways, paving, sealcoating, and repair for Falling Waters and the Potomac riverside — with the drainage focus a water-adjacent lot demands.',
    intro: [
      "Falling Waters sits along the Potomac River in northern Berkeley County, and that setting is beautiful — and demanding on asphalt. Properties near the river deal with higher moisture, more runoff, and in places flood-zone considerations, all of which make drainage the make-or-break factor for a driveway here. Water is asphalt's enemy, and in Falling Waters there's more of it to manage.",
      "We pave and repair driveways throughout the Falling Waters area, from the Route 9 corridor down toward the river communities and along Dam Number 5 Road, with grading and drainage planned for the wetter conditions. Done right, asphalt holds up beautifully here; done without respect for the water, it fails fast. We are based a short drive south in Martinsburg, so we are quick to get out and assess what your specific lot needs.",
    ],
    localFactors: [
      { title: 'Roads & neighborhoods', body: 'The Route 9 corridor, the Potomac riverside communities, the Woods Edge and River Country areas, and the Dam Number 5 Road stretch.' },
      { title: 'Water & drainage', body: 'Riverside and low-lying lots near the Potomac carry more moisture and runoff. Drainage-first grading is essential here — it is the single biggest factor in whether asphalt lasts.' },
      { title: 'Rural riverfront lots', body: 'Many properties are larger riverfront or wooded parcels with longer driveways, where managing slope and water across the full run matters.' },
    ],
    faqs: [
      { question: 'Does being near the Potomac affect how my driveway should be paved?', answer: 'Yes, significantly. Riverside and low-lying Falling Waters lots carry more moisture and runoff, and water is what destroys asphalt. We put extra focus on drainage-first grading here so storm water sheds off the surface and away from your home rather than soaking into the base.' },
      { question: 'Do you pave in the more rural riverfront parts of Falling Waters?', answer: 'Yes. We handle longer riverfront and wooded-lot driveways throughout the Falling Waters area, including the Dam Number 5 Road and Woods Edge stretches, and we are based just south in Martinsburg for fast estimates.' },
      { question: 'My driveway near the river keeps cracking — can it be saved?', answer: 'Often the cause is water in the base, not just surface wear. We assess whether the problem is fixable with crack filling and improved drainage or whether the base has failed and needs rebuilding. We give you the honest call rather than just sealing over a water problem.' },
    ],
  },
  {
    slug: 'charles-town-wv',
    city: 'Charles Town',
    state: 'WV',
    county: 'Jefferson County',
    zips: ['25414'],
    nearby: ['shepherdstown-wv', 'martinsburg-wv', 'inwood-wv', 'winchester-va'],
    metaTitle: 'Paving Charles Town WV — Asphalt Driveways & Lots',
    metaDescription:
      'Asphalt paving, driveways, parking lots, sealcoating, and repair in Charles Town, WV. Veteran-owned paving for Jefferson County homes and businesses. Free estimate.',
    keywords: [
      'paving Charles Town WV',
      'asphalt driveway Charles Town',
      'driveway paving Charles Town WV',
      'Jefferson County paving',
      'sealcoating Charles Town',
    ],
    heroSub:
      'Asphalt driveways, paving, parking lots, sealcoating, and repair for Charles Town and Jefferson County — from a veteran-owned contractor who knows the area.',
    intro: [
      "Charles Town blends deep history with fast growth. The Jefferson County seat — founded by George Washington's brother — has a historic downtown of period homes alongside a steady stream of new commuter neighborhoods filling in as residents trade Northern Virginia prices for Eastern Panhandle living. That range, plus the traffic the Hollywood Casino and racetrack bring to the area, means everything from delicate historic-home driveways to commercial lots that take real punishment.",
      "We pave and repair driveways and lots throughout Charles Town and the surrounding Jefferson County area, from the historic downtown to the newer developments out toward Flowing Springs and the Ranson line. Historic properties need a careful eye for access and drainage that respects original construction; newer subdivisions and commercial sites need durable, well-graded asphalt. We bring the same accountability to both.",
    ],
    localFactors: [
      { title: 'Roads & neighborhoods', body: 'The historic downtown district, the Flowing Springs Road area, the Cavaland and Jefferson Orchards neighborhoods, and the growing commuter developments toward Ranson.' },
      { title: 'Historic + new mix', body: 'Period homes downtown need careful, drainage-conscious driveway work; newer commuter subdivisions and commercial sites need durable, properly based asphalt. We handle both.' },
      { title: 'Jefferson County climate', body: 'Same Eastern Panhandle freeze-thaw and humid summers — proper base, drainage, and sealcoating cycles are what make asphalt last in Charles Town.' },
    ],
    faqs: [
      { question: 'Do you work on historic-home driveways in downtown Charles Town?', answer: 'Yes. Historic-district properties often have tight access and original drainage that need a careful approach. We assess each one individually and pave in a way that respects the property and manages water properly, rather than forcing a standard suburban approach onto a historic lot.' },
      { question: 'Do you pave commercial lots in Charles Town and Ranson?', answer: 'Yes — we pave and resurface commercial parking lots for businesses, churches, and HOAs across the Charles Town and Ranson area, with phasing that keeps your site open and ADA-compliant striping.' },
      { question: 'Are you local to Jefferson County?', answer: 'We are based in neighboring Martinsburg, a short drive from Charles Town, and the Eastern Panhandle is our home market. That means fast estimates and a local contractor you can hold accountable across Jefferson County.' },
    ],
  },
  {
    slug: 'shepherdstown-wv',
    city: 'Shepherdstown',
    state: 'WV',
    county: 'Jefferson County',
    zips: ['25443'],
    nearby: ['charles-town-wv', 'martinsburg-wv', 'hagerstown-md', 'winchester-va'],
    metaTitle: 'Paving Shepherdstown WV — Asphalt Driveways & Repair',
    metaDescription:
      'Asphalt paving, driveways, sealcoating, and repair in Shepherdstown, WV. Careful, drainage-smart paving for historic properties and university-area homes. Veteran-owned. Free estimate.',
    keywords: [
      'paving Shepherdstown WV',
      'asphalt driveway Shepherdstown',
      'driveway paving Shepherdstown WV',
      'historic driveway paving',
      'sealcoating Shepherdstown',
    ],
    heroSub:
      'Asphalt driveways, paving, sealcoating, and repair for Shepherdstown — careful work that respects historic properties and the university-area neighborhoods.',
    intro: [
      "Shepherdstown is the oldest town in West Virginia, and it wears that history proudly — the German Street corridor, Shepherd University, and streets of well-preserved older homes give it a character unlike anywhere else in the Panhandle. That character also means driveways and approaches that often date back generations, with tight access, mature trees, and original drainage that a careful contractor has to work with rather than against.",
      "We pave, seal, and repair driveways throughout Shepherdstown and the surrounding Jefferson County area, from the historic downtown and university neighborhoods to the properties along Shepherd Grade Road and toward Moler Crossroads. We bring a careful, detail-first approach here — clean transitions, thoughtful drainage, and respect for the trees and structures that give Shepherdstown its feel. We are a short drive away in Martinsburg.",
    ],
    localFactors: [
      { title: 'Roads & neighborhoods', body: 'The historic German Street downtown, the Shepherd University area, the Potomac riverfront, and the Shepherd Grade Road and Moler Crossroads stretches.' },
      { title: 'Historic-property care', body: 'Older homes mean tight approaches, mature trees, and original drainage. We work with those constraints carefully rather than bulldozing a generic driveway in.' },
      { title: 'Detail-first finish', body: 'In a town this proud of its character, clean edges, careful transitions, and thoughtful drainage matter — and that is exactly how we work.' },
    ],
    faqs: [
      { question: 'Can you pave a driveway at a historic Shepherdstown home without damaging the character?', answer: 'Yes — that is how we approach every historic property here. Tight access, mature trees, and original drainage all need a careful eye. We plan the work to respect the structures and landscape while still giving you a properly based, well-drained asphalt surface.' },
      { question: 'Do you serve the Shepherd University area neighborhoods?', answer: 'Yes. We pave, seal, and repair driveways throughout Shepherdstown, including the university-area neighborhoods, the historic downtown, and the surrounding Shepherd Grade and Moler Crossroads areas.' },
      { question: 'How far is your crew from Shepherdstown?', answer: 'We are based in Martinsburg, a short drive away, and the Eastern Panhandle is our home market — so estimates are quick and we are genuinely local to Shepherdstown and Jefferson County.' },
    ],
  },
  {
    slug: 'winchester-va',
    city: 'Winchester',
    state: 'VA',
    county: 'Frederick County, VA',
    zips: ['22601', '22602', '22603'],
    nearby: ['charles-town-wv', 'inwood-wv', 'martinsburg-wv', 'shepherdstown-wv'],
    metaTitle: 'Paving Winchester VA — Asphalt Driveways & Parking Lots',
    metaDescription:
      'Asphalt paving, driveways, parking lots, sealcoating, and repair in Winchester, VA. Veteran-owned paving for the Northern Shenandoah Valley. Free estimate.',
    keywords: [
      'paving Winchester VA',
      'asphalt driveway Winchester',
      'driveway paving Winchester VA',
      'parking lot paving Winchester',
      'sealcoating Winchester VA',
    ],
    heroSub:
      'Asphalt driveways, paving, parking lots, sealcoating, and repair for Winchester and the Northern Shenandoah Valley — veteran-owned and licensed in Virginia.',
    intro: [
      "Winchester is the gateway to Virginia's Shenandoah Valley and the commercial anchor of the region — a city that pairs a vibrant, walkable Old Town with fast-growing residential corridors along Route 7, Route 522, and Senseny Road. That growth drives steady demand for both new residential driveways in the expanding neighborhoods and durable commercial lots for the retail and office development following the rooftops.",
      "We pave and repair driveways and parking lots throughout the Winchester area, licensed and insured in Virginia just as we are in West Virginia and Maryland. From Old Town's established homes to the newer subdivisions out the Route 7 and Senseny Road corridors, and the commercial sites serving them, we bring proper base work, drainage-first grading, and the same accountable, single-point-of-contact approach our Eastern Panhandle customers already know.",
    ],
    localFactors: [
      { title: 'Roads & neighborhoods', body: 'Old Town Winchester, the Senseny Road and Route 7 corridors, the Route 522 growth areas, and the Millwood Avenue commercial stretch.' },
      { title: 'Residential + commercial growth', body: 'Winchester’s expansion means both new-subdivision driveways and commercial lots for the retail and office development following the housing. We do both.' },
      { title: 'Shenandoah Valley climate', body: 'Valley freeze-thaw and humid summers stress asphalt the same way they do across the line in WV — base, drainage, and sealcoating discipline are what make it last.' },
    ],
    faqs: [
      { question: 'Are you licensed to pave in Virginia?', answer: 'Yes. Real Elite Contracting is licensed and insured in Virginia, Maryland, and West Virginia. Winchester and the Northern Shenandoah Valley are an established part of our service area.' },
      { question: 'Do you pave both driveways and commercial lots in Winchester?', answer: 'Both. We install and replace residential driveways across Winchester’s growing neighborhoods and pave and resurface commercial parking lots — with phased scheduling and ADA-compliant striping — for businesses along the Route 7, Route 522, and Millwood corridors.' },
      { question: 'How does Winchester’s climate affect my driveway?', answer: 'The Shenandoah Valley sees the same freeze-thaw cycles and humid summers as the rest of the region, which work water into any crack and break down the asphalt binder over time. Proper base, drainage-first grading, and sealcoating on a 3–5 year cycle are what keep a Winchester driveway lasting.' },
    ],
  },
  {
    slug: 'hagerstown-md',
    city: 'Hagerstown',
    state: 'MD',
    county: 'Washington County',
    zips: ['21740', '21742'],
    nearby: ['falling-waters-wv', 'martinsburg-wv', 'frederick-md', 'shepherdstown-wv'],
    metaTitle: 'Paving Hagerstown MD — Asphalt Driveways & Parking Lots',
    metaDescription:
      'Asphalt paving, driveways, parking lots, sealcoating, and repair in Hagerstown, MD. Veteran-owned paving for the Cumberland Valley and I-70/I-81 hub. Free estimate.',
    keywords: [
      'paving Hagerstown MD',
      'asphalt driveway Hagerstown',
      'parking lot paving Hagerstown',
      'driveway paving Hagerstown MD',
      'sealcoating Hagerstown',
    ],
    heroSub:
      'Asphalt driveways, paving, parking lots, sealcoating, and repair for Hagerstown and the Cumberland Valley — veteran-owned and licensed in Maryland.',
    intro: [
      "Hagerstown sits at the crossroads of I-70 and I-81 — the commercial hub of Maryland's Cumberland Valley, with a mix of historic neighborhoods near Public Square and growing suburban development along the Halfway and Robinwood corridors. That crossroads location means heavy commercial activity and parking lots that take real traffic, alongside a deep stock of residential driveways spanning century-old brick homes to newer construction.",
      "We pave and repair driveways and commercial lots throughout the Hagerstown and Washington County area, licensed and insured in Maryland. The Cumberland Valley's freeze-thaw winters are hard on asphalt, so we put particular emphasis on base, drainage, and timely maintenance here. Whether it's a Robinwood-area driveway or a commercial lot off the Dual Highway, we bring proper specs and an accountable, single-point-of-contact approach.",
    ],
    localFactors: [
      { title: 'Roads & neighborhoods', body: 'The Public Square historic district, the North End, and the Halfway, Robinwood, and Dual Highway corridors — plus the commercial lots that come with an I-70/I-81 hub.' },
      { title: 'Commercial traffic', body: 'As a regional commercial center, Hagerstown has lots that carry serious traffic. We spec base depth and asphalt thickness for the real load, not a residential number.' },
      { title: 'Cumberland Valley freeze-thaw', body: 'Hagerstown winters cycle hard between freeze and thaw, prying open any crack. Crack filling, drainage, and sealcoating on schedule are essential to making asphalt last here.' },
    ],
    faqs: [
      { question: 'Are you licensed to pave in Maryland?', answer: 'Yes. Real Elite Contracting is licensed and insured in Maryland, West Virginia, and Virginia. Hagerstown and Washington County are an established part of our service area.' },
      { question: 'Do you pave commercial parking lots in Hagerstown?', answer: 'Yes. As a commercial hub, Hagerstown has lots that take heavy traffic, and we pave and resurface them with the proper base and asphalt section, ADA-compliant striping, and phased scheduling that keeps the business open.' },
      { question: 'Why does Hagerstown’s climate matter for paving?', answer: 'The Cumberland Valley cycles hard between freezing and thawing through winter, which works water into any crack and expands it, accelerating failure. We emphasize drainage, crack filling, and sealcoating on schedule here because that freeze-thaw is the main thing breaking asphalt down.' },
    ],
  },
  {
    slug: 'frederick-md',
    city: 'Frederick',
    state: 'MD',
    county: 'Frederick County, MD',
    zips: ['21701', '21702', '21703', '21704'],
    nearby: ['hagerstown-md', 'martinsburg-wv', 'falling-waters-wv', 'winchester-va'],
    metaTitle: 'Paving Frederick MD — Asphalt Driveways & Parking Lots',
    metaDescription:
      'Asphalt paving, driveways, parking lots, sealcoating, and repair in Frederick, MD. Veteran-owned paving for the I-70 corridor and Frederick County’s growing communities. Free estimate.',
    keywords: [
      'paving Frederick MD',
      'asphalt driveway Frederick',
      'parking lot paving Frederick MD',
      'driveway paving Frederick',
      'sealcoating Frederick MD',
    ],
    heroSub:
      'Asphalt driveways, paving, parking lots, sealcoating, and repair for Frederick and the I-70 corridor — veteran-owned and licensed in Maryland.',
    intro: [
      "Frederick is one of the Mid-Atlantic's most desirable and fastest-growing markets — a historic market town transformed by the revitalized Carroll Creek and Market Street downtown and a steady wave of development along the I-70 corridor through Urbana, Jefferson, and New Market. That growth fuels constant demand for both residential driveways in the new communities and commercial lots for the retail, office, and medical development following them.",
      "We pave and repair driveways and parking lots throughout Frederick and Frederick County, licensed and insured in Maryland. From the historic downtown's older homes to the new subdivisions out toward Urbana and the commercial sites along the growth corridor, we bring proper base work, drainage-first grading, ADA-compliant lot striping, and the accountable, single-point-of-contact approach that has built our name across the region.",
    ],
    localFactors: [
      { title: 'Roads & neighborhoods', body: 'Historic downtown Frederick and the Carroll Creek corridor, plus the fast-growing Ballenger Creek, Urbana, Jefferson, and New Market areas along I-70.' },
      { title: 'High-growth corridor', body: 'Frederick’s rapid growth drives both new-subdivision driveways and commercial lots for the retail, office, and medical development following the rooftops. We handle both.' },
      { title: 'Mid-Atlantic climate', body: 'Nor’easters, summer storms, and freeze-thaw all stress asphalt here. Proper base, drainage, and sealcoating discipline are what make a Frederick surface last.' },
    ],
    faqs: [
      { question: 'Are you licensed to pave in Frederick County, Maryland?', answer: 'Yes. Real Elite Contracting is licensed and insured in Maryland, West Virginia, and Virginia. Frederick and the I-70 corridor are an established part of our service area.' },
      { question: 'Do you pave commercial lots as well as driveways in Frederick?', answer: 'Both. Frederick’s growth means strong demand for new residential driveways and for commercial parking lots serving the retail, office, and medical development along the corridor. We pave and resurface both, with ADA-compliant striping and phasing that keeps businesses open.' },
      { question: 'Can you handle a driveway in Frederick’s historic downtown?', answer: 'Yes. Historic downtown properties often have tighter access and original drainage that need a careful approach, while the newer Urbana and Ballenger Creek subdivisions need durable, well-based asphalt. We tailor the work to the property.' },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Lookups & helpers                                                          */
/* -------------------------------------------------------------------------- */

export const getPavingService = (slug: string) =>
  PAVING_SERVICES.find((s) => s.slug === slug);

export const getPavingLocation = (slug: string) =>
  PAVING_LOCATIONS.find((l) => l.slug === slug);

export const PAVING_SERVICE_SLUGS = PAVING_SERVICES.map((s) => s.slug);
export const PAVING_LOCATION_SLUGS = PAVING_LOCATIONS.map((l) => l.slug);
