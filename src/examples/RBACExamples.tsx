/**
 * RBAC IMPLEMENTATION EXAMPLES
 *
 * This file demonstrates how to use the Role-Based Access Control system
 * in various real-world scenarios throughout the application.
 *
 * TABLE OF CONTENTS:
 * 1. Component-Level Permission Checks
 * 2. Conditional UI Rendering
 * 3. Route Protection
 * 4. Form Field Access Control
 * 5. Button/Action Access Control
 * 6. Menu Item Filtering
 * 7. Data Access Control
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useRBAC } from '../hooks/useRBAC';
import { Permission, UserRole } from '../types/rbac.types';
import {
  Can,
  SuperAdminOnly,
  AdminOnly,
  NotStaff,
  ReadOnly,
} from '../components/rbac/Can';
import {
  RoleBasedRoute,
  SuperAdminRoute,
  AdminRoute,
} from '../components/rbac/RoleBasedRoute';

// ============================================================================
// EXAMPLE 1: Component-Level Permission Checks
// ============================================================================

/**
 * Example: User Management Component
 * Shows how to use the useRBAC hook for permission checks
 */
export const UserManagementExample: React.FC = () => {
  const { hasPermission, canManageAdmins, isReadOnly, userRoleDisplay } =
    useRBAC();

  return (
    <div className="p-6">
      <div className="mb-4">
        <span className="text-sm text-gray-600">Your Role: </span>
        <span className="font-semibold">{userRoleDisplay}</span>
      </div>

      {/* Show read-only banner if user is staff */}
      <ReadOnly message="You can view user data but cannot make changes." />

      {/* Conditionally render based on permission */}
      {hasPermission(Permission.VIEW_USERS) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">User List</h2>
          {/* User list component */}
        </div>
      )}

      {/* Show create button only if user can create users */}
      {hasPermission(Permission.CREATE_USERS) && (
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Create New User
        </button>
      )}

      {/* Show admin management section only for SuperAdmin */}
      {canManageAdmins && (
        <div className="mt-6 border-t pt-6">
          <h2 className="text-xl font-bold mb-4">Admin Account Management</h2>
          <p className="text-sm text-gray-600 mb-4">
            Only Super Administrators can manage admin accounts
          </p>
          <button className="bg-purple-500 text-white px-4 py-2 rounded">
            Manage Admins
          </button>
        </div>
      )}

      {/* Show export button if user has export permission */}
      {hasPermission(Permission.EXPORT_DATA) && (
        <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
          Export User Data
        </button>
      )}
    </div>
  );
};

// ============================================================================
// EXAMPLE 2: Conditional UI Rendering with <Can> Component
// ============================================================================

/**
 * Example: Content Editor with Permission-Based UI
 * Uses the <Can> component for cleaner conditional rendering
 */
export const ContentEditorExample: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Content Management</h1>

      {/* Read-only banner for staff */}
      <ReadOnly />

      {/* Show edit controls only if user can edit content */}
      <Can permission={Permission.EDIT_CONTENT}>
        <div className="mb-4 flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Edit
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded">
            Save Draft
          </button>
        </div>
      </Can>

      {/* Show delete button only if user can delete content */}
      <Can
        permission={Permission.DELETE_CONTENT}
        fallback={
          <p className="text-sm text-gray-500">
            You don't have permission to delete content
          </p>
        }
      >
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          Delete Content
        </button>
      </Can>

      {/* Show for SuperAdmin and Admin only */}
      <AdminOnly>
        <div className="mt-6 border-t pt-6">
          <h3 className="font-semibold mb-2">Advanced Options</h3>
          <button className="bg-purple-500 text-white px-4 py-2 rounded">
            Bulk Operations
          </button>
        </div>
      </AdminOnly>

      {/* Show only for SuperAdmin */}
      <SuperAdminOnly>
        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded">
          <h4 className="font-semibold text-purple-800">SuperAdmin Tools</h4>
          <p className="text-sm text-purple-600">
            System-level content management options
          </p>
        </div>
      </SuperAdminOnly>
    </div>
  );
};

// ============================================================================
// EXAMPLE 3: Route Protection
// ============================================================================

/**
 * Example: Router Configuration with Role-Based Routes
 * Shows how to protect routes based on roles and permissions
 */
