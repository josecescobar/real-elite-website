'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { isAnalyticsExcludedPath } from '@/lib/analytics-exclusions';

/**
 * GTM container, skipped in documents that start on an internal tool
 * (/sales, /review-request). A container that already started on a
 * marketing page keeps running; AnalyticsFreeDocumentGuard reloads the
 * tool into a fresh document in that case.
 * A client component so the root layout can stay static: the pathname is
 * known during prerender and on the client without reading request headers.
 */
export default function GoogleTagManager({ gtmId }: { gtmId?: string }) {
  const pathname = usePathname();
  if (!gtmId || isAnalyticsExcludedPath(pathname)) return null;

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
