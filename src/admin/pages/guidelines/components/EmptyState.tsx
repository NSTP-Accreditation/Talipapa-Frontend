import React from 'react';

type Props = {
  onAdd: () => void;
  searchActive: boolean;
  message?: string;
};

const EmptyState: React.FC<Props> = ({ onAdd, searchActive, message }) => {
  return (
    <div className="text-center py-12 sm:py-16 bg-white rounded-lg sm:rounded-2xl shadow-lg border-2 border-dashed border-gray-300">
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full mx-auto flex items-center justify-center mb-4 sm:mb-6">
        <svg
          className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2m-6 9l2 2 4-4"
          />
        </svg>
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
        No guidelines found
      </h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto px-4">
        {searchActive
          ? "Try adjusting your search or filter criteria to find what you're looking for."
          : message ||
            'Get started by creating your first step-by-step guideline for barangay services.'}
      </p>
      {!searchActive && (
        <div className="mt-6 sm:mt-8">
          <button
            onClick={onAdd}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-bold mx-auto shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Your First Guidelines
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
