# Quick Reference Guide

## 🚀 New Utilities Usage

### 1. Logger (Replaces console.log)

```typescript
import { logger } from '@/utils/logger';

// Development only - won't show in production
logger.debug('User data:', userData);
logger.info('Feature enabled');
logger.warn('Deprecated API used');

// Always logs (but filters sensitive data)
logger.error('Failed to fetch', error);

// Grouping (development only)
logger.group('API Request');
logger.debug('URL:', url);
logger.debug('Method:', method);
logger.groupEnd();

// Timing (development only)
logger.time('fetchData');
await fetchData();
logger.timeEnd('fetchData');

// Table view (development only)
logger.table([{ name: 'John', age: 30 }]);
```

**Note:** Sensitive data (token, password, secret, key, authorization) is automatically filtered in error logs.

---

### 2. HTML Sanitization (XSS Prevention)

```typescript
import { sanitize } from '@/utils/sanitize';

// Basic sanitization (balanced security and formatting)
const safeHTML = sanitize.html(untrustedHTML);

// Strict sanitization (maximum security, minimal formatting)
const safeComment = sanitize.strict(userComment);

// Permissive sanitization (rich content like news articles)
const safeArticle = sanitize.permissive(adminContent);

// For React's dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={sanitize.toProps(content)} />
```

---

### 3. Environment Variables

```typescript
import { env } from '@/utils/env';

// Access validated environment variables
const apiUrl = env.apiUrl; // VITE_API_URL
const pageId = env.pageContentId; // VITE_PAGE_CONTENT_ID
const isDev = env.isDevelopment; // import.meta.env.DEV
const isProd = env.isProduction; // import.meta.env.PROD

// Role IDs for RBAC
const superAdminId = env.superAdminRoleId; // VITE_SUPERADMIN (default: 32562)
const adminId = env.adminRoleId; // VITE_ADMIN (default: 2)
const staffId = env.staffRoleId; // VITE_STAFF (default: 3)

// Get all config
const config = env.getConfig();
```

**Note:** Validator runs on import and throws clear errors if required variables are missing.

---

### 4. API Rate Limiting

```typescript
import {
  defaultRateLimiter,
  strictRateLimiter,
  RateLimitError,
} from '@/utils/rateLimiter';

// Option 1: Check rate limit before making request
try {
  await defaultRateLimiter.checkLimit('/api/users');
  const response = await fetch('/api/users');
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(`Wait ${Math.ceil(error.retryAfter / 1000)}s`);
  }
}

// Option 2: Use wrapped fetch function
import { withRateLimit } from '@/utils/rateLimiter';
const rateLimitedFetch = withRateLimit(defaultRateLimiter);
const response = await rateLimitedFetch('/api/users');

// Option 3: Use strict limiter for sensitive operations
await strictRateLimiter.checkLimit('/api/admin/delete-user');

// Check current usage
const usage = defaultRateLimiter.getUsage('/api/users');
console.log(`${usage?.current}/${usage?.max} requests used`);

// Reset (useful for testing)
defaultRateLimiter.reset('/api/users');
```

**Configurations:**

- `defaultRateLimiter`: 60 requests/minute
- `strictRateLimiter`: 10 requests/minute
- `relaxedRateLimiter`: 120 requests/minute

---

### 5. Error Boundary (Already Applied)

Error boundary is already wrapping the entire app in `App.jsx`. No action needed.

If you need to add error boundaries to specific sections:

```typescript
import { AppErrorBoundary } from '@/components/AppErrorBoundary';

function MyComponent() {
  return (
    <AppErrorBoundary>
      <ComponentThatMightCrash />
    </AppErrorBoundary>
  );
}
```

---

## 🔧 Modified Hooks (Performance Optimized)

### useAuthFetch

No changes needed - already optimized with useRef.

```typescript
import { useAuthFetch } from '@/admin/hooks/useAuthFetch';

function MyComponent() {
  const authFetch = useAuthFetch();

  const fetchData = async () => {
    const data = await authFetch('/api/users');
  };
}
```

### useFetchData

