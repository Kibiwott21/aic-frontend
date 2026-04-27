/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://aic-backend-bfdw.onrender.com/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
