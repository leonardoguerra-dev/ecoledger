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
import { useEnergy } from "@/hooks/useEnergy";

interface NewTransitionModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NewTransitionModal({
  open,
  onClose,
}: NewTransitionModalProps) {
  const { premiumPlants, addManover, t: globalDict } = useEnergy();

  const t = globalDict?.newTransitionModal;

  const [title, setTitle] = React.useState("");
  const [plantId, setPlantId] = React.useState("");
  const [reductionPercentage, setReductionPercentage] = React.useState("");
  const [cost, setCost] = React.useState("");

  React.useEffect(() => {
    if (open && premiumPlants.length > 0 && !plantId) {
      const timeoutId = setTimeout(() => {
        setPlantId(premiumPlants[0].id);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [open, premiumPlants, plantId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addManover({
      title,
      plantId,
      reductionPercentage: Number(reductionPercentage),
      cost: Number(cost),
    });

    setTitle("");
    setPlantId("");
    setReductionPercentage("");
    setCost("");
    onClose();
  };

  if (!t) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>{t.title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid sx={{ xs: 12 }}>
              <TextField
                fullWidth
                label={t.maneuverTitle}
                placeholder={t.maneuverPlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Grid>

            <Grid sx={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label={t.plantLabel}
                value={plantId}
                onChange={(e) => setPlantId(e.target.value)}
                required
              >
                {premiumPlants.map((plant) => (
                  <MenuItem key={plant.id} value={plant.id}>
                    {plant.name} ({plant.location})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid sx={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={t.reductionLabel}
                type="number"
                placeholder={t.reductionPlaceholder}
                value={reductionPercentage}
                onChange={(e) => setReductionPercentage(e.target.value)}
                required
                slotProps={{
                  htmlInput: {
                    min: 1,
                    max: 100,
                  },
                }}
              />
            </Grid>

            <Grid sx={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={t.costLabel}
                type="number"
                placeholder={t.costPlaceholder}
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            {t.btnCancel}
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {t.btnCommit}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
