"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContextType, LoginCredentials } from "@/types/auth";

export const DEMO_CREDENTIALS: LoginCredentials = {
  email: "admin@ecoledger.com",
  password: "password123",
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // States start with safe server-side defaults to guarantee flawless HTML hydration matching
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // This execution context runs strictly on the client after the visual DOM paint completes
    const checkSession = async () => {
      try {
        const token = localStorage.getItem("ecoledger_demo_token");
        if (token === "mock-jwt-token-xyz") {
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Safe fallback in case browser security sandboxing rejects localStorage access
        console.error("Session restoration failed:", error);
      } finally {
        // Enforce state transition safety by decoupling the update from the synchronous rendering block
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (
      credentials.email === DEMO_CREDENTIALS.email &&
      credentials.password === DEMO_CREDENTIALS.password
    ) {
      localStorage.setItem("ecoledger_demo_token", "mock-jwt-token-xyz");
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    } else {
      setAuthError(
        "Invalid enterprise credentials. Use the pre-filled demo account.",
      );
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("ecoledger_demo_token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, authError, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
