# Real Elite — Session State & Handoff

> **Purpose:** The single entry point for a new working session. Read this first. It captures where
> the project stands, the conventions to follow, and the prioritized backlog — so work continues
> seamlessly without the prior conversation.
>
> **Last updated:** 2026-07-06 (current through PR #68 + the closure of PR #62).

---

## 1. Where we are right now

`main` contains fifteen merged, shipped bodies of work (all CI-green when merged):

| PR | Title | What it delivered |
|----|-------|-------------------|
| **#50** | Phase 1: SEO & architecture hardening | Type-safe env layer (`src/lib/env.ts`), service-area single source, SEO factory + breadcrumb helper (`src/lib/seo.ts`), focus-ring tokens, `docs/PHASE-1-REPORT.md`. |
| **#51** | Website v2 product blueprint | `docs/V2-BLUEPRINT.md`. |
| **#53** | Project System foundation | The v2 keystone: `src/lib/projects/` (typed model + helpers + integrity tests), `ProjectPageTemplate`/`ProjectCard`, `/projects` routes + dynamic OG, one exemplary project. |
| **#54*** | Session handoff + strategy docs | This file + `docs/PROJECT-OBJECT-SPEC.md` + `docs/OPERATING-MANUAL.md`. (*Landed via #60's refresh; the original #54 PR is still open and stale — safe to close.) |
| **#57** | Project System integration | Nav/footer/homepage → `/projects`; service + city proof rails (`getProjectsByService`/`ByCity`); project→guides rail; per-page Twitter cards in `buildMetadata`; image-exists test; mobile drawer renders `UTILITY_LINKS`. |
| **#58** | Engineering hardening | Project auto-registration codegen (`scripts/generate-projects-registry.mjs` → `registry.generated.ts`, staleness-guard test, `generate:projects` in prebuild); service+city `CONTENT` map extracted to `src/lib/service-city-content.ts` (route 1,085 → 441 lines). |
| **#59** | Resource Center + Review contract | Guides consolidated at `/resources` (301s from `/guides*`; article URLs at `/blog/[slug]` untouched); resource-type taxonomy (`RESOURCE_TYPES`); citable `answer:` blocks (mechanism + 3 exemplars); blog pages on `buildMetadata`; `getAllPosts` memoized; unified `Review` contract in `src/lib/reviews/types.ts` (types only). |
| **#60** | Audit closeout | Mega-menu ARIA fix (no `role="menu"`, Escape closes); unused stock-CDN entries removed from CSP + `remotePatterns`; sticky-CTA padding single-sourced in `globals.css`; this doc refreshed. |
| **#61** | Million-Dollar Website plan | `docs/MILLION-DOLLAR-WEBSITE-PLAN.md` — the MDW audit + phased implementation plan that PRs #63–#68 execute. |
| **#63** | MDW Phase 0: measurement + activation | UTM/referrer attribution (`src/lib/attribution.ts` + `AttributionTracker`), lead ledger (`src/lib/leads.ts`, `docs/LEAD_LEDGER_SETUP.md`), analytics event additions, estimate API enrichment, new env accessors. |
| **#64** | MDW Phase 1: Review Center | `src/lib/reviews/` gained `data.ts` (the corpus: first-party testimonials migrated verbatim from `TESTIMONIALS`, `verified: false` throughout) + `index.ts` helpers + integrity tests; `ReviewCard`/`ReviewsSection`; `/reviews` rebuilt on the contract; review rails on service + city templates; `docs/PROJECT-INTAKE.md`. |
| **#65** | MDW Phase 1.7: Gallery → Projects convergence | `/gallery` cross-links into the Project System; `/projects` hub enriched. |
| **#66** | MDW Phase 2: Authority / GEO | `answer:` blocks authored for the whole corpus; **4 new cost-guide articles** (basement egress window, deck cost/sqft, roof replacement, walk-in shower) → **31 articles, 31/31 with answers** (test-enforced in `blog.test.ts`); `public/llms.txt`; GuideTemplate schema additions. |
| **#67** | MDW Phase 3: Conversion system | `/estimate` hub page; homepage `LuxuryBand`; `SuccessNextSteps` second-acts on form successes; nav/mega-menu updates. |
| **#68** | MDW Phase 4: Local depth | Jurisdiction permit-guide blocks on `CityPageTemplate`. |

**PR #62 (answer blocks for 24 articles) was closed unmerged as superseded by #66** — both
independently authored equivalent answers; do not re-land it.

A **Fable 5 model audit** (2026-07) reviewed the whole site; its High findings are all resolved
(#57–#60). Remaining Low/deferred items are in the backlog below.

**Status:** working tree clean; full gate green — `npm run lint && npm run typecheck && npm test &&
SKIP_IMAGE_OPTIMIZE=1 npm run build`.

**Open PRs awaiting the owner's review (from other sessions):** #52 (stale, superseded by #56),
#54 (stale — its docs are already on `main` in newer form), #55 (engineering report docs),
#56 (service-page AnswerBlock sprint). #52 and #54 can likely just be closed.

---

## 2. Architecture & conventions to follow (do not violate these)

- **Single source of truth.** Business data → `src/lib/constants.ts`. Env → `src/lib/env.ts`.
  Metadata/breadcrumbs → `src/lib/seo.ts` (`buildMetadata` emits canonical + OG + Twitter).
  Service+city copy → `src/lib/service-city-content.ts`. Reviews → `src/lib/reviews/` (consumers
  read only through `index.ts` helpers, never hardcode a quote). Leads/attribution →
  `src/lib/leads.ts` / `src/lib/attribution.ts`. Never duplicate these facts inline.
- **Content modeling.** Structured content = typed TS modules (`services-data.ts`, `paving-data.ts`,
  `src/lib/projects/`, `src/lib/reviews/`). Articles = markdown in `content/blog/` (31 posts) via
  `src/lib/blog.ts` — frontmatter: `title, date, excerpt, slug, featuredImage, category,
  type (RESOURCE_TYPES), answer (required — test-enforced), author`.
- **The Project System** (`src/lib/projects/`) is the public lens of `docs/PROJECT-OBJECT-SPEC.md`:
  no address/price (budget band + city slug; first names only). **Adding a project = drop a file in
  `data/` + `npm run generate:projects`** (staleness test enforces). Consumers use the helpers;
  integrity tests validate service/city/guide slugs + image paths.
- **URL identity is immutable.** Article URLs live at `/blog/[slug]`; browse hubs at `/resources`,
  `/projects`, `/reviews`, `/estimate`. Old URLs get permanent redirects in `next.config.ts` —
  never break a canonical.
- **Honest trust only.** No fabricated reviews/projects/ratings. `SOCIAL_PROOF.verified` gates
  AggregateRating; the `Review` contract's `verified` flag stays `false` for all first-party
  reviews so no Review/AggregateRating JSON-LD is emitted for them (only third-party `google`
  reviews mirrored from the live profile may be verified). Answer blocks must faithfully summarize
  the article they sit on. `public/llms.txt` states these commitments publicly — keep it truthful.
- **Reuse, don't reinvent.** `Container`, `SectionHeader`, `Button`, `GuideCard`, `components/seo/*`,
  `renderOgCard`, `PrecisionProcess`, `AssurancesBand`, `RelatedProjectsRail`, both `RelatedGuides`,
  `ReviewCard`/`ReviewsSection`. No new dependencies without cause.
- **Changes are additive and low-risk by default;** verification gate above must pass; branch off
  `main` as `claude/<topic>`; logical commits; PR when asked (user merges). After opening a PR, watch
  CI/reviews; stop when merged/closed. Before starting work, check what recently merged — parallel
  sessions ship to this repo (see #62's supersession).

Stack: Next.js 16 (App Router) · React 19 · TS strict · Tailwind v4 (`@theme` in `globals.css`) ·
Vitest · Vercel. Alias `@/* → src/*`.

---

## 3. Key files & docs

- **Strategy:** `docs/PHASE-1-REPORT.md` · `docs/V2-BLUEPRINT.md` · `docs/PROJECT-OBJECT-SPEC.md` ·
  `docs/OPERATING-MANUAL.md` (how everything fits) · `docs/MILLION-DOLLAR-WEBSITE-PLAN.md` (the
  MDW phased plan; Phases 0–4 shipped).
- **Project System:** `src/lib/projects/{types,index,registry.generated,projects.test}.ts`,
  `data/*` · `src/components/projects/*` · `src/app/projects/*` · `scripts/generate-projects-registry.mjs`.
- **Resource Center:** `src/lib/blog.ts` (categories + `RESOURCE_TYPES` + answers) ·
  `src/app/resources/*` · `src/app/blog/[slug]/*` · `src/components/blog/*`, `shared/GuideCard.tsx` ·
  `public/llms.txt`.
- **Review System:** `src/lib/reviews/{types,data,index,reviews.test}.ts` ·
  `src/components/reviews/*` · `src/app/reviews/page.tsx` · `src/lib/social-proof.ts`.
- **Leads & attribution:** `src/lib/leads.ts` · `src/lib/attribution.ts` ·
  `src/app/api/estimate/route.ts` · `docs/LEAD_LEDGER_SETUP.md`.

---

## 4. Prioritized backlog

1. **Real data from the owner (the binding constraint — everything below compounds on it):**
   job photos + details (+ consented reviews) → author more projects (proof rails auto-populate)
   and grow the review corpus (`docs/PROJECT-INTAKE.md` is the intake checklist);
   Google Business rating/count → flip `SOCIAL_PROOF.verified` honestly and admit `google`-source
   reviews into `src/lib/reviews/data.ts` with `verified: true`.
2. **Owner action — triage the open PRs:** review/merge or close #55 and #56; close stale #52
   and #54 (both superseded on `main`).
3. **Per-type resource routes** (`/resources/type/[type]`) + `/projects` pagination/filters once the
   corpora grow.
4. **Unify "our work":** migrate `GALLERY_IMAGES` consumers toward the project registry (audit
   finding #3) — best done as real projects replace loose photos. #65 cross-linked the two; full
   convergence still pending.
5. Minor: consolidate the duplicated final-CTA sections into a shared component; `TrackedLink`
   wrapper so `Footer` can be a server component; naming collision between the two `RelatedGuides`.

When picking up: read this file, then `docs/OPERATING-MANUAL.md`, then take the top unblocked item.
