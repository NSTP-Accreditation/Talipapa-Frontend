import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import ImageWithFallback from '@/components/ImageWithFallback';
import { Button, Input } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { FarmItemInterface } from '@/types/global.types';
import {
  Apple,
  CheckCircle2,
  Leaf,
  Plus,
  Sprout,
  Trees,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface AddEditFarmItemModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'Add' | 'Edit';
  itemToUpdateOrDelete: FarmItemInterface;
  refetchFarmItems: (fetchUrl?: string) => Promise<any>;
}

const AddEditFarmItemModal = ({
  open,
  onClose,
  mode,
  itemToUpdateOrDelete,
  refetchFarmItems,
}: AddEditFarmItemModalProps) => {
  const { success, error: showError } = useToast();
  const authFetch = useAuthFetch();

  const [itemFormData, setItemFormData] = useState({
    _id: '',
    name: '',
    description: '',
    subCategory: '',
    stocks: 0,
    unit: 'kg',
    farmOrigin: '',
    image: null,
    imageFile: null,
  });

  useEffect(() => {
    if (mode === 'Edit' && itemToUpdateOrDelete) {
      setItemFormData({
        _id: itemToUpdateOrDelete._id,
        name: itemToUpdateOrDelete.name,
        description: itemToUpdateOrDelete.description,
        subCategory: itemToUpdateOrDelete.subCategory,
        stocks: itemToUpdateOrDelete.stocks,
        unit: itemToUpdateOrDelete.unit,
        farmOrigin: itemToUpdateOrDelete.farmOrigin,
        image: itemToUpdateOrDelete.image,
        imageFile: null,
      });
    } else {
      setItemFormData({
        _id: '',
        name: '',
        description: '',
        subCategory: '',
        stocks: 0,
        unit: 'kg',
        farmOrigin: '',
        image: null,
        imageFile: null,
      });
    }
  }, [mode, open, itemToUpdateOrDelete]);

  if (!open) return null;

  const validateFarmItemForm = (): boolean => {
    if (!itemFormData.name.trim()) {
      showError('Please enter an item name', { title: 'Validation' });
      return false;
    }
    if (!itemFormData.subCategory.trim()) {
      showError('Please select a category', { title: 'Validation' });
      return false;
    }
    if (itemFormData.stocks < 0 || isNaN(itemFormData.stocks)) {
      showError('Please enter valid stock quantity', { title: 'Validation' });
      return false;
    }
    if (!itemFormData.unit.trim()) {
      showError('Please select a unit', { title: 'Validation' });
      return false;
    }
    if (mode === 'Add') {
      if (!itemFormData.imageFile && !itemFormData.image) {
        showError('Please upload an item image', { title: 'Validation' });
        return false;
      }
    }
    return true;
  };

  const buildFarmItemFormData = (): FormData => {
    const formData = new FormData();

    formData.append('name', itemFormData.name.trim());
    formData.append('description', itemFormData.description.trim());
    formData.append('subCategory', itemFormData.subCategory.trim());
    formData.append('stocks', itemFormData.stocks.toString());
    formData.append('unit', itemFormData.unit.trim());

    if (itemFormData.farmOrigin?.trim()) {
      formData.append('farmOrigin', itemFormData.farmOrigin.trim());
    }

    if (itemFormData.imageFile && itemFormData.imageFile instanceof File) {
      formData.append('image', itemFormData.imageFile);
    }

    return formData;
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setItemFormData((prev) => ({ 
      ...prev, 
      image: {
        url
      }, 
      imageFile: file 
    }));
  };

  const getSubcategoryIcon = (subCategory: string) => {
    switch (subCategory.toLowerCase()) {
      case 'vegetables':
      case 'vegetable':
        return <Leaf className="w-4 h-4 text-green-600" />;
      case 'herbal plants':
        return <Sprout className="w-4 h-4 text-green-600" />;
      case 'fruits':
        return <Apple className="w-4 h-4 text-red-600" />;
      case 'seedlings':
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case 'trees':
        return <Trees className="w-4 h-4 text-green-700" />;
      default:
        return <Sprout className="w-4 h-4 text-green-600" />;
    }
  };

  const handleAddItem = async () => {
    if (!validateFarmItemForm()) {
      return;
    }

    const formData = buildFarmItemFormData();

    try {
      const response = await authFetch('/farm-inventory', {
        method: 'POST',
        body: formData,
      });
      await refetchFarmItems();
      success(response.message || 'Farm item created', { title: 'Success' });
      onClose();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUpdateItem = async () => {
    if (!validateFarmItemForm()) {
      return;
    }

    const formData = buildFarmItemFormData();

    try {
      const response = await authFetch(
        `/farm-inventory/${itemToUpdateOrDelete._id}`,
        {
          method: 'PATCH',
          body: formData,
        }
      );
      await refetchFarmItems();
      success(response.message || 'Farm item updated', { title: 'Success' });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full mx-3 sm:mx-4 z-[10] animate-in zoom-in-95 duration-300 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="relative p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 lg:p-4 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg ring-1 ring-white/30">
                <Sprout className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight">
                  {mode === 'Edit' ? 'Edit Farm Item' : 'Add New Farm Item'}
                </h3>
                <p className="text-xs sm:text-sm text-green-50/90 mt-0.5 sm:mt-1">
                  {mode === 'Edit'
                    ? 'Update farm item details'
                    : 'Fill in the farm item information'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 sm:p-2.5 lg:p-3 rounded-xl sm:rounded-2xl backdrop-blur-sm flex items-center justify-center transition-all duration-200 flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                  Item Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  value={itemFormData.name}
                  onChange={(e) =>
                    setItemFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g., Tomato, Basil, Mango Tree"
                  className="h-10 sm:h-11 text-sm sm:text-base border-2 border-gray-200 focus:border-green-500 rounded-xl px-3 sm:px-4"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                  Description
                </label>
                <textarea
                  value={itemFormData.description}
                  onChange={(e) =>
                    setItemFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of the farm item..."
                  className="w-full min-h-[80px] sm:min-h-[100px] p-3 sm:p-4 resize-none bg-gray-50 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl text-sm sm:text-base outline-none transition-all"
                  maxLength={250}
                />
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                  {itemFormData.description.length}/250 characters
                </p>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                  {getSubcategoryIcon(itemFormData.subCategory)}
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={itemFormData.subCategory}
                  onChange={(e) =>
                    setItemFormData((prev) => ({
                      ...prev,
                      subCategory: e.target.value,
                    }))
                  }
                  className="w-full h-10 sm:h-11 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl px-3 sm:px-4 bg-white text-sm sm:text-base"
                >
                  <option value="">Select Category</option>
                  <option value="Vegetables">🥬 Vegetables</option>
                  <option value="Herbal Plants">🌿 Herbal Plants</option>
                  <option value="Fruits">🍎 Fruits</option>
                  <option value="Seedlings">🌱 Seedlings</option>
                  <option value="Trees">🌳 Trees</option>
                </select>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={itemFormData.stocks ?? 0}
                  onChange={(e) => {
                    const value = e.target.value;
                    setItemFormData((prev) => ({
                      ...prev,
                      stocks: value === '' ? 0 : Number(value),
                    }));
                  }}
                  placeholder="0"
                  min="0"
                  className="h-10 sm:h-11 text-sm sm:text-base border-2 border-gray-200 focus:border-green-500 rounded-xl px-3 sm:px-4"
                />
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Current quantity in farm inventory
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={itemFormData.unit}
                    onChange={(e) =>
                      setItemFormData((prev) => ({
                        ...prev,
                        unit: e.target.value,
                      }))
                    }
                    className="w-full h-10 sm:h-11 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl px-3 sm:px-4 bg-white text-sm sm:text-base"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="pieces">Pieces</option>
                    <option value="bundles">Bundles</option>
                    <option value="sacks">Sacks</option>
                    <option value="pots">Pots</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                  Farm Origin (Optional)
                </label>
                <Input
                  value={itemFormData.farmOrigin}
                  onChange={(e) =>
                    setItemFormData((prev) => ({
                      ...prev,
                      farmOrigin: e.target.value,
                    }))
                  }
                  placeholder="e.g., Barangay Farm Co-op"
                  className="h-10 sm:h-11 text-sm sm:text-base border-2 border-gray-200 focus:border-green-500 rounded-xl px-3 sm:px-4"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                  Item Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="block w-full text-xs sm:text-sm text-gray-600 file:mr-3 sm:file:mr-4 file:py-2 sm:file:py-2.5 file:px-3 sm:file:px-4 file:rounded-xl file:border-0 file:text-xs sm:file:text-sm file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:cursor-pointer cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-3 bg-gray-50/50"
                />
              </div>
            </div>

            {/* Right Column - Image Preview */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                Image Preview
              </label>
              <div className="relative w-full h-[280px] sm:h-[350px] lg:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                {itemFormData.image ? (
                  <>
                    <ImageWithFallback
                      src={itemFormData.image.url}
                      alt={itemFormData.name || 'preview'}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-green-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-lg">
                      ✓ Ready
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <Sprout className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-green-400" />
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                      No image uploaded
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                      Upload an image to preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gradient-to-t from-gray-50 to-white border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-[10px] sm:text-xs text-gray-500 order-2 sm:order-1">
            <span className="text-red-500">*</span> Required fields
          </p>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto order-1 sm:order-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-xl text-sm"
            >
              Cancel
            </Button>
            {mode === 'Edit' ? (
              <Button
                onClick={handleUpdateItem}
                className="flex-1 sm:flex-none px-5 sm:px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl shadow-lg text-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 inline" />{' '}
                Update Item
              </Button>
            ) : (
              <Button
                onClick={handleAddItem}
                className="flex-1 sm:flex-none px-5 sm:px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl shadow-lg text-sm"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 inline" />{' '}
                Add Item
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddEditFarmItemModal;
