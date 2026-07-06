# Real Elite — Session State & Handoff

> **Purpose:** The single entry point for a new working session. Read this first. It captures where
> the project stands, the conventions to follow, and the prioritized backlog — so work continues
> seamlessly without the prior conversation.
>
> **Last updated:** 2026-07-06 (current through PR #59 + the audit-closeout PR).

---

## 1. Where we are right now

`main` contains eight merged, shipped bodies of work (all CI-green when merged):

| PR | Title | What it delivered |
|----|-------|-------------------|
| **#50** | Phase 1: SEO & architecture hardening | Type-safe env layer (`src/lib/env.ts`), service-area single source, SEO factory + breadcrumb helper (`src/lib/seo.ts`), focus-ring tokens, `docs/PHASE-1-REPORT.md`. |
| **#51** | Website v2 product blueprint | `docs/V2-BLUEPRINT.md`. |
| **#53** | Project System foundation | The v2 keystone: `src/lib/projects/` (typed model + helpers + integrity tests), `ProjectPageTemplate`/`ProjectCard`, `/projects` routes + dynamic OG, one exemplary project. |
| **#54** | Session handoff + strategy docs | This file + `docs/PROJECT-OBJECT-SPEC.md` + `docs/OPERATING-MANUAL.md`. |
| **#57** | Project System integration | Nav/footer/homepage → `/projects`; service + city proof rails (`getProjectsByService`/`ByCity`); project→guides rail; per-page Twitter cards in `buildMetadata`; image-exists test; mobile drawer renders `UTILITY_LINKS`. |
| **#58** | Engineering hardening | Project auto-registration codegen (`scripts/generate-projects-registry.mjs` → `registry.generated.ts`, staleness-guard test, `generate:projects` in prebuild); service+city `CONTENT` map extracted to `src/lib/service-city-content.ts` (route 1,085 → 441 lines). |
| **#59** | Resource Center + Review contract | Guides consolidated at `/resources` (301s from `/guides*`; article URLs at `/blog/[slug]` untouched); resource-type taxonomy (`RESOURCE_TYPES`, all 27 posts classified); citable `answer:` blocks (mechanism + 3 exemplars); blog pages on `buildMetadata` (Twitter cards fixed); `getAllPosts` memoized; unified `Review` contract in `src/lib/reviews/types.ts` (types only). |
| **(this PR)** | Audit closeout | Mega-menu ARIA fix (no `role="menu"`, Escape closes); unused stock-CDN entries removed from CSP + `remotePatterns`; sticky-CTA padding single-sourced in `globals.css`; this doc refreshed. |

A **Fable 5 model audit** (2026-07) reviewed the whole site; its High findings are all resolved
(#57/#58/#59 + this PR). Remaining Low/deferred items are in the backlog below.

**Status:** working tree clean; full gate green — `npm run lint && npm run typecheck && npm test &&
SKIP_IMAGE_OPTIMIZE=1 npm run build` (263+ tests, 219 pages).

---

## 2. Architecture & conventions to follow (do not violate these)

- **Single source of truth.** Business data → `src/lib/constants.ts`. Env → `src/lib/env.ts`.
  Metadata/breadcrumbs → `src/lib/seo.ts` (`buildMetadata` emits canonical + OG + Twitter).
  Service+city copy → `src/lib/service-city-content.ts`. Never duplicate these facts inline.
- **Content modeling.** Structured content = typed TS modules (`services-data.ts`, `paving-data.ts`,
  `src/lib/projects/`). Articles = markdown in `content/blog/` via `src/lib/blog.ts` — frontmatter:
  `title, date, excerpt, slug, featuredImage, category, type (RESOURCE_TYPES), answer?, author`.
- **The Project System** (`src/lib/projects/`) is the public lens of `docs/PROJECT-OBJECT-SPEC.md`:
  no address/price (budget band + city slug; first names only). **Adding a project = drop a file in
  `data/` + `npm run generate:projects`** (staleness test enforces). Consumers use the helpers;
  integrity tests validate service/city/guide slugs + image paths.
- **URL identity is immutable.** Article URLs live at `/blog/[slug]`; browse hubs at `/resources`
  and `/projects`. Old URLs get permanent redirects in `next.config.ts` — never break a canonical.
- **Honest trust only.** No fabricated reviews/projects/ratings. `SOCIAL_PROOF.verified` gates
  AggregateRating; the `Review` contract's `verified` flag gates any Review JSON-LD (third-party
  only). Answer blocks must faithfully summarize the article they sit on.
- **Reuse, don't reinvent.** `Container`, `SectionHeader`, `Button`, `GuideCard`, `components/seo/*`,
  `renderOgCard`, `PrecisionProcess`, `AssurancesBand`, `RelatedProjectsRail`, both `RelatedGuides`.
  No new dependencies without cause.
- **Changes are additive and low-risk by default;** verification gate above must pass; branch off
  `main` as `claude/<topic>`; logical commits; PR when asked (user merges). After opening a PR, watch
  CI/reviews; stop when merged/closed.

Stack: Next.js 16 (App Router) · React 19 · TS strict · Tailwind v4 (`@theme` in `globals.css`) ·
Vitest · Vercel. Alias `@/* → src/*`.

---

## 3. Key files & docs

- **Strategy:** `docs/PHASE-1-REPORT.md` · `docs/V2-BLUEPRINT.md` · `docs/PROJECT-OBJECT-SPEC.md` ·
  `docs/OPERATING-MANUAL.md` (how everything fits).
- **Project System:** `src/lib/projects/{types,index,registry.generated,projects.test}.ts`,
  `data/*` · `src/components/projects/*` · `src/app/projects/*` · `scripts/generate-projects-registry.mjs`.
- **Resource Center:** `src/lib/blog.ts` (categories + `RESOURCE_TYPES` + answers) ·
  `src/app/resources/*` · `src/app/blog/[slug]/*` · `src/components/blog/*`, `shared/GuideCard.tsx`.
- **Reviews (contract only):** `src/lib/reviews/types.ts` · existing shapes: `TESTIMONIALS`,
  `SOCIAL_PROOF` (constants), `src/lib/social-proof.ts`, `ProjectReview`, `/reviews` page.

---

## 4. Prioritized backlog

1. **Real data from the owner (the binding constraint — everything below compounds on it):**
   job photos + details (+ consented reviews) → author more projects (proof rails auto-populate);
   Google Business rating/count → flip `SOCIAL_PROOF.verified` honestly.
2. **Review Center UI** — build `/reviews` v2 against `src/lib/reviews/types.ts` (filter by
   service/city/source, project-linked cards, Google deep-link). Needs real review data to ship
   meaningfully; the contract is settled.
3. **Answer blocks for the remaining 24 articles** — read each post, write a faithful 2–4 sentence
   `answer:`; the mechanism + exemplar pattern exist (see the 3 authored in #59).
4. **Per-type resource routes** (`/resources/type/[type]`) + `/projects` pagination/filters once the
   corpora grow.
5. **Unify "our work":** migrate `GALLERY_IMAGES` consumers toward the project registry (audit
   finding #3) — best done as real projects replace loose photos.
6. Minor: consolidate the duplicated final-CTA sections into a shared component; `TrackedLink`
   wrapper so `Footer` can be a server component; naming collision between the two `RelatedGuides`.

When picking up: read this file, then `docs/OPERATING-MANUAL.md`, then take the top unblocked item.
