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
 * Out of scope, deliberately: one-off JSX pages (`/about`,
 * `/capability-statement`, `/design-consultation`, `/faq`, `/process`,
 * `/services`, `/veterans`, `/full-property-perimeter`, `AssurancesBand`),
 * `src/lib/constants.ts`'s sitewide FAQ, `src/lib/paving-data.ts`, and the
 * 15 blog posts under `content/blog/` that also carry the warranty language.
 * Those are hand-written pages the owner has seen, and they do not multiply
 * when a new market is added. They are listed here rather than left implicit
 * so the register is honest about its own coverage: a retraction has to sweep
 * them too, and the guard will not remind anyone.
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
 * **Narrowed, not closed, and the residual is named.** CityPageTemplate's
 * per-market trust block ("Why {place} homeowners choose Real Elite") now
 * withholds those three from every `market: 'premium'` page, the new hub
 * included, keeping only the verified licensing line.
 *
 * What still reaches the hub, traced occurrence by occurrence in the built
 * HTML rather than inferred from a count — an earlier version of this note got
 * it wrong by measuring the warranty and not following the others:
 *
 *   - `AssurancesBand` — "Every project gets our written workmanship
 *     warranty", and "Named project lead. Daily updates while we work.
 *     24-hour response standard. Clean job site every day."
 *   - `PROCESS_STEPS` in `constants.ts`, via `PrecisionProcess` — "workmanship
 *     warranty issued in writing" and "Daily updates from your project lead.
 *     Clean job site. 24-hour response standard."
 *   - one `SERVICES` description in `constants.ts` — "Full interior
 *     renovations under one project lead".
 *
 * So three of the claims survive there, not one, on roughly fifty pages
 * including the homepage and /process.
 *
 * Those are deliberately NOT gated. Removing the claim from one market's hub
 * while the homepage still makes it does not reduce the contract exposure —
 * the same buyer reads it two clicks later — so it is a sitewide content
 * decision, which is §9 of the altitude doc and belongs to the owner. Gating
 * it per-market would also mean the same sentence being true in Martinsburg
 * and absent in Fairfax, which is not a coherent thing for the site to say.
 *
 * So: the per-market copy is gated, the sitewide copy is inventoried and
 * waiting on a decision. Do not read the gate as "the hub makes no
 * unconfirmed claims" — it makes two, from shared components.
 *
 * Closing it completely would mean inventorying area slugs, and the next area
 * row would then have to be added to that allowlist in its own PR — the move
 * this file's header tells the reader never to make. The real fix is the owner
 * ruling on the seven claims below: confirm them and the gate comes out,
 * retract them and the copy goes.
 */

export type ClaimStatus = 'verified' | 'unconfirmed';

