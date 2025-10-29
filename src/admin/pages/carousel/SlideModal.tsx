import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/hooks/useToast';
import {
  Image as ImageIcon,
  Plus,
  SquarePen,
  X,
  ImagePlus,
  Eye,
} from 'lucide-react';
import type { Slide } from './types';

interface SlideModalProps {
  slide: Slide | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (slide: Slide, imageFile: File | null) => void;
}

const readFileAsDataURL = (file: File): Promise<string> =>
  new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

const SlideModal: React.FC<SlideModalProps> = ({
  slide,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Slide>({
    _id: slide?._id || '',
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    image: slide?.image || undefined,
    link: slide?.link || '',
    order: slide?.order || 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [fileUploading, setFileUploading] = useState(false);
  const { error: showError } = useToast();

  useEffect(() => {
    if (slide) {
      setFormData({
        _id: slide._id || '',
        title: slide.title || '',
        subtitle: slide.subtitle || '',
        image: slide.image || undefined,
        link: slide.link || '',
        order: slide.order || 0,
      });
      setImagePreview(slide.image?.url || '');
      setImageFile(null);
    } else {
      setFormData({
        _id: '',
        title: '',
        subtitle: '',
        image: undefined,
        link: '',
        order: 0,
      });
      setImagePreview('');
      setImageFile(null);
    }
  }, [slide, isOpen]);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setFileUploading(true);
    try {
      const dataUrl = await readFileAsDataURL(file);
      setImageFile(file);
      setImagePreview(dataUrl);
    } catch (e) {
      showError('Failed to read file.', { title: 'File Error' });
    } finally {
      setFileUploading(false);
    }
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      showError('Title is required.', { title: 'Validation' });
      return;
    }

    const isCreating = !slide?._id;
    if (isCreating && !imageFile) {
      showError('Image is required for new slides.', { title: 'Validation' });
      return;
    }

    onSave(formData, imageFile);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-[95vw] sm:max-w-3xl w-full max-h-[95vh] overflow-hidden animate-slideUp">
        <div className="relative p-3 sm:p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
          <div className="relative flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <div className="w-9 h-9 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-2xl flex items-center justify-center ring-2 ring-white/30 flex-shrink-0">
                {slide?._id ? (
                  <SquarePen className="w-4.5 h-4.5 sm:w-7 sm:h-7 text-white" />
                ) : (
                  <Plus className="w-4.5 h-4.5 sm:w-7 sm:h-7 text-white" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-2xl md:text-3xl font-bold text-white mb-0.5 sm:mb-1 truncate">
                  {slide?._id
                    ? 'Edit Carousel Slide'
                    : 'Add New Carousel Slide'}
                </h3>
                <p className="text-green-100 text-xs sm:text-sm font-medium truncate">
                  {slide?._id
                    ? 'Update slide details'
                    : 'Create a new carousel slide'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 ring-1 ring-white/30 flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="px-2.5 sm:px-6 md:px-8 py-2.5 sm:py-5 md:py-6 max-h-[calc(95vh-160px)] sm:max-h-[calc(90vh-200px)] overflow-y-auto space-y-2.5 sm:space-y-5 md:space-y-6">
          <div className="space-y-2 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3 pb-1.5 sm:pb-3 border-b-2 border-green-100">
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                <SquarePen className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
              </div>
              <h4 className="text-sm sm:text-xl font-bold text-gray-900">
                Slide Details
              </h4>
            </div>

            <label className="block">
              <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <SquarePen className="w-4 h-4 text-green-600" />
                Title <span className="text-red-500">*</span>
              </div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium text-sm sm:text-base"
                placeholder="Enter slide title..."
              />
            </label>

            <label className="block">
              <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <SquarePen className="w-4 h-4 text-green-600" />
                Subtitle
              </div>
              <input
                type="text"
                value={formData.subtitle || ''}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium text-sm sm:text-base"
                placeholder="Enter subtitle (optional)..."
              />
            </label>

            <label className="block">
              <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <SquarePen className="w-4 h-4 text-green-600" />
                Link (optional)
              </div>
              <input
                type="url"
                value={formData.link || ''}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium text-sm sm:text-base"
                placeholder="https://example.com"
              />
            </label>

            <label className="block">
              <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <SquarePen className="w-4 h-4 text-green-600" />
                Order
              </div>
              <input
                type="number"
                value={formData.order || 0}
                onChange={(e) =>
                  setFormData({ ...formData, order: Number(e.target.value) })
                }
                className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium text-sm sm:text-base"
                placeholder="0"
              />
            </label>
          </div>

          <div className="space-y-2 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3 pb-1.5 sm:pb-3 border-b-2 border-green-100">
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                <ImageIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
              </div>
              <h4 className="text-sm sm:text-xl font-bold text-gray-900">
                Image {!slide?._id && <span className="text-red-500">*</span>}
              </h4>
            </div>

            <label className="block">
              <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <ImagePlus className="w-4 h-4 text-green-600" />
                Upload Image
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files?.[0] || null)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 file:font-bold hover:file:bg-green-100 file:cursor-pointer transition-all"
              />
              {fileUploading && (
                <div className="text-xs sm:text-sm text-green-600 mt-2 font-medium flex items-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              )}
            </label>

            <div className="pt-2">
              <div className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-green-600" />
                Image Preview
              </div>
              <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex items-center justify-center border-2 border-gray-200 shadow-inner">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 mb-2 mx-auto text-gray-400" />
                    <div className="text-gray-400 font-medium">
                      No image selected
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-green-800 font-medium">
                <span className="font-bold">Note:</span> Fields marked with{' '}
                <span className="text-red-500 font-bold">*</span> are required.
                Please ensure all information is accurate before submitting.
              </p>
            </div>
          </div>
        </div>

        <div className="px-2.5 sm:px-6 md:px-8 py-2.5 sm:py-5 bg-gradient-to-r from-gray-50 to-white border-t-2 border-gray-100 flex gap-2 sm:gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3.5 sm:px-8 py-1.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
          >
            {slide?._id ? (
              <>
                <SquarePen className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                <span>Create Slide</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SlideModal;
