import React from 'react';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** Use 'wide' for project galleries and full-bleed editorial layouts. */
  size?: 'default' | 'wide' | 'narrow';
};

const SIZES: Record<NonNullable<ContainerProps['size']>, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
};

export default function Container({ children, className = '', size = 'default' }: ContainerProps) {
  return <div className={`${SIZES[size]} mx-auto px-6 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}
