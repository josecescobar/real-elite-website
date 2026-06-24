import type { MetadataRoute } from 'next';

/**
 * Web App Manifest — enables Android/Chrome "Add to Home Screen",
 * sets the install name, and defines the brand theme color so the
 * browser chrome matches the site's navy identity.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Real Elite Contracting',
    short_name: 'Real Elite',
    description:
      'Premium veteran-owned remodeling and exterior contractor — built with military precision across the WV–MD–VA region.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1b2d',
    theme_color: '#1a2744',
    categories: ['business', 'home', 'lifestyle'],
    icons: [
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/images/logo.png',
        sizes: '400x400',
        type: 'image/png',
      },
    ],
  };
}
