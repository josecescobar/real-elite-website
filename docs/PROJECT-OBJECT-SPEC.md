# Real Elite Project Object — Master Specification

> **Status:** Conceptual product & systems architecture. No code, no database schema. This is the
> canonical design document for the single most important object in the Real Elite ecosystem.
>
> **Place in the manual:** This document is **Chapter 19 — The Project Object** of the Real Elite
> Operating Manual (`docs/OPERATING-MANUAL.md`) — the keystone every system derives from. The
> website's Project System (`src/lib/projects/`) is the first implementation of its **public lens**.
>
> **Companions:** `docs/PHASE-1-REPORT.md` (v1 foundation audit) · `docs/V2-BLUEPRINT.md` (Website v2
> blueprint) · `docs/OPERATING-MANUAL.md` (the constitution).

---

## 0. Architectural Thesis (the part most people get wrong)

Three foundational decisions. Get these wrong and the rest collapses.

**Decision 1 — The Project is the center, but it is not the root.**
A Project is an *episode* that connects two entities which **outlive it by decades**:

- **The Property** — a physical home with a roof age, foundation, style, and history. It persists
  across multiple projects and even multiple owners over 30 years.
- **The Customer** — a household whose lifetime value is measured in referrals and repeat projects.

The true shape is **Customer ──owns──▶ Property ◀──performed-on── Project.** The Project is the
operational and content center of gravity, but modeling it as an *episode linking a durable Customer
and a durable Property* is what keeps it correct in 10 years. **Property and Customer are first-class
neighbors, not buried fields.**

**Decision 2 — One canonical object, many *lenses*, never copies.**
One canonical Project Object holds the truth; every system reads it through a permissioned, redacted
**lens**:
- **Operational lens** (Mission Control): everything.
- **Customer lens** (portal): their project/selections/schedule — never margin, crew pay, internal notes.
- **Public lens** (website): the curated, redacted story — no address, no price, first name only by consent.
- **Intelligence lens** (AI/BI): structured, anonymized facts across all projects.

The website doesn't *have* projects; it *renders a public lens* over a subset of projects.

**Decision 3 — The Project is an event stream, not a static record.**
The current state is a derived summary of everything that happened (state changes, photos, messages,
approvals, expenses, weather, decisions). Append-only history gives you — for free — the audit trail,
daily log, customer timeline, case-study narrative, dispute resolution, and the richest AI training
data. **The history *is* the asset.**

---

## 1. Project Philosophy

**Why it exists.** In most firms a job's value evaporates the day the crew leaves: photos sit on a
phone, cost lessons live in one estimator's head, the happy customer is never asked for a review, the
next bid is guessed. The Project Object **captures, structures, and compounds the value of every job**
so nothing evaporates.

