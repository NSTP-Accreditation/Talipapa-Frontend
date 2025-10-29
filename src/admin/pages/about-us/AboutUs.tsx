import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/useToast';
import { SquarePen, Save, Home } from 'lucide-react';
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
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const editMenuRef = useRef<HTMLDivElement | null>(null);
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

  // Close edit menu on outside click or Escape key
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        showEditMenu &&
        editMenuRef.current &&
        !editMenuRef.current.contains(target)
      ) {
        setShowEditMenu(false);
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowEditMenu(false);
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [showEditMenu]);

  if (dataLoading) {
    return <ResponsiveSkeleton page="aboutus" />;
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

  const handleSave = async (title: string, content: string) => {
    setIsSaving(true);
    try {
      const url = `/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}`;
      const result = await authFetch(url, {
        method: 'PATCH',
        body: JSON.stringify({ [title]: content }),
      });

      // If API returns updated object, update local state
      if (result && typeof result === 'object' && !(result as any).message) {
        setPageContent(result as any);
      }

      await refetch();

      success('All changes saved successfully!', { title: 'Saved' });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save changes';
      showError('Save failed: ' + message, { title: 'Save failed' });
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

  // No global save button; each modal has its own Save action

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1b4c2e] flex items-center gap-2 sm:gap-3">
              <Home className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-[#1b4c2e]" />
              About Us
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 mt-2 sm:mt-3 font-medium">
              Manage barangay information, history, mission, vision, and
              officials
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-center">
            {/* Edit dropdown/button aligned to the right column */}
            <div className="relative" ref={editMenuRef}>
              <button
                onClick={() => setShowEditMenu((s) => !s)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-2 sm:px-3 sm:py-2 bg-[#1b4c2e] text-white rounded-lg shadow-sm hover:bg-[#2d6b42] transition-colors focus:outline-none focus:ring-4 focus:ring-green-200 text-sm sm:text-base"
                aria-expanded={showEditMenu}
                aria-haspopup="menu"
              >
                <SquarePen size={12} className="sm:w-3.5 sm:h-3.5" />
                Edit
              </button>

              {showEditMenu && (
                <div
                  className="
      absolute
      left-0 sm:right-0 sm:left-auto
      mt-2
      w-[calc(100vw-2rem)] sm:w-56
      origin-top-left sm:origin-top-right
      rounded-lg
      bg-white
      border
      shadow-xl
      ring-1 ring-black/5
      overflow-hidden
      z-[1003]
    "
                >
                  <div className="p-2 sm:p-2 divide-y divide-gray-100">
                    <button
                      onClick={() => {
                        openModal('barangayDescription');
                        setShowEditMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-100"
                    >
                      <Home className="w-4 h-4 sm:w-4 sm:h-4 text-[#1b4c2e]" />
                      <span className="flex-1 text-left font-medium">
                        Edit Barangay Information
                      </span>
                      <span className="text-gray-400 text-sm hidden sm:inline">
                        ›
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        openModal('barangayHistory');
                        setShowEditMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-100"
                    >
                      <span className="w-4 h-4 text-[#1b4c2e]">📜</span>
                      <span className="flex-1 text-left font-medium">
                        Edit Barangay History
                      </span>
                      <span className="text-gray-400 text-sm hidden sm:inline">
                        ›
                      </span>
                    </button>

                    <div className="py-1" />

                    <button
                      onClick={() => {
                        openModal('mission');
                        setShowEditMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-100"
                    >
                      <span className="w-4 h-4 text-[#1b4c2e]">🎯</span>
                      <span className="flex-1 text-left font-medium">
                        Edit Mission
                      </span>
                      <span className="text-gray-400 text-sm hidden sm:inline">
                        ›
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        openModal('vision');
                        setShowEditMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-100"
                    >
                      <span className="w-4 h-4 text-[#1b4c2e]">🔭</span>
                      <span className="flex-1 text-left font-medium">
                        Edit Vision
                      </span>
                      <span className="text-gray-400 text-sm hidden sm:inline">
                        ›
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* No global save button; each modal contains its own Save */}
          </div>
        </div>
      </div>

      {/* Enhanced Content Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Barangay Information */}
        <div className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 transform hover:border-green-300">
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1b4c2e] flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg">📋</span>
                Barangay Information
              </h2>
            </div>

            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {pageContent?.barangayDescription || 'No information available'}
            </p>
          </div>
        </div>

        {/* Barangay History */}
        <div className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 transform hover:border-green-300">
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1b4c2e] flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg">📜</span>
                Barangay History
              </h2>
            </div>

            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {pageContent?.barangayHistory || 'No history available'}
            </p>
          </div>
        </div>

        {/* Mission & Vision - Side by Side on larger screens, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Mission */}
          <div className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 transform hover:border-green-300">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1b4c2e] flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-lg">🎯</span>
                  Our Mission
                </h2>
              </div>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {pageContent?.mission || 'No mission statement available'}
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 transform hover:border-green-300">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1b4c2e] flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-lg">🔭</span>
                  Our Vision
                </h2>
              </div>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
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
        onSave={(content) => handleSave(activeModal || '', content)}
      />
    </div>
  );
}
