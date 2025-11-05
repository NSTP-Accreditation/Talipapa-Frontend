import React, { useEffect, useState } from 'react';
import { useLoadingState } from '@/hooks/useLoadingState';
import useFetchData from '@/admin/hooks/useFetchData';
import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import { FormTablePageSkeleton } from '@/components/LoadingSkeletons';
import { useToast } from '@/hooks/useToast';
import { BookOpen, Plus, Trash2, FileText, Layers, Clock } from 'lucide-react';
import GuidelineEditModal from './GuidelineEditModal';
import GuidelinesFilters from './components/GuidelinesFilters';
import GuidelinesList from './components/GuidelinesList';
import EmptyState from './components/EmptyState';
import DeleteModal from './components/DeleteModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { Guideline } from './types';
import { PaginatedResponse } from '@/types/pagination';

const Guidelines: React.FC = () => {
  const { success, error: showError } = useToast();

  const {
    data: guidelinesData,
    loading: guidelinesLoading,
    error: guidelinesError,
    refetch: refetchGuidelines,
  } = useFetchData<PaginatedResponse<Guideline>>('/guidelines');

  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  
  useEffect(() => {
    if(guidelinesData && !guidelinesLoading && !guidelinesError) {
      setGuidelines(guidelinesData.data)
    }
  }, [guidelinesData, guidelinesLoading, guidelinesError]);

  const authFetch = useAuthFetch();

  const [editingGuideline, setEditingGuideline] = useState<Guideline | null>(
    null
  );
  const [deletingGuideline, setDeletingGuideline] = useState<Guideline | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGuidelines, setSelectedGuidelines] = useState<Set<string>>(
    new Set()
  );
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  // Filter guidelines based on search term, category, and difficulty
  const filteredGuidelines = guidelines.filter((guideline) => {
    const matchesSearch =
      guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guideline.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === '' || guideline.category === filterCategory;
    const matchesDifficulty =
      filterDifficulty === '' || guideline.difficulty === filterDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleEdit = (guidelineId: string) => {
    const guideline = guidelines.find((g) => g._id === guidelineId);
    if (guideline) {
      setEditingGuideline(guideline);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (guidelineId: string) => {
    const guideline = guidelines.find((g) => g._id === guidelineId);
    if (guideline) {
      setDeletingGuideline(guideline);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    const doDelete = async () => {
      if (!deletingGuideline) return;
      try {
        // call API to delete
        await authFetch(`/guidelines/${deletingGuideline._id}`, {
          method: 'DELETE',
        });
        await refetchGuidelines();
        setIsDeleteModalOpen(false);
        setDeletingGuideline(null);
        success(
          `Guidelines "${deletingGuideline.title}" has been successfully deleted!`,
          { title: 'Deleted' }
        );
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to delete guideline';
        showError(msg, { title: 'Delete failed' });
      }
    };

    doDelete();
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingGuideline(null);
  };

  const handleSelectGuideline = (guidelineId: string) => {
    const newSelected = new Set(selectedGuidelines);
    if (newSelected.has(guidelineId)) {
      newSelected.delete(guidelineId);
    } else {
      newSelected.add(guidelineId);
    }
    setSelectedGuidelines(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleBulkDelete = () => {
    if (selectedGuidelines.size === 0) return;
    setIsBulkConfirmOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (selectedGuidelines.size === 0) return;

    const ids = Array.from(selectedGuidelines.values());
    setIsBulkDeleting(true);

    try {
      await Promise.all(
        ids.map((id) =>
          authFetch(`/guidelines/${id}`, {
            method: 'DELETE',
          })
        )
      );

      // Refresh server data
      await refetchGuidelines();

      setSelectedGuidelines(new Set());
      setShowBulkActions(false);
      setIsBulkConfirmOpen(false);

      const count = ids.length;
      success(
        `Successfully deleted ${count} guideline${count > 1 ? 's' : ''}.`,
        {
          title: 'Deleted',
        }
      );
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to delete guidelines';
      showError(msg, { title: 'Delete failed' });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleAddGuideline = () => {
    setEditingGuideline(null);
    setIsModalOpen(true);
  };

  const buildGuidelinePayload = (g: Guideline) => {
    return {
      title: g.title,
      description: g.description,
      category: g.category,
      totalEstimatedTime: g.totalEstimatedTime,
      difficulty: g.difficulty,
      steps: g.steps.map((s) => ({
        stepNumber: s.stepNumber,
        title: s.title,
        description: s.description,
        requiredDocuments: s.requiredDocuments || [],
        estimatedTime: s.estimatedTime || '',
        tips: s.tips || [],
      })),
    };
  };

  const handleSaveGuideline = async (
    updatedGuideline: Guideline,
  ) => {
    try {
      const payload = buildGuidelinePayload(updatedGuideline);
      console.log(payload);
      
      if (
        updatedGuideline._id &&
        guidelines.find((g) => g._id === updatedGuideline._id)
      ) {
        // Update existing guideline using PUT
        await authFetch(`/guidelines/${updatedGuideline._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        // Close modal first before showing toast
        setIsModalOpen(false);
        setEditingGuideline(null);
        success(
          `Guidelines "${updatedGuideline.title}" has been successfully updated!`,
          { title: 'Updated' }
        );
      } else {
        // Create new guideline using POST
        await authFetch('/guidelines', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        // Close modal first before showing toast
        setIsModalOpen(false);
        setEditingGuideline(null);
        success(
          `New guidelines "${updatedGuideline.title}" has been successfully created!`,
          { title: 'Created' }
        );
      }

      // refresh list
      await refetchGuidelines();

      setSelectedGuidelines(new Set());
      setShowBulkActions(false);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to save guideline';
      showError(msg, { title: 'Save failed' });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGuideline(null);
  };

  const categories = [
    'Clearances',
    'Permits',
    'Certificates',
    'Applications',
    'Services',
  ];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  if (guidelinesLoading) return <FormTablePageSkeleton />;

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
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Guidelines
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-medium mb-4">
                  Step-by-step guides and barangay service instructions
                </p>

                {/* Quick Info Pills */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs sm:text-sm font-semibold text-green-700">
                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>
                      {guidelines.length}{' '}
                      {guidelines.length === 1 ? 'Guide' : 'Guides'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs sm:text-sm font-semibold text-blue-700">
                    <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Step-by-Step</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-xs sm:text-sm font-semibold text-purple-700">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Time Estimates</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {showBulkActions && (
                  <button
                    onClick={handleBulkDelete}
                    className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete ({selectedGuidelines.size})
                  </button>
                )}
                <button
                  onClick={handleAddGuideline}
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg sm:rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus size={20} />
                  Add Guideline
                </button>
              </div>
            </div>
          </div>
        </div>
        <GuidelinesFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterDifficulty={filterDifficulty}
          setFilterDifficulty={setFilterDifficulty}
          categories={categories}
          difficulties={difficulties}
        />

        {filteredGuidelines.length > 0 ? (
          <GuidelinesList
            guidelines={filteredGuidelines}
            selectedGuidelines={selectedGuidelines}
            onSelect={handleSelectGuideline}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <EmptyState
            onAdd={handleAddGuideline}
            searchActive={!!(searchTerm || filterCategory || filterDifficulty)}
          />
        )}

        <GuidelineEditModal
          guideline={editingGuideline}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveGuideline}
        />

        <DeleteModal
          guideline={deletingGuideline}
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />

        <ConfirmModal
          isOpen={isBulkConfirmOpen}
          title="Delete selected guidelines?"
          description={
            <p className="text-gray-700 text-base leading-relaxed">
              Are you sure you want to delete the selected guideline(s)? This
              action cannot be undone.
            </p>
          }
          onClose={() => setIsBulkConfirmOpen(false)}
          onConfirm={confirmBulkDelete}
          loading={isBulkDeleting}
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      </div>
    </div>
  );
};

export default Guidelines;
