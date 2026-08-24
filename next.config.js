/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/Demo3SciMSPT',
  assetPrefix: '/Demo3SciMSPT',
  trailingSlash: true,
}

module.exports = nextConfig
