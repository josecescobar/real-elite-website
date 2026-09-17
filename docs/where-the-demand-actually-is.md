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

A follow-up sweep made this systematic rather than hand-picked: **every one of
the site's 12 services against all 9 West Virginia home-market towns, in one
canonical phrasing each — 90 combinations.**

**Eighty of the ninety returned no measurable volume at all.** The ten that did:

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
| `roofing charles town wv` | 10 |

**430 a month from that grid**, and every town other than Martinsburg, Charles
Town and Inwood is empty across all twelve trades. Siding, home additions and
paving contractor return nothing in any town. Adding the other Martinsburg
phrasings from the first table brings the measured total to roughly **800 a
month**.

Call that a **measured subtotal, not a ceiling.** It covers one phrasing per
service per town, not every way a person might word a search, so untested
phrasings could add to it. What it does establish is the shape: demand
concentrates almost entirely in Martinsburg, and 89% of service-town
combinations the site builds pages for have no measurable search behind them at
all.

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
- **Organic opportunity** — won with pages, beneath the pack, and the site
  already targets some of these phrases.

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
adjacent comparison terms. It belongs in a guide. Retitling
`/paving/driveway-paving` around cost would trade `driveway paving near me` —
transactional, difficulty 1, already targeted — for an informational term, which
is the wrong direction.

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

1. **Measured geo-modified demand is ~800 searches a month**, and 80 of 90
   service-town combinations return nothing. A subtotal rather than a ceiling,
   but it is the one figure here measured on the right population, and the
   shape is unambiguous: demand is Martinsburg, and thin everywhere else.
2. **Near-me demand is contested by the pack and by organic pages.** Track the
   two separately; the site already competes for some of these phrases and
   should not concede them.
3. **All three attributed leads landed on service pages, none on the guide**
   that carries 36% of clicks — two of the three on paving. n = 3, so
   directional only, but it is attribution rather than inference.
4. **Prioritising the profile rests on the rank grid**, not on a keyword ratio.
5. **Do not divide a national volume by a local one.** That was the error here,
   and it is the same class of mistake as reading Search Console without
   filtering out desktop crawler traffic.
