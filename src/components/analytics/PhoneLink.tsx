'use client';

import type { ComponentPropsWithoutRef } from 'react';
import TrackedLink from '@/components/analytics/TrackedLink';
import { BUSINESS } from '@/lib/constants';

type PhoneLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
  /**
   * Where on the page this link sits, e.g. `service_page_hero`. Required so
   * every call lands in GA4 attributable to a slot — an unlabelled phone_click
   * tells you a call happened but not what earned it.
   */
  location: string;
};

/**
 * The one way to render a phone number.
 *
 * Phone is the dominant conversion channel for a contractor, and a bare
 * `<a href="tel:...">` in a server component fires nothing: over the 90 days to
 * 2026-09-16 the site recorded 2 phone_click events against 41 phone links,
 * because only the header, footer and two homepage CTAs were instrumented —
 * none of the templates behind the service, city, project and paving pages,
 * which is where search traffic lands.
 *
 * Centralising the href also keeps the number itself from drifting.
 */
export default function PhoneLink({ location, children, ...props }: PhoneLinkProps) {
  return (
    <TrackedLink
      href={`tel:${BUSINESS.phoneRaw}`}
      eventName="phone_click"
      eventParams={{ location }}
      {...props}
    >
      {children ?? BUSINESS.phone}
    </TrackedLink>
  );
}
