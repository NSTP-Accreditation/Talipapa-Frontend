import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Save,
  Shield,
  User,
  Users,
} from 'lucide-react';
import React, { FormEvent, useEffect, useState } from 'react';
import { Admin } from '../Settings.types';

type EditAdminModalProps = {
  isOpen: boolean;
  onClose: () => void;
  refetchAdmin: () => void;
  adminToEdit: Admin | null;
};

const EditAdminModal = ({
  isOpen,
  onClose,
  refetchAdmin,
  adminToEdit,
}: EditAdminModalProps) => {
  const { success, error } = useToast();
  const authFetch = useAuthFetch();

  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [edited, setEdited] = useState({
    username: '',
    email: '',
    contactNumber: '',
    password: '',
    roles: [] as string[],
  });

  useEffect(() => {
    if (adminToEdit) {
      // derive roles as human labels
      const anyAdmin: any = adminToEdit as any;
      let roles: string[] = [];

      if (Array.isArray(adminToEdit.rolesKeys) && adminToEdit.rolesKeys.length)
        roles = adminToEdit.rolesKeys as string[];
      else if (Array.isArray(anyAdmin.roles) && anyAdmin.roles.length)
        roles = anyAdmin.roles as string[];
      else if (anyAdmin.roles && typeof anyAdmin.roles === 'object') {
        roles = Object.keys(anyAdmin.roles).map((k) => {
          const keyLower = String(k).toLowerCase();
          if (keyLower === 'superadmin') return 'SuperAdmin';
          if (keyLower === 'admin') return 'Admin';
          if (keyLower === 'staff') return 'Staff';
          const v = anyAdmin.roles[k];
          const vStr = String(v).toLowerCase();
          if (vStr === 'superadmin') return 'SuperAdmin';
          if (vStr === 'admin') return 'Admin';
          if (vStr === 'staff') return 'Staff';
          return k;
        });
      }

      setEdited({
        username: adminToEdit.username || '',
        email: adminToEdit.email || '',
        contactNumber: adminToEdit.contactNumber || '',
        password: '',
        roles,
      });
    } else {
      setEdited({
        username: '',
        email: '',
        contactNumber: '',
        password: '',
        roles: [],
      });
    }
  }, [adminToEdit]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!adminToEdit) return;

    // Basic validation
    if (!edited.username.trim()) return error('Username is required');
    if (!edited.email.trim()) return error('Email is required');

    // Client-side role limits validation (similar to AddAdminModal)
    try {
      const allAdmins: any = await authFetch('/users');
      const adminsList = Array.isArray(allAdmins) ? allAdmins : [];

      const countRole = (roleLabel: string) => {
        return adminsList.filter((a: any) => {
          if (!a) return false;
          // derive roles like other places
          const anyA: any = a;
          if (Array.isArray(a.rolesKeys) && a.rolesKeys.length)
            return a.rolesKeys.includes(roleLabel);
          if (Array.isArray(anyA.roles) && anyA.roles.length)
            return anyA.roles.includes(roleLabel);
          if (anyA.roles && typeof anyA.roles === 'object') {
            const keys = Object.keys(anyA.roles);
            return keys.some((k) => {
              const kl = String(k).toLowerCase();
              if (kl === roleLabel.toLowerCase()) return true;
              const v = anyA.roles[k];
              if (String(v).toLowerCase() === roleLabel.toLowerCase())
                return true;
              return false;
            });
          }
          return false;
        }).length;
      };

      // Exclude the edited admin from counts
      const filteredAdmins = adminsList.filter(
        (a: any) => a._id !== adminToEdit._id
      );

      const superCount = filteredAdmins.filter((a: any) => {
        const anyA: any = a;
        if (Array.isArray(a.rolesKeys) && a.rolesKeys.length)
          return a.rolesKeys.includes('SuperAdmin');
        if (Array.isArray(anyA.roles) && anyA.roles.length)
          return anyA.roles.includes('SuperAdmin');
        if (anyA.roles && typeof anyA.roles === 'object') {
          const keys = Object.keys(anyA.roles);
          return keys.some(
            (k) =>
              String(k).toLowerCase() === 'superadmin' ||
              String(anyA.roles[k]).toLowerCase() === 'superadmin'
          );
        }
        return false;
      }).length;

      const adminCount = filteredAdmins.filter((a: any) => {
        const anyA: any = a;
        if (Array.isArray(a.rolesKeys) && a.rolesKeys.length)
          return a.rolesKeys.includes('Admin');
        if (Array.isArray(anyA.roles) && anyA.roles.length)
          return anyA.roles.includes('Admin');
        if (anyA.roles && typeof anyA.roles === 'object') {
          const keys = Object.keys(anyA.roles);
          return keys.some(
            (k) =>
              String(k).toLowerCase() === 'admin' ||
              String(anyA.roles[k]).toLowerCase() === 'admin'
          );
        }
        return false;
      }).length;

      // If trying to add SuperAdmin role and limits would be exceeded
      if (edited.roles.includes('SuperAdmin') && superCount >= 2) {
        return error(
          'Maximum of 2 SuperAdmin accounts allowed. Please remove an existing SuperAdmin first.'
        );
      }

      if (edited.roles.includes('Admin') && adminCount >= 2) {
        return error(
          'Maximum of 2 Admin accounts allowed. Please remove an existing Admin first.'
        );
      }
    } catch (fetchErr) {
      // If fetching users fails, don't block the update; log and continue
      console.warn(
        'Could not validate role limits due to fetch error',
        fetchErr
      );
    }

    const payload: any = {
      username: edited.username.trim(),
      email: edited.email.trim(),
      contactNumber: edited.contactNumber ? edited.contactNumber.trim() : '',
    };

    // include password only if provided
    if (edited.password && edited.password.length >= 6) {
      payload.password = edited.password;
    }

    // convert roles to roles object like AddAdminModal
    const rolesObj: any = {};
    if (edited.roles.includes('SuperAdmin'))
      rolesObj.SuperAdmin = Number(import.meta.env.VITE_SUPERADMIN);
    if (edited.roles.includes('Admin'))
      rolesObj.Admin = Number(import.meta.env.VITE_ADMIN);
    if (edited.roles.includes('Staff'))
      rolesObj.Staff = Number(import.meta.env.VITE_STAFF || 3);
    payload.roles = rolesObj;

    try {
      setIsSaving(true);

      // Try multiple endpoints/methods that backends commonly use for user updates
      let lastError: any = null;
      const attempts = [
        // Common auth-based update endpoints
        { url: `/auth/update/${adminToEdit._id}`, method: 'PUT' },
        { url: `/auth/update/${adminToEdit._id}`, method: 'PATCH' },
        { url: `/auth/users/${adminToEdit._id}`, method: 'PUT' },
        { url: `/auth/users/${adminToEdit._id}`, method: 'PATCH' },
        // Standard REST endpoints
        { url: `/users/${adminToEdit._id}`, method: 'PUT' },
        { url: `/users/${adminToEdit._id}`, method: 'PATCH' },
      ];

      for (const attempt of attempts) {
        try {
          console.log(`[EditAdmin] Trying ${attempt.method} ${attempt.url}`);
          await authFetch(attempt.url, {
            method: attempt.method,
            body: JSON.stringify(payload),
          });
          // If successful, break out of loop
          console.log(
            `[EditAdmin] Success with ${attempt.method} ${attempt.url}`
          );
          lastError = null;
          break;
        } catch (err: any) {
          console.log(
            `[EditAdmin] Failed ${attempt.method} ${attempt.url}:`,
            err.message
          );
          lastError = err;
          // Only continue trying if it's a 404 (endpoint doesn't exist)
          if (!err.message?.includes('404')) {
            // Not a 404 - this is a real error (validation, permissions, etc)
            console.error('[EditAdmin] Non-404 error, stopping attempts:', err);
            throw err;
          }
          // Otherwise, continue to next attempt
        }
      }

      // If all attempts failed with 404, throw the last error
      if (lastError) {
        throw lastError;
      }

      // Build a summary message for toast
      const rolesText = edited.roles.length
        ? edited.roles.join(', ')
        : 'No roles';
      const summary = `Updated ${edited.username} (${edited.email}) — Roles: ${rolesText}`;

      success(summary, { title: 'Admin account updated' });
      refetchAdmin();
      onClose();
    } catch (err: any) {
      console.error('Update admin failed', err);
      error(err?.message || 'Failed to update admin', { title: 'Error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Admin Account"
      subtitle="Modify admin details and roles"
      icon={<Users className="w-6 h-6 text-white" />}
    >
      <form onSubmit={handleSave} className="flex flex-col flex-1">
        <div className="space-y-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              Account Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 text-green-600" />
                  Username
                </label>
                <input
                  type="text"
                  value={edited.username}
                  onChange={(e) =>
                    setEdited((s) => ({ ...s, username: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 border-2 rounded-lg"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 text-green-600" />
                  Email
                </label>
                <input
                  type="email"
                  value={edited.email}
                  onChange={(e) =>
                    setEdited((s) => ({ ...s, email: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 border-2 rounded-lg"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={edited.contactNumber}
                  onChange={(e) =>
                    setEdited((s) => ({
                      ...s,
                      contactNumber: e.target.value.replace(/\D/g, ''),
                    }))
                  }
                  className="w-full px-4 py-2.5 border-2 rounded-lg"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  New Password (optional)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={edited.password}
                    onChange={(e) =>
                      setEdited((s) => ({ ...s, password: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border-2 rounded-lg pr-10"
                  />
                  {edited.password && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-green-600 rounded"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Roles */}
          <div className="pt-4 sm:pt-6 border-t-2 border-gray-200 bg-gradient-to-r from-green-50 to-white">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
              Assign Roles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  name: 'SuperAdmin',
                  description: 'Full system access',
                  color: 'green',
                },
                {
                  name: 'Admin',
                  description: 'Administrative access',
                  color: 'blue',
                },
                {
                  name: 'Staff',
                  description: 'View-only access',
                  color: 'gray',
                },
              ].map((roleOption) => (
                <label
                  key={roleOption.name}
                  className={`flex items-start gap-3 p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    edited.roles.includes(roleOption.name)
                      ? roleOption.color === 'green'
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : roleOption.color === 'blue'
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-500 bg-gray-50 shadow-md'
                      : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={edited.roles.includes(roleOption.name)}
                    onChange={(e) => {
                      if (e.target.checked)
                        setEdited((s) => ({
                          ...s,
                          roles: [...s.roles, roleOption.name],
                        }));
                      else
                        setEdited((s) => ({
                          ...s,
                          roles: s.roles.filter((r) => r !== roleOption.name),
                        }));
                    }}
                    className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer flex-shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-sm sm:text-base font-bold block ${edited.roles.includes(roleOption.name) ? (roleOption.color === 'green' ? 'text-green-700' : roleOption.color === 'blue' ? 'text-blue-700' : 'text-gray-700') : 'text-gray-700'}`}
                    >
                      {roleOption.name}
                    </span>
                    <span className="text-xs text-gray-600 block mt-0.5">
                      {roleOption.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-bold"
          >
            {isSaving ? (
              'Saving...'
            ) : (
              <>
                <Save className="w-4 h-4 inline-block mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditAdminModal;
