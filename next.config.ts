import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Type checking is handled separately via tsc or CI — skip it during builds/dev for speed
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
