import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a phone on the same Wi-Fi load the dev server (hot reload is blocked otherwise)
  allowedDevOrigins: ['192.168.4.32'],
  typescript: {
    // Type checking is handled separately via tsc or CI — skip it during builds/dev for speed
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
