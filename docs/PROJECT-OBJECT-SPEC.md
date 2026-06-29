# Real Elite Project Object — Master Specification

> **Status:** Conceptual product & systems architecture. No code, no database schema, no
> implementation. This is the canonical design document for the single most important object in the
> Real Elite ecosystem. It prescribes no immediate build work and does not affect the running site.
>
> **Note:** Under the Real Elite Operating Manual model, this document is slated to become
> **Chapter 19 — The Project Object** (the keystone). It is kept here as a standalone markdown file
> until the manual is integrated.
>
> **Companion documents:** `docs/PHASE-1-REPORT.md` (v1 foundation audit + engineering backlog) and
> `docs/V2-BLUEPRINT.md` (Website v2 product blueprint, where the Project Object is the keystone).

---

## 0. Architectural Thesis (the part most people get wrong)

Before the twelve deliverables, three foundational decisions. Get these wrong and the rest
collapses.

**Decision 1 — The Project is the center, but it is not the root.**
The instinct is "everything revolves around projects." Almost. A Project is an *episode*, and an
episode connects two entities that **outlive it by decades**:

- **The Property** — a physical address/home. It has a roof age, a foundation, a style, a history.
  It persists across *multiple projects and even multiple owners* over 30 years. The home is forever;
  the project is a chapter.
- **The Customer** — a person/household with a lifetime value measured in *referrals and repeat
  projects*, not one transaction.

So the true shape is: **Customer ──owns──▶ Property ◀──performed-on── Project.** The Project is the
operational and content center of gravity, but architecting it as an *episode that links a durable
Customer and a durable Property* is what makes it correct in 10 years. It's the difference between
"we did a roof in 2026" and "this home's relationship with Real Elite spans a roof (2026), a deck
(2028), and a kitchen (2031), and the homeowner referred two neighbors." The second is the business.
**Model the Project so the Property and Customer are first-class neighbors, not buried fields.**

**Decision 2 — One canonical object, many *lenses*, never copies.**
The single biggest failure mode is letting Mission Control, the website, and the portal each grow
their *own* version of project data that drift apart. The architecture is: **one canonical Project
Object holds the truth; every system reads it through a *lens*** — a permissioned, redacted
projection.

- **Operational lens** (Mission Control / internal): everything.
- **Customer lens** (portal): their project, their selections, their schedule — nothing about
  margin, crew pay, or internal notes.
- **Public lens** (website): the curated, beautiful, redacted story — no address, no price, no
  customer last name unless consented.
- **Intelligence lens** (AI/BI): structured, anonymized facts across all projects.

The website doesn't *have* projects. It *renders a public lens* over a subset of projects. This
single idea kills duplication forever.

**Decision 3 — The Project is an event stream, not a static record.**
A project is the *accumulation of everything that happened to it* — a timeline of state changes,
photos, messages, approvals, expenses, weather, decisions. The "current state" is a derived summary
of that history. Thinking in events (append-only truth) rather than overwritable fields gives you,
for free: a full audit trail, the daily log, the customer timeline, the case-study narrative, dispute
resolution, and the richest possible AI training data. **The history *is* the asset.** Never design
it away with "last value wins."

Everything below rests on these three decisions.

---

## 1. Project Philosophy

**Why the Project Object exists.**
A contracting company's value is locked inside its jobs — but in most firms that value evaporates the
day the crew drives away. The photos sit on a phone, the cost lessons live in one estimator's head,
the happy customer is never asked for a review, and the next bid is guessed. The Project Object
exists to **capture, structure, and compound the value of every job** so nothing evaporates.

**Why it becomes the center of the ecosystem.**
Because every other system is, at its core, a *different question asked of the same job*:

- The website asks: *"Show me proof a homeowner can trust."*
- Mission Control asks: *"Is this job on time, on budget, and well-run?"*
- The Customer Portal asks: *"What's happening with my home and what do I need to decide?"*
- The AI Estimator asks: *"What will the next job like this cost and how long will it take?"*
- BI asks: *"Which services, crews, and markets make us money?"*

