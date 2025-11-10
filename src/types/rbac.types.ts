/**
 * Role-Based Access Control (RBAC) Type Definitions
 *
 * This file defines the core types for the RBAC system.
 * Roles are hierarchical: SuperAdmin > Admin
 */

/**
 * Available user roles in the system
 * - SUPERADMIN: Full system access, can manage all users and settings
 * - ADMIN: Limited system access, cannot manage admin accounts
 */
export enum UserRole {
  SUPERADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
}

/**
 * Permission types that can be granted to roles
 */
export enum Permission {
  // User Management
  VIEW_USERS = 'view_users',
  CREATE_USERS = 'create_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',

  // Admin Management (SuperAdmin only)
  VIEW_ADMINS = 'view_admins',
  CREATE_ADMINS = 'create_admins',
  EDIT_ADMINS = 'edit_admins',
  DELETE_ADMINS = 'delete_admins',

  // Content Management
  VIEW_CONTENT = 'view_content',
  CREATE_CONTENT = 'create_content',
  EDIT_CONTENT = 'edit_content',
  DELETE_CONTENT = 'delete_content',

  // Settings
  VIEW_SETTINGS = 'view_settings',
  EDIT_SETTINGS = 'edit_settings',

  // Reports & Analytics
  VIEW_REPORTS = 'view_reports',
  EXPORT_DATA = 'export_data',

  // Activity Logs
  VIEW_ACTIVITY_LOGS = 'view_activity_logs',

  // Trading Operations
  VIEW_TRADING = 'view_trading',
  MANAGE_TRADING = 'manage_trading',

  // Inventory Management
  VIEW_INVENTORY = 'view_inventory',
  MANAGE_INVENTORY = 'manage_inventory',

  // Records Management
  VIEW_RECORDS = 'view_records',
  MANAGE_RECORDS = 'manage_records',

  // News & Events
  VIEW_NEWS = 'view_news',
  MANAGE_NEWS = 'manage_news',

  // Guidelines
  VIEW_GUIDELINES = 'view_guidelines',
  MANAGE_GUIDELINES = 'manage_guidelines',

  // Green Pages
  VIEW_GREEN_PAGES = 'view_green_pages',
  MANAGE_GREEN_PAGES = 'manage_green_pages',

  // Farm Inventory
  VIEW_FARM_INVENTORY = 'view_farm_inventory',
  MANAGE_FARM_INVENTORY = 'manage_farm_inventory',

  // Achievements
  VIEW_ACHIEVEMENTS = 'view_achievements',
  MANAGE_ACHIEVEMENTS = 'manage_achievements',
}

/**
 * Role permission mapping
 * Defines which permissions each role has
 *
 * Updated Access Rules:
 * - SuperAdmin: Full access to everything
 * - Admin:
 *   - Home Editables ONLY: FULL ACCESS (Guidelines, News, Carousel, About Us, Achievements, Talipapa Natin)
 *   - All other sections: NO ACCESS (including Dashboard)
 *
 * To add new permissions:
 * 1. Add the permission to the Permission enum above
 * 2. Add it to the appropriate role(s) below
 * 3. Use hasPermission() or hasAnyPermission() in your components
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPERADMIN]: [
    // SuperAdmin has ALL permissions
    ...Object.values(Permission),
  ],

  [UserRole.ADMIN]: [
    // Home Editables - FULL ACCESS
    Permission.VIEW_CONTENT,
    Permission.CREATE_CONTENT,
    Permission.EDIT_CONTENT,
    Permission.DELETE_CONTENT,

    // Guidelines - FULL ACCESS
    Permission.VIEW_GUIDELINES,
    Permission.MANAGE_GUIDELINES,

    // News & Events - FULL ACCESS
    Permission.VIEW_NEWS,
    Permission.MANAGE_NEWS,

    // Achievements - FULL ACCESS
    Permission.VIEW_ACHIEVEMENTS,
    Permission.MANAGE_ACHIEVEMENTS,

    // Dashboard: NO ACCESS (removed VIEW_REPORTS)
  ],
};

/**
 * Route access configuration
 * Maps routes to required permissions
 *
 * To add route protection:
 * 1. Add your route path as a key
 * 2. Specify required permission(s) or role(s)
 * 3. Use ProtectedRoute or RoleBasedRoute component
 */
export interface RouteAccess {
  path: string;
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
  allowedRoles?: UserRole[]; // Alternative to permissions
}

/**
 * Component visibility configuration
 * Used for conditional rendering of UI elements
 */
export interface ComponentAccess {
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
  requireAll?: boolean; // If true, user must have ALL permissions/roles
}

/**
 * Permission Hierarchy System
 * Higher-level permissions automatically grant lower-level permissions
 *
 * Example: If you have DELETE_USERS, you automatically have EDIT_USERS and VIEW_USERS
 * This prevents repetitive permission checks and ensures logical access control
 */
