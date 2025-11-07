/**
 * Role-Based Access Control (RBAC) Utility Functions
 *
 * This module provides helper functions to check user permissions and roles.
 * All permission checks should go through these utilities for consistency.
 *
 * SECURITY: All permission checks are CLIENT-SIDE ONLY.
 * Backend MUST validate permissions independently.
 */

import {
  UserRole,
  Permission,
  ROLE_PERMISSIONS,
  PERMISSION_HIERARCHY,
} from '../types/rbac.types';
import { AuthUser } from '../types/auth.types';
import { decodeJWT } from './jwt.utils';

/**
 * Role ID Configuration
 * Validates that environment variables are properly configured
 */
const getRoleConfig = () => {
  const superAdminId = Number(import.meta.env.VITE_SUPERADMIN);
  const adminId = Number(import.meta.env.VITE_ADMIN);

  // Validate configuration (fail fast if misconfigured)
  if (!superAdminId || !adminId) {
    console.error(
      '[RBAC] CRITICAL: Role IDs not configured in environment variables'
    );
    console.error('[RBAC] Required: VITE_SUPERADMIN, VITE_ADMIN');
    // Return defaults to prevent app crash, but log error
    return {
      superAdminId: superAdminId || 32562,
      adminId: adminId || 92781,
      isConfigured: false,
    };
  }

  return { superAdminId, adminId, isConfigured: true };
};

// Cache permission results for performance
const permissionCache = new WeakMap<AuthUser, Permission[]>();

// Rate limiter to prevent permission check spam
// NOTE: Set to high limit because React components re-render frequently
const permissionCheckLimiter = new Map<
  string,
  { count: number; resetTime: number }
>();
const MAX_CHECKS_PER_SECOND = 10000; // Very high limit - only blocks actual attacks
const RATE_LIMIT_WINDOW = 1000; // 1 second

// Cache permission check results to prevent redundant checks
const permissionCheckCache = new Map<
  string,
  { result: boolean; expiry: number }
>();
const PERMISSION_CHECK_CACHE_TTL = 100; // Cache for 100ms

/**
 * Check if user exceeds rate limit for permission checks
 * NOTE: Increased limit to accommodate React re-renders
 */
