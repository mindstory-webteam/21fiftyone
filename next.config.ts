import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },

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

export default nextConfig;