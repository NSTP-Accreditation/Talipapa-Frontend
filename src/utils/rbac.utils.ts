/**
 * Role-Based Access Control (RBAC) Utility Functions
 *
 * This module provides helper functions to check user permissions and roles.
 * All permission checks should go through these utilities for consistency.
 */

import { UserRole, Permission, ROLE_PERMISSIONS } from '../types/rbac.types';

/**
 * Extract user role from the user object
 * Handles the current API structure where roles are nested objects
 *
 * @param user - User object from AuthContext
 * @returns UserRole enum value or null if no valid role found
 */
export const getUserRole = (user: any): UserRole | null => {
  if (!user?.userData?.roles) return null;

  const roles = user.userData.roles;

  // Check roles in priority order
  if (roles.SuperAdmin) return UserRole.SUPERADMIN;
  if (roles.Admin) return UserRole.ADMIN;
  if (roles.Staff) return UserRole.STAFF;

  return null;
};

/**
 * Check if a user has a specific role
 *
 * @param user - User object from AuthContext
 * @param role - Role to check for
 * @returns true if user has the specified role
 */
export const hasRole = (user: any, role: UserRole): boolean => {
  const userRole = getUserRole(user);
  return userRole === role;
};

/**
 * Check if a user has any of the specified roles
 *
 * @param user - User object from AuthContext
 * @param roles - Array of roles to check
 * @returns true if user has at least one of the specified roles
 */
export const hasAnyRole = (user: any, roles: UserRole[]): boolean => {
  const userRole = getUserRole(user);
  return userRole ? roles.includes(userRole) : false;
};

/**
 * Check if a user is a SuperAdmin
 *
 * @param user - User object from AuthContext
 * @returns true if user is a SuperAdmin
 */
export const isSuperAdmin = (user: any): boolean => {
  return hasRole(user, UserRole.SUPERADMIN);
};

/**
 * Check if a user is an Admin (not SuperAdmin)
 *
 * @param user - User object from AuthContext
 * @returns true if user is an Admin
 */
export const isAdmin = (user: any): boolean => {
  return hasRole(user, UserRole.ADMIN);
};

/**
 * Check if a user is Staff
 *
 * @param user - User object from AuthContext
 * @returns true if user is Staff
 */
export const isStaff = (user: any): boolean => {
  return hasRole(user, UserRole.STAFF);
};

/**
 * Get all permissions for a specific role
 *
 * @param role - Role to get permissions for
 * @returns Array of permissions for the role
 */
export const getRolePermissions = (role: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Get all permissions for the current user
 *
 * @param user - User object from AuthContext
 * @returns Array of permissions the user has
 */
export const getUserPermissions = (user: any): Permission[] => {
  const role = getUserRole(user);
  return role ? getRolePermissions(role) : [];
};

/**
 * Check if a user has a specific permission
 *
 * @param user - User object from AuthContext
 * @param permission - Permission to check for
 * @returns true if user has the specified permission
 */
export const hasPermission = (user: any, permission: Permission): boolean => {
  const userPermissions = getUserPermissions(user);
  return userPermissions.includes(permission);
};

/**
 * Check if a user has any of the specified permissions
 *
 * @param user - User object from AuthContext
 * @param permissions - Array of permissions to check
 * @returns true if user has at least one of the specified permissions
 */
export const hasAnyPermission = (
  user: any,
  permissions: Permission[]
): boolean => {
  const userPermissions = getUserPermissions(user);
  return permissions.some((permission) => userPermissions.includes(permission));
};

/**
 * Check if a user has all of the specified permissions
 *
 * @param user - User object from AuthContext
 * @param permissions - Array of permissions to check
 * @returns true if user has all of the specified permissions
 */
export const hasAllPermissions = (
  user: any,
  permissions: Permission[]
): boolean => {
  const userPermissions = getUserPermissions(user);
  return permissions.every((permission) =>
    userPermissions.includes(permission)
  );
};

/**
 * Check if a user can access a resource based on permissions or roles
 * This is a flexible function that handles both permission and role checks
 *
 * @param user - User object from AuthContext
 * @param options - Access control options
 * @returns true if user has access
 */
export const canAccess = (
  user: any,
  options: {
    permissions?: Permission[];
    roles?: UserRole[];
    requireAll?: boolean; // If true, requires all permissions/roles
  }
): boolean => {
  const { permissions, roles, requireAll = false } = options;

  // If no restrictions specified, allow access
  if (!permissions?.length && !roles?.length) {
    return true;
  }

  // Check role-based access
  if (roles?.length) {
    const hasRoleAccess = hasAnyRole(user, roles);
    if (!permissions?.length) {
      return hasRoleAccess;
    }
    // If both roles and permissions specified, user must pass role check first
    if (!hasRoleAccess) {
      return false;
    }
  }

  // Check permission-based access
  if (permissions?.length) {
    return requireAll
      ? hasAllPermissions(user, permissions)
      : hasAnyPermission(user, permissions);
  }

  return false;
};

/**
 * Check if user can manage admin accounts
 * Only SuperAdmin can create, edit, or delete admin accounts
 *
 * @param user - User object from AuthContext
 * @returns true if user can manage admins
 */
export const canManageAdmins = (user: any): boolean => {
  return isSuperAdmin(user);
};

/**
 * Check if user can edit settings
 * Only SuperAdmin can modify system settings
 *
 * @param user - User object from AuthContext
 * @returns true if user can edit settings
 */
export const canEditSettings = (user: any): boolean => {
  return hasPermission(user, Permission.EDIT_SETTINGS);
};

/**
 * Check if user has read-only access
 * Staff members have read-only access
 *
 * @param user - User object from AuthContext
 * @returns true if user has read-only access
 */
export const isReadOnly = (user: any): boolean => {
  return isStaff(user);
};

/**
 * Get user role display name
 * Converts role enum to user-friendly display name
 *
 * @param role - UserRole enum value
 * @returns Display name for the role
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const displayNames: Record<UserRole, string> = {
    [UserRole.SUPERADMIN]: 'Super Administrator',
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.STAFF]: 'Staff',
  };
  return displayNames[role] || role;
};

/**
 * Get user role badge color for UI display
 *
 * @param role - UserRole enum value
 * @returns Tailwind CSS color classes for badge
 */
export const getRoleBadgeColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    [UserRole.SUPERADMIN]: 'bg-purple-100 text-purple-800 border-purple-200',
    [UserRole.ADMIN]: 'bg-blue-100 text-blue-800 border-blue-200',
    [UserRole.STAFF]: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
};
