import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(process.env.DESKTOP_EXPORT === "1" ? { output: "export" as const } : {}),
};

export default nextConfig;
