import React, { useState, useEffect } from 'react';
import {
  Building,
  Palette,
  Users,
  Cog,
  AlertCircle,
  Tag,
  Trash2,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../components/ui/card';
import { useLoadingState } from '../../hooks/useLoadingState';
import { SettingsPageSkeleton } from '../../components/LoadingSkeletons';

// Delete Modal 
interface DeleteModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  user,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center ml-200 p-4 z-[1003]  w-[400px]">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">Delete Admin</h3>
              <p className="text-sm text-gray-700 mt-1">
                Are you sure you want to delete <span className="font-semibold">"{user.name}"</span>?
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Email:</span>{' '}
                {user.email}
              </p>
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Role:</span>{' '}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 border border-green-300 rounded-md text-green-700 font-medium">
                  <Tag className="w-3 h-3" />
                  {user.role}
                </span>
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-50 border-2 border-red-200 rounded-xl p-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-700">
                    This action will permanently remove the admin account.
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    You can cancel to keep the account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 bg-white text-gray-700 rounded-lg sm:rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex items-center justify-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg sm:rounded-xl text-sm font-bold hover:from-red-700 hover:to-red-800 transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              <Trash2 className="w-4 h-4" />
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast System 
interface Toast {
  id: number;
  title: string;
  description?: string;
}

const ToastMessage: React.FC<{ toast: Toast; onClose: (id: number) => void }> = ({
  toast,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <div className="flex items-center justify-center mr-120 bg-white border border-green-600 rounded-xl shadow-sm p-4 w-[340px] animate-in fade-in slide-in-from-top-2">
      <div className="flex items-start gap-3">
        <div className="mt-1 p-2 bg-green-100 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-green-700">{toast.title}</p>
          {toast.description && (
            <p className="text-sm text-gray-700 mt-1">{toast.description}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-gray-400 hover:text-gray-600 transition"
      >
        ✕
      </button>
    </div>
  );
};

const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: number) => void }> = ({
  toasts,
  removeToast,
}) => (
  // Valid Tailwind position classes used (keeps same idea, bottom-right)
  <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
    {toasts.map((toast) => (
      <ToastMessage key={toast.id} toast={toast} onClose={removeToast} />
    ))}
  </div>
);

// ---------- Settings Component ----------
type ColorSchemeType = 'Green' | 'White';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'Super Admin' | 'Editor';
}

const Settings: React.FC = () => {
  const { isLoading } = useLoadingState(1000);

  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (data: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.floor(Math.random() * 1000); // safer unique id
    setToasts((prev) => [...prev, { id, ...data }]);
  };
  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const [barangayName, setBarangayName] = useState('Barangay San Isidro');
  const [colorScheme, setColorScheme] = useState<ColorSchemeType>('Green');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [editingBarangay, setEditingBarangay] = useState(false);

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

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Editor' as 'Super Admin' | 'Editor',
  });

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAdmin, setDeletingAdmin] = useState<AdminUser | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast({
          title: 'Upload failed',
          description: 'File size should be less than 2MB.',
        });
        return;
      }
      if (!file.type.startsWith('image/')) {
        showToast({
          title: 'Invalid file type',
          description: 'Please select an image file.',
        });
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      showToast({
        title: 'Logo uploaded',
        description: 'Your barangay logo has been updated successfully.',
      });
    }
  };

  const handleBarangayNameSave = () => {
    setEditingBarangay(false);
    showToast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  // Open delete modal (when clicking delete button)
  const handleOpenDeleteModal = (user: AdminUser) => {
    setDeletingAdmin(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingAdmin(null);
  };

  // Confirm deletion (from modal)
  const handleConfirmDelete = () => {
    if (!deletingAdmin) return;
    setAdminUsers((prev) => prev.filter((u) => u.id !== deletingAdmin.id));
    showToast({
      title: 'Admin removed',
      description: `${deletingAdmin.name} has been deleted successfully.`,
    });
    handleCloseDeleteModal();
  };

  // Direct delete (legacy helper not used directly anymore)
  const handleDeleteAdminDirect = (id: number) => {
    const user = adminUsers.find((u) => u.id === id);
    if (!user) return;
    setAdminUsers(adminUsers.filter((u) => u.id !== id));
    showToast({
      title: 'Admin removed',
      description: `${user.name} has been deleted successfully.`,
    });
  };

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      showToast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    const newId =
      adminUsers.length > 0 ? Math.max(...adminUsers.map((u) => u.id)) + 1 : 1;

    // add admin (exclude password from AdminUser)
    const adminToAdd: AdminUser = {
      id: newId,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
    };

    setAdminUsers([...adminUsers, adminToAdd]);
    setNewAdmin({ name: '', email: '', password: '', role: 'Editor' });
    showToast({
      title: 'Profile updated',
      description: 'New admin account has been successfully added.',
    });
  };

  if (isLoading) return <SettingsPageSkeleton />;

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
              <div className="p-2 rounded-lg bg-blue-50">
                <Building className="w-6 h-6 text-blue-600" />
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
                      <span>✏️</span>
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
                      <span className="text-gray-500 text-6xl block mb-2">🏛️</span>
                      <span className="text-gray-700 text-sm font-bold">No Logo</span>
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
                    <span className="text-lg">📁</span>
                    Upload New Logo
                  </label>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-800 font-bold">📋 Requirements:</p>
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

        {/* Theme Settings */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              Theme Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <label className="block text-base font-semibold text-gray-700">
                Color Scheme
              </label>
              <div className="flex flex-wrap gap-6">
                <button
                  onClick={() => setColorScheme('Green')}
                  className={`flex items-center justify-center gap-4 px-8 py-4 rounded-xl border-2 font-semibold transition-all min-w-[140px] shadow-sm ${
                    colorScheme === 'Green'
                      ? 'bg-green-600 text-white border-green-600 shadow-green-200'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-400 hover:shadow-md'
                  }`}
                >
                  <div className="w-5 h-5 bg-green-600 rounded-full flex-shrink-0 shadow-inner"></div>
                  <span>Green</span>
                </button>
                <button
                  onClick={() => setColorScheme('White')}
                  className={`flex items-center justify-center gap-4 px-8 py-4 rounded-xl border-2 font-semibold transition-all min-w-[140px] shadow-sm ${
                    colorScheme === 'White'
                      ? 'bg-gray-700 text-white border-gray-700 shadow-gray-200'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-500 hover:shadow-md'
                  }`}
                >
                  <div className="w-5 h-5 bg-white border-2 border-gray-400 rounded-full flex-shrink-0 shadow-inner"></div>
                  <span>White</span>
                </button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium">
                  ✨ Currently using <span className="font-bold">{colorScheme}</span> theme with
                  enhanced styling
                </p>
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
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900">{user.name}</h4>
                      <p className="text-base text-gray-800 font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                        user.role === 'Super Admin'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}
                    >
                      {user.role}
                    </span>
                    <button
                      onClick={() => handleOpenDeleteModal(user)}
                      className="w-10 h-10 flex items-center justify-center text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all shadow-sm border border-red-200 hover:border-red-600"
                      title="Delete admin"
                    >
                      <span className="text-lg">🗑️</span>
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
              <div className="p-2 rounded-lg bg-orange-50">
                <span className="text-2xl">➕</span>
              </div>
              Add New Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">👤 Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">📧 Email</label>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">🔐 Password</label>
                <input
                  type="password"
                  placeholder="Create secure password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">🏅 Role</label>
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
                <span className="text-xl">✨</span>
                Add Admin Account
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        user={deletingAdmin}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Renderer */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Settings;