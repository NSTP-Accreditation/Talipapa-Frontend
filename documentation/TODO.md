# TODO: Medium and Low Priority Improvements

This document lists all remaining recommendations from the code review that should be implemented over the coming weeks and months.

## Status: All Critical, High, and Medium Priority items completed! ✅

**Last Updated:** November 5, 2025

**What was fixed:**

### Critical & High Priority:

- ✅ Error Boundary implementation (prevents app crashes)
- ✅ Logging utility with sensitive data filtering
- ✅ Console.log replacement throughout codebase
- ✅ XSS Prevention with DOMPurify sanitization utility
- ✅ Environment variable validation system
- ✅ useAuthFetch performance optimization (useRef)
- ✅ useFetchData performance optimization (useMemo)
- ✅ API Rate Limiting implementation

### Medium Priority (Completed November 5, 2025):

- ✅ React.memo for heavy components
- ✅ Request deduplication utility
- ✅ AuthContext optimization (split contexts)
- ✅ Virtual scrolling implementation
- ✅ Bundle size optimization

---

## 📊 Medium Priority Issues - ✅ ALL COMPLETED! (November 5, 2025)

### ✅ 1. Implement React.memo for Heavy Components - DONE

**Files updated:**

- ✅ `src/admin/pages/dashboard/Dashboard.tsx`
- ✅ `src/admin/pages/records/Records.tsx`
- ✅ `src/admin/pages/records/NonResidentRecords.tsx`
- ✅ `src/admin/pages/inventory/Inventory.tsx`
- ✅ `src/admin/pages/farm-inventory/FarmInventory.tsx`

**Result:** Components now only re-render when their props change

---

### ✅ 2. Add Request Deduplication - DONE

**Files created:**

- ✅ `src/utils/requestCache.ts`

**Files updated:**

- ✅ `src/admin/hooks/useAuthFetch.ts`

**Result:** GET requests are automatically deduplicated, preventing duplicate API calls

---

### ✅ 3. Optimize AuthContext Re-renders - DONE

**Files updated:**

- ✅ `src/contexts/AuthContext.tsx`

**New hooks available:**

- `useAuthState()` - For reading user data (only re-renders on state changes)
- `useAuthActions()` - For login/logout/refresh (never causes re-renders)
- `useAuth()` - Legacy hook (backward compatible)

**Result:** Significant reduction in unnecessary re-renders across the app

---

### ✅ 4. Implement Virtual Scrolling - DONE

**Dependencies installed:**

- ✅ `react-window`
- ✅ `@types/react-window`

**Files created:**

- ✅ `src/components/VirtualizedList.tsx`

**Result:** Reusable component ready for handling large lists (1000+ items) efficiently

---

### ✅ 5. Add Bundle Size Optimization - DONE

**Dependencies installed:**

- ✅ `rollup-plugin-visualizer`

**Files updated:**

- ✅ `vite.config.ts`

**Features added:**

- Manual chunk splitting (react-vendor, ui-vendor, utils, charts, forms, icons, virtualization)
- Console.log removal in production builds
- Bundle visualizer (run `npm run build` to see `dist/stats.html`)

**Result:** Optimized bundle with better caching and faster load times

---

**📚 See MEDIUM_PRIORITY_IMPLEMENTATION.md for complete documentation**

---

## 🟢 Low Priority Issues (10 items)

### 1. Add JSDoc Comments to All Utilities

**Priority:** 🟢 LOW  
**Effort:** 2-3 days  
**Status:** Partially done (logger, sanitize, rateLimiter have full docs)

**Files needing documentation:**

- `src/utils/formatter.js`
- `src/utils/validation.ts`
- `src/utils/excelExport.ts`
- `src/admin/formatters/currency.js`

**Template:**

```typescript
/**
 * Brief description of what this function does
 *
 * @param paramName - Description of parameter
 * @returns Description of return value
 *
 * @example
 * const result = functionName(example);
 * // Output: expected result
 */
```

---

### 2. Migrate Remaining .jsx Files to .tsx

