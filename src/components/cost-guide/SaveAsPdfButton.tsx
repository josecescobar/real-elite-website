'use client';

import { Download } from 'lucide-react';
import { trackCostGuideDownload } from '@/lib/analytics';

/**
 * Opens the browser's print dialog, where "Save as PDF" is the destination
 * on every desktop and mobile browser. No email gate and no server call.
 */
export default function SaveAsPdfButton({ location }: { location: string }) {
  return (
    <button
      type="button"
      data-print-hide
      onClick={() => {
        trackCostGuideDownload(location);
        window.print();
      }}
      className="inline-flex items-center gap-2 bg-brand-red text-white px-7 py-4 rounded-md font-semibold text-sm hover:bg-brand-red-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red print:hidden"
    >
      <Download className="w-4 h-4" aria-hidden="true" />
      Download the PDF (Save as PDF)
    </button>
  );
}
