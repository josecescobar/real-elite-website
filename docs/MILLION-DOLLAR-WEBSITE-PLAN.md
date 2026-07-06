# The Million-Dollar Website — Full Audit, Architecture & Implementation Plan

> **Date:** 2026-07-06 · **Audited by:** Claude Fable 5 (four parallel deep audits + full build/test verification)
> **Executes on:** Claude Opus 4.8, one phase per session, in order.
> **Builds on:** `docs/V2-BLUEPRINT.md` (product vision) · `research/00-master-synthesis.md` (market intelligence) · `docs/PHASE-1-REPORT.md` (engineering hardening).
>
> **Definition of "million-dollar website":** a site that reliably feeds **$1M+/year in contracted revenue** — measured, not guessed. The math (Part 4) shows the pipeline: ~2–3 qualified leads/week at Real Elite's job values gets there. Every task below exists to move one of three numbers: **qualified leads × close rate × average job value.**

---

## Part 1 — The Audit (verified current state)

Full production build, typecheck, and 263/263 tests pass. 170 URLs in the live sitemap: 74 under `/services` (including 62 service×city pages), 28 blog, 24 service-area city pages, 17 paving, 10 resources, 2 projects, 15 one-off pages.

### Scorecard

| Dimension | Grade | One-line verdict |
|---|---|---|
| Engineering & architecture | **A (8.6/10)** | Production-grade. Single-source-of-truth data, env-gated integrations, rate limits, security headers, zero TODOs. Ship-ready. |
| Design system & UX | **A−** | Premium, intentional navy/steel/red system; strong a11y; sticky mobile CTA; honest luxury tier. Not a template. |
| Honesty & trust compliance | **A** | No fake reviews, no owner name, no founding-date claims, inspiration imagery clearly labeled, schema gated behind `SOCIAL_PROOF.verified`. |
| Conversion capture | **B+** | Three excellent intake paths (multi-step estimate, instant roof quote, luxury consultation), honeypots + rate limiting. Speed-to-lead SMS coded but dormant (env vars). |
| **Conversion measurement** | **D** | Events fire, but **no GA4 key events/conversions configured, no ad-platform conversion wiring, no lead ledger, no source attribution, no customer confirmation email.** Flying blind. |
| **Proof (projects & reviews)** | **D+** | The machinery is elite; the tank is empty. **1 published project.** Review Center is types-only. `SOCIAL_PROOF.verified = false` because there's no verified Google rating yet. |
| SEO (technical) | **B+** | Metadata factory, canonicals, per-route OG images, sitemap/robots, GeneralContractor + Service + FAQ + Article + Breadcrumb schema. Gaps: breadcrumbs missing on blog/resource routes; FAQ schema coverage unverified on some services. |
| GEO / AI-search readiness | **C+** | Resource Center taxonomy shipped; answer blocks on only **3 of 27 articles**; no `llms.txt`; project/review corpus too thin for AI engines to cite. 22% of homeowners now start in ChatGPT (research §6). |
| Local coverage | **B** | 24 city pages + 62 service×city pages + 10 paving locations, honestly gated. Expansion-market pages lean on shared copy; few city-tagged photos/reviews yet. |

**Bottom line:** This is a **top-1% contractor codebase** wearing an **empty trophy case**, with the **scoreboard unplugged**. The next million dollars is not in more code elegance — it's in (1) turning on measurement + speed-to-lead, (2) filling the proof engines with real projects and reviews, (3) owning the answers AI engines cite, and (4) deepening local pages. That's exactly what this plan sequences.

### Verified findings that drive the plan

Each item was verified in code by the audit (not assumed). File references are for the implementing session.

**F1 — Measurement blind spot (highest-leverage fix in the whole plan).**
`src/lib/analytics.ts` fires custom events (`form_submit`, `roof_quote_submit`, `phone_click`, `estimate_step_*`) but nothing is registered as a GA4 key event / conversion, there is no Google Ads conversion tag, no UTM/source capture into the lead email, no lead persistence beyond the inbox, and no confirmation email to the customer. Consequence: cost-per-lead, channel ROI, and form completion rate are unknowable, and paid channels (LSA/Ads per research §6) can't be optimized.

