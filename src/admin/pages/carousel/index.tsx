import React, { useEffect, useState } from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';
import useFetchData from '../../hooks/useFetchData';
import { useAuthFetch } from '../../hooks/useAuthFetch';
import { useToast } from '@/hooks/useToast';
import { useLoadingState } from '../../../hooks/useLoadingState';
import { ResponsiveSkeleton } from '../../../components/ResponsiveSkeleton';
import SlideModal from './SlideModal';
import SlideCard from './SlideCard';
import type { Slide } from './types';

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
      error((e as Error).message || 'Failed to save slide', { title: 'Error' });
    }
  };

  const deleteSlide = async (id?: string) => {
    if (!id) return;
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

    newSlides.forEach((s, idx) => {
      s.order = idx;
    });

    setSlides(newSlides);

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
      refetch();
    }
  };

  if (loading || isLoading) {
    return <ResponsiveSkeleton page="carousel" />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
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
            <SlideCard
              key={slide._id || idx}
              slide={slide}
              idx={idx}
              slidesLength={slides.length}
              onMove={moveSlide}
              onEdit={(s) => setEditingSlide(s)}
              onDelete={deleteSlide}
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
      />
    </div>
  );
};

export default CarouselEditor;
