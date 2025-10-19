import React, { useEffect, useState } from 'react';
import { Save, SquarePen, Plus, Trash2 } from 'lucide-react';
import useFetchData from '../hooks/useFetchData';
import { FormTablePageSkeleton } from '../../components/LoadingSkeletons';
import { useAuthFetch } from '../hooks/useAuthFetch';

interface Official {
  _id: string;
  name: string;
  position: string;
  image?: string | null;
  bio?: string;
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-[#1b4c2e] text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {isEditing ? 'Edit Official' : 'Add New Official'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {/* Image Upload */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 border-4 border-[#1b4c2e]">
                {formData.image ? (
                  <img
                    src={formData.image}
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

export default function OfficialsPanel() {
  const { data, loading, error, refetch } =
    useFetchData<Official[]>('/officials');
  const [officials, setOfficials] = useState<Official[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<Official | null>(null);
  const [isSaving, setIsSaving] = useState(false);
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
    try {
      if (editingOfficial) {
        // Update existing official
        await authFetch(
          `${import.meta.env.VITE_API_URL}/officials/${editingOfficial._id}`,
          {
            method: 'PUT',
            body: JSON.stringify(officialData),
          }
        );
      } else {
        // Add new official
        await authFetch(`${import.meta.env.VITE_API_URL}/officials`, {
          method: 'POST',
          body: JSON.stringify(officialData),
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

  const handleDeleteOfficial = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this official?')) {
      setIsSaving(true);
      try {
        await authFetch(`${import.meta.env.VITE_API_URL}/officials/${id}`, {
          method: 'DELETE',
        });
        await refetch();
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to delete official';
        alert('Delete failed: ' + msg);
      } finally {
        setIsSaving(false);
      }
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
                className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-[#1b4c2e]/30 transition-all duration-300 hover:shadow-md group"
              >
                {/* Official Image */}
                <div className="relative h-48 bg-gradient-to-br from-[#1b4c2e] to-[#2d6b42]">
                  {official.image ? (
                    <img
                      src={official.image}
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
                      className="bg-white/90 hover:bg-white text-[#1b4c2e] p-2 rounded-full shadow-lg transition-colors"
                      title="Edit Official"
                    >
                      <SquarePen size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteOfficial(official._id)}
                      className="bg-red-500/90 hover:bg-red-500 text-white p-2 rounded-full shadow-lg transition-colors"
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
    </div>
  );
}
