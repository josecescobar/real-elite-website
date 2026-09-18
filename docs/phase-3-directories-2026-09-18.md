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

## Revised order

1. **Yelp — verify, do not create.** A profile URL already exists in the repo,
   unverified because Yelp blocks bots. Open it in a browser. If it is Real
   Elite's, claim it and the footer link can be enabled; if it is not, that is
   when creation is the action. Creating one without checking risks a duplicate
   listing.
2. **BBB — check for an existing listing first, same as Yelp.** Observed in two
   home-market queries. Most BBB listings exist unclaimed before a business
   ever visits, so assume one may already be there. **Accreditation is a
   separate, paid step**, and the badge stays `null` until the owner confirms
   the business actually holds it.
3. **Angi — same: check, then decide.** Observed in the home market and in
   §1.3's NoVA record. Angi also auto-creates unclaimed listings. **"Angi
   Certified" is a screening status, not a signup**, and the badge waits on it.
4. **Houzz** — two home-market queries, both visual trades. Pairs with the job
   photos Phase 2.2 already needs.
5. **HomeAdvisor** — same parent as Angi; treat as one decision with it.
6. **BestPickReports** — the one directory in every Northern Virginia snapshot
   besides Yelp. Entry requirements unknown; it presents as vetted/paid.
7. **GAF certified-installer locator** — a manufacturer listing rather than a
   directory. If the certification is held, the listing may be free and
   unclaimed.

**BuildZoom: not observed, no repo signal, no action.**
**Thumbtack: the profile 404'd. Nothing to prioritise until one exists.**

**The first action on the first three is the same action: look before
creating.** Yelp, BBB and Angi all carry a repo state that means "unverified",
and all three platforms generate unclaimed listings without the business
asking. Claiming one is cheaper than creating one and cannot produce a
duplicate.

## What this still does not tell you

- Whether a listing converts. Ranking in the organic field means the
  *directory* gets the click; being inside it is a second-order bet nobody here
  has measured.
- Anything about the local pack, which is a different surface — §5's subject.

## What has not been done, and why

**No profiles were created, claimed or edited**, and no repo change was made to
link the Yelp URL or to fill in either null badge `href`. All of those write to
outward-facing assets or depend on a manual verification `CLAUDE.md` reserves
for the owner — and in the badges' case on a credential only the owner can
confirm the business holds.
