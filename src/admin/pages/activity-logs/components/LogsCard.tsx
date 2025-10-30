import { LogInterface } from '@/types/global.types';
import React from 'react';

interface LogsCardProps {
  log: LogInterface;
}

export const LogsCard = ({ log } : LogsCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3">
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 mb-1">Performed By</div>
            <div className="text-sm font-semibold text-gray-900 truncate">
              {log.performedBy?.username || log.targetName || '—'}
            </div>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
              {log.category}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-2">
          <div className="text-xs text-gray-500 mb-1">Action</div>
          <div className="text-sm font-medium text-gray-900">{log.action}</div>
        </div>

        <div className="border-t border-gray-100 pt-2">
          <div className="text-xs text-gray-500 mb-1">Title</div>
          <div className="text-sm text-gray-900 break-words">{log.title}</div>
        </div>

        <div className="border-t border-gray-100 pt-2">
          <div className="text-xs text-gray-500 mb-1">Description</div>
          <div className="text-sm text-gray-700 break-words">{log.description}</div>
        </div>

        <div className="border-t border-gray-100 pt-2">
          <div className="text-xs text-gray-500 mb-1">Timestamp</div>
          <div className="text-xs text-gray-600">
            {new Date(log.created_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};