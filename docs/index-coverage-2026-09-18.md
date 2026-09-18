# Nearly half the service+city pages are not in Google's index — 2026-09-18

**30 of the 62 service+city combo pages that were live for the measurement
window have zero mobile impressions. Of the 20 still live, all 20 are "URL is
unknown to Google" — not ranked badly, not crawled and rejected, but never
fetched**, though they have been in the sitemap since 2026-07-06 alongside the
pages Google did index. The other 10 were retired on 2026-09-18 and now serve
301s, so they can no longer be checked.

> **This file's headline number has now been wrong twice, in opposite
> directions, and both corrections came from review.**
>
> | Version | Claimed | Error |
> | --- | --- | --- |
> | first | 28 of 60 (47%) | counted 8 combos published days before the window closed |
> | second | 20 of 52 (38%) | dropped 10 retired pages that were live all window |
> | **now** | **30 of 62 (48%)** | — |
>
> The first version was close to right by accident: two errors in opposite
> directions largely cancelled. **Wrong turns 3 and 4** below have the detail.
> The finding has survived both corrections. Its size has moved each time, which
> is the reason the figure is now derived explicitly rather than counted off the
> filesystem.

This started as a look at one page and became structural. Four hypotheses were
tested and discarded on the way, and all four are recorded, because the wrong
turns are the reason what is left can be trusted.

## How this started

§1.2 flagged `roofing frederick md` — **880 searches a month, KD 9**, the
largest geo-modified term in any of these audits. The site has
`/services/roofing/frederick-md`. It said Search Console showed no impressions,
and that this "deserves its own look."

It does, but not for the reason implied. The page is not ranking poorly.

| | |
| --- | --- |
| Coverage state | **Crawled – currently not indexed** |
| Last crawled | **2026-06-01** |
| robots.txt | ALLOWED |
| Fetch | SUCCESSFUL |
| Canonical | self, and Google agrees |

Google fetched the page, found nothing technically wrong, and **chose not to
index it**. Zero impressions is not a symptom to investigate — it is the
arithmetic consequence of not being in the index.

**Correction to §1.2:** it says "no impressions for any Frederick roofing
query". The page has **3** mobile impressions in six months, not zero.

## Wrong turn 1: "it is roofing"

Five of the eight roofing combos came back unindexed, and the first four
non-roofing pages sampled were all indexed. That looked decisive.

**It was selection bias, built into the sample by construction.** Those four
were picked *because they appeared in the impressions report* — and a page with
impressions is necessarily indexed. The control could not have come back any
other way.

Rebuilt: of the 30 zero-impression combos, most are not roofing. There is no
roofing story.

## Wrong turn 2: "the combo template is unindexable"

Also false, and worth stating because it would condemn the architecture. Combo
pages index and earn impressions:

| Page | Impressions | Index state |
| --- | --- | --- |
| `/services/decks/ashburn-va` | 700 | Submitted and indexed |
| `/services/remodeling/winchester-va` | 663 (1 click) | Submitted and indexed |
| `/services/kitchens/alexandria-va` | 341 | Submitted and indexed |
| `/services/basements/great-falls-va` | 218 | Submitted and indexed |

The template works. Thirty-two combos earn impressions.

## Wrong turn 3: counting pages that were days old

The one that changed the numbers. Eight combos are far younger than the rest:

| Added | Commit | Pages |
| --- | --- | --- |
| 2026-09-15 | `15ae01e` | roofing: martinsburg-wv, charles-town-wv |
| 2026-09-15 | `e1e6a5b` | basements: charles-town-wv, inwood-wv, ranson-wv; decks: martinsburg-wv |
| 2026-09-15 | `bcf0f45` | decks: brambleton-va |
| 2026-09-18 | `c8ff33b` | basements: northern-virginia |

The impression window ends **2026-09-17**. These pages had at most two days in
it, and one was published after it closed. Of course they have no impressions,
and of course Google has not fetched them yet — that is the expected state for
a page that age, not evidence of anything.

**They were in the first version's totals anyway.** That inflated the
zero-impression group from 20 to 28 and the denominator from 52 to 60, and
**5 of the 13 "unknown to Google" results used as evidence were these new
pages.** The valid evidence is the other 8.

It also invalidated a specific claim: the first version used
`roofing-martinsburg-wv` (2,213 characters, above median, unindexed) to argue
content volume does not explain the pattern. That page is three days old. The
argument still holds, but on a page that actually earns it —
**`kitchens-burke-va` is 7,631 characters, four times the median, live since
July, and unknown to Google.**

The signal I ignored: when dating the combos, eight returned no add-date from
the search and I moved on instead of asking why. Those eight were exactly the
recent ones.

## Wrong turn 4: counting only the pages that still exist

The correction to the correction, and the one with a name: **survivorship
bias.**

