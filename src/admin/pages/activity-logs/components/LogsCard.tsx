import { LogInterface } from '@/types/global.types';
import React from 'react';

interface LogsCardProps {
  log: LogInterface;
}

export const LogsCard = ({ log }: LogsCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 hover:shadow-xl transition-all">
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
              Performed By
            </div>
            <div className="text-sm font-bold text-gray-900 truncate">
              {log.performedBy?.username || log.targetName || '—'}
            </div>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-block px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-lg border border-green-300">
              {log.category}
            </span>
          </div>
        </div>

        <div className="border-t-2 border-green-100 pt-2">
          <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
            Action
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {log.action}
          </div>
        </div>

        <div className="border-t-2 border-green-100 pt-2">
          <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
            Title
          </div>
          <div className="text-sm text-gray-900 break-words">{log.title}</div>
        </div>

        <div className="border-t-2 border-green-100 pt-2">
          <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
            Description
          </div>
          <div className="text-sm text-gray-700 break-words">
            {log.description}
          </div>
        </div>

        <div className="border-t-2 border-green-100 pt-2">
          <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
            Timestamp
          </div>
          <div className="text-xs font-medium text-gray-600">
            {new Date(log.created_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
