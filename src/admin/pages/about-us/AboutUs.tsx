import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import {
  Home,
  BookOpen,
  History,
  Target,
  Eye,
  SquarePen,
  Users,
  Building,
} from 'lucide-react';
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
    youtubeVideoUrl?: string;
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
        youtubeVideoUrl: data.youtubeVideoUrl || '',
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
    youtubeVideoUrl: string;
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
                <Home className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  About Barangay
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-medium mb-4">
                  Manage barangay information, history, mission, vision, and
                  officials
                </p>

                {/* Quick Info Pills */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs sm:text-sm font-semibold text-green-700">
                    <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Barangay Info</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs sm:text-sm font-semibold text-blue-700">
                    <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Mission & Vision</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-xs sm:text-sm font-semibold text-purple-700">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Officials</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold text-sm"
              >
                <SquarePen className="w-4 h-4 sm:w-5 sm:h-5" />
                Edit Content
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* YouTube Video URL */}
          <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-red-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-5 sm:p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  YouTube Video
                </h2>
              </div>
              <div className="space-y-3">
                <p className="text-sm sm:text-base text-gray-700">
                  <span className="font-semibold">Current Video URL:</span>
                </p>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600 break-all font-mono">
                    {pageContent?.youtubeVideoUrl ||
                      'No video URL set (using default)'}
                  </p>
                </div>
                {pageContent?.youtubeVideoUrl && (
                  <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src={pageContent.youtubeVideoUrl}
                      title="Barangay Video Preview"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

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
    </div>
  );
}
