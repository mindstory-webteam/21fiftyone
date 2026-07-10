import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

module.exports = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "header",
            key: "host",
            value: "www.21fiftyone.com",
          },
        ],
        destination: "https://21fiftyone.com/:path*",
        permanent: true,
      },
    ];
  },
};