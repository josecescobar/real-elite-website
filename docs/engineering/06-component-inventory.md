# 06 — Component Inventory

**~118 component files** across 11 groups. `C` = Client (`'use client'`), `S` = Server (default).
Server-default dominates (only **20** client components) — a healthy RSC posture.

---

## 1. `shared/` — cross-cutting primitives (15)

| Component | C/S | Role | Notes |
|---|---|---|---|
| `Button` | S | Variant×size CTA (primary/secondary/outline/ghost · sm/md/lg); renders `<button>`/`<Link>`/`<a>` by `href` | ✅ The one true button — **expand adoption**. |
| `Container` | S | Max-width wrapper | Pair with a missing `Section` primitive (D7). |
| `SectionHeader` | S | Eyebrow + heading + sub | Good; standardize across templates. |
| `GalleryGrid` | C | Image grid w/ lightbox | Tested. v1 proof surface; converges into Projects. |
| `GuideCard` | S | Resource/blog card | Overlaps blog/services `RelatedGuides`. |
| `InlineCTA` | S | Inline call-to-action | **CTA sprawl** (see §12). |
| `MultiStepEstimateForm` | C | Primary lead form | Tested (30 tests). |
| `TrustBadges` | C | Licensed/insured/veteran badges | |
| `StatCallout`, `PullQuote`, `OwnerCard`, `TrustBadges` | S/C | Editorial/trust atoms | |

## 2. `layout/` — chrome (5)

