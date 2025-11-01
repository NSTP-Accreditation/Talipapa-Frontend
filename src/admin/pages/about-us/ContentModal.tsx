import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, History, Target, Eye, X, Save } from 'lucide-react';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageContent: {
    barangayName: string;
    mission?: string;
    vision?: string;
    barangayHistory?: string;
    barangayDescription?: string;
  };
  onSave: (content: {
    barangayDescription: string;
    barangayHistory: string;
    mission: string;
    vision: string;
  }) => Promise<void> | void;
  isSaving: boolean;
}

export default function ContentModal({
  isOpen,
  onClose,
  pageContent,
  onSave,
  isSaving,
}: ContentModalProps) {
  const [formData, setFormData] = useState({
    barangayDescription: '',
    barangayHistory: '',
    mission: '',
    vision: '',
  });

  useEffect(() => {
    if (isOpen && pageContent) {
      setFormData({
        barangayDescription: pageContent.barangayDescription || '',
        barangayHistory: pageContent.barangayHistory || '',
        mission: pageContent.mission || '',
        vision: pageContent.vision || '',
      });
    }
  }, [pageContent, isOpen]);

  const handleSave = () => {
    Promise.resolve(onSave(formData));
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1003] p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden animate-slideUp">
        {/* Header matching AddRecordModal */}
        <div className="relative p-4 sm:p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/10 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center ring-2 sm:ring-4 ring-white/30 shadow-lg">
                <BookOpen className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-3xl font-bold text-white mb-0 sm:mb-1">
                  Edit Barangay Content
                </h3>
                <p className="text-green-100 text-xs sm:text-sm font-medium">
                  Update barangay information, history, mission, and vision
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:rotate-90 duration-300 ring-1 sm:ring-2 ring-white/30 disabled:opacity-50"
              title="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(95vh-200px)] bg-gradient-to-br from-gray-50 to-white">
          {/* Barangay Information */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <label className="text-sm sm:text-base font-bold text-gray-700">
                Barangay Information
              </label>
            </div>
            <textarea
              value={formData.barangayDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  barangayDescription: e.target.value,
                }))
              }
              rows={4}
              className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 text-sm sm:text-base transition-all"
              placeholder="Enter barangay information..."
            />
          </div>

          {/* Barangay History */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                <History className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <label className="text-sm sm:text-base font-bold text-gray-700">
                Barangay History
              </label>
            </div>
            <textarea
              value={formData.barangayHistory}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  barangayHistory: e.target.value,
                }))
              }
              rows={4}
              className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 text-sm sm:text-base transition-all"
              placeholder="Enter barangay history..."
            />
          </div>

          {/* Mission and Vision - Side by Side on Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Mission */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <label className="text-sm sm:text-base font-bold text-gray-700">
                  Mission
                </label>
              </div>
              <textarea
                value={formData.mission}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mission: e.target.value }))
                }
                rows={6}
                className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 text-sm sm:text-base transition-all"
                placeholder="Enter mission statement..."
              />
            </div>

            {/* Vision */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <label className="text-sm sm:text-base font-bold text-gray-700">
                  Vision
                </label>
              </div>
              <textarea
                value={formData.vision}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, vision: e.target.value }))
                }
                rows={6}
                className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 text-sm sm:text-base transition-all"
                placeholder="Enter vision statement..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 sm:px-8 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 sm:px-6 sm:py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
