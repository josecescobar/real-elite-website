# 10 — Sprint #002 Proposal

**Theme:** *Pay down the top scaling ceiling and ship the highest-ROI GEO win — without slowing content.*

A focused two-week sprint that (1) bags the cheap high-value wins, (2) starts the keystone refactor that
unblocks the v2 flywheel, and (3) merges the AI-citation feature that's already built. Scoped to be
**achievable and low-risk**, with a clear "definition of done" per item.

> Assumes a small team (1–2 engineers). If solo, cut the **Stretch** section and treat **B8** as
> spilling into Sprint #003 — the data extraction is designed to be incremental.

---

## Sprint goals (the three outcomes)

1. **GEO:** Service pages emit a citable Answer Block + a connected entity graph — the site becomes
   measurably more AI-citable.
2. **Architecture:** The service×city content is no longer a 1,085-line route monolith; shared data
   primitives exist; the path to the Project flywheel is unblocked.
3. **Resilience & hygiene:** Branded error handling, env validation, formatter, clean branches, triaged
   security — the guardrails that make fast iteration safe.

---

## Committed scope

### Epic A — GEO quick wins (≈2–3 days)
- **A1 (B1):** Rebase **`AnswerBlock`** (PR #52) onto current `main`; wire into `ServicePageTemplate`
  via `services-data`. *DoD:* every service page renders a 2–3 sentence citable answer; snapshot test
  on output; visible on `/services/roofing`.
- **A2 (B11):** Add **`OrganizationSchema` + `WebSiteSchema`** with stable `@id`s; link
  `Service`/`Article`/`Breadcrumb`/`Project` `provider`/`publisher`/`isPartOf` to the Org `@id`.
  *DoD:* one Org/WebSite graph site-wide; JSON-LD validates; entities reference the Org `@id`.
- **A3 (B6):** Source all NAP from `BUSINESS` in schema components (kill the `Martinsburg/WV/25401`
  literals). *DoD:* grep shows no hardcoded NAP in `components/seo` or `layout`.

### Epic B — Foundation refactor (≈4–6 days)
- **B-1 (B9):** Extract **shared data primitives** — `FAQItem`, `ImageRef`, `InvestmentTier`,
  `AreaServed` — into `src/lib/content/types.ts`; refactor `services-data`, `paving-data`, `projects`
  to compose them. *DoD:* one definition each; typecheck clean; tests green; no output change.
- **B-2 (B8, phase 1 of 2):** Extract the **`CONTENT` monolith** out of
  `services/[service]/[city]/page.tsx` into `src/lib/service-city/` keyed by `(service, city)`,
  **test-validated** against `SERVICES` + `ALL_SERVICE_AREAS`. Route file becomes a thin template.
  *DoD:* route file < 200 lines; build output byte-equivalent (spot-checked on 3 pages); referential
  test passes. *(If the full extraction is large, land the data move this sprint; collapse the template
  next sprint.)*

### Epic C — Resilience & hygiene (≈2–3 days)
- **C1 (B3):** `app/error.tsx` + `app/global-error.tsx` + `app/loading.tsx` — branded "something went
  wrong, call us" with the phone CTA. *DoD:* forced error renders the branded fallback, not a stack.
- **C2 (B7):** `zod` env schema in `env.ts`, validated once at dev/build start (preserve live-read
  semantics for runtime). *DoD:* a missing `RESEND_API_KEY` fails fast in dev with a clear message.
- **C3 (B4):** `npm audit` triage; patch the high deliberately; add a scheduled audit (Dependabot or CI
  step). *DoD:* high vuln resolved or documented-as-accepted; recurring check enabled.
- **C4 (B5):** Add Prettier + `eslint-config-prettier`; one formatting commit; lint `scripts/**`.
  *DoD:* `npm run format:check` clean in CI.
- **C5 (B2):** Branch cleanup — delete merged branches; re-cut #54 strategy docs from `main` and merge.
  *DoD:* remote branch list shows only `main` + active work.

### Epic D — Verify (≈1 day, parallelizable)
- **D1 (B19):** **[live]** Lighthouse + axe on home, a service×city page, a blog post, the estimate
  form. Confirm AVIF/WebP delivery, hero `priority`/`sizes`, no CLS. *DoD:* a short findings note in
  `docs/engineering/`; any P0 regressions filed.

---

## Stretch (only if ahead)
- **S1 (B12):** `Section` + `Card` primitives + spacing scale; adopt in the service template. (Seeds
  Sprint #003's design-system epic.)
- **S2 (B10):** Extend `buildMetadata` to blog/guides/paving routes + canonical test.
- **S3 (B13, seed):** Author **2** real `Project` records end-to-end to validate the model against
  reality before scaling. *(Content-gated — needs real photos from Jose; see session-notes action.)*

---

## Explicitly OUT of scope (and why)
- Project Gallery faceting, Review Center, Resources consolidation — **v2 epics**, multi-sprint
  ([11](11-long-term-roadmap.md)). Don't start until B9/B12/B16 primitives exist.
- Nav/IA overhaul — needs design; not a code sprint.
- AI features / portal — design data contracts later; no build yet.
- Any redesign / pixel changes beyond the intentional Section/Card pass — keep the diff reviewable.

---

## Risks & mitigations
| Risk | Mitigation |
|---|---|
| `CONTENT` extraction causes SEO/content diffs | Byte-equivalence spot-check on representative pages; referential test; ship behind a verified build (the Phase-1 playbook). |
| Schema `@id` changes confuse crawlers temporarily | Additive, not destructive; validate with Rich Results Test before deploy. |
| Bleeding-edge dep churn during audit fix | Patch only the specific advisory; avoid `audit fix --force`. |
| Solo-dev overcommit | B8 is explicitly splittable; Stretch is droppable. |

---

## Definition of done (sprint)
- CI green: lint + **format** + typecheck + test + build.
- Service pages show an Answer Block; one `@id` entity graph site-wide.
- `services/[service]/[city]/page.tsx` < 200 lines; content in a tested data module.
- Branded error/loading boundaries live; env fails fast in dev.
- `npm audit` high resolved; Prettier enforced; branch list clean.
- A live CWV/a11y findings note committed under `docs/engineering/`.

---

## Suggested sequencing (2 weeks)

| | Mon–Tue | Wed–Thu | Fri |
|---|---|---|---|
| **Wk 1** | C5 branch cleanup · A1 AnswerBlock · C4 Prettier | A2 entity graph · A3 NAP · C1 boundaries | B-1 shared primitives (start) |
| **Wk 2** | B-1 finish · B-2 CONTENT extraction (start) | B-2 finish · C2 env validation · C3 audit | D1 live verify · buffer · demo |

> Each item maps to a backlog ID in [09](09-priority-backlog.md). Land Tier-0 early (low risk, unblocks
> confidence), then the foundation refactor mid-sprint when the team is warm.
</content>
