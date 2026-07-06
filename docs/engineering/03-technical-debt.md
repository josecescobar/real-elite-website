# 03 — Technical Debt Register

Prioritized, evidence-backed. Each item: **what / where / why it matters / remediation / effort**.
Effort scale: S (≤½ day), M (1–3 days), L (3–8 days), XL (>8 days).

> Framing: the foundation is strong. This is **not** a list of things that are broken — it is a list of
> **scaling ceilings and consistency gaps** that get more expensive the longer the site grows. The
> team has already named the top item (`PHASE-1-REPORT.md`); this register extends and ranks it.

---

## P0 — Pay down before/while scaling content

### D1. The 1,085-line `CONTENT` monolith — **highest-priority debt**
- **Where:** `src/app/services/[service]/[city]/page.tsx` (1,085 lines).
- **What:** Every service×city page's body content lives in one hand-maintained `CONTENT` map inside a
  route file. Adding a city or service means editing a route component.
- **Why it matters:** This is the single biggest **scaling ceiling**. The blueprint targets hundreds of
  service×city intent pages and the Project flywheel; a 1,000-line route file is where that ambition
  stalls. It also couples content edits to routing logic (risky diffs, hard reviews, merge conflicts).
- **Remediation:** Extract `CONTENT` into a structured data module (`src/lib/service-city/`) or
  markdown/MDX, keyed by `(service, city)`, validated at test time against `SERVICES` and
  `ALL_SERVICE_AREAS`. Route file becomes a thin template. *Pixel-preserving* is achievable.
- **Effort:** L. Already explicitly deferred to "Phase 2, highest priority" in `PHASE-1-REPORT.md`.

### D2. Three parallel "offering" data models
- **Where:** `src/lib/services-data.ts` (`SERVICE_DATA`), `src/lib/paving-data.ts` (`PAVING_*`, 761
  lines), `src/lib/projects/` (`Project`).
- **What:** Services, paving, and projects each define their own near-overlapping shapes (hero,
  FAQ, images, areaServed, investment tiers). `ServiceFAQ`, `ProjectFAQ`, and the FAQ schema item are
  three structurally-identical types.
- **Why it matters:** Triple maintenance, drift risk, and it blocks the "author once, render everywhere"
  flywheel the blueprint is built on.
- **Remediation:** Define shared primitives (`FAQItem`, `ImageRef`, `InvestmentTier`, `AreaServed`) in
  one place; have services/paving/projects compose them. Converge paving onto the service model where
  possible. Make `Project` the canonical proof object that services/cities *reference*, not duplicate.
- **Effort:** L–XL (do it incrementally; shared primitives first = M).

### D3. Floating testimonials & flat gallery duplicate the Project Object's job
- **Where:** `constants.ts` → `TESTIMONIALS` (line 537), `GALLERY_IMAGES` (line 824),
  `BEFORE_AFTER_PAIRS` (752), `HOMEPAGE_PROJECT_SPOTLIGHT` (730).
- **What:** Proof currently lives as disconnected lists (quotes with no linked project; images with no
  story). The `Project` object is explicitly designed to own all of this (`review`, `gallery`,
  `beforeAfter`, `featured`).
- **Why it matters:** The blueprint is emphatic that **floating testimonials are low-credibility and
  AI-ignored**; the value is in *review-tied-to-real-project*. These lists are the v1 stand-ins to
  retire.
- **Remediation:** As real projects are authored, migrate spotlight/gallery/testimonials to derive from
  the `Project` pool. Keep the flat lists only as a fallback until project coverage is sufficient.
- **Effort:** M (mechanical once D2/flywheel exists), gated on real project content.

---

## P1 — Resilience & consistency (cheap now, expensive later)

### D4. No error or loading boundaries
- **Where:** entire `src/app` — **no `error.tsx`, `global-error.tsx`, or `loading.tsx`** exist.
- **Why it matters:** A thrown error in any RSC subtree (e.g. a malformed project record, a failed
  data lookup) has no graceful route-level fallback; the user sees a broken page. As content scales and
  more dynamic data is introduced, the blast radius grows.
