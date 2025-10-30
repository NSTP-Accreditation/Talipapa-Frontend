import { useAuthFetch } from "@/admin/hooks/useAuthFetch";
import ConfirmModal from "@/components/ui/ConfirmModal"
import { useToast } from "@/hooks/useToast";
import { FarmItemInterface } from "@/types/global.types";
import { Dispatch, SetStateAction } from "react";

interface DeleteFarmItemModalProps {
  isOpen: boolean
  itemToDelete: FarmItemInterface;
  onClose: () => void;
  refetch: () => Promise<FarmItemInterface[]>;
}

const DeleteFarmItemModal = ({ isOpen, itemToDelete, onClose, refetch } : DeleteFarmItemModalProps ) => {

  const authFetch = useAuthFetch();
  const { success } = useToast();

  if(!itemToDelete) return null;

  const descriptionNode = (
    <div>
      <p className="text-gray-700 text-base leading-relaxed">
        Are you sure you want to delete{' '}
        <span className="font-bold">"{itemToDelete.name}"</span>?
      </p>
      <p className="text-xs text-red-700 mt-2">This action cannot be undone.</p>
    </div>
  );

  async function confirmDelete() {
    if (!itemToDelete) return;

    try {
      await authFetch(`/farm-inventory/${itemToDelete._id}`, {
        method: 'DELETE',
      });
      await refetch();
      success('Farm item deleted successfully!', { title: 'Deleted' });
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      onClose();
    }
  }
  return (
    <ConfirmModal
      isOpen={isOpen}
      title={`Delete Farm Item?`}
      description={descriptionNode}
      onClose={onClose}
      onConfirm={confirmDelete}
      confirmLabel="Delete"
      cancelLabel="Cancel"
    />
  )
}

export default DeleteFarmItemModal