# Most of the impressions are not people — 2026-09-17

**Window:** 2026-06-14 → 2026-09-14 (90 days), Search Console, `sc-domain` property.

This corrects the audit's central framing twice over, and it changes what is
worth working on. It also contradicts a recommendation made earlier the same
day — that CTR was the highest-leverage lever, worth roughly 8× traffic. That
was wrong, and this is why.

## The split

| Device | Impressions | Clicks | CTR | Avg position |
| --- | --- | --- | --- | --- |
| Desktop | 22,199 | 30 | **0.14%** | 26.2 |
| Mobile | 5,984 | 52 | 0.87% | 18.6 |
| Tablet | 58 | 2 | 3.45% | 14.8 |
| **Total** | **28,241** | **84** | **0.30%** | — |

Desktop is **79% of impressions and 36% of clicks.** For a residential
remodeling contractor that split is backwards: homeowners look for a roofer on
a phone.

## Why the desktop block is not people

The roof cost guide is the clearest case — 4,013 impressions, 2 clicks.

| Device | Impressions | Clicks | CTR | Position |
| --- | --- | --- | --- | --- |
| Desktop | 3,537 | **0** | **0.00%** | 15.0 |
| Mobile | 53 | 1 | 1.89% | 22.3 |

Three independent signals, any one of which would be suggestive and which
together are conclusive:

**1. Zero clicks at position 4.** Three queries on that page sit at positions
4.0–4.4 with 449 impressions between them and no clicks at all:

| Query | Impressions | Position | Clicks |
| --- | --- | --- | --- |
| average cost of a new roof charles town wv | 160 | 4.4 | 0 |
| charles town wv roof replacement estimate | 148 | 4.1 | 0 |
| charles town wv roof replacement cost | 141 | 4.0 | 0 |

Expected CTR at position 4 is roughly 7%. Across 449 impressions that is about
31 clicks. Zero is not a bad snippet; a bad snippet still gets clicked
occasionally.

**2. The queries have no search volume.** Of ten of these queries checked
against Google Ads keyword data, **nine returned no volume record at all.** The
only one with measurable demand was `roofing contractor martinsburg wv`, at 10
searches a month. A query nobody searches cannot produce 160 impressions in 90
days.

**3. The town list gives it away.** The page ranks for Bloomery (population
about 200), Gerrardstown, Augusta, Romney and Hainesville — none of which the
page mentions and none of which is a service area on this site — in templated
phrasings: `{town} wv roof replacement cost`, `average cost of a new roof
{town} wv`, `{town} wv new roof cost`, `{town} wv roof replacement estimate`.
That is a crawler enumerating combinations across the state, which is how
rank-tracking tools and SERP scrapers work.

The same desktop-heavy, near-zero-CTR block appears on every page with real
impressions, so this is property-wide rather than one page's problem.

**What this does not prove.** Desktop still produced 30 clicks, so the desktop
slice is not purely automated and the two cannot be cleanly separated. Mobile
plus tablet is therefore a conservative **floor** for real traffic, not a
precise measure — it excludes whatever genuine desktop traffic exists.

## The corrected baseline

**6,042 real impressions, 54 clicks, 0.89% CTR, average position ~18.5.**

At position 18.5 — page two — 0.89% is normal. The property is performing
roughly as expected for where it ranks.

## The snippets are fine

This is the finding that kills the CTR theory. On mobile, on the queries where
the site actually reaches page one:

| Query | Impressions | Clicks | CTR | Position |
| --- | --- | --- | --- | --- |
| chip seal vs asphalt vs concrete | 30 | 3 | **10.0%** | 4.2 |
| chip seal vs concrete | 11 | 1 | **9.1%** | 5.7 |

Nine to ten percent is a healthy CTR. When a person sees this site on page one,
they click at a normal rate. Rewriting titles and descriptions cannot improve
on that, and the audit's implied snippet project should not be funded.

**The constraint is ranking position on a small real-demand base**, not
presentation.

## What is actually close

Real mobile traffic within reach of page one:

| Query | Impressions | Position |
| --- | --- | --- |
| asphalt shingle roofing inwood wv | 31 | 15.6 |
| asphalt vs concrete driveway | 20 | 12.1 |
| basement additions great falls va | 18 | 12.7 |
| basement finishing contractor in vienna va | 13 | 10.6 |
| basement finishing in reston va | 13 | 10.7 |
| basement finishing contractor in clifton va | 10 | 12.0 |
| basement finishes vienna va | 7 | 12.0 |
| asphalt vs tar and chip | 6 | 10.8 |

Note the volumes: 6 to 31 impressions over 90 days. These are real but tiny.
Winning all of them is a handful of visits a month. **No amount of on-page work
makes this demand base large** — that is the honest read, and it is why the
review push and the local pack matter more than anything in this repository.

**The near-page-one basement cluster is Northern Virginia** — Great Falls,
Vienna, Reston, Clifton, Alexandria. That is not in tension with today's
removal of Great Falls and Vienna from the Google Business Profile service
area: the service area governs local-pack and Maps visibility, while these are
organic page rankings, which it does not affect. Nothing was given up here.

## One pattern worth testing

The single page earning real clicks is the driveway **comparison** guide — 30
of the property's 84 clicks, 36% of the total. It is also the only page Google
gives jump-links to, with its `#asphalt`, `#concrete` and `#the-quick-answer`
fragments each surfacing around position 4.8 on mobile.

The **cost**-framed guides do far worse: the roof cost guide took 4,013
impressions for 2 clicks, the deck cost guide 1,058 for 3 at position 9. Cost
questions are what AI Overviews answer inline; a three-way comparison is not.

Treat this as a hypothesis rather than a rule — it is one strong data point,
and comparison framing alone is not sufficient: the
`architectural-vs-3-tab-shingles` guide sits at position 4.7 on **7**
impressions, ranking well for something nobody searches. A comparison post
needs a topic with real volume behind it. The test would be one comparison
guide on a topic with verified volume, measured on mobile clicks.

## How to read this property from now on

**Filter Search Console to mobile.** Desktop numbers on this property are
mostly noise, and any CTR or impression figure that includes them is wrong in a
way that points work at the wrong problem. Both corrections to the audit
headline came from this — the first from a bad click total, the second from a
bad impression total.
