import React, { useState, ChangeEvent, useMemo, useEffect } from 'react';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  RefreshCw,
} from 'lucide-react';
import useFetchData from '../hooks/useFetchData';
import { ActivityLogsPageSkeleton } from '../../components/LoadingSkeletons';

// Types for API response
interface PerformedBy {
  _id: string;
  username: string;
  roles: Record<string, number>;
}

interface LogEntry {
  _id: string;
  action: string;
  title: string;
  description: string;
  category: string;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  performedBy?: PerformedBy;
  created_at: string;
  __v?: number;
}

interface LogsApiResponse {
  success: boolean;
  count: number;
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  data: LogEntry[];
}

const ActivityLogs: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  const { data, loading, error, refetch } = useFetchData<LogsApiResponse>(
    `/logs?page=${page}`
  );

  // Refetch whenever the page changes
  useEffect(() => {
    refetch();
  }, [page]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
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

  const categories = useMemo(() => {
    if (!data?.data) return [];
    const allCategories = data.data.map((log) => log.category);
    return Array.from(new Set(allCategories)).filter(Boolean);
  }, [data]);

  const filteredLogs = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((log) => {
      const matchesCategory = !category || log.category === category;
      const searchLower = search.toLowerCase();
      const matchesSearch =
        log.title.toLowerCase().includes(searchLower) ||
        log.description.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        (log.performedBy?.username?.toLowerCase() ?? '').includes(
          searchLower
        ) ||
        (log.category?.toLowerCase() ?? '').includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [data, category, search]);

  const sortedLogs = useMemo(() => {
    return [...filteredLogs].sort((a, b) => {
      if (sort === 'asc') {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [filteredLogs, sort]);

  if (loading) return <ActivityLogsPageSkeleton />;

  if (error) {
    return (
      <div className="p-4 sm:p-10 text-center text-red-600 font-semibold text-sm sm:text-base">
        Failed to load logs: {error}
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 md:p-10">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-black flex items-center gap-2 sm:gap-4 mb-1">
          <Activity className="w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10 text-green-600" />
          Activity Log
        </h1>
        <div className="h-1 sm:h-2 md:h-3" />
        <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">
          List of Recent Activities
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border border-gray-200 sm:border-2 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col gap-2 sm:gap-3">
          <input
            type="text"
            placeholder="Search By"
            value={search}
            onChange={handleSearchChange}
            className="border border-gray-300 sm:border-2 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base"
          />

          <select
            value={category}
            onChange={handleCategoryChange}
            className="border border-gray-300 sm:border-2 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base"
          >
            <option value="">Filter By Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={handleSortToggle}
              className="border border-gray-300 sm:border-2 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 flex-1 flex items-center gap-2 justify-center bg-white hover:bg-green-50 font-semibold text-green-900 transition-all text-sm sm:text-base"
            >
              <span>Sort By</span>
              <svg
                className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${
                  sort === 'asc' ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <button
              onClick={() => refetch()}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex-1"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="leading-none">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {sortedLogs.length > 0 ? (
          sortedLogs.map((log) => (
            <div
              key={log._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-3"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">
                      Performed By
                    </div>
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {log.performedBy?.username || log.targetName || '—'}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                      {log.category}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-2">
                  <div className="text-xs text-gray-500 mb-1">Action</div>
                  <div className="text-sm font-medium text-gray-900">
                    {log.action}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-2">
                  <div className="text-xs text-gray-500 mb-1">Title</div>
                  <div className="text-sm text-gray-900 break-words">
                    {log.title}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-2">
                  <div className="text-xs text-gray-500 mb-1">Description</div>
                  <div className="text-sm text-gray-700 break-words">
                    {log.description}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-2">
                  <div className="text-xs text-gray-500 mb-1">Timestamp</div>
                  <div className="text-xs text-gray-600">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center text-gray-400 text-sm">
            No activity logs found.
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-200">
            <tr>
              {[
                'Performed By',
                'Action',
                'Title',
                'Description',
                'Category',
                'Timestamp',
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedLogs.length > 0 ? (
              sortedLogs.map((log) => (
                <tr
                  key={log._id}
                  className="hover:bg-green-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {log.performedBy?.username || log.targetName || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {log.action}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm"
                    title={log.title}
                  >
                    <div className="max-w-xs truncate">{log.title}</div>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm"
                    title={log.description}
                  >
                    <div className="max-w-xs truncate">{log.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {log.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-12 text-gray-400 text-sm"
                >
                  No activity logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
        <button
          onClick={handlePrevPage}
          disabled={!data?.hasPrevPage}
          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold flex items-center gap-1 text-xs sm:text-sm min-h-[40px] ${
            data?.hasPrevPage
              ? 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
          <span>Prev</span>
        </button>

        <span className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-green-50 text-green-900 font-bold text-xs sm:text-sm min-h-[40px] flex items-center">
          {data?.currentPage ?? 1} / {data?.totalPages ?? 1}
        </span>

        <button
          onClick={handleNextPage}
          disabled={!data?.hasNextPage}
          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold flex items-center gap-1 text-xs sm:text-sm min-h-[40px] ${
            data?.hasNextPage
              ? 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>Next</span>
          <ChevronRight size={16} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

export default ActivityLogs;
