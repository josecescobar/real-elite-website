# 10 — Sprint #002 Proposal

> **Revised per CTO decision (2026-06-29).** Sprint #002 is reduced from a two-week, multi-epic sprint
> to a **tight 1–3 day, single-objective sprint.** The foundation refactors and resilience/hygiene work
> previously proposed here have been moved to the future-sprint backlog (see *Deferred* below and
> [09](09-priority-backlog.md)). This document now scopes **only** the GEO/AEO quick win.

---

## Objective (the one thing)

**Ship the GEO/AEO Answer Block to production** by rebasing and merging the already-built work from
**PR #52 (`claude/v2-service-answer-block`)** onto current `main`, plus **only** the minimum supporting
metadata/structured-data work required for that feature to be **clean, tested, and production-ready**.

Nothing else ships in Sprint #002.

**Why this, why now:** the Answer Block is the single highest-ROI move available — it is the citable
2–3 sentence summary that Google AI Overviews, ChatGPT, and Perplexity lift and cite. The code already
exists; the work is to land it correctly, not to build it. It directly advances the strategic shift
from rankings to AI-citation (`V2-BLUEPRINT.md` §4) at minimal risk.

---

## Context: the state of PR #52

PR #52's branch is **stale** — it forked an older `main` (pre–Project System merge #53), so its raw
diff shows large phantom deletions. **It must not be merged as-is.** The sprint's real work is to
**re-apply the intended additions onto a fresh branch cut from current `main`**:

- `src/components/services/AnswerBlock.tsx` (+ `AnswerBlock.test.tsx`)
- the `answer`/answer-block field(s) added to `src/lib/services-data.ts`
- the wiring into `src/components/services/ServicePageTemplate.tsx`

Treat PR #52 as the **source of the intended change**, not a mergeable branch.

---

## In scope (explicit)

1. **Re-create the branch** `claude/v2-service-answer-block` content on a fresh branch off current
   `main` (proposed name below). Extract only the AnswerBlock additions; discard the stale diff.
