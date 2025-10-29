import React from 'react';
import { createPortal } from 'react-dom';
import { Users, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  skillLoading?: boolean;
  staffList?: any[];
  formatContact?: (s?: string | null) => string | null;
}

const SkillStaffModal: React.FC<Props> = ({
  isOpen,
  onClose,
  skillLoading,
  staffList = [],
  formatContact,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Staff with this skill</h3>
              <p className="text-sm text-green-100">
                Select a staff member to view details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md bg-white/10 hover:bg-white/20"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          {skillLoading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : staffList.length === 0 ? (
            <div className="text-center text-gray-500">
              No staff found for this skill.
            </div>
          ) : (
            <ul className="space-y-3">
              {staffList.map((s: any) => (
                <li
                  key={s._id ?? s.name}
                  className="p-3 rounded-lg border border-gray-100 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold">
                        {s.name?.charAt(0) ?? '?'}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{s.name}</div>
                        <div className="text-xs text-gray-500">
                          {s.position
                            ? Array.isArray(s.position)
                              ? s.position.map((p: any) => p.label).join(', ')
                              : s.position
                            : '—'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-600">
                      <div>
                        {formatContact
                          ? (formatContact(s.contact_number) ?? 'No contact')
                          : (s.contact_number ?? 'No contact')}
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
