import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "i.ibb.co.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
  reactCompiler: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
