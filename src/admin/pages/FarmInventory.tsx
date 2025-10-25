import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/useToast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sprout,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Search,
  X,
  TrendingUp,
  CheckCircle2,
  Leaf,
  Apple,
  Trees,
} from 'lucide-react';
import { PageLoadingSkeleton } from '@/components/LoadingSkeletons';
import useFetchData from '../hooks/useFetchData';
import { useAuthFetch } from '../hooks/useAuthFetch';

interface FarmItem {
  id: string;
  name: string;
  image?: string;
  subCategory?: string;
  description?: string;
  stocks?: number;
  unit?: string;
  farmOrigin?: string;
}

// Simple image component with fallback
const ImageWithFallback: React.FC<{
  src?: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className }) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gradient-to-br from-green-200 to-green-300`}
      >
        <Sprout className="w-1/2 h-1/2 text-green-600" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

// Delete Confirmation Modal
const DeleteModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}> = ({ open, onClose, onConfirm, itemName }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-1003 flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 z-10 animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Delete Farm Item?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                This action cannot be undone
              </p>
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete{' '}
            <span className="font-bold text-gray-900">"{itemName}"</span>?
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
              onClick={onConfirm}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Farm Item Modal
const FarmItemModal: React.FC<{
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  formData: {
    name: string;
    description: string;
    subCategory: string;
    stocks: string;
    unit: string;
    farmOrigin: string;
    image: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
}> = ({ open, onClose, mode, formData, setFormData, onSubmit }) => {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const fileUrlRef = useRef<string | null>(null);
  const hasOpened = useRef(false);

  useEffect(() => {
    if (!open) {
      hasOpened.current = false;
      return;
    }

    if (!hasOpened.current) {
      const focusTimer = setTimeout(() => nameRef.current?.focus(), 100);
      hasOpened.current = true;
      return () => clearTimeout(focusTimer);
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    return () => {
      if (fileUrlRef.current) URL.revokeObjectURL(fileUrlRef.current);
      fileUrlRef.current = null;
    };
  }, []);

  if (!open) return null;

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fileUrlRef.current) URL.revokeObjectURL(fileUrlRef.current);
    const url = URL.createObjectURL(file);
    fileUrlRef.current = url;
    setFormData((prev: any) => ({ ...prev, image: url, imageFile: file }));
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

  return (
    <div className="fixed inset-0 z-1003 flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full mx-3 sm:mx-4 z-10 animate-in zoom-in-95 duration-300 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
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
                  {mode === 'edit' ? 'Edit Farm Item' : 'Add New Farm Item'}
                </h3>
                <p className="text-xs sm:text-sm text-green-50/90 mt-0.5 sm:mt-1">
                  {mode === 'edit'
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
                <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                  Item Name <span className="text-red-500">*</span>
                </label>
                <Input
                  ref={nameRef as any}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
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
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of the farm item..."
                  className="w-full min-h-[80px] sm:min-h-[100px] p-3 sm:p-4 resize-none bg-gray-50 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl text-sm sm:text-base outline-none transition-all"
                  maxLength={250}
                />
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                  {formData.description.length}/250 characters
                </p>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                  {getSubcategoryIcon(formData.subCategory)}
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.subCategory}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
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
                  value={formData.stocks}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      stocks: e.target.value,
                    }))
                  }
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
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
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
                  value={formData.farmOrigin}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
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
                {formData.image ? (
                  <>
                    <ImageWithFallback
                      src={formData.image}
                      alt={formData.name || 'preview'}
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
            <Button
              onClick={onSubmit}
              className="flex-1 sm:flex-none px-5 sm:px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl shadow-lg text-sm"
            >
              {mode === 'edit' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 inline" />{' '}
                  Update Item
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 inline" />{' '}
                  Add Item
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FarmInventory: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    data: farmItemsData,
    loading: farmItemsDataLoading,
    error: farmItemsDataErr,
    refetch: refetchFarmItems,
  } = useFetchData('/farm-inventory');

  const authFetch = useAuthFetch();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const farmItems: FarmItem[] = useMemo(() => {
    if (farmItemsData && !farmItemsDataLoading && !farmItemsDataErr) {
      return farmItemsData?.map((item) => {
        const { _id, image, ...rest } = item;
        return {
          ...rest,
          id: _id,
          image: image?.url || image,
        };
      });
    }
    return [];
  }, [farmItemsData, farmItemsDataLoading, farmItemsDataErr]);

  const [search, setSearch] = useState('');
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemMode, setItemMode] = useState<'add' | 'edit'>('add');
  const [editingItem, setEditingItem] = useState<FarmItem | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    item: any;
  }>({
    open: false,
    item: null,
  });

  const [itemFormData, setItemFormData] = useState({
    name: '',
    description: '',
    subCategory: '',
    stocks: '',
    unit: 'kg',
    farmOrigin: '',
    image: '',
    imageFile: null,
  });

  const { success, error: showError } = useToast();

  useEffect(() => {
    if (!showItemModal) {
      setItemFormData({
        name: '',
        description: '',
        subCategory: '',
        stocks: '',
        unit: 'kg',
        farmOrigin: '',
        image: '',
        imageFile: null,
      });
      setItemMode('add');
      setEditingItem(null);
    }
  }, [showItemModal]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return farmItems;
    return farmItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.id.includes(q) ||
        item.subCategory?.toLowerCase().includes(q)
    );
  }, [farmItems, search]);

  async function handleAddItem() {
    if (!itemFormData.name.trim())
      return showError('Please enter an item name', { title: 'Validation' });
    if (!itemFormData.subCategory.trim())
      return showError('Please select a category', { title: 'Validation' });
    if (!itemFormData.unit.trim())
      return showError('Please select a unit', { title: 'Validation' });
    if (!itemFormData.stocks.trim() || Number(itemFormData.stocks) < 0)
      return showError('Please enter valid stock quantity', {
        title: 'Validation',
      });
    if (!itemFormData.imageFile && itemMode === 'add')
      return showError('Please upload an image', { title: 'Validation' });

    try {
      if (itemMode === 'edit' && editingItem) {
        // For edit mode, only use FormData if there's a new image
        if (itemFormData.imageFile && itemFormData.imageFile instanceof File) {
          // Use FormData when uploading a new image
          const formData = new FormData();
          formData.append('name', itemFormData.name.trim());
          formData.append('description', itemFormData.description.trim());
          formData.append('subCategory', itemFormData.subCategory.trim());
          formData.append('stocks', itemFormData.stocks);
          formData.append('unit', itemFormData.unit);
          if (itemFormData.farmOrigin) {
            formData.append('farmOrigin', itemFormData.farmOrigin.trim());
          }
          formData.append('image', itemFormData.imageFile);

          const response = await authFetch(
            `/farm-inventory/${editingItem.id}`,
            {
              method: 'PUT',
              body: formData,
            }
          );
          await refetchFarmItems();
          success(response.message || 'Farm item updated', {
            title: 'Success',
          });
        } else {
          // Use JSON when no new image
          const updateData: any = {
            name: itemFormData.name.trim(),
            description: itemFormData.description.trim(),
            subCategory: itemFormData.subCategory.trim(),
            stocks: Number(itemFormData.stocks),
            unit: itemFormData.unit,
          };
          if (itemFormData.farmOrigin) {
            updateData.farmOrigin = itemFormData.farmOrigin.trim();
          }

          const response = await authFetch(
            `/farm-inventory/${editingItem.id}`,
            {
              method: 'PUT',
              body: JSON.stringify(updateData),
            }
          );
          await refetchFarmItems();
          success(response.message || 'Farm item updated', {
            title: 'Success',
          });
        }
      } else {
        // For create mode, always use FormData
        const formData = new FormData();
        formData.append('name', itemFormData.name.trim());
        formData.append('description', itemFormData.description.trim());
        formData.append('subCategory', itemFormData.subCategory.trim());
        formData.append('stocks', itemFormData.stocks);
        formData.append('unit', itemFormData.unit);
        if (itemFormData.farmOrigin) {
          formData.append('farmOrigin', itemFormData.farmOrigin.trim());
        }
        if (itemFormData.imageFile) {
          formData.append('image', itemFormData.imageFile);
        }

        const response = await authFetch('/farm-inventory', {
          method: 'POST',
          body: formData,
        });
        await refetchFarmItems();
        success(response.message || 'Farm item created', { title: 'Success' });
      }
    } catch (error) {
      // Error is already handled by useAuthFetch
    }

    setShowItemModal(false);
  }

  function handleEditItem(item: FarmItem) {
    setItemMode('edit');
    setEditingItem(item);

    setItemFormData({
      name: item.name,
      description: item.description || '',
      subCategory: item.subCategory || '',
      stocks: item.stocks?.toString() || '',
      unit: item.unit || 'kg',
      farmOrigin: item.farmOrigin || '',
      image: item.image || '',
      imageFile: item.image || '',
    });

    setShowItemModal(true);
  }

  function handleDeleteClick(item: any) {
    setDeleteModal({ open: true, item });
  }

  async function confirmDelete() {
    if (!deleteModal.item) return;

    await authFetch(`/farm-inventory/${deleteModal.item.id}`, {
      method: 'DELETE',
    });
    await refetchFarmItems();
    success('Farm item deleted successfully!', { title: 'Deleted' });

    setDeleteModal({ open: false, item: null });
  }

  const lowStockCount = farmItems.filter(
    (item) => (item.stocks || 0) < 10
  ).length;
  const outOfStockCount = farmItems.filter(
    (item) => (item.stocks || 0) === 0
  ).length;

  // Get counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Vegetables: 0,
      'Herbal Plants': 0,
      Fruits: 0,
      Seedlings: 0,
      Trees: 0,
    };
    farmItems.forEach((item) => {
      if (item.subCategory && counts.hasOwnProperty(item.subCategory)) {
        counts[item.subCategory]++;
      }
    });
    return counts;
  }, [farmItems]);

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30 p-3 sm:p-4 lg:p-6 xl:p-8">
      <div className="max-w-[1600px] mx-auto space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 lg:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 lg:p-5 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl sm:rounded-3xl shadow-xl shadow-green-600/30">
              <Sprout className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 tracking-tight">
                Farm Inventory Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                Manage agricultural products for farm operations
              </p>
            </div>
          </div>
        </div>
        <div className="relative group flex-1 lg:max-w-md xl:max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-green-500 transition-colors duration-200" />
          </div>
          <Input
            placeholder="Search farm inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 h-auto text-sm sm:text-base border-2 border-gray-200 focus:border-green-500 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
          />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600" />
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1">
                  <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl sm:rounded-2xl shadow-inner flex-shrink-0">
                    <Sprout className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-green-700" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Total Items
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                      {farmItems.length}
                    </p>
                  </div>
                </div>
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-600" />
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1">
                  <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-yellow-100 to-orange-50 rounded-xl sm:rounded-2xl shadow-inner flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-orange-700" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Low Stock
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                      {lowStockCount}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-600" />
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1">
                  <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-red-100 to-pink-50 rounded-xl sm:rounded-2xl shadow-inner flex-shrink-0">
                    <X className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-red-700" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Out of Stock
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                      {outOfStockCount}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer col-span-2 lg:col-span-2">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    By Category
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-green-600" />
                      <span className="font-medium">
                        {categoryCounts.Vegetables}
                      </span>
                      <span className="text-gray-500">Vegetables</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sprout className="w-3 h-3 text-green-600" />
                      <span className="font-medium">
                        {categoryCounts['Herbal Plants']}
                      </span>
                      <span className="text-gray-500">Herbs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Apple className="w-3 h-3 text-red-600" />
                      <span className="font-medium">
                        {categoryCounts.Fruits}
                      </span>
                      <span className="text-gray-500">Fruits</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sprout className="w-3 h-3 text-emerald-600" />
                      <span className="font-medium">
                        {categoryCounts.Seedlings}
                      </span>
                      <span className="text-gray-500">Seedlings</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trees className="w-3 h-3 text-green-700" />
                      <span className="font-medium">
                        {categoryCounts.Trees}
                      </span>
                      <span className="text-gray-500">Trees</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Farm Items List */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
              <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full" />
              Farm Items
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 ml-3 sm:ml-4">
              Showing {filteredItems.length} of {farmItems.length} items
            </p>
          </div>
          <Button
            onClick={() => {
              setItemMode('add');
              setShowItemModal(true);
            }}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white inline-flex items-center justify-center gap-2 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40 transition-all duration-200 font-bold hover:scale-[1.02] active:scale-[0.98] text-sm lg:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add Farm Item
          </Button>
        </div>

        <Card className="border-none shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {filteredItems.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Sprout className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    No farm items found
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search or add a new farm item
                  </p>
                </div>
              ) : (
                filteredItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 lg:p-6 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-transparent transition-all duration-200 group gap-3 sm:gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 lg:gap-5 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover rounded-xl sm:rounded-2xl shadow-md group-hover:shadow-xl transition-shadow duration-200 ring-2 ring-green-100 group-hover:ring-green-200"
                        />
                        {(item.stocks || 0) === 0 && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1 truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 line-clamp-2">
                          {item.description || 'No description'}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold bg-green-100 text-green-700">
                            <Sprout className="w-3 h-3" />
                            {item.subCategory || 'No category'}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold ${
                              (item.stocks || 0) === 0
                                ? 'bg-red-100 text-red-700'
                                : (item.stocks || 0) < 10
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            Stock: {item.stocks || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex sm:flex-col lg:flex-row items-center gap-2 sm:gap-2.5 lg:gap-3 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditItem(item)}
                        className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200"
                      >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(item)}
                        className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:shadow-lg transition-all duration-200"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <FarmItemModal
        open={showItemModal}
        onClose={() => setShowItemModal(false)}
        mode={itemMode}
        formData={itemFormData}
        setFormData={setItemFormData}
        onSubmit={handleAddItem}
      />

      <DeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        onConfirm={confirmDelete}
        itemName={deleteModal.item?.name || ''}
      />
    </div>
  );
};

export default FarmInventory;
