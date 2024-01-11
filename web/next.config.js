/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "default",
    domains: ["localhost", "static.paytrail.com", "resources.paytrail.com", "cms"],
  },
  eslint: {
    dirs: ["middleware.ts", "app", "context", "components"],
  },
  output: "standalone",
}

module.exports = nextConfig;
