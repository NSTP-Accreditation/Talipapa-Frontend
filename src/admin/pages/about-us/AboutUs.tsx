import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { Home, BookOpen, History, Target, Eye, SquarePen } from 'lucide-react';
import { ResponsiveSkeleton } from '../../../components/ResponsiveSkeleton';
import useFetchData from '../../hooks/useFetchData';
import { useAuthFetch } from '../../hooks/useAuthFetch';
import OfficialsPanel from '../../components/OfficialsPanel';
import ContentModal from './ContentModal';

export default function AboutBarangayEditable() {
  const { success, error: showError } = useToast();
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    return <ResponsiveSkeleton page="aboutus-admin" />;
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-red-700">
          Failed to load barangay data
        </h2>
        <p className="mt-2 text-sm text-gray-600">{error}</p>
        <div className="mt-4">
          <button
            onClick={() => refetch()}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-[#1b4c2e] text-white rounded-md hover:bg-[#2d6b42] transition-colors text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async (updatedContent: {
    barangayDescription: string;
    barangayHistory: string;
    mission: string;
    vision: string;
  }) => {
    setIsSaving(true);
    try {
      const url = `/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}`;
      const result = await authFetch(url, {
        method: 'PATCH',
        body: JSON.stringify(updatedContent),
      });

      // If API returns updated object, update local state
      if (result && typeof result === 'object' && !(result as any).message) {
        setPageContent(result as any);
      }

      await refetch();

      success('Changes saved successfully!', { title: 'Saved' });
      setIsModalOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save changes';
      showError('Save failed: ' + message, { title: 'Save failed' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Home className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            About Barangay
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-2 sm:mt-3 font-medium">
            Manage barangay information, history, mission, vision, and officials
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 font-semibold text-sm sm:text-base"
        >
          <SquarePen className="w-4 h-4 sm:w-5 sm:h-5" />
          Edit Content
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Barangay Information */}
        <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="p-5 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Barangay Information
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
              {pageContent?.barangayDescription || 'No information available'}
            </p>
          </div>
        </div>

        {/* Barangay History */}
        <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="p-5 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <History className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Barangay History
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
              {pageContent?.barangayHistory || 'No history available'}
            </p>
          </div>
        </div>

        {/* Mission & Vision - Side by Side on larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Mission */}
          <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-5 sm:p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Our Mission
                </h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                {pageContent?.mission || 'No mission statement available'}
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-5 sm:p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Our Vision
                </h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pageContent={pageContent!}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
