# From job photos to a draft website project

The three stages are **shoot → MediaForge export → website import and Jose's approval**.
The importer always writes `status: 'draft'` and `featured: false`. It cannot publish,
even if the export says `published`. No review or rating is imported.

## 1. Shoot and collect originals

Capture before, progress, and after photos, preferably from matching viewpoints.
Export original JPEG/HEIC files from Photos or use AirDrop / Telegram Send as File.
Copy them into `Jobs/<job>/media/inbox/`, optionally under `before/`, `during/`,
and `after/`. Keep originals; do not move or delete `photos/` or `media/raw/`.
Use only photos cleared for website use. Check visible faces, addresses and license plates.

## 2. Produce the MediaForge draft

From the local MediaForge installation:

```sh
mf ingest <job>
mf portfolio <job>
```

The export is `Jobs/<job>/media/exports/web/<job>-case-study/`, with
`case-study.md` and `images/`. See MediaForge's README and `docs/AGENT-GUIDE.md`.
MediaForge currently replaces an existing export folder on rerun: obtain Jose's
approval for that exact path before rerunning it. The website importer never
changes the export or original photos.

Review the draft privately. The location must be town/state only; the slug and
title must also omit street addresses and client names. Bracketed copy remains
unconfirmed. Job-plan target dates are not completion dates. Scope text and
photo captions are copied for editorial review, not verified by the importer.

## 3. Import, review, then let Jose approve

From the website checkout (Node 22 and installed npm dependencies):

```sh
node scripts/import-case-study.mjs "/path/to/<job>-case-study"
```

You may pass `case-study.md` itself instead of the folder. The command creates:

- `src/lib/projects/data/<slug>.ts`, a typed project with draft status.
- `public/images/projects/<slug>/*.webp`, metadata-stripped, optimized copies of referenced photos.
- An updated `src/lib/projects/registry.generated.ts` using the existing generator.

The hero, story sections, gallery and before/after pairs come from the export.
WebP twins are preferred, with JPEG/PNG fallback; copies are re-encoded locally
(maximum 2400px edge) to strip metadata. No network or paid API is used.
The branded OG file is not imported: project pages already generate their own OG cards.
If no gallery is supplied, the hero provides the gallery's first image.

City is matched against the canonical website catalog. A primary service is
inferred only when the title names exactly one catalog service. Otherwise use
explicit options, based on confirmed job facts:

```sh
node scripts/import-case-study.mjs "/path/to/<job>-case-study" \
  --slug kitchen-refresh-leesburg --service kitchens --city leesburg-va \
  --completed-on 2026-09-20
```

`service`, `citySlug`, `completedOn`, and `summary` may also be supplied in export
frontmatter. CLI overrides take precedence. If completion is unknown, omit it:
`completedOn` stays empty in the draft, never copied from `generated` or the planned
timeline. Fill it before publication. Unresolved copy remains visibly bracketed.
No materials, permits, testimonials, rating or budget claims are invented.

An existing project file or image folder makes the command fail without replacing
it, including projects Jose has already published. Edit an imported draft in place;
there is no force/overwrite or publish flag. Invalid catalogs, dates, missing images,
external image URLs, traversal and symlinked input/output components fail before
output writes. An I/O failure during writing may leave partial new output; inspect
it and obtain approval for exact paths before any cleanup. Do not force a retry.

Jose must confirm the city, actual completion date, narrative, scope (Real Elite
does not take electrical work), alt text, photo rights, customer consent, and all
public claims. Remove placeholders and private information. Then **Jose explicitly
changes `status` to `published`** in the project module and may opt into `featured`.
Reviews remain a separate verified intake process; importing a project does not
activate testimonials.

Draft status hides the project from public queries, routes and portfolio rails.
It is **not access control for files in `public/` or a pushed repository**: clear
images and copy for those surfaces before committing, pushing or deploying a draft.
For material awaiting consent, use a private scratch output root first.

Run the gates before proposing a publication PR:

```sh
npm run generate:projects
npm run typecheck
npm run lint
npm test
npm run build
npm run test:built
```

The current claims tests intentionally enforce the hold on unapproved projects.
When Jose approves the first real publication, update the corresponding hold
expectations with that approval; never weaken them merely to make an import pass.

## Synthetic smoke test (never commit demo output)

Create an empty scratch directory outside the website, then pass it explicitly:

```sh
mkdir -p "$PAPERCLIP_RUN_SCRATCH_DIR/case-study-smoke"
node scripts/import-case-study.mjs \
  "/Volumes/Silver T7/AI-SHARED/Jobs/_mediaforge-demo/media/exports/web/_mediaforge-demo-case-study" \
  --output-root "$PAPERCLIP_RUN_SCRATCH_DIR/case-study-smoke"
```

The leading underscore normalizes to `mediaforge-demo`. The generated registry
belongs only to that scratch tree; no demo project or photos should be staged.
For a non-Paperclip shell, supply your own existing temporary output directory.
