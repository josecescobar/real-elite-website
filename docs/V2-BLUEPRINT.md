# Real Elite Website v2 — Product Architecture & Design Blueprint

> **Status:** Forward-looking product blueprint. This document describes a *future* vision for
> Website v2 — it is **not** a description of the current production site, and it prescribes no
> immediate code changes. It exists to guide future implementation phases. No runtime code, routes,
> or components are affected by adding this document.
>
> **Scope:** Product architecture and design thinking only. Engineering sequencing notes appear at
> the end, but nothing here is a commitment to build until scoped into its own phase.

---

## 0. The Strategic Thesis (read this first)

Before a single page, three truths must drive every decision. If we get these wrong, beautiful pages
won't matter.

**Truth 1 — You are one brand serving two psychologies.**
The Eastern Panhandle (Martinsburg, Charles Town, Hagerstown, Winchester) buys on *trust,
reliability, and "will they show up and not rip me off."* Northern Virginia (McLean, Great Falls,
Vienna, Middleburg) buys on *taste, discretion, and "will this match the caliber of my home."* The
same roofing crew serves both. The website's hardest job is to feel **trustworthy to the first and
elevated to the second simultaneously** — without two separate sites. The architecture below solves
this with a single premium spine and *market-adaptive proof and conversion paths*, not a split brand.

**Truth 2 — The product is not a website. It's a trust-transfer engine and a content flywheel.**
A contractor's entire problem is *risk perception*. Homeowners are terrified of contractors. Every
element exists to transfer risk off the homeowner. And the engine that compounds is this: **every
completed project becomes a reusable asset** — portfolio, SEO page, case study, review anchor,
service proof, location proof, and AI-citable evidence. Build the project pipeline once; it feeds
everything forever.

**Truth 3 — The atomic unit of the entire site is the *Project Object*, not the page.**
Just as v1 made `constants.ts` the single source of business truth, v2 makes **the Project** the
single source of *proof* truth. One project record (photos, location, service, materials, budget
band, timeline, story, review, before/after) renders into the gallery, a case-study page, a
service-page proof module, a city-page proof module, the review center, and the AI training corpus.
Design the object; the pages assemble themselves.

Everything that follows serves these three truths.

---

## 1. Information Architecture

### Design principle
Shallow, entity-clean, and built around four "proof engines" (Services, Projects, Reviews,
Resources) that cross-link relentlessly. No page is an island; every leaf links up, sideways, and to
a conversion path. Maximum 3 clicks to any page. URLs are stable entities (good for SEO *and* for AI
systems that need durable citations).

### Complete sitemap

```
/                                    Home
│
├── /services                        Services overview (the "what we do" hub)
│   ├── /services/roofing            Service pillar
│   │   └── /services/roofing/{city} Service × City (intent landing)
│   ├── /services/siding
│   ├── /services/decks-outdoor-living
│   ├── /services/kitchens
│   ├── /services/bathrooms
│   ├── /services/basements
│   ├── /services/additions
│   ├── /services/whole-home-remodeling
│   ├── /services/exterior-repairs
│   └── /services/paving             (dedicated pillar, retained)
│
├── /projects                        Project Gallery (the flagship)
│   ├── /projects/{project-slug}     Individual Project Experience (case study)
│   └── (faceted views via query/url: by service, city, style, budget)
│
├── /reviews                         Review Center (not "testimonials")
│   └── /reviews/{review-slug}       Optional deep customer story
│
├── /resources                       Resource Center (knowledge hub)
│   ├── /resources/cost-guides/{slug}
│   ├── /resources/permit-guides/{slug}
│   ├── /resources/comparison/{slug}
│   ├── /resources/maintenance/{slug}
│   ├── /resources/buying-guides/{slug}
│   └── /resources/{evergreen-article-slug}
│
├── /service-areas                   Locations hub
│   └── /service-areas/{city}        City page (local proof + local intent)
│
├── /process                         "How We Work" — the trust spine
├── /about                           Story / Veteran-owned / Family / Team
├── /financing                       Financing
├── /warranty                        Warranty & guarantees
├── /contact                         Contact + estimate
│
├── /estimate                        The conversion engine (multi-path)
│   ├── /estimate/instant-roof       Instant Roof Quote (existing differentiator)
│   └── /estimate/design-consultation  Luxury / high-ticket intake
│
└── Utility: /capability-statement (federal), /veterans, /careers,
            /privacy, /accessibility, /sitemap.xml, /robots.txt
```