export const RouteConfigurationExample: React.FC = () => {
  return (
    <Routes>
      {/* Public route - no protection */}
      <Route path="/admin/login" element={<div>Login Page</div>} />

      {/* Protected by authentication only */}
      <Route path="/admin/dashboard" element={<div>Dashboard</div>} />

      {/* Protected by permission */}
      <Route
        path="/admin/users"
        element={
          <RoleBasedRoute permissions={[Permission.VIEW_USERS]}>
            <div>User Management</div>
          </RoleBasedRoute>
        }
      />

      {/* Protected by role - Admin and SuperAdmin only */}
      <Route
        path="/admin/content"
        element={
          <AdminRoute>
            <div>Content Management</div>
          </AdminRoute>
        }
      />

      {/* Protected by role - SuperAdmin only */}
      <Route
        path="/admin/system-settings"
        element={
          <SuperAdminRoute>
            <div>System Settings</div>
          </SuperAdminRoute>
        }
      />

      {/* Multiple permissions - user needs at least one */}
      <Route
        path="/admin/reports"
        element={
          <RoleBasedRoute
            permissions={[Permission.VIEW_REPORTS, Permission.EXPORT_DATA]}
            requireAll={false}
          >
            <div>Reports</div>
          </RoleBasedRoute>
        }
      />

      {/* Multiple permissions - user needs all */}
      <Route
        path="/admin/advanced-analytics"
        element={
          <RoleBasedRoute
            permissions={[Permission.VIEW_REPORTS, Permission.EXPORT_DATA]}
            requireAll={true}
          >
            <div>Advanced Analytics</div>
          </RoleBasedRoute>
        }
      />
    </Routes>
  );
};

// ============================================================================
// EXAMPLE 4: Form Field Access Control
// ============================================================================

/**
 * Example: Settings Form with Role-Based Field Access
 * Demonstrates disabling form fields based on permissions
 */
export const SettingsFormExample: React.FC = () => {
  const { hasPermission, canEditSettings, isReadOnly } = useRBAC();

  const canEdit = hasPermission(Permission.EDIT_SETTINGS);

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      {/* Show warning if read-only */}
      {isReadOnly && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            You have view-only access to these settings.
          </p>
        </div>
      )}

      <form className="space-y-4">
        {/* Basic settings - visible to all */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Application Name
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            disabled={!canEdit}
            defaultValue="Talipapa System"
          />
        </div>

        {/* Advanced settings - only editable by SuperAdmin */}
        <Can permission={Permission.EDIT_SETTINGS}>
          <div className="mt-6 border-t pt-6">
            <h3 className="font-semibold mb-4">Advanced Settings</h3>

            <div>
              <label className="block text-sm font-medium mb-1">
                Database Connection
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                disabled={!canEditSettings}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                API Configuration
              </label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={4}
                disabled={!canEditSettings}
              />
            </div>
          </div>
        </Can>

        {/* Show save button only if user can edit */}
        <NotStaff>
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={!canEdit}
            >
              Save Changes
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </NotStaff>
      </form>
    </div>
  );
};

// ============================================================================
// EXAMPLE 5: Button/Action Access Control
// ============================================================================

/**
 * Example: Data Table with Role-Based Actions
 * Shows how to conditionally render action buttons
 */
export const DataTableExample: React.FC = () => {
  const { hasPermission } = useRBAC();

  const canEdit = hasPermission(Permission.EDIT_CONTENT);
  const canDelete = hasPermission(Permission.DELETE_CONTENT);

  // Sample data
  const items = [
    { id: 1, name: 'Item 1', status: 'Active' },
    { id: 2, name: 'Item 2', status: 'Inactive' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Content List</h2>

        {/* Create button - only for users with create permission */}
        <Can permission={Permission.CREATE_CONTENT}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Create New
          </button>
        </Can>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.id}</td>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.status}</td>
              <td className="border p-2">
                <div className="flex gap-2">
                  {/* View button - always visible */}
                  <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm">
                    View
                  </button>

                  {/* Edit button - conditional */}
                  {canEdit && (
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                      Edit
                    </button>
                  )}

                  {/* Delete button - conditional */}
                  {canDelete && (
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================================================
// EXAMPLE 6: Menu Item Filtering
// ============================================================================

/**
 * Example: Navigation Menu with Role-Based Filtering
 * Shows how to filter menu items based on permissions
 */
export const NavigationMenuExample: React.FC = () => {
  const { hasPermission, isSuperAdmin, isStaff } = useRBAC();

  // Define menu structure with permission requirements
  const menuItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      visible: true, // Always visible
    },
    {
      label: 'Users',
      path: '/admin/users',
      visible: hasPermission(Permission.VIEW_USERS),
    },
    {
      label: 'Content',
      path: '/admin/content',
      visible: hasPermission(Permission.VIEW_CONTENT),
    },
    {
      label: 'Reports',
      path: '/admin/reports',
      visible: hasPermission(Permission.VIEW_REPORTS),
    },
    {
      label: 'Admin Management',
      path: '/admin/manage-admins',
      visible: isSuperAdmin, // SuperAdmin only
    },
    {
      label: 'System Settings',
      path: '/admin/settings',
      visible: !isStaff, // Not visible to staff
    },
  ];

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="space-y-2">
        {menuItems
          .filter((item) => item.visible)
          .map((item) => (
            <li key={item.path}>
              <a
                href={item.path}
                className="block px-4 py-2 hover:bg-gray-700 rounded"
              >
                {item.label}
              </a>
            </li>
          ))}
      </ul>
    </nav>
  );
};

