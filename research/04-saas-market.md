# Contractor Management SaaS Market Research
**For:** Real Elite Contracting LLC — "Military Precision Process" SaaS path
**Date:** 2026-05-26
**Stack assumed:** Next.js 16, React 19, TypeScript, Prisma + Turso, multi-AI (Claude/GPT/Gemini/Groq)

---

## 1. Market Size & Growth (2025–2026)

### TAM by adjacent segment
| Segment | 2025 / 2026 size | CAGR | Source |
|---|---|---|---|
| Construction Management Software | $10.62B (2025) → $11.58B (2026) → $17.81B (2031) | 8.99% | [Mordor Intelligence](https://www.mordorintelligence.com/industry-reports/construction-management-software-market) |
| Contractor Management Software (subset) | $3.2B (2024) → $8.1B (2033) | 10.8% | [Verified Market Reports](https://www.verifiedmarketreports.com/product/contractor-management-software-market/) |
| Field Service Management (FSM) | $5.61B (2025) → $6.24B (2026) → $18.22B (2035) | ~12.5% | [Research Nester](https://www.researchnester.com/reports/field-service-management-market/4821); [Technavio](https://www.technavio.com/report/field-service-management-fsm-software-market-market-industry-analysis) |
| Vertical AI SaaS (super-segment) | $71.5B (2024) → $775B (2031) | 38.3% | [Coherent Market Insights](https://www.coherentmarketinsights.com/industry-reports/ai-created-saas-market) |
| Bid/estimating software (US slice) | ~$4B segment of a $1.8T US construction industry | — | [AI Magicx](https://www.aimagicx.com/blog/vertical-ai-micro-saas-business-model-2026) |

Cloud share of construction software is 63.8% in 2025 and growing faster than on-prem ([Mordor](https://www.mordorintelligence.com/industry-reports/construction-management-software-market)).

### US SMB contractor population (the actual ICP)
- **3.79M construction businesses** in 2025, projected 3.83M in 2026 ([IBISWorld](https://www.ibisworld.com/united-states/number-of-businesses/construction/164/), [ConstructionCoverage](https://constructioncoverage.com/data/us-construction-spending)).
- **99.8% are small businesses**; 5.94M employees, $404.3B payroll ([SBA 2025 Profile](https://advocacy.sba.gov/wp-content/uploads/2025/06/United_States_2025-State-Profile.pdf)).
- ~**813K nonemployer residential builders** + **1.9M nonemployer specialty trade contractors** (~80% of category) ([NAHB Eye on Housing](https://eyeonhousing.org/2025/08/most-home-builders-are-small-businesses/)).
- 63% of homebuilders and 66% of specialty trades generate <$1M revenue ([Statista](https://www.statista.com/statistics/1388411/number-of-construction-firms-in-the-united-states-by-segment-and-size/)).

**Real Elite Strategic Take:** The sweet-spot ICP is the **~600K–800K specialty trade SMBs doing $250K–$5M revenue** — too small for ServiceTitan/Buildertrend's enterprise quote-only motion, too large for spreadsheets. Using a $150 ARPU × 1% capture = ~$10–15M ARR ceiling without going downmarket to solos.

---

## 2. Top Contractor SaaS Platforms — Features & Pricing

### ServiceTitan (TTAN, NASDAQ)
- **IPO:** Dec 12, 2024 at $71/share; 8.8M Class A shares ([press release](https://www.servicetitan.com/press/servicetitan-announces-ipo-pricing); [S-1](https://www.sec.gov/Archives/edgar/data/0001638826/000119312524260611/d577298ds1.htm)).
- **FY2025 revenue:** $771.9M (+26% YoY); platform revenue $739.5M (+27%). Q4 FY25 revenue $209.3M, +29% ([Yahoo Finance / 8-K](https://finance.yahoo.com/news/servicetitan-inc-ttan-q4-2025-071210278.html); [SEC 8-K](https://www.sec.gov/Archives/edgar/data/0001638826/000095017025038719/ttan-ex99_1.htm)).
- **ARR:** ~$800M+, NRR ~110%, GRR ~95% ([SaaStr breakdown](https://cloud.substack.com/p/5-interesting-learnings-from-servicetitan)).
- **Customer base:** ~414K US active customers; 50% of revenue from $100K+ accounts ([6sense](https://6sense.com/tech/calendar/servicetitan-market-share)).
- **Pricing:** Quote-only; reported $345–$398/mo Starter, ~$10K+/yr typical mid-market deals, with hardware+implementation fees ~$5K–$20K upfront.

### Buildertrend (Bain Capital + HGGC)
- **Customers:** 20K+, ~1M users across 100+ countries; FY revenue ~$172M (2026 trailing) ([RocketReach/ZoomInfo](https://www.zoominfo.com/c/buildertrend/346966160)).
- **Pricing 2026:** Pulled all public tiers; now **volume-based quotes tied to 11 annual construction-volume brackets** ([Projul analysis](https://projul.com/blog/buildertrend-pricing-analysis-2026/)). Legacy tiers were ~$339 (Essential) / $499 (Advanced) / $829 (Complete) per month annual ([CostBench](https://costbench.com/software/construction-management/buildertrend/)).
- **Acquired CoConstruct** (2021, Serent → Bain/HGGC umbrella) ([Lincoln International](https://www.lincolninternational.com/transactions/buildertrend-a-portfolio-company-of-bain-capital-and-hggc-has-acquired-co-construct-from-serent-capital/)).

### Jobber (FSM, Toronto)
- **Pricing 2026:** Core $39/mo (1 user) · Connect $149/mo (5 users) · Grow $299/mo (10) · Plus $529/mo (15); +$29/extra user ([Software Advice](https://www.softwareadvice.com/construction/housecall-profile/vs/jobber/); [contractorplus.app](https://contractorplus.app/blog/jobber-vs-housecall-pro)).
- Strength: scheduling/invoicing for home services. **Weak in estimating, change orders, Gantt, sub mgmt** ([rivetops.io](https://www.rivetops.io/jobber-vs-housecall-pro)).

### Housecall Pro
- **Pricing 2026:** Basic $59/mo (annual) · Essentials $149/mo · Max $299/mo (8 users), +$35/extra user ([Projul](https://projul.com/blog/housecall-pro-pricing-analysis-2026/); [Housecall Pro](https://www.housecallpro.com/compare/housecall-pro-jobber/)).
- Owned by Vista Equity Partners since 2022; embedded fintech (HCP Money / instapay) is a meaningful upsell.

### CoConstruct
Folded into Buildertrend product line — no longer sold standalone.

### JobNimbus (roofing-led CRM)
- **Pricing:** $25–$75 per user/month; **Essentials ~$299/mo annual** (CRM + Engage texting + estimating + QB sync) ([OpsRev](https://www.opsrev.ai/blog/acculynx-vs-jobnimbus/); [JobNimbus](https://www.jobnimbus.com/comparison/jobnimbus-vs-jobtread)).

### AccuLynx (roofing-specific)
- **Pricing:** $79–$249+/mo flat platform fee (not per-user), undisclosed ([OpsRev](https://www.opsrev.ai/blog/acculynx-vs-jobnimbus/)). Deep aerial-measurement → estimate → supplement workflow for insurance roofing.

### JobTread
- **Pricing:** $159/mo annual (1 user) + $16/user; $199/mo m2m + $20/user. **All features in one tier**; free portals for clients/subs/field crew ([JobTread G2](https://www.g2.com/products/jobtread/pricing); [Projul](https://projul.com/blog/jobtread-pricing-analysis-2026/)).

### Knowify
- **Pricing:** 4 tiers ([knowify.com/pricing](https://knowify.com/pricing/)); construction-specific AIA pay apps, T&M and fixed-price billing, job costing.

**Real Elite Strategic Take:** Two clear pricing patterns dominate:
1. **Per-seat ladders** (Jobber, Housecall, JobNimbus) at $29–$75/user — best for sub-15-employee shops.
2. **Flat-rate "all features"** (JobTread $159 base, AccuLynx $79–$249) — wins on simplicity for owner-operators.
ServiceTitan's quote-only enterprise motion is **explicitly not** the move for a bootstrapped veteran-trades SaaS. Land in the **$99–$249 flat-base + light per-user uplift** zone with AI features bundled in (not gated like ServiceTitan's Pro add-ons).

---

## 3. Cost & Time to Build a Contractor SaaS MVP (2026)

### Dev cost ranges
| Path | Cost | Timeline | Source |
|---|---|---|---|
| No-code (Bubble/Webflow) | $1K–$8K | 4–8 weeks | [UX Continuum](https://uxcontinuum.com/blog/saas-development/saas-mvp-cost-2026) |
| Solo founder + AI-coding | $5K–$25K (mostly time) | 3–5 mo | [Ideas2IT](https://www.ideas2it.com/blogs/mvp-development-cost) |
| Custom-coded MVP (agency, offshore) | $15K–$60K | 3–6 mo | [SolvSpot](https://solvspot.com/blog/how-much-does-a-saas-mvp-cost-in-2026) |
| Construction-focused MVP (US agency) | $25K–$50K | 4–6 mo | [Modall](https://modall.ca/blog/custom-construction-software-cost) |
| Mid-range platform (sched + cost + field) | $50K–$150K | 6–12 mo | [Modall](https://modall.ca/blog/custom-construction-software-cost) |
| Enterprise (BIM/AI/multi-region) | $150K–$500K+ | 12+ mo | [Modall](https://modall.ca/blog/custom-construction-software-cost) |

Add $1K–$5K/yr infra and ~15% post-launch buffer ([SSN](https://ssntpl.com/saas-mvp-cost-in-2026/)).

### Highest-value MVP feature set for SMB contractors
Confirmed in market comparisons ([rivetops.io](https://www.rivetops.io/jobber-vs-housecall-pro), [Projul](https://projul.com/competitors/), [Software Advice](https://www.softwareadvice.com/construction/buildertrend-profile/vs/housecall/)):
1. Lead capture + web-to-CRM intake
2. Mobile-first estimating with line-item cost DB
3. Scheduling / dispatch with route view
4. Invoicing + payments (ACH + card; embedded fintech is the #1 expansion lever)
5. Photo documentation with GPS/timestamp
6. Customer/sub portals
7. QuickBooks sync (table-stakes; deal-breaker if missing)

### AI features that actually differentiate (2026)
- **Voice-to-text job logs**: WisprFlow, ServiceTrade, CompanyCam report 8–12 hrs/week saved per PM ([Zackproser](https://zackproser.com/blog/ai-voice-tools-for-general-contractors)).
- **AI estimating from photos/blueprints**: Rebar (HVAC/electrical/plumbing) shows 60–70% quote-time reduction ([Construction Dive](https://www.constructiondive.com/news/construction-tech-funding-Q4-2025/808986/)); Bild AI for blueprint takeoff.
- **Auto-generated daily reports** from voice + photo ingestion (Opusense AI, YC).
- **Predictive scheduling / cash-flow** (Slate Technologies, Constructable).
- **Agentic contract review** (Document Crunch — acquired by Trimble).

**Real Elite Strategic Take:** With the existing Next.js 16 / React 19 / Prisma / Turso / multi-AI stack already in place, the marginal MVP cost is **mostly Real Elite's own time + ~$15–35K for design, mobile PWA polish, payments integration (Stripe Connect), and QuickBooks API**. Realistic 4-month MVP targeting solo-to-10-employee veteran trade shops.

---

## 4. Recent Venture-Backed AI-for-Contractor Startups (2024–2026)

| Company | Round / Total | Lead investors | Problem solved |
|---|---|---|---|
| **Trunk Tools** | $40M Series B (Jul 2025); $70M total | Insight Partners (led); Redpoint, Innovation Endeavors, Liberty Mutual, Prudence | AI org/search across RFIs, specs, drawings, submittals ([Trunk Tools PR](https://trunktools.com/resources/company-updates/trunk-tools-closes-40m-series-b-construction-ai-transformation/); [CNBC](https://www.cnbc.com/2025/08/01/trunk-tools-ai-reduce-construction-error-waste.html)) |
| **Higharc** | $21M Series A | Spark Capital | AI-powered 3D homebuilding design platform ([Higharc PR](https://www.higharc.com/newsroom/higharc-announces-new-ai-capabilities-for-industry-leading-homebuilding-platform); [Crunchbase](https://www.crunchbase.com/organization/higharc)) |
| **Document Crunch** | $37M+ total — **acquired by Trimble (2025)** | — | NLP contract review / agentic risk flagging ([ENR](https://www.enr.com/articles/62770-trimble-acquires-document-crunch-plans-to-integrate-agentic-ai-contract-review)) |
| **Constructable** | Early-stage (Crunchbase) | — | AI knowledge base across project comms ([Crunchbase](https://www.crunchbase.com/organization/constructable)) |
| **Slate Technologies** | $20.2M total | — | AI digital enabler / predictive analytics for GCs ([Slate](https://slate.ai/), [Tracxn](https://tracxn.com/d/companies/slate/__4_AoPLDqwtqLl_KAULNxlIJqINfqSAuglF7x4e1C9jQ)) |
| **PermitFlow** | $54M Series B | — | AI permit automation ([Crunchbase News](https://news.crunchbase.com/ai/big-funding-trends-charts-eoy-2025/)) |
| **Sensera Systems** | $27M Series B | — | Jobsite cameras + computer vision |
| **Rebar** | $14M Series A | — | AI quoting OS for HVAC / electrical / plumbing distributors ([Construction Dive](https://www.constructiondive.com/news/contech-funding-fyld-sensera-xbuild-moab-payra/814452/)) |
| **Bild AI** (YC) | YC + seed | YC | Blueprint reading → material/cost extraction ([YC](https://www.ycombinator.com/companies/bild-ai)) |
| **Rudus** (YC) | YC | YC | AI takeoff for concrete contractors (70% time cut) |
| **Opusense AI** (YC) | YC | YC | Voice-driven field inspector reports |
| **PLAN0** (YC) | YC | YC | Computer-vision plan → cost estimates |
| **Structured AI** (YC F25) | YC | YC | AI workforce for construction engineering ([YC](https://www.ycombinator.com/companies/structured-ai)) |

### Macro funding context
- **Q1 2025 construction-tech funding: $3.55B**, with 55% to robotics/AI-enabled platforms and 46% AI-specific (up from 20–25% prior years) ([Buildcheck](https://buildcheck.ai/insights-case-studies/ai-investment-booms-50b-surge-in-construction-tech-growth)).
- **BuiltWorlds 2025 Top 50 VCs** list confirms heavy activity from Base10, Brick & Mortar, Building Ventures, Suffolk, Zacua ([BuiltWorlds](https://builtworlds.com/insights/2025-builtworlds-top-50-venture-investors/)).
- **YC Spring 2025**: 46% of 144-startup batch are AI agents ([PitchBook](https://pitchbook.com/news/articles/y-combinator-is-going-all-in-on-ai-agents-making-up-nearly-50-of-latest-batch)).

**Real Elite Strategic Take:** The 2025 cohort confirms VCs reward **vertical AI agents owning a workflow**, not generic CRMs. A defensible angle = **"AI ops chief for veteran-owned trade shops"** (voice logs, auto-estimates, auto-invoicing) — adjacent to but distinct from horizontal FSMs.

---

## 5. Pricing Models That Work in Contractor SaaS

| Model | Who uses it | When it works | When it breaks |
|---|---|---|---|
| **Per-seat** | Jobber, Housecall Pro, JobNimbus, ServiceTitan | Office-heavy teams; predictable expansion | Suppresses field-crew adoption; punishes growth |
| **Flat-rate w/ free portal seats** | JobTread, AccuLynx | Owner-operators, simplicity wins | Hard to ladder upmarket |
| **Volume-based (% of construction $)** | Buildertrend (new 2026 model) | Captures upside as GCs grow | Opaque; high friction in sales cycle |
| **Per-job / usage** | Embedded fintech (HCP Money, Stripe Connect take-rate) | High-margin expansion | Pure usage scares budgets |
| **Freemium** | Rare in trades; Slack-style network effects absent | Lead-gen for portals | Conversion <1% in B2B SMB ([Revenera](https://www.revenera.com/blog/software-monetization/saas-pricing-models-guide/)) |
| **Tiered (Good/Better/Best)** | Industry default (~3.5 tiers avg) | Self-select WTP | Decision paralysis if >4 tiers |

Key data: 3-tier pricing captures ~**2× the revenue** of single-price ([Monetizely](https://www.getmonetizely.com/articles/vertical-specific-saas-pricing-why-industry-context-matters-for-revenue-growth)). Usage-based and outcome-based are now growing at parity with subscription ([Revenera Monetization Monitor](https://www.revenera.com/blog/software-monetization/saas-pricing-models-guide/)).

**Recommended Real Elite model:**
- **Tier 1 — "Recon"** $99/mo flat, 1 admin + 3 field PWA users, core CRM + estimating + photo docs + 1 AI workflow (voice logs).
- **Tier 2 — "Squad"** $249/mo flat, 5 admin + 15 field users, + scheduling/dispatch + QB sync + 3 AI workflows (voice, estimate-from-photo, invoice auto-draft).
- **Tier 3 — "Battalion"** $599/mo + $29/extra admin, unlimited field, + sub portal + predictive cash-flow + custom AI agents (Claude/GPT/Gemini routing).
- **Embedded fintech overlay** (Stripe Connect take-rate 0.5–1%) for invoice payments — this is where ServiceTitan/Housecall earn outsized margin.
- **Veteran-owned anchor pricing**: 20% lifetime discount for verified veteran/SDVOSB shops; doubles as PR + acquisition channel.

---

## Top-line Strategic Recommendations for Real Elite

1. **Don't fight ServiceTitan upmarket.** Target the 600K–800K specialty trade SMBs ($250K–$5M revenue) underserved by both Jobber-class (too thin) and ServiceTitan-class (too heavy).
2. **Lead with AI workflows, not CRM features.** The 2024–2026 funding pattern (Trunk Tools, Rebar, Bild AI, Opusense) shows capital flows to **workflow ownership**. Voice-to-text logs + photo-to-estimate + auto-invoice are the three highest-leverage agents.
3. **Use existing stack as moat.** Next.js 16 + Prisma + Turso + multi-AI routing already gives an 18-month head-start vs greenfield competitors paying $50K–$150K to build the foundation.
4. **Pricing: flat $99/$249/$599 + payments take-rate.** Avoid per-seat below 15 employees (suppresses field adoption — Real Elite's whole differentiator).
5. **Brand wedge:** "Military Precision Process" — discipline/SOP-driven onboarding, veteran-owned-only beta, SDVOSB partnerships for government-adjacent contractors. This is a real moat against generic FSMs.
6. **MVP budget envelope:** $25–50K + 4 months to ship a defensible, AI-native, mobile-first MVP given the existing stack. Validate with 25 paying design partners before pursuing seed capital (~$1.5–3M at $8–12M post on YC-comparable metrics).

---

## Sources (consolidated, 30+)

- [Mordor Intelligence — Construction Management Software Market](https://www.mordorintelligence.com/industry-reports/construction-management-software-market)
- [Verified Market Reports — Contractor Management Software](https://www.verifiedmarketreports.com/product/contractor-management-software-market/)
- [Research Nester — FSM Market](https://www.researchnester.com/reports/field-service-management-market/4821)
- [Technavio — FSM 2026–2030](https://www.technavio.com/report/field-service-management-fsm-software-market-market-industry-analysis)
- [Coherent Market Insights — AI SaaS](https://www.coherentmarketinsights.com/industry-reports/ai-created-saas-market)
- [AI Magicx — Vertical AI Micro-SaaS](https://www.aimagicx.com/blog/vertical-ai-micro-saas-business-model-2026)
- [IBISWorld — US Construction Businesses](https://www.ibisworld.com/united-states/number-of-businesses/construction/164/)
- [Construction Coverage — US Construction Data](https://constructioncoverage.com/data/us-construction-spending)
- [SBA 2025 US Small Business Profile (PDF)](https://advocacy.sba.gov/wp-content/uploads/2025/06/United_States_2025-State-Profile.pdf)
- [NAHB Eye on Housing — Small builders](https://eyeonhousing.org/2025/08/most-home-builders-are-small-businesses/)
- [Statista — US construction firms by size](https://www.statista.com/statistics/1388411/number-of-construction-firms-in-the-united-states-by-segment-and-size/)
- [ServiceTitan IPO press release](https://www.servicetitan.com/press/servicetitan-announces-ipo-pricing)
- [ServiceTitan S-1](https://www.sec.gov/Archives/edgar/data/0001638826/000119312524260611/d577298ds1.htm)
- [ServiceTitan Q4 FY25 8-K](https://www.sec.gov/Archives/edgar/data/0001638826/000095017025038719/ttan-ex99_1.htm)
- [Yahoo Finance — TTAN Q4 FY25](https://finance.yahoo.com/news/servicetitan-inc-ttan-q4-2025-071210278.html)
- [SaaStr — 5 Learnings from ServiceTitan at $840M ARR](https://cloud.substack.com/p/5-interesting-learnings-from-servicetitan)
- [6sense — ServiceTitan market share](https://6sense.com/tech/calendar/servicetitan-market-share)
- [Projul — Buildertrend Pricing 2026](https://projul.com/blog/buildertrend-pricing-analysis-2026/)
- [CostBench — Buildertrend Pricing](https://costbench.com/software/construction-management/buildertrend/)
- [Lincoln International — Buildertrend / CoConstruct](https://www.lincolninternational.com/transactions/buildertrend-a-portfolio-company-of-bain-capital-and-hggc-has-acquired-co-construct-from-serent-capital/)
- [Software Advice — Buildertrend vs Housecall Pro](https://www.softwareadvice.com/construction/buildertrend-profile/vs/housecall/)
- [Software Advice — Housecall vs Jobber](https://www.softwareadvice.com/construction/housecall-profile/vs/jobber/)
- [contractorplus.app — Jobber vs Housecall Pro](https://contractorplus.app/blog/jobber-vs-housecall-pro)
- [rivetops.io — Jobber vs Housecall Pro](https://www.rivetops.io/jobber-vs-housecall-pro)
- [Projul — Housecall Pro Pricing](https://projul.com/blog/housecall-pro-pricing-analysis-2026/)
- [Housecall Pro vs Jobber](https://www.housecallpro.com/compare/housecall-pro-jobber/)
- [OpsRev — AccuLynx vs JobNimbus](https://www.opsrev.ai/blog/acculynx-vs-jobnimbus/)
- [JobNimbus vs JobTread](https://www.jobnimbus.com/comparison/jobnimbus-vs-jobtread)
- [G2 — JobTread Pricing](https://www.g2.com/products/jobtread/pricing)
- [Projul — JobTread Pricing](https://projul.com/blog/jobtread-pricing-analysis-2026/)
- [Knowify Pricing](https://knowify.com/pricing/)
- [UX Continuum — SaaS MVP Cost 2026](https://uxcontinuum.com/blog/saas-development/saas-mvp-cost-2026)
- [Modall — Construction Software Cost](https://modall.ca/blog/custom-construction-software-cost)
- [SolvSpot — SaaS MVP Cost](https://solvspot.com/blog/how-much-does-a-saas-mvp-cost-in-2026)
- [SSN — SaaS MVP 2026](https://ssntpl.com/saas-mvp-cost-in-2026/)
- [Zackproser — AI Voice Tools for GCs](https://zackproser.com/blog/ai-voice-tools-for-general-contractors)
- [Relay — AI Tools for Contractors](https://relayfi.com/blog/9-game-changing-ai-tools-contractors-scale-2026/)
- [Trunk Tools Series B announcement](https://trunktools.com/resources/company-updates/trunk-tools-closes-40m-series-b-construction-ai-transformation/)
- [CNBC — Trunk Tools AI](https://www.cnbc.com/2025/08/01/trunk-tools-ai-reduce-construction-error-waste.html)
- [Higharc — AI capabilities](https://www.higharc.com/newsroom/higharc-announces-new-ai-capabilities-for-industry-leading-homebuilding-platform)
- [Crunchbase — Higharc](https://www.crunchbase.com/organization/higharc)
- [ENR — Trimble acquires Document Crunch](https://www.enr.com/articles/62770-trimble-acquires-document-crunch-plans-to-integrate-agentic-ai-contract-review)
- [Crunchbase — Constructable](https://www.crunchbase.com/organization/constructable)
- [Slate Technologies](https://slate.ai/)
- [Buildcheck — Construction AI $50B surge](https://buildcheck.ai/insights-case-studies/ai-investment-booms-50b-surge-in-construction-tech-growth)
- [Crunchbase News — 2025 AI Funding Trends](https://news.crunchbase.com/ai/big-funding-trends-charts-eoy-2025/)
- [Construction Dive — Q4 2025 contech funding](https://www.constructiondive.com/news/construction-tech-funding-Q4-2025/808986/)
- [Construction Dive — $126M contech round-up](https://www.constructiondive.com/news/contech-funding-fyld-sensera-xbuild-moab-payra/814452/)
- [BuiltWorlds — Top 50 VCs 2025](https://builtworlds.com/insights/2025-builtworlds-top-50-venture-investors/)
- [YC — Construction Startups](https://www.ycombinator.com/companies/industry/construction)
- [YC — Bild AI](https://www.ycombinator.com/companies/bild-ai)
- [YC — Structured AI](https://www.ycombinator.com/companies/structured-ai)
- [PitchBook — YC AI agents 50% of batch](https://pitchbook.com/news/articles/y-combinator-is-going-all-in-on-ai-agents-making-up-nearly-50-of-latest-batch)
- [Revenera — SaaS Pricing Models Guide](https://www.revenera.com/blog/software-monetization/saas-pricing-models-guide/)
- [Monetizely — Vertical SaaS Pricing](https://www.getmonetizely.com/articles/vertical-specific-saas-pricing-why-industry-context-matters-for-revenue-growth)
- [Monetizely — SaaS Pricing 2025-2026](https://www.getmonetizely.com/blogs/complete-guide-to-saas-pricing-models-for-2025-2026)
