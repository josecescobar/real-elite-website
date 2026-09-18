# The blog is the only channel that works, and half of it is invisible — 2026-09-18

**16 of the 31 blog posts have zero mobile impressions, and all 16 are "URL is
unknown to Google" — complete, no exceptions.** The blog earns **58% of the
site's non-homepage clicks from 29% of its non-homepage impressions**, at 3.5× the CTR of the
service and area pages. So the half of the blog Google has never fetched is a
larger loss than the 20 unindexed service+city pages already recorded in
`index-coverage-2026-09-18.md`.

This file also **corrects a claim made in that document earlier today**. See
"What this refutes" below.

## The blog out-performs everything except the homepage

Mobile, 2026-03-18 → 2026-09-17:

| Segment | Clicks | Impressions | CTR |
| --- | --- | --- | --- |
| Homepage | 37 | 1,145 | **3.23%** |
| **Blog** (15 posts with impressions) | **43** | 7,996 | **0.54%** |
| Service + area pages (29 rows) | 31 | 19,995 | 0.16% |

The service and area pages take **2.5× the blog's impressions and produce fewer
clicks.** Excluding the homepage, the blog is **58% of all clicks**.

That is the reverse of where the effort has gone. §8's phases build and tune
service+city pages; the pages that actually earn clicks are cost guides.

## Half of it has never been fetched

All 31 posts build and all are in the sitemap. Sixteen have never had a mobile
impression, and **every one of those sixteen was inspected — all 16 came back
"URL is unknown to Google"**, meaning never crawled:

```
5-signs-you-need-a-new-roof-eastern-panhandle
basement-finishing-frederick-md-guide
composite-vs-pressure-treated-decks-loudoun-county-va
deck-permits-berkeley-jefferson-county-wv-2026
financing-a-kitchen-remodel-options-2026
frederick-md-home-improvement-permits-costs-2026
kitchen-remodel-cost-wv-md-va-2026
luxury-bathroom-renovation-loudoun-northern-virginia-2026
luxury-kitchen-renovation-loudoun-northern-virginia-2026
luxury-outdoor-living-decks-loudoun-northern-virginia-2026
luxury-primary-suite-loudoun-northern-virginia-2026
siding-stone-exterior-curb-appeal-wv-md-va-2026
spring-deck-building-season-eastern-panhandle
ultimate-spring-exterior-checklist-eastern-panhandle
whole-home-luxury-renovation-loudoun-northern-virginia-2026
why-hiring-licensed-contractor-wv-saves-money
```

**The coverage problem is sitewide, not a property of the combo template.**
Across two entirely different content models, templates and URL shapes, the
count is now **36 of 36**: 20 of 20 still-live zero-impression service+city
pages, and 16 of 16 zero-impression blog posts. That removes the last reading in
which this was something about how service+city pages are built.

Note what is in that list: `kitchen-remodel-cost-wv-md-va-2026` and five of the
six Loudoun luxury guides — the Northern Virginia content Phase 2 depends on.

## What this refutes

`index-coverage-2026-09-18.md` (merged today, #155) observed that two
crawled-but-not-indexed pages were both last crawled 2026-06-01 while all ten
indexed pages inspected were crawled 2026-07-07 or later, and offered this:

> *"Google crawled in June, made a broader pass from early July, and the pages
> it did not return to are the ones that fell out of the index."*

**The blog breaks it.** `storm-damage-roof-repair-insurance-eastern-panhandle-2026`
was last crawled **2026-07-29** — three weeks the right side of that line — and
is **"Crawled – currently not indexed"**.

So a recent crawl does not imply indexing, and the June/July split was an
artefact of the twelve combo pages that happened to be inspected. It was labelled
an observation rather than a mechanism, which was the correct hedge, but it
should not be carried forward as one.

**This matters for the recommendation, not just the record.** That document
proposed requesting indexing partly on the theory that a recrawl would restore
the dropped pages. `storm-damage` is a page Google recrawled of its own accord
and still declined to index. Requesting indexing remains the right test — it is
cheap and it distinguishes "not fetched" from "fetched and declined" — but **a
recrawl alone should no longer be expected to fix anything.**

## The largest single number on the site

`/blog/roof-replacement-cost-eastern-panhandle-2026` holds **4,069 mobile
impressions** — more than any other page on the site, and **51% of all blog
impressions on its own** — against **2 clicks**, at position 14.2. It is indexed
and was last crawled 2026-08-25.

(An earlier draft called it "roughly a third of the site's total". Against the
segments measured here it is 14%. The blog share is the meaningful one, and it
is the reason the blog's 0.54% CTR should not be read as typical: strip this one
page out and the remaining 14 posts run **41 clicks on 3,927 impressions, or
1.04%.**)

Recorded because it is the biggest number in the dataset, **not as a proposal.**
§0's standing constraint is that a CTR or snippet project is not to be funded,
and nothing here changes that. The figure's value is as context for December: a
page at position 14 with this much exposure is the clearest available measure of
what ranking improvement would be worth, whenever that question is asked with
better instrumentation.

## What follows

1. **The unindexed blog posts are the better target for any indexing request.**
   If crawl attention is the scarce resource, spending it on pages that convert
   at 0.54% beats spending it on pages that convert at 0.16%. The Search Console
   request in `index-coverage-2026-09-18.md` should include
   `kitchen-remodel-cost-wv-md-va-2026` and the Loudoun luxury guides alongside
   the service+city URLs.
2. **It sharpens the consolidation question rather than answering it.** If the
   site is over-built for the crawl attention it receives, the 60 templated
   service+city pages are the obvious candidate to thin and the blog is the
   obvious thing to protect. That is a decision for the owner and it still rests
   on a cause that is not established.
3. **It does not follow that more blog posts should be written.** Sixteen
   existing ones have never been fetched. Adding to a set Google is already not
   reading is the same error as adding service+city pages.

## What this file does not claim

- **Not** that the blog's CTR advantage is causal. Cost guides answer a
  different intent than service pages; the comparison shows where clicks come
  from, not why.
- **Not** that the 16 unindexed posts would earn clicks if indexed. The 15
  indexed posts average well, but one of them carries most of the impressions.
- **Not** a cause for the coverage problem. It widens the finding from one
  template to the whole site and refutes one proposed mechanism; it establishes
  nothing new about why.
- **Not** a CTR recommendation, per §0.
