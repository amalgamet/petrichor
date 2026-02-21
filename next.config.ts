import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    observations: {
      stale: 60,
      revalidate: 300,
      expire: 600,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.weather.gov',
        pathname: '/icons/**',
      },
    ],
  },
};

export default nextConfig;
