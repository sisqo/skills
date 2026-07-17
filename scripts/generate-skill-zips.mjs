import fs from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { ZipArchive } from "archiver";

const ROOT = process.cwd();
const PLUGINS_DIR = path.join(ROOT, "plugins");
const OUTPUT_DIR = path.join(ROOT, "public", "downloads");

async function findSkills() {
  const pluginSlugs = await fs.readdir(PLUGINS_DIR).catch(() => []);
  const skills = [];

  for (const pluginSlug of pluginSlugs) {
    const pluginDir = path.join(PLUGINS_DIR, pluginSlug);
    const pluginJsonPath = path.join(pluginDir, ".claude-plugin", "plugin.json");

    let skillsRelDir;
    try {
      const pluginData = JSON.parse(await fs.readFile(pluginJsonPath, "utf-8"));
      skillsRelDir = pluginData.skills ?? "./skills/";
    } catch {
      continue;
    }

    const skillsDir = path.join(pluginDir, skillsRelDir);
    const slugs = await fs.readdir(skillsDir).catch(() => []);

    for (const slug of slugs) {
      const skillDir = path.join(skillsDir, slug);
      const skillMdPath = path.join(skillDir, "SKILL.md");
      let name;
      try {
        const raw = await fs.readFile(skillMdPath, "utf-8");
        name = matter(raw).data.name;
      } catch {
        continue;
      }
      if (!name) continue;
      skills.push({ name, skillDir });
    }
  }

  return skills;
}

function zipSkill(skill) {
  return new Promise((resolve, reject) => {
    const zipPath = path.join(OUTPUT_DIR, `${skill.name}.zip`);
    const output = createWriteStream(zipPath);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    output.on("close", resolve);
    archive.on("error", reject);
    archive.pipe(output);
    archive.directory(skill.skillDir, skill.name);
    archive.finalize();
  });
}

async function main() {
  await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const skills = await findSkills();
  for (const skill of skills) {
    await zipSkill(skill);
  }

  console.log(`Generated ${skills.length} skill zip(s) in public/downloads/`);
}

main().catch((err) => {
  console.error("Failed to generate skill zips:", err);
  process.exit(1);
});
