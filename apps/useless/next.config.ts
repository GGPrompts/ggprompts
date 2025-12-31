import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Skip type errors during build - React 19 compatibility issues */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "i.pravatar.cc" },
      { hostname: "commondatastorage.googleapis.com" },
      { hostname: "placehold.co" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "lh3.googleusercontent.com" },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
  },
};

export default nextConfig;
