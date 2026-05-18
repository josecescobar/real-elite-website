'use client';

import { trackEvent } from '@/lib/analytics';

type GtagParams = Record<string, string | number | boolean | undefined>;

interface TrackedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  event: string;
  eventParams?: GtagParams;
}

/**
 * Anchor that fires a GA event on click. Lets the parent stay a Server
 * Component while keeping analytics behavior client-side.
 */
export default function TrackedLink({
  event,
  eventParams,
  onClick,
  children,
  ...rest
}: TrackedLinkProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackEvent(event, eventParams);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
