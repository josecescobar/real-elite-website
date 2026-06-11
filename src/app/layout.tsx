import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Saira_Condensed, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StickyMobileCTA from '@/components/layout/StickyMobileCTA';
import JsonLd from '@/components/seo/JsonLd';
import { BUSINESS } from '@/lib/constants';

// GA4 loads only in the Vercel production environment so local dev and
// preview deploys don't pollute the real analytics. NEXT_PUBLIC_GA_ID
// overrides the default ID if set; production keeps working with no env
// change required.
const GA_MEASUREMENT_ID =
  process.env.VERCEL_ENV === 'production'
    ? process.env.NEXT_PUBLIC_GA_ID ?? 'G-W9QH965H3Y'
    : process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

const saira = Saira_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-saira',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'General Contractor in Martinsburg, WV | Real Elite Contracting',
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
    title: 'General Contractor in Martinsburg, WV | Real Elite Contracting',
    description:
      'Eastern Panhandle\'s most trusted veteran-owned contracting company. Specializing in roofing, siding, decks, remodeling, and more.',
    images: [
      {
        url: `${BUSINESS.url}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Real Elite Contracting - Eastern Panhandle\'s Most Trusted Contractor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'General Contractor in Martinsburg, WV | Real Elite Contracting',
    description:
      'Eastern Panhandle\'s most trusted veteran-owned contracting company. Specializing in roofing, siding, decks, remodeling, and more.',
    images: [`${BUSINESS.url}/images/og-image.jpg`],
  },
  alternates: {
    canonical: BUSINESS.url,
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

export const viewport: Viewport = {
  themeColor: '#1a2744',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${saira.variable} ${inter.variable}`}>
      <head>
        {/* Google Tag Manager (env-gated, no-op until NEXT_PUBLIC_GTM_ID is set) */}
        {GTM_ID && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}

        {/* GA4 — only in production (see GA_MEASUREMENT_ID gating above) */}
        {GA_MEASUREMENT_ID && (
          <>
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
          </>
        )}

        {/* Microsoft Clarity (heatmaps + recordings) */}
        {CLARITY_ID && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_ID}");`}
          </Script>
        )}

        <JsonLd
          schema={{
            '@context': 'https://schema.org',
            '@type': 'GeneralContractor',
            name: BUSINESS.name,
            description:
              "Premium regional remodeling and exterior contractor — built on military precision, communication, reliability, and high-end execution.",
            image: `${BUSINESS.url}/images/logo.png`,
            url: `${BUSINESS.url}/`,
            telephone: BUSINESS.phoneRaw,
            email: BUSINESS.email,
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Martinsburg',
              addressRegion: 'WV',
              postalCode: '25401',
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
              'Leesburg, VA',
              'Ashburn, VA',
              'Loudoun County, VA',
              'Hagerstown, MD',
              'Frederick, MD',
            ],
            priceRange: '$$$',
            knowsAbout: [
              'Bathroom Remodeling',
              'Kitchen Remodeling',
              'Basement Finishing',
              'Roofing',
              'Siding',
              'Decks',
              'Outdoor Living',
              'Home Additions',
              'Whole-Home Remodeling',
              'Exterior Repairs',
              'General Repairs',
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
                dayOfWeek: ['Saturday'],
                opens: '08:00',
                closes: '14:00',
              },
            ],
            sameAs: [
              BUSINESS.social.facebook,
              BUSINESS.social.instagram,
              BUSINESS.social.google,
              BUSINESS.social.yelp,
            ],
          }}
        />
      </head>
      {/* Bottom padding below lg reserves space for the fixed StickyMobileCTA bar */}
      <body className="bg-white font-body pb-[76px] lg:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
        >
          Skip to content
        </a>
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <StickyMobileCTA />
      </body>
    </html>
  );
}
