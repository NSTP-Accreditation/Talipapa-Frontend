import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Box,
  Search,
  X,
  TrendingUp,
  TrendingDown,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { PageLoadingSkeleton } from '@/components/LoadingSkeletons';
import useFetchData from '../hooks/useFetchData';
import { useAuthFetch } from '../hooks/useAuthFetch';

interface Product {
  id: string;
  name: string;
  image?: string;
  category?: string;
  subCategory?: string,
  description?: string;
  stocks?: number;
  requiredPoints?: number;
}

interface Material {
  id: string;
  name: string;
  image?: string;
  description?: string;
  pointsPerKg?: number;
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
        className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300`}
      >
        <Package className="w-1/2 h-1/2 text-gray-400" />
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
  type: 'product' | 'material';
}> = ({ open, onClose, onConfirm, itemName, type }) => {
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
                Delete {type === 'product' ? 'Product' : 'Material'}?
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

// Product Modal
const ProductModal: React.FC<{
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  formData: {
    name: string;
    description: string;
    category: string;
    subCategory: string;
    stocks: string;
    requiredPoints: string;
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

    // Only focus on first open
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
                <Package className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight">
                  {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-xs sm:text-sm text-green-50/90 mt-0.5 sm:mt-1">
                  {mode === 'edit'
                    ? 'Update product details'
                    : 'Fill in the product information'}
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
                  Product Name <span className="text-red-500">*</span>
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
                  placeholder="e.g., Eco-Friendly Water Bottle"
                  className="h-10 sm:h-11 text-sm sm:text-base border-2 border-gray-200 focus:border-green-500 rounded-xl px-3 sm:px-4"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                  Product Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of the product..."
                  className="w-full min-h-[80px] sm:min-h-[100px] p-3 sm:p-4 resize-none bg-gray-50 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl text-sm sm:text-base outline-none transition-all"
                  maxLength={250}
                />
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                  {formData.description.length}/250 characters
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                    <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        category: e.target.value,
                        subcategory: '',
                      }))
                    }
                    className="w-full h-10 sm:h-11 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl px-3 sm:px-4 bg-white text-sm sm:text-base"
                  >
                    <option value="">Select</option>
                    <option value="Agricultural">Agricultural</option>
                    <option value="Non Agricultural">Non Agricultural</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                    Subcategory <span className="text-red-500">*</span>
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
                    disabled={!formData.category}
                  >
                    <option value="">Select</option>
                    {formData.category === 'Agricultural' && (
                      <>
                        <option value="Crops">Recyclable</option>
                        <option value="Fertilizers">Fertilizers</option>
                        <option value="Seeds">Soil</option>
                        <option value="Livestock">Livestock</option>
                      </>
                    )}
                    {formData.category === 'Non Agricultural' && (
                      <>
                        <option value="Household">Household</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Construction">Construction</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                    Stocks <span className="text-red-500">*</span>
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
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                    Required Points <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.requiredPoints}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        requiredPoints: e.target.value,
                      }))
                    }
                    placeholder="0"
                    min="0"
                    className="h-10 sm:h-11 text-sm sm:text-base border-2 border-gray-200 focus:border-green-500 rounded-xl px-3 sm:px-4"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                  Product Image
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
              <div className="relative w-full h-[280px] sm:h-[350px] lg:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
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
                  <div className="text-center px-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-gray-200 flex items-center justify-center">
                      <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 font-semibold">
                      No image yet
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                      Upload to preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
            <span className="text-red-500">*</span> Required fields
          </p>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
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
                  Update Product
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 inline" />{' '}
                  Add Product
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Material Modal
const MaterialModal: React.FC<{
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  formData: {
    name: string;
    description: string;
    pointsPerKg: string;
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

    // Only focus on first open
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

  return (
    <div className="fixed inset-0 z-1003 flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl w-full mx-3 sm:mx-4 z-10 animate-in zoom-in-95 duration-300 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="relative p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 lg:p-4 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg ring-1 ring-white/30">
                <Box className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight">
                  {mode === 'edit' ? 'Edit Material' : 'Add New Material'}
                </h3>
                <p className="text-xs sm:text-sm text-green-50/90 mt-0.5 sm:mt-1">
                  {mode === 'edit'
                    ? 'Update material details'
                    : 'Fill in the material information'}
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
                  Material Name <span className="text-red-500">*</span>
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
                  placeholder="e.g., Recycled Aluminum"
                  className="h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus:border-green-500 rounded-xl px-3 sm:px-4"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                  Material Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of the material..."
                  className="w-full min-h-[100px] sm:min-h-[140px] p-3 sm:p-4 resize-none bg-gray-50 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl text-sm sm:text-base outline-none transition-all"
                  maxLength={250}
                />
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                  {formData.description.length}/250 characters
                </p>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                  Points per Kilogram <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.pointsPerKg}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      pointsPerKg: e.target.value,
                    }))
                  }
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus:border-green-500 rounded-xl px-3 sm:px-4"
                />
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                  <svg
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Points awarded per kilogram of this material
                </p>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                  Material Image
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
              <div className="relative w-full h-[280px] sm:h-[380px] lg:h-[420px] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
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
                  <div className="text-center px-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-gray-200 flex items-center justify-center">
                      <Box className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 font-semibold">
                      No image yet
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                      Upload to preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
            <span className="text-red-500">*</span> Required fields
          </p>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
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
                  Update Material
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 inline" />{' '}
                  Add Material
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Inventory: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { data: productsData, loading: productsDataLoading, error: productsDataErr, refetch: refetchProduct } = useFetchData("/products");
  const { data: materialssData, loading: materialsDataLoading, error: materialsDataErr, refetch: refetchMaterials } = useFetchData("/materials");
  
  const authFetch = useAuthFetch();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const products: Product[] = useMemo(() => {
    if(productsData && !productsDataLoading && !productsDataErr) {
      return  productsData?.map(product => {
        const { _id, image, ...rest } = product;
        return {
          ...rest,
          id: _id,
          image: image.url
        }
      })  
    }
    return [];
  }, [productsData, productsDataLoading, productsDataErr])

  const materials: Material[] = useMemo(() => {
    if(materialssData && !materialsDataLoading && !materialsDataErr) {
      return  materialssData?.map(material => {
        const { _id, image, ...rest } = material;
        return {
          ...rest,
          id: _id,
          image: image.url
        }
      })  
    }
    return [];
  }, [materialssData, materialsDataLoading, materialsDataErr])


  const [search, setSearch] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [productMode, setProductMode] = useState<'add' | 'edit'>('add');
  const [materialMode, setMaterialMode] = useState<'add' | 'edit'>('add');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    item: any;
    type: 'product' | 'material' | null;
  }>({
    open: false,
    item: null,
    type: null,
  });

  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    category: '',
    subCategory: '',
    stocks: '',
    requiredPoints: '',
    image: '',
    imageFile: null
  });

  const [materialFormData, setMaterialFormData] = useState({
    name: '',
    description: '',
    pointsPerKg: '',
    image: '',
    imageFile: null
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!showProductModal) {
      setProductFormData({
        name: '',
        description: '',
        category: '',
        subCategory: '',
        stocks: '',
        requiredPoints: '',
        image: '',
        imageFile: null
      });
      setProductMode('add');
      setEditingProduct(null);
    }
  }, [showProductModal]);

  useEffect(() => {
    if (!showMaterialModal) {
      setMaterialFormData({
        name: '',
        description: '',
        pointsPerKg: '',
        image: '',
        imageFile: null
      });
      setMaterialMode('add');
      setEditingMaterial(null);
    }
  }, [showMaterialModal]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [products, search]);

  const filteredMaterials = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return materials;
    return materials.filter(
      (m) => m.name.toLowerCase().includes(q) || m.id.includes(q)
    );
  }, [materials, search]);

  async function handleAddProduct() {
    if (!productFormData.name.trim())
      return alert('Please enter a product name');
    if (!productFormData.category.trim())
      return alert('Please select a category');
    if (!productFormData.subCategory.trim())
      return alert('Please select a subcategory');
    if (!productFormData.stocks.trim() || Number(productFormData.stocks) < 0)
      return alert('Please enter valid stocks');
    if (
      !productFormData.requiredPoints.trim() ||
      Number(productFormData.requiredPoints) < 0
    )
    return alert('Please enter valid required points');

    const newProduct: Product = {
      id:
        productMode === 'edit' && editingProduct
          ? editingProduct.id
          : Date.now().toString(16),
      name: productFormData.name.trim(),
      image: productFormData.imageFile,
      category: `${productFormData.category.trim()}`,
      subCategory: `${productFormData.category.trim()}`,
      description: productFormData.description.trim() || undefined,
      stocks: Number(productFormData.stocks),
      requiredPoints: Number(productFormData.requiredPoints),
    };

    const formData = new FormData();
    Object.entries(newProduct).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      if (productMode === 'edit' && editingProduct) {
        // setProducts((prev) =>
        //   prev.map((p) => (p.id === editingProduct.id ? newProduct : p))
        // );
        setSuccessMessage('Product updated successfully!');
      } else {
        const response = await authFetch("/products", {
          method: "POST",
          body: formData
        })
        
        await refetchProduct();
        setSuccessMessage(response?.message);
      }
    } catch (error) {
      console.log(error);
    }
    

    setShowProductModal(false);
  }

  async function handleAddMaterial() {
    if (!materialFormData.name.trim())
      return alert('Please enter a material name');
    if (
      !materialFormData.pointsPerKg.trim() ||
      Number(materialFormData.pointsPerKg) < 0
    )
      return alert('Please enter valid points per kilogram');

    const newMaterial: Material = {
      id:
        materialMode === 'edit' && editingMaterial
          ? editingMaterial.id
          : Date.now().toString(16),
      name: materialFormData.name.trim(),
      image: materialFormData.imageFile,
      description: materialFormData.description.trim() || undefined,
      pointsPerKg: Number(materialFormData.pointsPerKg),
    };

    const formData = new FormData();
    Object.entries(newMaterial).forEach(([key, value]) => {
      formData.append(key, value);
    });
    try {
      if (materialMode === 'edit' && editingMaterial) {
      
        setSuccessMessage('Material updated successfully!');
      } else {
        const response = await authFetch("/materials", {
          method: "POST",
          body: formData
        })
        
        await refetchMaterials();
        setSuccessMessage(response.message);
      }
    } catch (error) {
      console.log(error);
    }
    

    setShowMaterialModal(false);
  }

  function handleEditProduct(product: Product) {
    setProductMode('edit');
    setEditingProduct(product);
    
    const category = product.category;
    const subCategory = product.subCategory;
    
    setProductFormData({
      name: product.name,
      description: product.description || '',
      category: category,
      subCategory: subCategory,
      stocks: product.stocks?.toString() || '',
      requiredPoints: product.requiredPoints?.toString() || '',
      image: product.image || '',
      imageFile: product.image || '',
    });

    setShowProductModal(true);
  }

  function handleEditMaterial(material: Material) {
    setMaterialMode('edit');
    setEditingMaterial(material);

    setMaterialFormData({
      name: material.name,
      description: material.description || '',
      pointsPerKg: material.pointsPerKg?.toString() || '',
      image: material.image || '',
      imageFile: null
    });

    setShowMaterialModal(true);
  }

  function handleDeleteClick(item: any, type: 'product' | 'material') {
    setDeleteModal({ open: true, item, type });
  }

  async function confirmDelete() {
    if (!deleteModal.item || !deleteModal.type) return;

    if (deleteModal.type === 'product') {
      await authFetch(`/products/${deleteModal?.item.id}`, {
        method: "DELETE"
      })
      await refetchProduct();
      setSuccessMessage('Product deleted successfully!');
    } else {
      await authFetch(`/materials/${deleteModal?.item.id}`, {
        method: "DELETE"
      })
      await refetchMaterials();
      setSuccessMessage('Material deleted successfully!');
    }

    setDeleteModal({ open: false, item: null, type: null });
  }

  const lowStockCount = products.filter((p) => (p.stocks || 0) < 10).length;
  const outOfStockCount = products.filter((p) => (p.stocks || 0) === 0).length;

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-3 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 duration-300">
          <div className="bg-green-600 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">{successMessage}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
        <div className="flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 rounded-xl sm:rounded-2xl shadow-lg shadow-green-500/20 ring-1 ring-green-200/50">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-green-700" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                Inventory Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                Manage products and materials for trading operations
              </p>
            </div>
          </div>
        </div>
        <div className="relative group flex-1 lg:max-w-md xl:max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-green-500 transition-colors duration-200" />
          </div>
          <Input
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 sm:pl-12 pr-9 sm:pr-10 py-2.5 sm:py-3 w-full border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 text-sm sm:text-base bg-white"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-600" />
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gradient-to-br from-green-50 to-green-100 group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-green-700" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Products
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                    {products.length}
                  </p>
                </div>
              </div>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-green-600" />
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 group-hover:scale-110 transition-transform duration-300">
                  <Box className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-emerald-700" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Materials
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                    {materials.length}
                  </p>
                </div>
              </div>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-600" />
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-yellow-700" />
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
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-rose-600" />
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gradient-to-br from-red-50 to-red-100 group-hover:scale-110 transition-transform duration-300">
                  <Box className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-red-700" />
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
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 lg:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
              <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full" />
              Products
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 ml-3 sm:ml-4">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
          <Button
            onClick={() => {
              setProductMode('add');
              setShowProductModal(true);
            }}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white inline-flex items-center justify-center gap-2 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40 transition-all duration-200 font-bold hover:scale-[1.02] active:scale-[0.98] text-sm lg:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add Product
          </Button>
        </div>

        <Card className="border-none shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No products found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search or add a new product
                  </p>
                </div>
              ) : (
                filteredProducts.map((p, idx) => (
                  <div
                    key={p.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 lg:p-6 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-transparent transition-all duration-200 group gap-3 sm:gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 lg:gap-5 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md group-hover:shadow-lg transition-shadow duration-200 ring-2 ring-white">
                          <ImageWithFallback
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-600 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg group-hover:text-green-700 transition-colors duration-200 break-words">
                          {p.name}
                        </div>

                        {p.description && (
                          <div className="mt-2 bg-gray-50 border border-gray-100 rounded-lg p-2 sm:p-2.5 lg:p-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
                            {p.description}
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 sm:gap-2 mt-2 flex-wrap">
                          <div className="text-[10px] sm:text-xs text-gray-400 font-mono bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded break-all">
                            {p.id}
                          </div>
                          {p.category && (
                            <div className="text-[10px] sm:text-xs font-semibold text-green-700 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex items-center gap-1">
                              <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                              <span className="break-words">{p.category}</span>
                            </div>
                          )}
                          <div className="text-[10px] sm:text-xs font-semibold text-green-700 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                            Stock: {p.stocks}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0 self-end sm:self-center">
                      <div className="text-xs sm:text-sm font-bold text-green-700 bg-green-50 px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg whitespace-nowrap">
                        {p.requiredPoints} pts
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(p)}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200"
                      >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(p, 'product')}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:shadow-lg transition-all duration-200"
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

      <div className="space-y-4 lg:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
              <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-emerald-600 to-green-600 rounded-full" />
              Materials
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 ml-3 sm:ml-4">
              Showing {filteredMaterials.length} of {materials.length} materials
            </p>
          </div>
          <Button
            onClick={() => {
              setMaterialMode('add');
              setShowMaterialModal(true);
            }}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white inline-flex items-center justify-center gap-2 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 transition-all duration-200 font-bold hover:scale-[1.02] active:scale-[0.98] text-sm lg:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add Material
          </Button>
        </div>

        <Card className="border-none shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {filteredMaterials.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Box className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    No materials found
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search or add a new material
                  </p>
                </div>
              ) : (
                filteredMaterials.map((m, idx) => (
                  <div
                    key={m.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 lg:p-6 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-transparent transition-all duration-200 group gap-3 sm:gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 lg:gap-5 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md group-hover:shadow-lg transition-shadow duration-200 ring-2 ring-white">
                          <ImageWithFallback
                            src={m.image}
                            alt={m.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-600 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg group-hover:text-emerald-700 transition-colors duration-200 break-words">
                          {m.name}
                        </div>

                        {m.description && (
                          <div className="mt-2 bg-gray-50 border border-gray-100 rounded-lg p-2 sm:p-2.5 lg:p-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
                            {m.description}
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 sm:gap-2 mt-2 flex-wrap">
                          <div className="text-[10px] sm:text-xs text-gray-400 font-mono bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded break-all">
                            {m.id}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0 self-end sm:self-center">
                      <div className="text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg whitespace-nowrap">
                        {m.pointsPerKg} pts/kg
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditMaterial(m)}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all duration-200"
                      >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(m, 'material')}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:shadow-lg transition-all duration-200"
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

      <ProductModal
        open={showProductModal}
        onClose={() => setShowProductModal(false)}
        mode={productMode}
        formData={productFormData}
        setFormData={setProductFormData}
        onSubmit={handleAddProduct}
      />

      <MaterialModal
        open={showMaterialModal}
        onClose={() => setShowMaterialModal(false)}
        mode={materialMode}
        formData={materialFormData}
        setFormData={setMaterialFormData}
        onSubmit={handleAddMaterial}
      />

      <DeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null, type: null })}
        onConfirm={confirmDelete}
        itemName={deleteModal.item?.name || ''}
        type={deleteModal.type || 'product'}
      />
    </div>
  );
};

export default Inventory;
