# The blog is the only channel that works, and half of it is invisible — 2026-09-18

**16 of the 31 blog posts have zero mobile impressions, and all 16 are "URL is
unknown to Google" — complete, no exceptions.** Separately, among the pages that
*are* indexed, the blog earns **58% of the site's non-homepage clicks from 29%
of its non-homepage impressions**, at 3.5× the CTR of the service and area
pages.

**Those are two findings, and joining them is a leap this file does not make.**
An earlier version said the unfetched blog posts were therefore "a larger loss"
than the 20 unindexed service+city pages. That applies the measured CTR of the
15 posts Google *has* fetched to the 16 it has not, which nothing here supports
— and the caveats at the foot of this file said so while the opening sentence
ignored them. The coverage finding stands on its own; the CTR finding stands on
its own; what the unfetched posts would earn is unknown.

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

## Two properties of the posts themselves, tested

Both were free to check and both are recorded so nobody repeats them. **Neither
came out as cleanly as the first draft of this section claimed** — see the
corrections in each.

### Age — one direction refuted, the other still live

The obvious explanation is that the unfetched posts are simply newer. They are
not. **The four newest posts, all published 2026-07-06, have all been fetched**
(`basement-egress-window-cost`, `deck-cost-per-square-foot`,
`roof-replacement-cost`, `walk-in-shower-cost`), while the oldest cohort,
2026-05-19, is four never-fetched against one.

("Fetched" rather than "indexed" because one of the fifteen —
`storm-damage-roof-repair-insurance` — is crawled-but-not-indexed, as the
section above records. All sixteen in the other column are literally "unknown to
Google".)

| Published | Fetched | Never fetched |
| --- | --- | --- |
| 2026-05-19 | 1 | 4 |
| 2026-05-27 | 1 | 0 |
| 2026-05-30 | 4 | 6 |
| 2026-06-07 | 5 | 6 |
| 2026-07-06 | **4** | **0** |
| **total** | **15** | **16** |

**But this eliminates one direction of the hypothesis, not the hypothesis.** An
earlier version of this section said "every cohort with more than one post
contains both states", which the table above contradicts: **2026-07-06 is four
fetched and zero never-fetched.** Fetched rate by cohort:

| Published | Fetched rate |
| --- | --- |
| 2026-05-19 | 1/5 = 20% |
| 2026-05-27 | 1/1 = 100% |
| 2026-05-30 | 4/10 = 40% |
| 2026-06-07 | 5/11 = 45% |
| 2026-07-06 | **4/4 = 100%** |

So what is refuted is *"the unfetched posts are the newer ones"*. **The reverse —
older posts being less likely to have been fetched — is consistent with this
data and is not tested away.** Oldest cohort against newest is 1 of 5 versus 4
of 4, one-sided Fisher exact **p = 0.040**.

That p-value should not be leaned on. The two cohorts were chosen *because* they
were the extremes, after seeing the table, on nine posts in total — the same
post-hoc selection that makes the cost-guide result below weak. It is reported
so the direction is on record, not because it is established.

**If it is real it fits the crawl-budget hypothesis rather than competing with
it:** Google sampled the site early, has broadly kept up with what was published
since, and has never gone back for the older material. That is testable the same
way everything else here is — by whether an indexing request moves anything.

This was the same confound that inflated the service+city figures earlier today
(`index-coverage-2026-09-18.md`, wrong turn 3). Checking it first was right;
declaring it eliminated was not.

### Post type — not established, and weaker than it looks

Sorting by the `type` field in the frontmatter shows cost guides doing better
than the 48% base rate (15 of 31):

| `type` | Fetched | Never fetched |
| --- | --- | --- |
| cost-guide | 6 | 2 |
| how-to | 4 | 6 |
| buying-guide | 2 | 3 |
| comparison | 2 | 1 |
| permit-guide | 1 | 2 |
| maintenance | 0 | 2 |
| **total** | **15** | **16** |

Cost guides are 6 of 8 fetched against 3.9 expected. **P(≥6 of 8 by chance) =
0.09**, and the related "slug contains *cost*" cut gives 5 of 7, **p = 0.17**.

Neither is worth acting on, and the 0.09 is weaker than the number suggests for
two reasons. **Two tests were run, not one.** And **the pattern was noticed in
the output of the age test and then tested**, which is not the same as
predicting it beforehand — a post-hoc p-value on a pattern spotted by eye
overstates its own confidence. It is recorded as a tendency to keep an eye on if
the sample ever grows, not as a finding.

**So no property of the posts tested here is established as a predictor — which
is not the same as none of them predicting anything.** Type is unestablished
rather than absent (p = 0.09 on 8 posts), age survives in the opposite direction
to the one proposed (p = 0.040, post-hoc), and "topic format" was never tested
at all; an earlier version of this line listed it anyway.

The service+city result is the stronger of the two: there, content volume, raw
link count, trade and same-commit page age were each eliminated against data
that did not have these sample-size problems.

## What follows

1. **Include unindexed blog posts in the indexing request — but the reason is
   not the CTR figure above.** An earlier version of this line argued they were
   the better target because the blog converts at 0.54% against 0.16%. **That
   0.54% was measured on the 15 posts that already earn impressions, not on the
   16 that have never been fetched**, and this file's own caveats say those 16
   may earn nothing. Ranking the request on a number drawn from a different set
   of pages could send the effort at the wrong URLs.

   What can be said without that leap: the request is a diagnostic, and a
   diagnostic is more informative when its subjects differ. Including both a
   service+city page and a blog post tests whether the coverage problem responds
   the same way across templates, which is the open question. **That is a reason
   to include blog URLs, not a reason to prefer them.**

   Establishing a real priority needs demand data for the specific unfetched
   topics — search volume for what `kitchen-remodel-cost-wv-md-va-2026` and the
   Loudoun guides target. That has not been pulled, and this file should not
   imply otherwise.
2. **It sharpens the consolidation question rather than answering it.** If the
   site is over-built for the crawl attention it receives, the 60 templated
   service+city pages are the candidate to thin and the blog the thing to
   protect. **That judges the two templates by how their *indexed* pages
   perform**, which is the right evidence for a question about page types —
   unlike ranking individual unfetched URLs, which it is not. It remains the
   owner's decision and it still rests on a cause that is not established.
3. **It does not follow that more blog posts should be written.** Sixteen
   existing ones have never been fetched. Adding to a set Google is already not
   reading is the same error as adding service+city pages.

## What this file does not claim

- **Not** that the blog's CTR advantage is causal. Cost guides answer a
  different intent than service pages; the comparison shows where clicks come
  from, not why.
- **Not** that the 16 unindexed posts would earn clicks if indexed. The 15
  indexed posts average well, but one of them carries most of the impressions —
  and an earlier draft of recommendation 1 made exactly this leap, applying the
  indexed posts' CTR to the unfetched ones while this caveat sat two screens
  below contradicting it.
- **Not** a cause for the coverage problem. It widens the finding from one
  template to the whole site and refutes one proposed mechanism; it establishes
  nothing new about why.
- **Not** a CTR recommendation, per §0.
