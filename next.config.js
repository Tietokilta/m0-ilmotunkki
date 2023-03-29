/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "default",
    domains: ["localhost", "static.paytrail.com", "resources.paytrail.com", "muistinnollaus.fi", "vuosijuhlat.rwbk.fi", "matrikkeli.rwbk.fi", "liput.rwbk.fi"],
  },
  i18n: {
    locales: ['fi', 'en',],
    defaultLocale: 'fi',
    localeDetection: false,
  },
  output: "standalone",
}

module.exports = nextConfig;
