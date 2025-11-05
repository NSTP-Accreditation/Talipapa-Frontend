import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  SquarePen,
  Plus,
  Trash2,
  AlertCircle,
  Users,
  User,
  Upload,
  X,
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import useFetchData from '../hooks/useFetchData';
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
  biography?: string;
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
    biography: '',
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
        biography: '',
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1003] p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden animate-slideUp">
        {/* Header matching AddRecordModal style */}
        <div className="relative p-4 sm:p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/10 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center ring-2 sm:ring-4 ring-white/30 shadow-lg">
                <User className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-3xl font-bold text-white mb-0 sm:mb-1">
                  {isEditing ? 'Edit Official' : 'Add New Official'}
                </h3>
                <p className="text-green-100 text-xs sm:text-sm font-medium">
                  Manage barangay official information
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:rotate-90 duration-300 ring-1 sm:ring-2 ring-white/30"
              title="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-8 overflow-y-auto max-h-[calc(95vh-200px)] bg-gradient-to-br from-gray-50 to-white">
          <div className="space-y-4 sm:space-y-6">
            {/* Image Upload */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-green-500 shadow-xl">
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
                      <User className="w-12 h-12 sm:w-16 sm:h-16" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-10 h-10 sm:w-12 sm:h-12 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all hover:scale-110">
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-gray-600 font-medium">
                Click the button to upload photo
              </p>
            </div>

            {/* Name Input */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-2">
                <span className="text-red-500">*</span>
                <span>Full Name</span>
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
                className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 text-sm sm:text-base transition-all"
                placeholder="Enter full name"
              />
            </div>

            {/* Position Input */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-2">
                <span className="text-red-500">*</span>
                <span>Position/Title</span>
              </label>
              <select
                value={formData.position || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, position: e.target.value }))
                }
                className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white text-sm sm:text-base transition-all"
              >
                <option value="">Select position</option>
                <option value="Punong Barangay">Punong Barangay</option>
                <option value="Tagapamahala ng Barangay">
                  Tagapamahala ng Barangay
                </option>
                <option value="Barangay Treasurer">Barangay Treasurer</option>
                <option value="Barangay Secretary">Barangay Secretary</option>
                <option value="Kagawad">Kagawad</option>
                <option value="SK Chairperson">SK Chairperson</option>
              </select>
            </div>

            {/* Bio Input */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-2">
                <span>Biography (Optional)</span>
              </label>
              <textarea
                value={formData.biography || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    biography: e.target.value,
                  }))
                }
                rows={4}
                className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 text-sm sm:text-base transition-all"
                placeholder="Enter biography or description"
              />
            </div>
          </div>
        </div>

        <div className="px-4 py-3 sm:px-8 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 sm:px-6 sm:py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.name.trim() || !formData.position.trim()}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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

// Using shared ConfirmModal for delete confirmations

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

    // Limits for Kagawad and SK Chairperson (max 7 each)
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

    if (newPosition === 'SK Chairperson') {
      const existingCount = countRole('SK Chairperson');
      if (isCreating && existingCount >= 1) {
        toast.error('You can only have up to 1 SK Chairperson.', {
          title: 'Validation',
        });
        setIsSaving(false);
        return;
      }
      if (
        !isCreating &&
        editingOfficial &&
        editingOfficial.position !== 'SK Chairperson' &&
        existingCount >= 1
      ) {
        toast.error('You can only have up to 1 SK Chairperson.', {
          title: 'Validation',
        });
        setIsSaving(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append('name', officialData.name);
    formData.append('position', officialData.position);
    formData.append('biography', officialData.biography || '');
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
      setIsModalOpen(false);
      setEditingOfficial(null);

      // Show success toast
      if (editingOfficial) {
        toast.success(`${officialData.name} has been successfully updated!`, {
          title: 'Updated',
        });
      } else {
        toast.success(`${officialData.name} has been successfully added!`, {
          title: 'Added',
        });
      }
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

      // Show success toast
      toast.success(`${deletingOfficial.name} has been successfully deleted!`, {
        title: 'Deleted',
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to delete official';
      toast.error('Delete failed: ' + msg, { title: 'Delete failed' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Barangay Officials
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
                {officials.length}{' '}
                {officials.length === 1 ? 'Official' : 'Officials'}
              </p>
            </div>
          </div>
          <button
            onClick={handleAddOfficial}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Official
          </button>
        </div>

        {officials.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Users className="text-gray-400 w-12 h-12 sm:w-16 sm:h-16" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
              No Officials Added Yet
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 px-4 max-w-md mx-auto">
              Start by adding your first official to showcase your leadership
              team.
            </p>
            <button
              onClick={handleAddOfficial}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 font-semibold text-sm sm:text-base"
            >
              <Plus className="w-5 h-5" />
              Add First Official
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {officials.map((official) => (
              <div
                key={official._id}
                className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-green-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Official Image */}
                <div className="relative h-40 sm:h-56 bg-gray-900 overflow-hidden">
                  {official.image ? (
                    <>
                      {/* Blurred background */}
                      <img
                        src={
                          typeof official.image === 'string'
                            ? official.image
                            : official.image?.url
                        }
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-50"
                      />
                      {/* Main image */}
                      <img
                        src={
                          typeof official.image === 'string'
                            ? official.image
                            : official.image?.url
                        }
                        alt={official.name}
                        className="relative w-full h-full object-contain z-10"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <User className="text-white w-10 h-10 sm:w-14 sm:h-14" />
                      </div>
                    </div>
                  )}
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditOfficial(official)}
                      className="bg-white hover:bg-gray-50 text-green-600 p-2 sm:p-2.5 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-300"
                      title="Edit Official"
                    >
                      <SquarePen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteOfficial(official._id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 sm:p-2.5 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-300"
                      title="Remove Official"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Official Info */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 leading-tight">
                    {official.name}
                  </h3>
                  <p className="text-green-600 font-semibold text-xs sm:text-sm mb-2 sm:mb-3">
                    {official.position}
                  </p>
                  {official.biography && (
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {official.biography}
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

      {/* Delete Modal (shared) */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <span>Delete Official</span>
          </div>
        }
        description={
          <div>
            <p className="text-gray-700 text-sm">
              Are you sure you want to delete "{deletingOfficial?.name}" ({' '}
              {deletingOfficial?.position})?
            </p>
            {deletingOfficial?.biography && (
              <p className="text-xs text-gray-600 mt-2">
                {deletingOfficial.biography}
              </p>
            )}
            <p className="text-sm text-red-700 font-semibold mt-3">
              Warning: This will permanently remove this official from the
              system.
            </p>
            <p className="text-xs text-red-700 mt-2">
              This action cannot be undone.
            </p>
          </div>
        }
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingOfficial(null);
        }}
        onConfirm={confirmDeleteOfficial}
        loading={isSaving}
        confirmLabel="Delete Official"
        cancelLabel="Cancel"
      />
    </div>
  );
}
