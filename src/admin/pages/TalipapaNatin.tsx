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
} from 'lucide-react';
import { useLoadingState } from '../../hooks/useLoadingState';
import { FormTablePageSkeleton } from '../../components/LoadingSkeletons';

const STORAGE_KEY = 'talipapanatin_programs_v1';

interface ProgramItem {
  id: string;
  title: string;
  items: string[];
}

const initialPrograms: ProgramItem[] = [
  {
    id: crypto.randomUUID(),
    title: 'Circular Economy',
    items: [
      'Rotting Mix / Soil Conditioner',
      'Fertilizer',
      'Vermitea / Liquid Conditioner',
    ],
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
  },
  {
    id: crypto.randomUUID(),
    title: 'Trash to Cashback',
    items: [
      'General Solid Waste Materials',
      'Trash to School Supplies',
      'Office Supplies and Materials',
    ],
  },
  {
    id: crypto.randomUUID(),
    title: 'Trash to Books',
    items: ['Educational Materials', 'Reading Materials for Community'],
  },
  {
    id: crypto.randomUUID(),
    title: 'Trash to Medicines',
    items: ['Herbal Medicine', 'First Aid Supplies', 'Medical Equipment'],
  },
  {
    id: crypto.randomUUID(),
    title: 'Eco Brick Making',
    items: [
      'Basic Urban Farming Tutorial',
      'Basic Sewing Tutorial and Livelihood',
      'Eco Brick Making',
    ],
  },
  {
    id: crypto.randomUUID(),
    title: 'Community Pantry / Soup Kitchen',
    items: ['Food Distribution', 'Community Meals', 'Nutrition Programs'],
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProgramItem | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Filtered Programs
  const filteredPrograms = searchTerm
    ? programs.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : programs;

  // Program Management
  const handleAddProgram = () => {
    const newProgram: ProgramItem = {
      id: crypto.randomUUID(),
      title: 'New Program',
      items: ['New Item'],
    };
    setEditing(newProgram);
    setIsModalOpen(true);
  };

  const handleDeleteProgram = (id: string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      setPrograms((prev) => prev.filter((p) => p.id !== id));
      setHasUnsavedChanges(true);
    }
  };

  const openEdit = (program: ProgramItem) => {
    setEditing(JSON.parse(JSON.stringify(program))); // deep clone
    setIsModalOpen(true);
  };

  const saveEdit = () => {
    if (!editing) return;

    // Check if it's a new program or existing one
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
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-3">
            <Leaf className="w-10 h-10 text-green-600" />
            TalipapaNatin Programs
          </h1>
          <p className="text-gray-700 font-medium">
            "May Buhay sa Basura ng Barangay" - Community Waste Management &
            Sustainability Programs
            <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {filteredPrograms.length}{' '}
              {filteredPrograms.length === 1 ? 'Program' : 'Programs'}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <button
              onClick={handleSaveAll}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2"
            >
              <Save size={20} />
              Save All Changes
            </button>
          )}
          <button
            onClick={handleAddProgram}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm flex items-center gap-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus size={20} />
            Add Program
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 mb-8">
        <div className="relative w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by Program Title..."
            className="w-full rounded-xl border-2 border-gray-300 py-3 pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {searchTerm && (
          <div className="mt-3 text-sm text-gray-600">
            Found{' '}
            <span className="font-semibold text-green-600">
              {filteredPrograms.length}
            </span>{' '}
            matching programs
          </div>
        )}
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPrograms.map((program) => (
          <article
            key={program.id}
            className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight flex-1">
                {program.title}
              </h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                {program.items.length}{' '}
                {program.items.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>
            <ul className="space-y-2 mb-4">
              {program.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-green-50 hover:to-green-100/50 transition-all group/item"
                >
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700 leading-relaxed flex-1">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
              <button
                onClick={() => openEdit(program)}
                className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1 hover:underline"
              >
                <Edit2 size={12} /> Edit
              </button>
              <button
                onClick={() => handleDeleteProgram(program.id)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 hover:underline"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </article>
        ))}

        {/* Empty State */}
        {filteredPrograms.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Leaf className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Programs Found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or add a new program
            </p>
            <button
              onClick={handleAddProgram}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2"
            >
              <Plus size={20} /> Add Program
            </button>
          </div>
        )}
      </div>

      {/* Floating Add Button (Mobile) */}
      <button
        onClick={handleAddProgram}
        className="fixed right-6 bottom-6 sm:hidden w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full shadow-2xl hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-40"
        aria-label="Add Program"
      >
        <Plus size={24} />
      </button>

      {/* Edit Modal */}
      {isModalOpen && editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveEdit();
            }}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-slideUp"
          >
            {/* Modal Header */}
            <div className="relative p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-4 ring-white/30 shadow-lg">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">
                      {programs.some((p) => p.id === editing.id)
                        ? 'Edit Program'
                        : 'Add New Program'}
                    </h3>
                    <p className="text-green-100 text-sm font-medium">
                      Configure program details and items
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:rotate-90 duration-300 ring-2 ring-white/30"
                  title="Close"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6 overflow-y-auto flex-1 bg-gradient-to-br from-gray-50 to-white">
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                    <Leaf className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800">
                    Program Information
                  </h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                </div>
                <label className="block group mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <span>Title</span>
                  </div>
                  <input
                    required
                    type="text"
                    value={editing.title}
                    onChange={(e) =>
                      setEditing({ ...editing, title: e.target.value })
                    }
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400"
                    placeholder="Enter program title"
                  />
                </label>
              </div>
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800">
                    Program Items
                  </h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200 transition-all flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Item
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {editing.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 items-start bg-gray-50 rounded-xl p-3 border-2 border-gray-100 hover:border-gray-200 transition-all"
                    >
                      <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0 mt-2" />
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateItem(idx, e.target.value)}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-900"
                        placeholder={`Item ${idx + 1}...`}
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200 transition-all flex-shrink-0 flex items-center gap-2"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  ))}
                  {editing.items.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">
                        No items yet. Click "Add Item" to start.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3 mt-6">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-blue-800 font-medium">
                    <span className="font-bold">Note:</span> Please ensure all
                    information is accurate before submitting.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 p-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <button
                type="button"
                onClick={closeModal}
                className="px-8 py-3.5 rounded-xl border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all hover:shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-10 py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Save size={20} /> Save Program
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
