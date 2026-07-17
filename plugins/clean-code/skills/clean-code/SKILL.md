---
name: clean-code
description: >-
  Write, refactor, and review readable, maintainable code in any programming
  language through disciplined naming, small single-purpose functions, comment
  discipline, clean error handling, and clean tests. Invoke explicitly with
  /clean-code to write clean code, follow clean-code principles, clean up or
  refactor for clarity, improve naming, shorten a long function, reduce
  complexity or duplication, separate concerns, fix code smells, tighten error
  handling, work test-first or do TDD, or review a pull request for
  readability and quality.
user-invocable: true
disable-model-invocation: true
version: 1.1.0
summary: >
  Bakes **disciplined naming, small single-purpose functions, comment
  hygiene, clean error handling, and test-first habits** into any code you
  write, change, or review — **automatically**, without needing to ask for
  "clean code" by name. **Six reference guides** (naming, functions,
  comments/formatting, error handling, testing, code smells) carry the
  language-agnostic rules plus per-language idiom notes, **loaded on
  demand** instead of all at once.
examples:
  - command: "/clean-code write a function to validate a coupon code"
    description: "Writes the function applying clean-code discipline from the start — descriptive names, a single-purpose function, explicit error handling."
  - command: "/clean-code this function is 200 lines long, clean it up"
    description: "Diagnoses the code smells (long function, duplication, mixed abstraction levels) and refactors in small, tested steps, extracting well-named helpers."
  - command: "/clean-code review this PR for readability"
    description: "Scores the diff against the six clean-code disciplines and reports concrete gaps to close before merge."
---

# Clean Code

Language-agnostic engineering standards for any code you write, change, or
review while this skill is active. Apply them in whatever language the project
uses, respecting its idioms.

## Core principle

**Code is read far more often than written — optimize for the reader.** Names
reveal intent, functions tell a story one step at a time, and you always leave
the code cleaner than you found it. When speed and cleanliness conflict, choose
clean unless there's a real emergency; if a shortcut is unavoidable, contain it
and make it obvious.

## How to work (delivery)

The user wants working code, not a programming lesson.

- **Write the code, don't narrate it.** Implement the feature, fix the bug. Skip
  "First we import…" / "Now I'll…".
- **Don't over-engineer** (KISS/YAGNI). No speculative abstractions, factory for
  two objects, `utils.ts` with one helper, or unrequested config knobs.
- **Match the codebase** — follow its existing style and idioms.
- **Ask only when the requirement is genuinely unclear;** otherwise proceed on a
  sensible default. Explain only a non-obvious tradeoff or risky change.

## Core disciplines

Six disciplines cover most of clean code. Each has a reference file with
rationale, before/after examples, and — where idioms differ — per-language
guidance. Read the matching file when a rule needs interpretation or you hit a
non-obvious call; don't load them all preemptively.

**1. Meaningful names** — A name should tell you why it exists, what it does, and
how it's used; if it needs a comment to explain it, rename it. Reveal intent
with domain language, avoid vague fillers (`data`, `manager`, `temp`), classes
are nouns and methods are verbs, booleans read as predicates (`isActive`), one
word per concept, name length grows with scope, no type encodings.
→ [references/naming-conventions.md](references/naming-conventions.md)

**2. Functions** — Small, one thing at one level of abstraction, few arguments.
Prefer 0–2 args (group extras into an object); flag/selector arguments mean the
function does two things — split it. Command–Query Separation (change state or
return an answer, not both); make side effects explicit; read top-down (callers
above callees).
→ [references/functions-and-methods.md](references/functions-and-methods.md)

**3. Comments and formatting** — The best comment is a well-named function or
constant. When warranted, comments explain *why*, never *what*. Delete
redundant, obsolete, and commented-out code (version control remembers); keep
legal headers, genuine intent, warnings, referenced TODOs, and API docs.
Automate formatting (Prettier, Black, gofmt).
→ [references/comments-formatting.md](references/comments-formatting.md)

**4. Error handling** — A concern separate from business logic; keep the happy
path readable. Fail fast, never swallow errors silently, catch specific
exceptions. In exception-based languages prefer exceptions over return codes; in
languages where errors are values (Go's `error`, Rust's `Result`), follow that
idiom — the underlying rules (context, no silent swallowing) still apply. Give
every error context; don't return or pass null (use empty collections,
`Optional`, Null Object, or throw); wrap third-party APIs behind your own
boundary.
→ [references/error-handling.md](references/error-handling.md)

**5. Unit testing** — Tests are first-class code; dirty tests are worse than
none. Default to test-first (TDD) where the project has a test harness; always
add regression coverage before fixing a bug.
One concept per test, Arrange–Act–Assert, name by behavior
(`shouldRejectExpiredToken`). Follow F.I.R.S.T.; mock time/network/filesystem;
test boundaries and error paths.
→ [references/testing-principles.md](references/testing-principles.md)

**6. Code smells and refactoring** — Smells signal deeper design problems; name
them and apply the targeted refactoring. Watch for too many/flag arguments, dead
functions, duplication (the most important), wrong abstraction level, feature
envy, magic numbers. Remove duplication at the right level of *meaning* (rule of
three); refactor in small tested steps, never alongside a feature.
→ [references/code-smells.md](references/code-smells.md)

## Before editing any file: check the blast radius

A change is only clean if it doesn't quietly break its neighbors. Before editing,
find what imports the file, what it imports, and what tests cover it — then edit
the file *and* its dependents in the same task. Never leave broken imports or
half-updated call sites.

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Abbreviating names / cryptic one-liners | Full descriptive names; named steps |
| Comment instead of refactor | Extract a well-named function |
| Catching generic exceptions | Catch specific types; let the rest propagate |
| No tests for error paths | Test every branch and boundary |
| Returning null everywhere | Optional, empty collection, or Null Object |
| God functions / classes | Split by responsibility (SRP) |
| Refactoring without tests | Add characterization tests first |
| Premature or speculative abstraction | KISS/YAGNI — build what's asked, optimize measured bottlenecks |

## Definition of done

A change is done only when: it's **correct** (edge cases included); **complete**
(all touched files and dependents updated, no broken imports); **clean** (touched
code cleaner than before, no obvious duplication or dead code); **tested**
(relevant tests exist and pass); and **verified** (lint and types pass, actually
run — not assumed). If any fails, fix it before reporting done.

## Quick diagnostic (reviewing existing code)

A "no" points to the discipline (§) to apply: understand each function without
reading its body (§1)? functions short and single-purpose (§2)? no
commented-out/dead code (§3, §6)? error handling separate from the happy path
(§4)? one reason to change per class/module (§6)? a test per public behavior and
error path, named by behavior (§5)? duplication below the rule-of-three
threshold, magic numbers named (§6, §1)?

For a review deliverable you can score the code 0–10 against these disciplines
and report the gaps to reach 10 — but when *writing* code, just apply them.

## Further reading

Grounded in Robert C. Martin's ("Uncle Bob") *Clean Code*, *The Clean Coder*,
*Clean Architecture*, *Clean Agile*, and Martin Fowler's *Refactoring*. The core
stance: the only way to go fast is to go well.
