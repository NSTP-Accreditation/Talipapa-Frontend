import React from 'react';
import { ActivityHeader } from './components/ActivityHeader';
import { LogsCardTable } from './components/LogsCardTable';
import { LogsCard } from './components/LogsCard';
import { LogPagination } from './components/LogPagination';
import { FiltersSection } from './components/FilterSection';
import { useActivityLogs } from '@/admin/hooks/useActivityLogs';
import { LogLoadingState } from './components/LogLoadingState';

const ActivityLogs = () => {
  const {
    page,
    setPage,
    search,
    setSearch,
    category,
    setCategory,
    sort,
    setSort,
    data,
    loading,
    error,
    refetch,
    categories,
    logs,
  } = useActivityLogs();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleSortToggle = () => {
    setSort((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleNextPage = () => {
    if (data?.hasNextPage) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (data?.hasPrevPage && page > 1) setPage((prev) => prev - 1);
  };

  // Show loading or error state
  if (loading || error) {
    return <LogLoadingState loading={loading} error={error} />;
  }

  return (
    <div className="p-5">
      <ActivityHeader 
        title="Activity Log" 
        description="List of Recent Activities" 
      />

      <FiltersSection
        search={search}
        category={category}
        sort={sort}
        categories={categories}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onSortToggle={handleSortToggle}
        onRefresh={refetch}
      />

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {logs.length > 0 ? (
          logs.map((log) => <LogsCard key={log._id} log={log} />)
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center text-gray-400 text-sm">
            No activity logs found.
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <LogsCardTable logs={logs} />

      {/* Pagination */}
      <LogPagination
        currentPage={data?.currentPage ?? 1}
        totalPages={data?.totalPages ?? 1}
        hasPrevPage={data?.hasPrevPage ?? false}
        hasNextPage={data?.hasNextPage ?? false}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
};

export default ActivityLogs;