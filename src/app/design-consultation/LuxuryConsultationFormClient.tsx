'use client';

import { useSearchParams } from 'next/navigation';
import LuxuryConsultationForm from '@/components/consultation/LuxuryConsultationForm';

const ALLOWED_TYPES = new Set([
  'kitchen',
  'bathroom',
  'basement',
  'whole-home',
  'addition',
  'other',
]);

type ProjectType = 'kitchen' | 'bathroom' | 'basement' | 'whole-home' | 'addition' | 'other';

/**
 * Reads `?type=kitchen` (etc.) from the URL — set by deep-link CTAs on the
 * luxury service-city combo pages (e.g. /services/kitchens/mclean-va) — and
 * pre-selects the matching project type on the form.
 */
export default function LuxuryConsultationFormClient() {
  const params = useSearchParams();
  const raw = params.get('type');
  const initialProjectType =
    raw && ALLOWED_TYPES.has(raw) ? (raw as ProjectType) : undefined;
  return <LuxuryConsultationForm initialProjectType={initialProjectType} />;
}
