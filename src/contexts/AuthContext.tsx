import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { logger } from '@/utils/logger';

interface UserData {
  username: string;
  roles?: {
    SuperAdmin?: number;
    Admin?: number;
    Staff?: number;
  };
  rolesKeys?: string[];
}

interface User {
  userData: UserData;
  accessToken: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  refreshToken: () => Promise<User | null>;
  logout: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const apiURL = import.meta.env.VITE_API_URL;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Debug helper - available in console as window.debugAuth()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).debugAuth = () => {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('adminUser');

        logger.group('🔍 AUTH DEBUG');
        logger.debug('API URL:', apiURL);
        logger.debug('Is Authenticated:', isAuthenticated);
        logger.debug('User in state:', user ? '✅ Yes' : '❌ No');
        logger.debug('Token in localStorage:', token ? '✅ Yes' : '❌ No');
        logger.debug('User in localStorage:', storedUser ? '✅ Yes' : '❌ No');

        if (token) {
          logger.debug('Token type:', typeof token);
          logger.debug('Token length:', token.length);
          logger.debug('Token preview:', token.substring(0, 50) + '...');
          logger.debug(
            'Token parts:',
            token.split('.').length,
            '(should be 3 for JWT)'
          );
        } else {
          logger.debug('❌ NO TOKEN FOUND');
        }

        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            logger.debug('Stored user data:', parsed);
          } catch (e) {
            logger.error('❌ Failed to parse stored user:', e);
          }
        }

        if (user) {
          logger.debug('Current user state:', {
            username: user.userData?.username,
            roles: user.userData?.roles,
            hasToken: !!user.accessToken,
            tokenLength: user.accessToken?.length,
          });
        }

        logger.debug('💡 To test a request with token:');
        logger.debug(
          `fetch('${apiURL}/api/users', { headers: { 'Authorization': 'Bearer ${token?.substring(0, 20)}...' } })`
        );
        logger.groupEnd();
      };

      // Debug helper available in development mode only
      if (process.env.NODE_ENV === 'development') {
        logger.info('Debug helper: window.debugAuth()');
      }
    }
  }, [apiURL, isAuthenticated, user]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('adminUser');
        const accessToken = localStorage.getItem('accessToken');

        if (storedUser && accessToken) {
          const parsedUser = JSON.parse(storedUser);
          // Reconstruct user object with token from localStorage
          const userWithToken: User = {
            ...parsedUser,
            accessToken: accessToken,
          };
          setIsAuthenticated(true);
          setUser(userWithToken);
        } else {
          // No auth found - explicitly set not authenticated
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('adminUser');
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${apiURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store both token and user data
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      } else {
        throw new Error('No access token received');
      }

      // Store user data (without token to avoid duplication)
      const userDataToStore = {
        userData: data.userData,
      };
      localStorage.setItem('adminUser', JSON.stringify(userDataToStore));

      // Set state with full user object including token
      setUser(data);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      // Clear any partial data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('adminUser');
      return false;
    }
  };

  const refreshToken = async (): Promise<User | null> => {
    try {
      const response = await fetch(`${apiURL}/auth/refreshToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data: User = await response.json();

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      // Update stored token
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }

      // Update user data
      const userDataToStore = {
        userData: data.userData,
      };
      localStorage.setItem('adminUser', JSON.stringify(userDataToStore));

      setUser(data);

      return data;
    } catch (error: any) {
      // Clear invalid tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('adminUser');
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${apiURL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error: any) {
      // Silent failure - continue with logout
    } finally {
      // Clear all stored auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('adminUser');

      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    refreshToken,
    logout,
    loading,
    setLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
