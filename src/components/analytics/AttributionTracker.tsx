'use client';

import { useEffect } from 'react';
import { captureFirstTouch } from '@/lib/attribution';

/**
 * Renders nothing. Captures first-touch attribution once per session on the
 * first page load (see src/lib/attribution.ts). Mounted globally in the root
 * layout so the landing page's `utm_*` params + referrer are recorded even
 * when the visitor lands on a page without a form and converts later.
 */
export default function AttributionTracker() {
  useEffect(() => {
    captureFirstTouch();
  }, []);
  return null;
}
