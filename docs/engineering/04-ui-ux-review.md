# 04 — UI / UX Review

Scope: interaction design, conversion architecture, consistency, and accessibility — assessed from the
component/layout code and the design system, against the standard set by `docs/V2-BLUEPRINT.md` §3–§10.

> Caveat: this is a **code-grounded** UX review, not a moderated usability study or a live
> Lighthouse/axe run (offline). Items marked **[verify-live]** should be confirmed in the browser
> before acting.

---

## 1. Conversion architecture — strong, but fragmented

**What's good:** the site has a genuine, multi-path conversion system, not a single buried form:
- **Context-aware CTAs** — standard markets get the estimate rail (`StickyEstimateRail`,
  `MultiStepEstimateForm`); luxury markets swap to the phone-first `LuxuryConsultationRail` /
  `LuxuryConsultationForm`, driven by `LUXURY_CITY_SLUGS` (one source of truth). This is exactly the
  "market-adaptive, one architecture / two psychologies" model the blueprint prescribes — and it's
  already real.
- **Speed-to-lead** — instant email + (env-gated) SMS on submit; luxury leads auto-flagged.
- **Persistent CTA** — `StickyMobileCTA` (Call · Estimate) reserves layout space site-wide; the skip
  link and reserved padding are handled correctly in `layout.tsx`.
- **Multiple calibrated entry points** — `/instant-roof-quote`, `/design-consultation`, `/financing`,
  estimate form.

**The fragmentation problem (UX debt):** there are **too many overlapping CTA components** doing
similar jobs — `CTASection`, `InlineCTA`, `EstimateCTACard`, `StickyInArticleCTA`, `StickyEstimateRail`,
`StickyMobileCTA`, plus per-template "final CTA" blocks. This risks **inconsistent CTA copy, styling,
and behavior** across page types, and makes it hard to run a coherent CTA experiment. The blueprint's
"four touchpoints, never nagging" rule needs **one** CTA system, not seven. → consolidation map in
[06](06-component-inventory.md).

---

## 2. Information architecture & navigation

