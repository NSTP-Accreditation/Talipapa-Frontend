import React, { useEffect, useState } from 'react';
import {
  Save,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  GripVertical,
  Leaf,
  Search,
  MoreVertical,
  Copy,
} from 'lucide-react';
import { useLoadingState } from '../../hooks/useLoadingState';
import { FormTablePageSkeleton } from '../../components/LoadingSkeletons';

const STORAGE_KEY = 'talipapanatin_programs_v1';

interface ProgramItem {
  id: string;
  title: string;
  items: string[];
  category?: string;
  createdAt?: string;
}

const categories = [
  'Circular Economy',
  'Waste Management',
  'Community Programs',
  'Education',
  'Health & Wellness',
  'Livelihood',
  'Other',
];

const initialPrograms: ProgramItem[] = [
  {
    id: crypto.randomUUID(),
    title: 'Circular Economy',
    items: [
      'Rotting Mix / Soil Conditioner',
      'Fertilizer',
      'Vermitea / Liquid Conditioner',
    ],
    category: 'Circular Economy',
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Recyclable Trading Activity',
    items: [
      'Single-Use Soft and Hard Plastics',
      'Candy and Chocolate Wrappers',
      'Plastic Bags, Food Wrapping',
      'Food Takeaway Containers',
      'Used Clothes / Rags',
    ],
    category: 'Waste Management',
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Trash to Cashback',
    items: [
      'General Solid Waste Materials',
      'Trash to School Supplies',
      'Office Supplies and Materials',
    ],
    category: 'Community Programs',
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Trash to Books',
    items: ['Educational Materials', 'Reading Materials for Community'],
    category: 'Education',
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Trash to Medicines',
    items: ['Herbal Medicine', 'First Aid Supplies', 'Medical Equipment'],
    category: 'Health & Wellness',
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Eco Brick Making',
    items: [
      'Basic Urban Farming Tutorial',
      'Basic Sewing Tutorial and Livelihood',
      'Eco Brick Making',
    ],
    category: 'Livelihood',
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Community Pantry / Soup Kitchen',
    items: ['Food Distribution', 'Community Meals', 'Nutrition Programs'],
    category: 'Community Programs',
    createdAt: new Date().toISOString(),
  },
];

// localStorage hook
function useLocalStorage<T>(
  key: string,
  initial: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      console.warn('Failed to save to localStorage');
    }
  }, [key, state]);

  return [state, setState];
}

