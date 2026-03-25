import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import { BUSINESS } from '@/lib/constants';

const GA_MEASUREMENT_ID = 'G-W9QH965H3Y';

export const metadata: Metadata = {
  title: 'General Contractor in Martinsburg, WV | Roofing, Remodeling & Additions | Real Elite Contracting',
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
    title: 'General Contractor in Martinsburg, WV | Roofing, Remodeling & Additions | Real Elite Contracting',
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <JsonLd
          schema={{
            '@context': 'https://schema.org',
            '@type': 'GeneralContractor',
            name: BUSINESS.name,
            description:
              "Eastern Panhandle's most trusted veteran-owned contracting company",
            image: `${BUSINESS.url}/images/logo.png`,
            url: `${BUSINESS.url}/`,
            telephone: '+1-681-534-5515',
            email: BUSINESS.email,
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Martinsburg',
              addressRegion: 'WV',
              postalCode: '25405',
              addressCountry: 'US',
            },
            areaServed: [
              'Martinsburg, WV',
              'Inwood, WV',
              'Hedgesville, WV',
              'Charles Town, WV',
              'Ranson, WV',
              'Kearneysville, WV',
              'Shepherdstown, WV',
              'Harpers Ferry, WV',
              'Berkeley Springs, WV',
              'Spring Mills, WV',
              'Falling Waters, WV',
              'Winchester, VA',
              'Hagerstown, MD',
              'Frederick, MD',
            ],
            priceRange: '$$$',
            knowsAbout: [
              'Roofing',
              'Siding',
              'Decks',
              'Remodeling',
              'Additions',
              'Exterior Repairs',
              'General Repairs',
            ],
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '08:00',
                closes: '17:00',
              },
            ],
            sameAs: [
              BUSINESS.social.facebook,
              BUSINESS.social.instagram,
              'https://www.linkedin.com/company/real-elite-contracting',
              'https://www.yelp.com/biz/real-elite-contracting',
              'https://www.thumbtack.com/wv/martinsburg/general-contractors/real-elite-contracting',
            ],
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
