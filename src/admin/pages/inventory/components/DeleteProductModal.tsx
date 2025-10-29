import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import { Button } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { MaterialInterface, ProductInterface } from '@/types/global.types';
import { AlertTriangle } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { createPortal } from 'react-dom';

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

  const confirmDelete = async () : Promise<void> => {
    if (!itemToDelete || !type) return;

    let message;
    try {
      if (type === 'Product') {
        await authFetch(`/products/${itemToDelete?._id}`, {
          method: 'DELETE',
        });
        message = "Product deleted successfully!";
      } else {
        await authFetch(`/materials/${itemToDelete?._id}`, {
          method: 'DELETE',
        });
        message = "Material deleted successfully!";
      }
      await refetch();
      success(message, { title: 'Deleted' });
    } catch (error) {
      console.error(error);
    } finally {
      setItemToDelete(null);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 z-[10] animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Delete {type === 'Product' ? 'Product' : 'Material'}?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                This action cannot be undone
              </p>
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete{' '}
            <span className="font-bold text-gray-900">
              "{itemToDelete.name}"
            </span>
            ?
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 py-2 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteProductMaterialModal;
