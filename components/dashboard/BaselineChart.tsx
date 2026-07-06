"use client";

import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { MonthlyBaselineEmissions } from "@/types/energy";

interface BaselineChartProps {
  chartData: MonthlyBaselineEmissions[];
  simulatedLatestEmissions: number;
  localization: {
    title: string;
    emissionsLabel: string;
    limitLabel: string;
  };
}

/**
 * Enterprise Predictive Trend Chart built on top of @mui/x-charts.
 * Compares historical monthly emissions against regulatory caps and reflects sandbox mitigations in real-time.
 */
export const BaselineChart: React.FC<BaselineChartProps> = ({
  chartData,
  simulatedLatestEmissions,
  localization,
}) => {
  const theme = useTheme();

  // Responsive layout adaptation hooks
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Prepare and inject the simulated dynamic runtime data into the dataset array
  const processedData = chartData.map((item, index) => {
    // If we are evaluating the final/latest month in the historical array, apply runtime mitigation variables
    if (index === chartData.length - 1) {
      return {
        ...item,
        emissions: simulatedLatestEmissions, // Overwrites with real-time reactive sandbox context state
      };
    }
    return item;
  });

  // Extract axis series vectors
  const months = processedData.map((d) => d.month);
  const emissionsSeries = processedData.map((d) => d.emissions);
  const limitSeries = processedData.map((d) => d.limit);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, px: 1 }}>
        {localization.title}
      </Typography>

      <Box sx={{ width: "100%", flexGrow: 1, minHeight: 300 }}>
        <LineChart
          xAxis={[
            {
              data: months,
              scaleType: "point",
              tickLabelStyle: {
                fill: theme.palette.text.secondary,
                fontSize: 12,
              },
            },
          ]}
          yAxis={[
            {
              tickLabelStyle: {
                fill: theme.palette.text.secondary,
                fontSize: 12,
              },
            },
          ]}
          series={[
            {
              data: emissionsSeries,
              label: localization.emissionsLabel,
              color: theme.palette.primary.main,
              curve: "linear",
            },
            {
              data: limitSeries,
              label: localization.limitLabel,
              color: theme.palette.error.main,
              curve: "linear",
            },
          ]}
          slotProps={{
            legend: {
              direction: "horizontal",
              position: { vertical: "top", horizontal: "center" },
              sx: {
                padding: isMobile ? 0 : 10,
                labelStyle: {
                  fill: theme.palette.text.primary,
                  fontSize: 13,
                  fontWeight: 500,
                },
              },
            },
          }}
          margin={{ top: 50, right: 20, bottom: 30, left: 50 }}
        />
      </Box>
    </Box>
  );
};
