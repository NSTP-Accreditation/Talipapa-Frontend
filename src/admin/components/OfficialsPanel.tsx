import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Save, SquarePen, Plus, Trash2, AlertCircle } from 'lucide-react';
import useFetchData from '../hooks/useFetchData';
import { FormTablePageSkeleton } from '../../components/LoadingSkeletons';
import { ResponsiveSkeleton } from '../../components/ResponsiveSkeleton';
import { useAuthFetch } from '../hooks/useAuthFetch';
import { useToast } from '@/hooks/useToast';
import { sanitizeName, validateName } from '@/utils/validation';

interface Official {
  _id: string;
  name: string;
  position: string;
  image?: string | null | ImageInt;
  imageFile: File | null;
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
          imageFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const { error: showError } = useToast();

  const handleSave = () => {
    // Validate name (required) and position (required)
    const nameToCheck = formData.name || '';
    const { valid, message } = validateName(nameToCheck, true);
    if (!valid) {
      showError(message || 'Invalid name');
      return;
    }

    if (!formData.position || !formData.position.trim()) {
      showError('Position/Title is required');
      return;
    }

    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1003] p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden">
        {/* Records-style gradient header */}
        <div className="relative p-4 sm:p-6 bg-gradient-to-br from-[#1b4c2e] via-[#2d6b42] to-emerald-600 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full -mr-16 sm:-mr-24 -mt-16 sm:-mt-24"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 bg-white/10 rounded-full -ml-12 sm:-ml-18 -mb-12 sm:-mb-18"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center ring-2 sm:ring-4 ring-white/30 shadow-lg">
                <span className="text-white text-sm sm:text-lg">👤</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-bold mb-0">
                  {isEditing ? 'Edit Official' : 'Add New Official'}
                </h3>
                <p className="text-white/80 text-xs sm:text-sm mt-1">
                  Manage barangay official
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:rotate-90 duration-300 ring-1 sm:ring-2 ring-white/30 text-lg sm:text-xl"
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          <div className="space-y-3 sm:space-y-4">
            {/* Image Upload */}
            <div className="text-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden bg-gray-200 border-2 sm:border-4 border-[#1b4c2e]">
                {formData.image ? (
                  <img
                    src={
                      typeof formData.image === 'string'
                        ? formData.image
                        : formData.image.url
                    }
                    alt="Official"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-2xl sm:text-4xl">👤</span>
                  </div>
                )}
              </div>
              <label className="cursor-pointer bg-[#1b4c2e] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md hover:bg-[#2d6b42] transition-colors inline-block text-sm">
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
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: sanitizeName(e.target.value),
                  }))
                }
                onBlur={() => {
                  const { valid, message } = validateName(formData.name, true);
                  if (!valid) {
                    showError(message || 'Invalid name');
                  }
                }}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4c2e] focus:border-transparent text-sm sm:text-base"
                placeholder="Enter full name"
              />
            </div>

            {/* Position Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Position/Title *
              </label>
              {/* Controlled select with allowed roles */}
              <select
                value={formData.position || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, position: e.target.value }))
                }
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4c2e] focus:border-transparent bg-white text-sm sm:text-base"
              >
                <option value="">Select position</option>
                <option value="Punong Barangay">Punong Barangay</option>
                <option value="Tagapamahala ng Barangay">
                  Tagapamahala ng Barangay
                </option>
                <option value="Barangay Treasurer">Barangay Treasurer</option>
                <option value="Barangay Secretary">Barangay Secretary</option>
                <option value="Kagawad">Kagawad</option>
                <option value="SK Member">SK Member</option>
              </select>
            </div>

            {/* Bio Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Biography
              </label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                rows={3}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1b4c2e] focus:border-transparent text-sm sm:text-base"
                placeholder="Enter biography or description"
              />
            </div>
          </div>
        </div>

        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="px-3 py-2 sm:px-4 sm:py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors text-sm order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.name.trim() || !formData.position.trim()}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-[#1b4c2e] text-white rounded-md hover:bg-[#2d6b42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm order-1 sm:order-2"
          >
            {isEditing ? 'Update' : 'Add'} Official
          </button>
        </div>
      </div>
    </div>,
    document.body
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

  return createPortal(
    <div
      className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl bg-white rounded-lg sm:rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Delete Official
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 mt-1">
                Are you sure you want to delete "{official.name}" (
                {official.position})?
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4">
            <div className="space-y-2">
              {official.bio && (
                <p className="text-xs sm:text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">Bio:</span>{' '}
                  {official.bio}
                </p>
              )}
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl p-2 sm:p-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-red-600" />
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
        <div className="px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-5 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 border-2 border-gray-300 bg-white text-gray-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center justify-center gap-1 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2 md:px-8 md:py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:from-red-700 hover:to-red-800 transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl order-1 sm:order-2"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            Delete Official
          </button>
        </div>
      </div>
    </div>,
    document.body
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
  const toast = useToast();

  useEffect(() => {
    if (Array.isArray(data)) setOfficials(data);
  }, [data]);

  if (loading) return <ResponsiveSkeleton page="formtable" />;

  if (error)
    return (
      <div className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-red-700">
          Failed to load officials
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-2">{error}</p>
        <div className="mt-3">
          <button
            onClick={() => refetch()}
            className="px-3 py-2 bg-[#1b4c2e] text-white rounded-md hover:bg-[#2d6b42] transition-colors text-sm"
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

    // Validation: enforce single-occupancy roles and limits
    const singleRoles = [
      'Punong Barangay',
      'Tagapamahala ng Barangay',
      'Barangay Treasurer',
      'Barangay Secretary',
    ];

    const countRole = (role: string) =>
      officials.filter((o) => o.position === role).length;

    // If creating a new official (not editing), or changing position, validate
    const isCreating = !editingOfficial;
    const newPosition = officialData.position;

    // Check single roles uniqueness
    if (singleRoles.includes(newPosition)) {
      const existing = officials.find((o) => o.position === newPosition);
      if (existing && isCreating) {
        toast.error(
          `${newPosition} already exists. Only one ${newPosition} is allowed.`,
          { title: 'Validation' }
        );
        setIsSaving(false);
        return;
      }
      // If editing, allow if the existing one is the same being edited
      if (existing && !isCreating && editingOfficial?._id !== existing._id) {
        toast.error(
          `${newPosition} already exists. Only one ${newPosition} is allowed.`,
          { title: 'Validation' }
        );
        setIsSaving(false);
        return;
      }
    }

    // Limits for Kagawad and SK Member (max 7 each)
    if (newPosition === 'Kagawad') {
      const existingCount = countRole('Kagawad');
      // If creating, existingCount must be < 7; if editing and not changing position, allow
      if (isCreating && existingCount >= 7) {
        toast.error('You can only have up to 7 Kagawads.', {
          title: 'Validation',
        });
        setIsSaving(false);
        return;
      }
      if (
        !isCreating &&
        editingOfficial &&
        editingOfficial.position !== 'Kagawad' &&
        existingCount >= 7
      ) {
        toast.error('You can only have up to 7 Kagawads.', {
          title: 'Validation',
        });
        setIsSaving(false);
        return;
      }
    }

    if (newPosition === 'SK Member') {
      const existingCount = countRole('SK Member');
      if (isCreating && existingCount >= 7) {
        toast.error('You can only have up to 7 SK Members.', {
          title: 'Validation',
        });
        setIsSaving(false);
        return;
      }
      if (
        !isCreating &&
        editingOfficial &&
        editingOfficial.position !== 'SK Member' &&
        existingCount >= 7
      ) {
        toast.error('You can only have up to 7 SK Members.', {
          title: 'Validation',
        });
        setIsSaving(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append('name', officialData.name);
    formData.append('position', officialData.position);
    if (officialData.imageFile)
      formData.append('image', officialData.imageFile);

    try {
      if (editingOfficial) {
        // Update existing official
        await authFetch(
          `${import.meta.env.VITE_API_URL}/officials/${editingOfficial._id}`,
          {
            method: 'PATCH',
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
      toast.error('Save failed: ' + msg, { title: 'Save failed' });
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
      toast.error('Delete failed: ' + msg, { title: 'Delete failed' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1b4c2e] flex items-center gap-2">
            <span className="text-lg sm:text-xl">👥</span>
            <span className="text-sm sm:text-2xl">Barangay Officials</span>
            <span className="ml-2 sm:ml-3 px-2 py-1 sm:px-3 sm:py-1 bg-[#1b4c2e]/10 text-[#1b4c2e] rounded-full text-xs sm:text-sm font-semibold">
              {officials.length} Officials
            </span>
          </h2>
          <button
            onClick={handleAddOfficial}
            disabled={isSaving}
            className="flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#1b4c2e] to-[#1b4c2e] hover:from-[#2d6b42] hover:to-[#2d6b42] rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 w-full sm:w-auto"
          >
            <Plus size={12} className="sm:w-3.5 sm:h-3.5" />
            Add Official
          </button>
        </div>

        {officials.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <span className="text-gray-400 text-4xl sm:text-6xl">👥</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
              No Officials Added Yet
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 px-4">
              Start by adding your first official to showcase your leadership
              team.
            </p>
            <button
              onClick={handleAddOfficial}
              className="bg-[#1b4c2e] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-[#2d6b42] transition-colors duration-300 font-medium text-sm sm:text-base"
            >
              Add First Official
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {officials.map((official) => (
              <div
                key={official._id}
                className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-green-300 transition-all duration-300 hover:shadow-md hover:-translate-y-1 transform group"
              >
                {/* Official Image */}
                <div className="relative h-32 sm:h-48 bg-gradient-to-br from-[#1b4c2e] to-[#2d6b42]">
                  {official.image ? (
                    <img
                      src={
                        typeof official.image === 'string'
                          ? official.image
                          : official.image?.url
                      }
                      alt={official.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl sm:text-4xl">
                          👤
                        </span>
                      </div>
                    </div>
                  )}
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditOfficial(official)}
                      className="bg-white/90 hover:bg-white text-[#1b4c2e] p-1.5 sm:p-2 rounded-full shadow-lg transition-colors hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-200"
                      title="Edit Official"
                    >
                      <SquarePen size={12} className="sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteOfficial(official._id)}
                      className="bg-red-500/90 hover:bg-red-500 text-white p-1.5 sm:p-2 rounded-full shadow-lg transition-colors hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-200"
                      title="Remove Official"
                    >
                      <Trash2 size={12} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                {/* Official Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="font-bold text-[#1b4c2e] text-sm sm:text-lg mb-0.5 sm:mb-1 leading-tight">
                    {official.name}
                  </h3>
                  <p className="text-[#2d6b42] font-medium text-xs sm:text-sm mb-1 sm:mb-2">
                    {official.position}
                  </p>
                  {official.bio && (
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
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
