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
import EditAdminModal from './components/EditAdminModal';

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
  const [isEditAdminOpen, setIsEditAdminOpen] = useState<boolean>(false);
  const [adminToEdit, setAdminToEdit] = useState<Admin | null>(null);

  if (isLoading || loadingAdmins) {
    return <SettingsPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-3 sm:p-5 lg:p-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <SettingsHeader />

        {/* System Configuration Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="h-1 w-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              System Configuration
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
          </div>

          {/* Barangay Information */}
          <BrngyInfoSection />

          {/* Excel Report Protection */}
          <ExcelPasswordSection />
        </div>

        {/* Admin Management Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="h-1 w-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Admin Management
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
          </div>

          {/* Admin Accounts */}
          <AdminSection
            adminData={adminsData}
            openAddAdminModal={setIsAddAdminModalOpen}
            openDeleteAdminModal={setIsDeleteAdminOpen}
            setAdminToDelete={setAdminToDelete}
            openEditAdminModal={setIsEditAdminOpen}
            setAdminToEdit={setAdminToEdit}
          />
        </div>

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

        {/* Edit Admin Modal */}
        <EditAdminModal
          isOpen={isEditAdminOpen}
          onClose={() => {
            setIsEditAdminOpen(false);
            setAdminToEdit(null);
          }}
          refetchAdmin={refetchAdmins}
          adminToEdit={adminToEdit}
        />
      </div>
    </div>
  );
};

export default Settings;
