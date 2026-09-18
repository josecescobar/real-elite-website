# What altitude to build at — architecture recommendation, 2026-09-18

**Question:** the demand is regional, the site is municipal. Region-first or
town-first, what happens to the existing town pages, is combinatorial
service+city generation the right pattern, where does Northern Virginia sit
relative to the WV home market, and does paid belong in the plan.

**Sources:** the five research docs listed at the end, read and not
re-derived; plus fresh pulls made today and dated in §1 — DataForSEO keyword
metrics via OpenSEO (US, 2026-09-18), three live SERPs (2026-09-18), and Search
Console 2026-03-15 → 2026-09-15, **mobile only**, per the convention in
`search-traffic-reality-2026-09-17.md`.

---

> **Correction, 2026-09-18 (same day, after Phase 1 began).** Checking the
> town-level *kitchen and bathroom* terms before consolidating any pages
> reversed part of this document. The altitude finding is **trade-specific as
> well as market-specific**: NoVA basements are searched regionally, but
> kitchens and bathrooms in the very same towns carry real reported volume —
> `kitchen remodeling ashburn va` 480/mo, `kitchen remodeling alexandria va`
> 390, `bathroom remodeling alexandria va` 320, `kitchen remodeling mclean va`
> 260, `kitchen remodeling vienna va` 140. §2's name test and §3.3's Tier C
> are corrected in place below. Tier C consolidation was held for the reasons
> in §8 and **shipped on 2026-09-18** once Phase 2.1 gave its basement combos
> a target; that correction is what split its ten combos across two
> destinations. Full data in §1.5. Nothing in "The short version" is
> withdrawn; item 1 is sharpened from "a property of each market" to "a
> property of each market and trade."

## The short version

1. **"Region-first vs town-first" is the wrong frame.** The right altitude is
   not a site-wide choice; it is a property of each market **and each trade**,
   and it is *the name people type after the trade.* In the Eastern Panhandle
   that name is the town (Martinsburg carries 370 of the 440 reported
   searches; "Eastern Panhandle", "Berkeley County" and "Jefferson County"
   return nothing for any trade). In Maryland and the Shenandoah it is the
   city, because the city *is* the region's name (Frederick, Hagerstown,
   Winchester). In Northern Virginia it splits by trade: **basements** are
   searched at region or county-seat altitude — "northern virginia", "fairfax
   va", "alexandria va" — and not in the affluent suburbs the site was built
   around, while **kitchens and bathrooms in those same suburbs are searched
   by town**, with 480/mo in Ashburn and 260 in McLean. So the NoVA town pages
   are wrong for basements and right for kitchens and baths. Only Clifton,
   Fairfax Station and Middleburg fail the test in every trade.

   *Revised 2026-09-18 — the first version of this item put Vienna, Great
   Falls, Reston and McLean in the failing set, which was true of basements
   and not of the towns. See the correction above and §1.5.*

2. **Do not restructure the site. Re-tier it.** The area model gets one new
   level (region/county) above the town, one Northern Virginia basement page
   is added at that level, and the existing pages are sorted by evidence into
   keep, freeze, or consolidate. That is a data-model change and a handful of
   redirects, not a rebuild. The full region-first restructure with mass
   redirects is rejected in §7, with the reasoning.

3. **The service+city pattern is sound engineering fed a bad seed list.** The
   mechanism — a typed content map, static params derived from its keys, hard
   404 on anything else, tests that enforce real services and real places —
   is right and should stay. The failure is that the "city" axis was
   populated from a real-estate map of where money lives rather than from
   what people search. "Manufactured demand" is too strong; **over-resolved**
   is accurate. Five of the thirteen Northern Virginia basement pages do
   register real mobile impressions at positions 12–20. Four register none in
   six months.

4. **The honest read on the search opportunity.** 270 regional basement
   searches a month does not justify restructuring anything. It justifies one
   page and a paid test. What the fresh pull adds is that the *whole*
   Northern Virginia regional set across trades is on the order of 3,000
   searches a month — seven times the entire WV home-market grid — with the
   highest CPCs in any of these audits. That is a real market. Whether a
   Martinsburg crew can serve $150k jobs sixty miles away is an operating
   decision, not an SEO one, and this document does not make it for you (§9).

5. **Where the money is, in order:** (a) the local pack in WV, which is a
   reviews problem and is at 0 of 25 grid points; (b) a paid test in Northern
   Virginia, sequenced behind GA4 and behind verified claims; (c) referrals
   and directory profiles, which is how NoVA buyers shortlist; (d) organic
   regional pages, which are cheap, slow, and worth doing once — not
   sixty-nine times.

6. **GA4's CONVERSION REPORTING counts none of this, until `generate_lead` and
   `phone_click` are marked as key events.** That is the first line of the
   sequence in §8, and it is yours.

   Corrected 2026-09-18: an earlier version of this line said nothing above
   could be *read* until then. That is wrong, and it would stall work that is
   not actually blocked. **Raw event counts are already queryable** — the flag
   governs conversion reporting, not whether an event is recorded. The Phase 5
   lead comparison uses raw `generate_lead` counts and does not wait on this.
   See `docs/ga4-conversion-tracking.md` and
   `docs/phase-5-baseline-2026-09-18.md`.

---

## 1. New evidence pulled today

### 1.1 The regional altitude generalises beyond basements — in Northern Virginia only

DataForSEO via OpenSEO, US, 2026-09-18. One canonical phrasing per term.

| Term | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| `deck builder fairfax va` | 590 | 7 | $20 |
| `kitchen remodeling fairfax va` | 480 | 11 | $66 |
| `bathroom remodeling northern virginia` | 320 | 0 | $59 |
| `roofing companies fairfax va` | 260 | 0 | $22 |
| `roofing companies northern virginia` | 260 | 25 | $17 |
| `bathroom remodeling fairfax va` | 210 | 8 | $67 |
| `kitchen remodeling northern virginia` | 210 | 0 | **$98** |
| `home remodeling northern virginia` | 210 | 22 | $29 |
| `general contractor northern virginia` | 210 | 11 | $16 |
| `roofing northern virginia` | 170 | 29 | $31 |
| `basement remodeling northern virginia` | 110 | 0 | $31 |
| `basement finishing northern virginia` | 90 | 0 | $99 |
| `basement remodeling alexandria va` | 70 | 0 | — |
| `home additions northern virginia` | 50 | 0 | $31 |
| `basement remodeling northern va` | 40 | 0 | $83 |
| `deck builders northern virginia` | 30 | 0 | $54 |

