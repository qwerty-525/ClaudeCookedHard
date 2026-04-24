import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ClaudeCookedHard",
  assetPrefix: "/ClaudeCookedHard/",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
    domains: ["images.unsplash.com"],
  },
}

export default nextConfig
