import type { NextConfig } from "next";

/**
 * GitHub Pages 项目站：站点在 https://<org>.github.io/<仓库名>/
 * 在 GitHub Actions 里用 GITHUB_REPOSITORY 推导 basePath，避免工作流漏设变量导致整站 404。
 */
function resolveBasePath(): string | undefined {
  const fromEnv = process.env.NEXT_BASE_PATH?.replace(/\/$/, "").trim();
  if (fromEnv) return fromEnv === "/" ? undefined : fromEnv;

  if (process.env.GITHUB_ACTIONS === "true") {
    const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
    if (repo) return `/${repo}`;
  }

  return undefined;
}

const basePath = resolveBasePath();

const nextConfig: NextConfig = {
  output: "export",
  ...(basePath ? { basePath } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
