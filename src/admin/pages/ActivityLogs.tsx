import React, { useState, ChangeEvent, useMemo, useEffect } from 'react';
import { Activity, ChevronLeft, ChevronRight, RefreshCcw, RefreshCw } from 'lucide-react';
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
        (log.performedBy?.username?.toLowerCase() ?? '').includes(searchLower) ||
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
      <div className="p-10 text-center text-red-600 font-semibold">
        Failed to load logs: {error}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-black flex items-center gap-4 mb-1">
          <Activity className="w-10 h-10 text-green-600" />
          Activity Log
        </h1>
        <div className="h-3" />
        <p className="text-gray-600 font-medium">List of Recent Activities</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 mb-8 flex flex-col md:flex-row md:items-center gap-3">
        <input
          type="text"
          placeholder="Search By"
          value={search}
          onChange={handleSearchChange}
          className="border-2 border-gray-300 rounded-xl px-4 py-3 w-full md:w-64 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base"
        />

        <select
          value={category}
          onChange={handleCategoryChange}
          className="border-2 border-gray-300 rounded-xl px-4 py-3 w-full md:w-56 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base"
        >
          <option value="">Filter By Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          onClick={handleSortToggle}
          className="border-2 border-gray-300 rounded-xl px-4 py-3 w-full md:w-32 flex items-center gap-2 justify-center bg-white hover:bg-green-50 font-semibold text-green-900 transition-all"
        >
          <span>Sort By</span>
          <svg
            className={`w-4 h-4 transition-transform ${
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
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all ml-auto"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border-2 border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-200">
            <tr>
              {[
                'Performed_By',
                'Action',
                'Title',
                'Description',
                'Category',
                'Timestamp',
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider"
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.performedBy?.username || log.targetName || '—'} {log.performedBy?.roles && `(${log.performedBy?.roles[log.performedBy.roles.length - 1]})`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-56 truncate">
                    {log.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  No activity logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          onClick={handlePrevPage}
          disabled={!data?.hasPrevPage}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1 ${
            data?.hasPrevPage
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ChevronLeft size={20} /> Prev
        </button>

        <span className="px-4 py-2 rounded-xl bg-green-50 text-green-900 font-bold">
          Page {data?.currentPage ?? 1} of {data?.totalPages ?? 1}
        </span>

        <button
          onClick={handleNextPage}
          disabled={!data?.hasNextPage}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1 ${
            data?.hasNextPage
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ActivityLogs;
