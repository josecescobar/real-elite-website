# Google Business Profile service-area rebalance — 2026-09-17

**Location:** `locations/16598215479155730871` · Real Elite Contracting LLC
**Business type:** `CUSTOMER_LOCATION_ONLY` — the listing has no street address
(`location_address_locality` and `location_address_administrative_area` both
read null), so it ranks from its pin and its service area, not a storefront.

## Why

The listing was in the local 3-pack at **0 of 25 grid points** for both roof
replacement and decks around Martinsburg. The service area is part of why.

Before this change it held 19 places: **15 Virginia, 1 Maryland, 3 West
Virginia.** Eighty percent of the declared service area was Northern Virginia,
and **Berkeley County — the county the business actually operates from — was
not on the list at all.** Meanwhile the site publishes pages for nine WV towns.

This mirrors the original audit finding almost exactly: 62 Virginia pages
against 0 West Virginia pages. The site side of that has been fixed. The
profile side had not been.

## What changed

Three places removed, all deep in Fairfax County — 45 to 60 miles from the pin,
in the most competitive contractor market in the country, and ranking nowhere:

| Removed | Place ID |
| --- | --- |
| McLean, VA, USA | `ChIJO3mKsew1tokR8er6rV66Yo4` |
| Great Falls, VA, USA | `ChIJ9QnXtls4tokR9-EM9edwJss` |
| Vienna, VA 22180, USA | `ChIJ72pWHGdJtokRujYQV7AMwS8` |

19 → **16 places**, verified live after the write. Four slots free of Google's
20-place cap.

The Loudoun cluster was deliberately kept whole — Loudoun County, Ashburn,
Brambleton, Broadlands, Leesburg, Purcellville, Aldie, South Riding,
Middleburg. Decks are the only luxury line holding top-10 positions there, and
that is a real position worth defending.

## What this does not do

Removing a place does not decline work there. A service area is a ranking and
display signal, not a fence — the listing ranks from its pin, and a sprawling
area dilutes that signal rather than extending it. Two of the six reviews on
the profile come from **Springfield, VA**, which was never in the service area
at all. The eastern work arrived without the listing claiming the territory.

## Still to add — needs the Google UI

Four slots remain. These could not be filled from here: the API takes a Google
**place ID** per place, region place IDs cannot be resolved in this
environment, and a guessed ID would write a wrong region to a live listing with
nothing to show it was wrong. The Business Profile editor resolves names by
autocomplete, so this takes about a minute:

**Profile → Edit profile → Service area → Add area**, in priority order:

1. **Berkeley County, WV** — the one that matters. The home county, currently
   absent. One slot covers Martinsburg, Inwood, Hedgesville, Spring Mills and
   Falling Waters, all of which have their own pages on the site.
2. **Hagerstown, MD** — the Maryland leg of the Eastern Panhandle market, 20
   minutes out. Frederick, the only MD place listed, is more than twice as far.
3. **Berkeley Springs, WV** — Morgan County, not covered by either county entry.
4. **Ranson, WV** — carries the site's best commercial position (basement
   queries at 3.2). Inside Jefferson County, but naming the town adds the exact
   string people search.

Berkeley County and Jefferson County do most of the work between them; the town
entries reinforce rather than extend.

## Restore

To put the three back, re-run `update_service_area` with
`business_type: CUSTOMER_LOCATION_ONLY` and the 16 current places plus the
three rows in the table above. The action replaces the whole list every time,
so a restore must resend everything, not just the difference.

## What to watch

Re-run the Martinsburg rank grid in about a month. If the 3-pack dead zone has
not moved, the constraint is the review topic mix — the profile's derived
topics still read `deck (4)`, `wood (2)`, `deck replacement (2)`, with no
roofing signal at all. See `docs/roofing-review-request.md`.
