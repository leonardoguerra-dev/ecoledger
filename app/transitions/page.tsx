"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { EnergyTransitionManeuver, NewManeuverInput } from "../types/energy";
import NewTransitionModal from "../components/transitions/NewTransitionModal";
import { euroFormatter } from "../utils/currencyFormatter";

export default function TransitionsPage() {
  const [modalOpen, setModalOpen] = React.useState(false);

  // Enterprise Seed State
  const [maneuvers, setManeuvers] = React.useState<EnergyTransitionManeuver[]>([
    {
      id: 1,
      date: "Month 07",
      branch: "Rome Plant",
      energySource: "Solar",
      mwhDelta: 450,
      costImpact: 12000,
      co2Saved: 85.5,
      status: "SIMULATION",
      description: "Photovoltaic roof expansion simulation",
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
      description: "HVAC efficiency system deployment",
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
      description: "PPA contract evaluation",
    },
  ]);

  // Filter States
  const [filterBranch, setFilterBranch] = React.useState<string>("ALL");
  const [filterSource, setFilterSource] = React.useState<string>("ALL");

  const handleSaveManeuver = (newManeuver: NewManeuverInput) => {
    const created: EnergyTransitionManeuver = {
      ...newManeuver,
      id: Date.now(),
    };
    setManeuvers([created, ...maneuvers]);
  };

  const handleDelete = (id: number) => {
    setManeuvers(maneuvers.filter((m) => m.id !== id));
  };

  const filteredManeuvers = maneuvers.filter((m) => {
    const matchBranch = filterBranch === "ALL" || m.branch === filterBranch;
    const matchSource =
      filterSource === "ALL" || m.energySource === filterSource;
    return matchBranch && matchSource;
  });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold" }}
            gutterBottom
          >
            Energy Transition Ledger
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and simulate asset shiftings across global nodes.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Propose Maneuver
        </Button>
      </Box>

      {/* Filter Toolbar Container */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              label="Filter by Location"
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              size="small"
            >
              <MenuItem value="ALL">All Enterprise Locations</MenuItem>
              <MenuItem value="Milan HQ">Milan HQ</MenuItem>
              <MenuItem value="Rome Plant">Rome Plant</MenuItem>
              <MenuItem value="Paris Facility">Paris Facility</MenuItem>
              <MenuItem value="Berlin Hub">Berlin Hub</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              label="Filter by Asset"
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              size="small"
            >
              <MenuItem value="ALL">All Energy Resources</MenuItem>
              <MenuItem value="Gas">Gas</MenuItem>
              <MenuItem value="Oil">Oil</MenuItem>
              <MenuItem value="Coal">Coal</MenuItem>
              <MenuItem value="Solar">Solar</MenuItem>
              <MenuItem value="Wind">Wind</MenuItem>
              <MenuItem value="Hydro">Hydro</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Ledger Table */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: "0px 2px 8px rgba(0,0,0,0.05)" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Timeline</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Branch</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Asset</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Justification</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                MWh Δ
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                OPEX Impact
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                CO2 Reduction
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Scope
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredManeuvers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  align="center"
                  sx={{ py: 4, color: "text.secondary" }}
                >
                  No maneuvers matched selected criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredManeuvers.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                    {row.date}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{row.branch}</TableCell>
                  <TableCell>{row.energySource}</TableCell>
                  <TableCell sx={{ maxWidth: 200, whiteSpace: "normal" }}>
                    {row.description}
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
                      color:
                        row.costImpact < 0 ? "success.main" : "text.primary",
                    }}
                  >
                    {row.costImpact < 0
                      ? `-${euroFormatter.format(Math.abs(row.costImpact))}`
                      : `+${euroFormatter.format(row.costImpact)}`}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "error.main" }}
                  >
                    {row.co2Saved} tCO2e
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.status}
                      size="small"
                      color={row.status === "ACTUAL" ? "success" : "warning"}
                      variant={row.status === "ACTUAL" ? "filled" : "outlined"}
                      sx={{ fontWeight: 600, fontSize: 10 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(row.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <NewTransitionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveManeuver}
      />
    </Box>
  );
}
