---
name: code-to-business
description: Analyzes a codebase (an explicitly named path/module or a business concept to locate) and produces a jargon-free descriptive text for non-technical teams. Arguments are all optional in the string — a free-form topic (path or business concept), an `--audience management|product|sales|support` flag, and a `--depth short|standard|deep` flag, in any order. No topic given → ask the user what to analyze. No --audience given and not deducible from the conversation → ask before writing. No --depth given → default to standard. Use this skill whenever the user asks to explain a feature, module, flow, or rule found in code to a business audience (management, product, stakeholders, sales, support), even if they don't say "business" — e.g. "/code-to-business loyalty points --audience sales", "explain how X works for the product team", "brief for stakeholders on Z", "translate this logic into plain terms". Do NOT use it when the explanation is technical and aimed at developers.
user-invocable: true
argument-hint: "[topic-or-path — omit to be asked] [--audience management|product|sales|support] [--depth short|standard|deep]"
summary: >
  Turn any part of your codebase into a brief anyone can understand. Name a
  module or just describe the concept — "how password resets work" — and it
  finds the relevant code, then explains it in plain language, with zero
  technical jargon. Tailor the result to your audience (management, product,
  sales, or support) and choose how much detail you want. Perfect for
  stakeholder updates, product docs, or answering "wait, how does this
  actually work?"
examples:
  - command: "/code-to-business loyalty points --audience sales"
    description: "Locates the loyalty points logic, writes a sales-facing brief at standard depth."
  - command: "/code-to-business src/billing/refunds --audience management --depth short"
    description: "Explicit path, ~100-word brief for management."
  - command: "/code-to-business how password resets work --audience support --depth deep"
    description: "Business concept (not a path), in-depth support-facing brief including edge cases and known limitations."
  - command: "/code-to-business checkout flow"
    description: "Topic given, no --audience: asks which audience before writing anything."
  - command: "/code-to-business"
    description: "No arguments at all: asks what to analyze before proceeding."
---

# Code to Business

Turns a codebase read-through into a text that non-coders can understand. Generic, not tied to any project.

## Arguments

Parse from `$ARGUMENTS`, in any order:

- **Topic** (free-form, everything that isn't a flag): a path/module or a business concept. If absent, ask the user what to analyze.
- **`--audience`**: one of `management`, `product`, `sales`, `support`. If absent and not deducible from the conversation, ask before writing — never assume a default.
- **`--depth`**: `short` (~100 words, essentials only), `standard` (150–400 words, default), `deep` (up to ~800 words, includes edge cases and known limitations).

## Process

### 1. Identify the code to analyze

The topic may be an explicit path/module (go straight there) or a business concept (e.g. "how we calculate loyalty points"): locate it via keyword search on domain terms first, falling back to structural exploration of the project tree if that yields nothing clear.

If the topic is ambiguous or spread across unrelated modules, do not guess: stop and ask the user, listing the candidate areas found so far.

### 2. Read the relevant code

Focus on *what happens and why*, not *how it is implemented*: entry points, business rules, conditions, thresholds, and configuration that affect observable behavior. Tests can help reveal edge cases but are never cited. Skip implementation details that don't change the substance for a business reader.

If the code's actual behavior contradicts what the user seems to expect, flag the discrepancy separately from the business text.

### 3. Write the final text

Tailor emphasis to the audience: `management` → outcomes, risks, costs; `product` → user-facing behavior, rules, edge cases; `sales` → customer-visible value, what can/can't be promised; `support` → what users experience, common situations, and their causes.

- **Zero technical jargon**: no class, function, endpoint, framework, or library names, no code snippets or file paths. Translate every technical rule into business language (not "if `discountRate > threshold`" but "if the discount exceeds a certain limit, defined for...").
- **Sections with subheadings**: *What it does* (purpose in 1–2 sentences), *How it works* (main flow as understandable steps, including business rules), *Impact* (who it affects, which metrics/processes it touches, relevant constraints). Add sections like *Known limitations* if warranted (always in `deep`), but always keep the section structure.
- **Length**: per `--depth` (default standard, 150–400 words).
- **Language**: follow the conversation's language, section headings included.
- **Output**: text/markdown in chat; no file export unless explicitly requested.
