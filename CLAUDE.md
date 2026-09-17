# Real Elite Contracting — working notes for Claude

Marketing site for a veteran-owned contractor in West Virginia's Eastern
Panhandle, serving WV, MD and VA. Next.js 16 App Router, TypeScript, Tailwind,
Vitest. Most pages are statically generated from data in `src/lib/`.

## Workflow

**Merge your own PRs once CI is green. Do not ask first.** Open the PR as a
draft, wait for CI, mark it ready and merge it. Do ask before anything that
writes to an outward-facing asset the repo does not own — the Google Business
Profile, GA4 configuration, live content the owner has not seen.

Before pushing, run what CI runs:

```
npm run typecheck && npm run lint && npm test && npm run build
```

A push that turns CI red costs more than the minute those take.

## Analytics

`src/lib/analytics.ts` is the single source of GA4 event names. Add events
there, not inline.

- **Phone links go through `PhoneLink`** (`src/components/analytics/PhoneLink.tsx`),
  never a bare `<a href="tel:...">`. A guard test in `PhoneLink.test.tsx` fails
  the build otherwise. 34 of 41 phone links once fired nothing, which made
  phone conversions unreadable — see `docs/ga4-conversion-tracking.md`.
- Other tracked links go through `TrackedLink`.
- `estimate_step_view` fires on render, not engagement. Measure the funnel from
  `estimate_step_start`.

GA4 key events are configured in the GA4 admin UI, not in this repo, and are
currently misconfigured. `docs/ga4-conversion-tracking.md` has the detail.

## Content and SEO

`src/lib/service-city-content.ts` holds the service+city page content map. Its
test suite enforces the rules that matter:

- Every combo key must resolve to a real service **and** a real service area,
  or the page builds as a 404.
- A `metaTitle`/`metaDescription` override must differ from the generated
  fallback. An override that restates the template is a maintenance cost that
  buys nothing, and the test names it.
- Home-turf and basement snippets must quote a dollar figure the site already
  publishes elsewhere. Do not invent prices.

Claims about how the business operates (crew composition, warranties,
timelines) go in only when the owner has confirmed them. Getting one wrong in
front of a homeowner is worse than saying nothing.

Town and neighbourhood names in `src/lib/constants.ts` must be real. Verify
before adding; a plausible-sounding subdivision that does not exist is worse
than omitting it.

## Docs

`docs/` is the ops log — audits, findings, and playbooks for work that has to
happen outside the repo. Keep dated findings dated, and correct them in place
with a visible note rather than silently.
