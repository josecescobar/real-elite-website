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
> are corrected in place below, and Tier C consolidation is **on hold** for
> the reasons in §8. Full data in §1.5. Nothing in "The short version" is
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

6. **Nothing above can be read until GA4 counts `generate_lead` and
   `phone_click`.** That is the first line of the sequence in §8, and it is
   yours.

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
| **C — consolidate** *(corrected, and on hold — see §8)* | The 10 combos with zero mobile impressions in six months **and** no Ads row in any trade: all three of `{bathrooms, kitchens, basements}-{clifton, fairfax-station, middleburg}-va`, plus `basements-burke-va`. | `status: 'consolidated'`, 301, same deploy as the key removal. | Negligible — no impressions means no rankings to lose. But the doc's original redirect target does not exist yet, which is why this is on hold rather than done. |
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
   (`ga4-conversion-tracking.md`). Two minutes. Nothing downstream is
   readable without it.
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
4. Tier C consolidation. **On hold, deliberately — two reasons.**
   - **The redirect target does not exist.** §3.3 sends the consolidated
     combos to `/services/{service}/northern-virginia`, which Phase 2 builds.
     Shipping 301s into a 404 is worse than leaving the pages up, and
     redirecting them somewhere else instead (the town overview page, or the
     service pillar) is a different decision from the one this document made.
     Tier C therefore belongs *after* Phase 2.1, not in Phase 1.
   - **The list was wrong and is now corrected** (§1.5 and the Tier C note in
     §3.3). It is 10 combos in three towns, not 5 in five towns, and it no
     longer touches McLean.

   Nothing else in Phase 1 depended on it, so items 1-3 shipped without it.

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

**Phase 3 — off-repo, parallel with Phase 2.**
Directory profiles: Angi, Houzz, Yelp, BuildZoom, Thumbtack (the repo already
has a Thumbtack webhook). A third of the NoVA organic field is directories;
being listed in them is cheaper than outranking them.

**Phase 4 — paid test, gated on Phase 0.1, Phase 1.3 green, Phase 2.1
live, and a tracking number.** Three months, geo-targeted to Fairfax and
Loudoun counties, one trade (§5), landing on the regional page. Read leads
and call recordings, not revenue.

**Phase 5 — read and decide, 2026-12-15.** Ninety days after the WV routes
went live and roughly ninety after the regional page would. Mobile-filtered
Search Console: does the regional page take the "northern virginia"
queries; do the Tier B town pages lose theirs to it (then 301 them) or keep
theirs (then leave them); does the Fairfax query follow (then no Fairfax
page) or not (then build it); did paid produce a lead you would have taken.
Only then a second trade at regional altitude.

---

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
