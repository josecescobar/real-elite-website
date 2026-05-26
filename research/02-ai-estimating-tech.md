# AI Estimating Tech Stack Research

**Prepared for:** Real Elite Contracting LLC (Martinsburg, WV)
**Date:** 2026-05-26
**Context:** Next.js 16 site + AI Instant Estimator widget + multi-AI estimator app (Claude Sonnet 4.5 / GPT / Gemini / Groq, Prisma + Turso)

---

## 1. AI Instant Estimating Tools (Roofing / GC)

### Hover (hover.to)
- **Product:** 3D capture from smartphone photos -> measurements, estimates, e-sign proposals, 1,000+ integrations (relaunched Jan 2026 as a "connected platform").
- **Pricing:** Pro at **$99/mo or $999/yr**; pay-as-you-go starts **$25/job**; expedited scan add-on **$39/scan** (Starter) or **$19/scan** (Pro). Per-facet rates require sales contact.
- **API:** REST API exposed to **Enterprise tier only**; Xactimate-compatible export; native integrations with most CRMs.
- **Source:** https://hover.to/pricing/ , https://roofingsoftwareguide.com/guides/hover-pricing/
- **Rec for Real Elite:** Too expensive as the primary engine for an in-house widget, but worth offering as a **paid "Premium Verified Measurement" upgrade** triggered after the AI widget books a deposit. Use Pro pay-as-you-go ($25/job) rather than a subscription until volume justifies.

### EagleView
- **Products:** Premium / Bid Perfect / QuickSquares; **EagleView One** (June 2025) is the new interactive 3D-model subscription platform that replaces static PDFs; March 2026 expansion now covers walls, windows, doors, penetrations.
- **Pricing:** Standard residential reports **$15-$38**, Bid Perfect ~**$87**, large homes (40+ sq) **$87**; EagleView One is quote-only.
- **API:** TrueDesign SDK/API available (developer.eagleview.com). Tight Xactimate workflow.
- **Source:** https://www.eagleview.com/pricing/ , https://roofingsoftwareguide.com/guides/eagleview-pricing/ , https://developer.eagleview.com/api-documentation/truedesign
- **Note on "Inform Essentials+":** Not surfaced in 2025-2026 results; appears retired/folded into EagleView One.
- **Rec:** Use **Bid Perfect (~$15-$25 range)** as the cheapest verified-measurement fallback when Google Solar API confidence is low. Skip the subscription.

### Roofle / RoofQuote PRO
- **Product:** Whitelabel instant-quote widget for contractor sites; partnered exclusively with Owens Corning for an AI-enhanced version.
- **Pricing:** **$350/mo + $2,000 setup** (monthly) or **$4,200 first year, setup included** (annual); discounted tier $320/mo + $1,000 setup.
- **API:** No public REST API; widget is iframe / embed-script delivered.
- **Source:** https://offers.roofle.com/plans , https://offers.roofle.com/roof-quote-pro
- **Rec:** This is Real Elite's **most direct competitor** for the in-house widget. Pricing validates ~$3-5K/yr willingness-to-pay among contractors. Build, don't buy - your Claude-powered version with multi-trade scope (roofing + siding + decks) is differentiated.

### JobNimbus AI
- **Features:** "Scout" assistant (beta), "AssistAI" 24/7 call answering, automation tiers (10/30/100/unlimited by plan), built-in SumoQuote AI proposals (acquired 2024), Beacon/SRS/ABC supplier integrations.
- **Pricing:** Not publicly listed - quote-based; SumoQuote bundled into Pro+.
- **Source:** https://www.jobnimbus.com/pricing , https://www.jobnimbus.com/blog/ai-roofing-role
- **Rec:** Strongest CRM competitor for upsell motion. Real Elite should **integrate, not compete** - JobNimbus has a webhook/Zapier surface that lets your estimator app push leads in.

### Buildertrend AI / Copilot
- **Features:** AI Client Updates (97% time reduction, ~6.5 min per update), AI bill capture, forecasting.
- **Pricing:** Essential $499/mo, Advanced $899/mo, Complete $1,799/mo (legacy public pricing).
- **Source:** https://buildertrend.com/press-releases/buildertrend-launches-ai-tool-for-97-faster-client-updates/
- **Rec:** GC-focused, weaker on roofing. Not a fit unless Real Elite expands to full-home remodels.

### CompanyCam AI
- **Features:** AI photo summaries, voice-to-text captions, AI Reports from photo+voice; AI in Crew/Scale/Enterprise plans.
- **Pricing:** **$24-$49/user/mo**; Pro plan = **10 AI credits total company-wide**; unlimited AI requires Premium at **$149/mo minimum**.
- **Source:** https://companycam.com/pricing
- **Rec:** Adopt CompanyCam Crew tier immediately for field documentation. Pipe its photo URLs into your Claude estimator app for AI-driven damage assessment.

