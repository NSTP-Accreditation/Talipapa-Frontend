# RBAC Cheat Sheet 📋

## Quick Import Reference

```tsx
// Everything you need
import { useRBAC, Can, Permission, UserRole } from './components/rbac';
```

---

## Common Patterns

### 1. Hide/Show Button

```tsx
// Method 1: Hook
const { hasPermission } = useRBAC();
{
  hasPermission(Permission.EDIT_CONTENT) && <button>Edit</button>;
}

// Method 2: Component (PREFERRED)
<Can permission={Permission.EDIT_CONTENT}>
  <button>Edit</button>
</Can>;
```

### 2. Disable Form Field

```tsx
const { hasPermission } = useRBAC();

<input
  disabled={!hasPermission(Permission.EDIT_CONTENT)}
  // ... other props
/>;
```

### 3. SuperAdmin Only

```tsx
<SuperAdminOnly>
  <AdminPanel />
</SuperAdminOnly>
```

### 4. Read-Only Warning

```tsx
<ReadOnly />
// or with custom message
<ReadOnly message="You cannot edit this content." />
```

### 5. Check Before API Call

```tsx
const { hasPermission } = useRBAC();

const handleDelete = async () => {
  if (!hasPermission(Permission.DELETE_CONTENT)) {
    alert('No permission');
    return;
  }
  await api.delete(...);
};
```

### 6. Protect Route

```tsx
<Route
  path="/admin/settings"
  element={
    <SuperAdminRoute>
      <SystemSettings />
    </SuperAdminRoute>
  }
/>
```

### 7. Multiple Permissions (OR)

```tsx
<Can permissions={[Permission.EDIT, Permission.DELETE]}>
  <Actions />
</Can>
```

### 8. Multiple Permissions (AND)

```tsx
<Can permissions={[Permission.EDIT, Permission.DELETE]} requireAll={true}>
  <AdvancedActions />
</Can>
```

### 9. With Fallback

```tsx
<Can permission={Permission.EDIT} fallback={<p>Contact admin to edit</p>}>
  <EditButton />
</Can>
```

### 10. Filter Menu Items

```tsx
const { hasPermission } = useRBAC();

const visibleItems = menuItems.filter(
  (item) => !item.permission || hasPermission(item.permission)
);
```

---

## Permission List (Most Common)

```tsx
Permission.VIEW_USERS;
Permission.CREATE_USERS;
Permission.EDIT_USERS;
Permission.DELETE_USERS;

Permission.VIEW_CONTENT;
Permission.CREATE_CONTENT;
Permission.EDIT_CONTENT;
Permission.DELETE_CONTENT;

Permission.VIEW_ADMINS; // SuperAdmin only
Permission.CREATE_ADMINS; // SuperAdmin only
Permission.EDIT_ADMINS; // SuperAdmin only
Permission.DELETE_ADMINS; // SuperAdmin only

Permission.VIEW_SETTINGS;
Permission.EDIT_SETTINGS; // SuperAdmin only

Permission.VIEW_REPORTS;
Permission.EXPORT_DATA;

Permission.VIEW_ACTIVITY_LOGS;

Permission.VIEW_TRADING;
Permission.MANAGE_TRADING;

Permission.VIEW_INVENTORY;
Permission.MANAGE_INVENTORY;
```

---

## Role Checks

```tsx
const {
  isSuperAdmin,
  isAdmin,
  isStaff,
  isReadOnly,
  userRole,
  userRoleDisplay,
} = useRBAC();

// Boolean checks
if (isSuperAdmin) {
  /* ... */
}
if (isAdmin) {
  /* ... */
}
if (isStaff) {
  /* ... */
}
if (isReadOnly) {
  /* ... */
}

// Role value
console.log(userRole); // UserRole.SUPERADMIN
console.log(userRoleDisplay); // "Super Administrator"
```

---

## Component Reference

### `<Can>` Props

```tsx
interface CanProps {
  permission?: Permission; // Single permission
  permissions?: Permission[]; // Multiple permissions
  role?: UserRole; // Single role
  roles?: UserRole[]; // Multiple roles
  requireAll?: boolean; // All permissions required?
  children: ReactNode; // Content to show
  fallback?: ReactNode; // Content when no access
  not?: boolean; // Invert check
}
```

### `<RoleBasedRoute>` Props

```tsx
interface RoleBasedRouteProps {
  children: ReactNode;
  role?: UserRole;
  roles?: UserRole[];
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  redirectTo?: string; // Default: /admin/dashboard
  accessDeniedMessage?: string;
}
```

---

## Hook Return Values

```tsx
const {
  // Role info
  userRole, // UserRole | null
  userRoleDisplay, // "Super Administrator"
  userRoleBadgeColor, // Tailwind classes

  // Role checks
  hasRole, // (role) => boolean
  hasAnyRole, // (roles[]) => boolean
  isSuperAdmin, // boolean
  isAdmin, // boolean
  isStaff, // boolean

  // Permission checks
  permissions, // Permission[]
  hasPermission, // (perm) => boolean
  hasAnyPermission, // (perms[]) => boolean
  hasAllPermissions, // (perms[]) => boolean

  // Advanced
  canAccess, // (options) => boolean
  canManageAdmins, // boolean
  canEditSettings, // boolean
  isReadOnly, // boolean
} = useRBAC();
```

