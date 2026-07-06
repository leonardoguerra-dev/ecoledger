"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Skeleton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  LockOutlined as LockIcon,
  TrendingUp as TrendIcon,
} from "@mui/icons-material";

import { useEnergy } from "@/hooks/useEnergy";
import { useAuth } from "@/hooks/useAuth";
import {
  calculateCarbonTax,
  calculateManoversImpact,
} from "@/utils/carbonCalculations";
import { BaselineChart } from "@/components/dashboard/BaselineChart";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import RecentTransitions from "@/components/dashboard/RecentTransitions";
import { getDictionary, DictionaryType } from "@/utils/getDictionaries";

export default function DashboardPage() {
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const {
    publicData,
    premiumPlants,
    activeManovers,
    isLoading,
    calculateSimulatedEmissions,
  } = useEnergy();

  const lang = (params?.lang as string) || "en";
  const [dict, setDict] = useState<DictionaryType | null>(null);

  useEffect(() => {
    getDictionary(lang).then((loadedDictionary) => {
      setDict(loadedDictionary);
    });
  }, [lang]);

  // Render skeletal loader mapped to Grid2 layout properties
  if (isLoading || !publicData || !dict) {
    return (
      <Box sx={{ py: 2 }}>
        <Skeleton variant="text" width="30%" height={40} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid size={{ xs: 12, md: 4 }} key={i}>
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  const t = dict.dashboard;

  const latestMonthData =
    publicData.monthlyHistory[publicData.monthlyHistory.length - 1];
  const simulatedEmissions = calculateSimulatedEmissions();
  const simulatedTax = calculateCarbonTax(
    simulatedEmissions,
    latestMonthData.limit,
    publicData.currentCarbonTaxRate,
  );

  const { totalInvestmentCost, taxSavings } = calculateManoversImpact(
    activeManovers,
    premiumPlants,
    publicData.currentCarbonTaxRate,
  );

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: 700, mb: 4, color: "text.primary" }}
      >
        {t.welcome}
      </Typography>

      {/* Core KPI Grid using Grid2 structure mapping */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 2,
              borderLeft: "6px solid",
              borderColor: "primary.main",
              boxShadow: 2,
            }}
          >
            <CardContent>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                {t.kpiEmissions}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {simulatedEmissions.toLocaleString()}{" "}
                <Box
                  component="span"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 400,
                    color: "text.secondary",
                  }}
                >
                  t/CO₂
                </Box>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 2,
              borderLeft: "6px solid",
              borderColor: "secondary.main",
              boxShadow: 2,
            }}
          >
            <CardContent>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                {t.kpiLimit}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {latestMonthData.limit.toLocaleString()}{" "}
                <Box
                  component="span"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 400,
                    color: "text.secondary",
                  }}
                >
                  t/CO₂
                </Box>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 2,
              borderLeft: "6px solid",
              borderColor: simulatedTax > 0 ? "error.main" : "success.main",
              boxShadow: 2,
            }}
          >
            <CardContent>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                {t.kpiTax}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mt: 1,
                  color: simulatedTax > 0 ? "error.main" : "success.main",
                }}
              >
                € {simulatedTax.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Simulation Layout Wrapper */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            sx={{
              p: 2,
              height: "100%",
              borderRadius: 2,
              boxShadow: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ height: "100%" }}>
              <BaselineChart
                chartData={publicData.monthlyHistory}
                simulatedLatestEmissions={simulatedEmissions}
                localization={{
                  title: t.chartTitle,
                  emissionsLabel: t.emissionsLabel,
                  limitLabel: t.limitLabel,
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 2,
              position: "relative",
              overflow: "hidden",
              boxShadow: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {t.sandboxTitle}
              </Typography>

              {isAuthenticated ? (
                <Box>
                  <Alert
                    severity="success"
                    icon={<TrendIcon />}
                    sx={{ mb: 2, borderRadius: 2 }}
                  >
                    {t.activeManoversLabel}:{" "}
                    <strong>{activeManovers.length}</strong>
                  </Alert>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {t.simulatedEmissionsLabel}:
                  </Typography>
                  <Typography
                    variant="h5"
                    color="primary.main"
                    sx={{ fontWeight: 700, mb: 2 }}
                  >
                    {simulatedEmissions.toLocaleString()} t/CO₂
                  </Typography>
                  {activeManovers.length > 0 && (
                    <Box
                      sx={{
                        pt: 1,
                        borderTop: "1px dashed",
                        borderColor: "divider",
                      }}
                    >
                      {/* Moving display to the sx prop and wrapping text nodes cleanly to satisfy TypeScript */}
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        {t.mitigationCost}:{" "}
                        <Box component="strong" sx={{ fontWeight: "bold" }}>
                          €{totalInvestmentCost.toLocaleString()}
                        </Box>
                      </Typography>

                      <Typography
                        variant="caption"
                        color="success.main"
                        sx={{ display: "block" }}
                      >
                        {t.avoidedFines}:{" "}
                        <Box component="strong" sx={{ fontWeight: "bold" }}>
                          €{taxSavings.toLocaleString()}
                        </Box>
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    mt: 3,
                    p: 3,
                    textAlign: "center",
                    borderRadius: 2,
                    backgroundColor: "action.hover",
                    border: "1px dashed",
                    borderColor: "primary.light",
                  }}
                >
                  <LockIcon color="primary" sx={{ fontSize: 40, mb: 1.5 }} />
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ mb: 3, fontWeight: 500 }}
                  >
                    {t.sandboxLockedDesc}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    href={`/${lang}/login`}
                    fullWidth
                    sx={{ fontWeight: 600 }}
                  >
                    {t.ctaLogin}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sub-analytics Component Layout Row */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <RecentTransitions />
        </Grid>
      </Grid>
    </Box>
  );
}
