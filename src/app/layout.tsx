import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Newsreader, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StickyMobileCTA from '@/components/layout/StickyMobileCTA';
import AttributionTracker from '@/components/analytics/AttributionTracker';
import DeferredAnalytics from '@/components/analytics/DeferredAnalytics';
import JsonLd from '@/components/seo/JsonLd';
import {
  BUSINESS,
  GENERAL_CONTRACTOR_AREA_SERVED,
  VERIFIED_PROFILE_URLS,
} from '@/lib/constants';
import { env } from '@/lib/env';
import { aggregateRatingSchema } from '@/lib/social-proof';

// GA4 / Clarity load only in the Vercel production environment so local
// dev and preview deploys don't pollute real analytics (gating in env.ts).
const GA_MEASUREMENT_ID = env.gaMeasurementId();
const GTM_ID = env.gtmId();
const CLARITY_ID = env.clarityId();
const VERCEL_ENV = env.vercelEnv();

// Display face: Newsreader, a variable editorial serif with optical sizing.
// Headings render at 500 sitewide (globals.css); the italic axis is used for
// the accent word in hero headlines. One variable file per style, no static
// cuts. Inter stays as the body/UI face.
const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-newsreader',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  // Absolute-URL base for og:image / twitter:image and other relative
  // metadata. Without it, Vercel falls back to the deployment URL
  // (*.vercel.app), so social cards would point at the wrong host.
  metadataBase: new URL(BUSINESS.url),
  // 60-char SERP budget (see fitTitle in src/lib/seo.ts): the short brand form
  // keeps the city + service keywords, which is what the title is for.
  title: 'Design-Build Remodeling in Loudoun County, VA | Real Elite',
  description:
    'Veteran-owned design-build remodeler in Loudoun County and the Eastern Panhandle. Kitchens, primary suites, lower levels, additions and outdoor living.',
  keywords: [
    'design-build remodeling Loudoun County',
    'kitchen remodeling Ashburn VA',
    'basement remodeling Loudoun County',
    'primary bathroom remodel Leesburg VA',
    'home additions Northern Virginia',
    'outdoor living Loudoun County',
    'veteran-owned contractor',
    'remodeling contractor Middleburg VA',
    'Eastern Panhandle contractor',
    'Martinsburg contractor',
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
    title: 'Design-Build Remodeling in Loudoun County, VA | Real Elite Contracting',
    description:
      'Veteran-owned design-build remodeler for Loudoun County: kitchens, primary suites, lower levels, additions and outdoor living.',
    images: [
      {
        url: `${BUSINESS.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Real Elite Contracting — design-build remodeling for Loudoun County, VA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design-Build Remodeling in Loudoun County, VA | Real Elite Contracting',
    description:
      'Veteran-owned design-build remodeler for Loudoun County: kitchens, primary suites, lower levels, additions and outdoor living.',
    images: [`${BUSINESS.url}/opengraph-image`],
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
  themeColor: '#151a22',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only present once reviews are verified in SOCIAL_PROOF — no self-serving
  // review markup ships until it mirrors the real Google Business Profile.
  const aggregateRating = aggregateRatingSchema();

  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable}`}>
      <head>
        <link rel="alternate" type="application/rss+xml" title="Real Elite Contracting Guides" href="/rss.xml" />
        <JsonLd
          schema={{
            '@context': 'https://schema.org',
            '@type': 'GeneralContractor',
            '@id': `${BUSINESS.url}/#business`,
            name: BUSINESS.name,
            description:
              'Veteran-owned design-build remodeler serving Loudoun County, Virginia and the Eastern Panhandle of West Virginia — kitchens, primary suites, lower levels, additions and outdoor living.',
            image: `${BUSINESS.url}/images/logo.png`,
            url: `${BUSINESS.url}/`,
            telephone: BUSINESS.phoneRaw,
            email: BUSINESS.email,
            address: {
              '@type': 'PostalAddress',
              addressLocality: BUSINESS.address.city,
              addressRegion: BUSINESS.address.state,
              postalCode: BUSINESS.address.zip,
              addressCountry: 'US',
            },
            areaServed: GENERAL_CONTRACTOR_AREA_SERVED,
            priceRange: '$$$',
            knowsAbout: [
              'Design-Build Remodeling',
              'Kitchen Remodeling',
              'Primary Suite and Bathroom Remodeling',
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
            // Only profiles confirmed to be Real Elite's. Yelp is excluded
            // until a human verifies it — see VERIFIED_PROFILE_URLS.
            sameAs: [...VERIFIED_PROFILE_URLS],
            ...(aggregateRating ? { aggregateRating } : {}),
          }}
        />
      </head>
      {/* Bottom padding for the fixed StickyMobileCTA bar is applied in
          globals.css (72px + safe-area inset, below 1024px) — the single
          mechanism; do not re-add utility padding here. */}
      <body className="bg-white font-body">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
        >
          Skip to content
        </a>
        {GTM_ID && (
          <>
            <Script id="gtm-init" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
          </>
        )}
        <AttributionTracker />
        <DeferredAnalytics gaId={GA_MEASUREMENT_ID} clarityId={CLARITY_ID} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <StickyMobileCTA />
        {VERCEL_ENV && <Analytics />}
        {VERCEL_ENV && <SpeedInsights />}
      </body>
    </html>
  );
}
