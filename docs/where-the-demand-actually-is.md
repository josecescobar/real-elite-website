# What the keyword data does and does not say — 2026-09-17

Search volumes from Google Ads data via DataForSEO, **US-wide**, September 2026.
That scope is the whole difficulty, and the first section explains why.

The question this set out to answer: is the demand base small because the
*market* is small, or because the site targets the wrong queries? It decides
whether writing more pages is worth anything.

## A comparison that does not work

The first draft of this document led with a ratio:

> `roofers near me` — 165,000 a month. `roofing companies martinsburg wv` — 110
> a month. Fifteen hundred to one.

**That number is wrong and it has been withdrawn.** The two figures are not
measured over the same population. `roofing companies martinsburg wv` names a
town, so essentially all of its 110 searches come from people looking for this
market — the national figure *is* the local figure. `roofers near me` carries no
place name, so its 165,000 is every such search in the United States, and this
business can only ever capture the fraction originating inside its service area.

Berkeley and Jefferson counties hold on the order of 160,000 people against a US
population near 335 million — roughly 0.05%. Scaled by population alone,
`roofers near me` would be something like **80 searches a month** locally.
Against 110 for the geo-modified phrase, that is the same order of magnitude,
not three orders.

Treat the 80 as arithmetic, not data: search behaviour is not uniform by head of
population, and rural markets do not index like metros. The honest position is
that **locally filtered near-me volume is not obtainable from the tools here**,
so no ratio between the two query shapes can be stated at all. The original
claim was an artifact of dividing a national number by a local one.

## The one sound local measurement

Geo-modified terms name their market, so their national volume is their local
volume. Every Eastern Panhandle term that returned a figure:

| Keyword | Volume | KD |
| --- | --- | --- |
| `handyman martinsburg wv` | 140 | 0 |
| `contractors martinsburg wv` | 110 | 6 |
| `general contractor martinsburg wv` | 110 | 5 |
| `roofing companies martinsburg wv` | 110 | 0 |
| `bathroom remodeling martinsburg wv` | 50 | 1 |
| `roof repair martinsburg wv` | 40 | 16 |
| `deck builder martinsburg wv` | 30 | 0 |
| `home remodeling martinsburg wv` | 20 | — |
| `kitchen remodeling martinsburg wv` | 20 | — |
| `basement finishing martinsburg wv` | 10 | — |
| `roofing contractor martinsburg wv` | 10 | 6 |
| `roofing charles town wv` | 10 | 0 |
| `paving hagerstown md` | 10 | — |
| `paving winchester va` | 10 | — |
| `driveway paving martinsburg wv` | **no record** | — |

A follow-up sweep made this systematic rather than hand-picked: **all 12 of the
site's services against all 11 West Virginia towns in
`GENERAL_CONTRACTOR_AREA_SERVED`, one canonical phrasing each — 132
combinations.** That list is the site's own declared home-market footprint and
includes Kearneysville and Harpers Ferry, which have no pages of their own.

**A hundred and twenty-one of the 132 returned no measurable volume.** All 24
Kearneysville and Harpers Ferry combinations came back empty. The eleven rows
that did return something:

| Keyword | Volume |
| --- | --- |
| `handyman martinsburg wv` | 140 |
| `roofing martinsburg wv` | 90 |
| `bathroom remodeling martinsburg wv` | 50 |
| `handyman charles town wv` | 50 |
| `deck builder martinsburg wv` | 30 |
| `home remodeling martinsburg wv` | 20 |
| `kitchen remodeling martinsburg wv` | 20 |
| `basement finishing martinsburg wv` | 10 |
| `handyman inwood wv` | 10 |
| `home repair martinsburg wv` | 10 |
| `roofing charles town wv` | 10 |

**440 a month from that grid.** Every town other than Martinsburg, Charles Town
and Inwood is empty across all twelve trades, and siding, home additions, paving
contractor and exterior repair return nothing in any town at all.

The first table holds five more Martinsburg phrasings the grid did not use —
`contractors` 110, `general contractor` 110, `roofing companies` 110,
`roof repair` 40, `roofing contractor` 10, which sum to 380. **They are
deliberately not added to the 440.** Google Ads aggregates close variants, so
`roofing martinsburg wv` (90), `roofing companies martinsburg wv` (110) and
`roofing contractor martinsburg wv` (10) are not necessarily disjoint searches,
and `contractors` and `general contractor` returning *exactly* 110 apiece reads
like one cluster reported under two labels. Adding them would count the same
searches twice.