**F2 — Proof engine empty.**
`src/lib/projects/` (registry + template + tests) is excellent and drop-a-file automated, but holds **one** project (`victorian-roof-replacement-martinsburg-wv`). `src/lib/reviews/types.ts` is a well-designed contract with **zero consumers**. `/reviews` renders three floating first-party testimonials from `TESTIMONIALS` in `src/lib/constants.ts`. V2 Blueprint truth #3 ("the atomic unit is the Project Object") is architected but unfueled.

**F3 — Trust bar can't reach its final form without real Google reviews.**
`SOCIAL_PROOF.verified=false` correctly suppresses ratings/schema until a real Google rating exists. The unlock is operational (get reviews), assisted by the already-built `/review-request` SMS tool — which is dormant pending `ADMIN_TOOLS_KEY` + Twilio env vars.

**F4 — GEO gaps.**
Answer blocks: 3/27 articles. BreadcrumbList schema present on service/city/paving/project templates but **missing on `/blog/[slug]` and `/resources/[category]`**. No `llms.txt`. FAQ schema present on major templates; per-service coverage needs a one-hour verification pass. (Note: the site **does** emit GeneralContractor/LocalBusiness schema in `src/app/layout.tsx:164` — an earlier draft finding to the contrary was checked and is wrong.)

**F5 — High-intent content gaps (money keywords with no page).**
No dedicated pages for: roof replacement **cost** per market, basement finishing cost (Martinsburg/Charles Town/Loudoun), walk-in shower cost, egress window cost, driveway repair-vs-replace, deck cost calculator-style guide. Investment-range data to answer these honestly already exists in `src/lib/services-data.ts`.

**F6 — Conversion-path polish.**
`/design-consultation` (the $50k–$500k funnel) is only reachable from luxury city-page rails — not from nav, footer, or homepage. Success states end dead (no secondary CTA, no guide download, no booking option). Step-3 abandoners with typed contact info are lost silently.

**F7 — Dormant integrations (owner-side, 30 minutes total).**
Missing env vars in Vercel: `RESEND_API_KEY` (**without it the estimate form 503s — leads lost**; verify immediately), Twilio 4-pack (speed-to-lead SMS + missed-call text-back), `ADMIN_TOOLS_KEY` (review tool), `GOOGLE_SOLAR_API_KEY` (instant-quote auto-measure), `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_CLARITY_ID`, Upstash pair (global rate limits).

**F8 — Small verified fixes.** `ReviewRequestTool.tsx` hardcodes placeholder `(304) 555-0123` instead of `BUSINESS.phone`; `src/lib/projects/types.ts` references `docs/PROJECT-OBJECT-SPEC.md` which doesn't exist on main; desktop mega-menu lacks `role="navigation"`/`aria-label`; hero eyebrow (charcoal-200 on navy) sits near the AA contrast line.

---

## Part 2 — Target Architecture: five systems, three objects

The V2 Blueprint stays the product vision. This is the **build architecture** that realizes it. Everything groups into five systems on top of three data contracts.

### The three objects (data contracts)

| Object | Status | Contract |
|---|---|---|
| **Project** | ✅ Shipped (`src/lib/projects/types.ts`), 1 record | Authored once → renders on `/projects/[slug]`, gallery, service/city proof rails, homepage, OG, schema. |
| **Review** | ✅ Types shipped (`src/lib/reviews/types.ts`), no consumers | Single review shape (google \| first-party \| project) with `verified` gating JSON-LD. Renders in Review Center, service/city/project pages, homepage. |
| **Lead** | ❌ To define (Phase 0) | Every submission from any form: `{id, ts, source(form), service, citySlug?, zip, budget?, timeline?, contact, utm{source,medium,campaign}, luxury:boolean}`. Persisted fire-and-forget; email/SMS remain the delivery path. |

### The five systems

