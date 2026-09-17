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
volume. The first pass at this was a **hand-picked sample**, not an inventory —
it is superseded by the systematic sweep below, which found positive rows this
table does not list (`roofing martinsburg wv`, `handyman charles town wv`,
`handyman inwood wv`, `home repair martinsburg wv`). Two of its rows, Hagerstown
MD and Winchester VA, are not in the Eastern Panhandle at all. It is kept
because the five extra Martinsburg phrasings in it are what established the
clustering problem:

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

So the figure this document works with is **440 a month, the arithmetic sum of
the eleven reported rows** — one canonical phrasing per service-town pair. Not
a total across all wordings, which cannot be computed by addition from these
numbers at all.

**It is not a subtotal**, and calling it a "measured subtotal" — as earlier
drafts did — smuggles in the claim the paragraph above just withdrew. A
subtotal is a partial sum of disjoint parts, and nothing establishes that the
eleven rows are disjoint from each other. The same clustering that stops the
five extra Martinsburg phrasings being added applies *within* the grid:
`handyman martinsburg wv` (140) and `home repair martinsburg wv` (10) are close
enough in meaning that Ads may be reporting one cluster twice. So 440 could
overstate the reported demand as easily as understate the market.

Nor is it a ceiling or a floor. Untested wordings might add volume on top, or
their volume might already sit inside the rows that were reported — clustering
is precisely what makes the two indistinguishable. The increment cannot be
estimated by summing the rows, and it cannot be assumed positive.

### What "no measurable volume" actually means

It means **no independently reported volume**, which is weaker than it sounds
and has two causes that cannot be told apart from the outside.

The first is the **reporting floor**: too few searches for Ads to publish a
number. The second is **clustering**: the phrase is a close variant of one that
*was* reported, and its volume is already counted inside that row. Nothing in
the Ads output distinguishes them.

What this repository does prove is that an unreported term is not a dead one.
The comment above the basement entries in `src/lib/service-city-content.ts`
records Search Console positions of **3.2** for `basement remodeling ranson wv`
and **5.7** for `basement remodeling inwood wv`, and a position exists only
where impressions exist. Both phrases return no volume in the Ads data checked
here — so both are searched, and both are unreported. **Which of the two causes
applies to either one is not determinable**, and this document does not claim
it. The example establishes that an empty row can coexist with real searching;
it establishes nothing about why the row is empty.

**This weakens the 121 empty rows and the three-of-six count alike.** Neither is
"121 terms nobody searches" nor "121 terms below the floor"; it is 121 terms
with no separately reported number, for one reason or the other. The same
applies to saying three of six routes "clear the floor": three have an
independently reported row and three do not, which is not the same as three
having demand and three not.

So every "returns nothing" in this document should be read as *no separately
reported number*, never as *nobody searches this*. What it establishes is
narrower than it first looks: **the reported grid is Martinsburg-heavy**, and
90% of the grid has no independently reported volume behind it. That is a statement about the sampled canonical phrasings, not about
where demand lives — see "The two instruments disagree about geography" below,
where the floor data points somewhere else entirely.

**That grid is not the site's page count.** `/services/[service]/[city]` builds
only from the `CONTENT` map in `src/lib/service-city-content.ts`, which holds
**69 keys — 6 WV, 51 VA, 12 MD.** The WV six are `roofing-martinsburg-wv`,
`roofing-charles-town-wv`, `decks-martinsburg-wv`, `basements-ranson-wv`,
`basements-inwood-wv` and `basements-charles-town-wv`.

So the combinations without an independently reported row are mostly
*unpublished* — which says where the pages are, not where the demand is, since
an unreported row can be floored or clustered. Matched at the same service-town
granularity the sweep uses, **three of the six** have a positive row behind
them:

| Published route | Matching sweep row |
| --- | --- |
| `roofing-martinsburg-wv` | `roofing martinsburg wv` — 90 |
| `roofing-charles-town-wv` | `roofing charles town wv` — 10 |
| `decks-martinsburg-wv` | `deck builder martinsburg wv` — 30 |
| `basements-ranson-wv` | none |
| `basements-inwood-wv` | none |
| `basements-charles-town-wv` | none |

