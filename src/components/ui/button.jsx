import React from 'react';
import { cn } from '../utils';

const buttonVariants = {
  default: 'text-white shadow-md hover:shadow-lg',
  secondary: 'bg-white border shadow-sm hover:shadow-md',
  outline:
    'border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow-md',
  ghost: 'hover:bg-gray-100 active:bg-gray-200',
};

const buttonSizes = {
  default: 'h-11 px-6 py-2',
  sm: 'h-9 px-4 py-1.5 text-sm',
  lg: 'h-12 px-8 py-3 text-base',
};

export function Button({
  children,
  className = '',
  variant = 'default',
  size = 'default',
  disabled = false,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 relative',
        'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none pointer-events-auto',
        'active:scale-[0.98] transform',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
