# The Real Elite Operating Manual — Master Architecture

> **Status:** Living constitutional document. The **structure** below is approved; individual chapters
> fill in over time (several already exist as standalone docs — see the mapping at the end). This is
> the operating philosophy of Real Elite, intended to guide the company for the next 20 years.
>
> **Companions / chapters already drafted:** `docs/V2-BLUEPRINT.md` (→ Ch. 21 Website),
> `docs/PROJECT-OBJECT-SPEC.md` (→ Ch. 19 The Project Object), `docs/PHASE-1-REPORT.md` (→ Ch. 31
> history + Ch. 13/15 inputs).

---

## 0. The organizing principle — stability gradient

A constitution must be organized by **rate of change**, not by topic. Some things (Vision,
Principles, Vocabulary) should change almost never; others (a system, the roadmap) change constantly.
The manual is concentric rings, most-stable at the core:

```
PART V  — THE COMPANY (how we run; living)
 PART IV — THE SYSTEMS (products; evolving)
  PART III — THE KEYSTONE (the Project Object)
   PART II — STANDARDS (rulebooks)
    PART I — PHILOSOPHY (the why)
     PART 0 — FOUNDATIONS (the constitution)
```

**The law of the rings:** an outer chapter may cite/depend on an inner chapter, **never the reverse.**
The Website (IV) obeys the Design System (II) obeys Operating Principles (0). Citations point inward
only. This keeps both the document and the company from tangling.

---

## 1. Table of Contents

### PART 0 — FOUNDATIONS *(changes almost never)*
- 00 Vision & Mission
- 01 Operating Principles *(the laws)*
- 02 Canonical Vocabulary *(one word, one meaning)*
- 03 Governance & Amendment *(how this manual is owned, used, changed)*

### PART I — PHILOSOPHY *(decade-stable)*
- 04 Company Philosophy & Values
- 05 Product Philosophy
- 06 Customer Experience Doctrine
- 07 Data Philosophy
- 08 AI Philosophy

### PART II — STANDARDS *(living rulebooks)*
- 09 Brand Standards
- 10 Design System
- 11 Component System
- 12 Content & Editorial Standards
- 13 SEO / GEO / AEO Standards
- 14 Marketing & Growth Standards
- 15 Engineering Standards
- 16 AI Standards
- 17 Security, Privacy & Trust
- 18 Measurement & Analytics

### PART III — THE KEYSTONE
- 19 The Project Object  *(→ `docs/PROJECT-OBJECT-SPEC.md`)*
- 20 Platform & Ecosystem Architecture

### PART IV — THE SYSTEMS *(continuously evolving)*
- 21 Website  *(→ `docs/V2-BLUEPRINT.md`)*
- 22 Mission Control
- 23 Customer Portal
- 24 AI Estimator
- 25 Mobile & Field Apps *(+ reserved: Contractor Portal, Home Dashboard…)*

### PART V — THE COMPANY *(most living)*
- 26 Sales
- 27 Operations & Field Execution
- 28 People & Hiring
- 29 Leadership & Culture
- 30 Finance & Unit Economics
- 31 Roadmap & Evolution

Every future document fits in exactly one chapter. If it doesn't, the manual is missing a chapter —
and adding one is a governed act (Ch. 03).

---

## 2. What was changed from a flat topic list (and why)
1. **Added the missing constitutional chapters:** Operating Principles, Canonical Vocabulary,
   Governance & Amendment, and Platform & Ecosystem Architecture — without these a "constitution" has
   no laws, no shared definitions, no amendment process, and no map of how systems connect.
2. **Promoted Customer Experience and Data to Philosophy** — "CX overrides engineering convenience"
   and "capture once" are constitutional beliefs, not features.
3. **Separated discipline-standards from product-systems** — e.g., AI Standards (rulebook) vs. AI
   Estimator (product); Design System vs. Website.
4. **Elevated the Project Object to its own Part (the keystone)** between Standards and Systems —
   every system derives from it.

