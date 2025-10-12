import React, { useEffect, useState } from 'react';
import { SquarePen, Plus, Trash2, X } from 'lucide-react';
import { useLoadingState } from '../../hooks/useLoadingState';
import { PageLoadingSkeleton } from '../../components/LoadingSkeletons';

/**
 * AchievementsAdmin
 * - Editable admin UI for your Achievements grid
 * - Stores data in localStorage under "achievements_admin_v1"
 * - Supports adding/editing/removing, image upload (base64) or image URL
 * - Export/Import JSON for migration or backup
 *
 * Drop this file into your React app. TailwindCSS expected.
 */

const LOCAL_KEY = 'achievements_admin_v1';

/* ---------- utilities ---------- */
const readFileAsDataURL = (file) =>
  new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

/* ---------- default seed data (you provided) ---------- */
const DEFAULTS = [
  {
    title: 'Barangay Clean-up Drive Award',
    description:
      'Recognized for outstanding environmental efforts in maintaining a clean and green community.',
    link: 'https://example.com/cleanup-award',
    image:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&q=80',
  },
  {
    title: 'Health and Wellness Initiative',
    description:
      'Awarded for promoting community health through sustainable wellness programs.',
    link: 'https://example.com/health-initiative',
    image:
      'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80',
  },
  {
    title: 'Community Safety Recognition',
    description:
      'Acknowledged for exemplary disaster preparedness and safety programs.',
    link: 'https://example.com/safety-recognition',
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
  },
  {
    title: 'Youth Empowerment Project',
    description:
      'Honored for empowering youth leaders to contribute actively to barangay programs.',
    link: 'https://example.com/youth-project',
    image:
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=80',
  },
  {
    title: 'Eco-Friendly Barangay',
    description:
      'Achieved for implementing innovative recycling and environmental conservation measures.',
    link: 'https://example.com/eco-barangay',
    image:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80',
  },
  {
    title: 'Best Barangay Documentation',
    description:
      'Awarded for excellence in record keeping, transparency, and governance.',
    link: 'https://example.com/documentation-award',
    image: '',
  },
];

export default function AchievementsAdmin() {
  // Add loading state with minimum 2 second display
  const { isLoading: pageLoading } = useLoadingState(2000);

  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null => adding
  const [form, setForm] = useState({
    title: '',
    description: '',
    link: '',
    image: '', // can be URL or base64
  });
  const [fileUploading, setFileUploading] = useState(false);

  /* ---------- load from localStorage or defaults ---------- */
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      try {
        setItems(JSON.parse(raw));
        return;
      } catch (e) {
        console.warn('Invalid local storage data, loading defaults.');
      }
    }
    setItems(DEFAULTS);
  }, []);

  /* ---------- persist whenever items change ---------- */
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  }, [items]);

  /* ---------- modal control ---------- */
  const openAdd = () => {
    setEditingIndex(null);
    setForm({ title: '', description: '', link: '', image: '' });
    setModalOpen(true);
  };
  const openEdit = (index) => {
    setEditingIndex(index);
    setForm(items[index]);
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
      // store base64 blob as image
      handleChange('image', dataUrl);
    } catch (e) {
      alert('Failed to read file.');
    } finally {
      setFileUploading(false);
    }
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      alert('Title is required.');
      return;
    }
    if (editingIndex === null) {
      setItems((prev) => [form, ...prev]);
    } else {
      setItems((prev) => prev.map((it, i) => (i === editingIndex ? form : it)));
    }
    closeModal();
  };

  const handleDelete = (index) => {
    if (!confirm('Delete this achievement? This action cannot be undone.'))
      return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------- small card component ---------- */
  const Card = ({ item, index }) => (
    <div className="group bg-white rounded-xl overflow-hidden border-2 border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
      {/* Image Container - Fixed Height */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-7xl">🏆</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Icon Badge */}
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
          <span className="text-xl">🏆</span>
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
            onClick={() => handleDelete(index)}
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
  if (pageLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-4xl">🏆</span>
            Achievements
          </h1>
          <p className="text-lg text-gray-700 mt-3 font-medium">
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
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl shadow-xl mb-6">
              <span className="text-8xl">🏆</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No achievements yet
            </h3>
            <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
              Start building your collection by adding your first achievement
            </p>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">
                    {editingIndex === null ? '➕' : '✏️'}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {editingIndex === null
                    ? 'Add New Achievement'
                    : 'Edit Achievement'}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                title="Close"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-8 space-y-6 overflow-y-auto flex-1">
              <label className="block">
                <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <span>📝</span> Title <span className="text-red-500">*</span>
                </div>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                  placeholder="Enter achievement title..."
                />
              </label>

              <label className="block">
                <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <span>📄</span> Description
                </div>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none resize-none"
                  rows={5}
                  placeholder="Describe this achievement..."
                />
              </label>

              <label className="block">
                <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <span>🔗</span> Link (optional)
                </div>
                <input
                  type="url"
                  value={form.link}
                  onChange={(e) => handleChange('link', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                  placeholder="https://example.com/achievement"
                />
              </label>

              <div className="grid sm:grid-cols-2 gap-6">
                <label className="block">
                  <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span>🌐</span> Image URL
                  </div>
                  <input
                    type="url"
                    value={
                      form.image && form.image.startsWith('data:')
                        ? ''
                        : form.image
                    }
                    onChange={(e) => handleChange('image', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                    placeholder="https://..."
                  />
                </label>

                <label className="block">
                  <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span>📸</span> Or Upload Image
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:cursor-pointer"
                  />
                  {fileUploading && (
                    <div className="text-sm text-green-600 mt-2 font-medium flex items-center gap-2">
                      <span className="animate-spin">⏳</span> Uploading...
                    </div>
                  )}
                </label>
              </div>

              {/* Preview */}
              <div className="pt-2">
                <div className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span>👁️</span> Image Preview
                </div>
                <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex items-center justify-center border-2 border-gray-200 shadow-inner">
                  {form.image ? (
                    <img
                      src={form.image}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-6xl mb-2 block">🖼️</span>
                      <div className="text-gray-400 font-medium">
                        No image selected
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-4 p-6 border-t-2 border-gray-100 bg-gray-50">
              <button
                onClick={closeModal}
                className="px-6 py-3 rounded-xl border-2 border-gray-300 font-semibold hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              >
                {editingIndex === null ? 'Create Achievement' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
