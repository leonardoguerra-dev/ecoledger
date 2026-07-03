"use client";

import * as React from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import {
  AccountBalanceWallet as WalletIcon,
  Co2 as Co2Icon,
  Forest as ForestIcon,
  TrendingUp as TrendUpIcon,
  TrendingDown as TrendDownIcon,
} from "@mui/icons-material";

export default function Home() {
  // Enhanced mock data featuring semantic feedback configurations
  const stats = [
    {
      title: "Total Balance",
      value: "€ 2,450.80",
      subtext: "+4.3% from last month",
      icon: <WalletIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      trendIcon: <TrendUpIcon sx={{ fontSize: 16, mr: 0.5 }} />,
      trendColor: "success.main", // Positive financial growth
    },
    {
      title: "Carbon Footprint",
      value: "142 kg CO2e",
      subtext: "-12% reduction target",
      icon: <Co2Icon sx={{ fontSize: 40, color: "error.main" }} />,
      trendIcon: <TrendDownIcon sx={{ fontSize: 16, mr: 0.5 }} />,
      trendColor: "success.main", // Positive ecological reduction
    },
    {
      title: "Eco Score",
      value: "85 / 100",
      subtext: "Excellent green status",
      icon: <ForestIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
      trendIcon: <TrendUpIcon sx={{ fontSize: 16, mr: 0.5 }} />,
      trendColor: "success.main",
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Dashboard Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here is your environmental and financial sustainability
          overview.
        </Typography>
      </Box>

      {/* Responsive Grid using the modern type-safe 'size' property */}
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stat.title}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                      sx={{ fontWeight: 600, textTransform: "uppercase" }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: "bold", my: 0.5 }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 2 }}>{stat.icon}</Box>
                </Box>

                {/* Semantic feedback row combining trend icon and color */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: stat.trendColor,
                  }}
                >
                  {stat.trendIcon}
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {stat.subtext}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
