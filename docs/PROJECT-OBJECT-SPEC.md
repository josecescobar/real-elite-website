# The Project Object — Specification

> The canonical spec for the Project Object, the foundational content unit of Website v2
> (`docs/V2-BLUEPRINT.md` §3, §5). The TypeScript contract is `src/lib/projects/types.ts`; this
> document is the human-readable intent behind it. **One project is authored once and renders
> everywhere** — project page, gallery, related rails, and (progressively) service/city/blog proof
> modules, AI search, and GEO/SEO.

## Principles

1. **Public lens only.** A Project record is safe to render publicly. It carries **no street
   address** and **no contract price** — location is a city slug, budget is an anonymized band
   (`"$15k–$30k"`), the customer is first name only. Operational facts (margin, crew pay, vendor
   pricing, internal notes) live in Mission Control, never here.
2. **Author once, surface everywhere.** The same record powers many surfaces. Never duplicate a
   project's facts into a component; read them from the object.
3. **Referentially correct.** Relationships are canonical slugs (`service`, `citySlug`,
   `relatedGuideSlugs`) validated at test time against their source-of-truth catalogs
   (`src/lib/projects/projects.test.ts`), so the corpus stays consistent as it grows.
4. **Honest by construction.** Only `status: 'published'` projects render. Imagery is real project
   photography with descriptive alt text — never stock presented as work. A linked review follows the
   same integrity gate as every review (see `src/lib/reviews/types.ts`): visible content, never
   self-serving JSON-LD.

## Shape (authoritative fields — see `types.ts` for exact types)

| Group | Fields | Purpose |
|---|---|---|
| **Identity** | `slug`, `title`, `status`, `featured?` | URL, headings, publish gate, homepage Proof Wall. |
| **Relationships** | `service`, `secondaryServices?`, `citySlug` | Validated slugs; power the cross-linking mesh (service ↔ project ↔ city). |
| **Facts / spec panel** | `completedOn`, `durationLabel?`, `budgetBand?`, `style?`, `materials?` | The architectural-magazine spec panel; sorting; entity SEO. |
| **SEO** | `metaTitle`, `metaDescription`, `keywords`, `summary` | `summary` is the citable answer-block AI engines and previews lift. |
| **Story** | `hero`, `brief[]`, `challenge?[]`, `solution[]`, `outcome?[]` | The editorial narrative: the reveal, the brief, where expertise shows, the payoff. |
| **Media** | `beforeAfter?[]`, `gallery[]` | Before/after reveal + the image set; every image needs real alt text. |
| **Proof & cross-links** | `review?`, `faqs?`, `relatedGuideSlugs?` | Linked review (first name only), FAQ (FAQPage schema), guide cross-links. |

## How each surface consumes it

- **Project page** (`/projects/[slug]`) — the full editorial experience (hero → before → brief →
  challenge → build → reveal → details → review → facts → CTA → related).
- **Gallery** (`/projects`) — cards with service/city/budget facets; each opens the full page.
- **Service / City pages** — auto-assembled proof modules filtered by `service` / `citySlug`.
- **Homepage Proof Wall** — `featured` projects.
- **AI / GEO** — `summary` + structured facts feed answer surfaces and external citation.

## Adding a project

Drop a file in `src/lib/projects/data/<slug>.ts` default-exporting a `Project`; the registry
regenerates via `npm run generate:projects` (also run in `prebuild`). `projects.test.ts` fails CI if
the registry drifts from the data directory or a relationship slug is invalid.
