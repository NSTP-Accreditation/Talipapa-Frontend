import React, { useEffect, useState } from 'react';
import { useLoadingState } from '@/hooks/useLoadingState';
import useFetchData from '@/admin/hooks/useFetchData';
import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import { FormTablePageSkeleton } from '@/components/LoadingSkeletons';
import { useToast } from '@/hooks/useToast';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import GuidelineEditModal from './GuidelineEditModal';
import GuidelinesFilters from './components/GuidelinesFilters';
import GuidelinesList from './components/GuidelinesList';
import EmptyState from './components/EmptyState';
import DeleteModal from './components/DeleteModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { Guideline } from './types';

const Guidelines: React.FC = () => {
  // Add loading state with 1 second display
  const { isLoading: pageLoading } = useLoadingState(1000);

  const { success, error: showError } = useToast();

  // fetch guidelines from backend
  const {
    data: guidelinesData,
    loading: guidelinesLoading,
    error: guidelinesError,
    refetch: refetchGuidelines,
  } = useFetchData('/guidelines');

  const [guidelines, setGuidelines] = useState<Guideline[]>([]);

  // map server response to local Guideline model
  useEffect(() => {
    if (!guidelinesData) return;

    try {
      const mapped: Guideline[] = guidelinesData.map((g: any) => ({
        id: g._id,
        title: g.title,
        description: g.description,
        category: g.category,
        totalEstimatedTime: g.totalEstimatedTime || g.total_time || '',
        difficulty: g.difficulty || 'Easy',
        lastUpdated: g.lastUpdated || g.createdAt || new Date().toISOString(),
        steps: (g.steps || []).map((s: any, idx: number) => ({
          id: s._id || `${g._id}-step-${idx}`,
          stepNumber: s.stepNumber || idx + 1,
          title: s.title || s.name || '',
          description: s.description || '',
          requiredDocuments: s.requiredDocuments || s.required_docs,
          estimatedTime: s.estimatedTime || s.estimated_time,
          tips: s.tips || undefined,
        })),
      }));

      setGuidelines(mapped);
    } catch (err) {
      // fallback: set raw data as guidelines when mapping fails
      setGuidelines(guidelinesData as any[]);
    }
  }, [guidelinesData]);

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
    const guideline = guidelines.find((g) => g.id === guidelineId);
    if (guideline) {
      setEditingGuideline(guideline);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (guidelineId: string) => {
    const guideline = guidelines.find((g) => g.id === guidelineId);
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
        await authFetch(`/guidelines/${deletingGuideline.id}`, {
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
    // open a shared ConfirmModal for bulk delete
    setIsBulkConfirmOpen(true);
  };

  const confirmBulkDelete = () => {
    const count = selectedGuidelines.size;
    setGuidelines(guidelines.filter((g) => !selectedGuidelines.has(g.id)));
    setSelectedGuidelines(new Set());
    setShowBulkActions(false);
    setIsBulkConfirmOpen(false);
    success(`Successfully deleted ${count} guideline${count > 1 ? 's' : ''}.`, {
      title: 'Deleted',
    });
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
    opts?: { keepOpen?: boolean }
  ) => {
    try {
      const payload = buildGuidelinePayload(updatedGuideline);

      if (
        updatedGuideline.id &&
        guidelines.find((g) => g.id === updatedGuideline.id)
      ) {
        // Update existing guideline using PUT
        await authFetch(`/guidelines/${updatedGuideline.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
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
        success(
          `New guidelines "${updatedGuideline.title}" has been successfully created!`,
          { title: 'Created' }
        );
      }

      // refresh list
      await refetchGuidelines();

      // If parent requested to keep the modal open (for creating multiple), do not close
      const keepOpen = opts?.keepOpen === true;
      if (!keepOpen) {
        setIsModalOpen(false);
        setEditingGuideline(null);
      } else {
        // keep modal open but reset editingGuideline so the modal treats as create
        setEditingGuideline(null);
      }

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [
    'Clearances',
    'Permits',
    'Certificates',
    'Applications',
    'Services',
  ];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  // Show loading skeleton while loading
  if (pageLoading) return <FormTablePageSkeleton />;

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Page header (restored to earlier larger style) */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-green-600" />
            Guidelines
          </h1>
          <p className="text-md text-gray-700 mt-3 font-medium">
            Step-by-step guides and barangay service instructions
            <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {guidelines.length} {guidelines.length === 1 ? 'Guide' : 'Guides'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {showBulkActions && (
            <button
              onClick={handleBulkDelete}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected ({selectedGuidelines.size})
            </button>
          )}

          <button
            onClick={handleAddGuideline}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <Plus size={20} />
            Add Guideline
          </button>
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
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default Guidelines;
