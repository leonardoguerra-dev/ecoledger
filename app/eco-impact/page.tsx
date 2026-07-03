"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { euroFormatter } from "../utils/currencyFormatter";

export default function EcoImpactPage() {
  // Global Enterprise Mix distribution data
  const energyMixData = [
    { id: 0, value: 35, label: "Solar", color: "#4caf50" },
    { id: 1, value: 25, label: "Gas", color: "#ff9800" },
    { id: 2, value: 15, label: "Wind", color: "#2196f3" },
    { id: 3, value: 15, label: "Oil", color: "#795548" },
    { id: 4, value: 5, label: "Hydro", color: "#00bcd4" },
    { id: 5, value: 5, label: "Coal", color: "#212121" },
  ];

  // Specific limits and thresholds per branch (Baseline limitations)
  const branchCompliance = [
    { name: "Milan HQ", currentCo2: 320, maxCap: 400, status: "Compliant" },
    {
      name: "Rome Plant",
      currentCo2: 680,
      maxCap: 600,
      status: "Critical Cap Violation",
    },
    {
      name: "Paris Facility",
      currentCo2: 150,
      maxCap: 300,
      status: "Compliant",
    },
    { name: "Berlin Hub", currentCo2: 270, maxCap: 350, status: "Compliant" },
  ];

  // Calculations for Carbon Taxation risks (Simulated €35 per ton overflow)
  const carbonTaxRate = 35;
  const totalViolationTons = branchCompliance
    .filter((b) => b.currentCo2 > b.maxCap)
    .reduce((acc, curr) => acc + (curr.currentCo2 - curr.maxCap), 0);

  const calculatedTaxRisk = totalViolationTons * carbonTaxRate;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold" }}
          gutterBottom
        >
          Eco-Impact & Asset Mix Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of renewable penetration, compliance statuses, and regulatory
          carbon taxation exposures.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Pie Chart: Energy Portfolio Distribution */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                Global Consumed Energy Mix (%)
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <PieChart
                  series={[
                    {
                      data: energyMixData,
                      innerRadius: 60,
                      outerRadius: 100,
                      paddingAngle: 2,
                      cornerRadius: 4,
                    },
                  ]}
                  height={260}
                  slotProps={{
                    legend: {
                      direction: "vertical",
                      position: { vertical: "middle", horizontal: "end" },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Carbon Tax Risk Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Carbon Credit & Regulation Exposure
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Based on current baseline overflows against regional emission
                caps.
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  POTENTIAL TAXATION PENALTY
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    color:
                      calculatedTaxRisk > 0 ? "error.main" : "success.main",
                    my: 1,
                  }}
                >
                  {euroFormatter.format(calculatedTaxRisk)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Calculated at €{carbonTaxRate}/tCO2e on{" "}
                  <strong>{totalViolationTons} tons</strong> exceeding
                  allowances.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Branch Carbon Budget Compliance List */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Regional Branch Cap Enforcement
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 3, boxShadow: "0px 2px 8px rgba(0,0,0,0.05)" }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Branch Node</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Emission Threshold Progress
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Current Level
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Regulatory Cap
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Compliance Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branchCompliance.map((branch) => {
                  const percentage = Math.min(
                    (branch.currentCo2 / branch.maxCap) * 100,
                    100,
                  );
                  const isViolated = branch.currentCo2 > branch.maxCap;

                  return (
                    <TableRow key={branch.name} hover>
                      <TableCell sx={{ fontWeight: 600, width: "20%" }}>
                        {branch.name}
                      </TableCell>
                      <TableCell sx={{ width: "40%" }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            color={
                              isViolated
                                ? "error"
                                : percentage > 80
                                  ? "warning"
                                  : "success"
                            }
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", minWidth: 45 }}
                          >
                            {Math.round(
                              (branch.currentCo2 / branch.maxCap) * 100,
                            )}
                            %
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 500 }}>
                        {branch.currentCo2} tCO2e
                      </TableCell>
                      <TableCell align="right" sx={{ color: "text.secondary" }}>
                        {branch.maxCap} tCO2e
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            display: "inline-block",
                            fontSize: 12,
                            fontWeight: "bold",
                            bgcolor: isViolated
                              ? "error.light"
                              : "success.light",
                            color: isViolated ? "error.dark" : "success.dark",
                          }}
                        >
                          {branch.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
