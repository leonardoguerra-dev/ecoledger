"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { IndustrialPlant } from "@/types/energy";
import { useEnergy } from "@/hooks/useEnergy"; // Import the core context hook

interface PlantEditModalProps {
  open: boolean;
  plant: IndustrialPlant | null;
  onClose: () => void;
  onSave: (plantId: string, emissions: number) => void;
}

export default function PlantEditModal({
  open,
  plant,
  onClose,
  onSave,
}: PlantEditModalProps) {
  const { t: globalDict } = useEnergy(); // Consume translations directly from the global system pipeline
  const [emissions, setEmissions] = useState<number>(
    plant ? plant.currentEmissions : 0,
  );

  const handleSave = () => {
    if (plant) {
      onSave(plant.id, emissions);
      onClose();
    }
  };

  if (!plant || !globalDict) return null;

  const t = globalDict.ecoImpact;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {t.modalTitle
          ? t.modalTitle.replace("{name}", plant.name)
          : `Update Telemetry: ${plant.name}`}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {t.thSector || "Sector"}: <strong>{plant.sector}</strong> |{" "}
            {t.thLocation || "Location"}: <strong>{plant.location}</strong>
          </Typography>

          <TextField
            label={t.labelEmissions || "Current Emissions (t/CO2)"}
            type="number"
            fullWidth
            value={emissions}
            onChange={(e) => setEmissions(Number(e.target.value))}
            slotProps={{
              input: { inputProps: { min: 0 } },
              inputLabel: { shrink: true },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          {t.btnCancel || "Cancel"}
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {t.btnSave || "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
