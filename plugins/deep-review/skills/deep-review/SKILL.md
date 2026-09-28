---
name: deep-review
description: >-
  Exhaustive bug hunt over recent work. Reviews everything the current branch
  introduced relative to its base (develop/main/master), or — when on main,
  master, or develop — every commit of the last working day, always including
  uncommitted and untracked changes. Hunts correctness bugs, edge cases,
  regressions in callers and contracts, security holes, and severe performance
  regressions through repeated review passes (at least three, then until a
  full pass finds nothing new), verifies each finding by actually running
  build/tests or reproducing it, reports confirmed vs plausible bugs, and only
  fixes what the user picks. Invoke explicitly with /deep-review to thoroughly
  double-check recent changes before merging, pushing, or releasing. Not for
  style or readability review.
user-invocable: true
disable-model-invocation: true
argument-hint: "[git range or base ref — omit to auto-detect from the current branch]"
version: 0.1.0
tagline: "Reviews your recent changes over and over until there's no bug left to find."
summary: >
  A **relentless bug hunt** over what you just built. On a feature branch it
  reviews **everything the branch introduced**; on main or develop, **the
  last working day's commits** — uncommitted work always included. It
  doesn't stop at the first findings: **pass after pass, each from a
  different angle**, until a full pass turns up nothing new. Every suspected
  bug is **verified by running the build, tests, or a reproduction**, so the
  report separates **confirmed** bugs from **plausible** ones. Nothing is
  touched until **you choose what to fix**.
examples:
  - command: "/deep-review"
    description: "On a feature branch: reviews every change since it forked from develop/main, plus uncommitted work. On main/develop: reviews all commits from the last working day. Repeats passes until nothing new turns up, then reports verified findings and asks which to fix."
  - command: "/deep-review HEAD~5..HEAD"
    description: "Reviews an explicit commit range (plus uncommitted work) instead of auto-detecting the scope."
  - command: "/deep-review develop"
    description: "Treats develop as the base and reviews everything the current branch added on top of it."
---

# Deep Review

Find every bug, malfunction, and regression introduced by recent work — and be sure none are left. The first findings are the start of the review, not the end: keep going until repeated, genuinely different passes stop turning up anything new, and back every reported bug with evidence.

## Ground rules

- **Review, don't edit.** Do not change project code until the report is delivered and the user has chosen what to fix.
- **Leave no trace.** At the start, snapshot the working tree's *content*, not just its status: `git stash create` (prints a commit SHA capturing tracked changes without touching the working tree or stash list — empty output means no tracked changes) plus the list of untracked files with their checksums. Before the report, the working tree must match that snapshot exactly. Temporary reproduction files go outside the repo (scratchpad / `mktemp`) whenever possible; if one must live inside the repo to run, delete it right after. Never stash, reset, checkout, or otherwise disturb the user's uncommitted changes, and never run tools that rewrite tracked files during verification: `lint --fix`, formatters in write mode, `npm install` or anything that updates lockfiles, codegen that touches committed files.
- **No outward side effects.** Do not run anything that deploys, publishes, sends messages, migrates a real database, or calls production services. If a test suite needs such things, skip those parts and say so.
- **Evidence over intuition.** A bug is reported with a concrete failure scenario; "this looks off" is a lead to investigate, not a finding.

## 1. Determine the scope

**Explicit argument** (`$ARGUMENTS`), if given, overrides detection:
- A range → review exactly those commits: `git log A..B` for history and `git diff A B` for the change. For `A...B`, use the merge-base as the start: `git diff $(git merge-base A B) B`.
- A single ref (e.g. `develop`, a SHA) → treat it as the base: review `git merge-base <ref> HEAD`..HEAD.

**Otherwise, auto-detect** from `git branch --show-current`:

- **On a work branch** (anything other than `main`, `master`, `develop`): review everything the branch introduced.
  - Base candidates: `develop`, `main`, `master` — local branch if it exists, else `origin/<name>`; skip missing ones.
  - For each candidate, count `git rev-list --count $(git merge-base <candidate> HEAD)..HEAD`. The base is the candidate with the **smallest** count; on a tie prefer `develop`, then `main`, then `master`.
  - Diff: `git diff $(git merge-base <base> HEAD)` (working tree vs merge-base — covers commits and uncommitted tracked changes at once), plus `git log <merge-base>..HEAD` for the per-commit history.
  - No candidate exists → ask the user for the base.