const isRateLimited = (userId: string): boolean => {
  const now = Date.now();
  const userLimit = permissionCheckLimiter.get(userId);

  if (!userLimit || now >= userLimit.resetTime) {
    // Reset counter
    permissionCheckLimiter.set(userId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return false;
  }

  // Increment counter
  userLimit.count++;

  if (userLimit.count > MAX_CHECKS_PER_SECOND) {
    console.error('[RBAC Security] Rate limit exceeded (potential attack):', {
      user: userId,
      checks: userLimit.count,
      window: RATE_LIMIT_WINDOW,
    });
    return true;
  }

  return false;
};

// Track denied access attempts for security monitoring
const logDeniedAccess = (
  user: AuthUser | null,
  permission: Permission,
  context?: string
) => {
  if (typeof window === 'undefined') return;

  // Only log in development mode with debug flag
  if (
    process.env.NODE_ENV === 'development' &&
    (window as any).__RBAC_DEBUG__
  ) {
    const logEntry = {
      type: 'PERMISSION_DENIED',
      timestamp: new Date().toISOString(),
      user: user?.userData?.username || 'anonymous',
      role: getUserRole(user),
      permission,
      page: window.location.pathname,
      context,
    };
    console.warn('[RBAC] Permission denied:', logEntry);
  }

  // In production, send to analytics/logging service (not console)
  if (import.meta.env.PROD) {
    // TODO: Send to logging service
    // sendSecurityLog({ permission, timestamp: Date.now() });
  }
}; /**
 * Extract user role from the user object
 * Handles the current API structure where roles are stored as role IDs from env
 *
 * @param user - User object from AuthContext
 * @returns UserRole enum value or null if no valid role found
 */
export const getUserRole = (user: AuthUser | null): UserRole | null => {
  if (!user?.userData) return null;

  // Get role IDs from environment variables
  const { superAdminId, adminId, isConfigured } = getRoleConfig();

  // Debug logging (controlled by window.__RBAC_DEBUG__)
  const debugEnabled =
    typeof window !== 'undefined' && (window as any).__RBAC_DEBUG__;

  if (debugEnabled) {
    console.group('🔍 getUserRole Analysis');
    console.log('Expected Role IDs:', { superAdminId, adminId });
    console.log(
      'Configuration Status:',
      isConfigured ? '✅ Valid' : '⚠️ Using fallbacks'
    );
    console.log('User Data:', user.userData);
  }

  // PRIORITY 1: Check rolesKeys array (most reliable - direct role labels)
  if (
    Array.isArray(user.userData.rolesKeys) &&
    user.userData.rolesKeys.length > 0
  ) {
    const roleKeys = user.userData.rolesKeys;
    if (debugEnabled) console.log('✓ Found rolesKeys array:', roleKeys);

    // Return first matching role (priority: SuperAdmin > Admin)
    if (roleKeys.includes('SuperAdmin')) {
      if (debugEnabled) console.log('✅ Detected: SUPERADMIN (from rolesKeys)');
      if (debugEnabled) console.groupEnd();
      return UserRole.SUPERADMIN;
    }
    if (roleKeys.includes('Admin')) {
      if (debugEnabled) console.log('✅ Detected: ADMIN (from rolesKeys)');
      if (debugEnabled) console.groupEnd();
      return UserRole.ADMIN;
    }
  }

  // PRIORITY 2: Check roles object (role IDs from database)
  if (user.userData.roles && typeof user.userData.roles === 'object') {
    const roles = user.userData.roles;
    if (debugEnabled) console.log('✓ Found roles object:', roles);

    // SECURITY FIX: Only check for exact role ID match, NO || === 1 fallback
    // This prevents security vulnerability where anyone with role: 1 gets access
    if (roles.SuperAdmin === superAdminId) {
      if (debugEnabled)
        console.log('✅ Detected: SUPERADMIN (from roles object)');
      if (debugEnabled) console.groupEnd();
      return UserRole.SUPERADMIN;
    }
    if (roles.Admin === adminId) {
      if (debugEnabled) console.log('✅ Detected: ADMIN (from roles object)');
      if (debugEnabled) console.groupEnd();
      return UserRole.ADMIN;
    }
  }

  // PRIORITY 3: Decode JWT token as fallback (should match backend structure)
  if (user.accessToken) {
    const decoded = decodeJWT(user.accessToken);

    if (debugEnabled) console.log('✓ Decoded JWT:', decoded);

    if (decoded?.userInfo?.roles && Array.isArray(decoded.userInfo.roles)) {
      const roleIds = decoded.userInfo.roles;
      if (debugEnabled) console.log('✓ Found role IDs in JWT:', roleIds);

      if (roleIds.includes(superAdminId)) {
        if (debugEnabled) console.log('✅ Detected: SUPERADMIN (from JWT)');
        if (debugEnabled) console.groupEnd();
        return UserRole.SUPERADMIN;
      }
      if (roleIds.includes(adminId)) {
        if (debugEnabled) console.log('✅ Detected: ADMIN (from JWT)');
        if (debugEnabled) console.groupEnd();
        return UserRole.ADMIN;
      }
    }
  }

  if (debugEnabled) {
    console.error('❌ No valid role detected');
    console.groupEnd();
  }
  return null;
};

/**
 * Check if a user has a specific role
 *
 * @param user - User object from AuthContext
 * @param role - Role to check for
 * @returns true if user has the specified role
 */
export const hasRole = (user: AuthUser | null, role: UserRole): boolean => {
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
export const hasAnyRole = (
  user: AuthUser | null,
  roles: UserRole[]
): boolean => {
  const userRole = getUserRole(user);
  return userRole ? roles.includes(userRole) : false;
};

/**
 * Check if a user is a SuperAdmin
 *
 * @param user - User object from AuthContext
 * @returns true if user is a SuperAdmin
 */
export const isSuperAdmin = (user: AuthUser | null): boolean => {
  return hasRole(user, UserRole.SUPERADMIN);
};

/**
 * Check if a user is an Admin (not SuperAdmin)
 *
 * @param user - User object from AuthContext
 * @returns true if user is an Admin
 */
export const isAdmin = (user: AuthUser | null): boolean => {
  return hasRole(user, UserRole.ADMIN);
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
 * Uses caching to avoid recalculating permissions on every call
 *
 * @param user - User object from AuthContext
 * @returns Array of permissions the user has
 */
export const getUserPermissions = (user: AuthUser | null): Permission[] => {
  if (!user) return [];

  // Check cache first for performance
  if (permissionCache.has(user)) {
    return permissionCache.get(user)!;
  }

  // Calculate permissions
  const role = getUserRole(user);
  const permissions = role ? getRolePermissions(role) : [];

  // Cache result
  permissionCache.set(user, permissions);

  return permissions;
};

/**
 * Check if a user has a specific permission
 * Uses permission hierarchy - higher permissions grant lower ones
 * Logs denied access attempts for security monitoring
 *
 * @param user - User object from AuthContext
 * @param permission - Permission to check for
 * @param context - Optional context for logging (e.g., 'Delete User Button')
 * @returns true if user has the specified permission
 *
 * @example
 * // If user has MANAGE_INVENTORY, they automatically have VIEW_INVENTORY
 * hasPermission(user, Permission.VIEW_INVENTORY) // returns true
 */
export const hasPermission = (
  user: AuthUser | null,
  permission: Permission,
  context?: string
): boolean => {
  if (!user) return false;

  const userId = user.userData?.username || 'anonymous';

  // Check cache first to avoid redundant calculations
  const cacheKey = `${userId}:${permission}`;
  const now = Date.now();
  const cached = permissionCheckCache.get(cacheKey);

  if (cached && now < cached.expiry) {
    return cached.result;
  }

  // Rate limiting check (only for actual attacks - 10k/second threshold)
  if (isRateLimited(userId)) {
    console.error(
      '[RBAC Security] Permission check rate limit exceeded for:',
      userId
    );
    return false;
  }

  const userPermissions = getUserPermissions(user);

  // Check if user has the requested permission OR a higher permission that grants it
  // For example: if checking VIEW_RECORDS, user with MANAGE_RECORDS will pass
  // because MANAGE_RECORDS hierarchy includes VIEW_RECORDS
  const hasAccess = userPermissions.some((userPerm) => {
    const userGrantedPerms = PERMISSION_HIERARCHY[userPerm] || [userPerm];
    return userGrantedPerms.includes(permission);
  });

  // Cache the result
  permissionCheckCache.set(cacheKey, {
    result: hasAccess,
    expiry: now + PERMISSION_CHECK_CACHE_TTL,
  });

  // Log denied access for security monitoring
  if (!hasAccess && user) {
    logDeniedAccess(user, permission, context);
  }

  return hasAccess;
};

/**
 * Check if a user has any of the specified permissions
 *
 * @param user - User object from AuthContext
 * @param permissions - Array of permissions to check
 * @returns true if user has at least one of the specified permissions
 */
export const hasAnyPermission = (
  user: AuthUser | null,
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
  user: AuthUser | null,
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
  user: AuthUser | null,
  options: {
    permissions?: Permission[];
    roles?: UserRole[];
    requireAll?: boolean; // If true, requires all permissions/roles
  }
): boolean => {
  const { permissions, roles, requireAll = false } = options;

  // If no restrictions specified, deny access (secure by default)
  if (!permissions?.length && !roles?.length) {
    return false;
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
export const canManageAdmins = (user: AuthUser | null): boolean => {
  return isSuperAdmin(user);
};

/**
 * Check if user can edit settings
 * Only SuperAdmin can modify system settings
 *
 * @param user - User object from AuthContext
 * @returns true if user can edit settings
 */
export const canEditSettings = (user: AuthUser | null): boolean => {
  return hasPermission(user, Permission.EDIT_SETTINGS);
};

/**
 * Check if user has read-only access
 * Currently returns false as staff role has been removed
 *
 * @param user - User object from AuthContext
 * @returns true if user has read-only access
 */
export const isReadOnly = (user: AuthUser | null): boolean => {
  return false;
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
  };
  return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
};