2. **`AnswerBlock` component** — render a concise, citable 2–3 sentence answer ("What does Real Elite
   do for [service], and who is it for?") plus the short scannable "what's included" lead, per
   blueprint §4.
3. **`services-data` content** — populate the answer-block field for **all active service pages** that
   render `ServicePageTemplate` (no service page ships with an empty/placeholder answer).
4. **Template wiring** — `ServicePageTemplate` renders the AnswerBlock in the correct position (directly
   under the hero, above scope), responsive and accessible.
5. **Minimum supporting structured data (only what THIS feature needs to be clean):**
   - Ensure the answer-block content is consistent with the existing `FAQPage`/`Service` JSON-LD on the
     page (no contradictory copy between the visible answer and schema).
   - If — and only if — the AnswerBlock introduces a new answer string that belongs in structured data,
     expose it via the **existing** schema components (e.g. as a `Service.description` / lead). **Do not**
     build the new `@id` Organization/WebSite entity graph here — that is deferred (see below); only the
     minimum needed for the AnswerBlock to be coherent and valid.
6. **Tests** for the component and its data wiring (carry forward / update `AnswerBlock.test.tsx`).
7. **Accessibility pass** on the new block (heading level, contrast, no layout shift).

---

## Out of scope (explicit — deferred to future sprints)

Per the CTO decision, the following are **moved to the backlog** ([09](09-priority-backlog.md)) and
**must not** be started in Sprint #002:

- ❌ **CONTENT monolith extraction** (D1 / B8)
- ❌ **Full offering-model unification** — services/paving/projects shared primitives (D2 / B9)
- ❌ **Retiring testimonials/gallery models** in favor of the Project Object (D3 / B17)
- ❌ **Global error/loading boundaries** (D4 / B3)
- ❌ **Env validation (zod)** (D6 / B7)
- ❌ **npm audit remediation** — *unless a specific advisory blocks CI*, in which case patch **only**
  that advisory (no broad upgrade, no `audit fix --force`)
- ❌ The broad **`@id` Organization/WebSite entity graph** (B11) — only the minimal coherence work in
  scope item 5 is permitted
- ❌ Full **`buildMetadata` migration** (B10), design-system primitives (B12), E2E (B18), and all v2
  epics

Also explicitly out: any redesign, dependency upgrades, new packages, or pixel changes beyond the
AnswerBlock's own markup.

---

## Acceptance criteria

The sprint is **done** when **all** of the following are true:

1. A fresh branch off current `main` contains the AnswerBlock component, its tests, the `services-data`
   answer content, and the `ServicePageTemplate` wiring — and **none** of PR #52's stale phantom
   deletions.
2. **Every** active service page renders a populated, human-written Answer Block in the correct position
   (verified on at least `/services/roofing`, `/services/kitchens`, and one more) — no empty,
   placeholder, or "lorem" answers.
3. The visible answer copy does **not** contradict the page's existing `Service`/`FAQPage` JSON-LD.
4. The rendered JSON-LD on a service page still **validates** (Google Rich Results Test / schema
   validator) — no regressions introduced.
5. The AnswerBlock is **accessible**: correct heading hierarchy (no skipped levels, single `<h1>`
   preserved), AA contrast, no cumulative layout shift from the new block.
6. No file under `src/app/services/[service]/[city]/`, no offering-model files, and no error-boundary /
   env / schema-graph files are modified (scope guard — confirms the deferred items weren't touched).
7. CI is green (see below) and the PR is open for review (not merged).

---

## Test & build requirements

Must all pass **before** the PR is marked ready:

```bash
npm run lint        # clean (no new warnings beyond the known pre-existing set)
npm run typecheck   # clean
npm run test        # all green, including AnswerBlock.test.tsx
SKIP_IMAGE_OPTIMIZE=1 npm run build   # production build succeeds; sitemap generates
```

Plus:
- **New/updated unit tests** for `AnswerBlock` (renders given content; handles missing/empty content
  safely) and for the `services-data` answer field (every active service has a non-empty answer —
  a data-integrity test in the spirit of the existing `constants.test.ts` / `projects.test.ts`).
- **Manual verification:** dev server up, spot-check 3 service pages for correct rendering + position;
  run the page's JSON-LD through a schema validator.
- **CI gate:** the existing GitHub Actions workflow (lint + typecheck + test + build) must pass on the
  PR. The **only** dependency change permitted is a single targeted patch if an `npm audit` advisory
  hard-blocks CI.

---

## Suggested PR title

```
feat(seo): Answer Block on service pages (GEO/AEO) — re-land PR #52 on main
```

*(Alternative if you prefer issue-style:* `feat(geo): citable Answer Block for service pages`*.)*
Reference and supersede PR #52 in the body; close #52 once this lands.

---

## Rollback plan

The change is **low-risk and trivially reversible** — additive UI + content, no data migration, no
schema-graph rewrite, no route changes.

1. **Pre-merge:** it's a single PR against `main`; if review finds issues, iterate or close the PR —
   nothing is in production until merge + Vercel deploy.
2. **Post-merge regression:** `git revert <merge_commit>` on `main` and push → Vercel auto-deploys the
   reverted state. Because the change is one component + content + one template hook, the revert is
   clean (no entangled refactors — that's *why* the heavy items were deferred).
3. **Instant mitigation without a revert:** the AnswerBlock reads from a `services-data` field; if a
   specific page's copy is wrong, blank that field (the component must render nothing gracefully when
   the answer is empty — covered by acceptance criterion + test) and redeploy. No code change needed
   for a content-only fix.
4. **Verification after rollback/mitigation:** re-run the build + JSON-LD validation on the affected
   service pages to confirm the page returns to its prior valid state.

---

## Estimated effort

**1–3 days**, single engineer:

| Day | Work |
|---|---|
| **Day 1** | Cut fresh branch off `main`; re-apply AnswerBlock component + template wiring from PR #52; restore/author the `services-data` answer content for all active services. |
| **Day 2** | Tests (component + data-integrity); schema-coherence check + JSON-LD validation; a11y pass; manual spot-checks. |
| **Day 3 (buffer)** | CI green; PR opened for review; address review feedback. Close PR #52. |

---

## Deferred work (pointer)

Everything previously proposed in this document — the CONTENT refactor, offering-model unification,
proof-model migration, error boundaries, env validation, audit remediation, metadata migration, design
primitives, E2E — now lives in [09 — Priority Backlog](09-priority-backlog.md) (Tiers 0–4) and the
[11 — Long-Term Roadmap](11-long-term-roadmap.md), to be scoped into their own future sprints.
</content>
