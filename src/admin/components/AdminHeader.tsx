import React, { useState, useEffect } from 'react';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  onToggleSidebar?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  title = 'Barangay Information System',
  subtitle = 'Content Management System',
  onToggleSidebar,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 py-3 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-8 gap-4">
        {/* Mobile hamburger */}
        <div className="w-full flex items-start justify-between gap-4">
          <div className="sm:hidden mr-2">
            <button
              onClick={onToggleSidebar}
              aria-label="Open menu"
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          {/* Left Side - System Info */}
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {title}
            </h1>
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          </div>

          {/* Center - Date & Time Display */}
          <div className="hidden sm:flex items-center gap-6 bg-gray-50 px-6 py-2 rounded-lg border border-gray-200">
            <div className="text-center border-r border-gray-300 pr-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Date
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {formatDate(currentTime)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Time
              </p>
              <p className="text-sm font-semibold text-gray-800 tabular-nums">
                {formatTime(currentTime)}
              </p>
            </div>
          </div>

          {/* Right Side - Admin User Info */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                Welcome, Admin User
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Super Admin</p>
            </div>
            <div
              className="bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold shadow-md leading-none flex-shrink-0 ring-2 ring-green-200"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                minWidth: '40px',
                minHeight: '40px',
                fontSize: '14px',
              }}
            >
              A
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
