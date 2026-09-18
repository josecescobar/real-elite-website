# Nearly half the service+city pages are not in Google's index — 2026-09-18

**28 of 60 service+city combo pages have zero mobile impressions in six
months. Every one of the 13 sampled is "URL is unknown to Google" — not
ranked badly, not crawled and rejected, but never fetched at all**, despite
sitting in the sitemap since 2026-07-06.

This started as a look at one page and turned into something structural. Two
hypotheses were tested and discarded along the way; both are recorded below,
because the wrong turns are the reason the conclusion is trustworthy.

## How this started

§1.2 flagged `roofing frederick md` — **880 searches a month, KD 9**, the
largest geo-modified term in any of these audits, eight times the biggest
Northern Virginia basement term. The site has `/services/roofing/frederick-md`.
It said Search Console showed no impressions and that this "deserves its own
look."

It does, but not for the reason implied. The page is not ranking poorly.

| | |
| --- | --- |
| Coverage state | **Crawled – currently not indexed** |
| Last crawled | **2026-06-01** (three and a half months ago) |
| robots.txt | ALLOWED |
| Fetch | SUCCESSFUL |
| Canonical | self, and Google agrees |

Google fetched the page, found nothing technically wrong, and **chose not to
index it**. Zero impressions is not a symptom to investigate — it is the
arithmetic consequence of not being in the index. No amount of copy, keyword
or snippet work moves a page Google has not indexed.

**One correction to §1.2 while we are here:** it says "no impressions for any
Frederick roofing query". The page has **3** mobile impressions in six months,
not zero. The distinction does not change the conclusion, but the doc should
say what the data says.

## Wrong turn 1: "it is roofing"

Five of the eight roofing combos came back unindexed, and the first four
non-roofing pages sampled were all indexed. That looked decisive.

**It was selection bias, and the sample was rigged by construction.** Those
four were picked *because they appeared in the impressions report* — and a page
with impressions is necessarily indexed. The control could not have come back
any other way.

Rebuilt properly: of the 28 zero-impression combos, **23 are not roofing**.
Roofing is 5 of 28. There is no roofing story.

## Wrong turn 2: "the combo template is unindexable"

Also wrong, and worth stating because it would condemn the whole architecture.
Combo pages index and earn impressions perfectly well:

| Page | Impressions | Index state |
| --- | --- | --- |
| `/services/decks/ashburn-va` | 700 | Submitted and indexed |
| `/services/remodeling/winchester-va` | 663 (1 click) | Submitted and indexed |
| `/services/kitchens/alexandria-va` | 341 | Submitted and indexed |
| `/services/basements/great-falls-va` | 218 | Submitted and indexed |

The template works. Thirty-two of sixty are in the index.

## What the data actually shows

Nineteen URLs inspected. **Index state and impressions correspond exactly** —
no page with impressions was unindexed, and no page without them was indexed.

| Group | Inspected | Result |
| --- | --- | --- |
| Zero-impression combos | 13 | **13 unknown to Google** |
| Combos with impressions | 6 | 5 indexed, 1 crawled-not-indexed (3 impressions) |

"Unknown to Google" is the important state. It does not mean rejected. It
means **Google has never fetched the URL**.

## What does not explain it

Each of these was checked and eliminated:

| Candidate cause | Finding |
| --- | --- |
| **Page age** | Indexed and unindexed combos were added in the **same commit, 2026-07-06**. Same cohort, same day. |
| **Missing from sitemap** | All 8 roofing combos, and every combo checked, are in `sitemap-0.xml`. 178 URLs for 182 built pages. |
| **robots / canonical / fetch** | On the one page Google did crawl: ALLOWED, self-canonical accepted, fetch SUCCESSFUL. |
| **Internal linking** | `/services/roofing/frederick-md` has **15 inbound pages against a median of 11**. `basements/great-falls-va` has 4 inbound and earns 218 impressions. The relationship runs the wrong way. |
| **Content volume** | Unindexed `roofing-martinsburg-wv` is 2,213 characters, **above** the 1,913 median. Indexed `remodeling-winchester-va` is 1,774, below it. |
| **Trade** | Ruled out above. |

