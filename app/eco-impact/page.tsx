"use client";

import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import {
  Forest as ForestIcon,
  Co2 as Co2Icon,
  LocalFireDepartment as FireIcon,
} from "@mui/icons-material";

export default function EcoImpactPage() {
  // Mock data for CO2 distribution by category
  const pieData = [
    { id: 0, value: 45, label: "Utilities (Gas/Elec)", color: "#d32f2f" },
    { id: 1, value: 30, label: "Food & Groceries", color: "#ed6c02" },
    { id: 2, value: 20, label: "Transport & Fuel", color: "#0288d1" },
    { id: 3, value: 5, label: "Leisure & Shopping", color: "#9c27b0" },
  ];

  // Environmental insight metrics
  const insights = [
    {
      title: "Trees Offset Equivalent",
      value: "6 Trees",
      subtext: "Required to absorb your monthly CO2",
      icon: <ForestIcon sx={{ fontSize: 40, color: "success.main" }} />,
    },
    {
      title: "Top Emission Source",
      value: "Utilities",
      subtext: "45% of your total carbon footprint",
      icon: <FireIcon sx={{ fontSize: 40, color: "error.main" }} />,
    },
  ];

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Environmental Eco Impact
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Detailed breakdown of your carbon footprint and sustainability
          metrics.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Insight Cards */}
        {insights.map((insight) => (
          <Grid size={{ xs: 12, md: 6 }} key={insight.title}>
            <Card
              sx={{
                height: "100%",
                border: "none",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
                <Box sx={{ mr: 3 }}>{insight.icon}</Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    {insight.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold", my: 0.5 }}>
                    {insight.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {insight.subtext}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Breakdown Chart */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card
            sx={{
              border: "none",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
              height: "100%",
            }}
          >
            <CardContent
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                CO2 Emissions by Category
              </Typography>

              {/* Responsive container: 
                On mobile (xs) it stacks vertically to fit small screens perfectly.
                On desktop (md) it aligns horizontally, keeping the chart and legend side-by-side.
              */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "center",
                  justifyContent: "center",
                  flexGrow: 1,
                  width: "100%",
                  gap: 3,
                }}
              >
                {/* Wrapper for the chart to handle dynamic scaling */}
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 240,
                    height: 240,
                    position: "relative",
                  }}
                >
                  <PieChart
                    series={[
                      {
                        data: pieData,
                        highlightScope: { fade: "global", highlight: "item" },
                        faded: {
                          innerRadius: 30,
                          additionalRadius: -30,
                          color: "gray",
                        },
                        innerRadius: 60,
                        outerRadius: 100,
                        paddingAngle: 2,
                        cornerRadius: 4,
                      },
                    ]}
                    margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    sx={{
                      "& .MuiChartsLegend-root": {
                        display: "none !important",
                      },
                    }}
                  />
                </Box>

                {/* Custom Flexbox Legend: 100% responsive and styled natively via HTML/CSS */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "row", md: "column" },
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 2,
                    maxWidth: { xs: "100%", md: 220 },
                  }}
                >
                  {pieData.map((item) => (
                    <Box
                      key={item.id}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: item.color,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          fontSize: 13,
                          color: "text.secondary",
                        }}
                      >
                        {item.label} ({item.value}%)
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sustainability Goals / Targets Progress */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card
            sx={{
              border: "none",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                Monthly Reduction Target
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Overall Reduction Goal
                  </Typography>
                  <Typography
                    variant="body2"
                    color="success.main"
                    sx={{ fontWeight: "bold" }}
                  >
                    75% Achieved
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "background.default",
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Co2Icon sx={{ color: "primary.main", mr: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Your carbon footprint is **12% lower** than the average user
                  in your area. Keep it up!
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
