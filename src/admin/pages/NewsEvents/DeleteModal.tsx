import React from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Calendar, X, Trash2 } from 'lucide-react';
import { DeleteModalProps } from './types';

const DeleteModal: React.FC<DeleteModalProps> = ({
  event,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !event) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-[95vw] sm:max-w-[520px] w-full overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 px-3 sm:px-8 py-3 sm:py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
          <div className="relative flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <div className="w-9 h-9 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-2xl flex items-center justify-center ring-2 ring-white/30 flex-shrink-0">
                <AlertCircle className="w-4.5 h-4.5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-2xl md:text-3xl font-bold text-white mb-0.5 sm:mb-1">
                  Delete Event
                </h3>
                <p className="text-red-100 text-xs sm:text-sm font-medium">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 ring-1 ring-white/30 flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-2.5 sm:px-6 md:px-8 py-2.5 sm:py-5 md:py-6 space-y-2 sm:space-y-4">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Are you sure you want to delete the event{' '}
            <strong className="text-gray-900">"{event.title}"</strong>?
          </p>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-5 space-y-1.5 sm:space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              Event Details:
            </h4>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm text-gray-700 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                <span className="font-bold min-w-[70px] sm:min-w-[90px]">
                  Description:
                </span>
                <span className="break-words">{event.description}</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-700 flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold min-w-[70px] sm:min-w-[90px]">
                  Date:
                </span>
                <span>{event.dateTime}</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-700 flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold min-w-[70px] sm:min-w-[90px]">
                  Time:
                </span>
                <span>{event.dateTime}</span>
              </p>
              {event.location && (
                <p className="text-xs sm:text-sm text-gray-700 flex items-center gap-1.5 sm:gap-2">
                  <span className="font-bold min-w-[70px] sm:min-w-[90px]">
                    Location:
                  </span>
                  <span className="break-words">{event.location}</span>
                </p>
              )}
              <p className="text-xs sm:text-sm text-gray-700 flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold min-w-[70px] sm:min-w-[90px]">
                  Category:
                </span>
                <span>{event.category}</span>
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg sm:rounded-xl p-2 sm:p-4 flex items-start gap-1.5 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-red-700 font-medium leading-relaxed">
              Warning: This will permanently remove this event from the
              calendar. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-2.5 sm:px-6 md:px-8 py-2.5 sm:py-5 bg-gradient-to-r from-gray-50 to-white border-t-2 border-gray-100 flex gap-2 sm:gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3.5 sm:px-8 py-1.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            <span>Delete Event</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteModal;
