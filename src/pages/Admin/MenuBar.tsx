import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../components/utils';
import { APP_ROUTES } from '../../utils/constants/routes';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  TrendingUp,
  Home,
  BookOpen,
  FileText,
  Newspaper,
  Users,
  FolderOpen,
  Settings,
  LogOut,
  ChevronDown,
  Activity,
  Plus,
  Repeat,
  Trophy,
} from 'lucide-react';

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
  const [expandedItems, setExpandedItems] = useState<string[]>([
    'Trading',
    'Home Editables',
    'Logs',
  ]);

  const menuItems: MenuItem[] = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Dashboard',
      href: APP_ROUTES.ADMIN.DASHBOARD,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Trading',
      href: APP_ROUTES.ADMIN.TRADING,
      submenu: [
        {
          icon: <Activity className="w-4 h-4" />,
          label: 'Activity Logs',
          href: APP_ROUTES.ADMIN.TRADING + '/activity',
        },
        {
          icon: <Plus className="w-4 h-4" />,
          label: 'Earn Points Logs',
          href: APP_ROUTES.ADMIN.TRADING + '/earn-points',
        },
        {
          icon: <Repeat className="w-4 h-4" />,
          label: 'Swap Logs',
          href: APP_ROUTES.ADMIN.TRADING + '/swap',
        },
      ],
    },
    {
      icon: <Home className="w-5 h-5" />,
      label: 'Home Editables',
      href: APP_ROUTES.ADMIN.ABOUT,
      submenu: [
        {
          icon: <FileText className="w-4 h-4" />,
          label: 'Forms',
          href: APP_ROUTES.ADMIN.BASE + '/forms',
        },
        {
          icon: <BookOpen className="w-4 h-4" />,
          label: 'Guidelines',
          href: APP_ROUTES.ADMIN.BASE + '/guidelines',
        },
        {
          icon: <Newspaper className="w-4 h-4" />,
          label: 'News',
          href: APP_ROUTES.ADMIN.NEWS,
        },
        {
          icon: <Users className="w-4 h-4" />,
          label: 'About Us',
          href: APP_ROUTES.ADMIN.ABOUT,
        },
        {
          icon: <Trophy className="w-4 h-4" />,
          label: 'Achievements',
          href: APP_ROUTES.ADMIN.ABOUT + '/achievements',
        },
      ],
    },
    {
      icon: <FolderOpen className="w-5 h-5" />,
      label: 'Logs',
      href: APP_ROUTES.ADMIN.NOTIFICATIONS,
      submenu: [
        {
          icon: <Activity className="w-4 h-4" />,
          label: 'Activity Logs',
          href: APP_ROUTES.ADMIN.NOTIFICATIONS + '/activity',
        },
        {
          icon: <Plus className="w-4 h-4" />,
          label: 'Earn Points Logs',
          href: APP_ROUTES.ADMIN.NOTIFICATIONS + '/earn-points',
        },
        {
          icon: <Repeat className="w-4 h-4" />,
          label: 'Swap Logs',
          href: APP_ROUTES.ADMIN.NOTIFICATIONS + '/swap',
        },
      ],
    },
    {
      icon: <Settings className="w-5 h-5" />,
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
        'w-96 h-screen bg-green-600 text-white flex flex-col',
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-green-500">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <img
              src="/brgy talipapa.png"
              alt="Barangay Talipapa Logo"
              className="w-14 h-14 object-contain"
            />
          </div>
          <div>
            <h2 className="text-white font-semibold text-xl">Barangay CMS</h2>
            <p className="text-green-200 text-lg">Brgy. Talipapa</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => handleItemClick(item)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-3 text-left transition-colors duration-200 text-xl',
                location.pathname === item.href ||
                  (item.submenu &&
                    item.submenu.some((sub) => location.pathname === sub.href))
                  ? 'bg-green-700 text-white'
                  : 'text-white hover:bg-green-500/50'
              )}
            >
              <div className="flex items-center space-x-3">
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
              {item.submenu && (
                <ChevronDown
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    expandedItems.includes(item.label) ? 'rotate-180' : ''
                  )}
                />
              )}
            </button>

            {/* Submenu */}
            {item.submenu && expandedItems.includes(item.label) && (
              <div className="space-y-1 mt-1 mb-1">
                {item.submenu.map((subItem, subIndex) => (
                  <button
                    key={subIndex}
                    onClick={() => navigate(subItem.href!)}
                    className={cn(
                      'w-full flex items-center space-x-4 px-5 py-2 text-left transition-colors duration-200 text-lg',
                      location.pathname === subItem.href
                        ? 'bg-green-700 text-white'
                        : 'text-white hover:bg-green-500/50'
                    )}
                  >
                    <span className="flex-shrink-0">{subItem.icon}</span>
                    <span>{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="px-4 pb-4 border-t border-green-500 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-3 text-left transition-colors duration-200 text-white hover:bg-green-500/50 text-xl"
        >
          <LogOut className="w-5 h-5 text-orange-400" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default MenuBar;
