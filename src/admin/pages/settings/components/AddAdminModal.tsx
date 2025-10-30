import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';
import { AlertCircle, Eye, EyeOff, Mail, Phone, Plus, Shield, User, Users } from 'lucide-react';
import React, { FormEvent, useState } from 'react';

type AddAdminModalProps = {
  isAddAdminModalOpen: boolean;
  closeAddAdminModal: () => void;
  refetchAdmin: () => void
};

const AddAdminModal = ({ isAddAdminModalOpen, closeAddAdminModal, refetchAdmin }: AddAdminModalProps) => {
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

  const validateForm = () : string  => {
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

  };

  const handleAddAdmin = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (validateForm()) {
        error(validateForm(), { title: 'Validation Error' });
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
        refetchAdmin();
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
    setNewAdmin(prev => ({
      ...prev,
      [field]: field === 'password' || field === 'confirmPassword' 
        ? value
        : value.trim()
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 text-green-600" />
                Username
              </label>
              <input
                required
                type="text"
                placeholder="Enter full name"
                maxLength={80}
                value={newAdmin.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
              />
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create secure password"
                  value={newAdmin.password}
                  maxLength={128}
                  onChange={(e) =>  handleInputChange("password", e.target.value)}
                  className={`w-full px-4 py-3 pr-12 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                />

                {newAdmin.password && newAdmin.password.trim().length > 0 && (
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
            </div>

            {/* Confirm Password (full width) */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                Confirm Your Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Enter your password to confirm"
                  value={newAdmin.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`w-full px-4 py-3 pr-12 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                />

                {newAdmin.confirmPassword &&
                  newAdmin.confirmPassword.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-900"
                      aria-label={
                        showConfirmPassword ? 'Hide password' : 'Show password'
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
            </div>

            {/* Contact Number */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4 text-green-600" />
                Contact Number
              </label>
              <input
                required
                type="text"
                placeholder="09XXXXXXXXX"
                value={newAdmin.contactNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  handleInputChange("contactNumber", value)
                }}
                maxLength={11}
                className={`w-full px-4 py-3 text-base border  rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
              />
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
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
              />
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
                      }}
                      className="w-5 h-5 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                    />
                    <span className="text-base text-gray-700 font-medium group-hover:text-green-600 transition-colors">
                      {roleOption}
                    </span>
                  </label>
                ))}
              </div>
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
  );
};

export default AddAdminModal;
