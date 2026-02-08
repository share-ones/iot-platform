import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    trustHostHeader: true,
  } as any, // 👈 关键在这里
};

export default nextConfig;