Google read the sitemap — it is listed among the referring URLs for the one
combo it did crawl — and then fetched roughly half of what the sitemap
offered.

## What this most likely is, stated as a hypothesis

**Crawl budget and selection on a low-authority domain.** Google discovered the
sitemap, sampled it, indexed part of a large set of templated pages, and has not
returned. That is the ordinary behaviour for a small site publishing 60
near-patterned pages at once, and it fits every observation here. It is
**not confirmed**, and this file should not be read as if it were.

What would confirm or refute it: whether newly-published pages get crawled
promptly (the Northern Virginia pages shipped this week are a natural
experiment — they are currently "unknown", which is expected at this age), and
whether requesting indexing on a handful of unindexed URLs causes them to be
fetched.

## Why this matters more than the phase it interrupted

**It reframes the Phase 5 baseline.** `phase-5-baseline-2026-09-18.md` records
zero mobile clicks across 23 impression-bearing Northern Virginia URLs and zero
impressions for the rest. That was read as a demand-and-ranking baseline. For
the unindexed share it is neither — those pages were never in the running.

**It changes what the next unit of work should be.** Phases 2 and 3 add pages
and profiles. Phase 4 buys traffic. None of that acts on 28 pages Google has
never fetched. Getting existing pages into the index is cheaper than building
more of them, and it is a prerequisite for reading any of it in December.

**It does not invalidate the altitude thesis.** The regional page argument
stands on its own; this is about whether Google ever sees any of it.

## What to do, cheapest first

1. **Request indexing** on a handful of the highest-value unindexed URLs in
   Search Console — `/services/roofing/frederick-md` first, since it targets
   880 searches a month. This is a GBP-style owner action in the GSC UI; it
   cannot be done from this repo. **Treat it as a test, not a fix:** if
   requested URLs get crawled and indexed, the diagnosis is crawl budget and
   the remedy is consolidation. Ten URLs is enough to learn from.
2. **Do *not* switch on `autoLastmod` — the omission is deliberate.** The
   sitemap has no `<lastmod>`, and an earlier draft of this file recommended
   adding one before reading `next-sitemap.config.js`, which says:

   > *"A deployment timestamp is not a content modification date. Omit lastmod
   > until each content model exposes a reliable authored/updated value."*

   That is correct and the flag would have made things worse: `autoLastmod`
   stamps **every** URL with build time, so all 178 would claim to have changed
   on each deploy. A sitemap that says everything changed yesterday, every day,
   is a false freshness signal on a domain whose crawl allowance is the
   suspected constraint.

   The legitimate version is per-model: **blog posts already carry a real
   `date`** (`src/lib/blog.ts`), so they could emit a true `lastmod` today.
   Combo and area pages have no authored date to emit, which is exactly what
   the config comment anticipated. Worth doing for the models that have real
   dates; not worth faking for the ones that do not, and not a response to this
   finding in any case.
3. **Consider consolidation, not expansion.** Tier C retired ten combos in
   #148 on the grounds that dead pages cost more than they return. This
   finding says the same logic applies more widely: 60 templated pages
   competing for a small crawl allowance may be why half of them are invisible.
   That is a decision for the owner, not a change to make unilaterally, and it
   should wait on the outcome of step 1.

## What this file does not claim

- **Not** that the combo pages are bad, or that the template is wrong. Thirty-two
  are indexed and some earn hundreds of impressions.
- **Not** that the cause is established. Crawl budget is the best-fitting
  hypothesis and no more.
- **Not** that this generalises beyond combo pages. Area pages, service pillars
  and the homepage were all sampled as indexed; blog posts earn the site's
  largest impression numbers.
- **Not** a measurement of the whole site. Nineteen of 178 sitemap URLs were
  inspected.
