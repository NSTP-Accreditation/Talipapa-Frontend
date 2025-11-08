import React from 'react';
import { createPortal } from 'react-dom';
import { Users, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  staffLoading?: boolean;
  staffList?: any[];
  // formatContact?: (s?: string | null) => string | null;
}

const SkillStaffModal: React.FC<Props> = ({
  isOpen,
  onClose,
  staffList = [],
  staffLoading
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
        <div className="relative p-4 sm:p-6 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/10 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center ring-2 sm:ring-4 ring-white/30 shadow-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-bold">
                  Staff with this skill
                </h3>
                <p className="text-sm text-green-100">
                  View staff members who have this skill
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:rotate-90 duration-300 ring-1 sm:ring-2 ring-white/30"
              title="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
          {staffLoading ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">Loading staff...</p>
            </div>
          ) : staffList.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-semibold">
                No staff found for this skill.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {staffList.map((s: any) => (
                <li
                  key={s._id ?? s.name}
                  className="p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-green-400 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                        {s.name?.charAt(0).toUpperCase() ?? '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-base truncate">
                          {s.name}
                        </div>
                        <div className="text-sm text-green-600 font-semibold truncate">
                          {s.position
                            ? Array.isArray(s.position)
                              ? s.position.map((p: any) => p.label).join(', ')
                              : s.position
                            : '—'}
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 px-3 py-2 rounded-lg">
                      <div className="text-xs text-gray-600 font-semibold mb-0.5">
                        Contact
                      </div>
                      <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
                        {s.contactNumber ?? 'No contact'}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SkillStaffModal;
