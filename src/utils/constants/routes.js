// API Routes
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
  },
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id) => `/products/${id}`,
    SEARCH: '/products/search',
  },
};

// App Routes
export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id) => `/products/${id}`,
  // Admin Routes
  ADMIN: {
    BASE: '/admin',
    DASHBOARD: '/admin/dashboard',
    ABOUT: '/admin/about',
    SERVICES: '/admin/services',
    RESOURCES: '/admin/resources',
    TRADING: '/admin/trading',
    NEWS: '/admin/news',
    USERS: '/admin/users',
    NOTIFICATIONS: '/admin/notifications',
    SETTINGS: '/admin/settings',
  },
};
