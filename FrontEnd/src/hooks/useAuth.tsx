import { createContext, useContext, useEffect, useState } from "react";
import { AuthResponse, UserDto, loginRequest } from "@/lib/api";

interface AuthContextValue {
  user: UserDto | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "uniportal_auth";

function loadStoredAuth(): { accessToken: string; user: UserDto } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = loadStoredAuth();
    if (stored) {
      setUser(stored.user);
      setAccessToken(stored.accessToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("[Auth] Attempting login for:", email);
      const resp: AuthResponse = await loginRequest(email, password);
      console.log("[Auth] Login response received:", resp);
      
      if (!resp || !resp.accessToken || !resp.user) {
        throw new Error("Réponse invalide du serveur");
      }
      
      setUser(resp.user);
      setAccessToken(resp.accessToken);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ accessToken: resp.accessToken, user: resp.user })
      );
      console.log("[Auth] Login successful, user:", resp.user.username);
    } catch (error) {
      console.error("[Auth] Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};


