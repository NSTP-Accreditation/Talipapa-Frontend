import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { createPortal } from 'react-dom';
import {
  BookOpen,
  FileText,
  Tag,
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
  Clock,
} from 'lucide-react';

interface Step {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
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
  // onSave may be async; second arg opts.keepOpen indicates whether parent should keep modal open after save
  onSave: (
    guideline: Guideline,
    opts?: { keepOpen?: boolean }
  ) => Promise<any> | void;
}

interface StepFormData {
  title: string;
  description: string;
  requiredDocuments: string;
  estimatedTime: string;
  tips: string;
}

const GuidelineEditModal: React.FC<EditModalProps> = ({
  guideline,
  isOpen,
  onClose,
  onSave,
}) => {
  const toast = useToast();
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
    requiredDocuments: '',
    estimatedTime: '',
    tips: '',
  });

  useEffect(() => {
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

    const renumberedSteps = steps.map((step, i) => ({
      ...step,
      stepNumber: i + 1,
    }));

    setFormData({
      ...formData,
      steps: renumberedSteps,
    });
  };

  const handleSave = async () => {
    const errors: string[] = [];

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
      toast.error(
        'Please fix the following errors:\n\n• ' + errors.join('\n• ')
      );
      return;
    }

    const updatedGuideline = {
      ...formData,
      lastUpdated: new Date().toISOString(),
    };

    const isCreate = !updatedGuideline.id;

    try {
      // call parent's onSave and await when it's async
      const result = onSave(updatedGuideline, { keepOpen: isCreate });
      if (result && typeof (result as Promise<any>).then === 'function') {
        await result;
      }

      // If it was a create and parent opted to keep open, reset the form so user can add another
      if (isCreate) {
        // Reset internal form for a fresh create
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
        setEditingStepIndex(null);
        resetStepForm();
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to save guideline';
      toast.error(msg);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-[900px] w-full max-h-[95vh] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="relative p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
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
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
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
                    Category <span className="text-red-500">*</span>
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
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
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
                    Total Estimated Time
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.totalEstimatedTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalEstimatedTime: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                    placeholder="e.g., 2-3 days"
                  />
                </div>
              </div>
            </div>

            {/* Steps editor */}
            <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl border-2 border-gray-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Steps
                </h3>
              </div>

              <div className="space-y-4">
                {formData.steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="p-3 bg-white rounded-xl border-2 border-gray-100 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-green-100 to-green-200 text-green-700 font-bold">
                            {step.stepNumber}
                          </div>
                          <h4 className="font-bold text-gray-900">
                            {step.title}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {step.description}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {step.requiredDocuments?.map((d) => (
                            <span
                              key={d}
                              className="px-2 py-1 bg-gray-50 rounded-full text-gray-700 border"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => moveStep(idx, 'up')}
                            className="p-2 bg-gray-50 rounded-lg"
                          >
                            <ChevronUp />
                          </button>
                          <button
                            onClick={() => moveStep(idx, 'down')}
                            className="p-2 bg-gray-50 rounded-lg"
                          >
                            <ChevronDown />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingStepIndex(idx);
                              handleEditStep(idx);
                            }}
                            className="p-2 bg-white border rounded-lg"
                          >
                            <Edit2 />
                          </button>
                          <button
                            onClick={() => handleDeleteStep(idx)}
                            className="p-2 bg-white border rounded-lg"
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Step form */}
                <div className="p-3 bg-white rounded-xl border-2 border-dashed border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      required
                      type="text"
                      placeholder="Step title"
                      value={stepFormData.title}
                      onChange={(e) =>
                        setStepFormData({
                          ...stepFormData,
                          title: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded-lg"
                    />
                    {/* removed location field (no longer used) */}
                    <textarea
                      required
                      placeholder="Description"
                      value={stepFormData.description}
                      onChange={(e) =>
                        setStepFormData({
                          ...stepFormData,
                          description: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded-lg col-span-full"
                    />
                    <input
                      type="text"
                      placeholder="Required documents (comma separated)"
                      value={stepFormData.requiredDocuments}
                      onChange={(e) =>
                        setStepFormData({
                          ...stepFormData,
                          requiredDocuments: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded-lg col-span-full"
                    />
                    <input
                      type="text"
                      placeholder="Estimated time"
                      value={stepFormData.estimatedTime}
                      onChange={(e) =>
                        setStepFormData({
                          ...stepFormData,
                          estimatedTime: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Tips (comma separated)"
                      value={stepFormData.tips}
                      onChange={(e) =>
                        setStepFormData({
                          ...stepFormData,
                          tips: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div className="mt-3 flex gap-2 justify-end">
                    {editingStepIndex === null ? (
                      <button
                        onClick={handleAddStep}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg"
                      >
                        Add step
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleUpdateStep}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                          Update step
                        </button>
                        <button
                          onClick={() => {
                            setEditingStepIndex(null);
                            resetStepForm();
                          }}
                          className="px-4 py-2 bg-gray-200 rounded-lg"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {/* Info Note */}
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-green-800 font-medium">
                      <span className="font-bold">Note:</span> Fields marked
                      with <span className="text-red-500 font-bold">*</span> are
                      required. Please ensure all information is accurate before
                      submitting.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Save Guideline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GuidelineEditModal;
