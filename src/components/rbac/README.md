# RBAC Components

This folder contains the Role-Based Access Control (RBAC) system for conditional rendering and route protection.

## Components

### Can.tsx

Conditional rendering components based on permissions and roles.

**Components:**

- `<Can>` - Generic permission/role check
- `<SuperAdminOnly>` - SuperAdmin-only content
- `<AdminOnly>` - Admin + SuperAdmin content
- `<StaffOnly>` - Staff-only content
- `<NotStaff>` - Non-staff content
- `<ReadOnly>` - Read-only warning banner

**Usage:**

```tsx
import { Can, SuperAdminOnly, ReadOnly } from './components/rbac/Can';
import { Permission } from '../../types/rbac.types';

<Can permission={Permission.EDIT_CONTENT}>
  <EditButton />
</Can>

<SuperAdminOnly>
  <AdminPanel />
</SuperAdminOnly>

<ReadOnly />
```

### RoleBasedRoute.tsx

Route protection components based on permissions and roles.

**Components:**

- `<RoleBasedRoute>` - Generic route protection
- `<SuperAdminRoute>` - SuperAdmin-only routes
- `<AdminRoute>` - Admin + SuperAdmin routes

**Usage:**

```tsx
import {
  RoleBasedRoute,
  SuperAdminRoute,
} from './components/rbac/RoleBasedRoute';
import { Permission } from '../../types/rbac.types';

<Route
  path="/admin/settings"
  element={
    <SuperAdminRoute>
      <SystemSettings />
    </SuperAdminRoute>
  }
/>;
```

### index.ts

Central export file for all RBAC components and utilities.

**Usage:**

```tsx
// Import everything from one place
import { useRBAC, Can, Permission, UserRole } from './components/rbac';
```

## Quick Reference

See `RBAC_CHEAT_SHEET.md` in the project root for quick reference.

## Full Documentation

- **Quick Start:** `/RBAC_QUICK_START.md`
- **Complete Guide:** `/RBAC_IMPLEMENTATION_GUIDE.md`
- **Examples:** `/src/examples/`
