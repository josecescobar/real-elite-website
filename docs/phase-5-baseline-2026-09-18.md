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

## Query-level rows, frozen — the part that makes the redirect rule decidable

Added 2026-09-18 after review. **The page-level table above cannot answer the
question Phase 5 asks.** §8 says to 301 a town page if it "loses its queries to
the region", and a page total falling tells you nothing about *which* queries
moved: seasonal demand or an unrelated query mix can drop a town total while
the region gains entirely different terms. Redirecting on that reading would
retire pages that still hold their rankings.

So the query strings themselves are frozen here. December's test is whether
**these specific queries** move, not whether a number went down.

### Tier B basement combos — every mobile query, all trades

30 rows, 177 impressions, 0 clicks. Abridged to queries with ≥4 impressions;
the full set is reproducible with `dimensions: ["page","query"]`,
`device=MOBILE`, 2026-06-15 → 2026-09-15.

| Page | Query | Impr | Pos |
| --- | --- | --- | --- |
| `basements/alexandria-va` | basement finishing alexandria va | 37 | 20.4 |
| `basements/alexandria-va` | basement finishing alexandria va? | 8 | 9.8 |
| `basements/great-falls-va` | basement remodeling great falls va | 20 | 11.6 |
| `basements/great-falls-va` | basement additions great falls va | 19 | 12.7 |
| `basements/great-falls-va` | basement renovations great falls va | 10 | 11.1 |
| `basements/reston-va` | basement finishing in reston va | 13 | 10.7 |
| `basements/reston-va` | basement remodeling in reston va | 4 | 12.8 |
| `basements/reston-va` | basement remodeling reston va | 4 | 17.3 |
| `basements/vienna-va` | basement finishing contractor in vienna va | 13 | 10.6 |
| `basements/vienna-va` | basement finishes vienna va | 7 | 12.0 |
| `basements/vienna-va` | basement renovation vienna va | 7 | 15.9 |
| `basements/vienna-va` | basement remodeling in vienna va | 6 | 17.3 |
| `basements/vienna-va` | high end basement remodel vienna va | 6 | 26.3 |
| `basements/vienna-va` | vienna va basement finishing cost | 5 | 18.2 |
| `basements/frederick-md` | basement finishing frederick | 6 | 13.7 |

**Every one of the 30 queries is town-scoped.** Not one contains "northern
virginia". The transfer hypothesis therefore has a precise form: December
should check whether *these* strings start resolving to
`/services/basements/northern-virginia`. If the region instead earns new
regional queries while the towns keep theirs, both pages are working and
neither should be retired.

### NoVA area pages — every Tier B redirect candidate, complete

§3.3 classifies every NoVA `/service-areas/` overview as Tier B, so each is a
redirect candidate and each needs its own rows for the same reason the combos
do. All queries at ≥3 mobile impressions; the remainder is a 1–2 impression
long tail that cannot carry a redirect decision either way.

**`/service-areas/leesburg-va`** — 381 impressions. County queries marked ▸.

| Query | Impr | Pos |
| --- | --- | --- |
| ▸ exterior contracting services loudoun county va | 73 | 13.5 |
| ▸ home exterior contractor loudoun county va | 65 | 19.2 |
| ▸ exterior contracting company loudoun county va | 50 | 12.5 |
| home remodeling leesburg va | 29 | 22.2 |
| home restoration near me | 22 | 9.8 |
| siding contractor in leesburg | 15 | 28.6 |
| tile contractors leesburg | 14 | 20.5 |
| general contractor leesburg va | 12 | 25.2 |
| interior remodeling leesburg va | 12 | 25.5 |
| ▸ home remodeling loudoun county va | 9 | 34.2 |
| ▸ residential contractors loudoun county | 8 | 37.9 |
| house siding leesburg va | 6 | 37.5 |
| ▸ home remodeling loudoun county | 5 | 34.0 |
| home remodeling leesburg | 4 | 26.8 |
| ▸ remodel contractors loudoun county | 4 | 35.5 |
| ▸ *(nine more county queries at 3 each)* | 27 | 26.3–44.7 |

**`/service-areas/mclean-va`** — 209 impressions.