### What changed from v1 and why
- **`/gallery` → `/projects`.** "Gallery" is a photo dump. "Projects" are entities with stories,
  locations, services, and reviews attached. This single rename unlocks the flywheel.
- **`/blog` + `/guides` → one `/resources`.** v1 had blog redirecting to guides — a tell that the
  taxonomy was confused. One knowledge brand. Articles, cost guides, and permit guides are *types*
  within it, not separate systems.
- **`/reviews` promoted to a top-level proof engine**, not a testimonial strip.
- **`/process` elevated to primary nav.** For a contractor, *how you work* is the product. It's the
  single highest-trust page and most sites bury it.
- **`/estimate` becomes a hub with multiple calibrated paths** (instant / standard / luxury) instead
  of one form.

### The four cross-linking proof engines
Every Service links to its Projects, its Reviews, its Resources, and its Cities. Every Project links
to its Service, its City, and its Review. Every City links to its Services, its Projects, its
Reviews. This mesh is what makes the site feel infinite, ranks for the long tail, and gives AI
systems a dense, consistent entity graph to cite.

---

## 2. Navigation System

### Philosophy
Navigation should answer the only three questions a homeowner has: *Can you do my project? Can I
trust you? What's the next step?* Everything else is secondary.

### Desktop (primary)
A slim, persistent top bar. Left: wordmark. Center: five anchors — **Services · Projects · Reviews ·
Resources · Process**. Right: a phone number (one-tap intent) and a single high-contrast **"Get
Estimate"** button. Five center items, not eight — Linear/Stripe restraint. The veteran-owned mark
sits as a small, dignified badge near the wordmark, never as a loud banner.

**Services mega-menu:** opens to a two-column structure — left, service categories grouped (Interior
/ Exterior / Structural); right, a *live "Featured Project"* card pulled from the Project Object
pool. The menu itself becomes proof. No walls of text.

### Mobile
Bottom-anchored action bar is the single most important mobile decision: **Call · Estimate · Menu**
always reachable by thumb. The hamburger opens a full-screen, large-tap-target menu with the same
five anchors and a search field at top. Mobile is where 70%+ of contractor traffic lives and where
panic-Googling-a-leaking-roof happens — the path to "call" must be zero-friction.

### Sticky / contextual navigation
- **Service & Project pages:** a sticky sub-nav (a slim in-page rail) that tracks scroll position —
  "Overview · Scope · Investment · Proof · FAQ · Estimate." Gives long pages a sense of structure
  and keeps the CTA persistent.
- **The estimate CTA is *context-aware*:** on a roofing page it says "Get my roof estimate" and
  deep-links the form pre-filled; on a McLean kitchen page it routes to design-consultation. The nav
  adapts to intent.

### Footer (the "everything map")
Four columns: **Services · Service Areas · Resources · Company**, plus NAP (name/address/phone — must
be byte-identical to schema for GEO), license numbers, veteran/insurance badges, and social. The
footer is both a sitemap for crawlers/AI and a final trust panel for humans. Hours and license
numbers visible here build more trust than people consciously notice.

### Breadcrumb philosophy
Breadcrumbs everywhere except home and the estimate flow. They serve three masters: orientation
(human), `BreadcrumbList` schema (Google rich results), and entity hierarchy (AI systems parsing
"this project belongs to this service in this city"). Breadcrumbs are not decoration — they're how
machines understand your site's shape.

