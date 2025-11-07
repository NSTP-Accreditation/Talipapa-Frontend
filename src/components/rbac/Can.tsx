/**
 * Conditional Rendering Component - Can
 *
 * This component handles conditional rendering based on user permissions and roles.
 * It's a cleaner alternative to inline conditional checks.
 *
 * @example Permission-based rendering
 * ```tsx
 * <Can permission={Permission.EDIT_CONTENT}>
 *   <EditButton />
 * </Can>
 * ```
 *
 * @example Role-based rendering
 * ```tsx
 * <Can roles={[UserRole.SUPERADMIN, UserRole.ADMIN]}>
 *   <AdminPanel />
 * </Can>
 * ```
 *
 * @example Multiple permissions (any)
 * ```tsx
 * <Can permissions={[Permission.EDIT_USERS, Permission.DELETE_USERS]}>
 *   <UserManagementPanel />
 * </Can>
 * ```
 *
 * @example Multiple permissions (all required)
 * ```tsx
 * <Can
 *   permissions={[Permission.EDIT_USERS, Permission.DELETE_USERS]}
 *   requireAll={true}
 * >
 *   <AdvancedUserManagement />
 * </Can>
 * ```
 *
 * @example With fallback
 * ```tsx
 * <Can
 *   permission={Permission.EDIT_CONTENT}
 *   fallback={<ReadOnlyView />}
 * >
 *   <EditableView />
 * </Can>
 * ```
 */

import React, { ReactNode } from 'react';
import { useRBAC } from '../../hooks/useRBAC';
import { Permission, UserRole } from '../../types/rbac.types';

interface CanProps {
  // Single permission check
  permission?: Permission;

  // Multiple permissions check
  permissions?: Permission[];

  // Single role check
  role?: UserRole;

  // Multiple roles check
  roles?: UserRole[];

  // If true, user must have ALL specified permissions (default: false)
  requireAll?: boolean;

  // Children to render if user has access
  children: ReactNode;

  // Optional fallback to render if user doesn't have access
  fallback?: ReactNode;

  // Optional: Invert the check (show if user DOESN'T have permission)
  not?: boolean;
}

/**
 * Can Component - Conditional Rendering Based on Permissions/Roles
 *
 * Renders children only if the user has the required permissions or roles.
 * This component makes permission checks declarative and easier to read.
 *
 * @param props - Component props
 * @returns React component that conditionally renders based on permissions
 */
export const Can: React.FC<CanProps> = ({
  permission,
  permissions,
  role,
  roles,
  requireAll = false,
  children,
  fallback = null,
  not = false,
}) => {
  const rbac = useRBAC();

  // Build the permissions array
  const permissionsToCheck: Permission[] = [];
  if (permission) permissionsToCheck.push(permission);
  if (permissions) permissionsToCheck.push(...permissions);

  // Build the roles array
  const rolesToCheck: UserRole[] = [];
  if (role) rolesToCheck.push(role);
  if (roles) rolesToCheck.push(...roles);

  // Perform the access check
  let hasAccess = rbac.canAccess({
    permissions: permissionsToCheck.length > 0 ? permissionsToCheck : undefined,
    roles: rolesToCheck.length > 0 ? rolesToCheck : undefined,
    requireAll,
  });

  // Invert the check if 'not' is true
  if (not) {
    hasAccess = !hasAccess;
  }

  return <>{hasAccess ? children : fallback}</>;
};

/**
 * SuperAdminOnly Component
 * Shorthand for rendering content only for SuperAdmins
 *
 * @example
 * ```tsx
 * <SuperAdminOnly>
 *   <AdminAccountManagement />
 * </SuperAdminOnly>
 * ```
 */
export const SuperAdminOnly: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ children, fallback = null }) => {
  const { isSuperAdmin } = useRBAC();
  return <>{isSuperAdmin ? children : fallback}</>;
};

/**
 * AdminOnly Component
 * Renders content only for SuperAdmin and Admin roles
 *
 * @example
 * ```tsx
 * <AdminOnly>
 *   <ContentManagement />
 * </AdminOnly>
 * ```
 */
export const AdminOnly: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ children, fallback = null }) => {
  const { isSuperAdmin, isAdmin } = useRBAC();
  return <>{isSuperAdmin || isAdmin ? children : fallback}</>;
};

/**
 * ReadOnly Component
 * Shows a read-only message or alternative UI for users without edit permissions
 *
 * @example
 * ```tsx
 * <ReadOnly
 *   message="You don't have permission to edit this content."
 *   children={<ReadOnlyBanner />}
 * />
 * ```
 */
export const ReadOnly: React.FC<{
  children?: ReactNode;
  message?: string;
  className?: string;
}> = ({
  children,
  message = 'You have read-only access to this content.',
  className = '',
}) => {
  const { isReadOnly } = useRBAC();

  if (!isReadOnly) return null;

  return (
    <div
      className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 ${className}`}
    >
      <div className="flex items-start">
        <svg
          className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Read-Only Access
          </h3>
          <p className="text-sm text-yellow-700 mt-1">{message}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Can;
