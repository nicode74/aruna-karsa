import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
      {
        protocol: "https",
        hostname: "jetjmavtuqtyxoiioogn.supabase.co",
      },
    ],
  },
};

export default nextConfig;
