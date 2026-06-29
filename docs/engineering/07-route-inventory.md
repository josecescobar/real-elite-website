# 07 — Route Inventory

App Router surface as of `main@6936f15`. All pages are statically generated (SSG); dynamic families
enumerate via `generateStaticParams`. **39** routes export `metadata`/`generateMetadata`; **11** export
`generateStaticParams`.

---

## 1. Static / marketing pages

| Route | File | Metadata | OG | Notes |
|---|---|---|---|---|
| `/` | `app/page.tsx` | bespoke (root) | `opengraph-image.tsx` | Homepage (section components). |
| `/about` | `about/page.tsx` | ✓ | — | Person schema (PR #17). |
| `/services` | `services/page.tsx` | ✓ | — | Services hub. Breadcrumb added Phase-1. |
| `/service-areas` | `service-areas/page.tsx` | ✓ | — | Locations hub. |
| `/gallery` | `gallery/page.tsx` | ✓ | — | v1 flat gallery (retire → /projects). |
| `/projects` | `projects/page.tsx` | ✓ | — | **v2 project gallery (seeded).** |
| `/reviews` | `reviews/page.tsx` | ✓ | — | AggregateRating schema (PR #16). |
| `/process` | `process/page.tsx` | ✓ | — | Trust spine. |
| `/contact` | `contact/page.tsx` | ✓ | — | `#estimate` anchor (standardized PR #17). |
| `/faq` | `faq/page.tsx` | ✓ | — | FAQ + schema. |
| `/blog` | `blog/page.tsx` | ✓ | — | Blog hub. **Overlaps /guides.** |
| `/guides` | `guides/page.tsx` | ✓ | — | Guides hub. **Collapse into Resources (blueprint).** |
| `/paving` | `paving/page.tsx` | ✓ + breadcrumb | — | Paving pillar hub. |
| `/financing` | `financing/page.tsx` | ✓ | — | PR #43. |
| `/design-consultation` | `design-consultation/page.tsx` | ✓ | — | Luxury phone-first intake (client form). |
| `/instant-roof-quote` | `instant-roof-quote/page.tsx` | ✓ | — | Google Solar tool. |
| `/capability-statement` | `capability-statement/page.tsx` | ✓ | — | Federal/SDVOSB. |
| `/veterans` | `veterans/page.tsx` | ✓ | — | SDVOSB positioning. |
| `/storm-damage` | `storm-damage/page.tsx` | ✓ | — | Storm landing. |
| `/full-property-perimeter` | `full-property-perimeter/page.tsx` | ✓ | — | A+ Paving bundle. |
| `/review-request` | `review-request/page.tsx` | ✓ (noindex?) | — | **Internal tool** — sitemap-excluded; **[verify noindex]**. |
| `/not-found` | `not-found.tsx` | — | — | 404. (No `error.tsx`/`loading.tsx` — D4.) |

## 2. Static service pages (11)

`/services/{additions, basements, bathrooms, decks, exterior-repairs, general-repairs, handyman,
kitchens, remodeling, roofing, siding}` — each `services/<svc>/page.tsx`, all migrated to
`buildMetadata()` in Phase-1, rendered via `ServicePageTemplate` from `SERVICE_DATA`. **`AnswerBlock`
target** (PR #52). Co-located OG via `services/[service]/opengraph-image.tsx`.

> **Routing note (intentional overlap):** static `/services/roofing` etc. coexist with dynamic
> `/services/[service]/[city]`. The static files are the **service pillars**; the dynamic route is the
> **service×city intent layer**. There is no `/services/[service]/page.tsx` collision because pillars
> are explicit files. Confirm no slug in the dynamic layer shadows a static pillar.

## 3. Dynamic route families

| Pattern | File | `generateStaticParams` source | Metadata | OG | Breadcrumb |
|---|---|---|---|---|---|
| `/services/[service]/[city]` | `services/[service]/[city]/page.tsx` (**1,085 lines — `CONTENT` monolith, D1**) | service×city `CONTENT` map | `generateMetadata` | ✓ | ✓ |
| `/service-areas/[slug]` | `service-areas/[slug]/page.tsx` | `CITY_DATA` / service areas | `generateMetadata` | `opengraph-image.tsx` | (via city template) |
| `/blog/[slug]` | `blog/[slug]/page.tsx` | `getAllPosts()` (27 md files) | `generateMetadata` | `opengraph-image.tsx` | — [verify] |
| `/guides/[category]` | `guides/[category]/page.tsx` | `GUIDE_CATEGORIES` | `generateMetadata` | `opengraph-image.tsx` | — [verify] |
| `/paving/[service]` | `paving/[service]/page.tsx` | `paving-data` services (6) | `generateMetadata` | `opengraph-image.tsx` | ✓ |
| `/paving/locations/[location]` | `paving/locations/[location]/page.tsx` | `paving-data` locations (10) | `generateMetadata` | `opengraph-image.tsx` | ✓ |
| `/projects/[slug]` | `projects/[slug]/page.tsx` | `projects/index` (published) | `generateMetadata` | `opengraph-image.tsx` | ✓ |

**Approximate static-page volume** (orders of magnitude; verify against build output):
- 11 service pillars + ~12 marketing pages + 7 hubs ≈ **30 fixed**
- service×city: ~12 services × subset of cities (luxury + EP) — the session note cites **36 luxury
  service×city + 9 city pages**; total combos are gated by the `CONTENT` map's hand-written entries.
- paving: 6 services + 10 locations + hub = **17**
- service-areas: one per `CITY_DATA`/area entry (~17)
- blog: **27**; guides: per category
- projects: **1** (seeded; the growth surface)
→ **≈216+ pages** (matches the 2026-06-24 session note "216 static pages"; higher now).

## 4. API routes (`app/api/*`, Node runtime)

| Route | Method | Purpose | Hardening |
|---|---|---|---|
| `/api/estimate` | POST | Lead → Resend email + Twilio SMS (speed-to-lead) | Rate limit (5/10min/IP), honeypot, field validation, HTML escape, graceful 503, fire-and-forget SMS. **Tested.** |
| `/api/roof-estimate` | POST | Google Solar instant roof quote math | Validation, error handling. **Tested.** |
| `/api/review-request` | POST | Internal: send Google-review SMS | **Admin-key gated**, validation, E.164 normalize. **Tested.** |
| `/api/voice` | POST | Twilio IVR webhook (missed-call routing) | **Twilio signature verification**, env-gated. **Tested.** |

## 5. Metadata/asset routes

`app/icon.tsx`, `app/apple-icon.png`, `app/favicon.ico`, `app/manifest.ts`, `app/opengraph-image.tsx`,
plus per-family `opengraph-image.tsx` (services, service×city, blog, guides, paving×2, projects,
service-areas). All excluded from sitemap.

## 6. Redirects (`next.config.ts`)

`*.html` → clean paths (`/index.html`→`/`, `/about.html`→`/about`, etc.); `/services/paving` →
`/paving` (consolidation). All `permanent: true` (301). Legacy-path SEO preserved.

---

## 7. Route-level observations

1. **`/blog` + `/guides` duplication** — two systems, one job; blueprint says collapse into
   `/resources`. Stop deepening the split now; plan the consolidation (with redirects) for v2.
2. **`/gallery` vs `/projects`** — competing "see our work" surfaces; retire gallery into projects.
3. **`CONTENT` monolith** powers the most strategically important dynamic family — refactor (D1) is a
   route-health issue, not just code tidiness.
4. **No `error.tsx`/`loading.tsx`** at any level (D4) — every dynamic family would benefit from a
   branded error fallback.
5. **OG coverage is excellent** — every major family has dynamic OG. Maintain this as new families ship.
6. **[verify]** breadcrumb + canonical presence on `blog`/`guides` routes (S1/S2 follow-through).
</content>
