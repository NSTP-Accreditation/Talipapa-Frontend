/**
 * RBAC-Enhanced MenuBar Component
 *
 * This is an example of how to integrate RBAC into the MenuBar component.
 * Menu items are filtered based on user permissions and roles.
 *
 * INTEGRATION INSTRUCTIONS:
 * 1. Review this file to understand the RBAC integration
 * 2. Apply similar patterns to your existing MenuBar.tsx
 * 3. Add permission checks to each menu item
 * 4. Test with different user roles
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../components/utils';
import { APP_ROUTES } from '../../utils/constants/routes';
import { useAuth } from '../../contexts/AuthContext';
import { useRBAC } from '../../hooks/useRBAC';
import { Permission, UserRole } from '../../types/rbac.types';
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
  Building,
  MapPin,
  Shield,
} from 'lucide-react';
import useFetchData from '../../admin/hooks/useFetchData';

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
  // RBAC: Permission or role requirements
  permission?: Permission;
  permissions?: Permission[];
  role?: UserRole;
  roles?: UserRole[];
  requireAll?: boolean;
}

const MenuBarWithRBAC: React.FC<MenuBarProps> = ({
  className,
  isOpen = true,
  onClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { data } = useFetchData(
    `/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}`
  );

  // RBAC: Get permission checking functions
  const {
    hasPermission,
    hasAnyPermission,
    isSuperAdmin,
    canManageAdmins,
    userRoleDisplay,
    userRoleBadgeColor,
  } = useRBAC();

  /**
   * Menu Items with RBAC Configuration
   * Each item can specify:
   * - permission: Single required permission
   * - permissions: Array of permissions (user needs at least one)
   * - role: Specific role required
   * - roles: Array of roles (user needs at least one)
   */
  const menuItems: MenuItem[] = [
    {
      icon: <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: 'Dashboard',
      href: APP_ROUTES.ADMIN.DASHBOARD,
      // Dashboard is visible to all authenticated users
    },
    {
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: 'Records',
      href: APP_ROUTES.ADMIN.RESOURCES,
      // RBAC: Requires VIEW_RECORDS permission
      permission: Permission.VIEW_RECORDS,
      submenu: [
        {
          icon: <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'Resident',
          href: APP_ROUTES.ADMIN.RESOURCES,
          permission: Permission.VIEW_RECORDS,
        },
        {
          icon: <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'Non Resident',
          href: APP_ROUTES.ADMIN.RESOURCES + '/non-resident',
          permission: Permission.VIEW_RECORDS,
        },
        {
          icon: <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'Establishment',
          href: APP_ROUTES.ADMIN.RESOURCES + '/establishment',
          permission: Permission.VIEW_RECORDS,
        },
      ],
    },
    {
      icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: 'Trading',
      href: APP_ROUTES.ADMIN.TRADING,
      // RBAC: Requires VIEW_TRADING permission
      permission: Permission.VIEW_TRADING,
      submenu: [
        {
          icon: <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'Earn Points',
          href: APP_ROUTES.ADMIN.TRADING + '/earn-points',
          permission: Permission.VIEW_TRADING,
        },
        {
          icon: <FileBarChart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'Statistics',
          href: APP_ROUTES.ADMIN.TRADING + '/statistics',
          permission: Permission.VIEW_TRADING,
        },
        {
          icon: <ArrowRightLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'Swap item',
          href: APP_ROUTES.ADMIN.TRADING + '/swap-item',
          permission: Permission.VIEW_TRADING,
        },
        {
          icon: <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'Geotag Locations',
          href: APP_ROUTES.ADMIN.TRADING + '/locations',
          permission: Permission.VIEW_TRADING,
        },
      ],
    },
    {
      icon: <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: 'Green Pages',
      href: APP_ROUTES.ADMIN.BASE + '/green-pages',
      // RBAC: Requires VIEW_GREEN_PAGES permission
      permission: Permission.VIEW_GREEN_PAGES,
    },
    {
      icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: 'Home Editables',
      href: APP_ROUTES.ADMIN.ABOUT,
      // RBAC: Requires VIEW_CONTENT permission
      permission: Permission.VIEW_CONTENT,
      submenu: [
        {
          icon: <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'Guidelines',
          href: APP_ROUTES.ADMIN.BASE + '/guidelines',
          permission: Permission.VIEW_GUIDELINES,
        },
        {
          icon: <Newspaper className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'News',
          href: APP_ROUTES.ADMIN.NEWS,
          permission: Permission.VIEW_NEWS,
        },
        {
          icon: <RotateCwSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'Carousel',
          href: APP_ROUTES.ADMIN.CAROUSEL,
          permission: Permission.VIEW_CONTENT,
        },
        {
          icon: <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'About Us',
          href: APP_ROUTES.ADMIN.ABOUT,
          permission: Permission.VIEW_CONTENT,
        },
        {
          icon: <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'Achievements',
          href: APP_ROUTES.ADMIN.ABOUT + '/achievements',
          permission: Permission.VIEW_ACHIEVEMENTS,
        },
        {
          icon: <Recycle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
          label: 'Talipapa Natin',
          href: APP_ROUTES.ADMIN.TALIPAPANATIN,
          permission: Permission.VIEW_CONTENT,
        },
      ],
    },
    {
      icon: <Package className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: 'Inventory',
      href: APP_ROUTES.ADMIN.INVENTORY,
      // RBAC: Requires VIEW_INVENTORY permission
      permission: Permission.VIEW_INVENTORY,
    },
    {
      icon: <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: 'Farm Inventory',
      href: APP_ROUTES.ADMIN.FARM_INVENTORY,
      // RBAC: Requires VIEW_FARM_INVENTORY permission
      permission: Permission.VIEW_FARM_INVENTORY,
    },
    {
      icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: 'Activity Logs',
      href: APP_ROUTES.ADMIN.ACTIVITYLOGS,
      // RBAC: Requires VIEW_ACTIVITY_LOGS permission
      permission: Permission.VIEW_ACTIVITY_LOGS,
    },
    {
      icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: 'Settings',
      href: APP_ROUTES.ADMIN.SETTINGS,
      // RBAC: Requires VIEW_SETTINGS permission
      permission: Permission.VIEW_SETTINGS,
    },
    // NEW: Admin Management - Only for SuperAdmin
    {
      icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: 'Admin Management',
      href: APP_ROUTES.ADMIN.BASE + '/manage-admins',
      // RBAC: Only SuperAdmin can access
      role: UserRole.SUPERADMIN,
    },
  ];

  /**
   * RBAC: Filter menu items based on user permissions
   * This function checks if the user has access to a menu item
   */
  const canAccessMenuItem = (item: MenuItem): boolean => {
    // If no permission requirements, item is accessible
    if (!item.permission && !item.permissions && !item.role && !item.roles) {
      return true;
    }

    // Check single permission
    if (item.permission && !hasPermission(item.permission)) {
      return false;
    }

    // Check multiple permissions
    if (item.permissions && !hasAnyPermission(item.permissions)) {
      return false;
    }

    // Check role
    if (item.role) {
      if (item.role === UserRole.SUPERADMIN && !isSuperAdmin) {
        return false;
      }
      // Add more role checks as needed
    }

    return true;
  };

  /**
   * RBAC: Filter menu items to only show accessible items
   */
  const getAccessibleMenuItems = (): MenuItem[] => {
    return menuItems
      .filter(canAccessMenuItem)
      .map((item) => {
        // If item has submenu, filter it too
        if (item.submenu) {
          const accessibleSubmenu = item.submenu.filter(canAccessMenuItem);
          // Only show parent if it has accessible submenu items
          if (accessibleSubmenu.length === 0) {
            return null;
          }
          return { ...item, submenu: accessibleSubmenu };
        }
        return item;
      })
      .filter((item): item is MenuItem => item !== null);
  };

  const accessibleMenuItems = getAccessibleMenuItems();

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const [isNavigating, setIsNavigating] = useState(false);

  const isMobileViewport = () => {
    if (typeof window === 'undefined') return false;
    try {
      return window.matchMedia('(max-width: 639px)').matches;
    } catch (err) {
      return window.innerWidth <= 640;
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.submenu) {
      toggleExpanded(item.label);
    } else if (item.onClick) {
      setIsNavigating(true);
      try {
        item.onClick();
      } finally {
        if (onClose && isMobileViewport()) onClose();
        setTimeout(() => setIsNavigating(false), 600);
      }
    } else if (item.href) {
      setIsNavigating(true);
      navigate(item.href);
      if (onClose && isMobileViewport()) onClose();
      setTimeout(() => setIsNavigating(false), 600);
    }
  };

  const handleLogout = () => {
    setIsNavigating(true);
    try {
      logout();
    } finally {
      if (onClose && isMobileViewport()) onClose();
      setTimeout(() => setIsNavigating(false), 600);
    }
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
          isOpen ? 'ml-0' : '-ml-[270px] sm:ml-0',
          className
        )}
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Navigation blocker while navigating */}
        {isNavigating && (
          <div className="absolute inset-0 z-[600] flex items-center justify-center bg-black/10">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent border-white/90" />
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-b border-green-700/30 shadow-xl">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 px-4 py-[20px] sm:px-6 sm:py-[26px] lg:px-10 lg:py-[32px]">
            <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ring-1 ring-white/30 backdrop-blur-sm">
              <img
                src={data?.image?.url ? data.image.url : '/brgy talipapa.png'}
                alt="Barangay Talipapa Logo"
                className="w-8 h-8 sm:w-11 sm:h-11 object-contain"
              />
            </div>
            <div className="flex-shrink-0">
              <h1 className="text-white font-black text-base sm:text-[18px] whitespace-nowrap leading-tight">
                Barangay Talipapa Admin
              </h1>
              <p className="text-green-200 text-xs font-medium">
                Content Management System
              </p>
            </div>
          </div>

          {/* RBAC: User Role Badge */}
          <div className="px-4 pb-3">
            <div
              className={cn(
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border',
                userRoleBadgeColor
                  .replace('bg-', 'bg-opacity-20 bg-')
                  .replace('text-', 'text-white border-')
              )}
            >
              <Shield className="w-3 h-3 mr-1.5" />
              {userRoleDisplay}
            </div>
          </div>
        </div>

        {/* Navigation Items - RBAC Filtered */}
        <nav className="flex-1 px-3 sm:px-4 py-3 sm:py-5 space-y-1.5 sm:space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-transparent">
          {accessibleMenuItems.map((item, index) => (
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

              {/* Submenu - RBAC Filtered */}
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
                        onClick={() => {
                          setIsNavigating(true);
                          try {
                            navigate(subItem.href!);
                            if (onClose && isMobileViewport()) onClose();
                          } finally {
                            setTimeout(() => setIsNavigating(false), 600);
                          }
                        }}
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

export default MenuBarWithRBAC;
