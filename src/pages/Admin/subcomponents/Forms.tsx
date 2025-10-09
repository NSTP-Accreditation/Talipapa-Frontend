import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';
import './css/Forms.css';

interface FormDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  downloadCount: number;
  isActive: boolean;
}

interface EditModalProps {
  form: FormDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (form: FormDocument) => void;
}

interface DeleteModalProps {
  form: FormDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
  form,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<FormDocument>({
    id: form?.id || '',
    title: form?.title || '',
    description: form?.description || '',
    category: form?.category || '',
    fileName: form?.fileName || '',
    fileSize: form?.fileSize || '',
    uploadDate: form?.uploadDate || new Date().toISOString(),
    downloadCount: form?.downloadCount || 0,
    isActive: form?.isActive ?? true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  React.useEffect(() => {
    if (form) {
      setFormData(form);
    } else {
      const newForm = {
        id: '',
        title: '',
        description: '',
        category: '',
        fileName: '',
        fileSize: '',
        uploadDate: new Date().toISOString(),
        downloadCount: 0,
        isActive: true,
      };
      setFormData(newForm);
    }
    setSelectedFile(null);
  }, [form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Only accept PDF files
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setFormData({
          ...formData,
          fileName: file.name,
          fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        });
      } else {
        alert('Please select a PDF file only.');
        e.target.value = '';
      }
    }
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

    // For new forms, require file upload
    if (!form?.id && !selectedFile) {
      errors.push('Please upload a PDF file');
    }

    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n• ' + errors.join('\n• '));
      return;
    }

    const updatedForm = {
      ...formData,
      uploadDate: form?.id ? formData.uploadDate : new Date().toISOString(),
    };

    onSave(updatedForm);
  };

  if (!isOpen) return null;

  return (
    <div
      className="forms-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="forms-modal-content">
        {/* Header */}
        <div className="forms-modal-header">
          <h2 className="forms-modal-title">
            {form?.id ? 'Edit Form' : 'Add New Form'}
          </h2>
          <button onClick={onClose} className="forms-modal-close-btn">
            ✕
          </button>
        </div>

        {/* Form Content */}
        <div className="forms-modal-body">
          <div className="forms-form-container">
            <div className="forms-form-group">
              <label className="forms-form-label">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="forms-form-input"
                placeholder="Enter form title"
              />
            </div>

            <div className="forms-form-group">
              <label className="forms-form-label">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="forms-form-textarea"
                placeholder="Enter form description"
              />
            </div>

            <div className="forms-form-group">
              <label className="forms-form-label">Category *</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="forms-form-select"
              >
                <option value="">Select Category</option>
                <option value="Clearances">Clearances</option>
                <option value="Permits">Permits</option>
                <option value="Certificates">Certificates</option>
                <option value="Applications">Applications</option>
                <option value="Reports">Reports</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="forms-form-group">
              <label className="forms-form-label">
                PDF File{' '}
                {!form?.id
                  ? '*'
                  : '(Optional - leave blank to keep current file)'}
              </label>
              <div className="forms-file-upload">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="forms-file-input"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="forms-file-label">
                  <svg
                    className="forms-file-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  {selectedFile
                    ? selectedFile.name
                    : 'Choose PDF file or drag and drop'}
                </label>
              </div>

              {formData.fileName && (
                <div className="forms-file-info">
                  <span className="forms-file-name">
                    📄 {formData.fileName}
                  </span>
                  <span className="forms-file-size">{formData.fileSize}</span>
                </div>
              )}
            </div>

            <div className="forms-form-group">
              <div className="forms-checkbox-group">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="forms-checkbox"
                />
                <label htmlFor="isActive" className="forms-checkbox-label">
                  Active (Available for download)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="forms-modal-footer">
          <button onClick={onClose} className="forms-btn forms-btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="forms-btn forms-btn-primary">
            {form?.id ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  form,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !form) return null;

