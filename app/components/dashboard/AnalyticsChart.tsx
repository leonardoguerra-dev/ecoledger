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
  const [timeRange, setTimeRange] = React.useState<string>("6");

  // Full mock dataset
  const fullDataset = [
    { month: "Jul 25", exp: 1400, co2: 190 },
    { month: "Aug 25", exp: 1100, co2: 150 },
    { month: "Sep 25", exp: 1650, co2: 175 },
    { month: "Oct 25", exp: 1300, co2: 160 },
    { month: "Nov 25", exp: 1750, co2: 205 },
    { month: "Dec 25", exp: 2200, co2: 290 },
    { month: "Jan 26", exp: 1200, co2: 180 },
    { month: "Feb 26", exp: 1900, co2: 220 },
    { month: "Mar 26", exp: 1500, co2: 140 },
    { month: "Apr 26", exp: 1800, co2: 210 },
    { month: "May 26", exp: 1400, co2: 130 },
    { month: "Jun 26", exp: 2100, co2: 245 },
  ];

  const handleRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  const getFilteredData = () => {
    const monthsToDisplay = parseInt(timeRange, 10);
    if (fullDataset.length <= monthsToDisplay) {
      return fullDataset;
    }
    return fullDataset.slice(-monthsToDisplay);
  };

  const filteredData = getFilteredData();

  return (
    <Card
      sx={{
        border: "none",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
        height: "100%",
      }}
    >
      <CardContent>
        {/* Header section with title and responsive filter control */}
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
            Monthly Overview
          </Typography>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={timeRange}
              onChange={handleRangeChange}
              displayEmpty
              inputProps={{ "aria-label": "Filter time range" }}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="3">Last 3 Months</MenuItem>
              <MenuItem value="6">Last 6 Months</MenuItem>
              <MenuItem value="12">Last 12 Months</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Chart container with fixed height */}
        <Box sx={{ width: "100%", height: 350 }}>
          <BarChart
            dataset={filteredData}
            xAxis={[
              {
                scaleType: "band",
                dataKey: "month",
                categoryGapRatio: 0.5, // Standard type-safe way to increase spacing between groups
                barGapRatio: 0.1, // Spacing between the bars inside the same group
              },
            ]}
            series={[
              { dataKey: "exp", label: "Expenses (€)", color: "#2e7d32" },
              { dataKey: "co2", label: "CO2 Impact (kg)", color: "#d32f2f" },
            ]}
            height={300}
            margin={{ top: 20, bottom: 40, left: 50, right: 20 }}
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
