/**
 * Claims register and regression guard. Credentials are sourced from REA-55.
 * Unconfirmed operational promises were withdrawn from shared marketing copy
 * on 2026-09-27. Keep their matchers so they cannot silently return.
 *
 * publishedIn records source occurrences; tests/claim-pages.json records built
 * routes, including editorial advice and project records that need context.
 * Only shrink inventories when copy is withdrawn. New publication requires
 * evidence and an explicit owner decision, never an allowlist-only edit.
 */

/** Credentials supplied in REA-55 and AI-SHARED/VENTURES.md (2026-09-27).
 * VA HIC is residential; this is not a commercial or Maryland license claim.
 */
export const CONTRACTOR_LICENSES = {
  wv: 'WV062432',
  va: '2705198604',
  summary: 'WV Contractor License WV062432 · Virginia Class A Contractor 2705198604 (HIC)',
} as const;

/**
 * Pennsylvania Home Improvement Consumer Protection Act registration number.
 *
 * TODO(HIC): Jose confirmed on 2026-09-29 that Real Elite already holds this
 * registration. He has not supplied the number. Leave this null. Do not invent
 * one. Pennsylvania pages, contracts, and ads must read `paHicRegistrationLine()`
 * so a number cannot be typed into one surface only.
 */
export const PA_HIC_REGISTRATION_NUMBER: string | null = null;

/** Public sentence for Pennsylvania pages, contracts, and ads. */
export function paHicRegistrationLine(): string {
  if (PA_HIC_REGISTRATION_NUMBER) {
    return `Pennsylvania HIC registration ${PA_HIC_REGISTRATION_NUMBER}`;
  }
  return 'Pennsylvania home-improvement registration is on file. The registration number is not printed until the owner supplies it.';
}

/** Confirmed by Jose in REA-55 board comment 59567b88 (2026-09-27).
 * SAM registration and NAICS codes do not establish veteran certification
 * or expand state contractor license specialties.
 */
export const FEDERAL_REGISTRATION = {
  summary: 'Registered in SAM.gov (UEI UZPDY2HUR9, CAGE 21N7T2)',
  naics: [
    { code: '236220', label: 'Commercial & Institutional Building Construction', primary: true },
    { code: '238160', label: 'Roofing Contractors', primary: false },
    { code: '238320', label: 'Painting & Wall Covering Contractors', primary: false },
    { code: '238330', label: 'Flooring Contractors', primary: false },
    { code: '238990', label: 'All Other Specialty Trade Contractors', primary: false },
    { code: '236118', label: 'Residential Remodelers', primary: false },
  ],
} as const;

export type ClaimStatus = 'verified' | 'unconfirmed';

export type OperationalClaim = {
  /**
   * A fragment of the site's OWN phrasing that this claim's patterns match.
   *
   * Exists so a guard can exercise the matcher against any claim without
   * depending on `label` wording. A label is a sentence written for the owner
   * and four of the seven do NOT match their own patterns — `daily-progress-photos`
   * is labelled "progress photos every day" while its pattern is
   * /daily progress photos/i. An anti-vacuity check built on labels therefore
   * ran or silently skipped depending on which claims remained registered,
   * which is how a broken matcher could go unexercised. Codex found both halves
   * of that on #148.
   *
   * `every example matches its own claim` enforces the guarantee, so this
   * cannot drift from the patterns beside it.
   */
  example: string;
  /** Stable id, used in test failure messages. */
  id: string;
  /** The promise in plain terms — this is what the owner confirms or retracts. */
  label: string;
  status: ClaimStatus;
  /**
   * How the claim is detected in copy. Several patterns per claim because the
   * same promise is worded differently across markets.
   */
  patterns: readonly RegExp[];
  /**
   * Where the claim is published today, at the granularity that matters.
   * Snapshot taken 2026-09-18 by matching `patterns` against the content maps;
   * see the file header for how to update it. Must be empty when `status` is
   * 'verified'.
   */
  publishedIn: {
    /** Keys in CONTENT (src/lib/service-city-content.ts). */
    comboKeys: readonly string[];
    /** Slugs in SERVICE_DATA (src/lib/services-data.ts). */
    serviceSlugs: readonly string[];
    /** Repo-relative paths of page templates that hardcode the claim in JSX. */
    templates: readonly string[];
  };
  /** Why this one is riskier or more nuanced than it looks. */
  note?: string;
};

