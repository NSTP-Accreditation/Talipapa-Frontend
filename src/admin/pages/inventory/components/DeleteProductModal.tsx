import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import { Button } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { MaterialInterface, ProductInterface } from '@/types/global.types';
import { AlertTriangle } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface DeleteProductMaterialModalProps {
  itemToDelete: ProductInterface | MaterialInterface;
  setItemToDelete: Dispatch<
    SetStateAction<ProductInterface | MaterialInterface>
  >;
  onClose: () => void;
  refetch: () => Promise<ProductInterface[]> | Promise<MaterialInterface[]>;
  type: 'Product' | 'Material';
}

const DeleteProductMaterialModal = ({
  itemToDelete,
  setItemToDelete,
  onClose,
  refetch,
  type,
}: DeleteProductMaterialModalProps) => {
  const authFetch = useAuthFetch();
  const { success, error: showError } = useToast();

  if (!itemToDelete) return null;

  const confirmDelete = async (): Promise<void> => {
    if (!itemToDelete || !type) return;

    let message;
    try {
      if (type === 'Product') {
        await authFetch(`/products/${itemToDelete?._id}`, {
          method: 'DELETE',
        });
        message = 'Product deleted successfully!';
      } else {
        await authFetch(`/materials/${itemToDelete?._id}`, {
          method: 'DELETE',
        });
        message = 'Material deleted successfully!';
      }
      await refetch();
      success(message, { title: 'Deleted' });
    } catch (error: any) {
      showError(error?.message || 'Failed to delete item', { title: 'Error' });
    } finally {
      setItemToDelete(null);
    }
  };

  const descriptionNode = (
    <div>
      <p className="text-gray-700 text-base leading-relaxed">
        Are you sure you want to delete{' '}
        <span className="font-bold">"{itemToDelete.name}"</span>?
      </p>
      <p className="text-xs text-red-700 mt-2">This action cannot be undone.</p>
    </div>
  );

  return (
    <ConfirmModal
      isOpen={!!itemToDelete}
      title={`Delete ${type === 'Product' ? 'Product' : 'Material'}?`}
      description={descriptionNode}
      onClose={onClose}
      onConfirm={confirmDelete}
      confirmLabel="Delete"
      cancelLabel="Cancel"
    />
  );
};

export default DeleteProductMaterialModal;
