# Real Elite — Session State & Handoff

> **Purpose:** The single entry point for a new working session. Read this first. It captures where
> the project stands, the conventions to follow, and the prioritized backlog — so work continues
> seamlessly without the prior conversation.
>
> **Last updated:** 2026-06-29.

---

## 1. Where we are right now

`main` contains three merged, shipped bodies of work (all CI-green when merged):

| PR | Title | What it delivered |
|----|-------|-------------------|
| **#50** | Phase 1: SEO & architecture hardening | Type-safe env layer (`src/lib/env.ts`), service-area single source in `constants.ts`, SEO factory + breadcrumb helper (`src/lib/seo.ts`), focus-ring design tokens, `docs/PHASE-1-REPORT.md`. Pixel-/output-preserving. |
| **#51** | Website v2 product blueprint | `docs/V2-BLUEPRINT.md` — the product architecture for Website v2. Docs-only. |
| **#53** | Project System foundation | The keystone of v2: `src/lib/projects/` (typed model + helpers + tests), `src/components/projects/` (page template + card), `/projects` + `/projects/[slug]` routes + dynamic OG, one exemplary project. Additive; existing site untouched. |

**Status:** working tree clean; `main` is at the post-#53 merge. The site builds, and the full gate
(lint + typecheck + test + build) passes — **253 tests**.

---

## 2. Architecture & conventions to follow (do not violate these)

- **Single source of truth.** Business data → `src/lib/constants.ts`. Env access → `src/lib/env.ts`
  (typed live-reading accessors). Metadata + breadcrumbs → `src/lib/seo.ts` (`buildMetadata`,
  `buildBreadcrumbSchema`, `absoluteUrl`). Never duplicate these facts inline.
- **Content modeling pattern.** Structured, relationship-rich content = typed TS modules
  (`services-data.ts`, `paving-data.ts`, and the new `src/lib/projects/`). Long-form prose = markdown
  in `content/blog/` (loaded via `src/lib/blog.ts`). Match the established pattern; don't invent a new one.
- **The Project System** (`src/lib/projects/`) is the **public lens** of the Project Object
  (`docs/PROJECT-OBJECT-SPEC.md`): no address, no contract price — city slug + anonymized budget band,
  customer first name only. One file per project under `data/`, registered in `index.ts`; consumers
  use the helpers (`getAllProjects`, `getProjectBySlug`, `getProjectsByService`, `getProjectsByCity`,
  `getFeaturedProjects`, `getRelatedProjects`, `resolveCity`). Referential integrity is enforced by
  `src/lib/projects/projects.test.ts` (service/city slugs must exist in the canonical catalogs).
- **Reuse, don't reinvent.** Shared primitives: `Container`, `SectionHeader`, `Button`,
  `components/seo/*` (`JsonLd`, `FAQSchema`, `ServiceSchema`, `ArticleSchema`), `renderOgCard`
  (`src/lib/og.tsx`), `PrecisionProcess` + `AssurancesBand` (home). No new dependencies without cause.
- **Changes are additive and low-risk by default.** Don't break production, don't redesign, don't
  touch unrelated pages. When refactoring shared code, keep rendered output identical unless the task
  explicitly allows visual change.
- **Verification gate (matches CI `.github/workflows/ci.yml`):**
  `npm run lint && npm run typecheck && npm test && SKIP_IMAGE_OPTIMIZE=1 npm run build` — all must pass.
- **Workflow norms:** branch off `main` named `claude/<short-topic>`; commit in logical chunks; open a
  PR only when asked (the user merges). Commit/PR trailers per the harness. Docs-only changes still go
  through a PR. After a PR is opened, if subscribed, watch CI and review comments; CI *success* isn't
  webhooked, so confirm green via a check-in; stop watching once merged/closed.

Stack: Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 (`@theme` in
`globals.css`) · Vitest · Vercel. Path alias `@/* → src/*`.

---

## 3. Key files & docs

- **Docs / strategy:** `docs/PHASE-1-REPORT.md` · `docs/V2-BLUEPRINT.md` ·
  `docs/PROJECT-OBJECT-SPEC.md` (keystone spec) · `docs/OPERATING-MANUAL.md` (the constitution; how all
  docs fit together).
- **Project System:** `src/lib/projects/{types.ts, index.ts, data/*, projects.test.ts}` ·
  `src/components/projects/{ProjectPageTemplate.tsx, ProjectCard.tsx}` ·
  `src/app/projects/{page.tsx, [slug]/page.tsx, [slug]/opengraph-image.tsx}`.
- **Foundations:** `src/lib/{constants.ts, env.ts, seo.ts, og.tsx, blog.ts, services-data.ts, paving-data.ts}`.

---

## 4. Prioritized next-step backlog (each its own scoped PR)

1. **Wire projects into the live site** (highest leverage; the helpers already exist):
   - Add `/projects` to the header/nav (`constants.ts` NAV + `components/layout/Header.tsx`).
   - Have **service pages** and **city pages** render a real proof module from
     `getProjectsByService(slug)` / `getProjectsByCity(slug)` (currently they use `GALLERY_IMAGES`).
   - Optionally surface featured projects on the homepage Proof Wall via `getFeaturedProjects()`.
2. **Faceted project gallery** on `/projects` — filter by service / city / style / budget (each facet
   a stable URL), per `docs/V2-BLUEPRINT.md` §8 and `PROJECT-OBJECT-SPEC.md` §10.
3. **Author more projects** (deck, kitchen, bathroom — images already in `/public/images/projects/`)
   and add a real **before/after slider** component (current reveal is static paired images).
4. **Phase-2 items from `docs/PHASE-1-REPORT.md`:** section spacing tokens; refactor the 1,088-line
   service+city `CONTENT` monolith into a data module; env-value validation (zod); extend
   `buildMetadata` to the dynamic routes + one-off pages.
5. **Review Center** and **Resource Center** consolidation (v2 blueprint), once projects are wired in.

When picking up: read this file, then `docs/OPERATING-MANUAL.md` for how everything fits, then dive
into the chosen backlog item.
