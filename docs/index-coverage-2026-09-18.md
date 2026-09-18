# A large minority of service+city pages are not in Google's index — 2026-09-18

**20 of the 52 service+city combo pages that were live for the measurement
window have zero mobile impressions. All 8 of those inspected are "URL is
unknown to Google" — not ranked badly, not crawled and rejected, but never
fetched**, though they have been in the sitemap since 2026-07-06 alongside the
pages Google did index.

> **Corrected 2026-09-18, after review, and the headline numbers changed.** The
> first version of this file said "28 of 60" and "13 of 13". Both were inflated
> by a cohort error: **8 combos were added between 2026-09-15 and 2026-09-18**,
> one to three days before the impression window closed or after it, and
> counting them as part of the July cohort made the problem look larger than it
> is. The corrected figures are above. **Wrong turn 3** below has the detail.
> The finding survives the correction; its size and its evidence base do not.

This started as a look at one page and became structural. Three hypotheses were
tested and discarded on the way, and all three are recorded, because the wrong
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

Rebuilt: of the 20 established zero-impression combos, most are not roofing.
There is no roofing story.

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

## What the data shows, scoped to what was inspected

Nineteen URLs inspected: **8 of the 20 established zero-impression combos**, 6
of the 32 impression-bearing ones, and 5 of the new pages.

| Group | Inspected | Result |
| --- | --- | --- |
| Established, zero impressions | 8 of 20 | **8 unknown to Google** |
| Any impressions | 6 of 32 | 5 indexed; 1 crawled-not-indexed |
| Added 2026-09-15 or later | 5 of 8 | 5 unknown — expected at that age |

Index state and impressions are **consistent with one exception**, not exact:
`/services/roofing/frederick-md` has 3 impressions and is currently
crawled-not-indexed. Six-month impression totals and a point-in-time inspection
are not contemporaneous measurements, so a page can have earned impressions
before falling out of the index. The first version of this file claimed exact
correspondence while printing the counterexample in its own table.

**This does not establish that all 20 are unindexed.** Eight were checked.

## What does not explain it

| Candidate cause | Finding |
| --- | --- |
| **Page age** | Ruled out **within the established cohort only** — indexed and unindexed July pages were added in the same commit, 2026-07-06. It is *not* ruled out for the eight recent pages, which is why they are now excluded. |
| **Missing from sitemap** | All present. 178 URLs for 182 built pages. |
| **robots / canonical / fetch** | On the one page Google crawled: ALLOWED, self-canonical accepted, fetch SUCCESSFUL. |
| **Internal linking** | `/services/roofing/frederick-md` has **15 inbound pages against a median of 11**; `basements/great-falls-va` has 4 inbound and earns 218 impressions. The relationship runs backwards. |
| **Content volume** | `kitchens-burke-va` is **7,631 characters, 4× the median**, live since July, and unknown to Google. |
| **Trade** | Ruled out above. |

## The hypothesis

**Crawl budget and selection on a low-authority domain.** Google read the
sitemap — it is among the referring URLs for the one combo it crawled — and
fetched part of what was offered. That fits the observations and is the ordinary
behaviour for a small site publishing 52 templated pages at once.

**It is not confirmed.** With 8 established pages inspected, it is a hypothesis
supported by a consistent sample, not a measured property of the site.

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
3. **Inspect the remaining 12 established zero-impression combos** before any
   consolidation decision rests on this. It is cheap and it would turn a
   consistent 8-page sample into a measured figure.
4. **Consolidation is a strategy decision for the owner**, and it should wait on
   1 and 3. #148 retired ten Tier C combos on impression evidence; whether that
   logic extends further depends on a cause that is not yet established.

## What this file does not claim

- **Not** that all 20 established zero-impression pages are unindexed. Eight were
  checked.
- **Not** that the template is bad. Thirty-two combos earn impressions.
- **Not** that the cause is established.
- **Not** anything about the eight pages published 2026-09-15 or later. They are
  too new to measure and are excluded from every figure above.
- **Not** a measurement of the whole site. 19 of 178 sitemap URLs were inspected;
  area pages, pillars and the homepage all sampled as indexed.
