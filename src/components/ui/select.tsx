import * as Radix from '@radix-ui/react-select';

// Re-export common pieces with names used across the project
export const Select = Radix.Root;
export const SelectTrigger = Radix.Trigger;
export const SelectValue = Radix.Value;
export const SelectContent = Radix.Content;
export const SelectItem = Radix.Item;

// Also re-export everything else for compatibility
export * from '@radix-ui/react-select';
