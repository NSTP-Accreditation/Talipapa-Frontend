import { useState, useMemo } from 'react';
import { debounce } from 'lodash';

export const useSearchRecords = (initialPage = 1) => {
  const [page, setPage] = useState<number>(initialPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setSearchQuery(query);
        setIsSearching(!!query);
        setPage(1);
      }, 500),
    []
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchQuery('');
    setIsSearching(false);
    setPage(1);
  };

  const getFetchUrl = (residentStatus: string) => {
    return isSearching && searchQuery
      ? `/records/search?query=${encodeURIComponent(searchQuery)}&residentStatus=${residentStatus}&page=${page}`
      : `/records?residentStatus=${residentStatus}&page=${page}`;
  };

  return {
    page,
    setPage,
    searchTerm,
    searchQuery,
    isSearching,
    handleSearchChange,
    handleClearSearch,
    getFetchUrl,
  };
};