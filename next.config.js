/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "default",
    domains: ["localhost", "static.paytrail.com", "resources.paytrail.com"],
  },
  i18n: {
    locales: ['fi', 'en',],
    defaultLocale: 'fi',
    localeDetection: false,
  },
  output: "standalone",
}

module.exports = nextConfig;