---

## Integration Template

```tsx
import React from 'react';
import { useRBAC } from '../hooks/useRBAC';
import { Can, ReadOnly } from '../components/rbac/Can';
import { Permission } from '../types/rbac.types';

export const YourPage: React.FC = () => {
  const { hasPermission } = useRBAC();

  const handleEdit = () => {
    if (!hasPermission(Permission.EDIT_CONTENT)) {
      alert('No permission');
      return;
    }
    // Edit logic
  };

  return (
    <div className="p-6">
      <h1>Page Title</h1>

      {/* Read-only warning for staff */}
      <ReadOnly />

      {/* Conditional buttons */}
      <div className="flex gap-2">
        <button onClick={() => {}}>View</button>

        <Can permission={Permission.EDIT_CONTENT}>
          <button onClick={handleEdit}>Edit</button>
        </Can>

        <Can permission={Permission.DELETE_CONTENT}>
          <button>Delete</button>
        </Can>
      </div>

      {/* SuperAdmin-only section */}
      <Can role={UserRole.SUPERADMIN}>
        <div className="mt-6 border-t pt-6">
          <h2>Advanced Settings</h2>
          {/* SuperAdmin content */}
        </div>
      </Can>
    </div>
  );
};
```

---

## Role Capabilities

```
┌─────────────┬───────────┬───────┬───────┐
│ Action      │ SuperAdmin│ Admin │ Staff │
├─────────────┼───────────┼───────┼───────┤
│ View        │     ✓     │   ✓   │   ✓   │
│ Create      │     ✓     │   ✓   │   ✗   │
│ Edit        │     ✓     │   ✓   │   ✗   │
│ Delete      │     ✓     │   ✓   │   ✗   │
│ Manage Admin│     ✓     │   ✗   │   ✗   │
│ Edit Settings│    ✓     │   ✗   │   ✗   │
└─────────────┴───────────┴───────┴───────┘
```

---

## Testing Quick Check

```tsx
// Test data
const testUsers = {
  superAdmin: { userData: { roles: { SuperAdmin: 1 } } },
  admin: { userData: { roles: { Admin: 1 } } },
  staff: { userData: { roles: { Staff: 1 } } },
};

// What to verify
SuperAdmin:
  ✓ See all menu items
  ✓ Can edit everything
  ✓ No read-only warnings

Admin:
  ✓ No "Admin Management" menu
  ✓ Can't edit settings
  ✓ Can edit content

Staff:
  ✓ See read-only warnings
  ✓ No edit/delete buttons
  ✓ Form fields disabled
```

---

## Common Mistakes ❌ → ✅

### ❌ Don't check roles directly

```tsx
// BAD
if (user.userData.roles.Admin) {
}
```

```tsx
// GOOD
const { isAdmin } = useRBAC();
if (isAdmin) {
}
```

### ❌ Don't use inline conditionals for complex UI

```tsx
// BAD - Hard to read
{
  hasPermission(Permission.EDIT) && (
    <div className="toolbar">
      <button>Edit</button>
      <button>Save</button>
    </div>
  );
}
```

```tsx
// GOOD - Cleaner
<Can permission={Permission.EDIT}>
  <EditToolbar />
</Can>
```

### ❌ Don't skip backend validation

```tsx
// BAD - Frontend only
<Can permission={Permission.DELETE}>
  <button onClick={deleteUser}>Delete</button>
</Can>
```

```tsx
// GOOD - Frontend + Backend
<Can permission={Permission.DELETE}>
  <button
    onClick={async () => {
      // Backend validates permission
      await api.deleteUser(id);
    }}
  >
    Delete
  </button>
</Can>
```

---

## Debugging Tips

### Check Current User Role

```tsx
const { userRole, userRoleDisplay, permissions } = useRBAC();

console.log('Role:', userRole);
console.log('Display:', userRoleDisplay);
console.log('Permissions:', permissions);
```

### Check Specific Permission

```tsx
const { hasPermission } = useRBAC();

console.log('Can edit?', hasPermission(Permission.EDIT_CONTENT));
console.log('Can delete?', hasPermission(Permission.DELETE_CONTENT));
```

### Verify User Object

```tsx
import { useAuth } from '../contexts/AuthContext';

const { user } = useAuth();
console.log('User object:', user);
console.log('Roles:', user?.userData?.roles);
```

---

## File Locations

```
src/
├── types/rbac.types.ts          # Definitions
├── utils/rbac.utils.ts          # Utilities
├── hooks/useRBAC.ts             # React hook
├── components/rbac/
│   ├── Can.tsx                  # Conditional rendering
│   ├── RoleBasedRoute.tsx       # Route protection
│   └── index.ts                 # Exports
└── examples/
    ├── RBACExamples.tsx         # Usage examples
    ├── IntegrationExamples.tsx  # Before/after
    └── MenuBarWithRBAC.tsx      # MenuBar example
```

---

## Quick Links

- **Quick Start:** `RBAC_QUICK_START.md`
- **Full Guide:** `RBAC_IMPLEMENTATION_GUIDE.md`
- **Diagrams:** `RBAC_ARCHITECTURE_DIAGRAM.md`
- **Summary:** `RBAC_IMPLEMENTATION_SUMMARY.md`

---

**Print this and keep it handy!** 📌
