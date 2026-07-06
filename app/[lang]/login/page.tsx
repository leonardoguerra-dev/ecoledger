"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  EmailOutlined,
  Autorenew as AutoIcon,
} from "@mui/icons-material";
import { useAuth, DEMO_CREDENTIALS } from "@/context/AuthContext";

// Minimal localization dictionary for the login module
const loginTranslations: Record<string, Record<string, string>> = {
  en: {
    title: "Enterprise Access",
    subtitle: "Sign in to unlock predictive sandbox and plant analytics",
    emailLabel: "Corporate Email Address",
    passwordLabel: "Password",
    submitButton: "Authorize Session",
    demoBoxTitle: "Sandbox Demo Account",
    demoBoxDesc: "Click to auto-fill verified enterprise test credentials.",
    loading: "Verifying credentials...",
  },
  it: {
    title: "Accesso Enterprise",
    subtitle:
      "Accedi per sbloccare la sandbox predittiva e le analisi delle filiali",
    emailLabel: "Indirizzo Email Aziendale",
    passwordLabel: "Password",
    submitButton: "Autorizza Sessione",
    demoBoxTitle: "Account Demo Sandbox",
    demoBoxDesc:
      "Clicca per precompilare le credenziali enterprise verificate.",
    loading: "Verifica credenziali in corso...",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const { login, isLoading, authError } = useAuth();

  const lang = (params?.lang as string) || "en";
  const t = loginTranslations[lang] || loginTranslations.en;

  // Form states initialized as empty to demonstrate manual or auto-fill capabilities
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Helper to construct native localized redirection URLs
  const getLocalizedRedirect = (path: string) => {
    return `/${lang}${path === "/" ? "" : path}`;
  };

  const handleAutoFill = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      // Direct redirect back to dashboard where the incremental premium fetch will fire
      router.push(getLocalizedRedirect("/"));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
        p: 2,
      }}
    >
      <Card
        sx={{ maxWidth: 450, width: "100%", boxShadow: 4, borderRadius: 3 }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header Section */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              {t.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t.subtitle}
            </Typography>
          </Box>

          {/* Error Message Display */}
          {authError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {authError}
            </Alert>
          )}

          {/* Login Credentials Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t.emailLabel}
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              /* Moving interface adjustments into the standardized slotProps wrapper */
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t.passwordLabel}
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              /* Merging start and end adornments within the standardized client input slot */
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading || !email || !password}
              sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 600 }}
            >
              {isLoading ? t.loading : t.submitButton}
            </Button>
          </Box>

          {/* Interactive Demo Auto-fill Helper Panel */}
          <Paper
            variant="outlined"
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: "background.default",
              borderStyle: "dashed",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="subtitle2"
              color="primary"
              sx={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              🔑 {t.demoBoxTitle}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              component="p"
              sx={{ mb: 1.5 }}
            >
              {t.demoBoxDesc}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              fullWidth
              startIcon={<AutoIcon />}
              onClick={handleAutoFill}
              disabled={isLoading}
            >
              Auto-Fill Credentials
            </Button>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
}
