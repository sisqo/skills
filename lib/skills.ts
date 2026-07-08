import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type Skill = {
  slug: string;
  name: string;
  description: string;
  version?: string;
  license?: string;
};

const SKILLS_DIR = path.join(process.cwd(), "plugin", "skills");

export async function getSkills(): Promise<Skill[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(SKILLS_DIR);
  } catch {
    return [];
  }

  const skills: Skill[] = [];

  for (const slug of entries) {
    const skillMdPath = path.join(SKILLS_DIR, slug, "SKILL.md");
    let raw: string;
    try {
      raw = await fs.readFile(skillMdPath, "utf-8");
    } catch {
      continue;
    }

    const { data } = matter(raw);

    if (!data.name || !data.description) {
      console.warn(`Skipping "${slug}": SKILL.md is missing name or description`);
      continue;
    }

    skills.push({
      slug,
      name: data.name,
      description: data.description,
      version: data.version,
      license: data.license,
    });
  }

  return skills.sort((a, b) => a.name.localeCompare(b.name));
}
