import { useState, useEffect } from 'react';
import { SquarePen, Save, Home } from 'lucide-react';
import { FormTablePageSkeleton } from '../../components/LoadingSkeletons';
import useFetchData from '../hooks/useFetchData';
import { useAuthFetch } from '../hooks/useAuthFetch';
import OfficialsPanel from '../components/OfficialsPanel';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onSave: (content: string) => void;
}

const ContentModal: React.FC<ContentModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  onSave,
}) => {
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setEditedContent(content);
  }, [content, isOpen]);

  const handleSave = () => {
    onSave(editedContent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-[#1b4c2e] text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit {title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1b4c2e] focus:border-transparent"
            placeholder={`Enter ${title.toLowerCase()} content...`}
          />
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#1b4c2e] text-white rounded-md hover:bg-[#2d6b42] transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AboutBarangayEditable() {
  const {
    data,
    loading: dataLoading,
    error,
    refetch,
  } = useFetchData<any>(`/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}`);

  const [pageContent, setPageContent] = useState<{
    barangayName: string;
    mission?: string;
    vision?: string;
    barangayHistory?: string;
    barangayDescription?: string;
  }>();

  // Centralized modal state
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const authFetch = useAuthFetch();

  // Populate local state when data loads
  useEffect(() => {
    if (data && !dataLoading && !error) {
      setPageContent({
        barangayName: data.barangayName || 'Name',
        mission: data.mission || '',
        vision: data.vision || '',
        barangayHistory: data.barangayHistory || '',
        barangayDescription: data.barangayDescription || '',
      });
    }
  }, [data, dataLoading, error]);

  if (dataLoading) {
    return <FormTablePageSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-red-700">
          Failed to load barangay data
        </h2>
        <p className="mt-2 text-sm text-gray-600">{error}</p>
        <div className="mt-4">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#1b4c2e] text-white rounded-md hover:bg-[#2d6b42] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = '/pageContent/68ebc632bdb9c78d031eb89c';
      const result = await authFetch(url, {
        method: 'PUT',
        body: JSON.stringify(pageContent),
      });

      // If API returns updated object, update local state
      if (result && typeof result === 'object' && !(result as any).message) {
        setPageContent(result as any);
      }

      await refetch();

      alert('✅ All changes saved successfully!');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save changes';
      alert('❌ Save failed: ' + message);
    } finally {
      setIsSaving(false);
    }
  };

  const openModal = (type: string) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleContentSave = (type: string, content: string) => {
    setPageContent((prev) => ({
      ...prev,
      [type]: content,
    }));
  };

  const getContent = (type: string) => {
    switch (type) {
      case 'barangayDescription':
        return pageContent?.barangayDescription || '';
      case 'barangayHistory':
        return pageContent?.barangayHistory || '';
      case 'mission':
        return pageContent?.mission || '';
      case 'vision':
        return pageContent?.vision || '';
      default:
        return '';
    }
  };

  const getDisplayName = (type: string) => {
    switch (type) {
      case 'barangayDescription':
        return 'Barangay Information';
      case 'barangayHistory':
        return 'Barangay History';
      case 'mission':
        return 'Mission';
      case 'vision':
        return 'Vision';
      default:
        return '';
    }
  };

  const hasUnsavedChanges = activeModal !== null;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#1b4c2e] flex items-center gap-3">
            <Home className="w-10 h-10 text-[#1b4c2e]" />
            About Us
          </h1>
          <p className="text-lg text-gray-700 mt-3 font-medium">
            Manage barangay information, history, mission, vision, and officials
          </p>
        </div>

        {/* Save All Button */}
        {hasUnsavedChanges && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-3 bg-gradient-to-r from-[#1b4c2e] to-[#2d6b42] hover:from-[#2d6b42] hover:to-[#1b4c2e] text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2 ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isSaving ? (
              'Saving...'
            ) : (
              <>
                <Save size={20} />
                Save All Changes
              </>
            )}
          </button>
        )}
      </div>

      {/* Enhanced Content Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Barangay Information */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#1b4c2e] flex items-center gap-2">
                <span>📋</span>
                Barangay Information
              </h2>
              <button
                onClick={() => openModal('barangayDescription')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#1b4c2e] to-[#1b4c2e] hover:from-[#2d6b42] hover:to-[#2d6b42] rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <SquarePen size={14} />
                Edit
              </button>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {pageContent?.barangayDescription || 'No information available'}
            </p>
          </div>
        </div>

        {/* Barangay History */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#1b4c2e] flex items-center gap-2">
                <span>📜</span>
                Barangay History
              </h2>
              <button
                onClick={() => openModal('barangayHistory')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#1b4c2e] to-[#1b4c2e] hover:from-[#2d6b42] hover:to-[#2d6b42] rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <SquarePen size={14} />
                Edit
              </button>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {pageContent?.barangayHistory || 'No history available'}
            </p>
          </div>
        </div>

        {/* Mission & Vision - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#1b4c2e] flex items-center gap-2">
                  <span>🎯</span>
                  Our Mission
                </h2>
                <button
                  onClick={() => openModal('mission')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#1b4c2e] to-[#1b4c2e] hover:from-[#2d6b42] hover:to-[#2d6b42] rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <SquarePen size={14} />
                  Edit
                </button>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {pageContent?.mission || 'No mission statement available'}
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#1b4c2e] flex items-center gap-2">
                  <span>🔭</span>
                  Our Vision
                </h2>
                <button
                  onClick={() => openModal('vision')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#1b4c2e] to-[#1b4c2e] hover:from-[#2d6b42] hover:to-[#2d6b42] rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <SquarePen size={14} />
                  Edit
                </button>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {pageContent?.vision || 'No vision statement available'}
              </p>
            </div>
          </div>
        </div>

        {/* Barangay Officials */}
        <OfficialsPanel />
      </div>

      {/* Centralized Modal */}
      <ContentModal
        isOpen={activeModal !== null}
        onClose={closeModal}
        title={getDisplayName(activeModal || '')}
        content={getContent(activeModal || '')}
        onSave={(content) => handleContentSave(activeModal || '', content)}
      />
    </div>
  );
}
