/**
 * Operational claims — the register of promises the site makes about how the
 * business actually runs, and whether the owner has confirmed each one.
 *
 * ## Why this exists
 *
 * CLAUDE.md: "Claims about how the business operates (crew composition,
 * warranties, timelines) go in only when the owner has confirmed them.
 * Getting one wrong in front of a homeowner is worse than saying nothing."
 *
 * That rule had no enforcement, and the result is recorded in
 * `docs/nova-basement-opportunity-2026-09-18.md` and
 * `docs/site-altitude-architecture-2026-09-18.md` §3.5: seven distinct
 * operational promises are published across 30-plus service+city pages and
 * most service pages, none of them confirmed in writing. Against an Eastern
 * Panhandle job an overstatement is survivable. Against a $250,000 Great
 * Falls basement it is contract-dispute material.
 *
 * ## What the guard does
 *
 * `claims.test.ts` is a ratchet, not a bulk edit. For every claim still marked
 * `unconfirmed` it asserts that the claim appears ONLY where `publishedIn`
 * already records it. The build is green on today's copy and goes red the
 * moment a NEW page, service or template inherits an unconfirmed promise —
 * which is precisely the failure the altitude doc warned about ("confirm or
 * remove before building more pages on the same template").
 *
 * Deliberately NOT a failing test on the existing copy. A guard that ships
 * red gets disabled; a guard that ships green gets to stay. The existing
 * occurrences are inventoried here instead, so the owner can rule on each
 * claim and the retraction is a mechanical edit against a known list rather
 * than a repo-wide hunt.
 *
 * ## Shrinking an inventory when a page is RETIRED, not when it is awkward
 *
 * 2026-09-18: Tier C retired ten service+area pages (see `RETIRED_COMBOS` in
 * service-city-content.ts), and 42 inventory entries across six claims pointed
 * at them. Those entries are removed.
 *
 * This is NOT the move this file's `howToFix` forbids. That prohibition is on
 * ADDING a location so a failing guard goes quiet, which hides a claim
 * spreading to a new page. Here the pages ceased to exist: the
 * `records only combo keys and service slugs that actually exist` test fails
 * if a retired key stays, precisely so a stale inventory cannot quietly turn
 * the ratchet into a no-op for that claim.
 *
 * The net effect is real and in the right direction — 42 fewer published
 * occurrences of unconfirmed operational promises, on pages that had zero
 * mobile impressions in six months. Retiring dead pages is the cheapest
 * reduction in contract exposure available, and it needed no content decision
 * from the owner because nothing was read there.
 *
 * The remaining worklist is smaller but the seven claims are unresolved.
 *
 * ## How to resolve a claim
 *
 * - **Owner confirms it** → set `status: 'verified'` and empty its
 *   `publishedIn` lists. The claim may then appear anywhere.
 * - **Owner retracts it** → the `publishedIn` lists are the exact worklist.
 *   Edit the copy, then delete the claim's entry from this file.
 *
 * ## Scope
 *
 * The guard covers the surfaces where one edit multiplies across many pages:
 * the `CONTENT` map (69 service+city pages), `SERVICE_DATA` (12 service
 * pages), and the two page templates that wrap them (94 pages between them).
 *
 * Out of scope, deliberately, and now ENFORCED AS DATA in
 * `UNGUARDED_CLAIM_SOURCES` below rather than described here. Those are
 * hand-written pages the owner has seen; they do not multiply when a market is
 * added, which is what the file-level guard exists to stop. A retraction still
 * has to sweep them, and the guard will not remind anyone.
 *
 * `AssurancesBand` and `constants.ts` were in that prose list and are now
 * WATCHED instead — they reach every page.
 *
 * Making the list executable showed the prose was incomplete: it missed
 * `/storm-damage`, `TrustBar.tsx` and three project records. Five claim-bearing
 * files nobody had accounted for. `claims.test.ts` now walks `src` and fails on
 * any claim-bearing file that is neither watched nor declared, so the list
 * cannot silently fall behind again.
 *
 * The 15 blog posts under `content/blog/` that carry warranty language are
 * outside this scan, which covers `src` only.
 *
 * ## A known gap in the ratchet
 *
 * The guard watches the CONTENT map, SERVICE_DATA, and the two templates. It
 * does NOT watch the set of areas those templates render onto. So adding a row
 * to SERVICE_AREA_CATALOG publishes another page carrying whatever
 * unconfirmed claims the template already makes, and nothing here trips.
 *
 * That happened when the `northern-virginia` region row landed: its hub page
 * rendered `written-workmanship-warranty`, `named-project-lead` and
 * `clean-job-site` from CityPageTemplate, exactly as the twenty-five area
 * pages before it did. The claims did not spread to a new *template* — they
 * reached a new URL in the market where the altitude doc calls them
 * "contract-dispute material" against a $250,000 job.
 *
 * **Narrowed, not closed, and the residual is named.** The per-market trust
 * block ("Why {place} homeowners choose Real Elite") withholds those claims
 * and keeps only the verified licensing line. The gate is in BOTH templates
 * that render the block: `CityPageTemplate` (the area pages, gated in #146)
 * and the combo route (the service+area pages). Gating only the first left
 * /service-areas/mclean-va withholding the promises while
 * /services/kitchens/mclean-va went on making them.
 *
 * **The combo route gates PER BULLET, not per market.** A bullet renders only
 * when the page's own localized copy already makes every claim that bullet
 * would introduce; a bullet carrying two claims needs both. Two wider
 * predicates were refuted on review before this one:
 *
 *   - `market === 'premium'` alone, justified by specificity. 36 of the 47
 *     premium combos already publish these promises in their own paragraphs at
 *     that same service-and-town specificity, so withholding the bullets there
 *     reduced nothing and pre-applied part of a retraction that is the owner's
 *     to decide — which makes THIS register's worklist wrong.
 *   - "the copy makes no unconfirmed claim". A new premium page whose copy
 *     carried only an unrelated claim (`active-work-timeline`, as
 *     bathrooms-ashburn-va does) would have been handed all four bullets,
 *     defeating the new-page boundary the gate exists for.
 *
 * See `unconfirmedClaimIdsInCombo` in service-city-content.ts and
 * `trust-bullets.test.ts`, which checks the bullets' claim annotations against
 * this register's own patterns rather than trusting them — an annotation that
 * understates a bullet would wave it onto a page that must not carry it.
 *
 * ## What still reaches a premium page, measured
 *
 * Corrected 2026-09-18, third pass. The two earlier versions of this note were
 * both wrong, in the same way: they described the residual instead of running
 * the register against the source. Measured with `claimsFoundIn`:
 *
 *   - `AssurancesBand.tsx` — FOUR claims: `written-workmanship-warranty`,
 *     `named-project-lead`, `daily-updates`, `clean-job-site`.
 *   - `PRECISION_PROCESS` in `constants.ts`, rendered by `PrecisionProcess`
 *     on the homepage, /process and every area and combo page — THREE:
 *     `written-workmanship-warranty`, `daily-updates`, `clean-job-site`.
 *   - `constants.ts`'s sitewide FAQ — `written-workmanship-warranty`.
 *
 * The union is FOUR claims on roughly fifty pages including the homepage.
 * Previous versions of this note said "two" and "three", named a symbol
 * (`PROCESS_STEPS`) that does not exist in this repo, and credited a
 * `SERVICES` description ("Full interior renovations under one project lead")
 * as a `named-project-lead` occurrence. That last one is real copy but it
 * matches none of the claim's patterns, so it is a GAP IN THE PATTERNS, not an
 * occurrence — worth fixing when the owner rules, and recorded here so the
 * retraction worklist does not miss it.
 *
 * Those four are deliberately NOT gated. Removing a claim from one market's
 * pages while the homepage still makes it does not reduce the contract
 * exposure — the same buyer reads it two clicks later — so it is a sitewide
 * content decision. The owner was asked directly and chose to ship the
 * Northern Virginia pages with it outstanding rather than hold them; the
 * decision is on PR #146 and the claims stay open below.
 *
 * So: the per-market copy is gated in both templates, the sitewide copy is
 * inventoried and waiting on a decision. Do not read the gates as "premium
 * pages make no unconfirmed claims" — they make four, from shared components.
 *
 * Closing it completely would mean inventorying area slugs, and the next area
 * row would then have to be added to that allowlist in its own PR — the move
 * this file's header tells the reader never to make. The real fix is the owner
 * ruling on the seven claims below: confirm them and the gate comes out,
 * retract them and the copy goes.
 */

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
  'src/app/about/page.tsx': 'one-off page',
  'src/app/capability-statement/page.tsx': 'one-off page',
  'src/app/design-consultation/page.tsx': 'one-off page',
  'src/app/faq/page.tsx': 'one-off page',
  'src/app/full-property-perimeter/page.tsx': 'one-off page',
  'src/app/process/page.tsx': 'one-off page',
  'src/app/services/page.tsx': 'one-off page',
  'src/app/storm-damage/page.tsx': 'one-off page — missing from the prose list',
  'src/app/veterans/page.tsx': 'one-off page',
  'src/components/home/TrustBar.tsx': 'sitewide band — missing from the prose list',

  // Inventoried by a DIFFERENT axis of this register, so file-level watching
  // would double-count: every occurrence is already listed per key or slug.
  'src/lib/service-city-content.ts': 'inventoried per combo key (publishedIn.comboKeys)',
  'src/lib/services-data.ts': 'inventoried per service slug (publishedIn.serviceSlugs)',

  // Data the register does not track, recorded so it is not mistaken for an
  // oversight. A retraction has to sweep these by hand.
  'src/lib/paving-data.ts': 'paving data, untracked',
  'src/lib/projects/data/composite-deck-build-martinsburg.ts':
    'project record — missing from the prose list',
  'src/lib/projects/data/new-construction-framing-to-finish.ts':
    'project record — missing from the prose list',
  'src/lib/projects/data/signature-kitchen-remodel-eastern-panhandle.ts':
    'project record — missing from the prose list',

  // The register quotes the claims it tracks, in labels and notes.
  'src/lib/claims.ts': 'the register itself',
};

