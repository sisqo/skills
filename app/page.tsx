import { getSkills } from "@/lib/skills";
import { GitHubLink } from "./github-link";
import { SkillRow } from "./skill-row";

export default async function Home() {
  const skills = await getSkills();

  return (
    <div className="flex min-h-screen justify-center bg-[#07100b]">
      <div className="w-full max-w-[820px] px-6 pb-16 pt-14 sm:px-10 sm:pb-[120px] sm:pt-24">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[var(--accent)]">
            Claude Code · Plugins
          </span>
          <span className="text-sm">
            <GitHubLink href="https://github.com/sisqo/skills" label="GitHub" />
          </span>
        </div>

        <h1 className="m-0 mt-7 text-[clamp(44px,10vw,64px)] font-extrabold leading-[0.95] tracking-[-0.038em] text-[#eef2ef]">
          skills
          <span
            aria-hidden="true"
            className="font-normal text-[var(--accent)] motion-safe:animate-[blink_1.1s_step-end_infinite]"
          >
            _
          </span>
        </h1>
        <p className="mt-5 text-[14px] leading-[1.75] text-[#98a19a] sm:text-justify">
          A personal collection of Claude Code skills, each packaged as its
          own installable plugin. Built to be{" "}
          <strong className="font-semibold text-[#c6d0c9]">
            lightweight and direct
          </strong>{" "}
          —{" "}
          <strong className="font-semibold text-[#c6d0c9]">
            no unnecessary ceremony
          </strong>
          ,{" "}
          <strong className="font-semibold text-[#c6d0c9]">
            just enough structure
          </strong>{" "}
          to get things done well, so you spend more time building and less
          time explaining.
        </p>

        <div className="my-11 h-px bg-[#161b16]" />

        <div className="flex items-baseline gap-3">
          <h2 className="m-0 text-[26px] font-extrabold tracking-[-0.01em] text-[#e9f1ec]">
            Skills
          </h2>
          <span className="text-[12px] text-[#5f6b63]">
            — {skills.length} available
          </span>
        </div>
        <p className="m-0 mt-2 text-[12px] leading-[1.7] text-[#6f7d75] sm:text-justify">
          Each skill is packaged as its own installable plugin. Pick one to
          see what it does, examples, and how to install it.
        </p>

        {skills.length === 0 ? (
          <p className="mt-6 text-[13.5px] text-[#98a19a]">No skills yet.</p>
        ) : (
          <div className="mt-6 flex flex-col">
            {skills.map((skill, index) => (
              <SkillRow
                key={`${skill.pluginSlug}/${skill.slug}`}
                skill={skill}
                index={index}
              />
            ))}
            <div className="border-t border-[rgba(255,255,255,0.06)]" />
          </div>
        )}

        <div className="mb-7 mt-14 h-px bg-[#161b16]" />
        <div className="text-center text-[14px] text-[#6b756e]">
          by{" "}
          <a
            href="https://sisqo.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] no-underline hover:text-[var(--accent-hover)]"
          >
            SisQo
          </a>
        </div>
      </div>
    </div>
  );
}
