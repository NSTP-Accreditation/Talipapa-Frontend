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

// ============= PAGE-SPECIFIC SKELETONS =============

// Home Page Skeleton (User Side)
export const HomePageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-5 w-24" />
        </div>
      </div>

      {/* Carousel Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Skeleton className="h-96 w-full rounded-2xl mb-8" />
      </div>

      {/* Mission/Vision Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Calendar Events Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-8 pb-16">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md">
              <Skeleton className="h-32 w-full rounded-lg mb-4" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// About Us Page Skeleton (User Side)
export const AboutUsPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* About Barangay Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-5 w-96 mx-auto mb-2" />
          <Skeleton className="h-5 w-80 mx-auto" />
        </div>

        {/* Mission/Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Officials Skeleton */}
        <div className="mb-16">
          <Skeleton className="h-10 w-64 mx-auto mb-8" />
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md text-center">
                <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
                <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Map Skeleton */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <Skeleton className="h-10 w-48 mb-6" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

// Trading Page Skeleton (User Side)
export const TradingPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white py-4 px-6 border-b-2 border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-5 w-full max-w-2xl mx-auto" />
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-6">
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>

        {/* Result Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <Skeleton className="h-32 w-32 rounded-xl mx-auto mb-6" />
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <div className="text-center space-y-2">
            <Skeleton className="h-6 w-48 mx-auto" />
            <Skeleton className="h-6 w-56 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Guidelines Page Skeleton (User Side)
export const GuidelinesPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Breadcrumb */}
      <div className="bg-white py-4 px-6 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header with Clock */}
        <div className="text-center mb-12">
          <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-48 mx-auto mb-2" />
          <Skeleton className="h-5 w-32 mx-auto" />
        </div>

        {/* Guidelines Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <Skeleton className="h-12 w-12 rounded-lg mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Dashboard Skeleton (Admin Side)
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-3" />
        <Skeleton className="h-6 w-96" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-green-200">
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Skeleton className="h-6 w-48 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Skeleton className="h-6 w-48 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Settings Page Skeleton (Admin Side)
export const SettingsPageSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-3" />
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Barangay Settings */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Skeleton className="h-7 w-56 mb-6" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Admin Users */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Skeleton className="h-7 w-48 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Form/Table Page Skeleton (Records, EarnPoints, etc.)
export const FormTablePageSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen space-y-8">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <Skeleton className="h-9 w-64 mb-3" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-11 w-36 rounded-xl" />
          <Skeleton className="h-11 w-40 rounded-xl" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 mb-8">
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-4 border-b-2 border-gray-200">
          <div className="grid grid-cols-5 gap-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
        
        {/* Table Rows */}
        <div className="divide-y divide-gray-200">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="px-6 py-4">
              <div className="grid grid-cols-5 gap-4 items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
};
