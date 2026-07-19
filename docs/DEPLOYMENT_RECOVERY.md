# Deployment Recovery — Verification Record

_Recorded 2026-07-19._

This note documents the state of the site after the premium-remodeling
campaign was rolled back, and confirms production is serving the correct
version. It is documentation only — no application code, config, or
dependencies change.

## What happened

1. A premium remodeling campaign shipped in **PR #76** (`premium-market-launch`)
   and **PR #77** (`premium-campaign-operations`).
2. Both were rolled back: the two merges were reverted and the rollback was
   merged in **PR #78** (`rollback-premium-campaign`), commit `92db1a4`.
3. `92db1a4` is the current `main` and the current Vercel **production**
   deployment. This is the good version, with all projects and services intact.

## Verified state (production)

| Check | Result |
|---|---|
| Production deployment commit | `92db1a4` (rollback merge) |
| Production deployment status | `READY` |
| Live site `www.realelitecontracting.com` | Serving correctly — title, hero ("Built With Military Precision"), services, roofing, estimate flow, city pages, and Projects all present |
| Local `main` vs production | Identical (`92db1a4`), working tree clean |
| Local build (`npm run build`) | Passes (green) |

The "Premium remodeling" copy visible on the live site is the standard brand
tagline (Hero, Footer, Services, About) — not the reverted campaign.

## Open Dependabot PRs (not merged; no production impact)

- **PR #75** — development-dependencies group. Preview build **FAILS**
  (attempts TypeScript 7 / ESLint 10 majors). Do not merge as-is; let
  Dependabot re-scope it, or bump those two back within-range first.
- **PR #74** — production-dependencies group. Preview build passes, but it
  includes a `lucide-react` major bump (0.577 → 1.24). Do a quick visual
  check of icons before merging.

## How to force a fresh production redeploy

Production already serves the good code, so a redeploy is only for peace of
mind. Two clean, git-integrated ways:

1. **Merge this PR to `main`** — any push to `main` triggers a fresh Vercel
   production build and deploy.
2. **Vercel dashboard → Deployments → the `92db1a4` production deployment →
   Redeploy** — re-runs the same commit to production with no code change.

Prefer either of the above over uploading files directly, which would detach
production from the GitHub → Vercel integration.
