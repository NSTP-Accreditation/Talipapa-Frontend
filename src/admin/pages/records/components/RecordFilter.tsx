import { Input } from '@/components/ui';
import { Search, ListFilter } from 'lucide-react';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { RecordInterface } from '@/types/global.types';
import { debounce } from 'lodash';
import { PaginatedResponse } from '@/types/pagination';
import { useAuthFetch } from '@/admin/hooks/useAuthFetch';

type RecordFilterProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  isSearching: boolean;
  recordCount: number;
  totalRecords: number;
  // Remove all data fetching props:
  // recordsData, refetchRecords, setSearchLoading, setIsSearching
};

const RecordFilter = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  isSearching,
  recordCount,
  totalRecords,
}: RecordFilterProps) => {
  // single list of sort keys (unique). Clicking same key toggles asc/desc.
  // Match the RecordTable column order: Record ID, Name, Age, Points, Created At
  const sortKeys = [
    { key: '_id', label: 'Record ID' },
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'points', label: 'Points' },
    { key: 'createdAt', label: 'Created At' },
  ];

  const [selectedKey, setSelectedKey] = useState<string>(sortKeys[0].key);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const currentMode = {
    key: selectedKey,
    label: sortKeys.find((s) => s.key === selectedKey)?.label || 'Sort',
    order,
  };
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const hoverCloseTimeout = useRef<number | null>(null);
  const loadingTimerRef = useRef<number | null>(null);
  const loadingShownRef = useRef(false);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleClear = () => {
    onClearSearch();
  };

  // const sortRecords = (items: RecordInterface[] = []) => {
  //   const arr = [...items];
  //   const { key, order } = currentMode;

  //   const multiplier = order === 'asc' ? 1 : -1;

  //   arr.sort((a, b) => {
  //     try {
  //       if (key === 'createdAt') {
  //         const ta = new Date(a.createdAt).getTime() || 0;
  //         const tb = new Date(b.createdAt).getTime() || 0;
  //         return (ta - tb) * multiplier;
  //       }

  //       if (key === '_id') {
  //         return a._id.localeCompare(b._id) * multiplier;
  //       }

  //       if (key === 'points') {
  //         return (Number(a.points || 0) - Number(b.points || 0)) * multiplier;
  //       }

  //       if (key === 'age') {
  //         return (Number(a.age || 0) - Number(b.age || 0)) * multiplier;
  //       }

  //       if (key === 'name') {
  //         const na = `${a.lastName ?? ''}, ${a.firstName ?? ''}`.toLowerCase();
  //         const nb = `${b.lastName ?? ''}, ${b.firstName ?? ''}`.toLowerCase();
  //         return na.localeCompare(nb) * multiplier;
  //       }

  //       return 0;
  //     } catch (err) {
  //       return 0;
  //     }
  //   });

  //   return arr;
  // };

  // apply sorting whenever sort mode or the underlying records change
  // useEffect(() => {
  //   setOriginalRecords((prev) => {
  //     const sorted = sortRecords(prev);
  //     const same =
  //       prev?.length === sorted?.length &&
  //       prev.every((v, i) => v._id === sorted[i]._id);
  //     return same ? prev : sorted;
  //   });
  // }, [selectedKey, order, recordsData]);

  // const debouncedSearch = useCallback(
  //   debounce(async (query: string) => {
  //     if (setSearchLoading) {
  //       if (loadingTimerRef.current)
  //         window.clearTimeout(loadingTimerRef.current);
  //       loadingShownRef.current = false;
  //       loadingTimerRef.current = window.setTimeout(() => {
  //         loadingShownRef.current = true;
  //         setSearchLoading(true);
  //       }, 250);
  //     }
      
  //     if (setIsSearching) {
  //       setIsSearching(!!query);
  //     }

  //     if (!query) {
  //       try {
  //         await refetchRecords();
  //       } finally {
  //         if (loadingTimerRef.current)
  //           window.clearTimeout(loadingTimerRef.current);
  //         if (loadingShownRef.current)
  //           setSearchLoading && setSearchLoading(false);
  //         loadingTimerRef.current = null;
  //         loadingShownRef.current = false;
  //       }
  //       return;
  //     }

  //     try {
  //       await refetchRecords(
  //         `${import.meta.env.VITE_API_URL}/records/search?query=${encodeURIComponent(query)}&residentStatus=${residentStatus}`
  //       );
  //     } catch {
  //     } finally {
  //       if (loadingTimerRef.current)
  //         window.clearTimeout(loadingTimerRef.current);
  //       if (loadingShownRef.current)
  //         setSearchLoading && setSearchLoading(false);
  //       loadingTimerRef.current = null;
  //       loadingShownRef.current = false;
  //     }
  //   }, 700),
  //   [recordsData]
  // );

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value;
  //   setSearchTerm(value);
  //   debouncedSearch(value);
  // };

  // useEffect(() => {
  //   return () => {
  //     debouncedSearch.cancel && debouncedSearch.cancel();
  //     if (loadingTimerRef.current) window.clearTimeout(loadingTimerRef.current);
  //   };
  // }, [debouncedSearch]);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 w-full">
        <div className="relative flex-1 w-full">
          <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          </div>
          <Input
            type="text"
            placeholder="Search by Record ID or Name..."
            className="w-full rounded-xl border-2 border-gray-300 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base bg-gradient-to-r from-white to-gray-50"
            value={searchTerm}
            onChange={handleInputChange}
          />
        </div>

        {/* Dropdown filter using ListFilter icon */}
        <div
          className="relative"
          ref={menuRef}
          onMouseEnter={() => {
            if (hoverCloseTimeout.current) {
              window.clearTimeout(hoverCloseTimeout.current);
              hoverCloseTimeout.current = null;
            }
            setOpen(true);
          }}
          onMouseLeave={() => {
            hoverCloseTimeout.current = window.setTimeout(() => {
              setOpen(false);
              hoverCloseTimeout.current = null;
            }, 150);
          }}
        >
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-2.5 sm:py-3 border-2 border-green-200 rounded-xl text-sm sm:text-base text-gray-700 hover:bg-green-50 transition w-36 justify-between bg-gradient-to-r from-white to-green-50/30 shadow-sm hover:shadow-md"
            title={`Sort: ${currentMode.label} ${currentMode.order === 'asc' ? 'ascending' : 'descending'}`}
          >
            <div className="flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-green-600" />
              <span className="hidden sm:inline truncate font-semibold">
                {currentMode.label}
              </span>
            </div>
            <span className="text-xs text-green-600 font-bold">
              {currentMode.order === 'asc' ? '▲' : '▼'}
            </span>
          </button>

          {open && (
            <div className="absolute right-0 mt-1 w-36 bg-white border-2 border-green-200 rounded-lg shadow-xl py-1 z-50 text-sm">
              {sortKeys.map((m) => (
                <button
                  key={m.key}
                  onClick={() => {
                    if (selectedKey === m.key)
                      setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
                    else {
                      setSelectedKey(m.key);
                      setOrder('asc');
                    }
                    // do NOT close on select — keeps menu open per request
                  }}
                  className={`w-full text-left px-2 py-1.5 text-gray-700 hover:bg-green-50 flex items-center justify-between transition-colors ${selectedKey === m.key ? 'bg-green-100 font-semibold' : ''}`}
                >
                  <span className="truncate">{m.label}</span>
                  <span
                    className={`text-xs ${selectedKey === m.key ? 'text-green-600 font-bold' : 'text-gray-400'}`}
                  >
                    {selectedKey === m.key
                      ? order === 'asc'
                        ? '▲'
                        : '▼'
                      : '—'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {searchTerm && (
        <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
          Found{' '}
          <span className="font-semibold text-green-600">
            {totalRecords}
          </span>{' '}
          matching records
        </div>
      )}
    </div>
  );
};

export default RecordFilter;