1. **Measurement System** *(Phase 0)* — GA4 key events with one canonical event vocabulary, ad-platform conversion hooks, UTM capture, Lead ledger, weekly numbers Jose can read. *Nothing else in the plan can be proven to work without this.*
2. **Proof System** *(Phase 1)* — Project pipeline (photo checklist → drop-a-file object → everywhere) + Review Center on the Review contract + Google-review velocity via the review-request tool. Unlocks `SOCIAL_PROOF.verified=true`.
3. **Authority System (GEO)** *(Phase 2)* — Answer blocks on 100% of articles, cost-guide cluster for money keywords, complete schema mesh (breadcrumbs everywhere, FAQ coverage verified), `llms.txt`, citable-answer components on service pages.
4. **Conversion System** *(Phase 3)* — `/estimate` hub with three calibrated paths (instant / standard / luxury), luxury funnel discoverability, success-state second acts, partial-lead capture. Speed-to-lead already coded — activated in Phase 0 by env vars.
5. **Local System** *(Phase 4)* — City pages deepened with city-tagged projects/reviews/photos and permit micro-content; expansion only where content is real (the anti-doorway rule holds).

### Target page map (delta from today)

```
NEW   /estimate                    Conversion hub: chooses path (instant roof / standard / design consultation)
NEW   /resources/cost-guides/*     6–10 money-keyword cost guides (Phase 2)
MOVE  /reviews                     Rebuilt as Review Center on the Review contract (filter by service/city/source)
GROW  /projects/[slug]             1 → 10–12 published projects (Phase 1)
KEEP  everything else              (redirects preserved; blog URLs canonical; no URL churn)
```

---

## Part 3 — Implementation Plan (for Opus 4.8)

### How to execute (session protocol)

