import type { Metadata } from 'next';
import Container from '@/components/shared/Container';
import ReviewRequestTool from '@/components/admin/ReviewRequestTool';

/**
 * Internal tool — not linked from anywhere on the site, noindexed, and
 * excluded from the sitemap. The API behind it refuses to send unless
 * the access key matches ADMIN_TOOLS_KEY.
 */

export const metadata: Metadata = {
  title: 'Review Request Tool',
  robots: { index: false, follow: false },
};

export default function ReviewRequestPage() {
  return (
    <div className="bg-steel-50 py-16 md:py-24 min-h-[70vh]">
      <Container size="default">
        <div className="max-w-xl mx-auto">
          <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-bold mb-3">
            Internal Tool
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 mb-3">
            Send a review request.
          </h1>
          <p className="text-charcoal-600 text-sm leading-relaxed mb-8">
            Job wrapped, customer happy? Send them the Google review link
            while the experience is fresh. Texts go out from the business
            Twilio number with the message previewed below.
          </p>
          <ReviewRequestTool />
        </div>
      </Container>
    </div>
  );
}
