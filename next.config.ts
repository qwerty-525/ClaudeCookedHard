import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ClaudeCookedHard",
  assetPrefix: "/ClaudeCookedHard/",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["images.unsplash.com"],
  },
}

export default nextConfig
