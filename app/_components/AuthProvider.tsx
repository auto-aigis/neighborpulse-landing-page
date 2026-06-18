"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../_lib/types";
import { authApi } from "../_lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const u = await authApi.me();
      setUser(u);
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {}
    setUser(null);
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
