import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import * as authAPI from '@/lib/api/auth';

interface AuthContextType {
  user: authAPI.User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<authAPI.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = authAPI.getStoredUser();
      const token = authAPI.getStoredToken();

      if (storedUser && token) {
        try {
          // Verify token is still valid
          const freshUser = await authAPI.getMe();
          setUser(freshUser);
        } catch {
          // Token invalid, clear auth
          authAPI.clearAuth();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    setUser(response.user);
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    const response = await authAPI.register({ email, password, name });
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    await authAPI.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const freshUser = await authAPI.getMe();
      setUser(freshUser);
    } catch {
      // Ignore errors
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
