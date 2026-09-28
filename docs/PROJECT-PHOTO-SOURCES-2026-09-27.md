# /projects photo wall — sources, September 27, 2026

Every image in `GALLERY_IMAGES` (`src/lib/constants.ts`) is a photograph of
Real Elite's own work. This file records where each new export came from and
how the job was matched, so the claim can be checked later.

Edits: EXIF-orientation applied, crop, light contrast curve, mild sharpening,
resize to ≤1600 px long edge, WebP under 300 KB, all metadata stripped (no GPS).
No pixels were generated or invented.

## New exports (`public/images/work/`)

| Output | Source (on the T7 drive, `real-elite-contracting/`) | Evidence it is this job |
|---|---|---|
| `bath-primary-frameless-shower.webp` | `<Frederick bath folder>/IMG_2686.heic` (drop cloth cropped out) | Primary-bath remodel job file (Frederick, MD; status done): scope names tile shower, vanity, glass enclosure. Process photo from the same folder carries Frederick GPS. iPhone 14 Pro Max, 2026-07-24. |
| `bath-primary-shower-and-vanity.webp` | `<Frederick bath folder>/43DC327D-….heic` | Same job, 2026-08-27. |
| `bath-primary-navy-vanity.webp` | `<Frederick bath folder>/IMG_2772.jpeg`, cropped to the cabinet (mirror reflection and counter items excluded) | Same job, 2026-08-27. |
| `bath-primary-tile-leveling.webp` | `<Frederick bath folder>/BDBAC67C-….jpeg`, cropped | Same job, GPS Frederick MD, 2026-06-19. |
| `deck-composite-stairs-front.webp` | `<Fairfax deck folder>/F8668DB3-….jpeg` | GPS Springfield area, Fairfax County VA, 2024-06-15. Same GPS and dates as the existing `deck-lounge.jpg` and `deck-railing` night shots. |
| `deck-composite-surface.webp` | `<Fairfax deck folder>/27F741D6-….jpeg` | Same job, 2024-06-15. |
| `deck-composite-night-stairs.webp` | `<Fairfax deck folder>/IMG_2584.jpeg` | Same job, 2024-06-16. |
| `roofing-finished-dormer.webp` | `Roofing/finished-roof-shingles-on-dormer.jpg` | Same neighbourhood and roof as the existing `roofing-hero.jpg` (WV). Source file has no EXIF. |
| `roofing-finished-overhead.webp` | `Roofing/overhead-shingle-roof-view (1).jpg` | As above. |
| `roofing-finished-ridge.webp` | `Roofing/new-architectural-shingles-with-ridge-vent (1).jpg` | As above. |
| `flooring-laminate-finished.webp` | `Wall Framing & Interior/light-wood-laminate-floor-detail.jpg` | Same set as the three flooring photos it replaces (WV). |


## Source verification

These nine exports are not in `AI-SHARED/Jobs` or in the git tree before this branch. The originals are on the T7 portfolio drive. Every path below is relative to:

`/Volumes/Silver T7/real-elite-contracting`

`[omitted]/` means the parent directory name is a client name or a street, so it is not written here. Each of those filenames occurs once under that root. Job id is the SimplyWise id's leading hex, which is also the `JOB.md` folder's trailing hash. `none` means no `JOB.md` under `AI-SHARED/Jobs` owns the file.

Pixel size is after EXIF orientation. WebP quality is what `magick identify -format %Q` reports (92 on every export below). The shared steps are a light contrast curve, mild sharpening, and stripping all metadata.

| Export | Job id | Source path | SHA-256 | Oriented px | Transform |
|---|---|---|---|---|---|
| `bath-primary-frameless-shower.webp` | `97988836` | `[omitted]/IMG_2686.heic` | `53d97ef679d2988c4c75b05abdaf4573761bc48fdb7a4409f24dadc1094bb526` | 3024×4032 | Crop (drop cloth removed), resize to 1382×1600, WebP q=92 |
| `bath-primary-navy-vanity.webp` | `97988836` | `[omitted]/IMG_2772.jpeg` | `e0323f9337dff431664d5527a5be7db031905be2fb2163bb634b0afa61113081` | 3024×4032 | Crop to the cabinet (stored file is 4032×3024, orientation RightTop), resize to 1600×624, WebP q=92 |
| `bath-primary-shower-and-vanity.webp` | `97988836` | `[omitted]/43DC327D-C485-4B52-A6BD-1BF62648FE8B.heic` | `864b5b6cfadf33423537f64a8c2e2085cde06c732bfe748886e995062e3b6bd4` | 3024×4032 | Resize only to 1200×1600 (scale 1200/3024), WebP q=92 |
| `bath-primary-tile-leveling.webp` | `97988836` | `[omitted]/BDBAC67C-2F01-41ED-AA0F-924395E75C40_1_102_o.jpeg` | `1707904560307e5de7e3f5173ed92ee79df0943ba5c12f6e488838bc3e34acb5` | 2048×1536 | Crop, resize to 1600×886, WebP q=92 |
| `deck-composite-night-stairs.webp` | none | `Deck Construction/IMG_2584.jpeg` | `966c4f9be2e1654be2ffd63cde1d57adcdd2948a6c04ad1ef50f9b3b60755f80` | 1350×1800 | EXIF orient (stored 1800×1350, RightTop), resize to 1200×1600, WebP q=92 |
| `deck-composite-stairs-front.webp` | none | `[omitted]/F8668DB3-E6E6-4270-9568-C74068A9124A_1_102_o.jpeg` | `e1a1615982eeb935cc43f104bf2c35ef2d7e4984e7ea337ddd339889de587e0f` | 1536×2048 | Resize only to 1200×1600, WebP q=92 |
| `deck-composite-surface.webp` | none | `[omitted]/27F741D6-0376-4EDF-A295-DA371A8C483F_1_102_o.jpeg` | `c103f3b17a25cfc7dc4143b53f148edf066d06278a6dba850d449be63ed4a8d1` | 1536×2048 | Resize only to 1200×1600, WebP q=92 |
| `roofing-finished-dormer.webp` | none | `Roofing/finished-roof-shingles-on-dormer.jpg` | `43109e9d62ca4a3bb0a17ff6eaef5a9dce55cc39e84adab856989e5bb82d0f68` | 1200×1600 | Resize to 1050×1400 (scale 0.875), WebP q=92 |
| `flooring-laminate-finished.webp` | none | `Wall Framing & Interior/light-wood-laminate-floor-detail.jpg` | `808201c8180036dec613124df6f3dda1fbacdc8f1b8838bcfddd5cbea62a091d` | 1800×1350 | Resize to 1584×1188 (scale 0.88), WebP q=92 |

