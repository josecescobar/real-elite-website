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

Call it a **measured subtotal, not a ceiling.** Untested wordings add some
unknown increment on top; the variant clustering above is why that increment
cannot be estimated by summing the rows.

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

**Three of six is the Ads-floor count, and Search Console does not raise it.**
Earlier drafts of this section used Search Console to rescue the three basement
routes, first to six of six and then to "roughly four of six". Both were wrong,
and not because of a device filter or a reporting floor. They credited these
routes with impressions that landed on **different pages**.

Joining query to page over 6 months to 2026-09-14 shows where the WV basement
queries actually resolve:

| Query | Page that received the impressions | Impr. | Clicks | Position |
| --- | --- | --- | --- | --- |
| `basement remodeling inwood wv` | `/service-areas/inwood-wv` | 41 | 0 | 7.3 |
| `basement remodel ranson wv` | `/service-areas/ranson-wv` | 15 | 0 | 5.1 |
| `basement remodeling ranson wv` | `/service-areas/ranson-wv` | 5 | 0 | 3.2 |
| `basement remodeling charles town wv` | `/service-areas/charles-town-wv` | 5 | 0 | 12.0 |
| `basement remodel gerrardstown wv` | `/service-areas/inwood-wv` | 4 | 0 | 19.8 |
| `basement remodeling hedgesville wv` | `/service-areas/hedgesville-wv` | 1 | 0 | 12.0 |

Not one of them is served by the route it was being used to justify. Grouped by
page, `/services/basements/` resolves six URLs over the window — Frederick MD,
Vienna, Alexandria, Great Falls, McLean and Reston VA. **The three WV basement
routes appear in no page row at all: zero impressions, all devices, six
months.** They are live (all three return 200) and they are in the sitemap, so
this is not a build or discovery problem.

That settles the device question by making it moot. A page with zero all-device
impressions has zero mobile impressions, zero tablet impressions and zero
clicks; no anonymised remainder can hide traffic on a page whose total is zero.
The tablet caveats that occupied earlier drafts of this section applied to the
wrong pages.

So the count is **three of six**, and for a stronger reason than the Ads floor:
the other three have no Search Console presence of any kind. The first draft's
three of six was right, and the two revisions that moved it up were both
crediting another page's traffic.

**What still needs stating about the tablet slice**, because it applies
elsewhere in this document: of 62 tablet impressions over the window, the query
grouping accounts for 21 and the page grouping for 26, and the 2 tablet clicks
appear in neither. So a zero-click claim about a page that *does* have
impressions is bounded by that remainder, not established by it. The three WV
basement routes are the exception, not the pattern — their zero is a page total,
not an unobserved cell.

**That the service-area pages hold these queries is not news — it is why the
routes exist.** The comment above the basement entries in
`src/lib/service-city-content.ts` says so outright: these positions are "all
currently answered by a generic `/service-areas/` page with a template snippet",
and the routes were written to take them over with something specific.

The finding is that **the handover has not happened.** Six months on, the
service-area pages still hold the positions and the purpose-built routes have
recorded nothing at all — not a weak showing, zero. That is a different problem
from the one this section was set up to measure, and a more actionable one: the
question is not whether these three towns have basement demand (they do, at
positions 3.2 to 12.0) but why the pages built to answer it are invisible while
the generic pages they were meant to replace are not. Worth its own
investigation; internal linking and the service-area pages' own targeting are
the first places to look.

The pages are titled "Basement Finishing **& Remodeling**", so the remodeling
phrasings are the ones that matter; all fourteen `basement remodeling` /
`basement remodel` variants return no Ads-measurable volume.

### Neither instrument reads this market cleanly

Inwood is the clearest illustration. Every one of these returns **no
Ads-measurable volume**, and every one has Search Console impressions:

| Query | Impressions | Position |
| --- | --- | --- |
| `driveway contractor inwood` | 66 | 39.0 |
| `asphalt shingle roofing inwood wv` | 47 | 13.9 |
| `basement remodeling inwood wv` | 41 | 7.3 |
| `bathroom remodeling inwood` | 33 | 21.5 |
| `asphalt resurfacing inwood` | 19 | 24.4 |
| `deck builders inwood wv` | 18 | 20.1 |

Against that, the sweep found exactly one Inwood row — `handyman inwood wv`, 10
a month. **The Ads floor is hiding most of the query variety in this market.**

Worth noting alongside the route finding above: every one of those six
impressions blocks lands on `/service-areas/inwood-wv`, across six different
trades. One page is absorbing the whole town's query variety, and it converts
none of it.


But Search Console cannot be substituted for it, because the desktop slice
carrying 79% of this property's impressions is mostly noise (see
`docs/search-traffic-reality-2026-09-17.md`), and an impression count does not
say which slice a given query sits in. Filtering to mobile and tablet gives a
floor rather than a clean read.

So: **the 440 is Ads-reportable volume, not the size of the market.** The market
is larger than 440 by an amount neither instrument can quantify. What both
agree on is the shape — many distinct queries, each tiny, concentrated in a few
towns — and neither offers any evidence of a large organic upside hiding
somewhere.

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

1. **Measured geo-modified demand is 440 searches a month** on one canonical
   phrasing per service-town pair, and 121 of the 132 combinations return
   nothing — where *nothing* means below Google Ads' reporting floor, not zero.
   Alternative wordings are not added in: Google Ads clusters close variants,
   so those rows cannot be summed without double-counting. A subtotal rather
   than a ceiling, but it is the one figure here measured on the right
   population, and the shape is unambiguous: demand is Martinsburg, and thin
   everywhere else. Six WV routes are published and three clear the Ads floor.
   The other three — the WV basement routes — have no Search Console presence
   at all: joining query to page shows their queries are served by
   `/service-areas/` pages instead, and the routes themselves record zero
   impressions on any device over six months. No published WV route has a
   single click. The Ads floor hides most of this market's query variety, and
   Search Console cannot replace it because its desktop majority — 79% of
   impressions — is mostly noise that cannot be cleanly separated from genuine
   traffic. Mobile and tablet give a conservative floor, not a clean read.
2. **Near-me demand is contested by the pack and by organic pages.** Track the
   two separately. The site does **not** currently compete for these phrases
   organically — they appear only in inert metadata `keywords` arrays — so this
   is a targeting opportunity not yet taken rather than ground to defend.
3. **Two of the three attributed leads landed on paving service pages and the
   third on a service-area page** — none on the guide that carries 36% of
   clicks. n = 3, so directional only, but it is attribution rather than
   inference.
4. **Prioritising the profile rests on the rank grid**, not on a keyword ratio.
5. **Check the population, the bound, and the page.** Three errors of the same
   family appeared in this document: dividing a national volume by a local one
   (the withdrawn 1,500:1 ratio), restating a bound as a measurement (79% read
   as an automation rate when it is a device share), and crediting a page with
   impressions that a query-only report never said it received — which is what
   moved the route count to six and then to four before a query-to-page join
   put it back at three. Query data alone never names the page. The figures in
   this document held up under checking; the sentences written around them kept
   reaching for something tidier than the data supported.