So the defensible figure is **440 a month across one canonical phrasing per
service-town pair** — not a total across all wordings, which cannot be computed
by addition from these numbers at all.

Call it a **measured subtotal**, and resist turning that into either a ceiling
or a floor. Untested wordings might add volume on top, or their volume might
already sit inside the canonical rows that were reported — clustering is
precisely what makes the two indistinguishable. The increment cannot be
estimated by summing the rows, and it cannot be assumed positive either.

### What "no measurable volume" actually means

It means **below Google Ads' reporting floor**, not that nobody searches the
term. The two are different, and this repository contains the proof: the
comment above the basement entries in `src/lib/service-city-content.ts` records
Search Console positions of **3.2** for `basement remodeling ranson wv` and
**5.7** for `basement remodeling inwood wv`. A position exists only where
impressions exist. Both phrases return no volume in the Ads data checked here.

So every "returns nothing" in this document should be read as *too small for
Google Ads to report*, which for a market this size is a meaningful share of
what is actually there. It does not license the stronger claim that the demand
is zero. What it establishes is the shape: demand concentrates
almost entirely in Martinsburg, and 90% of the grid has no measurable search
behind it.

**That grid is not the site's page count.** `/services/[service]/[city]` builds
only from the `CONTENT` map in `src/lib/service-city-content.ts`, which holds
**69 keys — 6 WV, 51 VA, 12 MD.** The WV six are `roofing-martinsburg-wv`,
`roofing-charles-town-wv`, `decks-martinsburg-wv`, `basements-ranson-wv`,
`basements-inwood-wv` and `basements-charles-town-wv`.

So the low-demand combinations are mostly *unpublished*. Matched at the same
service-town granularity the sweep uses, **three of the six** have a positive
row behind them:

| Published route | Matching sweep row |
| --- | --- |
| `roofing-martinsburg-wv` | `roofing martinsburg wv` — 90 |
| `roofing-charles-town-wv` | `roofing charles town wv` — 10 |
| `decks-martinsburg-wv` | `deck builder martinsburg wv` — 30 |
| `basements-ranson-wv` | none |
| `basements-inwood-wv` | none |
| `basements-charles-town-wv` | none |

**Three of six is the Ads-floor count, and Search Console cannot raise or lower
it, because these routes are two days old.** All six WV keys were added on
2026-09-15 — the roofing pair in `15ae01e`, the deck and three basement combos
in `e1e6a5b`. Every Search Console window in this document ends 2026-09-14, and
Search Console lags roughly three days besides. **No published WV route existed
during any measured window.**

Three earlier drafts of this section missed that and read route performance out
of the data anyway — first six of six, then roughly four of six, then three of
six on the grounds that the routes had "zero impressions over six months". That
last one was the worst of the three: the zero was real, and it meant the pages
did not exist, not that they had failed. **Withdrawn entirely. There is no
post-publication data yet, so there is nothing here to measure.**

What the query-to-page join does establish, and what commit `e1e6a5b` already
recorded as its reason for existing, is where this demand currently lands:

| Query | Page receiving the impressions | Impr. | Clicks | Position |
| --- | --- | --- | --- | --- |
| `basement remodeling inwood wv` | `/service-areas/inwood-wv` | 41 | 0 | 7.3 |
| `basement remodel ranson wv` | `/service-areas/ranson-wv` | 15 | 0 | 5.1 |
| `basement remodeling ranson wv` | `/service-areas/ranson-wv` | 5 | 0 | 3.2 |
| `basement remodeling charles town wv` | `/service-areas/charles-town-wv` | 5 | 0 | 12.0 |
| `basement remodel gerrardstown wv` | `/service-areas/inwood-wv` | 4 | 0 | 19.8 |
| `basement remodeling hedgesville wv` | `/service-areas/hedgesville-wv` | 1 | 0 | 12.0 |

Generic service-area pages hold positions 3.2 to 19.8 on trade-specific queries
and convert none of them. That is the gap the new routes were published to
close, and it is background here rather than a finding — `e1e6a5b`'s message
sets it out with the same figures.