Basements are the **smallest** of the regional trade terms, not the largest.
Kitchens and bathrooms at region and Fairfax altitude are two to four times
the basement volume at comparable CPC. Decks at Fairfax altitude are the
single largest NoVA term and the cheapest click.

**Returned no data** (below the reporting floor or clustered — not
distinguishable, per `where-the-demand-actually-is.md`): `basement finishing
fairfax va`, `basement remodeling fairfax county`, `basement finishing fairfax
county`, `basement remodeling loudoun county`, `basement finishing loudoun
county va`, `deck builders loudoun county va`, `basement remodeling arlington
va` (20, HIGH competition), `basement finishing alexandria va` (10).

### 1.2 The home market does not search by region at all

Every Eastern Panhandle regional phrasing returned nothing: `roofing eastern
panhandle wv`, `contractors eastern panhandle wv`, `general contractor eastern
panhandle wv`, `home remodeling eastern panhandle`, `roofing companies
berkeley county wv`, `deck builder berkeley county wv`, `basement finishing
berkeley county wv`, `roofing jefferson county wv`, `contractors jefferson
county wv`, `basement remodeling west virginia`.

Against that, the city-level terms in the adjacent markets are the largest
geo-modified numbers in any of these audits:

| Term | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| `roofing frederick md` | **880** | 9 | $14 |
| `roofing hagerstown md` | 210 | 18 | $12 |
| `contractors winchester va` | 170 | 6 | $8 |
| `roofing winchester va` | 140 | 8 | $19 |
| `deck builder frederick md` | 110 | 1 | $30 |
| `basement remodeling maryland` | 70 | 0 | $47 |

`roofing frederick md` at 880 a month is eight times the largest Northern
Virginia basement term. The site already has `/services/roofing/frederick-md`.
Search Console shows **no impressions for any Frederick roofing query** on
mobile in six months — the page exists and Google does not show it. That is
not an altitude problem and it is outside this brief, but it is the largest
single number in the dataset and it deserves its own look.

### 1.3 The SERPs at regional altitude

Live, 2026-09-18, depth 20.

**`basement remodeling northern virginia`** — local pack at 1–3
(BasementRemodeling.com ×2, Reimagine Renovations). Organic 4–20: nine
contractor *regional service pages* (BasementRemodeling.com home, Marines
Plumbing, Wentworth Studio, Northwood Construction, Michael & Son, Sage,
Alvarado Custom Carpentry, MOSS, Synergy, Denny + Gardner) and four
directories (Yelp, Facebook, BestPick, Angi). Wentworth is based in Chevy
Chase MD; MOSS in Chantilly. **Out-of-market firms rank organically here.**
A plumbing company's basement page ranks 7. KD 0 is real.

**`basement finishing northern virginia`** — AI Overview at 1, then two
organic results at **2–3, above the local pack** (which sits at 4–6). The
SERP runs out of relevant results at rank 17: ranks 17–20 are the Virginia
sales-tax holiday, a Substack, the Department of Elections, and Wikipedia.
That is a supply-thin SERP. A relevant page would enter the top 16 almost by
default.

