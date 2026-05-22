import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "rnkoetwcsfihpzaacesr.supabase.co",
      },
      {
        protocol: "https",
        hostname: "pub-c4afa651db354f66b3f75d74f5d0bc42.r2.dev",
      },
    ],
  },
};

export default nextConfig;
