# Real Elite Platform Blueprint

**Master Architectural Vision · Real Elite Platform**
Author: Founding Chief Architect · Status: Executive Draft · Mode: Design only (no code)
Grounded in direct review of all six repositories: `real-elite-website`, `real-elite-ops`, `estimatr`, `real-elite-properties-os`, `real-elite-content`, `real-elite-hq`.

---

## 1. Vision

### What the Real Elite Platform is
The Real Elite Platform is the **software operating system for a veteran-owned building and real-estate company** (operator: Jose "Juggey"; parent: Capacho Holdings LLC). It unifies three business lines — **Contracting**, **Properties**, and **Technologies (SaaS)** — behind one set of shared data, one design language, and one AI layer, so that a homeowner's first click and a crew's last nail belong to the same system.

### Why it exists
Today Real Elite runs **six separate applications that share a brand but nothing else** — no shared code, no shared data, no shared auth. A lead captured on the website is re-typed into ops; an estimate lives in a tool that doesn't know the customer; a finished job never automatically becomes public proof. The platform exists to **eliminate re-keying and information loss between the tools the business already uses**, and to convert every completed job into compounding marketing, review, and relationship value.

### The problem it solves
Local contractors lose money in the seams: leads go cold, estimates are slow and inconsistent, proof of quality is scattered, and the customer disappears after the sale. Real Elite's thesis (already written in the website's V2 blueprint) is that **the completed Project is the atomic unit of trust** — and the platform's job is to make that unit flow automatically from operations → public proof → reviews → repeat business.

### What it becomes over 10 years
1. **Years 1–2 — One system.** Shared contracts, one database, one auth; the Lead→Job→Project→Proof flywheel turns.
2. **Years 3–5 — A relationship platform.** Customer Portal, Review Center, full money path (estimate→invoice→payment), Properties on real data, mobile field capture.
3. **Years 5–10 — A regional operating platform and a SaaS.** AI removes the homeowner's two enemies (uncertainty and waiting); ESTIMATR graduates into a **multi-tenant product other contractors pay for**; Real Elite Technologies becomes a standalone software revenue line built on the same spine.

> **Challenge to assumption:** the biggest risk to this vision is *not* technical — it's that four of six repos have no git remote and two have their entire app uncommitted. The vision is unreachable until the work is backed up. That is task zero, not a footnote.

---

## 2. Product Map

### Current products
| Product | Repo | Purpose | State |
|---|---|---|---|
| **Website** | `real-elite-website` | Public "trust-transfer engine" — SEO/GEO, proof (Projects), lead origination, review requests. | **Live** at realelitecontracting.com |
| **Mission Control** | `real-elite-ops` | Internal ops brain — jobs, tasks, inbox, updates, AI chat, map. The system of record for operations. | Deployed (Vercel) |
| **AI Estimator (ESTIMATR)** | `estimatr` | AI-assisted construction estimating — CSI line items, refine/suggest, Stripe billing. The quoting engine. | Built, **not deployed** |
| **Properties** | `real-elite-properties-os` | Real-estate acquisitions & portfolio — deal analyzer, seller-lead CRM, rehab, owned assets. | Mock-data, **uncommitted** |
| **Content** | `real-elite-content` | Mon/Wed/Fri social engine — posts, calendar, templates, AI captions, brand voice. | **Uncommitted** |
| *(Legacy)* HQ | `real-elite-hq` | Superseded Mission Control (`mission-control-v1`). **Archive & retire.** | Dormant |