export const PERMISSION_HIERARCHY: Record<Permission, Permission[]> = {
  // User Management Hierarchy
  [Permission.DELETE_USERS]: [
    Permission.DELETE_USERS,
    Permission.EDIT_USERS,
    Permission.VIEW_USERS,
  ],
  [Permission.EDIT_USERS]: [Permission.EDIT_USERS, Permission.VIEW_USERS],
  [Permission.VIEW_USERS]: [Permission.VIEW_USERS],
  [Permission.CREATE_USERS]: [Permission.CREATE_USERS, Permission.VIEW_USERS],

  // Admin Management Hierarchy
  [Permission.DELETE_ADMINS]: [
    Permission.DELETE_ADMINS,
    Permission.EDIT_ADMINS,
    Permission.VIEW_ADMINS,
  ],
  [Permission.EDIT_ADMINS]: [Permission.EDIT_ADMINS, Permission.VIEW_ADMINS],
  [Permission.VIEW_ADMINS]: [Permission.VIEW_ADMINS],
  [Permission.CREATE_ADMINS]: [
    Permission.CREATE_ADMINS,
    Permission.VIEW_ADMINS,
  ],

  // Content Management Hierarchy
  [Permission.DELETE_CONTENT]: [
    Permission.DELETE_CONTENT,
    Permission.EDIT_CONTENT,
    Permission.VIEW_CONTENT,
  ],
  [Permission.EDIT_CONTENT]: [Permission.EDIT_CONTENT, Permission.VIEW_CONTENT],
  [Permission.VIEW_CONTENT]: [Permission.VIEW_CONTENT],
  [Permission.CREATE_CONTENT]: [
    Permission.CREATE_CONTENT,
    Permission.VIEW_CONTENT,
  ],

  // Settings Hierarchy
  [Permission.EDIT_SETTINGS]: [
    Permission.EDIT_SETTINGS,
    Permission.VIEW_SETTINGS,
  ],
  [Permission.VIEW_SETTINGS]: [Permission.VIEW_SETTINGS],

  // Reports & Analytics Hierarchy
  [Permission.EXPORT_DATA]: [Permission.EXPORT_DATA, Permission.VIEW_REPORTS],
  [Permission.VIEW_REPORTS]: [Permission.VIEW_REPORTS],

  // Activity Logs Hierarchy
  [Permission.VIEW_ACTIVITY_LOGS]: [Permission.VIEW_ACTIVITY_LOGS],

  // Trading Hierarchy
  [Permission.MANAGE_TRADING]: [
    Permission.MANAGE_TRADING,
    Permission.VIEW_TRADING,
  ],
  [Permission.VIEW_TRADING]: [Permission.VIEW_TRADING],

  // Inventory Hierarchy
  [Permission.MANAGE_INVENTORY]: [
    Permission.MANAGE_INVENTORY,
    Permission.VIEW_INVENTORY,
  ],
  [Permission.VIEW_INVENTORY]: [Permission.VIEW_INVENTORY],

  // Records Hierarchy
  [Permission.MANAGE_RECORDS]: [
    Permission.MANAGE_RECORDS,
    Permission.VIEW_RECORDS,
  ],
  [Permission.VIEW_RECORDS]: [Permission.VIEW_RECORDS],

  // News Hierarchy
  [Permission.MANAGE_NEWS]: [Permission.MANAGE_NEWS, Permission.VIEW_NEWS],
  [Permission.VIEW_NEWS]: [Permission.VIEW_NEWS],

  // Guidelines Hierarchy
  [Permission.MANAGE_GUIDELINES]: [
    Permission.MANAGE_GUIDELINES,
    Permission.VIEW_GUIDELINES,
  ],
  [Permission.VIEW_GUIDELINES]: [Permission.VIEW_GUIDELINES],

  // Green Pages Hierarchy
  [Permission.MANAGE_GREEN_PAGES]: [
    Permission.MANAGE_GREEN_PAGES,
    Permission.VIEW_GREEN_PAGES,
  ],
  [Permission.VIEW_GREEN_PAGES]: [Permission.VIEW_GREEN_PAGES],

  // Farm Inventory Hierarchy
  [Permission.MANAGE_FARM_INVENTORY]: [
    Permission.MANAGE_FARM_INVENTORY,
    Permission.VIEW_FARM_INVENTORY,
  ],
  [Permission.VIEW_FARM_INVENTORY]: [Permission.VIEW_FARM_INVENTORY],

  // Achievements Hierarchy
  [Permission.MANAGE_ACHIEVEMENTS]: [
    Permission.MANAGE_ACHIEVEMENTS,
    Permission.VIEW_ACHIEVEMENTS,
  ],
  [Permission.VIEW_ACHIEVEMENTS]: [Permission.VIEW_ACHIEVEMENTS],
};
