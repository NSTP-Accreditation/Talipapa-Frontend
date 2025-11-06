import React, { CSSProperties } from 'react';
// @ts-ignore - react-window has type issues with some build configurations
import { FixedSizeList } from 'react-window';

/**
 * VirtualizedList Component
 *
 * A performance-optimized list component that only renders visible items
 * using react-window. This is ideal for large lists (1000+ items) where
 * rendering all items at once would cause performance issues.
 *
 * @example
 * ```tsx
 * <VirtualizedList
 *   items={records}
 *   height={600}
 *   itemHeight={80}
 *   renderItem={({ item, index, style }) => (
 *     <div style={style} className="record-item">
 *       {item.name}
 *     </div>
 *   )}
 * />
 * ```
 */

interface VirtualizedListProps<T> {
  /** Array of items to display */
  items: T[];
  /** Height of the list container in pixels */
  height: number;
  /** Height of each individual item in pixels */
  itemHeight: number;
  /** Width of the list (default: '100%') */
  width?: string | number;
  /** Custom className for the list container */
  className?: string;
  /** Render function for each item */
  renderItem: (props: {
    item: T;
    index: number;
    style: CSSProperties;
  }) => React.ReactNode;
  /** Optional empty state component */
  emptyState?: React.ReactNode;
  /** Number of items to render outside of the visible area (default: 1) */
  overscanCount?: number;
}

/**
 * Generic virtualized list component for rendering large datasets efficiently
 */
export function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  width = '100%',
  className = '',
  renderItem,
  emptyState,
  overscanCount = 1,
}: VirtualizedListProps<T>) {
  // Handle empty state
  if (items.length === 0) {
    return (
      <div
        style={{ height, width }}
        className={`flex items-center justify-center ${className}`}
      >
        {emptyState || (
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium">No items to display</p>
          </div>
        )}
      </div>
    );
  }

  // Row renderer function required by react-window
  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    const item = items[index];
    return <>{renderItem({ item, index, style })}</>;
  };

  return (
    <div className={className}>
      <FixedSizeList
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        width={width}
        overscanCount={overscanCount}
      >
        {Row}
      </FixedSizeList>
    </div>
  );
}

/**
 * Example usage for records list:
 *
 * ```tsx
 * import { VirtualizedList } from '@/components/VirtualizedList';
 *
 * function RecordsList({ records }: { records: RecordInterface[] }) {
 *   return (
 *     <VirtualizedList
 *       items={records}
 *       height={600}
 *       itemHeight={80}
 *       renderItem={({ item: record, style }) => (
 *         <div
 *           style={style}
 *           className="flex items-center justify-between px-6 py-4 border-b hover:bg-green-50"
 *         >
 *           <div className="flex items-center gap-3">
 *             <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
 *               {record.firstName.charAt(0)}
 *             </div>
 *             <div>
 *               <p className="font-semibold">{record.firstName} {record.lastName}</p>
 *               <p className="text-sm text-gray-600">{record.address}</p>
 *             </div>
 *           </div>
 *           <div className="flex gap-2">
 *             <Button onClick={() => handleEdit(record)}>Edit</Button>
 *             <Button onClick={() => handleDelete(record)}>Delete</Button>
 *           </div>
 *         </div>
 *       )}
 *       emptyState={<p>No records found</p>}
 *     />
 *   );
 * }
 * ```
 *
 * Example usage for inventory items:
 *
 * ```tsx
 * <VirtualizedList
 *   items={products}
 *   height={500}
 *   itemHeight={100}
 *   renderItem={({ item: product, style }) => (
 *     <div style={style} className="p-4 border-b">
 *       <h3 className="font-bold">{product.name}</h3>
 *       <p className="text-gray-600">Stock: {product.quantity}</p>
 *       <p className="text-green-600 font-semibold">₱{product.price}</p>
 *     </div>
 *   )}
 * />
 * ```
 */
