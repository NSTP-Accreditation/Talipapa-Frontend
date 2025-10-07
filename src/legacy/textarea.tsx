import * as React from 'react';

import { cn } from './utils';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea ref={ref} className={cn('form-textarea', className)} {...props} />
  );
});

Textarea.displayName = 'Textarea';
