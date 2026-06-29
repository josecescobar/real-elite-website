# 08 — Design System Review

The project has a **real, well-considered design-token foundation** (Tailwind v4 `@theme` in
`globals.css`) — ahead of most production sites. The gap is **primitives and enforcement**: tokens
exist, but spacing/cards/CTAs are still applied ad hoc. This review formalizes what exists and lays out
the path to the "Linear-grade discipline" the blueprint (§10) calls for.

---

## 1. What exists (the token layer) — `src/app/globals.css`

### Color (mature)
Full numeric ramps as CSS custom properties under `@theme`:
- **Navy** 50–950 — primary brand / authority spine.
- **Steel** 50–900 — cool editorial surfaces.
- **Gold** 50–950 — chip/star accents.
- **Charcoal** 50–950 — neutral text/UI.
- **Brand-red** + `-dark` + `-light` — **action only**, with a documented WCAG note (`brand-red` on
  navy fails AA at ~3.2:1, so `brand-red-light` exists at ≥4.5:1 for small text on dark). This is
  unusually disciplined — accessibility encoded into the token system.

### Typography
- `--font-heading` (Saira Condensed) / `--font-body` (Inter), resolved from `next/font` variables.
- Headings default to Saira with `letter-spacing: -0.01em` globally.
- `.prose-editorial` for long-form (17px / 1.75 / 68ch measure).

### Radii, shadows, motion
- Radii `--radius-sm…2xl` (pill defaults intentionally dropped — squared, precise).
- **Navy-tinted shadow scale** `--shadow-sm…xl` + `--shadow-card-elevated` (premium depth).
- Editorial gradient utilities (`.gradient-navy-overlay`, `.gradient-navy-hero`).
- `prefers-reduced-motion` globally honored.

### Focus
- `.focus-ring` / `.focus-ring-on-navy` utilities (`@apply` the exact chains they replace), adopted at
  16 sites (Phase-1).

**Verdict:** the **token primitives are 80% there.** Color, type, radius, shadow, focus, motion are all
tokenized and thoughtfully constrained. This is the hard part, and it's done well.

---

## 2. What's missing (the primitive & enforcement layer)

| Gap | Today | Target |
|---|---|---|
| **Spacing scale** | Section paddings vary ad hoc (`py-16/24`, `py-12/16`, `py-20/28`); no token, no primitive | A spacing scale + a `<Section>` primitive with a `space` prop (D7). The blueprint explicitly flags this. |
| **`Section` primitive** | Each template hand-writes section wrappers | One `<Section>` owns vertical rhythm, max-width, optional surface/background. |
| **`Card` primitive** | Service/guide/project/gallery cards re-implement elevation/radius/hover | One `<Card>` using `--shadow-card-elevated` + `--radius-lg`. |
| **CTA system** | 6–7 CTA components (see [06](06-component-inventory.md) §12A) | One CTA primitive, variant-driven, on `Button`. |
| **Grid system** | Ad hoc Tailwind grid classes | A documented 12-column grid convention (blueprint §10). |
| **Type scale tokens** | Sizes applied inline (`text-lg`, `text-4xl`…) | A semantic type scale (display/h1/h2/body/caption) so headings don't drift. |
| **Motion tokens** | Reduced-motion handled; durations/easings inline | Tokenize duration/easing; "motion clarifies, never decorates" (blueprint). |
| **Iconography rule** | `lucide-react` used | Document weight/size conventions (single set, sparing use). |
| **Component documentation** | None (no Storybook/usage docs) | A lightweight component gallery (later) so the system is *usable* by future contributors. |

---

## 3. The structural opportunity: `PageScaffold`

The six page templates (`Service`, `City`, `PavingService`, `PavingLocation`, `Project`, `Guide`) share
the same rhythm: **hero → answer/intro → scoped sections → proof → FAQ → CTA → related**. Today each
re-implements it. A composable **`<PageScaffold>`** (slots for hero, sections, proof, FAQ, CTA,
breadcrumb, schema) would:
- enforce spacing/breadcrumb/schema/CTA consistency **by construction**,
- make the blueprint's "same skeleton, market-adaptive proof" trivially real (swap the CTA slot for
  luxury markets — already half-done via `LuxuryConsultationRail`),
- collapse much of the D2 (parallel models) and D7 (spacing) debt at once.

This is the single highest-leverage design-system investment and the natural home for the converged
content model.

---

## 4. Design-system maturity scorecard

| Dimension | Maturity | Note |
|---|---|---|
| Color tokens | ●●●●● | Ramps + action-discipline + WCAG awareness. |
| Type tokens | ●●●●○ | Families/heading defaults strong; semantic scale missing. |
| Radius/shadow | ●●●●● | Tokenized, premium, intentional. |
| Focus/a11y tokens | ●●●●○ | Tokenized; a few one-offs remain inline. |
| Motion | ●●●○○ | Reduced-motion solid; durations/easings not tokenized. |
| Spacing | ●●○○○ | **Biggest gap.** No scale, no primitive. |
| Primitives (Section/Card/CTA) | ●●○○○ | `Button`/`Container` exist; Section/Card/CTA missing. |
| Enforcement/docs | ●○○○○ | No Storybook, no usage docs, no lint rules guarding tokens. |

**Overall: a strong token foundation (●●●●) with an immature primitive/enforcement layer (●●).** The
work is *formalization*, not *creation*.

---

## 5. Roadmap to a formal design system

**Phase A — Primitives (Sprint #002 candidate):** spacing scale + `<Section>` + `<Card>`; adopt in 2–3
templates as proof. *Non-pixel-preserving by design — this is the deliberate consistency pass Phase-1
deferred.*

**Phase B — CTA + RelatedContent systems:** collapse the 7 CTA components and 5 "related" rails (D2/§12).

**Phase C — `PageScaffold`:** unify the six templates onto one slot-based scaffold; fold paving into
services where shapes converge.

**Phase D — Semantic type scale + motion tokens:** finish the token layer.

**Phase E — Enforcement & docs:** Storybook (or a `/styleguide` route), token-lint guardrails, and a
written "design system rules" doc. This is what makes the system survive contributor growth — the
decade-asset.

> Guiding rule (from the blueprint, worth adopting verbatim as an engineering principle): **every design
> decision either adds trust or removes friction; if it does neither, it's deleted.**
</content>
