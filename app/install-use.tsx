"use client";

import { useState } from "react";
import { CopyButton } from "./copy-button";

function StepNumber({ n }: { n: number }) {
  return (
    <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] bg-[var(--accent)] text-[11px] font-bold text-[#08120b]">
      {n}
    </span>
  );
}

function StepShell({ command }: { command: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[7px] border border-[rgba(255,255,255,0.06)] bg-[#0d110e] px-3 py-[10px]">
      <span className="whitespace-pre-wrap break-words text-[11.5px] text-[#c6d0c9]">
        <span className="text-[#5f6b63]">$</span> {command}
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
    <div className="rounded-[10px] border border-[rgba(255,255,255,0.06)] bg-[#0b0e0c] p-4">
      <div className="mb-[14px] text-[10px] font-bold tracking-[0.22em] text-[var(--accent)]">
        ▸ INSTALL &amp; USE
      </div>

      <div className="mb-4 inline-flex gap-[2px] rounded-[7px] border border-[rgba(255,255,255,0.07)] bg-[#0d110e] p-[2px]">
        <button
          type="button"
          onClick={() => setTab("cc")}
          className={`rounded-[5px] px-[13px] py-[5px] text-[11px] font-semibold transition-colors ${
            tab === "cc"
              ? "bg-[var(--accent)] text-[#08120b]"
              : "bg-transparent text-[#8a968e]"
          }`}
        >
          Claude Code
        </button>
        <button
          type="button"
          onClick={() => setTab("ai")}
          className={`rounded-[5px] px-[13px] py-[5px] text-[11px] font-semibold transition-colors ${
            tab === "ai"
              ? "bg-[var(--accent)] text-[#08120b]"
              : "bg-transparent text-[#8a968e]"
          }`}
        >
          Claude.ai
        </button>
      </div>

      {tab === "cc" ? (
        <div className="flex flex-col gap-[14px]">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <StepNumber n={1} />
              <span className="text-[12px] text-[#c6d0c9]">
                Add the marketplace
              </span>
              <span className="rounded-[3px] border border-[rgba(255,255,255,0.12)] px-[5px] py-[2px] text-[8.5px] tracking-[0.16em] text-[#5f6b63]">
                ONCE
              </span>
            </div>
            <StepShell command="/plugin marketplace add sisqo/skills" />
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <StepNumber n={2} />
              <span className="text-[12px] text-[#c6d0c9]">
                Install the skill
              </span>
            </div>
            <StepShell command={installCommand} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-[14px]">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <StepNumber n={1} />
              <span className="text-[12px] text-[#c6d0c9]">
                Download the skill
              </span>
            </div>
            <a
              href={zipUrl}
              download
              className="flex items-center justify-between gap-3 rounded-[7px] border border-[rgba(126,231,135,0.18)] bg-[#0d110e] px-3 py-[10px] no-underline"
            >
              <span className="text-[11.5px] text-[var(--accent-hover)]">
                {zipName}
              </span>
              <span className="text-[9px] tracking-[0.14em] text-[#5f6b63]">
                DOWNLOAD ↓
              </span>
            </a>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <StepNumber n={2} />
              <span className="text-[12px] text-[#c6d0c9]">
                Upload it as a Skill in Claude.ai
              </span>
            </div>
            <div className="rounded-[7px] border border-[rgba(255,255,255,0.06)] bg-[#0d110e] px-3 py-[10px] text-[11.5px] text-[#9aa79f]">
              Settings → Capabilities → Skills → Upload skill
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
