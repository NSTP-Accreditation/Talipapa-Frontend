import React, { ChangeEvent } from 'react';
import { RefreshCw } from 'lucide-react';

interface FiltersSectionProps {
  search: string;
  category: string;
  sort: 'asc' | 'desc';
  categories: string[];
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onSortToggle: () => void;
  onRefresh: () => void;
}

export const FiltersSection = ({
  search,
  category,
  sort,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortToggle,
  onRefresh,
} : FiltersSectionProps ) => {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border border-gray-200 sm:border-2 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
      <div className="flex flex-col gap-2 sm:gap-3">
        <input
          type="text"
          placeholder="Search By"
          value={search}
          onChange={onSearchChange}
          className="border border-gray-300 sm:border-2 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base"
        />

        <select
          value={category}
          onChange={onCategoryChange}
          className="border border-gray-300 sm:border-2 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base"
        >
          <option value="">Filter By Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={onSortToggle}
            className="border border-gray-300 sm:border-2 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 flex-1 flex items-center gap-2 justify-center bg-white hover:bg-green-50 font-semibold text-green-900 transition-all text-sm sm:text-base"
          >
            <span>Sort By</span>
            <svg
              className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${
                sort === 'asc' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <button
            onClick={onRefresh}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex-1"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="leading-none">Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};