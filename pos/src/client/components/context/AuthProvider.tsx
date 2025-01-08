import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import api from '../../api'; // Your global axios instance

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  token?: string;
  refreshToken?: string;
}

interface AuthContextProps {
  user: User | null;
  signup: (data: Omit<User, '_id' | 'token' | 'refreshToken'>, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAuthToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // For handling initial load state

  // --------------------------------------------
  // 1) Signup User
  // --------------------------------------------
  const signup = useCallback(
    async (data: Omit<User, '_id' | 'token' | 'refreshToken'>, password: string) => {
      try {
        const response = await api.post('/auth/signup', { ...data, password });
        console.log('User registered successfully:', response.data);
      } catch (error) {
        console.error('Error during signup:', error);
        throw error;
      }
    },
    []
  );

  // --------------------------------------------
  // 2) Login User
  // --------------------------------------------
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await api.post('/auth/login', { email, password });
        const { token, refreshToken, ...userData } = response.data;
        setUser({ ...userData, token, refreshToken });
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        console.log('User logged in successfully:', userData);
      } catch (error) {
        console.error('Error during login:', error);
        throw error;
      }
    },
    []
  );

  // --------------------------------------------
  // 3) Logout User
  // --------------------------------------------
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    console.log('User logged out successfully');
  }, []);

  // --------------------------------------------
  // 4) Refresh Auth Token
  // --------------------------------------------
  const refreshAuthToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        logout();
        return;
      }

      const response = await api.post('/auth/refresh-token', { refreshToken });
      const { token } = response.data;
      setUser((prevUser) => (prevUser ? { ...prevUser, token } : null));
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  }, [logout]);

  // --------------------------------------------
  // 5) Fetch User Details on App Load
  // --------------------------------------------
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/user-details', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details on app load:', error);
        await refreshAuthToken(); // Attempt to refresh token
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [refreshAuthToken]);

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, refreshAuthToken }}>
      {!isLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

// Custom Hook for consuming the Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