**The open question is whether the handover happens**, and it is genuinely open.
Give the routes a normal indexing and ranking window — 8 to 12 weeks is the
usual shape for pages of this kind — then re-run the page report over a window
that starts after 2026-09-15 and compare `/services/basements/{town}-wv` against
`/service-areas/{town}-wv` on the same queries. Until then, silence in the data
is what a two-day-old page is supposed to look like.

**What still needs stating about the tablet slice**, because it applies
elsewhere in this document: of 62 tablet impressions over the window, the query
grouping accounts for 21 and the page grouping for 26, and the 2 tablet clicks
appear in neither. A zero-click claim about a page that *does* have impressions
is bounded by that remainder, not established by it.

The pages are titled "Basement Finishing **& Remodeling**", so the remodeling
phrasings are the ones that matter; all fourteen `basement remodeling` /
`basement remodel` variants return no Ads-measurable volume.

### Neither instrument reads this market cleanly

Inwood is the clearest illustration. Every one of these returns **no
Ads-measurable volume**, and every one has Search Console impressions — shown
on the mobile-plus-tablet floor, because using all-device figures here would
repeat the mistake this document already made twice. Tablet is zero for every
Inwood query, so the floor is the mobile column:

| Query | All-device | **Floor** | Floor position |
| --- | --- | --- | --- |
| `paving contractor inwood` | 74 | **74** | 23.7 |
| `driveway contractor inwood` | 66 | **66** | 39.0 |
| `siding company inwood wv` | 52 | **35** | 7.5 |
| `asphalt shingle roofing inwood wv` | 47 | **34** | 15.6 |
| `bathroom remodeling inwood` | 33 | **33** | 21.5 |
| `siding replacement inwood wv` | 53 | **30** | 11.7 |
| `roofing contractor inwood wv` | 47 | **29** | 9.8 |
| `roof replacement inwood wv` | 42 | **26** | 14.0 |
| `asphalt resurfacing inwood` | 19 | **19** | 24.4 |
| `basement remodeling inwood wv` | 41 | **8** | 5.4 |
| `deck builders inwood wv` | 18 | **0** | — |

Filtering matters row by row. Some rows are untouched — `paving contractor
inwood` and `driveway contractor inwood` are entirely mobile. Others collapse:
`basement remodeling inwood wv` loses 33 of its 41, and `deck builders inwood
wv` disappears completely, which means one of the six rows in this table's
earlier all-device version was pure desktop noise.

The conclusion survives filtering and is stronger for it. Inwood produces **40
distinct queries all-device and 32 on the floor**, totalling **630 floor
impressions** across paving, roofing, siding, bathrooms, basements and
stonework. Decks are not among them on the floor — the only two Inwood deck
queries are all-device only. Against that, the sweep found exactly one Inwood row —
`handyman inwood wv`, 10 a month — and that query has **1** Search Console
impression over six months. The one term Ads can see is the one nobody here
searches. **The Ads floor is hiding most of the query variety in this market**,
and that now rests on filtered data.

Two things it does not establish. It says nothing about **volume**: a floor
impression proves the string was searched, not that its volume sits outside the
Ads clusters. And it is not a success story. Those 630 floor impressions
produced **zero clicks**, and by page they go **519 to
`/service-areas/inwood-wv`** and 86 to `/paving`, with the remaining 26 spread
across four other pages. One generic page absorbs 82% of a town's query variety,
across six trades, and converts none of it.


But Search Console cannot be substituted for it, because the desktop slice
carrying 79% of this property's impressions is mostly noise (see
`docs/search-traffic-reality-2026-09-17.md`), and an impression count does not
say which slice a given query sits in. Filtering to mobile and tablet gives a
floor rather than a clean read.

So: **the 440 is the sum of the reported rows, and the market total is
unknown** — not merely unquantified, unknown in direction as well. It is
tempting to read the Search Console query variety as volume sitting *outside*
the 440, which would make 440 a floor. That does not follow from anything
measured here. Ads clusters close variants, so an impression on
`basement remodeling inwood wv` may already be counted inside a canonical row
that the sweep reported, or may not be; Search Console shows the strings exist
and says nothing about which cluster their volume lands in. The two instruments
cannot be added, and neither bounds the other.

