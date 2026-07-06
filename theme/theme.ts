import { createTheme } from "@mui/material/styles";

export const getEnterpriseTheme = (mode: "light" | "dark") => {
  return createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // Light mode corporate color mappings
            primary: {
              main: "#1976d2",
              light: "#42a5f5",
              dark: "#1565c0",
            },
            background: {
              default: "#f8f9fa",
              paper: "#ffffff",
            },
            text: {
              primary: "#1e293b",   // Deep slate gray for high readability
              secondary: "#64748b", // Muted slate for secondary helper strings
              disabled: "#94a3b8",
            },
          }
        : {
            // Dark mode carbon-dashboard color mappings
            primary: {
              main: "#90caf9",
              light: "#e3f2fd",
              dark: "#42a5f5",
            },
            background: {
              default: "#0f172a", // Dark slate background matching premium telemetry aesthetics
              paper: "#1e293b",   // Slightly lighter container fill for cards and dialogs
            },
            text: {
              primary: "#f8fafc",   // Off-white to prevent heavy screen glare
              secondary: "#94a3b8", // Muted gray-blue for secondary text blocks
              disabled: "#64748b",
            },
          }),
    },
    typography: {
      // Forcing the structural geometric font stack across the enterprise layouts
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      // Optional: enforce layout baseline defaults dynamically across components
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            h1: "h1",
            h2: "h2",
            h3: "h3",
            h4: "h4",
            h5: "h5",
            h6: "h6",
            subtitle1: "h6",
            subtitle2: "h6",
            body1: "p",
            body2: "p",
          },
        },
      },
    },
  });
};