/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // A helyi endpoint, amit használsz
        destination: 'https://exam.api.fotex.net/api/:path*', // Az eredeti API URL
      },
    ];
  },
};

module.exports = nextConfig;
