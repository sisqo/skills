import type { ReactNode } from "react";
import { getSkills, type Skill } from "@/lib/skills";
import { InstallUse } from "./install-use";

function withEmphasis(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.startsWith("**") ? (
        <strong key={i} className="font-semibold text-[#c4ccc6]">
          {part.slice(2, -2)}
        </strong>
      ) : (
        part
      ),
    );
}

function GitHubLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-[6px] text-[#8a938c] no-underline transition-colors hover:text-[var(--accent-hover)]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        width="13"
        height="13"
        fill="currentColor"
      >
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
      {label}
    </a>
  );
}

function CardSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[14px] border-t border-[#232b24] pt-6">
      <div className="flex items-center gap-[9px]">
        <span className="h-[5px] w-[5px] shrink-0 rounded-[1px] bg-[var(--accent)]" />
        <span className="text-xs font-bold tracking-[2px] text-[#d6ddd8]">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function SkillIndex({ skills }: { skills: Skill[] }) {
  return (
    <nav aria-label="Jump to skill" className="mt-5 flex flex-wrap gap-2">
      {skills.map((skill) => (
        <a
          key={`${skill.pluginSlug}/${skill.slug}`}
          href={`#skill-${skill.slug}`}
          className="rounded-md border border-[#1a201b] bg-[#0d100e] px-3 py-[6px] font-mono text-[12.5px] text-[#98a19a] no-underline transition-colors hover:border-[color-mix(in_srgb,var(--accent)_45%,transparent)] hover:text-[var(--accent)]"
        >
          {skill.name}
        </a>
      ))}
    </nav>
  );
}

export default async function Home() {
  const skills = await getSkills();

  return (
    <div className="flex min-h-screen justify-center bg-[#080a08]">
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
        <p className="mt-5 max-w-[56ch] text-[14px] leading-[1.75] text-[#98a19a]">
          A personal collection of Claude Code skills, each packaged as its
          own installable plugin. Install via the Claude Code marketplace, or
          download any skill as a .zip for Claude.ai.
        </p>

        <div className="my-11 h-px bg-[#161b16]" />

        <div className="flex items-baseline gap-3">
          <h2 className="m-0 text-xl font-bold tracking-[-0.5px] text-[#eef2ef]">
            Skills
          </h2>
          <span className="text-xs text-[#5a625c]">
            — {skills.length} available
          </span>
        </div>

        {skills.length > 1 && <SkillIndex skills={skills} />}

        {skills.length === 0 ? (
          <p className="mt-6 text-[13.5px] text-[#98a19a]">No skills yet.</p>
        ) : (
          <ul className="mt-6 flex flex-col gap-7">
            {skills.map((skill) => (
              <li
                key={`${skill.pluginSlug}/${skill.slug}`}
                id={`skill-${skill.slug}`}
                className="flex scroll-mt-6 flex-col gap-6 rounded-2xl border border-[#1a201b] bg-[#0d100e] p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <span className="rounded-lg border border-[color-mix(in_srgb,var(--accent)_25%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-[14px] py-[7px] font-mono text-[18px] font-semibold text-[var(--accent)]">
                    {skill.name}
                  </span>
                  <div className="flex items-center gap-[14px] pt-[6px] text-[13.5px] text-[#6b756e]">
                    <GitHubLink href={skill.githubUrl} label="GitHub" />
                    {skill.version && <span>v{skill.version}</span>}
                  </div>
                </div>

                <p className="m-0 text-[13.5px] leading-[1.75] text-[#98a19a] sm:text-justify">
                  {withEmphasis(skill.summary ?? skill.description)}
                </p>

                {skill.userInvocable && (
                  <CardSection label="USAGE">
                    <div className="whitespace-pre-wrap break-words rounded-lg border border-[#1a201b] bg-[#0a0c0a] px-[14px] py-3 text-[13px] text-[#c4ccc6]">
                      <span className="text-[var(--accent)]">$ </span>/
                      {skill.name}
                      {skill.argumentHint && (
                        <span className="text-[#7a827c]">
                          {" "}
                          {skill.argumentHint}
                        </span>
                      )}
                    </div>
                  </CardSection>
                )}

                {skill.examples && skill.examples.length > 0 && (
                  <CardSection label="EXAMPLES">
                    {skill.examples.map((example) => (
                      <div
                        key={example.command}
                        className="flex flex-col gap-[7px] border-l-2 border-l-[var(--accent)] py-[2px] pl-4"
                      >
                        <div className="text-[12.5px] text-[var(--accent)]">
                          {example.command}
                        </div>
                        {example.description && (
                          <p className="m-0 text-[12px] leading-[1.7] text-[#7a827c]">
                            {example.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </CardSection>
                )}

                <InstallUse
                  installCommand={`/plugin install ${skill.pluginName}@skills`}
                  zipUrl={skill.zipUrl}
                  zipName={`${skill.name}.zip`}
                />
              </li>
            ))}
          </ul>
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