**Priority:** 🟢 LOW  
**Effort:** 3-5 days  
**Status:** ~70% TypeScript coverage

**Files to migrate:**

```
src/admin/components/FloatingLabelInput.jsx
src/admin/formatters/currency.js
src/users/components/*.jsx (all user-facing components)
src/utils/formatter.js
```

**Benefits:**

- Better type safety
- Improved IDE autocomplete
- Catch bugs at compile time

**Process:**

1. Rename `.jsx` → `.tsx` or `.js` → `.ts`
2. Add type annotations for props, state, return types
3. Fix any TypeScript errors
4. Test component functionality

---

### 3. Add Unit Tests for Critical Utilities

**Priority:** 🟢 LOW  
**Effort:** 3-5 days

**Install testing framework:**

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

**Priority test targets:**

1. `src/utils/logger.ts` - Sensitive data filtering
2. `src/utils/sanitize.ts` - XSS prevention
3. `src/utils/rateLimiter.ts` - Rate limiting logic
4. `src/utils/env.ts` - Environment validation
5. `src/utils/validation.ts` - Form validation
6. `src/utils/rbac.utils.ts` - Role-based access control

**Example test:**

```typescript
// logger.test.ts
import { describe, it, expect } from 'vitest';
import { logger } from './logger';

describe('logger', () => {
  it('should filter sensitive data from error logs', () => {
    const spy = vi.spyOn(console, 'error');
    logger.error({ token: 'secret123', password: 'pass123' });
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        token: '[FILTERED]',
        password: '[FILTERED]',
      })
    );
  });
});
```

---

### 4. Implement Error Tracking Integration

**Priority:** 🟢 LOW  
**Effort:** 1 day  
**Location:** `src/components/AppErrorBoundary.tsx`

**Install Sentry:**

```bash
npm install @sentry/react
```

**Configure:**

```typescript
// src/utils/errorTracking.ts
import * as Sentry from '@sentry/react';
import { env } from './env';

if (env.isProduction) {
  Sentry.init({
    dsn: env.sentryDsn,
    environment: 'production',
    integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

export const captureError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, { extra: context });
};
```

**Update AppErrorBoundary:**

```typescript
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  if (env.isProduction) {
    captureError(error, { errorInfo });
  }
}
```

---

### 5. Add Performance Monitoring

**Priority:** 🟢 LOW  
**Effort:** 1-2 days

**Install Web Vitals:**

```bash
npm install web-vitals
```

**Track metrics:**

```typescript
// src/utils/performance.ts
import { onCLS, onFID, onLCP, onTTFB, onINP } from 'web-vitals';
import { logger } from './logger';

export function initPerformanceMonitoring() {
  if (import.meta.env.PROD) {
    onCLS((metric) => logger.info('CLS', metric));
    onFID((metric) => logger.info('FID', metric));
    onLCP((metric) => logger.info('LCP', metric));
    onTTFB((metric) => logger.info('TTFB', metric));
    onINP((metric) => logger.info('INP', metric));
  }
}

// Call in main.tsx
initPerformanceMonitoring();
```

---

### 6. Implement Service Worker for Offline Support

**Priority:** 🟢 LOW  
**Effort:** 2-3 days

**Install Workbox:**

```bash
npm install workbox-window
npm install --save-dev vite-plugin-pwa
```

**Configure:**

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 300, // 5 minutes
              },
            },
          },
        ],
      },
    }),
  ],
});
```

---

### 7. Add API Response Caching

**Priority:** 🟢 LOW  
**Effort:** 1-2 days

**Create cache utility:**

```typescript
// utils/apiCache.ts
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Auto-expire
    setTimeout(() => this.delete(key), ttl || this.defaultTTL);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.defaultTTL) {
      this.delete(key);
      return null;
    }

    return entry.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const apiCache = new ApiCache();
```

---

### 8. Improve Loading States with Suspense

**Priority:** 🟢 LOW  
**Effort:** 2-3 days

**Current:** Custom loading states in each component  
**Target:** React Suspense for better UX

```tsx
// Before
if (loading) return <Spinner />;

