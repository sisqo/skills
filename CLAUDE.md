# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Two things at once, sharing one git tree:

1. A **Claude Code plugin marketplace** — `sisqo/skills` on GitHub, installable via `/plugin marketplace add sisqo/skills`. Each skill ships as its own plugin (not bundled into one shared plugin), so users install only what they want.
2. A **Next.js showcase site** (`skills.sisqo.dev`, Vercel project `sisqoz/skills`) that lists the installable skills by reading the marketplace's own files at build time.

## Commands

```bash
npm install
npm run dev      # dev server, next dev --turbopack
npm run build    # production build, next build --turbopack
npm run lint      # eslint
```

No test suite exists in this repo.

## Manifest chain

```
.claude-plugin/marketplace.json        # lists every plugin; source: "./plugins/<name>"
plugins/<plugin-name>/
├── .claude-plugin/plugin.json         # plugin manifest; skills: "./skills/"
└── skills/<plugin-name>/SKILL.md      # the skill itself (frontmatter + instructions)
```

Adding a skill is a **two-step, non-auto-discovered** process: create the `plugins/<name>/` folder (plugin.json + SKILL.md), *and* add an entry for it to the root `marketplace.json`'s `plugins` array — unlike skills-within-a-plugin, plugins are not auto-discovered by the marketplace. See the README's "Adding a new skill" section for the exact fields.

Validate manifests with `claude plugin validate <path>` — point it at a plugin directory (or a `plugin.json`/`marketplace.json` path directly), not at a `SKILL.md` file; it only understands the JSON manifests, not skill files.

## SKILL.md frontmatter: two audiences, don't mix them up

- `name`, `description`, `version`, `license`, `user-invocable`, `argument-hint`, `allowed-tools` — read by Claude Code itself to decide when/how to invoke the skill. `description` in particular is deliberately keyword-dense, third-person "use when..." phrasing aimed at Claude's own routing, not at a human reader.
- `summary` and `examples` (array of `{command, description}`) — custom fields understood only by `lib/skills.ts`, ignored by Claude Code's skill loader. These exist purely so the showcase page can show human-friendly copy and usage examples without that content ever being sent to Claude as part of the skill's operational instructions. When editing what a skill *says on the website*, edit these; when editing what a skill *does*, edit the body/`description`.

## Showcase page architecture

`lib/skills.ts` walks `plugins/*/.claude-plugin/plugin.json` (for the plugin name) and `plugins/*/skills/*/SKILL.md` (via `gray-matter` frontmatter parsing) to build the skill list. `app/page.tsx` is an `async` Server Component that calls it directly with `fs`.

This must stay statically rendered (`next build` output should show `○` / "Static" for `/`): no `dynamic = "force-dynamic"`, no `cookies()`/`headers()`/`searchParams` in that component. Static rendering means the `fs` reads happen once at build time and get baked into the output — if the route ever becomes dynamic, Vercel's file-tracing can fail to bundle `plugins/**` into the serverless function and break in production while still working locally. If dynamic rendering is ever required, add `outputFileTracingIncludes: { "/": ["./plugins/**"] }` to `next.config.ts` first.

## Per-skill zip downloads (Claude.ai import)

Each skill card on the showcase page also links to a `.zip` of that skill,
for uploading as a Custom Skill in Claude.ai (Settings → Capabilities →
Skills). These zips are **generated at build/dev time**, not committed:

```
scripts/generate-skill-zips.mjs   # walks plugins/*/skills/*, zips each with archiver
public/downloads/<skill-name>.zip # output, gitignored, one per skill
```

The script runs via npm's `predev`/`prebuild` hooks (`package.json`), so it
fires automatically on `npm run dev` and `npm run build` — but not on a bare
`next dev`/`next build`. Zip filenames use the skill's frontmatter `name`
(must stay unique across the whole marketplace).

Per Claude.ai's upload requirement, each zip's **root is the skill's own
folder** (e.g. `ask-me/SKILL.md`, `clean-code/references/*.md`), not the
files loose at the zip root — `archive.directory(skillDir, skill.name)`
handles this. `lib/skills.ts`'s `zipUrl` field just points at
`/downloads/<name>.zip` by convention; it doesn't touch the filesystem, so
it stays safe under the static-rendering constraint above.

`archiver` is a **devDependency only** (build-time tool, never bundled into
the app) — note its current major version (8.x) is ESM-only, hence the
script is a `.mjs` file.

## Node version constraint

This is developed against a sandbox with only Node 18.20.8 (no nvm/fnm/asdf). That's why dependencies are pinned rather than left on `latest`:
- Next.js at `15.5.19` — `create-next-app@latest`/Next 16.x require Node ≥20.9.
- Tailwind at `3.4.19`, not v4 — v4's `@tailwindcss/oxide` native binding doesn't resolve on this Node/arch combo (`npm install` succeeds silently, but `next build`/`next dev` fail).

Vercel's build environment runs Node 24.x, so this only affects local dev — but don't casually bump Next or Tailwind without checking the local build still works.

## Deployment

Vercel project `sisqoz/skills` (note: Vercel org scope is `sisqoz`, GitHub org is `sisqo` — different strings). Auto-deploys on push to `main`. Custom domain `skills.sisqo.dev` is a Vercel-managed domain/alias, configured via `vercel domains add`, not a separate DNS step.