- One phase per session/branch (`claude/mdw-phase-<n>-<slug>`), PR to `main` per repo convention. Run `npm run typecheck && npm run test && npm run build` before every PR; keep 263+ tests green and add tests alongside new logic (match existing patterns in `src/lib/*.test.ts`).
- **Voice rules (from Jose's reverts, `docs/SESSION-NOTES-2026-06-24.md`):** never rewrite shipped copy on Hero/TrustBar/blog; structural additions are fine; luxury surfaces stay refined — zero humor.
- **Honesty rules (non-negotiable, Part 5):** no review/aggregate schema unless `verified`; no owner name; no founding-date claims; no stock imagery presented as work; no thin doorway pages.
- Phases 0→2 are the revenue-critical path. 3→4 follow. 5 is optional platform work. Within a phase, tasks are ordered; tasks marked **[JOSE]** are owner-side and can't be coded around.

---

### Phase 0 — Turn on the lights (measurement + activation) · ~1 session + 30 min of Jose's time

**Why first:** every later phase claims a revenue effect; without this phase none of it is provable, and today the form may be silently returning 503s if `RESEND_API_KEY` is unset.

| # | Task | Files / where | Acceptance criteria |
|---|---|---|---|
| 0.1 | **[JOSE]** Set env vars in Vercel → Settings → Environment Variables: `RESEND_API_KEY` (critical), `TWILIO_ACCOUNT_SID/AUTH_TOKEN/FROM_NUMBER/TO_NUMBER`, `ADMIN_TOOLS_KEY`, `GOOGLE_SOLAR_API_KEY`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_CLARITY_ID`, `UPSTASH_REDIS_REST_URL/TOKEN`. Guides already exist: `docs/SPEED_TO_LEAD_SETUP.md`, `docs/MISSED_CALL_TEXTBACK_SETUP.md`, `docs/REVIEW_ENGINE_SETUP.md`. | Vercel dashboard | Test submission on `/contact` arrives by email **and** SMS; `/instant-roof-quote` auto-measures a Martinsburg address. |
| 0.2 | Canonical event vocabulary: standardize to GA4 recommended `generate_lead` (params: `lead_type: estimate\|roof_quote\|luxury_consultation`, `service`, `city`, `value` band) fired alongside existing events on all three form successes; keep `phone_click`/`sms_click` with `location` param. Single helper in `src/lib/analytics.ts`. | `src/lib/analytics.ts`, `MultiStepEstimateForm.tsx`, `RoofQuoteTool.tsx`, `LuxuryConsultationForm.tsx` | One grep-able event name for "a lead happened"; unit tests assert payload shape. |
| 0.3 | UTM/source attribution: tiny first-touch capture (sessionStorage) of `utm_*` + referrer + landing path; append to every lead payload; render a "Source" row in the lead email. | new `src/lib/attribution.ts` (+ test), the three forms, `src/app/api/estimate/route.ts` email template | Lead email shows `Source: google / lsa / (direct)` etc.; no PII stored client-side beyond the session. |
| 0.4 | **Lead ledger:** define the Lead type; on `/api/estimate` success, fire-and-forget append to a durable store. Default: Supabase `leads` table (project already connected via MCP; free tier) with graceful no-op if env vars absent — email/SMS remain the source of truth for delivery. | new `src/lib/leads.ts` (+ test), `src/app/api/estimate/route.ts` | A failed insert never blocks or delays the email/SMS path (mirror the Twilio fire-and-forget pattern); every lead has an id + timestamp + attribution. |
| 0.5 | Customer confirmation email ("We got it — here's what happens next," from `no-reply@realelitecontracting.com`, includes phone number and what-to-expect timeline). Plain, warm, on-voice. | `src/app/api/estimate/route.ts` | Submitting any form sends 2 emails (owner + customer); customer email passes spam-basics (single CTA, text-forward). |
| 0.6 | **[JOSE]** In GA4 (property `G-W9QH965H3Y`): mark `generate_lead` and `phone_click` as key events. (5 clicks; write him the exact click path in the PR description.) Later, when ads run: link GA4 ↔ Google Ads and import the key event. | GA4 UI | GA4 "Key events" report shows form and phone conversions within 48h. |
| 0.7 | Small fixes batch: `ReviewRequestTool.tsx` placeholder → `BUSINESS.phone`; mega-menu `role="navigation" aria-label="Services"`; hero eyebrow contrast bump (white/brand-red-light if Lighthouse flags); commit `docs/PROJECT-OBJECT-SPEC.md` (recover from the project-system branch or write a 1-page version matching `types.ts`). | per F8 | Lint/tests green; Lighthouse a11y ≥ 95 on home. |

**Exit criteria:** a test lead flows end-to-end (form → owner email + SMS + ledger row + GA4 key event + customer confirmation) and Jose received it on his phone in <60 seconds.

---

### Phase 1 — Fill the proof engine (projects + reviews) · ~2 sessions + Jose's photos

**Why:** V2's whole thesis — trust-transfer via visible, checkable work. This is also the #1 close-rate lever ("here's a kitchen like yours, at your budget, two towns over").

| # | Task | Files / where | Acceptance criteria |
|---|---|---|---|
| 1.1 | **[JOSE]** Gather raw material for 10–12 past jobs: 5–15 photos each (mix of before/during/after), city, rough budget band, what was hard, what the customer said. Text/email dumps are fine — Opus structures them. Drop photos in `public/images/projects/<slug>/`. | — | 10+ folders of real photos with a sentence or two each. |
| 1.2 | Author 9–11 new Project Objects from Jose's material (drop-a-file in `src/lib/projects/data/`; registry auto-generates). Spread across services (2–3 roofing, 2 decks, 1–2 kitchen, 1 bath, 1 basement, 1 siding/exterior, 1 paving-adjacent) and cities (Martinsburg, Charles Town, Frederick, Loudoun where real). Budget bands anonymized; honest challenge/solution narrative; alt text on every image. | `src/lib/projects/data/*.ts` | 10–12 published projects; `projects.test.ts` referential checks pass; each project has ≥4 images, a summary answer-block, and (where real) a linked review. |
| 1.3 | **Review Center v1:** create `src/lib/reviews/data.ts` (first consumers of the Review contract) — migrate the 3 `TESTIMONIALS`, attach project reviews via `projectSlug`, add Google reviews as they arrive (`source:'google'`, `sourceUrl`, `verified` only when mirrored from the live profile). Rebuild `/reviews` as a filterable Review Center (service / city / source / has-project) with each project-linked review showing a thumbnail → project page. JSON-LD only per the type-level gate. | `src/lib/reviews/`, `src/app/reviews/page.tsx`, new `src/components/reviews/*` | `/reviews` renders all reviews from one data source; filters are URL-driven (`?service=roofing`); zero Review/AggregateRating JSON-LD while `verified=false`; tests cover the gate. |
| 1.4 | Surface reviews everywhere: service pages and city pages pull matching reviews (by `serviceSlug`/`citySlug`) into their existing testimonial/proof slots; homepage `Testimonials` reads from the Review source. Pixel-light: reuse existing card styles. | `ServicePageTemplate.tsx`, `CityPageTemplate.tsx`, `src/components/home/Testimonials.tsx` | A review authored once appears on its service page, city page, project page, and `/reviews` with no duplication. |
| 1.5 | **[JOSE]** Review velocity: after each completed job, use `/review-request` (now live via `ADMIN_TOOLS_KEY`) to text the Google review link. Target 2–3/week. **Never incentivize** (FTC rule — $51k/violation; research §6). | `/review-request` tool | Google profile accumulating real reviews weekly. |
| 1.6 | When the Google profile shows a stable rating (Jose confirms the live numbers): set `SOCIAL_PROOF.verified=true` + real `googleRating`/`googleReviewCount` in `src/lib/constants.ts`. TrustBar, badges, and aggregate schema light up automatically. | `src/lib/constants.ts` | Displayed numbers byte-match the live Google profile (screenshot in PR). |
| 1.7 | Gallery → Projects convergence: `/gallery` keeps its URL but gains a banner rail linking into `/projects`; project cards get service/city facet params (`/projects?service=decks`). Full faceted-gallery build stays Phase 5. | `src/app/gallery/page.tsx`, `src/app/projects/page.tsx` | Facet URLs are shareable and indexable; no dead-end lightboxes added. |

**Exit criteria:** 10+ published projects, Review Center live with ≥10 reviews (mixed sources), every service page shows real proof, Google review count growing weekly.

---

### Phase 2 — Own the answers (GEO / AI-search) · ~1–2 sessions

**Why:** 22% of homeowners now start in ChatGPT (research §6); AI Overviews lift the block that answers the question. The site must be the citable source for "what does X cost in [market]".

| # | Task | Files / where | Acceptance criteria |
|---|---|---|---|
| 2.1 | Answer blocks for the remaining **24 articles**: 2–4 sentence citable `answer:` frontmatter, extracted from each article's own content (no new claims; ranges must match `services-data.ts`). | `content/blog/*.md` | 27/27 articles carry an answer block; rendered atop each article (existing component) and in resource listings. |
| 2.2 | **Cost-guide cluster** (the money keywords, F5): 6 new articles — roof replacement cost Eastern Panhandle (Berkeley/Jefferson County specifics), basement finishing cost (Martinsburg/Charles Town + Loudoun variant), walk-in shower cost, egress window cost, driveway repair-vs-replace, deck cost by material (links the existing comparison posts). Each: `type: cost-guide`, answer block, FAQ section, honest ranges sourced from `services-data.ts` investment tiers, CTAs to the matching service page + estimate path. | `content/blog/`, cross-links in `services-data.ts` `relatedGuideSlugs` | 6 published guides; each links service page ↔ guide both ways; zero invented prices. |
| 2.3 | Schema completion: BreadcrumbList on `/blog/[slug]` and `/resources/[category]` via `buildBreadcrumbSchema()`; one-pass FAQ-schema coverage audit across all 12 service pages (add missing `FAQSchema` calls); Project pages emit FAQ schema where `faqs` exist. | `src/app/blog/[slug]/page.tsx`, `src/app/resources/[category]/page.tsx`, service data spot-fixes | Rich Results test passes on a blog article, a resource category, and 3 service pages. |
| 2.4 | `llms.txt` at the site root: business facts (NAP, services, service areas, veteran-owned SDVOSB-in-progress status), canonical URLs for the four proof engines, pointer to cost guides. Honest, compact, maintained in one place. | `public/llms.txt` (or route) | Fetchable at `https://www.realelitecontracting.com/llms.txt`; facts byte-consistent with `constants.ts`. |
| 2.5 | Service-page answer blocks: ensure each of the 12 service pages opens with the citable 2–3 sentence block (V2 §4). Most have `overview` copy — verify shape, add where missing, keep voice. | `src/lib/services-data.ts` | All 12 service pages have a lift-able answer near the H1. |

**Exit criteria:** 100% answer-block coverage, 6 money-keyword guides live, schema mesh complete (verified in Rich Results test), `llms.txt` live.

---

### Phase 3 — The estimate hub & conversion polish · ~1 session

| # | Task | Files / where | Acceptance criteria |
|---|---|---|---|
| 3.1 | **`/estimate` hub**: one page that routes intent — Instant Roof Quote / Free Estimate / Design Consultation — with 1-line "which is for me" guidance. Existing pages keep URLs; hub links in. Nav "Free Estimate" button targets `/estimate`. | new `src/app/estimate/page.tsx`, `Header.tsx`, `Footer.tsx`, `StickyMobileCTA.tsx` | All three paths reachable in ≤2 taps from any page; hub carries `generate_lead`-adjacent view tracking. |
| 3.2 | Luxury discoverability: add Design Consultation to footer + mega-menu (refined placement, not a banner) and a quiet luxury band on the homepage below the Proof Wall linking to `/design-consultation`. No copy changes to existing sections. | `Footer.tsx`, `MegaMenu.tsx`, new home band component | Luxury path reachable from home/nav; luxury pages' tone untouched. |
| 3.3 | Success-state second act on all three forms: after the confirmation card, offer (a) the most relevant cost guide and (b) "prefer to talk now?" phone CTA. No email-list gimmicks. | the three form components | Success states show 2 next actions; clicks tracked (`post_lead_click`). |
| 3.4 | Partial-lead capture: if a visitor reaches the contact step and typed a valid phone/email but abandons, fire-and-forget POST to `/api/estimate` variant flagged `partial: true` (rate-limited, honeypot-respecting; owner email subject "Partial lead — call gently"). | `MultiStepEstimateForm.tsx`, `src/app/api/estimate/route.ts` | Abandoned step-3 leads with real contact info reach the ledger + email, flagged clearly; no dupes on later completion. |
| 3.5 | Context-aware CTAs: service pages deep-link the estimate path pre-filled (`/contact#estimate?service=roofing` pattern already partially exists; extend to all 12 + city pages; luxury cities keep consultation rail). | `ServicePageTemplate.tsx`, `CityPageTemplate.tsx` | Form arrives pre-selected from every service/city page. |

**Exit criteria:** one obvious estimate front door, luxury funnel discoverable, no silent loss of near-converted leads.

---

### Phase 4 — Local depth (city pages that deserve to rank) · ~1–2 sessions, content-gated

| # | Task | Acceptance criteria |
|---|---|---|
| 4.1 | City-tag real assets: as Phase 1 projects/reviews land, tag `citySlug` on gallery images, projects, reviews; city pages auto-surface them (`selectGalleryFor` already prefers city → state → all). | Top 6 cities each show ≥3 city-real proof elements. |
| 4.2 | Permit micro-modules on city pages: 150–250 words per market (Berkeley, Jefferson, Frederick, Loudoun) sourced from the existing permit guides — linked both ways. | Each priority city page has unique local operational content (not spun). |
| 4.3 | Expansion-market audit: for the 62 service×city pages, verify each still earns its place (unique content threshold); consolidate or 301 any that read thin rather than padding them. The anti-doorway line holds even at the cost of page count. | Zero pages that a rater would call doorway; Search Console coverage clean. |
| 4.4 | **[JOSE]** Google Business Profile hygiene per research §6: weekly photo post (reuse content-calendar assets), Q&A seeding, service-area settings mirroring `constants.ts`. Apply for **Google LSA** (the $45–120 CPL anchor channel) once review count supports it. | GBP active weekly; LSA application submitted. |

**Exit criteria:** priority-market city pages carry real local proof + unique local content; GBP/LSA operational rhythm established.

---

### Phase 5 — Flywheel & platform (optional, after 0–4 prove out)

Faceted Projects gallery with indexable facet URLs (V2 §8) · video-review lane on the Review Center · AI cost assistant beyond roofing (extend the instant-quote pattern to decks/paving with honest heuristic ranges) · lead dashboard page over the Supabase ledger (key-gated like `/review-request`) · Mission Control data contracts (V2 §11). Scope each into its own session brief when reached; nothing above depends on these.

---

## Part 4 — The math & the scoreboard

**Model (conservative, using research §5–6 benchmarks and Real Elite job values):**

| Revenue lane | Assumption | Annual |
|---|---|---|
| Core residential (roofing/decks/baths/siding) | 2 qualified leads/wk from organic+GBP+LSA → ~45% close (speed-to-lead active) → ~47 jobs × ~$14k avg | ~$650k |
| Luxury NoVA (kitchens/baths/basements) | 1 consultation/mo from the luxury funnel → 1 close per quarter × $200k+ | ~$800k+ potential; even 2/yr ≈ $400k |
| Paving bundle + storm surge | Seasonal (per playbooks) | upside |

One luxury close per quarter **or** steady 2-leads/week core flow individually clears $500k; together they clear $1M+ in pipeline. The model's inputs (leads/week, close rate, job value) are exactly what the Measurement System makes visible — review them monthly and re-weight phases accordingly.

**Weekly scoreboard (5 numbers Jose reads):** GA4 key events (leads) · phone clicks · Google review count/rating · GSC clicks on money pages (cost guides + service×city) · jobs closed from site leads (Jose's tally vs the ledger).

---

## Part 5 — Non-negotiables (inherited, permanent)

1. **No fabricated proof.** Review/AggregateRating JSON-LD only for verified third-party numbers mirroring the live profile (enforced in `src/lib/reviews/types.ts` + `social-proof.ts`). First-party quotes render as content, never as schema.
2. **No owner personal name on the site.** "Veteran-owned" framing only.
3. **No founding-date claims.**
4. **No stock imagery presented as Real Elite work** — the inspiration/work split with visible labeling stays.
5. **No incentivized reviews** (FTC Consumer Reviews Rule; Google policy).
6. **No thin doorway pages** — expansion follows real content, not the other way around.
7. **Voice:** existing shipped copy is Jose's; structural additions only unless he asks. Luxury surfaces stay refined.
8. **Prices shown = ranges Jose has approved** in `services-data.ts`; content never invents numbers.

---

## Appendix A — Jose's complete non-code checklist (everything the code can't do)

| Priority | Action | Time | Where |
|---|---|---|---|
| 🔴 Now | Verify/set `RESEND_API_KEY` in Vercel (leads currently at risk) | 5 min | Vercel → Settings → Env Vars |
| 🔴 Now | Twilio 4 vars → speed-to-lead SMS + missed-call textback live | 10 min | `docs/SPEED_TO_LEAD_SETUP.md` |
| 🔴 Week 1 | Send 10–12 past-job photo sets + one-liners (Phase 1 fuel) | 1–2 hrs | Text/email dump is fine |
| 🔴 Week 1 | Set `ADMIN_TOOLS_KEY`; start texting review requests after every job | 5 min + ongoing | `docs/REVIEW_ENGINE_SETUP.md` |
| 🟡 Week 2 | GA4: mark `generate_lead` + `phone_click` as key events | 5 min | Click-path in Phase 0 PR |
| 🟡 Month 1 | GBP weekly rhythm; apply for Google LSA | 30 min/wk | research §6 |
| 🟡 Month 1 | SDVOSB VetCert application (the $28.6B federal lane — biggest off-site lever in the research) | ~1 hr | research §3 |
| 🟢 Ongoing | Photo capture on every job (10-shot checklist in Phase 1 PR) | 10 min/job | — |

## Appendix B — Session brief template for Opus 4.8

> Read `docs/MILLION-DOLLAR-WEBSITE-PLAN.md` Part 3, Phase N. Execute the tasks in order on branch `claude/mdw-phase-N-<slug>`. Respect Part 5 non-negotiables and the session protocol. Verify with `npm run typecheck && npm run test && npm run build`, update this doc's phase table with ✅/notes, and open a PR titled "MDW Phase N: <name>" whose description includes the exit-criteria evidence and anything [JOSE] still owes.
