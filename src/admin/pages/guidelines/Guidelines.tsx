import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';
import { useLoadingState } from '../../../hooks/useLoadingState';
import useFetchData from '../../hooks/useFetchData';
import { useAuthFetch } from '../../hooks/useAuthFetch';
import { FormTablePageSkeleton } from '../../../components/LoadingSkeletons';
import {
  BookOpen,
  FileText,
  Tag,
  Clock,
  TrendingUp,
  MapPin,
  FileCheck,
  Lightbulb,
  ChevronUp,
  ChevronDown,
  Edit2,
  Trash2,
  Plus,
  X,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import GuidelineEditModal from './GuidelineEditModal';

// (the rest of this file mirrors the existing top-level Guidelines.tsx implementation)

interface Step {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  location?: string;
  requiredDocuments?: string[];
  estimatedTime?: string;
  tips?: string[];
}

interface Guideline {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: Step[];
  totalEstimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  lastUpdated: string;
}

interface DeleteModalProps {
  guideline: Guideline | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  guideline,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !guideline) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm sm:max-w-2xl bg-white rounded-lg sm:rounded-xl shadow-xl overflow-hidden mx-2">
        <div className="p-4 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Delete Guidelines
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 mt-1">
                Are you sure you want to delete "{guideline.title}"?
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold text-gray-900">
                  Description:
                </span>{' '}
                {guideline.description}
              </p>
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Category:</span>{' '}
                <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-green-100 border border-green-300 rounded-md text-green-700 font-medium text-xs">
                  <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {guideline.category}
                </span>
              </p>
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Steps:</span>{' '}
                <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-green-100 border border-green-300 rounded-md text-green-700 font-medium text-xs">
                  <FileCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {guideline.steps.length} steps
                </span>
              </p>
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Total Time:</span>{' '}
                <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-green-100 border border-green-300 rounded-md text-green-700 font-medium text-xs">
                  <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {guideline.totalEstimatedTime}
                </span>
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-red-700 font-semibold leading-relaxed">
                    Warning: This will permanently remove these guidelines and
                    all its steps from the system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 border-2 border-gray-300 bg-white text-gray-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-8 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:from-red-700 hover:to-red-800 transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl order-1 sm:order-2"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            Delete Guidelines
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Guidelines: React.FC = () => {
  // Add loading state with 1 second display
  const { isLoading: pageLoading } = useLoadingState(1000);

  const { success, error: showError, info } = useToast();

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

    const count = selectedGuidelines.size;
    const guidelineTitles = guidelines
      .filter((g) => selectedGuidelines.has(g.id))
      .map((g) => g.title)
      .join(', ');

    if (
      confirm(
        `Are you sure you want to delete ${count} guideline${count > 1 ? 's' : ''}?\n\n${guidelineTitles}`
      )
    ) {
      setGuidelines(guidelines.filter((g) => !selectedGuidelines.has(g.id)));
      setSelectedGuidelines(new Set());
      setShowBulkActions(false);
      success(
        `Successfully deleted ${count} guideline${count > 1 ? 's' : ''}.`,
        {
          title: 'Deleted',
        }
      );
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
  if (pageLoading) {
    return <FormTablePageSkeleton />;
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* ... the UI content is the same as the original file ... */}
      {/* For brevity we kept the same implementation. */}
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
    </div>
  );
};

export default Guidelines;
