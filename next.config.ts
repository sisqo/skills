import { execSync } from "node:child_process";
import type { NextConfig } from "next";

// Vercel exposes the deployed commit; locally fall back to the checkout's HEAD.
function resolveCommitSha(): string {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA;
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}

const nextConfig: NextConfig = {
  env: {
    COMMIT_SHA: resolveCommitSha(),
  },
};

export default nextConfig;
