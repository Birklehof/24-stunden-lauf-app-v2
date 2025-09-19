/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [new URL('https://http.garden/**')],
  },
};

module.exports = nextConfig;
