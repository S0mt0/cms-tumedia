import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.thetumedia.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "thetumedia.com",
          },
        ],
        destination: "https://www.thetumedia.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