**`basement remodeling fairfax va`** — local pack 1–3, then Yelp,
BasementRemodeling.com's Fairfax page (snippet quotes "$55,000 to
$150,000"), Northwood's *regional* page at 7, Sage's regional page at 8, and a
Herndon town page at 13 (snippet quotes "$45,000 – $140,000 typical, 8 – 14
weeks"). **One regional page ranks on the Fairfax query too.** Fairfax does
not need its own page to start.

Three things this settles for page design: the page type is a service page,
not a guide; the winning snippets quote a price range and a timeline; and
directories are a third of the organic field.

### 1.4 What Search Console says about the current inventory

Mobile only, 2026-03-15 → 2026-09-15.

- Queries containing "northern virginia": **zero impressions**. Queries
  containing "fairfax": one row, 3 impressions at position 57.7. The site is
  invisible at the altitude where the demand is.
- **Every page under `/services/` and `/service-areas/` — 43 pages with any
  mobile impressions — produced zero mobile clicks in six months.** The
  positions run 12 to 58. This is the fact the rest of the document has to
  respect: the entire location-bearing inventory is on page two or worse,
  everywhere, and the clicks the site does get come from the driveway guide,
  the homepage, and paving.
- The Northern Virginia basement pages, six months, mobile:

| Page | Impr. | Position | Ads volume for the town term |
| --- | --- | --- | --- |
| `/services/basements/alexandria-va` | 52 | 20.5 | 70/mo |
| `/services/basements/great-falls-va` | 51 | 12.0 | none |
| `/services/basements/vienna-va` | 50 | 16.4 | none |
| `/services/basements/reston-va` | 21 | 12.3 | none |
| `/services/basements/mclean-va` | 3 | 24.0 | 30/mo |
| `/services/basements/burke-va` | 0 | — | none |
| `/services/basements/clifton-va` | 0 | — | none |
| `/services/basements/fairfax-station-va` | 0 | — | none |
| `/services/basements/middleburg-va` | 0 | — | none |

- Area overview pages with meaningful mobile impressions: Inwood 632 (21.1),
  Leesburg 455 (21.9), Frederick 431 (37.7), Hedgesville 245 (12.9, mostly
  plumbing queries the site cannot serve), McLean 209 (34.5), Winchester 149,
  Great Falls 106, Hagerstown 86, Clifton 48 (15.2). Ranson 3 at 7.7.

---

### 1.5 The correction: altitude is per trade, not just per market

Pulled 2026-09-18, after Phase 1 began, to apply the name test properly
before consolidating any page. It reversed part of §3.3.

| Term | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| `kitchen remodeling ashburn va` | **480** | 0 | $69 |
| `kitchen remodeling alexandria va` | 390 | 1 | $79 |
| `bathroom remodeling alexandria va` | 320 | 0 | $63 |
| `bathroom remodeling ashburn va` | 260 | 1 | $74 |
| `kitchen remodeling mclean va` | 260 | 0 | — |
| `bathroom remodeling mclean va` | 140 | 0 | — |
| `kitchen remodeling vienna va` | 140 | 0 | — |
| `bathroom remodeling leesburg va` | 90 | 0 | $16 |
| `kitchen remodeling great falls va` | 90 | 0 | — |
| `bathroom remodeling vienna va` | 70 | 0 | — |
| `kitchen remodeling reston va` | 70 | 0 | — |
| `bathroom remodeling reston va` | 50 | 0 | $23 |
| `kitchen remodeling leesburg va` | 40 | 0 | $87 |
| `basement remodeling mclean va` | 30 | 0 | — |
| `bathroom remodeling burke va` | 10 | — | — |
| `kitchen remodeling burke va` | 10 | 39 | — |

**Returned no row in any of the three trades:** Clifton, Fairfax Station,
Middleburg. Plus `basement remodeling burke va`.

**What this changes.** The original §2 put Vienna, Great Falls, Reston and
McLean in the "fails the name test" bucket. That was true *for basements*,
which is the trade the brief asked about, and I generalised it to the towns.
It is false for kitchens and bathrooms: McLean at 260, Vienna at 140, Great
Falls at 90 and Reston at 70 are reported town-level kitchen demand, and the
site already has pages for all of them.

So the honest statement is narrower and more useful than the original: **in
Northern Virginia, basements are searched regionally and kitchens and
bathrooms are searched by town.** One market, two altitudes, decided by
trade. A single site-wide altitude was never going to be right, and neither
is a single per-market one.

**What it does not change.** The regional basement page is still the build
(§3.2) — no town-level basement term in NoVA has a row except McLean at 30
and Alexandria at 70, against 110 + 90 + 70 at region and Fairfax altitude.
And it reinforces §5: kitchens and bathrooms are the larger paid market,
now at town level as well as regional, at $63–$87 a click.

**Method note, since this document has a history of them.** The error was not
in the data. It was generalising a finding about one trade into a finding
about a place, which is the same family of mistake §10 of
`where-the-demand-actually-is.md` catalogues. The keyword rows for basements
were correct; the sentence written around them reached further than they
supported. Checking before deleting pages caught it.

## 2. The altitude finding, stated properly

The 2026-09-18 brief says "the demand is regional, not municipal." That is
true of Northern Virginia and false of West Virginia, and the difference is
the whole architecture.

**The name test.** A location page earns its existence if the place name in
its URL is a name people put after a trade when they search. That is an
empirical question with three possible answers per place:

**Corrected 2026-09-18 — the test is per place AND trade.** The original
version of this list graded places, which is what produced the error in
§1.5. A place can pass for one trade and fail for another in the same
breath, so each bucket below names the pairing.

- **Reported volume** (an Ads row exists): every trade in Martinsburg,
  Charles Town and Inwood; roofing and decks in Frederick, Hagerstown and
  Winchester; decks in Leesburg/Ashburn; **kitchens and bathrooms in Ashburn,
  Alexandria, McLean, Vienna, Great Falls, Reston and Leesburg**; basements in
  Alexandria and McLean; and basements at "Northern Virginia" and "Fairfax VA"
  altitude. Build here.
- **Below the floor but observed** (no Ads row, but Search Console
  impressions on the exact phrasing): basements in Ranson, Vienna, Great
  Falls, Reston and Clifton. Real, tiny. Keep what exists; add nothing.
- **Nothing on either instrument**: all three premium trades in Clifton,
  Fairfax Station and Middleburg; basements in Burke; and every Eastern
  Panhandle regional phrasing — "Eastern Panhandle", "Berkeley County",
  "Jefferson County" — plus "Loudoun County" for basements. Do not build.

Note what moved: **McLean, Vienna, Great Falls and Reston left the bottom
bucket entirely** on the strength of their kitchen and bathroom rows. Only
Clifton, Fairfax Station and Middleburg are now empty across the board.

The site currently has one altitude everywhere — town — and applied it to a
suburban market that does not think in towns. The fix is not to switch the
whole site to region altitude; that would make the WV pages worse, because
nobody in Inwood searches "eastern panhandle basement". The fix is to let the
area model carry more than one altitude and to populate it by the name test.

---

## 3. The information architecture

### 3.1 The area model: one record, a `kind`, and a `parent`

Today `constants.ts` holds four overlapping lists (`PRIMARY_`, `SECONDARY_`,
`EXPANSION_SERVICE_AREAS`, and `LUXURY_CITY_SLUGS`), de-duplicated at runtime
into `ALL_SERVICE_AREAS`, with `COMBO_CITY_SLUGS` in `service-city-content.ts`
as a fifth. `loudoun-county-va` and `brambleton-va` already smuggle a county
and a planned community through a field named `city`. That is the model
straining at exactly the point this brief is about.

Recommended shape — one array, derived views:

```ts
type ServiceArea = {
  slug: string;
  name: string;                 // "Northern Virginia", "Fairfax", "Inwood"
  state: 'WV' | 'MD' | 'VA';
  kind: 'town' | 'city' | 'county' | 'region';
  parent?: string;              // vienna-va → northern-virginia
  market: 'home' | 'premium';   // replaces LUXURY_CITY_SLUGS
  status: 'active' | 'consolidated';
  redirectTo?: string;          // required when status === 'consolidated'
};
```

What each field buys:

- `kind` drives the schema type (`City` vs `AdministrativeArea`), the H1
  phrasing ("in Vienna, VA" vs "across Northern Virginia"), and which
  template sections render. It also gates the one operational claim the
  generic city template makes today — "sits inside our primary service
  radius, so on-site visits are typically scheduled within the same week" —
  which is fine for Inwood and indefensible for Great Falls.
- `parent` builds the breadcrumb (Home › Service Areas › Northern Virginia ›
  Vienna), the hub's list of children, and the child's link up. It is the
  internal-link graph as data.
- `market` folds `LUXURY_CITY_SLUGS` into the record so the CTA routing has
  one source of truth instead of a parallel set.
- `status` + `redirectTo` make consolidation a data change: the route stops
  building the page, and a generated (or small explicit) redirect list sends
  the old URL to the parent. Because the combo route uses
  `dynamicParams = false`, removing a `CONTENT` key without a redirect ships
  a hard 404 — the redirect has to land in the same deploy.

The existing tests (`service-city-content.test.ts`, `constants.test.ts`,
`reviews.test.ts`, `projects.test.ts`) already validate every slug against
`ALL_SERVICE_AREAS`, so this refactor is safe to do first and independently.
It is the one piece of this document I would build before anything
content-facing.

### 3.2 Routes and URLs: reuse, do not invent

- **`/services/basements/northern-virginia`** — the money page. Same
  `[service]/[city]` route, same template, same `CONTENT` map; `northern-virginia`
  is just an area slug of `kind: 'region'`. Title shape from the SERP
  winners: "Basement Finishing & Remodeling in Northern Virginia | Real
  Elite", description leading with a price range and a timeline once those
  are verified (§9).
- **`/service-areas/northern-virginia`** — the regional overview, a hub
  page listing the NoVA children and the services offered there. Same
  `[slug]` route.
- **No `/northern-virginia/` top-level section, no subdomain, no separate
  nav tree.** The rejected alternatives are in §7.
- **Fairfax** starts as an H2 section on the regional basement page
  ("Fairfax County") and is promoted to `/services/basements/fairfax-va` only
  if, after the regional page has ranked, the `fairfax va` query does not
  follow it. Northwood's regional page ranking 7 on the Fairfax query is the
  evidence this can wait.
- The area slug for Fairfax, when it comes, is `fairfax-va` (the term people
  type), `kind: 'county'`, displayed as "Fairfax County".

### 3.3 What happens to the existing pages

Sorted by evidence, not by one rule. Risk column is SEO risk of the action.

| Tier | Pages | Action | SEO risk |
| --- | --- | --- | --- |
| **A — keep and invest** | All WV town pages (`/service-areas/*-wv`, the six WV combos); Frederick, Hagerstown, Winchester; Leesburg, Ashburn, Loudoun, Brambleton decks | No structural change. These pass the name test or hold positions. | None. Redirecting any of these would be the single most damaging move available. |
| **B — keep, freeze, re-parent** | NoVA combos with mobile impressions: `basements-{alexandria, great-falls, vienna, reston}-va`; the `/service-areas/` overview for every NoVA town | Stay indexed, self-canonical. Gain `parent: northern-virginia`, link up to the hub, and the hub links down. Strip unverified claims to the verified set (§3.5). Re-read at 90 days. | Low. The pages hold positions 12–20 on real long-tail; a redirect now would trade observed impressions for a hub that has none yet. Cannibalisation risk with the hub is small: Google matches "northern virginia" queries to the page that says Northern Virginia. |
| **C — consolidate** *(DONE 2026-09-18)* | The 10 combos with zero mobile impressions in six months **and** no Ads row in any trade: all three of `{bathrooms, kitchens, basements}-{clifton, fairfax-station, middleburg}-va`, plus `basements-burke-va`. | Shipped: CONTENT keys removed, permanent redirects generated from `src/lib/retired-combos.ts`. **Two destinations, one rule** — most specific surviving page that still serves the query. Basements → `/services/basements/northern-virginia` (trade kept, place widened). Kitchens and baths → the town's own `/service-areas/` page, because those trades have no regional page by design. | Negligible — no impressions means no rankings to lose. The towns' area pages are Tier D and survive, so the kitchen/bath 301s land on live pages. |
| **D — leave alone** | `/service-areas/{burke, clifton, fairfax-station, middleburg, mclean}-va` overview pages | Keep. Clifton's area page holds 48 impressions at 15.2; McLean's 209. They become children of the hub and gate their operational FAQ by `kind`. | None. |

Alexandria is the interesting case and the proof the name test works: it is a
NoVA "town" page that passes, because Alexandria is a city of 160,000 whose
name people actually type (70/mo for basements, 390 for kitchens, 320 for
bathrooms). It stays a full page.

> **Correction, 2026-09-18.** Tier C originally named `basements-mclean-va`
> and the Burke, Clifton, Fairfax Station and Middleburg basement combos,
> and speculated that "the kitchen/bath combos in the same towns" would join
> them "once their rows are checked." The rows were then checked (§1.5) and
> the answer went the other way.
>
> **McLean is withdrawn from Tier C entirely.** It has an Ads row for all
> three trades — basements 30/mo, kitchens 260, bathrooms 140 — and 3 mobile
> impressions on the basement page. It belongs in Tier B. Consolidating it
> would have deleted a page for reported demand, which is the exact error
> this document accuses the original site build of making.
>
> **Burke keeps its kitchen and bathroom pages** (10/mo apiece — tiny, but
> reported) and loses only its basement combo.
>
> Tier C is therefore 10 combos, not 5-plus-speculation, and none of them is
> in a town that shows demand for anything. Correcting this cost one keyword
> call and would have cost five wrongly deleted pages.

Not one WV page moves. The brief's "60+ existing town pages" is, precisely:
25 area overview pages, 69 service+area pages, and 10 paving location pages
— 104 location-bearing URLs. Under this plan roughly five to fifteen of the
69 combos consolidate, one region and one regional combo are added, and the
rest are re-parented in data without changing URL.

### 3.4 Where Northern Virginia sits relative to the home market

**West Virginia is the entity. Northern Virginia is a served region with its
own hub.** Not a co-equal, and not a rebrand.

Reasons, in order of weight:

1. Every entity signal Google reads — the Business Profile pin, the reviews,
   the project photography, the licensing narrative, the schema address —
   says Martinsburg. A site that presents as a Fairfax firm attached to an
   Eastern Panhandle pin reads as a lead-gen site, and that is a trust problem
   with homeowners before it is a ranking problem with Google.
2. Organic rankings at regional altitude do not require the entity to be in
   the region (§1.3: Chevy Chase and Chantilly firms rank for "northern
   virginia"). So nothing is gained by pretending.
3. The NoVA money already has its own conversion path
   (`/design-consultation`, `market: 'premium'`). The hub simply becomes the
   organic front door to that path.

In practice: the homepage stays WV-led; the mega-menu and footer gain a
"Northern Virginia" entry pointing at the hub; the `/service-areas` index
gets a fourth regional group rather than listing NoVA towns under "Virginia"
alongside Winchester. The V2 blueprint's "one spine, two psychologies" holds;
this is the IA that implements it without a second site.

### 3.5 Claims: a guard test, not a review

The six claims the brief flags — written workmanship warranty, one named
project lead, daily progress photos, clean job site every evening, same-day
response standard, 8–22 week timelines — are **not confined to the NoVA
pages.** "Written workmanship warranty" is in the sitewide FAQ in
`constants.ts` and on the roofing, kitchen, repair and handyman service
pages. "Named project lead" and "daily updates, clean job site" are on the
kitchens page. The gate CLAUDE.md describes is already open sitewide; the
NoVA pages only raise the stakes per job.

Recommendation, in the repo's own idiom (it already has a guard test that
fails the build on a bare `tel:` link): a **claims guard** in
`service-city-content.test.ts` and `services-data.test.ts` — a list of
claim patterns, each marked `verified: true | false` by you, and a test that
fails when unverified text appears in any published paragraph. Confirming a
claim is a one-line flip. Retracting one fails the build until the copy is
fixed. That turns "ask the owner" from a process into a check.

Until you answer §9, the NoVA regional page ships with only the claims that
are already verified on the WV pages (licensed in WV, MD and VA;
veteran-owned; written itemized estimate before work starts) and no
timeline. The SERP winners quote a range and a timeline, so this costs
something — which is why the answer matters.

---

## 4. Is service+city generation the right pattern?

Yes, with the axis renamed in your head from "city" to "market name."

What is right and should not change: content lives in a typed map; the
route builds only what the map has; anything else is a hard 404; tests
enforce that every key resolves to a real service and a real place and that
metadata overrides are not dead weight. That is exactly how a location
inventory should be built, and it is why re-tiering is cheap — the model
already does the work.

What went wrong is upstream of the pattern. The city list was chosen by
where premium homes are (McLean, Great Falls, Vienna, Clifton, Fairfax
Station, Middleburg), and premium homeowners in the DC suburbs do not search
by their town. 51 of the 69 combos are Virginia; 13 are basements; the ones
in towns that fail the name test have, in six months, produced zero mobile
clicks between them — as has every other page in the tree. The pattern did
not manufacture demand; it resolved real demand one level too fine, and it
did so 51 times before anyone measured once.

The rule going forward is the name test in §2, applied *before* a key is
added, and documented in the comment block above `COMBO_CITY_SLUGS` where the
current rationale lives. Adding a key should cite the Ads row or the Search
Console query that justifies it, the way the WV basement entries already
cite their positions.

---

## 5. Paid search

**It belongs in the plan, and it is the fastest way to answer the real
question — but not first.**

The arithmetic, labelled as arithmetic. The three regional basement terms sum
to 270 searches a month at a volume-weighted CPC of about $80. A well-matched
ad at the top of the page takes 5–8% of searches; call it 16 clicks a month,
roughly $1,300. Contractor landing pages convert 5–10% of paid clicks to a
form or call, so one to two leads a month at $650–$1,300 per lead. At a
20–30% close rate that is one job every three to five months, at
$4,000–$6,500 acquisition cost, against a $130k–$350k job. If the crew can
do the job, the math is not close. That is what a $99–$132 CPC means:
advertisers with their own money have already done this sum.

What a three-month, roughly $4,000 test actually buys is not revenue. It buys
the answer to "does a Northern Virginia homeowner call a Martinsburg
contractor about a six-figure basement, and what do they say when they do."
Two to five leads is enough to hear the objection, if there is one, before a
year of content is built on the assumption there is not. That is worth more
than the same $4,000 spent on pages.

Three conditions, all before the first dollar:

1. GA4 key events for `generate_lead` and `phone_click`, or the spend cannot
   be evaluated at all.
2. A landing page whose claims are verified (§3.5). Paid traffic reads the
   page; an unverified "same-day response standard" in front of a paid
   $132 click is the worst place for it.
3. A dedicated tracking number on the landing page. The repo already runs
   Twilio for missed-call text-back, so a NoVA number that forwards to the
   main line is small work and separates paid calls from everything else.

Two things paid cannot fix: the sixty-mile drive, and the local pack. On the
second, Local Services Ads sit above the pack and are set by service-area
zip, which makes them the only Google surface where an out-of-market pin is
not disqualifying — but LSA ranking still weights proximity and review count,
so treat it as a second test, not a workaround.

**One option worth putting in front of you.** Basements are the trade with
the highest job value and zero NoVA proof — no project page, no NoVA review,
claims unverified. Decks are the trade with the site's only NoVA rankings
(Loudoun), real photography, a published project, deck reviews, and the
largest, cheapest Fairfax term in the dataset (`deck builder fairfax va`,
590/mo, $20 CPC). A paid test on decks proves the market and the funnel for a
tenth of the click cost; a paid test on basements proves the thing you
actually want. I would run decks first if the budget is one test, and both if
it is two. That is your call (§9).

Kitchens are the larger paid market than basements at regional altitude
(`kitchen remodeling northern virginia`, 210/mo at $98; `kitchen remodeling
fairfax va`, 480/mo at $66). Noted, not recommended: kitchens have the same
zero-proof problem as basements and longer design lead times.

---

## 6. What I would not build

- **More town pages in Northern Virginia.** Any of them. The name test fails.
- **Region × service programmatically.** Adding `northern-virginia` to all
  seven featured services on day one repeats the original mistake one level
  up: seven pages for demand nobody has confirmed the business can serve. One
  page, one trade, measured, then the second.
- **A separate NoVA brand, microsite, or subdomain.** Splits the thin
  authority the domain has (31 referring domains), doubles the maintenance,
  and creates the entity confusion §3.4 is designed to avoid.
- **A Fairfax or Loudoun Business Profile, virtual office, or borrowed
  address.** It is the obvious hack and it is the one that gets the real
  listing suspended. Service-area businesses may not list addresses they do
  not staff.
- **A CTR or snippet project.** Constraint 4 stands; the fresh pull confirms
  it — the inventory has zero mobile clicks because it is on page two, not
  because of its titles.
- **Cost-framed content.** Constraint 5 stands. The one exception is the
  price range *on the service page*, because the SERP winners carry it in
  their snippet and a service page is transactional; a separate "basement
  cost northern virginia" guide would feed the AI Overview that already
  sits at rank 1 on the "finishing" query.
- **Redirecting any West Virginia page anywhere.**
- **Luxury copy without proof.** "La Cornue", "$500,000 kitchens", "tier-one
  cabinet shop" on pages with no photograph of a single NoVA job. Against a
  design-aware Great Falls buyer that copy is a liability, not a signal.

---

## 7. Options rejected, and why

**Full region-first restructure — 301 every NoVA town page into regional
pages, rebuild the nav around regions.** Rejected because the evidence is
asymmetric. The pages that would be redirected include ones holding positions
12–20 on real long-tail (Vienna, Great Falls, Reston, Alexandria) and the
target pages have no rankings yet. You would trade observed impressions for
hoped-for ones, and the redirect gain is small because thin pages carry
little equity. It also imposes region altitude on WV, where it is wrong.
What survives from this option is the region tier itself, applied only where
the name test says so.

**Delete the NoVA pages (410).** Rejected. Crawl budget is not a constraint
at ~150 URLs, so deletion buys nothing a redirect does not, and it throws
away the internal-link equity a 301 would pass.

**Status quo — leave everything, stop adding.** Rejected, narrowly. It is
zero-risk for rankings and zero-gain for the one demand pocket the data
found. It also leaves 13 basement pages carrying unverified claims and a
generic template asserting same-week site visits in Great Falls. The cost of
the recommended plan over the status quo is one data-model refactor, one
page, and five to fifteen redirects.

**Region-only in NoVA, town-only in WV, as two templates.** Close to what is
recommended, rejected as an implementation: two templates diverge. One
template with `kind`-gated sections is the same outcome with one code path.

**Fairfax as its own page from day one.** Deferred, not rejected. §1.3 shows
one regional page ranking on the Fairfax query. Build it when the data asks.

**A NoVA "areaScope" on the basements service page instead of a new area.**
Rejected. `areaScope` exists (paving uses it) and would list NoVA towns on
`/services/basements`, but it does not create a URL that says "Northern
Virginia" in the title, and the title is the ranking surface.

**A content plan.** You asked for the honest answer. A content plan is what
this would have become if the fresh pull had shown Vienna at 200 a month. It
did not. The organic opportunity is real, cheap, and singular; it is one page
per trade per region, built one at a time, and the rest of the money is in
reviews, paid, directories and referrals.

---

## 8. Sequencing

Every step is gated by the one above it where it says so.

**Phase 0 — owner-only, this week, before any code.**
1. GA4 → Admin → Key events → add `generate_lead`, `phone_click`
   (`ga4-conversion-tracking.md`). Two minutes. It fixes your own dashboard
   and anything Google Ads optimises toward, both of which currently read zero
   conversions.

   **It does NOT gate Phase 5, and an earlier version of this line said it
   did.** Raw event counts are queryable without the flag, so the December
   lead comparison uses those. Marking a key event is also not retroactive, so
   comparing key events across the change would show a rise that measures when
   the checkbox was ticked rather than demand.
2. Answer §9 — the six claims, the job-size floor, the NoVA job history.
3. GBP service area: add Berkeley County, WV in the free slot
   (`gbp-service-area-rebalance.md`). Unrelated to NoVA; it is the home-market
   lever and it is a minute.

**Phase 1 — repo, one PR each, no owner dependency.**
1. The area model (§3.1): one array, `kind`, `parent`, `market`, `status`.
   Derived lists keep their names so nothing else changes. Tests already
   cover the slug integrity.
2. Gate the generic city-template FAQ on `kind`/`market` so the same-week
   claim renders only for home-market towns.
3. The claims guard test (§3.5). **Shipped in #143, with one change of
   approach:** the doc proposed seeding it so the build went red until the
   claims were resolved. A guard that ships red gets disabled, so it ships
   green instead — the seven claims are registered in `src/lib/claims.ts`
   with an inventory of every page that carries each one, and the test fails
   only when a *new* page, service or template inherits one. It also found
   the footprint is wider than §3.5 said: the warranty language alone is on
   30 of the 69 combos, 3 service pages, both templates, the sitewide FAQ,
   eight standalone pages and 15 blog posts.
4. Tier C consolidation. **Shipped 2026-09-18, after Phase 2.1.** It was held
   for two reasons, both now resolved:
   - **The redirect target did not exist.** §3.3 sent the consolidated combos
     to `/services/{service}/northern-virginia`, which Phase 2.1 built.
     Shipping 301s into a 404 would have been worse than leaving the pages up.
   - **The list was wrong and was corrected** (§1.5 and the Tier C note in
     §3.3). 10 combos in three towns, not 5 in five towns, and McLean withdrawn.

   **§3.3 assumed one regional page per trade, and that was wrong.** Only
   basements has a regional page; kitchens and baths stay at town altitude by
   design, so six of the ten combos had no `/services/{service}/northern-virginia`
   to land on. The owner chose the town's own area overview page for those,
   which preserves the place match the query carried where the service pillar
   would throw it away. So one rule — redirect to the most specific surviving
   page that still serves the query — with two outcomes.

   Side effect worth recording: retiring these ten pages removed **42
   published occurrences of unconfirmed operational claims** across six of the
   seven registered claims, on pages nobody was reading. Retiring dead pages is
   the cheapest reduction in contract exposure available and needed no content
   decision from the owner.

**Phase 1 status, 2026-09-18.** Items 1 and 2 shipped in #142 (the catalog,
the `market`-gated service-radius claim, the corrected regional geography,
and two bugs it exposed: the combo OG-image route resolved cities against the
VA/MD-only alias so all six WV combo pages shipped with no social card, and a
dead import). Item 3 shipped in #143. Item 4 is above.