| Component | C/S | Role |
|---|---|---|
| `Header` | C | Top nav (tested) |
| `MegaMenu` | C | Services mega-menu (clipping bug fixed PR #22) |
| `Footer` | C | "Everything map" + NAP |
| `StickyMobileCTA` | C | Bottom Call·Estimate bar |

## 3. `home/` — homepage sections (15, + `index.ts` barrel)

`Hero` (C), `TrustBar`, `FeaturedServices`, `FeaturedGuides`, `ProjectSpotlight`, `BeforeAfter` (C),
`PrecisionProcess`, `Testimonials`, `ServiceAreaMap`, `HomeEstimate`, `HomeFAQ` (C), `CTASection` (C),
`AssurancesBand`. → A clean section-per-component homepage. **`Testimonials`/`ProjectSpotlight`/
`BeforeAfter`** are the v1 proof stand-ins that should later derive from the `Project` pool (D3).

## 4. `services/` — service-page system (11)

`ServicePageTemplate` (the spine, 235 lines), `CityPageTemplate`, `InvestmentRanges`,
`ScopeChecklist`, `ServiceFAQ` (C), `LocalAreasServed`, `RelatedGuides`, `RelatedProjects`,
`StickyEstimateRail`, `LuxuryConsultationRail`. → Strong, modular. `RelatedGuides`/`RelatedProjects`
here **duplicate** the blog ones (§12). **`AnswerBlock` belongs here** (PR #52, unmerged).

## 5. `paving/` — parallel paving system (2)

`PavingServiceTemplate`, `PavingLocationTemplate`. → Mirror the services templates against
`paving-data.ts`. Convergence candidate (D2).

## 6. `projects/` — the v2 keystone (2)

`ProjectPageTemplate` (326 lines — the cinematic case-study experience), `ProjectCard`. → Newest,
most strategically important group. Currently one seeded project. **This is where Sprint #002+ invests.**

## 7. `blog/` — long-form reading experience (9)

`GuideTemplate`, `TableOfContents` (C), `ReadingProgressBar` (C), `AuthorBox`, `RelatedGuides`,
`RelatedProjectsInline`, `InlineTestimonial`, `EstimateCTACard`, `StickyInArticleCTA` (C). → Polished
reading UX. **Heavy overlap** with `services/` and `shared/` equivalents (§12).

## 8. `consultation/` — luxury funnel (3)

`LuxuryConsultationForm` (C), `LuxuryGallery`, (+ `app/design-consultation/LuxuryConsultationFormClient`).
→ Phone-first high-ticket intake. The market-adaptive conversion path in practice.

## 9. `seo/` — structured data (4)

`JsonLd` (the `<script type=ld+json>` primitive), `ServiceSchema`, `FAQSchema`, `ArticleSchema`. →
Clean. **Missing:** an `OrganizationSchema`/`WebSiteSchema` and a `ProjectSchema`/`BreadcrumbSchema`
component (breadcrumbs currently via `lib/seo` helper). See [05](05-seo-review.md) S2/S5.

## 10. `roof-quote/` (1) + 11. `faq/` (1) + 12. `admin/` (1)

`RoofQuoteTool` (C, Google Solar), `FaqAccordion` (C), `ReviewRequestTool` (C, key-gated internal tool).

---

## 12. Duplication & consolidation map (the actionable part)

The component layer's main debt is **near-duplicate components solving the same problem in different
folders**. Consolidating these is the bulk of the design-system work.

### A. CTA sprawl → **one CTA system**
`CTASection` · `InlineCTA` · `EstimateCTACard` · `StickyInArticleCTA` · `StickyEstimateRail` ·
`StickyMobileCTA` · per-template "final CTA" blocks.
- **Problem:** 6–7 components with overlapping jobs → inconsistent copy/behavior, no single place to
  run CTA experiments.
- **Target:** a `CTASection` primitive (variants: inline / sticky-rail / sticky-mobile / final) +
  context-aware copy driven by service/city (the blueprint's "context-aware CTA"). All built on
  `shared/Button`.

### B. "Related X" rails → **one `RelatedContent` system**
`blog/RelatedGuides` · `services/RelatedGuides` · `blog/RelatedProjectsInline` ·
`services/RelatedProjects` · `shared/GuideCard` · `projects/ProjectCard`.
- **Target:** `RelatedContent<{type: 'guide'|'project'|'service'}>` with one `Card` primitive. The
  blueprint's "four proof engines cross-link relentlessly" needs *one* cross-link component, not five.

### C. Card markup → **one `Card` primitive**
Service cards, `GuideCard`, `ProjectCard`, gallery tiles re-implement elevation/radius/hover. → Extract
`Card` (uses `--shadow-card-elevated`, `--radius-*` tokens).

### D. Templates → **shared template skeleton**
`ServicePageTemplate` · `CityPageTemplate` · `PavingServiceTemplate` · `PavingLocationTemplate` ·
`ProjectPageTemplate` · `GuideTemplate` share a hero→sections→proof→FAQ→CTA rhythm. → A composable
`<PageScaffold>` (hero slot, section slots, proof slot, FAQ slot, CTA slot) would let all page types
share spacing, breadcrumb, schema, and CTA wiring. This is the structural payoff of D2/D7.

### E. Forms → **shared field/validation primitives**
`MultiStepEstimateForm` · `LuxuryConsultationForm` · `RoofQuoteTool` · `ReviewRequestTool` each
hand-roll fields + validation. → `Field`, `useFormSubmit`, shared client-side validators.

### F. Schema components → **add the missing roots**
Add `OrganizationSchema` + `WebSiteSchema` (with `@id`) and a `ProjectSchema`; make a `BreadcrumbSchema`
component wrapping the existing helper for consistency.

---

## 13. Reusable-extraction priority (for the design system)

1. **`Section`** (spacing scale) + **`Card`** (elevation) — highest reuse, lowest risk. *(Sprint #002.)*
2. **One CTA system** (A) — highest UX-consistency payoff.
3. **`RelatedContent` + one Card** (B/C) — enables the cross-link mesh.
4. **`PageScaffold`** (D) — the structural keystone; do after Section/Card exist.
5. **Form primitives** (E) — reduces the four-form drift.
6. **Schema roots** (F) — GEO entity graph.

> None of this requires new dependencies. It's extraction + adoption of primitives the design tokens
> already support.
</content>
