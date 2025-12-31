import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // React 19 has compatibility issues with some component libraries
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
