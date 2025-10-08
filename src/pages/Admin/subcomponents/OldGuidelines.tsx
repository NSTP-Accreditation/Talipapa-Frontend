import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';
import './css/Guidelines.css';

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
  requirements: string[];
  processingTime: string;
  fee: string;
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
    requirements: guideline?.requirements || [],
    processingTime: guideline?.processingTime || '',
    fee: guideline?.fee || '',
  });

  const [requirementsText, setRequirementsText] = useState(
    guideline?.requirements?.join(', ') || ''
  );

  React.useEffect(() => {
    if (guideline) {
      setFormData(guideline);
      setRequirementsText(guideline.requirements.join(', '));
    } else {
      const newGuideline = {
        id: '',
        title: '',
        description: '',
        requirements: [],
        processingTime: '',
        fee: '',
      };
      setFormData(newGuideline);
      setRequirementsText('');
    }
  }, [guideline]);

  // Auto-format fee input
  const handleFeeChange = (value: string) => {
    // Remove non-numeric characters except decimal point
    let cleanValue = value.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // Add currency symbol
    if (cleanValue && !cleanValue.startsWith('₱')) {
      cleanValue = `₱ ${cleanValue}`;
    }

    setFormData({ ...formData, fee: cleanValue });
  };

  // Common requirements suggestions
  const commonRequirements = [
    'Valid ID',
    'Proof of Residency',
    'Community Tax Certificate',
    'Barangay ID',
    'Birth Certificate',
    'Marriage Certificate',
    'Business Registration',
    'Proof of Income',
    'Proof of Address',
    'Cedula',
  ];

  // Processing time suggestions
  const processingTimeOptions = [
    'Same day',
    '1-2 working days',
    '3-5 working days',
    '1 week',
    '2 weeks',
    '1 month',
  ];

  const handleSave = () => {
    // Enhanced validation
    const errors = [];

    if (!formData.title.trim()) {
      errors.push('Title is required');
    }

    if (!formData.description.trim()) {
      errors.push('Description is required');
    }

    if (!requirementsText.trim()) {
      errors.push('At least one requirement is required');
    }

    if (!formData.processingTime.trim()) {
      errors.push('Processing time is required');
    }

    if (!formData.fee.trim()) {
      errors.push('Fee is required');
    }

    // Check for duplicate titles (only for new guidelines)
    if (!guideline?.id) {
      // This will be handled by the parent component
    }

    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n• ' + errors.join('\n• '));
      return;
    }

    const updatedGuideline = {
      ...formData,
      requirements: requirementsText
        .split(',')
        .map((req) => req.trim())
        .filter((req) => req),
    };

    onSave(updatedGuideline);
  };

  if (!isOpen) return null;

  return (
    <div
      className="guidelines-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="guidelines-modal-content">
        {/* Header */}
        <div className="guidelines-modal-header">
          <h2 className="guidelines-modal-title">
            {guideline?.id ? 'Edit Guideline' : 'Add New Guideline'}
          </h2>
          <button onClick={onClose} className="guidelines-modal-close-btn">
            ✕
          </button>
        </div>

        {/* Form Content */}
        <div className="guidelines-modal-body">
          <div className="guidelines-form-container">
            <div className="guidelines-form-group">
              <label className="guidelines-form-label">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="guidelines-form-input"
                placeholder="Enter guideline title"
              />
            </div>

            <div className="guidelines-form-group">
              <label className="guidelines-form-label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="guidelines-form-textarea"
                placeholder="Enter guideline description"
              />
            </div>

            <div className="guidelines-form-group">
              <label className="guidelines-form-label">
                Requirements (comma-separated)
              </label>
              <textarea
                value={requirementsText}
                onChange={(e) => setRequirementsText(e.target.value)}
                rows={2}
                className="guidelines-form-textarea"
                placeholder="e.g., Valid ID, Proof of Residency, Community Tax"
              />
            </div>

            <div className="guidelines-form-group">
              <label className="guidelines-form-label">Processing Time</label>
              <input
                type="text"
                value={formData.processingTime}
                onChange={(e) =>
                  setFormData({ ...formData, processingTime: e.target.value })
                }
                className="guidelines-form-input"
                placeholder="e.g., 1-2 working days"
              />
            </div>

            <div className="guidelines-form-group">
              <label className="guidelines-form-label">Fee</label>
              <input
                type="text"
                value={formData.fee}
                onChange={(e) => handleFeeChange(e.target.value)}
                className="guidelines-form-input"
                placeholder="e.g., ₱ 50.00"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="guidelines-modal-footer">
          <button
            onClick={onClose}
            className="guidelines-btn guidelines-btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="guidelines-btn guidelines-btn-primary"
          >
            {guideline?.id ? 'Update' : 'Create'}
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
      className="guidelines-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="guidelines-delete-modal">
        {/* Header */}
        <div className="guidelines-delete-header">
          <div className="guidelines-delete-header-content">
            <div className="guidelines-delete-icon">
              <svg
                className="guidelines-delete-icon-svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h2 className="guidelines-delete-title">Delete Guideline</h2>
              <p className="guidelines-delete-subtitle">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="guidelines-delete-body">
          <p className="guidelines-delete-message">
            Are you sure you want to delete the guideline{' '}
            <strong>"{guideline.title}"</strong>?
          </p>

          <div className="guidelines-delete-details">
            <h4 className="guidelines-delete-details-title">
              Guideline Details:
            </h4>
            <p className="guidelines-delete-detail">
              <strong>Description:</strong> {guideline.description}
            </p>
            <p className="guidelines-delete-detail">
              <strong>Fee:</strong> {guideline.fee}
            </p>
            <p className="guidelines-delete-detail">
              <strong>Processing Time:</strong> {guideline.processingTime}
            </p>
          </div>

          <div className="guidelines-delete-warning">
            <div className="guidelines-delete-warning-content">
              <svg
                className="guidelines-delete-warning-icon"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="guidelines-delete-warning-text">
                Warning: This will permanently remove this guideline from the
                system.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="guidelines-modal-footer">
          <button
            onClick={onClose}
            className="guidelines-btn guidelines-btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="guidelines-btn guidelines-btn-danger"
          >
            Delete Guideline
          </button>
        </div>
      </div>
    </div>
  );
};

