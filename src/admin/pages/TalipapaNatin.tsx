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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProgramItem | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
    <div className="p-4 sm:p-6 md:p-8 space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Leaf className="w-10 h-10 text-green-600" />
            TalipapaNatin Program
          </h1>
          <p className="text-lg text-gray-700 mt-3 font-medium">
            "May Buhay sa Basura ng Barangay" - Community Waste Management &
            Sustainability Programs
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
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
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Program
          </button>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {programs.map((program) => (
          <article
            key={program.id}
            className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between mb-4 pb-4 border-b-2 border-gray-100">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0 group-hover:from-green-200 group-hover:to-green-300 transition-all">
                  <Leaf className="w-5 h-5 text-green-700" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {program.title}
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-3">
                <button
                  onClick={() => openEdit(program)}
                  className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all"
                  title="Edit Program"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteProgram(program.id)}
                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                  title="Delete Program"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Program Items */}
            <ul className="space-y-2">
              {program.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-green-50 hover:to-green-100/50 transition-all group/item"
                >
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 leading-relaxed flex-1">
                    {item}
                  </span>
                  <GripVertical className="w-4 h-4 text-gray-300 opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0" />
                </li>
              ))}
            </ul>

            {/* Item Count Badge */}
            <div className="mt-4 pt-4 border-t-2 border-gray-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">
                {program.items.length}{' '}
                {program.items.length === 1 ? 'Item' : 'Items'}
              </span>
              <button
                onClick={() => openEdit(program)}
                className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1 hover:underline"
              >
                <Edit2 size={12} />
                Edit
              </button>
            </div>
          </article>
        ))}

        {/* Empty State */}
        {programs.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Leaf className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Programs Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start by adding your first sustainability program
            </p>
            <button
              onClick={handleAddProgram}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Your First Program
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
          className="fixed inset-0 z-1003 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden z-10 flex flex-col">
            {/* Modal Header */}
            <div className="relative p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {programs.some((p) => p.id === editing.id)
                        ? 'Edit Program'
                        : 'Add New Program'}
                    </h3>
                    <p className="text-green-100 text-sm ">
                      Configure program details and items
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="w-10 h-10 absolute top-10 right-4 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:rotate-90 duration-300 ring-2 ring-white/30"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Program Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Program Title
                </label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-900 font-medium"
                  placeholder="Enter program title..."
                />
              </div>

              {/* Program Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Program Items ({editing.items.length})
                  </label>
                  <button
                    onClick={addItem}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200 transition-all flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Item
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
                        onClick={() => removeItem(idx)}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200 transition-all flex-shrink-0 flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Remove
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
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-100 bg-gray-50">
              <button
                onClick={closeModal}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Save size={20} />
                Save Program
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