export type OperationalClaim = {
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
 * The last two were added after the Northern Virginia hub shipped: tracing the
 * built HTML showed `AssurancesBand` and `PROCESS_STEPS` in `constants.ts`
 * were the actual sitewide source of the warranty, project-lead, daily-updates
 * and clean-job-site claims on roughly fifty pages — not just the warranty, as
 * an earlier version of the note below wrongly said. Watching them does not
 * change what they publish; it stops a NEW claim being added to the two files
 * that reach the whole site.
 */
export const GUARDED_TEMPLATES = [
  'src/app/services/[service]/[city]/page.tsx',
  'src/components/services/CityPageTemplate.tsx',
  'src/components/home/AssurancesBand.tsx',
  'src/lib/constants.ts',
] as const;

export const OPERATIONAL_CLAIMS: readonly OperationalClaim[] = [
  {
    id: 'written-workmanship-warranty',
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
        'bathrooms-burke-va', 'kitchens-burke-va', 'basements-burke-va',
        'bathrooms-fairfax-station-va', 'kitchens-fairfax-station-va', 'basements-fairfax-station-va',
        'bathrooms-clifton-va', 'kitchens-clifton-va', 'basements-clifton-va',
        'bathrooms-middleburg-va', 'kitchens-middleburg-va', 'basements-middleburg-va',
      ],
      serviceSlugs: ['kitchens', 'roofing', 'general-repairs'],
      templates: [
        'src/app/services/[service]/[city]/page.tsx',
        'src/components/services/CityPageTemplate.tsx',
        'src/components/home/AssurancesBand.tsx',
        'src/lib/constants.ts',
      ],
    },
  },
  {
    id: 'named-project-lead',
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
        'kitchens-burke-va', 'basements-burke-va', 'bathrooms-fairfax-station-va',
        'kitchens-fairfax-station-va', 'basements-fairfax-station-va', 'bathrooms-clifton-va',
        'kitchens-clifton-va', 'basements-clifton-va', 'bathrooms-middleburg-va',
        'kitchens-middleburg-va', 'basements-middleburg-va',
      ],
      serviceSlugs: ['bathrooms', 'kitchens', 'remodeling'],
      templates: [
        'src/app/services/[service]/[city]/page.tsx',
        'src/components/services/CityPageTemplate.tsx',
        'src/components/home/AssurancesBand.tsx',
        'src/lib/constants.ts',
      ],
    },
  },
  {
    id: 'daily-progress-photos',
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
        'bathrooms-fairfax-station-va', 'kitchens-fairfax-station-va',
        'bathrooms-clifton-va', 'kitchens-clifton-va', 'bathrooms-middleburg-va',
        'kitchens-middleburg-va',
      ],
      serviceSlugs: ['bathrooms'],
      templates: [],
    },
  },
  {
    id: 'daily-updates',
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
        'basements-great-falls-va', 'basements-reston-va', 'basements-burke-va',
        'basements-fairfax-station-va', 'basements-clifton-va', 'basements-middleburg-va',
      ],
      serviceSlugs: ['bathrooms', 'kitchens', 'decks', 'remodeling'],
      templates: [
        'src/app/services/[service]/[city]/page.tsx',
        'src/components/services/CityPageTemplate.tsx',
        'src/components/home/AssurancesBand.tsx',
        'src/lib/constants.ts',
      ],
    },
  },
  {
    id: 'clean-job-site',
    label: 'The job site is left clean at the end of every day.',
    status: 'unconfirmed',
    patterns: [/clean job site/i],
    publishedIn: {
      comboKeys: [
        'roofing-hagerstown-md', 'remodeling-hagerstown-md', 'basements-frederick-md',
        'kitchens-mclean-va', 'kitchens-alexandria-va', 'basements-mclean-va',
        'basements-alexandria-va', 'bathrooms-vienna-va', 'kitchens-vienna-va',
        'basements-vienna-va', 'bathrooms-great-falls-va', 'kitchens-great-falls-va',
        'basements-great-falls-va', 'bathrooms-reston-va', 'kitchens-reston-va',
        'basements-reston-va', 'bathrooms-burke-va', 'kitchens-burke-va',
        'basements-burke-va', 'bathrooms-fairfax-station-va', 'kitchens-fairfax-station-va',
        'basements-fairfax-station-va', 'bathrooms-clifton-va', 'kitchens-clifton-va',
        'basements-clifton-va', 'bathrooms-middleburg-va', 'kitchens-middleburg-va',
        'basements-middleburg-va',
      ],
      serviceSlugs: ['bathrooms', 'kitchens', 'remodeling', 'general-repairs', 'handyman'],
      templates: [
        'src/app/services/[service]/[city]/page.tsx',
        'src/components/services/CityPageTemplate.tsx',
        'src/components/home/AssurancesBand.tsx',
        'src/lib/constants.ts',
      ],
    },
  },
  {
    id: 'same-day-response',
    label: 'Enquiries and questions get a same-day response.',
    status: 'unconfirmed',
    patterns: [/same[- ]day response/i],
    note:
      'A service-level commitment, and the one most likely to be measured against the business by a homeowner keeping receipts. Note that the adjacent "within 24 business hours" promise, used far more widely, is a different and weaker claim and is not registered here.',
    publishedIn: {
      comboKeys: [
        'bathrooms-mclean-va', 'kitchens-mclean-va', 'kitchens-alexandria-va',
        'bathrooms-vienna-va', 'kitchens-vienna-va', 'kitchens-great-falls-va',
        'kitchens-reston-va', 'kitchens-burke-va', 'kitchens-fairfax-station-va',
        'kitchens-clifton-va',
      ],
      serviceSlugs: [],
      templates: [],
    },
  },
  {
    id: 'active-work-timeline',
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
