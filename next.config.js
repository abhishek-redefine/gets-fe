/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash:undefined,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // destination: 'http://164.52.196.123:8010/api/:path*',
        destination: 'http://localhost:8010/api/:path*',
      },
      {
        source: '/trackVehicle/:path*',
        // destination: 'http://164.52.196.123:8010/api/:path*',
        destination: 'http://localhost:8010/trackVehicle/:path*',
      }
    ]
  },
}

module.exports = nextConfig
