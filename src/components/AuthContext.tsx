import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface User {
  username: string;
  loginTime: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const authStatus = localStorage.getItem('isAdminAuthenticated');
        const userData = localStorage.getItem('adminUser');

        if (authStatus === 'true' && userData) {
          const parsedUser = JSON.parse(userData);
          setIsAuthenticated(true);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear invalid data
        localStorage.removeItem('isAdminAuthenticated');
        localStorage.removeItem('adminUser');
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, accept specific credentials
      // In a real app, you'd validate against your backend
      if (username === 'admin' && password === 'admin123') {
        const userData: User = {
          username,
          loginTime: new Date().toISOString(),
        };

        localStorage.setItem('isAdminAuthenticated', 'true');
        localStorage.setItem('adminUser', JSON.stringify(userData));

        setIsAuthenticated(true);
        setUser(userData);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
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
