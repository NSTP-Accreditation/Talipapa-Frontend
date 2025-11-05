import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

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

        console.log('=== 🔍 AUTH DEBUG ===');
        console.log('API URL:', apiURL);
        console.log('Is Authenticated:', isAuthenticated);
        console.log('User in state:', user ? '✅ Yes' : '❌ No');
        console.log('Token in localStorage:', token ? '✅ Yes' : '❌ No');
        console.log('User in localStorage:', storedUser ? '✅ Yes' : '❌ No');

        if (token) {
          console.log('Token type:', typeof token);
          console.log('Token length:', token.length);
          console.log('Token preview:', token.substring(0, 50) + '...');
          console.log(
            'Token parts:',
            token.split('.').length,
            '(should be 3 for JWT)'
          );
        } else {
          console.log('❌ NO TOKEN FOUND');
        }

        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            console.log('Stored user data:', parsed);
          } catch (e) {
            console.error('❌ Failed to parse stored user:', e);
          }
        }

        if (user) {
          console.log('Current user state:', {
            username: user.userData?.username,
            roles: user.userData?.roles,
            hasToken: !!user.accessToken,
            tokenLength: user.accessToken?.length,
          });
        }

        console.log('==================');
        console.log('💡 To test a request with token:');
        console.log(
          `fetch('${apiURL}/api/users', { headers: { 'Authorization': 'Bearer ${token?.substring(0, 20)}...' } })`
        );
      };

      console.log(
        '💡 Debug helper available: Call window.debugAuth() in console'
      );
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
          console.log('✅ Auth restored from localStorage');
        } else {
          // No auth found - explicitly set not authenticated
          setIsAuthenticated(false);
          setUser(null);
          console.log('⚠️ No stored auth found - user needs to login');
        }
      } catch (error) {
        console.error('❌ Error restoring auth:', error);
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
      console.log('🔐 Attempting login...');

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
        console.error('❌ Login failed:', data.message);
        throw new Error(data.message);
      }

      // ✅ CRITICAL: Store both token and user data
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        console.log('✅ Token saved to localStorage');
        console.log('📊 Token length:', data.accessToken.length);
        console.log(
          '📊 Token preview:',
          data.accessToken.substring(0, 50) + '...'
        );
      } else {
        console.error('❌ No accessToken in response!');
      }

      // Store user data (without token to avoid duplication)
      const userDataToStore = {
        userData: data.userData,
      };
      localStorage.setItem('adminUser', JSON.stringify(userDataToStore));
      console.log('✅ User data saved to localStorage');

      // Set state with full user object including token
      setUser(data);
      setIsAuthenticated(true);
      console.log('✅ Login successful!');

      return true;
    } catch (error) {
      console.error('❌ Login error:', error);
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
      console.log('🔄 Refreshing token...');

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

      // ✅ Update stored token
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        console.log('✅ Token refreshed and saved');
      }

      // Update user data
      const userDataToStore = {
        userData: data.userData,
      };
      localStorage.setItem('adminUser', JSON.stringify(userDataToStore));

      setUser(data);
      console.log('✅ Token refresh successful');

      return data;
    } catch (error: any) {
      console.error('❌ Token refresh failed:', error);
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
      console.log('👋 Logging out...');

      await fetch(`${apiURL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      console.log('✅ Logout request sent');
    } catch (error: any) {
      console.error('⚠️ Logout request failed (continuing anyway):', error);
    } finally {
      // ✅ CRITICAL: Clear all stored auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('adminUser');
      console.log('✅ Auth data cleared from localStorage');

      setUser(null);
      setIsAuthenticated(false);
      console.log('✅ Logout complete');
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