- **Current nav** is data-driven (`NAV_LINKS`, `SERVICES_MEGA_MENU` in `constants.ts`) with a
  `MegaMenu` (client) and `StickyMobileCTA`. A prior bug (mega-menu clipping off the left edge, PR #22)
  was fixed.
- **Blueprint gap:** v2 wants nav restraint — **five anchors (Services · Projects · Reviews ·
  Resources · Process)** with a Featured-Project card in the mega-menu. Today the taxonomy is more
  sprawling (services, service-areas, paving, guides, blog, gallery, plus many marketing pages) and
  `/blog` + `/guides` are **two systems for one job** (the blueprint flags this redirect-driven split
  as confusion to collapse into one **Resources** brand).
- **`/gallery` vs `/projects`:** both exist. `/gallery` is the flat-image v1 surface; `/projects` is
  the v2 entity surface (seeded). The blueprint says retire gallery into projects. Until then, two
  surfaces compete for the same "see their work" intent — a UX redundancy.

**Recommendation:** treat IA convergence (Projects, Reviews, Resources as the three proof engines) as a
v2 milestone, not a Sprint #002 scramble — but stop adding to the `/blog`↔`/guides` split now.

---

## 3. Consistency review

| Dimension | State | Notes |
|---|---|---|
| **Buttons** | ✅ Mostly centralized | `shared/Button.tsx` has a clean `variant`×`size` system (primary/secondary/outline/ghost). But ad-hoc CTA components and inline-styled links coexist with it — adoption isn't total. |
| **Headings / type** | ✅ Tokenized | Saira Condensed for all headings via `globals.css`; Inter body. Strong, consistent voice. |
| **Section spacing** | ⚠️ Inconsistent | Vertical rhythm varies by template (`py-16/24`, `py-12/16`, `py-20/28`) — no `Section` primitive. Reads as slightly less premium than the blueprint's "architectural whitespace" target. (D7) |
| **Cards** | ⚠️ Repeated markup | Service cards, guide cards, project cards, gallery tiles re-implement similar elevation/radius/hover patterns. Candidate for one `Card` primitive. |
| **Color** | ✅ Centralized tokens | navy/steel/gold/charcoal/brand-red ramps in `@theme`; brand-red reserved for action; WCAG-aware `brand-red-light` for dark surfaces. Spot-check for stray hex in email templates (the estimate email uses inline hex — acceptable, emails can't use tokens). |
| **Focus states** | ✅ Tokenized | `.focus-ring` / `.focus-ring-on-navy` utilities; adopted at 16 sites. A few one-off ring variants remain inline (intentional, per Phase-1). |
| **Forms** | ◑ Multiple form components | `MultiStepEstimateForm`, `LuxuryConsultationForm`, `RoofQuoteTool`, `ReviewRequestTool` — each bespoke. Shared field/validation primitives would reduce drift. |

---

## 4. Accessibility review (code-level)

**Strengths (real, not box-ticking):**
- Skip-to-content link with proper focus styling (`layout.tsx`).
- `prefers-reduced-motion` honored globally in `globals.css` (transitions/animations neutralized,
  smooth-scroll disabled).
- Focus-ring tokens give visible keyboard focus on interactive elements.
- WCAG-contrast awareness baked into tokens (`brand-red-light` exists specifically because
  `brand-red` on navy fails AA — documented in CSS).
- `next/image` used in 26 files (raw `<img>` only appears in test mocks) → alt-text discipline is
  structurally encouraged.
- Accessibility work has been an ongoing thread (PRs #1, #19, #40 — form a11y, ARIA, focus management).

**Gaps / to verify:**
- **[verify-live]** Run `axe` / Lighthouse a11y on representative pages (home, a service×city page, a
  blog post, the estimate form). No automated a11y test exists in CI.
- **Alt-text quality** — `next/image` enforces the *attribute*, not its *quality*. Audit that gallery
  and project images carry descriptive, location/service-rich alt (also an SEO win).
- **Form error semantics** — confirm inline validation errors are announced (`aria-live`,
  `aria-describedby`) across all four forms, not just visually shown.
- **Mega-menu keyboard nav** — verify full keyboard operability and `aria-expanded` on the client
  `MegaMenu`.
- **Color-only signaling** — ensure CTA/state isn't conveyed by color alone anywhere.
- **Heading hierarchy** — with data-driven templates, verify a single `<h1>` per page and no skipped
  levels (especially on the long service×city pages). `extractHeadings` in `blog.ts` implies disciplined
  blog hierarchy; confirm the same on templates.

**Recommendation:** add `@axe-core/playwright` to the E2E suite so a11y regressions are caught in CI —
this is a decade-asset, not a one-time audit.

---

## 5. Mobile UX

- Bottom sticky **Call · Estimate** bar is present and space is reserved (correct — matches blueprint's
  "single most important mobile decision").
- Mobile UX has had a dedicated polish pass (PR #42: forms, nav, FAQs, gallery).
- **[verify-live]** Tap-target sizes on mega-menu items and gallery tiles; thumb-reachability of the
  primary CTA on long pages; no layout shift from the sticky bar.

---

## 6. Content/UX integrity (a brand strength to protect)

The site deliberately **does not** fabricate trust (no fake ratings until verified; "Design
Inspiration" images explicitly labeled vs "Recent Work"; unverifiable "200+ projects" stat was removed
in PR #21). This honesty is a **conversion asset** in a low-trust category and a **differentiator vs
competitors** — the engineering team should treat "no unverifiable claims" as a hard guardrail
(see [12](12-engineering-recommendations.md)).

---

## 7. Prioritized UX actions

| Priority | Action | Tie-in |
|---|---|---|
| P0 | Consolidate the 7 CTA components into one CTA system with consistent copy/behavior | [06](06-component-inventory.md), D-debt |
| P0 | Add branded `error.tsx` (resilience = trust) | D4 |
| P1 | Introduce `Section` + `Card` primitives for spacing/elevation consistency | D7, [08](08-design-system-review.md) |
| P1 | **[verify-live]** axe/Lighthouse pass + add `@axe-core/playwright` to CI | D8 |
| P1 | Decide IA convergence path (Projects/Reviews/Resources); stop growing blog↔guides split | blueprint §1 |
| P2 | Shared form-field/validation primitives across the four forms | D2 |
| P2 | Audit alt-text quality on gallery/project imagery | SEO + a11y |
</content>
