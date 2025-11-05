/**
 * Custom React Hook for Role-Based Access Control (RBAC)
 *
 * This hook provides easy access to RBAC functions throughout the application.
 * Use this hook in any component that needs to check user permissions or roles.
 *
 * @example
 * ```tsx
 * const { hasPermission, isSuperAdmin, canAccess } = useRBAC();
 *
 * if (hasPermission(Permission.MANAGE_USERS)) {
 *   // Show user management UI
 * }
 * ```
 */

import { useAuth } from '../contexts/AuthContext';
import { UserRole, Permission } from '../types/rbac.types';
import {
  getUserRole,
  hasRole,
  hasAnyRole,
  isSuperAdmin,
  isAdmin,
  isStaff,
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
} from '../utils/rbac.utils';

/**
 * RBAC Hook Interface
 * Provides all permission checking functions bound to the current user
 */
interface UseRBACReturn {
  // Current user's role
  userRole: UserRole | null;
  userRoleDisplay: string;
  userRoleBadgeColor: string;

  // Role checking functions
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isStaff: boolean;

  // Permission checking functions
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;

  // Advanced access control
  canAccess: (options: {
    permissions?: Permission[];
    roles?: UserRole[];
    requireAll?: boolean;
  }) => boolean;

  // Specific permission checks
  canManageAdmins: boolean;
  canEditSettings: boolean;
  isReadOnly: boolean;
}

/**
 * RBAC Hook
 * Returns permission checking functions bound to the current authenticated user
 *
 * @returns RBAC utility functions and user role information
 *
 * @example Basic usage
 * ```tsx
 * const { hasPermission, isSuperAdmin } = useRBAC();
 *
 * return (
 *   <div>
 *     {isSuperAdmin && <AdminPanel />}
 *     {hasPermission(Permission.EDIT_CONTENT) && <EditButton />}
 *   </div>
 * );
 * ```
 *
 * @example Advanced usage with canAccess
 * ```tsx
 * const { canAccess } = useRBAC();
 *
 * const canManageUsers = canAccess({
 *   permissions: [Permission.EDIT_USERS, Permission.DELETE_USERS],
 *   requireAll: false // User needs at least one permission
 * });
 * ```
 */
export const useRBAC = (): UseRBACReturn => {
  const { user } = useAuth();

  const currentRole = getUserRole(user);

  return {
    // User role information
    userRole: currentRole,
    userRoleDisplay: currentRole ? getRoleDisplayName(currentRole) : 'Unknown',
    userRoleBadgeColor: currentRole
      ? getRoleBadgeColor(currentRole)
      : 'bg-gray-100 text-gray-800',

    // Role checking - bound to current user
    hasRole: (role: UserRole) => hasRole(user, role),
    hasAnyRole: (roles: UserRole[]) => hasAnyRole(user, roles),
    isSuperAdmin: isSuperAdmin(user),
    isAdmin: isAdmin(user),
    isStaff: isStaff(user),

    // Permission checking - bound to current user
    permissions: getUserPermissions(user),
    hasPermission: (permission: Permission) => hasPermission(user, permission),
    hasAnyPermission: (permissions: Permission[]) =>
      hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions: Permission[]) =>
      hasAllPermissions(user, permissions),

    // Advanced access control
    canAccess: (options) => canAccess(user, options),

    // Specific permission checks
    canManageAdmins: canManageAdmins(user),
    canEditSettings: canEditSettings(user),
    isReadOnly: isReadOnly(user),
  };
};

export default useRBAC;
