import React, { FormEvent, useEffect, useState } from 'react';
import {
  Building,
  Palette,
  Users,
  Cog,
  File as FIleLogo,
  Pencil,
  Plus,
  Trash,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useToast } from '@/hooks/useToast';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../components/ui/card';
import { useLoadingState } from '../../hooks/useLoadingState';
import { SettingsPageSkeleton } from '../../components/LoadingSkeletons';
import useFetchData from '../hooks/useFetchData';
import { useAuthFetch } from '../hooks/useAuthFetch';

export interface Admin {
  _id: string;
  username: string;
  email: string;
  contactNumber: string;
  rolesKeys: string[];
}

const Settings: React.FC = () => {
  // Add loading state with 1 second display
  const { isLoading } = useLoadingState(1000);

  const {
    data: pageContent,
    loading: loadingPageContent,
    error: errorPagecontent,
    refetch: refetchPageContent,
  } = useFetchData(`/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}`);

  const [barangayName, setBarangayName] = useState('');

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [editingBarangay, setEditingBarangay] = useState(false);
  const authFetch = useAuthFetch();

  // Toast hook (call once at component top to avoid invalid hook calls)
  const toast = useToast();

  const [admins, setAdmins] = useState<Admin[]>();
  const {
    data: adminsData,
    loading: loadingAdmins,
    error: errorAdmins,
    refetch: refetchAdmins,
  } = useFetchData('/users');

  useEffect(() => {
    if ((adminsData && !loadingAdmins) || !errorAdmins) {
      setAdmins(adminsData);
    }
  }, [adminsData, loadingAdmins, errorAdmins]);

  useEffect(() => {
    if (pageContent && !loadingPageContent && !errorPagecontent) {
      setLogoPreview(pageContent?.image?.url);
      setBarangayName(pageContent?.barangayName);
    }
  }, [adminsData, loadingPageContent, errorPagecontent]);

  // New admin form state
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    contactNumber: '',
    password: '',
    roles: [],
  });

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast.error('File size should be less than 2MB', {
          title: 'File Error',
        });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file', { title: 'File Error' });
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await authFetch(
          `/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}/withImage`,
          {
            method: 'PATCH',
            body: formData,
          }
        );

        toast.success('Barangay Image updated successfully', {
          title: 'Updated',
        });
      } catch (error) {
        console.log(error);
      }
      setLogoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBarangayNameSave = async () => {
    // Here you would typically save to backend
    try {
      const res = await authFetch(
        `/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            barangayName: barangayName,
          }),
        }
      );
      toast.success('Barangay Name updated successfully', { title: 'Updated' });
      setEditingBarangay(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Open delete confirmation modal for admin
  const handleDeleteAdmin = (id: string) => {
    setDeletingAdminId(id);
    setIsDeleteAdminOpen(true);
  };

  // delete modal state and confirm handler
  const [isDeleteAdminOpen, setIsDeleteAdminOpen] = useState(false);
  const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);
  const [isDeletingAdmin, setIsDeletingAdmin] = useState(false);

  const closeDeleteAdminModal = () => {
    setIsDeleteAdminOpen(false);
    setDeletingAdminId(null);
    setIsDeletingAdmin(false);
  };

  const confirmDeleteAdmin = async () => {
    if (!deletingAdminId) return;
    setIsDeletingAdmin(true);
    try {
      await authFetch(`/users/${deletingAdminId}`, { method: 'DELETE' });
      toast.success('User deleted.', { title: 'Deleted' });
      refetchAdmins();
      closeDeleteAdminModal();
    } catch (err) {
      console.error('Delete admin failed', err);
      toast.error(err?.message || String(err), { title: 'Delete failed' });
      setIsDeletingAdmin(false);
    }
  };

  const handleAddAdmin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !newAdmin.username ||
      !newAdmin.email ||
      !newAdmin.password ||
      !newAdmin.contactNumber
    ) {
      toast.error('Please fill in all fields', { title: 'Validation' });
      return;
    }

    if (newAdmin.contactNumber.length !== 11) {
      toast.error('Invalid Contact Number', { title: 'Validation' });
      return;
    }

    const roles = newAdmin.roles;
    if (roles.length === 0) {
      toast.error('At least 1 role is required', { title: 'Validation' });
      return;
    }

    const payload = { ...newAdmin, roles: {} };
    const newRoles: { SuperAdmin?: number; Admin?: number } = {};

    if (roles.includes('SuperAdmin')) {
      newRoles.SuperAdmin = Number(import.meta.env.VITE_SUPERADMIN);
    }

    if (roles.includes('Admin')) {
      newRoles.Admin = Number(import.meta.env.VITE_ADMIN);
    }

    payload.roles = newRoles;

    try {
      const res = await authFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      toast.success(`Added New User`, { title: 'User Added' });
      refetchAdmins();
      setNewAdmin({
        username: '',
        email: '',
        contactNumber: '',
        password: '',
        roles: [],
      });
    } catch (error) {
      toast.error(String(error), { title: 'Error' });
    }
  };

  // Show loading skeleton while loading
  if (isLoading) {
    return <SettingsPageSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-row items-center gap-2 md:gap-4">
          <Cog className="w-6 h-6 md:w-10 md:h-10 text-green-600 flex-shrink-0" />
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            Settings
          </h1>
        </div>
        <p className="text-sm md:text-lg text-gray-700 mt-2 md:mt-3 font-medium">
          Manage system configuration and preferences
        </p>
      </div>
      {/* Admin delete confirmation modal */}
      {isDeleteAdminOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[1005] flex items-center justify-center bg-black/60 p-4"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeDeleteAdminModal();
            }}
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-gray-900">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Deleting this admin account cannot be undone. Are you sure?
                </p>
              </div>
              <div className="p-4 flex items-center justify-end gap-3 bg-gray-50">
                <button
                  onClick={closeDeleteAdminModal}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAdmin}
                  className={`px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow-sm hover:bg-red-700 ${isDeletingAdmin ? 'opacity-70 pointer-events-none' : ''}`}
                >
                  {isDeletingAdmin ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {/* Barangay Information */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="pb-4 md:pb-6">
            <CardTitle className="text-lg md:text-2xl font-semibold text-gray-900 flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 rounded-lg bg-green-50">
                <Building className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
              </div>
              Barangay Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <label className="block text-sm md:text-base font-semibold text-gray-700">
                Barangay Name
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
                {editingBarangay ? (
                  <>
                    <input
                      type="text"
                      value={barangayName}
                      onChange={(e) => setBarangayName(e.target.value)}
                      className="flex-1 px-3 py-2 md:px-4 md:py-3 text-base md:text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                    <div className="flex gap-2 sm:flex-shrink-0">
                      <button
                        onClick={handleBarangayNameSave}
                        className="flex-1 sm:flex-initial px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium text-sm md:text-base rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm"
                      >
                        ✓ Save
                      </button>
                      <button
                        onClick={() => setEditingBarangay(false)}
                        className="flex-1 sm:flex-initial px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium text-sm md:text-base rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all shadow-sm"
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 px-3 py-2 md:px-4 md:py-3 text-base md:text-lg bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-900">
                      {barangayName}
                    </div>
                    <button
                      onClick={() => setEditingBarangay(true)}
                      className="sm:flex-shrink-0 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium text-sm md:text-base rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <Pencil size={12} className="md:w-3.5 md:h-3.5" />
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <label className="block text-sm md:text-base font-semibold text-gray-700">
                Barangay Logo
              </label>
              <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-8">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 hover:border-green-400 transition-colors mx-auto sm:mx-0">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-gray-500 text-4xl md:text-6xl block mb-1 md:mb-2">
                        🏛️
                      </span>
                      <span className="text-gray-700 text-xs md:text-sm font-bold">
                        No Logo
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3 md:gap-4 flex-1 w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-flex items-center justify-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium text-sm md:text-base rounded-lg cursor-pointer hover:from-green-700 hover:to-green-800 transition-all shadow-sm w-full sm:w-fit"
                  >
                    <FIleLogo className="w-4 h-4 md:w-5 md:h-5" />
                    Upload New Logo
                  </label>
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm text-gray-800 font-bold">
                      📋 Requirements:
                    </p>
                    <ul className="text-xs md:text-sm text-gray-700 space-y-1 ml-4 font-medium">
                      <li>• Recommended size: 200x200px</li>
                      <li>• Maximum file size: 2MB</li>
                      <li>• Formats: JPG, PNG, GIF</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Accounts */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="pb-4 md:pb-6">
            <CardTitle className="text-lg md:text-2xl font-semibold text-gray-900 flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 rounded-lg bg-green-50">
                <Users className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
              </div>
              Admin Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {admins &&
                admins.length > 0 &&
                admins.map((admin) => (
                  <div
                    key={admin._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all gap-4"
                  >
                    <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white font-bold text-sm md:text-xl">
                          {admin.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm md:text-lg text-gray-900 truncate">
                          {admin.username}
                        </h4>
                        <p className="text-xs md:text-base text-gray-800 font-medium truncate">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 md:gap-4 flex-shrink-0">
                      <div className="flex flex-wrap gap-1 md:gap-2">
                        {admin.rolesKeys.map((role) => (
                          <span
                            key={role}
                            className={`px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-sm ${
                              role === 'SuperAdmin'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'text-green-800 border border-green-200'
                            }`}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleDeleteAdmin(admin._id)}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all shadow-sm border border-red-200 hover:border-red-600 flex-shrink-0"
                        title="Delete admin"
                      >
                        <Trash size={14} className="md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Add New Admin */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="pb-4 md:pb-6">
            <CardTitle className="text-lg md:text-2xl font-semibold text-gray-900 flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 rounded-lg bg-green-50">
                <Plus className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
              </div>
              Add New Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2 md:mb-3">
                    Username
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Enter full name"
                    value={newAdmin.username}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, username: e.target.value })
                    }
                    className="w-full px-3 py-2 md:px-4 md:py-3 text-base md:text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2 md:mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@example.com"
                    value={newAdmin.email}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, email: e.target.value })
                    }
                    className="w-full px-3 py-2 md:px-4 md:py-3 text-base md:text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2 md:mb-3">
                    Contact Number
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Contact Number"
                    value={newAdmin.contactNumber}
                    onChange={(e) =>
                      setNewAdmin({
                        ...newAdmin,
                        contactNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 md:px-4 md:py-3 text-base md:text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2 md:mb-3">
                    Password
                  </label>
                  <input
                    required
                    type="password"
                    placeholder="Create secure password"
                    value={newAdmin.password}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, password: e.target.value })
                    }
                    className="w-full px-3 py-2 md:px-4 md:py-3 text-base md:text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2 md:mb-3">
                    Roles
                  </label>
                  <div className="space-y-2">
                    {['SuperAdmin', 'Admin'].map((roleOption) => (
                      <label
                        key={roleOption}
                        className="flex items-center space-x-2 md:space-x-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={newAdmin.roles.includes(roleOption)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              // Add role if checked
                              setNewAdmin({
                                ...newAdmin,
                                roles: [...newAdmin.roles, roleOption],
                              });
                            } else {
                              // Remove role if unchecked
                              setNewAdmin({
                                ...newAdmin,
                                roles: newAdmin.roles.filter(
                                  (r) => r !== roleOption
                                ),
                              });
                            }
                          }}
                          className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                        />
                        <span className="text-sm md:text-lg text-gray-700 font-medium">
                          {roleOption}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Optional: Show selected roles summary */}
                  {newAdmin.roles.length > 0 && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs md:text-sm font-medium text-green-800">
                        Selected roles: {newAdmin.roles.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
                <button className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-base md:text-lg rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 md:gap-3">
                  <Plus size={16} className="md:w-5 md:h-5" />
                  Add Admin Account
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
