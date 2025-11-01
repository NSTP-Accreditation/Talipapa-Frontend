import React, { useEffect, useState } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { createPortal } from 'react-dom';
import {
  Save,
  Plus,
  Edit2,
  Trash2,
  Leaf,
  MoreVertical,
  Copy,
} from 'lucide-react';
import { useLoadingState } from '../../../hooks/useLoadingState';
import { useToast } from '@/hooks/useToast';
import { FormTablePageSkeleton } from '../../../components/LoadingSkeletons';
import useFetchData from '../../hooks/useFetchData';
import { useAuthFetch } from '../../hooks/useAuthFetch';
import ProgramCard from './ProgramCard';
import SearchBar from './SearchBar';
import ProgramModal from './ProgramModal';

interface ProgramItem {
  _id: string;
  title: string;
  items: ItemInt[];
  category?: string;
  createdAt?: string;
}

interface ItemInt {
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProgramFormData {
  title: string;
  category: string;
  items: ItemInt[];
}

const categories = [
  'Circular Economy',
  'Waste Management',
  'Community Programs',
  'Education',
  'Health & Wellness',
  'Livelihood',
  'Other',
];

export default function TalipapaNatin() {
  const { isLoading: pageLoading } = useLoadingState(1000);
  const {
    data: programs = [],
    loading,
    error,
    refetch: refetchPrograms,
  } = useFetchData<ProgramItem[]>('/talipapanatin');
  const authFetch = useAuthFetch();
  const { success, error: showError, info } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(
    null
  );
  const [formData, setFormData] = useState<ProgramFormData>({
    title: '',
    category: 'Other',
    items: [],
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ProgramItem | null>(null);
  const [isDeletingProgram, setIsDeletingProgram] = useState(false);

  // Filter programs
  const filteredPrograms = programs?.filter((program) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        program.title.toLowerCase().includes(query) ||
        program.items.some((item) => item.name.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isModalOpen) {
      setFormData({
        title: '',
        category: 'Other',
        items: [],
      });
      setEditingProgram(null);
    }
  }, [isModalOpen]);

  // Program Management
  const handleAddProgram = () => {
    setFormData({
      title: 'New Program',
      category: 'Other',
      items: [{ name: 'New Item' }],
    });
    setEditingProgram(null);
    setIsModalOpen(true);
  };

  const handleDeleteProgram = async (id: string) => {
    const program = programs.find((p) => p._id === id) || null;
    // open confirm modal with program details
    setDeleteTarget(program);
  };

  const confirmDeleteProgram = async () => {
    if (!deleteTarget) return;
    setIsDeletingProgram(true);
    try {
      const res = await authFetch(`/talipapanatin/${deleteTarget._id}`, {
        method: 'DELETE',
      });

      setHasUnsavedChanges(true);
      success(res.message, { title: 'Deleted' });
      refetchPrograms();
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting program:', error);
      showError('Error deleting program. Please try again.', {
        title: 'Delete failed',
      });
    } finally {
      setIsDeletingProgram(false);
    }
  };

  const duplicateProgram = async (id: string) => {
    const program = programs.find((p) => p._id === id);
    if (program) {
      try {
        const duplicateData = {
          title: `${program.title} (Copy)`,
          category: program.category || 'Other',
          items: program.items.map((item) => ({ name: item.name })),
        };

        const res = await authFetch('/talipapanatin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(duplicateData),
        });

        if (res.message) {
          success(res.message, { title: 'Created' });
          setHasUnsavedChanges(true);
          refetchPrograms();
        }
      } catch (error) {
        console.error('Error duplicating program:', error);
        showError('Error duplicating program. Please try again.', {
          title: 'Duplicate failed',
        });
      }
    }
  };

  const openEdit = (program: ProgramItem) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      category: program.category || 'Other',
      items: program.items.map((item) => ({ ...item })), // Deep clone items
    });
    setIsModalOpen(true);
  };

  const saveEdit = async () => {
    if (!formData.title.trim()) {
      showError('Please enter a program title', { title: 'Validation' });
      return;
    }

    try {
      if (editingProgram) {
        const res = await authFetch(`/talipapanatin/${editingProgram._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.title,
            category: formData.category,
            items: formData.items,
          }),
        });

        if (res.message) {
          success(res.message, { title: 'Updated' });
          setHasUnsavedChanges(true);
          refetchPrograms();
          closeModal();
        }
      } else {
        // Create new program
        const res = await authFetch('/talipapanatin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.title,
            category: formData.category,
            items: formData.items,
          }),
        });

        if (res.message) {
          success(res.message, { title: 'Created' });
          setHasUnsavedChanges(true);
          refetchPrograms();
          closeModal();
        }
      }
    } catch (error) {
      console.error('Error saving program:', error);
      showError('Error saving program. Please try again.', {
        title: 'Save failed',
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Form handlers
  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, title: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: 'New Item' }],
    }));
  };

  const updateItem = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, name: value } : item
      ),
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSaveAll = () => {
    setHasUnsavedChanges(false);
    success('✅ All changes saved successfully!', { title: 'Saved' });
  };

  if (pageLoading) {
    return <FormTablePageSkeleton />;
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
                <Leaf className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  TalipapaNatin Program
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-medium">
                  "May Buhay sa Basura ng Barangay" - Community Sustainability
                  Programs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl shadow-md border border-gray-200 p-4">
          <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
            {filteredPrograms?.length} program
            {filteredPrograms?.length !== 1 ? 's' : ''}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {hasUnsavedChanges && (
              <button
                onClick={handleSaveAll}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm font-semibold"
              >
                <Save className="w-4 h-4" />
                Save All
              </button>
            )}
            <button
              onClick={handleAddProgram}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              Add Program
            </button>
          </div>
        </div>

        <SearchBar query={searchQuery} onChange={setSearchQuery} />

        {/* Programs Display */}
        {filteredPrograms?.length === 0 ? (
          <div className="py-20">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Leaf className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              {programs.length === 0 ? 'No Programs Yet' : 'No Programs Found'}
            </h3>
            <p className="text-slate-500 mb-6">
              {programs.length === 0
                ? 'Start by adding your first sustainability program'
                : 'Try adjusting your search'}
            </p>
            {programs.length === 0 && (
              <button
                onClick={handleAddProgram}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Your First Program
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPrograms?.map((program) => (
              <ProgramCard
                key={program._id}
                program={program}
                onEdit={openEdit}
                onDuplicate={duplicateProgram}
                onDelete={handleDeleteProgram}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button (Mobile) */}
      <button
        onClick={handleAddProgram}
        className="fixed right-6 bottom-6 sm:hidden w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-2xl hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-[40]"
        aria-label="Add Program"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Edit/Create Modal */}
      <ProgramModal
        isOpen={isModalOpen}
        onClose={closeModal}
        formData={formData}
        onTitleChange={handleTitleChange}
        onCategoryChange={handleCategoryChange}
        addItem={addItem}
        updateItem={updateItem}
        removeItem={removeItem}
        saveEdit={saveEdit}
        editingProgram={editingProgram}
        categories={categories}
      />
      <ConfirmModal
        isOpen={!!deleteTarget}
        title={deleteTarget ? `Delete "${deleteTarget.title}"?` : undefined}
        description={
          deleteTarget ? (
            <div>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete{' '}
                <strong className="font-semibold">{deleteTarget.title}</strong>?
              </p>
              <p className="text-xs text-red-700 mt-2">
                This action cannot be undone.
              </p>
            </div>
          ) : undefined
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={isDeletingProgram}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteProgram}
      />
    </div>
  );
}
