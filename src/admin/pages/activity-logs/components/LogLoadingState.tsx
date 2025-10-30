import ResponsiveSkeleton from '@/components/ResponsiveSkeleton';
import React from 'react';

interface LoadingErrorStateProps {
  loading: boolean;
  error: string | null;
}

export const LogLoadingState: React.FC<LoadingErrorStateProps> = ({ 
  loading, 
  error 
}) => {
  if (loading) return <ResponsiveSkeleton page="activitylogs" />;

  if (error) {
    return (
      <div className="p-4 sm:p-10 text-center text-red-600 font-semibold text-sm sm:text-base">
        Failed to load logs: {error}
      </div>
    );
  }

  return null;
};