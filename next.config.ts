import type { NextConfig } from 'next';

const securityHeaders = [
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
    ];
  },
};

export default nextConfig;
