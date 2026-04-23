import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/read/:path*',
        destination: 'https://www.gutenberg.org/:path*',
      },
    ];
  },
};

export default nextConfig;
