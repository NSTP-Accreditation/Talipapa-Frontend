import React, { useEffect, useState } from 'react';
import { Save, SquarePen, Plus, Trash2, AlertCircle } from 'lucide-react';
import useFetchData from '../hooks/useFetchData';
import { FormTablePageSkeleton } from '../../components/LoadingSkeletons';
import { useAuthFetch } from '../hooks/useAuthFetch';

interface Official {
  _id: string;
  name: string;
  position: string;
  image?: string | null | ImageInt;
  imageFile: File | null,
  bio?: string;
}

export interface ImageInt {
  url: string;
  key: string;
  originalName: string; 
  size: string;
  mimetype: string;
}

interface OfficialModalProps {
  isOpen: boolean;
  onClose: () => void;
  official: Official | null;
  onSave: (official: Official) => void;
  isEditing: boolean;
}

const OfficialModal: React.FC<OfficialModalProps> = ({
  isOpen,
  onClose,
  official,
  onSave,
  isEditing,
}) => {
  const [formData, setFormData] = useState<Official>({
    _id: '',
    name: '',
    position: '',
    image: null,
    imageFile: null,
    bio: '',
  });

  React.useEffect(() => {
    if (official) {
      setFormData(official);
    } else {
      setFormData({
        _id: Date.now().toString(),
        name: '',
        position: '',
        image: null,
        imageFile: null,
        bio: '',
      });
    }
  }, [official, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          image: event.target?.result as string,
          imageFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (formData.name.trim() && formData.position.trim()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-1003 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden">
        {/* Records-style gradient header */}
        <div className="relative p-6 bg-gradient-to-br from-[#1b4c2e] via-[#2d6b42] to-emerald-600 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/10 rounded-full -ml-18 -mb-18"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-4 ring-white/30 shadow-lg">
                <span className="text-white text-lg">👤</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-0">
                  {isEditing ? 'Edit Official' : 'Add New Official'}
                </h3>
                <p className="text-white/80 text-sm mt-1">
                  Manage barangay official
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:rotate-90 duration-300 ring-2 ring-white/30"
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          <div className="space-y-4">
            {/* Image Upload */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 border-4 border-[#1b4c2e]">
                {formData.image ? (
                  <img
                    src={typeof formData.image === "string" ? formData.image : formData.image.url}
                    alt="Official"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-4xl">👤</span>
                  </div>
                )}
              </div>
              <label className="cursor-pointer bg-[#1b4c2e] text-white px-4 py-2 rounded-md hover:bg-[#2d6b42] transition-colors inline-block">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4c2e] focus:border-transparent"
                placeholder="Enter full name"
              />
            </div>

            {/* Position Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position/Title *
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, position: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4c2e] focus:border-transparent"
                placeholder="Enter position or title"
              />
            </div>

            {/* Bio Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biography
              </label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1b4c2e] focus:border-transparent"
                placeholder="Enter biography or description"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.name.trim() || !formData.position.trim()}
            className="px-4 py-2 bg-[#1b4c2e] text-white rounded-md hover:bg-[#2d6b42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? 'Update' : 'Add'} Official
          </button>
        </div>
      </div>
    </div>
  );
};

interface DeleteModalProps {
  official: Official | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  official,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !official) return null;

  return (
    <div
      className="fixed inset-0 z-1003 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">
                Delete Official
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                Are you sure you want to delete "{official.name}" (
                {official.position})?
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4">
            <div className="space-y-2">
              {official.bio && (
                <p className="text-xs sm:text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">Bio:</span>{' '}
                  {official.bio}
                </p>
              )}
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-50 border-2 border-red-200 rounded-xl p-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-red-700 font-semibold leading-relaxed">
                    Warning: This will permanently remove this official from the
                    system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 ">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 bg-white text-gray-700 rounded-lg sm:rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center justify-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg sm:rounded-xl text-sm font-bold hover:from-red-700 hover:to-red-800 transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl order-1 sm:order-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Official
          </button>
        </div>
      </div>
    </div>
  );
};

export default function OfficialsPanel() {
  const { data, loading, error, refetch } =
    useFetchData<Official[]>('/officials');
  const [officials, setOfficials] = useState<Official[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<Official | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingOfficial, setDeletingOfficial] = useState<Official | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const authFetch = useAuthFetch();

  useEffect(() => {
    if (Array.isArray(data)) setOfficials(data);
  }, [data]);

  if (loading) return <FormTablePageSkeleton />;

  if (error)
    return (
      <div className="p-6">
        <h3 className="text-lg font-bold text-red-700">
          Failed to load officials
        </h3>
        <p className="text-sm text-gray-600 mt-2">{error}</p>
        <div className="mt-3">
          <button
            onClick={() => refetch()}
            className="px-3 py-2 bg-[#1b4c2e] text-white rounded-md hover:bg-[#2d6b42] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );

  const handleAddOfficial = () => {
    setEditingOfficial(null);
    setIsModalOpen(true);
  };

  const handleEditOfficial = (official: Official) => {
    setEditingOfficial(official);
    setIsModalOpen(true);
  };

  const handleSaveOfficial = async (officialData: Official) => {
    setIsSaving(true);

    const formData = new FormData();
    formData.append("name", officialData.name);
    formData.append("position", officialData.position);
    formData.append("image", officialData.imageFile);

    try {
      if (editingOfficial) {
        // Update existing official
        await authFetch(
          `${import.meta.env.VITE_API_URL}/officials/${editingOfficial._id}`,
          {
            method: 'PUT',
            body: formData,
          }
        );
      } else {
        // Add new official
        await authFetch(`${import.meta.env.VITE_API_URL}/officials`, {
          method: 'POST',
          body: formData,
        });
      }

      await refetch();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to save official';
      alert('Save failed: ' + msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteOfficial = (id: string) => {
    const found = officials.find((o) => o._id === id) || null;
    setDeletingOfficial(found);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteOfficial = async () => {
    if (!deletingOfficial) return;
    setIsSaving(true);
    try {
      await authFetch(
        `${import.meta.env.VITE_API_URL}/officials/${deletingOfficial._id}`,
        {
          method: 'DELETE',
        }
      );
      await refetch();
      setIsDeleteModalOpen(false);
      setDeletingOfficial(null);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to delete official';
      alert('Delete failed: ' + msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1b4c2e] flex items-center gap-2">
            <span>👥</span>
            Barangay Officials
            <span className="ml-3 px-3 py-1 bg-[#1b4c2e]/10 text-[#1b4c2e] rounded-full text-sm font-semibold">
              {officials.length} Officials
            </span>
          </h2>
          <button
            onClick={handleAddOfficial}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#1b4c2e] to-[#1b4c2e] hover:from-[#2d6b42] hover:to-[#2d6b42] rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <Plus size={14} />
            Add Official
          </button>
        </div>

        {officials.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-gray-400 text-6xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Officials Added Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start by adding your first official to showcase your leadership
              team.
            </p>
            <button
              onClick={handleAddOfficial}
              className="bg-[#1b4c2e] text-white px-6 py-3 rounded-lg hover:bg-[#2d6b42] transition-colors duration-300 font-medium"
            >
              Add First Official
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {officials.map((official) => (
              <div
                key={official._id}
                className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-green-300 transition-all duration-300 hover:shadow-md hover:-translate-y-1 transform group"
              >
                {/* Official Image */}
                <div className="relative h-48 bg-gradient-to-br from-[#1b4c2e] to-[#2d6b42]">
                  {official.image ? (
                    <img
                      src={typeof official.image === 'string' ? official.image : official.image?.url}
                      alt={official.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-4xl">👤</span>
                      </div>
                    </div>
                  )}
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditOfficial(official)}
                      className="bg-white/90 hover:bg-white text-[#1b4c2e] p-2 rounded-full shadow-lg transition-colors hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-200"
                      title="Edit Official"
                    >
                      <SquarePen size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteOfficial(official._id)}
                      className="bg-red-500/90 hover:bg-red-500 text-white p-2 rounded-full shadow-lg transition-colors hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-200"
                      title="Remove Official"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Official Info */}
                <div className="p-4">
                  <h3 className="font-bold text-[#1b4c2e] text-lg mb-1">
                    {official.name}
                  </h3>
                  <p className="text-[#2d6b42] font-medium text-sm mb-2">
                    {official.position}
                  </p>
                  {official.bio && (
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {official.bio}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Official Modal */}
      <OfficialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        official={editingOfficial}
        onSave={handleSaveOfficial}
        isEditing={!!editingOfficial}
      />

      {/* Delete Modal */}
      <DeleteModal
        official={deletingOfficial}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingOfficial(null);
        }}
        onConfirm={confirmDeleteOfficial}
      />
    </div>
  );
}
