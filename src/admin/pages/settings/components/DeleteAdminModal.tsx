import ConfirmModal from '@/components/ui/ConfirmModal';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Admin } from '../Settings.types';
import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import { useToast } from '@/hooks/useToast';

type DeleteAdminModalProps = {
  adminToDelete: Admin | null,
  isDeleteAdminOpen: boolean,
  closeDeleteAdminModal: () => void,
  refetchAdmins: () => void
}

const DeleteAdminModal = ({ adminToDelete, isDeleteAdminOpen, closeDeleteAdminModal, refetchAdmins } : DeleteAdminModalProps ) => {
  const authFetch = useAuthFetch();
  const { success, error } = useToast();

  const [ isDeletingAdmin, setIsDeletingAdmin ] = useState<boolean>();  

  const confirmDeleteAdmin = async () => {
    if (!adminToDelete) return;
    setIsDeletingAdmin(true);
    try {
      await authFetch(`/users/${adminToDelete._id}`, { method: 'DELETE' });
      success('Admin account deleted successfully', { title: 'Success' });
      refetchAdmins();
      closeDeleteAdminModal();
    } catch (err: any) {
      console.error('Delete admin failed', err);
      error(err?.message || 'Failed to delete admin', { title: 'Error' });
      setIsDeletingAdmin(false);
    }
  };

  return (
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
          Are you sure you want to delete this admin account? This action cannot
          be undone and will permanently remove all associated data.
        </p>
      }
      onClose={closeDeleteAdminModal}
      onConfirm={confirmDeleteAdmin}
      loading={isDeletingAdmin}
      confirmLabel="Delete Account"
      cancelLabel="Cancel"
    />
  );
};

export default DeleteAdminModal;
