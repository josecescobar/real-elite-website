# 02 — Repository Audit

**Snapshot:** `main @ 6936f15`, working tree clean except one untracked generated file
(`next-env.d.ts`, auto-regenerated — ignore). 187 commits. Remote: `github.com/josecescobar/real-elite-website` (private? — repo is **public**; see §6 risk).

---

## 1. Branch landscape

~40 remote branches, all prefixed `claude/`. Branch hygiene is the headline finding: **the vast
majority are already merged into `main` but were never deleted.**

| State | Count | Action |
|---|---|---|
| Merged into `main` (0 commits ahead) | ~35 | **Delete** — they are pure noise in the branch list. |
| Unmerged, ahead of `main` | 4 | Triage individually (below). |

### Unmerged branches (the only ones that matter)

| Branch | Ahead | Contents | Verdict |
|---|---|---|---|
| `claude/real-elite-competitive-intel-8M4sT` | 3 | Competitive-intelligence report + homepage A+ Paving / instant-quote bands. Branch is **stale** (forks old `main`; diff shows mass deletions vs current `main`). | Cherry-pick the **doc** only; discard the stale code diff. Corresponds to **closed** PR #10. |
| `claude/session-state-and-strategy-docs` | 2 | `docs/OPERATING-MANUAL.md`, `docs/PROJECT-OBJECT-SPEC.md`, `docs/SESSION-STATE.md`. | **Valuable docs.** Rebase & merge the docs (open PR #54). |
| `claude/project-object-spec-docs` | 1 | `docs/PROJECT-OBJECT-SPEC.md` (556 lines). | Superseded by the above / by merged Project System work. Confirm, then delete. |
| `claude/v2-service-answer-block` | 1 | `AnswerBlock` component (GEO/AEO) + `services-data` wiring. | **Wanted feature** (open PR #52). Rebase onto current `main` and merge — it's a Sprint #002 candidate. |

> All four are stale relative to `main` (they pre-date the Project System merge #53), so their diffs
> show large phantom deletions. **Do not merge as-is** — extract the intended additions onto fresh
> branches.

**Recommendation:** run a branch-cleanup pass — delete the ~35 merged branches, re-cut the 2 wanted
features (#52 AnswerBlock, #54 strategy docs) from current `main`. This is a 30-minute hygiene task
that makes the repo legible.

---

## 2. Commit & PR history

- **187 commits**, **54 PRs** (#1–#54), of which **3 are open** (#52 AnswerBlock, #54 strategy docs)
  and **2 closed-unmerged** (#4 superseded audit, #10 competitive-intel-with-code).
- History is clean, conventional-ish (`feat:`, `fix:`, `content:`, `docs:`, `chore:`, `test:`), and
  **every feature landed via PR** — no direct-to-main cowboy commits. Good discipline.
- Narrative arc reconstructable from history: **rebuild (#5) → tests/CI (#6) → audit fixes (#19) →
  paving SEO pillar (#24–31) → NoVA luxury expansion (#36–39) → lead-capture/Twilio (#41–43) → test
  coverage to 227+ (#44–46) → Phase-1 hardening (#50) → v2 blueprint + Project System foundation
  (#51, #53).** The project is mid-transition from **v1 (marketing site)** to **v2 (proof platform)**.

---

## 3. Tooling & config audit

| Config | State | Finding |
|---|---|---|
| `tsconfig.json` | `strict: true`, `@/*` path alias, bundler resolution | ✅ Solid. |
| `eslint.config.mjs` | Flat config, `eslint-config-next/core-web-vitals` | ✅ Modern. Ignores `scripts/**` (so the build scripts are unlinted). |
| **Prettier** | **Absent** | ⚠️ No formatter → style drift risk as contributors grow. Add Prettier + `eslint-config-prettier`. |
| `vitest.config.ts` | jsdom, globals, `@` alias, `src/**/*.test.*` | ✅ Good. No coverage thresholds set. |
| `next.config.ts` | CSP/headers, redirects, image remotePatterns, `turbopack.root` | ✅ Strong; well-commented. |
| `next-sitemap.config.js` | sitemap + robots, excludes OG/icon/manifest + internal tool | ✅ Correct. |
| `postcss.config.mjs` | Tailwind v4 plugin only | ✅ Minimal/correct. |
| `.github/workflows/ci.yml` | lint + typecheck + test + build | ✅ Present. (No deploy preview gating, no coverage upload, no E2E.) |
| **`middleware.ts`** | **Absent** | Neutral today; will be needed for geo-personalization / A-B / redirects at scale. |

---

## 4. Repo hygiene

- **Stray root files:** `content-calendar-march-23-28.md` and `TEST_COVERAGE_ANALYSIS.md` sit in the
  repo root. These are working notes — relocate under `docs/` (or delete `TEST_COVERAGE_ANALYSIS.md`
  now that 238 tests exist and it's stale). Keeps the root clean.
- **Image library:** `public/` holds **95 JPGs, 1 WebP, 1 PNG**. The near-total absence of WebP/AVII in
  committed assets means delivery optimization leans entirely on `next/image` at runtime + the
  `optimize-images.mjs` prebuild. Worth verifying the pipeline actually emits modern formats (see
  [03](03-technical-debt.md) §perf). `.gitignore` correctly excludes the source `/images/` library.
- **`.gitignore`** is thorough (node_modules, .next, .vercel, env files, generated sitemap/robots,
  tsbuildinfo, `.DS_Store`, image originals).

---

## 5. Dependency posture

- **Bleeding-edge majors:** Next 16, React 19, Tailwind 4, Vitest 4, `@types/node` 25. This is a
  deliberate "stay current" stance — good for longevity, but it concentrates upgrade risk (these are
  recent majors with evolving ecosystems). Pin a quarterly dependency-review cadence.
- **`npm audit`:** 5 vulnerabilities reported at install (4 moderate, 1 high). **Not yet triaged.**
  Action: run `npm audit` (review only), assess whether the high is in a runtime path or a transitive
  dev dep, and patch deliberately (not `--force`). Tracked in [03](03-technical-debt.md).
- Versions use caret ranges (`^`) throughout — fine, but combined with no lockfile-audit step in CI it
  means transitive drift is possible between installs. Consider `npm ci` in CI (likely already) and a
  scheduled `audit`.

---

## 6. Risks surfaced by the audit

1. **Repository visibility = PUBLIC.** Confirm this is intended. The code contains no secrets (all via
   env), but a competitor can read the entire GEO/SEO strategy, the blueprint, and the research corpus.
   If the moat is partly strategic, consider making the repo private.
2. **~35 stale branches** obscure the 4 that matter — fixed by the cleanup pass.
3. **Untriaged `npm audit` findings** — low-to-moderate but should be looked at before Sprint #002
   ships.
4. **No Prettier / no coverage thresholds / no E2E** — quality guardrails that get cheaper to add now
   than after more contributors join.

---

## 7. What's healthy (don't "fix" these)

- PR-per-feature discipline with green CI gate.
- Clean, conventional commit messages.
- Strict TS with essentially **zero `any`** in the codebase (one isolated `eslint-disable`/`any`
  family across all of `src`).
- Thoughtful, heavily-commented config files that explain *why*, not just *what*.
</content>
