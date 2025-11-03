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
}: FiltersSectionProps) => {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border border-gray-200 sm:border-2 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            type="text"
            placeholder="Search by title, action, or user..."
            value={search}
            onChange={onSearchChange}
            className="flex-1 border border-gray-300 sm:border-2 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base"
          />

          <button
            onClick={onRefresh}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all text-sm sm:text-base whitespace-nowrap"
            title="Refresh activity logs"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="leading-none">Refresh</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <select
            value={category}
            onChange={onCategoryChange}
            className="flex-1 border border-gray-300 sm:border-2 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => onSortToggle()}
            className="flex-1 border border-gray-300 sm:border-2 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base bg-white"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
};
