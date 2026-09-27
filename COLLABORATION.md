# Working on This Repo Across Multiple Tools

## Canonical destinations

| What | Where |
|---|---|
| Local folder (shared) | `/Volumes/Silver T7/Projects/real-elite-website` |
| GitHub | https://github.com/josecescobar/real-elite-website |
| Vercel | https://vercel.com/josecapacho-gmailcoms-projects/real-elite-contracting |
| Live site | https://www.realelitecontracting.com |

This folder is the shared local workspace for Cursor, Claude, Codex, Grok, and
Hermes. Tools that open **this path** see the same files immediately — do not
edit the same file in two local tools at once.

Cloud agents (Claude Code on the web, Cursor Cloud, etc.) still have their
**own separate clone**. They cannot see local edits until those changes go
through **GitHub**. GitHub remains the source of truth for anything that is
not sitting in this folder.

Follow these rules and you'll almost never hit a conflict or lose work.

## The Golden Habit: Pull First, Push When Done

Before you start working in **any** tool:

```bash
git pull origin main
```

When you finish something:

```bash
git add -A
git commit -m "describe what you changed"
git push
```

Make this reflexive. It prevents ~95% of all problems.

## The Rules

1. **GitHub is the source of truth.** If a change isn't pushed to GitHub, the
   other tools can't see it — and it may not really exist (see rule 5).

2. **`main` is home base.** All finished work should land on `main`. That's the
   version that deploys and the version every tool clones from. One trunk = no
   confusion about which version is real.

3. **Pull before you start; push when you're done.** Every tool, every session.

4. **Don't edit the same file in two tools at once.** If two tools change the
   same file before either pushes, you get a merge conflict to untangle by hand.
   Divide work by area/feature, or just use one tool at a time.

5. **Never leave unpushed work in a cloud tool.** Cloud clones (like Claude Code
   on the web) are temporary — uncommitted changes can be wiped when the session
   ends. If it's not pushed to GitHub, treat it as gone. Push before you stop.

6. **When switching tools mid-task:** push in the tool you're leaving, then pull
   in the tool you're moving to.

## Note on Branches

- Grok, ChatGPT, and Cursor will typically work directly on `main`.
- Claude Code works on its own `claude/...` branch and merges into `main` via a
  pull request. So Claude's changes reach `main` after a quick merge step.
- Cursor can run two ways: as a **local clone** (the desktop app on your
  computer) or as a **Cloud agent** (e.g. from the mobile app, running on
  Cursor's servers like Claude Code does). Either way, its edits are invisible to
  the other tools until they're pushed — and you pull after they push.
- A Cloud agent's workspace is temporary, so the "never leave unpushed work"
  rule matters most there: anything not committed and pushed can vanish. Cloud
  agents (Claude Code, Cursor Cloud) normally handle this by opening their own
  branch and pull request automatically.

## Quick Reference

| When | Command |
|------|---------|
| Starting work | `git pull origin main` |
| Saving work | `git add -A && git commit -m "..."` then `git push` |
| Check what changed | `git status` |
| See recent history | `git log --oneline -10` |
