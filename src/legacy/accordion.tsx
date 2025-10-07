import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-accordion';

import { cn } from './utils';

const Accordion = TogglePrimitive.Root;

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof TogglePrimitive.Item>
>(({ className, ...props }, ref) => (
  <TogglePrimitive.Item
    ref={ref}
    className={cn('border-b', className)}
    {...props}
  />
));

AccordionItem.displayName = 'AccordionItem';

export { Accordion, AccordionItem };
