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
  Package,
  Settings,
  LogOut,
  ChevronDown,
  FileBarChart,
  Coins,
  ArrowRightLeft,
  Box,
  Wrench,
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
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Dashboard',
      href: APP_ROUTES.ADMIN.DASHBOARD,
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Resident Records',
      href: APP_ROUTES.ADMIN.RESOURCES,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Trading',
      href: APP_ROUTES.ADMIN.TRADING,
      submenu: [
        {
          icon: <Coins className="w-4 h-4" />,
          label: 'Earn Points',
          href: APP_ROUTES.ADMIN.TRADING + '/earn-points',
        },
      ],
    },
    {
      icon: <Home className="w-5 h-5" />,
      label: 'Home Editables',
      href: APP_ROUTES.ADMIN.ABOUT,
      submenu: [
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
      icon: <Package className="w-5 h-5" />,
      label: 'Inventory',
      href: APP_ROUTES.ADMIN.INVENTORY,
      submenu: [
        {
          icon: <Box className="w-4 h-4" />,
          label: 'Products',
          href: APP_ROUTES.ADMIN.INVENTORY + '?tab=products',
        },
        {
          icon: <Wrench className="w-4 h-4" />,
          label: 'Materials',
          href: APP_ROUTES.ADMIN.INVENTORY + '?tab=materials',
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
        'w-[310px] h-screen bg-green-600 text-white flex flex-col fixed left-0 top-0 overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <img
              src="/brgy talipapa.png"
              alt="Barangay Talipapa Logo"
              className="w-10 h-10 object-contain"
            />
          </div>
          <div>
            <h1 className="text-white font-black text-xl">Barangay Admin</h1>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <div className="border-t border-green-400/50 mx-4"></div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-green-700">
        {menuItems.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => handleItemClick(item)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 text-left transition-colors duration-200 text-base',
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
              <div className="mt-3 mb-3 space-y-2">
                {item.submenu.map((subItem, subIndex) => (
                  <div key={subIndex}>
                    {subIndex > 0 && (
                      <div className="border-t-2 border-green-300/60 my-2" style={{ marginLeft: '3rem', marginRight: '5rem' }} />
                    )}
                    <button
                      onClick={() => navigate(subItem.href!)}
                      className={cn(
                        'w-full flex items-center space-x-3 pr-4 py-3 text-left transition-all duration-300 ease-in-out text-base rounded-md transform',
                        'hover:scale-105 hover:shadow-lg hover:shadow-green-900/30 hover:bg-green-600/70 hover:text-white hover:font-semibold',
                        'active:scale-95',
                        location.pathname === subItem.href
                          ? 'bg-green-700 text-white font-semibold scale-105 shadow-md'
                          : 'text-green-100'
                      )}
                      style={{ paddingLeft: '3rem' }}
                    >
                      <span className="flex-shrink-0">{subItem.icon}</span>
                      <span>{subItem.label}</span>
                    </button>
                  </div>
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
          className="w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-200 text-white hover:bg-green-500/50 text-base"
        >
          <LogOut className="w-5 h-5 text-orange-400" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default MenuBar;
