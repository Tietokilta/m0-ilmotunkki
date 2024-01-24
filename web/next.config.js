/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "default",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "*.paytrail.com",
      },
      {
        protocol: "http",
        hostname: "cms",
      },
      {
        protocol: "https",
        hostname: "*.blob.core.windows.net",
      }, // TODO: if we ever need to use images from other external domains, add them here
    ],
  },
  eslint: {
    dirs: ["middleware.ts", "app", "context", "components"],
  },
  output: "standalone",
};

module.exports = nextConfig;
