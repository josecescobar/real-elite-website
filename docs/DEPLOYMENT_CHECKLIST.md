# Deployment Checklist — Real Elite Contracting Rebuild

What the rebuild needs from outside this repo before it can ship at full
strength. None of these are required to *deploy* — the build is clean — but
each one upgrades a specific surface when the asset lands.

---

## 1. Vercel environment variables

Set these in **Vercel → Project Settings → Environment Variables**. Apply to
Production, Preview, and Development scopes unless noted.

### Required

| Key | Value | What breaks without it |
|---|---|---|
| `RESEND_API_KEY` | From https://resend.com/api-keys | `/api/estimate` returns 500. The multi-step estimate form on `/` and `/contact` will fail submission. |

### Optional (graceful no-op when missing)

| Key | Value | What it enables |
|---|---|---|
| `ESTIMATE_TO_EMAIL` | Default: `info@realelitecontracting.com` | Where estimate-request emails are delivered. |
| `NEXT_PUBLIC_GTM_ID` | Format `GTM-XXXXXXX` | Google Tag Manager container loads. GA4 (`G-W9QH965H3Y`) is hardcoded and unaffected. |
| `NEXT_PUBLIC_CLARITY_ID` | From https://clarity.microsoft.com/projects | Microsoft Clarity heatmaps + session recordings. |

A reference template lives at `.env.example` in the repo root.

---

## 2. Owner portrait (AuthorBox swap)

The blog/guide AuthorBox renders the company logo as a placeholder avatar.
When the real owner photo is ready:

1. Save the JPG (square crop, ≥320px, neutral background) to:
   `public/images/team/owner.jpg`
2. Open `src/lib/constants.ts`
3. In the `OWNER` constant, change:
   ```ts
   portrait: null as string | null,
   ```
   to:
   ```ts
   portrait: '/images/team/owner.jpg' as string | null,
   ```

That's the entire swap. The AuthorBox auto-detects the value and switches
from logo-on-white placeholder to a real cover-fit portrait across every
`/blog/[slug]` and `/guides/*` page.

---

## 3. Bathroom / Kitchen / Basement photography

The three premium service pages added in Phase 4 ship with gradient-navy
heroes and no gallery section (intentional — the design v2 risks page calls
out that stock photos collapse the premium positioning). They become
visually complete the moment real project photography lands.

### Where to drop photos

- `public/images/projects/bathrooms/` — for the bathroom service page
- `public/images/projects/kitchens/` — for the kitchen service page
- `public/images/projects/basements/` — for the basement service page

(Create the folders if they don't exist.)

### Where to wire them in

Open `src/lib/services-data.ts`. For each of `bathrooms`, `kitchens`,
`basements`, add the `hero.image` and `gallery` fields:

```ts
bathrooms: {
  // ...existing fields...
  hero: {
    eyebrow: 'Premium Interior',
    heading: 'Bathroom Remodeling',
    sub: '…',
    // ADD THIS:
    image: {
      src: '/images/projects/bathrooms/hero.jpg',
      alt: 'Custom walk-in shower with floor-to-ceiling marble tile',
    },
  },
  // ...existing fields...
  // ADD THIS:
  gallery: [
    { src: '/images/projects/bathrooms/shower-1.jpg', alt: '…' },
    { src: '/images/projects/bathrooms/vanity-1.jpg', alt: '…' },
    { src: '/images/projects/bathrooms/tile-detail.jpg', alt: '…' },
  ],
},
```

The `ServicePageTemplate` already conditionally renders both — adding the
fields automatically upgrades the page from gradient hero to cinematic
photography and adds the "Recent project work" gallery strip.

### Don't have project photos yet? Use placeholders.

`next.config.ts` allows remote images from `images.unsplash.com`,
`plus.unsplash.com`, `images.pexels.com`, and `cdn.pixabay.com`. Paste an
Unsplash URL directly into `hero.image.src` and `next/image` will fetch,
optimize, and serve it. **Replace with real project shots before the rebuild
is positioned as the company's flagship** — stock photos undermine the
premium positioning per the plan's risk #10.

---

## 4. Other follow-on swap points (lower priority)

- **Gallery image tagging by location.** `src/lib/constants.ts:GALLERY_IMAGES`
  currently tags each photo by service category only. Add a `location` field
  (e.g., `'frederick-md'`) to enable per-city filtering in `CityPageTemplate`.
  Today the city pages show a generic regional gallery; once locations are
  tagged, swap one line in `CityPageTemplate.tsx` to filter by city.
- **Project Spotlight rotation.** `HOMEPAGE_PROJECT_SPOTLIGHT` in
  `constants.ts` is a single object. To rotate spotlights, change the shape
  to an array and pick one per build (or expose a CMS/MDX-driven version
  later).
- **Localized guides.** The `service-areas` and `financing` guide categories
  (Phase 5) are empty until articles are authored. Add MDX files to
  `content/blog/` with `category: 'service-areas'` or `category: 'financing'`
  in frontmatter — they auto-surface on the matching `/guides/[category]`
  landing.
- **Bathroom / Kitchen before-after pairs.** `BEFORE_AFTER_PAIRS` in
  `constants.ts` currently uses thematic in-progress vs. finished shots
  (not true paired before/afters). Replace with same-angle pairs when those
  are captured. The slider component itself needs no changes.

---

## 5. PR & shipping

1. **Set `RESEND_API_KEY` in Vercel first** — without it, the form throws.
2. Open the PR from `claude/inspect-rebuild-plan-tBIbO` → main.
3. Promote a preview deploy through QA: hit the homepage `/#estimate` form,
   submit a test, confirm the email arrives.
4. Once live, watch Microsoft Clarity (after Phase 1 env var is set) for the
   first 7 days — form-step funnel, abandonment, and scroll depth tell you
   where to iterate next.