export default function TalipapaNatin() {
  const { isLoading: pageLoading } = useLoadingState(1000);
  const [programs, setPrograms] = useLocalStorage<ProgramItem[]>(
    STORAGE_KEY,
    initialPrograms
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProgramItem | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter programs
  const filteredPrograms = programs.filter((program) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        program.title.toLowerCase().includes(query) ||
        program.items.some((item) => item.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // Program Management
  const handleAddProgram = () => {
    const newProgram: ProgramItem = {
      id: crypto.randomUUID(),
      title: 'New Program',
      items: ['New Item'],
      category: 'Other',
      createdAt: new Date().toISOString(),
    };
    setEditing(newProgram);
    setIsModalOpen(true);
  };

  const handleDeleteProgram = (id: string) => {
    const program = programs.find((p) => p.id === id);
    if (
      program &&
      confirm(`Are you sure you want to delete "${program.title}"?`)
    ) {
      setPrograms((prev) => prev.filter((p) => p.id !== id));
      setHasUnsavedChanges(true);
    }
  };

  const duplicateProgram = (id: string) => {
    const program = programs.find((p) => p.id === id);
    if (program) {
      const duplicate: ProgramItem = {
        ...program,
        id: crypto.randomUUID(),
        title: `${program.title} (Copy)`,
        createdAt: new Date().toISOString(),
      };
      setPrograms((prev) => [...prev, duplicate]);
      setHasUnsavedChanges(true);
    }
  };

  const openEdit = (program: ProgramItem) => {
    setEditing(JSON.parse(JSON.stringify(program))); // deep clone
    setIsModalOpen(true);
  };

  const saveEdit = () => {
    if (!editing) return;

    const exists = programs.some((p) => p.id === editing.id);

    if (exists) {
      setPrograms((prev) =>
        prev.map((p) => (p.id === editing.id ? editing : p))
      );
    } else {
      setPrograms((prev) => [...prev, editing]);
    }

    setHasUnsavedChanges(true);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  // Editing Items
  const addItem = () => {
    if (!editing) return;
    setEditing({ ...editing, items: [...editing.items, 'New Item'] });
  };

  const updateItem = (i: number, value: string) => {
    if (!editing) return;
    const items = [...editing.items];
    items[i] = value;
    setEditing({ ...editing, items });
  };

  const removeItem = (i: number) => {
    if (!editing) return;
    setEditing({
      ...editing,
      items: editing.items.filter((_, idx) => idx !== i),
    });
  };

  const handleSaveAll = () => {
    setHasUnsavedChanges(false);
    alert('✅ All changes saved successfully!');
  };

  if (pageLoading) {
    return <FormTablePageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1b4c2e] to-[#2d5a3d] flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                  TalipapaNatin Program
                </h1>
                <p className="text-sm text-slate-600 font-medium">
                  "May Buhay sa Basura ng Barangay" - Community Sustainability
                  Programs
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {hasUnsavedChanges && (
                <button
                  onClick={handleSaveAll}
                  className="px-4 py-2 bg-gradient-to-r from-[#1b4c2e] to-[#2d5a3d] hover:from-[#2d5a3d] hover:to-[#1b4c2e] text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm font-semibold"
                >
                  <Save className="w-4 h-4" />
                  Save All
                </button>
              )}

              <button
                onClick={handleAddProgram}
                className="px-4 py-2 bg-gradient-to-r from-[#1b4c2e] to-[#2d5a3d] hover:from-[#2d5a3d] hover:to-[#1b4c2e] text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add Program
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Search */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search programs and items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:border-[#1b4c2e] focus:ring-2 focus:ring-[#1b4c2e]/20 outline-none transition-all"
              />
            </div>

            <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
              {filteredPrograms.length} program
              {filteredPrograms.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Programs Display */}
        {filteredPrograms.length === 0 ? (
          <div className="py-20">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Leaf className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              {programs.length === 0 ? 'No Programs Yet' : 'No Programs Found'}
            </h3>
            <p className="text-slate-500 mb-6">
              {programs.length === 0
                ? 'Start by adding your first sustainability program'
                : 'Try adjusting your search'}
            </p>
            {programs.length === 0 && (
              <button
                onClick={handleAddProgram}
                className="px-6 py-3 bg-gradient-to-r from-[#1b4c2e] to-[#2d5a3d] hover:from-[#2d5a3d] hover:to-[#1b4c2e] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Your First Program
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-[#1b4c2e]/30 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1b4c2e] to-[#2d5a3d] flex items-center justify-center flex-shrink-0 shadow-md">
                        <Leaf className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-900 leading-tight truncate">
                            {program.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {program.category && (
                            <span className="text-xs bg-[#1b4c2e]/10 text-[#1b4c2e] px-2 py-1 rounded-full font-medium border border-[#1b4c2e]/20">
                              {program.category}
                            </span>
                          )}
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium border border-slate-200">
                            {program.items.length} item
                            {program.items.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown Menu */}
                    <div className="relative group/menu">
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all">
                        <button
                          onClick={() => openEdit(program)}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => duplicateProgram(program.id)}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate
                        </button>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button
                          onClick={() => handleDeleteProgram(program.id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Program Items */}
                <div className="px-6 pb-4">
                  <div className="space-y-2">
                    {program.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-3 rounded-lg bg-slate-50/50 hover:bg-[#1b4c2e]/5 transition-colors"
                      >
                        <Check className="w-4 h-4 text-[#1b4c2e] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    {program.createdAt &&
                      new Date(program.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => openEdit(program)}
                    className="text-xs font-semibold text-[#1b4c2e] hover:text-[#2d5a3d] flex items-center gap-1 hover:underline transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button (Mobile) */}
      <button
        onClick={handleAddProgram}
        className="fixed right-6 bottom-6 sm:hidden w-14 h-14 rounded-full bg-gradient-to-br from-[#1b4c2e] to-[#2d5a3d] hover:from-[#2d5a3d] hover:to-[#1b4c2e] text-white shadow-2xl hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-40"
        aria-label="Add Program"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Edit Modal */}
      {isModalOpen && editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
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
                      {programs.some((p) => p.id === editing.id)
                        ? 'Edit Program'
                        : 'Add New Program'}
                    </h3>
                    <p className="text-white/80 text-sm">
                      Configure program details and items
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={closeModal}
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
                    Program Title
                  </label>
                  <input
                    type="text"
                    value={editing.title}
                    onChange={(e) =>
                      setEditing({ ...editing, title: e.target.value })
                    }
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
                    value={editing.category || 'Other'}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value })
                    }
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
                    Program Items ({editing.items.length})
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
                  {editing.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 items-start bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-[#1b4c2e]/30 transition-colors"
                    >
                      <GripVertical className="w-5 h-5 text-slate-400 flex-shrink-0 mt-2 cursor-grab" />
                      <input
                        type="text"
                        value={item}
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

                  {editing.items.length === 0 && (
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
                onClick={closeModal}
                className="px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-6 py-3 bg-gradient-to-r from-[#1b4c2e] to-[#2d5a3d] hover:from-[#2d5a3d] hover:to-[#1b4c2e] text-white rounded-lg font-semibold shadow-lg transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Program
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
