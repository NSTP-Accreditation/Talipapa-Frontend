import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Guideline } from '../types';
import { Trash2 } from 'lucide-react';

type Props = {
  guideline: Guideline;
  selected: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const GuidelinesCard: React.FC<Props> = ({
  guideline,
  selected,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      key={guideline._id}
      className="bg-white border-2 border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-green-300 group cursor-pointer overflow-hidden flex flex-col"
    >
      <CardHeader className="pb-3 sm:pb-4 bg-gradient-to-br from-white to-gray-50 group-hover:from-green-50 group-hover:to-white transition-all duration-300">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex items-start gap-2 sm:gap-3 pl-0.5 sm:pl-1 flex-1 min-w-0">
            <div
              className="bg-gradient-to-br from-green-100 to-green-200 p-1 sm:p-1.5 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300 shadow-sm"
              style={{ width: '32px', height: '32px' }}
            >
              <svg
                className="text-green-700 group-hover:scale-110 transition-transform duration-300"
                style={{ width: '18px', height: '18px' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
                />
              </svg>
            </div>

            <div className="flex-1 min-w-0 pl-1 sm:pl-2">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 leading-tight group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
                {guideline.title}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md sm:rounded-lg border border-gray-200">
                  📂 {guideline.category}
                </span>
                <span
                  className={`text-xs font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg ${
                    guideline.difficulty === 'Easy'
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : guideline.difficulty === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                  }`}
                >
                  {guideline.difficulty}
                </span>
              </div>
            </div>
          </div>

          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(guideline._id)}
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-md border-2 border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500 cursor-pointer transition-all hover:border-green-500 flex-shrink-0"
          />
        </div>
      </CardHeader>

      <CardContent className="pt-1.5 sm:pt-2 flex-1 flex flex-col">
        <div className="flex flex-col h-full">
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-2 mb-3 sm:mb-4">
            {guideline.description}
          </p>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-blue-200">
              <p className="text-xs font-semibold text-blue-700">Steps</p>
              <p className="text-base sm:text-lg font-bold text-blue-900">
                {guideline.steps.length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-purple-200">
              <p className="text-xs font-semibold text-purple-700">Time</p>
              <p className="text-base sm:text-lg font-bold text-purple-900">
                {guideline.totalEstimatedTime}
              </p>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-2.5 pt-3 sm:pt-4 mt-auto border-t-2 border-gray-200">
            <div className="flex gap-2 sm:gap-2.5">
              <button
                onClick={() => onEdit(guideline._id)}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:shadow-md"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(guideline._id)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 text-red-600 hover:text-white hover:bg-red-600 rounded-lg sm:rounded-xl transition-all border-2 border-red-300 hover:border-red-600 font-semibold hover:shadow-md"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuidelinesCard;
