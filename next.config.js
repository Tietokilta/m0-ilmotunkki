/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "default",
    domains: ["localhost"],
  },
  compiler: {
    styledComponents: true,
  },
  i18n: {
    locales: ['fi', 'en',],
    defaultLocale: 'fi',
  },
}

module.exports = nextConfig;
