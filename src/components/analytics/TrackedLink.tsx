'use client';

import type { ComponentPropsWithoutRef, MouseEvent } from 'react';
import { trackEvent } from '@/lib/analytics';

type TrackedLinkProps = ComponentPropsWithoutRef<'a'> & {
  eventName: string;
  eventParams?: Record<string, string | number | boolean | undefined>;
};

/**
 * Tiny client island so server-rendered CTAs can still fire GA4 events
 * without pulling a whole section into the hydration bundle.
 */
export default function TrackedLink({
  eventName,
  eventParams,
  onClick,
  ...props
}: TrackedLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackEvent(eventName, eventParams);
    onClick?.(event);
  };

  return <a {...props} onClick={handleClick} />;
}
