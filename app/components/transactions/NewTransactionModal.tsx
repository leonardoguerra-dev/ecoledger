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
  Box,
} from "@mui/material";
import { NewTransactionInput } from "../../types/transaction";

interface NewTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (transaction: NewTransactionInput) => void;
}

export default function NewTransactionModal({
  open,
  onClose,
  onSave,
}: NewTransactionModalProps) {
  const [formData, setFormData] = React.useState<NewTransactionInput>({
    description: "",
    category: "Food",
    amount: 0,
    co2: 0,
    date: new Date().toISOString().split("T")[0],
  });

  // Safe handlers for inputs using specific string/number mapping
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : parseFloat(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    onSave(formData);

    setFormData({
      description: "",
      category: "Food",
      amount: 0,
      co2: 0,
      date: new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>Add New Transaction</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                required
                value={formData.description}
                onChange={handleTextChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="amount"
                label="Amount (€)"
                type="number"
                fullWidth
                required
                value={formData.amount || ""}
                onChange={handleNumberChange}
                helperText="Use negative numbers for expenses"
                slotProps={{
                  htmlInput: { step: "0.01" },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="co2"
                label="CO2 Impact (kg)"
                type="number"
                fullWidth
                value={formData.co2 || ""}
                onChange={handleNumberChange}
                slotProps={{
                  htmlInput: { step: "0.1", min: "0" },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="category"
                label="Category"
                select
                fullWidth
                value={formData.category}
                onChange={handleTextChange}
              >
                {["Food", "Transport", "Utilities", "Income", "Leisure"].map(
                  (cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ),
                )}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="date"
                label="Date"
                type="date"
                fullWidth
                required
                value={formData.date}
                onChange={handleTextChange}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save Transaction
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