The combo list was built by walking `.next/server/app/services/**` — the pages
that exist *now*. But **#148 retired ten Tier C combos on 2026-09-18**, and the
measurement window ends **2026-09-17**. Those ten were live for the entire
window. `src/lib/retired-combos.ts` records why they were retired: they "had
ZERO mobile Search Console impressions in six months".

So ten pages that were live all window and earned nothing were dropped from the
denominator *because they had since been deleted for earning nothing*. That is
the definition of the bias, and it made the coverage rate look better than it
was.

The Phase 5 baseline already had this right and I did not check it. It counts
"**47** NoVA combo URLs (37 live plus the 10 #148 retired on 2026-09-18)" — the
inventory for a window is what was live during the window, not what survived it.

| | Pages | Zero impressions |
| --- | --- | --- |
| Established and still live | 52 | 20 |
| Retired 2026-09-18, live all window | 10 | **10** |
| **Live during the window** | **62** | **30** |

Published 2026-09-15 or later (8) stay excluded: too new to measure either way.

## What the data shows — now a measurement, not a sample

**Completed 2026-09-18.** The remaining 12 still-live zero-impression combos
were inspected, closing what had been an 8-page sample. **All 12 came back
"URL is unknown to Google", making it 20 of 20 with no exceptions.**

Thirty-seven URLs inspected in total:

| Group | Inspected | Result |
| --- | --- | --- |
| Zero impressions, **still live** | **20 of 20 — complete** | **20 unknown to Google** |
| Zero impressions, retired 2026-09-18 | 0 of 10 | cannot be inspected — now 301s |
| Any impressions | 12 of 32 | 10 indexed; **2 crawled-not-indexed** |
| Added 2026-09-15 or later | 5 of 8 | 5 unknown — expected at that age |

**Every still-live page that earned nothing has never been fetched.** That is no
longer a hypothesis about a sample; for the checkable population it is the
measurement. The ten retired pages cannot be added to it — retiring them
destroyed the evidence.

### A second exception, and the two share a signature

Widening the impression-bearing side turned up a second page that is
crawled-but-not-indexed, and the pair is more interesting than either alone:

| Page | Impressions | Last crawled |
| --- | --- | --- |
| `/services/roofing/frederick-md` | 3 | **2026-06-01** |
| `/services/siding/winchester-va` | 22 | **2026-06-01** |

Both were last crawled on **the same day**, and every one of the 10 indexed
pages inspected was crawled on **2026-07-07 or later** (four on 2026-07-09, then
07-19, 07-28, 08-22, 09-11, 09-16). Twelve of twelve fall on the right side of
that line.

So the shape is not simply "half the pages were never fetched". It is that
**Google crawled in June, made a broader pass from early July, and the pages it
did not return to are the ones that fell out of the index** — having earned a
handful of impressions first, which is why they show up on the impression side
at all.

This is an observation across 12 pages, not an established mechanism. It is
recorded because it is checkable and because it sharpens what to test: if a
requested recrawl restores them, crawl frequency is the lever.

Index state and impressions are therefore **consistent with two exceptions**,
both explained by the same recrawl gap. Six-month impression totals and a
point-in-time inspection are not contemporaneous, so a page can earn
impressions and later fall out.

## What does not explain it

| Candidate cause | Finding |
| --- | --- |
| **Page age** | Ruled out **within the established cohort only** — indexed and unindexed July pages were added in the same commit, 2026-07-06. It is *not* ruled out for the eight recent pages, which is why they are now excluded. |
| **Missing from sitemap** | All present. 178 URLs for 182 built pages. |
| **robots / canonical / fetch** | On the one page Google crawled: ALLOWED, self-canonical accepted, fetch SUCCESSFUL. |
| **Internal linking** | `/services/roofing/frederick-md` has **15 inbound pages against a median of 11**; `basements/great-falls-va` has 4 inbound and earns 218 impressions. The relationship runs backwards. |
| **Content volume** | `kitchens-burke-va` is **7,631 characters, 4× the median**, live since July, and unknown to Google. |
| **Trade** | Ruled out above. |
| **Internal links from crawled pages** | Ruled out in its own section below. Medians differ (4 vs 7) but the ranges overlap almost entirely, and the metric is partly circular. |

## What was looked for and not found: a structural discriminator

**Negative result, recorded because it rules out the obvious remedy.**

The observation table shows indexed combos are mostly referred by *other indexed
combos* — `kitchens/alexandria-va` from `basements/alexandria-va`,
`basements/reston-va` from `basements/frederick-md`, and so on. That suggests a
connected cluster Google crawls, with the unindexed pages stranded outside it.
If true, the fix would be internal linking, which is cheap and entirely in the
repo's control.

