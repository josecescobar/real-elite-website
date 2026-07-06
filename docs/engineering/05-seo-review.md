# 05 — SEO / GEO Review

The site is, by contractor standards, **exceptionally well-optimized**. This review credits what's
strong, then concentrates on the gaps that matter at the scale the blueprint targets — and on the
shift the team has correctly identified: **from classic SEO toward GEO/AEO (AI-citation).**

---

## 1. What's already strong (preserve)

| Area | Implementation | Evidence |
|---|---|---|
| **Site-wide structured data** | `GeneralContractor` JSON-LD with NAP, `areaServed` (17 areas), opening hours, `sameAs`, `knowsAbout`, conditional `aggregateRating` | `src/app/layout.tsx:161` |
| **Honest aggregateRating gating** | Rating markup only ships once reviews are verified | `social-proof.ts` → `aggregateRatingSchema()` |
| **Per-service schema** | `Service` entity with provider, areaServed Places | `components/seo/ServiceSchema.tsx` |
| **Article schema** | `Article` with publisher/logo, datePublished/Modified, mainEntityOfPage | `components/seo/ArticleSchema.tsx` |
| **FAQ schema** | `FAQPage` on service/FAQ surfaces | `components/seo/FAQSchema.tsx` |
| **Breadcrumbs** | `BreadcrumbList` via `buildBreadcrumbSchema()` on paving, service×city, city, project, service-hub | `lib/seo.ts:65` |
| **Metadata factory** | `buildMetadata()` → canonical + OG, single source | `lib/seo.ts:35` |
| **Dynamic OG images** | Per route family `opengraph-image.tsx` + `lib/og.tsx` | 8+ OG routes |
| **metadataBase + robots** | Absolute social URLs; `max-image-preview:large` | `layout.tsx:37,91` |
| **Sitemap/robots** | `next-sitemap` postbuild, OG/icon/manifest + internal tool excluded | `next-sitemap.config.js` |
| **Programmatic local SEO** | Service×city, paving service/location, service-areas — large indexable surface, gated behind hand-written content (anti-thin-content discipline) | `generateStaticParams` across 7 families |
| **Internal linking** | Related guides/projects rails, blog→landing cross-links (PR #47) | `services/RelatedGuides`, `blog/RelatedProjectsInline`, etc. |

This is a top-1% contractor SEO foundation. The gaps below are about **consistency at scale** and
**winning the AI-citation war**, not fixing something broken.

---

## 2. Classic-SEO gaps

### S1. Canonical/metadata inconsistency (P1 — also D5)
`buildMetadata()` is adopted in **13 of 39** metadata routes; **25 still hand-roll** canonical/OG.
At hundreds of pages this is a drift/regression risk. **Fix:** extend the factory to every route +
a test asserting every page emits exactly one canonical. *(Already on the Phase-2 list.)*

### S2. Schema entity graph is flat (no `@id` linking)
Each JSON-LD block stands alone. There is **no `Organization`/`WebSite` root entity** with `@id`, and
`Service`/`Article`/`Breadcrumb` blocks don't reference the business via `@id`. Google and AI engines
reward a **connected entity graph** (Org → Service → Project → Review, all `@id`-linked).
- **Fix:** introduce a single `Organization`+`WebSite` graph (with `@id`, `sameAs`, `logo`,
  `potentialAction: SearchAction`) and link every other entity's `provider`/`publisher`/`isPartOf` to
  that `@id`. High-leverage, low-risk additive change.

### S3. NAP literals duplicated in schema (P2 — D13)
`Martinsburg/WV/25401` is hardcoded in `layout.tsx`, `ServiceSchema`, `ArticleSchema` instead of read
from `BUSINESS`. The blueprint stresses **byte-identical NAP across schema + footer** for GEO. Source
all NAP from `constants.ts` to guarantee parity.

### S4. Author E-E-A-T is thin
`ArticleSchema.author` is the **Organization**, not a person. Google's helpful-content/E-E-A-T favors a
real, credentialed author. The repo has an `AuthorBox` and `OwnerCard` — wire a `Person` author
(veteran-owned founder, credentials) into article schema + visible bylines.

### S5. Missing high-value schema types
Not yet present (all additive opportunities):
- **`Project`/`CreativeWork` + `ImageObject`** on project pages (the blueprint calls this "SEO/GEO
  gold" — dense, real, structured detail per job).
- **`LocalBusiness`** subtype refinement on **paving location pages** (named in Phase-3).
- **`Offer`/`AggregateOffer`** on investment ranges (the "how much does X cost" answer surface).
- **`VideoObject`** once video reviews exist.
- **`WebSite` + `SearchAction`** (sitelinks search box; also primes on-site AI search).

### S6. [verify-live] Core Web Vitals
Architecture is CWV-friendly (SSG, `next/image`, `display:swap`, RSC-default, reduced-motion). But:
- **95 JPGs / 1 WebP** committed — confirm `optimize-images.mjs` + `next/image` actually serve
  AVIF/WebP at responsive sizes (D11/perf). A hero JPG shipped un-optimized is the classic LCP killer.
- Verify hero images set `priority`, correct `sizes`, and explicit dimensions (no CLS).
- Verify third-party scripts (GTM/GA/Clarity) are `afterInteractive` (they are) and not blocking.

---

## 3. GEO / AEO (the strategic frontier)

The blueprint is explicit: the war is moving **from rankings to AI citations** (Google AI Overviews,
ChatGPT, Perplexity). The site should be **the source those engines quote**. Status:

| GEO lever | Status | Action |
|---|---|---|
| **Citable "Answer Block"** on service pages | **Built but unmerged** — `AnswerBlock` (PR #52, `claude/v2-service-answer-block`) | **Rebase & merge in Sprint #002.** The single highest-ROI GEO move available right now. |
| Answer block on **resources/guides** | Partial (cost/permit guides exist as content) | Standardize a lift-able 2–3 sentence summary atop every guide. |
| **Project `summary`** (AI-citable per-job answer) | Field exists in `Project` type (`summary`) | Render it as a structured answer block on project pages once projects ship. |
| **Cost-answer content** ("how much does X cost in [region]") | Strong (cost guides + investment tiers) | Pair with `Offer`/`AggregateOffer` schema (S5) so the price answer is machine-readable. |
| **Hyper-local permit content** (per jurisdiction) | Strong moat already (Berkeley/Loudoun/Frederick guides) | Expand; almost no competitor has this — it's a durable AI-citation asset. |
| **Dense entity graph** for AI parsing | Weak (S2 flat graph) | The `@id`-linked Org→Service→Project→Review mesh **is** the GEO substrate — do S2. |
| **Stable entity URLs** | ✅ Good (clean, durable paths) | Preserve URL stability; AI needs durable citations. |

**GEO thesis for engineering:** every page should contain a **self-contained, quotable answer unit**
backed by **machine-readable structured data** that references a **connected entity graph**. The
`AnswerBlock` (merge it), the `Project.summary` field (render it), and the `@id` graph (build it) are
the three concrete moves.

---

## 4. Sitemap / robots / indexation

- ✅ `next-sitemap` generates sitemap + robots on postbuild; OG/icon/manifest excluded; internal
  `/review-request` tool excluded from sitemap.
- **[verify]** Confirm `review-request` (and any admin/tool surface) is **also `noindex`** at the page
  level (sitemap exclusion ≠ noindex). The config comment claims it's "noindexed, key-protected" —
  verify the meta robots tag is actually set on that route.
- **[verify]** Confirm there is **no** `app/sitemap.ts`/`app/robots.ts` competing with `next-sitemap`
  (double generation). Tree shows none — good; keep it that way.
- With 216+ pages and growing, watch **crawl budget / thin-content** risk on programmatic families. The
  v1 discipline (gate combos behind hand-written content) is correct — hold that line (blueprint §12).

---

## 5. Prioritized SEO/GEO backlog

| Priority | Item | Effort | Why |
|---|---|---|---|
| **P0** | Merge `AnswerBlock` (GEO/AEO) to service pages | S | Highest-ROI AI-citation move; already built. |
| **P0** | `@id`-linked `Organization`+`WebSite` entity graph | M | Unlocks AI entity understanding site-wide. |
| **P1** | Finish `buildMetadata` migration + canonical test (S1) | M | Prevents drift at scale. |
| **P1** | Centralize NAP from `BUSINESS` in all schema (S3) | S | GEO NAP parity. |
| **P1** | `Person` author E-E-A-T on articles (S4) | S | Helpful-content signal. |
| **P1** | **[verify-live]** image-format/LCP audit (S6) | S | CWV = ranking + UX. |
| **P2** | `Project`/`Offer`/`LocalBusiness`/`Video` schema (S5) | M | Gated on projects/video content. |
| **P2** | Standardize guide answer blocks + expand permit corpus | M | Deepens GEO moat. |
</content>
