export type CtaIntent = 'estimate' | 'roof-quote' | 'consultation';

/**
 * Project types the luxury design-consultation form can be deep-linked with.
 * Declared once here because three places need to agree: the service+city
 * route that maps a service to a type, the sticky rail that builds the
 * consultation href, and the form that renders the matching option. They had
 * drifted into three separate copies of the same union, so adding
 * 'outdoor-living' broke the build in two of them.
 *
 * The form also offers 'other', which is deliberately not deep-linkable.
 */
export type ConsultationProjectType =
  | 'kitchen'
  | 'bathroom'
  | 'basement'
  | 'whole-home'
  | 'addition'
  | 'outdoor-living';

export type PrimaryCta = {
  intent: CtaIntent;
  href: string;
  label: string;
  eventName: 'estimate_cta_click' | 'roof_quote_cta_click' | 'consultation_cta_click';
};

const ROOF_TERMS = ['roof', 'roofing', 'shingle', 'storm-damage'];

export function primaryCtaForPath(pathname: string): PrimaryCta {
  const lower = pathname.toLowerCase();

  if (lower.startsWith('/design-consultation')) {
    return {
      intent: 'consultation',
      href: '/design-consultation',
      label: 'Consultation',
      eventName: 'consultation_cta_click',
    };
  }

  if (ROOF_TERMS.some((term) => lower.includes(term))) {
    return {
      intent: 'roof-quote',
      href: '/instant-roof-quote',
      label: 'Roof Quote',
      eventName: 'roof_quote_cta_click',
    };
  }

  return {
    intent: 'estimate',
    href: pathname === '/' || pathname === '/contact' ? '#estimate' : '/contact#estimate',
    label: 'Free Estimate',
    eventName: 'estimate_cta_click',
  };
}

export function primaryCtaForService(
  serviceSlug: string,
  options: {
    localEstimateHref?: string;
    consultationType?: string;
    luxuryMarket?: boolean;
  } = {}
): PrimaryCta {
  if (options.luxuryMarket && options.consultationType) {
    return {
      intent: 'consultation',
      href: `/design-consultation?type=${encodeURIComponent(options.consultationType)}`,
      label: 'Request a Consultation',
      eventName: 'consultation_cta_click',
    };
  }

  if (serviceSlug === 'roofing') {
    return {
      intent: 'roof-quote',
      href: '/instant-roof-quote',
      label: 'Get My Roof Quote',
      eventName: 'roof_quote_cta_click',
    };
  }

  return {
    intent: 'estimate',
    href: options.localEstimateHref ?? '#estimate',
    label: 'Get My Free Estimate',
    eventName: 'estimate_cta_click',
  };
}