It is not true. Counting, for every combo, how many inbound links come from
pages that earned impressions (so pages Google had indexed):

| | n | median | range |
| --- | --- | --- | --- |
| Unindexed combos | 20 | 4.0 | 0–10 |
| Indexed combos | 32 | 7.0 | 1–14 |

A real difference in the medians, and **almost complete overlap**: 8 of 20
indexed pages sit at or below the *unindexed* median, and 3 of 20 unindexed sit
at or above the *indexed* one. One pair settles it —
**`bathrooms/hagerstown-md` has 10 inbound links from crawled pages and is
unknown to Google, while `bathrooms/reston-va` has 2 and is indexed.**

**And the metric is partly circular**, which is the more important caveat.
Combos link to each other, so "inbound from indexed pages" is partly a
restatement of "belongs to the indexed cluster". The direction of causation
cannot be read off it. This is the same shape as the discarded roofing control
in Wrong turn 1, caught this time before it became a conclusion.

So internal linking does not explain the split, on top of content volume, raw
link count, trade, and page age. **Nothing in the repo distinguishes the pages
Google fetched from the ones it did not** — which is itself informative: it
moves the likely cause to Google's side, and it means adding links or copy is
not the lever.

## The hypothesis

**Crawl budget and selection on a low-authority domain.** Google read the
sitemap — it is among the referring URLs for the one combo it crawled — and
fetched part of what was offered. That fits the observations and is the ordinary
behaviour for a small site publishing **62 templated pages in a single commit**
(2026-07-06, the 52 still live plus the 10 later retired).

**What is measured and what is not.** That every still-live page with zero
impressions has never been fetched *is* measured — 20 of 20, no exceptions.
**Why** Google fetched some and not others is not. Crawl budget is the
best-fitting hypothesis for the cause and nothing here confirms it.

## Why it matters

**It reframes the Phase 5 baseline** without changing a number. For the
unindexed share, a zero-impression row is not a statement about demand or
ranking — those pages were never in the running.

**It bears on what the next unit of work should be.** Phases 2 and 3 add pages
and profiles; Phase 4 buys traffic. None of that acts on pages Google has not
fetched. This is a reason to establish the cause before spending, not a mandate
to consolidate.

**It does not invalidate the altitude thesis**, which stands on its own.

## What to do, cheapest first

1. **Request indexing on ~10 unindexed URLs in Search Console**, starting with
   `/services/roofing/frederick-md` (880 searches a month). An owner action in
   the GSC UI; it cannot be done from this repo. **A test, not a fix:** if they
   get crawled, the diagnosis is crawl budget. If they do not, it is a quality
   judgement and the remedy is different. Right now nobody knows which.
2. **Do *not* switch on `autoLastmod`.** The sitemap has no `<lastmod>` and an
   earlier draft recommended adding one before reading
   `next-sitemap.config.js`, which omits it deliberately:

   > *"A deployment timestamp is not a content modification date. Omit lastmod
   > until each content model exposes a reliable authored/updated value."*

   That is correct, and the flag would stamp **all 178 URLs as changed on every
   deploy** — a false freshness signal aimed at the exact resource this
   hypothesis says is scarce. Blog posts carry a real `date` and could emit a
   true one; combo pages have none to emit.
3. ~~Inspect the 12 still-live zero-impression combos that have not been
   checked.~~ **Done 2026-09-18 — all 12 came back unknown to Google**, making
   the still-live population 20 of 20 with no exceptions. The other 10 retired
   on 2026-09-18 and now serve 301s, so their index state is gone for good — a
   reason to measure before retiring pages, not after.
4. **Consolidation is a strategy decision for the owner**, and it should wait on
   1 and 3. #148 retired ten Tier C combos on impression evidence; whether that
   logic extends further depends on a cause that is not yet established.

## What this file does not claim

- **Not** that all 30 zero-impression pages are unindexed. The 20 still live
  were all checked and all are unknown to Google; the other 10 serve 301s and
  can no longer be checked at all, so their state is inferred from their
  zero-impression record, not measured.
- **Not** that internal linking is irrelevant to SEO generally. The claim is
  narrower: it does not distinguish *these* indexed pages from *these*
  unindexed ones, so adding links is not the lever for this problem.
- **Not** that the June/July recrawl pattern is an established mechanism. It
  holds across the 12 impression-bearing pages inspected and is offered as the
  next thing to test, not as the answer.
- **Not** that the template is bad. Thirty-two combos earn impressions.
- **Not** that the cause is established.
- **Not** anything about the eight pages published 2026-09-15 or later. They are
  too new to measure and are excluded from every figure above.
- **Not** a measurement of the whole site. **37 of 178 sitemap URLs** were
  inspected — complete for the still-live zero-impression combos, a sample
  everywhere else. Area pages, pillars and the homepage all sampled as indexed.