| Query | Impr | Pos |
| --- | --- | --- |
| renovation and restoration mclean va | 41 | 36.3 |
| renovations mclean va | 37 | 44.9 |
| extensive renovation mclean va | 11 | 46.9 |
| exterior remodeling contractor mclean | 11 | 19.9 |
| remodeling contractor mclean va | 9 | 29.8 |
| contractor in mclean | 8 | 15.6 |
| home remodeling contractor mclean | 8 | 38.0 |
| remodeling company mclean | 8 | 23.4 |
| remodeling contractor mclean | 8 | 30.1 |
| home restoration near me | 7 | 9.1 |
| remodeling companies near me | 7 | 15.4 |
| building envelope mclean va | 6 | 47.2 |
| home remodeling mclean va | 6 | 38.8 |
| interior remodeling mclean va | 5 | 40.0 |
| home remodeling mclean | 4 | 43.8 |
| basement renovation contractors mclean va | 3 | 29.0 |
| luxury remodeling company mclean va | 3 | 34.0 |

**`/service-areas/great-falls-va`** — 106 impressions.

| Query | Impr | Pos |
| --- | --- | --- |
| kitchen remodeling in great falls va | 29 | 39.4 |
| siding contractors great falls va | 8 | 22.9 |
| remodeling contractor great falls va | 7 | 21.1 |
| siding contractor in great falls | 5 | 25.0 |
| bathroom remodeling great falls va | 4 | 36.0 |
| home remodeling great falls va | 4 | 28.5 |
| home siding great falls va | 4 | 24.0 |
| home siding installation great falls va | 4 | 26.0 |
| siding company great falls va | 4 | 21.8 |
| basement remodeling in great falls va | 3 | 18.7 |
| basement remodeling great falls va | 3 | 42.0 |
| exterior trim contractors great falls va | 3 | 14.7 |
| great falls kitchen remodeling contractors | 3 | 30.0 |
| great falls kitchen renovation contractor | 3 | 22.0 |
| siding installation great falls va | 3 | 25.7 |

**`/service-areas/clifton-va`** — 48 impressions. The Tier D page four
retirement redirects from #148 land on, so its rows matter twice.

| Query | Impr | Pos |
| --- | --- | --- |
| basement finishing contractor in clifton va | 11 | 12.3 |
| home remodeling services clifton | 11 | 11.5 |
| remodeling contractor clifton va | 8 | 19.1 |
| kitchen remodeling in clifton va | 7 | 23.3 |
| contractor clifton va | 6 | 9.2 |
| bathroom remodelers clifton va | 3 | 24.7 |

Two things to carry into December. **Great Falls and McLean both hold their own
basement queries at the area level**, separately from their basement combos —
so a redirect decision on either page has to look at both surfaces, not one.
And **`home restoration near me` appears on Leesburg (9.8) and McLean (9.1)**:
non-geographic queries at page-one positions, which is local-pack territory and
not something a page edit moves.

### The finding that was not in the page-level view

`/service-areas/leesburg-va` is not ranking on Leesburg queries. **241 of its
381 impressions — 63% — are Loudoun County queries**, and they outrank its town
queries:

| Query | Impr | Pos |
| --- | --- | --- |
| exterior contracting services loudoun county va | 73 | 13.5 |
| home exterior contractor loudoun county va | 65 | 19.2 |
| exterior contracting company loudoun county va | 50 | 12.5 |
| *(for contrast)* home remodeling leesburg va | 29 | 22.2 |

That is regional-altitude demand already present in the data, and §2's thesis
is visible in it — **but at county altitude, not at "northern virginia"
altitude.** "Northern virginia" returns zero mobile impressions while "loudoun
county va" pulls 241 at positions 12–19. If December finds the regional page
still flat, this is the first place to look before concluding that regional
altitude failed: the altitude may be right and the *place name* wrong.

Recorded as an observation, not a recommendation. Acting on it would mean a
county-level page, which is a decision for the owner and not a conclusion this
baseline is entitled to draw from one quarter of data.

## What this says about where the constraint actually is

Nothing on this site ranks better than **position 12.3** on any *page* carrying
real mobile volume, and page-level averages hide better positions inside them.
The ten highest-impression zero-click pages:

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

**This is evidence for the "do not fund a CTR/snippet project" call, not
against it.** Position 12 is the top of page two and positions 20–38 are pages
three and four. Click-through there is near zero no matter how good the title
tag is. The constraint is position, and position is won by relevance and links,
not by wording.

### Correcting this file's own first draft

The version of this document opened for review said Hedgesville was "the one
page where a snippet argument could be made honestly — 228 impressions at
12.3, genuinely on the page-one boundary." **The query rows disprove that, and
they are the reason the rows are now here.**

