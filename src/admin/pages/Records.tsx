import React, { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Download, Search } from 'lucide-react';

const ResidentRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10; // 👈 show up to 10 IDs per page

  const residents = [
    { recordId: 'BT-0001', name: 'Ryanny Romero', activity: 'Create Account', points: 0, contact: '09999999999', date: '2025-10-01' },
    { recordId: 'BT-0002', name: 'Juan Dela Cruz', activity: 'Update Info', points: 5, contact: '09123456789', date: '2025-10-02' },
    { recordId: 'BT-0003', name: 'Maria Santos', activity: 'Redeem Points', points: 20, contact: '09223334444', date: '2025-10-03' },
    { recordId: 'BT-0004', name: 'Jose Rizal', activity: 'Create Account', points: 0, contact: '09088887777', date: '2025-10-04' },
    { recordId: 'BT-0005', name: 'Andres Bonifacio', activity: 'Redeem Points', points: 10, contact: '09334445555', date: '2025-10-05' },
    { recordId: 'BT-0006', name: 'Emilio Aguinaldo', activity: 'Update Info', points: 15, contact: '09445556666', date: '2025-10-06' },
    { recordId: 'BT-0007', name: 'Gregorio del Pilar', activity: 'Login', points: 3, contact: '09556667777', date: '2025-10-07' },
    { recordId: 'BT-0008', name: 'Apolinario Mabini', activity: 'Logout', points: 1, contact: '09667778888', date: '2025-10-08' },
    { recordId: 'BT-0009', name: 'Melchora Aquino', activity: 'Redeem Points', points: 25, contact: '09778889999', date: '2025-10-09' },
    { recordId: 'BT-0010', name: 'Antonio Luna', activity: 'Update Info', points: 8, contact: '09889990000', date: '2025-10-10' },
    { recordId: 'BT-0011', name: 'Marcelo del Pilar', activity: 'Create Account', points: 0, contact: '09990001111', date: '2025-10-11' },
  ];

  // Filter records based on search term
  const filteredResidents = residents.filter((resident) =>
    `${resident.recordId} ${resident.name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredResidents.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentResidents = filteredResidents.slice(startIndex, startIndex + recordsPerPage);

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
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-3">
            <span className="text-4xl">👥</span>
            Resident Records
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            List of the resident records created
            <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {filteredResidents.length} {filteredResidents.length === 1 ? 'Record' : 'Records'}
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
            Found <span className="font-semibold text-green-600">{filteredResidents.length}</span> matching records
          </div>
        )}
      </div>

      {/* Enhanced Table */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider">Record ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider">Points</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider">Contact Number</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {currentResidents.length > 0 ? (
                currentResidents.map((resident, index) => (
                  <tr key={index} className="hover:bg-green-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-lg border border-green-200">
                        {resident.recordId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {resident.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{resident.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                        resident.activity === 'Create Account' 
                          ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                          : resident.activity === 'Update Info' 
                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          : resident.activity === 'Redeem Points'
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : resident.activity === 'Login'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {resident.activity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">⭐</span>
                        <span className="text-sm font-bold text-gray-900">{resident.points}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">📱</span>
                        <span className="text-sm text-gray-700 font-medium">{resident.contact}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">📅</span>
                        <span className="text-sm text-gray-700 font-medium">{resident.date}</span>
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
          <span className="font-bold text-gray-900">{Math.min(startIndex + recordsPerPage, filteredResidents.length)}</span> of{' '}
          <span className="font-bold text-gray-900">{filteredResidents.length}</span> records
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