---

## 3. Per-chapter intent (why · what belongs · what never belongs · relationships)

*Abbreviated; each becomes its own document under its chapter.*

- **00 Vision & Mission** — the one sentence everything serves ("Military Precision. Civilian
  Excellence." + the 20-year ambition). Never: tactics, anything dated.
- **01 Operating Principles** — the reusable decision-laws (see §4). Cited by every outer chapter.
- **02 Canonical Vocabulary** — the authoritative definition of every core entity/state/term
  (Lead, Project, Property, Customer, Lens, Completion…). Underpins Ch. 19 and all systems.
- **03 Governance & Amendment** — chapter ownership, the RFC/ADR process, the ring-citation law,
  conflict resolution, review cadence. The meta-chapter.
- **04 Company Philosophy & Values** — veteran-owned, family-operated, integrity-first; informs Brand,
  People, Leadership.
- **05 Product Philosophy** — how we decide what to build and what makes a Real Elite product (restraint,
  trust-transfer, proof-over-claims). Governs Part IV.
- **06 Customer Experience Doctrine** — the north star: the homeowner's experience overrides internal
  convenience; trust-transfer; the "no silence" rule; the dual-market psychology (WV trust vs NoVA taste).
- **07 Data Philosophy** — one source of truth, capture-once/reuse-everywhere, lenses-not-copies,
  history-is-the-asset, provenance. Philosophical parent of Ch. 19/20.
- **08 AI Philosophy** — AI augments the human relationship, never hides it; data is the moat; honesty
  over hallucination. Parent of Ch. 16/24.
- **09 Brand Standards** — identity, dual-market doctrine, voice/tone. Parent of Design System + Content.
- **10 Design System** — tokens: type, color, spacing, grid, motion, a11y floor. *(Phase-1 focus-ring +
  deferred spacing tokens live here.)*
- **11 Component System** — reusable primitives (Button, Card, Section, Hero…). Implements Ch. 10.
- **12 Content & Editorial Standards** — voice, structure, the citable "answer block" doctrine.
- **13 SEO / GEO / AEO Standards** — metadata, schema, internal-linking, entity/provenance, canonical
  law. *(Phase-1 metadata factory + breadcrumb/schema live here.)*
- **14 Marketing & Growth Standards** — channels, the "one project → many assets" doctrine, attribution.
- **15 Engineering Standards** — simplicity, single-source-of-truth, testing/CI, dependency discipline.
  *(Phase-1 env layer + SoT refactors; the Project System's data/helper conventions live here.)*
- **16 AI Standards** — model selection, prompting, eval gates, safety, the corpus.
- **17 Security, Privacy & Trust** — the lens/permission enforcement, consent, data handling, secrets.
- **18 Measurement & Analytics** — the metric taxonomy, north-star + guardrail metrics, BI definitions.
- **19 The Project Object** — the spine (full spec in `docs/PROJECT-OBJECT-SPEC.md`).
- **20 Platform & Ecosystem Architecture** — "one contract, many consumers"; system boundaries; the
  read/write topology binding Website/Mission Control/Portal/AI around Ch. 19.
- **21–25 The Systems** — each renders a lens of the Project Object: Website (public), Mission Control
  (operational/system-of-record), Portal (customer), AI Estimator (intelligence), Mobile/Field (capture).
- **26–31 The Company** — Sales, Operations & Field Execution (incl. the field-capture commitment),
  People & Hiring, Leadership & Culture, Finance & Unit Economics, Roadmap & Evolution.

---

## 4. Operating Principles (Chapter 01)

The laws — phrased to still hold in 2036, each testable against a real decision:

1. **One source of truth.** Every fact has exactly one home; everything else derives from it.
2. **Capture once, reuse everywhere.** Data is entered at its origin, once; every other use is a projection.
3. **Lenses, not copies.** Systems read the canonical object through permissioned views.
4. **The Project Object is the spine.** If a feature can't trace back to it, question why it exists.
5. **Mission Control is the OS; the Website is the public membrane; the Portal is the trust window.**
6. **Customer experience overrides engineering convenience — always.**
7. **Proof over claims.** Show, with provenance; every public claim traces to an operational fact.
8. **History is the asset.** Append, don't overwrite.
9. **Honesty scales; tricks don't.** Price first, surface delays early, gate unverified claims.
10. **AI augments the human relationship; it never replaces or hides it.**
11. **Simplicity is the default; complexity must earn its place.**
12. **Design for the 10,000th project, decide for the next one.**
13. **Citations point inward.** Outer rings obey inner rings.
14. **Words mean one thing.** The Vocabulary chapter is binding.

---

## 5. Dependency map

```
00 VISION → 01 PRINCIPLES → (02 VOCABULARY, 03 GOVERNANCE governs all)
   ↓
PHILOSOPHY: 04 Company · 05 Product · 06 CX · 07 Data · 08 AI
   ↓
STANDARDS: 09 Brand → 10 Design → 11 Components · 12 Content · 13 SEO/GEO ·
           14 Marketing · 15 Engineering · 16 AI · 17 Security · 18 Measurement
   ↓
KEYSTONE:  19 THE PROJECT OBJECT  →  20 PLATFORM & ECOSYSTEM
   ↓
SYSTEMS:   21 Website · 22 Mission Control · 23 Portal · 24 AI Estimator · 25 Mobile
   ↓
COMPANY:   26 Sales · 27 Operations · 28 People · 29 Leadership · 30 Finance · 31 Roadmap
```

The Project Object (19) is the **waist of the hourglass**: all standards flow into it; all systems
flow out of it. No upward arrows exist — if you need one, the inner chapter is wrong or a system has
leaked into the constitution.

---

## 6. Governance — how people use it
- **New engineer:** Part 0 + Ch. 15 + Ch. 19/20; before coding, ask "which principle governs this,
  which chapter owns the decision?"; never duplicate a fact.
- **New designer:** Part 0 + Ch. 06 + Ch. 09/10/11; design from tokens/components; a new pattern is a
  proposal to amend Ch. 11; judge every screen against CX Doctrine.
- **New ops manager:** Part 0 + Ch. 06 + Ch. 22/27; field-capture discipline is the compounding asset.

**It prevents chaos because:** every decision has a home (the TOC answers "where does this live?");
arguments resolve by citation, not seniority ("that violates Principle 6"); onboarding is reading,
not osmosis; change is governed via Ch. 03; the ring law keeps coupling low in org and code alike.

---

## 7. Implementation philosophy — *documentation → architecture → implementation → refinement forever*
- **Documentation first** — writing forces clarity code hides; the cheapest place to be wrong.
- **Architecture second** — settle the contracts/objects/boundaries on paper, where hard-to-change
  decisions are cheap.
- **Implementation third** — code is the *expression* of settled philosophy + architecture, not where
  you discover them (which is why each phase shipped low-risk and fast).
- **Refinement forever** — outer chapters refine continuously; inner chapters change rarely and only
  by amendment. We change the company by changing the manual, then the architecture, then the code —
  in that order, every time.

This loop is already proven here: Phase-1 audit → V2 blueprint → Project Object spec preceded any v2
code, and each surfaced decisions (dual-market doctrine, lens model, Customer/Property anchors) that
would have been brutally expensive to discover mid-build.

---

## 8. Existing work mapped into the manual
- `docs/PHASE-1-REPORT.md` → **Ch. 31** (history) + inputs to **Ch. 13/15**.
- `docs/V2-BLUEPRINT.md` → **Ch. 21** (Website); design parts → **Ch. 10/11**; CX parts → **Ch. 06**.
- `docs/PROJECT-OBJECT-SPEC.md` → **Ch. 19** (the keystone).
- The shipped Project System (`src/lib/projects/`) → first implementation of Ch. 19's public lens,
  following Ch. 15 engineering standards.
