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

> **Added 2026-09-18, after this baseline was frozen — read the zero-impression
> rows differently.** `docs/index-coverage-2026-09-18.md` finds that **30 of the
> 62 service+city combo pages live for this window have zero impressions, and
> of the 20 still live, all 20 are *"URL is unknown to Google"*** — never
> fetched; the other 10 were retired and can no longer be checked.
> (That figure was corrected twice: first for counting 8 combos published days
> before this window closed, then for dropping the 10 combos #148 retired on
> 2026-09-18 — which this file already counted, and which were live throughout.)
>
> So a zero-impression row below is, for the unindexed share, **not a statement
> about demand or about ranking.** Those pages were never in the running. The
> figures here are unchanged and still the frozen "before"; what changes is
> what a zero is allowed to mean. December should read the indexed pages as a
> performance comparison and the unindexed ones as a coverage problem that may
> or may not have been fixed by then.

## Northern Virginia, which is what Phase 5 is actually testing

**These 23 are the Northern Virginia URLs that returned any mobile impression,
not the inventory.** During this window the catalog held **14** NoVA area URLs
and **47** NoVA combo URLs (37 live plus the 10 #148 retired on 2026-09-18) —
about 61 in all. The ~38 absent from this table returned **zero mobile
impressions**, which is their baseline: any of them appearing in December is a
change from nothing, exactly like the regional page.

| Segment | Pages with impressions | Impressions | Clicks |
| --- | --- | --- | --- |
| NoVA service+city combos | 19 of 47 | 461 | **0** |
| — of which basements | 5 | 177 | **0** |
| NoVA area pages (Leesburg, McLean, Great Falls, Clifton) | 4 of 14 | 744 | **0** |
| **All impression-bearing NoVA URLs** | **23 of ~61** | **1,205** | **0** |

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

### Tier B basement combos — the complete NoVA set

**26 rows, 177 impressions, 0 clicks — complete, not abridged.** Every query
Search Console returns for these five pages is here. `device=MOBILE`,
2026-06-15 → 2026-09-15.

`/services/basements/frederick-md` is deliberately **absent**: Frederick is
Maryland and Tier A, not a Northern Virginia redirect candidate, and its
queries must never transfer to a Northern Virginia page. An earlier draft of
this table included it while omitting McLean, which is the wrong set in both
directions.

| Page | Query | Impr | Pos |
| --- | --- | --- | --- |
| alexandria-va | basement finishing alexandria va | 37 | 20.4 |
| alexandria-va | basement finishing alexandria va? | 8 | 9.8 |
| alexandria-va | basement remodeling alexandria | 2 | 33.0 |
| alexandria-va | basement remodeling alexandria va | 2 | 31.5 |
| alexandria-va | basement finishing contractor kingstowne va | 1 | 20.0 |
| alexandria-va | basement remodel alexandria va | 1 | 30.0 |
| alexandria-va | basement remodeling in alexandria va | 1 | 53.0 |
| great-falls-va | basement remodeling great falls va | 20 | 11.6 |
| great-falls-va | basement additions great falls va | 19 | 12.7 |
| great-falls-va | basement renovations great falls va | 10 | 11.1 |
| great-falls-va | basement remodeling great falls | 1 | 14.0 |
| great-falls-va | basement remodeling in great falls va | 1 | 12.0 |
| **mclean-va** | basement remodeling mclean va | 2 | 30.0 |
| **mclean-va** | basement remodeling contractor mclean va | 1 | 12.0 |
| reston-va | basement finishing in reston va | 13 | 10.7 |
| reston-va | basement remodeling in reston va | 4 | 12.8 |
| reston-va | basement remodeling reston va | 4 | 17.3 |
| vienna-va | basement finishing contractor in vienna va | 13 | 10.6 |
| vienna-va | basement finishes vienna va | 7 | 12.0 |
| vienna-va | basement renovation vienna va | 7 | 15.9 |
| vienna-va | basement remodeling in vienna va | 6 | 17.3 |
| vienna-va | high end basement remodel vienna va | 6 | 26.3 |
| vienna-va | vienna va basement finishing cost | 5 | 18.2 |
| vienna-va | basement remodeling vienna va | 4 | 21.3 |
| vienna-va | basement additions vienna va | 1 | 23.0 |
| vienna-va | basement design vienna va | 1 | 26.0 |

McLean is bolded because its two rows are 1 and 2 impressions — an earlier
draft's ≥4 cutoff erased this Tier B candidate from the frozen set entirely,
which is exactly the page a December redirect decision would then be unable to
make.

**Every one of the 26 queries is town-scoped.** Not one contains "northern
virginia". The transfer hypothesis therefore has a precise form: December
checks whether *these* strings start resolving to
`/services/basements/northern-virginia`. If the region instead earns new
regional queries while the towns keep theirs, both pages are working and
neither should be retired.

### NoVA area pages — every row, with its tier

**Only one of these four is a redirect candidate.** An earlier draft called all
four "Tier B redirect candidates", and three of the four were wrong:

| Page | §3.3 tier | What that means in December |
| --- | --- | --- |
| `leesburg-va` | **A — keep and invest** | never a redirect candidate; frozen here for observation only |
| `great-falls-va` | **B — keep, freeze, re-parent** | the only one the 301 rule can apply to |
| `mclean-va` | **D — leave alone** | frozen for observation; do not retire |
| `clifton-va` | **D — leave alone** | do not retire — **four #148 retirement redirects point at it**, and retiring it chains them |

The rows below are frozen for all four because the December read wants to see
what happened to them. Only Great Falls may be acted on.

**A note for whoever reconciles this with §3.3:** its Tier B row says "the
`/service-areas/` overview for every NoVA town", and its Tier D row explicitly
lists `{burke, clifton, fairfax-station, middleburg, mclean}-va` as leave-alone.
Those overlap. Tier D is the specific list and wins; the Tier B phrasing is
loose and predates it.

**These tables are complete.** Each page's named queries sum exactly to its
page total, so there is **no Search Console–suppressed remainder** on any of
the four — the figure omitted by an earlier draft's ≥3 cutoff was not
anonymised data, just rows it declined to print.

| Page | Rows | Impressions named | Page total | Suppressed |
| --- | --- | --- | --- | --- |
| leesburg-va | 42 | 381 | 381 | **0** |
| mclean-va | 34 | 209 | 209 | **0** |
| great-falls-va | 27 | 106 | 106 | **0** |
| clifton-va | 7 | 48 | 48 | **0** |

**`/service-areas/leesburg-va`** — 42 rows, 381 impressions. County queries ▸.

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
| ▸ general contractor remodeling loudoun county | 3 | 39.3 |
| ▸ general contractors loudoun county | 3 | 38.3 |
| ▸ home improvement contractors loudoun county | 3 | 39.0 |
| ▸ home remodeling contractors loudoun county | 3 | 28.3 |
| ▸ licensed contractors loudoun county | 3 | 26.3 |
| ▸ licensed remodeling contractors loudoun county | 3 | 28.3 |
| ▸ remodeling companies loudoun county | 3 | 30.0 |
| ▸ renovation companies loudoun county | 3 | 41.7 |
| ▸ residential general contractors loudoun county | 3 | 44.7 |
| leesburg home remodel | 3 | 27.0 |
| siding replacement leesburg va | 3 | 32.7 |
| elite construction | 2 | 11.0 |
| leesburg kitchen remodeling contractor | 2 | 25.0 |
| local remodelers | 2 | 45.5 |
| siding replacement leesburg | 2 | 31.5 |
| basement finishing contractor in leesburg va | 1 | 19.0 |
| bathroom remodeling leesburg | 1 | 32.0 |
| deck renovation leesburg va | 1 | 36.0 |
| elite contractor | 1 | 8.0 |
| elite contractor services | 1 | 10.0 |
| elite roofing | 1 | 9.0 |
| elite siding | 1 | 6.0 |
| fiber cement siding leesburg va | 1 | 38.0 |
| ▸ home renovations loudoun county | 1 | 41.0 |
| ▸ house renovation contractors loudoun county | 1 | 37.0 |
| leesburg bathroom remodel | 1 | 34.0 |
| leesburgh kitchen remodeling contractor | 1 | 37.0 |

**`/service-areas/mclean-va`** — 34 rows, 209 impressions.

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
| carpentry services in mclean va | 2 | 46.0 |
| elite construction | 2 | 7.0 |
| home remodeling contractor mclean va | 2 | 29.5 |
| home remodeling in mclean va | 2 | 46.0 |
| home renovation contractors mclean va | 2 | 28.0 |
| remodeler mclean va | 2 | 39.0 |
| remodeling company in mclean virginia | 2 | 38.5 |
| siding contractor in mclean | 2 | 36.0 |
| siding contractor mclean | 2 | 36.5 |
| • luxury home remodeling mclean va | 2 | 43.0 |
| best general contractor near me | 1 | 41.0 |
| general contractor in mclean | 1 | 13.0 |
| general contractor near me residential | 1 | 48.0 |
| home additions in mclean va | 1 | 52.0 |
| home remodeling contractors near me | 1 | 11.0 |
| remodelers in mclean virginia | 1 | 46.0 |
| remodeling in mclean virginia | 1 | 41.0 |

**`/service-areas/great-falls-va`** — 27 rows, 106 impressions.

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
| basement remodeling great falls va | 3 | 42.0 |
| basement remodeling in great falls va | 3 | 18.7 |
| exterior trim contractors great falls va | 3 | 14.7 |
| great falls kitchen remodeling contractors | 3 | 30.0 |
| great falls kitchen renovation contractor | 3 | 22.0 |
| siding installation great falls va | 3 | 25.7 |
| basement renovations great falls va | 2 | 48.0 |
| general contractor great falls va | 2 | 16.5 |
| great falls kitchen remodeling contractor | 2 | 16.0 |
| home restoration great falls | 2 | 21.0 |
| replacement siding great falls va | 2 | 22.0 |
| siding great falls va | 2 | 23.0 |
| vinyl siding installation great falls va | 2 | 30.5 |
| great falls kitchen renovation | 1 | 43.0 |
| great falls kitchen renovation contractors | 1 | 20.0 |
| kitchen remodeling great falls, va | 1 | 34.0 |
| new roof great falls va | 1 | 31.0 |
| residential roofing great falls va | 1 | 37.0 |

**`/service-areas/clifton-va`** — 7 rows, 48 impressions. The Tier D page four
#148 retirement redirects land on, so its rows matter twice.

| Query | Impr | Pos |
| --- | --- | --- |
| basement finishing contractor in clifton va | 11 | 12.3 |
| home remodeling services clifton | 11 | 11.5 |
| remodeling contractor clifton va | 8 | 19.1 |
| kitchen remodeling in clifton va | 7 | 23.3 |
| contractor clifton va | 6 | 9.2 |
| bathroom remodelers clifton va | 3 | 24.7 |
| whole home remodeling clifton | 2 | 11.5 |

Two things to carry into December. **Great Falls and McLean hold their own
basement queries at the area level**, separately from their basement combos, so
a redirect decision on either has to read both surfaces. And **`home
restoration near me` ranks 9.8 on Leesburg and 9.1 on McLean** — non-geographic
queries at page-one positions, which is local-pack territory and not something
a page edit moves.

### The finding that was not in the page-level view

**County queries are the majority of `/service-areas/leesburg-va`, though the
page does also rank on Leesburg terms.** 243 of its 381 impressions — 64% —
are Loudoun County queries across 18 strings. The page splits three ways, and
the three sum to its 381:

| Bucket | Strings | Impr |
| --- | --- | --- |
| Loudoun County | 18 | 243 |
| Leesburg-scoped | 17 | 108 |
| Branded / generic (`home restoration near me` 22, `elite *` 6, `local remodelers` 2) | 7 | 30 |

The Leesburg-scoped ones are led by `home remodeling leesburg va` (29 at 22.2),
`siding contractor in leesburg` (15 at 28.6) and `tile contractors leesburg`
(14 at 20.5).

Two of the three biggest county queries outrank **every** town query; the
third does not — `basement finishing contractor in leesburg va` sits at 19.0,
ahead of the county row at 19.2:

| Query | Impr | Pos |
| --- | --- | --- |
| exterior contracting services loudoun county va | 73 | 13.5 |
| home exterior contractor loudoun county va | 65 | 19.2 |
| exterior contracting company loudoun county va | 50 | 12.5 |
| *(for contrast)* home remodeling leesburg va | 29 | 22.2 |

That is regional-altitude demand already present in the data, and §2's thesis
is visible in it — **but at county altitude, not at "northern virginia"
altitude.** "Northern virginia" returns zero mobile impressions.

**Stated precisely, because two earlier drafts overstated it.** The three
queries above carry 188 impressions at positions 12.5–19.2, and the first
version of this passage claimed the page was "not ranking on Leesburg queries"
and that all three outranked the town terms. Both were false: town demand is
present at 108 impressions, and one town query outranks the third county one.
A December reader could have retired this page believing town demand was
absent. The other 15 county queries
carry 55 impressions at positions **26.3–44.7** — pages three and four, where
nothing is visible. Describing all 243 as ranking 12.5–19.2, as the reviewed
draft did, inflates the opportunity in a passage whose whole purpose is to help
the owner judge whether a county page is worth building. If December finds the regional page
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

**94.3% of Hedgesville's impressions — 215 of 228 — are plumbing-stoppage
queries**, across four strings: `vanity stoppage hedgesville wv` (99
impressions, position 10.3), `pop repair service hedgesville wv` (95, position
7.0), `vanity blockage hedgesville wv` (16), `bathtub stoppage hedgesville wv`
(5). Real Elite does not do drain work.

That leaves **13 impressions across six queries** for anything the business
sells — and not one of them is even Hedgesville:

| Query | Impr | Pos |
| --- | --- | --- |
| house siding shepherdstown wv | 4 | 37.3 |
| siding contractor shepherdstown wv | 4 | 28.5 |
| asphalt shingle roofing hainesville wv | 2 | 37.0 |
| siding company hainesville wv | 1 | 50.0 |
| siding contractor berkley springs wv | 1 | 49.0 |
| siding replacement shepherdstown wv | 1 | 29.0 |

All ten rows are listed; they sum to 228, matching the page total exactly, with
no suppressed remainder. A snippet improvement here would convert nothing.

*(Corrected after review: the first version of this passage said "96%, 215 of
223" and "8 impressions remain". Those came from a ≥3-impression filtered pull
— **the same abridging error this document had just been corrected for, in the
passage written to correct it**. The conclusion held; the arithmetic did not.)*

The page that actually holds page-one positions on real service demand is
**`/service-areas/inwood-wv`** — 31 queries at position 11.1 or better,
189 impressions. Split honestly, because the split matters:

| | Queries | Impr | What they are |
| --- | --- | --- | --- |
| Inwood-specific service terms | 9 | **154** | roofing, siding, basements |
| Generic / "near me" | 22 | 35 | local-pack territory |

The nine that carry the volume:

| Query | Impr | Pos |
| --- | --- | --- |
| siding company inwood wv | 34 | 7.5 |
| roofing contractor inwood wv | 28 | 9.7 |
| siding replacement inwood wv | 24 | 7.8 |
| house siding inwood wv | 19 | 5.1 |
| siding contractor inwood wv | 16 | 6.3 |
| residential roofers inwood wv | 11 | 9.6 |
| roof repair inwood wv | 9 | 10.9 |
| basement remodeling inwood wv | 8 | 5.4 |
| roof installation inwood wv | 5 | 10.2 |

*(Corrected after review: the first version said "ten queries, 162
impressions", from the same ≥3-impression filtered pull that produced the wrong
Hedgesville figures. The true band is three times larger. The correction runs
in the same direction as the Hedgesville one — filtering understated the
page — which is what makes the habit rather than the arithmetic the problem.)*

That is a real position, in the home market, on services the business sells,
and it takes zero clicks. It is the one place on this site where the
click-through question is worth asking at all — and it is worth asking as
"why does a position-5 result get no clicks", which is a different question
from snippet wording and may be the local pack sitting above it.

## What December should compare

1. **Do any "northern virginia" queries appear at all?** From zero, any
   non-zero is signal. If still zero, the regional altitude thesis failed on
   its own terms and §2 should be reread rather than the page expanded.
2. **Did the Tier B pages lose THEIR QUERIES to the region?** Compare the
   frozen query strings above, page by page — not the page totals. 301 a page
   only when the same queries it held now resolve to the regional page. A total
   that fell while the region gained *different* queries is not transfer; it is
   two pages serving different demand, and both should stay.

   **This rule applies to Tier B only** — the **five** basement combos
   (`alexandria`, `great-falls`, `mclean`, `reston`, `vienna`) and
   `/service-areas/great-falls-va`. §3.3's Tier B row names only four; its own
   McLean correction below it adds the fifth ("It belongs in Tier B"). Tier A (`leesburg-va`) and Tier D
   (`mclean-va`, `clifton-va`) are frozen above for observation and are not
   candidates whatever their queries do. Retiring `clifton-va` in particular
   would chain the four retirement redirects #148 pointed at it.
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
