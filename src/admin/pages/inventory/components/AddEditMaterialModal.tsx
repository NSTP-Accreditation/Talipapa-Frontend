import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import ImageWithFallback from '@/components/ImageWithFallback';
import { Button, Input } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { MaterialInterface } from '@/types/global.types';
import { Box, PenSquare, Plus, X } from 'lucide-react';
import React, {
  Dispatch,
  memo,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

type AddEditMaterialModalProps = {
  showMaterialModal: boolean;
  setShowMaterialModal: Dispatch<SetStateAction<boolean>>;
  mode: 'Add' | 'Edit';
  materialtoEdit: MaterialInterface | null;
  refetchMaterial: () => Promise<MaterialInterface[]>;
};

const AddEditMaterialModal = memo(
  ({
    showMaterialModal,
    setShowMaterialModal,
    mode,
    materialtoEdit,
    refetchMaterial,
  }: AddEditMaterialModalProps) => {
    const { success, error: showError } = useToast();
    const authFetch = useAuthFetch();
    const [materialFormData, setMaterialFormData] = useState({
      _id: '',
      name: '',
      description: '',
      pointsPerKg: 0,
      image: null,
      imageFile: null,
    });

    useEffect(() => {
      if (mode === 'Edit' && materialtoEdit) {
        setMaterialFormData({
          _id: materialtoEdit._id,
          name: materialtoEdit.name,
          description: materialtoEdit.description,
          pointsPerKg: materialtoEdit.pointsPerKg,
          image: materialtoEdit.image,
          imageFile: null,
        });
      } else {
        setMaterialFormData({
          _id: '',
          name: '',
          description: '',
          pointsPerKg: 0,
          image: null,
          imageFile: null,
        });
      }
    }, [mode, materialtoEdit, showMaterialModal]);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setMaterialFormData((prev: any) => ({
        ...prev,
        image: {
          url: url,
        },
        imageFile: file,
      }));
    };

    const handlePointsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const allowedKeys = [
        'Backspace',
        'ArrowLeft',
        'ArrowRight',
        'Delete',
        'Tab',
        'Home',
        'End',
      ];
      if (allowedKeys.includes(e.key)) return;
      if (e.ctrlKey || e.metaKey) return; // allow copy/paste/select all

      // allow digits and single dot
      if (!/^[0-9.]$/.test(e.key)) {
        e.preventDefault();
        showError('Only numbers and decimal point are allowed', {
          title: 'Validation',
        });
        return;
      }

      // prevent entering multiple dots
      const current = String(materialFormData.pointsPerKg ?? '');
      if (e.key === '.' && current.includes('.')) {
        e.preventDefault();
      }
    };

    const handlePointsPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      const paste = e.clipboardData.getData('text');
      if (!/^[0-9]*\.?[0-9]*$/.test(paste)) {
        e.preventDefault();
        showError('Pasted value must be a valid number', {
          title: 'Validation',
        });
      }
    };

    const validateMaterialForm = (): boolean => {
      if (!materialFormData.name.trim()) {
        showError('Please enter a material name', { title: 'Validation' });
        return false;
      }
      if (!materialFormData.description.trim()) {
        showError('Please enter a material description', {
          title: 'Validation',
        });
        return false;
      }
      // ensure pointsPerKg is provided and a valid non-negative number
      const pointsVal = Number(materialFormData.pointsPerKg);
      if (
        String(materialFormData.pointsPerKg).trim() === '' ||
        isNaN(pointsVal) ||
        pointsVal < 0
      ) {
        showError('Please enter valid required points', {
          title: 'Validation',
        });
        return false;
      }
      return true;
    };

    const buildProductFormData = (): FormData => {
      const formData = new FormData();
      formData.append('name', materialFormData.name.trim());
      formData.append('description', materialFormData.description.trim());
      formData.append('pointsPerKg', materialFormData.pointsPerKg.toString());

      if (
        materialFormData.imageFile &&
        materialFormData.imageFile instanceof File
      ) {
        formData.append('image', materialFormData.imageFile);
      }

      return formData;
    };

    const handleAddProduct = async (): Promise<void> => {
      if (!validateMaterialForm()) {
        return;
      }

      const formData = buildProductFormData();

      try {
        const response = await authFetch('/materials', {
          method: 'POST',
          body: formData,
        });
        await refetchMaterial();
        success(response?.message || 'Material created', { title: 'Success' });
      } catch (error: any) {
        showError(error?.message || 'Failed to create Material', { title: 'Error' });
      }
    };

    const handleUpdateProduct = async (): Promise<void> => {
      if (!validateMaterialForm()) {
        return;
      }

      const formData = buildProductFormData();
      try {
        const response = await authFetch(`/materials/${materialtoEdit._id}`, {
          method: 'PATCH',
          body: formData,
        });

        await refetchMaterial();
        success(response.message || 'Material updated', { title: 'Success' });
      } catch (error: any) {
        showError(error?.message || 'Failed to update material', { title: 'Error' });
      }
    };

    return (
      showMaterialModal &&
      createPortal(
        <div className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"
            onClick={() => setShowMaterialModal(false)}
          />
          <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl w-full mx-3 sm:mx-4 z-[10] animate-in zoom-in-95 duration-300 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
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
                      {mode === 'Edit' ? 'Edit Material' : 'Add New Material'}
                    </h3>
                    <p className="text-xs sm:text-sm text-green-50/90 mt-0.5 sm:mt-1">
                      {mode === 'Edit'
                        ? 'Update material details'
                        : 'Fill in the material information'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMaterialModal(false)}
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
                      value={materialFormData.name}
                      onChange={(e) =>
                        setMaterialFormData((prev: any) => ({
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
                      value={materialFormData.description}
                      onChange={(e) =>
                        setMaterialFormData((prev: any) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Brief description of the material..."
                      className="w-full min-h-[100px] sm:min-h-[140px] p-3 sm:p-4 resize-none bg-gray-50 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl text-sm sm:text-base outline-none transition-all"
                      maxLength={250}
                    />
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                      {materialFormData.description.length}/250 characters
                    </p>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                      Points per Kilogram{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      value={materialFormData.pointsPerKg}
                      onChange={(e) => {
                        const val = e.target.value;
                        // allow empty input while typing
                        if (val === '') {
                          setMaterialFormData((prev: any) => ({
                            ...prev,
                            pointsPerKg: '',
                          }));
                          return;
                        }

                        const numeric = Number(val);
                        if (!isNaN(numeric)) {
                          setMaterialFormData((prev: any) => ({
                            ...prev,
                            pointsPerKg: numeric,
                          }));
                        } else {
                          // don't accept invalid values — notify user
                          showError('Only numeric values allowed for points', {
                            title: 'Validation',
                          });
                        }
                      }}
                      onKeyDown={handlePointsKeyDown}
                      onPaste={handlePointsPaste}
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
                    {materialFormData.image ? (
                      <>
                        <ImageWithFallback
                          src={materialFormData.image.url}
                          alt={materialFormData.name || 'preview'}
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
                  onClick={() => setShowMaterialModal(false)}
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-xl text-sm"
                >
                  Cancel
                </Button>
                {mode === 'Edit' ? (
                  <Button
                    onClick={handleUpdateProduct}
                    className="flex-1 sm:flex-none px-5 sm:px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl shadow-lg text-sm"
                  >
                    <PenSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 inline" />{' '}
                    Update Material
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddProduct}
                    className="flex-1 sm:flex-none px-5 sm:px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl shadow-lg text-sm"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 inline" />{' '}
                    Add Material
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
    );
  }
);

export default AddEditMaterialModal;
