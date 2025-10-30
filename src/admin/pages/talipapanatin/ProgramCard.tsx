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
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-[#1b4c2e]/30 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
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

          <div className="relative group/menu">
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100">
              <MoreVertical className="w-4 h-4 text-slate-400" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-[10] opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all">
              <button
                onClick={() => onEdit && onEdit(program)}
                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => onDuplicate && onDuplicate(program._id)}
                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={() => onDelete && onDelete(program._id)}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="space-y-2">
          {program.items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-3 rounded-lg bg-slate-50/50 hover:bg-[#1b4c2e]/5 transition-colors"
            >
              <Check className="w-4 h-4 text-[#1b4c2e] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700 leading-relaxed">
                {item?.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          {program.createdAt &&
            new Date(program.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit && onEdit(program)}
            className="p-2 sm:p-2.5 bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-300 hover:border-blue-500 rounded-lg sm:rounded-xl transition-all hover:shadow-md"
            title="Edit Program"
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={() => onDelete && onDelete(program._id)}
            className="p-2 sm:p-2.5 bg-white hover:bg-red-50 text-red-600 border-2 border-red-300 hover:border-red-500 rounded-lg sm:rounded-xl transition-all hover:shadow-md"
            title="Delete Program"
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
