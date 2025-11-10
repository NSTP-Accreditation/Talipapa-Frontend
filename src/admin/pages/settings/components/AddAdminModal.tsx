import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Plus,
  Shield,
  User,
  Users,
} from 'lucide-react';
import React, { FormEvent, useState } from 'react';

type AddAdminModalProps = {
  isAddAdminModalOpen: boolean;
  closeAddAdminModal: () => void;
  refetchAdmin: () => void;
  adminData: any[] | null;
};

const AddAdminModal = ({
  isAddAdminModalOpen,
  closeAddAdminModal,
  refetchAdmin,
  adminData,
}: AddAdminModalProps) => {
  const { success, error } = useToast();
  const authFetch = useAuthFetch();

  const [isAddingAdmin, setIsAddingAdmin] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
    roles: [] as string[],
  });

  const validateForm = (): string => {
    if (!newAdmin.username.trim()) {
      return 'Username is required';
    }

    if (!newAdmin.email.trim()) {
      return 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdmin.email)) {
      return 'Invalid email format';
    }

    // Contact number is optional — validate only when provided
    if (newAdmin.contactNumber && newAdmin.contactNumber.trim()) {
      if (newAdmin.contactNumber.length !== 11) {
        return 'Contact number must be 11 digits';
      }
    }

    if (!newAdmin.password) {
      return 'Password is required';
    } else if (newAdmin.password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    if (!newAdmin.confirmPassword) {
      return 'Please confirm your password';
    } else if (newAdmin.password !== newAdmin.confirmPassword) {
      return 'Passwords do not match';
    }

    if (newAdmin.roles.length === 0) {
      return 'At least one role is required';
    }

    // Check role limits
    if (adminData) {
      const superAdminCount = adminData.filter((admin: any) => {
        const rolesKeys = admin.rolesKeys || [];
        return rolesKeys.some(
          (role: string) => String(role).toLowerCase() === 'superadmin'
        );
      }).length;

      const adminCount = adminData.filter((admin: any) => {
        const rolesKeys = admin.rolesKeys || [];
        return rolesKeys.some(
          (role: string) => String(role).toLowerCase() === 'admin'
        );
      }).length;

      if (newAdmin.roles.includes('SuperAdmin') && superAdminCount >= 2) {
        return 'Maximum of 2 SuperAdmin accounts allowed. Please remove an existing SuperAdmin first.';
      }

      if (newAdmin.roles.includes('Admin') && adminCount >= 1) {
        return 'Maximum of 1 Admin account allowed. Please remove the existing Admin first.';
      }
    }

    return '';
  };

  const handleAddAdmin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      error(validationError, { title: 'Validation Error' });
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
        body: JSON.stringify({ ...payload }),
      });

      success('New admin account created successfully', {
        title: 'Success',
      });

      // Reset form
      setNewAdmin({
        username: '',
        email: '',
        contactNumber: '',
        password: '',
        confirmPassword: '',
        roles: [],
      });
      setShowPassword(false);
      setShowConfirmPassword(false);

      // Refetch and close
      await refetchAdmin();
      closeAddAdminModal();
    } catch (err: any) {
      error(err?.message || 'Failed to create admin account', {
        title: 'Error',
      });
    } finally {
      setIsAddingAdmin(false);
    }
  };

  const handleInputChange = (field: keyof typeof newAdmin, value: string) => {
    setNewAdmin((prev) => ({
      ...prev,
      [field]:
        field === 'password' || field === 'confirmPassword'
          ? value
          : value.trim(),
    }));
  };

  return (
    <Modal
      isOpen={isAddAdminModalOpen}
      onClose={closeAddAdminModal}
      title="Add New Admin"
      subtitle="Create a new administrator account with specific roles and permissions"
      icon={<Users className="w-6 h-6 text-white" />}
    >
      <form onSubmit={handleAddAdmin} className="flex flex-col flex-1">
        <div className="space-y-6 overflow-y-auto flex-1">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-gray-200">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  newAdmin.username &&
                  newAdmin.email &&
                  newAdmin.contactNumber &&
                  newAdmin.password &&
                  newAdmin.confirmPassword
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                1
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Account Info
              </span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-3 rounded-full">
              <div
                className={`h-full rounded-full transition-all ${
                  newAdmin.username &&
                  newAdmin.email &&
                  newAdmin.contactNumber &&
                  newAdmin.password &&
                  newAdmin.confirmPassword
                    ? 'bg-green-500 w-full'
                    : 'bg-gray-300 w-0'
                }`}
              ></div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  newAdmin.roles.length > 0
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                2
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Assign Roles
              </span>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
              {/* Username */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 text-green-600" />
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Enter full name"
                  maxLength={80}
                  value={newAdmin.username}
                  onChange={(e) =>
                    handleInputChange('username', e.target.value)
                  }
                  className={`w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    newAdmin.username.trim()
                      ? 'border-green-300'
                      : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 text-green-600" />
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  placeholder="admin@example.com"
                  maxLength={254}
                  value={newAdmin.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    newAdmin.email.trim() &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdmin.email)
                      ? 'border-green-300'
                      : newAdmin.email.trim()
                        ? 'border-red-300'
                        : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="tel"
                  placeholder="09XXXXXXXXX"
                  value={newAdmin.contactNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    handleInputChange('contactNumber', value);
                  }}
                  maxLength={11}
                  className={`w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    newAdmin.contactNumber.length === 11
                      ? 'border-green-300'
                      : newAdmin.contactNumber.length > 0
                        ? 'border-yellow-300'
                        : 'border-gray-300'
                  }`}
                />
                {newAdmin.contactNumber.length > 0 &&
                  newAdmin.contactNumber.length < 11 && (
                    <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Must be 11 digits
                    </p>
                  )}
              </div>

              {/* Password */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 6 characters"
                    value={newAdmin.password}
                    maxLength={128}
                    onChange={(e) =>
                      handleInputChange('password', e.target.value)
                    }
                    className={`w-full px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                      newAdmin.password.length >= 6
                        ? 'border-green-300'
                        : newAdmin.password.length > 0
                          ? 'border-yellow-300'
                          : 'border-gray-300'
                    }`}
                  />
                  {newAdmin.password && newAdmin.password.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  )}
                </div>
                {newAdmin.password.length > 0 &&
                  newAdmin.password.length < 6 && (
                    <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      At least 6 characters required
                    </p>
                  )}
              </div>

              {/* Confirm Password (full width) */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    required
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={newAdmin.confirmPassword}
                    onChange={(e) =>
                      handleInputChange('confirmPassword', e.target.value)
                    }
                    className={`w-full px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                      newAdmin.confirmPassword &&
                      newAdmin.password === newAdmin.confirmPassword
                        ? 'border-green-300'
                        : newAdmin.confirmPassword
                          ? 'border-red-300'
                          : 'border-gray-300'
                    }`}
                  />
                  {newAdmin.confirmPassword &&
                    newAdmin.confirmPassword.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        aria-label={
                          showConfirmPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                    )}
                </div>
                {newAdmin.confirmPassword &&
                  newAdmin.password !== newAdmin.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1 animate-pulse">
                      <AlertCircle className="w-3 h-3" />
                      Passwords do not match
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Role Assignment Section */}
        <div className="pt-4 sm:pt-6 border-t-2 border-gray-200 bg-gradient-to-r from-green-50 to-white">
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              Role Assignment
            </h3>

            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Shield className="w-4 h-4 text-green-600" />
              Select Role(s) <span className="text-red-500">*</span>
            </label>

            {/* Role limits info */}
            <div className="p-3 sm:p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-blue-800">
                  <strong className="font-bold">Role Limits:</strong> SuperAdmin
                  (max 2), Admin (max 1)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              ].map((roleOption) => (
                <label
                  key={roleOption.name}
                  className={`flex items-start gap-3 p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    newAdmin.roles.includes(roleOption.name)
                      ? roleOption.color === 'green'
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : roleOption.color === 'blue'
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-500 bg-gray-50 shadow-md'
                      : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
                  }`}
                  title={roleOption.description}
                >
                  <input
                    type="checkbox"
                    checked={newAdmin.roles.includes(roleOption.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewAdmin({
                          ...newAdmin,
                          roles: [...newAdmin.roles, roleOption.name],
                        });
                      } else {
                        setNewAdmin({
                          ...newAdmin,
                          roles: newAdmin.roles.filter(
                            (r) => r !== roleOption.name
                          ),
                        });
                      }
                    }}
                    className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer flex-shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-sm sm:text-base font-bold block ${
                        newAdmin.roles.includes(roleOption.name)
                          ? roleOption.color === 'green'
                            ? 'text-green-700'
                            : roleOption.color === 'blue'
                              ? 'text-blue-700'
                              : 'text-gray-700'
                          : 'text-gray-700'
                      }`}
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

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={closeAddAdminModal}
                disabled={isAddingAdmin}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 text-sm sm:text-base min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAddingAdmin}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-bold shadow-md hover:from-green-700 hover:to-green-800 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px]"
              >
                {isAddingAdmin ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Add Admin</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddAdminModal;
