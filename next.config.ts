import type { NextConfig } from 'next';

/**
 * Content-Security-Policy.
 *
 * 'unsafe-inline' in script-src is required: pages are statically
 * generated, so per-request nonces aren't possible, and Next's
 * bootstrapping plus the GTM/GA4/Clarity init snippets are inline.
 * The allowlist still blocks scripts from any unlisted origin.
 *
 * Allowed third parties (all env-gated in src/app/layout.tsx):
 *  - Google Tag Manager / GA4: googletagmanager.com, google-analytics.com
 *  - Microsoft Clarity: clarity.ms (+ c.bing.com beacons)
 *  - vercel.live: the preview-deployment feedback toolbar
 *  - Stock photo CDNs mirror images.remotePatterns below
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms https://vercel.live",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://*.google-analytics.com https://*.clarity.ms https://c.bing.com https://images.unsplash.com https://plus.unsplash.com https://images.pexels.com https://cdn.pixabay.com https://pixabay.com https://vercel.live",
  "font-src 'self' data:",
  "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.clarity.ms https://c.bing.com https://vercel.live wss://*.pusher.com",
  "frame-src https://www.googletagmanager.com https://vercel.live",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Next 16 restricts delivered quality to this allowlist. 75 is the
    // efficient default; 82 is used for the premium blog/featured imagery
    // so high-resolution photos render crisp without bloating page weight.
    qualities: [75, 82, 90],
    /**
     * Stock photo CDNs allowed as next/image sources so URLs from
     * Unsplash, Pexels, or Pixabay can be pasted directly into
     * SERVICE_DATA.{bathrooms,kitchens,basements}.hero.image.src or
     * GALLERY_IMAGES entries. Prefer self-hosting in /public/images
     * for production; this is for staging/placeholder use.
     */
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'pixabay.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      { source: '/services.html', destination: '/services', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/gallery.html', destination: '/gallery', permanent: true },
      { source: '/reviews.html', destination: '/reviews', permanent: true },
      // Paving consolidated into the dedicated /paving pillar (hub + service
      // templates + location pages). The old single-service page redirects in.
      { source: '/services/paving', destination: '/paving', permanent: true },
    ];
  },
};

export default nextConfig;
