import React, { useState } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { RecordInterface } from '@/types/global.types';
import { Dispatch, SetStateAction } from 'react';
import { Trash2 } from 'lucide-react';
import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import { useToast } from '@/hooks/useToast';

type DeleterecordModalType = {
  deleteRecord: RecordInterface | null;
  setDeleteRecord: Dispatch<SetStateAction<RecordInterface | null>>;
  refetchRecords: (fetchUrl?: string) => Promise<RecordInterface[]>;
};

const DeleterecordModal = ({
  deleteRecord,
  setDeleteRecord,
  refetchRecords,
}: DeleterecordModalType) => {
  const authFetch = useAuthFetch();
  const { success, error: showError } = useToast();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteResident = async () => {
    if (isDeleting || !deleteRecord) return;
    setIsDeleting(true);
    try {
      await authFetch(`/records/${deleteRecord._id}`, { method: 'DELETE' });
      refetchRecords();
      setDeleteRecord(null);
      success(`Record Deleted! ID: ${deleteRecord._id}`, {
        title: 'Record Deleted',
      });
    } catch (error: any) {
      showError(error?.message || 'Failed to delete record.', {
        title: 'Error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!deleteRecord) return null;

  return (
    <ConfirmModal
      isOpen={!!deleteRecord}
      title={`Delete record for ${deleteRecord.firstName} ${deleteRecord.lastName}?`}
      description={
        <div>
          <p className="text-sm text-gray-700">
            Record ID: <span className="font-semibold">{deleteRecord._id}</span>
          </p>
          <p className="text-xs text-yellow-700 mt-2">
            Warning: This will permanently delete all data associated with this
            resident.
          </p>
          <p className="text-xs text-red-700 mt-2">
            This action cannot be undone.
          </p>
        </div>
      }
      confirmLabel="Delete"
      cancelLabel="Cancel"
      loading={isDeleting}
      onClose={() => setDeleteRecord(null)}
      onConfirm={handleDeleteResident}
    />
  );
};

export default DeleterecordModal;
