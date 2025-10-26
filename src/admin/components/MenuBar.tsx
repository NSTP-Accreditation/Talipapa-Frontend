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
  Trophy,
  Recycle,
  Sprout,
  RotateCwSquare,
} from 'lucide-react';
import useFetchData from '../hooks/useFetchData';

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
  const { data, loading, error } = useFetchData(
    `/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}`
  );

  const menuItems: MenuItem[] = [
    {
      icon: <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: 'Dashboard',
      href: APP_ROUTES.ADMIN.DASHBOARD,
    },
    {
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: 'Resident Records',
      href: APP_ROUTES.ADMIN.RESOURCES,
    },
    {
      icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: 'Trading',
      href: APP_ROUTES.ADMIN.TRADING,
      submenu: [
        {
          icon: <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'Earn Points',
          href: APP_ROUTES.ADMIN.TRADING + '/earn-points',
        },
        {
          icon: <FileBarChart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'Statistics',
          href: APP_ROUTES.ADMIN.TRADING + '/statistics',
        },
        {
          icon: <ArrowRightLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'Swap item',
          href: APP_ROUTES.ADMIN.TRADING + '/swap-item',
        },
      ],
    },
    {
      icon: <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: 'Green Pages',
      href: APP_ROUTES.ADMIN.BASE + '/green-pages',
    },
    {
      icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: 'Home Editables',
      href: APP_ROUTES.ADMIN.ABOUT,
      submenu: [
        {
          icon: <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'Guidelines',
          href: APP_ROUTES.ADMIN.BASE + '/guidelines',
        },
        {
          icon: <Newspaper className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'News',
          href: APP_ROUTES.ADMIN.NEWS,
        },
        {
          icon: <RotateCwSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'Carousel',
          href: APP_ROUTES.ADMIN.CAROUSEL,
        },
        {
          icon: <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'About Us',
          href: APP_ROUTES.ADMIN.ABOUT,
        },
        {
          icon: <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'Achievements',
          href: APP_ROUTES.ADMIN.ABOUT + '/achievements',
        },
        {
          icon: <Recycle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'Talipapa Natin',
          href: APP_ROUTES.ADMIN.TALIPAPANATIN,
        },
      ],
    },
    {
      icon: <Package className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: 'Inventory',
      href: APP_ROUTES.ADMIN.INVENTORY,
    },
    {
      icon: <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: 'Farm Inventory',
      href: APP_ROUTES.ADMIN.FARM_INVENTORY,
    },
    {
      icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: 'Activity Logs',
      href: APP_ROUTES.ADMIN.ACTIVITYLOGS,
    },
    {
      icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" />,
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

  const handleLogout = async () => {
    await logout(); // this calls the context logout()

    // delay the navigation slightly so your toast can show
    setTimeout(() => {
      navigate('/admin/login', {
        state: { logoutSuccess: true },
        replace: true,
      });
    }, 100);
  };

  return (
    <>
      {/* Mobile overlay */}
      {!isOpen ? null : (
        <div
          className="sm:hidden fixed inset-0 z-[500] bg-black/40"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          'w-[270px] sm:w-[320px] h-screen text-white flex flex-col fixed left-0 top-0 overflow-hidden transition-all duration-300 z-[500] shadow-2xl bg-gradient-to-b from-green-900 via-green-800 to-green-900',
          // hide on small screens unless isOpen (use negative margin rather than transform)
          isOpen ? 'ml-0' : '-ml-[270px] sm:ml-0',
          className
        )}
      >
        {/* Header */}
        <div className="px-4 py-4 sm:px-6 sm:py-6 bg-gradient-to-r from-green-950 to-green-900">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white/30">
              <img
                src={data?.image?.url ? data.image.url : '/brgy talipapa.png'}
                alt="Barangay Talipapa Logo"
                className="w-8 h-8 sm:w-11 sm:h-11 object-contain"
              />
            </div>
            <div className="flex-shrink-0">
              <h1 className="text-white font-black text-base sm:text-[18px] sm:text-1xl whitespace-nowrap leading-tight">
                Barangay Talipapa Admin
              </h1>
              <p className="text-green-200 text-xs sm:text-xs font-medium">
                Content Management System
              </p>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-green-700/30 mx-4 sm:mx-6 mb-2"></div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 sm:px-4 py-3 sm:py-5 space-y-1.5 sm:space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-transparent">
          {menuItems.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => handleItemClick(item)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-3 sm:px-4 sm:py-3.5 text-left transition-all duration-200 text-sm sm:text-base font-medium rounded-xl',
                  location.pathname === item.href ||
                    (item.submenu &&
                      item.submenu.some(
                        (sub) => location.pathname === sub.href
                      ))
                    ? 'bg-white/20 text-white shadow-lg ring-1 ring-white/30'
                    : 'text-green-100 hover:bg-white/10 hover:text-white hover:shadow-md'
                )}
              >
                <div className="flex items-center space-x-2.5 sm:space-x-3">
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="font-semibold text-sm sm:text-base">
                    {item.label}
                  </span>
                </div>
                {item.submenu && (
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 sm:w-4 sm:h-4 transition',
                      expandedItems.includes(item.label) ? 'rotate-180' : ''
                    )}
                  />
                )}
              </button>

              {/* Submenu */}
              {item.submenu && expandedItems.includes(item.label) && (
                <div className="mt-1.5 mb-1.5 sm:mt-2 sm:mb-2 space-y-1 bg-green-950/30 rounded-xl p-1.5 sm:p-2">
                  {item.submenu.map((subItem, subIndex) => (
                    <div key={subIndex}>
                      {subIndex > 0 && (
                        <div
                          className="border-t border-green-700/20 my-1.5 sm:my-2"
                          style={{
                            marginLeft: '2.5rem',
                            marginRight: '2.5rem',
                          }}
                        />
                      )}
                      <button
                        onClick={() => navigate(subItem.href!)}
                        className={cn(
                          'w-full flex items-center space-x-2.5 sm:space-x-3 pr-3 py-2.5 sm:pr-4 sm:py-3 text-left transition-all duration-300 ease-in-out text-sm sm:text-base rounded-xl',
                          'hover:shadow-md hover:bg-white/15 hover:text-white hover:font-semibold',
                          location.pathname === subItem.href
                            ? 'bg-white/20 text-white font-semibold shadow-md ring-1 ring-white/20'
                            : 'text-green-100'
                        )}
                        style={{ paddingLeft: '2.5rem' }}
                      >
                        <span className="flex-shrink-0">{subItem.icon}</span>
                        <span className="text-sm sm:text-base">
                          {subItem.label}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="px-3 pb-4 sm:px-4 sm:pb-5 border-t border-green-700/30 pt-4 sm:pt-5 bg-gradient-to-t from-green-950/50 to-transparent">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2.5 sm:space-x-3 px-3 py-3 sm:px-4 sm:py-3.5 text-left transition-all duration-200 text-green-100 hover:bg-red-500/20 hover:text-white text-sm sm:text-base font-medium rounded-xl group hover:shadow-lg"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 group-hover:text-red-300 transition-colors" />
            <span className="font-semibold text-sm sm:text-base">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MenuBar;
