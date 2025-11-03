import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Trophy, Award, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import ResponsiveSkeleton from '../../../components/ResponsiveSkeleton';
import { useAuthFetch } from '../../hooks/useAuthFetch';
import useFetchData from '../../hooks/useFetchData';
import AchievementCard from './components/AchievementCard';
import AchievementModal from './components/AchievementModal';
import ConfirmModal from '@/components/ui/ConfirmModal';

/* ---------- utilities ---------- */
const readFileAsDataURL = (file: File) =>
  new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(String(reader.result));
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

export default function Achievements() {
  const {
    data: achievements,
    loading: achievementsLoading,
    error: achievementsError,
    refetch: refetchAchievements,
  } = useFetchData('/achievements');

  const authFetch = useAuthFetch();
  const toast = useToast();

  const [items, setItems] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<any>({
    title: '',
    description: '',
    link: '',
    imageFile: null,
    imagePreview: '',
  });
  const [fileUploading, setFileUploading] = useState(false);

  useEffect(() => {
    if (achievements && !achievementsLoading && !achievementsError) {
      setItems(achievements);
    }
  }, [achievements, achievementsLoading, achievementsError]);

  const openAdd = () => {
    setEditingIndex(null);
    setForm({
      title: '',
      description: '',
      link: '',
      imageFile: null,
      imagePreview: '',
    });
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    setEditingIndex(index);
    const item = items[index];
    setForm({
      title: item.title || '',
      description: item.description || '',
      link: item.link || '',
      imageFile: null,
      imagePreview:
        item && item.image
          ? typeof item.image === 'string'
            ? item.image
            : item.image.url
          : '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFileUploading(false);
  };

  const handleChange = (k: string, v: any) =>
    setForm((s: any) => ({ ...s, [k]: v }));

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setFileUploading(true);
    try {
      const dataUrl = await readFileAsDataURL(file);
      setForm((prev: any) => ({
        ...prev,
        image: '',
        imageFile: file,
        imagePreview: dataUrl,
      }));
    } catch (e) {
      toast.error('Failed to read file.', { title: 'File Error' });
    } finally {
      setFileUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title?.trim()) {
      toast.error('Title is required.', { title: 'Validation' });
      return;
    }

    const isCreating = editingIndex === null;

    if (isCreating && !form.imageFile) {
      toast.error('Image is required.', { title: 'Validation' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description || '');
      formData.append('link', form.link || '');
      if (form.imageFile) formData.append('image', form.imageFile);

      let url = '/achievements';
      let method = 'POST';

      if (!isCreating) {
        const id = items?.[editingIndex!]?._id;
        if (!id) throw new Error('Missing achievement id for update');
        url = `/achievements/${id}`;
        method = 'PATCH';
      }

      await authFetch(url, { method, body: formData });
      refetchAchievements();
      closeModal();

      // Show success toast
      if (isCreating) {
        toast.success(
          `Achievement "${form.title}" has been successfully created!`,
          {
            title: 'Created',
          }
        );
      } else {
        toast.success(
          `Achievement "${form.title}" has been successfully updated!`,
          {
            title: 'Updated',
          }
        );
      }
    } catch (error: any) {
      console.error('Save failed:', error);
      toast.error(error?.message || String(error), { title: 'Save failed' });
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingId(null);
    setIsDeleting(false);
  };

  const confirmDeleteAchievement = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await authFetch(`/achievements/${deletingId}`, { method: 'DELETE' });
      toast.success('Achievement deleted.', { title: 'Deleted' });
      refetchAchievements();
      closeDeleteModal();
    } catch (err: any) {
      console.error('Delete failed:', err);
      toast.error(err?.message || String(err), { title: 'Delete failed' });
      setIsDeleting(false);
    }
  };

  if (achievementsLoading) {
    return <ResponsiveSkeleton page="achievements" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-3 sm:p-5 lg:p-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-600 rounded-full -ml-24 -mb-24"></div>
          </div>

          <div className="relative p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 shadow-lg ring-4 ring-green-100 animate-pulse-slow">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Achievements
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-medium mb-4">
                  Manage community achievements and milestones
                </p>

                {/* Quick Info Pills */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs sm:text-sm font-semibold text-green-700">
                    <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>
                      {items.length}{' '}
                      {items.length === 1 ? 'Achievement' : 'Achievements'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs sm:text-sm font-semibold text-blue-700">
                    <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Milestones</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-xs sm:text-sm font-semibold text-purple-700">
                    <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Image Gallery</span>
                  </div>
                </div>
              </div>
              <button
                onClick={openAdd}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg sm:rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Plus size={20} />
                Add Achievement
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.length === 0 ? (
            <div className="col-span-full text-center py-24">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-100 to-green-100 rounded-3xl shadow-xl mb-6">
                <Trophy className="w-20 h-20 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No achievements yet
              </h3>
              <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                Start building your collection by adding your first achievement
              </p>
              <button
                onClick={openAdd}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                <Plus size={20} /> Create First Achievement
              </button>
            </div>
          ) : (
            items.map((it: any, idx: number) => (
              <AchievementCard
                key={it._id || idx}
                item={it}
                index={idx}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {modalOpen && (
          <AchievementModal
            open={modalOpen}
            onClose={closeModal}
            form={form}
            editingIndex={editingIndex}
            onChange={handleChange}
            onFile={handleFile}
            onSave={handleSave}
            fileUploading={fileUploading}
          />
        )}

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          title="Delete Achievement"
          description={
            <p className="text-gray-700 text-base leading-relaxed">
              Are you sure you want to delete this achievement? This action
              cannot be undone.
            </p>
          }
          onClose={closeDeleteModal}
          onConfirm={confirmDeleteAchievement}
          loading={isDeleting}
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      </div>
    </div>
  );
}
