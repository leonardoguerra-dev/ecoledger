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
} from "@mui/material";
import { LockOutlined as LockIcon } from "@mui/icons-material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEnergy } from "@/hooks/useEnergy";
import { useAuth } from "@/hooks/useAuth";
import { calculateManoversImpact } from "@/utils/carbonCalculations";

export default function AnalyticsChart() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const {
    publicData,
    premiumPlants,
    activeManovers,
    t: globalDict,
  } = useEnergy();

  const lang = (params?.lang as string) || "en";
  const [metric, setMetric] = React.useState<string>("cost");

  // Fallback shielding if global dictionary block isn't fully loaded by the provider context yet
  if (!globalDict) return null;
  const t = globalDict.analyticsChart;

  const handleMetricChange = (event: SelectChangeEvent) => {
    setMetric(event.target.value);
  };

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

  const { totalCo2Reduced, taxSavings } = calculateManoversImpact(
    activeManovers,
    premiumPlants,
    publicData.currentCarbonTaxRate,
  );

  const dynamicDataset = publicData.monthlyHistory.map((item, index) => {
    const isLatestMonth = index === publicData.monthlyHistory.length - 1;
    const baseCost = item.emissions * 12;

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
                      color: "#1b5e20",
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
                      color: "#26a69a",
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
