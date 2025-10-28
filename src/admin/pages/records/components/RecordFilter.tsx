import { Input } from '@/components/ui';
import { Search } from 'lucide-react';
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { RecordInterface } from '../Record.types';
import { debounce } from 'lodash';

type RecordFilterProps = {
  originalRecords: RecordInterface[],
  recordsData: RecordInterface[],
  setOriginalRecords: Dispatch<SetStateAction<RecordInterface[]>>
}

const RecordFilter = ({ originalRecords, recordsData, setOriginalRecords } : RecordFilterProps ) => {
  const [ searchTerm, setSearchTerm ] = useState("");

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (!query) {
        setOriginalRecords(recordsData || []);
        return;
      }

      
      // const fetchSearch = async () => {
      //   try {
      //     const response = await fetch(
      //       `${import.meta.env.VITE_API_URL}/records/search?query=${query}`,
      //       {
      //         method: 'GET',
      //         headers: {
      //           Authorization: `Bearer ${user?.accessToken}`,
      //         },
      //         credentials: 'include',
      //       }
      //     );

      //     const result = await response.json();
      //     if (!response.ok) {
      //       throw new Error(result.message);
      //     }
      //     setRecords(result?.results || []); // Ensure array
      //   } catch (error) {
      //     console.log(error);
      //     setRecords([]);
      //   }
      // };
      // fetchSearch();
    }, 700),
    [recordsData]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
    // setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200 p-4 sm:p-6 mb-4 sm:mb-8">
      <div className="relative w-full">
        <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search by Record ID or Name..."
          className="w-full rounded-xl border-2 border-gray-300 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      {searchTerm && (
        <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
          Found{' '}
          <span className="font-semibold text-green-600">
            {originalRecords.length}
          </span>{' '}
          matching records
        </div>
      )}
    </div>
  );
};

export default RecordFilter;
