# Site Quality Loop

How this site stays launch-grade as it grows past 178 routes.

A green `npm test` proves the *code* works. It says nothing about whether the
*site* is fit to ship — whether a CSP header silently killed an embed, whether
a title got truncated in search results, whether a link died three refactors
ago. `scripts/audit-site.mjs` measures that, and the loop below acts on it.

---

## 1. The audit

```bash
npm run build
PORT=3100 npm start &          # must be a production build
npm run audit:site             # human-readable report
npm run audit:site -- --json report.json   # machine-readable
npm run audit:site -- --fail-on error      # exit 1 when errors exist
```

It crawls every URL in `sitemap-0.xml` and grades findings:

| Level | Meaning | Examples |
|---|---|---|
| **error** | Broken for users or crawlers. Fix before shipping. | CSP-blocked embed, 4xx/5xx, dead internal link, missing alt text, unlabelled form field, invalid JSON-LD |
| **warn** | Measurably costs reach or conversion. | Title >60 chars, meta description outside 70–160, LCP >2.5s, CLS >0.1, missing canonical |
| **info** | Worth knowing, not worth blocking. | Thin content, heading-order jumps |

Thresholds live in `LIMITS` at the top of the script and encode Google's
documented display budgets, not taste. Change them there.

**Requirements:** a production server (not `next dev` — you'd measure compile
time, not the site) and a Chromium. The script finds one via
`PLAYWRIGHT_CHROMIUM_PATH`, `PLAYWRIGHT_BROWSERS_PATH`, `/opt/pw-browsers`, or
a system install. `playwright-core` is used deliberately — it has no
postinstall browser download, so it doesn't slow `npm ci`.

## 2. What the audit already caught

The first run of this harness, against a site with a fully green build:

- **`/contact`'s Google Map was invisible in production.** The CSP `frame-src`
  never listed `www.google.com`, so Chrome refused to frame the embed. The
  iframe still laid out at full size, so the page looked fine in code review —
  it just rendered an empty rectangle on the main lead-capture page. Nothing
  in lint, typecheck, tests or the build could see this.
- **54 titles over the 60-char SERP budget and 64 meta descriptions outside
  70–160**, most from mechanical causes (a 24-character brand suffix; blog
  posts falling back to their full excerpt).

That is the case for the harness: none of it was visible from a green build,
and all of it was costing clicks or conversions.

## 3. The loop

The daily Routine (see `docs/SESSION-STATE.md` for the working conventions)
runs this cycle:

1. `git fetch origin main`, read `docs/SESSION-STATE.md`, check merged and open
   PRs so work is never duplicated.
2. Build, serve, and run `npm run audit:site -- --json`.
3. **Any `error` finding is the top priority** — it outranks the feature
   backlog, because an error means something on the live site is broken.
4. Otherwise take the largest `warn` cluster, or the top unblocked item from
   the `SESSION-STATE.md` backlog.
5. Fix, run the full gate (`lint && typecheck && test && build`), re-run the
   audit to prove the finding count went **down**, and open a draft PR quoting
   the before/after numbers.
6. Refresh `docs/SESSION-STATE.md` so the next iteration starts clean.

The rule that keeps it honest: **a PR claiming an audit fix must show the
before and after counts.** "Improved SEO" is not a result; "warn 118 → 33" is.

## 4. Current standing

**0 error · 0 warn · 1 info** across all 178 routes.

| Rule | Was | Now |
|---|---|---|
| `csp-blocked` | 1 | 0 |
| `title-too-long` | 54 | 0 |
| `desc-too-long` | 64 | 0 |
| `thin-content` | 1 | 1 |

The remaining `info` is `/resources/financing` at 244 words (min 300). It is
parked deliberately: growing it honestly needs real financing-partner terms
from the owner, and padding a page to clear a word count is the exact failure
mode this harness exists to prevent.

Treat these counts as a ratchet. A change that pushes any of them back up is a
bug in that change, not a new backlog item.

## 5. Deliberate non-goals

- **The audit does not run in CI.** It needs a built, served site and a
  browser; that belongs in the loop, not on every push, where it would add
  minutes to a check that currently takes ~60 seconds.
- **It does not auto-fix.** Every finding here is a copy or design judgement.
  Mechanical rewriting is exactly how sites end up with titles chopped
  mid-word.
- **`net::ERR_ABORTED` on `?_rsc=` requests is not a finding.** That is Next
  cancelling its own route prefetches; it was investigated and is benign.
