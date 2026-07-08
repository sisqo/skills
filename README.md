# skills

A personal collection of [Claude Code](https://claude.com/claude-code) skills. Each skill ships as its **own installable plugin**, so you can add the marketplace once and then install only the skills you want.

Live showcase: [skills.sisqo.dev](https://skills.sisqo.dev)

## Install

```
/plugin marketplace add sisqo/skills
```

Then install individual skills, e.g.:

```
/plugin install code-to-business@skills
```

Each skill's exact install command is on the [showcase page](https://skills.sisqo.dev).

## Structure

```
skills/
├── .claude-plugin/
│   └── marketplace.json              # marketplace manifest, lists every plugin below
├── plugins/
│   └── <plugin-name>/                # one plugin per skill
│       ├── .claude-plugin/
│       │   └── plugin.json           # plugin manifest, points at ./skills
│       └── skills/
│           └── <plugin-name>/
│               └── SKILL.md
├── lib/skills.ts                      # reads plugins/*/skills/*/SKILL.md for the showcase site
└── app/                                # Next.js showcase site (see Development below)
```

## Adding a new skill

1. Create `plugins/<kebab-case-name>/.claude-plugin/plugin.json` (`name`, `description`, `version`, `skills: "./skills/"`) and `plugins/<kebab-case-name>/skills/<kebab-case-name>/SKILL.md`. Required SKILL.md frontmatter: `name`, `description`. Optional: `version`, `license`, `user-invocable`, `argument-hint`, `allowed-tools`.
2. Add an entry for the new plugin to the root `.claude-plugin/marketplace.json`'s `plugins` array (`source: "./plugins/<kebab-case-name>"`). This step is required — plugins aren't auto-discovered, unlike skills within a plugin.
3. The showcase page at `app/page.tsx` picks up the new skill automatically at the next build — no changes needed there.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The showcase page is a Next.js Server Component that reads `plugins/*/skills/*/SKILL.md` at build time, so `npm run build` must succeed for the skill list to render correctly in production.
