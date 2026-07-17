"use client";

import { useState } from "react";
import { CopyButton } from "./copy-button";

function StepNumber({ n }: { n: number }) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] bg-[var(--accent)] text-[11px] font-bold text-[#08130c]">
      {n}
    </span>
  );
}

function StepShell({ command }: { command: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[#1a201b] bg-[#0a0c0a] px-[14px] py-3">
      <span className="whitespace-pre-wrap break-words text-[13px]">
        <span className="text-[var(--accent)]">$</span>{" "}
        <span className="text-[#c4ccc6]">{command}</span>
      </span>
      <CopyButton text={command} />
    </div>
  );
}

export function InstallUse({
  installCommand,
  zipUrl,
  zipName,
}: {
  installCommand: string;
  zipUrl: string;
  zipName: string;
}) {
  const [tab, setTab] = useState<"cc" | "ai">("cc");

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#1e251f] bg-[#090c09] p-6">
      <div className="flex items-center gap-[9px]">
        <span className="h-[5px] w-[5px] shrink-0 rounded-[1px] bg-[var(--accent)]" />
        <span className="text-xs font-bold tracking-[2px] text-[#d6ddd8]">
          INSTALL &amp; USE
        </span>
      </div>

      <div className="flex gap-1 rounded-[10px] border border-[#1a201b] bg-[#0a0c0a] p-1">
        <button
          type="button"
          onClick={() => setTab("cc")}
          className={`flex-1 rounded-[7px] py-[9px] text-center text-[12.5px] transition-colors ${
            tab === "cc"
              ? "bg-[var(--accent)] font-bold text-[#08130c]"
              : "bg-transparent font-semibold text-[#8a938c]"
          }`}
        >
          Claude Code
        </button>
        <button
          type="button"
          onClick={() => setTab("ai")}
          className={`flex-1 rounded-[7px] py-[9px] text-center text-[12.5px] transition-colors ${
            tab === "ai"
              ? "bg-[var(--accent)] font-bold text-[#08130c]"
              : "bg-transparent font-semibold text-[#8a938c]"
          }`}
        >
          Claude.ai
        </button>
      </div>

      {tab === "cc" ? (
        <div className="flex flex-col gap-5 pt-0.5">
          <div className="flex flex-col gap-[9px]">
            <div className="flex items-center gap-[10px]">
              <StepNumber n={1} />
              <span className="text-[13px] text-[#c4ccc6]">
                Add the marketplace
              </span>
              <span className="rounded-[5px] border border-[#262d27] px-[7px] py-[2px] text-[10.5px] tracking-wide text-[#5a625c]">
                ONCE
              </span>
            </div>
            <StepShell command="/plugin marketplace add sisqo/skills" />
          </div>
          <div className="flex flex-col gap-[9px]">
            <div className="flex items-center gap-[10px]">
              <StepNumber n={2} />
              <span className="text-[13px] text-[#c4ccc6]">
                Install the skill
              </span>
            </div>
            <StepShell command={installCommand} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 pt-0.5">
          <div className="flex flex-col gap-[9px]">
            <div className="flex items-center gap-[10px]">
              <StepNumber n={1} />
              <span className="text-[13px] text-[#c4ccc6]">
                Download the skill package
              </span>
            </div>
            <a
              href={zipUrl}
              download
              className="mt-1 inline-flex w-fit items-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-[18px] py-[10px] text-[13px] font-semibold text-[var(--accent)] no-underline transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_18%,transparent)]"
            >
              ↓ Download {zipName}
            </a>
          </div>
          <div className="flex flex-col gap-[9px]">
            <div className="flex items-center gap-[10px]">
              <StepNumber n={2} />
              <span className="text-[13px] text-[#c4ccc6]">
                Upload it as a Skill in Claude.ai
              </span>
            </div>
            <div className="rounded-lg border border-[#1a201b] bg-[#0a0c0a] px-[14px] py-3 text-[13px] text-[#98a19a]">
              Settings → Capabilities → Skills → Upload skill
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