### Search philosophy
**Phase 1: scoped, not global.** A search that returns three weak results destroys trust. Start with
*faceted filtering inside Projects and Resources* (which feels like search but always returns rich
results), and a command-style global search (⌘K-flavored, Linear-inspired) only once content depth
justifies it. **Phase 2:** an AI-answered search box ("How much does a deck cost in Loudoun
County?") that responds with a synthesized, cited answer drawn from your own Resources + Projects —
this is the GEO moat (see §11).

---

## 3. Homepage Blueprint

The homepage is a **trust escalator**. Each section answers the next objection in the exact order a
skeptical homeowner raises it. The psychology *is* the layout.

**Section 1 — Hero: Identity + Promise + Proof of caliber.**
A single, full-bleed *real* project photograph (never stock), shot like an architectural magazine
cover. One headline that fuses both markets: a confident statement of premium craft with the veteran
spine underneath. One primary CTA ("Get a Free Estimate"), one secondary ("See Our Work"). The
hero's job in 2 seconds: *this is a serious, premium, trustworthy operation.* No carousel (carousels
are indecision made visible). No stat-stuffing.

**Section 2 — Trust bar (immediate risk-off).**
A quiet band: Veteran-Owned · Licensed & Insured (WV/MD/VA) · Workmanship Warranty · [Real Google
rating once verified]. This catches the user who needs permission to keep scrolling. Honest gating:
nothing shown until verified (v1 already does this correctly — keep that integrity).

**Section 3 — Services as visual entry points.**
Not a list — a grid of photographed service cards (roofing, kitchens, decks, additions…), each a
doorway. Psychology: let the visitor self-select their intent immediately. The card uses a real
project image, so even the menu is proof.

**Section 4 — The Proof Wall (Projects).**
A curated set of 3–6 flagship projects, presented cinematically — large imagery, location + service
caption, "before/after" hint. This is the emotional core. People don't buy contractors; they buy
*the outcome they can see happening to a house like theirs.* CTA: "Explore all projects."

**Section 5 — Process (de-risking).**
The 4-step "Military Precision" method shown as a confident, numbered sequence (Recon → Plan →
Execute → Inspect). This converts the anxious mid-funnel visitor by making the unknown legible. A
contractor who *shows their system* is a contractor who has one.

