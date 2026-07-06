"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  Lock as LockIcon,
  AddCircle as AddIcon,
  RemoveCircle as RemoveIcon,
  FlashOn as EnergyIcon,
  Euro as EuroIcon,
  Co2 as Co2Icon,
} from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { useEnergy } from "@/hooks/useEnergy";

export default function TransitionsPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const {
    premiumPlants,
    activeManovers,
    publicData,
    isPremiumLoading,
    addManover,
    removeManover,
    t: globalDict,
  } = useEnergy();

  const lang = (params?.lang as string) || "en";
  const t = globalDict?.transitions;

  const getLocalizedRedirect = (path: string) => `/${lang}${path}`;

  if (!t) return null;

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 5,
            maxWidth: 500,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <LockIcon color="error" sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            {t.lockedTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {t.lockedDesc}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => router.push(getLocalizedRedirect("/login"))}
            fullWidth
            sx={{ fontWeight: 600 }}
          >
            {t.ctaLogin}
          </Button>
        </Paper>
      </Box>
    );
  }

  if (isPremiumLoading || !publicData) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          {t.loadingTelemetry}
        </Typography>
      </Box>
    );
  }

  const allowedManoversTemplates = [
    {
      title: "Install Rooftop Solar PV",
      plantId: "plant-01",
      reductionPercentage: 20,
      cost: 450000,
    },
    {
      title: "Electrification of Thermal Processes",
      plantId: "plant-02",
      reductionPercentage: 35,
      cost: 1800000,
    },
    {
      title: "Fleet Transition to EV Trucks",
      plantId: "plant-03",
      reductionPercentage: 40,
      cost: 650000,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, py: 2, color: "text.primary" }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
        >
          {t.title}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {t.subtitle}
        </Typography>
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        🎯 {t.activeTitle}{" "}
        <Chip label={activeManovers.length} size="small" color="primary" />
      </Typography>

      {activeManovers.length === 0 ? (
        <Alert severity="info" sx={{ mb: 5, borderRadius: 2 }}>
          {t.emptyActive}
        </Alert>
      ) : (
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {activeManovers.map((manover) => {
            const plant = premiumPlants.find((p) => p.id === manover.plantId);
            return (
              <Grid sx={{ xs: 12, md: 4 }} key={manover.id}>
                <Card
                  sx={{
                    borderLeft: "6px solid",
                    borderColor: "primary.main",
                    boxShadow: 2,
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {manover.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 2 }}
                    >
                      {t.plantLabel}:{" "}
                      <Box component="strong" sx={{ fontWeight: "bold" }}>
                        {plant ? plant.name : manover.plantId}
                      </Box>
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid
                        sx={{
                          xs: 6,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Co2Icon fontSize="small" color="primary" />
                        <Typography variant="body2">
                          -{manover.reductionPercentage}% CO₂
                        </Typography>
                      </Grid>
                      <Grid
                        sx={{
                          xs: 6,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <EuroIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          €{manover.cost.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      fullWidth
                      startIcon={<RemoveIcon />}
                      onClick={() => removeManover(manover.id)}
                    >
                      {t.btnRetract}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        💡 {t.availableTitle}
      </Typography>

      <Grid container spacing={3}>
        {allowedManoversTemplates.map((template, idx) => {
          const plant = premiumPlants.find((p) => p.id === template.plantId);
          const isAlreadyApplied = activeManovers.some(
            (m) => m.title === template.title,
          );

          return (
            <Grid sx={{ xs: 12, md: 4 }} key={idx}>
              <Card
                sx={{
                  opacity: isAlreadyApplied ? 0.6 : 1,
                  transition: "all 0.2s",
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    {template.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 2 }}
                  >
                    {t.plantLabel}:{" "}
                    <Box component="strong" sx={{ fontWeight: "bold" }}>
                      {plant ? plant.name : template.plantId}
                    </Box>
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                    <Chip
                      icon={<EnergyIcon />}
                      label={`-${template.reductionPercentage}%`}
                      size="small"
                      color="success"
                    />
                    <Chip
                      icon={<EuroIcon />}
                      label={`€${(template.cost / 1000).toFixed(0)}k`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isAlreadyApplied}
                    startIcon={<AddIcon />}
                    onClick={() => addManover(template)}
                  >
                    {isAlreadyApplied ? t.statusApplied : t.btnApply}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
