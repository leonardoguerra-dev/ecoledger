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
import { euroFormatter } from "@/utils/currencyFormatter";
import { useEnergy } from "@/hooks/useEnergy";
import { useAuth } from "@/hooks/useAuth";

export default function RecentTransitions() {
  const { isAuthenticated } = useAuth();
  const { activeManovers, premiumPlants, t: globalDict } = useEnergy();

  const t = globalDict?.recentTransitions;

  if (!t) return null;

  return (
    <Box>
      <Typography
        variant="h6"
        component="h2"
        sx={{ fontWeight: "bold", mb: 2 }}
      >
        {t.sectionTitle}
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
              <TableCell sx={{ fontWeight: 600 }}>{t.thTitle}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{t.thPlant}</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                {t.thReduction}
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                {t.thCost}
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                {t.thStatus}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isAuthenticated ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ py: 3, color: "text.secondary", fontStyle: "italic" }}
                >
                  🔒 {t.emptyPublic}
                </TableCell>
              </TableRow>
            ) : activeManovers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ py: 3, color: "text.secondary" }}
                >
                  ℹ️ {t.emptyActive}
                </TableCell>
              </TableRow>
            ) : (
              activeManovers.map((row) => {
                const targetPlant = premiumPlants.find(
                  (p) => p.id === row.plantId,
                );
                return (
                  <TableRow hover key={row.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{row.title}</TableCell>
                    <TableCell
                      sx={{ color: "text.secondary", fontWeight: 500 }}
                    >
                      {targetPlant ? targetPlant.name : row.plantId}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: "bold", color: "primary.main" }}
                    >
                      -{row.reductionPercentage}% CO₂
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: "bold", color: "text.primary" }}
                    >
                      {euroFormatter.format(row.cost)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={t.badgeLabel}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: 10 }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
