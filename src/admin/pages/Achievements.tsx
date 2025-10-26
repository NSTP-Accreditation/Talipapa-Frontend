import React, { useEffect, useState } from 'react';
import {
  SquarePen,
  Plus,
  Trash2,
  X,
  Trophy,
  Image,
  Link,
  ImageIcon,
  Eye,
} from 'lucide-react';
import { useLoadingState } from '../../hooks/useLoadingState';
import { useToast } from '@/hooks/useToast';
import { AchievementsPageSkeleton } from '../../components/LoadingSkeletons';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthFetch } from '../hooks/useAuthFetch';
import useFetchData from '../hooks/useFetchData';

/* ---------- utilities ---------- */
const readFileAsDataURL = (file) =>
  new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

export default function AchievementsAdmin() {
  // Add loading state with 1 second display
  const {
    data: achievements,
    loading: achievementsLoading,
    error: achievementsError,
    refetch: refetchAchievements,
  } = useFetchData('/achievements');

  const authFetch = useAuthFetch();

  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null => adding
  const [form, setForm] = useState({
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

  /* ---------- modal control ---------- */
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

  const openEdit = (index) => {
    setEditingIndex(index);
    const item = items[index];

    console.log(form);

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

  /* ---------- form handlers ---------- */
  const handleChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleFile = async (file) => {
    if (!file) return;
    setFileUploading(true);
    try {
      const dataUrl = await readFileAsDataURL(file);
      setForm((prev) => ({
        ...prev,
        image: '', // Clear URL when file is selected
        imageFile: file, // Store the File object
        imagePreview: dataUrl as string, // Use base64 for preview
      }));
    } catch (e) {
      const { error } = useToast();
      error('Failed to read file.', { title: 'File Error' });
    } finally {
      setFileUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      const { error } = useToast();
      error('Title is required.', { title: 'Validation' });
      return;
    }

    const isCreating = editingIndex === null;

    // For creation require an image file. For update, image is optional.
    if (isCreating && !form.imageFile) {
      const { error } = useToast();
      error('Image is required.', { title: 'Validation' });
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
        const id = items?.[editingIndex]?._id;
        if (!id) throw new Error('Missing achievement id for update');
        url = `/achievements/${id}`;
        method = 'PATCH';
      }

      await authFetch(url, {
        method,
        body: formData,
      });

      // refresh list from server
      refetchAchievements();

      closeModal();
    } catch (error) {
      console.error('Save failed:', error);
      const { error: showError } = useToast();
      showError(error?.message || String(error), { title: 'Save failed' });
    }
  };

  const handleDelete = async (id: string) => {
    console.log(id);

    try {
      const response = await authFetch(`/achievements/${id}`, {
        method: 'DELETE',
      });

      console.log(response);

      refetchAchievements();
    } catch (err) {
      const { error: showError } = useToast();
      showError(err?.message || String(err), { title: 'Delete failed' });
    }
  };

  /* ---------- small card component ---------- */
  const Card = ({ item, index }) => (
    <div className="group bg-white rounded-xl overflow-hidden border-2 border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
      {/* Image Container - Fixed Height */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br ">
        {item.image ? (
          <img
            src={item.image.url}
            alt={item.title}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Trophy className="w-20 h-20 text-yellow-500" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Icon Badge */}
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-500 text-white mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
          <Trophy className="w-5 h-5" />
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-green-600 transition-colors leading-tight">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3 flex-1">
          {item.description}
        </p>

        {/* Link */}
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-600 text-sm font-semibold hover:text-green-700 hover:gap-3 transition-all mb-3"
          >
            <span>View Details</span>
            <span>→</span>
          </a>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
          <button
            onClick={() => openEdit(index)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-semibold text-sm"
            title="Edit"
          >
            <SquarePen size={14} /> Edit
          </button>

          <button
            onClick={() => handleDelete(item._id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-semibold text-sm"
            title="Delete"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );

  // Show loading skeleton while loading
  if (achievementsLoading) {
    return <AchievementsPageSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Enhanced Header */}
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

      {/* Enhanced Content Grid */}
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
          items.map((it, idx) => <Card key={idx} item={it} index={idx} />)
        )}
      </div>

      {/* ---------- modal (enhanced) ---------- */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-slideUp">
            {/* Modal Header */}
            <div className="relative p-8 bg-gradient-to-br from-green-500 via-green-600 to-green-600 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-4 sm:gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center ring-2 ring-white/30 flex-shrink-0">
                    {editingIndex === null ? (
                      <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    ) : (
                      <SquarePen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-0.5 sm:mb-1 truncate">
                      {editingIndex === null
                        ? 'Add New Achievement'
                        : 'Edit Achievement'}
                    </h3>
                    <p className="text-green-100 text-xs sm:text-sm font-medium truncate">
                      {editingIndex === null
                        ? 'Create a new achievement entry'
                        : 'Update achievement details'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 ring-1 ring-white/30 flex-shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6 overflow-y-auto flex-1">
              {/* Achievement Details Section */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3 pb-2 sm:pb-3 border-b-2 border-green-100">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                    <SquarePen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-900">
                    Achievement Details
                  </h4>
                </div>

                <label className="block">
                  <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <SquarePen className="w-4 h-4 text-green-600" />
                    Title <span className="text-red-500">*</span>
                  </div>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium text-sm sm:text-base"
                    placeholder="Enter achievement title..."
                  />
                </label>

                <label className="block">
                  <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <SquarePen className="w-4 h-4 text-green-600" />
                    Description
                  </div>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      handleChange('description', e.target.value)
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none resize-none text-gray-900 font-medium text-sm sm:text-base"
                    rows={5}
                    placeholder="Describe this achievement..."
                  />
                </label>

                <label className="block">
                  <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Link className="w-4 h-4 text-green-600" />
                    Link (optional)
                  </div>
                  <input
                    type="url"
                    value={form.link}
                    onChange={(e) => handleChange('link', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium text-sm sm:text-base"
                    placeholder="https://example.com/achievement"
                  />
                </label>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3 pb-2 sm:pb-3 border-b-2 border-green-100">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                    <Image className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-900">
                    Image
                  </h4>
                </div>

                <label className="block">
                  <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-green-600" />
                    Upload Image
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                    className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 file:font-bold hover:file:bg-green-100 file:cursor-pointer transition-all"
                  />
                  {fileUploading && (
                    <div className="text-xs sm:text-sm text-green-600 mt-2 font-medium flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin"></div>
                      <span>Uploading...</span>
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
                    {form.imagePreview ? (
                      <img
                        src={form.imagePreview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Image className="w-16 h-16 mb-2 mx-auto text-gray-400" />
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
                    <span className="text-red-500 font-bold">*</span> are
                    required. Please ensure all information is accurate before
                    submitting.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 bg-gradient-to-r from-gray-50 to-white border-t-2 border-gray-100 flex gap-2 sm:gap-3 justify-end">
              <button
                onClick={closeModal}
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                {editingIndex === null ? (
                  <>
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Create Achievement</span>
                  </>
                ) : (
                  <>
                    <SquarePen className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
