---
name: code-to-business
description: Analyzes a codebase (an explicitly named path/module or a business concept to locate) and produces a jargon-free descriptive text for non-technical teams. Arguments are all optional in the string — a free-form topic (path or business concept), an `--audience management|product|sales|support` flag, and a `--depth short|standard|deep` flag, in any order. No topic given → ask the user what to analyze. No --audience given and not deducible from the conversation → ask, bundled with the scope-confirmation round below. No --depth given → default to standard. Always explores the topic first and confirms scope with the user — even for an explicit path, in case it should be expanded — before writing anything; expect a short back-and-forth, not an instant answer. Invoke explicitly with /code-to-business to explain a feature, module, flow, or rule found in code to a business audience (management, product, stakeholders, sales, support) — e.g. "/code-to-business loyalty points --audience sales", "/code-to-business src/billing/refunds --audience management --depth short". Do NOT use it when the explanation is technical and aimed at developers.
user-invocable: true
disable-model-invocation: true
argument-hint: "[topic-or-path — omit to be asked] [--audience management|product|sales|support] [--depth short|standard|deep]"
version: 0.2.0
summary: >
  Turn any part of your codebase into a brief anyone can understand. Name a
  module or just describe the concept — "how password resets work" — and it
  finds the relevant code, then explains it in plain language, with zero
  technical jargon. It checks in with you first to confirm exactly what's in
  scope, so the brief covers what you actually meant, not a guess. Tailor the
  result to your audience (management, product, sales, or support) and choose
  how much detail you want. Perfect for stakeholder updates, product docs, or
  answering "wait, how does this actually work?"
examples:
  - command: "/code-to-business loyalty points --audience sales"
    description: "Explores the loyalty points logic, confirms scope with you (e.g. earning vs. redemption), then writes a sales-facing brief at standard depth."
  - command: "/code-to-business src/billing/refunds --audience management --depth short"
    description: "Even with an explicit path, still explores for related areas (e.g. refund notifications) and confirms scope before writing a ~100-word brief for management."
  - command: "/code-to-business how password resets work --audience support --depth deep"
    description: "Business concept, not a path — explores broadly, confirms which flows to cover, then writes an in-depth support-facing brief."
  - command: "/code-to-business checkout flow"
    description: "Topic given, no --audience: asks for audience together with the scope-confirmation questions, in one round."
  - command: "/code-to-business"
    description: "No arguments at all: asks what to analyze before exploring."
---

# Code to Business

Turns a codebase read-through into a text that non-coders can understand. Generic, not tied to any project.

## Arguments

Parse from `$ARGUMENTS`, in any order:

- **Topic** (free-form, everything that isn't a flag): a path/module or a business concept. If absent, ask the user what to analyze.
- **`--audience`**: one of `management`, `product`, `sales`, `support`. If absent and not deducible from the conversation, ask for it — bundled into the scope-confirmation round in step 2, not asked as a separate interruption.
- **`--depth`**: `short` (~100 words, essentials only), `standard` (150–400 words, default), `deep` (up to ~800 words, includes edge cases and known limitations). The scope-confirmation checkpoint (step 2) always runs regardless of `--depth` — it's about getting the scope right, not about output length, so `short` doesn't skip it.

## Process

### 1. Explore

Light, structural pass — find where the topic lives, without yet reading deeply for business logic (that's step 3).

- **Explicit path/module**: confirm it exists, then look for closely related code that might extend the scope — imports/callers/callees, sibling files in the same area, shared domain terms. A named path doesn't guarantee it's the whole picture.
- **Business concept**: locate via keyword search on domain terms first, falling back to structural exploration of the project tree if that yields nothing clear.

Produce a short map: the core area, plus up to 5 related candidate areas (each with a one-line reason it might be relevant — never just a bare list of paths), and, if the topic's wording could genuinely mean distinct things (e.g. "loyalty points" → earning vs. redemption vs. expiry), the distinct interpretations found.

### 2. Confirm scope

Always pause here before analyzing — even when step 1 found nothing ambiguous and no related areas, state what was found and confirm before proceeding. The point is a checkpoint before the more expensive work in steps 3–4, not just resolving ambiguity when it happens to exist.

In one round:

- If related candidate areas were found: ask which to include — multi-select, since more than one may be relevant.
- If the topic has genuinely distinct interpretations: ask which apply — also multi-select; if the user picks more than one, step 4 covers all of them in a single cohesive brief.
- If `--audience` wasn't given: ask it here too, in the same round — don't defer it to a separate interruption later.

Present candidates, interpretations, and the audience choice as a structured choice when a choice-based tool is available; fall back to a plain question in chat otherwise.

One round is the default. Allow at most one follow-up round, and only if the user's answer itself surfaces a new area or interpretation that step 1 hadn't found — don't keep iterating beyond that.

### 3. Read the relevant code

Read every area confirmed in step 2 — not just the one initially named. Focus on *what happens and why*, not *how it is implemented*: entry points, business rules, conditions, thresholds, and configuration that affect observable behavior. Tests can help reveal edge cases but are never cited. Skip implementation details that don't change the substance for a business reader.

If the code's actual behavior contradicts what the user seems to expect, flag the discrepancy separately from the business text.

### 4. Write the final text

Tailor emphasis to the audience: `management` → outcomes, risks, costs; `product` → user-facing behavior, rules, edge cases; `sales` → customer-visible value, what can/can't be promised; `support` → what users experience, common situations, and their causes.

- **Zero technical jargon**: no class, function, endpoint, framework, or library names, no code snippets or file paths. Translate every technical rule into business language (not "if `discountRate > threshold`" but "if the discount exceeds a certain limit, defined for...").
- **Sections with subheadings**: *What it does* (purpose in 1–2 sentences), *How it works* (main flow as understandable steps, including business rules), *Impact* (who it affects, which metrics/processes it touches, relevant constraints). Add sections like *Known limitations* if warranted (always in `deep`), but always keep the section structure.
- **Length**: per `--depth` (default standard, 150–400 words) — but if step 2 confirmed multiple areas/interpretations combined into one brief, treat this as a target rather than a hard cap: extend as needed to stay coherent across everything in scope, without padding.
- **Language**: follow the conversation's language, section headings included.
- **Output**: text/markdown in chat; no file export unless explicitly requested.
