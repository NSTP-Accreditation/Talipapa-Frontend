import React from 'react';
import { Edit2, Trash2, MoreVertical, Copy, Leaf, Check } from 'lucide-react';

interface ItemInt {
  name: string;
}

interface ProgramItem {
  _id: string;
  title: string;
  items: ItemInt[];
  category?: string;
  createdAt?: string;
}

interface Props {
  program: ProgramItem;
  onEdit?: (p: ProgramItem) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ProgramCard({
  program,
  onEdit,
  onDuplicate,
  onDelete,
}: Props) {
  return (
    <div className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-green-400 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Header Section */}
      <div className="relative p-5 sm:p-6 bg-gradient-to-br from-green-600 to-green-700 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white/30">
                <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-md" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg sm:text-xl text-white leading-snug mb-2 drop-shadow-sm">
                  {program.title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {program.category && (
                    <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-semibold border border-white/30">
                      {program.category}
                    </span>
                  )}
                  <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-semibold border border-white/30">
                    {program.items.length} item
                    {program.items.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative group/menu flex-shrink-0">
              <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-4 h-4 text-white" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-1.5 z-[10] opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all">
                <button
                  onClick={() => onEdit && onEdit(program)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Program
                </button>
                <button
                  onClick={() => onDuplicate && onDuplicate(program._id)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => onDelete && onDelete(program._id)}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="p-5 sm:p-6 flex-1">
        <div className="space-y-2">
          {program.items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 p-3 rounded-lg bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 transition-all duration-200"
            >
              <div className="flex-shrink-0 w-5 h-5 rounded-md bg-green-600 flex items-center justify-center shadow-sm mt-0.5">
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm text-gray-700 leading-relaxed">
                {item?.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="px-5 sm:px-6 py-3.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
        <div className="text-xs text-gray-500 font-medium">
          {program.createdAt &&
            new Date(program.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit && onEdit(program)}
            className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all hover:shadow-md font-semibold text-sm"
            title="Edit Program"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            onClick={() => onDelete && onDelete(program._id)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-300 hover:border-red-500 rounded-lg transition-all hover:shadow-md font-semibold text-sm"
            title="Delete Program"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
