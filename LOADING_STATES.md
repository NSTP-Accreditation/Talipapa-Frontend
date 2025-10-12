# Loading States & Skeletons Documentation

This project includes comprehensive loading states and skeleton components for better user experience.

## Components

### 1. **Skeleton**
Base skeleton component with shimmer animation.

```tsx
import { Skeleton } from '@/components/LoadingSkeletons';

<Skeleton className="h-10 w-64" />
```

### 2. **PageLoadingSkeleton**
Full page loading skeleton with stats cards and content area.

```tsx
import { PageLoadingSkeleton } from '@/components/LoadingSkeletons';

if (isLoading) {
  return <PageLoadingSkeleton />;
}
```

### 3. **CardLoadingSkeleton**
Grid of loading cards for card-based layouts.

```tsx
import { CardLoadingSkeleton } from '@/components/LoadingSkeletons';

<CardLoadingSkeleton count={6} />
```

### 4. **TableLoadingSkeleton**
Loading skeleton for table layouts.

```tsx
import { TableLoadingSkeleton } from '@/components/LoadingSkeletons';

<TableLoadingSkeleton rows={10} />
```

### 5. **Spinner**
Customizable loading spinner.

```tsx
import { Spinner } from '@/components/LoadingSkeletons';

<Spinner size="md" color="#1a4d2e" />
// Sizes: 'sm' | 'md' | 'lg'
```

### 6. **FullPageSpinner**
Centered full-page spinner with message.

```tsx
import { FullPageSpinner } from '@/components/LoadingSkeletons';

<FullPageSpinner />
```

### 7. **InlineLoader**
Inline loading indicator with text.

```tsx
import { InlineLoader } from '@/components/LoadingSkeletons';

<InlineLoader text="Loading data..." />
```

### 8. **ButtonSpinner**
Loading state for buttons.

```tsx
import { ButtonSpinner } from '@/components/LoadingSkeletons';

<button disabled={isLoading}>
  {isLoading ? <ButtonSpinner /> : 'Submit'}
</button>
```

## Hooks

### 1. **useLoadingState**
Simple hook for managing loading states with initial delay.

```tsx
import { useLoadingState } from '@/hooks/useLoadingState';

const MyComponent = () => {
  const { isLoading } = useLoadingState(1000); // 1 second delay

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return <div>Content</div>;
};
```

### 2. **useDataFetch**
Hook for data fetching with loading state (for future API integration).

```tsx
import { useDataFetch } from '@/hooks/useLoadingState';

const MyComponent = () => {
  const { data, loading, error } = useDataFetch(
    async () => {
      const response = await fetch('/api/data');
      return response.json();
    },
    [] // dependencies
  );

  if (loading) return <PageLoadingSkeleton />;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* render data */}</div>;
};
```

## Usage Examples

### Example 1: Page with Loading State

```tsx
import React from 'react';
import { useLoadingState } from '@/hooks/useLoadingState';
import { PageLoadingSkeleton } from '@/components/LoadingSkeletons';

const Dashboard = () => {
  const { isLoading } = useLoadingState(800);

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div>
      {/* Your content */}
    </div>
  );
};
```

### Example 2: Button with Loading State

```tsx
const MyForm = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    // ... submit logic
    setSubmitting(false);
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={submitting}
      className="..."
    >
      {submitting ? (
        <ButtonSpinner />
      ) : (
        'Submit'
      )}
    </button>
  );
};
```

### Example 3: Search with Loading Indicator

```tsx
const Search = () => {
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    setSearching(true);
    // ... search logic
    setSearching(false);
  };

  return (
    <>
      <button onClick={handleSearch} disabled={searching}>
        {searching ? (
          <>
            <Spinner size="sm" color="#ffffff" />
            <span>Searching...</span>
          </>
        ) : (
          'Search'
        )}
      </button>

      {searching && <InlineLoader text="Searching..." />}
    </>
  );
};
```

### Example 4: Conditional Content Loading

```tsx
const ProductList = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <CardLoadingSkeleton count={6} />;
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};
```

## Lazy Loading with Suspense

The app uses React.lazy() and Suspense for code splitting and automatic loading states.

All routes are lazy-loaded and wrapped in `SuspenseWrapper`:

```tsx
// App.jsx
import { lazy } from 'react';
import SuspenseWrapper from '@/components/SuspenseWrapper';

const Dashboard = lazy(() => import('@/admin/pages/Dashboard'));

function App() {
  return (
    <SuspenseWrapper fallback={<FullPageSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </SuspenseWrapper>
  );
}
```

## Color Scheme

All loading components use the project's color palette:
- Primary: `#1a4d2e` (Green)
- Background: `#F6F6F6` (Light Gray)
- Text: `#838383` (Gray)

## Performance Tips

1. **Use appropriate skeleton types**: Match the skeleton to your actual content layout
2. **Set reasonable delays**: 500-1000ms is usually good for perceived performance
3. **Lazy load routes**: All major pages should be lazy-loaded
4. **Show progress**: For long operations, show progress indicators
5. **Avoid layout shift**: Skeleton dimensions should match actual content

## Implemented Pages

Currently, loading states are implemented in:
- ✅ All routes (via Suspense)
- ✅ Admin Login (button loading)
- ✅ Inventory Page (full page skeleton)
- ✅ Swap Item Page (search loading + inline loader)

## Future Enhancements

- Add progress bars for file uploads
- Implement skeleton screens for all remaining pages
- Add optimistic UI updates
- Create animated transitions between loading and loaded states
