import { useState } from 'react';
import { useLoadingState } from '../../../hooks/useLoadingState';
import { SettingsPageSkeleton } from '../../../components/LoadingSkeletons';
import useFetchData from '../../hooks/useFetchData';
import SettingsHeader from './components/SettingsHeader';
import BrngyInfoSection from './components/BrgyInfoSection';
import ExcelPasswordSection from './components/ExcelPasswordSection';
import { Admin } from './Settings.types';
import AdminSection from './components/AdminSection';
import AddAdminModal from './components/AddAdminModal';
import DeleteAdminModal from './components/DeleteAdminModal';

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
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] =
    useState<boolean>(false);

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

        {/* Excel Report Protection */}
        <ExcelPasswordSection />

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
          adminData={adminsData}
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
