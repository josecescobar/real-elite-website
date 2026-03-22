import React from 'react';
import Link from 'next/link';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
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
      'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 no-underline';

    const variantStyles: Record<ButtonVariant, string> = {
      primary: 'bg-[#c0392b] text-white hover:bg-[#a93226] active:bg-[#a93226] shadow-lg shadow-[#c0392b]/20',
      secondary: 'bg-[#1a2744] text-white hover:bg-[#0f1b2d] active:bg-[#0f1b2d]',
      outline: 'bg-transparent text-[#1a2744] border-2 border-[#1a2744] hover:bg-[#1a2744]/5 active:bg-[#1a2744]/10',
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
