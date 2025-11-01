import React, { useState } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { Dispatch, SetStateAction } from 'react';
import { Trash2 } from 'lucide-react';
import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import { useToast } from '@/hooks/useToast';

type Props = {
  deleteItem: any | null;
  setDeleteItem: (v: any | null) => void;
  refetchRecords: (url?: string) => Promise<any>;
};

const DeleteEstablishmentModal = ({
  deleteItem,
  setDeleteItem,
  refetchRecords,
}: Props) => {
  const authFetch = useAuthFetch();
  const { success, error: showError } = useToast();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting || !deleteItem) return;
    setIsDeleting(true);
    try {
      await authFetch(`/establishment/${deleteItem._id}`, {
        method: 'DELETE',
      });
      await refetchRecords();
      setDeleteItem(null);
      success('Establishment deleted', { title: 'Deleted' });
    } catch (err: any) {
      showError(err?.message || 'Failed to delete establishment');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!deleteItem) return null;

  return (
    <ConfirmModal
      isOpen={!!deleteItem}
      title={`Delete establishment ${deleteItem.name}?`}
      description={
        <div>
          <p className="text-sm text-gray-700">
            Record ID: <span className="font-semibold">{deleteItem._id}</span>
          </p>
          <p className="text-xs text-yellow-700 mt-2">
            Warning: This will permanently delete this establishment record.
          </p>
          <p className="text-xs text-red-700 mt-2">
            This action cannot be undone.
          </p>
        </div>
      }
      confirmLabel="Delete"
      cancelLabel="Cancel"
      loading={isDeleting}
      onClose={() => setDeleteItem(null)}
      onConfirm={handleDelete}
    />
  );
};

export default DeleteEstablishmentModal;
