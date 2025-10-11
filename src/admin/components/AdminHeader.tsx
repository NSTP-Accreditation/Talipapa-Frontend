import React, { useState, useEffect } from 'react';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  title = 'Barangay Information System',
  subtitle = 'Content Management System',
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
    <div className="bg-white border-b border-gray-200 py-4 shadow-sm">
      <div className="flex items-center justify-between px-8 gap-6">
        {/* Left Side - System Info */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h1>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>

        {/* Center - Date & Time Display */}
        <div className="flex items-center gap-6 bg-gray-50 px-8 py-3 rounded-lg border border-gray-200">
          <div className="text-center border-r border-gray-300 pr-6">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Date</p>
            <p className="text-sm font-semibold text-gray-800">
              {formatDate(currentTime)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Time</p>
            <p className="text-sm font-semibold text-gray-800 tabular-nums">
              {formatTime(currentTime)}
            </p>
          </div>
        </div>

        {/* Right Side - Admin User Info */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 leading-tight">Admin User</p>
            <p className="text-xs text-gray-500 mt-0.5">Super Admin</p>
          </div>
          <div 
            className="bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold shadow-md leading-none flex-shrink-0 ring-2 ring-green-200" 
            style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '50%',
              minWidth: '44px',
              minHeight: '44px',
              fontSize: '16px'
            }}
          >
            A
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