/**
 * The files the guard watches at file level, because each puts its text on
 * dozens of pages at once.
 *
 * ## The inventory must name the file that actually carries the claim
 *
 * `src/lib/trust-bullets.ts` was added on 2026-09-18 after a break I shipped
 * and Codex caught on #147, AFTER that PR merged. Extracting the per-market
 * trust bullets out of the combo route into that module moved four claims to a
 * new file and left every `publishedIn.templates` entry pointing at the route,
 * which then matched none of them. Two consequences:
 *
 *   1. The retraction worklist became WRONG. An owner following it would edit
 *      the route, find nothing, and every home-market combo would carry on
 *      publishing the bullets.
 *   2. The new file was not watched, so the ratchet was blind to it. Verified
 *      by injecting `daily progress photos` and `same-day response` into it:
 *      the whole claims suite stayed green, 22 of 22.
 *
 * Both are now tested — `inventories only templates that actually publish the
 * claim` and `watches every file an inventory names`. Moving claim-bearing copy
 * to a new file without moving the inventory and adding the file here fails.
 *
 * The same test found a pre-existing over-listing: `named-project-lead` named
 * `constants.ts`, whose "a project lead assigned" and "your project lead" match
 * none of that claim's patterns. Removed.
 *
 * The combo route stays watched even though it now carries no claim, so a
 * claim added back to it trips.
 *
 * The AssurancesBand and constants.ts entries were added after the Northern
 * Virginia hub shipped:
 * `AssurancesBand` and `PRECISION_PROCESS` in `constants.ts` are the actual
 * sitewide source of the warranty, project-lead, daily-updates and
 * clean-job-site claims on roughly fifty pages — not just the warranty, as an
 * earlier version of the note below wrongly said. (It also called that array
 * `PROCESS_STEPS`, which is not a symbol in this repo. The header above
 * records both corrections.) Watching these files does not change what they
 * publish; it stops a NEW claim being added to the two that reach every page.
 */
export const GUARDED_TEMPLATES = [
  'src/app/services/[service]/[city]/page.tsx',
  'src/lib/trust-bullets.ts',
  'src/components/services/CityPageTemplate.tsx',
  'src/components/home/AssurancesBand.tsx',
  'src/lib/constants.ts',
] as const;

/**
 * Files whose RUNTIME text publishes an unconfirmed claim and which the
 * file-level guard deliberately does NOT watch, each with the reason.
 *
 * ## Why this is data and not prose
 *
 * The header above used to describe this set in a sentence. Codex asked on
 * #148 for the guard to discover claim-bearing modules independently rather
 * than trust the inventory it validates — otherwise a refactor that moves copy
 * to a new module AND drops the old inventory entry leaves both the guard and
 * the ratchet blind, which is the exact hole #147 shipped.
 *
 * So `claims.test.ts` now scans all of `src` and requires every claim-bearing
 * file to be classified: watched here, inventoried by another axis, or listed
 * below with a reason. An unclassified file FAILS. The default is failure,
 * which is the only default that closes a discovery hole.
 *
 * Writing it down also showed the prose was incomplete. It named /about,
 * /capability-statement, /design-consultation, /faq, /process, /services,
 * /veterans, /full-property-perimeter and paving-data.ts — and MISSED
 * /storm-damage, TrustBar.tsx and three project records. Five claim-bearing
 * files nobody had accounted for, found by making the list executable.
 */
