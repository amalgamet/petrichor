import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    observations: {
      stale: 60,
      revalidate: 300,
      expire: 600,
    },
  },
};

export default nextConfig;
