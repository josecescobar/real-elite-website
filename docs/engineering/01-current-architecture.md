# 01 — Current Architecture

**As-built description of the production system as of `main@6936f15` (2026-06-29).**

---

## 1. Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js (App Router, Turbopack dev) | `^16.2.9` | Bleeding-edge major. |
| UI runtime | React / React DOM | `^19.2.4` | RSC-first. |
| Language | TypeScript | `^5.9.3` | `strict: true`, `moduleResolution: bundler`. |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) | `^4.2.2` | CSS-first `@theme` tokens in `globals.css`. |
| Typography plugin | `@tailwindcss/typography` | `^0.5.19` | Powers `.prose-editorial`. |
| Content | Markdown + `gray-matter` + `next-mdx-remote` | — | Blog/guides authored as `.md` in `content/blog/`. |
| Icons | `lucide-react` | `^0.577.0` | Single line-icon set. |
| Fonts | `next/font/google` — Saira Condensed (display) + Inter (body) | — | Self-hosted, `display: swap`, CSS variables. |
| Email | Resend (REST) | — | Estimate lead delivery. |
| SMS / voice | Twilio (REST) | — | Speed-to-lead + missed-call text-back + IVR. |
| Rate limiting | Upstash Redis (durable) with in-memory fallback | — | `src/lib/rate-limit.ts`. |
| Analytics | GA4 + GTM + Microsoft Clarity | — | Env-gated, production-only GA. |
| Sitemap/robots | `next-sitemap` (postbuild) | `^4.2.3` | Generates `/public/sitemap*.xml` + `robots.txt`. |
| Image opt | `sharp` via `scripts/optimize-images.mjs` | `^0.34.5` | Runs on `prebuild`. |
| Testing | Vitest 4 + Testing Library + jsdom | `^4.1.7` | ~21 test files, ~238 tests. |
| Hosting | Vercel | — | `VERCEL_ENV` drives prod-only behaviors. |

**Material absences (by design or omission):** no Prettier, no `middleware.ts`, no `error.tsx` /
`loading.tsx` / `global-error.tsx`, no E2E framework, no CMS, no database (content is code/markdown),
no client-state library (none needed — RSC + local form state).

---

## 2. Architectural shape

The app is a **statically-generated, content-driven marketing site** with a thin serverless API for
lead capture. The defining architectural idea (v1) is the **single source of truth in
`src/lib/constants.ts`** — business identity (NAP), services, service areas, navigation, testimonials,
gallery, FAQ, and process all flow from typed data objects into data-driven page templates.

```
            ┌─────────────────────────────────────────────────────────┐
            │  src/lib  (the domain layer — the "brain")               │
            │  constants.ts  · services-data.ts · paving-data.ts       │
            │  projects/*    · blog.ts (md)      · social-proof.ts     │
            │  seo.ts · og.tsx · env.ts · analytics.ts                 │
            └───────────────┬───────────────────────┬─────────────────┘
                            │ (typed data)          │ (schema/metadata)
                            ▼                        ▼
   ┌────────────────────────────────┐   ┌─────────────────────────────┐
   │ src/components  (presentation) │   │ src/components/seo (JSON-LD) │
   │ shared · layout · home ·       │   │ JsonLd/Service/FAQ/Article   │
   │ services · paving · projects · │   └─────────────────────────────┘
   │ blog · consultation · faq      │
   └───────────────┬────────────────┘
                   │ (composed by)
                   ▼
   ┌────────────────────────────────────────────────────────────────┐
   │ src/app  (App Router — routing + metadata + RSC pages)          │
   │  static pages · dynamic [service]/[city] · [slug] · api/*       │
   │  + co-located opengraph-image.tsx per route family              │
   └────────────────────────────────────────────────────────────────┘
                   │ POST
                   ▼
   ┌────────────────────────────────────────────────────────────────┐
   │ src/app/api  (serverless — Node runtime)                        │
   │  estimate (Resend+Twilio) · roof-estimate (Google Solar) ·      │
   │  review-request (SMS, key-gated) · voice (Twilio IVR webhook)   │
   └────────────────────────────────────────────────────────────────┘
                   │ outbound
                   ▼ Resend · Twilio · Upstash · Google Solar
```

### Layer responsibilities

- **`src/lib` (domain):** Pure data + pure functions. Holds business truth, content catalogs, SEO
  builders, env access, integrations. This is where the system's intelligence lives and is the layer
  most worth protecting and evolving.
- **`src/components` (presentation):** Mostly **Server Components**. Only **20 of ~118** carry
  `'use client'` — interactive leaves (forms, accordions, mega-menu, sticky bars, reading progress).
  This RSC-default posture is correct and performance-friendly.
- **`src/app` (routing):** App Router pages compose lib data + components, export `metadata` /
  `generateMetadata`, and declare `generateStaticParams` for dynamic families. OG images are co-located
  per route family as `opengraph-image.tsx`.