### AccuLynx
- **Features:** AI lead ranking, RoofScope aerial integration (Feb 2026), DataMart analytics, supplier integrations to ABC/SRS/QXO/Beacon (only CRM connecting natively to all four).
- **Pricing:** New **Essential tier $250/mo**; Pro/Elite quote-based, typical $299-$1,000+/mo, SmartDocs/texting/portal as paid add-ons.
- **Source:** https://acculynx.com/plan-options/ , https://roofingsoftwareguide.com/guides/acculynx-pricing/
- **Rec:** Best benchmark for "what enterprise contractors pay." Real Elite's stack should match its supplier-integration story.

### ServiceTitan
- **Features:** Spec-based AI estimating (30 min -> 4 min); AI carrier-doc summaries; native GAF QuickMeasure / EagleView / Hover; 2025 doubled down on roofing at Pantheon.
- **Pricing:** **$1,800+/mo software floor**; ~$250-$500/tech/mo; 3-6 mo onboarding.
- **Source:** https://www.servicetitan.com/industries/roofing-software , https://www.roofingcontractor.com/articles/101358-servicetitan-doubles-down-on-roofing-market-at-pantheon-2025
- **Rec:** Out of reach for a 5-truck shop; useful as the ceiling for feature parity.

### Knowify
- **Features:** Templates with auto-math, AIA billing, AI insights in Enterprise tier; trade-contractor focused.
- **Pricing:** Starts **$99/mo**, 4 plan tiers.
- **Source:** https://knowify.com/pricing/
- **Rec:** Solid budget back-end; not differentiated for roofing.

### Roofr
- **Features:** Free Instant Estimator with satellite snapshot + per-square pricing; CRM; measurement reports.
- **Pricing:** Restructured March 2026 -> **Starter (free, $19/report PAYG)**, Essentials & Scale paid; report **$13** on paid plans.
- **Source:** https://roofr.com/pricing , https://roofr.com/estimator
- **Rec:** Direct widget competitor at **$13/report cost**. Steal UX patterns (address -> satellite snap -> per-sq pricing) for the Real Elite widget.

### Beam AI (Attentive.ai) - GC takeoff
- **Features:** Drawing -> Excel takeoff in ~10 min; multi-trade expansion 2025.
- **Source:** https://www.ibeam.ai/ , https://www.forconstructionpros.com/construction-technology/estimating-bidding/product/22964682/
- **Rec:** Watch closely if Real Elite enters commercial bid work; not relevant for residential roofing yet.

### Higharc - homebuilder AI
- **Features:** Sketch -> full BIM + cost estimate + construction docs from one prompt; **$21M Series A (Spark Capital)**; production users include Tri Pointe Homes.
- **Source:** https://www.higharc.com/newsroom/higharc-announces-new-ai-capabilities-for-industry-leading-homebuilding-platform , https://bricks-bytes.com/ai/higharc-sketch-to-buildable-home-ai-pipeline/
- **Rec:** Not a fit (new construction only) but proves investors will fund AI-first construction estimating.

### Other notables
- **SumoQuote** (owned by JobNimbus): AI proposal builder, photo-rich PDFs - widely considered best-in-class for proposals.
- **Leap SalesPro:** In-home Good/Better/Best presentation app with GreenSky financing; pricier post-acquisition.
- **InstantRoofer:** Embeddable calculator at **$199/mo per office**, $30/lead from their marketplace, $10/human-certified report.
- **Source:** https://www.instantroofer.com/ , https://www.jobnimbus.com/blog/ai-roofing-role

---

## 2. Real-Time Material Pricing APIs / Data Sources

### Distributor portals (real-time pricing - but no open API)
- **SRS Distribution -> Roof Hub:** Branch-specific inventory, color availability, real-time pricing. Integrations exist via Roofr (July 2025), AccuLynx, JobNimbus, ServiceTitan.
- **ABC Supply -> myABCsupply:** Free portal + API used by AccuLynx/JobNimbus/ServiceTitan/Roofr.
- **Beacon / QXO App:** Newly rebranded portal from largest US roofing distributor.
- **Source:** https://www.digitalcommerce360.com/2025/07/08/roofr-srs-distribution-launch-real-time-pricing-integration/ , https://www.servicetitan.com/blog/roofing-supplier-integrations-srsdistribution-abcsupplyco-qxo
- **Rec:** None of the big three publish a public dev API - access is **partner-only**. Real Elite has two paths: (a) become an SRS/ABC partner via OAuth-style integration request, or (b) build a thin scraper layer behind a CRM integration (legal grey area). **Recommended:** apply for ABC's myABCsupply partner API first - lowest friction.

