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
    <div
      className="bg-white border-b shadow-md sticky top-0 z-30"
      style={{ borderColor: '#E5E7EB' }}
    >
      <div className="flex items-center justify-between px-6 sm:px-10 py-5 gap-4">
        {/* Left Side - Mobile hamburger + System Info */}
        <div className="flex items-center gap-4 flex-1">
          <div className="sm:hidden">
            <button
              onClick={onToggleSidebar}
              aria-label="Open menu"
              className="p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              style={{ backgroundColor: '#F6F6F6' }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="#1a4d2e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1">
            <h1
              className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight"
              style={{ color: '#1a4d2e' }}
            >
              {title}
            </h1>
            <p
              className="text-sm sm:text-base font-medium mt-1"
              style={{ color: '#838383' }}
            >
              {subtitle}
            </p>
          </div>
        </div>

        {/* Center - Date & Time Display */}
        <div
          className="hidden xl:flex items-center gap-6 px-6 py-3 rounded-xl shadow-sm"
          style={{ backgroundColor: '#F6F6F6' }}
        >
          <div
            className="text-center border-r pr-5"
            style={{ borderColor: '#D1D5DB' }}
          >
            <p
              className="text-xs font-bold uppercase tracking-wider mb-1.5"
              style={{ color: '#838383' }}
            >
              Date
            </p>
            <p className="text-sm font-bold" style={{ color: '#1a4d2e' }}>
              {formatDate(currentTime)}
            </p>
          </div>
          <div className="text-center">
            <p
              className="text-xs font-bold uppercase tracking-wider mb-1.5"
              style={{ color: '#838383' }}
            >
              Time
            </p>
            <p
              className="text-sm font-bold tabular-nums"
              style={{ color: '#1a4d2e' }}
            >
              {formatTime(currentTime)}
            </p>
          </div>
        </div>

        {/* Right Side - Admin User Info */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden lg:block">
            <p
              className="text-sm font-bold leading-tight"
              style={{ color: '#1a4d2e' }}
            >
              Admin User
            </p>
            <p
              className="text-xs font-medium mt-0.5"
              style={{ color: '#838383' }}
            >
              Super Admin
            </p>
          </div>
          <div
            className="flex items-center justify-center text-white font-black shadow-md hover:shadow-lg transition-shadow duration-300 leading-none flex-shrink-0 cursor-pointer"
            style={{
              backgroundColor: '#1a4d2e',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              minWidth: '42px',
              minHeight: '42px',
              fontSize: '16px',
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