**Phase 2 — repo, gated on Phase 0.2.**
1. `northern-virginia` area (`kind: 'region'`, `market: 'premium'`), the hub
   at `/service-areas/northern-virginia`, and
   `/services/basements/northern-virginia` with only verified claims, a
   Fairfax County H2, and the design-consultation CTA. Re-parent Tier B
   pages; hub links down, children link up; mega-menu and footer entry.
2. One Northern Virginia project page with real photos — gated on you
   supplying them. The two Springfield, VA reviews on the profile say the
   work has happened. Rank 11 in Vienna is a competitor's single project
   page; this is the cheapest proof the site can add.
3. Cross-link the existing Loudoun/NoVA basement *guide* into the new
   service page. Different intent, no cannibalisation.

**Phase 2 status, 2026-09-18.** Item 1 is shipped in two PRs.

- **#146** — the `northern-virginia` catalog row (`kind: 'region'`,
  `market: 'premium'`), the hub at `/service-areas/northern-virginia`, the nine
  NoVA children re-parented to it, two-hop breadcrumbs, and a footer and
  service-areas-index entry. It also fixed two bugs the region exposed: the
  city FAQ said "X and the surrounding X", and the region would have been
  absent from the index entirely.
- **#147** — `/services/basements/northern-virginia`, the regional money page.
  Region-aware labels across the combo route and its OG card (the fallback
  read "Northern Virginia, VA"), and `areaServed` corrected from a hardcoded
  `City` to `areaSchemaType`.

  **The trust-block rule took three rounds of review to get right, and the
  final rule is not `market === 'home'`.** Recording all three, because this
  document exists so a later edit does not restore a version that was already
  rejected:

  1. `market === 'premium'`, argued from specificity — a town-and-service
     scoped promise being worse in a dispute than a sitewide banner.
     **Rejected:** 36 of the 47 premium combos already publish those promises
     in their own localized paragraphs at that same specificity, so it reduced
     nothing there, churned live copy, and pre-applied part of a retraction
     that belongs to the owner. `claims.ts` is meant to *be* that worklist.
  2. `market !== 'home' && the page's copy makes no unconfirmed claim`.
     **Rejected:** a new premium page whose copy carried only an unrelated
     claim (`active-work-timeline`) would have been handed all four bullets,
     defeating the new-page boundary the rule exists for.
  3. **Shipped:** per bullet, a bullet publishes only when the page's copy
     already makes *every* claim that bullet would introduce. The rule lives in
     `src/lib/trust-bullets.ts` — not in the route, because a rule inside a
     page component can only be tested by rendering the page or by copying the
     rule into the test, and the copy is what shipped and was found vacuous.

  Do not widen this back to a market check. `/services/basements/northern-virginia`
  has clean copy, so it receives only the verified licensing line; the 36 pages
  whose copy already carries the claims are unchanged from what shipped before
  this PR.

  It also replaced the deep-link allowlist in `CityPageTemplate` — four service
  slugs crossed with four city slugs — with `serviceHrefForArea`, derived from
  `CONTENT`. The allowlist had gone stale by a wide margin: twenty areas have
  published service+area pages and most were linking past their own local page
  to the generic pillar. Martinsburg linked neither of its own two. That is why
  the hub pointed at `/services/basements` rather than at the regional page
  this whole document is about.