export const OPERATIONAL_CLAIMS: readonly OperationalClaim[] = [
  {
    id: 'written-workmanship-warranty',
    example: 'a written workmanship warranty on every job',
    label: 'Every project carries a written workmanship warranty.',
    status: 'unconfirmed',
    patterns: [/workmanship warranty/i],
    note:
      'The broadest-reaching of the seven and the one with the most legal weight. Also published in the sitewide FAQ in constants.ts, on eight standalone pages, and in 15 blog posts — all outside this guard. A retraction is a repo-wide sweep, not a 30-key edit.',
    publishedIn: {
      comboKeys: [
        'decks-loudoun-county-va', 'remodeling-hagerstown-md', 'siding-loudoun-county-va',
        'bathrooms-mclean-va', 'bathrooms-alexandria-va', 'kitchens-mclean-va',
        'kitchens-alexandria-va', 'basements-mclean-va', 'basements-alexandria-va',
        'bathrooms-vienna-va', 'kitchens-vienna-va', 'basements-vienna-va',
        'bathrooms-great-falls-va', 'kitchens-great-falls-va', 'basements-great-falls-va',
        'bathrooms-reston-va', 'kitchens-reston-va', 'basements-reston-va',
        'bathrooms-burke-va', 'kitchens-burke-va', ],
      serviceSlugs: ['kitchens', 'roofing', 'general-repairs'],
      templates: [
        'src/lib/trust-bullets.ts',
        'src/components/services/CityPageTemplate.tsx',
        'src/components/home/AssurancesBand.tsx',
        'src/lib/constants.ts',
      ],
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
      comboKeys: [
        'remodeling-hagerstown-md', 'bathrooms-leesburg-va', 'bathrooms-loudoun-county-va',
        'kitchens-frederick-md', 'kitchens-leesburg-va', 'kitchens-ashburn-va',
        'kitchens-loudoun-county-va', 'basements-frederick-md', 'bathrooms-mclean-va',
        'bathrooms-alexandria-va', 'kitchens-mclean-va', 'kitchens-alexandria-va',
        'basements-mclean-va', 'basements-alexandria-va', 'bathrooms-vienna-va',
        'kitchens-vienna-va', 'basements-vienna-va', 'bathrooms-great-falls-va',
        'kitchens-great-falls-va', 'basements-great-falls-va', 'bathrooms-reston-va',
        'kitchens-reston-va', 'basements-reston-va', 'bathrooms-burke-va',
        'kitchens-burke-va', ],
      serviceSlugs: ['bathrooms', 'kitchens', 'remodeling'],
      templates: [
        'src/lib/trust-bullets.ts',
        'src/components/services/CityPageTemplate.tsx',
        'src/components/home/AssurancesBand.tsx',
      ],
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
      comboKeys: [
        'bathrooms-mclean-va', 'kitchens-mclean-va', 'kitchens-alexandria-va',
        'basements-alexandria-va', 'bathrooms-vienna-va', 'kitchens-vienna-va',
        'bathrooms-great-falls-va', 'kitchens-great-falls-va', 'bathrooms-reston-va',
        'kitchens-reston-va', 'bathrooms-burke-va', 'kitchens-burke-va',
        ],
      serviceSlugs: ['bathrooms'],
      templates: [],
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
      comboKeys: [
        'remodeling-hagerstown-md', 'remodeling-loudoun-county-va', 'bathrooms-frederick-md',
        'bathrooms-leesburg-va', 'bathrooms-winchester-va', 'kitchens-frederick-md',
        'kitchens-leesburg-va', 'kitchens-ashburn-va', 'kitchens-loudoun-county-va',
        'basements-frederick-md', 'basements-mclean-va', 'basements-vienna-va',
        'basements-great-falls-va', 'basements-reston-va', ],
      serviceSlugs: ['bathrooms', 'kitchens', 'decks', 'remodeling'],
      templates: [
        'src/lib/trust-bullets.ts',
        'src/components/services/CityPageTemplate.tsx',
        'src/components/home/AssurancesBand.tsx',
        'src/lib/constants.ts',
      ],
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
      comboKeys: [
        'roofing-hagerstown-md', 'remodeling-hagerstown-md', 'basements-frederick-md',
        'kitchens-mclean-va', 'kitchens-alexandria-va', 'basements-mclean-va',
        'basements-alexandria-va', 'bathrooms-vienna-va', 'kitchens-vienna-va',
        'basements-vienna-va', 'bathrooms-great-falls-va', 'kitchens-great-falls-va',
        'basements-great-falls-va', 'bathrooms-reston-va', 'kitchens-reston-va',
        'basements-reston-va', 'bathrooms-burke-va', 'kitchens-burke-va',
        ],
      serviceSlugs: ['bathrooms', 'kitchens', 'remodeling', 'general-repairs', 'handyman'],
      templates: [
        'src/lib/trust-bullets.ts',
        'src/components/services/CityPageTemplate.tsx',
        'src/components/home/AssurancesBand.tsx',
        'src/lib/constants.ts',
      ],
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
      comboKeys: [
        'bathrooms-mclean-va', 'kitchens-mclean-va', 'kitchens-alexandria-va',
        'bathrooms-vienna-va', 'kitchens-vienna-va', 'kitchens-great-falls-va',
        'kitchens-reston-va', 'kitchens-burke-va', ],
      serviceSlugs: [],
      templates: [],
    },
  },
  {
    id: 'active-work-timeline',
    example: 'typically 8–14 weeks of active work',
    label:
      'Named week-range timelines for active work (3-5 weeks for a bath up to 14-22 weeks for a Great Falls basement).',
    status: 'unconfirmed',
    patterns: [/\d+–\d+ weeks of active work/i],
    note:
      'Registered as one claim across all markets rather than only the 8-22 week NoVA figures the brief flagged, because they are the same kind of promise and the owner will want to rule on them together. A schedule quoted on a page becomes the baseline a late job is measured against.',
    publishedIn: {
      comboKeys: [
        'remodeling-hagerstown-md', 'bathrooms-leesburg-va', 'bathrooms-ashburn-va',
        'bathrooms-loudoun-county-va', 'bathrooms-hagerstown-md', 'bathrooms-winchester-va',
        'kitchens-frederick-md', 'kitchens-leesburg-va', 'kitchens-ashburn-va',
        'kitchens-loudoun-county-va', 'basements-frederick-md', 'basements-mclean-va',
        'basements-vienna-va', 'kitchens-great-falls-va', 'basements-great-falls-va',
        'basements-reston-va',
      ],
      serviceSlugs: [],
      templates: [],
    },
  },
];

/** The claims still awaiting an owner decision. */
export const UNCONFIRMED_CLAIMS = OPERATIONAL_CLAIMS.filter((c) => c.status === 'unconfirmed');

/** Every pattern in the register tests true against this text. */
export function claimsFoundIn(text: string): OperationalClaim[] {
  return OPERATIONAL_CLAIMS.filter((c) => c.patterns.some((p) => p.test(text)));
}