  return (
    <div
      className="forms-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="forms-delete-modal">
        {/* Header */}
        <div className="forms-delete-header">
          <div className="forms-delete-header-content">
            <div className="forms-delete-icon">
              <svg
                className="forms-delete-icon-svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h2 className="forms-delete-title">Delete Form</h2>
              <p className="forms-delete-subtitle">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="forms-delete-body">
          <p className="forms-delete-message">
            Are you sure you want to delete the form{' '}
            <strong>"{form.title}"</strong>?
          </p>

          <div className="forms-delete-details">
            <h4 className="forms-delete-details-title">Form Details:</h4>
            <p className="forms-delete-detail">
              <strong>Description:</strong> {form.description}
            </p>
            <p className="forms-delete-detail">
              <strong>Category:</strong> {form.category}
            </p>
            <p className="forms-delete-detail">
              <strong>File:</strong> {form.fileName}
            </p>
            <p className="forms-delete-detail">
              <strong>Downloads:</strong> {form.downloadCount} times
            </p>
          </div>

          <div className="forms-delete-warning">
            <div className="forms-delete-warning-content">
              <svg
                className="forms-delete-warning-icon"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="forms-delete-warning-text">
                Warning: This will permanently remove this form and its
                associated PDF file from the system.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="forms-modal-footer">
          <button onClick={onClose} className="forms-btn forms-btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="forms-btn forms-btn-danger">
            Delete Form
          </button>
        </div>
      </div>
    </div>
  );
};