**Two things Phase 2.1 did not build, deliberately.**

1. **The Fairfax County H2** specified in §3.2. `ComboContent` has no headings,
   and adding a `sections` shape for a single consumer buys an abstraction
   nothing else in the map would use. Fairfax County is named substantively in
   three of the four paragraphs instead. Whether the "fairfax va" query follows
   the regional page is a Phase 5 read, and §3.2 already gates a dedicated
   `/services/basements/fairfax-va` page on that answer — so the H2 is a
   presentation detail on a question that has not been asked yet.
2. **The other trades at region altitude.** Basements only. A test now pins
   this (`keeps the region to basements only`), because fanning the region
   across kitchens and bathrooms is the single easiest way to undo §1.5 with
   good intentions — `kitchen remodeling mclean va` is 260/mo and Vienna 140.

**Tier C shipped 2026-09-18**, in #148, once Phase 2.1 gave the basement
combos a target. The open question — where the six kitchen and bathroom combos
should land, since those trades have no regional page by design — was put to
the owner, who chose the town's own area overview page. §3.3 and §8 record the
resulting rule and the 42 unconfirmed-claim occurrences the retirement removed.

**Guard design corrected in-flight, 2026-09-18 — and it found a live bug on its
first run.**

#148 took eleven review rounds and twenty-one findings. Every one was correct,
and the distribution is the useful part: **fourteen of the twenty-one were in
two files that did not exist when the PR opened**, both written in response to
earlier rounds. The site-facing content drew no finding after round three.

