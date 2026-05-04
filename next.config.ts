import type { NextConfig } from "next";

/** GitHub Pages project site: https://<org>.github.io/<repo>/ */
const basePath = process.env.NEXT_BASE_PATH?.replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  trailingSlash: true,
};

export default nextConfig;