### Big-box pricing
- **Home Depot:** No official public API. Third-party scrapers - **SerpApi, Apify, BigBox/Trajectdata, Unwrangle** - charge per request (~$0.005-$0.02/call typical).
- **Lowe's:** Same situation; OpenWeb Ninja, ScrapingBee scrapers available.
- **Source:** https://serpapi.com/home-depot-product , https://docs.unwrangle.com/homedepot-product-data-api/
- **Rec:** Use **SerpApi or Unwrangle** for shingle SKUs + accessory pricing. Cache aggressively in Turso (24-hour TTL). Cost ~$50-150/mo for moderate volume.

### Construction cost databases
- **RSMeans Data:** 85,000+ unit prices, 25,000 assemblies. Pricing **$900-$5,200/yr per seat**; Revit plugin added 2025; no first-class REST API.
- **Xactimate:** 18,000+ line items tuned for insurance restoration; Hover/EagleView integrate natively.
- **Craftsman National Construction Estimator:** Cheaper print/PDF reference data, no API.
- **Source:** https://www.rsmeans.com/products/online/tiers , https://constructionbids.ai/blog/rsmeans-alternative-construction-cost-estimating
- **Rec:** Skip RSMeans seat licensing. For insurance/restoration jobs, the value is in **Xactimate-compatible export**, which Hover already provides.

### Commodity / lumber feeds
- **Commodities-API:** Live LUMBER and Random-Length Lumber Futures (LBRN24) - tiered refresh from 60s/10min/60min.
- **FRED (St. Louis Fed):** Free WPS081 / WPU0811 monthly softwood lumber PPI - useful for trend adjustments.
- **TradingEconomics:** Lumber chart + paid API.
- **Source:** https://commodities-api.com/symbols/LUMBER , https://fred.stlouisfed.org/series/WPU0811
- **Rec:** Use **FRED (free)** for monthly index trends + **Commodities-API basic plan (~$10-50/mo)** for live framing-lumber adjustments in deck and addition estimates.

---

## 3. Address-Based Property Data APIs

### Google Maps Platform - Solar API
- **Endpoints:** `buildingInsights.findClosest`, `dataLayers`, `geoTiff`; returns roof segments, pitch, azimuth, area, shade, 472M+ buildings in 40+ countries.
- **Pricing:** Pay-as-you-go via Google Cloud; third-party estimates **$0.10-$0.75 per call**; NOT_FOUND errors are free; 600 QPM cap. Standard Google Cloud monthly credit applies.
- **Source:** https://developers.google.com/maps/documentation/solar/overview , https://developers.google.com/maps/documentation/solar/building-insights , https://developers.google.com/maps/documentation/solar/usage-and-billing
- **Rec:** **This is the spine of Real Elite's widget.** Solar API returns roof area + pitch + segment geometry per address for pennies. Cache results in Turso keyed by lat/lng (round to 6 decimals). Fall back to Static Maps satellite imagery + Claude Sonnet 4.5 vision for buildings outside coverage.

### Nearmap
- **Products:** Roof Age API, Transactional Content API, AI Feature API; new **Roof Assessment** product (Q4 2025) - portfolio-scale condition scoring.
- **Pricing:** Quote-only; reputation for premium pricing (typical contractor packages $5K-$25K/yr per metro).
- **Source:** https://developer.nearmap.com/ , https://www.prnewswire.com/news-releases/nearmap-launches-ai-powered-roof-assessment-to-transform-portfolio-scale-roof-planning-302675928.html
- **Rec:** Skip until Real Elite has volume justifying enterprise spend; Google Solar API + EagleView reports cover residential need at 1/10 the cost.

### EagleView TrueDesign / ASSESS
- **Access:** SDK + REST API at developer.eagleview.com; embed in own site.
- **Pricing:** Per-report (see Section 1); API access requires sales contract.
- **Source:** https://developer.eagleview.com/api-documentation/truedesign
- **Rec:** Use only as a paid upgrade path post-deposit.

### Cape Analytics
- **Products:** Roof Condition Rating (5-point) via API; **Roof Age v3** (Oct 2025) - 95% accuracy on full-replacement detection; aPCR PDF/API.
- **Coverage:** 120M+ US/Canada single-family + commercial properties.
- **Pricing:** Insurance/enterprise contract pricing; not published.
- **Source:** https://capeanalytics.com/real-estate-property-intelligence/ , https://capeanalytics.com/resources/roof-age-version-3/
- **Rec:** Target market is insurance carriers; out of reach for a single contractor. Wait for resold access via a CRM partner.

