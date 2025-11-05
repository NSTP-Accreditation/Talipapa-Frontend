import React, { useEffect, useState } from 'react';
import {
  Plus,
  Image as ImageIcon,
  LayoutGrid,
  ArrowUpDown,
} from 'lucide-react';
import useFetchData from '../../hooks/useFetchData';
import { useAuthFetch } from '../../hooks/useAuthFetch';
import { useToast } from '@/hooks/useToast';
import { useLoadingState } from '../../../hooks/useLoadingState';
import { ResponsiveSkeleton } from '../../../components/ResponsiveSkeleton';
import SlideModal from './SlideModal';
import SlideCard from './SlideCard';
import type { Slide } from './types';
import { useBrgyInfo } from '@/contexts/BrgyInfoContext';
import { useRBAC } from '../../../hooks/useRBAC';
import { Permission } from '../../../types/rbac.types';
import { Can, ReadOnly } from '../../../components/rbac/Can';

const CarouselEditor: React.FC = () => {
  const {
    pageContent,
    loading: infoLoading,
    error: infoError,
    refetch,
  } = useBrgyInfo();

  const authFetch = useAuthFetch();
  const { success, error } = useToast();
  const { isLoading } = useLoadingState(300);
  const { hasPermission } = useRBAC();
  const canEditContent = hasPermission(Permission.EDIT_CONTENT);

  const [slides, setSlides] = useState<Slide[]>([]);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (pageContent && pageContent.carousel) {
      setSlides(pageContent.carousel);
    }
  }, [pageContent]);

  const handleSaveSlide = async (slide: Slide, imageFile: File | null) => {
    try {
      const formData = new FormData();
      formData.append('title', slide.title);
      if (slide.subTitle) formData.append('subTitle', slide.subTitle);
      formData.append('order', String(slide.order || 0));
      if (imageFile) formData.append('image', imageFile);

      const isCreating = !slide._id;
      let url = `/pagecontent/${pageContent._id}/carousel`;
      let method = 'POST';

      if (!isCreating) {
        url = `/pagecontent/${pageContent._id}/carousel/${slide._id}`;
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
      // show saving indicator while refetching shared page content
      try {
        setIsSaving(true);
        await refetch();
      } finally {
        setIsSaving(false);
      }
      setEditingSlide(null);
      setIsAddModalOpen(false);
    } catch (e) {
      error((e as Error).message || 'Failed to save slide', { title: 'Error' });
    }
  };

  const deleteSlide = async (id?: string) => {
    if (!id) return;
    try {
      await authFetch(`/pagecontent/${pageContent._id}/carousel/${id}`, {
        method: 'DELETE',
      });
      success('Slide deleted successfully!', { title: 'Deleted' });
      try {
        setIsSaving(true);
        await refetch();
      } finally {
        setIsSaving(false);
      }
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

    newSlides.forEach((s, idx) => {
      s.order = idx;
    });

    setSlides(newSlides);

    try {
      setIsSaving(true);

      // Send a single batch request to reorder all slides
      await authFetch(`/pagecontent/${pageContent._id}/carousel/reorder`, {
        method: 'PATCH',
        body: JSON.stringify({
          slideOrders: newSlides.map((s) => ({
            slideId: s._id,
            order: s.order,
          })),
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      success('Slide order updated!', { title: 'Success' });
      // refresh shared content
      await refetch();
    } catch (e) {
      error('Failed to update slide order', { title: 'Error' });
      // Revert to server state on error
      try {
        await refetch();
      } catch {}
    } finally {
      setIsSaving(false);
    }
  };

  if (infoLoading || isLoading) {
    return <ResponsiveSkeleton page="carousel" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-3 sm:p-5 lg:p-8">
      <div className="space-y-6 sm:space-y-8">
        <ReadOnly message="You have view-only access to Carousel. Contact a SuperAdmin to add, edit, or delete slides." />
        {/* Page Header */}
        <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-600 rounded-full -ml-24 -mb-24"></div>
          </div>

          <div className="relative p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 shadow-lg ring-4 ring-green-100 animate-pulse-slow">
                  <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    Carousel Editor
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 font-medium mb-4">
                    Manage carousel slides shown on the Home page
                  </p>

                  {/* Quick Info Pills */}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs sm:text-sm font-semibold text-green-700">
                      <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>
                        {slides.length}{' '}
                        {slides.length === 1 ? 'Slide' : 'Slides'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs sm:text-sm font-semibold text-blue-700">
                      <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Image Upload</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-xs sm:text-sm font-semibold text-purple-700">
                      <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Slide Reorder</span>
                    </div>
                    {isSaving && (
                      <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full text-xs sm:text-sm font-semibold text-yellow-700">
                        <span className="w-3 h-3 rounded-full border-2 border-yellow-700 border-t-transparent animate-spin inline-block" />
                        <span>Saving...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Can permission={Permission.EDIT_CONTENT}>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Add New Slide
                </button>
              </Can>
            </div>
          </div>
        </div>

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
              <Can permission={Permission.EDIT_CONTENT}>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                >
                  <Plus size={20} /> Create First Slide
                </button>
              </Can>
            </div>
          ) : (
            slides.map((slide, idx) => (
              <SlideCard
                key={slide._id || idx}
                slide={slide}
                idx={idx}
                slidesLength={slides.length}
                onMove={moveSlide}
                onEdit={(s) => setEditingSlide(s)}
                onDelete={deleteSlide}
                canEditContent={canEditContent}
              />
            ))
          )}
        </div>

        <SlideModal
          slide={editingSlide}
          isOpen={!!editingSlide || isAddModalOpen}
          onClose={() => {
            setEditingSlide(null);
            setIsAddModalOpen(false);
          }}
          onSave={handleSaveSlide}
          nextOrder={slides.length}
        />
      </div>
    </div>
  );
};

export default CarouselEditor;
