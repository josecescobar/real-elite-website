/**
 * Loading UI for the dynamic /sales command center only.
 * A root src/app/loading.tsx wraps every route in a Suspense boundary, which
 * keeps the marketing hero in a hidden slot until hydration. Static home,
 * service, and town pages must paint their H1 and hero image in the first HTML.
 */
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center px-6">
      <Loader2 className="w-10 h-10 text-brand-red animate-spin" aria-hidden="true" />
      <p className="sr-only">Loading…</p>
    </div>
  );
}
