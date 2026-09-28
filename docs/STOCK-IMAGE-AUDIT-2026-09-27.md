# Stock image audit and Loudoun SEO pass, September 27, 2026

Stacked on PR #167 (`feat/projects-better-images`). Rule applied throughout:
stock or AI images are never presented as Real Elite work. They may appear
only where the page labels them as design inspiration.

## Method

Every raster in `public/` (118 files) was compared with every image in the
git-ignored stock library (`images/new-images`, 66 files; `images/inspiration`,
2 files; plus one loose Pexels file on the T7 drive). Comparison used a 64-bit
DCT perceptual hash against the full image, mirrored copies, and 15 crops
of each source (three scales, five positions) at the target's aspect ratio.
Results split cleanly: 24 files matched at distance 0–1. The next closest
was 12, and the ones at 12–14 were visually unrelated. The same
hash was run against the 1,524 JPEG/PNG files in `real-elite-contracting/` on
the T7 drive to find the originals behind the case-study photos.

`src/lib/stock-images.ts` now holds the 24 matches. It also treats everything
under `/images/inspiration/` as inspiration, except the A+ Paving partner photos.
Tests read from it.

## The 24 stock matches

| File | Pexels / stock source | Where it was used | Action |
|---|---|---|---|
| `projects/kitchens/hero.jpg` | derwin-edwards 11209134 | Kitchens service hero; kitchen draft hero; `/investment`; two blog posts | Service hero removed (gradient hero). Draft: removed. `/investment` already captioned "Design inspiration". Blogs: auto-labelled (below) |
| `projects/kitchens/island-lantern-pendants.jpg` | derwin-edwards 11208972 | Kitchens gallery; kitchen draft; consultation gallery | Gallery moved under "Design inspiration". Draft: removed. Consultation gallery already labelled; alt text changed from "Finished kitchen…" to "Inspiration: kitchen…" |
| `projects/kitchens/gray-marble-waterfall.jpg` | curtis-adams 10827345 | Same, plus luxury kitchen blog | As above |
| `projects/kitchens/white-herringbone.jpg` | curtis-adams 15062120 | Kitchens gallery; draft; blog | As above |
| `projects/kitchens/white-island-chairs.jpg` | curtis-adams 36777912 | Kitchens gallery; draft; consultation gallery | As above |
| `projects/kitchens/two-tone-black-hood.jpg` | curtis-adams 36777559 | Kitchens gallery; draft; consultation gallery; blog | As above |
| `projects/bathrooms/hero.jpg` | curtis-adams 7027992 | Bathrooms service hero; bath draft; two blog posts | Service hero removed; real Frederick bath photo is now the overview image. Draft: replaced with real photos. Blogs: auto-labelled |
| `projects/bathrooms/shower-stone-accent.jpg` | curtis-adams 10827349 | Bathrooms gallery; bath draft; consultation gallery; blog | Service gallery replaced with three real Frederick bath photos. Draft: removed. Consultation gallery alt fixed |
| `projects/bathrooms/shower-black-frame.jpg` | ajit-singh 35021548 | Bathrooms gallery; bath draft | Replaced / removed |
| `projects/bathrooms/tub-shower-tile.jpg` | curtis-adams 7168098 | Bathrooms gallery; bath draft; consultation gallery | Replaced / removed; alt fixed |
| `projects/basements/hero-framing.jpg` | rstephens 33405084 | Basements service hero; two blog posts | Service hero removed (gradient). Blogs: auto-labelled |
| `deck-multilevel-step-lights.jpg` | watermarked stock `2-1024x1024` | Decks gallery ("Recent … projects") | Replaced with real `work/deck-composite-stairs-front.webp` |
| `deck-ipe-modern.jpg` | watermarked stock `7587-1024x1024` | Decks gallery | Replaced with real `work/deck-composite-surface.webp` |
| `deck-pebble-detail.jpg` | watermarked stock `6613-1024x1024` | Decks gallery | Replaced with real `work/deck-composite-night-stairs.webp` |
| `deck-garden-path-view.jpg` | watermarked stock `193742316-1024x1024` | Unused (removed from wall in #167) | None |
| `deck-screened-porch.jpg` | curtis-adams 10099330 | Deck draft gallery; `/investment` (captioned); covered-patio cost guide | Draft: removed. Guide: auto-labelled |
| `exterior-brick-victorian.jpg` | wolfart 26595553 | Stone-facade draft gallery | Removed |
| `roofing-victorian-reroof.jpg` | rstephens 33501308 | Roofing draft hero | Removed |
| `roofing-tearoff.jpg` | rstephens 33404080 | Roofing draft "before" | Removed |
| `roofing-shingle-install.jpg` | rstephens 33404248 | Roofing draft gallery | Removed |
| `inspiration/wholehome-kitchen-refresh.webp` | artbovich 6587899 | Consultation gallery; whole-home blog | Already labelled; blog auto-labelled |
| `inspiration/kitchenette-refresh.webp` | andreaedavis 6253541 | Consultation gallery; basement blog | Already labelled; blog auto-labelled |
| `inspiration/loudoun-screened-porch.webp` | curtis-adams 16501257 | Decks "Outdoor Living Inspiration" | Already labelled; kept |
| `inspiration/loudoun-timber-porch.webp` | curtis-adams 8583538 | Same | Already labelled; kept |

The other `inspiration/*.jpg` files did not match the local library, but they
are stock-style photos kept in the inspiration folder, so they are treated as
inspiration. The service paving hero `inspiration/paving-fresh-asphalt.jpg` was
removed. `/services/paving` redirects to `/paving`, so that removal has no
visible effect.

## Surface-level changes

- **Service pages (`RelatedProjects`)**: a gallery can no longer show stock
  under "Recent … projects". Stock images move under a "Design inspiration /
  {Service} ideas" heading with the line "Stock photography for style
  reference. These are not Real Elite projects." This currently applies only to Kitchens.
- **Service heroes**: Kitchens, Bathrooms and Basements now use the gradient
  hero until real photos exist, which matches the original intent in the
  `services-data.ts` header. A test fails if a hero or overview image is stock.
- **Blog articles (`GuideTemplate`)**: stock inline images carry a visible
  caption, "Design inspiration · not a Real Elite project". A stock featured
  image gets a "Design inspiration" tag. This applies automatically, covering 23
  inline images across 9 posts and 15 featured images.
- **Consultation gallery (`LuxuryGallery`)**: this was already labelled. Six alt texts
  said "Finished …" and now say "Inspiration: …".
- **Guards**: `stock-images.test.ts` checks the /projects wall, before/after pairs,
  homepage work modules, and service heroes and overviews. `projects.test.ts`
  checks that no case study, draft or not, uses stock.

Left as is: guide thumbnails on `/resources` and the homepage guide cards.
These are article cards, not claims of work. The same goes for blog OG images.

## The six case-study drafts

Each draft now has `needsRealPhotos: true` and `photoNotes` listing what is missing.
`isPublished()` requires `status === 'published'` **and** no photo hold. Changing
the status alone will not publish a held draft. A test enforces that held projects
stay drafts, and that the hero and gallery may be empty only while the hold is on.

| Draft | Stock removed | Real photos | Still needed |
|---|---|---|---|
| composite-deck-build-martinsburg | screened porch | Kept existing wall photos | `deck-lounge.jpg` has Fairfax County GPS, which conflicts with Martinsburg. No drive original was found for the hero or `deck-construction.jpg` |
| new-construction-framing-to-finish | none | Kept 4 job-site photos | The framing photo's GPS is Morgan County, WV (Oct 2025), not Inwood. No finished photos |
| signature-kitchen-remodel-eastern-panhandle | all 6 | none exist | Everything. Hero and gallery are empty |
| stone-facade-exterior-upgrade | brick Victorian | Kept 4 (drive originals, no EXIF) | Full-res originals; wide finished shot |
| victorian-roof-replacement-martinsburg-wv | hero, before, shingle install | Kept valley, ridge vent, crew | Hero; before/after. Also removed `roofing-complete.jpg` (no drive original; shows a suburban house, not a Victorian) and the unverified review. The Victorian story needs confirming |
| walk-in-shower-bathroom-remodel | all 3 + hero | **Attached the 4 Frederick primary-bath photos** (job file + GPS, see PROJECT-PHOTO-SOURCES) and moved `citySlug` from the Martinsburg placeholder to `frederick-md` | Jose to confirm the narrative matches; a wide finished shot and a before photo |

## Loudoun SEO changes (no new claims)

- **Town and county pages, premium lane** (Loudoun, Fairfax, Prince William): the
  title is now "Remodeling Contractor in {Place} | Real Elite" (it was "Contractor in …").
  The meta description names design-build kitchens, primary baths, basements and
  additions and points to the design consultation, matching the page hero. The H1 is
  now "Remodeling contractor in / Ashburn, VA" (it was just the place name).
  Panhandle and home-market pages are unchanged.
- **Generic service+town description**: dropped "quality guaranteed" (no defined
  guarantee exists) in favour of "{Service} in {Place} from Real Elite Contracting,
  a veteran-owned contractor. Request a free written estimate." A test caps it
  at 160 characters.
- **Internal links**: `src/lib/loudoun-guides.ts` holds an authored service → guide
  map. Loudoun town pages now show the permit guide plus the cost guides for
  the town's lead services, where they used to show "most recent posts". The
  catalog now decides what counts as Loudoun; Brambleton had been missing from the old
  list. Loudoun service+town pages with no authored guides get the service's
  Loudoun guides. The Kitchens, Bathrooms, Basements, Additions and Decks service pages
  now link their Loudoun cost guide. Kitchens and Decks had been falling back to
  "recent posts". Five cost guides now link to their service+town pages
  (for example "kitchen remodeling in Leesburg" → `/services/kitchens/leesburg-va`).
- **Checked, no change needed**: cost-guide titles, descriptions and H1s target the
  intended queries and fit their length budgets. JSON-LD is GeneralContractor
  (sitewide), Article, BreadcrumbList, FAQPage on town pages, and Service on
  service pages. There is no AggregateRating or Review markup, since `aggregateRatingSchema()`
  stays gated until reviews are verified. All six guides and every Loudoun combo are in
  the sitemap. `robots.txt` allows everything. PR #168 handles the remaining
  sitemap and description-length fixes; this branch avoids its lines.
- **Core Web Vitals**: removing the three stock service heroes takes a
  1920 px `priority` image out of the LCP path on Kitchens, Bathrooms and Basements.
  26 source files in `public/images/inspiration/` are 320–900 KB, but they are
  served only through `next/image` (resized and re-encoded), so visitors never
  download the originals. Not changed.

## Open questions for Jose (not changed here)

- `docs/PROJECT-PHOTO-SOURCES-2026-09-27.md` describes one job folder as a lead
  that never went ahead. Other records on the drive for the same address suggest
  Real Elite did framing work there. The framing, foundation and weather-barrier photos
  on the site trace to that job. Please confirm those photos may be shown.
- `/paving` galleries show A+ Paving partner photos. The partnership is disclosed
  in the FAQ, but the gallery heading reads "Recent Paving projects".
- The Basements service copy says "we handle … electrical". The case-study pipeline
  doc says Real Elite does not take electrical work.
- `roofing-complete.jpg` (used on one blog post) has no original on the drive.
