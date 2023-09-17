/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (
    webpackConfig,
    { webpack },
  ) => {
    webpackConfig.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.ts': ['.js', '.jsx', '.ts', '.tsx'],
      '.tsx': ['.js', '.jsx', '.ts', '.tsx'],
    };
    return webpackConfig;
  },
}

module.exports = nextConfig
