import { useState, useMemo, useEffect } from 'react';
import useFetchData from './useFetchData';
import { LogsApiResponse } from '@/types/global.types';

export const useActivityLogs = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  const { data, loading, error, refetch } = useFetchData<LogsApiResponse>(
    `/logs?page=${page}`
  );

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  const categories = useMemo(() => {
    if (!data?.data) return [];
    const allCategories = data.data.map((log) => log.category);
    return Array.from(new Set(allCategories)).filter(Boolean);
  }, [data]);

  const filteredAndSortedLogs = useMemo(() => {
    if (!data?.data) return [];

    const filtered = data.data.filter((log) => {
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

    return filtered.sort((a, b) => {
      if (sort === 'asc') {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [data, category, search, sort]);

  return {
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
    logs: filteredAndSortedLogs,
  };
};