Six of those landed on one file, `internal-links.test.ts`, which answered *"does
this link resolve?"* by pattern-matching link syntax in source. Each round was a
case no lexical rule could express — URL suffixes, unknown service slugs,
interpolation in four different positions, path depth, and finally a JavaScript
ternary's `?` being read as a query delimiter. That is not carelessness in one
file; it is the wrong technique. **A link's destination is a fact about the
rendered page**, and the build already emits every page.

So it was replaced rather than patched a seventh time, by
`tests/built-links.test.ts`: read the built HTML, assert every internal link
resolves against the route manifests, and assert none points at a redirect. No
capture patterns, no interpolation gate, no depth arithmetic. It runs as
`npm run test:built` in CI after `npm run build`.

**It found a defect on its first run that no source scan could have.** All 26
service-area pages and the `/services` index rendered a link to
`/services/paving`, which 308s to the `/paving` pillar that trade was
consolidated into. The href is derived from a service slug, so the string
`/services/paving` appears nowhere in `src` — invisible to every lexical scan,
and to the rendered-anchor test, which checks combos rather than pillars. Fixed
with `servicePillarHref` in constants.ts, the single definition of a service's
canonical pillar URL. The scanner it replaced had, after six rounds, found
nothing live at all.

Coverage comparison, both run against the same tree: the source scan read about
twenty hand-written links; the built-HTML assertion reads **13,608** rendered
ones across 182 pages.

