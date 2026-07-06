"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getEnterpriseTheme } from "@/theme/theme";

interface ColorModeContextType {
  mode: "light" | "dark";
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType>({
  mode: "light",
  toggleColorMode: () => {},
});

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Wrap inside an isolated execution container to push state changes outside the layout pipeline
    const initializeThemeMode = () => {
      try {
        const savedMode = localStorage.getItem("ecoledger_theme_mode") as
          | "light"
          | "dark";
        if (savedMode) {
          setMode(savedMode);
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          setMode("dark");
        }
      } catch (error) {
        console.error("Failed to restore color mode configuration:", error);
      }
    };

    initializeThemeMode();
  }, []);

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("ecoledger_theme_mode", newMode);
      return newMode;
    });
  };

  const theme = useMemo(() => getEnterpriseTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);
