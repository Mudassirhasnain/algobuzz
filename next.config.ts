import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Send the old Vercel address to the main domain, keeping the path and query
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'algobuzz.vercel.app' }],
        destination: 'https://algobuzz.me/:path*',
        permanent: true,
      },
      // Send www to the main domain as a backup to the Vercel domain setting
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.algobuzz.me' }],
        destination: 'https://algobuzz.me/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