**`runtime-text.ts` was NOT replaced, and the reason is worth recording** — I
argued in an earlier draft of this entry that the build output could serve the
claims guard too, and that was wrong. The claims register's value is naming
*which source file* publishes a claim, because that list is the owner's
retraction worklist. Built HTML cannot attribute a phrase back to a module.
Links are about URLs, where the build is authoritative; claims are about source
attribution, where the AST is necessary. Its four findings were plain traversal
omissions — `{expr}` handled but `${expr}` not, children walked but attribute
initializers not, concatenation split, and a duplicated template branch fixed in
only one of its two copies — which is incomplete rather than misconceived.

**The rendered-text claims check was added too**, at round twelve, once a
fourth traversal finding made the pattern clear: the supply of ways to build a
string in JavaScript is unbounded, so the AST scan cannot be completed, only
extended. `tests/built-claims.test.ts` counts unconfirmed claims in the built
HTML — construction-independent, because it reads what the browser receives —
as an exact snapshot — a rise means new copy inherited an unconfirmed claim, a
fall must be recorded so the reduction is locked in rather than left as
headroom for a later page. Attribution stays with the AST,
completeness comes from the build, and a gap in the AST scan can now only make
the retraction worklist incomplete rather than let a claim reach a homeowner
unnoticed.

**And it restated the exposure in the numbers that matter.** The source
inventory counts 21 FILES. At page level:

| Claim | Pages publishing it (of 182) |
| --- | --- |
| written workmanship warranty | **148** |
| one named project lead | **143** |
| daily updates | **140** |
| clean job site every evening | **135** |
| active-work timeline | 16 |
| daily progress photos | 13 |
| same-day response | 8 |

None of the seven is confirmed. That is the size of §9's second question, and
it is a far stronger argument for answering it than "21 files" was.

**Phase 3 — off-repo, parallel with Phase 2.**
Directory profiles: Angi, Houzz, Yelp, BuildZoom, Thumbtack (the repo already
has a Thumbtack webhook). A third of the NoVA organic field is directories;
being listed in them is cheaper than outranking them.

**Phase 4 — paid test, gated on Phase 0.1, Phase 1.3 green, Phase 2.1
live, and a tracking number.** Three months, geo-targeted to Fairfax and
Loudoun counties, one trade (§5), landing on the regional page. Read leads
and call recordings, not revenue.

**Phase 5 — read and decide, 2026-12-15.** The "before" it compares against is
frozen in `docs/phase-5-baseline-2026-09-18.md`, captured the day this work
shipped: 5 mobile clicks site-wide in three months, **zero** across all 23
Northern Virginia pages, and **zero mobile impressions for any query containing
"northern virginia"**. The regional page starts from nothing, which makes any
impression it earns attributable to it.

**Phase 5 — read and decide, 2026-12-15.** Ninety days after the WV routes
went live and roughly ninety after the regional page would. Mobile-filtered
Search Console: does the regional page take the "northern virginia"
queries; do the Tier B town pages lose theirs to it (then 301 them) or keep
theirs (then leave them); does the Fairfax query follow (then no Fairfax
page) or not (then build it); did paid produce a lead you would have taken.
Only then a second trade at regional altitude.

---

**Leesburg ranks on Loudoun County queries, not Leesburg queries — 2026-09-18.**

