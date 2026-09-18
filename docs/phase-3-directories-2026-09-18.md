# Phase 3 — directories, checked against live SERPs and against the repo

§8 Phase 3 says: *"Directory profiles: Angi, Houzz, Yelp, BuildZoom, Thumbtack
(the repo already has a Thumbtack webhook). A third of the NoVA organic field
is directories; being listed in them is cheaper than outranking them."*

The reasoning holds. The list was checked before any profile work starts,
because a profile costs owner hours.

**Two things this file got wrong in its first draft, both corrected below:** it
treated single SERP snapshots as stable, and it said the repo could not tell us
which profiles already exist. The repo can, and does.

## The SERP is volatile enough that one snapshot proves little

`basement remodeling northern virginia`, three snapshots on 2026-09-18 — §1.3's
and two of mine taken minutes apart:

| | Relevant organic rows | Overlap with the other pull |
| --- | --- | --- |
| pull A | 10 | 8 |
| pull B | 9 | 8 |

Between two pulls **minutes apart**, `facebook.com` and `michaelandson.com`
dropped out and `mossbuildinganddesign.com` appeared. Across all three
snapshots of this one query:

| Directory | Snapshots seen in |
| --- | --- |
| `yelp.com` | **3 of 3** |
| `bestpickreports.com` | **3 of 3** |
| `facebook.com` | 2 of 3 |
| `angi.com` | 1 of 3 — §1.3's only |

**So Angi *has* been recorded in a Northern Virginia SERP**, and an earlier
version of this file said it appeared "home market only". That was a
single-snapshot artefact. Directory *count* held steady at 2 of 9–10 across
both of my pulls, so the share is more stable than the membership — but neither
is stable enough to rank directories from one look.

Everything below is therefore reported as **observed in at least one snapshot**,
not as what does or does not rank.

## What was observed, across seven snapshots of five queries

Five queries at depth 20, one re-pull of one of them at depth 30, and §1.3's
earlier snapshot of that same query — **seven snapshots, five distinct
queries**. §1.3's is counted here because it records a full organic field
(ranks 4–20), so it is a look in which an absent domain could have appeared.
Two further queries failed upstream and are not reported; I did not retry
selectively.

| Domain | Queries seen in | Where |
| --- | --- | --- |
| `yelp.com` | 5 of 5 | both markets, every query, every snapshot |
| `bestpickreports.com` | 2 of 5 | Northern Virginia |
| `bbb.org` | 2 of 5 | home market |
| `houzz.com` | 2 of 5 | home market |
| `angi.com` | 1 of 5 + §1.3's NoVA record | both |
| `homeadvisor.com` | 1 of 5 | home market |
| `gaf.com` | 1 of 5 | home market, roofing |
| `downtobid.com` | 1 of 5 | home market, commercial bids |
| `buildzoom.com` | **0** | not observed |
| `thumbtack.com` | **0** | not observed |

**Yelp is the only robust result here.** It appeared in every query and every
snapshot. Everything else is a weaker observation, and the two zeroes are
absence of evidence across seven looks rather than proof of absence.

An earlier version of this file compared directory share between Northern
Virginia and the home market and concluded the home market ran higher. **That
comparison rested on one snapshot per query and is withdrawn** — the volatility
above is the same size as the difference it claimed to find.

## What the repo already knows, which matters more

`src/lib/constants.ts` answers most of the "does a profile exist" question that
the first draft of this file said it could not:

| Platform | State in the repo |
| --- | --- |
| **Yelp** | URL present — `yelp.com/biz/real-elite-contracting` — but **unverified**: the comment records that Yelp returns 403 to automated checks and says to verify manually in a browser before linking it from the footer |
| **Thumbtack** | profile was listed, **returned 404**, and was removed to avoid a broken `sameAs` reference |
| **LinkedIn** | same — listed, 404, removed |
| **BBB** | a trust badge labelled **"BBB Accredited"**, `href: null`. The comment defines null as *"not yet verified"* — which does not distinguish "no listing" from "listing exists, unchecked" |
| **Angi** | a trust badge labelled **"Angi Certified"**, `href: null`, same meaning |
| Facebook, Instagram, Google | live URLs, in `sameAs` |

Two consequences.

**The Thumbtack case is settled on repo evidence, not SERP evidence.** It is on
the Phase 3 list because the repo has a Thumbtack *webhook*. The repo also
records that the Thumbtack *profile* 404'd and was removed. Integration is not
a profile, and neither is evidence of demand.

**BBB and Angi have UI waiting — but it is not waiting for a profile.** An
earlier version of this file read the two null badges as "no listing exists,
so create one". That is wrong twice over, and the second way is the one that
matters.

*First*, `null` does not mean "no listing". The comment defines it as **"not
yet verified"** — the same state as Yelp's, and it carries the same
duplicate-listing risk. BBB and Angi are verify-or-create, exactly as Yelp is.

*Second, and more seriously:* the badges read **"BBB Accredited"** and **"Angi
Certified"**. Those are **credentials, not profiles**. BBB Accreditation is a
paid, vetted status; Angi Certified requires Angi's background and licence
screening. A free listing on either platform earns neither. So filling in an
`href` on the strength of a basic profile would publish a trust badge
asserting a credential the business may not hold — in front of a homeowner,
which is the failure mode `CLAUDE.md` reserves the owner's confirmation for.

**The badge `href` is therefore not the goal of a Phase 3 item.** It is
downstream of the owner confirming the credential itself, and it stays `null`
until then regardless of whether a profile exists.

