import * as React from 'react';

import { cn } from './utils';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return <input ref={ref} className={cn('form-input', className)} {...props} />;
});

Input.displayName = 'Input';