**Three of six is the independently-reported count — not a demand count — and
Search Console cannot raise or lower it, because these routes are two days
old.** Three of the six have a phrase with its own Ads row; the other three do
not, which per the section above can mean floored *or* folded into a cluster. All six WV keys were added on
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
recorded as its reason for existing, is where this demand landed **during the
window, which closed the day before the routes went live**:

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
`handyman inwood wv`, 10 a month, which has **1** Search Console impression
over six months. That juxtaposition is worth stating carefully, because the
obvious reading is wrong: one impression does not mean nobody searched the
term. It means this property appeared in results for it once. The site ranks
44th on it, so 10 searches a month and one impression in six months are
perfectly consistent. What the comparison does show is that **Ads reports one
independent row where Search Console records 32 distinct strings** — that much
rests on filtered data. Why the other 31 have no row of their own is not
determinable: floored, or folded into a reported cluster. Whether Ads and Search
Console disagree about what people *search* is not something either can show.

Two things it does not establish. It says nothing about **volume**: a floor
impression proves the string was searched, and says nothing about how much of
that search is already inside a reported Ads cluster. And it is not a success story. Those floor impressions
produced **zero clicks**.

Grouped by page rather than by query, the same filtered Inwood slice totals
**631** — one more than the query grouping's 630, because Search Console's two
groupings are computed separately and do not have to reconcile exactly. Within
the page grouping: **519 to `/service-areas/inwood-wv`**, 86 to `/paving`, and
26 across five other pages. So `/service-areas/inwood-wv` takes **82% of the
page-grouped impressions**.

Joining query to page gives the variety figure separately, and it is close but
not the same number: of the 32 distinct floor queries, **25 land on
`/service-areas/inwood-wv`** — 78% — spanning roofing, siding, bathrooms,
basements, paving and stonework. `/paving` takes 7, and the remaining pages
share 3 between them (two queries appear on more than one page). One generic
page answers three quarters of a town's distinct queries, across six trades,
and converts none of them.


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

What both agree on is that there are **many distinct query strings** in this
market. Neither establishes that each one is small — Search Console impressions
are a function of where this site ranks, and an unreported Ads row may be
floored or clustered.

One bound does survive, and it is the one the document rests on. **Clustering
cannot hide large volume.** If an untested variant's searches are folded into a
canonical row, they are already inside that row's number — and the largest
number any home-market geo-modified term returned is `handyman martinsburg wv`
at 140 a month. A cluster containing large volume would report as large. So the
only route by which a large geo-modified term could be hiding here is a phrasing
the sweep never tested and that clusters with nothing it did test.

**That route is open, and it is the honest caveat on this whole document.** The
sweep used one canonical phrasing per service-town pair; Inwood alone shows 32
distinct strings in Search Console against the 12 tested for it. Closing it
means testing more phrasings per pair, not more towns. Until that is done, the
defensible statement is: *no geo-modified term this document tested returns
large volume, and nothing in either instrument points at one that would* — which
is weaker than "there is no upside hiding" and is what the evidence supports.

What the two instruments do **not** agree on is which towns those queries sit
in.

### The two instruments disagree about geography

Home-market towns on the mobile-plus-tablet floor, 6 months to 2026-09-14,
against what the Ads sweep reported for the same towns:

| Town | Floor queries | Floor impr. | Floor clicks | Ads sweep |
| --- | --- | --- | --- | --- |
| Inwood | 32 | 630 | 0 | 1 row, 10/mo |
| Hedgesville | 4 | 229 | 0 | nothing |
| Martinsburg | 16 | 77 | 1 | 8 rows, **370/mo** |
| Charles Town | 6 | 17 | 0 | 2 rows, 60/mo |
| Ranson | 2 | 3 | 0 | nothing |

Martinsburg is 370 of the 440 on the Ads side — 84% of everything the sweep
reported — and **8% of the 956 floor impressions in this table**. Against
Inwood alone it is 77 to 630.