const Forms: React.FC = () => {
  const [forms, setForms] = useState<FormDocument[]>([
    {
      id: '1',
      title: 'Barangay Clearance Application Form',
      description:
        'Official form for requesting barangay clearance certificate',
      category: 'Clearances',
      fileName: 'barangay-clearance-form.pdf',
      fileSize: '1.2 MB',
      uploadDate: '2024-10-01T10:00:00.000Z',
      downloadCount: 245,
      isActive: true,
    },
    {
      id: '2',
      title: 'Business Permit Application',
      description: 'Form for applying for business permits within the barangay',
      category: 'Permits',
      fileName: 'business-permit-application.pdf',
      fileSize: '2.1 MB',
      uploadDate: '2024-09-28T14:30:00.000Z',
      downloadCount: 156,
      isActive: true,
    },
    {
      id: '3',
      title: 'Indigency Certificate Request',
      description:
        'Application form for indigency certificate for low-income residents',
      category: 'Certificates',
      fileName: 'indigency-certificate-form.pdf',
      fileSize: '0.8 MB',
      uploadDate: '2024-09-25T09:15:00.000Z',
      downloadCount: 89,
      isActive: true,
    },
  ]);

  const [editingForm, setEditingForm] = useState<FormDocument | null>(null);
  const [deletingForm, setDeletingForm] = useState<FormDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedForms, setSelectedForms] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Filter forms based on search term and category
  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === '' || form.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (formId: string) => {
    const form = forms.find((f) => f.id === formId);
    if (form) {
      setEditingForm(form);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (formId: string) => {
    const form = forms.find((f) => f.id === formId);
    if (form) {
      setDeletingForm(form);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingForm) {
      setForms(forms.filter((f) => f.id !== deletingForm.id));
      setIsDeleteModalOpen(false);
      setDeletingForm(null);
      alert(`Form "${deletingForm.title}" has been successfully deleted!`);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingForm(null);
  };

  const handleSelectForm = (formId: string) => {
    const newSelected = new Set(selectedForms);
    if (newSelected.has(formId)) {
      newSelected.delete(formId);
    } else {
      newSelected.add(formId);
    }
    setSelectedForms(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleBulkDelete = () => {
    if (selectedForms.size === 0) return;

    const count = selectedForms.size;
    const formTitles = forms
      .filter((f) => selectedForms.has(f.id))
      .map((f) => f.title)
      .join(', ');

    if (
      confirm(
        `Are you sure you want to delete ${count} form${count > 1 ? 's' : ''}?\n\n${formTitles}`
      )
    ) {
      setForms(forms.filter((f) => !selectedForms.has(f.id)));
      setSelectedForms(new Set());
      setShowBulkActions(false);
      alert(`Successfully deleted ${count} form${count > 1 ? 's' : ''}.`);
    }
  };

  const handleAddForm = () => {
    setEditingForm(null);
    setIsModalOpen(true);
  };

  const handleSaveForm = (updatedForm: FormDocument) => {
    // Check for duplicate titles (case insensitive)
    const existingTitles = forms
      .filter((f) => f.id !== updatedForm.id) // Exclude current form if editing
      .map((f) => f.title.toLowerCase().trim());

    const newTitle = updatedForm.title.toLowerCase().trim();

    if (existingTitles.includes(newTitle)) {
      alert(
        'A form with this title already exists. Please choose a different title.'
      );
      return;
    }

    if (updatedForm.id && forms.find((f) => f.id === updatedForm.id)) {
      // Update existing form
      setForms(forms.map((f) => (f.id === updatedForm.id ? updatedForm : f)));
      alert(`Form "${updatedForm.title}" has been successfully updated!`);
    } else {
      // Add new form
      const newForm = {
        ...updatedForm,
        id: Date.now().toString(),
        uploadDate: new Date().toISOString(),
        downloadCount: 0,
      };
      setForms([...forms, newForm]);
      alert(`New form "${updatedForm.title}" has been successfully created!`);
    }

    setIsModalOpen(false);
    setEditingForm(null);

    // Clear any selected items when adding/editing
    setSelectedForms(new Set());
    setShowBulkActions(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingForm(null);
  };

  const handleDownload = (form: FormDocument) => {
    // In a real application, this would trigger an actual download
    // For now, we'll just increment the download count and show a message
    setForms(
      forms.map((f) =>
        f.id === form.id ? { ...f, downloadCount: f.downloadCount + 1 } : f
      )
    );

    // Simulate download
    alert(`Downloading ${form.fileName}...`);
    console.log(`Download initiated for: ${form.fileName}`);
  };

  const toggleFormStatus = (formId: string) => {
    setForms(
      forms.map((f) => (f.id === formId ? { ...f, isActive: !f.isActive } : f))
    );
  };

  const categories = [
    'Clearances',
    'Permits',
    'Certificates',
    'Applications',
    'Reports',
    'Others',
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="grid gap-6 md:gap-4 md:grid-cols-[1fr_auto] mb-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Forms Management</h1>
            <p className="text-gray-600 text-sm mt-1">Manage downloadable PDF forms ({forms.length} total)</p>
          </div>
          {/* Bulk Actions */}
          {showBulkActions && (
            <div className="inline-flex w-max self-start mt-6 items-center gap-6 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="px-3 py-0.5 rounded-full bg-blue-100 text-blue-900 text-sm font-medium">{selectedForms.size} selected</span>
              <span className="h-5 w-px bg-blue-200" />
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
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
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="flex items-start md:justify-end mt-1 md:mt-0">
          <button
            onClick={handleAddForm}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium"
          >
            <span className="text-lg">+</span>
            Add Form
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForms.map((form) => (
          <Card
            key={form.id}
            className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-6 min-w-0">
                  <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                      {form.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          form.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {form.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {form.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center pl-4">
                  <input
                    type="checkbox"
                    checked={selectedForms.has(form.id)}
                    onChange={() => handleSelectForm(form.id)}
                    className="h-6 w-6 rounded-lg border-[3px] border-gray-300 shadow-sm text-green-600 accent-green-600 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {form.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">File Size:</p>
                    <p className="text-gray-600">{form.fileSize}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Downloads:</p>
                    <p className="text-gray-600">{form.downloadCount}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    File Name:
                  </p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded font-mono">
                    📄 {form.fileName}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 mt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleDownload(form)}
                    disabled={!form.isActive}
                    className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      form.isActive
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
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
                        d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                      />
                    </svg>
                    {form.isActive ? 'Download PDF' : 'Not Available'}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(form.id)}
                      className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
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
                      onClick={() => toggleFormStatus(form.id)}
                      className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                        form.isActive
                          ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                          : 'bg-green-100 hover:bg-green-200 text-green-800'
                      }`}
                    >
                      {form.isActive ? 'Deactivate' : 'Activate'}
                    </button>

                    <button
                      onClick={() => handleDelete(form.id)}
                      className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
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

      {/* Empty State */}
      {filteredForms.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No forms found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterCategory
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first form.'}
          </p>
          {!searchTerm && !filterCategory && (
            <div className="mt-6">
              <button
                onClick={handleAddForm}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium mx-auto"
              >
                <span className="text-lg">+</span>
                Add Your First Form
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      <EditModal
        form={editingForm}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveForm}
      />

      {/* Delete Modal */}
      <DeleteModal
        form={deletingForm}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Forms;
