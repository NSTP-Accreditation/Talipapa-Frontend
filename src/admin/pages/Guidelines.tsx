import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../components/ui/card';
import { useLoadingState } from '../../hooks/useLoadingState';
import { FormTablePageSkeleton } from '../../components/LoadingSkeletons';
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

interface EditModalProps {
  guideline: Guideline | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (guideline: Guideline) => void;
}

interface DeleteModalProps {
  guideline: Guideline | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface StepFormData {
  title: string;
  description: string;
  location: string;
  requiredDocuments: string;
  estimatedTime: string;
  tips: string;
}

const EditModal: React.FC<EditModalProps> = ({
  guideline,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Guideline>({
    id: guideline?.id || '',
    title: guideline?.title || '',
    description: guideline?.description || '',
    category: guideline?.category || '',
    steps: guideline?.steps || [],
    totalEstimatedTime: guideline?.totalEstimatedTime || '',
    difficulty: guideline?.difficulty || 'Easy',
    lastUpdated: guideline?.lastUpdated || new Date().toISOString(),
  });

  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [stepFormData, setStepFormData] = useState<StepFormData>({
    title: '',
    description: '',
    location: '',
    requiredDocuments: '',
    estimatedTime: '',
    tips: '',
  });

  React.useEffect(() => {
    if (guideline) {
      setFormData(guideline);
    } else {
      const newGuideline = {
        id: '',
        title: '',
        description: '',
        category: '',
        steps: [],
        totalEstimatedTime: '',
        difficulty: 'Easy' as const,
        lastUpdated: new Date().toISOString(),
      };
      setFormData(newGuideline);
    }
    setEditingStepIndex(null);
    resetStepForm();
  }, [guideline]);

  const resetStepForm = () => {
    setStepFormData({
      title: '',
      description: '',
      location: '',
      requiredDocuments: '',
      estimatedTime: '',
      tips: '',
    });
  };

  const handleAddStep = () => {
    const newStep: Step = {
      id: Date.now().toString(),
      stepNumber: formData.steps.length + 1,
      title: stepFormData.title,
      description: stepFormData.description,
      location: stepFormData.location || undefined,
      requiredDocuments: stepFormData.requiredDocuments
        ? stepFormData.requiredDocuments
            .split(',')
            .map((doc) => doc.trim())
            .filter((doc) => doc)
        : undefined,
      estimatedTime: stepFormData.estimatedTime || undefined,
      tips: stepFormData.tips
        ? stepFormData.tips
            .split(',')
            .map((tip) => tip.trim())
            .filter((tip) => tip)
        : undefined,
    };

    setFormData({
      ...formData,
      steps: [...formData.steps, newStep],
    });
    resetStepForm();
  };

  const handleEditStep = (index: number) => {
    const step = formData.steps[index];
    setEditingStepIndex(index);
    setStepFormData({
      title: step.title,
      description: step.description,
      location: step.location || '',
      requiredDocuments: step.requiredDocuments?.join(', ') || '',
      estimatedTime: step.estimatedTime || '',
      tips: step.tips?.join(', ') || '',
    });
  };

  const handleUpdateStep = () => {
    if (editingStepIndex === null) return;

    const updatedStep: Step = {
      id: formData.steps[editingStepIndex].id,
      stepNumber: formData.steps[editingStepIndex].stepNumber,
      title: stepFormData.title,
      description: stepFormData.description,
      location: stepFormData.location || undefined,
      requiredDocuments: stepFormData.requiredDocuments
        ? stepFormData.requiredDocuments
            .split(',')
            .map((doc) => doc.trim())
            .filter((doc) => doc)
        : undefined,
      estimatedTime: stepFormData.estimatedTime || undefined,
      tips: stepFormData.tips
        ? stepFormData.tips
            .split(',')
            .map((tip) => tip.trim())
            .filter((tip) => tip)
        : undefined,
    };

    const updatedSteps = [...formData.steps];
    updatedSteps[editingStepIndex] = updatedStep;

    setFormData({
      ...formData,
      steps: updatedSteps,
    });

    setEditingStepIndex(null);
    resetStepForm();
  };

  const handleDeleteStep = (index: number) => {
    const updatedSteps = formData.steps.filter((_, i) => i !== index);
    // Renumber steps
    const renumberedSteps = updatedSteps.map((step, i) => ({
      ...step,
      stepNumber: i + 1,
    }));

    setFormData({
      ...formData,
      steps: renumberedSteps,
    });
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const steps = [...formData.steps];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= steps.length) return;

    [steps[index], steps[newIndex]] = [steps[newIndex], steps[index]];

    // Renumber steps
    const renumberedSteps = steps.map((step, i) => ({
      ...step,
      stepNumber: i + 1,
    }));

    setFormData({
      ...formData,
      steps: renumberedSteps,
    });
  };

  const handleSave = () => {
    // Enhanced validation
    const errors = [];

    if (!formData.title.trim()) {
      errors.push('Title is required');
    }

    if (!formData.description.trim()) {
      errors.push('Description is required');
    }

    if (!formData.category.trim()) {
      errors.push('Category is required');
    }

    if (formData.steps.length === 0) {
      errors.push('At least one step is required');
    }

    if (!formData.totalEstimatedTime.trim()) {
      errors.push('Total estimated time is required');
    }

    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n• ' + errors.join('\n• '));
      return;
    }

    const updatedGuideline = {
      ...formData,
      lastUpdated: new Date().toISOString(),
    };

    onSave(updatedGuideline);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-[900px] w-full max-h-[95vh] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-green-600 via-green-600 to-green-700">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center ring-2 ring-white/30">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                {guideline?.id ? 'Edit Guidelines' : 'Add New Guidelines'}
              </h2>
              <p className="text-xs sm:text-sm text-green-50 mt-0.5 sm:mt-1">
                {guideline?.id
                  ? 'Update step-by-step instructions'
                  : 'Create comprehensive step-by-step guide'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 ring-1 ring-white/30"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 max-h-[calc(95vh-200px)] overflow-y-auto">
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
            {/* Basic Information */}
            <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-green-50 to-white rounded-xl sm:rounded-2xl border-2 border-green-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Basic Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex flex-col">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                    placeholder="e.g., How to Get a Barangay Clearance"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm bg-white cursor-pointer focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                  >
                    <option value="">Select Category</option>
                    <option value="Clearances">Clearances</option>
                    <option value="Permits">Permits</option>
                    <option value="Certificates">Certificates</option>
                    <option value="Applications">Applications</option>
                    <option value="Services">Services</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col mb-3 sm:mb-4">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm resize-none focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                  placeholder="Brief description of what this guideline covers"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: e.target.value as
                          | 'Easy'
                          | 'Medium'
                          | 'Hard',
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm bg-white cursor-pointer focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                    Total Estimated Time *
                  </label>
                  <input
                    type="text"
                    value={formData.totalEstimatedTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalEstimatedTime: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                    placeholder="e.g., 2-3 hours"
                  />
                </div>
              </div>
            </div>

            {/* Steps Section */}
            <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-green-50 to-white rounded-xl sm:rounded-2xl border-2 border-green-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Step-by-Step Instructions
                </h3>
              </div>

              {/* Add/Edit Step Form */}
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 border-2 border-dashed border-green-300 hover:border-green-500 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    {editingStepIndex !== null ? (
                      <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                    ) : (
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                    )}
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-gray-700">
                    {editingStepIndex !== null
                      ? `Edit Step ${editingStepIndex + 1}`
                      : `Add Step ${formData.steps.length + 1}`}
                  </h4>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                      Step Title *
                    </label>
                    <input
                      type="text"
                      value={stepFormData.title}
                      onChange={(e) =>
                        setStepFormData({
                          ...stepFormData,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                      placeholder="e.g., Go to Barangay Hall"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                      Description *
                    </label>
                    <textarea
                      value={stepFormData.description}
                      onChange={(e) =>
                        setStepFormData({
                          ...stepFormData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm resize-none focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                      placeholder="Detailed instructions for this step"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex flex-col">
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={stepFormData.location}
                        onChange={(e) =>
                          setStepFormData({
                            ...stepFormData,
                            location: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                        placeholder="e.g., Barangay Hall, 2nd Floor"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                        Estimated Time
                      </label>
                      <input
                        type="text"
                        value={stepFormData.estimatedTime}
                        onChange={(e) =>
                          setStepFormData({
                            ...stepFormData,
                            estimatedTime: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                        placeholder="e.g., 15 minutes"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                      Required Documents (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={stepFormData.requiredDocuments}
                      onChange={(e) =>
                        setStepFormData({
                          ...stepFormData,
                          requiredDocuments: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                      placeholder="e.g., Valid ID, Cedula, Proof of Residency"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                      Tips (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={stepFormData.tips}
                      onChange={(e) =>
                        setStepFormData({
                          ...stepFormData,
                          tips: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                      placeholder="e.g., Bring exact change, Come early to avoid lines"
                    />
                  </div>
                </div>

                <div className="flex gap-2 sm:gap-3 justify-start mt-4">
                  {editingStepIndex !== null ? (
                    <>
                      <button
                        type="button"
                        onClick={handleUpdateStep}
                        className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg sm:rounded-xl text-sm font-semibold hover:from-green-700 hover:to-green-800 transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          !stepFormData.title.trim() ||
                          !stepFormData.description.trim()
                        }
                      >
                        <Edit2 className="w-4 h-4" />
                        Update Step
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingStepIndex(null);
                          resetStepForm();
                        }}
                        className="px-4 sm:px-5 py-2.5 sm:py-3 border-2 border-gray-300 bg-white text-gray-700 rounded-lg sm:rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg sm:rounded-xl text-sm font-semibold hover:from-green-700 hover:to-green-800 transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        !stepFormData.title.trim() ||
                        !stepFormData.description.trim()
                      }
                    >
                      <Plus className="w-4 h-4" />
                      Add Step
                    </button>
                  )}
                </div>
              </div>

              {/* Steps List */}
              {formData.steps.length > 0 && (
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-gray-700">
                      Steps ({formData.steps.length})
                    </h4>
                  </div>
                  {formData.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="border-2 border-gray-200 rounded-lg sm:rounded-xl mb-3 last:mb-0 overflow-hidden hover:border-green-500 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center p-3 sm:p-4 bg-gradient-to-r from-green-50 to-white border-b-2 border-green-100 gap-2 sm:gap-3">
                        <div className="bg-gradient-to-br from-green-600 to-green-700 text-white w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 shadow-md">
                          {step.stepNumber}
                        </div>
                        <div className="flex-1 font-bold text-gray-800 min-w-0 text-sm sm:text-base">
                          {step.title}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => moveStep(index, 'up')}
                            disabled={index === 0}
                            className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-gray-300 bg-white rounded-lg hover:bg-gray-50 hover:border-gray-400 cursor-pointer flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Move Up"
                          >
                            <ChevronUp className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => moveStep(index, 'down')}
                            disabled={index === formData.steps.length - 1}
                            className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-gray-300 bg-white rounded-lg hover:bg-gray-50 hover:border-gray-400 cursor-pointer flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Move Down"
                          >
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleEditStep(index)}
                            className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-green-300 bg-white rounded-lg hover:bg-green-50 hover:border-green-500 cursor-pointer flex items-center justify-center transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteStep(index)}
                            className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-red-300 bg-white rounded-lg hover:bg-red-50 hover:border-red-500 cursor-pointer flex items-center justify-center transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3 sm:p-4">
                        <p className="text-sm text-gray-700 mb-2">
                          {step.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {step.location && (
                            <div className="inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1.5 rounded-lg">
                              <MapPin className="w-3 h-3" />
                              {step.location}
                            </div>
                          )}
                          {step.estimatedTime && (
                            <div className="inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1.5 rounded-lg">
                              <Clock className="w-3 h-3" />
                              {step.estimatedTime}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 bg-white text-gray-700 rounded-lg sm:rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg sm:rounded-xl text-sm font-bold hover:from-green-700 hover:to-green-800 transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl order-1 sm:order-2"
          >
            <FileCheck className="w-4 h-4" />
            {guideline?.id ? 'Update Guidelines' : 'Create Guidelines'}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  guideline,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !guideline) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-[480px] w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-red-600 via-red-600 to-red-700">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center ring-2 ring-white/30">
              <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Delete Guidelines
              </h2>
              <p className="text-xs sm:text-sm text-red-50 mt-0.5 sm:mt-1">
                This action cannot be undone
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 ring-1 ring-white/30"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8">
          <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-5 leading-relaxed">
            Are you sure you want to delete the guidelines{' '}
            <strong className="text-red-600">"{guideline.title}"</strong>?
          </p>

          <div className="bg-gradient-to-r from-green-50 to-green-50 border-2 border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">
                Guidelines Details
              </h4>
            </div>
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold text-gray-900">
                  Description:
                </span>{' '}
                {guideline.description}
              </p>
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Category:</span>{' '}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 border border-green-300 rounded-md text-green-700 font-medium">
                  <Tag className="w-3 h-3" />
                  {guideline.category}
                </span>
              </p>
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Steps:</span>{' '}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 border border-green-300 rounded-md text-green-700 font-medium">
                  <FileCheck className="w-3 h-3" />
                  {guideline.steps.length} steps
                </span>
              </p>
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Total Time:</span>{' '}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 border border-green-300 rounded-md text-green-700 font-medium">
                  <Clock className="w-3 h-3" />
                  {guideline.totalEstimatedTime}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-50 border-2 border-red-200 rounded-xl sm:rounded-2xl p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-red-700 font-semibold leading-relaxed">
                  Warning: This will permanently remove these guidelines and all
                  its steps from the system.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
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
            Delete Guidelines
          </button>
        </div>
      </div>
    </div>
  );
};

const Guidelines: React.FC = () => {
  // Add loading state with 1 second display
  const { isLoading: pageLoading } = useLoadingState(1000);

  const [guidelines, setGuidelines] = useState<Guideline[]>([
    {
      id: '1',
      title: 'How to Get a Barangay Clearance',
      description:
        'Step-by-step guide for obtaining a barangay clearance certificate',
      category: 'Clearances',
      totalEstimatedTime: '1-2 hours',
      difficulty: 'Easy',
      lastUpdated: '2024-10-01T10:00:00.000Z',
      steps: [
        {
          id: '1-1',
          stepNumber: 1,
          title: 'Prepare Required Documents',
          description:
            'Gather all necessary documents before going to the barangay hall.',
          requiredDocuments: ['Valid ID', 'Cedula', 'Proof of Residency'],
          estimatedTime: '15 minutes',
          tips: [
            'Make photocopies of all documents',
            'Bring originals for verification',
          ],
        },
        {
          id: '1-2',
          stepNumber: 2,
          title: 'Go to Barangay Hall',
          description:
            'Visit the barangay hall during office hours to submit your application.',
          location: 'Barangay Hall, Ground Floor',
          estimatedTime: '30 minutes',
          tips: [
            'Come early to avoid long lines',
            'Bring exact change for fees',
          ],
        },
        {
          id: '1-3',
          stepNumber: 3,
          title: 'Fill Out Application Form',
          description:
            'Complete the barangay clearance application form with accurate information.',
          location: 'Information Desk',
          estimatedTime: '10 minutes',
          tips: ['Write clearly and legibly', 'Double-check all information'],
        },
        {
          id: '1-4',
          stepNumber: 4,
          title: 'Submit Documents and Pay Fee',
          description:
            'Submit your completed form and documents, then pay the required fee.',
          location: "Secretary's Office",
          estimatedTime: '15 minutes',
        },
        {
          id: '1-5',
          stepNumber: 5,
          title: 'Claim Your Clearance',
          description: 'Return to claim your barangay clearance certificate.',
          estimatedTime: '5 minutes',
          tips: [
            'Bring your receipt',
            'Processing usually takes 1-2 working days',
          ],
        },
      ],
    },
    {
      id: '2',
      title: 'How to Apply for Business Permit',
      description: 'Complete guide for obtaining a barangay business permit',
      category: 'Permits',
      totalEstimatedTime: '3-4 hours',
      difficulty: 'Medium',
      lastUpdated: '2024-09-28T14:30:00.000Z',
      steps: [
        {
          id: '2-1',
          stepNumber: 1,
          title: 'Prepare Business Documents',
          description: 'Gather all required business registration documents.',
          requiredDocuments: [
            'DTI Registration',
            'SEC Registration (if corporation)',
            'Valid ID',
            'Barangay Clearance',
          ],
          estimatedTime: '30 minutes',
        },
        {
          id: '2-2',
          stepNumber: 2,
          title: 'Complete Application Form',
          description:
            'Fill out the business permit application form completely.',
          location: 'Business Permits Office',
          estimatedTime: '20 minutes',
        },
      ],
    },
  ]);

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
    if (deletingGuideline) {
      setGuidelines(guidelines.filter((g) => g.id !== deletingGuideline.id));
      setIsDeleteModalOpen(false);
      setDeletingGuideline(null);
      alert(
        `Guidelines "${deletingGuideline.title}" has been successfully deleted!`
      );
    }
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
      alert(`Successfully deleted ${count} guideline${count > 1 ? 's' : ''}.`);
    }
  };

  const handleAddGuideline = () => {
    setEditingGuideline(null);
    setIsModalOpen(true);
  };

  const handleSaveGuideline = (updatedGuideline: Guideline) => {
    // Check for duplicate titles (case insensitive)
    const existingTitles = guidelines
      .filter((g) => g.id !== updatedGuideline.id) // Exclude current guideline if editing
      .map((g) => g.title.toLowerCase().trim());

    const newTitle = updatedGuideline.title.toLowerCase().trim();

    if (existingTitles.includes(newTitle)) {
      alert(
        'A guideline with this title already exists. Please choose a different title.'
      );
      return;
    }

    if (
      updatedGuideline.id &&
      guidelines.find((g) => g.id === updatedGuideline.id)
    ) {
      // Update existing guideline
      setGuidelines(
        guidelines.map((g) =>
          g.id === updatedGuideline.id ? updatedGuideline : g
        )
      );
      alert(
        `Guidelines "${updatedGuideline.title}" has been successfully updated!`
      );
    } else {
      // Add new guideline
      const newGuideline = {
        ...updatedGuideline,
        id: Date.now().toString(),
        lastUpdated: new Date().toISOString(),
      };
      setGuidelines([...guidelines, newGuideline]);
      alert(
        `New guidelines "${updatedGuideline.title}" has been successfully created!`
      );
    }

    setIsModalOpen(false);
    setEditingGuideline(null);

    // Clear any selected items when adding/editing
    setSelectedGuidelines(new Set());
    setShowBulkActions(false);
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
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Header with enhanced styling */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-4xl">📖</span>
              Guidelines
            </h1>
            <p className="text-lg text-gray-700 mt-2 font-medium">
              Step-by-step instructions for barangay services
              <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {guidelines.length}{' '}
                {guidelines.length === 1 ? 'Guide' : 'Guides'}
              </span>
            </p>
          </div>

          {/* Bulk Actions */}
          {showBulkActions && (
            <div className="flex items-center gap-3 ml-8 px-4 py-2 bg-blue-50 border-2 border-blue-300 rounded-xl shadow-sm animate-in slide-in-from-left duration-300">
              <span className="text-sm font-semibold text-blue-900">
                {selectedGuidelines.size} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Selected
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleAddGuideline}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Guidelines
        </button>
      </div>

      {/* Enhanced Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search guidelines by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-700 font-medium min-w-[200px] cursor-pointer hover:border-green-400 transition-all"
            >
              <option value="">📂 All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-700 font-medium min-w-[180px] cursor-pointer hover:border-green-400 transition-all"
            >
              <option value="">⚡ All Difficulties</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || filterCategory || filterDifficulty) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('');
                setFilterDifficulty('');
              }}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear
            </button>
          )}
        </div>

        {/* Results Count */}
        {(searchTerm || filterCategory || filterDifficulty) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing{' '}
              <span className="font-semibold text-green-600">
                {filteredGuidelines.length}
              </span>{' '}
              of {guidelines.length} guidelines
              {searchTerm && (
                <span className="ml-2">
                  matching "<span className="font-semibold">{searchTerm}</span>"
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Guidelines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGuidelines.map((guideline) => (
          <Card
            key={guideline.id}
            className="bg-white border-2 border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-green-300 group cursor-pointer overflow-hidden flex flex-col"
          >
            <CardHeader className="pb-4 bg-gradient-to-br from-white to-gray-50 group-hover:from-green-50 group-hover:to-white transition-all duration-300">
              {/* Flex container with checkbox on right */}
              <div className="flex items-start justify-between gap-3">
                {/* Left side: Icon + title */}
                <div className="flex items-start gap-3 pl-1">
                  {/* Enhanced Icon Container with gradient */}
                  <div
                    className="bg-gradient-to-br from-green-100 to-green-200 p-1.5 rounded-xl flex items-center justify-center flex-shrink-0 mr-2 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300 shadow-sm"
                    style={{ width: '40px', height: '40px' }}
                  >
                    <svg
                      className="text-green-700 group-hover:scale-110 transition-transform duration-300"
                      style={{ width: '24px', height: '24px' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>

                  {/* Title and Enhanced Tags */}
                  <div className="flex-1 min-w-0 pl-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-green-600 transition-colors duration-300">
                      {guideline.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200">
                        📂 {guideline.category}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          guideline.difficulty === 'Easy'
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : guideline.difficulty === 'Medium'
                              ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                              : 'bg-red-100 text-red-700 border border-red-200'
                        }`}
                      >
                        {guideline.difficulty === 'Easy' && '⚡'}
                        {guideline.difficulty === 'Medium' && '⚡⚡'}
                        {guideline.difficulty === 'Hard' && '⚡⚡⚡'}{' '}
                        {guideline.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkbox on right side */}
                <input
                  type="checkbox"
                  checked={selectedGuidelines.has(guideline.id)}
                  onChange={() => handleSelectGuideline(guideline.id)}
                  className="w-5 h-5 rounded-md border-2 border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500 cursor-pointer transition-all hover:border-green-500"
                />
              </div>
            </CardHeader>

            <CardContent className="pt-2 flex-1 flex flex-col">
              <div className="flex flex-col h-full">
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 mb-4">
                  {guideline.description}
                </p>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                      <p className="text-xs font-semibold text-blue-700">
                        Steps
                      </p>
                    </div>
                    <p className="text-lg font-bold text-blue-900">
                      {guideline.steps.length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-xs font-semibold text-purple-700">
                        Time
                      </p>
                    </div>
                    <p className="text-lg font-bold text-purple-900">
                      {guideline.totalEstimatedTime}
                    </p>
                  </div>
                </div>

                {/* Enhanced Steps Preview */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 mb-4 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      📋 Steps Preview
                    </p>
                    {guideline.steps.length > 3 && (
                      <span className="text-xs text-gray-500 font-medium">
                        {guideline.steps.length} total
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {guideline.steps.slice(0, 3).map((step, index) => (
                      <div
                        key={step.id}
                        className="flex items-start gap-2.5 bg-white rounded-lg p-2 border border-gray-200 hover:border-green-300 transition-all"
                      >
                        <span className="bg-gradient-to-br from-green-500 to-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">
                          {step.stepNumber}
                        </span>
                        <span className="text-xs text-gray-700 font-medium leading-snug flex-1">
                          {step.title}
                        </span>
                      </div>
                    ))}
                    {guideline.steps.length > 3 && (
                      <div className="text-xs text-gray-500 font-medium ml-8 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        +{guideline.steps.length - 3} more steps
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Action Buttons - Fixed at Bottom */}
                <div className="space-y-2.5 pt-4 mt-auto border-t-2 border-gray-200">
                  <button
                    onClick={() => {
                      // In a real app, this would open a detailed view
                      alert(`Opening detailed view for: ${guideline.title}`);
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Step-by-Step Guide
                  </button>

                  <div className="flex gap-2.5">
                    <button
                      onClick={() => handleEdit(guideline.id)}
                      className="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:shadow-md"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(guideline.id)}
                      className="px-4 py-2.5 text-red-600 hover:text-white hover:bg-red-600 rounded-xl transition-all border-2 border-red-300 hover:border-red-600 font-semibold hover:shadow-md"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Empty State */}
      {filteredGuidelines.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6">
            <svg
              className="h-12 w-12 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No guidelines found
          </h3>
          <p className="text-base text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm || filterCategory || filterDifficulty
              ? "Try adjusting your search or filter criteria to find what you're looking for."
              : 'Get started by creating your first step-by-step guideline for barangay services.'}
          </p>
          {!searchTerm && !filterCategory && !filterDifficulty && (
            <div className="mt-8">
              <button
                onClick={handleAddGuideline}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl flex items-center gap-3 text-base font-bold mx-auto shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Your First Guidelines
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      <EditModal
        guideline={editingGuideline}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveGuideline}
      />

      {/* Delete Modal */}
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
