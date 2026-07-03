"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider, createTheme, PaletteMode } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ColorModeContext } from "../context/ColorModeContext";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Set the default mode to 'dark'
  const [mode, setMode] = React.useState<PaletteMode>("dark");

  // Provide the toggle function to the rest of the app
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [],
  );

  // Generate the responsive and accessible theme configuration dynamically based on the current mode
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "dark" ? "#81c784" : "#2e7d32", // Brighter green for dark mode accessibility
            light: "#a2cfac",
            dark: "#005005",
            contrastText: mode === "dark" ? "#121212" : "#ffffff",
          },
          secondary: {
            main: "#00a152",
            contrastText: "#ffffff",
          },
          background: {
            default: mode === "dark" ? "#121212" : "#f8f9fa", // Deep charcoal/black for dark mode
            paper: mode === "dark" ? "#1e1e1e" : "#ffffff", // Muted gray for cards in dark mode
          },
          text: {
            primary: mode === "dark" ? "#ffffff" : "#1a1a1a",
            secondary: mode === "dark" ? "#b0bec5" : "#666666",
          },
        },
        typography: {
          fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
          ].join(","),
          h1: { fontWeight: 700 },
          h4: { fontWeight: 600 },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: "none",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline resets styling and forces background-color changes based on the theme mode */}
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </ColorModeContext.Provider>
  );
}
