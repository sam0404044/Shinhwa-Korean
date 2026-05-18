const repoName = 'Myth-Korean-Language-Teaching';
const isProduction = process.env.NODE_ENV === 'production';
const distDir = process.env.NEXT_DIST_DIR || '.next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isProduction ? `/${repoName}` : '',
  assetPrefix: isProduction ? `/${repoName}/` : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isProduction ? `/${repoName}` : '',
  },
};

module.exports = nextConfig;
