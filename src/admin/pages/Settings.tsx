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
        alert('File size should be less than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
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

        alert('Barangay Image updated successfully');
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
      alert('Barangay Name updated successfully');
      setEditingBarangay(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    try {
      await authFetch(`/users/${id}`, {
        method: 'DELETE',
      });

      alert('User Deleted');
      refetchAdmins();
    } catch (error) {
      alert(error);
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
      alert('Please fill in all fields');
      return;
    }

    if (newAdmin.contactNumber.length !== 11) {
      alert('Invalid Contact Number');
      return;
    }

    const roles = newAdmin.roles;
    if (roles.length === 0) {
      alert('At least 1 role is required');
      return;
    }

    const payload = { ...newAdmin, roles: {} };
    const newRoles: { Editor?: number; Admin?: number } = {};

    if (roles.includes('Editor')) {
      newRoles.Editor = Number(import.meta.env.VITE_EDITOR);
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

      alert(`Added New User`);
      refetchAdmins();
      setNewAdmin({
        username: '',
        email: '',
        contactNumber: '',
        password: '',
        roles: [],
      });
    } catch (error) {
      alert(error);
    }
  };

  // Show loading skeleton while loading
  if (isLoading) {
    return <SettingsPageSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-row items-center gap-4">
          <Cog className="w-10 h-10 text-green-600 flex-shrink-0" />
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
        </div>
        <p className="text-lg text-gray-700 mt-3 font-medium">
          Manage system configuration and preferences
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-8">
        {/* Barangay Information */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <Building className="w-6 h-6 text-green-600" />
              </div>
              Barangay Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <label className="block text-base font-semibold text-gray-700">
                Barangay Name
              </label>
              <div className="flex items-center gap-4">
                {editingBarangay ? (
                  <>
                    <input
                      type="text"
                      value={barangayName}
                      onChange={(e) => setBarangayName(e.target.value)}
                      className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                    <button
                      onClick={handleBarangayNameSave}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm flex-shrink-0"
                    >
                      ✓ Save
                    </button>
                    <button
                      onClick={() => setEditingBarangay(false)}
                      className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all shadow-sm flex-shrink-0"
                    >
                      ✕ Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 px-4 py-3 text-lg bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-900">
                      {barangayName}
                    </div>
                    <button
                      onClick={() => setEditingBarangay(true)}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm flex items-center gap-2 flex-shrink-0"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-base font-semibold text-gray-700">
                Barangay Logo
              </label>
              <div className="flex items-start gap-8">
                <div className="w-40 h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 hover:border-green-400 transition-colors">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-gray-500 text-6xl block mb-2">
                        🏛️
                      </span>
                      <span className="text-gray-700 text-sm font-bold">
                        No Logo
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-4 flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg cursor-pointer hover:from-green-700 hover:to-green-800 transition-all shadow-sm w-fit"
                  >
                    <FIleLogo className="w-5 h-5" />
                    Upload New Logo
                  </label>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-800 font-bold">
                      📋 Requirements:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4 font-medium">
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
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              Admin Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {admins.length > 0 &&
                admins.map((admin) => (
                  <div
                    key={admin._id}
                    className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white font-bold text-xl">
                          {admin.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900">
                          {admin.username}
                        </h4>
                        <p className="text-base text-gray-800 font-medium">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {admin.rolesKeys.map((role) => (
                        <span
                          key={role}
                          className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                            role === 'Admin'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : ' text-green-800 border border-green-200'
                          }`}
                        >
                          {role}
                        </span>
                      ))}
                      <button
                        onClick={() => handleDeleteAdmin(admin._id)}
                        className="w-10 h-10 flex items-center justify-center text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all shadow-sm border border-red-200 hover:border-red-600"
                        title="Delete admin"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Add New Admin */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              Add New Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
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
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
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
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
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
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
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
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    Roles
                  </label>
                  <div className="space-y-2">
                    {['Editor', 'Admin'].map((roleOption) => (
                      <label
                        key={roleOption}
                        className="flex items-center space-x-3 cursor-pointer"
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
                        <span className="text-lg text-gray-700 font-medium">
                          {roleOption}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Optional: Show selected roles summary */}
                  {newAdmin.roles.length > 0 && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm font-medium text-green-800">
                        Selected roles: {newAdmin.roles.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-lg rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-3">
                  <Plus size={20} />
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
