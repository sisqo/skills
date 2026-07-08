# skills

A personal collection of [Claude Code](https://claude.com/claude-code) skills, packaged as a single installable plugin marketplace.

Live showcase: [skills.sisqo.dev](https://skills.sisqo.dev)

## Install

```
/plugin marketplace add sisqo/skills
/plugin install skills@skills
```

## Structure

```
skills/
├── .claude-plugin/
│   └── marketplace.json        # marketplace manifest
├── plugin/
│   ├── .claude-plugin/
│   │   └── plugin.json         # plugin manifest, points at ./skills
│   └── skills/
│       └── <skill-name>/
│           └── SKILL.md        # one folder per skill
├── lib/skills.ts                # reads plugin/skills/*/SKILL.md for the showcase site
└── app/                         # Next.js showcase site (this README's Development section)
```

## Adding a new skill

1. Create `plugin/skills/<kebab-case-name>/SKILL.md` with YAML frontmatter. Required fields: `name`, `description`. Optional: `version`, `license`, `user-invocable`, `argument-hint`, `allowed-tools`.
2. No separate registration step — the showcase page at `app/page.tsx` picks up any folder with a valid `SKILL.md` automatically at build time.
3. Bump the `version` in `plugin/.claude-plugin/plugin.json`.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The showcase page is a Next.js Server Component that reads `plugin/skills/*/SKILL.md` at build time, so `npm run build` must succeed for the skill list to render correctly in production.
