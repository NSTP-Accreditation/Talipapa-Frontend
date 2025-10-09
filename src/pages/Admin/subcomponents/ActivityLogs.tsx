import React, { useState } from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[50px] font-bold text-green-800">Resident Records</h1>
          <p className="text-gray-600 mt-2">
            List of the resident records created.
          </p>
        </div>

        {/* Right side: Download button */}
        <Button className="bg-green-700 text-white hover:bg-green-800 text-sm flex items-center gap-2 h-fit mt-[30px]">
          <Download className="w-4 h-4" />
          Download as Excel
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full mb-[40px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

        <Input
          type="text"
          placeholder="Search by Record Id or Name"
          className="w-full rounded-md border border-gray-300 pt-[10px] pb-[10px] pl-[40px] focus:ring-2 focus:ring-green-600 focus:outline-none"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset to first page on new search
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Record Id</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Activity</th>
              <th className="px-4 py-2 text-left">Points</th>
              <th className="px-4 py-2 text-left">Contact Number</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {currentResidents.length > 0 ? (
              currentResidents.map((resident, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{resident.recordId}</td>
                  <td className="px-4 py-3">{resident.name}</td>
                  <td className="px-4 py-3">{resident.activity}</td>
                  <td className="px-4 py-3">{resident.points}</td>
                  <td className="px-4 py-3">{resident.contact}</td>
                  <td className="px-4 py-3">{resident.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          &lt;
        </Button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          &gt;
        </Button>
      </div>
    </div>
  );
};

export default ResidentRecords;