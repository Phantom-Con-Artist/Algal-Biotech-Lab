import type { NextConfig } from 'next';

/**
 * Fully static export: every page, the sitemap and robots.txt are written to dist/ at build time,
 * the folder the Cloudflare Pages project already publishes.
 */
const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  /** English (at the root) and the other languages (under /[lang]) are separate root layouts, so the 404 page stands alone. */
  experimental: { globalNotFound: true },
};

export default nextConfig;
