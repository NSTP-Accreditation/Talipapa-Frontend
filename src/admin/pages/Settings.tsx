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
  Eye,
  EyeOff,
  X,
  Check,
  AlertCircle,
  Upload,
  Shield,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
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
  const { isLoading } = useLoadingState(1000);
  const authFetch = useAuthFetch();
  const toast = useToast();

  const {
    data: pageContent,
    loading: loadingPageContent,
    error: errorPagecontent,
    refetch: refetchPageContent,
  } = useFetchData(`/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}`);

  const {
    data: adminsData,
    loading: loadingAdmins,
    error: errorAdmins,
    refetch: refetchAdmins,
  } = useFetchData('/users');

  const [barangayName, setBarangayName] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [editingBarangay, setEditingBarangay] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>();
  const [isSavingBarangay, setIsSavingBarangay] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Modal states
  const [isDeleteAdminOpen, setIsDeleteAdminOpen] = useState(false);
  const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);
  const [isDeletingAdmin, setIsDeletingAdmin] = useState(false);
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  // Form states
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    contactNumber: '',
    password: '',
    roles: [] as string[],
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // modalRef removed; using shared Modal component instead

  useEffect(() => {
    if (adminsData && !loadingAdmins && !errorAdmins) {
      setAdmins(adminsData);
    }
  }, [adminsData, loadingAdmins, errorAdmins]);

  useEffect(() => {
    if (pageContent && !loadingPageContent && !errorPagecontent) {
      setLogoPreview(pageContent?.image?.url);
      setBarangayName(pageContent?.barangayName);
    }
  }, [pageContent, loadingPageContent, errorPagecontent]);

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!newAdmin.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!newAdmin.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdmin.email)) {
      errors.email = 'Invalid email format';
    }

    // Contact number is optional — validate only when provided
    if (newAdmin.contactNumber && newAdmin.contactNumber.trim()) {
      if (newAdmin.contactNumber.length !== 11) {
        errors.contactNumber = 'Contact number must be 11 digits';
      }
    }

    if (!newAdmin.password) {
      errors.password = 'Password is required';
    } else if (newAdmin.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (newAdmin.password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (newAdmin.roles.length === 0) {
      errors.roles = 'At least one role is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size should be less than 2MB', {
        title: 'File Error',
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file', { title: 'File Error' });
      return;
    }

    setIsUploadingLogo(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      await authFetch(
        `/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}/withImage`,
        {
          method: 'PATCH',
          body: formData,
        }
      );

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      toast.success('Barangay logo updated successfully', {
        title: 'Success',
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload logo', { title: 'Error' });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleBarangayNameSave = async () => {
    if (!barangayName.trim()) {
      toast.error('Barangay name cannot be empty', {
        title: 'Validation Error',
      });
      return;
    }

    setIsSavingBarangay(true);
    try {
      await authFetch(`/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}`, {
        method: 'PATCH',
        body: JSON.stringify({
          barangayName: barangayName,
        }),
      });
      toast.success('Barangay name updated successfully', { title: 'Success' });
      setEditingBarangay(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update barangay name', { title: 'Error' });
    } finally {
      setIsSavingBarangay(false);
    }
  };

  const handleDeleteAdmin = (id: string) => {
    setDeletingAdminId(id);
    setIsDeleteAdminOpen(true);
  };

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
      toast.success('Admin account deleted successfully', { title: 'Success' });
      refetchAdmins();
      closeDeleteAdminModal();
    } catch (err: any) {
      console.error('Delete admin failed', err);
      toast.error(err?.message || 'Failed to delete admin', { title: 'Error' });
      setIsDeletingAdmin(false);
    }
  };

  const closeAddAdminModal = () => {
    setIsAddAdminModalOpen(false);
    setNewAdmin({
      username: '',
      email: '',
      contactNumber: '',
      password: '',
      roles: [],
    });
    setConfirmPassword('');
    setFormErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsAddingAdmin(false);
  };

  const openAddAdminModal = () => {
    // prefill contact number with '09' as in add-residents modal
    setNewAdmin((prev) => ({
      ...prev,
      contactNumber: prev.contactNumber || '09',
    }));
    setIsAddAdminModalOpen(true);
  };

  const handleAddAdmin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors', { title: 'Validation Error' });
      return;
    }

    const payload = { ...newAdmin, roles: {} };
    const newRoles: { SuperAdmin?: number; Admin?: number } = {};

    if (newAdmin.roles.includes('SuperAdmin')) {
      newRoles.SuperAdmin = Number(import.meta.env.VITE_SUPERADMIN);
    }

    if (newAdmin.roles.includes('Admin')) {
      newRoles.Admin = Number(import.meta.env.VITE_ADMIN);
    }

    payload.roles = newRoles;

    try {
      setIsAddingAdmin(true);
      await authFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ ...payload, confirmPassword }),
      });

      toast.success('New admin account created successfully', {
        title: 'Success',
      });
      refetchAdmins();
      closeAddAdminModal();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create admin account', {
        title: 'Error',
      });
      setIsAddingAdmin(false);
    }
  };

  // Modal focus-trap/ESC logic is provided by the shared Modal component

  if (isLoading) {
    return <SettingsPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
              <Cog className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Settings
              </h1>
              <p className="text-sm lg:text-base text-gray-600 mt-1 font-medium">
                Manage system configuration and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Delete Admin Modal */}
        <ConfirmModal
          isOpen={isDeleteAdminOpen}
          title={
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <span>Delete Admin Account</span>
            </div>
          }
          description={
            <p className="text-gray-700 text-base leading-relaxed">
              Are you sure you want to delete this admin account? This action
              cannot be undone and will permanently remove all associated data.
            </p>
          }
          onClose={closeDeleteAdminModal}
          onConfirm={confirmDeleteAdmin}
          loading={isDeletingAdmin}
          confirmLabel="Delete Account"
          cancelLabel="Cancel"
        />

        {/* Add Admin Modal */}
        <Modal
          isOpen={isAddAdminModalOpen}
          onClose={closeAddAdminModal}
          title={
            <div className="w-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold">Add New Admin</h3>
              </div>
              <p className="text-sm lg:text-base text-white/90">
                Create a new administrator account with specific roles and
                permissions
              </p>
            </div>
          }
        >
          <form onSubmit={handleAddAdmin} className="flex flex-col flex-1">
            <div className="space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 text-green-600" />
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    maxLength={80}
                    value={newAdmin.username}
                    onChange={(e) => {
                      setNewAdmin({ ...newAdmin, username: e.target.value });
                      if (formErrors.username) {
                        setFormErrors({ ...formErrors, username: '' });
                      }
                    }}
                    className={`w-full px-4 py-3 text-base border ${
                      formErrors.username ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                  />
                  {formErrors.username && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.username}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create secure password"
                      value={newAdmin.password}
                      maxLength={128}
                      onChange={(e) => {
                        setNewAdmin({ ...newAdmin, password: e.target.value });
                        if (formErrors.password) {
                          setFormErrors({ ...formErrors, password: '' });
                        }
                      }}
                      className={`w-full px-4 py-3 pr-12 text-base border ${
                        formErrors.password
                          ? 'border-red-500'
                          : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                    />

                    {newAdmin.password &&
                      newAdmin.password.trim().length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-900"
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      )}
                  </div>
                  {formErrors.password && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password (full width) */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Confirm Your Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Enter your password to confirm"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (formErrors.confirmPassword) {
                          setFormErrors({ ...formErrors, confirmPassword: '' });
                        }
                      }}
                      className={`w-full px-4 py-3 pr-12 text-base border ${
                        formErrors.confirmPassword
                          ? 'border-red-500'
                          : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                    />

                    {confirmPassword && confirmPassword.trim().length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-900"
                        aria-label={
                          showConfirmPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Contact Number */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    Contact Number
                  </label>
                  <input
                    type="text"
                    placeholder="09XXXXXXXXX"
                    value={newAdmin.contactNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setNewAdmin({ ...newAdmin, contactNumber: value });
                      if (formErrors.contactNumber) {
                        setFormErrors({ ...formErrors, contactNumber: '' });
                      }
                    }}
                    maxLength={11}
                    className={`w-full px-4 py-3 text-base border ${
                      formErrors.contactNumber
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                  />
                  {formErrors.contactNumber && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.contactNumber}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 text-green-600" />
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    maxLength={254}
                    value={newAdmin.email}
                    onChange={(e) => {
                      setNewAdmin({ ...newAdmin, email: e.target.value });
                      if (formErrors.email) {
                        setFormErrors({ ...formErrors, email: '' });
                      }
                    }}
                    className={`w-full px-4 py-3 text-base border ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                  />
                  {formErrors.email && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1 w-full">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Shield className="w-4 h-4 text-green-600" />
                    Assign Roles
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['SuperAdmin', 'Admin'].map((roleOption) => (
                      <label
                        key={roleOption}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={newAdmin.roles.includes(roleOption)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAdmin({
                                ...newAdmin,
                                roles: [...newAdmin.roles, roleOption],
                              });
                            } else {
                              setNewAdmin({
                                ...newAdmin,
                                roles: newAdmin.roles.filter(
                                  (r) => r !== roleOption
                                ),
                              });
                            }
                            if (formErrors.roles)
                              setFormErrors({ ...formErrors, roles: '' });
                          }}
                          className="w-5 h-5 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                        />
                        <span className="text-base text-gray-700 font-medium group-hover:text-green-600 transition-colors">
                          {roleOption}
                        </span>
                      </label>
                    ))}
                  </div>
                  {formErrors.roles && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.roles}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <button
                    type="button"
                    onClick={closeAddAdminModal}
                    disabled={isAddingAdmin}
                    className="flex-1 lg:flex-initial px-6 py-3 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAddingAdmin}
                    className="flex-1 lg:flex-initial px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold shadow-sm hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAddingAdmin ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add Admin
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Modal>

        {/* Barangay Information */}
        <Card className="shadow-md border border-gray-200 overflow-hidden">
          <CardHeader className="pb-6 bg-gradient-to-r from-green-50 to-white border-b border-gray-200">
            <CardTitle className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Building className="w-6 h-6 text-green-600" />
              </div>
              Barangay Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 lg:p-8 space-y-8">
            {/* Barangay Name */}
            <div className="space-y-3">
              <label className="block text-base font-semibold text-gray-700">
                Barangay Name
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {editingBarangay ? (
                  <>
                    <input
                      type="text"
                      value={barangayName}
                      onChange={(e) => setBarangayName(e.target.value)}
                      className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                      placeholder="Enter barangay name"
                    />
                    <div className="flex gap-2 sm:flex-shrink-0">
                      <button
                        onClick={handleBarangayNameSave}
                        disabled={isSavingBarangay}
                        className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSavingBarangay ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Save
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setEditingBarangay(false)}
                        disabled={isSavingBarangay}
                        className="flex-1 sm:flex-initial px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all shadow-sm disabled:opacity-50"
                      >
                        <X className="w-4 h-4 inline mr-1" />
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 px-4 py-3 text-lg bg-gray-50 border border-gray-200 rounded-lg font-semibold text-gray-900">
                      {barangayName || 'Not set'}
                    </div>
                    <button
                      onClick={() => setEditingBarangay(true)}
                      className="sm:flex-shrink-0 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Barangay Logo */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-gray-700">
                Barangay Logo
              </label>
              <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
                <div className="w-48 h-48 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 hover:border-green-400 transition-all mx-auto lg:mx-0 shadow-inner">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Barangay logo"
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="text-center">
                      <Building className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <span className="text-gray-500 text-sm font-semibold">
                        No Logo
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-4 flex-1 w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                    disabled={isUploadingLogo}
                  />
                  <label
                    htmlFor="logo-upload"
                    className={`inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg cursor-pointer hover:from-green-700 hover:to-green-800 transition-all shadow-sm w-full lg:w-auto ${
                      isUploadingLogo ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isUploadingLogo ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Upload New Logo
                      </>
                    )}
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Upload Requirements
                    </p>
                    <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                      <li>Recommended size: 200x200px or larger</li>
                      <li>Maximum file size: 2MB</li>
                      <li>Supported formats: JPG, PNG, GIF</li>
                      <li>Use transparent background for best results</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Accounts */}
        <Card className="shadow-md border border-gray-200 overflow-hidden">
          <CardHeader className="pb-6 bg-gradient-to-r from-green-50 to-white border-b border-gray-200 flex items-center justify-between gap-4">
            <CardTitle className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              Admin Accounts
            </CardTitle>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={openAddAdminModal}
                className="px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Admin
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-6 lg:p-8">
            {admins && admins.length > 0 ? (
              <div className="space-y-4">
                {admins.map((admin) => (
                  <div
                    key={admin._id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-5 lg:p-6 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all gap-4"
                  >
                    <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
                      <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ring-4 ring-green-100">
                        <span className="text-white font-bold text-xl lg:text-2xl">
                          {admin.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base lg:text-lg text-gray-900 truncate">
                          {admin.username}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{admin.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{admin.contactNumber}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between lg:justify-end gap-3 flex-shrink-0">
                      <div className="flex flex-wrap gap-2">
                        {admin.rolesKeys.map((role) => (
                          <span
                            key={role}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1 ${
                              role === 'SuperAdmin'
                                ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
                                : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300'
                            }`}
                          >
                            <Shield className="w-3 h-3" />
                            {role}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleDeleteAdmin(admin._id)}
                        className="w-10 h-10 flex items-center justify-center text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all shadow-sm border border-red-200 hover:border-red-600 flex-shrink-0"
                        title="Delete admin account"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">
                  No admin accounts found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Click "Add New Admin" to create one
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