### Vexcel Data Program
- **Products:** Elements API 2.0 - building footprint + 20+ attributes (roof material, condition, solar panels, tree coverage); covers 99.6% of US population.
- **Pricing:** Quote/partner-only.
- **Source:** https://vexceldata.com/products/elements/ , https://vexceldata.com/stories/top-3-ways-vexcel-api-2-0-delivers-powerful-ai-insights-on-properties/
- **Rec:** Strong second-source if Google Solar coverage misses a rural WV/MD/VA address; request a trial.

### ATTOM Data
- **Products:** Property Data API - 158M properties, 9,000+ attributes per property, includes tax/deed/valuation; 30-day free trial.
- **Pricing:** Starts **$95/mo**; enterprise custom.
- **Source:** https://www.attomdata.com/solutions/property-data-api/ , https://api.developer.attomdata.com/home
- **Rec:** Use **$95 starter tier** to enrich the widget with year-built, square footage, prior permits - crucial signal to size jobs and rank lead quality.

### RentCast / Zillow / Estated
- **RentCast:** 140M+ records, valuation + listings; tiered API plans.
- **Zillow:** Free for non-commercial; enterprise license needed for commercial widget use.
- **Estated:** Acquired by ATTOM; folding into ATTOM suite.
- **Source:** https://www.rentcast.io/api , https://batchdata.io/blog/top-real-estate-apis-in-2025
- **Rec:** RentCast is cheapest alternative to ATTOM if budget-bound (~$50-200/mo tiers).