export const UNGUARDED_CLAIM_SOURCES: Readonly<Record<string, string>> = {
  // One-off, hand-written pages the owner has seen. They do not multiply when
  // a market is added, which is what the file-level guard exists to stop.

  // Inventoried by a DIFFERENT axis of this register, so file-level watching
  // would double-count: every occurrence is already listed per key or slug.

  // Data the register does not track, recorded so it is not mistaken for an
  // oversight. A retraction has to sweep these by hand.
  'src/lib/projects/data/composite-deck-build-martinsburg.ts':
    'project record — missing from the prose list',
  'src/lib/projects/data/walk-in-shower-bathroom-remodel.ts':
    'project record — surfaced by the "N weeks on site" pattern, added 2026-09-18',
  'src/lib/projects/data/victorian-roof-replacement-martinsburg-wv.ts':
    'project record — surfaced by the "N working days" pattern, added 2026-09-18',
  'src/lib/projects/data/new-construction-framing-to-finish.ts':
    'project record — missing from the prose list',
  'src/lib/projects/data/signature-kitchen-remodel-eastern-panhandle.ts':
    'project record — missing from the prose list',

  // The register quotes the claims it tracks, in labels and notes.
  'src/lib/claims.ts': 'the register itself',
};

/**
 * The numeric span at the front of every duration promise, shared by the
 * `active-work-timeline` patterns below.
 *
 * It exists as ONE constant because this claim has now been found too narrow
 * three review rounds running, each time on a different axis of the same
 * phrasing, and twice the fix widened one copy of the range and left another
 * axis untouched. A shared prefix cannot drift from itself; three literals
 * repeating it can, and did.
 *
 * Covers digits and the spelled-out numerals the site actually uses, either
 * dash, and weeks or days. NOT months — every month-range on the site is a
 * curing time, a savings-buffer figure or a design phase, none of them a
 * promise about how long a crew is in someone's house.
 */
const COUNT = String.raw`(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten|twelve|twenty)`;
const DURATION_RANGE = String.raw`${COUNT}\s*(?:\u2013|\u2014|-|to)\s*${COUNT}\s*(?:weeks?|days?)`;

/**
 * A duration counted in WORKING days, which needs no qualifier after it.
 *
 * The word carries the meaning on its own: a working day is time a crew is on
 * the job, so "two to three working days" is the same promise as "3-5 weeks of
 * active work" and belongs on the same worklist. The range is optional because
 * the site states it both ways.
 *
 * "business days" is deliberately NOT here, and the distinction is the site's
 * own rather than one imposed: every "business day" on the site is a RESPONSE
 * turnaround ("a real person will call within one business day", permits
 * "reviewed in 5-10 business days"), and every "working day" is job duration.
 * If that ever stops being true the guard will surface the sentence and someone
 * can read it, which is the guard working rather than a hole in it.
 */
const WORKING_DAYS = String.raw`${COUNT}(?:\s*(?:\u2013|\u2014|-|to)\s*${COUNT})?\s*working days?`;

/** Removed credentials/rankings have no publication allowlist. */
export const RETRACTED_TRUST_CLAIMS: readonly OperationalClaim[] = [
  {
    id: 'unsupported-tenure', label: 'Unsubstantiated company or combined trade tenure',
    example: '40+ Years of Experience', status: 'unconfirmed',
    note: 'Withdrawn by REA-55; require owner-supplied substantiation before publication.',
    patterns: [/40\+?\s+years? (?:of |combined |of combined )?experience/i, /forty.{0,8}years.{0,15}experience/i],
    publishedIn: {
      "comboKeys": [],
      "serviceSlugs": [],
      "templates": []
},
  },
  {
    id: 'unsupported-manufacturer-certification', label: 'Unverified manufacturer certification',
    example: 'GAF Master Elite', status: 'unconfirmed',
    note: 'Withdrawn by REA-55; require owner-supplied substantiation before publication.',
    patterns: [/Master Elite/i, /(?:GAF|Owens Corning) (?:certified|preferred|platinum)/i],
    publishedIn: {
      "comboKeys": [],
      "serviceSlugs": [],
      "templates": []
},
  },
  // Certification-as-awarded and ownership-status detectors live in
  // src/lib/__tests__/forbidden-claim-terms.ts. They stay out of this module
  // so the production bundle does not carry those matcher strings. Tests still
  // apply them to source and built HTML. Do not re-import that module here.
  {
    id: 'unsupported-maryland-license', label: 'Maryland licensing is not substantiated',
    example: 'Licensed and insured across West Virginia, Maryland, and Virginia', status: 'unconfirmed',
    note: 'Withdrawn by REA-55; require owner-supplied substantiation before publication.',
    patterns: [/licensed(?: and insured| & insured| & Insured|, insured, and accountable)?(?: in| across)?[ :·]*(?:West Virginia[, /·]+|WV[, /·]+|Virginia[, /·]+|VA[, /·]+)?(?:MD|Maryland)\b/i, /licensed[^.\n]{0,100}(?:just as|also)[^.\n]{0,60}Maryland/i],
    publishedIn: {
      "comboKeys": [],
      "serviceSlugs": [],
      "templates": []
},
  },
  {
    id: 'unsupported-awards-rankings', label: 'Unverified awards and rankings',
    example: 'Top-Rated on Google', status: 'unconfirmed',
    note: 'Withdrawn by REA-55; require owner-supplied substantiation before publication.',
    patterns: [/top[- ]rated on Google/i, /best contractor 2024/i, /most trusted contractor/i],
    publishedIn: {
      "comboKeys": [],
      "serviceSlugs": [],
      "templates": []
},
  },
];

