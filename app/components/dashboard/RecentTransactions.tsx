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
import { formatTransactionDate } from "../../utils/dateFormatter";

export default function RecentTransactions() {
  // Dynamically generated mock dates based on current execution time
  const getRelativeIsoDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split("T")[0];
  };

  const recentTransactions = [
    {
      id: 1,
      date: getRelativeIsoDate(0),
      description: "Grocery Store Purchase",
      category: "Food",
      amount: -65.4,
      co2: 12.4,
    },
    {
      id: 2,
      date: getRelativeIsoDate(1),
      description: "Monthly Train Pass",
      category: "Transport",
      amount: -45.0,
      co2: 1.2,
    },
    {
      id: 3,
      date: getRelativeIsoDate(3),
      description: "Freelance Design Payment",
      category: "Income",
      amount: 850.0,
      co2: 0.0,
    },
    {
      id: 4,
      date: getRelativeIsoDate(5),
      description: "Electric Utility Bill",
      category: "Utilities",
      amount: -82.1,
      co2: 24.5,
    },
  ];

  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        sx={{ fontWeight: "bold", mb: 2 }}
      >
        Recent Transactions
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
        <Table aria-label="recent transactions table" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Amount
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                CO2 Impact
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentTransactions.map((tx) => (
              <TableRow
                key={tx.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                  {formatTransactionDate(tx.date)}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{tx.description}</TableCell>
                <TableCell>
                  <Chip
                    label={tx.category}
                    size="small"
                    color={tx.category === "Income" ? "success" : "default"}
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: "bold",
                    color: tx.amount > 0 ? "success.main" : "text.primary",
                  }}
                >
                  {tx.amount > 0
                    ? `+€ ${tx.amount.toFixed(2)}`
                    : `-€ ${Math.abs(tx.amount).toFixed(2)}`}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 500,
                    color: tx.co2 > 15 ? "error.main" : "text.secondary",
                  }}
                >
                  {tx.co2 > 0 ? `${tx.co2} kg` : "0 kg"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
