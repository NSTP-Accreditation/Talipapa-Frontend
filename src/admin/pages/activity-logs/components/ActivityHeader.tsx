import React from 'react';
import { Activity } from 'lucide-react';

interface ActivityHeaderProps {
  title: string;
  description: string;
}

export const ActivityHeader = ({title, description} : ActivityHeaderProps) => {
  return (
    <div className="mb-4 sm:mb-8">
      <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-black flex items-center gap-2 sm:gap-4 mb-1">
        <Activity className="w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10 text-green-600" />
        {title}
      </h1>
      <div className="h-1 sm:h-2 md:h-3" />
      <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">
        {description}
      </p>
    </div>
  );
};