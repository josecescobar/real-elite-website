# 12 — Engineering Recommendations

Standards, guardrails, and principles for a codebase meant to last a decade. These generalize the
specific findings in 01–11 into **durable engineering practice**. Most of them are already *implicitly*
followed by the best parts of this repo — the recommendation is to make them **explicit and enforced**
so they survive contributor growth.

---

## 1. Principles (the throughline)

1. **Author once, render everywhere.** The Project Object is the model for all content: one record
   feeds the gallery, the page, the proof modules, the schema, and AI. Resist any feature that
   re-authors the same truth in a second place.
2. **Data is the brain; components are the skin; routes are the wiring.** Keep intelligence in
   `src/lib`, presentation in `src/components`, composition in `src/app`. The clean layering is a
   strength — protect it.
3. **Every page is a published entity, for humans *and* machines.** Stable URL, one canonical, a
   citable answer block, and a node in the `@id` entity graph. SEO and GEO are not a phase — they're a
   property of every page.
4. **Honesty is a feature.** No fabricated ratings, stats, or stock-as-real imagery. This is encoded in
   `social-proof.ts` gating and the "Design Inspiration" labeling — make it a **hard rule**, not a
   convention.
5. **Every change either adds trust or removes friction.** Borrowed from the design blueprint; it's a
   good filter for engineering scope too.
6. **Build for the contract you'll have, not the storage you have now.** Typed object contracts
   (Project/Review/Customer) outlive their backing store (TS → MDX → CMS → API). Design the contract;
   swap the source behind an adapter.

---

## 2. Standards to adopt (make implicit explicit)

### Code & types
- **Keep `strict` TS and near-zero `any`.** The codebase already has essentially one `any` in all of
  `src` — set that as the bar. Add an ESLint rule failing on new `any`/`@ts-ignore` without a comment.
- **Add Prettier** + `eslint-config-prettier`; enforce `format:check` in CI. One formatter, no debates.
- **Lint everything that runs**, including `scripts/**` (currently ignored) — build-critical code
  deserves static checks.
- **Validate at boundaries with `zod`** — env (D6), API request bodies (today's hand-rolled validation
  is good but bespoke per route — a shared schema validator would reduce drift), and content records at
  build time (extend the `projects.test.ts` referential-integrity pattern to all content).

### Content architecture
- **One shared content-primitive library** (`FAQItem`, `ImageRef`, `InvestmentTier`, `AreaServed`,
  `Review`) composed by every offering type. No more parallel `ServiceFAQ`/`ProjectFAQ`/schema-FAQ.
- **Test-validate referential integrity** for all cross-links (service↔city↔project↔guide slugs), the
  way `projects/types.ts` already promises. Broken internal links should fail CI, not ship.
- **Content lives in data/markdown, never in route files.** The `CONTENT` monolith is the
  counter-example to retire (D1).

### SEO/GEO (treat as code, not content)
- **One metadata factory** (`buildMetadata`) for every route; a test asserting one canonical per page.
- **One entity graph** (`@id`-linked Org/WebSite root); every schema entity references it.
- **NAP from a single source** (`BUSINESS`) everywhere — byte-identical across schema and footer.
- **Every page ships a citable answer block** + validates JSON-LD (snapshot/Rich-Results test in CI).

### Resilience
- **Error & loading boundaries** at the root and per dynamic family (D4); branded, with a phone CTA —
  resilience is itself a trust signal.
- **Graceful degradation** for every external dependency (already the pattern in `/api/estimate`'s
  Resend 503 + fire-and-forget Twilio) — make it the required pattern for any new integration.
- **No external call on the critical path** that can't fail safely.

### Quality gates (CI)
Extend CI from *lint + typecheck + test + build* to also include:
- **Prettier check**, **coverage floor**, **Playwright funnel E2E**, **`@axe-core/playwright`**,
  **JSON-LD validation**, and a **CWV/bundle budget** (e.g. Lighthouse CI). Quality should scale with
  content volume, not erode.
- **Scheduled `npm audit`** (Dependabot) given the bleeding-edge dependency stance.

### Security (keep the bar; it's high)
- Maintain CSP/HSTS/headers, rate limiting, honeypots, webhook signature checks, admin-key gating,
  HTML-escaping of user input. **New API routes inherit this checklist** — codify it as a
  `docs/API-ROUTE-CHECKLIST.md`.
- Keep all secrets behind `env.ts`; never read `process.env` directly in new code.
- **Confirm repo visibility** (currently public) is intended given the strategic content.

---

## 3. Process recommendations

- **PR-per-feature with green CI** — already the norm; keep it. Add a PR template referencing the
  relevant checklist (API / SEO / content).
- **Delete branches on merge** — turn on auto-delete to prevent the ~35-stale-branch situation
  recurring.
- **One commit per concern** — e.g. the Prettier reformat lands alone so real diffs stay reviewable.
- **A `docs/` decision log** — the team already writes excellent phase reports and a blueprint; add
  short ADRs (Architecture Decision Records) for irreversible choices (CMS? search vendor? object
  schema versioning?) so the *why* survives.
- **Quarterly dependency review** — given Next/React/Tailwind/Vitest are all on recent majors.

---

## 4. Anti-patterns to actively prevent

| Anti-pattern | Why it's dangerous here | Guardrail |
|---|---|---|
| Content in route files | The `CONTENT` monolith scaling ceiling | Lint/review rule: no large data literals in `app/**`. |
| A third/fourth parallel "offering" model | Multiplies the D2 debt | Shared content primitives + review gate. |
| Hand-rolled metadata on new pages | Canonical/OG drift across 200+ pages | `buildMetadata` required; canonical test. |
| Floating, unlinked proof | Low-credibility, AI-ignored | Proof must reference a `Project`/`Review` object. |
| Fabricated/unverifiable claims | Destroys the trust moat | Honesty guardrail; gating like `social-proof.ts`. |
| New integration on the critical path | Outage breaks lead capture | Mandatory graceful-degradation pattern. |
| Pixel/UX changes smuggled into refactors | Unreviewable diffs, SEO regressions | Separate "pixel-preserving" vs "intentional change" PRs (the Phase-1 discipline). |

---

## 5. What this team already does well (keep doing it)

- Single source of truth for business data (`constants.ts`).
- RSC-default, client-at-the-leaves.
- Honest trust gating.
- Heavily-commented, intentional config and types (the `projects/types.ts` and `env.ts` headers are
  exemplary — they explain *why*).
- Disciplined, output-preserving refactors verified against built output (Phase-1).
- Writing the strategy down (`V2-BLUEPRINT`, phase reports, session notes) so engineering has a North
  Star.

**The meta-recommendation:** the codebase's *engineering* is already top-tier for its category; its
**proof architecture is the underbuilt part** (the team's own words). Point the next several sprints at
turning *work-done* into *proof-shown* — the Project flywheel — while holding the quality bar above with
explicit, enforced guardrails. Do that, and this becomes infrastructure that compounds for a decade.

---

*End of report. See [00-INDEX](00-INDEX.md) for the full document set.*
</content>
