import React from 'react';

// Base Skeleton Component
export const Skeleton: React.FC<{ className?: string }> = ({
  className = '',
}) => {
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
    <div
      className="min-h-screen p-6 sm:p-10"
      style={{ backgroundColor: '#F6F6F6' }}
    >
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
export const CardLoadingSkeleton: React.FC<{ count?: number }> = ({
  count = 3,
}) => {
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
export const TableLoadingSkeleton: React.FC<{ rows?: number }> = ({
  rows = 5,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Table Header */}
      <div
        className="border-b px-6 py-4 flex gap-4"
        style={{ backgroundColor: '#F6F6F6' }}
      >
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
export const Spinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}> = ({ size = 'md', color = '#1a4d2e' }) => {
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
export const InlineLoader: React.FC<{ text?: string }> = ({
  text = 'Loading...',
}) => {
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
      {/* Carousel Skeleton - Full width, more prominent */}
      <div className="w-full">
        <div className="relative">
          <Skeleton className="h-[400px] sm:h-[500px] md:h-[600px] w-full" />
          {/* Carousel indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-2 w-8 rounded-full" />
            ))}
          </div>
          {/* Carousel arrows */}
          <Skeleton className="absolute left-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full" />
          <Skeleton className="absolute right-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full" />
        </div>
      </div>

      {/* Mission/Vision Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Mission Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          {/* Vision Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>

      {/* Calendar Events Skeleton */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-3" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-md border-2 border-green-100"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-6 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 pb-16">
        <div className="text-center mb-8 sm:mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-3" />
          <Skeleton className="h-5 w-80 mx-auto" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow group"
            >
              <Skeleton className="h-40 sm:h-48 w-full rounded-lg mb-4" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-4/5" />
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
      {/* Breadcrumb - Seamless with Navbar */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-t border-green-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20 bg-white/30" />
            <Skeleton className="h-4 w-4 bg-white/20" />
            <Skeleton className="h-5 w-24 bg-white/30" />
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="relative w-full h-[500px] bg-gray-300 shadow-2xl">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-green-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-6 shadow-lg">
              <Skeleton className="h-14 w-14 rounded-full" />
            </div>
            <Skeleton className="h-12 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-16">
            {/* Mission Card */}
            <div className="bg-white border-2 border-green-100 rounded-2xl shadow-xl p-10 text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <Skeleton className="h-10 w-10" />
              </div>
              <Skeleton className="h-8 w-40 mx-auto mb-6" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>

            {/* Vision Card */}
            <div className="bg-white border-2 border-green-100 rounded-2xl shadow-xl p-10 text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <Skeleton className="h-10 w-10" />
              </div>
              <Skeleton className="h-8 w-40 mx-auto mb-6" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          </div>

          {/* Barangay History */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-xl p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-md">
                  <Skeleton className="h-8 w-8" />
                </div>
                <Skeleton className="h-9 w-56" />
              </div>
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          </div>
        </div>
      </div>

      {/* Barangay Officials Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="inline-block p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-6 shadow-lg">
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
              <Skeleton className="h-12 w-96 mx-auto mb-4" />
              <Skeleton className="h-6 w-[600px] mx-auto" />
            </div>

            {/* Officials Cards - Responsive grid for desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 flex flex-col items-center text-center shadow-lg border-2 border-gray-100 w-full max-w-[280px] min-h-[240px]"
                >
                  <Skeleton className="w-24 h-24 rounded-2xl mb-4" />
                  <Skeleton className="h-5 w-36 mb-3" />
                  <Skeleton className="h-4 w-32 mb-3" />
                  <div className="mt-auto w-full">
                    <Skeleton className="h-8 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="inline-block p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-6 shadow-lg">
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
              <Skeleton className="h-12 w-80 mx-auto mb-4" />
              <Skeleton className="h-6 w-[600px] mx-auto" />
            </div>

            {/* Map Container */}
            <div className="max-w-5xl mx-auto bg-white border-2 border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
              {/* Map */}
              <div className="w-full h-96 bg-gray-300">
                <Skeleton className="h-full w-full" />
              </div>

              {/* Bottom Info Bar */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-8 md:p-10 border-t-2 border-gray-100">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                  {/* Location Info */}
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <Skeleton className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <Skeleton className="h-6 w-56 mb-2" />
                      <Skeleton className="h-5 w-80 mb-4" />
                      <Skeleton className="h-5 w-64 mb-2" />
                      <Skeleton className="h-5 w-72" />
                    </div>
                  </div>

                  {/* Office Hours and Action */}
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                      <Skeleton className="h-5 w-32 mb-3" />
                      <Skeleton className="h-5 w-36 mb-1" />
                      <Skeleton className="h-5 w-36" />
                    </div>
                    <Skeleton className="h-14 w-48 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin About Us Skeleton (Admin Side)
export const AdminAboutUsSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <Skeleton className="h-10 w-56 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-11 w-36 rounded-xl" />
          <Skeleton className="h-11 w-40 rounded-xl" />
        </div>
      </div>

      {/* Content Grid - Info, History, Mission/Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-7 w-48" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Quick actions / summary */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-md border-2 border-gray-200">
            <Skeleton className="h-6 w-32 mb-3" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-md border-2 border-gray-200">
            <Skeleton className="h-6 w-40 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Officials Admin Panel - table style */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-5 gap-4 py-3 border-b-2 mb-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Rows */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-5 gap-4 items-center py-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Trading Page Skeleton (User Side)
export const TradingPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Breadcrumb - Seamless with Navbar */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-t border-green-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20 bg-white/30" />
            <Skeleton className="h-4 w-4 bg-white/20" />
            <Skeleton className="h-5 w-36 bg-white/30" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-12 sm:h-14 w-64 sm:w-80 mx-auto mb-5" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto mb-6" />
          {/* Badge Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>

        {/* Calculator Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16 md:mb-20">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-br from-green-50 to-white p-6 border-b-2 border-green-100">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-7 w-32" />
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <Skeleton className="h-5 w-40 mb-3" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <div>
                <Skeleton className="h-5 w-32 mb-3" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>

          {/* Result Panel */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-br from-green-50 to-white p-6 border-b-2 border-green-100">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-7 w-40" />
              </div>
            </div>
            <div className="p-6">
              <Skeleton className="h-48 w-full rounded-xl mb-6" />
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial Section */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-2xl p-8 sm:p-10 text-white">
            <div className="text-center mb-8">
              <Skeleton className="h-10 w-64 mx-auto mb-3 bg-white/30" />
              <Skeleton className="h-5 w-96 mx-auto bg-white/20" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
                >
                  <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4 bg-white/30" />
                  <Skeleton className="h-6 w-3/4 mx-auto mb-3 bg-white/30" />
                  <Skeleton className="h-4 w-full bg-white/20 mb-2" />
                  <Skeleton className="h-4 w-5/6 mx-auto bg-white/20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Guidelines Page Skeleton (User Side)
export const GuidelinesPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Breadcrumb - Seamless with Navbar */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-t border-green-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20 bg-white/30" />
            <Skeleton className="h-4 w-4 bg-white/20" />
            <Skeleton className="h-5 w-32 bg-white/30" />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Skeleton className="h-20 w-20 rounded-full mx-auto mb-6" />
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
        </div>

        {/* Guide Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white border-2 border-gray-100 rounded-2xl p-8 text-center hover:shadow-2xl transition-all h-full min-h-[200px]"
            >
              <Skeleton className="h-20 w-20 rounded-2xl mx-auto mb-6" />
              <Skeleton className="h-6 w-3/4 mx-auto" />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-5 w-full max-w-xl mx-auto mb-6" />
          <Skeleton className="h-14 w-48 rounded-xl mx-auto" />
        </div>
      </main>
    </div>
  );
};

// Guide Template Page Skeleton (User Side) - For individual guide detail pages
export const GuideTemplateSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Breadcrumb - Seamless with Navbar */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-t border-green-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Skeleton className="h-5 w-16 bg-white/30" />
            <Skeleton className="h-4 w-4 bg-white/20" />
            <Skeleton className="h-5 w-20 bg-white/30" />
            <Skeleton className="h-4 w-4 bg-white/20" />
            <Skeleton className="h-5 w-40 bg-white/30" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
        {/* Back Button */}
        <Skeleton className="h-6 w-40 mb-8" />

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 mb-10 border-2 border-gray-100">
          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
            <Skeleton className="h-20 w-20 rounded-2xl flex-shrink-0" />
            <div className="flex-1 w-full">
              <Skeleton className="h-10 w-3/4 mb-3" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-5/6 mb-6" />

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-7 w-48" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded flex-shrink-0 mt-0.5" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Steps Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-green-100">
          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-7 w-56" />
          </div>
          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-6">
                <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  {i % 2 === 0 && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-8 border-2 border-yellow-200">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-7 w-40" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded flex-shrink-0 mt-0.5" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
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
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-md border border-green-200"
          >
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
            <div
              key={i}
              className="flex items-center gap-4 p-4 border rounded-lg"
            >
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
              <div
                key={i}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
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

// Green Pages Skeleton (Admin Side) - Custom for Green Pages with maps, tabs, and charts
export const GreenPagesSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 p-4 sm:p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl" />
          <Skeleton className="h-8 sm:h-10 w-48 sm:w-56" />
        </div>
      </div>

      {/* Google Map Skeleton */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border-2 border-gray-200 overflow-hidden">
        <div className="relative">
          <Skeleton className="w-full h-56 sm:h-80 md:h-96" />
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
            <Skeleton className="h-8 sm:h-10 w-32 sm:w-40 rounded-lg sm:rounded-xl" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 sm:gap-3 flex-wrap bg-white p-2 rounded-2xl shadow-lg border-2 border-gray-200">
        <Skeleton className="flex-1 min-w-[120px] h-12 sm:h-14 rounded-xl" />
        <Skeleton className="flex-1 min-w-[120px] h-12 sm:h-14 rounded-xl" />
        <Skeleton className="flex-1 min-w-[120px] h-12 sm:h-14 rounded-xl" />
      </div>

      {/* Content Area - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Side - Farm Photo and Info */}
        <div className="lg:col-span-1 flex flex-col gap-4 sm:gap-6">
          {/* Farm Photo */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
            <Skeleton className="w-full h-40 sm:h-48 md:h-56" />
          </div>

          {/* Farm Information */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden flex-1">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
              <Skeleton className="h-6 w-32 bg-white/30" />
            </div>
            <div className="p-4 sm:p-5 space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 sm:p-3.5 bg-gray-50 rounded-lg"
                >
                  <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 border-b-2 border-green-500">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl bg-white/30" />
                <Skeleton className="h-7 w-48 bg-white/30" />
              </div>
            </div>
            <div className="p-3 sm:p-5 md:p-6 bg-gradient-to-br from-gray-50 to-white">
              <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white p-3 sm:p-4 md:p-5 border-2 border-gray-200 rounded-2xl"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-gray-100 mb-3">
                      <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Skeleton className="h-16 rounded-lg" />
                      <Skeleton className="h-16 rounded-lg" />
                    </div>
                    <Skeleton className="h-14 rounded-lg mb-2" />
                    <Skeleton className="h-14 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Trading Statistics Skeleton (Admin Side)
export const TradingStatisticsSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-64" />
          </div>
          <Skeleton className="h-6 w-96" />
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Summary Cards */}
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white border-2 border-gray-200 rounded-xl shadow-md p-6"
              >
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex justify-between items-center">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Table Card */}
            <div className="lg:col-span-2 bg-white border-2 border-gray-200 rounded-xl shadow-md p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-3">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-2 pb-2 border-b">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-4 w-16" />
                  ))}
                </div>
                {/* Table Rows */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="grid grid-cols-5 gap-2 py-2 border-b">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <Skeleton key={j} className="h-4 w-20" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inventory Page Skeleton (Admin Side)
export const InventoryPageSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <Skeleton className="h-10 w-56 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-11 w-32 rounded-xl" />
          <Skeleton className="h-11 w-40 rounded-xl" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 flex gap-5 items-center"
          >
            <Skeleton className="h-20 w-20 rounded-xl" />

            <div className="grid gap-2 grow">
              <Skeleton className="h-8 w-20 rounded-sm" />
              <Skeleton className="h-8 grow rounded-sm" />

              <div className="flex gap-2">
                <Skeleton className="h-5 w-14 rounded-sm" />
                <Skeleton className="h-5 w-10 rounded-sm" />
                <Skeleton className="h-5 w-10 rounded-sm" />
              </div>
            </div>

            <div className="flex gap-5">
              <Skeleton className="h-10 w-14 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// News & Events Page Skeleton (Admin Side)
export const NewsEventsPageSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <Skeleton className="h-10 w-56 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-11 w-40 rounded-xl" />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-lg flex-shrink-0" />
        ))}
      </div>

      {/* News/Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden"
          >
            <Skeleton className="w-full h-48" />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1 rounded-lg" />
                <Skeleton className="h-9 w-20 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Achievements Page Skeleton (Admin Side)
export const AchievementsPageSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-56" />
          </div>
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-11 w-48 rounded-xl" />
      </div>

      {/* Achievement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <Skeleton className="w-full h-56" />
            <div className="p-5">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Activity Logs Page Skeleton (Admin Side)
export const ActivityLogsPageSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-11 w-32 rounded-xl" />
          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-md border-2 border-gray-200 flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex gap-4 pb-4 border-b last:border-b-0">
              <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============= MOBILE-SPECIFIC COMPACT SKELETONS =============

import { useEffect, useState } from 'react';

// Hook to detect mobile viewport (client-side)
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    // older browsers
    try {
      media.addEventListener('change', handler);
    } catch (err) {
      // @ts-ignore
      media.addListener(handler);
    }
    setIsMobile(media.matches);
    return () => {
      try {
        media.removeEventListener('change', handler);
      } catch (err) {
        // @ts-ignore
        media.removeListener(handler);
      }
    };
  }, [breakpoint]);

  return isMobile;
};

// Compact mobile skeleton variations (smaller heights, fewer items)
export const MobileHomeSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4">
      <Skeleton className="h-40 w-full rounded-lg mb-4" />
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white p-3 rounded-xl shadow-sm">
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const MobileGreenPagesSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen p-3 bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-50">
      <Skeleton className="h-44 w-full rounded-lg mb-3" />
      <div className="bg-white rounded-xl p-3 shadow-sm">
        <Skeleton className="h-6 w-28 mb-2" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 mb-2">
            <Skeleton className="h-9 w-9 rounded" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const MobileTradingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Skeleton className="h-12 w-12 rounded-full mx-auto mb-3" />
      <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
};

export const MobileGuidelinesSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 to-green-50">
      <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-3 rounded-lg shadow-sm">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const MobileDashboardSkeleton: React.FC = () => {
  return (
    <div className="p-3 space-y-4">
      <Skeleton className="h-8 w-48 mb-2" />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-3 rounded-lg shadow-sm">
            <Skeleton className="h-6 w-20 mb-2" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
      <Skeleton className="h-40 w-full rounded-lg mt-3" />
    </div>
  );
};

export const MobileInventorySkeleton: React.FC = () => {
  return (
    <div className="p-3 space-y-3">
      <Skeleton className="h-8 w-40 mb-2" />
      <Skeleton className="h-12 w-full rounded-lg mb-2" />
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-3"
          >
            <Skeleton className="h-12 w-12 rounded" />
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MobileNewsEventsSkeleton: React.FC = () => {
  return (
    <div className="p-3 space-y-3">
      <Skeleton className="h-8 w-48 mb-2" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-3 rounded-lg shadow-sm">
          <Skeleton className="h-36 w-full mb-3 rounded" />
          <Skeleton className="h-4 w-2/3 mb-1" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
};

export const MobileAchievementsSkeleton: React.FC = () => {
  return (
    <div className="p-3 space-y-3">
      <Skeleton className="h-8 w-48 mb-2" />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-3 rounded-lg shadow-sm">
            <Skeleton className="h-28 w-full rounded mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const MobileActivityLogsSkeleton: React.FC = () => {
  return (
    <div className="p-3 space-y-3">
      <Skeleton className="h-8 w-40 mb-2" />
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex gap-3 items-start bg-white p-3 rounded-lg shadow-sm"
        >
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-1" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const MobileFormTableSkeleton: React.FC = () => {
  return (
    <div className="p-3 space-y-3">
      <Skeleton className="h-8 w-56 mb-2" />
      <Skeleton className="h-12 w-full rounded-lg mb-3" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white p-3 rounded-lg shadow-sm">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
};

// MobileSkeleton: choose a compact skeleton by key; falls back to a generic compact page
export const MobileSkeleton: React.FC<{ page?: string }> = ({ page }) => {
  const isMobile = useIsMobile();
  if (!isMobile) return <PageLoadingSkeleton />;

  switch ((page || '').toLowerCase()) {
    case 'home':
    case 'homepage':
      return <MobileHomeSkeleton />;
    case 'greenpages':
    case 'green-pages':
      return <MobileGreenPagesSkeleton />;
    case 'trading':
      return <MobileTradingSkeleton />;
    case 'guidelines':
      return <MobileGuidelinesSkeleton />;
    case 'dashboard':
      return <MobileDashboardSkeleton />;
    case 'inventory':
      return <MobileInventorySkeleton />;
    case 'news':
    case 'newsandevents':
    case 'news-events':
      return <MobileNewsEventsSkeleton />;
    case 'achievements':
      return <MobileAchievementsSkeleton />;
    case 'activitylogs':
    case 'activity-logs':
      return <MobileActivityLogsSkeleton />;
    case 'formtable':
    case 'records':
    case 'earnpoints':
      return <MobileFormTableSkeleton />;
    default:
      // generic compact skeleton
      return (
        <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 to-green-50">
          <Skeleton className="h-12 w-56 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-3 rounded-lg shadow-sm">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      );
  }
};
