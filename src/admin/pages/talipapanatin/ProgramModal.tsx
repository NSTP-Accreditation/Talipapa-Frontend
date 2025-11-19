import React from 'react';
import { X, Leaf, Plus, GripVertical, Trash2, Save } from 'lucide-react';

interface ItemInt {
  name: string;
}

interface ProgramFormData {
  title: string;
  category: string;
  items: ItemInt[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formData: ProgramFormData;
  onTitleChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  addItem: () => void;
  updateItem: (idx: number, value: string) => void;
  removeItem: (idx: number) => void;
  saveEdit: () => void;
  editingProgram?: any;
  categories: string[];
}

export default function ProgramModal({
  isOpen,
  onClose,
  formData,
  onTitleChange,
  onCategoryChange,
  addItem,
  updateItem,
  removeItem,
  saveEdit,
  editingProgram,
  categories,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="relative p-8 bg-gradient-to-br from-[#1b4c2e] via-[#2d5a3d] to-[#1b4c2e] text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  {editingProgram ? 'Edit Program' : 'Add New Program'}
                </h3>
                <p className="text-white/80 text-sm">
                  Configure program details and items
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:rotate-90 duration-300 text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Program Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Program Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-[#1b4c2e] focus:ring-2 focus:ring-[#1b4c2e]/20 outline-none transition-all"
                placeholder="Enter program title..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-[#1b4c2e] focus:ring-2 focus:ring-[#1b4c2e]/20 outline-none bg-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Program Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-slate-700">
                Program Items ({formData.items.length})
              </label>
              <button
                onClick={addItem}
                className="px-4 py-2 border border-[#1b4c2e] text-[#1b4c2e] hover:bg-[#1b4c2e] hover:text-white rounded-lg transition-all flex items-center gap-2 text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {formData.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-start bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-[#1b4c2e]/30 transition-colors"
                >
                  <GripVertical className="w-5 h-5 text-slate-400 flex-shrink-0 mt-2 cursor-grab" />
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(idx, e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:border-[#1b4c2e] focus:ring-2 focus:ring-[#1b4c2e]/20 outline-none"
                    placeholder={`Item ${idx + 1}...`}
                  />
                  <button
                    onClick={() => removeItem(idx)}
                    className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg transition-all flex-shrink-0 flex items-center gap-2 text-sm font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              ))}

              {formData.items.length === 0 && (
                <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="text-sm">
                    No items yet. Click "Add Item" to start.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={saveEdit}
            className="px-6 py-3 bg-gradient-to-r from-[#1b4c2e] to-[#2d5a3d] hover:from-[#2d5a3d] hover:to-[#1b4c2e] text-white rounded-lg font-semibold shadow-lg transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {editingProgram ? 'Update Program' : 'Create Program'}
          </button>
        </div>
      </div>
    </div>
  );
}
