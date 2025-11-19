# RBAC System Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         RBAC SYSTEM ARCHITECTURE                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────┐
│   Backend   │ ◄─── Login Request
│     API     │
└──────┬──────┘
       │
       │ Returns User Object with Roles
       │ { userData: { roles: { SuperAdmin: 1 } } }
       ↓
┌─────────────────┐
│  AuthContext    │ ◄─── Stores authenticated user
│  (React Context)│
└────────┬────────┘
         │
         │ Provides user to components
         ↓
┌──────────────────┐
│  useRBAC Hook    │ ◄─── Extracts role & permissions
│                  │       from user object
└────────┬─────────┘
         │
         │ Returns permission checking functions
         ↓
┌────────────────────────────────┐
│  React Components              │
│                                │
│  • <Can>                       │ ◄─── Conditional rendering
│  • <RoleBasedRoute>            │ ◄─── Route protection
│  • hasPermission()             │ ◄─── Logic checks
│  • isSuperAdmin                │ ◄─── Role checks
└────────────────────────────────┘
```

## Role Hierarchy

```
┌────────────────────────────────────────────────────────────────┐
│                         ROLE HIERARCHY                          │
└────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │  SUPERADMIN  │
                    │  (Level 3)   │
                    └──────┬───────┘
                           │
                    ALL PERMISSIONS
                           │
           ┌───────────────┴───────────────┐
           │                               │
    ┌──────▼──────┐                       │
    │   ADMIN     │                       │
    │  (Level 2)  │                       │
    └──────┬──────┘                       │
           │                               │
    LIMITED PERMISSIONS                   │
    (No admin management)                 │
           │                               │
    ┌──────▼──────┐                       │
    │    STAFF    │                       │
    │  (Level 1)  │◄──────────────────────┘
    └─────────────┘
           │
    VIEW-ONLY ACCESS
```

## Permission Flow

```
┌────────────────────────────────────────────────────────────────┐
│                      PERMISSION CHECK FLOW                      │
└────────────────────────────────────────────────────────────────┘

User Clicks "Edit" Button
         │
         ↓
┌─────────────────┐
│ Component calls │
│ hasPermission() │
└────────┬────────┘
         │
         ↓
┌──────────────────┐     ┌─────────────────┐
│ Extract UserRole │────→│ Get Permissions │
│ from AuthContext │     │ for that Role   │
└──────────────────┘     └────────┬────────┘
                                  │
                                  ↓
                         ┌─────────────────┐
                         │ Check if User   │
                         │ has Permission  │
                         └────────┬────────┘
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
                 ↓                                 ↓
         ┌──────────────┐                ┌──────────────┐
         │  HAS ACCESS  │                │  NO ACCESS   │
         └──────┬───────┘                └──────┬───────┘
                │                               │
                ↓                               ↓
        Show Edit Button              Hide Edit Button
                                      or Show Message
```

## Component Usage Patterns

```
┌────────────────────────────────────────────────────────────────┐
│                    COMPONENT USAGE PATTERNS                     │
└────────────────────────────────────────────────────────────────┘

PATTERN 1: Hook-Based Check
┌─────────────────────────────────────────────────┐
│  const { hasPermission } = useRBAC();           │
│                                                 │
│  {hasPermission(Permission.EDIT) && (           │
│    <EditButton />                               │
│  )}                                             │
└─────────────────────────────────────────────────┘
         ↓ Use when:
         • You need the result in logic
         • Multiple checks in one component
         • Conditional styling/behavior


PATTERN 2: Declarative Component
┌─────────────────────────────────────────────────┐
│  <Can permission={Permission.EDIT}>             │
│    <EditButton />                               │
│  </Can>                                         │
└─────────────────────────────────────────────────┘
         ↓ Use when:
         • Simple show/hide UI elements
         • Cleaner JSX
         • Need fallback UI


PATTERN 3: Route Protection
┌─────────────────────────────────────────────────┐
│  <Route path="/admin/settings" element={        │
│    <SuperAdminRoute>                            │
│      <SystemSettings />                         │
│    </SuperAdminRoute>                           │
│  } />                                           │
└─────────────────────────────────────────────────┘
         ↓ Use when:
         • Protecting entire pages
         • Need redirect on unauthorized access
         • Route-level security
```

## Data Structure

```
┌────────────────────────────────────────────────────────────────┐
│                       DATA STRUCTURES                           │
└────────────────────────────────────────────────────────────────┘

USER OBJECT (from Backend):
┌────────────────────────────────────┐
│ {                                  │
│   userData: {                      │
│     username: "john_admin",        │
│     roles: {                       │
│       SuperAdmin: 1,    ◄─────────┼─── Role Flag
│       Admin: 0,                    │
│       Staff: 0                     │
│     }                              │
│   },                               │
│   accessToken: "..."               │
│ }                                  │
└────────────────────────────────────┘
         │
         ↓ Extract Role
┌────────────────────────────────────┐
│ UserRole.SUPERADMIN                │
└────────┬───────────────────────────┘
         │
         ↓ Map to Permissions
┌────────────────────────────────────┐
│ [                                  │
│   Permission.VIEW_USERS,           │
│   Permission.CREATE_USERS,         │
│   Permission.EDIT_USERS,           │
│   Permission.DELETE_USERS,         │
│   Permission.VIEW_ADMINS,          │
│   Permission.CREATE_ADMINS,        │
│   ... (all permissions)            │
│ ]                                  │
└────────────────────────────────────┘
         │
         ↓ Check Against
