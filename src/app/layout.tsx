import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BUSINESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${BUSINESS.name} | ${BUSINESS.tagline}`,
  description:
    'Eastern Panhandle\'s most trusted veteran-owned contracting company. Specializing in roofing, siding, decks, remodeling, and more. Free estimates available.',
  keywords: [
    'contractor',
    'roofing',
    'siding',
    'decks',
    'remodeling',
    'Eastern Panhandle',
    'West Virginia',
    'WV',
    'Martinsburg contractor',
    'Inwood contractor',
    'Charles Town contractor',
    'Ranson contractor',
    'Hedgesville contractor',
    'veteran-owned',
  ],
  authors: [{ name: BUSINESS.name }],
  creator: BUSINESS.name,
  publisher: BUSINESS.name,
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BUSINESS.url,
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} | ${BUSINESS.tagline}`,
    description:
      'Eastern Panhandle\'s most trusted veteran-owned contracting company. Specializing in roofing, siding, decks, remodeling, and more.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: BUSINESS.name,
              description:
                'Eastern Panhandle\'s most trusted veteran-owned contracting company',
              image: `${BUSINESS.url}/images/logo.png`,
              url: BUSINESS.url,
              telephone: BUSINESS.phoneRaw,
              email: BUSINESS.email,
              address: {
                '@type': 'PostalAddress',
                streetAddress: BUSINESS.address.street,
                addressLocality: BUSINESS.address.city,
                addressRegion: BUSINESS.address.state,
                postalCode: BUSINESS.address.zip,
                addressCountry: 'US',
              },
              areaServed: [
                'Martinsburg, WV',
                'Inwood, WV',
                'Charles Town, WV',
                'Ranson, WV',
                'Hedgesville, WV',
                'Spring Mills, WV',
                'Falling Waters, WV',
                'Berkeley Springs, WV',
                'Shepherdstown, WV',
              ],
              priceRange: '$$$',
              knowsAbout: [
                'Roofing',
                'Siding',
                'Decks',
                'Remodeling',
                'Additions',
                'Exterior Repairs',
              ],
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '07:00',
                  closes: '18:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: 'Saturday',
                  opens: '08:00',
                  closes: '14:00',
                },
              ],
              sameAs: [BUSINESS.social.facebook, BUSINESS.social.instagram],
            }),
          }}
        />
      </head>
      <body className="bg-white">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
