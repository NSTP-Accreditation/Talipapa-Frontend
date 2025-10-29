import React from 'react';
import { Guideline } from '../types';

type Props = {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterCategory: string;
  setFilterCategory: (v: string) => void;
  filterDifficulty: string;
  setFilterDifficulty: (v: string) => void;
  categories: string[];
  difficulties: string[];
};

const GuidelinesFilters: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  filterDifficulty,
  setFilterDifficulty,
  categories,
  difficulties,
}) => {
  return (
    <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-4 lg:p-6 mb-6 sm:mb-8">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search guidelines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="relative flex-1">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none w-full pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm sm:text-base text-gray-700 font-medium cursor-pointer hover:border-green-400 transition-all"
            >
              <option value="">📂 All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="relative flex-1">
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="appearance-none w-full pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm sm:text-base text-gray-700 font-medium cursor-pointer hover:border-green-400 transition-all"
            >
              <option value="">⚡ All Difficulties</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidelinesFilters;
