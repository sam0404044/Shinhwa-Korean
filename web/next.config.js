const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'Shinhwa-Korean';
const isStaticExport = process.env.STATIC_EXPORT === 'true';
const distDir = process.env.NEXT_DIST_DIR || '.next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir,
  ...(isStaticExport ? { output: 'export', trailingSlash: true } : {}),
  images: {
    unoptimized: true,
  },
  basePath: isStaticExport ? `/${repoName}` : '',
  assetPrefix: isStaticExport ? `/${repoName}/` : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isStaticExport ? `/${repoName}` : '',
  },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }];
  },
};

module.exports = nextConfig;
