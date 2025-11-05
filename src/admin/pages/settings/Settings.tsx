import { useState } from 'react';
import { useLoadingState } from '../../../hooks/useLoadingState';
import { SettingsPageSkeleton } from '../../../components/LoadingSkeletons';
import useFetchData from '../../hooks/useFetchData';
import { useRBAC } from '../../../hooks/useRBAC';
import { Permission } from '../../../types/rbac.types';
import { ReadOnly, SuperAdminOnly } from '../../../components/rbac/Can';
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

  // RBAC: Get permission checking functions
  const { canManageAdmins, canEditSettings } = useRBAC();

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

        {/* RBAC: Read-only warning for staff */}
        <ReadOnly message="You can view settings but cannot make changes. Contact a Super Administrator for modifications." />

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

          {/* Excel Report Protection - Only SuperAdmin can edit */}
          {canEditSettings && <ExcelPasswordSection />}
        </div>

        {/* RBAC: Admin Management Section - SuperAdmin Only */}
        <SuperAdminOnly
          fallback={
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-yellow-800">
                    Restricted Access
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Admin account management is only accessible to Super
                    Administrators. Contact your Super Administrator if you need
                    to create or manage admin accounts.
                  </p>
                </div>
              </div>
            </div>
          }
        >
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="h-1 w-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Admin Management
              </h2>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                SuperAdmin Only
              </span>
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
        </SuperAdminOnly>

        {/* RBAC: Admin Modals - Only SuperAdmin can access */}
        {canManageAdmins && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
