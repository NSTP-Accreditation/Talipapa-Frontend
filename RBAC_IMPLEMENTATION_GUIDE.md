# Role-Based Access Control (RBAC) Implementation Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [File Structure](#file-structure)
5. [Usage Examples](#usage-examples)
6. [Integration Guide](#integration-guide)
7. [Testing Guide](#testing-guide)
8. [Expanding the System](#expanding-the-system)
9. [Best Practices](#best-practices)

---

## 🎯 Overview

This RBAC system provides a production-ready, maintainable approach to manage user permissions in your React application. It supports three roles:

### Role Hierarchy

```
┌─────────────────────────────────────────────┐
│  SUPERADMIN - Full System Access            │
│  • All permissions                          │
│  • Can manage admin accounts                │
│  • Can modify system settings               │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  ADMIN - Limited System Access              │
│  • Cannot create/manage admin accounts      │
│  • Can manage all content & users           │
│  • Can view settings (but not edit)         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  STAFF - View-Only Access                   │
│  • Read-only access to all modules          │
│  • Cannot edit any content                  │
│  • Cannot delete or create records          │
└─────────────────────────────────────────────┘
```

---

## 🏗️ Architecture

### Core Components

```
src/
├── types/
│   └── rbac.types.ts          # Role & permission definitions
├── utils/
│   └── rbac.utils.ts          # Permission checking utilities
├── hooks/
│   └── useRBAC.ts             # React hook for RBAC
├── components/
│   └── rbac/
│       ├── Can.tsx            # Conditional rendering component
│       └── RoleBasedRoute.tsx # Route protection component
└── examples/
    ├── RBACExamples.tsx       # Comprehensive usage examples
    └── MenuBarWithRBAC.tsx    # MenuBar integration example
```

### Data Flow

```
┌──────────────┐
│   Backend    │  Returns user with roles: { SuperAdmin: 1 }
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ AuthContext  │  Stores authenticated user
└──────┬───────┘
       │
       ↓
┌──────────────┐
│   useRBAC    │  Extracts role → Checks permissions
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  Components  │  Render based on permissions
└──────────────┘
```

---

## 🚀 Quick Start

### Step 1: Import the Hook

```tsx
import { useRBAC } from '../hooks/useRBAC';
import { Permission } from '../types/rbac.types';
```

### Step 2: Use in Your Component

```tsx
function MyComponent() {
  const { hasPermission, isSuperAdmin, isReadOnly } = useRBAC();

  return (
    <div>
      {/* Show edit button only if user can edit */}
      {hasPermission(Permission.EDIT_CONTENT) && <button>Edit</button>}

      {/* Show admin panel only for SuperAdmin */}
      {isSuperAdmin && <AdminPanel />}

      {/* Show read-only warning for staff */}
      {isReadOnly && <div>You have read-only access</div>}
    </div>
  );
}
```

### Step 3: Use Declarative Components (Recommended)

```tsx
import { Can, SuperAdminOnly, ReadOnly } from '../components/rbac/Can';
import { Permission } from '../types/rbac.types';

function MyComponent() {
  return (
    <div>
      {/* Cleaner syntax with Can component */}
      <Can permission={Permission.EDIT_CONTENT}>
        <EditButton />
      </Can>

      {/* SuperAdmin-only content */}
      <SuperAdminOnly>
        <AdminPanel />
      </SuperAdminOnly>

      {/* Show warning banner for staff */}
      <ReadOnly message="You cannot edit this content." />
    </div>
  );
}
```

---

## 📁 File Structure

### 1. `rbac.types.ts` - Type Definitions

Defines all roles and permissions in the system.

**When to modify:**

- Adding a new role
- Adding a new permission
- Changing role-permission mappings

### 2. `rbac.utils.ts` - Utility Functions

Pure functions for permission checking.

**Key functions:**

- `getUserRole()` - Extract role from user object
- `hasPermission()` - Check single permission
- `hasAnyPermission()` - Check multiple permissions (OR)
- `hasAllPermissions()` - Check multiple permissions (AND)
- `canAccess()` - Flexible access control

### 3. `useRBAC.ts` - React Hook

React hook that binds utility functions to the current user.

**Returns:**

- User role information
- Permission checking functions
- Convenience booleans (isSuperAdmin, isAdmin, isStaff)

### 4. `Can.tsx` - Conditional Rendering Component

Declarative component for showing/hiding UI elements.

**Components:**

- `<Can>` - Generic permission/role check
- `<SuperAdminOnly>` - SuperAdmin-only content
- `<AdminOnly>` - Admin + SuperAdmin content
- `<NotStaff>` - Everyone except Staff
- `<ReadOnly>` - Read-only warning banner

### 5. `RoleBasedRoute.tsx` - Route Protection

Protects entire routes based on permissions/roles.

**Components:**

- `<RoleBasedRoute>` - Generic route protection
- `<SuperAdminRoute>` - SuperAdmin-only routes
- `<AdminRoute>` - Admin + SuperAdmin routes

---

## 💡 Usage Examples

### Example 1: Simple Permission Check

```tsx
import { useRBAC } from '../hooks/useRBAC';
import { Permission } from '../types/rbac.types';

function UserList() {
  const { hasPermission } = useRBAC();

  const canEdit = hasPermission(Permission.EDIT_USERS);
  const canDelete = hasPermission(Permission.DELETE_USERS);

  return (
    <div>
      <h1>Users</h1>
      <UserTable showEdit={canEdit} showDelete={canDelete} />
    </div>
  );
}
```

### Example 2: Conditional UI with Can Component

```tsx
import { Can } from '../components/rbac/Can';
import { Permission } from '../types/rbac.types';

function ContentEditor() {
  return (
    <div>
      <h1>Content</h1>

      {/* Show edit controls */}
      <Can permission={Permission.EDIT_CONTENT}>
        <EditToolbar />
      </Can>

      {/* Show delete button with fallback */}
      <Can
        permission={Permission.DELETE_CONTENT}
        fallback={<p>Contact admin to delete content</p>}
      >
        <DeleteButton />
      </Can>

      {/* Multiple permissions - user needs at least one */}
      <Can permissions={[Permission.VIEW_REPORTS, Permission.EXPORT_DATA]}>
        <ExportButton />
      </Can>
    </div>
  );
}
```

### Example 3: Route Protection

```tsx
import { Routes, Route } from 'react-router-dom';
import {
  RoleBasedRoute,
  SuperAdminRoute,
} from '../components/rbac/RoleBasedRoute';
import { Permission } from '../types/rbac.types';

function AppRoutes() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected by permission */}
      <Route
        path="/users"
        element={
          <RoleBasedRoute permissions={[Permission.VIEW_USERS]}>
            <UserManagement />
          </RoleBasedRoute>
        }
      />

      {/* SuperAdmin only */}
      <Route
        path="/system-settings"
        element={
          <SuperAdminRoute>
            <SystemSettings />
          </SuperAdminRoute>
        }
      />
    </Routes>
  );
}
```

### Example 4: Form Field Access Control

```tsx
import { useRBAC } from '../hooks/useRBAC';
import { Permission } from '../types/rbac.types';

function SettingsForm() {
  const { hasPermission, canEditSettings } = useRBAC();

  return (
    <form>
      <input
        type="text"
        name="siteName"
        disabled={!hasPermission(Permission.EDIT_SETTINGS)}
      />

      {/* Advanced fields only for SuperAdmin */}
      {canEditSettings && (
        <div>
          <input type="text" name="apiKey" />
          <input type="text" name="dbConnection" />
        </div>
      )}

      <button type="submit" disabled={!hasPermission(Permission.EDIT_SETTINGS)}>
        Save
      </button>
    </form>
  );
}
```

### Example 5: Data Table with Action Buttons

```tsx
import { Can } from '../components/rbac/Can';
import { Permission } from '../types/rbac.types';

function DataTable({ items }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.status}</td>
            <td>
              <button>View</button>

              <Can permission={Permission.EDIT_CONTENT}>
                <button>Edit</button>
              </Can>

              <Can permission={Permission.DELETE_CONTENT}>
                <button>Delete</button>
              </Can>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## 🔧 Integration Guide

### Integrate into Existing MenuBar

**File:** `src/admin/components/MenuBar.tsx`

```tsx
// 1. Import RBAC utilities
import { useRBAC } from '../../hooks/useRBAC';
import { Permission, UserRole } from '../../types/rbac.types';

// 2. Add permission requirements to menu items
interface MenuItem {
  // ... existing properties
  permission?: Permission;
  permissions?: Permission[];
  role?: UserRole;
}

// 3. Use the hook
const { hasPermission, hasAnyPermission, isSuperAdmin } = useRBAC();

// 4. Add permission checks to menu items
const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    // No permission required - visible to all
  },
  {
    label: 'Users',
    href: '/admin/users',
    permission: Permission.VIEW_USERS,
  },
  {
    label: 'Admin Management',
    href: '/admin/manage-admins',
    role: UserRole.SUPERADMIN,
  },
];

// 5. Filter menu items
const accessibleMenuItems = menuItems.filter((item) => {
  if (!item.permission && !item.role) return true;
  if (item.permission && !hasPermission(item.permission)) return false;
  if (item.role === UserRole.SUPERADMIN && !isSuperAdmin) return false;
  return true;
});

// 6. Render filtered items
{
  accessibleMenuItems.map((item) => <MenuItem key={item.href} item={item} />);
}
```

**See `src/examples/MenuBarWithRBAC.tsx` for complete implementation.**

### Integrate into Existing Pages

**Example: Activity Logs Page**

```tsx
// Before
function ActivityLogs() {
  return (
    <div>
      <h1>Activity Logs</h1>
      <LogsTable />
      <ExportButton />
    </div>
  );
}

// After - with RBAC
import { useRBAC } from '../hooks/useRBAC';
import { ReadOnly } from '../components/rbac/Can';
import { Permission } from '../types/rbac.types';

function ActivityLogs() {
  const { hasPermission } = useRBAC();

  return (
    <div>
      <h1>Activity Logs</h1>

      {/* Show read-only banner for staff */}
      <ReadOnly />

      <LogsTable />

      {/* Show export button only if user has permission */}
      {hasPermission(Permission.EXPORT_DATA) && <ExportButton />}
    </div>
  );
}
```

---

## 🧪 Testing Guide

### Test with Different Roles

Modify your AuthContext or backend response to return different roles:

```typescript
// SuperAdmin
{
  userData: {
    username: 'superadmin',
    roles: { SuperAdmin: 1 }
  }
}

// Admin
{
  userData: {
    username: 'admin',
    roles: { Admin: 1 }
  }
}

// Staff
{
  userData: {
    username: 'staff',
    roles: { Staff: 1 }
  }
}
```

### Testing Checklist

- [ ] SuperAdmin can see "Admin Management" menu item
- [ ] Admin cannot see "Admin Management" menu item
- [ ] Staff sees read-only warnings on edit pages
- [ ] Staff cannot see edit/delete buttons
- [ ] Admin can edit content but not system settings
- [ ] Routes redirect when accessing unauthorized pages
- [ ] Form fields are disabled for staff users

---

## 📈 Expanding the System

### Add a New Permission

1. **Add to Permission enum** (`rbac.types.ts`)

```typescript
export enum Permission {
  // ... existing permissions
  MANAGE_REPORTS = 'manage_reports', // NEW
}
```

2. **Add to role mappings** (`rbac.types.ts`)

```typescript
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPERADMIN]: [
    ...Object.values(Permission), // Has all
  ],
  [UserRole.ADMIN]: [
    // ... existing permissions
    Permission.MANAGE_REPORTS, // NEW
  ],
  [UserRole.STAFF]: [
    // Staff doesn't get this permission
  ],
};
```

3. **Use in components**

```typescript
<Can permission={Permission.MANAGE_REPORTS}>
  <ReportManagement />
</Can>
```

### Add a New Role

1. **Add to UserRole enum** (`rbac.types.ts`)

```typescript
export enum UserRole {
  SUPERADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  MANAGER = 'Manager', // NEW
  STAFF = 'Staff',
}
```

2. **Add to ROLE_PERMISSIONS** (`rbac.types.ts`)

```typescript
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // ... existing roles
  [UserRole.MANAGER]: [
    // Define Manager permissions
    Permission.VIEW_CONTENT,
    Permission.EDIT_CONTENT,
    // ... more permissions
  ],
};
```

3. **Update getUserRole()** (`rbac.utils.ts`)

```typescript
export const getUserRole = (user: any): UserRole | null => {
  if (!user?.userData?.roles) return null;

  const roles = user.userData.roles;

  if (roles.SuperAdmin) return UserRole.SUPERADMIN;
  if (roles.Admin) return UserRole.ADMIN;
  if (roles.Manager) return UserRole.MANAGER; // NEW
  if (roles.Staff) return UserRole.STAFF;

  return null;
};
```

4. **Add helper function** (`rbac.utils.ts`)

```typescript
export const isManager = (user: any): boolean => {
  return hasRole(user, UserRole.MANAGER);
};
```

5. **Add to useRBAC hook** (`useRBAC.ts`)

```typescript
return {
  // ... existing returns
  isManager: isManager(user), // NEW
};
```

6. **Use in components**

```typescript
const { isManager } = useRBAC();

