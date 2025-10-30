import { LogInterface } from '@/types/global.types';
import React from 'react';

interface LogsTableProps {
  logs: LogInterface[];
}

export const LogsCardTable = ({ logs } : LogsTableProps) => {
  const headers = ['Performed By', 'Action', 'Title', 'Description', 'Category', 'Timestamp'];

  return (
    <div className="hidden md:block overflow-x-auto bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-200">
          <tr>
            {headers.map((header) => (
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
          {logs.length > 0 ? (
            logs.map((log) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm" title={log.title}>
                  <div className="max-w-xs truncate">{log.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" title={log.description}>
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
              <td colSpan={headers.length} className="text-center py-12 text-gray-400 text-sm">
                No activity logs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};