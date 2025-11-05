/**
 * PRACTICAL INTEGRATION EXAMPLE
 *
 * This file shows how to add RBAC to the Settings page.
 * Follow this pattern for other admin pages.
 *
 * BEFORE & AFTER comparison to see the changes needed.
 */

import React, { useState } from 'react';
import { useRBAC } from '../../hooks/useRBAC';
import { Permission } from '../../types/rbac.types';
import { Can, SuperAdminOnly, ReadOnly } from '../../components/rbac/Can';

// ============================================================================
// BEFORE - Without RBAC
// ============================================================================

export const SettingsPageBefore: React.FC = () => {
  const [siteName, setSiteName] = useState('Barangay Talipapa');
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    // Save settings
    console.log('Saving settings...');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      {/* Everyone can see and edit everything */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Site Name</label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// AFTER - With RBAC (Approach 1: Using the Hook)
// ============================================================================

export const SettingsPageAfterHook: React.FC = () => {
  const [siteName, setSiteName] = useState('Barangay Talipapa');
  const [apiKey, setApiKey] = useState('');

  // 1. Add RBAC hook
  const { hasPermission, canEditSettings, isReadOnly } = useRBAC();

  // 2. Calculate permissions
  const canEdit = hasPermission(Permission.EDIT_SETTINGS);
  const canViewAdvanced = canEditSettings; // SuperAdmin only

  const handleSave = () => {
    // 3. Check permission before saving
    if (!canEdit) {
      alert('You do not have permission to edit settings');
      return;
    }
    console.log('Saving settings...');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      {/* 4. Show read-only banner for staff */}
      {isReadOnly && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            You have read-only access to settings.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* 5. Basic settings - all can view, only admins can edit */}
        <div>
          <label className="block text-sm font-medium mb-1">Site Name</label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            disabled={!canEdit} // Disabled for staff
          />
        </div>

        {/* 6. Advanced settings - only SuperAdmin can see */}
        {canViewAdvanced && (
          <div className="mt-6 border-t pt-6">
            <h3 className="font-semibold mb-4">Advanced Settings</h3>
            <p className="text-sm text-gray-600 mb-4">
              These settings should only be modified by system administrators.
            </p>

            <div>
              <label className="block text-sm font-medium mb-1">API Key</label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full border rounded px-3 py-2"
                disabled={!canEditSettings}
              />
            </div>
          </div>
        )}

        {/* 7. Save button - only show to users who can edit */}
        {canEdit && (
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Settings
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// AFTER - With RBAC (Approach 2: Using Components - RECOMMENDED)
// ============================================================================

export const SettingsPageAfterComponents: React.FC = () => {
  const [siteName, setSiteName] = useState('Barangay Talipapa');
  const [apiKey, setApiKey] = useState('');

  // 1. Add RBAC hook (minimal usage)
  const { hasPermission } = useRBAC();
  const canEdit = hasPermission(Permission.EDIT_SETTINGS);

  const handleSave = () => {
    if (!canEdit) {
      alert('You do not have permission to edit settings');
      return;
    }
    console.log('Saving settings...');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      {/* 2. Use ReadOnly component - automatically shows for staff */}
      <ReadOnly message="You can view settings but cannot make changes." />

      <div className="space-y-4">
        {/* Basic settings - visible to all */}
        <div>
          <label className="block text-sm font-medium mb-1">Site Name</label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            disabled={!canEdit}
          />
        </div>

        {/* 3. Use SuperAdminOnly for advanced settings */}
        <SuperAdminOnly>
          <div className="mt-6 border-t pt-6">
            <h3 className="font-semibold mb-4">Advanced Settings</h3>
            <p className="text-sm text-gray-600 mb-4">
              These settings should only be modified by system administrators.
            </p>

            <div>
              <label className="block text-sm font-medium mb-1">API Key</label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </SuperAdminOnly>

        {/* 4. Use Can component for save button */}
        <Can
          permission={Permission.EDIT_SETTINGS}
          fallback={
            <p className="text-sm text-gray-500">
              Contact an administrator to modify settings.
            </p>
          }
        >
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Settings
          </button>
        </Can>
      </div>
    </div>
  );
};

// ============================================================================
// DATA TABLE EXAMPLE - News/Events Page
// ============================================================================

interface NewsItem {
  id: number;
  title: string;
  status: string;
  author: string;
}

export const NewsPageWithRBAC: React.FC = () => {
  const { hasPermission } = useRBAC();

  const newsItems: NewsItem[] = [
    { id: 1, title: 'Community Event', status: 'Published', author: 'Admin' },
    { id: 2, title: 'New Guidelines', status: 'Draft', author: 'Admin' },
  ];

  const handleEdit = (id: number) => {
    if (!hasPermission(Permission.EDIT_NEWS)) {
      alert('You do not have permission to edit news');
      return;
    }
    console.log('Editing news:', id);
  };

  const handleDelete = (id: number) => {
    if (!hasPermission(Permission.DELETE_NEWS)) {
      alert('You do not have permission to delete news');
      return;
    }
    console.log('Deleting news:', id);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">News & Events</h1>

        {/* Create button - only for users with create permission */}
        <Can permission={Permission.CREATE_NEWS}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Create News
          </button>
        </Can>
      </div>

      {/* Read-only warning for staff */}
      <ReadOnly message="You can view news items but cannot create, edit, or delete them." />

      {/* News table */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Author
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {newsItems.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">{item.title}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'Published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">{item.author}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {/* View button - always visible */}
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      View
                    </button>

                    {/* Edit button - conditional */}
                    <Can permission={Permission.EDIT_NEWS}>
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-yellow-600 hover:text-yellow-800 text-sm"
                      >
                        Edit
                      </button>
                    </Can>

                    {/* Delete button - conditional */}
                    <Can permission={Permission.DELETE_NEWS}>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </Can>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export section - only for users with export permission */}
      <Can
        permissions={[Permission.VIEW_REPORTS, Permission.EXPORT_DATA]}
        requireAll={false}
      >
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Export Options</h3>
          <div className="flex gap-2">
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Export to Excel
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Export to PDF
            </button>
          </div>
        </div>
      </Can>
    </div>
  );
};

// ============================================================================
// FORM WITH ROLE-BASED FIELDS - User Management
// ============================================================================

export const UserFormWithRBAC: React.FC = () => {
  const { hasPermission, isSuperAdmin } = useRBAC();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'Staff',
    isActive: true,
  });

  const canEditUsers = hasPermission(Permission.EDIT_USERS);
  const canManageRoles = isSuperAdmin; // Only SuperAdmin can assign roles

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canEditUsers) {
      alert('You do not have permission to edit users');
      return;
    }

    console.log('Saving user:', formData);
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>

      <ReadOnly message="You can view user details but cannot make changes." />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic fields - all can view */}
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
            disabled={!canEditUsers}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
            disabled={!canEditUsers}
          />
        </div>

        {/* Role selection - only SuperAdmin can change */}
        <SuperAdminOnly
          fallback={
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <input
                type="text"
                value={formData.role}
                className="w-full border rounded px-3 py-2 bg-gray-100"
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">
                Only Super Administrators can change user roles.
              </p>
            </div>
          }
        >
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="Staff">Staff</option>
              <option value="Admin">Admin</option>
              <option value="SuperAdmin">Super Admin</option>
            </select>
          </div>
        </SuperAdminOnly>

        {/* Active status - Admin and SuperAdmin can toggle */}
        <Can
          permissions={[Permission.EDIT_USERS]}
          fallback={
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <span className="text-sm">
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          }
        >
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="mr-2"
              />
              <span className="text-sm font-medium">Active</span>
            </label>
          </div>
        </Can>

        {/* Action buttons */}
        <div className="flex gap-2 pt-4">
          <Can permission={Permission.EDIT_USERS}>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </Can>

          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// SUMMARY OF CHANGES
// ============================================================================

/**
 * INTEGRATION CHECKLIST:
 *
 * 1. ✅ Import RBAC utilities
 *    - import { useRBAC } from '../../hooks/useRBAC';
 *    - import { Permission } from '../../types/rbac.types';
 *    - import { Can, ReadOnly } from '../../components/rbac/Can';
 *
 * 2. ✅ Add useRBAC hook
 *    - const { hasPermission, isSuperAdmin, isReadOnly } = useRBAC();
 *
 * 3. ✅ Add ReadOnly banner
 *    - <ReadOnly message="..." />
 *
 * 4. ✅ Wrap conditional UI with <Can>
 *    - <Can permission={Permission.EDIT_CONTENT}>...</Can>
 *
 * 5. ✅ Disable form fields for staff
 *    - disabled={!hasPermission(Permission.EDIT_CONTENT)}
 *
 * 6. ✅ Check permissions before API calls
 *    - if (!hasPermission(...)) return;
 *
 * 7. ✅ Add fallback messages
 *    - <Can fallback={<Message />}>...</Can>
 *
 * 8. ✅ Test with all roles
 *    - SuperAdmin, Admin, Staff
 */

export default {
  SettingsPageBefore,
  SettingsPageAfterHook,
  SettingsPageAfterComponents,
  NewsPageWithRBAC,
  UserFormWithRBAC,
};