// After
<Suspense fallback={<PageSkeleton />}>
  <LazyComponent />
</Suspense>;
```

**Create Suspense-compatible data fetcher:**

```typescript
// utils/suspenseCache.ts
function wrapPromise<T>(promise: Promise<T>) {
  let status = 'pending';
  let result: T;

  const suspender = promise.then(
    (res) => {
      status = 'success';
      result = res;
    },
    (err) => {
      status = 'error';
      result = err;
    }
  );

  return {
    read() {
      if (status === 'pending') throw suspender;
      if (status === 'error') throw result;
      return result;
    },
  };
}
```

---

### 9. Add Accessibility Improvements

**Priority:** 🟢 LOW  
**Effort:** 2-3 days

**Areas to improve:**

1. **Keyboard Navigation**
   - Add focus styles to all interactive elements
   - Ensure proper tab order
   - Add keyboard shortcuts for common actions

2. **Screen Reader Support**
   - Add aria-labels to icon buttons
   - Use semantic HTML (nav, main, aside)
   - Add skip-to-content link

3. **Color Contrast**
   - Verify WCAG AA compliance (4.5:1 ratio)
   - Test with Chrome DevTools Lighthouse

4. **Focus Management**
   - Trap focus in modals
   - Restore focus when closing modals
   - Add focus indicators

**Tools:**

```bash
npm install --save-dev eslint-plugin-jsx-a11y
```

**Example fixes:**

```tsx
// Before
<button onClick={handleClick}>
  <TrashIcon />
</button>

// After
<button onClick={handleClick} aria-label="Delete item">
  <TrashIcon aria-hidden="true" />
</button>
```

---

### 10. Implement Internationalization (i18n)

**Priority:** 🟢 LOW  
**Effort:** 5-7 days

**Install i18next:**

```bash
npm install i18next react-i18next
```

**Setup:**

```typescript
// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: 'Welcome',
        login: 'Login',
      },
    },
    fil: {
      translation: {
        welcome: 'Maligayang pagdating',
        login: 'Mag-login',
      },
    },
  },
  lng: 'fil', // Filipino default
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
```

**Usage:**

```tsx
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  return <h1>{t('welcome')}</h1>;
}
```

---

## 📈 Implementation Roadmap

### Week 1-2 (Medium Priority Focus)

- [ ] React.memo for heavy components
- [ ] Request deduplication
- [ ] AuthContext optimization

### Week 3-4 (Medium Priority Continued)

- [ ] Virtual scrolling for large lists
- [ ] Bundle size optimization

### Month 2 (Low Priority - Phase 1)

- [ ] JSDoc documentation
- [ ] TypeScript migration
- [ ] Unit tests for utilities

### Month 3 (Low Priority - Phase 2)

- [ ] Error tracking integration
- [ ] Performance monitoring
- [ ] API response caching

### Month 4+ (Low Priority - Phase 3)

- [ ] Service worker / PWA
- [ ] Accessibility improvements
- [ ] Internationalization

---

## 🎯 Success Metrics

Track these metrics after implementing improvements:

1. **Performance**
   - First Contentful Paint (FCP) < 1.8s
   - Largest Contentful Paint (LCP) < 2.5s
   - Time to Interactive (TTI) < 3.9s
   - Bundle size < 500KB (gzipped)

2. **User Experience**
   - Error rate < 0.1%
   - API response time < 500ms (p95)
   - Zero XSS vulnerabilities
   - Lighthouse score > 90

3. **Code Quality**
   - TypeScript coverage > 90%
   - Test coverage > 70%
   - Zero console.log in production
   - All Critical/High issues resolved ✅

---

## 📝 Notes

- All Critical and High Priority items have been completed! 🎉
- This TODO list is not urgent - implement as time and resources allow
- Focus on user-facing features first, then optimization
- Re-prioritize based on actual user feedback and analytics
- Review and update this list quarterly

---

**Last Updated:** `[Current Date]`  
**Next Review:** `[3 months from now]`  
**Maintained By:** Development Team
