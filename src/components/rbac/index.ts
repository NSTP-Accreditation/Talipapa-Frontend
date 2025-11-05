/**
 * RBAC Components & Utilities - Central Export
 *
 * Import everything you need for RBAC from this single file.
 *
 * @example
 * ```tsx
 * import { useRBAC, Can, Permission } from './components/rbac';
 * ```
 */

// Type definitions
export { UserRole, Permission, ROLE_PERMISSIONS } from '../../types/rbac.types';
export type { RouteAccess, ComponentAccess } from '../../types/rbac.types';

// Utility functions
export {
  getUserRole,
  hasRole,
  hasAnyRole,
  isSuperAdmin,
  isAdmin,
  isStaff,
  getRolePermissions,
  getUserPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccess,
  canManageAdmins,
  canEditSettings,
  isReadOnly,
  getRoleDisplayName,
  getRoleBadgeColor,
} from '../../utils/rbac.utils';

// React Hook
export { useRBAC } from '../../hooks/useRBAC';
export type { default as UseRBACReturn } from '../../hooks/useRBAC';

// Conditional Rendering Components
export {
  Can,
  SuperAdminOnly,
  AdminOnly,
  StaffOnly,
  NotStaff,
  ReadOnly,
} from './Can';

// Route Protection Components
export { RoleBasedRoute, SuperAdminRoute, AdminRoute } from './RoleBasedRoute';

/**
 * USAGE EXAMPLES:
 *
 * 1. Simple permission check:
 * ```tsx
 * import { useRBAC, Permission } from './components/rbac';
 *
 * const { hasPermission } = useRBAC();
 * if (hasPermission(Permission.EDIT_CONTENT)) {
 *   // Show edit button
 * }
 * ```
 *
 * 2. Conditional rendering:
 * ```tsx
 * import { Can, Permission } from './components/rbac';
 *
 * <Can permission={Permission.DELETE_CONTENT}>
 *   <DeleteButton />
 * </Can>
 * ```
 *
 * 3. Route protection:
 * ```tsx
 * import { SuperAdminRoute } from './components/rbac';
 *
 * <Route path="/admin/settings" element={
 *   <SuperAdminRoute>
 *     <SystemSettings />
 *   </SuperAdminRoute>
 * } />
 * ```
 */
