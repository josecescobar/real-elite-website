import React from 'react';
import Link from 'next/link';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      href,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-200 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-brand-red text-white hover:bg-brand-red-dark active:bg-brand-red-dark shadow-md focus-visible:ring-brand-red',
      secondary:
        'bg-navy-800 text-white hover:bg-navy-900 active:bg-navy-900 focus-visible:ring-navy-400',
      outline:
        'bg-transparent text-navy-800 border-2 border-navy-800 hover:bg-navy-800/5 active:bg-navy-800/10 focus-visible:ring-navy-400',
      ghost:
        'bg-transparent text-navy-800 hover:bg-navy-50 active:bg-navy-100 focus-visible:ring-navy-400',
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    if (href) {
      if (href.startsWith('tel:') || href.startsWith('mailto:')) {
        return (
          <a href={href} className={combinedClassName}>
            {children}
          </a>
        );
      }
      if (href.startsWith('http')) {
        return (
          <a href={href} className={combinedClassName} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={combinedClassName}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
