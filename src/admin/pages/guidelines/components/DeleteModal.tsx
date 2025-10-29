import React from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Trash2, Tag, FileCheck, Clock } from 'lucide-react';
import { Guideline } from '../types';

type Props = {
  guideline: Guideline | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteModal: React.FC<Props> = ({
  guideline,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !guideline) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm sm:max-w-2xl bg-white rounded-lg sm:rounded-xl shadow-xl overflow-hidden mx-2">
        <div className="p-4 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Delete Guidelines
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 mt-1">
                Are you sure you want to delete "{guideline.title}"?
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold text-gray-900">
                  Description:
                </span>{' '}
                {guideline.description}
              </p>
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Category:</span>{' '}
                <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-green-100 border border-green-300 rounded-md text-green-700 font-medium text-xs">
                  <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {guideline.category}
                </span>
              </p>
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Steps:</span>{' '}
                <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-green-100 border border-green-300 rounded-md text-green-700 font-medium text-xs">
                  <FileCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{' '}
                  {guideline.steps.length} steps
                </span>
              </p>
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Total Time:</span>{' '}
                <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-green-100 border border-green-300 rounded-md text-green-700 font-medium text-xs">
                  <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{' '}
                  {guideline.totalEstimatedTime}
                </span>
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-red-700 font-semibold leading-relaxed">
                    Warning: This will permanently remove these guidelines and
                    all its steps from the system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 border-2 border-gray-300 bg-white text-gray-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-8 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:from-red-700 hover:to-red-800 transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl order-1 sm:order-2"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /> Delete Guidelines
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteModal;