Ads puts almost all the reportable volume in Martinsburg. The floor puts eight
times Martinsburg's impressions, and twice its query variety, in Inwood — a
town Ads sees once, at 10 a month.

**Neither ordering is a measurement of demand.** Ads ranks towns by which
phrases got an independently reported row, so floored and clustered terms both
drop out. Search Console ranks them by where this site happens to rank, which is
an accident of the site's own page inventory, not of the market. Hedgesville
makes the point unmistakable: its 229 floor impressions are four
queries, and all four are plumbing terms — `vanity stoppage hedgesville wv`,
`pop repair service hedgesville wv` — a trade the site does not list among its
twelve services.
That is the site surfacing for things nobody wanted it for, counted as if it
were local demand.

So the geographic claim this document can support is **"the reported grid is
Martinsburg-heavy"** and nothing stronger. Where Eastern Panhandle demand
actually concentrates is not established by either instrument, and the two
disagree by a factor of eight about the leading town.

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

These are national and early-intent. **The local slice of each is unknown**, and
this document has already withdrawn the population-scaling move that would
estimate it — search behaviour is not uniform by head of population, and locally
filtered volume for a term without a place name is not obtainable from these
tools. What can be said is that these terms name no market, so their national
figure is not a local one.

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
   no separately reported number, which can be a term below the reporting floor
   or a term whose volume is already counted inside a reported row. Not zero,
   and not distinguishable. Alternative wordings are not added in, because
   clustering means they cannot be summed without double-counting and may
   already sit inside the reported rows. What 440 does have going for it is the
   population: it is the one figure here measured on geo-modified terms, which
   name their own market. The shape of the reported grid is unambiguous —
   Martinsburg-heavy, thin elsewhere — but that is a fact about the sampled
   phrasings, not about where demand lives. On the Search Console floor, Inwood
   carries eight times Martinsburg's impressions. The two instruments disagree
   about geography by a factor of eight, and neither is measuring the market:
   Ads ranks towns by which phrases got an independently reported row, Search
   Console by where this site happens to rank. Six WV routes are published and
   three have an independently reported Ads row; the other three do not, which
   is not the same as having no demand. How any of them perform is not yet
   knowable: all six were added on 2026-09-15, after every measurement window
   here closed. The trade-specific WV queries landed on `/service-areas/` pages
   during the measured window — which closed the day before the routes went
   live — and that is the gap those routes were published to close. Ads reports
   far fewer independent rows than Search Console records distinct strings;
   whether the missing ones are floored or folded into reported clusters is not
   knowable from these tools, and neither is their volume — and Search Console
   cannot replace it because its desktop majority — 79% of impressions — is
   mostly noise that cannot be cleanly separated from genuine traffic. Mobile
   and tablet give a conservative floor, not a clean read.
2. **Near-me demand is contested by the pack and by organic pages.** Track the
   two separately. The site does **not** currently compete for these phrases
   organically — they appear only in inert metadata `keywords` arrays — so this
   is a targeting opportunity not yet taken rather than ground to defend.
3. **Two of the three attributed leads landed on paving service pages and the
   third on a service-area page** — none on the guide that carries 36% of
   clicks. n = 3, so directional only, but it is attribution rather than
   inference.
4. **No tested geo-modified term is large, and clustering cannot hide one.** A
   variant folded into a canonical row is already inside that row's number, and
   the largest number any home-market geo-modified term returned is 140 a month
   (`handyman martinsburg wv`). A cluster holding large volume would report as
   large. **The one open route** is a phrasing the sweep never tested that
   clusters with nothing it did test — one canonical phrasing per service-town
   pair was tested, while Inwood alone shows 32 distinct strings in Search
   Console against 12 tested. Closing that means more phrasings per pair, not
   more towns. Until then: no term tested here is large, and nothing in either
   instrument points at one that would be.
5. **Prioritising the profile rests on the rank grid**, not on a keyword ratio.
6. **Check the population, the bound, the page, and the date.** Four errors of
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
