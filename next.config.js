/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash:undefined,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://13.127.131.164:8010/api/:path*',
        // destination: 'http://localhost:8010/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
