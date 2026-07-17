"use client";

import { useState, type ReactNode } from "react";
import type { Skill } from "@/lib/skills";
import { GitHubLink } from "./github-link";
import { InstallUse } from "./install-use";

function withEmphasis(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.startsWith("**") ? (
        <strong key={i} className="font-semibold text-[#c6d0c9]">
          {part.slice(2, -2)}
        </strong>
      ) : (
        part
      ),
    );
}

export function SkillRow({
  skill,
  index,
}: {
  skill: Skill;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-[rgba(255,255,255,0.06)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-5 rounded-[10px] px-2 py-5 text-left transition-colors hover:bg-[rgba(126,231,135,0.035)]"
      >
        <span className="min-w-[26px] pt-[3px] text-[12px] font-bold text-[#3f4b43]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="whitespace-nowrap text-[15px] font-bold text-[#e9f1ec]">
              {skill.name}
            </span>
            <span className="flex items-baseline gap-3">
              <span className="whitespace-nowrap text-[11px] text-[var(--accent)]">
                /{skill.name}
              </span>
              {skill.version && (
                <span className="whitespace-nowrap text-[10px] text-[#4f5b53]">
                  v{skill.version}
                </span>
              )}
            </span>
          </span>
          {skill.tagline && (
            <span className="mt-[7px] block text-[12px] leading-[1.6] text-[#8a968e]">
              {skill.tagline}
            </span>
          )}
        </span>
        <span
          aria-hidden="true"
          className="flex h-[26px] w-[26px] flex-none items-center justify-center text-[20px] leading-none text-[var(--accent)] transition-transform duration-200"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          ›
        </span>
      </button>

      {open && (
        <div className="border-t border-[rgba(255,255,255,0.06)] px-[22px] pb-[22px] pt-5">
          <div className="mb-4 text-[11.5px]">
            <GitHubLink href={skill.githubUrl} label="GitHub" />
          </div>

          <p className="m-0 mb-[22px] text-[12.5px] leading-[1.85] text-[#9aa79f] sm:text-justify">
            {withEmphasis(skill.summary ?? skill.description)}
          </p>

          {skill.userInvocable && (
            <div className="mb-5">
              <div className="mb-[10px] text-[10px] font-bold tracking-[0.22em] text-[var(--accent)]">
                ▸ USAGE
              </div>
              <div className="whitespace-pre-wrap break-words rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0b0e0c] px-[14px] py-3 text-[12px] text-[#c6d0c9]">
                <span className="text-[#5f6b63]">$</span> /{skill.name}
                {skill.argumentHint && ` ${skill.argumentHint}`}
              </div>
            </div>
          )}

          {skill.examples && skill.examples.length > 0 && (
            <div className="mb-5">
              <div className="mb-3 text-[10px] font-bold tracking-[0.22em] text-[var(--accent)]">
                ▸ EXAMPLES
              </div>
              <div className="flex flex-col gap-[14px]">
                {skill.examples.map((example) => (
                  <div
                    key={example.command}
                    className="border-l-2 border-[rgba(126,231,135,0.4)] pl-3"
                  >
                    <div className="text-[11.5px] leading-[1.75] text-[var(--accent-hover)]">
                      {example.command}
                    </div>
                    {example.description && (
                      <div className="mt-1 text-[11.5px] leading-[1.6] text-[#8a968e]">
                        {example.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <InstallUse
            installCommand={`/plugin install ${skill.pluginName}@skills`}
            zipUrl={skill.zipUrl}
            zipName={`${skill.name}.zip`}
          />
        </div>
      )}
    </div>
  );
}
