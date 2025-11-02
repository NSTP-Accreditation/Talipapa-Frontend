import React from 'react';
import { Activity, Clock, FileText, Filter } from 'lucide-react';

interface ActivityHeaderProps {
  title: string;
  description: string;
}

export const ActivityHeader = ({ title, description }: ActivityHeaderProps) => {
  return (
    <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-600 rounded-full -ml-24 -mb-24"></div>
      </div>

      <div className="relative p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 shadow-lg ring-4 ring-green-100 animate-pulse-slow">
            <Activity className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-medium mb-4">
              {description}
            </p>

            {/* Quick Info Pills */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs sm:text-sm font-semibold text-green-700">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Real-time Tracking</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs sm:text-sm font-semibold text-blue-700">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Audit Trail</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-xs sm:text-sm font-semibold text-purple-700">
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Category Filter</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
