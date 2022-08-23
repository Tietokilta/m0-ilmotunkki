/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "default",
    domains: ["localhost", "static.paytrail.com"],
  },
  i18n: {
    locales: ['fi', 'en',],
    defaultLocale: 'fi',
  },
  output: "standalone",
}

module.exports = nextConfig;
