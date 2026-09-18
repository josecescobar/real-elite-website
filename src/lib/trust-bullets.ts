import { unconfirmedClaimIdsInCombo } from '@/lib/service-city-content';
import type { ServiceArea } from '@/lib/constants';

/**
 * The "Why {place} homeowners choose Real Elite" bullets on a service+area
 * page, and the rule for which of them a given page may publish.
 *
 * ## Why the selection lives here and not in the route
 *
 * It was in the route, and the test replayed the rule instead of calling it.
 * Codex showed that test was worthless twice over: the assertion was vacuous
 * by construction, AND weakening the route's filter from `every` to `some`
 * left it green. Verified both before moving anything.
 *
 * A rule that lives in a page component can only be tested by rendering that
 * page or by copying the rule into the test. The copy is what shipped, and it
 * is the same mistake `serviceHrefForArea` was extracted to fix earlier in
 * this same PR. So the rule lives here, the route calls it and holds no logic
 * of its own, and the test exercises the function that actually runs.
 *
 * ## The rule
 *
 * Three of the four bullets publish operational claims registered
 * `unconfirmed` in `src/lib/claims.ts`. CLAUDE.md: those go in only once the
 * owner has confirmed them.
 *
 * A bullet is published only when the page already makes every claim that
 * bullet would introduce — `every`, not `some`: half a bullet's copy being
 * pre-existing does not license the other half. The home market publishes all
 * of them, unchanged.
 *
 * Three predicates were refuted on review before this one:
 *
 *   1. `market === 'premium'`, argued from specificity. 36 of the 47 premium
 *      combos already make these promises in their own localized paragraphs at
 *      that same service-and-town specificity, so it reduced nothing there and
 *      pre-applied part of a retraction that is the owner's to decide.
 *   2. "the page's copy makes no unconfirmed claim". A new premium page whose
 *      copy carried only an unrelated claim (`active-work-timeline`, as
 *      bathrooms-ashburn-va does) would have been handed all four bullets.
 *   3. Per-bullet, but tested by replaying the rule — see above.
 *
 * None of this is a claim about the page as a whole. `AssurancesBand` and
 * `PRECISION_PROCESS` publish the same claims sitewide, which is the owner's
 * decision. The real fix is their ruling on the seven claims in claims.ts:
 * confirm them and this whole rule comes out, retract them and that file is
 * the worklist.
 */
export type TrustBullet = {
  text: string;
  /**
   * The claim ids this bullet's text publishes.
   *
   * Hand-written, and they are the rule's input, so `trust-bullets.test.ts`
   * checks them against `claimsFoundIn` rather than trusting them. An
   * annotation that UNDERSTATES a bullet would wave it onto a page that must
   * not carry it — worse than no rule at all, because the rule then reads as
   * assurance.
   */
  claims: readonly string[];
};

export function trustBullets(
  city: string,
  serviceTitle: string,
  state: string
): readonly TrustBullet[] {
  return [
    {
      text: `One named project lead on every ${city} ${serviceTitle.toLowerCase()} job — from estimate through final walkthrough.`,
      claims: ['named-project-lead'],
    },
    {
      // Two claims in one sentence, which is why the rule uses `every`.
      text: 'Daily updates, clean job site, 24-hour response standard.',
      claims: ['daily-updates', 'clean-job-site'],
    },
    {
      text: 'Written workmanship warranty + manufacturer warranties registered on your behalf.',
      claims: ['written-workmanship-warranty'],
    },
    {
      // Verified, so it carries no claims and always publishes.
      text: `Licensed and insured in ${state} — local permitting + inspections handled.`,
      claims: [],
    },
  ];
}

/**
 * The bullets this page may publish, in order. The route renders this and
 * decides nothing itself.
 */
export function selectTrustBullets(
  area: ServiceArea,
  serviceSlug: string,
  serviceTitle: string
): string[] {
  const own = new Set(unconfirmedClaimIdsInCombo(serviceSlug, area.slug));
  return trustBullets(area.city, serviceTitle, area.state)
    .filter((bullet) => area.market === 'home' || bullet.claims.every((id) => own.has(id)))
    .map((bullet) => bullet.text);
}