Surfaced by freezing query-level rows for the Phase 5 baseline, and it bears
directly on §2. `/service-areas/leesburg-va` takes **243 of its 381 mobile
impressions (64%) from "loudoun county" queries** across 18 query strings.
Meanwhile "northern virginia" returns **zero** mobile impressions.

Precisely, because an earlier version of this note overstated it: the **top
three** county queries carry 188 of those impressions at positions 12.5–19.2,
better than any Leesburg town query. The other 15 carry 55 impressions at
positions **26.3–44.7**, where nothing is visible.

The regional-altitude thesis may therefore be right about altitude and wrong
about the place name: the demand that exists at a level above the town is
phrased as the *county*, not as the region. This is one quarter of data and it
is recorded as an observation, not a recommendation — acting on it means a
county-level page, which is the owner's decision. But if the December read
finds the regional page flat, check this before concluding that regional
altitude failed. Detail in `docs/phase-5-baseline-2026-09-18.md`.

**The timeline claim was too narrow three rounds running, and what is left is
structural — 2026-09-18.**

`active-work-timeline` was reported as under-matching on #148 in rounds 26, 27,
28 and 29. Each round widened a different axis of the same sentence: the dash,
then the noun phrase after "of", then the forms with no "of" at all, then the
unit itself — "two to three working days", where the word *working* names the
promise and no qualifier follows. The count went
16 → 23 → 28 → 35 → 37 pages. Twice the fix covered the axis that was reported and
left the next one, which is the mistake worth naming — when a pattern is found
too narrow, the sweep has to enumerate every axis of the phrasing before it
ships, not the one in the review comment.

The three rounds found seven genuinely unwatched pages, and two of them matter
more than their number suggests: **`/services/kitchens` and `/services/bathrooms`
have promised a demo-to-final week range since 2026-07-06, unwatched.** Those
are the two highest-traffic service pillars on the site.

**What is still not matched, deliberately.** A bare range with no unit and no
qualifier —
"kitchen: 6–12 weeks" in a comparison table, "5–8 weeks is typical". There are
roughly fifty of these on the site and most are permitting windows, curing
times, or savings-buffer figures, so a regex that caught them would flood your
retraction worklist with pages that do not belong on it. Deciding which are
promises needs the surrounding prose.

The sweep that would close it, if it is ever worth the cost: a snapshot of
every duration range in the scanned source alongside the files it appears in,
with a test that fails when the set changes. Each new or edited phrasing then
forces a one-time "promise or not a promise" call instead of passing silently.
That is a separate piece of work with a real maintenance cost — every content
edit that touches a number churns the snapshot — and it should not ride on a
PR that is already twenty-eight rounds deep. It is recorded here so it is a
decision rather than an oversight.

## 9. Decisions I need from you

1. **Will you take a Northern Virginia basement at sixty miles, and what is
   the minimum job size that makes the drive worth it?** Everything in §5
   and Phase 2 depends on the answer being yes and a number.
2. **The six claims, each one:** written workmanship warranty (already
   sitewide); one named project lead (already on kitchens); daily progress
   photos; clean job site every evening; same-day response standard;
   timelines of 8–14 weeks (Vienna, Reston) and 14–22 weeks (Great Falls).
   Confirm, retract, or restate. Retractions have to come off the WV and
   service pages too, not only the NoVA pages.

   **Two phrasings the detection patterns were missing, found 2026-09-18.**
   The site writes the timeline range as `8–14 weeks of active work` in the
   combo content and as `6 to 10 weeks of active work` in seven blog articles;
   the pattern only matched the en dash, so those seven pages published the
   promise unwatched. Same for `workmanship guarantee`, which one deck article
   uses where everything else says `workmanship warranty`. Both patterns are
   widened, and the page counts rose from 16 to 23 and 148 to 149 — no new copy,
   just copy that was always there and never counted.

   **One phrasing I have NOT folded in, because it is your call, not mine.**
   Three pages promise a *single point of contact* — the capability statement,
   the full-property-perimeter page, and a whole-home blog article. Is that the
   same promise as *one named project lead*, or a weaker one about who answers
   the phone? If it is the same, say so and it joins the register, which adds
   those pages to the retraction worklist. I can argue it either way, which is
   why I am not deciding it: a claim's scope is a statement about how the
   business runs.
3. **Has a Northern Virginia job been completed, and are there photos?** The
   Springfield reviews suggest yes. One verified project page is worth more
   than any five town pages.
4. **Paid budget appetite** — roughly $1,300 a month for three months — and
   whether the first test is decks (proof exists, cheap clicks) or basements
   (the job you want, no proof yet).
5. **Frederick roofing.** 880 searches a month, a page that exists, and no
   impressions. Do you want that looked at separately? It is the largest
   number found in any of these audits and it is in a market you already
   serve.

---

## 10. Corrections to the brief, for the record

- "60+ service areas": 25 area overview pages, 69 service+area pages, 10
  paving location pages. The count that matters is 69, of which 51 are
  Virginia and 13 are basements.
- "No page anywhere targets the region": true under `src/app`. One blog post,
  `luxury-basement-finishing-loudoun-northern-virginia-2026`, does target
  "Loudoun County and Northern Virginia" as a how-to. It is the wrong page
  type for the commercial query — the SERP is service pages and directories,
  and the AI Overview at rank 1 on the "finishing" query is fed by exactly
  this kind of article. It should link into the new service page and stay
  what it is.
- "Operational claims on the NoVA pages": they are sitewide (§3.5). The
  gate is not NoVA-specific.
- The 2026-09-18 brief's "recommended build" listed a regional page *with
  Fairfax beneath it*. This document defers the Fairfax page on the evidence
  in §1.3 and would build it only if the regional page fails to carry the
  Fairfax query.

---

## Sources read and not re-derived

1. `docs/nova-basement-opportunity-2026-09-18.md`
2. `docs/search-traffic-reality-2026-09-17.md`
3. `docs/ga4-conversion-tracking.md`
4. `docs/gbp-service-area-rebalance.md`
5. `docs/where-the-demand-actually-is.md`

Also consulted: `docs/SEO-AUDIT-2026-09-15.md`, `docs/V2-BLUEPRINT.md` §0–1,
`docs/IDEA-LOUDOUN-PREMIUM-MARKET-EXPANSION.md` §1–3, and the code under
`src/lib/constants.ts`, `src/lib/service-city-content.ts`,
`src/app/services/[service]/[city]/page.tsx`,
`src/app/service-areas/[slug]/page.tsx`,
`src/components/services/CityPageTemplate.tsx`, `src/lib/projects/`,
`src/lib/reviews/`.