### Mapbox + custom CV
- **Imagery:** 10-20 cm Vexcel-sourced aerial since 2024; 1.2M+ sq km added. Robosat (Mapbox's CV roof segmenter) is unmaintained.
- **Pricing:** Per-tile-load, usage-based; free tier on most accounts.
- **Source:** https://www.mapbox.com/imagery , https://www.mapbox.com/pricing
- **Rec:** Use Mapbox satellite tiles as **visual layer in the widget** even when Google Solar API powers the math. Run Claude Sonnet 4.5 vision on snapped tiles for "is this address even a single-family home?" sanity check.

### GAF QuickMeasure
- **Pricing:** Reports start **$18**, under **$20** for single-family; 1-hour turnaround; +$10 for hail/wind history; cheaper for GAF-certified contractors.
- **Source:** https://www.gaf.com/en-us/resources/business-services/quickmeasure , https://quickmeasure.gaf.com/
- **Rec:** **Cheapest verified measurement source** for residential. Real Elite should become GAF-certified for the discount and use QuickMeasure as the human-verified backstop when AI confidence drops below threshold.

---

## 4. Pricing Benchmarks Summary

| Tool | Entry Price | Per-Report / Per-Call | API? |
|---|---|---|---|
| Hover | $99/mo Pro | $25/job PAYG | Enterprise only |
| EagleView | Per-report | $15-$87/report | TrueDesign SDK/API |
| GAF QuickMeasure | None | **$18-$20/report** | Limited |
| Roofle | $350/mo + $2K setup | included | No (widget only) |
| Roofr | Free Starter | $13-$19/report | Limited |
| InstantRoofer | $199/mo | $10/human report | Embed only |
| JobNimbus | Quote | bundled | Webhooks/Zapier |
| AccuLynx | $250/mo Essential | bundled | Partner |
| ServiceTitan | $1,800+/mo | bundled | Partner |
| Buildertrend | $499-$1,799/mo | bundled | Limited |
| CompanyCam | $24-$49/user/mo | 10 AI credits/Pro | Yes |
| Google Solar API | Pay-as-you-go | **~$0.10-$0.75/call** | REST |
| Nearmap | Enterprise quote | Bundled | REST |
| Cape Analytics | Enterprise quote | Bundled | REST |
| Vexcel Elements | Partner quote | Bundled | REST |
| ATTOM | **$95/mo** | included up to limits | REST |
| RentCast | Tiered | included | REST |
| RSMeans | $900-$5,200/yr/seat | n/a | Limited |
| Commodities-API | ~$10-$50/mo | included | REST |
| Home Depot (3rd party) | ~$50/mo | ~$0.005-$0.02/call | Scraper API |

---

## 5. Strategic Recommendation for Real Elite

**Stack proposal for Next.js 16 widget + Prisma/Turso multi-AI estimator:**

1. **Geometry layer (cheap, high-volume):** Google Maps Solar API `buildingInsights` as the primary measurement source. Cache by rounded lat/lng in Turso. ~$0.10-0.50 per net new address.
2. **Property enrichment:** ATTOM Data $95/mo starter for sq-ft, year-built, owner type. Use to filter junk leads.
3. **Visual + sanity check:** Mapbox satellite tile + Claude Sonnet 4.5 vision call to confirm "is this a roof we can bid?" Multi-model router can fall back to Gemini 2.5 Pro for redundancy (vision quality parity, lower cost).
4. **Material pricing:** Phase 1 - hard-coded SKU table with monthly manual refresh; Phase 2 - SerpApi/Unwrangle scrapers for Home Depot SKUs + FRED softwood index for lumber adjustments; Phase 3 - apply for ABC Supply (myABCsupply) partner integration.
5. **Verified measurement upsell:** Trigger GAF QuickMeasure ($18-$20) on signed deposit only - lowest-cost verified backstop, gives Real Elite a GAF certification halo.
6. **Insurance jobs:** Push estimator output to Xactimate via Hover ($25/job PAYG) only when a homeowner has an open claim.
7. **Field documentation -> AI feedback loop:** CompanyCam Crew ($49/user) feeds photo URLs into your Claude/GPT/Gemini estimator app. Train internal prompts on these to improve square-footage and damage-scope accuracy over time.
8. **CRM strategy:** Don't compete with JobNimbus/AccuLynx; build webhook out of the estimator app so leads flow into whichever the customer adopts.

**Defensible moat:** Roofle, Roofr, InstantRoofer are **roofing-only widgets** with fixed pricing logic. Real Elite's multi-AI router (Claude 4.5 / GPT / Gemini / Groq) + multi-trade scope (roofing + siding + decks + framing) + veteran-owned branding + sub-$5/lookup unit economics is differentiated. Underprice Roofle ($350/mo) by charging contractors $99-$199/mo with usage caps once the widget is white-labelable.

---

## Sources
1. https://hover.to/pricing/
2. https://roofingsoftwareguide.com/guides/hover-pricing/
3. https://www.eagleview.com/pricing/
4. https://roofingsoftwareguide.com/guides/eagleview-pricing/
5. https://developer.eagleview.com/api-documentation/truedesign
6. https://offers.roofle.com/plans
7. https://offers.roofle.com/roof-quote-pro
8. https://www.jobnimbus.com/pricing
9. https://www.jobnimbus.com/blog/ai-roofing-role
10. https://buildertrend.com/press-releases/buildertrend-launches-ai-tool-for-97-faster-client-updates/
11. https://companycam.com/pricing
12. https://acculynx.com/plan-options/
13. https://roofingsoftwareguide.com/guides/acculynx-pricing/
14. https://www.servicetitan.com/industries/roofing-software
15. https://www.roofingcontractor.com/articles/101358-servicetitan-doubles-down-on-roofing-market-at-pantheon-2025
16. https://knowify.com/pricing/
17. https://roofr.com/pricing
18. https://roofr.com/estimator
19. https://www.ibeam.ai/
20. https://www.higharc.com/newsroom/higharc-announces-new-ai-capabilities-for-industry-leading-homebuilding-platform
21. https://www.instantroofer.com/
22. https://www.digitalcommerce360.com/2025/07/08/roofr-srs-distribution-launch-real-time-pricing-integration/
23. https://www.servicetitan.com/blog/roofing-supplier-integrations-srsdistribution-abcsupplyco-qxo
24. https://serpapi.com/home-depot-product
25. https://docs.unwrangle.com/homedepot-product-data-api/
26. https://www.rsmeans.com/products/online/tiers
27. https://commodities-api.com/symbols/LUMBER
28. https://fred.stlouisfed.org/series/WPU0811
29. https://developers.google.com/maps/documentation/solar/overview
30. https://developers.google.com/maps/documentation/solar/building-insights
31. https://developers.google.com/maps/documentation/solar/usage-and-billing
32. https://developer.nearmap.com/
33. https://www.prnewswire.com/news-releases/nearmap-launches-ai-powered-roof-assessment-to-transform-portfolio-scale-roof-planning-302675928.html
34. https://capeanalytics.com/real-estate-property-intelligence/
35. https://capeanalytics.com/resources/roof-age-version-3/
36. https://vexceldata.com/products/elements/
37. https://www.attomdata.com/solutions/property-data-api/
38. https://www.rentcast.io/api
39. https://batchdata.io/blog/top-real-estate-apis-in-2025
40. https://www.mapbox.com/imagery
41. https://www.gaf.com/en-us/resources/business-services/quickmeasure
42. https://www.forconstructionpros.com/construction-technology/estimating-bidding/product/22964682/
