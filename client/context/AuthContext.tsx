"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@/types";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  loginWithGoogle: (payload: {
    credential: string;
    profile: Record<string, unknown>;
  }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "careerpilot_token";
const USER_KEY = "careerpilot_user";

function readStoredUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

function clearStoredSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = readStoredUser();

        if (!mounted) {
          return;
        }

        setToken(storedToken);
        setUser(storedUser);

        if (storedToken && !storedUser) {
          try {
            const { api } = await import("@/lib/api");
            const profile = await api.auth.me(storedToken);
            if (!mounted) {
              return;
            }

            setUser(profile);
            localStorage.setItem(USER_KEY, JSON.stringify(profile));
          } catch {
            // Keep token-based session to avoid forcing re-login on temporary API failures.
            if (!mounted) {
              return;
            }
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const loginWithGoogle = useCallback(
    async (payload: { credential: string; profile: Record<string, unknown> }) => {
      const { api } = await import("@/lib/api");
      const result = await api.auth.google(payload);
      setToken(result.token);
      setUser(result.user);
      localStorage.setItem(TOKEN_KEY, result.token);
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    },
    []
  );

  const logout = useCallback(() => {
    clearStoredSession();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      loginWithGoogle,
      logout,
    }),
    [user, token, loading, loginWithGoogle, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
