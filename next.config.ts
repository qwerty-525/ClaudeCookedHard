import type { NextConfig } from "next"

const isProd = process.env.NODE_ENV === "production"

const nextConfig: NextConfig = {
  output: isProd ? "export" : undefined,
  basePath: isProd ? "/ClaudeCookedHard" : "",
  assetPrefix: isProd ? "/ClaudeCookedHard/" : "",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    loader: isProd ? "custom" : "default",
    loaderFile: isProd ? "./image-loader.ts" : undefined,
    domains: ["images.unsplash.com"],
  },
}

export default nextConfig
