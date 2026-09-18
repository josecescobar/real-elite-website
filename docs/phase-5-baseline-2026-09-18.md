# Phase 5 baseline — mobile Search Console, frozen 2026-09-18

The §8 Phase 5 read is scheduled for **2026-12-15**. This file is the "before"
it compares against, captured the day the Northern Virginia work shipped
(#146, #147, #148, #149). Numbers here are frozen deliberately — do not update
them in place. December's read goes in a new dated file.

## Method, and why it is mobile-only

`device = MOBILE`, 2026-06-15 → 2026-09-15, Search Console web search.

Desktop is excluded on the owner's instruction and the reason holds: 79% of
this property's impressions are not people. Every figure below is therefore
smaller than the Search Console UI shows by default, and that is the point —
these are the numbers that can move a phone call.

Caveats that matter when reading this again in December:
- Search Console lags ~3 days; the window ends 2026-09-15 for that reason.
- Absolute numbers are small. A swing of ±20 impressions on one page is noise.
- Position is an average across impressions, so a page that ranks 8 for one
  query and 40 for another reports something in between that it never held.

## The headline

**5 mobile clicks in three months, site-wide, against 3,667 impressions —
a 0.14% CTR.**

Both clicking pages are Eastern Panhandle blog articles:

| Page | Clicks | Impressions | Position |
| --- | --- | --- | --- |
| `/blog/asphalt-vs-concrete-vs-tar-and-chip-driveways-…` | 4 | 179 | 13.5 |
| `/blog/roof-replacement-cost-eastern-panhandle-2026` | 1 | 54 | 23.7 |

Everything else on the site took **zero mobile clicks**.

## Northern Virginia, which is what Phase 5 is actually testing

| Segment | Pages | Impressions | Clicks |
| --- | --- | --- | --- |
| NoVA service+city combos | 19 | 461 | **0** |
| — of which basements | 5 | 177 | **0** |
| NoVA area pages (Leesburg, McLean, Great Falls, Clifton) | 4 | 744 | **0** |
| **All Northern Virginia** | **23** | **1,205** | **0** |

And the number the regional page is being measured on:

> **Queries containing "northern virginia": 0 mobile impressions.**
> Not a low number. Zero rows returned.

That is a clean baseline. `/services/basements/northern-virginia` went live
with nothing to beat, so any mobile impression it earns by December is
attributable to it and not to a pre-existing position.

### Per-page, for the pages Phase 5 asks about

§8 Phase 5 asks whether the Tier B town pages lose their queries to the region
(then 301 them) or keep them (then leave them). These are the positions they
held the day the region shipped:

| Page | Impressions | Position |
| --- | --- | --- |
| `/services/basements/alexandria-va` | 52 | 20.5 |
| `/services/basements/great-falls-va` | 51 | 12.0 |
| `/services/basements/vienna-va` | 50 | 16.4 |
| `/services/basements/reston-va` | 21 | 12.3 |
| `/services/basements/mclean-va` | 3 | 24.0 |
| `/service-areas/leesburg-va` | 381 | 20.9 |
| `/service-areas/mclean-va` | 209 | 34.5 |
| `/service-areas/great-falls-va` | 106 | 29.5 |
| `/service-areas/clifton-va` | 48 | 15.2 |

Clifton is the Tier D page four retirement redirects depend on. Its 48
impressions at 15.2 are why it was kept, and a test pins it.

## What this says about where the constraint actually is

Nothing on this site ranks better than **position 12.3** on any page carrying
real mobile volume. The ten highest-impression zero-click pages:

| Position | Impressions | Page |
| --- | --- | --- |
| 12.3 | 228 | `/service-areas/hedgesville-wv` |
| 20.7 | 586 | `/service-areas/inwood-wv` |
| 20.9 | 381 | `/service-areas/leesburg-va` |
| 22.4 | 173 | `/storm-damage` |
| 24.8 | 111 | `/paving` |
| 29.5 | 106 | `/service-areas/great-falls-va` |
| 30.2 | 110 | `/services/siding` |
| 34.5 | 209 | `/service-areas/mclean-va` |
| 37.5 | 368 | `/service-areas/frederick-md` |
| 38.7 | 139 | `/service-areas/winchester-va` |

**This is evidence for the owner's "do not fund a CTR/snippet project" call,
not against it.** Position 12 is the top of page two, and positions 20–38 are
pages three and four. Click-through at those positions is near zero no matter
how good the title tag is, because almost nobody scrolls that far. Rewriting
snippets across these pages would be work with a mathematical ceiling of
roughly nothing. The constraint is position, and position is won by relevance
and links, not by wording.

The one page where a snippet argument could be made honestly is
`/service-areas/hedgesville-wv` — 228 impressions at 12.3, genuinely on the
page-one boundary. That is one page, not a project.

## What December should compare

1. **Do any "northern virginia" queries appear at all?** From zero, any
   non-zero is signal. If still zero, the regional altitude thesis failed on
   its own terms and §2 should be reread rather than the page expanded.
2. **Did the NoVA town pages lose impressions to the region?** If the region
   gains and the towns fall, 301 the towns (§8 Phase 5). If both hold, leave
   them.
3. **Did the Fairfax query follow the region?** If yes, no Fairfax page is
   needed. If no, build it.
4. **Did anything reach page one?** Site-wide mobile CTR of 0.14% is a
   position story. If nothing crossed position 10 by December, the honest
   conclusion is that content at any altitude is not the lever, and Phase 3
   (directories) and Phase 4 (paid) carry more weight than another page.
5. **Are conversions readable yet?** See the note below — as of today they are
   not, and every comparison above is impressions-only for that reason.

## The measurement caveat that undercuts all of this

`docs/ga4-conversion-tracking.md` records that GA4 counts none of this site's
leads. Re-verified today, 2026-09-18, and it is unchanged:

- The three configured key events remain `purchase`, `close_convert_lead` and
  `qualify_lead`. The site fires none of them.
- **Key events = 0 across the property's entire lifetime**, 2026-03-25 →
  2026-09-17, all channels — not merely across the 90-day window measured on
  2026-09-17. There has never been a counted conversion.
- GA4 is otherwise healthy and receiving data: 41 organic sessions and 32
  users in the 48 days to 2026-09-17, 56% engagement rate, one web stream,
  zero configuration issues reported. The tag works. Only the key-event
  mapping is wrong.

So Phase 5 can compare impressions and positions, and cannot compare leads,
until `generate_lead` and `phone_click` are marked as key events. That fix is
two minutes in the GA4 admin UI and only the owner can do it.

One further note for December, recorded now so it is not mistaken for a later
discovery: organic sessions were **41 in the 48 days to 2026-09-17, against 62
in the preceding 48 days** — a 34% fall. On numbers this small that is not a
trend, and it predates every page shipped this week. It is logged as a
starting condition, not a result.
