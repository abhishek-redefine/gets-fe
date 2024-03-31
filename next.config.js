/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash:undefined,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://164.52.196.123:8010/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
