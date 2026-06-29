# 11 — Long-Term Roadmap

The decade view. The product thesis is already written and sound (`docs/V2-BLUEPRINT.md`): the site is
not a brochure, it's a **trust-transfer engine and content flywheel**, and its atomic unit is the
**Project Object**. This roadmap is the *engineering* sequencing to realize that — building durable
platform capability, not one-off pages.

> Principle: **architect for the whole arc now, build the front of it first.** Every quarter's work
> should make the next quarter cheaper. Avoid features that don't compound.

---

## Horizon 1 — Foundation & Flywheel (next ~1–2 quarters)

*Goal: the Project Object is real and compounding; the platform is consistent and resilient.*

1. **Content architecture convergence** (B8/B9/B16) — retire the `CONTENT` monolith and the three
   parallel offering models; one shared content model; one `PageScaffold`. *This is the foundation
   everything else stands on.*
2. **Design-system formalization** (B12/B14/B15) — Section/Card/CTA/RelatedContent primitives; spacing
   + motion + type tokens; a `/styleguide` and written rules. *Makes the system survive contributor
   growth.*
3. **The Project flywheel, v1** (B13/B24/B17) — author real projects; cinematic project pages; faceted,
   indexable Project Gallery (`/projects?service=…&city=…`); homepage proof derives from the pool.
   *The single biggest value unlock per the blueprint.*
4. **GEO entity graph** (B11/B20) — `@id`-linked Org→Service→Project→Review; `Offer`/`LocalBusiness`/
   `Project`/`Video` schema. *The AI-citation substrate.*
5. **Quality bar** (B18) — Playwright funnel E2E + axe-in-CI + coverage floor + CWV budget.

**Exit criteria:** 20–50 real projects live and rendering everywhere (gallery, service proof modules,
city proof modules, homepage); one content model; one design system; CI guards correctness, a11y, and
performance.

---

## Horizon 2 — Proof Engines & Authority (~2–4 quarters out)

*Goal: the "four cross-linking proof engines" (Services · Projects · Reviews · Resources) are all live
and feed each other.*

1. **Review Center** (B25) — reviews as **objects**, Google Business Profile integration, project-linked
   (thumbnail + deep link), filterable by service/city/rating, a lane for **video reviews**. Wire the
   existing review-request engine to drive review velocity (the #1 local-pack input). *Honest gating
   preserved.*
2. **Resource Center consolidation** (B26/B27) — collapse `/blog`+`/guides` → `/resources` (with 301s);
   one knowledge brand; every article opens with a citable answer block + `Article`/`FAQPage` schema;
   expand the hyper-local **permit-guide moat**.
3. **IA / navigation v2** (B27) — five-anchor nav (Services · Projects · Reviews · Resources · Process),
   featured-project mega-menu, breadcrumbs everywhere, context-aware CTAs.
4. **On-site scoped search** (B28, phase 1) — faceted filtering inside Projects/Resources (feels like
   search, always returns rich results).

**Exit criteria:** every Service links to its Projects, Reviews, Resources, and Cities; every Project to
its Service, City, Review; every City to its Services/Projects/Reviews. The mesh that "makes the site
feel infinite" and gives AI a dense entity graph.

---

## Horizon 3 — Intelligence & Lifetime Platform (~4–8 quarters out)

*Goal: AI removes the homeowner's two enemies — uncertainty and waiting — and the site becomes the front
door to a lifetime relationship platform.*

1. **AI-answered search / Project Advisor** (B28, phase 2) — "primary bath, modern, ~$40k, Great Falls"
   → scoped direction + relevant projects + budget band + booked consult, answered **from Real Elite's
   own project + resource corpus**. The same corpus is the external-AI-citation moat. *Requires the
   Horizon-1/2 entity graph to exist first — which is why we build it now.*
2. **AI Cost Assistant** — evolve the Instant Roof Quote into honest ballpark ranges per service + zip +
   scope.
3. **AI Visualizer / Material Advisor** — "see our work on your house"; "roofing for a 1920s Charles
   Town home."
4. **Customer portal** — during-build status, photo timelines, the same project lead (augmented, never
   replaced, by AI); post-build **home dashboard** (warranties, materials, maintenance, proactive
   re-engagement) — the retention/referral engine.

**Design rule (from the blueprint, keep it):** *AI augments the human relationship, never hides it.* The
veteran-owned, same-lead promise is the brand.

---

## The cross-cutting epic: Mission Control data contracts (start designing in Horizon 1)

The blueprint's most important long-term instruction: the public site and the internal ops platform
("Mission Control") should share the **same Project, Review, and Customer objects** — a job completed in
ops auto-publishes a Project draft; a site lead flows into ops. **Keep the repos separate, but design
the data contracts now** so they speak the same language later.

**Engineering implication:** the `Project`/`Review`/`Customer` types should be authored as a **stable,
versioned schema** (the `src/lib/projects/types.ts` "public lens" is already exactly this thinking — it
deliberately excludes price/address/PII). Treat these types as a **published contract**, not internal
shapes. When a backend/CMS arrives, the site consumes the same contract via an adapter — no rewrite.

> The current code already embodies this discipline: `projects/types.ts` documents the public-vs-
> operational split and validates relationships against canonical catalogs at test time. Extend that
> rigor to Reviews and (eventually) Customers.

---

## Platform investments that pay off across all horizons

| Investment | Why it compounds |
|---|---|
| **One content model + adapters** | Lets you move from TS objects → MDX → CMS → Mission Control API with no page rewrites. |
| **Versioned object contracts** (Project/Review/Customer) | The membrane between site, ops, and AI. Build once, reuse forever. |
| **Entity graph (`@id`) + answer blocks** | Same substrate powers SEO, GEO, on-site AI, and external AI citation. |
| **Design system + PageScaffold** | New page types become assembly, not construction. |
| **E2E + a11y + CWV budgets in CI** | Quality scales with content volume instead of degrading. |
| **Photography standard & capture workflow** *(process, not code)* | The blueprint's loudest non-engineering flag: site quality ceiling = camera on the job site. Flag to leadership; the flywheel is only as good as its inputs. |

---

## What to deliberately NOT build (discipline = strategy)

From the blueprint's "what to remove" + an engineering lens:
- **No thin auto-spun service×city pages** — keep gating combos behind hand-written/real-project content.
- **No premature global search** — faceted first; AI search only when corpus depth justifies it.
- **No second brand / split site** for luxury vs EP — one spine, market-adaptive proof (already proven
  with `LUXURY_CITY_SLUGS`).
- **No CMS before the content model is converged** — adopting a CMS on top of three parallel models
  would cement the debt. Converge first (Horizon 1), then consider a CMS.
- **No fabricated proof, ever** — the honesty gating is a moat; encode it as a hard guardrail
  ([12](12-engineering-recommendations.md)).
</content>
