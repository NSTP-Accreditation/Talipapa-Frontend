import React, { useState } from 'react';

const mockLogs = [
  {
    performedBy: 'Ryann M. Romero',
    role: 'Super Admin',
    action: 'Create Account',
    description: 'Create Account',
    category: 'Authentication',
    type: 'RECORD',
    timestamp: '2025-10-01',
  },
  // ...repeat or map for demo rows
];

const categories = [
  'Authentication',
  'Record Management',
  'Inventory',
  'Content Management',
  'User Management',
];

const ActivityLogs = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('desc');

  // Filtered logs
  const filteredLogs = mockLogs.filter(
    (log) =>
      (!category || log.category === category) &&
      (log.performedBy.toLowerCase().includes(search.toLowerCase()) ||
        log.role.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.description.toLowerCase().includes(search.toLowerCase()) ||
        log.type.toLowerCase().includes(search.toLowerCase()))
  );

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sort === 'asc') return a.timestamp.localeCompare(b.timestamp);
    return b.timestamp.localeCompare(a.timestamp);
  });

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-black flex items-center gap-3 mb-1">
          <span className="text-4xl">🗒️</span>
          Activity Log
        </h1>
        <p className="text-gray-600 font-medium">List of Recent Activities</p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 mb-8 flex flex-col md:flex-row md:items-center gap-3">
        <input
          type="text"
          placeholder="Search By"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-2 border-gray-300 rounded-xl px-4 py-3 w-full md:w-64 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
          onClick={() => setSort(sort === 'asc' ? 'desc' : 'asc')}
          className="border-2 border-gray-300 rounded-xl px-4 py-3 w-full md:w-32 flex items-center gap-2 justify-center bg-white hover:bg-green-50 font-semibold text-green-900 transition-all"
        >
          <span>Sort By</span>
          <svg
            className={`w-4 h-4 transition-transform ${sort === 'asc' ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all ml-auto">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" />
          </svg>
          Download as Excel
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border-2 border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider">Performed By</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider">Action</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wider">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedLogs.length > 0 ? (
              sortedLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-green-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">{log.performedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.timestamp}</td>
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
      {/* Pagination (mocked for now) */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button className="px-4 py-2 rounded-xl bg-green-100 text-green-800 font-bold" disabled>
          &lt;
        </button>
        <span className="px-4 py-2 rounded-xl bg-green-50 text-green-900 font-bold">1</span>
        <button className="px-4 py-2 rounded-xl bg-green-100 text-green-800 font-bold" disabled>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ActivityLogs;