No changes needed - already optimized with useMemo.

```typescript
import useFetchData from '@/admin/hooks/useFetchData';

function MyComponent() {
  const { data, loading, error, refetch } = useFetchData('/api/users');

  // Options are now stable (won't cause re-fetches)
  const { data: filtered } = useFetchData('/api/users', {
    method: 'GET',
    headers: { 'X-Custom': 'value' },
  });
}
```

---

## 📋 Migration Checklist

### For Existing Code

**Replace console.log:**

```typescript
// Before
console.log('User data:', user);
console.error('Error:', error);

// After
import { logger } from '@/utils/logger';
logger.debug('User data:', user);
logger.error('Error:', error);
```

**Use environment config:**

```typescript
// Before
const apiURL = import.meta.env.VITE_API_URL;

// After
import { env } from '@/utils/env';
const apiURL = env.apiUrl;
```

**Sanitize HTML (if rendering user content):**

```typescript
// Before
<div dangerouslySetInnerHTML={{ __html: content }} />

// After
import { sanitize } from '@/utils/sanitize';
<div dangerouslySetInnerHTML={sanitize.toProps(content)} />
```

**Add rate limiting to API calls:**

```typescript
// Before
const response = await fetch('/api/users');

// After
import { defaultRateLimiter } from '@/utils/rateLimiter';
await defaultRateLimiter.checkLimit('/api/users');
const response = await fetch('/api/users');
```

---

## 🧪 Testing

### Development Testing

```bash
# Start dev server
npm run dev

# Check console for:
# - Logger messages (should show in dev)
# - No errors from environment validation
# - Error boundary working (trigger an error)
```

### Production Build Testing

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Check console for:
# - NO debug/info/warn messages (only errors if any)
# - NO sensitive data (test by logging something with 'token' or 'password')
# - Environment variables loaded correctly
```

### Manual Error Testing

```typescript
// Temporarily add to a component to test error boundary
throw new Error('Test error');

// Should see:
// - Friendly error message (not a blank page)
// - Error details in development mode
// - Reload and Go Home buttons
```

---

## 📚 Documentation Files

1. **CODE_REVIEW_AND_RECOMMENDATIONS.md** - Original comprehensive code review
2. **IMPLEMENTATION_SUMMARY.md** - What was done and why
3. **TODO.md** - Remaining Medium/Low priority tasks
4. **This file (QUICK_REFERENCE.md)** - Day-to-day usage guide

---

## 🆘 Troubleshooting

### Environment Validation Errors

```
Error: Environment validation failed:
  - VITE_API_URL is required and must be a non-empty string
```

**Fix:** Create `.env` file with required variables:

```env
VITE_API_URL=https://api.example.com
VITE_PAGE_CONTENT_ID=your-page-id
VITE_SUPERADMIN=32562
VITE_ADMIN=2
VITE_STAFF=3
```

### Rate Limit Errors

```
RateLimitError: Rate limit exceeded for /api/users. Please try again in 10s
```

**Fix:** Either wait or increase limits:

```typescript
import { RateLimiter } from '@/utils/rateLimiter';
const customLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60000,
});
```

### TypeScript Errors with DOMPurify

If you see `Cannot find namespace 'DOMPurify'`, make sure types are installed:

```bash
npm install --save-dev @types/dompurify
```

---

## 💡 Best Practices

1. **Always use logger instead of console.log** (even in new code)
2. **Use env.ts for all environment variables** (don't use import.meta.env directly)
3. **Sanitize any user-generated HTML** (use sanitize.strict for user content)
4. **Add rate limiting to new API endpoints** (especially in loops or rapid calls)
5. **Keep error boundaries around risky components** (third-party libraries, dynamic content)

---

## 🎓 Learning Resources

- **Error Boundaries:** https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
- **XSS Prevention:** https://owasp.org/www-community/attacks/xss/
- **Rate Limiting:** https://en.wikipedia.org/wiki/Rate_limiting
- **React Performance:** https://react.dev/learn/render-and-commit

---

**Quick Reference Version:** 1.0  
**Last Updated:** [Current Session]