const Guidelines: React.FC = () => {
  const [guidelines, setGuidelines] = useState<Guideline[]>([
    {
      id: '1',
      title: 'Barangay Clearance',
      description:
        'Certificate of residency required for various transactions.',
      requirements: ['Valid ID', 'Proof of Residency', 'Community Tax'],
      processingTime: '1-2 working days',
      fee: '₱ 50.00',
    },
    {
      id: '2',
      title: 'Barangay Clearance',
      description:
        'Certificate of residency required for various transactions.',
      requirements: ['Valid ID', 'Proof of Residency', 'Community Tax'],
      processingTime: '1-2 working days',
      fee: '₱ 50.00',
    },
    {
      id: '3',
      title: 'Barangay Clearance',
      description:
        'Certificate of residency required for various transactions.',
      requirements: ['Valid ID', 'Proof of Residency', 'Community Tax'],
      processingTime: '1-2 working days',
      fee: '₱ 50.00',
    },
    {
      id: '4',
      title: 'Barangay Clearance',
      description:
        'Certificate of residency required for various transactions.',
      requirements: ['Valid ID', 'Proof of Residency', 'Community Tax'],
      processingTime: '1-2 working days',
      fee: '₱ 50.00',
    },
    {
      id: '5',
      title: 'Barangay Clearance',
      description:
        'Certificate of residency required for various transactions.',
      requirements: ['Valid ID', 'Proof of Residency', 'Community Tax'],
      processingTime: '1-2 working days',
      fee: '₱ 50.00',
    },
    {
      id: '6',
      title: 'Barangay Clearance',
      description:
        'Certificate of residency required for various transactions.',
      requirements: ['Valid ID', 'Proof of Residency', 'Community Tax'],
      processingTime: '1-2 working days',
      fee: '₱ 50.00',
    },
  ]);

  const [editingGuideline, setEditingGuideline] = useState<Guideline | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingGuideline, setDeletingGuideline] = useState<Guideline | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGuidelines, setSelectedGuidelines] = useState<Set<string>>(
    new Set()
  );
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

  const handleViewInstructions = (id: string) => {
    const guideline = guidelines.find((g) => g.id === id);
    if (guideline) {
      alert(
        `Instructions for ${guideline.title}:\n\n${guideline.description}\n\nRequirements: ${guideline.requirements.join(', ')}\nProcessing Time: ${guideline.processingTime}\nFee: ${guideline.fee}`
      );
    }
  };

  const handleEdit = (id: string) => {
    console.log('Edit clicked for ID:', id);
    const guideline = guidelines.find((g) => g.id === id);
    if (guideline) {
      console.log('Setting editing guideline:', guideline);
      setEditingGuideline(guideline);
      setIsModalOpen(true);
      console.log('Modal should be open now');
    }
  };

  const handleDelete = (id: string) => {
    console.log('Delete clicked for ID:', id);
    const guideline = guidelines.find((g) => g.id === id);
    if (guideline) {
      setDeletingGuideline(guideline);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingGuideline) {
      setGuidelines(
        guidelines.filter((guideline) => guideline.id !== deletingGuideline.id)
      );
      setIsDeleteModalOpen(false);
      setDeletingGuideline(null);
      // Show success message
      alert(
        `Guideline "${deletingGuideline.title}" has been successfully deleted.`
      );
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingGuideline(null);
  };

  const handleSelectGuideline = (id: string) => {
    const newSelected = new Set(selectedGuidelines);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
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
    console.log('Add guideline clicked');
    setEditingGuideline(null);
    setIsModalOpen(true);
    console.log('Modal should be open for new guideline');
  };

  const handleQuickAddGuideline = (template: Partial<Guideline>) => {
    const newGuideline: Guideline = {
      id: '',
      title: template.title || '',
      description: template.description || '',
      requirements: template.requirements || [],
      processingTime: template.processingTime || '',
      fee: template.fee || '',
    };
    setEditingGuideline(newGuideline);
    setIsModalOpen(true);
  };

  const guidelineTemplates = [
    {
      title: 'Business Permit',
      description:
        'Permit required for operating a business within the barangay.',
      requirements: [
        'Valid ID',
        'Business Registration',
        'Proof of Address',
        'Barangay Clearance',
      ],
      processingTime: '3-5 working days',
      fee: '₱ 200.00',
    },
    {
      title: 'Residence Certificate',
      description:
        'Certificate proving residency within the barangay for various purposes.',
      requirements: [
        'Valid ID',
        'Proof of Residency',
        'Community Tax Certificate',
      ],
      processingTime: '1-2 working days',
      fee: '₱ 30.00',
    },
    {
      title: 'Indigency Certificate',
      description:
        'Certificate for low-income residents to avail of government assistance.',
      requirements: ['Valid ID', 'Proof of Income', 'Barangay ID'],
      processingTime: '2-3 working days',
      fee: '₱ 25.00',
    },
  ];

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
        `Guideline "${updatedGuideline.title}" has been successfully updated!`
      );
    } else {
      // Add new guideline
      const newGuideline = {
        ...updatedGuideline,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setGuidelines([...guidelines, newGuideline]);
      alert(
        `New guideline "${updatedGuideline.title}" has been successfully created!`
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

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showTemplateDropdown && !target.closest('.template-dropdown')) {
        setShowTemplateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTemplateDropdown]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Guidelines</h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage barangay guidelines ({guidelines.length} total)
            </p>
          </div>

          {/* Bulk Actions */}
          {showBulkActions && (
            <div className="flex items-center gap-3 ml-8 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm font-medium text-blue-900">
                {selectedGuidelines.size} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium flex items-center gap-2"
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

        <div className="flex items-center gap-3">
          <div className="relative template-dropdown">
            <div className="flex">
              <button
                onClick={handleAddGuideline}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-l-md flex items-center gap-2 text-sm font-medium"
              >
                <span className="text-lg">+</span>
                Add Guideline
              </button>

              <button
                onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                className="bg-green-700 hover:bg-green-800 text-white px-2 py-2 rounded-r-md border-l border-green-600 text-sm"
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {showTemplateDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Quick Add Templates
                  </h3>
                  <p className="text-xs text-gray-600">
                    Choose a template to get started quickly
                  </p>
                </div>

                <div className="py-2">
                  {guidelineTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleQuickAddGuideline(template);
                        setShowTemplateDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-sm text-gray-900">
                        {template.title}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {template.description}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-green-600 font-medium">
                          {template.fee}
                        </span>
                        <span className="text-xs text-gray-500">
                          {template.processingTime}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => {
                      handleAddGuideline();
                      setShowTemplateDropdown(false);
                    }}
                    className="w-full text-center text-sm text-gray-600 hover:text-gray-800"
                  >
                    Create from scratch
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guidelines.map((guideline) => (
          <Card
            key={guideline.id}
            className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow mb-6 p-2"
          >
            <CardHeader className="pb-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedGuidelines.has(guideline.id)}
                    onChange={() => handleSelectGuideline(guideline.id)}
                    className="mr-3 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </div>
                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                    {guideline.title}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2 px-4 pb-4">
              <div className="space-y-5">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {guideline.description}
                </p>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Requirements:
                  </p>
                  <p className="text-sm text-gray-600">
                    {guideline.requirements.join(', ')}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Processing time:
                  </p>
                  <p className="text-sm text-gray-600">
                    {guideline.processingTime}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Fee:</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {guideline.fee}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 mt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleViewInstructions(guideline.id)}
                    className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded border border-gray-200 text-sm font-medium transition-colors flex items-center justify-center gap-2"
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Instructions
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(guideline.id)}
                      className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 px-4 rounded border border-gray-200 text-sm font-medium transition-colors flex items-center justify-center gap-2"
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
                      className="px-4 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded border border-gray-200 transition-colors"
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
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
