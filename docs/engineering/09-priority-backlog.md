# 09 — Priority Backlog

A single ranked backlog synthesizing every finding in this report, the team's own Phase-2/3 list
(`PHASE-1-REPORT.md`), and the open PRs. Ranked by **(value × leverage) ÷ effort**, dependency-aware.

Legend — Effort: S(≤½d) M(1–3d) L(3–8d) XL(>8d) · Value: ★–★★★ · Type: 🏗 architecture · 🔍 SEO/GEO
· 🎨 design-system · 🧪 quality · 🧹 hygiene · 🚀 product.

---

## Tier 0 — Do first (cheap, high-value, unblocks the rest)

| ID | Item | Type | Effort | Value | Source |
|---|---|---|---|---|---|
| B1 | **Merge `AnswerBlock`** (GEO/AEO) onto service pages — rebase PR #52 off current `main` | 🔍🚀 | S | ★★★ | PR #52 |
| B2 | **Branch cleanup** — delete ~35 merged branches; re-cut #52/#54 from `main` | 🧹 | S | ★★ | [02](02-repo-audit.md) |
| B3 | **Error/loading boundaries** — branded `error.tsx` + `global-error.tsx` + `loading.tsx` | 🏗🧪 | S | ★★★ | D4 |
| B4 | **`npm audit` triage** — review 5 vulns, patch the high deliberately; add scheduled audit | 🧪 | S | ★★ | D9 |
| B5 | **Prettier + format pass** (own commit) + lint `scripts/**` | 🧹 | S | ★ | D10/D11 |
| B6 | **Centralize NAP** from `BUSINESS` into all schema components | 🔍 | S | ★★ | S3/D13 |
| B7 | **Env validation** — `zod` schema in `env.ts`, dev/build fail-fast | 🏗🧪 | S–M | ★★ | D6 |

## Tier 1 — Foundational debt (the scaling ceilings)

| ID | Item | Type | Effort | Value | Source |
|---|---|---|---|---|---|
| B8 | **Refactor the `CONTENT` monolith** → structured `service-city` data module, test-validated | 🏗 | L | ★★★ | **D1** |
| B9 | **Shared data primitives** (`FAQItem`/`ImageRef`/`InvestmentTier`/`AreaServed`) used by services/paving/projects | 🏗 | M | ★★★ | D2 |
| B10 | **Finish `buildMetadata` migration** to all dynamic + one-off routes + canonical test | 🔍🧪 | M | ★★ | D5/S1 |
| B11 | **`@id`-linked `Organization`+`WebSite` schema graph**; link Service/Article/Project to it | 🔍 | M | ★★★ | S2 |
| B12 | **`Section` + `Card` primitives** + spacing scale; adopt in 2–3 templates | 🎨 | M | ★★ | D7 |

## Tier 2 — The flywheel (product value compounding)

| ID | Item | Type | Effort | Value | Source |
|---|---|---|---|---|---|
| B13 | **Author 5–10 real `Project` records** + render `Project`/`ImageObject` schema + `summary` answer block | 🚀🔍 | M (per batch) | ★★★ | blueprint §5 |
| B14 | **One CTA system** — consolidate 7 CTA components; context-aware copy | 🎨🚀 | M | ★★ | [06](06-component-inventory.md)A |
| B15 | **`RelatedContent` + `Card`** — collapse 5 "related" rails into one cross-link system | 🎨🏗 | M | ★★ | [06](06-component-inventory.md)B/C |
| B16 | **`PageScaffold`** — unify the six page templates onto one slot-based scaffold | 🏗🎨 | L | ★★★ | [08](08-design-system-review.md)§3 |
| B17 | **Homepage proof from Project pool** — spotlight/before-after/testimonials derive from `Project` | 🚀 | M | ★★ | D3 |

## Tier 3 — Quality, resilience, reach

| ID | Item | Type | Effort | Value | Source |
|---|---|---|---|---|---|
| B18 | **E2E (Playwright)** for the lead funnel + `@axe-core/playwright` a11y in CI; coverage floor | 🧪 | L | ★★ | D8 |
| B19 | **[verify-live] CWV/image audit** — confirm AVIF/WebP delivery, hero `priority`/`sizes`, no CLS | 🔍🧪 | S | ★★ | S6 |
| B20 | **`Offer`/`AggregateOffer`** on investment ranges; **`LocalBusiness`** on paving locations | 🔍 | M | ★★ | S5 |
| B21 | **`Person` author E-E-A-T** on articles + visible bylines | 🔍 | S | ★ | S4 |
| B22 | **Shared form primitives** (`Field`, `useFormSubmit`, validators) across 4 forms | 🏗 | M | ★ | [06](06-component-inventory.md)E |
| B23 | **Relocate/retire stray root docs**; verify `/review-request` `noindex` | 🧹🔍 | S | ★ | D14/§07 |

## Tier 4 — v2 platform (multi-sprint epics — see [11](11-long-term-roadmap.md))

| ID | Item | Type | Effort | Source |
|---|---|---|---|---|
| B24 | **Project Gallery** with faceted, indexable URLs (`/projects?service=…&city=…`) | 🚀🔍 | XL | blueprint §8 |
| B25 | **Review Center** — objectize reviews; Google integration; project-linked | 🚀🔍 | XL | blueprint §6 |
| B26 | **Resource Center consolidation** — collapse `/blog`+`/guides` → `/resources` (+301s) | 🏗🔍 | L | blueprint §7 |
| B27 | **IA / nav formalization** — five-anchor nav + featured-project mega-menu | 🎨🚀 | M | blueprint §2 |
| B28 | **On-site scoped search** (faceted → later AI-answered) | 🚀 | XL | blueprint §2/§11 |
| B29 | **Mission Control / portal data contracts** — design shared Project/Review/Customer objects | 🏗 | L | blueprint §11 |

---

## Dependency graph (what unblocks what)

```
B9 (shared primitives) ──┬─► B8 (CONTENT refactor)
                         ├─► B16 (PageScaffold) ──► B26 (Resources) ──► B24/B28
                         └─► B13 (Projects) ──┬─► B17 (homepage proof)
                                              ├─► B24 (Gallery)
                                              └─► B25 (Review Center)
B12 (Section/Card) ──────► B14/B15 (CTA/Related) ──► B16
B11 (entity graph) ──────► B20 (Offer/LocalBusiness schema)
B7 (env validate), B3 (boundaries), B10 (metadata), B18 (E2E) ── independent, do anytime
```

**Reading:** **B9 (shared data primitives)** and **B12 (Section/Card)** are the two keystones that
unblock the most downstream value. Sprint #002 should land the Tier-0 quick wins, **B9**, and start
**B8** — see [10](10-sprint-002-proposal.md).
</content>
