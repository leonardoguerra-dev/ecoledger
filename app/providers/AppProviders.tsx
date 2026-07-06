"use client";

import React from "react";
import { ColorModeProvider } from "@/context/ColorModeContext";
import { AuthProvider } from "@/context/AuthContext";
import { EnergyProvider } from "@/context/EnergyContext";

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Centralized Client-Side Providers Boundary.
 * Wraps the application with necessary contexts ensuring correct dependency nesting.
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ColorModeProvider>
      <AuthProvider>
        <EnergyProvider>
          {/* Future Language/i18n provider will be injected here if needed */}
          {children}
        </EnergyProvider>
      </AuthProvider>
    </ColorModeProvider>
  );
};