**Section 6 — Reviews (social proof, real voices).**
Three to five strong reviews, each *linked to its project* where possible ("Kitchen remodel, Vienna
VA" → the actual project page). Reviews that connect to visible work are exponentially more credible
than floating quotes. CTA: "Read the Review Center."

**Section 7 — Why Real Elite (differentiation + values).**
Veteran-owned, family-operated, same project lead from estimate to final walk-through, no upselling.
This is where the *brand soul* lives — the reason to choose them over the equally-licensed
competitor.

**Section 8 — Resources teaser (authority + GEO).**
Two or three cost/buying guides. Signals expertise, captures researchers, and feeds AI systems
content to cite. "Planning a project? Start here."

**Section 9 — Service areas (local relevance).**
A clean map/list of WV/MD/VA markets, each linking to its city page. Confirms "yes, they serve me" —
a surprisingly load-bearing trust signal.

**Section 10 — Final CTA (the close).**
A confident, full-width invitation with the dual path: instant roof quote *or* free estimate *or*
(for premium intent) design consultation. Phone number repeated. Reassurance microcopy: "A real
project lead — not a call center — responds within one business day."

**CTA placement rule:** primary CTA visible at hero, after process, after reviews, and at close —
four touchpoints, never nagging. The mobile sticky bar covers everything in between.

**What the homepage deliberately does NOT do:** no popups, no chatbot-on-arrival, no "we've been in
business since…" wall of text up top, no auto-playing video with sound. Restraint reads as
confidence.

---

## 4. Service Page Blueprint

The service page is a **conversion machine disguised as an information page.** Every section earns
its place against five scorecards: Trust, Conversion, SEO, GEO, AI-recommendation.

**Hero** — Service name, one-line value proposition, real project image, contextual CTA. *SEO:* H1 +
primary keyword. *Trust:* immediate visual proof.

**The Answer Block (new, critical for GEO/AEO)** — A concise, structured 2–3 sentence summary
directly answering "What does [Real Elite] do for [service] and who is it for?" *Why:* this is the
block Google's AI Overviews and ChatGPT/Perplexity lift and cite. Writing the citable answer
yourself is how you control the AI narrative. Followed by a short scannable "What's included" list.

**Scope / What's Included** — A checklist of exactly what the service covers. *Trust:* eliminates
"what am I actually getting" anxiety. *Conversion:* sets expectations that pre-qualify.

**Investment Ranges** — Honest budget bands (Good / Better / Best tiers) with what drives cost.
*Trust:* the single most disarming thing a contractor can do is talk price first. *Conversion:*
self-qualifies leads so the sales team talks to serious buyers. *GEO:* answers the #1 AI-queried
question ("how much does X cost").

**Proof Module (auto-assembled from Project Objects)** — Real projects for *this service*, filtered
to the visitor's region when known. *This is the flywheel paying off.* No generic gallery — projects
tagged to this exact service.

**Process (service-specific)** — How a roof job specifically runs. Reuses the master process,
specialized.

**Materials & Partners** — Brands used (GAF, Owens Corning, etc.), warranties. *Trust + SEO + GEO:*
entity associations with known brands raise authority for humans and machines alike.

**Local Areas Served** — Cities where this service is offered, each linked. *SEO:* internal mesh.
*Trust:* "they work in my town."

**FAQ (structured)** — 6–10 real questions with `FAQPage` schema. *GEO/AEO:* the richest AI-citation
surface on the page. Each answer written as a standalone, quotable unit.

**Reviews for this service** — Pulled from the Review Center, filtered to the service.

**Conversion close** — Service-specific estimate CTA + phone.

**The market-adaptive layer:** on luxury-market service×city pages (e.g.,
`/services/kitchens/mclean-va`), the page swaps the standard estimate rail for the
design-consultation path, leads with design/discretion language, and surfaces higher-end projects.
Same skeleton, calibrated proof and tone. This is how one architecture serves two psychologies.

---

## 5. Project Experience (the flagship)

Treat every completed project like **an Apple product launch crossed with an architectural-magazine
feature crossed with a Netflix mini-documentary.** This is the most under-exploited asset in the
entire contracting industry. Nobody does this well. It's the single biggest opportunity.

### The Project Object (the data model engineering must build)
One record contains: title, slug, service(s), city + neighborhood, home style, budget band,
duration, materials, the homeowner's goal, the challenge, the Real Elite solution, before/after
image pairs, process photography, a hero film/photo, the linked review, the linked crew/project
lead, and 2–3 "outcome" pull-quotes. **This object is authored once and renders everywhere.**

### The Project Page experience (top to bottom)
1. **Cinematic open** — full-bleed hero of the finished work, project title, location, service.
   Magazine cover energy.
2. **The Before** — honest "here's where we started." Vulnerability builds credibility; the gap is
   the story.
3. **The Brief** — what the homeowners wanted, in human terms. The visitor projects themselves onto
   this.
4. **The Challenge** — what made it hard (structural surprise, historic constraints, tight
   timeline). This is where *expertise* becomes visible.
5. **The Build** — process photography, materials, decisions. The "documentary" act. Optional
   timeline scrubber.
6. **The Reveal** — before/after sliders, the payoff. Dopamine.
7. **The Details** — materials, finishes, specs (architectural-magazine spec panel). *SEO/GEO gold:*
   dense, real, structured detail.
8. **The Customer's Words** — the linked review, ideally video. The emotional close.
9. **The Facts panel** — service, city, budget band, duration, materials — structured for humans
   *and* `Project`/`CreativeWork` + breadcrumb schema.
10. **"Start your project"** — CTA that pre-fills the form with this project's service + city.
11. **Related projects** — same service or same city. Keeps people in the proof stream.

### Why this is the keystone
- **Marketing:** shareable, beautiful, the thing crews are proud to send.
- **SEO:** a deep, unique, media-rich page for every job — long-tail location+service authority no
  competitor matches.
- **Sales:** "Here's a McLean kitchen we did at your budget" — sent as a link, closes deals.
- **Portfolio + Case Study + Customer Story:** all the same object, no extra work.
- **AI training/citation data:** structured, real, local, specific — exactly what AI recommendation
  engines reward when answering "best kitchen remodeler in Loudoun County."

The discipline required: **photography standards and a capture workflow on every job.** The website's
quality ceiling is set by the camera on the job site. This is a process commitment, not a design one
— flag it loudly to leadership.

---

## 6. Review Center

Not testimonials. A **Review Center** — a searchable, filterable, *connected* proof engine.

### Experience
- **Filter and search** by service, city, project type, rating, and "has video / has photos / has
  linked project."
- **Project linking (the differentiator):** every review that maps to a project shows a thumbnail
  and links to the full Project Experience. A review you can *see the work behind* is worth ten
  floating quotes.
- **Location linking:** "Reviews in Winchester" — feeds city pages and local trust.
- **Service linking:** "Roofing reviews" — feeds service pages.
- **Google integration:** pull and display real Google Business Profile reviews (with the verified
  aggregate rating — honest gating preserved), plus deep-link to leave one. Velocity of Google
  reviews is the #1 local-pack ranking input; the Review Center should actively drive new reviews
  (the existing speed-to-lead/review-request engine plugs in here).
- **Video reviews:** a 20-second homeowner clip outperforms any paragraph. Design a prominent lane
  for them.
- **Customer Stories:** the long-form, editorial version — a homeowner's full journey, blending
  review + project + process. The "documentary" tier of social proof.

### Architecture note
Reviews, like projects, are **objects** that render into the center, service pages, city pages,
project pages, and homepage. Author once, surface everywhere. Same flywheel.

---

## 7. Resource Center

The **authority and GEO engine.** Its job: be the source AI systems and homeowners both quote.

### Structure (types, one brand)
- **Cost Guides** — "What does a [service] cost in [region]" — the most-searched, most-AI-queried
  content in home improvement.
- **Permit Guides** — local permitting by jurisdiction (Berkeley County, Loudoun County,
  Frederick…). Almost nobody does hyper-local permit content; it's a moat.
- **Comparison Guides** — material vs material, repair vs replace, contractor vs DIY.
- **Maintenance Guides** — seasonal home care; keeps past customers returning (retention +
  referral).
- **Buying Guides** — how to choose materials, contractors, financing.
- **Financing / Warranty explainers.**
- **FAQs** — aggregated, structured, and cross-linked to services.

### Design principles
Every article opens with a **citable answer block** (the lift-able summary), uses real local
specifics, links to relevant Services and Projects, and carries `Article` + `FAQPage` schema.
Editorial, calm, expert — Stripe-docs clarity, not SEO-farm clutter. *The Resource Center is how you
win the war that's moving from Google rankings to AI citations.*

---

## 8. Project Gallery

The **best contractor gallery in America** = a faceted browsing experience over the Project Object
pool, not a lightbox of photos.

### Faceting
Filter and combine by: **Service · City/Region · Home Style · Budget Band · Materials · Before/After
available · Most Recent.** Every facet maps to a real, indexable, shareable URL
(`/projects?service=kitchens&city=mclean-va`) — browsing for humans, landing pages for SEO.

### Experience
- A dense, beautiful masonry/grid of real project imagery — Airbnb-grade visual browsing.
- Hover/tap reveals service + location + budget band.
- A **Before/After toggle** at the grid level — instantly satisfying, instantly differentiating.
- Each tile opens the full Project Experience (§5), never a dead-end lightbox.
- "Projects near you" personalization when region is known.
- Optional **style/inspiration view** (by aesthetic — modern farmhouse, transitional, classic) for
  the design-led NoVA buyer who shops on taste.

The gallery is the *top of the proof funnel*; the Project page is the *bottom*. They're one system.

---

## 9. Customer Journey

The site must serve the entire arc, not just the click-to-lead moment. Most contractor sites die at
"estimate" — the compounding value is everything after.

| Stage | Homeowner state | What the site provides |
|---|---|---|
| **Visitor** | Curious / anxious | Premium hero, instant trust bar, zero friction |
| **Research** | Comparing, learning | Resources, cost guides, projects, reviews |
| **Trust** | "Can I believe them?" | Process page, veteran/family story, real reviews tied to real work |
| **Estimate** | Ready to act | Calibrated paths: instant roof quote / standard / design consultation |
| **Planning** | Committed, nervous | (Portal, §11) scope, schedule, selections, expectations set |
| **Construction** | Living through it | Portal: daily/weekly updates, photos, the same project lead, no silence |
| **Warranty** | Post-completion | Clear warranty record, one-tap service request |
| **Maintenance** | Homeowner over time | Seasonal guides, reminders, "your home dashboard" |
| **Future Project** | New need years later | Personalized re-engagement: "your deck is 6 years old…" |
| **Referral** | Advocate | Easy referral, review prompts, shareable project page of *their own home* |

**The strategic point:** the website v2 is the front door to a **lifetime relationship platform**
(where Mission Control and the customer portal eventually live), not a lead form. Architect for the
whole arc now, even if we build the front of it first.

---

## 10. Design System Philosophy

The aesthetic target: **the confidence of Apple, the restraint of Linear, the warmth of Airbnb, the
precision of Stripe — applied to a veteran-owned builder.** "Military Precision. Civilian
Excellence." should be *felt* in the design, not just written.

- **Typography:** a strong condensed display face for headlines (precision, structure, masculine
  confidence — the existing Saira Condensed direction is right) paired with a calm, humanist body
  face (Inter-class) for warmth and readability. Two families, ruthless consistency. Type *is* the
  brand voice.
- **Spacing & grid:** generous, architectural whitespace. Premium = breathing room. A disciplined
  12-column grid and a strict spacing scale (this is exactly the spacing-token work flagged for
  engineering Phase 2). Cramped = cheap.
- **Color:** deep navy (authority, trust, the "military" register) as the spine; warm neutrals and
  editorial off-whites for calm; a single disciplined red reserved *only* for primary action
  (precision, urgency, never decoration). Restraint in color is what separates premium from loud.
  The existing navy/steel/charcoal/brand-red system is already on the right path — formalize and
  protect it.
- **Photography (the make-or-break):** real, consistent, cinematic, well-lit, human. *No stock.*
  Photography is 70% of the perceived quality of a contractor site. The design system must include a
  *photography standard* and the capture workflow that feeds it.
- **Cards, buttons, forms:** quiet elevation, soft but precise corners, obvious focus states (the
  focus-ring tokens already shipped), generous tap targets, forms that feel like a calm conversation
  not an interrogation. One visual language for every interactive element.
- **Motion:** purposeful, physics-based, fast. Reveal-on-scroll for proof, before/after transitions,
  subtle parallax on project heroes. **Motion communicates competence** — but every animation must
  respect reduced-motion and never delay content. Linear's rule: motion clarifies, never decorates.
- **Iconography:** a single line-icon set, consistent weight, used sparingly.

The reasoning throughline: **every design decision either adds trust or removes friction. If it does
neither, it's deleted.**

---

## 11. Future AI Experience (2030)

Design the *experience*, not the implementation. The throughline: AI removes the two things
homeowners hate — *uncertainty* and *waiting*.

- **AI Project Advisor:** a conversational guide on the site ("I want to redo my primary bath, ~$40k,
  modern, in Vienna") that returns a scoped direction, relevant projects, a budget band, and a
  booked consultation — answered from Real Elite's *own* project + resource corpus. This is also the
  GEO endgame: the same corpus that powers it is what external AI engines cite.
- **AI Cost Assistant:** instant, honest ballpark ranges by project + zip + scope, evolving the
  Instant Roof Quote into every service.
- **AI Material Advisor:** "show me roofing that suits a 1920s Charles Town home" → curated materials
  with real local examples.
- **AI Visualizer:** upload a photo of your kitchen/roof/exterior → see Real Elite's work applied.
  The "try it on your house" moment that collapses imagination risk.
- **AI Permit Assistant:** "what's required in Loudoun County for an addition" — instant,
  jurisdiction-specific answers from the permit-guide corpus.
- **AI Customer Portal:** during the build — natural-language status ("when are the cabinets
  arriving?"), photo timelines, the same project lead augmented (never replaced) by AI.
- **AI Home Dashboard:** post-build — your home's record (what was done, warranties, materials,
  maintenance schedule), proactive nudges, one-tap service. This is the retention/referral engine
  that turns one project into a lifetime.
- **Mission Control integration:** the public site and the internal ops platform share the **same
  Project, Review, and Customer objects.** A job completed in Mission Control auto-publishes a
  Project draft to the site; a site lead flows into Mission Control. The website becomes the *public
  membrane* of one operating system. **Keep the repos separate (as instructed) but design the data
  contracts now** so they speak the same language later.

Design rule for all of it: **AI augments the human relationship, never hides it.** The veteran-owned,
"same lead from estimate to walk-through" promise is the brand — AI makes it faster and more
transparent, it doesn't replace the handshake.

---

## 12. What Should Be Removed (brutally honest)

- **"Gallery" as a concept** — replaced by Projects. A photo dump with no story, location, or link
  is wasted proof.
- **The blog/guides split** — confusing duplicate taxonomy (the v1 redirect was the symptom).
  Collapse into Resources.
- **Any floating testimonials** not tied to a real project or person — low-credibility, AI-ignored,
  easily seen as fabricated.
- **Stat-stuffed / badge-stuffed heroes** — "1000+ projects, 50 years, 5 stars" walls read as
  insecurity. One honest, verified signal beats ten unverifiable ones.
- **Carousels/sliders in the hero** — indecision rendered as UI; nobody sees slide 3.
- **Generic stock photography anywhere** — instantly fatal to a premium contractor's credibility.
- **Thin doorway pages** — auto-spun service×city pages with no unique local content. v1 was
  *correct* to gate these behind hand-written content; v2 must hold that line even harder (Google
  and AI both punish thin local spam).
- **Multiple disconnected forms** — consolidate into the calibrated `/estimate` hub.
- **Anything that talks about the company before it proves value to the homeowner** — "About Us"
  content up top is a conversion leak. Earn the bio.
- **Long, undifferentiated FAQ dumps** — restructure into per-service, schema'd, citable units.

The meta-critique: v1's *engineering* is excellent; its **proof architecture is underbuilt.** v2's
whole job is to turn work-done into proof-shown.

---

## 13. Competitive Analysis — principles to steal

- **Apple** — *one idea per screen, ruthless reduction, product-as-hero.* Steal: cinematic project
  pages, restraint, confidence through whitespace.
- **Tesla** — *configurator psychology, instant gratification.* Steal: the Instant Quote / AI Cost
  Assistant as the "configure your project" moment.
- **Vercel** — *technical credibility through clarity and motion.* Steal: precise, fast, modern feel;
  the command-search philosophy.
- **Stripe** — *make a scary, complex thing feel safe and legible through documentation and clarity.*
  Steal: the Resource Center as trust infrastructure; pricing/cost transparency as a feature.
- **Linear** — *opinionated minimalism, purposeful motion, no clutter.* Steal: the navigation
  restraint and the design-system discipline.
- **Airbnb** — *trust between strangers via reviews, photos, and human stories; world-class faceted
  browsing.* Steal: the Project Gallery faceting and the review-tied-to-real-thing model. Airbnb is
  the closest analog — Real Elite is also selling trust in a high-stakes, infrequent, expensive
  decision.
- **Houzz / BuildZoom** — *aggregators of projects and reviews.* Lesson (mostly cautionary): they own
  the project+review format but feel like marketplaces — cluttered, un-premium, brand-diluting. Real
  Elite should take their *content model* and reject their *aesthetic*. Own your own Houzz,
  beautifully.
- **High-end architecture firms / luxury home builders** — *editorial restraint, photography as the
  entire product, project-as-portfolio.* Steal: the magazine-grade project presentation and the
  discretion the NoVA market expects.

**The synthesis:** *Airbnb's trust model + Apple's restraint + Stripe's clarity + a luxury builder's
photography, run on Linear-grade design discipline.* No contractor in America is operating at this
level. That's the whole opportunity.

---

## 14. Final Vision — the narrative

> It's a Tuesday evening in 2030. A homeowner in Great Falls, Virginia, has water staining the
> ceiling of a primary bath she's hated for a decade. She's anxious — the last contractor she hired
> ghosted her mid-project. She types "Real Elite Contracting" after a neighbor mentioned them.
>
> The page loads instantly. No popup, no chatbot lunging at her. Just a single, quiet, breathtaking
> photograph — a finished bathroom in a home that looks like hers, lit like a magazine — and one calm
> line of type that tells her these people are serious. Her shoulders drop half an inch. *This feels
> different.*
>
> She scrolls. A discreet line: Veteran-Owned. Licensed in Virginia. Workmanship Warranty. 4.9 on
> Google, verified. She doesn't consciously register it, but the fear recedes another notch. Below, a
> wall of real projects — and she taps one: a primary bath in McLean, near her budget. It opens like
> a story. *Here's where we started* — a tired room not unlike hers. *Here's what they wanted.* She's
> nodding; they wanted what she wants. *Here's what made it hard* — a hidden leak behind the old
> tile, exactly the kind of surprise she's terrified of — *and here's how we handled it.* Then the
> reveal: a before/after slider she drags back and forth three times, smiling. At the bottom, a
> 20-second video — the actual homeowner, in the actual room, saying the actual words: "They were the
> only ones who told me the truth about the cost up front."
>
> That line decides it. She wants the truth about her cost.
>
> She opens the AI Project Advisor and types like she's texting a friend: *primary bath, modern,
> maybe forty thousand, Great Falls.* In seconds: an honest range, three projects at that level, a
> clear "here's what drives the number," and a single button — *Book a design consultation.* She
> picks Thursday at 6. The confirmation tells her the name of the project lead who'll walk her home —
> a real person, who will be the same person from estimate to the final walk-through.
>
> The whole thing took six minutes. She never felt sold to. She felt *understood, informed, and
> safe.* She closes her laptop already telling her husband she found the one.
>
> That is the product. Not a website — **the moment a frightened homeowner decides to trust a
> builder.** Engineering's job is to build the machine that creates that moment, at scale, for every
> homeowner across WV, MD, and Virginia. Everything in this blueprint exists to manufacture that six
> minutes.

---

## Appendix — Suggested implementation sequencing (for future phases)

This is guidance, not a commitment. Each item should be scoped into its own phase before any build.

1. **The Project Object + Project Experience + Gallery** — the flywheel keystone; unlocks the most
   value.
2. **Review Center** (objectized, Google-integrated) — compounds with Projects.
3. **Resource Center consolidation** + citable answer blocks — the GEO moat.
4. **Service/City pages re-platformed** onto the proof modules + the deferred content-architecture
   refactor (the `CONTENT` monolith flagged in `docs/PHASE-1-REPORT.md`).
5. **Navigation + design-system formalization** (spacing tokens, motion) from the v1 Phase-2 backlog.
6. **AI + Portal + Mission Control data contracts** — design the objects now, build progressively.

> Cross-reference: `docs/PHASE-1-REPORT.md` for the v1 foundation audit and the engineering Phase 2/3
> backlog this blueprint builds upon.
