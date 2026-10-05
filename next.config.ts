import type { NextConfig } from "next";

const isStaticBuild =
  process.env.STATIC_EXPORT === "1" || process.env.DESKTOP_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isStaticBuild ? { output: "export" as const } : {}),
};

export default nextConfig;
