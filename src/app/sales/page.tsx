import type { Metadata } from 'next';
import Container from '@/components/shared/Container';
import SalesCommandCenter from '@/components/admin/SalesCommandCenter';

export const metadata: Metadata = {
  title: 'Grokbot Command Center',
  robots: { index: false, follow: false },
};

export default function SalesCommandPage() {
  return (
    <div className="bg-steel-50 py-12 md:py-16 min-h-[70vh]">
      <Container size="wide">
        <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-bold mb-3">
          Internal · Grokbot · Safe Autopilot
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 mb-3">
          Sales command center
        </h1>
        <p className="text-charcoal-600 text-sm leading-relaxed mb-8 max-w-2xl">
          Thumbtack leads land here with a score and a drafted first reply.
          Approve, edit, or take over. Send stays stubbed until Thumbtack
          outbound OAuth is wired — Grokbot will not auto-commit price, dates,
          permits, or discounts.
        </p>
        <SalesCommandCenter />
      </Container>
    </div>
  );
}