- **On `main`, `master`, or `develop`**: review the **last working day** — the day of the most recent commit on the branch, **by any author**, including every commit of that day by any author.
  - Walk **first-parent history only**, so a merged PR counts as one change on the day it landed (its feature commits carry older dates): `git log --first-parent --date=short-local --format='%H %cd'`.
  - Day: the date of the first line. Day's commits: the contiguous run of lines at the top with that date.
  - Diff: `git diff <oldest>^1` (working tree vs the first parent of the oldest day commit; use the empty tree `4b825dc642cb6eb9a060e54bf8d69288fbee4904` if it is the root commit). For per-commit history, inspect each commit with `git diff <sha>^1 <sha>` — **never** `git show` on a merge commit, whose combined diff is usually empty for a clean merge and would hide the whole merged feature.
- **Detached HEAD** → ask the user for a range or base.

**Include uncommitted work** whenever the reviewed range ends at `HEAD` (always true for auto-detection and for a base ref; for an explicit range only if it ends at `HEAD`): staged and unstaged changes (`git diff HEAD`, already covered by the working-tree diffs above) and untracked, non-ignored files (`git ls-files --others --exclude-standard` — read each in full).

Before reviewing, state the detected scope in one line — mode, base or day, number of commits, number of files — so a wrong detection is visible immediately. If the scope is empty, say so and stop.

## 2. What counts as a bug

In scope:
- **Correctness** — wrong logic, off-by-one, inverted conditions, null/undefined/empty handling, unhandled states, wrong defaults, broken edge cases (empty, boundaries, very large, unicode, timezones/DST, locale), error paths that are missing, swallow errors, or leave state half-updated.
- **Regressions in existing code** — for every changed function, type, API, schema, config key, or behavior: find its callers, implementers, and consumers across the codebase (not just the diff) and check they still work. Include migrations, serialized formats, public interfaces, environment/config expectations, and feature flags.
- **Concurrency and state** — races, reentrancy, stale caches, ordering assumptions, missing cleanup, leaked resources.
- **Security** — injection (SQL, shell, template, path), missing authn/authz or ownership checks, unvalidated input, secrets in code or logs, sensitive data exposure, unsafe deserialization.
- **Severe performance regressions** — N+1 queries, quadratic work on unbounded data, missing pagination or indexes on new queries, unbounded memory growth.

Out of scope: style, naming, readability, duplication, and other code-quality concerns — unless they cause a concrete malfunction.

Context is not limited to the diff: read every touched file in full, and whatever surrounding code is needed to understand the real runtime behavior.

## 3. Review in passes until convergence

Run **at least three passes**, each from a different, explicitly named angle, and each starting again **from the code**, not from the list of earlier findings — re-reading the same notes only reconfirms what was already seen. Suggested angles, in order:

1. **Line by line** — logic and data flow of every hunk; what each change actually does versus what it intends.
2. **Hostile inputs and failure paths** — edge cases, malformed and boundary inputs, every error/exception path, partial failures.
3. **Blast radius** — callers, contracts, schema/config, security, performance.
4. **Further angles** as needed — concurrency and state; how changes from different commits interact; build/config/migration/deploy-time effects; "what did I assume without checking?".

After the third pass, **keep going**: another pass from a new angle each time, until a complete pass produces **no new finding**. There is no maximum. At the start of each pass, name its angle; at the end, note how many new findings it produced.

Keep a running findings list, each with a status: suspected → confirmed / plausible / discarded.

## 4. Verify

- Detect the project's existing tooling (package scripts, Makefile, CI config, test runners) and run what applies: build, type-check, lint, tests — scoped to affected areas if the full suite is too slow. Treat new failures as findings; check whether a failure predates the changes before blaming them.
- For every suspected bug, **try to prove it**: a throwaway test or script that reproduces it, or an explicit trace through the code with concrete input values showing the wrong result.
  - **Confirmed** — reproduced, or demonstrated unambiguously.
  - **Plausible** — strong reasoning but not reproduced; state why it couldn't be.
  - **Discarded** — disproven; drop it from the report.
- If build or tests can't be run (missing deps, needs external services), say so explicitly — never imply they passed.

## 5. Report

- **Header**: scope reviewed, number of passes and their angles, tools run and their results.
- **Findings**, numbered (F1, F2, …) and ordered by severity; for each:
  - `file:line`
  - what is wrong, in one sentence
  - the concrete failure scenario (inputs/state → wrong output or crash)
  - status (Confirmed / Plausible) and how it was verified
  - proposed fix
- **No findings**: say so plainly and list what was checked (areas, callers, edge cases, tools run) — never a bare "looks good".
- Confirm the working tree matches the initial snapshot.

## 6. Fix on request

After the report, ask which findings to fix via AskUserQuestion — e.g. "All confirmed", "All", "None", with "Other" for a list of IDs. Apply only the chosen fixes, then rerun the relevant build/tests and the reproduction for each fixed finding to show it now passes. Report anything that still fails.
