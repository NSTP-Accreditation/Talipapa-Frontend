import { useAuth } from '@/contexts/AuthContext';
import React, { useState, useEffect } from 'react';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  title = 'Barangay Information System',
  subtitle = 'Content Management System',
  onToggleSidebar,
  isSidebarOpen = false,
}) => {
  const { user } = useAuth();
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

  // Mobile-specific short formats
  const formatMobileDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'long' });

  const formatMobileTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className={`bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-b border-green-700/30 shadow-xl sticky top-0 backdrop-blur-sm z-[1001] ${
        isSidebarOpen ? 'filter brightness-75' : ''
      }`}
    >
      <div className="flex items-center justify-between px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-7 gap-3 sm:gap-4">
        {/* Left Side - Mobile hamburger + Date/Time aligned */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          <div className="sm:hidden">
            <button
              onClick={onToggleSidebar}
              aria-label="Open menu"
              className="p-2.5 sm:p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white/20 backdrop-blur-sm hover:bg-white/30"
            >
              <svg
                width="20"
                height="20"
                className="sm:w-6 sm:h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Date/Time - Aligned with hamburger */}
          <div className="sm:hidden flex items-center px-3 py-2 rounded-lg shadow-md bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
            <div className="text-center border-r pr-4 border-white/20">
              <p className="text-[10px] font-bold uppercase tracking-wider text-green-100 mb-0.5">
                {formatMobileDate(currentTime)}
              </p>
            </div>
            <div className="text-center pl-3">
              <p className="text-[10px] font-bold tabular-nums text-green-100 mb-0.5">
                {formatMobileTime(currentTime)}
              </p>
            </div>
          </div>

          {/* Desktop Date/Time - Full version */}
          <div className="hidden xl:flex items-center gap-6 px-4 py-2 rounded-xl shadow-lg bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
            <div className="text-center border-r pr-4 border-white/20">
              <p className="text-xs font-bold uppercase tracking-wider mb-1.5 text-green-100">
                Date
              </p>
              <p className="text-sm font-bold text-white">
                {formatDate(currentTime)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wider mb-1.5 text-green-100">
                Time
              </p>
              <p className="text-sm font-bold tabular-nums text-white">
                {formatTime(currentTime)}
              </p>
            </div>
          </div>

          {/* Tablet Date/Time - Medium version */}
          <div className="hidden sm:flex xl:hidden items-center gap-3 px-3 py-2 rounded-xl shadow-lg bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
            <div className="text-center border-r pr-3 border-white/20">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-green-100">
                Date
              </p>
              <p className="text-xs font-bold text-white">
                {formatDate(currentTime).split(',')[1]?.trim()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-green-100">
                Time
              </p>
              <p className="text-xs font-bold tabular-nums text-white">
                {formatTime(currentTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Admin User Info */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Mobile Welcome Text - Compact */}
          <div className="text-right sm:hidden">
            <p className="text-sm font-bold leading-tight text-white">
              Admin {user.userData.username}
            </p>
          </div>

          {/* Tablet Welcome Text - Medium */}
          <div className="text-right hidden sm:block lg:hidden">
            <p className="text-base font-bold leading-tight text-white">
              Welcome, Admin {user.userData.username}
            </p>
          </div>

          {/* Desktop Welcome Text - Full */}
          <div className="text-right hidden lg:block">
            <p className="text-lg font-bold leading-tight text-white">
              Welcome Back, Admin {user.userData.username}
            </p>
          </div>

          {/* Avatar - Responsive sizing */}
          <div className="flex items-center justify-center text-green-900 font-black shadow-lg hover:shadow-xl transition-all duration-300 leading-none flex-shrink-0 cursor-pointer bg-white ring-2 ring-white/30 hover:scale-110 w-[40px] h-[40px] min-w-[40px] min-h-[40px] sm:w-[46px] sm:h-[46px] sm:min-w-[46px] sm:min-h-[46px] rounded-full text-base sm:text-lg">
            A
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
