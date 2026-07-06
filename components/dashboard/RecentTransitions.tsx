"use client";

import * as React from "react";
import { useParams } from "next/navigation";
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

const tableTranslations: Record<string, Record<string, string>> = {
  en: {
    sectionTitle: "Sandbox Active Projections Log",
    thTitle: "Strategy Blueprint",
    thPlant: "Target Asset",
    thReduction: "Mitigation Vol",
    thCost: "Financial Capital",
    thStatus: "Engine Type",
    emptyPublic:
      "Sign in with an enterprise profile to initialize structural sandbox adjustments.",
    emptyActive:
      "No simulations currently injected into the evaluation timeline.",
  },
  it: {
    sectionTitle: "Registro delle Proiezioni Attive Sandbox",
    thTitle: "Strategia Applicata",
    thPlant: "Asset Target",
    thReduction: "Volume Mitigazione",
    thCost: "Capitale Finanziario",
    thStatus: "Tipo Motore",
    emptyPublic:
      "Accedi con un profilo enterprise per inizializzare le manovre sandbox strutturali.",
    emptyActive:
      "Nessuna simulazione attualmente iniettata nella timeline di valutazione.",
  },
};

export default function RecentTransitions() {
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const { activeManovers, premiumPlants } = useEnergy();

  const lang = (params?.lang as string) || "en";
  const t = tableTranslations[lang] || tableTranslations.en;

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
              // Case A: User is unauthenticated (Feature Shielding Row placeholder)
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
              // Case B: Authenticated user but sandbox queue is empty
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
              // Case C: Map live active maneuvers logged at runtime
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
                        label="SANDBOX"
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