**Why it's the center.** Every system is a different question asked of the same job — the website
("show me proof"), Mission Control ("on time and on budget?"), the portal ("what's happening to my
home?"), the AI Estimator ("what will the next job cost?"), BI ("which work makes us money?"). One
object through different lenses = one truth, entered once, projected everywhere.

**What it solves.** Value leakage · data fragmentation · trust scarcity · estimating by gut · no
institutional memory · no compounding. It converts a *services company that forgets* into a *data
company that remembers and gets smarter every job.*

---

## 2. Project Lifecycle (a state machine, not a checklist)

Created at the first touch (Lead) and **never deleted** — even a lost lead is data.

| Stage | What it is | Produces |
|---|---|---|
| **Lead** | A homeowner raises a hand; the object is born | Demand/market/service intent |
| **Estimate** | Scope + ballpark from real history | Cost prediction, qualification |
| **Proposal** | Itemized Good/Better/Best | Contract artifact, selections |
| **Approved / Won** *(or Lost)* | Customer signs (or not) | Conversion / loss-reason data |
| **Planning** | Scope, selections, drawings | Materials list, design assets |
| **Permitting** | Jurisdiction approvals | Permit records, timeline risk |
| **Scheduling** | Crew, sequence, weather windows | Schedule, crew assignment |
| **Materials / Procurement** | Order, deliver, stage | Vendor records, cost actuals, lead times |
| **Construction** | The build; daily logs, photos | The richest data — process media, real costs |
| **Inspection / QA** | Punch list + jurisdictional | Quality record, before-final assets |
| **Completion / Closeout** | Walk-through, sign-off, payment | Final imagery, invoice, warranty start |
| **Review Capture** | Ask at peak satisfaction | The review object, video testimonial |
| **Warranty** | Active coverage; service requests | Reliability data on materials/crews |
| **Maintenance** | Seasonal nudges | Retention touchpoints, upsell signals |
| **Future Opportunities** | "Your deck is 7 years old" | New leads from existing relationships |

The most valuable stages are the ones *after* the money is collected — Warranty, Maintenance, Future
Opportunities — because that's where lifetime value and referrals live. The lifecycle is a **loop**:
Future Opportunities feeds back into Lead on the same Property/Customer.

---

## 3. Project Information (facets, not a field dump)

Coherent clusters, each owned by a stage, each with its own privacy lens.

- **A. Identity & Classification** *(immutable spine)* — id, slug, title, type, primary/sub-services, status, version.
- **B. Customer** *(durable link)* — household, type, attribution, lifetime relationship. *Public: first name + consent only.*
- **C. Property** *(durable link)* — address, geo, neighborhood, jurisdiction, style, year built, roof age, HOA, flood/historic. *Outlives the project.*
- **D. Scope & Selections** — scope, tier chosen, design selections, specs, drawings.
- **E. Commercial** — budget band; contract; line items; payments; change orders; **margin (internal-only)**. *Public: budget band only; never price/margin.*
- **F. Materials & Vendors** — materials, manufacturers, brands, POs, lead times, cost actuals.
- **G. People & Crew** — project lead (the "same lead" promise), crew, subs, hours. *Internal.*
- **H. Schedule & Timeline** — planned vs actual, milestones, weather days, delays.
- **I. Media** *(marketing goldmine)* — before/during/after, before/after pairs, hero, process, drone, video, testimonial; each tagged stage/area/consent/quality/publishable.
- **J. Compliance & Documents** — permits, inspections, contracts, warranties, insurance, closeout.
- **K. Communication & Activity** *(event stream)* — every message/note/decision/upload, append-only, attributed.
- **L. Story & Narrative** — goal, challenge, solution, pull-quotes, editorial write-up, tags.
- **M. Warranty & Lifecycle** — terms, registered products, service requests, maintenance schedule, future-opportunity signals.
- **N. Intelligence & Provenance** — quality/profitability scores, flagship flag, and **provenance links** (every public claim traces to operational facts).

**Make-or-break discipline:** facets I (Media) and K (Activity) must be captured *in the field,
during the job, with near-zero friction*. Field-capture discipline sets the ceiling for the website
and the AI — flag it to leadership.

---

## 4. Marketing Assets — from ONE project, automatically

Capture once in the field, project into everything (as drafts for human approval):
Case Study / Project page · gallery entry · service-page proof · location-page proof · SEO landing
page · GEO/AEO answer content · review object · customer story · before/after asset · blog post ·
Google Business post · Instagram · Facebook · YouTube · Pinterest · email · press/award · sales
collateral · internal knowledge · AI training/citation data.

These are not 18 creative projects — they are **18 renderings of one object.** Competitors produce
zero per job because each feels like work; Real Elite produces all of them because they fall out of
the object. Compounded over thousands of jobs, that asymmetry is uncatchable.

---

## 5. Website Integration (the public lens)
`/projects` gallery · `/projects/{slug}` Project Experience · service-page proof modules · city-page
proof modules · Review Center · Resources examples · homepage Proof Wall · search/related · mega-menu
featured card. The website **never stores its own copy** — unpublish once, gone everywhere.

## 6. Mission Control Integration (the operational lens / write path)
Pipeline · scheduling · crew & tasks · daily logs · media (one upload, both lenses) · financials &
live margin · documents · messaging · procurement · AI copilot · auto-publishing the marketing draft
set at Completion. Running the job well *is* what populates marketing + intelligence — for free.

## 7. Customer Portal (the customer lens)
Sees: live status + timeline, a photo stream of their job, selections, schedule + honest delays,
their documents, payments, a line to their project lead, post-completion warranty/maintenance.
Approves: proposal, selections, **change orders** (prevents most disputes), milestones. Never sees:
margin, crew pay, vendor pricing, internal notes, other customers. It's a **trust instrument**, not a
PM tool dumped on a homeowner.

## 8. AI Integration (2030)
Recommendations · cost prediction (from actual costs, not list prices — compounding edge) · material
suggestions · timeline prediction · permit guidance · photo analysis · risk detection · maintenance
planning · auto-narrative · quality/profitability scoring. **The data is the moat; the Project Object
is the shape that makes it learnable.** A competitor can buy the models but not the ground truth.

## 9. Relationships (the graph)
Project links durable **Customer** and **Property**, plus many Media, Reviews, Materials→Brands,
Crew/Vendors, Expenses/Payments/Change Orders, Tasks/Milestones, Content (blog/FAQ/social), AI
objects, and a Future Project (the loop). Modeling these as real relationships (not embedded blobs) is
what enables search, BI, and AI.

## 10. Search Philosophy
Findable by service, location, budget band, date/season, material/manufacturer, style, color, home
type/age, customer type, crew (internal), warranty (internal), asset filters (before/after, video,
review), flagship, profitability (internal). Every public facet combo is *both* a human browse path
and an indexable, AI-citable landing surface.

## 11. Project Experience (the public page)
Architectural-Digest feature × Apple launch × Netflix documentary. Sections (each doing Trust / SEO /
GEO / Conversion): cinematic hero · the before · the brief · the challenge · the build · the reveal
(before/after) · the spec panel (structured facts AI lifts) · the customer's words (linked review) ·
machine-readable facts block · start-your-project CTA · related projects. Beats Houzz/BuildZoom
(model without aesthetic) and luxury builders (aesthetic without scale/structure) by having **both**,
produced automatically from how the job was run.

## 12. Future Vision — 10,000 projects
The estimate becomes near-perfect; the map of "what works" sharpens; the content library becomes
uncatchable (you don't rank against competitors — you *are* the AI's answer); the relationship graph
compounds; every new project makes every system smarter, automatically. The asset took 10,000 jobs
and disciplined capture to build and grows faster the bigger it gets — un-copyable.

---

## Governance (keeps it correct in 10 years)
1. **Permission lenses are part of the object**, not an afterthought — central, automatic redaction.
2. **Identity is immutable; truth is append-only** — stable URLs, full audit trail, rich corpus.
3. **One contract, many consumers** — Website, Mission Control, Portal, AI, BI agree on one
   definition of the Project Object. Define the shared contract before the second system is built.

## Closing
The Project Object is the **central nervous system of the Real Elite ecosystem** — where a job becomes
proof, learning, marketing, relationship, and intelligence at once, captured once and projected
everywhere. Anchor it between the durable Customer and Property, treat its history as the asset, and
govern its lenses rigorously — and it is still the correct architecture in 2036.
