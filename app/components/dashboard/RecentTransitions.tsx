"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { euroFormatter } from "@/app/utils/currencyFormatter";

export default function RecentTransitions() {
  const recentManeuvers = [
    {
      id: 1,
      date: "Month 07",
      branch: "Rome Plant",
      energySource: "Solar",
      mwhDelta: 450,
      costImpact: 12000,
      co2Saved: 85.5,
      status: "SIMULATION",
    },
    {
      id: 2,
      date: "Month 07",
      branch: "Milan HQ",
      energySource: "Gas",
      mwhDelta: -200,
      costImpact: -8500,
      co2Saved: 42.0,
      status: "ACTUAL",
    },
    {
      id: 3,
      date: "Month 06",
      branch: "Berlin Hub",
      energySource: "Wind",
      mwhDelta: 600,
      costImpact: 18500,
      co2Saved: 124.0,
      status: "SIMULATION",
    },
    {
      id: 4,
      date: "Month 05",
      branch: "Paris Facility",
      energySource: "Coal",
      mwhDelta: -800,
      costImpact: -32000,
      co2Saved: 280.0,
      status: "ACTUAL",
    },
  ];

  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        sx={{ fontWeight: "bold", mb: 2 }}
      >
        Recent Energy Mix Adjustments
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          border: "none",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
          borderRadius: 3,
          overflowX: "auto",
        }}
      >
        <Table aria-label="recent adjustments log table" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Timeline</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Branch</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Resource</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                MWh Delta
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Financial Impact
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                CO2 Saved
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Type
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentManeuvers.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                  {row.date}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{row.branch}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {row.energySource}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: "bold",
                    color: row.mwhDelta > 0 ? "success.main" : "error.main",
                  }}
                >
                  {row.mwhDelta > 0 ? `+${row.mwhDelta}` : row.mwhDelta} MWh
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: "bold",
                    color: row.costImpact < 0 ? "success.main" : "text.primary",
                  }}
                >
                  {row.costImpact < 0
                    ? `-${euroFormatter.format(Math.abs(row.costImpact))}`
                    : `+${euroFormatter.format(row.costImpact)}`}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 500, color: "error.main" }}
                >
                  {row.co2Saved} tCO2e
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={row.status}
                    size="small"
                    color={row.status === "ACTUAL" ? "success" : "warning"}
                    variant={row.status === "ACTUAL" ? "filled" : "outlined"}
                    sx={{ fontWeight: 600, fontSize: 11 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
