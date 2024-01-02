/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "default",
    domains: ["localhost", "static.paytrail.com", "resources.paytrail.com", "muistinnollaus.fi", "vuosijuhlat.rwbk.fi", "matrikkeli.rwbk.fi", "liput.rwbk.fi"],
  },
  eslint: {
    dirs: ["middleware.ts", "app", "context", "components"],
  },
  output: "standalone",
}

module.exports = nextConfig;
