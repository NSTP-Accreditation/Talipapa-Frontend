import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface UserData {
  username: String;
}

interface User {
  userData: UserData;
  accessToken: String;
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
  const [loading, setLoading] = useState(false);

  // Check authentication status on mount
  // useEffect(() => {
  //   const checkAuthStatus = () => {
  //     try {
  //       const authStatus = localStorage.getItem('isAdminAuthenticated');
  //       const userData = localStorage.getItem('adminUser');

  //       if (authStatus === 'true' && userData) {
  //         const parsedUser = JSON.parse(userData);
  //         setIsAuthenticated(true);
  //         setUser(parsedUser);
  //       }
  //     } catch (error) {
  //       console.error('Error checking auth status:', error);
  //       // Clear invalid data
  //       localStorage.removeItem('isAdminAuthenticated');
  //       localStorage.removeItem('adminUser');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   checkAuthStatus();
  // }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
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
        throw new Error(data.message);
      }

      setUser(data);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
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

      setUser(data);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${apiURL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.log(error);
    } finally {
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
