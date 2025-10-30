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
}

const SlideCard: React.FC<SlideCardProps> = ({
  slide,
  idx,
  slidesLength,
  onMove,
  onEdit,
  onDelete,
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
    <div className="group bg-white rounded-xl overflow-hidden border-2 border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {slide.image?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slide.image.url}
            alt={slide.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-20 h-20 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-500 text-white mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
          <ImageIcon className="w-5 h-5" />
        </div>

        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-green-600 transition-colors leading-tight">
          {slide.title}
        </h3>

        {slide.subtitle && (
          <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
            {slide.subtitle}
          </p>
        )}

        {slide.link && (
          <a
            href={slide.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-600 text-sm font-semibold hover:text-green-700 hover:gap-3 transition-all mb-3"
          >
            <span>View Link</span>
            <span>→</span>
          </a>
        )}

        <div className="text-xs text-gray-500 mb-3">
          Order: {slide.order ?? idx}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-gray-100">
          <button
            onClick={() => onMove(idx, 'up')}
            disabled={idx === 0}
            className="flex items-center justify-center gap-1 px-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
            title="Move Up"
          >
            <ArrowUp size={14} /> Up
          </button>
          <button
            onClick={() => onMove(idx, 'down')}
            disabled={idx === slidesLength - 1}
            className="flex items-center justify-center gap-1 px-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
            title="Move Down"
          >
            <ArrowDown size={14} /> Down
          </button>
          <button
            onClick={() => onEdit(slide)}
            className="flex items-center justify-center gap-1 px-2 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-semibold"
            title="Edit"
          >
            <SquarePen size={14} /> Edit
          </button>
          <>
            <button
              onClick={() => setIsConfirmOpen(true)}
              className="flex items-center justify-center gap-1 px-2 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-semibold"
              title="Delete"
            >
              <Trash2 size={14} /> Delete
            </button>
            <ConfirmModal
              isOpen={isConfirmOpen}
              title={`Delete slide "${slide.title}"?`}
              description={
                <span>
                  Are you sure you want to delete this slide? This action cannot
                  be undone.
                </span>
              }
              confirmLabel="Delete"
              cancelLabel="Cancel"
              loading={isDeleting}
              onClose={() => setIsConfirmOpen(false)}
              onConfirm={handleConfirmDelete}
            />
          </>
        </div>
      </div>
    </div>
  );
};

export default SlideCard;
