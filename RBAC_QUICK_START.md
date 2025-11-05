# RBAC Quick Start Guide

## 🚀 5-Minute Integration

### Step 1: Add RBAC to a Page (2 minutes)

```tsx
// Import at the top
import { useRBAC } from '../hooks/useRBAC';
import { ReadOnly } from '../components/rbac/Can';
import { Permission } from '../types/rbac.types';

// Inside your component
function YourPage() {
  const { hasPermission } = useRBAC();

  return (
    <div>
      {/* Show read-only warning for staff */}
      <ReadOnly />

      {/* Your existing content */}
      <h1>Page Title</h1>

      {/* Hide edit button from staff */}
      {hasPermission(Permission.EDIT_CONTENT) && <button>Edit</button>}
    </div>
  );
}
```

### Step 2: Add RBAC to MenuBar (3 minutes)

```tsx
// In MenuBar.tsx, add at the top
import { useRBAC } from '../../hooks/useRBAC';
import { Permission } from '../../types/rbac.types';

// Inside MenuBar component
const { hasPermission, isSuperAdmin } = useRBAC();

// Filter menu items
const visibleMenuItems = menuItems.filter((item) => {
  // Dashboard - always visible
  if (item.href === '/admin/dashboard') return true;

  // Activity Logs - requires permission
  if (item.href === '/admin/activity-logs') {
    return hasPermission(Permission.VIEW_ACTIVITY_LOGS);
  }

  // Settings - requires permission
  if (item.href === '/admin/settings') {
    return hasPermission(Permission.VIEW_SETTINGS);
  }

  // Add more checks as needed...
  return true;
});

// Render filtered items
{
  visibleMenuItems.map((item) => <MenuItem key={item.href} {...item} />);
}
```

---

## 📚 Common Patterns

### Pattern 1: Hide Button Based on Permission

```tsx
import { Can } from '../components/rbac/Can';
import { Permission } from '../types/rbac.types';

<Can permission={Permission.DELETE_CONTENT}>
  <button>Delete</button>
</Can>;
```

### Pattern 2: Disable Form Field for Staff

```tsx
import { useRBAC } from '../hooks/useRBAC';
import { Permission } from '../types/rbac.types';

const { hasPermission } = useRBAC();

<input
  disabled={!hasPermission(Permission.EDIT_CONTENT)}
  // ... other props
/>;
```

### Pattern 3: SuperAdmin-Only Section

```tsx
import { SuperAdminOnly } from '../components/rbac/Can';

<SuperAdminOnly>
  <div className="admin-settings">{/* SuperAdmin-only content */}</div>
</SuperAdminOnly>;
```

### Pattern 4: Show Message When No Access

```tsx
import { Can } from '../components/rbac/Can';
import { Permission } from '../types/rbac.types';

<Can
  permission={Permission.MANAGE_ADMINS}
  fallback={<p>Only Super Administrators can access this section.</p>}
>
  <AdminPanel />
</Can>;
```

### Pattern 5: Check Before API Call

```tsx
import { useRBAC } from '../hooks/useRBAC';
import { Permission } from '../types/rbac.types';

const { hasPermission } = useRBAC();

const handleDelete = async (id: number) => {
  // Check permission first
  if (!hasPermission(Permission.DELETE_CONTENT)) {
    alert('You do not have permission to delete content');
    return;
  }

  // Make API call
  await api.deleteContent(id);
};
```

---

## 🎯 Role Capabilities Reference

### SuperAdmin ⭐

- ✅ Everything below PLUS:
- ✅ Manage admin accounts
- ✅ Edit system settings
- ✅ Full system access

### Admin 👔

- ✅ Everything below PLUS:
- ✅ Create/edit/delete content
- ✅ Manage users (not admins)
- ✅ Export data
- ❌ Cannot manage admin accounts
- ❌ Cannot edit system settings

### Staff 👀

- ✅ View all content
- ✅ View reports
- ✅ View activity logs
- ❌ Cannot create/edit/delete anything
- ❌ View-only access

---

## 📋 Integration Checklist

Use this checklist when adding RBAC to a page:

```
□ Import useRBAC hook
□ Import Permission enum
□ Import Can/ReadOnly components
□ Add useRBAC() to component
□ Add <ReadOnly /> banner at top
□ Wrap edit buttons with <Can>
□ Wrap delete buttons with <Can>
□ Wrap create buttons with <Can>
□ Disable form fields for staff
□ Check permissions before API calls
□ Add SuperAdmin-only sections if needed
□ Test with all 3 roles
```

---

## 🧪 Testing Your Changes

### Test Users Setup

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

### What to Test

1. **SuperAdmin:**
   - Can see "Admin Management" in menu
   - Can edit all settings
   - Can see and use all features

2. **Admin:**
   - Cannot see "Admin Management" in menu
   - Can edit content but not system settings
   - Can create/edit/delete records

3. **Staff:**
   - Sees "Read-Only" banners on all pages
   - Edit/Delete buttons are hidden
   - Form fields are disabled
   - Can only view content

---

## ❓ FAQ

### Q: How do I add a new permission?

**A:**

1. Add to `Permission` enum in `src/types/rbac.types.ts`
2. Add to appropriate roles in `ROLE_PERMISSIONS`
3. Use with `hasPermission(Permission.YOUR_PERMISSION)`

### Q: How do I make something SuperAdmin-only?

**A:** Use `<SuperAdminOnly>`:

```tsx
<SuperAdminOnly>
  <YourComponent />
</SuperAdminOnly>
```

### Q: How do I check multiple permissions?

**A:** Use `permissions` array:

```tsx
<Can permissions={[Permission.EDIT, Permission.DELETE]}>
  <Button />
</Can>
```

### Q: How do I hide a menu item?

**A:** Filter it based on permission:

```tsx
const visibleItems = menuItems.filter((item) =>
  hasPermission(item.requiredPermission)
);
```

### Q: Do I need to check permissions on the backend too?

**A:** **YES!** Frontend checks are for UX. Backend checks provide security.

---

## 📖 Full Documentation

For complete documentation, see:

- **[RBAC_IMPLEMENTATION_GUIDE.md](./RBAC_IMPLEMENTATION_GUIDE.md)** - Complete guide
- **[src/examples/RBACExamples.tsx](./src/examples/RBACExamples.tsx)** - Code examples
- **[src/examples/IntegrationExamples.tsx](./src/examples/IntegrationExamples.tsx)** - Before/after comparisons
- **[src/examples/MenuBarWithRBAC.tsx](./src/examples/MenuBarWithRBAC.tsx)** - MenuBar integration

---

## 🆘 Need Help?

1. Check the examples folder: `src/examples/`
2. Read the full guide: `RBAC_IMPLEMENTATION_GUIDE.md`
3. Look at inline comments in the source files
4. Review the type definitions: `src/types/rbac.types.ts`

---

**Happy Coding! 🎉**
