import React, { useEffect, useState } from 'react';
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
    const program = programs.find((p) => p._id === id);
    if (
      program &&
      confirm(`Are you sure you want to delete "${program.title}"?`)
    ) {
      try {
        const res = await authFetch(`/talipapanatin/${id}`, {
          method: 'DELETE',
        });

        setHasUnsavedChanges(true);
        success(res.message, { title: 'Deleted' });
        refetchPrograms();
      } catch (error) {
        console.error('Error deleting program:', error);
        showError('Error deleting program. Please try again.', {
          title: 'Delete failed',
        });
      }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-[50] bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1b4c2e] to-[#2d5a3d] flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                  TalipapaNatin Program
                </h1>
                <p className="text-sm text-slate-600 font-medium">
                  "May Buhay sa Basura ng Barangay" - Community Sustainability
                  Programs
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {hasUnsavedChanges && (
                <button
                  onClick={handleSaveAll}
                  className="px-4 py-2 bg-gradient-to-r from-[#1b4c2e] to-[#2d5a3d] hover:from-[#2d5a3d] hover:to-[#1b4c2e] text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm font-semibold"
                >
                  <Save className="w-4 h-4" />
                  Save All
                </button>
              )}

              <button
                onClick={handleAddProgram}
                className="px-4 py-2 bg-gradient-to-r from-[#1b4c2e] to-[#2d5a3d] hover:from-[#2d5a3d] hover:to-[#1b4c2e] text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add Program
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <SearchBar query={searchQuery} onChange={setSearchQuery} />
        <div className="mb-6">
          <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium inline-block">
            {filteredPrograms?.length} program
            {filteredPrograms?.length !== 1 ? 's' : ''}
          </div>
        </div>

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
                className="px-6 py-3 bg-gradient-to-r from-[#1b4c2e] to-[#2d5a3d] hover:from-[#2d5a3d] hover:to-[#1b4c2e] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
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
        className="fixed right-6 bottom-6 sm:hidden w-14 h-14 rounded-full bg-gradient-to-br from-[#1b4c2e] to-[#2d5a3d] hover:from-[#2d5a3d] hover:to-[#1b4c2e] text-white shadow-2xl hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-[40]"
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
    </div>
  );
}
