import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  experimental: {
    lightningCssFeatures: {
      exclude: [
        "light-dark",
      ]
    }
  }
};

export default nextConfig;
