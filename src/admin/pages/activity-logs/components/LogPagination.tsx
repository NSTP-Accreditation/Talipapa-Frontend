import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const LogPagination = ({
  currentPage,
  totalPages,
  hasPrevPage,
  hasNextPage,
  onPrevPage,
  onNextPage,
}: PaginationProps) => {
  return (
    <div className="flex justify-center items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
      <button
        onClick={onPrevPage}
        disabled={!hasPrevPage}
        className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold flex items-center gap-1 text-xs sm:text-sm min-h-[40px] shadow-lg transition-all ${
          hasPrevPage
            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-xl'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
        <span>Prev</span>
      </button>

      <span className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-50 to-green-100 text-green-900 font-bold text-xs sm:text-sm min-h-[40px] flex items-center border-2 border-green-200">
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={onNextPage}
        disabled={!hasNextPage}
        className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold flex items-center gap-1 text-xs sm:text-sm min-h-[40px] shadow-lg transition-all ${
          hasNextPage
            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-xl'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        <span>Next</span>
        <ChevronRight size={16} className="sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};
