# Paving added to the Business Profile — 2026-09-17

> **Executed 2026-09-17**, with the owner's approval, after this document was
> written. Both steps completed and were verified by reading the profile back.
> The record below is kept in the past tense where it describes the gap; the
> **What shipped** section is the current state.

Verified live against `locations/16598215479155730871`.

## Current state

**Primary category:** `gcid:general_contractor`

**Additional categories (5 of a possible 9):**
`gcid:handyman` · `gcid:remodeler` · `gcid:deck_builder` ·
`gcid:roofing_contractor` · `gcid:flooring_contractor`

**Service items: 30.** Seven are roofing, which closes the roofing half of the
audit's Finding 1: `roof_installation`, `roof_repair`, `roof_damage_repair`,
`roof_inspection`, `storm_wind_damage_roof_repair`, `gutter_installation`,
`gutter_repair`.

**Paving: nothing.** No category, no service items.

## Why that gap is the expensive one

Paving is the site's strongest organic asset, not a side line:

- The driveway comparison guide earns **30 of the property's 84 clicks — 36% of
  all search traffic**, and is the only page Google gives jump-links to.
- It is the only page reaching page one on real mobile traffic, at **10% CTR**
  on `chip seal vs asphalt vs concrete` (position 4.2).
- The site publishes **10 paving pages**.
- Search Console shows real mobile demand in the home market:
  `asphalt resurfacing inwood` at 19 impressions, plus `asphalt paving inwood`,
  `asphalt maintenance inwood`, `asphalt contractor hopewell`.

So the one trade with demonstrated search traction is the one the Business
Profile does not claim at all. Google cannot put the listing in a paving local
pack for a category it does not hold.

## The fix, and why it is two steps

`gcid:paving_contractor` is the category to add — 53,367 businesses use it,
against 22,801 for `gcid:asphalt_contractor`, and it covers sealcoating and
concrete as well as asphalt. Slots are not a constraint: 5 of 9 used.

Service items cannot be written in the same pass. A structured item's
`service_type_id` must be one Google defines *for a category the location
already holds*, and those ids are only readable from the location once the
category is attached. Guessing an id like `job_type_id:asphalt_paving` is the
same mistake as guessing a place id — it either fails or writes something
wrong, silently.

1. `update_categories` — primary `gcid:general_contractor`, additional = the
   five above **plus** `gcid:paving_contractor`. The action replaces the whole
   additional list, so all six must be sent together.
2. Read `location_additional_categories` back and take the real
   `serviceTypes` list for paving.
3. `update_service_items` — all **30** existing items plus the paving ones.
   This action also replaces the whole list, so omitting an existing item
   deletes it.

## The risk worth naming

Google reviews category changes and they can, in some cases, put a listing back
through re-verification. This listing is a service-area business with no
address, which is the harder case to re-verify. The upside is a paving local
pack for the one trade with proven traction; the downside is a listing
temporarily unpublished. That trade is the owner's call, not an obvious yes,
which is why nothing was written.

## Not in scope

Changing the **primary** category. `general_contractor` is defensible for a
business spanning roofing, decks, basements, flooring and paving, and the
primary category carries the most re-verification risk of any edit here.

## What shipped

**Step 1 — category.** `update_categories`, primary left as
`gcid:general_contractor`, additional list resent in full as the existing five
plus `gcid:paving_contractor`. Six of nine slots now used.

**Step 2 — service type ids.** Read back from the location once the category
was attached. `gcid:paving_contractor` exposes 28; fourteen were taken, each
because the site publishes the work in `src/lib/paving-data.ts`:

| Service type id | Backed by |
| --- | --- |
| `asphalt_paving_and_repair` | asphalt-paving, asphalt-repair |
| `asphalt_resurfacing` | asphalt-repair; real demand on `asphalt resurfacing inwood` |
| `driveway_installation` | driveway-paving |
| `driveway_replacement` | driveway-paving, gravel-to-asphalt conversion |
| `driveway_repairs` | driveway-paving, asphalt-repair |
| `driveway_sealing` | sealcoating |
| `sealcoating` | sealcoating |
| `crack_filling_and_sealing` | sealcoating — cracks routed and filled before sealing |
| `parking_lot_repair_and_maintenance` | parking-lot-paving |
| `parking_lot_striping` | parking-lot-paving — layout striping |
| `line_striping_and_design` | commercial-paving — ADA layout and striping |
| `excavation_and_grading` | asphalt-paving — site excavation and grading |
| `drainage_work` | driveway-paving — drainage-first grading |
| `site_preparation` | asphalt-paving — sub-grade compaction and stone base |

**Step 3 — service items.** `update_service_items` with all **30** existing
items resent verbatim plus the fourteen above. **44 items**, confirmed by
reading the list back: every original present, primary category unchanged.

### Deliberately left out

Fourteen of the 28 available ids were skipped because nothing on the site backs
them: `brick_paver_installation`, `paver_installation`, `paver_sealing`,
`hardscapes`, `patio_paving`, `concrete_work`, `asphalt_milling`,
`asphalt_recycling`, `road_base_recycling`, `road_construction`,
`street_maintenance`, `hauling`, `bumper_blocks_and_posts`, `construction`
(already held). Claiming municipal road work or paver hardscaping would be the
same error as an unverified operational claim in site copy.

### Restore

`update_categories` with the five original additional categories, and
`update_service_items` with the first 30 ids in the table order above. Both
actions replace their whole list, so a restore must resend everything.

### Watch for

Category changes can trigger re-verification. If the listing shows as
unpublished or asks to verify in the next few days, that is the cause and it is
reversible by the restore above. Re-run the Martinsburg rank grid for a paving
term in about a month to see whether the new category earns pack placement.

## Still the bigger lever

None of this touches `place_topics`, which still reads `deck` / `wood` /
`deck replacement` because Google derives it from review text. Six reviews,
all decks, a fence and stone veneer. Service items declare what the business
offers; reviews are what Google believes. See `docs/roofing-review-request.md`.