If each system answers from its own data, you have five disagreeing sources of truth and five times
the work. If they all answer from **one Project Object through different lenses**, you have one truth,
entered once, projected everywhere. That is an operating system, not a website.

**What problems it solves.**
1. **Value leakage** — work done but never turned into proof, learning, or marketing.
2. **Data fragmentation** — the same job re-entered in QuickBooks, a CRM, a spreadsheet, Instagram,
   and the website.
3. **Trust scarcity** — homeowners can't verify a contractor; provenance-linked projects make every
   claim checkable.
4. **Estimating by gut** — no historical cost/time corpus, so margins are guesses.
5. **No institutional memory** — knowledge walks out the door when an employee leaves.
6. **No compounding** — every job starts from zero instead of from 5,000 prior jobs.

The Project Object converts a contractor from a *services company that forgets* into a *data company
that remembers and gets smarter every job.*

---

## 2. Project Lifecycle

The lifecycle is a **state machine**, not a checklist. Each stage has an owner, an entry condition,
an exit condition, and the assets/learning it produces. Projects can branch (lost lead, change order,
warranty claim) and re-enter (future project). Crucially, **the object is created at the very first
touch (Lead) and never deleted** — even a lost lead is valuable data (why did we lose it, at what
price, in what market).

| Stage | What it is | Owner | Produces |
|---|---|---|---|
| **Lead** | A homeowner raises a hand. Project Object is born here. | Sales/AI intake | Demand signal, market/service intent data |
| **Estimate** | Scope + ballpark from real history (AI Estimator). | Estimator/AI | Cost prediction, qualification |
| **Proposal** | Formal, itemized, branded proposal with options (Good/Better/Best). | Sales | The contract artifact, selection choices |
| **Approved / Won** *(or Lost)* | Customer signs (or doesn't). | Customer | Conversion data; loss-reason data |
| **Planning** | Scope finalized, selections made, drawings, structural decisions. | Project lead | Selections, materials list, design assets |
| **Permitting** | Jurisdiction-specific approvals. | Ops/AI permit assistant | Permit records, timeline risk |
| **Scheduling** | Crew, sequence, dependencies, weather windows. | Ops | Schedule, crew assignment |
| **Materials / Procurement** | Order, deliver, stage materials. | Ops/vendors | Vendor records, cost actuals, lead-time data |
| **Construction** | The build. Daily logs, photos, messages, change orders. | Crew/project lead | The *richest* data — process photography, daily logs, real costs |
| **Inspection / QA** | Internal punch list + jurisdictional inspection. | Project lead/inspector | Quality record, before-final assets |
| **Completion / Closeout** | Final walk-through, sign-off, payment, warranty registration. | Project lead/customer | Final imagery, sign-off, invoice, warranty start |
| **Review Capture** | Ask for the review at peak satisfaction (right at completion). | AI/Sales | The review object, video testimonial |
| **Warranty** | Active coverage; service requests handled here. | Service | Warranty claims, reliability data on materials/crews |
| **Maintenance** | Ongoing home care, seasonal nudges. | Service/AI | Retention touchpoints, upsell signals |
| **Future Opportunities** | "Your deck is 7 years old"; the next chapter. | AI/Sales | New leads from existing relationships — the flywheel closes |

**The philosophical point:** most contractors' systems end at "Completion." The Project Object's most
valuable stages are the ones *after* the money is collected — Warranty, Maintenance, Future
Opportunities — because that's where lifetime value and referrals live. The lifecycle is a **loop**,
not a line: Future Opportunities feeds back into Lead, on the *same Property and Customer*.

---

## 3. Project Information (organized as facets, not a field dump)

A flat list of 80 fields is unusable. The Project Object is composed of **facets** — coherent
clusters, each owned by a stage, each with its own privacy lens. This grouping is the actual
architecture.

**A. Identity & Classification** *(immutable spine)*
Stable ID; human slug; title; project type/program; primary service; sub-services; status +
sub-status; created/updated timestamps; version. *This never changes meaning over 10 years — it's the
anchor.*

**B. Customer** *(link to durable Customer entity)*
Name, contact, household, communication preferences, customer type
(residential/luxury/commercial/federal), source/attribution, lifetime relationship (other projects,
referrals given). *Lens: public sees first name + consent flag only.*

**C. Property** *(link to durable Property entity)*
Address, geo-coordinates, neighborhood, jurisdiction (for permits), home style, year built, square
footage, stories, roof age, lot characteristics, HOA, flood zone, historic designation. *This
outlives the project; reused on the next one.*

**D. Scope & Selections**
Detailed scope, inclusions/exclusions, the Good/Better/Best tier chosen, design selections (colors,
finishes, fixtures, layouts), specifications, drawings/renderings. *Powers the spec panel + AI
material advisor.*

**E. Commercial**
Budget band; proposal versions; signed contract; price (internal); line items; payment schedule;
invoices; payments received; deposits; financing used; change orders (each a sub-record with reason,
cost, approval); **margin/profitability (internal-only)**. *Lens: customer sees their price/payments;
public sees only an anonymized budget *band*; never the margin.*

**F. Materials & Vendors**
Material list (type, manufacturer, product line, color, quantity, warranty); brand associations (GAF,
Owens Corning…); vendor/supplier records; PO numbers; delivery dates; lead times; cost actuals.
*Powers materials filters, brand SEO/GEO entity links, and procurement intelligence.*

**G. People & Crew**
Project lead (the single human accountable, estimate→walk-through — the brand promise); assigned
crew; subcontractors; roles; hours; who-did-what. *Internal; powers crew performance BI and "same
lead" trust story.*

**H. Schedule & Timeline**
Planned vs. actual start/end; milestones; phases; dependencies; weather days; delays (with reasons).
*Powers timeline prediction and the customer's live schedule.*

**I. Media** *(the marketing goldmine)*
Before / during / after photography; before/after *pairs*; hero shot; process documentation;
drone/aerial; video; customer video testimonial; 360°/walkthrough. Each asset tagged with: stage,
room/area, angle, consent, usage rights, quality tier, "publishable" flag. *Capture discipline here
sets the ceiling for everything in §4.*

**J. Compliance & Documents**
Permits (status, jurisdiction, number); inspections (pass/fail, dates); contracts; warranties
(workmanship + manufacturer); insurance; lien waivers; closeout package; certificates. *Some
customer-visible, some internal.*

**K. Communication & Activity** *(the event stream)*
Every message, note, decision, status change, photo upload, approval — append-only, timestamped,
attributed. *This is the daily log, the audit trail, and the case-study source material
simultaneously.*

**L. Story & Narrative** *(the content layer)*
The homeowner's goal; the challenge; the Real Elite solution; outcome pull-quotes; the editorial
write-up; tags (style, theme). *Authored once; renders into case study, blog, social, AI corpus.*

**M. Warranty & Lifecycle** *(post-completion)*
Warranty terms + expiry; registered products; service requests; maintenance schedule; satisfaction
over time; future-opportunity signals (component ages). *Where lifetime value lives.*

**N. Intelligence & Provenance** *(meta)*
Quality score; profitability tier; "flagship" flag; data-completeness score; AI-derived insights;
and — critically — **provenance links**: every public claim (a review, a cost band, a "we serve this
city") traces back to the operational facts that prove it. *Provenance is the trust moat.*

**The discipline that makes or breaks it:** facets I (Media) and K (Activity) must be captured *in the
field, during the job, with near-zero friction* — a crew member's phone, one tap. The website's
quality ceiling and the AI's intelligence are both set by **field-capture discipline**, not by
anything a designer or engineer does later. This is the single most important operational commitment
to flag to leadership.

---

## 4. Marketing Assets — from ONE project, automatically

The principle: **capture once in the field, project into everything.** A completed project with good
media + story should *automatically* spawn (as drafts for human approval — never auto-publish
unreviewed) every asset below. The marketer's job shifts from *producing* to *curating*.

From one completed project:

- **Case Study / Project Experience page** (the canonical public artifact, §11)
- **Project gallery entry** (faceted, §10)
- **Service-page proof module** (auto-filtered to this service)
- **Location/city-page proof module** (auto-filtered to this city)
- **SEO landing page** (unique, media-rich, long-tail: "kitchen remodel McLean VA")
- **GEO/AEO answer content** (structured facts AI engines cite: cost band, timeline, materials,
  location)
- **Review object** (linked to the project, surfaced in the Review Center)
- **Customer Story** (long-form editorial)
- **Before/After asset** (the single most shareable contractor content)
- **Blog post** (e.g., "How we solved a hidden leak in a 1920s Charles Town home")
- **Google Business Profile post** (local SEO velocity)
- **Instagram** (carousel + reel from process media)
- **Facebook** (community proof)
- **YouTube** (the build documentary / testimonial)
- **Pinterest** (design-led discovery for the NoVA taste buyer)
- **Email** (newsletter "recent work," re-engagement)
- **Press / award submission** (flagship projects)
- **Sales collateral** ("here's a project at your budget in your town" — sent as a link mid-deal)
- **Internal knowledge** (how we handled X; estimating reference)
- **AI training/citation data** (the structured corpus that powers §8 *and* makes external AI
  recommend Real Elite)

**The strategic reframe:** these are not 18 separate creative projects. They are **18 renderings of
one object.** Most contractors produce *zero* of these per job because each feels like work; Real
Elite produces all of them because they fall out of the object. That asymmetry, compounded over
thousands of jobs, is uncatchable.

---

## 5. Website Integration (Website v2)

The website is a **read-only public lens** over the project corpus. Every project, once flagged
publishable, flows automatically into:

- **/projects** — the faceted gallery; each project a tile.
- **/projects/{slug}** — the full Project Experience (§11).
- **Service pages** — proof module pulls projects tagged to that service.
- **Location/city pages** — proof module pulls projects in that city; this is what makes local pages
  *real* instead of thin doorways.
- **Reviews / Review Center** — the project's review, linked back to the visible work.
- **Resources** — projects referenced as examples inside cost guides and how-to articles.
- **Homepage Proof Wall** — flagship-flagged projects.
- **Search & related content** — projects surface by service, city, style, budget; "related projects"
  rails keep visitors in the proof stream.
- **Navigation** — the Services mega-menu shows a live "featured project" card.

**Key rule:** the website *never* stores its own copy. A project published in Mission Control appears
on the site through the public lens (address redacted, price → budget band, last name gated by
consent). Unpublish in one place → gone everywhere. This is how one object stays consistent across
the entire public surface.

---

## 6. Mission Control Integration

Mission Control is the **operational lens** — the full, unredacted object, optimized for *running the
job*. It owns the write path; the website and portal mostly read. (Repos stay separate, but they
share the **same Project Object contract** — design it now.)

Mission Control uses the object for:

- **Pipeline** — projects by lifecycle stage (lead → warranty); the business at a glance.
- **Scheduling** — crews, sequencing, dependencies, weather windows, conflicts.
- **Crew & tasks** — assignments, punch lists, who's accountable, hours.
- **Daily logs & updates** — the event stream (§3-K), captured in the field.
- **Photos/media** — field capture that feeds both ops and marketing (one upload, both lenses).
- **Financials** — budget vs. actual, expenses, change orders, invoices, payments, **live margin**.
- **Documents** — permits, contracts, warranties, closeout.
- **Messaging** — internal threads + the bridge to customer messages.
- **Procurement** — POs, vendors, deliveries, lead times.
- **AI copilot** — surfaces risk ("this job is trending over budget"), drafts updates, predicts
  delays.
- **Auto-publishing** — at Completion, generates the marketing draft set (§4) for approval.

**The integration insight:** the *act of running the job well in Mission Control* is what *populates
the marketing and intelligence layers* — for free, as a byproduct. The team never does "marketing
data entry." They run the job; the assets accrue. That alignment of operational and marketing
incentives is the whole design.

---

## 7. Customer Portal

The **customer lens** — calm, transparent, reassuring. It exists to kill the #1 thing homeowners
hate: *silence and uncertainty during a build.* Every element answers "what's happening to my home,
and what do I need to do?"

**What they see:**
- Live project status + visual timeline (where we are, what's next, expected dates).
- A photo stream of *their* project as it progresses — the single most-loved feature; it turns
  anxiety into anticipation.
- Their selections, the agreed scope, and the design choices.
- Schedule + upcoming milestones (and honest delays, with reasons — transparency *builds* trust).
- Documents *they* should have: contract, permits, warranties, invoices, closeout package.
- Payment schedule + what's paid / what's due.
- A direct message line to their project lead (the same human throughout).
- Post-completion: warranty record, maintenance schedule, one-tap service request.

**What they upload:**
- Inspiration photos, their own "before" shots, the problem they're seeing.
- Selection confirmations, signed documents.
- Site access notes (gate codes, pets, parking).

**What they approve:**
- The proposal/contract.
- Design selections.
- **Change orders** — with clear cost/time impact, approved in-portal (this single feature prevents
  most contractor disputes).
- Milestone sign-offs and final walk-through.

**What they track:**
- Progress, schedule, payments, decisions pending.

**What stays private (never in the customer lens):**
- Margin, crew pay, internal cost actuals, internal notes/strategy, vendor pricing, other customers'
  anything.

**The design principle:** the portal is a **trust instrument**, not a project-management tool dumped
on a homeowner. Show them exactly enough to feel informed and in control; hide the operational
machinery. Proactive transparency (we tell you about the delay before you ask) is the entire product.

---

## 8. AI Integration (2030)

By 2030, the project corpus is the **fuel** and the Project Object is the **schema** the AI reasons
over. AI consumes the intelligence lens (structured, anonymized across all projects) and acts on
individual projects.

- **Recommendations** — "homeowners with a 1990s home in Loudoun like yours most often did X next";
  powers the AI Project Advisor and external AI citations.
- **Cost prediction** — the AI Estimator learns from *actual* costs across thousands of projects
  (facet E + F), not list prices. The estimate gets more accurate every job. This is the compounding
  edge.
- **Material suggestions** — "for a historic Charles Town home, these materials performed best and
  matched the style" — grounded in real prior projects + warranty/reliability data.
- **Timeline prediction** — planned-vs-actual history (facet H) + weather + crew + season → honest,
  accurate schedules.
- **Permit guidance** — jurisdiction permit history (facet J) → "in Berkeley County, this scope needs
  X, typically Y days."
- **Photo analysis** — auto-tag rooms/materials/quality, flag a bad roof from a drone shot, generate
  before/after pairs, assess job quality, even pre-scope a lead from uploaded photos.
- **Risk detection** — "this job profile historically goes over budget when the foundation is
  pre-1950" → flagged before it happens.
- **Maintenance planning** — component ages across the Property entity → proactive, personalized
  upkeep + perfectly-timed future-project nudges.
- **Auto-narrative** — draft the case study, the social posts, the review request — from the event
  stream.
- **Quality & profitability scoring** — which crews, services, materials, and markets actually win.

**The 2030 reframe:** AI doesn't replace the contractor; it makes the *company itself* intelligent.
Every project teaches it. A competitor starting fresh has *no corpus* — they can buy the same AI
models but not the 8,000-project ground truth. **The data is the moat; the Project Object is the
shape that makes the data learnable.**

---

## 9. Relationships (the graph)

The Project Object is a **hub in a graph**, not a flat row. Modeling these as real relationships (not
embedded blobs) is what enables search, BI, and AI.

```
                         ┌─────────────┐
              owns       │   CUSTOMER   │   gives ▶ Referrals
        ┌───────────────▶│  (durable)   │◀── lifetime relationship
        │                └─────────────┘
        │                       │ performed-for
┌──────────────┐                ▼
│   PROPERTY    │◀────on──── ╔═══════════════╗ ───leads-to──▶ FUTURE PROJECT
│   (durable)   │            ║   PROJECT     ║                (loops back)
└──────────────┘            ║   (episode)   ║
                            ╚═══════════════╝
        ┌───────────┬───────────┼───────────┬────────────┬───────────┐
        ▼           ▼           ▼           ▼            ▼           ▼
   many PHOTOS   many       many MATERIALS  many CREW/   many        many
   & VIDEOS      REVIEWS    & VENDORS       EMPLOYEES    EXPENSES    TASKS
        │           │           │              │            │           │
        ▼           ▼           ▼              ▼            ▼           ▼
   many BLOG    many FAQs   many BRANDS    SUBCONTRACTORS  PAYMENTS  CHANGE
   /SOCIAL                  (entity SEO)                            ORDERS
        └───────────┴───────────┴──────────────┴────────────┴───────────┘
                                    │
                                    ▼
                          many AI/INTELLIGENCE OBJECTS
                    (predictions, scores, derived insights, embeddings)
```

Key relationships and *why each matters*:
- **Project → Customer / Property** — the durable anchors; enable lifetime value and home-history.
- **Project → many Media** — marketing + AI vision + before/after.
- **Project → many Reviews** — provenance-linked social proof.
- **Project → many Materials → Brands** — entity associations for SEO/GEO + procurement BI.
- **Project → Crew/Employees/Vendors** — performance BI + the "same lead" story.
- **Project → Expenses/Payments/Change Orders** — profitability + estimate learning.
- **Project → Tasks/Milestones** — operations + timeline prediction.
- **Project → Content (blog/FAQ/social)** — derived marketing.
- **Project → AI objects** — predictions and embeddings that make the corpus queryable.
- **Project → Future Project** — the loop that turns one job into a lifetime.

The richness of this graph is *exactly* what competitors lack and can't fake.

---

## 10. Search Philosophy

Projects must be findable along **every dimension a human, a search engine, or an AI would ask** —
because each query is also a potential SEO landing page and an AI-answerable question. Faceted,
combinable, each facet mapping to a stable URL.

Search/filter dimensions:
- **Service** (roofing, kitchens, decks…) and **sub-service**
- **Location** (state, city, neighborhood, jurisdiction)
- **Budget band** (anonymized tiers)
- **Completion date / recency / season**
- **Material & Manufacturer** (GAF, Owens Corning, quartz, composite…)
- **Style / aesthetic** (modern farmhouse, transitional, historic, luxury)
- **Color / finish**
- **Home type / age / size**
- **Customer type** (residential, luxury, commercial, federal/VA)
- **Crew / project lead** (internal)
- **Warranty / reliability** (internal)
- **Has before/after · has video · has review** (asset filters)
- **Quality / flagship flag** (curation)
- **Profitability tier** (internal BI only)

**Two-audience principle:** every public facet combination (`service × city × style × budget`) is
simultaneously a *human browse path* and an *indexable, AI-citable landing surface*. Internal facets
(crew, margin, profitability) power BI through the operational lens only. Search isn't a feature
bolted on — it's the natural consequence of a well-tagged object graph.

---

## 11. Project Experience (the public page)

The canonical public artifact. Treat each completed project like **an Architectural Digest feature
directed like an Apple launch with the honesty of a Netflix documentary.** Sections, and the four
jobs each does (Trust / SEO / GEO / Conversion):

1. **Cinematic hero** — the finished work, full-bleed; title, service, city. *Trust:* premium signal
   in 2 seconds. *SEO:* H1 + media. *Conversion:* aspiration.
2. **The Before** — honest starting point. *Trust:* vulnerability = credibility. *Conversion:* "my
   house looks like that."
3. **The Brief** — the homeowner's goal in human words. *Conversion:* self-identification. *GEO:*
   natural-language intent match.
4. **The Challenge** — what made it hard. *Trust:* visible expertise. *SEO/GEO:* unique, specific,
   un-spammable content.
5. **The Build** — process media, decisions, materials. *Trust:* craftsmanship shown. *GEO:* dense
   real detail AI loves to cite.
6. **The Reveal** — before/after slider. *Conversion:* the dopamine close. *Trust:* proof of outcome.
7. **The Spec panel** — service, city, budget band, duration, materials, brands. *SEO/GEO:*
   structured facts; entity associations; the exact data AI engines lift. *Trust:* transparency.
8. **The Customer's words** — the linked review, ideally video. *Trust:* third-party validation tied
   to *visible* work. *Conversion:* emotional proof.
9. **The Facts/structured-data block** — machine-readable project facts. *SEO:* rich results. *GEO:*
   citation-ready.
10. **Start your project** — CTA pre-filled with this service + city, routed by market (standard vs.
    design consultation). *Conversion:* friction near zero.
11. **Related projects** — same service/city. *SEO:* internal mesh. *Conversion:* keeps them in the
    proof stream.

**Why this beats every competitor:** Houzz/BuildZoom have the project-content *model* but a cluttered,
un-premium aesthetic; luxury builders have the aesthetic but no scale or structured data. Real Elite
gets *both* — magazine-grade presentation **and** a structured, search/AI-optimized object behind
every page — produced automatically from how the job was already run.

---

## 12. Future Vision — 10,000 projects

At 10,000 projects, the Project Object stops being a record system and becomes a **compounding
intelligence asset** — and the company's deepest moat.

**How it evolves:**
- **The estimate becomes near-perfect.** Cost and timeline predictions trained on 10,000 *actual*
  outcomes (not list prices) beat any human estimator and any competitor's guess. New competitors can
  license the same AI models but have zero ground truth.
- **The map of "what works" sharpens.** Which materials last in which climates, which crews excel at
  which work, which services and markets are most profitable, which job profiles carry risk — all
  known, all data-backed.
- **The content library becomes uncatchable.** 10,000 unique, media-rich, structured,
  locally-specific project pages dominate long-tail SEO and become *the* corpus AI assistants cite
  when a homeowner anywhere in WV/MD/VA asks "who should I hire." You don't rank against competitors;
  you *are* the answer.
- **The relationship graph compounds.** Thousands of Properties with known histories and Customers
  with known lifetime value → proactive, perfectly-timed future-project generation. The cheapest lead
  is the one you already own.
- **Every new project makes every system smarter.** A 10,001st job improves the estimator, the risk
  model, the material advisor, the maintenance planner, and the content library — *automatically.*

**Why it's an irreplaceable competitive advantage:**
A rival can copy the website's *look* in a month. They cannot copy 10,000 projects' worth of
structured cost history, photo corpus, provenance-linked reviews, local permit knowledge, and
relationship graph. That asset took 10,000 jobs and years of disciplined capture to build, and it
grows faster the bigger it gets. **The Project Object is how Real Elite turns the unavoidable work of
running jobs into an ever-growing, compounding, un-copyable asset.** Most contractors run jobs and
forget them. Real Elite runs jobs and *remembers, learns, and gets smarter every single time.* That
difference, compounded over 10,000 projects, is the whole company.

---

## Governance (the part that keeps it correct in 10 years)

Three rules that protect the architecture as it scales:

1. **Permission lenses are part of the object, not an afterthought.** Every facet declares its
   visibility (internal / customer / public / intelligence). Redaction is automatic and central —
   never re-decided per system. This is what prevents margin leaking onto the website or one customer
   seeing another.
2. **Identity is immutable; truth is append-only.** A project's ID and slug never change; history is
   never overwritten, only added to. This guarantees stable URLs (SEO/AI citations don't rot), a
   complete audit trail, and the richest possible learning corpus.
3. **One contract, many consumers.** Website v2, Mission Control, the Portal, the AI Estimator, and
   BI all agree on *one definition* of the Project Object. Define that shared contract **now**, before
   the second system is built, so they never diverge. Repos can be separate; the object's meaning
   cannot.

---

## Closing

The Project Object is not a feature of the website or a table in Mission Control. It is **the central
nervous system of the entire Real Elite ecosystem** — the place where a job becomes proof, learning,
marketing, relationship, and intelligence, all at once, captured once and projected everywhere.
Design it as the operating-system primitive it is, anchor it between the durable Customer and
Property, treat its history as the asset, and govern its lenses rigorously — and it will still be the
correct architecture in 2036.

*This is conceptual product/systems architecture only — no code, no database schema, no
implementation.*
