import React, { useEffect, useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Download, Search } from 'lucide-react';
import useFetchData from '../hooks/useFetchData';

const ResidentRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [ records, setRecords ] = useState([]);

  const { data, loading, error, refetch } = useFetchData('/records');
  
  useEffect(() => {
    if(data && !loading && !error) {
      setRecords(data);
    }
  }, [data, loading, error])

  // Pagination logic
  const totalPages = Math.ceil(records.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentResidents = records.slice(startIndex, startIndex + recordsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-3">
            <span>👥</span>
            Resident Records
          </h1>
          <p className="text-gray-700 font-medium">
            List of the resident records created
            <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {records.length} {records.length === 1 ? 'Record' : 'Records'}
            </span>
          </p>
        </div>

        {/* Right side: Download button */}
        <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <Download className="w-5 h-5" />
          Download Excel
        </Button>
      </div>

      {/* Enhanced Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 mb-8">
        <div className="relative w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search by Record ID or Name..."
            className="w-full rounded-xl border-2 border-gray-300 py-3 pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to first page on new search
            }}
          />
        </div>
        {searchTerm && (
          <div className="mt-3 text-sm text-gray-600">
            Found <span className="font-semibold text-green-600">{records.length}</span> matching records
          </div>
        )}
      </div>

      {/* Enhanced Table */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-x-auto">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider">Record ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider">Age</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider">Points</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider">Address</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider">Created At</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {currentResidents.length > 0 ? (
                currentResidents.map((resident, index) => (
                  <tr key={index} className="hover:bg-green-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-lg border border-green-200">
                        {resident?._id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {resident?.firstName.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{resident?.firstName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold text-gray-900`}>
                        {resident?.age}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">⭐</span>
                        <span className="text-sm font-bold text-gray-900">{resident?.points}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">📱</span>
                        <span className="text-sm text-gray-700 font-medium">{resident?.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">📅</span>
                        <span className="text-sm text-gray-700 font-medium">{resident?.createdAt}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No records found.</p>
                      <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex justify-between items-center bg-white rounded-2xl shadow-lg border-2 border-gray-200 px-6 py-4">
        <div className="text-sm text-gray-600 font-medium">
          Showing <span className="font-bold text-gray-900">{startIndex + 1}</span> to{' '}
          <span className="font-bold text-gray-900">{Math.min(startIndex + recordsPerPage, records.length)}</span> of{' '}
          <span className="font-bold text-gray-900">{records.length}</span> records
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-green-50 hover:border-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </Button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border-2 border-green-300 rounded-lg">
            <span className="text-sm font-bold text-green-800">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-green-50 hover:border-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResidentRecords;