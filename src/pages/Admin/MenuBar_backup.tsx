import React, { useState } from 'react';
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
  submenu?: MenuItem[];
}

const MenuBar: React.FC<MenuBarProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Trading']);

  const menuItems: MenuItem[] = [
    {
      icon: <div className="w-3 h-3 bg-white"></div>,
      label: 'Dashboard',
      href: APP_ROUTES.ADMIN.DASHBOARD,
    },
    {
      icon: <div className="w-3 h-3 bg-green-300"></div>,
      label: 'Trading',
      href: APP_ROUTES.ADMIN.TRADING,
      submenu: [
        {
          icon: <div className="w-3 h-3 bg-white"></div>,
          label: 'Activity Logs',
          href: APP_ROUTES.ADMIN.TRADING + '/activity',
        },
        {
          icon: <div className="w-3 h-3 bg-white"></div>,
          label: 'Earn Points Logs',
          href: APP_ROUTES.ADMIN.TRADING + '/earn-points',
        },
        {
          icon: <div className="w-3 h-3 bg-white"></div>,
          label: 'Swap Logs',
          href: APP_ROUTES.ADMIN.TRADING + '/swap',
        },
      ],
    },
    {
      icon: <div className="w-3 h-3 bg-white"></div>,
      label: 'Records',
      href: APP_ROUTES.ADMIN.RESOURCES,
    },
    {
      icon: <div className="w-3 h-3 bg-white"></div>,
      label: 'Earn Points',
      href: APP_ROUTES.ADMIN.SERVICES,
    },
    {
      icon: <div className="w-3 h-3 bg-white"></div>,
      label: 'Trade Points',
      href: APP_ROUTES.ADMIN.USERS,
    },
    {
      icon: <div className="w-3 h-3 bg-white"></div>,
      label: 'Guidelines',
      href: APP_ROUTES.ADMIN.GUIDELINES,
    },
    {
      icon: <div className="w-3 h-3 bg-white"></div>,
      label: 'News',
      href: APP_ROUTES.ADMIN.NEWS,
    },
    {
      icon: <div className="w-3 h-3 bg-white"></div>,
      label: 'About Us',
      href: APP_ROUTES.ADMIN.ABOUT,
    },
    {
      icon: <span className="text-base">⬜</span>,
      label: 'Logs',
      href: APP_ROUTES.ADMIN.NOTIFICATIONS,
      submenu: [
        {
          icon: <span className="text-base">⬜</span>,
          label: 'Activity Logs',
          href: APP_ROUTES.ADMIN.NOTIFICATIONS + '/activity',
        },
        {
          icon: <span className="text-base">⬜</span>,
          label: 'Earn Points Logs',
          href: APP_ROUTES.ADMIN.NOTIFICATIONS + '/earn-points',
        },
        {
          icon: <span className="text-base">⬜</span>,
          label: 'Swap Logs',
          href: APP_ROUTES.ADMIN.NOTIFICATIONS + '/swap',
        },
      ],
    },
    {
      icon: <span className="text-base">⚙️</span>,
      label: 'Settings',
      href: APP_ROUTES.ADMIN.SETTINGS,
    },
  ];

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.submenu) {
      toggleExpanded(item.label);
    } else if (item.onClick) {
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
      <div className="px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <img
              src="/brgy talipapa.png"
              alt="Barangay Talipapa Logo"
              className="w-6 h-6 object-contain"
            />
          </div>
          <div>
            <h2 className="text-white font-medium text-sm">Barangay CMS</h2>
            <p className="text-green-200 text-xs">Brgy. Talipapa</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-2">
        {menuItems.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => handleItemClick(item)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors duration-200',
                location.pathname === item.href ||
                  (item.submenu &&
                    item.submenu.some((sub) => location.pathname === sub.href))
                  ? 'bg-green-700 text-white'
                  : 'text-green-100 hover:bg-green-500/50 hover:text-white'
              )}
            >
              <div className="flex items-center space-x-3">
                <span className="flex-shrink-0 text-sm">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {item.submenu && (
                <span
                  className={cn(
                    'text-xs transition-transform duration-200',
                    expandedItems.includes(item.label) ? 'rotate-90' : ''
                  )}
                >
                  ▶
                </span>
              )}
            </button>

            {/* Submenu */}
            {item.submenu && expandedItems.includes(item.label) && (
              <div className="ml-6 mt-1 space-y-1">
                {item.submenu.map((subItem, subIndex) => (
                  <button
                    key={subIndex}
                    onClick={() => navigate(subItem.href!)}
                    className={cn(
                      'w-full flex items-center space-x-3 px-3 py-2 text-left transition-colors duration-200 text-sm',
                      location.pathname === subItem.href
                        ? 'bg-green-700 text-white'
                        : 'text-green-200 hover:bg-green-500/50 hover:text-white'
                    )}
                  >
                    <span className="flex-shrink-0 text-xs">
                      {subItem.icon}
                    </span>
                    <span>{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 text-left transition-colors duration-200 text-green-100 hover:bg-green-500/50 hover:text-white"
        >
          <span className="flex-shrink-0 text-sm">🚪</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default MenuBar;
