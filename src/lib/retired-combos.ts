/**
 * Tier C: service+area pages retired on 2026-09-18, and where each one goes.
 *
 * §3.3 of docs/site-altitude-architecture-2026-09-18.md. These ten combos had
 * ZERO mobile Search Console impressions in six months AND no Ads row in any
 * trade — three towns that show no reported demand for anything, plus Burke's
 * basement page (Burke keeps its kitchen and bathroom combos at 10/mo apiece,
 * tiny but reported).
 *
 * McLean was in an earlier draft of this list and was WITHDRAWN: it has an Ads
 * row for all three trades — basements 30/mo, kitchens 260, bathrooms 140.
 * Consolidating it would have deleted pages for reported demand, which is the
 * exact error the altitude doc accuses the original site build of. Checking
 * that cost one keyword call and saved five pages.
 *
 * ## One rule, two destinations
 *
 * Redirect to the most specific SURVIVING page that still serves the query.
 *
 *   - basements → /services/basements/northern-virginia. The trade is
 *     preserved and the place widens to the region that contains the town.
 *     Topically the same page, and it is where we want these signals to land.
 *   - kitchens and bathrooms → the town's own /service-areas/ page. Those
 *     trades have NO regional page by design (§1.5: "kitchen remodeling mclean
 *     va" is 260/mo, Vienna 140, so they stay at town altitude), so there is no
 *     service+place page to land on. The area page preserves the place match
 *     the query carried; the service pillar would throw the place away.
 *
 * The three towns' own area pages are Tier D — kept, not retired. Clifton's
 * holds 48 impressions at position 15.2 and McLean's 209.
 *
 * ## Why this is its own module, with NO imports
 *
 * `next.config.ts` generates the redirect rules from this map so the
 * declaration and the config cannot drift. Next loads its config outside the
 * app's module graph, where the `@/` path alias does NOT resolve — so a config
 * that reaches into a module using aliased imports fails the build with
 * "Cannot find module './src/lib/claims'". It first lived in
 * service-city-content.ts, which imports `@/lib/claims`, and did exactly that.
 *
 * Vitest resolves `@/` fine, so the whole test suite passed while the build was
 * broken. Keep this file dependency-free: it is loaded by the build config and
 * by the app, and adding an import here can break the former while every test
 * stays green.
 *
 * ## What this is NOT
 *
 * Not the area-level `status: 'consolidated'` / `redirectTo` machinery in
 * constants.ts. That retires an AREA and its /service-areas/ page. This retires
 * a service+area COMBO while the area page survives, so it needs its own
 * declaration and its own guard — see the retired-combo redirect test in
 * service-city-content.test.ts, which reuses the conditions the area-level test
 * took nine rounds of review to get right.
 *
 * Deleting a key from CONTENT is what un-publishes the page: the combo route
 * builds `generateStaticParams` from CONTENT keys and sets
 * `dynamicParams = false`, so a removed key is a hard 404 without a redirect.
 * That is why this list and next.config.ts must agree, and why a test enforces
 * it rather than a comment asking nicely.
 */
export const RETIRED_COMBOS: Readonly<Record<string, string>> = {
  // Clifton, VA — zero impressions across all three trades.
  'basements-clifton-va': '/services/basements/northern-virginia',
  'bathrooms-clifton-va': '/service-areas/clifton-va',
  'kitchens-clifton-va': '/service-areas/clifton-va',

  // Fairfax Station, VA — zero impressions across all three trades.
  'basements-fairfax-station-va': '/services/basements/northern-virginia',
  'bathrooms-fairfax-station-va': '/service-areas/fairfax-station-va',
  'kitchens-fairfax-station-va': '/service-areas/fairfax-station-va',

  // Middleburg, VA — zero impressions across all three trades.
  'basements-middleburg-va': '/services/basements/northern-virginia',
  'bathrooms-middleburg-va': '/service-areas/middleburg-va',
  'kitchens-middleburg-va': '/service-areas/middleburg-va',

  // Burke, VA — basements only. Its kitchen and bathroom pages survive.
  'basements-burke-va': '/services/basements/northern-virginia',
};