96% of Hedgesville's impressions — 215 of 223 — are plumbing-stoppage queries:
`vanity stoppage hedgesville wv` (99 impressions, position 10.3), `pop repair
service hedgesville wv` (95, position 7.0), `vanity blockage`, `bathtub
stoppage`. Real Elite does not do drain work. The page ranks well for demand
the business cannot serve, and 8 impressions remain for anything it can. A
snippet improvement there would convert nothing.

The page that actually holds page-one positions on real service demand is
**`/service-areas/inwood-wv`** — ten queries at position 11.1 or better,
162 impressions, all of them roofing, siding or basement terms in the home
market: `house siding inwood wv` (5.1), `basement remodeling inwood wv` (5.4),
`siding contractor inwood wv` (6.3), `siding company inwood wv` (7.5),
`roofing contractor inwood wv` (9.7).

That is a real position, in the home market, on services the business sells,
and it takes zero clicks. It is the one place on this site where the
click-through question is worth asking at all — and it is worth asking as
"why does a position-5 result get no clicks", which is a different question
from snippet wording and may be the local pack sitting above it.

## What December should compare

1. **Do any "northern virginia" queries appear at all?** From zero, any
   non-zero is signal. If still zero, the regional altitude thesis failed on
   its own terms and §2 should be reread rather than the page expanded.
2. **Did the NoVA town pages lose THEIR QUERIES to the region?** Compare the
   frozen query strings above, page by page — not the page totals. 301 a town
   page only when the same queries it held now resolve to the regional page. A
   total that fell while the region gained *different* queries is not transfer;
   it is two pages serving different demand, and both should stay.
3. **Did the Fairfax query follow the region?** If yes, no Fairfax page is
   needed. If no, build it.
4. **Did anything reach page one?** Site-wide mobile CTR of 0.14% is a
   position story. If nothing crossed position 10 by December, the honest
   conclusion is that content at any altitude is not the lever, and Phase 3
   (directories) and Phase 4 (paid) carry more weight than another page.
5. **Compare RAW lead events, not key events.** `generate_lead` and
   `phone_click` are already queryable as ordinary events and do not need the
   key-event flag to be counted — see the note below, which corrects an error
   in this file's first draft.

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

### Correcting this file's own first draft, again

The version opened for review said Phase 5 "cannot compare leads until
`generate_lead` and `phone_click` are marked as key events." **That is wrong,
and wrong in a way that would have damaged the December read.**

**Raw events are readable now.** `ga4-conversion-tracking.md` already reports
raw counts for the 90 days to 2026-09-16 — `generate_lead` 3, `phone_click` 2,
`form_submit` 3 — pulled without any key-event flag. The flag controls what
GA4's *conversion reporting* counts, not whether the event exists.

**And comparing key events across December would manufacture a result.**
Marking a key event is not retroactive, as that same document says. If the
owner flips the switch in October and December compares key events, the
baseline window is zero **by construction** and the comparison shows a rise
from nothing that is purely an artefact of when a checkbox was ticked.

So December compares **raw `generate_lead` and `phone_click` counts over both
windows**, and the key-event flag is irrelevant to the comparison. It still
matters for everything else — the owner's own dashboard, Google Ads
optimisation, and anyone reading GA4 without this document beside them — which
is why it stays on the list. But it does not gate Phase 5.

**BOTH lead series have an instrumentation discontinuity. Neither is clean.**

- `phone_click` — 34 of the site's 41 phone links fired nothing until
  2026-09-16, so any earlier figure is a floor rather than a count and a rise
  across that date measures the fix rather than demand.
- `generate_lead` — `trackLead()` and all three of its production call sites
  (`MultiStepEstimateForm`, `RoofQuoteTool`, `LuxuryConsultationForm`) were
  introduced on **2026-07-06** in #63, verified with `git log -S`. The GA4
  document's raw-count window opens 2026-06-19, so **its first 17 days could
  not emit this event at all**. The count of 3 covers roughly 73 instrumented
  days, not 90.

So December must either use windows that both start after 2026-07-06, or state
the uninstrumented days explicitly. Comparing that 3 against a fully
instrumented 90-day December window manufactures an increase the same way a
key-event comparison would.

*(Recorded because the version of this file opened for review asserted
`generate_lead` "has no such discontinuity and is the honest series". That was
wrong, and wrong in a familiar way: the phone discontinuity was corrected and
the parallel case beside it was asserted clean without being checked.)*

One further note for December, recorded now so it is not mistaken for a later
discovery: organic sessions were **41 in the 48 days to 2026-09-17, against 62
in the preceding 48 days** — a 34% fall. On numbers this small that is not a
trend, and it predates every page shipped this week. It is logged as a
starting condition, not a result.
