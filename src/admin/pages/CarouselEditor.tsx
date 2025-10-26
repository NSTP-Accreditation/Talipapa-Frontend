import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../components/ui/card';
import useFetchData from '../hooks/useFetchData';
import { useAuthFetch } from '../hooks/useAuthFetch';
import { useToast } from '@/hooks/useToast';
import { useLoadingState } from '../../hooks/useLoadingState';
import { ResponsiveSkeleton } from '../../components/ResponsiveSkeleton';
import {
  Plus,
  SquarePen,
  Trash2,
  X,
  Image as ImageIcon,
  Eye,
  ArrowUp,
  ArrowDown,
  ImagePlus,
} from 'lucide-react';

interface Slide {
  _id?: string;
  title: string;
  subtitle?: string;
  image?: {
    url: string;
    publicId?: string;
  };
  link?: string;
  order?: number;
}

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

  return (
    <div
      className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-[95vw] sm:max-w-3xl w-full max-h-[95vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="relative p-3 sm:p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/10 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
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

        {/* Form Content */}
        <div className="px-2.5 sm:px-6 md:px-8 py-2.5 sm:py-5 md:py-6 max-h-[calc(95vh-160px)] sm:max-h-[calc(90vh-200px)] overflow-y-auto space-y-2.5 sm:space-y-5 md:space-y-6">
          {/* Slide Details Section */}
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

          {/* Image Upload Section */}
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

            {/* Preview */}
            <div className="pt-2">
              <div className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-green-600" />
                Image Preview
              </div>
              <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex items-center justify-center border-2 border-gray-200 shadow-inner">
                {imagePreview ? (
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

          {/* Info Note */}
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

        {/* Footer */}
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
    </div>
  );
};

const CarouselEditor: React.FC = () => {
  const { data: slidesData, loading, refetch } = useFetchData('/carousel');
  const authFetch = useAuthFetch();
  const { success, error } = useToast();
  const { isLoading } = useLoadingState(300);

  const [slides, setSlides] = useState<Slide[]>([]);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (slidesData && slidesData.items) {
      setSlides(slidesData.items);
    }
  }, [slidesData]);

  const handleSaveSlide = async (slide: Slide, imageFile: File | null) => {
    try {
      const formData = new FormData();
      formData.append('title', slide.title);
      if (slide.subtitle) formData.append('subtitle', slide.subtitle);
      if (slide.link) formData.append('link', slide.link);
      formData.append('order', String(slide.order || 0));
      if (imageFile) formData.append('image', imageFile);

      const isCreating = !slide._id;
      let url = '/carousel';
      let method = 'POST';

      if (!isCreating) {
        url = `/carousel/${slide._id}`;
        method = 'PATCH';
      }

      await authFetch(url, {
        method,
        body: formData,
      });

      success(
        isCreating
          ? 'Slide added successfully!'
          : 'Slide updated successfully!',
        { title: 'Success' }
      );
      refetch();
      setEditingSlide(null);
      setIsAddModalOpen(false);
    } catch (e) {
      error((e as Error).message || 'Failed to save slide', {
        title: 'Error',
      });
    }
  };

  const deleteSlide = async (id?: string) => {
    if (!id) return;
    if (!confirm('Delete this slide?')) return;
    try {
      await authFetch(`/carousel/${id}`, { method: 'DELETE' });
      success('Slide deleted successfully!', { title: 'Deleted' });
      refetch();
    } catch (e) {
      error((e as Error).message || 'Failed to delete slide', {
        title: 'Error',
      });
    }
  };

  const moveSlide = async (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides];
    const swapIdx = direction === 'up' ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= newSlides.length) return;

    const temp = newSlides[swapIdx];
    newSlides[swapIdx] = newSlides[index];
    newSlides[index] = temp;

    // Update order values
    newSlides.forEach((s, idx) => {
      s.order = idx;
    });

    setSlides(newSlides);

    // Save new order to backend
    try {
      await Promise.all(
        newSlides.map((s) =>
          authFetch(`/carousel/${s._id}`, {
            method: 'PATCH',
            body: JSON.stringify({ order: s.order }),
          })
        )
      );
      success('Slide order updated!', { title: 'Success' });
    } catch (e) {
      error('Failed to update slide order', { title: 'Error' });
      refetch(); // Revert on error
    }
  };

  if (loading || isLoading) {
    return <ResponsiveSkeleton page="carousel" />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <ImageIcon className="w-10 h-10 text-green-600" />
            Carousel Editor
          </h1>
          <p className="text-md text-gray-700 mt-3 font-medium">
            Manage carousel slides shown on the Home page
            <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {slides.length} {slides.length === 1 ? 'Slide' : 'Slides'}
            </span>
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Slide
        </button>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {slides.length === 0 ? (
          <div className="col-span-full text-center py-24">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-100 to-green-100 rounded-3xl shadow-xl mb-6">
              <ImageIcon className="w-20 h-20 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No slides yet
            </h3>
            <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
              Start building your carousel by adding your first slide
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              <Plus size={20} /> Create First Slide
            </button>
          </div>
        ) : (
          slides.map((slide, idx) => (
            <div
              key={slide._id || idx}
              className="group bg-white rounded-xl overflow-hidden border-2 border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {slide.image?.url ? (
                  <img
                    src={slide.image.url}
                    alt={slide.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-20 h-20 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-500 text-white mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <ImageIcon className="w-5 h-5" />
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-green-600 transition-colors leading-tight">
                  {slide.title}
                </h3>

                {slide.subtitle && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                    {slide.subtitle}
                  </p>
                )}

                {slide.link && (
                  <a
                    href={slide.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-green-600 text-sm font-semibold hover:text-green-700 hover:gap-3 transition-all mb-3"
                  >
                    <span>View Link</span>
                    <span>→</span>
                  </a>
                )}

                <div className="text-xs text-gray-500 mb-3">
                  Order: {slide.order ?? idx}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-gray-100">
                  <button
                    onClick={() => moveSlide(idx, 'up')}
                    disabled={idx === 0}
                    className="flex items-center justify-center gap-1 px-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                    title="Move Up"
                  >
                    <ArrowUp size={14} /> Up
                  </button>
                  <button
                    onClick={() => moveSlide(idx, 'down')}
                    disabled={idx === slides.length - 1}
                    className="flex items-center justify-center gap-1 px-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                    title="Move Down"
                  >
                    <ArrowDown size={14} /> Down
                  </button>
                  <button
                    onClick={() => setEditingSlide(slide)}
                    className="flex items-center justify-center gap-1 px-2 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-semibold"
                    title="Edit"
                  >
                    <SquarePen size={14} /> Edit
                  </button>
                  <button
                    onClick={() => deleteSlide(slide._id)}
                    className="flex items-center justify-center gap-1 px-2 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-semibold"
                    title="Delete"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <SlideModal
        slide={editingSlide}
        isOpen={!!editingSlide || isAddModalOpen}
        onClose={() => {
          setEditingSlide(null);
          setIsAddModalOpen(false);
        }}
        onSave={handleSaveSlide}
      />
    </div>
  );
};

export default CarouselEditor;
