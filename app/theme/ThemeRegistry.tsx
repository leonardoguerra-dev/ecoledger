"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Memoize the theme creation to prevent unnecessary re-renders and functions leakage
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          primary: {
            main: "#1976d2",
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
        },
      }),
    [],
  );

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
