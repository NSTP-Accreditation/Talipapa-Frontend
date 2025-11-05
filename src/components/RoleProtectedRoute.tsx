/**
 * RoleProtectedRoute Component
 *
 * Protects routes based on RBAC permissions.
 * Prevents URL-based access to pages the user doesn't have permission for.
 *
 * Usage:
 * <RoleProtectedRoute permission={Permission.MANAGE_TRADING}>
 *   <TradingPage />
 * </RoleProtectedRoute>
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRBAC } from '../hooks/useRBAC';
import { Permission } from '../types/rbac.types';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  /** Single permission required to access the route */
  permission?: Permission;
  /** Multiple permissions - user needs at least one */
  permissions?: Permission[];
  /** Require all permissions instead of just one */
  requireAll?: boolean;
  /** Custom redirect path (defaults to /admin/dashboard) */
  redirectTo?: string;
}

/**
 * RoleProtectedRoute - Protects routes based on RBAC permissions
 *
 * Redirects users to dashboard if they lack required permissions.
 * Shows a brief "Access Denied" message before redirect.
 */
const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  permission,
  permissions,
  requireAll = false,
  redirectTo = '/admin/dashboard',
}) => {
  const { isAuthenticated, loading } = useAuth();
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useRBAC();
  const location = useLocation();
  const [showDenied, setShowDenied] = React.useState(false);

  // Wait for auth to load
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check permissions
  let hasAccess = true;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  // If no access, show denied message briefly then redirect
  if (!hasAccess) {
    if (!showDenied) {
      setShowDenied(true);
      // Redirect after showing message
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1500);
    }

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
            <span>Redirecting to dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  // User has access, render children
  return <>{children}</>;
};

export default RoleProtectedRoute;