### Future products
- **Customer Portal** — post-sale home dashboard: build status, photo timelines, warranties, maintenance, proactive re-engagement. The retention/referral engine. Consumes Project, Job, MaintenanceEvent, Document, Payment.
- **Mobile Apps (Field + Owner)** — *Field*: crew job execution, task checklists, **job-site photo capture** (the flywheel's #1 input-quality constraint). *Owner*: the Portal in the pocket.
- **Vendor / Subcontractor Portal** — subs receive scopes, submit bids/invoices, upload insurance docs, schedule. Consumes Job, LineItem, Document, Payment, Scheduling.
- **Employee Portal** — crew HR-lite: schedule, time, job assignments, pay stubs, certifications. Consumes Employee, Scheduling, Job, Payment.
- **Analytics** — cross-product operator dashboard: pipeline, win rates, job-cost variance, review velocity, marketing attribution.
- **AI Services** — the platform-wide intelligence layer (see §7): Project Advisor, AI Cost Assistant, content drafting, ops copilot.

> **Recommended improvement:** rename `estimatr` repo to `real-elite-estimator` and treat ESTIMATR as the **first externally-sold product** — it already has Stripe wired, which none of the others do. It's the shortest path to software revenue.

---

## 3. Shared Platform Services

The platform is a **modular core** exposing services every product consumes. Start as a modular monolith (one Supabase/Postgres + typed API); split only under measured pressure.

| Service | What it owns | Consumed by |
|---|---|---|
| **Authentication** | One identity, SSO, roles. (Today: 3 different auth stories — unify.) | All products |
| **Projects** | The Project object (operational + public lens). | Website, Content, Portal, Mobile, Analytics |
| **Customers** | Single customer record + history. | All products |
| **Reviews** | Reviews as objects, GBP sync, project-linked, honesty gating. | Website, Content, Portal, Analytics |
| **Media** | Photos/video, transforms, public/private variants, the capture pipeline. | Website, Mobile, Portal, Content |
| **Documents** | Contracts, estimate PDFs, insurance, permits, warranties. | ESTIMATR, Portal, Vendor, Ops |
| **Payments** | Stripe — invoices, deposits, subscriptions (ESTIMATR SaaS). | ESTIMATR, Portal, Ops, Vendor |
| **Notifications** | Email (Resend), SMS/voice (Twilio), push, in-app. | All products |
| **Scheduling** | Appointments, crew calendars, estimate calls. | Website, Ops, Portal, Employee, Vendor |
| **AI** | Model gateway, prompt/context management, RAG over first-party corpus. | Website, Ops, ESTIMATR, Portal, Content |
| **Search** | Faceted + entity search over Projects/Reviews/Resources/Properties. | Website, Ops, Portal, Analytics |
| **Analytics** | Events, funnels, attribution, job-cost variance. | Analytics product, Ops |
| **Feature Flags** | Progressive rollout, per-tenant toggles (needed once ESTIMATR is multi-tenant). | All products |
| **Audit Logs** | Immutable record of who changed what (customer PII, money, publish actions). | Ops, Portal, Vendor, compliance |
| **Permissions** | RBAC/ABAC on top of Auth; public-vs-operational data boundary enforced here. | All products |

> **Challenge to assumption:** don't build 15 microservices. Build **one Platform Core** exposing these as modules behind a typed API and an event outbox. "Service" is a logical boundary first, a deployable second. Microservices are a scaling response, not a starting architecture — for a one-to-few-person team, premature service-splitting is the fastest way to fail.

---

## 4. Unified Domain Model

The platform's value comes from treating these as **shared, versioned contracts** (`@real-elite/contracts`) — not per-app types. Each object already exists somewhere today; the work is to converge them.

### The core lifecycle
```
        LEAD  ──────────────►  CUSTOMER  ──────────────►  APPOINTMENT
   (website /api/estimate,        (single record,           (estimate call,
    properties seller_leads)       one identity)             site visit)
         │                             │                          │
         ▼                             ▼                          ▼
      ESTIMATE  ───────────────────►  JOB  ───────────────►  JOB COST
   (ESTIMATR: LineItem[],        (Ops: system of         (actuals vs estimate,
    CSI, markup, totals)          record, tasks)          shares LineItem shape)
         │                             │                          │
   accepted │                          │ completed                │
         ▼                             ▼                          ▼
      INVOICE  ──────►  PAYMENT     PROJECT (public lens)      DOCUMENTS
   (money path)      (Stripe)   (PII/price stripped)      (contract, permit,
                                       │                     warranty)
                                       ▼
                                    REVIEW  ──────►  proof feeds Website + Content
```

### Supporting objects
- **Property** → PropertyPhoto, DealAnalysis, RehabLineItem *(= LineItem)*, Offer, OwnedProperty, MaintenanceEvent, BuyBoxSettings *(Properties OS — the richest existing schema, 10 tables)*.
- **Employee / Crew** → assigned to Job/Task; owns Scheduling, certifications.
- **Vendor / Subcontractor** → bids on Job scope; submits Invoice; holds insurance Documents.
- **Task** → shared by Ops and Properties today; unify into one contract.
- **Media / Document / Notification / AuditEvent** → cross-cutting platform objects attached to any entity.

### Convergence rules (the important part)
1. **One `LineItem`.** ESTIMATR's `LineItem` and Properties OS's `RehabLineItem` are the same concept — unify; `JobCost` is actuals against the same shape.
2. **One `Lead` with a `source` enum.** Website estimate requests, Properties `seller_leads`, Thumbtack/GBP inbound all collapse into `Lead`. Properties OS already models `LeadStatus`/`PropertySource` well — promote it platform-wide.
3. **Every object has an operational lens and a public lens.** The website's `Project` (deliberately no address/price/PII) is the template — apply it to Review, Property, Customer.
4. **The Project is the keystone.** Job completed → auto-publishes a public Project draft → Website renders proof → Content drafts posts → Review attaches. Design this pipeline first.

> **Recommended improvement:** author `Project`, `Review`, `Customer`, `LineItem`, and `Lead` as **published, SemVer'd contracts before the backend exists.** The website already treats `projects/types.ts` as a "published contract" — generalize that discipline. This is the single decision that makes every future product assembly instead of rewrite.

---

## 5. Engineering Principles (forever rules)

1. **API-first, contract-first.** Domain objects are published contracts; apps consume via typed clients + events. No app reads another app's database — ever.
2. **Type safety end-to-end.** TypeScript strict + Zod validation at every boundary; contracts validated in CI (breaking change ⇒ major bump or the PR fails).
3. **Small PRs, vertical slices.** One objective per PR/sprint (the website already enforces this — keep it). Ship thin end-to-end slices, not horizontal layers.
4. **Shared UI system.** One `@real-elite/design-system` (extracted from the website's Section/Card/CTA + tokens). New page types become assembly, not construction.
5. **SEO/GEO-first for public surfaces.** Structured data, answer blocks, entity graph as first-class — the AI-citation moat.
6. **Accessibility as a budget, not an afterthought.** axe-in-CI, heading order, contrast, no layout shift — gated, not aspirational.
7. **Performance budgets in CI.** Core Web Vitals budgets; quality scales with content volume instead of degrading.
8. **Testing pyramid weighted to integration + contract tests.** The website's relationship-validation-at-test-time (~238 tests) is the standard. E2E only on money paths and the publish flywheel.
9. **Honesty as a hard guardrail.** No fabricated proof, ever. Public/PII boundary enforced in code, not convention.
10. **Long-term maintainability > cleverness.** Modular monolith before microservices; converge the content model before adopting a CMS; no premature infrastructure.
11. **Every repo is production-hygienic.** Remote + committed baseline + CI + `CLAUDE.md` + `.env.example`. (Fixing the four remoteless/uncommitted repos is principle-zero in practice.)
12. **Decisions are recorded.** ADR log for cross-cutting choices; one decision per ADR, superseded not edited.

---

## 6. UX Philosophy

**Every Real Elite product should feel like it was made by a company ten times its size — calm, fast, and obviously trustworthy.** The brand is veteran-owned precision; the software should embody discipline, not decoration.

- **Simplicity (Apple).** One primary action per screen. Ruthless subtraction. The interface disappears; the work is the hero. If a homeowner or a crew member can't use it on the first try, it's wrong.
- **Clarity & trust in dense data (Stripe).** Money, estimates, and job costs must read instantly — generous whitespace, precise number formatting, honest empty states, no dark patterns.
- **Speed & keyboard-first power (Linear).** Sub-100ms interactions, optimistic UI, a command palette (Mission Control already has `cmdk` — standardize it platform-wide), no spinners where instant is possible.
- **Structured flexibility (Notion).** Content, projects, and properties are objects that compose. Consistent object pages, breadcrumbs, cross-links.
- **Craft & polish (Vercel).** Immaculate typography, functional motion, dark/light parity, one design system across every surface.

**Concretely:** one type scale (Geist/Inter-class sans, tabular numerals for money); a single spacing scale (`Section`/`Card` primitives); five-anchor public nav (Services · Projects · Reviews · Resources · Process) + command palette internally; restrained high-contrast navy/steel palette where color carries meaning; 150–250ms ease-out motion, no layout shift. **Simplicity rule: AI augments the human relationship, never hides it.**

---

## 7. AI Strategy

**One coherent AI layer, one owned corpus, many surfaces.** AI is a platform *service* (model gateway + context/RAG over Real Elite's own Projects, Reviews, estimates, and resources) — not a feature bolted onto each app separately. The same first-party corpus that answers a homeowner is the moat that gets Real Elite cited by external AI.

**Design principles:** (1) AI reads/writes the same domain objects; (2) AI *augments the human, never hides it*; (3) honesty gating applies to AI output too — no fabricated proof or prices; (4) build the entity graph first, then layer intelligence on it.

| Surface | How AI shows up |
|---|---|
| **Website** | GEO/AEO **Answer Blocks** (Sprint #002); evolve "Instant Roof Quote" into an **AI Cost Assistant**; later a **Project Advisor** answering from Real Elite's own project corpus. |
| **Mission Control** | Ops **copilot** (already has Anthropic chat) — triage inbox, draft follow-ups, summarize job status, keep the Obsidian note synced. |
| **AI Estimator** | Core value: **suggest** line items and **refine** estimates from plain-language scope, grounded in a CSI catalog and historical job costs — estimates get *more accurate over time* as JobCost actuals feed back. |
| **Customer Portal** | Status/warranty Q&A, "what happens next," proactive maintenance nudges — human lead one tap away. |
| **Content Engine** | Auto-draft posts/captions from completed Projects (brand-voice model already exists). |
| **Future Mobile** | Field: photo auto-tagging, scope-to-estimate from a voice note. Owner: conversational home dashboard. |

> **Recommended improvement:** consolidate models behind **one AI gateway service** with shared prompt/version management and per-surface guardrails. Today AI keys and SDKs are scattered per repo (Anthropic in three, Gemini in ops). One gateway = one place for cost control, evals, caching, and safety. And **feed JobCost actuals back into ESTIMATR** — an estimator that learns from real outcomes is a defensible moat; a generic LLM wrapper is not.

---

## 8. Five-Year Roadmap (milestones, not features)

> Current numbered work tops out at the website's **Sprint #002** (GEO Answer Block); **there is no Sprint #003 yet.** These milestones should generate it.

- **M0 — Foundations & Hygiene (weeks).** Remotes + committed baselines for all repos; retire `real-elite-hq`; normalize branches/CI. *Exit: no uncommitted or remoteless apps; CI green everywhere.* **(Task zero — the vision is unbacked until this is done.)**
- **M1 — Contracts & Substrate (Q1).** Publish `@real-elite/contracts` + `@real-elite/design-system`; stand up one Supabase Core (Postgres + RLS + Storage + Auth). *Exit: two apps consume the shared contracts + tokens.*
- **M2 — Operations as System of Record (Q2).** Migrate Mission Control off file-backed data onto Core; point ESTIMATR and Properties OS at the shared project; one Customer, one Auth.
- **M3 — The Flywheel & First SaaS Launch (Q3).** Event outbox (`lead.created`, `estimate.accepted`, `job.completed`); job-complete → public Project draft → website publish → content draft. **Ship ESTIMATR to production.** *Exit: a completed job produces live proof + a draft post with zero re-keying; first external revenue.*
- **M4 — Money Path & Review Center (Q4–Y2Q1).** Estimate→Invoice→Payment; JobCost actuals vs estimate; Reviews as objects + GBP + project links.
- **M5 — Portal & Properties Depth (Y2).** Customer Portal v1; Properties OS out of mock mode onto real data.
- **M6 — Intelligence & Mobile (Y3).** AI gateway + Project Advisor + AI Cost Assistant; Field Mobile app.
- **M7 — Platform Expansion (Y4–Y5).** Vendor Portal, Employee Portal, Analytics product; ESTIMATR to true multi-tenant SaaS (feature flags, per-tenant billing). *Exit: Real Elite Technologies is a standalone software revenue line on the same spine.*

---

## 9. Challenges to Assumptions & Top Recommendations

1. **The critical risk is operational, not architectural.** Four repos have no remote; two are entirely uncommitted. **Do M0 this week.**
2. **Reconcile the identity split.** "Capacho" (ops code, email) vs "Escobar" (GitHub org) — pick one canonical legal/brand identity before any external SaaS launch; it will otherwise contaminate contracts, domains, and Stripe.
3. **Don't over-engineer the backend.** Modular monolith + event outbox on one Supabase beats microservice sprawl for a small team.
4. **Lead with ESTIMATR as the revenue wedge.** The only Stripe-wired app and the clearest external product. A learning estimator (fed by JobCost actuals) is a moat.
5. **Bus factor = 1.** The `CLAUDE.md` + ADR + shared-contracts discipline is what makes the platform legible to future humans *and* the AI agents in the org chart.
6. **Converge before you CMS.** Retire the website's `CONTENT` monolith and three parallel offering models before adopting any CMS, or you cement the debt.

*End of REAL_ELITE_PLATFORM_BLUEPRINT.md*
