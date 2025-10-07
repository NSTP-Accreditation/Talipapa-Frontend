import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../components/utils';
import { APP_ROUTES } from '../../utils/constants/routes';
import { useAuth } from '../../contexts/AuthContext';

interface MenuBarProps {
  className?: string;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

const MenuBar: React.FC<MenuBarProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems: MenuItem[] = [
    {
      icon: <span className="text-lg">📊</span>,
      label: 'Dashboard',
      href: APP_ROUTES.ADMIN.DASHBOARD,
    },
    {
      icon: <span className="text-lg">ℹ️</span>,
      label: 'About Us',
      href: APP_ROUTES.ADMIN.ABOUT,
    },
    {
      icon: <span className="text-lg">🏢</span>,
      label: 'Services',
      href: APP_ROUTES.ADMIN.SERVICES,
    },
    {
      icon: <span className="text-lg">📁</span>,
      label: 'Resources',
      href: APP_ROUTES.ADMIN.RESOURCES,
    },
    {
      icon: <span className="text-lg">💹</span>,
      label: 'Trading',
      href: APP_ROUTES.ADMIN.TRADING,
    },
    {
      icon: <span className="text-lg">📰</span>,
      label: 'News',
      href: APP_ROUTES.ADMIN.NEWS,
    },
    {
      icon: <span className="text-lg">👥</span>,
      label: 'Users',
      href: APP_ROUTES.ADMIN.USERS,
    },
    {
      icon: <span className="text-lg">🔔</span>,
      label: 'Notifications',
      href: APP_ROUTES.ADMIN.NOTIFICATIONS,
    },
    {
      icon: <span className="text-lg">⚙️</span>,
      label: 'Settings',
      href: APP_ROUTES.ADMIN.SETTINGS,
    },
  ];

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      navigate(item.href);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div
      className={cn(
        'w-64 h-screen bg-green-600 text-white flex flex-col',
        className
      )}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4">
          <img
            src="/brgy talipapa.png"
            alt="Barangay Talipapa Logo"
            className="h-[90px] w-[90px] object-contain hover:opacity-80 transition-opacity cursor-pointer"
          />
        </div>
        <div className="flex-1 text-center">
          <h2 className="text-lg font-semibold">Barangay CMS</h2>
          <p className="text-sm text-green-100 opacity-75">Barangay Talipapa</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleItemClick(item)}
            className={cn(
              'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer transform hover:scale-105 hover:shadow-lg',
              location.pathname === item.href
                ? 'bg-green-700 text-white shadow-md'
                : 'text-green-100 hover:bg-green-500 hover:text-white hover:shadow-green-300/20'
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-green-500">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-green-100 hover:bg-green-500 hover:text-white transition-all duration-200 cursor-pointer transform hover:scale-105 hover:shadow-lg hover:shadow-green-300/20"
        >
          <span className="text-lg">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default MenuBar;