### The unverified Yelp URL was already being asserted sitewide

Found while checking the above, and **fixed in this PR** — it is the one live
site change here.

The comment above `BUSINESS.social` says the 404'd LinkedIn and Thumbtack URLs
were removed *"to avoid ... broken `sameAs` references in JSON-LD"*, and then
keeps Yelp as an explicit exception, telling the reader to verify it manually
*"before linking it from the footer"*.

But the footer was not the only consumer. `src/app/layout.tsx` put
`BUSINESS.social.yelp` straight into the sitewide LocalBusiness `sameAs` array
— so the one URL the comment flags as unconfirmed was making a machine-readable
ownership claim on all 182 pages. The guard was written for the footer and the
value leaked past it into structured data.

`sameAs` is not a link. It tells Google *this business owns this profile*. If
that Yelp page turns out to belong to someone else, the site has been asserting
a false external identity — which is precisely the outcome the LinkedIn and
Thumbtack removals were meant to prevent, so the policy was right and only its
enforcement was incomplete.

The fix applies the repo's own policy consistently: a new
`VERIFIED_PROFILE_URLS` export holds the confirmed subset, `sameAs` reads from
it, and Yelp is absent until someone confirms it. A test in
`constants.test.ts` fails if it reappears.

**Corrected after review:** an earlier version of this paragraph said verifying
Yelp was "a one-line edit that lights up the footer link and the `sameAs` entry
together." That was **false when written**. `Footer.tsx` built its social links
from a separate hard-coded array and never consulted `VERIFIED_PROFILE_URLS`,
so the one edit would have changed the JSON-LD and left the footer untouched —
a maintainer following that instruction would have believed they were done.

`Footer.tsx` now filters on the same list, which makes *removal* symmetric:
dropping a URL from `VERIFIED_PROFILE_URLS` withdraws it from the footer and
`sameAs` at once. **Addition is still two edits** — the URL, plus a
`SOCIAL_LINKS` entry carrying an icon, because a bare URL has nothing to
render. That is stated in both files rather than smoothed over.

## One ranked item, then an unordered set

**Yelp first, and it is the only ranked item.** It is the one directory
observed in all five queries and every snapshot, and the repo already holds a
URL for it. The action is **verify, not create**: open
`yelp.com/biz/real-elite-contracting` in a browser. If it is Real Elite's,
claim it, then add the URL to `VERIFIED_PROFILE_URLS` (which enables the
`sameAs` assertion) and add a `SOCIAL_LINKS` entry with a Yelp icon in
`Footer.tsx` (which is what puts it in the footer) — two edits, not one. If it
is not Real Elite's, creation is the action, and a duplicate has been avoided.

**Everything after Yelp is deliberately unordered.** An earlier version of this
file numbered them 2–7. That numbering implied a ranking the evidence does not
support: it put BBB (two home-market queries) above BestPickReports, which was
in **every Northern Virginia snapshot** — the target market — purely because
BBB had a badge placeholder that, as established above, is not a Phase 3
deliverable at all. Having withdrawn the market comparison, there is no basis
left for ordering two-of-five observations against each other.

So here are the facts beside each, and the owner orders them on grounds this
file does not have:

| Candidate | Observed | Notes |
| --- | --- | --- |
| **BBB** | 2 of 5, home market | assume an unclaimed listing already exists — check first. **Accreditation is a separate, paid step**; the badge stays `null` until the owner confirms the business holds it |
| **Houzz** | 2 of 5, home market | photo-led; pairs with the job photos Phase 2.2 already needs |
| **BestPickReports** | 2 of 5, **and in all three NoVA snapshots** | the only directory besides Yelp in the target market. Entry requirements unknown; presents as vetted/paid |
| **Angi** | 1 of 5 + §1.3's NoVA record | also auto-creates unclaimed listings — check first. **"Angi Certified" is a screening status, not a signup**; the badge waits on it |
| **HomeAdvisor** | 1 of 5, home market | same parent as Angi — one decision, not two |
| **GAF locator** | 1 of 5, home market, roofing | a manufacturer listing, not a directory. If the certification is already held, it may be free and unclaimed |

**BuildZoom: not observed, no repo signal, no action.**
**Thumbtack: the profile 404'd. Nothing to prioritise until one exists.**

**What would order this set** is cost, eligibility, or conversion — none of
which this file measured. A single phone call establishing which of them are
free and which the business already qualifies for would rank them better than
any amount of further SERP pulling.

**One thing does apply to Yelp, BBB and Angi alike: look before creating.** All
three carry a repo state meaning "unverified", and all three platforms generate
unclaimed listings without the business asking. Claiming is cheaper than
creating and cannot produce a duplicate.

## What this still does not tell you

- Whether a listing converts. Ranking in the organic field means the
  *directory* gets the click; being inside it is a second-order bet nobody here
  has measured.
- Anything about the local pack, which is a different surface — §5's subject.

## What has not been done, and why

**No profiles were created, claimed or edited**, no Yelp URL was linked in the
footer, and neither null badge `href` was filled in. All of those write to
outward-facing assets or depend on a manual verification `CLAUDE.md` reserves
for the owner — and in the badges' case on a credential only the owner can
confirm the business holds.

**Two live site changes were made:** removing the unverified Yelp URL from the
LocalBusiness `sameAs`, and gating the footer's social links on the same
verified list. Both are repo-owned, and both *withdraw* or constrain an
unconfirmed assertion rather than adding one, so neither needed the owner
first. Restoring Yelp is the two-edit path described above, the moment the
profile is confirmed.
