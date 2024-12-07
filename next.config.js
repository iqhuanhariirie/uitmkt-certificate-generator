/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true,
  },
  images: {
    domains: ["github.com"],
  },
  async headers() {
    return [
      {
        source: '/api/pdf-proxy',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, HEAD, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Access-Control-Allow-Origin'
          }
        ],
      },
    ];
  },
};

const withMDX = require("@next/mdx")();
module.exports = withMDX(nextConfig);
