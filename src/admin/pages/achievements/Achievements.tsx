import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import ResponsiveSkeleton from '../../../components/ResponsiveSkeleton';
import { useAuthFetch } from '../../hooks/useAuthFetch';
import useFetchData from '../../hooks/useFetchData';
import AchievementCard from './components/AchievementCard';
import AchievementModal from './components/AchievementModal';

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
    <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-500" />
            Achievements
          </h1>
          <p className="text-md text-gray-700 mt-3 font-medium">
            Manage community achievements and milestones
            <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {items.length}{' '}
              {items.length === 1 ? 'Achievement' : 'Achievements'}
            </span>
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Achievement
        </button>
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

      {isDeleteModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[1005] flex items-center justify-center bg-black/60 p-4"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeDeleteModal();
            }}
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-gray-900">
                  Delete Achievement
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  This action cannot be undone. Are you sure you want to delete
                  this achievement?
                </p>
              </div>
              <div className="p-4 flex items-center justify-end gap-3 bg-gray-50">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAchievement}
                  className={`px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow-sm hover:bg-red-700 ${isDeleting ? 'opacity-70 pointer-events-none' : ''}`}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
