"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Paper,
} from "@mui/material";
import { LockOutlined as LockIcon } from "@mui/icons-material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEnergy } from "@/hooks/useEnergy";
import { useAuth } from "@/hooks/useAuth";
import { calculateManoversImpact } from "@/utils/carbonCalculations";

// Minimal localization dictionary for the analytical chart module
const chartTranslations: Record<string, Record<string, string>> = {
  en: {
    title: "Transition Optimization Forecast (12-Month Cycle)",
    metricCost: "Financial OPEX (€)",
    metricCo2: "Carbon Footprint (tCO2e)",
    labelBaseCost: "Baseline Cost (€)",
    labelSimCost: "Simulated Scenario Cost (€)",
    labelBaseCo2: "Baseline CO2 (tCO2e)",
    labelSimCo2: "Simulated Scenario CO2 (tCO2e)",
    lockedTitle: "Enterprise Analytics Locked",
    lockedDesc:
      "Authentication required to generate real-time multi-metric baseline comparisons.",
    ctaLogin: "Unlock Full Forecast",
  },
  it: {
    title: "Previsione di Ottimizzazione della Transizione (Ciclo 12 Mesi)",
    metricCost: "OPEX Finanziario (€)",
    metricCo2: "Impronta di Carbonio (tCO2e)",
    labelBaseCost: "Costo Baseline (€)",
    labelSimCost: "Costo Scenario Simulato (€)",
    labelBaseCo2: "CO2 Baseline (tCO2e)",
    labelSimCo2: "CO2 Scenario Simulato (tCO2e)",
    lockedTitle: "Analisi Enterprise Bloccate",
    lockedDesc:
      "Autenticazione richiesta per generare comparazioni multi-metrica in tempo reale.",
    ctaLogin: "Sblocca Previsioni Complete",
  },
};

export default function AnalyticsChart() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const { publicData, premiumPlants, activeManovers } = useEnergy();

  const lang = (params?.lang as string) || "en";
  const t = chartTranslations[lang] || chartTranslations.en;

  const [metric, setMetric] = React.useState<string>("cost");

  const handleMetricChange = (event: SelectChangeEvent) => {
    setMetric(event.target.value);
  };

  // 1. Feature Shielding Guard: Return an elegant placeholder card if user is public
  if (!isAuthenticated || !publicData) {
    return (
      <Card
        sx={{
          border: "none",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
          height: "100%",
          position: "relative",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 400,
          }}
        >
          <Box sx={{ p: 3, textAlign: "center", maxWidth: 380 }}>
            <LockIcon color="primary" sx={{ fontSize: 42, mb: 1.5 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {t.lockedTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t.lockedDesc}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => router.push(`/${lang}/login`)}
              fullWidth
            >
              {t.ctaLogin}
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // 2. Dynamic Dataset Generation using live Context telemetry parameters
  const { totalCo2Reduced, taxSavings } = calculateManoversImpact(
    activeManovers,
    premiumPlants,
    publicData.currentCarbonTaxRate,
  );

  // Distribute the cumulative real-time reductions across the historical data sequence
  const dynamicDataset = publicData.monthlyHistory.map((item, index) => {
    const isLatestMonth = index === publicData.monthlyHistory.length - 1;

    // Default mock calculation values for operational financial parameters
    const baseCost = item.emissions * 12; // Base baseline structural energy OPEX multiplier

    // Dynamic runtime scenario adjustments injection
    const simulatedEmissions = isLatestMonth
      ? Math.max(0, item.emissions - totalCo2Reduced)
      : item.emissions;
    const simulatedCost = isLatestMonth
      ? Math.max(0, baseCost - totalCo2Reduced * 8 - taxSavings)
      : baseCost;

    return {
      month: item.month,
      baselineCost: baseCost,
      simCost: simulatedCost,
      baselineCo2: item.emissions,
      simCo2: simulatedEmissions,
    };
  });

  return (
    <Card
      sx={{
        border: "none",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
        height: "100%",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
            {t.title}
          </Typography>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={metric}
              onChange={handleMetricChange}
              displayEmpty
              inputProps={{ "aria-label": "Select Chart Metric" }}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="cost">{t.metricCost}</MenuItem>
              <MenuItem value="co2">{t.metricCo2}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ width: "100%", height: 350 }}>
          <BarChart
            dataset={dynamicDataset}
            xAxis={[
              {
                scaleType: "band",
                dataKey: "month",
                categoryGapRatio: 0.4,
                barGapRatio: 0.1,
              },
            ]}
            series={
              metric === "cost"
                ? [
                    {
                      dataKey: "baselineCost",
                      label: t.labelBaseCost,
                      color: "#78909c",
                    },
                    {
                      dataKey: "simCost",
                      label: t.labelSimCost,
                      color: "#1b5e20", // Coherent with EcoLedger primary corporate brand palette
                    },
                  ]
                : [
                    {
                      dataKey: "baselineCo2",
                      label: t.labelBaseCo2,
                      color: "#b0bec5",
                    },
                    {
                      dataKey: "simCo2",
                      label: t.labelSimCo2,
                      color: "#26a69a", // Secondary corporate brand asset palette color mapping
                    },
                  ]
            }
            height={300}
            margin={{ top: 20, bottom: 40, left: 65, right: 20 }}
            slotProps={{
              legend: {
                direction: "horizontal",
                position: { vertical: "bottom", horizontal: "center" },
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
