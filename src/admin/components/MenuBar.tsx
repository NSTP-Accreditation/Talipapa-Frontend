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
  Recycle,
} from 'lucide-react';

interface MenuBarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  submenu?: MenuItem[];
}

const MenuBar: React.FC<MenuBarProps> = ({
  className,
  isOpen = true,
  onClose,
}) => {
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
        {
          icon: <FileBarChart className="w-4 h-4" />,
          label: 'Statistics',
          href: APP_ROUTES.ADMIN.TRADING + '/statistics',
        },
        {
          icon: <ArrowRightLeft className="w-4 h-4" />, // Fixed: Changed from Coins to ArrowRightLeft for consistency
          label: 'Swap item',
          href: APP_ROUTES.ADMIN.TRADING + '/swap-item',
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
        {
          icon: <Recycle className="w-4 h-4" />,
          label: 'Talipapa Natin',
          href: APP_ROUTES.ADMIN.BASE + '/talipapa-natin',
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
    <>
      {/* Mobile overlay */}
      {!isOpen ? null : (
        <div
          className="sm:hidden fixed inset-0 z-40 bg-black/40"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          'w-[280px] sm:w-[320px] h-screen text-white flex flex-col fixed left-0 top-0 overflow-hidden transform transition-transform duration-300 z-50 shadow-2xl',
          // hide on small screens unless isOpen
          isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0',
          className
        )}
        style={{ backgroundColor: '#1a4d2e' }}
      >
        {/* Header */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <img
                src="/brgy talipapa.png"
                alt="Barangay Talipapa Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div className="flex-shrink-0">
              <h1 className="text-white font-black text-xl whitespace-nowrap leading-tight">Barangay Admin</h1>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-white/20 mx-6 mb-2"></div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-transparent">
          {menuItems.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => handleItemClick(item)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3.5 text-left transition-all duration-200 text-base font-medium rounded-lg',
                  location.pathname === item.href ||
                    (item.submenu &&
                      item.submenu.some(
                        (sub) => location.pathname === sub.href
                      ))
                    ? 'bg-white/15 text-white shadow-md'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                )}
              >
                <div className="flex items-center space-x-3">
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="font-semibold">{item.label}</span>
                </div>
                {item.submenu && (
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform duration-200',
                      expandedItems.includes(item.label) ? 'rotate-180' : ''
                    )}
                  />
                )}
              </button>

              {/* Submenu */}
              {item.submenu && expandedItems.includes(item.label) && (
                <div className="mt-2 mb-2 space-y-1">
                  {item.submenu.map((subItem, subIndex) => (
                    <div key={subIndex}>
                      {subIndex > 0 && (
                        <div
                          className="border-t border-white/10 my-2"
                          style={{ marginLeft: '3rem', marginRight: '3rem' }}
                        />
                      )}
                      <button
                        onClick={() => navigate(subItem.href!)}
                        className={cn(
                          'w-full flex items-center space-x-3 pr-4 py-3 text-left transition-all duration-300 ease-in-out text-base rounded-lg transform',
                          'hover:scale-[1.02] hover:shadow-md hover:bg-white/10 hover:text-white hover:font-semibold',
                          'active:scale-95',
                          location.pathname === subItem.href
                            ? 'bg-white/15 text-white font-semibold scale-[1.02] shadow-md'
                            : 'text-white/80'
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
        <div className="px-4 pb-5 border-t border-white/20 pt-5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3.5 text-left transition-all duration-200 text-white/90 hover:bg-red-500/20 hover:text-white text-base font-medium rounded-lg group"
          >
            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MenuBar;
