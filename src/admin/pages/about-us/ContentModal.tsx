import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Home, X } from 'lucide-react';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onSave: (content: string) => Promise<void> | void;
}

export default function ContentModal({
  isOpen,
  onClose,
  title,
  content,
  onSave,
}: ContentModalProps) {
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setEditedContent(content);
  }, [content, isOpen]);

  const handleSave = () => {
    // allow sync or async handlers
    Promise.resolve(onSave(editedContent)).then(() => onClose());
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1003] p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden">
        {/* Records-style gradient header */}
        <div className="relative p-3 sm:p-6 bg-gradient-to-br from-[#1b4c2e] via-[#2d6b42] to-emerald-600 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full -mr-16 -mt-16 sm:-mr-24 sm:-mt-24"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 bg-white/10 rounded-full -ml-12 -mb-12 sm:-ml-18 sm:-mb-18"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center ring-2 sm:ring-4 ring-white/30 shadow-lg">
                <Home className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-bold mb-0">
                  Edit {title}
                </h3>
                <p className="text-white/80 text-xs sm:text-sm mt-1 hidden sm:block">
                  Modify the content for {title.toLowerCase()}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:rotate-90 duration-300 ring-1 sm:ring-2 ring-white/30 text-lg sm:text-xl"
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(95vh-140px)] bg-gradient-to-br from-gray-50 to-white">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-48 sm:h-64 p-2 sm:p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1b4c2e] focus:border-transparent text-sm sm:text-base"
            placeholder={`Enter ${title.toLowerCase()} content...`}
          />
        </div>

        <div className="px-3 py-3 sm:px-6 sm:py-4 bg-white/50 flex justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="px-3 py-2 sm:px-4 sm:py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-[#1b4c2e] text-white rounded-md hover:bg-[#2d6b42] transition-colors text-sm sm:text-base"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
