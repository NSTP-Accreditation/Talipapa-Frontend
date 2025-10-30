import React, { FormEvent, useEffect, useState } from 'react';
import {
  Users,
  Plus,
  Trash,
  Eye,
  EyeOff,
  AlertCircle,
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
import SettingsHeader from './settings/components/SettingsHeader';
import BrngyInfoSection from './settings/components/BrgyInfoSection';
import { Admin } from './settings/Settings.types';
import AdminSection from './settings/components/AdminSection';
import AddAdminModal from './settings/components/AddAdminModal';

const Settings: React.FC = () => {
  const { isLoading } = useLoadingState(1000);
  const authFetch = useAuthFetch();
  const toast = useToast();

  const {
    data: adminsData,
    loading: loadingAdmins,
    error: errorAdmins,
    refetch: refetchAdmins,
  } = useFetchData<Admin[]>('/users');

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

  if (isLoading || loadingAdmins) {
    return <SettingsPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-5">
      <div className="mx-auto space-y-6 lg:space-y-8">
        {/* Header */}
        <SettingsHeader />

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

        {/* Barangay Information */}
        <BrngyInfoSection />

        {/* Admin Accounts */}
        <AdminSection 
          adminData={adminsData}
          loadingAdmins={loadingAdmins}
          errorAdmins={errorAdmins}
          openAddAdminModal={setIsAddAdminModalOpen}
        />

        {/* Add Admin Modal */}
        <AddAdminModal 
          isAddAdminModalOpen={isAddAdminModalOpen}
          closeAddAdminModal={() => setIsAddAdminModalOpen(false)}
          refetchAdmin={refetchAdmins}
        />

      </div>
    </div>
  );
};

export default Settings;