{isManager && <ManagerDashboard />}
```

### Add Module-Specific Permissions

For fine-grained control, group permissions by module:

```typescript
// In rbac.types.ts
export enum UserPermission {
  // User Module
  VIEW_USERS = 'users.view',
  CREATE_USERS = 'users.create',
  EDIT_USERS = 'users.edit',
  DELETE_USERS = 'users.delete',

  // Content Module
  VIEW_CONTENT = 'content.view',
  CREATE_CONTENT = 'content.create',
  EDIT_CONTENT = 'content.edit',
  DELETE_CONTENT = 'content.delete',
  PUBLISH_CONTENT = 'content.publish',

  // Reports Module
  VIEW_REPORTS = 'reports.view',
  CREATE_REPORTS = 'reports.create',
  EXPORT_REPORTS = 'reports.export',
  SCHEDULE_REPORTS = 'reports.schedule',
}
```

---

## ✅ Best Practices

### 1. Always Check Permissions on Backend

```typescript
// ❌ BAD - Frontend only
<Can permission={Permission.DELETE_USERS}>
  <button onClick={deleteUser}>Delete</button>
</Can>

// ✅ GOOD - Frontend + Backend
<Can permission={Permission.DELETE_USERS}>
  <button onClick={async () => {
    // Backend will verify permission before deleting
    await api.deleteUser(userId);
  }}>Delete</button>
