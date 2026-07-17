import { getSkills } from "@/lib/skills";
import { CopyButton } from "./copy-button";

function FieldLabel({ children }: { children: string }) {
  return (
    <div className="mb-[10px] text-[11px] tracking-[2px] text-[#6b6b70]">
      {children}
    </div>
  );
}

function ShellCommand({ command }: { command: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#23232a] bg-[#0e0e11]">
      <div className="flex items-center justify-between border-b border-[#1c1c22] bg-[#111116] px-[15px] py-[9px]">
        <div className="flex items-center gap-2">
          <span className="inline-block h-[9px] w-[9px] rounded-full bg-[var(--accent)]" />
          <span className="text-[11px] tracking-[1.5px] text-[#5f5f66]">
            SHELL
          </span>
        </div>
        <CopyButton text={command} />
      </div>
      <div className="flex gap-[10px] px-[18px] py-[17px] text-sm leading-[1.6] text-[#e6e6e6]">
        <span className="text-[var(--accent)]">$</span>
        <span>{command}</span>
      </div>
    </div>
  );
}

function InstallCommand({ command }: { command: string }) {
  return (
    <div className="flex items-center justify-between gap-[14px] rounded-lg border border-[#23232a] bg-[#0a0a0c] px-[15px] py-3">
      <span className="whitespace-pre-wrap break-words text-[13.5px]">
        <span className="text-[var(--accent)]">$ </span>
        {command}
      </span>
      <CopyButton text={command} />
    </div>
  );
}

export default async function Home() {
  const skills = await getSkills();

  return (
    <div className="flex min-h-screen justify-center bg-[#0a0a0b]">
      <div className="w-full max-w-[820px] px-6 pb-16 pt-14 sm:px-10 sm:pb-[120px] sm:pt-24">
        <div className="mb-[22px] flex items-center justify-between gap-3">
          <span className="text-xs uppercase tracking-[2.5px] text-[var(--accent)]">
            Claude Code · Plugins
          </span>
          <a
            href="https://github.com/sisqo/skills"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-[7px] text-xs text-[#9a9aa0] no-underline transition-colors hover:text-[#e6e6e6]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              width="15"
              height="15"
              fill="currentColor"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            GitHub
          </a>
        </div>
        <h1 className="m-0 text-[clamp(44px,10vw,66px)] font-extrabold leading-[0.95] tracking-[-0.038em] text-[#fafafa]">
          skills
          <span
            aria-hidden="true"
            className="font-normal text-[var(--accent)] motion-safe:animate-[blink_1.1s_step-end_infinite]"
          >
            _
          </span>
        </h1>
        <p className="mt-[22px] max-w-[56ch] text-[15px] leading-[1.65] text-[#9a9aa0]">
          A personal collection of Claude Code skills, each packaged as its
          own installable plugin.
        </p>

        <div className="my-11 h-px bg-[#1a1a1e]" />

        <section>
          <h2 className="m-0 mb-2 text-xl font-bold tracking-[-0.5px] text-[#fafafa]">
            Add the marketplace
          </h2>
          <p className="mb-[18px] text-[13.5px] leading-[1.55] text-[#7b7b82]">
            One-time step. Install individual skills below afterwards.
          </p>
          <ShellCommand command="/plugin marketplace add sisqo/skills" />
        </section>

        <div className="mb-5 mt-11 flex items-baseline gap-3">
          <h2 className="m-0 text-xl font-bold tracking-[-0.5px] text-[#fafafa]">
            Skills
          </h2>
          <span className="text-xs text-[#5f5f66]">
            — {skills.length} available
          </span>
        </div>

        {skills.length === 0 ? (
          <p className="text-[13.5px] text-[#7b7b82]">No skills yet.</p>
        ) : (
          <ul className="flex flex-col gap-6">
            {skills.map((skill) => (
              <li
                key={`${skill.pluginSlug}/${skill.slug}`}
                className="rounded-2xl border border-[#23232a] bg-[#0e0e11] p-6 sm:p-7"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-lg bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-[13px] py-[5px] font-mono text-[17px] font-bold text-[var(--accent)]">
                    {skill.name}
                  </span>
                  <div className="flex items-center gap-[14px]">
                    {skill.version && (
                      <span className="text-xs tracking-wide text-[#5f5f66]">
                        v{skill.version}
                      </span>
                    )}
                    <a
                      href={skill.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-[5px] text-xs text-[#7b7b82] no-underline transition-colors hover:text-[#e6e6e6]"
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
                      SKILL.md
                    </a>
                  </div>
                </div>

                <p className="mt-[18px] text-[13.5px] leading-[1.7] text-[#a3a3aa]">
                  {skill.summary ?? skill.description}
                </p>

                <div className="mt-[26px]">
                  <FieldLabel>INSTALL</FieldLabel>
                  <InstallCommand
                    command={`/plugin install ${skill.pluginName}@skills`}
                  />
                </div>

                {skill.userInvocable && (
                  <div className="mt-6">
                    <FieldLabel>USAGE</FieldLabel>
                    <div className="whitespace-pre-wrap break-words rounded-lg border border-[#23232a] bg-[#0a0a0c] px-[15px] py-3 text-[13px] leading-[1.65] text-[#c9c9d0]">
                      <span className="text-[var(--accent)]">$ </span>/
                      {skill.name}
                      {skill.argumentHint && (
                        <span className="text-[#7b7b82]">
                          {" "}
                          {skill.argumentHint}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {skill.examples && skill.examples.length > 0 && (
                  <div className="mt-6">
                    <FieldLabel>EXAMPLES</FieldLabel>
                    <ul className="flex flex-col gap-[10px]">
                      {skill.examples.map((example) => (
                        <li
                          key={example.command}
                          className="rounded-lg border border-[#1c1c22] border-l-2 border-l-[var(--accent)] bg-[#0a0a0c] px-[15px] py-[13px]"
                        >
                          <div className="text-[13.5px] text-[#e6e6e6]">
                            {example.command}
                          </div>
                          {example.description && (
                            <p className="mt-[7px] text-[12.5px] leading-[1.55] text-[#7b7b82]">
                              {example.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <footer className="mt-10 border-t border-[#1a1a1e] pt-[22px] text-center text-[13px] text-[#5f5f66]">
          by{" "}
          <a
            href="https://sisqo.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9a9aa0] no-underline hover:text-[#e6e6e6]"
          >
            SisQo
          </a>
        </footer>
      </div>
    </div>
  );
}