The bathroom job's SimplyWise id is `97988836-ce02-42aa-b245-e75ececab662` (status done, Frederick, MD). Those four files were not copied into that job's `photos/` folder.

The three deck files have no `JOB.md`. `Deck Construction/IMG_2584.jpeg` is byte-identical to the copy that sits in the street-named Fairfax deck folder; that folder name is omitted. The other two deck filenames occur once, in that same omitted folder.

Re-check from the root above. Each `find` must print one path, and every hash must match the table.

```bash
shasum -a 256 \
  "Deck Construction/IMG_2584.jpeg" \
  "Roofing/finished-roof-shingles-on-dormer.jpg" \
  "Wall Framing & Interior/light-wood-laminate-floor-detail.jpg"
find . \( \
  -name 'IMG_2686.heic' -o \
  -name 'IMG_2772.jpeg' -o \
  -name '43DC327D-C485-4B52-A6BD-1BF62648FE8B.heic' -o \
  -name 'BDBAC67C-2F01-41ED-AA0F-924395E75C40_1_102_o.jpeg' -o \
  -name 'F8668DB3-E6E6-4270-9568-C74068A9124A_1_102_o.jpeg' -o \
  -name '27F741D6-0376-4EDF-A295-DA371A8C483F_1_102_o.jpeg' \
\) -exec shasum -a 256 {} \;
```

## Corrections to existing tags

- `deck-lounge.jpg`: was tagged WV. EXIF GPS puts it in Fairfax County, VA. Now tagged VA.
- `deck-railing-install.jpg`: was tagged WV. No EXIF, and the background does not match the Fairfax deck, so the state tag was dropped rather than guessed.

## Removed from the photo wall

Stock (Pexels matches flagged in `SITE-IMAGE-REVIEW-2026-09-20.md`), which
must not be presented as Real Elite work: all six `projects/kitchens/*`, all
four `projects/bathrooms/*`, `projects/basements/hero-framing.jpg`,
`roofing-victorian-reroof.jpg`, `roofing-shingle-install.jpg`,
`roofing-tearoff.jpg`, `deck-screened-porch.jpg`, `exterior-brick-victorian.jpg`,
and the four decks traced to watermarked stock (`deck-multilevel-step-lights`,
`deck-ipe-modern`, `deck-pebble-detail`, `deck-garden-path-view`).

Weak real photos, replaced by better shots of the same kind of work:
`roofing-valley.jpg` and `roofing-slope.jpg` (photographer's shadow),
`deck-night-lights.jpg` (dark, house fills the frame), and the three cluttered
flooring shots.

The files stay in `public/images` because unpublished draft case studies still
reference some of them. Those drafts need the same clean-up before publishing.

## Not used, and why

- `Bethesda Project/`: the job there was interior painting in a builder's new
  townhouse. The kitchen and bathrooms are the builder's, not ours.
- `[job address]/`: a lead whose estimate was never approved. The
  photos show the house as found.
- Frames carrying a "Sora" watermark, plus similar dramatic roof images with
  no EXIF, in `Real Elite Contracting/`: AI-generated video frames. Never use them.
- Kitchen backsplash photos (Martinsburg, March 2026): the only copies are
  1024 px, taken mid-job, with tape patches on the cabinets.
- Basement conversion folder: existing conditions and plans only. No finished photos yet.

## Still needed from the owner

- **Kitchens:** a wide shot of the finished room from the doorway, the island
  or range wall straight on, and two details (hardware, backsplash). Shoot in
  daylight with all lights on, counters cleared.
- **Basements:** a wide shot of the finished room, the wet bar or media wall,
  and the bath.
- **Exterior / stone:** a full-resolution original of the stone-facade porch
  (the current file is 1024 × 576) and a twilight exterior.
- **Roofing:** one clean ground-level wide shot of a finished roof with no shadow in frame.
- Full-resolution originals of the 768–1024 px deck and kitchen exports. They
  are probably in iCloud Photos (~/Pictures), which could not be read from here.