- **Remediation:** Add a root `app/error.tsx` + `app/global-error.tsx` (branded "something went wrong,
  call us" with the phone CTA — on-brand resilience), and `loading.tsx` where any async work exists.
- **Effort:** S.

### D5. Partial `buildMetadata` adoption (canonical inconsistency)
- **Where:** `buildMetadata()` used in **13** of **39** metadata-exporting routes; **25 routes still
  hand-roll `alternates.canonical`** + OpenGraph.
- **Why it matters:** Canonical/OG drift across hundreds of pages is a real SEO regression risk; the
  factory exists precisely to prevent it. Half-migrated is the worst state (looks done, isn't).
- **Remediation:** Extend `buildMetadata` to dynamic routes (blog, guides, paving, service-areas,
  projects) and the ~12 one-off marketing pages. Add a test asserting every page emits a canonical.
- **Effort:** M. (Named in `PHASE-1-REPORT.md` Phase-2 #3.)

### D6. No env **validation** (only typed access)
- **Where:** `src/lib/env.ts` — typed accessors, but no schema/startup check.
- **Why it matters:** A misconfigured/missing Twilio var fails silently (SMS no-ops); a typo'd
  `RESEND_API_KEY` only surfaces on first lead. No fail-fast in dev.
- **Remediation:** Add a lightweight `zod` schema validated once in dev/build (not per-request, to
  preserve current live-read semantics). Surface clear "missing X" errors.
- **Effort:** S–M. (Named in `PHASE-1-REPORT.md` Phase-2 #4.)

### D7. Spacing/section rhythm not tokenized
- **Where:** section paddings vary ad hoc (`py-16 md:py-24`, `py-12 md:py-16`, `py-20 md:py-28`) across
  templates; no `Section`/`Container` spacing primitive enforced.
- **Why it matters:** Inconsistent vertical rhythm reads as less premium; the blueprint's design-system
  philosophy calls for a strict spacing scale. Hard to keep consistent by hand across 200+ pages.
- **Remediation:** Introduce a `Section` primitive with a spacing-scale prop; adopt in a deliberate
  (non-pixel-preserving) consistency pass. See [08](08-design-system-review.md).
- **Effort:** M.

---

## P2 — Quality engineering

### D8. Test coverage is logic-heavy, surface-light; no E2E
- **Where:** ~21 test files / ~238 tests cover lib logic, API routes, and a few components
  (Button, GalleryGrid, Header, MultiStepEstimateForm) + page smoke tests. **No Playwright/E2E.**
- **Gaps:** most page templates, the conversion funnel end-to-end (hero → form → submit → email), the
  Project rendering path, schema output assertions.
- **Remediation:** Add Playwright for the lead funnel (the revenue path) + 1 smoke per route family;
  add a JSON-LD snapshot/validation test. Set a coverage floor in CI.
- **Effort:** M–L. (Named in `PHASE-1-REPORT.md` Phase-3 #1.)

### D9. `npm audit`: 5 vulnerabilities untriaged
- **Where:** dependency tree (4 moderate, 1 high) reported at install.
- **Remediation:** `npm audit` review; patch the high deliberately; document any accepted risk. Add a
  scheduled audit (Dependabot or CI step).
- **Effort:** S.

### D10. No Prettier / formatting standard
- **Where:** repo-wide. ESLint covers correctness, not formatting.
- **Remediation:** Add Prettier + `eslint-config-prettier`; one formatting commit; enforce in CI/pre-commit.
- **Effort:** S (but do it as its own commit to keep the diff reviewable).

### D11. `scripts/**` is unlinted & untested
- **Where:** `eslint.config.mjs` ignores `scripts/**`; `optimize-images.mjs` runs on every build.
- **Why it matters:** A build-critical script has no static checks; a regression there can silently
  degrade image delivery (relevant to D-perf below).
- **Remediation:** Lint scripts (Node env) and add a smoke test or `--dry-run` assertion.
- **Effort:** S.

---

## P3 — Watch items (not urgent)

- **D12. Module-scope env capture in some routes** — e.g. `estimate/route.ts` reads `RESEND_API_KEY`
  at module load; fine on Vercel's per-invocation cold model, but worth knowing it won't pick up a
  rotated key without a redeploy. Low risk.
- **D13. Hardcoded address fragments in schema components** — `ServiceSchema`/`ArticleSchema`/layout
  repeat `Martinsburg/WV/25401` literals instead of sourcing from `BUSINESS`. Centralize for NAP
  byte-consistency (the blueprint stresses NAP↔schema parity for GEO). S.
- **D14. Stray root docs** (`content-calendar-*.md`, `TEST_COVERAGE_ANALYSIS.md`) — relocate/retire. S.
- **D15. Bleeding-edge majors** — Next 16 / React 19 / Tailwind 4 need a quarterly review cadence. S, recurring.

---

## Debt heatmap (impact × effort)

| | Low effort | High effort |
|---|---|---|
| **High impact** | D4 (error boundaries), D5 (metadata), D6 (env validate), D9 (audit) | **D1 (CONTENT monolith)**, D2 (unify models), D8 (E2E) |
| **Low impact** | D10 (Prettier), D11 (lint scripts), D13/D14 (hygiene) | D7 (spacing tokens), D3 (proof migration — content-gated) |

**Do-first quadrant (high impact / low effort):** D4, D5, D6, D9 — these are the cheap, high-value wins
to bundle into Sprint #002 alongside the start of D1.
</content>
