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
  const { success } = useToast();

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
    } catch (error) {
      console.error(error);
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <ConfirmModal
      isOpen={!!itemToDelete}
      title={`Delete ${type === 'Product' ? 'Product' : 'Material'}?`}
      description={
        <p className="text-gray-700 text-base leading-relaxed">
          Are you sure you want to delete{' '}
          <span className="font-bold">"{itemToDelete.name}"</span>?
        </p>
      }
      onClose={onClose}
      onConfirm={confirmDelete}
      confirmLabel="Delete"
      cancelLabel="Cancel"
    />
  );
};

export default DeleteProductMaterialModal;
