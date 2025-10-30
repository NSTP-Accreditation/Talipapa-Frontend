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
import DeleteAdminModal from './settings/components/DeleteAdminModal';

const Settings: React.FC = () => {
  const { isLoading } = useLoadingState(1000);

  const {
    data: adminsData,
    loading: loadingAdmins,
    error: errorAdmins,
    refetch: refetchAdmins,
  } = useFetchData<Admin[]>('/users');

  // Modal states
  const [isDeleteAdminOpen, setIsDeleteAdminOpen] = useState<boolean>(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState<boolean>(false);
  
  if (isLoading || loadingAdmins) {
    return <SettingsPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-5">
      <div className="mx-auto space-y-6 lg:space-y-8">
        {/* Header */}
        <SettingsHeader />

        {/* Barangay Information */}
        <BrngyInfoSection />

        {/* Admin Accounts */}
        <AdminSection 
          adminData={adminsData}
          openAddAdminModal={setIsAddAdminModalOpen}
          openDeleteAdminModal={setIsDeleteAdminOpen}
          setAdminToDelete={setAdminToDelete}
        />

        {/* Add Admin Modal */}
        <AddAdminModal
          isAddAdminModalOpen={isAddAdminModalOpen}
          closeAddAdminModal={() => setIsAddAdminModalOpen(false)}
          refetchAdmin={refetchAdmins}
        />

        {/* Delete Admin Modal */}
        <DeleteAdminModal 
          adminToDelete={adminToDelete}
          isDeleteAdminOpen={isDeleteAdminOpen}
          closeDeleteAdminModal={() => {
            setIsDeleteAdminOpen(false);
            setAdminToDelete(null);
          }}
          refetchAdmins={refetchAdmins}
        />

      </div>
    </div>
  );
};

export default Settings;
