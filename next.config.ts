
/*
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    trustHostHeader: true,
  } as any, // 👈 关键在这里
};

export default nextConfig;

/*
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // ⚠ 之前写了 trustHostHeader，这里去掉
    // trustHostHeader: true, 
    proxy: true, // 使用 proxy 代替 middleware
  },
};

export default nextConfig;
*/
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // trustHostHeader 已弃用，直接删掉
  },
};

export default nextConfig;
