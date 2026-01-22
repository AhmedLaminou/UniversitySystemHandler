import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { api } from '../services/api';
import { useRouter, useSegments } from 'expo-router';

interface AuthContextType {
  user: any;
  token: string | null;
  isLoading: boolean;
  signIn: (token: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Check for stored token on mount
    const loadStorageData = async () => {
      try {
        const storedToken = await storage.getToken();
        const storedUser = await storage.getUser();
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
          // Optional: Verify token validity with API here
        }
      } catch (e) {
        console.error('Failed to load auth data', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const signIn = async (newToken: string, userData: any) => {
    try {
      setToken(newToken);
      setUser(userData);
      await storage.saveToken(newToken);
      await storage.saveUser(userData);
    } catch (e) {
      console.error('Sign in failed', e);
    }
  };

  const signOut = async () => {
    try {
      setToken(null);
      setUser(null);
      await storage.clearAll();
      router.replace('/(auth)/login');
    } catch (e) {
      console.error('Sign out failed', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
