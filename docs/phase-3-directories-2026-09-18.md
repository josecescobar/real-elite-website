# Phase 3 — which directories actually rank, measured 2026-09-18

§8 Phase 3 says: *"Directory profiles: Angi, Houzz, Yelp, BuildZoom, Thumbtack
(the repo already has a Thumbtack webhook). A third of the NoVA organic field
is directories; being listed in them is cheaper than outranking them."*

The reasoning is sound. **The list is not, and neither is the market it points
at.** Both were checked against live SERPs before any profile work starts,
because a profile costs owner hours and those go to the wrong places if the
list is generic.

## Method, and its limits

Live Google results, depth 20, 2026-09-18, via DataForSEO. Five queries
returned; two more (`kitchen remodeling loudoun county va`, `siding contractor
martinsburg wv`) failed upstream with `Internal SE Server Error` and are not
reported — I did not retry selectively.

**Five queries is a small sample.** Directory presence varies by query and by
trade, and nothing below should be read as a stable percentage. What it is good
enough to establish is which *names* appear at all, which is the question Phase
3 actually turns on.

Rows counted are organic only — local pack, People Also Ask, related searches
and the review carousel are excluded. "Relevant" excludes rows where the SERP
has run out of topical results (Reddit threads, a Spotify podcast, a PS5 error
video, the WV Board of Medicine).

## Directory share, both ways of counting

`facebook.com` is counted separately because it is arguable: the rows are
Facebook's `fb-answers` pages and a local group post, which behave like
directory listings but are not one.

| Query | Relevant organic | Directories | Strict | + social |
| --- | --- | --- | --- | --- |
| basement remodeling northern virginia | 10 | 2 | 20% | 30% |
| basement finishing northern virginia | 14 | 2 | 14% | 14% |
| roofing contractor martinsburg wv | 14 | 4 | 29% | 36% |
| bathroom remodeling martinsburg wv | 14 | 4 | 29% | 36% |
| deck builder martinsburg wv | 9 | 3 | 33% | 44% |

| Market | Strict | + social |
| --- | --- | --- |
| Northern Virginia (2 queries) | 17.1% | 22.1% |
| Home market (3 queries) | 30.2% | 38.6% |

**§1.3's "a third of the NoVA organic field is directories" holds on its own
terms** — counting Facebook, `basement remodeling northern virginia` is 3 of 10.
What the wider pull adds is that **the home market runs at least as high and
probably higher**, on either counting. Phase 3 is framed as a Northern Virginia
play, and the evidence does not support that framing being exclusive.

## Which names actually appear

| Domain | SERPs (of 5) | Where |
| --- | --- | --- |
| `yelp.com` | **5** | both markets, every query |
| `bestpickreports.com` | 2 | Northern Virginia only |
| `bbb.org` | 2 | home market only |
| `houzz.com` | 2 | home market only (bathroom, deck) |
| `angi.com` | 1 | home market only (bathroom) |
| `homeadvisor.com` | 1 | home market only (bathroom) |
| `downtobid.com` | 1 | home market (commercial bid aggregator) |
| `gaf.com` | 1 | home market (roofing manufacturer locator) |

### Against the five Phase 3 names

| Named in Phase 3 | Appears |
| --- | --- |
| Yelp | **5 of 5** |
| Houzz | 2 of 5 — home market only |
| Angi | 1 of 5 — home market only |
| BuildZoom | **0 of 5** |
| Thumbtack | **0 of 5** |

Two of the five never appear. Two more appear only in the market Phase 3 is not
aimed at. And three domains that do rank — BestPickReports, BBB, HomeAdvisor —
are not named at all.

**The Thumbtack case is worth stating plainly:** the repo has a Thumbtack
webhook, and that is why Thumbtack is on the list. Having the integration is not
evidence of demand, and Thumbtack did not appear in any of the five SERPs.
Plumbing is not a reason to prioritise a channel.

## Revised priority

Ordered by evidence, not by how well known the brand is.

1. **Yelp** — the only directory in all five SERPs, in both markets. If exactly
   one profile gets made, this is it.
2. **BBB** — two of three home-market queries. Also a trust signal in a market
   where the business is local, which the others are not.
3. **Houzz** — two home-market queries, both on visual trades (bathroom, deck).
   Houzz is photo-led; it pairs with the job photos already needed for Phase 2.2.
4. **Angi / HomeAdvisor** — same parent company, one query each. Treat as one
   decision, not two.
5. **BestPickReports** — the only directory ranking in *both* NoVA queries. I do
   not know its entry requirements or cost; it presents as a vetted/paid
   programme. Worth a look before assuming it is available.
6. **GAF contractor locator** — not a directory in the same sense: it is a
   manufacturer's certified-installer listing, and Real Elite does roofing. If
   the certification is already held, the listing may be free and unclaimed.

**Dropped: BuildZoom, Thumbtack.** No appearances.

## What this does not tell you

- Whether Real Elite already has a profile on any of these. I cannot see that
  from here; several may exist unclaimed, which is faster to fix than a new one.
- Whether a listing converts. Ranking in the organic field means the *directory*
  gets the click — being listed inside it is a second-order bet, and the
  document that claims otherwise has not measured it.
- Anything about the local pack, which is a different surface with different
  rules and is §5's subject, not this one.

## What has not been done, and why

**No profiles were created or edited.** Every item above writes to an
outward-facing asset the repo does not own, which `CLAUDE.md` reserves for the
owner. This file is the prioritised list to work from, not a record of work
completed.
