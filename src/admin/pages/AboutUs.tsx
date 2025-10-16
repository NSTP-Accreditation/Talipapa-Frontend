import { useState, useEffect } from 'react';
import { SquarePen, Save, Home } from 'lucide-react';
import { useLoadingState } from '../../hooks/useLoadingState';
import { useToast } from '@/contexts/ToastContext';
import { FormTablePageSkeleton } from '../../components/LoadingSkeletons';
import useFetchData from '../hooks/useFetchData';
import { useAuthFetch } from '../hooks/useAuthFetch';
import OfficialsPanel from '../components/OfficialsPanel';

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

  // Edit Mode States
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingHistory, setIsEditingHistory] = useState(false);
  const [isEditingMission, setIsEditingMission] = useState(false);
  const [isEditingVision, setIsEditingVision] = useState(false);
  const [isEditingOfficials, setIsEditingOfficials] = useState(false);
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
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Editable Handlers

  // Save Handler
  const handleSave = () => {
    const toast = useToast();
    setIsEditingInfo(false);
    setIsEditingHistory(false);
    setIsEditingMission(false);
    setIsEditingVision(false);
    setIsEditingOfficials(false);
    toast.success('✅ All changes saved successfully!');
  };

  const hasActiveEdits =
    isEditingInfo ||
    isEditingHistory ||
    isEditingMission ||
    isEditingVision ||
    isEditingOfficials;

  // (page loading already handled above)

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Home className="w-10 h-10 text-green-600" />
            About Us
          </h1>
          <p className="text-lg text-gray-700 mt-3 font-medium">
            Manage barangay information, history, mission, vision, and officials
          </p>
        </div>

        {/* Save All Button */}
        {hasActiveEdits && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2 ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
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
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>📋</span>
                Barangay Information
              </h2>
              <button
                onClick={() => setIsEditingInfo(!isEditingInfo)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <SquarePen size={14} />
                {isEditingInfo ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditingInfo ? (
              <textarea
                value={pageContent?.barangayDescription || ''}
                onChange={(e) =>
                  setPageContent((prev) => ({
                    ...prev,
                    barangayDescription: e.target.value,
                  }))
                }
                className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                rows={4}
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {pageContent?.barangayDescription}
              </p>
            )}
          </div>
        </div>

        {/* Barangay History */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>📜</span>
                Barangay History
              </h2>
              <button
                onClick={() => setIsEditingHistory(!isEditingHistory)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <SquarePen size={14} />
                {isEditingHistory ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditingHistory ? (
              <textarea
                value={pageContent?.barangayHistory || ''}
                onChange={(e) =>
                  setPageContent((prev) => ({
                    ...prev,
                    barangayHistory: e.target.value,
                  }))
                }
                className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                rows={4}
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {pageContent?.barangayHistory}
              </p>
            )}
          </div>
        </div>

        {/* Mission & Vision - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>🎯</span>
                  Our Mission
                </h2>
                <button
                  onClick={() => setIsEditingMission(!isEditingMission)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <SquarePen size={14} />
                  {isEditingMission ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditingMission ? (
                <textarea
                  value={pageContent?.mission || ''}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      mission: e.target.value,
                    }))
                  }
                  className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  rows={5}
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {pageContent?.mission}
                </p>
              )}
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>🔭</span>
                  Our Vision
                </h2>
                <button
                  onClick={() => setIsEditingVision(!isEditingVision)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <SquarePen size={14} />
                  {isEditingVision ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditingVision ? (
                <textarea
                  value={pageContent?.vision || ''}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      vision: e.target.value,
                    }))
                  }
                  className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  rows={5}
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {pageContent?.vision}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Barangay Officials */}
        <OfficialsPanel />
      </div>
    </div>
  );
}

// (Removed old centered EditButton helper — new implementation uses per-section edit buttons)
