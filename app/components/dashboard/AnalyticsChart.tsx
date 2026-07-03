"use client";

import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

export default function AnalyticsChart() {
  const [metric, setMetric] = React.useState<string>("cost");

  // Atemporal 12-Month Dataset comparing Baseline vs Simulated Scenario
  const fullDataset = [
    {
      month: "Jan",
      baselineCost: 45000,
      simCost: 42000,
      baselineCo2: 120,
      simCo2: 95,
    },
    {
      month: "Feb",
      baselineCost: 43000,
      simCost: 41000,
      baselineCo2: 115,
      simCo2: 90,
    },
    {
      month: "Mar",
      baselineCost: 40000,
      simCost: 36000,
      baselineCo2: 110,
      simCo2: 80,
    },
    {
      month: "Apr",
      baselineCost: 38000,
      simCost: 32000,
      baselineCo2: 100,
      simCo2: 70,
    },
    {
      month: "May",
      baselineCost: 35000,
      simCost: 28000,
      baselineCo2: 95,
      simCo2: 60,
    },
    {
      month: "Jun",
      baselineCost: 37000,
      simCost: 29000,
      baselineCo2: 98,
      simCo2: 62,
    },
    {
      month: "Jul",
      baselineCost: 39000,
      simCost: 31000,
      baselineCo2: 105,
      simCo2: 68,
    },
    {
      month: "Aug",
      baselineCost: 38000,
      simCost: 30000,
      baselineCo2: 102,
      simCo2: 65,
    },
    {
      month: "Sep",
      baselineCost: 36000,
      simCost: 29000,
      baselineCo2: 96,
      simCo2: 61,
    },
    {
      month: "Oct",
      baselineCost: 41000,
      simCost: 34000,
      baselineCo2: 112,
      simCo2: 78,
    },
    {
      month: "Nov",
      baselineCost: 44000,
      simCost: 38000,
      baselineCo2: 118,
      simCo2: 88,
    },
    {
      month: "Dec",
      baselineCost: 48000,
      simCost: 41000,
      baselineCo2: 125,
      simCo2: 92,
    },
  ];

  const handleMetricChange = (event: SelectChangeEvent) => {
    setMetric(event.target.value);
  };

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
            Transition Optimization Forecast (12-Month Cycle)
          </Typography>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={metric}
              onChange={handleMetricChange}
              displayEmpty
              inputProps={{ "aria-label": "Select Chart Metric" }}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="cost">Financial OPEX (€)</MenuItem>
              <MenuItem value="co2">Carbon Footprint (tCO2e)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Dynamic series mapping based on selected dropdown metric */}
        <Box sx={{ width: "100%", height: 350 }}>
          <BarChart
            dataset={fullDataset}
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
                      label: "Baseline Cost (€)",
                      color: "#78909c",
                    },
                    {
                      dataKey: "simCost",
                      label: "Simulated Scenario Cost (€)",
                      color: "#2e7d32",
                    },
                  ]
                : [
                    {
                      dataKey: "baselineCo2",
                      label: "Baseline CO2 (tCO2e)",
                      color: "#b0bec5",
                    },
                    {
                      dataKey: "simCo2",
                      label: "Simulated Scenario CO2 (tCO2e)",
                      color: "#e53935",
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