┌────────────────────────────────────┐
│ hasPermission(Permission.EDIT_USERS)│
│         ↓                          │
│       true ✓                       │
└────────────────────────────────────┘
```

## File Dependency Graph

```
┌────────────────────────────────────────────────────────────────┐
│                    FILE DEPENDENCY GRAPH                        │
└────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │ rbac.types.ts    │ ◄─── Base definitions
                    │ • UserRole       │
                    │ • Permission     │
                    │ • ROLE_PERMISSIONS│
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ rbac.utils.ts    │ ◄─── Pure functions
                    │ • getUserRole()  │
                    │ • hasPermission()│
                    │ • canAccess()    │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  useRBAC.ts      │ ◄─── React hook
                    │ Binds utils to   │
                    │ current user     │
                    └────────┬─────────┘
                             │
            ┌────────────────┴────────────────┐
            │                                 │
    ┌───────▼────────┐              ┌────────▼──────────┐
    │    Can.tsx     │              │ RoleBasedRoute.tsx│
    │ Conditional UI │              │ Route protection  │
    └────────────────┘              └───────────────────┘
            │                                 │
            └────────────────┬────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   index.ts       │ ◄─── Central exports
                    │ Export all RBAC  │
                    └──────────────────┘
                             │
                    ┌────────▼─────────┐
                    │ Your Components  │
                    │ Use RBAC system  │
                    └──────────────────┘
```

## Permission Matrix

```
┌────────────────────────────────────────────────────────────────┐
│                      PERMISSION MATRIX                          │
└────────────────────────────────────────────────────────────────┘

Permission                    SuperAdmin   Admin   Staff
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VIEW_USERS                        ✓         ✓       ✓
CREATE_USERS                      ✓         ✓       ✗
EDIT_USERS                        ✓         ✓       ✗
DELETE_USERS                      ✓         ✓       ✗

VIEW_ADMINS                       ✓         ✗       ✗
CREATE_ADMINS                     ✓         ✗       ✗
EDIT_ADMINS                       ✓         ✗       ✗
DELETE_ADMINS                     ✓         ✗       ✗

VIEW_CONTENT                      ✓         ✓       ✓
CREATE_CONTENT                    ✓         ✓       ✗
EDIT_CONTENT                      ✓         ✓       ✗
DELETE_CONTENT                    ✓         ✓       ✗

VIEW_SETTINGS                     ✓         ✓       ✓
EDIT_SETTINGS                     ✓         ✗       ✗

VIEW_REPORTS                      ✓         ✓       ✓
EXPORT_DATA                       ✓         ✓       ✗

VIEW_ACTIVITY_LOGS                ✓         ✓       ✓

Legend:
  ✓ = Has Permission
  ✗ = No Permission
```

## Integration Points

```
┌────────────────────────────────────────────────────────────────┐
│                      INTEGRATION POINTS                         │
└────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 1. MENU BAR (Navigation)                                        │
│                                                                 │
│  MenuBar.tsx                                                    │
│    ↓                                                            │
│  Filter menu items by permission                                │
│    ↓                                                            │
│  Hide "Admin Management" from Admin/Staff                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 2. ROUTES (Page Access)                                         │
│                                                                 │
│  App.tsx / Router                                               │
│    ↓                                                            │
│  Wrap routes with <RoleBasedRoute>                              │
│    ↓                                                            │
│  Redirect unauthorized users to dashboard                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 3. PAGES (UI Elements)                                          │
│                                                                 │
│  Dashboard.tsx, Settings.tsx, etc.                              │
│    ↓                                                            │
│  Add <ReadOnly /> banner for staff                              │
│    ↓                                                            │
│  Wrap buttons with <Can>                                        │
│    ↓                                                            │
│  Disable form fields for unauthorized users                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 4. FORMS (Data Entry)                                           │
│                                                                 │
│  UserForm.tsx, SettingsForm.tsx, etc.                           │
│    ↓                                                            │
│  Disable fields: disabled={!hasPermission(...)}                 │
│    ↓                                                            │
│  Hide submit button for staff                                   │
│    ↓                                                            │
│  Check permission before submitting                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 5. TABLES (Data Display)                                        │
│                                                                 │
│  DataTable.tsx, UserList.tsx, etc.                              │
│    ↓                                                            │
│  Show/hide action buttons per row                               │
│    ↓                                                            │
│  Edit: <Can permission={Permission.EDIT}>                       │
│  Delete: <Can permission={Permission.DELETE}>                   │
└─────────────────────────────────────────────────────────────────┘
```

## Testing Flow

```
┌────────────────────────────────────────────────────────────────┐
│                         TESTING FLOW                            │
└────────────────────────────────────────────────────────────────┘

Step 1: Login as SuperAdmin
         │
         ↓
┌─────────────────────────────────┐
│ • See all menu items            │
│ • Can access all pages          │
│ • All buttons visible           │
│ • All form fields enabled       │
│ • Can edit everything           │
└─────────────────────────────────┘

Step 2: Login as Admin
         │
         ↓
┌─────────────────────────────────┐
│ • No "Admin Management" in menu │
│ • Cannot access /manage-admins  │
│ • Can see most buttons          │
│ • Can edit content & users      │
│ • Cannot edit system settings   │
└─────────────────────────────────┘

Step 3: Login as Staff
         │
         ↓
┌─────────────────────────────────┐
│ • See "Read Only" warnings      │
│ • View-only menu items          │
│ • No edit/delete buttons        │
│ • All form fields disabled      │
│ • Cannot modify anything        │
└─────────────────────────────────┘

Step 4: Verify Redirects
         │
         ↓
┌─────────────────────────────────┐
│ Admin tries to access:          │
│ /admin/manage-admins            │
│         ↓                       │
│ Redirected to /admin/dashboard  │
│ with "Access Denied" message    │
└─────────────────────────────────┘
```

---

**Legend:**

- `│` : Connection/Flow
- `↓` : Direction of flow
- `◄─` : Points to/derives from
- `✓` : True/Has permission
- `✗` : False/No permission