</Can>
```

### 2. Prefer Permission-Based Over Role-Based Checks

```typescript
// ❌ LESS FLEXIBLE
{isSuperAdmin && <ExportButton />}

// ✅ MORE FLEXIBLE
<Can permission={Permission.EXPORT_DATA}>
  <ExportButton />
</Can>
```

**Why?** If you later want Admins to export data too, you just update `ROLE_PERMISSIONS` instead of changing component code.

### 3. Use Declarative Components for Cleaner Code

```typescript
// ❌ LESS READABLE
{hasPermission(Permission.EDIT_CONTENT) && (
  <div className="toolbar">
    <button>Edit</button>
    <button>Save</button>
  </div>
)}

// ✅ MORE READABLE
<Can permission={Permission.EDIT_CONTENT}>
  <EditToolbar />
</Can>
```

### 4. Show Helpful Messages to Users

```typescript
// ❌ BAD - User doesn't know why they can't see content
<Can permission={Permission.MANAGE_ADMINS}>
  <AdminPanel />
</Can>

// ✅ GOOD - Clear feedback
<Can
  permission={Permission.MANAGE_ADMINS}
  fallback={
    <div className="alert">
      Only Super Administrators can manage admin accounts.
    </div>
  }
>
  <AdminPanel />
</Can>
```

### 5. Group Related Permissions

```typescript
// Define permission groups for easier management
const CONTENT_PERMISSIONS = [
  Permission.VIEW_CONTENT,
  Permission.EDIT_CONTENT,
  Permission.DELETE_CONTENT,
];

