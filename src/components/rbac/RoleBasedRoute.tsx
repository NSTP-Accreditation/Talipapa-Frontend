/**
 * Role-Based Protected Route Component
 *
 * This component extends the basic ProtectedRoute to add role and permission checks.
 * Use this for routes that should only be accessible to specific roles or permissions.
 *
 * @example Protect a route for SuperAdmin only
 * ```tsx
 * <Route
 *   path="/admin/manage-admins"
 *   element={
 *     <RoleBasedRoute roles={[UserRole.SUPERADMIN]}>
 *       <AdminManagement />
 *     </RoleBasedRoute>
 *   }
 * />
 * ```
 *
 * @example Protect a route with permission check
 * ```tsx
 * <Route
 *   path="/admin/edit-content"
 *   element={
 *     <RoleBasedRoute permissions={[Permission.EDIT_CONTENT]}>
 *       <ContentEditor />
 *     </RoleBasedRoute>
 *   }
 * />
 * ```
 */

import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRBAC } from '../../hooks/useRBAC';
import { Permission, UserRole } from '../../types/rbac.types';

interface RoleBasedRouteProps {
  children: ReactNode;

  // Single role check
  role?: UserRole;

  // Multiple roles check (user needs at least one)
  roles?: UserRole[];

  // Single permission check
  permission?: Permission;

  // Multiple permissions check
  permissions?: Permission[];

  // If true, user must have ALL specified permissions (default: false)
  requireAll?: boolean;

  // Custom redirect path if access denied (default: /admin/dashboard)
  redirectTo?: string;

  // Custom access denied message
  accessDeniedMessage?: string;
}

/**
 * RoleBasedRoute Component
 *
 * Protects routes based on user roles and permissions.
 * Redirects unauthorized users to dashboard with an access denied state.
 *
 * @param props - Component props
 * @returns Protected route component
 */
export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  role,
  roles,
  permission,
  permissions,
  requireAll = false,
  redirectTo = '/admin/dashboard',
  accessDeniedMessage = 'You do not have permission to access this page.',
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const rbac = useRBAC();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Build the permissions array
  const permissionsToCheck: Permission[] = [];
  if (permission) permissionsToCheck.push(permission);
  if (permissions) permissionsToCheck.push(...permissions);

  // Build the roles array
  const rolesToCheck: UserRole[] = [];
  if (role) rolesToCheck.push(role);
  if (roles) rolesToCheck.push(...roles);

  // Check if user has access
  const hasAccess = rbac.canAccess({
    permissions: permissionsToCheck.length > 0 ? permissionsToCheck : undefined,
    roles: rolesToCheck.length > 0 ? rolesToCheck : undefined,
    requireAll,
  });

  // Redirect if access denied
  if (!hasAccess) {
    return (
      <Navigate
        to={redirectTo}
        state={{
          from: location,
          accessDenied: true,
          message: accessDeniedMessage,
        }}
        replace
      />
    );
  }

  // Render the protected content
  return <>{children}</>;
};

/**
 * SuperAdminRoute Component
 * Shorthand for routes that only SuperAdmins can access
 *
 * @example
 * ```tsx
 * <Route
 *   path="/admin/system-settings"
 *   element={
 *     <SuperAdminRoute>
 *       <SystemSettings />
 *     </SuperAdminRoute>
 *   }
 * />
 * ```
 */
export const SuperAdminRoute: React.FC<{
  children: ReactNode;
  redirectTo?: string;
}> = ({ children, redirectTo }) => {
  return (
    <RoleBasedRoute
      roles={[UserRole.SUPERADMIN]}
      redirectTo={redirectTo}
      accessDeniedMessage="This page is only accessible to Super Administrators."
    >
      {children}
    </RoleBasedRoute>
  );
};

/**
 * AdminRoute Component
 * For routes accessible to SuperAdmin and Admin (not Staff)
 *
 * @example
 * ```tsx
 * <Route
 *   path="/admin/content-editor"
 *   element={
 *     <AdminRoute>
 *       <ContentEditor />
 *     </AdminRoute>
 *   }
 * />
 * ```
 */
export const AdminRoute: React.FC<{
  children: ReactNode;
  redirectTo?: string;
}> = ({ children, redirectTo }) => {
  return (
    <RoleBasedRoute
      roles={[UserRole.SUPERADMIN, UserRole.ADMIN]}
      redirectTo={redirectTo}
      accessDeniedMessage="This page is only accessible to Administrators."
    >
      {children}
    </RoleBasedRoute>
  );
};

export default RoleBasedRoute;
