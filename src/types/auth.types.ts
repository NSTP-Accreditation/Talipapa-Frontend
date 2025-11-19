/**
 * Authentication and User Type Definitions
 *
 * These types define the structure of user data and authentication state
 * used throughout the application.
 */

/**
 * Role structure as stored in the database
 * Each role is represented by its ID from environment variables
 */
export interface UserRoles {
  SuperAdmin?: number;
  Admin?: number;
}

/**
 * User data structure returned from the backend
 */
export interface UserData {
  username: string;
  email?: string;
  contactNumber?: string;
  roles?: UserRoles;
  rolesKeys?: string[]; // Array of role labels like ['SuperAdmin', 'Admin']
}

/**
 * Authenticated user object
 */
export interface AuthUser {
  userData: UserData;
  accessToken: string;
}

/**
 * JWT Token Payload Structure
 */
export interface JWTPayload {
  userInfo: {
    username: string;
    roles: number[]; // Array of role IDs
  };
  iat?: number; // Issued at timestamp
  exp?: number; // Expiration timestamp
}

/**
 * Authentication context type
 */
export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  refreshToken: () => Promise<AuthUser | null>;
  logout: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
