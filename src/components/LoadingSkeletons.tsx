import React from 'react';

// Base Skeleton Component
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
      style={{
        animation: 'shimmer 1s infinite',
      }}
    />
  );
};

// Page Loading Skeleton
export const PageLoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen p-6 sm:p-10" style={{ backgroundColor: '#F6F6F6' }}>
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-6 w-96" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-md">
            <Skeleton className="h-12 w-12 rounded-full mb-4" />
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>

      {/* Table/Content Skeleton */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Card Loading Skeleton
export const CardLoadingSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-xl shadow-md">
          <Skeleton className="h-48 w-full mb-4 rounded-lg" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Table Loading Skeleton
export const TableLoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Table Header */}
      <div className="border-b px-6 py-4 flex gap-4" style={{ backgroundColor: '#F6F6F6' }}>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-48 flex-1" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
      
      {/* Table Rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex gap-4 items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48 flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Spinner Component
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; color?: string }> = ({
  size = 'md',
  color = '#1a4d2e',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-t-transparent`}
        style={{ borderColor: `${color}40`, borderTopColor: color }}
      />
    </div>
  );
};

// Full Page Spinner
export const FullPageSpinner: React.FC = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: '#F6F6F6' }}
    >
      <div className="text-center">
        <div className="mb-6">
          <div
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: '#1a4d2e' }}
          >
            <Spinner size="lg" color="#ffffff" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a4d2e' }}>
          Loading...
        </h2>
        <p className="text-base" style={{ color: '#838383' }}>
          Please wait while we load your content
        </p>
      </div>
    </div>
  );
};

// Button Loading State
export const ButtonSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      <span>Loading...</span>
    </div>
  );
};

// Inline Loading
export const InlineLoader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center gap-3 p-8">
      <Spinner size="md" />
      <span className="text-lg font-medium" style={{ color: '#838383' }}>
        {text}
      </span>
    </div>
  );
};

// Add shimmer animation to global styles
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;
document.head.appendChild(style);