export const OPERATIONAL_CLAIMS: readonly OperationalClaim[] = [
  ...RETRACTED_TRUST_CLAIMS,
  {
    id: 'written-workmanship-warranty',
    example: 'a written workmanship warranty on every job',
    label: 'Every project carries a written workmanship warranty.',
    status: 'unconfirmed',
    patterns: [/workmanship (?:warrant|guarantee)/i],
    note:
      'The broadest-reaching of the seven and the one with the most legal weight. Also published in the sitewide FAQ in constants.ts, on eight standalone pages, and in 15 blog posts — all outside this guard. A retraction is a repo-wide sweep, not a 30-key edit.',
    publishedIn: {
      "comboKeys": [],
      "serviceSlugs": [],
      "templates": []
},
  },
  {
    id: 'named-project-lead',
    example: 'one named project lead from estimate to punch list',
    label: 'One named project lead runs the job from estimate through final punch list.',
    status: 'unconfirmed',
    patterns: [/named project lead/i, /project lead on every/i, /accountable project lead/i],
    note:
      'A staffing claim. It is falsifiable by a single job run by two people, and it is asserted on 35 of the 69 combo pages.',
    publishedIn: {
      "comboKeys": [],
      "serviceSlugs": [],
      "templates": []
},
  },
  {
    id: 'daily-progress-photos',
    example: 'daily progress photos shared with you',
    label: 'The homeowner receives progress photos every day.',
    status: 'unconfirmed',
    patterns: [/daily progress photos/i],
    note:
      'The most operationally demanding of the seven — it requires someone on site photographing and sending every working day. Published only on premium NoVA pages.',
    publishedIn: {
      "comboKeys": [],
      "serviceSlugs": [],
      "templates": []
},
  },
  {
    id: 'daily-updates',
    example: 'daily updates while the crew is on site',
    label: 'The homeowner gets an update every day the job is active.',
    status: 'unconfirmed',
    patterns: [/daily updates/i, /updates? you daily/i, /update you daily/i],
    note:
      'The softer sibling of daily-progress-photos, and registered separately because the owner may well be able to confirm this one and not the photos.',
    publishedIn: {
      "comboKeys": [],
      "serviceSlugs": [],
      "templates": []
},
  },
  {
    id: 'clean-job-site',
    example: 'a clean job site at the end of every day',
    label: 'The job site is left clean at the end of every day.',
    status: 'unconfirmed',
    patterns: [/clean job site/i],
    note:
      'A daily operational promise, and the easiest of the seven for a homeowner to check — they are standing in the room at 6pm. It is also the one most likely to be broken by a subcontractor rather than by the crew, which makes it a claim about scheduling and supervision rather than about intent. Published on 135 of 182 built pages including the homepage.',
    publishedIn: {
      "comboKeys": [],
      "serviceSlugs": [],
      "templates": []
},
  },
  {
    id: 'same-day-response',
    example: 'a same-day response to every enquiry',
    label: 'Enquiries and questions get a same-day response.',
    status: 'unconfirmed',
    patterns: [/same[- ]day response/i],
    note:
      'A service-level commitment, and the one most likely to be measured against the business by a homeowner keeping receipts. Note that the adjacent "within 24 business hours" promise, used far more widely, is a different and weaker claim and is not registered here.',
    publishedIn: {
      "comboKeys": [],
      "serviceSlugs": [],
      "templates": []
},
  },
  {
    id: 'active-work-timeline',
    example: 'typically 8–14 weeks of active work',
    label:
      'Named week-range timelines for active work (3-5 weeks for a bath up to 14-22 weeks for a Great Falls basement).',
    status: 'unconfirmed',
    // THIS CLAIM'S DETECTION HAS BEEN FOUND NARROWER THAN ITS PUBLICATION
    // THREE ROUNDS RUNNING, each time on a different axis of the same promise,
    // and twice the fix widened the axis that was reported and left the next
    // one. The patterns below are built from one shared range prefix for that
    // reason. The full inventory of how the site says it:
    //
    //   SEPARATOR   "8–14 weeks", "6-10 weeks", "6 to 10 weeks",
    //               "two to four weeks"
    //   QUALIFIER   "of active work"        combo content map
    //               "of active construction" kitchen + bathroom cost articles
    //               "of on-site work"        signature-kitchen project record
    //               "of work"                basement + Frederick permits guides
    //               "on site"                deck + walk-in-shower project records
    //               "from demo to final"     services-data kitchens + bathrooms
    //               "from approved estimate to final walk-through"
    //                                        full-property-perimeter
    //               "from permit to final walkthrough"  deck-season article
    //   UNIT        "two to three working days"   victorian-roof project record
    //               "9 working days"              composite-vs-PT deck article
    //                 — no qualifier needed; "working" names the promise
    //
    // Deliberately NOT matched, because they are different promises that happen
    // to share the shape: "2-3 weeks of Frederick County permitting", "1-2
    // weeks of plan review", "2-4 weeks of approval before the build", "3-6
    // months of expenses in liquid savings", one article's "2-3 weeks of
    // takeout-heavy living", and "4-8 weeks out for project starts" (booking
    // lead time, not duration). A false positive here puts a page on the
    // owner's retraction worklist that does not belong on it.
    //
    // STILL NOT MATCHED, AND STRUCTURAL: a bare range with no UNIT and no
    // qualifier
    // ("kitchen: 6–12 weeks" in a table, "5–8 weeks is typical"). Deciding
    // whether one of those is this promise needs the surrounding prose, not a
    // regex, and roughly fifty of them are permitting or curing figures. A
    // regex that caught them would flood the worklist. §8 of
    // docs/site-altitude-architecture-2026-09-18.md records this as the known
    // residual and proposes the sweep that would close it.
    patterns: [
      // "8–14 weeks of active work", "6-12 weeks of work"
      new RegExp(`${DURATION_RANGE} of (?:active work|active construction|on-site work|work)`, 'i'),
      // "3–5 weeks on site", "1–3 weeks on site once the permit is issued"
      new RegExp(`${DURATION_RANGE} on[- ]site`, 'i'),
      // "3–5 weeks from demo to final walk-through", "5–7 weeks from approved
      // estimate to final walk-through", "two to four weeks from permit to
      // final walkthrough". The range prefix is what keeps this off the many
      // `named project lead from estimate to final walk-through` lines, which
      // are a different claim.
      new RegExp(`${DURATION_RANGE} from (?:\\w+[ -]){0,3}to final`, 'i'),
      // "two to three working days", "Active construction time: 9 working days"
      new RegExp(WORKING_DAYS, 'i'),
    ],
    note:
      'Registered as one claim across all markets rather than only the 8-22 week NoVA figures the brief flagged, because they are the same kind of promise and the owner will want to rule on them together. A schedule quoted on a page becomes the baseline a late job is measured against.',
    publishedIn: {
      "comboKeys": [],
      "serviceSlugs": [],
      "templates": []
},
  },
];

/** The claims still awaiting an owner decision. */
export const UNCONFIRMED_CLAIMS = OPERATIONAL_CLAIMS.filter((c) => c.status === 'unconfirmed');

/** Every pattern in the register tests true against this text. */
export function claimsFoundIn(text: string): OperationalClaim[] {
  return OPERATIONAL_CLAIMS.filter((c) => c.patterns.some((p) => p.test(text)));
}
