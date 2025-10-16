import React, { useState } from 'react';
import {
  Building,
  Palette,
  Users,
  Cog,
  File,
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
import { useToast } from '@/contexts/ToastContext';
import { SettingsPageSkeleton } from '../../components/LoadingSkeletons';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'Super Admin' | 'Editor';
}

const Settings: React.FC = () => {
  // Add loading state with 1 second display
  const { isLoading } = useLoadingState(1000);

  const [barangayName, setBarangayName] = useState('Barangay San Isidro');
  const [colorScheme, setColorScheme] = useState<'Green' | 'White'>('Green');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [editingBarangay, setEditingBarangay] = useState(false);

  // Admin users state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@sanisidro.gov.ph',
      role: 'Super Admin',
    },
    {
      id: 2,
      name: 'Secretary',
      email: 'secretary@sanisidro.gov.ph',
      role: 'Editor',
    },
  ]);

  // New admin form state
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Editor' as 'Super Admin' | 'Editor',
  });

  const toast = useToast();

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast.warn('File size should be less than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.warn('Please select an image file');
        return;
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

  const handleBarangayNameSave = () => {
    // Here you would typically save to backend
    setEditingBarangay(false);
    console.log('Saving barangay name:', barangayName);
  };

  const handleDeleteAdmin = (id: number) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      setAdminUsers(adminUsers.filter((user) => user.id !== id));
    }
  };

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast.warn('Please fill in all fields');
      return;
    }

    const newId = Math.max(...adminUsers.map((u) => u.id)) + 1;
    setAdminUsers([...adminUsers, { ...newAdmin, id: newId }]);
    setNewAdmin({ name: '', email: '', password: '', role: 'Editor' });
    toast.success('Admin added successfully!');
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
                    <File className="w-5 h-5" />
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
              {adminUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900">
                        {user.name}
                      </h4>
                      <p className="text-base text-gray-800 font-medium">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                        user.role === 'Super Admin'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}
                    >
                      {user.role}
                    </span>
                    <button
                      onClick={() => handleDeleteAdmin(user.id)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newAdmin.name}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, name: e.target.value })
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
                  Password
                </label>
                <input
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
                  Role
                </label>
                <select
                  value={newAdmin.role}
                  onChange={(e) =>
                    setNewAdmin({
                      ...newAdmin,
                      role: e.target.value as 'Super Admin' | 'Editor',
                    })
                  }
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm bg-white"
                >
                  <option value="Editor">Editor</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleAddAdmin}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-lg rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                <Plus size={20} />
                Add Admin Account
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