// ============================================================================
// EXAMPLE 7: Data Access Control (API Level)
// ============================================================================

/**
 * Example: Data Fetching with Permission Check
 * Shows how to implement permission checks before API calls
 */
export const DataFetchingExample: React.FC = () => {
  const { hasPermission, hasAnyPermission } = useRBAC();

  const fetchUsers = async () => {
    // Check permission before making API call
    if (!hasPermission(Permission.VIEW_USERS)) {
      console.error('No permission to view users');
      return;
    }

    try {
      // Make API call
      const response = await fetch('/api/users');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const exportData = async () => {
    // Check if user has either view or export permission
    if (!hasAnyPermission([Permission.VIEW_REPORTS, Permission.EXPORT_DATA])) {
      alert('You do not have permission to export data');
      return;
    }

    try {
      // Make API call to export
      const response = await fetch('/api/export');
      const blob = await response.blob();
      // Handle download
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Data Operations</h2>

      <Can permission={Permission.VIEW_USERS}>
        <button
          onClick={fetchUsers}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Load Users
        </button>
      </Can>

      <Can permissions={[Permission.VIEW_REPORTS, Permission.EXPORT_DATA]}>
        <button
          onClick={exportData}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export Data
        </button>
      </Can>
    </div>
  );
};

// ============================================================================
// USAGE NOTES & BEST PRACTICES
// ============================================================================

/**
 * BEST PRACTICES:
 *
 * 1. ALWAYS check permissions on both frontend and backend
 *    - Frontend checks improve UX by hiding inaccessible features
 *    - Backend checks provide actual security
 *
 * 2. Use the <Can> component for UI elements within a component
 *    - Cleaner and more readable than inline conditionals
 *    - Example: <Can permission={Permission.EDIT_CONTENT}><EditButton /></Can>
 *
 * 3. Use RoleBasedRoute for protecting entire routes
 *    - Prevents unauthorized access at the routing level
 *    - Example: <RoleBasedRoute roles={[UserRole.ADMIN]}>...</RoleBasedRoute>
 *
 * 4. Use the useRBAC hook for complex permission logic
 *    - When you need to combine multiple checks
 *    - When permission checks affect component behavior, not just rendering
 *
 * 5. Prefer permission-based checks over role-based checks
 *    - More flexible and maintainable
 *    - Easier to add new roles without changing component code
 *    - Exception: When you specifically need role-based logic (like SuperAdmin-only features)
 *
 * 6. Show appropriate feedback to users without access
 *    - Use the ReadOnly component for staff users
 *    - Use fallback props in <Can> components
 *    - Provide clear messages about why access is denied
 *
 * 7. Keep permission definitions centralized
 *    - All permissions are defined in rbac.types.ts
 *    - Role-permission mappings are in ROLE_PERMISSIONS
 *    - Easy to audit and modify permissions
 *
 * 8. EXPANDING THE SYSTEM:
 *    - To add a new permission:
 *      a. Add to Permission enum in rbac.types.ts
 *      b. Add to appropriate roles in ROLE_PERMISSIONS
 *      c. Use in your components with hasPermission() or <Can>
 *
 *    - To add a new role:
 *      a. Add to UserRole enum in rbac.types.ts
 *      b. Add to ROLE_PERMISSIONS with its permissions
 *      c. Update getUserRole() in rbac.utils.ts to handle the new role structure
 *      d. Backend: Ensure API returns the new role in the user object
 */

export default {
  UserManagementExample,
  ContentEditorExample,
  RouteConfigurationExample,
  SettingsFormExample,
  DataTableExample,
  NavigationMenuExample,
  DataFetchingExample,
};
