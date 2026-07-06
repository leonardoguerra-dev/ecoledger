"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Chip,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ReceiptLong as ReceiptLongIcon,
  NaturePeople as EcoIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { useColorMode } from "@/context/ColorModeContext";
import { useAuth } from "@/context/AuthContext";
import { useEnergy } from "@/context/EnergyContext";

const drawerWidth = 240;

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { mode, toggleColorMode } = useColorMode();
  const { isAuthenticated, logout } = useAuth();
  const { isPremiumLoading, t: globalDict } = useEnergy();

  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const t = globalDict?.layout;

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const localizePath = (path: string) => {
    const cleanPath = path === "/" ? "" : path;
    return `/${lang}${cleanPath}`;
  };

  const handleLanguageChange = (newLang: string | null) => {
    if (!newLang || newLang === lang || !pathname) return;

    const segments = pathname.split("/");
    segments[1] = newLang;
    const newPath = segments.join("/");

    router.push(newPath);
  };

  if (!t) return null;

  const navigationItems = [
    { text: t.dashboard, icon: <DashboardIcon />, href: "/" },
    { text: t.transitions, icon: <ReceiptLongIcon />, href: "/transitions" },
    { text: t.ecoImpact, icon: <EcoIcon />, href: "/eco-impact" },
  ];

  const themeToggleButton = (
    <IconButton
      onClick={toggleColorMode}
      color="inherit"
      aria-label={mode === "dark" ? t.ariaLightMode : t.ariaDarkMode}
    >
      {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );

  const languageSelector = (
    <ToggleButtonGroup
      value={lang}
      exclusive
      onChange={(_, value) => handleLanguageChange(value)}
      size="small"
      aria-label={t.ariaLangSelector}
      sx={{
        bgcolor: "background.paper",
        border: `1px solid ${theme.palette.divider}`,
        "& .MuiToggleButton-root": {
          px: 1.5,
          py: 0.5,
          fontWeight: "bold",
          fontSize: "0.75rem",
        },
      }}
    >
      <ToggleButton value="en">EN</ToggleButton>
      <ToggleButton value="it">IT</ToggleButton>
    </ToggleButtonGroup>
  );

  const authControl = isAuthenticated ? (
    <Button
      variant="outlined"
      color="error"
      size="small"
      startIcon={<LogoutIcon />}
      onClick={() => {
        logout();
        router.push(localizePath("/"));
      }}
    >
      {t.logout}
    </Button>
  ) : (
    <Button
      variant="contained"
      color="primary"
      size="small"
      startIcon={<LoginIcon />}
      component={Link}
      href={localizePath("/login")}
    >
      {t.login}
    </Button>
  );

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Toolbar sx={{ gap: 1 }}>
          <BusinessIcon color="primary" />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            {t.brandName}
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {navigationItems.map((item) => {
            const localizedHref = localizePath(item.href);
            const isActive = pathname === localizedHref;

            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  href={localizedHref}
                  onClick={() => setMobileOpen(false)}
                  selected={isActive}
                  sx={{
                    "&.Mui-selected": {
                      borderRight: `4px solid ${theme.palette.primary.main}`,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ color: isActive ? "primary.main" : "text.secondary" }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ color: isActive ? "primary.main" : "text.primary" }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box
        sx={{
          p: 2,
          display: { xs: "flex", sm: "none" },
          flexDirection: "column",
          gap: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyBox: "space-between",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {themeToggleButton}
          {languageSelector}
        </Box>
        {authControl}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", maxWidth: "100vw", color: "text.primary" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
          backgroundColor: "background.paper",
          color: "text.primary",
          backgroundImage: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: 600 }}
            >
              {t.overview}
            </Typography>

            {isPremiumLoading ? (
              <CircularProgress size={20} sx={{ ml: 2 }} />
            ) : isAuthenticated ? (
              <Chip
                label={t.premiumBadge}
                size="small"
                color="success"
                variant="outlined"
                sx={{ ml: 1 }}
              />
            ) : (
              <Chip
                label={t.publicBadge}
                size="small"
                color="default"
                variant="outlined"
                sx={{ ml: 1 }}
              />
            )}
          </Box>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            {languageSelector}
            {themeToggleButton}
            {authControl}
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          maxWidth: "100%",
          minWidth: 0,
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
