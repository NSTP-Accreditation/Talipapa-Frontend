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

const EditModal: React.FC<EditModalProps> = ({ guideline, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Guideline>({
    id: guideline?.id || '',
    title: guideline?.title || '',
    description: guideline?.description || '',
    category: guideline?.category || '',
    steps: guideline?.steps || [],
    totalEstimatedTime: guideline?.totalEstimatedTime || '',
    difficulty: guideline?.difficulty || 'Easy',
    lastUpdated: guideline?.lastUpdated || new Date().toISOString()
  });

  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [stepFormData, setStepFormData] = useState<StepFormData>({
    title: '',
    description: '',
    location: '',
    requiredDocuments: '',
    estimatedTime: '',
    tips: ''
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
        lastUpdated: new Date().toISOString()
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
      tips: ''
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
        ? stepFormData.requiredDocuments.split(',').map(doc => doc.trim()).filter(doc => doc)
        : undefined,
      estimatedTime: stepFormData.estimatedTime || undefined,
      tips: stepFormData.tips 
        ? stepFormData.tips.split(',').map(tip => tip.trim()).filter(tip => tip)
        : undefined
    };

    setFormData({
      ...formData,
      steps: [...formData.steps, newStep]
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
      tips: step.tips?.join(', ') || ''
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
        ? stepFormData.requiredDocuments.split(',').map(doc => doc.trim()).filter(doc => doc)
        : undefined,
      estimatedTime: stepFormData.estimatedTime || undefined,
      tips: stepFormData.tips 
        ? stepFormData.tips.split(',').map(tip => tip.trim()).filter(tip => tip)
        : undefined
    };

    const updatedSteps = [...formData.steps];
    updatedSteps[editingStepIndex] = updatedStep;

    setFormData({
      ...formData,
      steps: updatedSteps
    });
    
    setEditingStepIndex(null);
    resetStepForm();
  };

  const handleDeleteStep = (index: number) => {
    const updatedSteps = formData.steps.filter((_, i) => i !== index);
    // Renumber steps
    const renumberedSteps = updatedSteps.map((step, i) => ({
      ...step,
      stepNumber: i + 1
    }));

    setFormData({
      ...formData,
      steps: renumberedSteps
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
      stepNumber: i + 1
    }));

    setFormData({
      ...formData,
      steps: renumberedSteps
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
      lastUpdated: new Date().toISOString()
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
      <div className="guidelines-modal-content guidelines-large-modal">
        {/* Header */}
        <div className="guidelines-modal-header">
          <h2 className="guidelines-modal-title">
            {guideline?.id ? 'Edit Guidelines' : 'Add New Guidelines'}
          </h2>
          <button
            onClick={onClose}
            className="guidelines-modal-close-btn"
          >
            ✕
          </button>
        </div>
        
        {/* Form Content */}
        <div className="guidelines-modal-body">
          <div className="guidelines-form-container">
            {/* Basic Information */}
            <div className="guidelines-section">
              <h3 className="guidelines-section-title">Basic Information</h3>
              
              <div className="guidelines-form-row">
                <div className="guidelines-form-group">
                  <label className="guidelines-form-label">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="guidelines-form-input"
                    placeholder="e.g., How to Get a Barangay Clearance"
                  />
                </div>

                <div className="guidelines-form-group">
                  <label className="guidelines-form-label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="guidelines-form-select"
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

              <div className="guidelines-form-group">
                <label className="guidelines-form-label">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="guidelines-form-textarea"
                  placeholder="Brief description of what this guideline covers"
                />
              </div>

              <div className="guidelines-form-row">
                <div className="guidelines-form-group">
                  <label className="guidelines-form-label">Difficulty Level</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                    className="guidelines-form-select"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="guidelines-form-group">
                  <label className="guidelines-form-label">Total Estimated Time *</label>
                  <input
                    type="text"
                    value={formData.totalEstimatedTime}
                    onChange={(e) => setFormData({ ...formData, totalEstimatedTime: e.target.value })}
                    className="guidelines-form-input"
                    placeholder="e.g., 2-3 hours"
                  />
                </div>
              </div>
            </div>

            {/* Steps Section */}
            <div className="guidelines-section">
              <h3 className="guidelines-section-title">Steps</h3>
              
              {/* Add/Edit Step Form */}
              <div className="guidelines-step-form">
                <h4 className="guidelines-step-form-title">
                  {editingStepIndex !== null ? `Edit Step ${editingStepIndex + 1}` : `Add Step ${formData.steps.length + 1}`}
                </h4>
                
                <div className="guidelines-form-group">
                  <label className="guidelines-form-label">Step Title *</label>
                  <input
                    type="text"
                    value={stepFormData.title}
                    onChange={(e) => setStepFormData({ ...stepFormData, title: e.target.value })}
                    className="guidelines-form-input"
                    placeholder="e.g., Go to Barangay Hall"
                  />
                </div>

                <div className="guidelines-form-group">
                  <label className="guidelines-form-label">Description *</label>
                  <textarea
                    value={stepFormData.description}
                    onChange={(e) => setStepFormData({ ...stepFormData, description: e.target.value })}
                    rows={3}
                    className="guidelines-form-textarea"
                    placeholder="Detailed instructions for this step"
                  />
                </div>

                <div className="guidelines-form-row">
                  <div className="guidelines-form-group">
                    <label className="guidelines-form-label">Location</label>
                    <input
                      type="text"
                      value={stepFormData.location}
                      onChange={(e) => setStepFormData({ ...stepFormData, location: e.target.value })}
                      className="guidelines-form-input"
                      placeholder="e.g., Barangay Hall, 2nd Floor"
                    />
                  </div>

                  <div className="guidelines-form-group">
                    <label className="guidelines-form-label">Estimated Time</label>
                    <input
                      type="text"
                      value={stepFormData.estimatedTime}
                      onChange={(e) => setStepFormData({ ...stepFormData, estimatedTime: e.target.value })}
                      className="guidelines-form-input"
                      placeholder="e.g., 15 minutes"
                    />
                  </div>
                </div>

                <div className="guidelines-form-group">
                  <label className="guidelines-form-label">Required Documents (comma-separated)</label>
                  <input
                    type="text"
                    value={stepFormData.requiredDocuments}
                    onChange={(e) => setStepFormData({ ...stepFormData, requiredDocuments: e.target.value })}
                    className="guidelines-form-input"
                    placeholder="e.g., Valid ID, Cedula, Proof of Residency"
                  />
                </div>

                <div className="guidelines-form-group">
                  <label className="guidelines-form-label">Tips (comma-separated)</label>
                  <input
                    type="text"
                    value={stepFormData.tips}
                    onChange={(e) => setStepFormData({ ...stepFormData, tips: e.target.value })}
                    className="guidelines-form-input"
                    placeholder="e.g., Bring exact change, Come early to avoid lines"
                  />
                </div>

                <div className="guidelines-step-form-actions">
                  {editingStepIndex !== null ? (
                    <>
                      <button
                        type="button"
                        onClick={handleUpdateStep}
                        className="guidelines-btn guidelines-btn-primary"
                        disabled={!stepFormData.title.trim() || !stepFormData.description.trim()}
                      >
                        Update Step
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingStepIndex(null);
                          resetStepForm();
                        }}
                        className="guidelines-btn guidelines-btn-secondary"
                      >
                        Cancel Edit
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="guidelines-btn guidelines-btn-primary"
                      disabled={!stepFormData.title.trim() || !stepFormData.description.trim()}
                    >
                      Add Step
                    </button>
                  )}
                </div>
              </div>

              {/* Steps List */}
              {formData.steps.length > 0 && (
                <div className="guidelines-steps-list">
                  <h4 className="guidelines-steps-list-title">Steps ({formData.steps.length})</h4>
                  {formData.steps.map((step, index) => (
                    <div key={step.id} className="guidelines-step-item">
                      <div className="guidelines-step-header">
                        <div className="guidelines-step-number">
                          Step {step.stepNumber}
                        </div>
                        <div className="guidelines-step-title">
                          {step.title}
                        </div>
                        <div className="guidelines-step-actions">
                          <button
                            onClick={() => moveStep(index, 'up')}
                            disabled={index === 0}
                            className="guidelines-step-action-btn"
                            title="Move Up"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveStep(index, 'down')}
                            disabled={index === formData.steps.length - 1}
                            className="guidelines-step-action-btn"
                            title="Move Down"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => handleEditStep(index)}
                            className="guidelines-step-action-btn guidelines-edit-btn"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteStep(index)}
                            className="guidelines-step-action-btn guidelines-delete-btn"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="guidelines-step-preview">
                        <p>{step.description}</p>
                        {step.location && (
                          <div className="guidelines-step-meta">
                            📍 {step.location}
                          </div>
                        )}
                        {step.estimatedTime && (
                          <div className="guidelines-step-meta">
                            ⏱️ {step.estimatedTime}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

const DeleteModal: React.FC<DeleteModalProps> = ({ guideline, isOpen, onClose, onConfirm }) => {
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
              <svg className="guidelines-delete-icon-svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h2 className="guidelines-delete-title">
                Delete Guidelines
              </h2>
              <p className="guidelines-delete-subtitle">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="guidelines-delete-body">
          <p className="guidelines-delete-message">
            Are you sure you want to delete the guidelines <strong>"{guideline.title}"</strong>?
          </p>
          
          <div className="guidelines-delete-details">
            <h4 className="guidelines-delete-details-title">
              Guidelines Details:
            </h4>
            <p className="guidelines-delete-detail">
              <strong>Description:</strong> {guideline.description}
            </p>
            <p className="guidelines-delete-detail">
              <strong>Category:</strong> {guideline.category}
            </p>
            <p className="guidelines-delete-detail">
              <strong>Steps:</strong> {guideline.steps.length} steps
            </p>
            <p className="guidelines-delete-detail">
              <strong>Total Time:</strong> {guideline.totalEstimatedTime}
            </p>
          </div>

          <div className="guidelines-delete-warning">
            <div className="guidelines-delete-warning-content">
              <svg className="guidelines-delete-warning-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="guidelines-delete-warning-text">
                Warning: This will permanently remove this guidelines and all its steps from the system.
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
            Delete Guidelines
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
      title: 'How to Get a Barangay Clearance',
      description: 'Step-by-step guide for obtaining a barangay clearance certificate',
      category: 'Clearances',
      totalEstimatedTime: '1-2 hours',
      difficulty: 'Easy',
      lastUpdated: '2024-10-01T10:00:00.000Z',
      steps: [
        {
          id: '1-1',
          stepNumber: 1,
          title: 'Prepare Required Documents',
          description: 'Gather all necessary documents before going to the barangay hall.',
          requiredDocuments: ['Valid ID', 'Cedula', 'Proof of Residency'],
          estimatedTime: '15 minutes',
          tips: ['Make photocopies of all documents', 'Bring originals for verification']
        },
        {
          id: '1-2',
          stepNumber: 2,
          title: 'Go to Barangay Hall',
          description: 'Visit the barangay hall during office hours to submit your application.',
          location: 'Barangay Hall, Ground Floor',
          estimatedTime: '30 minutes',
          tips: ['Come early to avoid long lines', 'Bring exact change for fees']
        },
        {
          id: '1-3',
          stepNumber: 3,
          title: 'Fill Out Application Form',
          description: 'Complete the barangay clearance application form with accurate information.',
          location: 'Information Desk',
          estimatedTime: '10 minutes',
          tips: ['Write clearly and legibly', 'Double-check all information']
        },
        {
          id: '1-4',
          stepNumber: 4,
          title: 'Submit Documents and Pay Fee',
          description: 'Submit your completed form and documents, then pay the required fee.',
          location: "Secretary's Office",
          estimatedTime: '15 minutes'
        },
        {
          id: '1-5',
          stepNumber: 5,
          title: 'Claim Your Clearance',
          description: 'Return to claim your barangay clearance certificate.',
          estimatedTime: '5 minutes',
          tips: ['Bring your receipt', 'Processing usually takes 1-2 working days']
        }
      ]
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
          requiredDocuments: ['DTI Registration', 'SEC Registration (if corporation)', 'Valid ID', 'Barangay Clearance'],
          estimatedTime: '30 minutes'
        },
        {
          id: '2-2',
          stepNumber: 2,
          title: 'Complete Application Form',
          description: 'Fill out the business permit application form completely.',
          location: 'Business Permits Office',
          estimatedTime: '20 minutes'
        }
      ]
    }
  ]);

  const [editingGuideline, setEditingGuideline] = useState<Guideline | null>(null);
  const [deletingGuideline, setDeletingGuideline] = useState<Guideline | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGuidelines, setSelectedGuidelines] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  // Filter guidelines based on search term, category, and difficulty
  const filteredGuidelines = guidelines.filter(guideline => {
    const matchesSearch = guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guideline.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || guideline.category === filterCategory;
    const matchesDifficulty = filterDifficulty === '' || guideline.difficulty === filterDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleEdit = (guidelineId: string) => {
    const guideline = guidelines.find(g => g.id === guidelineId);
    if (guideline) {
      setEditingGuideline(guideline);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (guidelineId: string) => {
    const guideline = guidelines.find(g => g.id === guidelineId);
    if (guideline) {
      setDeletingGuideline(guideline);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingGuideline) {
      setGuidelines(guidelines.filter(g => g.id !== deletingGuideline.id));
      setIsDeleteModalOpen(false);
      setDeletingGuideline(null);
      alert(`Guidelines "${deletingGuideline.title}" has been successfully deleted!`);
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
      .filter(g => selectedGuidelines.has(g.id))
      .map(g => g.title)
      .join(', ');

    if (confirm(`Are you sure you want to delete ${count} guideline${count > 1 ? 's' : ''}?\n\n${guidelineTitles}`)) {
      setGuidelines(guidelines.filter(g => !selectedGuidelines.has(g.id)));
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
      .filter(g => g.id !== updatedGuideline.id) // Exclude current guideline if editing
      .map(g => g.title.toLowerCase().trim());
    
    const newTitle = updatedGuideline.title.toLowerCase().trim();
    
    if (existingTitles.includes(newTitle)) {
      alert('A guideline with this title already exists. Please choose a different title.');
      return;
    }
    
    if (updatedGuideline.id && guidelines.find(g => g.id === updatedGuideline.id)) {
      // Update existing guideline
      setGuidelines(guidelines.map(g => 
        g.id === updatedGuideline.id ? updatedGuideline : g
      ));
      alert(`Guidelines "${updatedGuideline.title}" has been successfully updated!`);
    } else {
      // Add new guideline
      const newGuideline = {
        ...updatedGuideline,
        id: Date.now().toString(),
        lastUpdated: new Date().toISOString()
      };
      setGuidelines([...guidelines, newGuideline]);
      alert(`New guidelines "${updatedGuideline.title}" has been successfully created!`);
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
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = ['Clearances', 'Permits', 'Certificates', 'Applications', 'Services'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Guidelines</h1>
            <p className="text-gray-600 text-sm mt-1">
              Step-by-step instructions for barangay services ({guidelines.length} total)
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Selected
              </button>
            </div>
          )}
        </div>

        <button 
          onClick={handleAddGuideline}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium"
        >
          <span className="text-lg">+</span>
          Add Guidelines
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search guidelines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">All Difficulties</option>
          {difficulties.map(difficulty => (
            <option key={difficulty} value={difficulty}>{difficulty}</option>
          ))}
        </select>
      </div>

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGuidelines.map((guideline) => (
          <Card key={guideline.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedGuidelines.has(guideline.id)}
                    onChange={() => handleSelectGuideline(guideline.id)}
                    className="mr-3 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </div>
                <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold text-gray-900 leading-tight mb-2">
                    {guideline.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {guideline.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(guideline.difficulty)}`}>
                      {guideline.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {guideline.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Steps:</p>
                    <p className="text-gray-600">{guideline.steps.length} steps</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Est. Time:</p>
                    <p className="text-gray-600">{guideline.totalEstimatedTime}</p>
                  </div>
                </div>

                {/* Steps Preview */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Steps Preview:</p>
                  <div className="space-y-1">
                    {guideline.steps.slice(0, 3).map((step, index) => (
                      <div key={step.id} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="bg-green-100 text-green-700 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {step.stepNumber}
                        </span>
                        <span className="truncate">{step.title}</span>
                      </div>
                    ))}
                    {guideline.steps.length > 3 && (
                      <div className="text-xs text-gray-500 ml-7">
                        +{guideline.steps.length - 3} more steps
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 mt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      // In a real app, this would open a detailed view
                      alert(`Opening detailed view for: ${guideline.title}`);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Step-by-Step Guide
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(guideline.id)}
                      className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDelete(guideline.id)}
                      className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredGuidelines.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No guidelines found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterCategory || filterDifficulty 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by creating your first step-by-step guideline.'}
          </p>
          {!searchTerm && !filterCategory && !filterDifficulty && (
            <div className="mt-6">
              <button
                onClick={handleAddGuideline}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium mx-auto"
              >
                <span className="text-lg">+</span>
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