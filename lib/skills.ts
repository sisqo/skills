import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type SkillExample = {
  command: string;
  description?: string;
};

export type Skill = {
  pluginSlug: string;
  pluginName: string;
  slug: string;
  name: string;
  description: string;
  summary?: string;
  tagline?: string;
  version?: string;
  license?: string;
  userInvocable?: boolean;
  argumentHint?: string;
  examples?: SkillExample[];
  githubUrl: string;
  zipUrl: string;
};

const REPO_ROOT = process.cwd();
const PLUGINS_DIR = path.join(REPO_ROOT, "plugins");
const GITHUB_REPO_URL = "https://github.com/sisqo/skills";

export async function getSkills(): Promise<Skill[]> {
  let pluginSlugs: string[];
  try {
    pluginSlugs = await fs.readdir(PLUGINS_DIR);
  } catch {
    return [];
  }

  const skills: Skill[] = [];

  for (const pluginSlug of pluginSlugs) {
    const pluginDir = path.join(PLUGINS_DIR, pluginSlug);
    const pluginJsonPath = path.join(pluginDir, ".claude-plugin", "plugin.json");

    let pluginName: string;
    let skillsRelDir: string;
    try {
      const pluginRaw = await fs.readFile(pluginJsonPath, "utf-8");
      const pluginData = JSON.parse(pluginRaw);
      if (!pluginData.name) {
        console.warn(`Skipping plugin "${pluginSlug}": plugin.json is missing name`);
        continue;
      }
      pluginName = pluginData.name;
      skillsRelDir = pluginData.skills ?? "./skills/";
    } catch {
      continue;
    }

    const skillsDir = path.join(pluginDir, skillsRelDir);
    let skillSlugs: string[];
    try {
      skillSlugs = await fs.readdir(skillsDir);
    } catch {
      continue;
    }

    for (const slug of skillSlugs) {
      const skillMdPath = path.join(skillsDir, slug, "SKILL.md");
      let raw: string;
      try {
        raw = await fs.readFile(skillMdPath, "utf-8");
      } catch {
        continue;
      }

      const { data } = matter(raw);

      if (!data.name || !data.description) {
        console.warn(`Skipping "${pluginSlug}/${slug}": SKILL.md is missing name or description`);
        continue;
      }

      const examples = Array.isArray(data.examples)
        ? data.examples
            .filter((example: unknown) => {
              const isValid =
                typeof example === "object" &&
                example !== null &&
                typeof (example as { command?: unknown }).command === "string";
              if (!isValid) {
                console.warn(`Skipping an example for "${pluginSlug}/${slug}": missing command`);
              }
              return isValid;
            })
            .map((example: { command: string; description?: string }) => ({
              command: example.command,
              description: example.description,
            }))
        : undefined;

      skills.push({
        pluginSlug,
        pluginName,
        slug,
        name: data.name,
        description: data.description,
        summary: data.summary,
        tagline: data.tagline,
        version: data.version,
        license: data.license,
        userInvocable: data["user-invocable"],
        argumentHint: data["argument-hint"],
        examples,
        githubUrl: `${GITHUB_REPO_URL}/blob/main/${path
          .relative(REPO_ROOT, skillMdPath)
          .split(path.sep)
          .join("/")}`,
        zipUrl: `/downloads/${data.name}.zip`,
      });
    }
  }

  return skills.sort((a, b) => a.name.localeCompare(b.name));
}