What both agree on is the shape — many distinct queries, each tiny,
concentrated in a few towns — and neither offers any evidence of a large
organic upside hiding somewhere. That is the conclusion this document rests on,
and it does not require knowing the total.

In West Virginia the site has been conservative either way. The original audit's
overbuilding finding was about the 62 combinations it counted across **VA and
MD** — 63 in the map today — not about these six.

## Near-me demand belongs to both, not to the profile

The first draft also claimed near-me searches were "the profile's job" and that
"nothing in this repository competes for them," then forty lines later named
`driveway paving near me` the better target for `/paving/driveway-paving`. Both
cannot be true, and the second is closer to right.

A near-me SERP carries a local pack **and** ordinary organic results beneath it.
`src/lib/paving-data.ts` already lists `driveway paving near me` among the
driveway page's keywords, and `driveway paving near me` reads difficulty **1**,
which is not the profile of a term only winnable through a map pack.

So the two opportunities have to be kept apart rather than merged:

- **Local-pack opportunity** — won with the Business Profile: categories,
  reviews, service area, proximity to the searcher.
- **Organic opportunity** — won with pages, beneath the pack. The site does
  **not** currently target any of these phrases in a way Google reads: a
  repo-wide search finds them only in metadata `keywords` arrays
  (`src/app/paving/page.tsx`, `src/lib/paving-data.ts`), which render as an
  inert `<meta name="keywords">` tag. Treat this as an opportunity not yet
  taken, not as ground already held.

The volumes below are national, and the local share of each is unknown for the
same reason as above.

| Keyword | US volume | KD | CPC |
| --- | --- | --- | --- |
| `gutter installation near me` | 33,100 | 0 | $26.38 |
| `sealcoating near me` | 9,900 | 2 | $10.32 |
| `driveway paving near me` | 8,100 | 1 | $12.71 |
| `driveway sealing near me` | 8,100 | 12 | $8.26 |
| `asphalt paving near me` | 8,100 | 15 | $10.62 |
| `driveway repair near me` | 4,400 | 0 | $15.70 |
| `basement finishing near me` | 3,600 | 0 | $22.20 |

## National informational volume, and what it is good for

| Keyword | US volume | KD | CPC |
| --- | --- | --- | --- |
| `roof replacement cost` | 18,100 | 25 | $19.96 |
| `asphalt driveway cost` | **12,100** | **0** | $7.94 |
| `new roof cost` | 9,900 | 10 | $18.02 |
| `asphalt vs concrete driveway` | 4,400 | 0 | $5.09 |
| `chip seal driveway` | 4,400 | 0 | $9.30 |
| `storm damage roof repair` | 3,600 | 0 | $47.01 |
| `tar and chip driveway` | 2,900 | 0 | $7.60 |

These are national and early-intent, and the local slice of each is small — on
the same population logic, `asphalt driveway cost` is a handful of local
searches a month.

An earlier draft argued this traffic was "not leads" from the opportunity
report's engagement score and its `keyEvents: 0` rows. **That reasoning was
circular** — every row reads zero because `generate_lead` is not marked as a key
event, so the report is blind to conversions by construction and cannot be
evidence about them.

The raw events can be attributed by landing page, and that is the actual
measurement. All three `generate_lead` events in the window:

| Landing page | Leads |
| --- | --- |
| `/paving` | 1 |
| `/paving/locations/winchester-va` | 1 |
| `/service-areas/hedgesville-wv` | 1 |

**Two of three landed on paving service pages. None landed on the driveway
comparison guide**, which carries 36% of all site clicks. The two `phone_click`
events landed on `/` and `/instant-roof-quote`.

**n = 3.** That is directional, not conclusive, and it deserves saying plainly
rather than being dressed up: three events cannot carry a strategy. What it does
do is replace an inference drawn from conversion-blind data with the real
attribution, and what it points at is service pages over guides — and paving
over everything else.

`asphalt driveway cost` remains the cleanest content target on the board —
12,100 a month, difficulty 0, the priced answer (`$4–$7 per square foot
installed, $4,000–$10,000 typical`) already published in the driveways guide and
in the FAQ on `/paving/driveway-paving`, and position 4–5 already held on
adjacent comparison terms. It belongs in a guide rather than on the service
page.