- **`src/app/api` (edge of the system):** Lead capture and quoting. Hardened (rate limiting, honeypot,
  validation, escaping, graceful degradation). Node runtime (uses `Buffer`, crypto signature checks).

---

## 3. Rendering & data flow

- **Rendering model:** Predominantly **SSG**. Dynamic segments (`[service]/[city]`, `[slug]`,
  `[category]`, paving `[service]`/`[location]`, `service-areas/[slug]`, `projects/[slug]`) enumerate
  their universe via `generateStaticParams`, so the site builds to a large set of static HTML pages
  (216+ as of the 2026-06-24 session note, more since). This is ideal for SEO, Core Web Vitals, and
  cost.
- **Content sourcing:**
  - *Structured page content* (services, paving, service×city) lives in **typed TS objects** in
    `src/lib`.
  - *Long-form content* (27 blog/guide posts) lives as **markdown** in `content/blog/`, read at build
    time via `gray-matter` (`src/lib/blog.ts`).
  - *Projects* (the v2 keystone) live as **typed TS records** in `src/lib/projects/data/` (currently a
    single seeded project).
- **Forms → API → fan-out:** Client form components POST JSON to `/api/*`. The estimate route validates,
  emails via Resend, then **fire-and-forget** SMS via Twilio (never blocks the happy path), all
  env-gated so missing keys degrade gracefully (503 with a "please call us" message) rather than 500.

---

## 4. SEO / structured-data architecture

- **Root layout** (`src/app/layout.tsx`) emits a site-wide `GeneralContractor` JSON-LD with NAP,
  `areaServed` (17-area footprint), opening hours, `sameAs`, `knowsAbout`, and a conditional
  `aggregateRating` (only present once reviews are verified — honest gating).
- **Per-page metadata** is built two ways: newer/static routes use the `buildMetadata()` factory
  (`src/lib/seo.ts`); ~25 routes still hand-roll `alternates.canonical` + OpenGraph (partial migration
  — see [05](05-seo-review.md)).
- **Structured data components** (`src/components/seo/`): `ServiceSchema`, `FAQSchema`, `ArticleSchema`,
  and `buildBreadcrumbSchema()` (BreadcrumbList) are composed onto the relevant route families.
- **OG images** are generated per route family via co-located `opengraph-image.tsx` + the shared
  `src/lib/og.tsx` renderer.

---

## 5. Security & resilience posture

- **Headers/CSP:** `next.config.ts` sets a full CSP allowlist, HSTS (2yr preload), `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- **API hardening:** rate limiting (Upstash durable + in-memory fallback), honeypot, length/shape
  validation, HTML escaping of user input before email templating, Twilio webhook **signature
  verification**, admin-key gating on the review tool.
- **Secret handling:** all secrets funnel through the typed `env.ts`; `NEXT_PUBLIC_*` are the only
  client-exposed values; GA loads only in `VERCEL_ENV==='production'`.
- **Resilience gap:** **no React error boundaries or loading states** anywhere in `src/app`. A render
  error in any RSC subtree currently has no route-level fallback. (See [03](03-technical-debt.md).)

---

## 6. Build & CI

- **Scripts:** `dev` (Turbopack), `prebuild` → image optimize → `build` → `postbuild` → `next-sitemap`;
  plus `lint`, `typecheck`, `test`, `test:coverage`.
- **CI:** `.github/workflows/ci.yml` runs lint + typecheck + test + build on push/PR (the gate that has
  kept `main` green across 187 commits / 50+ merged PRs).

---

## 7. Architectural strengths to preserve

1. **`constants.ts` as single source of business truth** — the pattern the whole site rests on.
2. **RSC-default, client-only-at-the-leaves** — keeps the bundle small and pages fast.
3. **Data-driven templates** — one template renders N pages; content edits don't touch routing code.
4. **Honest gating of trust signals** — no fabricated ratings/stats; integrity is a brand asset.
5. **Typed env catalog + hardened API edge** — production-grade for a site of this size.
6. **A written, coherent product blueprint** — `V2-BLUEPRINT.md` gives engineering a North Star most
   projects lack.

## 8. The central architectural tension (the thing Sprint #002 exists to resolve)

The site has **three parallel models of "a thing we offer / did"** — `SERVICE_DATA`
(`services-data.ts`), `PAVING_*` (`paving-data.ts`, 761 lines), and the new `Project` object
(`projects/`) — plus **floating `TESTIMONIALS`** and a flat `GALLERY_IMAGES` list that duplicate proof
the `Project` object is designed to own. The architecture's next evolution, already prescribed by the
blueprint, is to **converge on the Project Object as the atomic proof unit** and a unified content
architecture, retiring the parallel/duplicated models. Everything in this report points at that.
</content>
