'use client';

import { useSearchParams } from 'next/navigation';
import LuxuryConsultationForm from '@/components/consultation/LuxuryConsultationForm';
import { CONSULTATION_PROJECT_TYPES } from '@/lib/cta-intent';

/**
 * Reads `?type=kitchen` (etc.) from the URL — set by deep-link CTAs on the
 * luxury service-city combo pages (e.g. /services/kitchens/mclean-va) — and
 * pre-selects the matching project type on the form.
 */
export default function LuxuryConsultationFormClient() {
  const params = useSearchParams();
  const raw = params.get('type');
  const initialProjectType = CONSULTATION_PROJECT_TYPES.find((type) => type.value === raw)?.value;
  return <LuxuryConsultationForm initialProjectType={initialProjectType} />;
}
