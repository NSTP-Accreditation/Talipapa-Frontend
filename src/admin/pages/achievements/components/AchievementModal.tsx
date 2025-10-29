import React from 'react';
import { createPortal } from 'react-dom';
import { Plus, SquarePen, X, ImageIcon, Image, Link, Eye } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  form: any;
  editingIndex: number | null;
  onChange: (k: string, v: any) => void;
  onFile: (file: File | null) => Promise<void> | void;
  onSave: () => Promise<void> | void;
  fileUploading: boolean;
};

export default function AchievementModal({
  open,
  onClose,
  form,
  editingIndex,
  onChange,
  onFile,
  onSave,
  fileUploading,
}: Props) {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-slideUp">
        <div className="relative p-8 bg-gradient-to-br from-green-500 via-green-600 to-green-600 text-white overflow-hidden">
          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 sm:gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center ring-2 ring-white/30 flex-shrink-0">
                {editingIndex === null ? (
                  <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                ) : (
                  <SquarePen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-0.5 sm:mb-1 truncate">
                  {editingIndex === null
                    ? 'Add New Achievement'
                    : 'Edit Achievement'}
                </h3>
                <p className="text-green-100 text-xs sm:text-sm font-medium truncate">
                  {editingIndex === null
                    ? 'Create a new achievement entry'
                    : 'Update achievement details'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 ring-1 ring-white/30 flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6 overflow-y-auto flex-1">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3 pb-2 sm:pb-3 border-b-2 border-green-100">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                <SquarePen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900">
                Achievement Details
              </h4>
            </div>

            <label className="block">
              <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <SquarePen className="w-4 h-4 text-green-600" />
                Title <span className="text-red-500">*</span>
              </div>
              <input
                type="text"
                value={form.title}
                onChange={(e) => onChange('title', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium text-sm sm:text-base"
                placeholder="Enter achievement title..."
              />
            </label>

            <label className="block">
              <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <SquarePen className="w-4 h-4 text-green-600" />
                Description
              </div>
              <textarea
                value={form.description}
                onChange={(e) => onChange('description', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none resize-none text-gray-900 font-medium text-sm sm:text-base"
                rows={5}
                placeholder="Describe this achievement..."
              />
            </label>

            <label className="block">
              <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Link className="w-4 h-4 text-green-600" />
                Link (optional)
              </div>
              <input
                type="url"
                value={form.link}
                onChange={(e) => onChange('link', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium text-sm sm:text-base"
                placeholder="https://example.com/achievement"
              />
            </label>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3 pb-2 sm:pb-3 border-b-2 border-green-100">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                <Image className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900">
                Image
              </h4>
            </div>

            <label className="block">
              <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-green-600" />
                Upload Image
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onFile(e.target.files?.[0] || null)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 file:font-bold hover:file:bg-green-100 file:cursor-pointer transition-all"
              />
              {fileUploading && (
                <div className="text-xs sm:text-sm text-green-600 mt-2 font-medium flex items-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </div>
              )}
            </label>

            <div className="pt-2">
              <div className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-green-600" />
                Image Preview
              </div>
              <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex items-center justify-center border-2 border-gray-200 shadow-inner">
                {form.imagePreview ? (
                  <img
                    src={form.imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Image className="w-16 h-16 mb-2 mx-auto text-gray-400" />
                    <div className="text-gray-400 font-medium">
                      No image selected
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-green-800 font-medium">
                <span className="font-bold">Note:</span> Fields marked with{' '}
                <span className="text-red-500 font-bold">*</span> are required.
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 bg-gradient-to-r from-gray-50 to-white border-t-2 border-gray-100 flex gap-2 sm:gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm sm:text-base"
          >
            {editingIndex === null ? (
              <>
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Create Achievement</span>
              </>
            ) : (
              <>
                <SquarePen className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
