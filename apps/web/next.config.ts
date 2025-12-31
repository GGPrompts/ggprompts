import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Skip type errors during build - React 19 compatibility issues with cmdk/vaul */
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