An earlier draft justified that by saying `/paving/driveway-paving` **already
targets** `driveway paving near me`. It does not. The phrase appears only in the
`keywords` array in `src/lib/paving-data.ts`, which
`src/app/paving/[service]/page.tsx` passes to Next's metadata `keywords` field —
a `<meta name="keywords">` tag Google has not used for ranking in many years. It
is in no title and no body copy, and the page does not appear in the property's
top 60 by impressions, so there is no query-performance evidence either.

The recommendation stands but on weaker and more honest grounds: a service page
is better aimed at transactional intent than at a cost question, which is a
judgement about page purpose rather than the protection of an asset that turns
out not to exist. Worth noting separately that these `keywords` arrays are inert
across the repo — harmless, but maintained for no ranking benefit.

## A caveat on difficulty scores

`storm damage roof repair` reads difficulty **0** on 3,600 searches at a
**$47.01** CPC, the highest-value keyword in the set and on paper a gift. The
site's own post targets that exact phrase and sits at **position 19.6**.

Difficulty understates competition where national aggregators and insurance
sites hold the results. Check where the site already sits before trusting KD.

## What actually supports prioritising the profile

Not the volume comparison — that was the withdrawn claim. The support is direct
measurement: a 5×5 rank grid across eight miles around Martinsburg found the
business in the local 3-pack at **0 of 25 points**, for roofing and for decks
alike, while Google's derived topics for the listing read `deck (4)`, `wood (2)`,
`deck replacement (2)`. The listing is absent from the pack where it should be
strongest. That is an observed failure, and it stands on its own without any
ratio attached to it.

## Corroboration, incidentally

The opportunity report joins Search Console to GA4 per page. **Every row reads
`keyEvents: 0`** — including the homepage's 25 sessions. Independent
confirmation of `docs/ga4-conversion-tracking.md`.

## What this means

1. **440 a month is the sum of the Ads-reported rows**, on one canonical
   phrasing per service-town pair — not a measurement of demand and not a true
   subtotal, because variant clustering can put the market total either side of
   it. And 121 of the 132 combinations return nothing — where *nothing* means
   below Google Ads' reporting floor, not zero. Alternative wordings are not
   added in, because clustering means they cannot be summed without
   double-counting and may already sit inside the reported rows. What 440 does
   have going for it is the population: it is the one figure here measured on
   geo-modified terms, which name their own market. The shape is unambiguous:
   demand is Martinsburg, and thin everywhere else. Six WV routes are published
   and three clear the Ads floor. How any of them perform is not yet knowable:
   all six were added on 2026-09-15, after every measurement window here
   closed. The trade-specific WV queries currently land on `/service-areas/`
   pages, which is the gap those routes were published to close. The Ads floor
   hides most of this market's query *variety* — whether it hides volume as
   well is not knowable from these tools — and Search Console cannot replace it
   because its desktop majority — 79% of impressions — is mostly noise that
   cannot be cleanly separated from genuine traffic. Mobile and tablet give a
   conservative floor, not a clean read.
2. **Near-me demand is contested by the pack and by organic pages.** Track the
   two separately. The site does **not** currently compete for these phrases
   organically — they appear only in inert metadata `keywords` arrays — so this
   is a targeting opportunity not yet taken rather than ground to defend.
3. **Two of the three attributed leads landed on paving service pages and the
   third on a service-area page** — none on the guide that carries 36% of
   clicks. n = 3, so directional only, but it is attribution rather than
   inference.
4. **Prioritising the profile rests on the rank grid**, not on a keyword ratio.
5. **Check the population, the bound, the page, and the date.** Four errors of
   the same family appeared in this document. Dividing a national volume by a
   local one — the withdrawn 1,500:1 ratio. Restating a bound as a measurement
   — 79% read as an automation rate when it is a device share. Crediting a page
   with impressions a query-only report never said it received: query data
   alone never names the page. And reading failure into a page's absence from a
   window that closed before the page was created — the WV routes are two days
   old, and every route-performance reading here was withdrawn for that reason.
   Check when the thing you are measuring came into existence before you
   attribute anything to its absence. The figures in this document held up
   under checking; the sentences written around them kept reaching for
   something tidier than the data supported.
