"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { getCurrentUser } from "@/services/api";

// ======================================
// Types
// ======================================

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  dateOfBirth?: string | null;
  district?: string;
  state?: string;
  country?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (jwtToken: string) => Promise<void>;
  updateUser: (updatedUser: User) => void;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

// ======================================
// Normalize User
// ======================================

function normalizeUser(
  user: any
): User {
  return {
    id: String(
      user?.id ??
        user?._id ??
        ""
    ),

    name: user?.name ?? "",

    email: user?.email ?? "",

    mobile: user?.mobile ?? "",

    role: user?.role ?? "user",

    dateOfBirth:
      user?.dateOfBirth ?? null,

    district: user?.district ?? "",

    state: user?.state ?? "",

    country: user?.country || "India",
  };
}

// ======================================
// Provider
// ======================================

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  // ======================================
  // Restore Existing Login on Mount
  // ======================================

  useEffect(() => {
    async function restoreSession() {
      const storedToken =
        localStorage.getItem(
          "silkverse-token"
        );

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const currentUser =
          await getCurrentUser(
            storedToken
          );

        const normalizedUser =
          normalizeUser(
            currentUser
          );

        if (!normalizedUser.id) {
          throw new Error(
            "User ID was not returned by the server."
          );
        }

        setToken(storedToken);
        setUser(normalizedUser);
      } catch {
        // Stored token is invalid or expired. Silently clean up stale credentials.
        localStorage.removeItem(
          "silkverse-token"
        );
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  // ======================================
  // Active User Login
  // ======================================

  async function login(
    jwtToken: string
  ) {
    try {
      setLoading(true);

      const currentUser =
        await getCurrentUser(
          jwtToken
        );

      const normalizedUser =
        normalizeUser(
          currentUser
        );

      if (!normalizedUser.id) {
        throw new Error(
          "User ID was not returned by the server."
        );
      }

      localStorage.setItem(
        "silkverse-token",
        jwtToken
      );

      setToken(jwtToken);
      setUser(
        normalizedUser
      );
    } catch (error) {
      localStorage.removeItem(
        "silkverse-token"
      );

      setUser(null);
      setToken(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // ======================================
  // Update User
  // ======================================

  function updateUser(
    updatedUser: User
  ) {
    setUser(
      normalizeUser(
        updatedUser
      )
    );
  }

  // ======================================
  // Logout
  // ======================================

  function logout() {
    localStorage.removeItem(
      "silkverse-token"
    );

    setUser(null);
    setToken(null);

    window.location.href = "/";
  }

  // ======================================
  // Provider
  // ======================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ======================================
// useAuth Hook
// ======================================

export function useAuth() {
  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}