import React, { useState } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import {
  ArrowUp,
  ArrowDown,
  SquarePen,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import type { Slide } from './types';

interface SlideCardProps {
  slide: Slide;
  idx: number;
  slidesLength: number;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onEdit: (slide: Slide) => void;
  onDelete: (id?: string) => void;
  canEditContent: boolean;
}

const SlideCard: React.FC<SlideCardProps> = ({
  slide,
  idx,
  slidesLength,
  onMove,
  onEdit,
  onDelete,
  canEditContent,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!slide._id) return;
    try {
      setIsDeleting(true);
      await onDelete(slide._id);
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-green-300 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col relative">
      {/* Order Badge */}
      <div className="absolute top-4 left-4 z-10 px-3.5 py-2 bg-gradient-to-br from-green-500 to-green-600 backdrop-blur-sm rounded-xl shadow-xl border-2 border-white">
        <span className="text-sm font-black text-white drop-shadow-sm">
          #{idx + 1}
        </span>
      </div>

      {/* Image Section */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
        {slide.image?.url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image.url}
              alt={slide.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-2xl blur-xl opacity-60"></div>
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-2xl">
                <ImageIcon className="w-14 h-14 text-white" />
              </div>
            </div>
            <span className="text-sm font-bold text-gray-500 bg-white px-4 py-2 rounded-full shadow-md">
              No Image
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1 gap-3">
        {/* Title */}
        <h3 className="font-bold text-xl text-gray-900 leading-tight line-clamp-2 group-hover:text-green-600 transition-colors min-h-[3.5rem] drop-shadow-sm">
          {slide.title}
        </h3>

        {/* Subtitle */}
        {slide.subTitle && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 min-h-[3.75rem]">
            {slide.subTitle}
          </p>
        )}

        <div className="mt-auto pt-4 border-t-2 border-gray-100">
          {canEditContent ? (
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Reorder Buttons */}
              <div className="flex gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => onMove(idx, 'up')}
                  disabled={idx === 0}
                  className="flex items-center justify-center w-9 h-9 bg-white hover:bg-green-50 text-gray-700 hover:text-green-600 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 shadow-sm disabled:hover:scale-100 disabled:shadow-none"
                  title="Move Up"
                >
                  <ArrowUp size={18} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => onMove(idx, 'down')}
                  disabled={idx === slidesLength - 1}
                  className="flex items-center justify-center w-9 h-9 bg-white hover:bg-green-50 text-gray-700 hover:text-green-600 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 shadow-sm disabled:hover:scale-100 disabled:shadow-none"
                  title="Move Down"
                >
                  <ArrowDown size={18} strokeWidth={2.5} />
                </button>
              </div>

              <div className="flex-1" />

              {/* Action Buttons */}
              <button
                onClick={() => onEdit(slide)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all text-sm font-bold hover:scale-105 active:scale-95"
                title="Edit Slide"
              >
                <SquarePen size={17} strokeWidth={2.5} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setIsConfirmOpen(true)}
                className="flex items-center justify-center w-10 h-10 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border-2 border-red-200 hover:border-red-500 rounded-xl transition-all hover:scale-110 active:scale-95 shadow-sm hover:shadow-lg"
                title="Delete Slide"
              >
                <Trash2 size={18} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center py-3 px-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
              <span className="text-sm text-gray-600 font-bold">
                👁️ View Only
              </span>
            </div>
          )}
        </div>
        {canEditContent && (
          <ConfirmModal
            isOpen={isConfirmOpen}
            title={`Delete slide "${slide.title}"?`}
            description={
              <p className="text-gray-700 text-base leading-relaxed">
                Are you sure you want to delete <strong>{slide.title}</strong>?
                This action cannot be undone.
              </p>
            }
            confirmLabel="Delete"
            cancelLabel="Cancel"
            loading={isDeleting}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </div>
    </div>
  );
};

export default SlideCard;
