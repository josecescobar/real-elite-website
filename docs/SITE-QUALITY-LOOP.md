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
npm run audit:site -- --only /paving,/contact   # just these routes
```

`--only` exists because a full crawl is ~10 minutes, which is long enough to
discourage re-checking a fix at all — and a spot-check chosen by hand is how
you convince yourself a sweep is finished when it isn't. Use it to re-measure
the routes you changed in seconds, then let the full run be the thing you
quote. It rejects routes that are not in the sitemap rather than skipping
them, so a typo cannot come back as a clean result.

It crawls every URL in `sitemap-0.xml` **twice** — once at 1440px for content
and once at 390px for layout — and grades findings.

The mobile pass exists because most traffic to a contractor site is a phone,
and the failures that matter there are invisible at desktop width: a page that
scrolls sideways, or a link too small to hit with a thumb. It measures geometry
only (everything content-shaped is already graded on the desktop pass), and it
is deliberately conservative about what counts as a target — WCAG 2.2 exempts
links presented inside a sentence, so inline text links, visually-hidden skip
links, `aria-hidden` subtrees and off-canvas elements (honeypot fields, closed
drawers) are all excluded. Flagging those buries the real finding.

Findings are graded:

| Level | Meaning | Examples |
|---|---|---|
| **error** | Broken for users or crawlers. Fix before shipping. | CSP-blocked embed, 4xx/5xx, dead internal link, missing alt text, unlabelled form field, invalid JSON-LD, **horizontal overflow on mobile** |
| **warn** | Measurably costs reach or conversion. | Title >60 chars, meta description outside 70–160, LCP >2.5s, CLS >0.1, missing canonical, **tap target under 44px** |
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

And the counts must come from a **full run**, not a sample. A hand-picked
spot-check reflects where you looked, which is exactly where you already
fixed things — it will tell you a sweep is done when whole route families are
still failing. Use `--only` to iterate; quote the full crawl.

## 4. Current standing

**0 error · 0 warn · 1 info** across all 178 routes.

| Rule | First run | Now |
|---|---|---|
| `csp-blocked` | 1 | **0** |
| `title-too-long` | 54 | **0** |
| `desc-too-long` | 64 | **0** |
| `mobile-h-overflow` | — | **0** (clean from the first mobile run) |
| `mobile-tap-target` | 109 | **0** |
| `thin-content` | 1 | 1 (parked, see below) |

Treat the zeroes as a ratchet: a change that pushes any of them back up is a
bug in that change, not a new backlog item.

### How `mobile-tap-target` went 109 → 0

Two tools, and picking the right one per site is the whole job:

- **`.tap-target`** grows the hit box to 44px and pulls the growth back out
  with a negative block margin. Use it for a **lone link in a flow** —
  breadcrumb crumbs, "view all" rails — where the visual position must not
  move.
- **plain `min-h-11`** (scoped `md:min-h-0`) just makes the row taller. Use it
  inside **grids, chip rows and link lists**, where every sibling grows
  together and the container absorbs it.

An earlier revision of this document claimed the dense link lists could not be
swept mechanically, because the negative margin would overlap adjacent grid
rows. That reasoning was only true of `.tap-target`; it was wrong about the
lists themselves. `min-h-11` grows the rows with no overlap at all, and the
sections read the same. Scope it below `md` so desktop spacing is untouched.

Two blind spots in the *rule* were also fixed along the way, and both had let
routes report clean while a real control was undersized:

- `summary` was missing from the audited selector, so guide pages passed while
  their only mobile control sat at 300×20.
- A blanket `li` exemption hid nav controls — `ul > li > a` is standard nav
  markup, so exempting every list item hid table-of-contents anchors at 28px.
  Links genuinely inside a sentence are still caught by the `display: inline`
  test, wherever they sit.

Closing those pushed the warn count **up** (109 → 118) before it came down.
That is the correct behaviour: a count that only ever falls is measuring the
rule, not the site.

### Parked: `thin-content` (1)

`/resources/financing` at 244 words. Growing it honestly needs real
financing-partner terms from the owner, and padding a page to clear a word
count is the exact failure mode this harness exists to prevent.

## 5. Deliberate non-goals

- **The audit does not run in CI.** It needs a built, served site and a
  browser; that belongs in the loop, not on every push, where it would add
  minutes to a check that currently takes ~60 seconds.
- **It does not auto-fix.** Every finding here is a copy or design judgement.
  Mechanical rewriting is exactly how sites end up with titles chopped
  mid-word.
- **`net::ERR_ABORTED` on `?_rsc=` requests is not a finding.** That is Next
  cancelling its own route prefetches; it was investigated and is benign.
