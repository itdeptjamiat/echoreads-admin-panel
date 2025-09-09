import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    AUTH_API_URL: process.env.AUTH_API_URL,
  },
  // Production optimizations
  experimental: {
    // This ensures environment variables are available
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Optimize images
  images: {
    domains: ['pub-b8050509235e4bcca261901d10608e30.r2.dev'],
    formats: ['image/webp', 'image/avif'],
  },
  // Compress responses
  compress: true,

};

export default nextConfig;
