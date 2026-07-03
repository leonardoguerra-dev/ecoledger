"use client";

import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import {
  EnergySource,
  BranchLocation,
  ManeuverStatus,
  NewManeuverInput,
} from "../../types/energy";

interface NewTransitionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (maneuver: NewManeuverInput) => void;
}

export default function NewTransitionModal({
  open,
  onClose,
  onSave,
}: NewTransitionModalProps) {
  const [date, setDate] = React.useState("Month 01");
  const [branch, setBranch] = React.useState<BranchLocation>("Milan HQ");
  const [energySource, setEnergySource] = React.useState<EnergySource>("Solar");
  const [mwhDelta, setMwhDelta] = React.useState("");
  const [costImpact, setCostImpact] = React.useState("");
  const [co2Saved, setCo2Saved] = React.useState("");
  const [status, setStatus] = React.useState<ManeuverStatus>("SIMULATION");
  const [description, setDescription] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date,
      branch,
      energySource,
      mwhDelta: Number(mwhDelta),
      costImpact: Number(costImpact),
      co2Saved: Number(co2Saved),
      status,
      description,
    });
    // Reset state
    setMwhDelta("");
    setCostImpact("");
    setCo2Saved("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Log Energy Mix Maneuver
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="Timeline / Month"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              >
                {Array.from({ length: 12 }).map((_, i) => {
                  const m = `Month ${String(i + 1).padStart(2, "0")}`;
                  return (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="Scenario Type"
                value={status}
                onChange={(e) => setStatus(e.target.value as ManeuverStatus)}
              >
                <MenuItem value="ACTUAL">ACTUAL (Structural Lock)</MenuItem>
                <MenuItem value="SIMULATION">
                  SIMULATION (Hypothetical)
                </MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="Enterprise Branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value as BranchLocation)}
              >
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
                label="Energy Asset / Source"
                value={energySource}
                onChange={(e) =>
                  setEnergySource(e.target.value as EnergySource)
                }
              >
                <MenuItem value="Gas">Gas</MenuItem>
                <MenuItem value="Oil">Oil</MenuItem>
                <MenuItem value="Coal">Coal</MenuItem>
                <MenuItem value="Solar">Solar</MenuItem>
                <MenuItem value="Wind">Wind</MenuItem>
                <MenuItem value="Hydro">Hydro</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="MWh Delta"
                type="number"
                placeholder="e.g. -200 or 500"
                value={mwhDelta}
                onChange={(e) => setMwhDelta(e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Cost Impact (€)"
                type="number"
                placeholder="Negative for savings"
                value={costImpact}
                onChange={(e) => setCostImpact(e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Carbon Saved (tCO2e)"
                type="number"
                value={co2Saved}
                onChange={(e) => setCo2Saved(e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Maneuver Justification / Description"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color={status === "ACTUAL" ? "success" : "primary"}
          >
            Commit Maneuver
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
