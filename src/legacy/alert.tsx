import * as React from 'react';

import { cn } from './utils';

export function Alert({
  className,
  ...props
}: React.ComponentPropsWithRef<'div'>) {
  return <div className={cn('p-4 rounded-md', className)} {...props} />;
}

export default Alert;
