"use client";

import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import {
  Factory as FactoryIcon,
  Co2 as Co2Icon,
  ElectricBolt as BoltIcon,
  TrendingUp as TrendUpIcon,
  TrendingDown as TrendDownIcon,
} from "@mui/icons-material";
import AnalyticsChart from "./components/dashboard/AnalyticsChart";
import RecentTransitions from "./components/dashboard/RecentTransitions";

export default function Home() {
  // KPI Metrics matching enterprise energy orchestration
  const stats = [
    {
      title: "Total Energy OPEX",
      value: "€ 452,800",
      subtext: "-2.4% vs initial baseline",
      icon: <BoltIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      trendIcon: <TrendDownIcon sx={{ fontSize: 16, mr: 0.5 }} />,
      trendColor: "success.main", // Lower cost is good
    },
    {
      title: "Carbon Reduction",
      value: "1,420 tCO2e",
      subtext: "14.2% closer to Net-Zero target",
      icon: <Co2Icon sx={{ fontSize: 40, color: "error.main" }} />,
      trendIcon: <TrendUpIcon sx={{ fontSize: 16, mr: 0.5 }} />,
      trendColor: "success.main",
    },
    {
      title: "Clean Energy Share",
      value: "42.5 %",
      subtext: "+5.1% transition rate",
      icon: <FactoryIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
      trendIcon: <TrendUpIcon sx={{ fontSize: 16, mr: 0.5 }} />,
      trendColor: "success.main",
    },
  ];

  return (
    <Box>
      {/* Dashboard Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Corporate Sustainability Cockpit
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Scenario Planning and Decarbonization Portfolio Strategy for all
          enterprise branches.
        </Typography>
      </Box>

      {/* Main Dashboard Layout Container */}
      <Grid container spacing={4}>
        {/* KPI Summary Cards */}
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

        {/* Analytics Chart Block (Baseline vs Simulation) */}
        <Grid size={{ xs: 12 }}>
          <AnalyticsChart />
        </Grid>

        {/* Recent Transitions Log Table Block */}
        <Grid size={{ xs: 12 }}>
          <RecentTransitions />
        </Grid>
      </Grid>
    </Box>
  );
}