// Use in components
<Can permissions={CONTENT_PERMISSIONS}>
  <ContentManagement />
</Can>
```

### 6. Document Permission Requirements

```typescript
/**
 * Admin User Management Page
 *
 * Required Permissions:
 * - VIEW_ADMINS: To view the page
 * - CREATE_ADMINS: To create new admins
 * - EDIT_ADMINS: To edit existing admins
 * - DELETE_ADMINS: To delete admins
 *
 * Access: SuperAdmin only
 */
function AdminManagement() {
  // ...
}
```

### 7. Handle Edge Cases

```typescript
function DataTable() {
  const { hasPermission, userRole } = useRBAC();

  // Handle case where user role is not loaded yet
  if (!userRole) {
    return <LoadingSpinner />;
  }

  // Handle case where user has no permissions
  const canViewAnything = hasAnyPermission([
    Permission.VIEW_USERS,
    Permission.VIEW_CONTENT,
    Permission.VIEW_REPORTS,
  ]);

  if (!canViewAnything) {
    return <NoAccessPage />;
  }

  return <DataTableContent />;
}
```

---

## 🎓 Summary

### Quick Reference

| Component/Hook     | Use Case                       | Example                                              |
| ------------------ | ------------------------------ | ---------------------------------------------------- |
| `useRBAC()`        | Complex logic, multiple checks | `const { hasPermission } = useRBAC();`               |
| `<Can>`            | Simple UI element visibility   | `<Can permission={Permission.EDIT}><Button /></Can>` |
| `<SuperAdminOnly>` | SuperAdmin-only content        | `<SuperAdminOnly><Panel /></SuperAdminOnly>`         |
| `<ReadOnly>`       | Staff warning banners          | `<ReadOnly />`                                       |
| `<RoleBasedRoute>` | Route protection               | `<RoleBasedRoute roles={[UserRole.ADMIN]}>`          |

### Permission Hierarchy

```
VIEW → CREATE → EDIT → DELETE
  ↑       ↑       ↑       ↑
Staff   Admin   Admin  Admin
       SuperAdmin SuperAdmin SuperAdmin
```

### Next Steps

1. ✅ Review the example files in `src/examples/`
2. ✅ Integrate RBAC into your MenuBar component
3. ✅ Add permission checks to your existing pages
4. ✅ Protect your routes with RoleBasedRoute
5. ✅ Test with different user roles
6. ✅ Add backend permission validation
7. ✅ Deploy and monitor

---

## 📞 Support

For questions about RBAC implementation:

1. Check `src/examples/RBACExamples.tsx` for detailed examples
2. Review `src/examples/MenuBarWithRBAC.tsx` for integration pattern
3. Refer to inline comments in the source files

---

**Built with 30 years of experience mindset** 🚀
Production-ready • Type-safe • Maintainable • Scalable
